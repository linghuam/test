define("leaflet/chartLayer",["leaflet"],function(r){var e={errorUrl:"",tempurl:Project_ParamConfig.ChartLayerUrl};r.TileLayer.ChartLayer=r.TileLayer.extend({initialize:function(t,i){i=r.setOptions(this,i),i.errorTileUrl=e.errorUrl;var a=e.tempurl;this.url=a+"{s}/{x}.jpg",r.TileLayer.prototype.initialize.call(this,this.url,i)}}),r.TileLayer.ChartLayer.prototype.getTileUrl=function(e){return r.Util.template(this._url,r.extend({s:function(){var t=e.z,i=e.y,a=levDir=rowDir="";return levDir=2>t?"LN"+t.toString():12>t?"L0"+(t-2).toString():"L"+(t-2).toString(),rowDir="R"+r.tileLayer.getHexString(i),a=levDir+"/"+rowDir},x:"C"+r.tileLayer.getHexString(e.x)}))},r.tileLayer.getHexString=function(r){var e=r.toString(16);switch(e.length){case 1:e="0000000"+e;break;case 2:return e="000000"+e;case 3:e="00000"+e;break;case 4:e="0000"+e;break;case 5:e="000"+e;break;case 6:e="00"+e;break;case 7:e="0"+e}return e},r.tileLayer.ChartLayer=function(e,t){return new r.TileLayer.ChartLayer(e,t)}});