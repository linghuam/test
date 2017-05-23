L.CustomLayer = L.Renderer.extend({

    initialize: function(options, config) {
        L.Renderer.prototype.initialize.call(this, options);
        this.options.padding = 0.1;
        this.cfg = config;
        this._data = (config && config.data) || [];
    },

    onAdd: function(map) {

        this._container = L.DomUtil.create('canvas', 'leaflet-zoom-animated');

        var pane = map.getPane(this.options.pane);
        pane.appendChild(this._container);

        this._ctx = this._container.getContext('2d');

        this._update();
    },

    onRemove: function(map) {
        L.DomUtil.remove(this._container);
    },

    _update: function() {
        if (this._map._animatingZoom && this._bounds) {
            return;
        }

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

    _draw: function() {
        if (!this._data.length) {
            return;
        }
        var ctx = this._ctx,
            map = this._map
        data = this._data;

        for (var i = 0, len = data.length; i < len; i++) {
            var obj = data[i];
            var latlng = L.latLng(obj[this.cfg.lat], obj[this.cfg.lng]);
            var point = map.latLngToLayerPoint(latlng);
            this.drawDirArrow(point,+obj[this.cfg.dir]);
        }
    },
    
    drawDirArrow:function(startpoint,dir,r){
        r = r || 16;
        var arc = (Math.PI*dir)/180;
        var a = startpoint.x,
            b = startpoint.y,
            x0 = a,
            y0 = b-r;
        var x1 = a+(x0-a)*Math.cos(arc)-(y0-b)*Math.sin(arc);
        var y1 = b+(x0-a)*Math.sin(arc)+(y0-b)*Math.cos(arc);
        this.drawArrow(this._ctx,a,b,x1,y1,30,10,8,'#2A95A6');
    },
    
    /*
    * https://www.w3cplus.com/canvas/drawing-arrow.html
    * https://www.zybang.com/question/fda330126d2232e5159d1ff1b69186b0.html
     */
    drawArrow: function(ctx, fromX, fromY, toX, toY, theta, headlen, width, color) {
        theta = typeof(theta) != 'undefined' ? theta : 30;
        headlen = typeof(theta) != 'undefined' ? headlen : 10;
        width = typeof(width) != 'undefined' ? width : 1;
        color = typeof(color) != 'color' ? color : '#000';
        // 计算各角度和对应的P2,P3坐标 
        var angle = Math.atan2(fromY - toY, fromX - toX) * 180 / Math.PI,
            angle1 = (angle + theta) * Math.PI / 180,
            angle2 = (angle - theta) * Math.PI / 180,
            topX = headlen * Math.cos(angle1),
            topY = headlen * Math.sin(angle1),
            botX = headlen * Math.cos(angle2),
            botY = headlen * Math.sin(angle2);
        ctx.save();
        ctx.beginPath();
        var arrowX = fromX - topX,
            arrowY = fromY - topY;
        ctx.moveTo(arrowX, arrowY);
        ctx.moveTo(fromX, fromY);
        ctx.lineTo(toX, toY);
        arrowX = toX + topX;
        arrowY = toY + topY;
        ctx.moveTo(arrowX, arrowY);
        ctx.lineTo(toX, toY);
        arrowX = toX + botX;
        arrowY = toY + botY;
        ctx.lineTo(arrowX, arrowY);
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.stroke();
        ctx.restore();
    }
});
