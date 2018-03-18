
define("leaflet/weatherLayer",["leaflet"],function(L){

    var  Config = {
         errorUrl:'',
         tempurl:'http://218.241.183.164:7919/SeaTemp_20170206_12_20170206_12?REQUEST=GetTile&X={x}&Y={y}&Z={z}'
     };


	L.TileLayer.WeatherLayer = L.TileLayer.extend({

		initialize : function(url, options) {
			L.setOptions(this, options);
			options.errorTileUrl = Config.errorUrl;
			this._url = Config.tempurl;
			L.TileLayer.prototype.initialize.call(this, this._url, options);
		},

		getTileUrl:function(tilePoint){
            return L.Util.template(this._url,{
                x: tilePoint.x,
                y: tilePoint.y,
                z: tilePoint.z
            });
		}
	});
	

	L.tileLayer.weatherLayer = function(url, options) {
		return new L.TileLayer.WeatherLayer(url, options);
	};

});
