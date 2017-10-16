import proj4 from 'proj4'

export class Map {

  constructor(id, options) {
    this._container = document.getElementById(id);
    this.options = Object.assign({
      center: [116, 39],
      zoom: 2
    }, options);
    this._center = this.options.center;
    this._zoom = this.options.zoom;
    this._width = this._container.clientWidth;
    this._height = this._container.clientHeight;
  }

  addLayer(layer){
    if (layer) {
      layer.onAdd(this);
    }
  }

  removeLayer(layer){
    if (layer) {
    layer.onRemove(this);      
    }
  }
  
  project (latlng) {
    return proj4('EPSG:4326', 'EPSG:3857', latlng)
  }
}
