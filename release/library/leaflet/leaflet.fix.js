/*
*继承修改leaflet原生内容
*/
define("leaflet/fix",["leaflet"],function(L){
    
    /*
    * 修改L.Marker类透明度
    */
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

	/*
	* 矩形内写文字
	*/
    L.VectorLabelCanvas = L.Canvas.extend({

    	initialize:function(options){
    		L.Canvas.prototype.initialize.call(this,options);
    		// L.Util.setOptions(this,options);
    	},

    	_updatePoly:function(layer, closed) {
            L.Canvas.prototype._updatePoly.call(this, layer, closed);
            if(!layer.options.text){
                return;
            } else{
                this._text(layer,closed);
            }            
        },

        _text:function(layer,closed){            
        	var ctx = this._ctx,
        	  	text = layer.options.text,
        	  	map = this._map;
        	var center = layer.getBounds().getCenter();
        	var pt = map.latLngToLayerPoint(center);
        	ctx.textAlign = 'center';
        	ctx.textBaseline = 'middle';
        	ctx.font = 'Microsoft YaHei';
        	ctx.fillStyle = "#000";
			ctx.fillText(text,pt.x,pt.y);
        }
    });

});