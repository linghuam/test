L.SVG.include({
    _updateCircle: function(layer) {
        var p = layer._point,
            r = layer._radius,
            r2 = layer._radiusY || r,
            arc = 'a' + r + ',' + r2 + ' 0 1,0 ';

        // drawing a circle with two half-arcs
        var d = layer._empty() ? 'M0 0' :
            'M' + (p.x - r) + ',' + p.y +
            arc + (r * 2) + ',0 ' +
            arc + (-r * 2) + ',0 ';

        this._setPath(layer, d);
    },

    _setPath: function(layer, path) {
        layer._path.setAttribute('d', path);
    }
});

L.ShipVector = L.CircleMarker.extend({

});
