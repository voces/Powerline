
import WCPlayer from "./node_modules/webcraft/src/entities/Player.js";

const dict = {};

export default class Player extends WCPlayer {

	static get properties() {

		return super.properties( "snake" );

	}

	static fromAccount( account ) {

		return dict[ account ];

	}

	constructor( props ) {

		super( props );
		Object.seal( this );

		dict[ this.account ] = this;

	}

}
