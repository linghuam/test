/*
 * 矩形内写文字 svg
 */
L.VectorLabelSvg = L.SVG.extend({

    _updatePoly: function(layer, closed) {
        L.SVG.prototype._updatePoly.call(this, layer, closed);
        if (!layer.options.text) {
            return;
        } else {
            this._text(layer, closed);
        }
    },

    _initPath: function(layer) {
        L.SVG.prototype._initPath.call(this, layer);
        if (layer.options.text) {
            layer._textele = L.SVG.create('text');
        }
    },

    _addPath: function(layer) {
        L.SVG.prototype._addPath.call(this, layer);
        if (layer._textele) {
            this._rootGroup.appendChild(layer._textele);
        }
    },

    _removePath: function(layer) {
        L.SVG.prototype._removePath.call(this, layer);
        if (layer._textele) {
            L.DomUtil.remove(layer._textele);
        }
    },

    _text: function(layer, closed) {
        var container = this._container,
            text = layer.options.text,
            textele = layer._textele,
            map = this._map;
        var center = layer.getBounds().getCenter();
        var pt = map.latLngToLayerPoint(center);
        textele.setAttribute('x', pt.x);
        textele.setAttribute('y', pt.y + 7);
        textele.setAttribute('text-anchor', 'middle');
        textele.setAttribute('style', 'font-family:"Microsoft YaHei";font-size:14px;');
        textele.innerHTML = text;
    }
});
