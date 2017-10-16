// 当前屏幕分辨率
const DPI = 96;
//英寸转厘米参数
const IN2CM = 2.5399998;
//切图级别对应的比例尺
const LEVELSCALE = {
	
};
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
    //当前级别下屏幕上1像素代表的实际距离
    this._resolution = this.getResolution(this._tileZoom);
  }

  onRemove(map) {
    this._container.remove();
  }

  getResolution(level) {
  	return LEVELSCALE[level] * IN2CM / DPI;
  }

  _initContainer() {
    this._container = document.createElement('canvas');
    this._container.setAttribute('class', 'layer');
    this._container.setAttribute('width', this._map._width);
    this._container.setAttribute('height', this._map._height)
    this._map._container.appendChild(this._container);
  }
}
