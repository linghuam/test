export class Layer {

	constructor (url) {
		this._url = url;
	}

	onAdd (map) {
	   this._map = map;
	   this._initContainer();
	}

	onRemove (map) {
		this._container.remove();
	}

	_initContainer () {
		this._container = document.createElement('canvas');
		this._container.setAttribute('class', 'layer');
		this._container.setAttribute('width',this._map._width);
		this._container.setAttribute('height',this._map._height)
		this._map._container.appendChild(this._container);
	}
}