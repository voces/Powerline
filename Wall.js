
import Doodad from "./node_modules/webcraft/src/entities/Doodad.js";
import { BoxBufferGeometry, MeshPhongMaterial, Mesh } from "./node_modules/three/build/three.module.js";

class Wall extends Doodad {

	static get defaultData() {

		return { model: { object3D: new Mesh(
			new BoxBufferGeometry( 1, 1, 1 ),
			new MeshPhongMaterial( { color: 0x05ffff } )
		) } };

	}

}

export default Wall;
