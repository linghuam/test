// 当前屏幕分辨率
const DPI = 96;
// 英寸转厘米参数
const IN2CM = 2.5399998;

export class TileLayer {

  constructor(url, options) {
    this._url = url;
    this.options = Object.assign({
      tileSize: 256
    }, options);
    this._tileSize = this.options.tileSize;
  }

  onAdd(map) {
    this._map = map;
    this._initContainer();
    this._tileCenter = this._map.project(this._map._center);
    this._tileZoom = this._map._zoom;
    // 当前级别下屏幕上1像素代表的实际距离
    var resolution = this.getResolution(this._tileZoom);
    // 计算屏幕范围对应的地理范围
    var minX = this._tileCenter[0] - this._map._width / 2 * resolution;
    var minY = this._tileCenter[1] - this._map._height / 2 * resolution;
    var maxX = this._tileCenter[0] + this._map._width / 2 * resolution;
    var maxY = this._tileCenter[1] + this._map._height / 2 * resolution;

  }

  onRemove(map) {
    this._container.remove();
  }

  getResolution(zoom) {
  	return this.getScale(zoom) * IN2CM / DPI;
  }

  getScale (zoom) {
    return this._tileSize * Math.pow(2, zoom);
  }

  _initContainer() {
    this._container = document.createElement('canvas');
    this._container.setAttribute('class', 'layer');
    this._container.setAttribute('width', this._map._width);
    this._container.setAttribute('height', this._map._height)
    this._map._container.appendChild(this._container);
  }
}
