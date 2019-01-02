
import Doodad from "./node_modules/webcraft/src/entities/Doodad.js";
import { SphereBufferGeometry, MeshPhongMaterial, Mesh } from "./node_modules/three/build/three.module.js";
import List from "./List.js";

class Snake extends Doodad {

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

	constructor( ...props ) {

		super( ...props );
		Object.seal( this );

	}

}

export default Snake;
