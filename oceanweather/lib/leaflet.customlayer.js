L.CustomLayer = L.Layer.extend({
    onAdd: function(map) {
        var pane = map.getPane(this.options.pane);
        this._container = L.DomUtil.create('canvas');
        this._ctx = this._container.getContext('2d');

        pane.appendChild(this._container);

        // Calculate initial position of container with `L.Map.latLngToLayerPoint()`, `getPixelOrigin()` and/or `getPixelBounds()`
        // var point = map.getPixelOrigin();
        var size = map.getSize();
        // L.DomUtil.setPosition(this._container, point);
        this._container.setAttribute('id','ca');
        this._container.style.width = size.x + 'px';
        this._container.style.height = size.y + 'px';
        this._container.style.position = 'absolute';
        // Add and position children elements if needed

        map.on('zoomend viewreset', this._update, this);
        this._update();
    },

    onRemove: function(map) {
        L.DomUtil.remove(this._container);
        map.off('zoomend viewreset', this._update, this);
    },

    _update: function() {
        var mapPane = this._map.getPanes().overlayPane;
        var point = {
            x:-mapPane.offsetWidth,
            y:-mapPane.offsetHeight
        };
        this._container.style.transform = 'translate(' +
            -Math.round(point.x) + 'px,' +
            -Math.round(point.y) + 'px)';
        var ctx = this._ctx;
        var latlng = L.latLng(30, 116);
        var pt = this._map.latLngToContainerPoint(latlng);
        ctx.fillStyle = "#ff0000";
        ctx.fillRect(pt.x, pt.y, 10, 10);
    }
});
