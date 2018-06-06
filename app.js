
import EventDispatcher from "./node_modules/wc-eventdispatcher/src/EventDispatcher.js";
import App from "./node_modules/webcraft/src/App.js";
import { load } from "./node_modules/webcraft/src/util.js";

// TODO: I should, ideally, not do this...
load.relative = import.meta.url.slice( 0, import.meta.url.lastIndexOf( "/" ) ).replace( "file:", "" );

load( "./package.json" ).then( file => {

	const meta = JSON.parse( file );
	Object.assign( Powerline, { meta } );
	Powerline.dispatchEvent( "meta", meta );

} );

export default class Powerline extends App {

	constructor() {

		super();

		this.addEventListener( "onJoin", e => console.log( "fromGAME!~!", "onJoin", e ) );

	}

}

const ed = new EventDispatcher();
Object.assign( Powerline, {
	addEventListener: ed.addEventListener,
	hasEventListener: ed.hasEventListener,
	removeEventListener: ed.removeEventListener,
	dispatchEvent: ed.dispatchEvent
} );
