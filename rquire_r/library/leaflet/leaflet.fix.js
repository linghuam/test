/*
*继承修改leaflet原生内容
*/
define("leaflet/fix",["leaflet"],function(L){

	L.Marker.include({
		setOpacity: function (opacity) {
			this.options.opacity = opacity;
			if (this._map) {
				this._updateOpacity();
			}

			return this;
		},

		_updateOpacity: function () {
			var opacity = this.options.opacity;
            if(opacity === 0){
            	this._icon.style.display = "none";
            } else if(opacity === 1){
            	this._icon.style.display = "block";
            } else{
            	L.DomUtil.setOpacity(this._icon, opacity);
            }			
			if (this._shadow) {
				L.DomUtil.setOpacity(this._shadow, opacity);
			}
		}		
	});
});