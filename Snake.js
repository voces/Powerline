
import Doodad from "./node_modules/webcraft/src/entities/Doodad.js";
import { BoxBufferGeometry, MeshPhongMaterial, Mesh } from "./node_modules/three/build/three.module.js";
import List from "./List.js";

class Snake extends Doodad {

	static get properties() {

		return super.properties( "direction", "length", "speed", "tail", "queue" );

	}

	static get defaultData() {

		return {
			...super.defaultData,
			model: {
				object3D: new Mesh( new BoxBufferGeometry( 1, 1, 1 ), new MeshPhongMaterial( { color: 0xffffff } ) )
			},
			length: 10,
			speed: 1,
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
