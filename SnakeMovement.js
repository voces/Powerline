
import System from "./node_modules/knack-ecs/src/System.js";
import { randomInt } from "./node_modules/webcraft/src/util.js";
import Snake from "./Snake.js";
import Block from "./Block.js";

export default class SnakeMovement extends System {

	test( entity ) {

		return entity instanceof Snake;

	}

	onEntityAdded( { entity: snake } ) {

		snake.direction = [ "up", "down", "left", "right" ][ randomInt( this.random(), 4 ) ];

	}

	update( snake ) {

		// Create a new tail if needed
		if ( snake.tail.length < snake.length )
			snake.tail.push( snake.app.addEntity( new Block( { x: snake.x, y: snake.y } ) ) );

		// Else move end to front
		else {

			const block = snake.tail.shift();
			block.update( { x: snake.x, y: snake.y } );
			snake.tail.push( block );

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

	// render( snake, elapsed ) {

	// 	const distance = snake.speed * elapsed / 100;
	// 	// console.log( "SnakeMovement#update", this.app.update.last, snake.x, snake.y );
	// 	switch ( snake.direction ) {

	// 		// case "up": return snake.model.y += distance;
	// 		// case "down": return snake.model.y -= distance;
	// 		case "left": return snake.model.x -= distance;
	// 		case "right": return snake.model.x += distance;

	// 	}

	// }

}
