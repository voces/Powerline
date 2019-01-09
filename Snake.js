
import Unit from "./node_modules/webcraft/src/entities/Unit.js";
import { SphereBufferGeometry, MeshPhongMaterial, Mesh } from "./node_modules/three/build/three.module.js";
import List from "./List.js";

class Snake extends Unit {

	static get properties() {

		return super.properties( "direction", "length", "speed", "tail", "queue" );

	}

	static get defaultData() {

		return {
			...super.defaultData,
			model: { object3D: new Mesh(
				new SphereBufferGeometry( 0.6 ),
				new MeshPhongMaterial( { color: 0xffffff } )
			) },
			length: 50,
			speed: 0.25,
			tail: new List(),
			queue: new List()
		};

	}

	onUpdatedAlive() {

		if ( this.alive ) return;

		console.log( "kill!" );
		for ( const block of this.tail ) {

			console.log( block, this.distanceTo( block ) );
			block.kill();

		}

	}

}

export default Snake;
