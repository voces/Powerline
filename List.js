
// Somewhat conforms to array, but is not at all implemented with one
// Used for FIFOs or when middle elements are likely to be removed
export default class List {

	constructor() {

		Object.defineProperty( this, "_length", { value: 0, writable: true } );

	}

	get head() {

		if ( this._length === 0 ) return undefined;
		return this._head.value;

	}

	get tail() {

		if ( this._length === 0 ) return undefined;
		return this._tail.value;

	}

	get length() {

		return this._length;

	}

	pop() {

		if ( this._length === 0 ) return undefined;
		const value = this._tail.value;
		this._tail = this._tail.prev;
		if ( this._tail ) this._tail.next = undefined;
		this._length --;
		return value;

	}

	shift() {

		if ( this._length === 0 ) return undefined;
		const value = this._head.value;
		this._head = this._head.next;
		if ( this._head ) this._head.prev = undefined;
		this._length --;
		return value;

	}

	push( ...values ) {

		values.forEach( value => {

			if ( this._length === 0 ) this._tail = this._head = { value };
			else {

				this._tail.next = { value, prev: this._tail };
				this._tail = this._tail.next;

			}

			this._length ++;

		} );

		return this._length;

	}

	unshift( ...values ) {

		values.forEach( value => {

			if ( this._length === 0 ) this._head = this._tail = { value };
			else {

				this._head.prev = { value, next: this._head };
				this._head = this._head.prev;

			}

			this._length ++;

		} );

		return this._length;

	}

	*[Symbol.iterator]() {

		let cursor = this._head;
		while ( cursor !== undefined && cursor.next ) {

			yield cursor.value;
			cursor = cursor.next;

		}

		if ( cursor !== undefined ) yield cursor.value;
		else yield cursor;

	}

}
