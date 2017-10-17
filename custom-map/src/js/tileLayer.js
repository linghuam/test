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
    this._tileCenter = this._map.project(this._map._center, this._map._zoom);
    this._tileZoom = this._map._zoom;
    // 地图范围
    this._tileCenter[0] = Math.floor(this._tileCenter[0]);
    this._tileCenter[1] = Math.floor(this._tileCenter[1]);
    var mapMinX = this._tileCenter[0] - this._map._width / 2;
    var mapMinY = this._tileCenter[1] - this._map._height / 2;
    var maxX = this._tileCenter[0] + this._map._width / 2;
    var maxY = this._tileCenter[1] + this._map._height / 2;
    // 该范围内切片行列范围
    var rows = [Math.floor(mapMinX / this._tileSize), Math.ceil(maxX / this._tileSize) - 1];
    var cols = [Math.floor(mapMinY / this._tileSize), Math.ceil(maxY / this._tileSize) - 1];
    // 获取所有行列数据
    var coords = [];
    for(let i = cols[0]; i <= cols[1]; i++) {
      for(let j = rows[0]; j <= rows[1]; j++) {
        coords.push({
          x: j,
          y: i,
          z: this._tileZoom
        });
      }
    }
    // 获取所有图片
    for(let i = 0, len = coords.length; i < len; i++) {
      let cor = coords[i];
      let img = new Image();
      img.onload = function () {
        console.log(cor.x + cor.y + cor.z);
      }
      img.src = this.getTileUrl(cor);
    }

  }

  // 墨卡托投影的比例尺
  scale(zoom) {
    return 256 * Math.pow(2, zoom);
  }

  getTileUrl(coords) {
    return this._url.replace('{x}', coords.x).replace('{y}', coords.y).replace('{z}', coords.z)
  }

  onRemove(map) {
    this._container.remove();
  }

  getResolution(level) {
    return LEVELSCALE[level] * IN2CM / DPI; //当前级别下屏幕上1像素代表的实际距离
  }

  _initContainer() {
    this._container = document.createElement('canvas');
    this._container.setAttribute('class', 'layer');
    this._container.setAttribute('width', this._map._width);
    this._container.setAttribute('height', this._map._height)
    this._map._container.appendChild(this._container);
  }
}
