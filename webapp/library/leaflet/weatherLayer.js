
define('leaflet/weatherLayer',["leaflet"],function(L){
		/**
	 * 气象Layer
	 * 继承自TileLayer
	 * @param {Object} tomcat中映射该切片目录url
	 * @param {Object} options
	 * http://218.241.183.164:7919/WaveHeight_20160806_12_20160807_00?REQUEST=GetTile&X=3&Y=2&Z=3
	 */
	L.TileLayer.WeatherLayer = L.TileLayer.extend({
		initialize: function (url, options) {
			options = L.setOptions(this, options);
			options.errorTileUrl= "http://www.shipdt.com/bg_tm.png";
			this.url = "http://awt.myships.com/"  +options.type+ "?REQUEST=GetTile"+"&X={x}&Y={y}&Z={z}";
			L.TileLayer.prototype.initialize.call(this, this.url, options);
		}
	});
	/**
	 * 重写TileLayer中获取切片url方法
	 * @param {Object} tilePoint
	 */
	L.TileLayer.WeatherLayer.prototype.getTileUrl = function (tilePoint) {
		return L.Util.template(this._url, L.extend({
			s: function () {
				var zl = tilePoint.z;
				var ty = tilePoint.y;
				var dir = levDir = rowDir = "";
				if (zl < 2) {
					levDir = "LN" + (zl).toString();
				} else if (zl < 12) {
					levDir = "L0" + (zl - 2).toString();
				} else {
					levDir = "L" + (zl - 2).toString();
				}
				rowDir = "R" + L.tileLayer.getHexString(ty);
				dir = levDir + "/" + rowDir;
				return dir;
			},
			z:tilePoint.z,
			x:tilePoint.x,
			y:tilePoint.y
		}));
	};
	L.tileLayer.getHexString = function (value) {
		var strHex = value.toString(16);
		switch (strHex.length) {
			case 1:
				strHex = "0000000" + strHex;
				break;
			case 2:
				return strHex = "000000" + strHex;
				break;
			case 3:
				strHex = "00000" + strHex;
				break;
			case 4:
				strHex = "0000" + strHex;
				break;
			case 5:
				strHex = "000" + strHex;
				break;
				break;
			case 6:
				strHex = "00" + strHex;
				break;
			case 7:
				strHex = "0" + strHex;
				break;
			default:
		}
		return strHex;
	};

	L.tileLayer.WeatherLayer = function (url, options) {
		return new L.TileLayer.WeatherLayer(url, options);
	}; 
	
});
