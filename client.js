
import { bind, Component, wire } from "./node_modules/hyperhtml/esm/index.js";
import EventDispatcher from "./node_modules/wc-eventdispatcher/src/EventDispatcher.js";
import Powerline from "./app.js";

class SimpleWebSocket extends EventDispatcher {

	constructor( props ) {

		super();

		if ( typeof props === "object" ) Object.assign( this, props );

		if ( this.scheme && this.host && this.port ) this.connect();

	}

	connect() {

		this.ws = new WebSocket( `${this.scheme}://${this.host}:${this.port}` );

		this.ws.addEventListener( "open", this.onOpen.bind( this ) );
		this.ws.addEventListener( "close", () => ( this.dispatchEvent( "close" ), this.autoReconnect && this.connect() ) );
		this.ws.addEventListener( "message", this.onMessage.bind( this ) );

	}

	onOpen() {

		if ( this._queue )
			for ( let i = 0; i < this._queue.length; i ++ )
				this.ws.send( this._queue[ 0 ] );

		this.dispatchEvent( "open" );

	}

	onMessage( e ) {

		const data = JSON.parse( e.data );
		this.log( "[RECV]", data );
		this.dispatchEvent( data.id, data );

	}

	json( data ) {

		if ( ! this.ws || this.ws.readyState !== WebSocket.OPEN ) {

			if ( ! this._queue ) Object.defineProperty( this, "_queue", { value: [] } );
			return this._queue.push( JSON.stringify( data, this.replacer ) );

		}

		this.log( "[SEND]", data );
		this.ws.send( JSON.stringify( data, this.replacer ) );

	}

	log( ...args ) {

		if ( this.name ) args.unshift( `[${this.name}]` );

		if ( this.name ) console.log( `[${this.name}]`, ...args );
		else console.log( ...args );

	}

}

class UI extends Component {

	get defaultState() {

		return {
			nick: localStorage.getItem( "nick" ),
			hosts: [],
			rooms: []
		};

	}

	constructor() {

		super();

		this.powerline = new Powerline();

		const nova = this.nova = new SimpleWebSocket( { scheme: "ws", host: "localhost", port: "8080", autoReconnect: true, name: "Nova" } );

		nova.json( { id: "login" } );

		nova.addEventListener( "onLogin", () => ( nova.json( { id: "hostList" } ), nova.json( { id: "roomList" } ) ) );
		nova.addEventListener( "onHostList", e => this.setState( { hosts: e.list } ) );
		nova.addEventListener( "onRoomList", e => this.setState( { rooms: e.list } ) );
		nova.addEventListener( "onBridge", e => ( Object.assign( this.host, { scheme: e.scheme, host: e.ip, port: e.port, key: e.key } ), this.host.connect() ) );
		nova.addEventListener( "onReserve", e => this.setState( { rooms: this.state.rooms.concat( [ e ] ) } ) );

	}

	onsubmit( e ) {

		e.preventDefault();

		if ( ! this.state.host ) return;

		if ( ! this.state.room ) this.nova.json( { id: "reserve", host: this.state.host, name: Math.random().toString().slice( 2 ) } );
		this.nova.json( { id: "bridge", host: this.state.host } );

		const host = window.host = this.host = new SimpleWebSocket( { name: "Host" } );
		host.addEventListener( "open", () => host.json( { id: "key", key: host.key } ) );
		host.addEventListener( "onKey", () => host.json( { id: "room", name: this.state.room.name } ) );
		host.addEventListener( "onRoom", data => ! data.app && host.json( { id: "app", path: "wc-powerline" } ) );

	}

	onhost( e ) {

		console.log( e );

	}

	onnick( e ) {

		const nick = e.target.value.slice( 0, 16 );

		if ( nick ) localStorage.setItem( "nick", nick );
		else localStorage.removeItem( "nick" );

		this.setState( { nick } );

	}

	render() {

		if ( ! this.state.host && this.state.hosts.length ) this.state.host = this.state.hosts[ 0 ];
		if ( ! this.state.room && this.state.rooms.length ) this.state.room = this.state.rooms[ 0 ];

		return this.html`
		<canvas></canvas>
		<form id="splash" onsubmit=${this}>
			<h1>Powerline</h1>
			<select oninput=${this} data-call="onhost">
				<option disabled selected=${! this.state.hosts.length}>Server</option>
				${this.state.hosts.map( h => wire()`<option>${h}</option>` )}
			</select>
			<select>
				<option disabled>Room</option>
				${this.state.rooms.map( r => wire()`<option selected=${this.state.room.name === r.name}>${r.name}</option>` )}
				<option hidden=${this.state.rooms.length}>New room</option>
			</select>
			<input placeholder="nickname" autofocus oninput=${this} data-call="onnick" value=${this.state.nick} maxlength="15" />
			<div>[ Press Enter To Play ]</div>
		</form>
		`;

	}

}

document.addEventListener( "DOMContentLoaded", () => bind( document.body )`${new UI()}` );
