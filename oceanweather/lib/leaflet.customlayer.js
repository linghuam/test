L.CustomLayer = L.Renderer.extend({
   
    initialize:function(options,data){
        L.Renderer.prototype.initialize.call(this,options);
        this.options.padding = 0.1;
        this._data = data || [];
    },

    onAdd: function(map) {        
        
        this._container = L.DomUtil.create('canvas','leaflet-zoom-animated');

        var pane = map.getPane(this.options.pane);
        pane.appendChild(this._container);

        this._ctx = this._container.getContext('2d');

        this._update();
    },

    onRemove: function(map) {
        L.DomUtil.remove(this._container);
    },

    _update: function() {
        if (this._map._animatingZoom && this._bounds) { return; }

        L.Renderer.prototype._update.call(this);

        var b = this._bounds,
            container = this._container,
            size = b.getSize(),
            m = L.Browser.retina ? 2 : 1;

        L.DomUtil.setPosition(container, b.min);

        // set canvas size (also clearing it); use double size on retina
        container.width = m * size.x;
        container.height = m * size.y;
        container.style.width = size.x + 'px';
        container.style.height = size.y + 'px';

        if (L.Browser.retina) {
            this._ctx.scale(2, 2);
        }

        // translate so we use the same path coordinates after canvas element moves
        this._ctx.translate(-b.min.x, -b.min.y);

        // Tell paths to redraw themselves
        this.fire('update');

        this._draw();
    },

    _draw:function(){
        if(!this._data.length) {return;}
        var ctx = this._ctx,
            map = this._map
            data = this._data;

        var latlng = L.latLng(39.876019, 116.427612);
        var pt = this._map.latLngToLayerPoint(latlng);
        ctx.fillStyle = "#ff0000";
        ctx.fillRect(pt.x, pt.y, 10, 10);
    }
});
