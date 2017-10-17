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

  project (latlng, zoom) {
    var projPoint = proj4('EPSG:4326', 'EPSG:3857', latlng);
    var scale = 256 * Math.pow(2, zoom);
    return this.transform(projPoint, scale);
  }

  transform (point, scale) {
    var a = 2.495320233665337e-8;
    var b = 0.5;
    var c = -2.495320233665337e-8;
    var d = 0.5;
    point[0] = scale * (a * point[0] + b);
    point[1] = scale * (c * point[1] + d);
    return point;
  }
}
