
import System from "./node_modules/knack-ecs/src/System.js";
import { randomInt } from "./node_modules/webcraft/src/util.js";
import Snake from "./Snake.js";
import Wall from "./Wall.js";

export default class SnakeMovement extends System {

	constructor() {

		super();

		this.addEventListener( "entityadded", this.onEntityAdded.bind( this ) );

	}

	test( entity ) {

		return entity instanceof Snake;

	}

	onEntityAdded( { entity: snake } ) {

		snake.direction = [ "up", "down", "left", "right" ][ randomInt( this.random(), 4 ) ];

	}

	update( snake ) {

		// Create a new tail if needed
		if ( snake.tail.length < snake.length )
			snake.tail.push( snake.app.addEntity( new Wall( { x: snake.x, y: snake.y } ) ) );

		// Else move end to front
		else {

			const wall = snake.tail.shift();
			wall.update( { x: snake.x, y: snake.y } );
			snake.tail.push( wall );

		}

		// Change directions
		if ( snake.queue.length )
			snake.direction = snake.queue.shift();

		// TODO: Pull food in and consume it

		// Calculate new position
		const pos = { x: snake.x, y: snake.y };
		switch ( snake.direction ) {

			case "up": pos.y += snake.speed; break;
			case "down": pos.y -= snake.speed; break;
			case "left": pos.x -= snake.speed; break;
			case "right": pos.x += snake.speed; break;

		}

		// Remove if out of bounds
		if ( pos.x <= - 50 || pos.x >= 50 ||
			pos.y <= - 50 || pos.y >= 50 )

			return snake.remove();

		// Move the snake head
		if ( [ "up", "down" ].includes( snake.direction ) ) snake.y = pos.y;
		else snake.x = pos.x;

	}

	render( snake, elapsed ) {

		// const distance = elapsed / 100;

		// // console.log( "SnakeMovement#update", this.app.update.last, snake.x, snake.y );
		// switch ( snake.direction ) {

		// 	case "up": return snake.model.update( { y: snake.model.y + distance } );
		// 	case "down": return snake.model.update( { y: snake.model.y - distance } );
		// 	case "left": return snake.model.update( { x: snake.model.x - distance } );
		// 	case "right": return snake.model.update( { x: snake.model.x + distance } );

		// }

	}

}
