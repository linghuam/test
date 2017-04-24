L.SVG.include({
    _updateShipVector: function(layer) {
        var p = layer._point,
            r = layer._radius,
            r2 = layer._radiusY || r,
            arc = 'a' + r + ',' + r2 + ' 0 1,0 ',
            r3 = r * Math.pow(3, 1 / 2) / 2,
            p2 = { x: p.x - r / 2, y: p.y + r3 },
            p3 = { x: p.x + r / 2, y: p.y + r3 };

        // drawing a circle with two half-arcs
        var d = layer._empty() ? 'M0 0' :
            'M' + p.x + ',' + p.y + ' L' + p2.x + ',' + p2.y + ' L' + p3.x + ',' + p3.y + ' Z';

        this._setPath(layer, d);
    }

});

L.ShipVector = L.CircleMarker.extend({

    options: {
        rotationAngle: 0, //方向，正北是0，顺时针，共360，
        renderer: L.svg()
    },

    setRotationAngle: function(angel) {
    	if(this._path){
    		var transform = '';
            transform += ' rotate(' + angel + 'deg)';
            this._path.style[L.DomUtil.TRANSFORM] += transform;
            this._path.style.transformOrigin = "50% 50%"; //linghuam 设置旋转的参照点为中心点，解决船舶偏移问题
    	}
    },

    _updatePath: function() {
        this._renderer._updateShipVector(this);
        this.setRotationAngle(this.options.rotationAngle);
    }
});

L.shipVector = function(latlng,options){
	return new L.ShipVector(latlng,options);
};

