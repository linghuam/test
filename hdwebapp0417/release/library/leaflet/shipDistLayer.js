define("leaflet/shipDistLayer",["leaflet"],function(e){e.TileLayer.ShipDistLayer=e.TileLayer.extend({initialize:function(t,n){e.setOptions(this,n),this._url=t+"{s}/{z}-{x}-{y}.png",e.TileLayer.prototype.initialize.call(this,this._url,this.options)},getTileUrl:function(t){return e.Util.template(this._url,e.extend({s:function(){var e;if(t.z>6){var n=Math.pow(2,t.z-5),r="R"+Math.floor(t.y/n),i="C"+Math.floor(t.x/n);e=t.z+"/"+r+"/"+i}else e=t.z;return e},z:t.z,x:t.x,y:t.y}))}}),e.tileLayer.shipDistLayer=function(t,n){return new e.TileLayer.ShipDistLayer(t,n)}});