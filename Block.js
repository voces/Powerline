
import Unit from "./node_modules/webcraft/src/entities/Unit.js";
import { SphereBufferGeometry, MeshPhongMaterial, Mesh } from "./node_modules/three/build/three.module.js";

export default class Block extends Unit {

	static get defaultData() {

		return { model: { object3D: new Mesh(
			new SphereBufferGeometry( 0.5 ),
			new MeshPhongMaterial( { color: 0x05ffff } )
		) } };

	}

}
