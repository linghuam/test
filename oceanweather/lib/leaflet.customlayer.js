L.CustomLayer = L.Layer.extend({

    options:{
        pane:'overlayPane'
    },

    initialize:function(options,data){
        L.setOptions(this,options);
        this._data = data || [];  //{lat:...,lon:....,dir:...,value:...}
    },

    onAdd: function(map) {
        var pane = map.getPane(this.options.pane);
        this._container = L.DomUtil.create('canvas');

        pane.appendChild(this._container);

        // Calculate initial position of container with `L.Map.latLngToLayerPoint()`, `getPixelOrigin()` and/or `getPixelBounds()`
        var size = map.getSize();
        this._container.style.width = size.x + 'px';
        this._container.style.height = size.y + 'px';
        this._container.style.position = 'absolute';
        // L.DomUtil.setPosition(this._container, point);

        // Add and position children elements if needed

        map.on('zoomend viewreset', this._update, this);
    },

    onRemove: function(map) {
        L.DomUtil.remove(this._container);
        map.off('zoomend viewreset', this._update, this);
    },

    _update: function() {
        // Recalculate position of container

        L.DomUtil.setPosition(this._container, point);        

        // Add/remove/reposition children elements if needed
    }
});