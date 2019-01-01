
import alea from "./lib/alea.js";
import EventDispatcher from "./node_modules/wc-eventdispatcher/src/EventDispatcher.js";
import IOPlayerColors from "./node_modules/webcraft/src/systems/players/IOPlayerColors.js";
import Graphic from "./node_modules/webcraft/src/systems/Graphic.js";
import App from "./node_modules/webcraft/src/App.js";
import { load, randomInt } from "./node_modules/webcraft/src/util.js";
import Keyboard from "./node_modules/webcraft/src/actions/Keyboard.js";
import Wall from "./Wall.js";
import Snake from "./Snake.js";
import SnakeMovement from "./SnakeMovement.js";
import Player from "./Player.js";

// TODO: I should, ideally, not do this...
load.relative = import.meta.url.slice( 0, import.meta.url.lastIndexOf( "/" ) ).replace( "file:", "" );

load( "./package.json" ).then( file => {

	const meta = JSON.parse( file );
	Object.assign( Powerline, { meta } );
	Powerline.dispatchEvent( "meta", meta );

} );

const DIRECTIONS = [ "up", "left", "down", "right" ];
const opposite = dir => DIRECTIONS[ ( DIRECTIONS.indexOf( dir ) + 2 ) % 4 ];

export default class Powerline extends App {

	static get Player() {

		return Player;

	}

	constructor( props ) {

		super( { ...props, updateFrequency: 100 } );

		this.addSystem( new Graphic( { camera: 150 } ) );
		this.addSystem( new IOPlayerColors() );
		this.addSystem( new SnakeMovement() );

		new Keyboard( {
			app: this,
			keys: [ "ArrowLeft", "ArrowUp", "ArrowRight", "ArrowDown" ]
		} );

		for ( let x = - 50; x <= 50; x ++ ) {

			this.addEntity( new Wall( { x, y: - 50 } ) );
			this.addEntity( new Wall( { x, y: 50 } ) );

		}

		for ( let y = - 49; y <= 49; y ++ ) {

			this.addEntity( new Wall( { x: - 50, y } ) );
			this.addEntity( new Wall( { x: 50, y } ) );

		}

	}

	onJoin( e ) {

		super.onJoin( e );
		console.log( "Powerline#onJoin", this.seed );
		const player = new Player( { account: e.account } );
		this.addEntity( player );

		player.snake = this.addEntity( new Snake( {
			x: randomInt( this.random(), 50, - 50 ),
			y: randomInt( this.random(), 50, - 50 )
		} ) );

	}

	onLeave( e ) {

		console.log( "TODO: onLeave", e );

	}

	onKeyDown( { account, key } ) {

		const player = Player.fromAccount( account );
		const direction = key.slice( 5 ).toLowerCase();

		// Ignore such events when no snake
		if ( ! player.snake ) return;

		// Don't queue same direction or allow direct turns into self
		const prevDirection = player.snake.queue.tail || player.snake.direction;
		if ( [ prevDirection, opposite( prevDirection ) ].includes( direction ) ) return;

		player.snake.queue.push( direction );

	}

}

const ed = new EventDispatcher();
Object.assign( Powerline, {
	addEventListener: ed.addEventListener,
	hasEventListener: ed.hasEventListener,
	removeEventListener: ed.removeEventListener,
	dispatchEvent: ed.dispatchEvent
} );
