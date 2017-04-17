define("control/draw",["leaflet","leaflet/draw","core/namespace"],function(e){e.ICT.Draw=e.Class.extend({initialize:function(e){this._map=e,this.Tools={point:null,polyline:null,path:null,circle:null,rectangle:null,polygon:null,sector:null}},disable:function(){for(var e in this.Tools)this.Tools[e]!==null&&this.Tools[e].disable()},clear:function(){},point:function(t,n){this.disable(),this.Tools.point===null&&(this.Tools.point=new e.ICT.DrawPoint(this._map)),this.Tools.point.enable(t,n)},polyline:function(t,n){this.disable(),this.Tools.polyline===null&&(this.Tools.polyline=new e.ICT.DrawPolyline(this._map)),this.Tools.polyline.enable(t,n)},path:function(t,n){this.disable(),this.Tools.path===null&&(this.Tools.path=new e.ICT.DrawPath(this._map)),this.Tools.path.enable(t,n)},circle:function(t,n){this.disable(),this.Tools.circle===null&&(this.Tools.circle=new e.ICT.DrawCircle(this._map)),this.Tools.circle.enable(t,n)},rectangle:function(t,n){this.disable(),this.Tools.rectangle===null&&(this.Tools.rectangle=new e.ICT.DrawRectangle(this._map)),this.Tools.rectangle.enable(t,n)},polygon:function(t,n){this.disable(),this.Tools.polygon===null&&(this.Tools.polygon=new e.ICT.DrawPolygon(this._map)),this.Tools.polygon.enable(t,n)},sector:function(e,t){}}),e.ICT.DrawPoint=e.Draw.Marker.extend({options:{clickable:!1,repeatMode:!1,declaredClass:"DrawPoint"},initialize:function(){e.Draw.Marker.prototype.initialize.apply(this,arguments)},enable:function(t,n){e.Draw.Marker.prototype.enable.call(this),this.ictcallback=t,this.ictcontext=n},addHooks:function(){this._map.on("mouseup",this.exist,this),e.Draw.Marker.prototype.addHooks.call(this)},removeHooks:function(){this._map.off("mouseup",this.exist,this),e.Draw.Marker.prototype.removeHooks.call(this)},exist:function(e){e.originalEvent.button==2&&this.disable()},clone:function(){return e.marker(this.getLatLng(),this.options)},clear:function(){},_fireCreatedEvent:function(){var t=e.marker(this._marker.getLatLng(),this.options);e.Draw.Marker.prototype._fireCreatedEvent.call(this),typeof this.ictcallback=="function"?this.ictcallback.apply(this.ictcontext||this,[{layer:t,layerType:this.type}]):null}}),e.ICT.DrawPolyline=e.Draw.Polyline.extend({options:{repeatMode:!1,showLength:!0,clickable:!1,metric:!1,feet:!1,nautic:!0},initialize:function(){e.Draw.Polyline.prototype.initialize.apply(this,arguments)},enable:function(t,n){e.Draw.Polyline.prototype.enable.call(this),this.ictcallback=t,this.ictcontext=n},addHooks:function(){this._map.on("mouseup",this.exist,this),e.Draw.Polyline.prototype.addHooks.call(this)},removeHooks:function(){this._map.off("mouseup",this.exist,this),e.Draw.Polyline.prototype.removeHooks.call(this)},exist:function(e){e.originalEvent.button==2&&this.disable()},clone:function(){return e.polyline(this.getLatLngs(),this.options)},clear:function(){},_fireCreatedEvent:function(){var t=e.polyline(this._poly.getLatLngs(),this.options.shapeOptions);e.Draw.Polyline.prototype._fireCreatedEvent.call(this),typeof this.ictcallback=="function"?this.ictcallback.apply(this.ictcontext||this,[{layer:t,layerType:this.type}]):null}}),e.ICT.DrawPath=e.Draw.SimpleShape.extend({statics:{TYPE:"path",tooltip_start_txt:"点击拖动绘制直线",tooltip_end_txt:"释放鼠标完成绘制"},options:{repeatMode:!1,clickable:!1},initialize:function(t,n){e.Draw.SimpleShape.prototype.initialize.call(this,t,n),this.type=e.ICT.DrawPath.TYPE,this._initialLabelText=e.ICT.DrawPath.tooltip_start_txt,this._endLabelText=e.ICT.DrawPath.tooltip_end_txt},enable:function(t,n){e.Draw.SimpleShape.prototype.enable.call(this),this.ictcallback=t,this.ictcontext=n},addHooks:function(){this._map.on("mouseup",this.exist,this),e.Draw.SimpleShape.prototype.addHooks.call(this)},removeHooks:function(){this._map.off("mouseup",this.exist,this),e.Draw.SimpleShape.prototype.removeHooks.call(this)},exist:function(e){e.originalEvent.button==2&&this.disable()},clone:function(){return e.polyline(this.getLatLngs(),this.options)},clear:function(){},_drawShape:function(t){this._shape?this._shape.setLatLngs([this._startLatLng,t]):(this._shape=new e.Polyline([this._startLatLng,t],this.options.shapeOptions),this._map.addLayer(this._shape))},_fireCreatedEvent:function(){var t=new e.Polyline(this._shape.getLatLngs(),this.options.shapeOptions);e.Draw.SimpleShape.prototype._fireCreatedEvent.call(this),typeof this.ictcallback=="function"?this.ictcallback.apply(this.ictcontext||this,[{layer:t,layerType:this.type}]):null}}),e.ICT.DrawPolygon=e.Draw.Polygon.extend({options:{repeatMode:!1,showArea:!1,clickable:!1},initialize:function(){e.Draw.Polygon.prototype.initialize.apply(this,arguments)},enable:function(t,n){e.Draw.Polygon.prototype.enable.call(this),this.ictcallback=t,this.ictcontext=n},addHooks:function(){this._map.on("mouseup",this.exist,this),e.Draw.Polygon.prototype.addHooks.call(this)},removeHooks:function(){this._map.off("mouseup",this.exist,this),e.Draw.Polygon.prototype.removeHooks.call(this)},exist:function(e){e.originalEvent.button==2&&this.disable()},clone:function(){return e.polygon(this.getLatLngs(),this.options)},clear:function(){},_fireCreatedEvent:function(){var t=e.polygon(this._poly.getLatLngs(),this.options.shapeOptions);e.Draw.Polygon.prototype._fireCreatedEvent.call(this),typeof this.ictcallback=="function"?this.ictcallback.apply(this.ictcontext||this,[{layer:t,layerType:this.type}]):null}}),e.ICT.DrawCircle=e.Draw.Circle.extend({options:{repeatMode:!1,showRadius:!1,clickable:!1},initialize:function(){e.Draw.Circle.prototype.initialize.apply(this,arguments)},enable:function(t,n){e.Draw.Circle.prototype.enable.call(this),this.ictcallback=t,this.ictcontext=n},addHooks:function(){this._map.on("mouseup",this.exist,this),e.Draw.Circle.prototype.addHooks.apply(this,arguments)},removeHooks:function(){this._map.off("mouseup",this.exist,this),e.Draw.Circle.prototype.removeHooks.apply(this,arguments)},exist:function(e){e.originalEvent.button==2&&this.disable()},clone:function(){return new e.Circle(this.getLatLng(),this.getRadius(),this.options)},clear:function(){},_fireCreatedEvent:function(){var t=new e.Circle(this._startLatLng,this._shape.getRadius(),this.options);e.Draw.Circle.prototype._fireCreatedEvent.call(this),typeof this.ictcallback=="function"?this.ictcallback.apply(this.ictcontext||this,[{layer:t,layerType:this.type}]):null}}),e.ICT.DrawRectangle=e.Draw.Rectangle.extend({options:{repeatMode:!1,clickable:!1},initialize:function(){e.Draw.Rectangle.prototype.initialize.apply(this,arguments)},enable:function(t,n){e.Draw.Rectangle.prototype.enable.call(this),this.ictcallback=t,this.ictcontext=n},addHooks:function(){this._map.on("mouseup",this.exist,this),e.Draw.Rectangle.prototype.addHooks.apply(this,arguments)},removeHooks:function(){this._map.off("mouseup",this.exist,this),e.Draw.Rectangle.prototype.removeHooks.apply(this,arguments)},exist:function(e){e.originalEvent.button==2&&this.disable()},clone:function(){return new e.Rectangle(this.getBounds(),this.options)},clear:function(){},_fireCreatedEvent:function(){var t=new e.Rectangle(this._shape.getBounds(),this.options.shapeOptions);e.Draw.Rectangle.prototype._fireCreatedEvent.call(this),typeof this.ictcallback=="function"?this.ictcallback.apply(this.ictcontext||this,[{layer:t,layerType:this.type}]):null}})});