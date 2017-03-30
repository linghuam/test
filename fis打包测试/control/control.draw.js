
define("control/draw",[
  "leaflet",
  "leaflet/draw",
  "core/namespace"
  
],function(L){

  /*
  *绘制类
  *使用方法
  1、实例化一个绘制对象,传入当前地图对象
  var drawPen = new L.ICT.Draw(mymap);
  2、调用绘制方法，传入绘制完成回调函数和回调上下文
  drawPen.rectangle(function(e){
   var layer = e.layer,
       layerType = e.layerType;
       layer.addTo(mymap);
  },this);
  */   
  L.ICT.Draw = L.Class.extend({

    initialize:function(map){
        this._map = map;
        this.Tools = {
          point:null,
          polyline:null,
          path:null,
          circle:null,
          rectangle:null,
          polygon:null,
          sector:null
        };     
    },

    /*
    *销毁绘制
    */     
    disable:function(){
       for(var tool in this.Tools){
          if(this.Tools[tool] !== null){
              this.Tools[tool].disable();
          }
       }
    },

    /*
    *清除绘制结果
    */
    clear:function(){
             
    },

    /*
    *callback {Function} 绘制完成回调函数
    *context {Object} 回调上下文对象
    *绘点
    */
    point:function(callback,context){
      this.disable();
      if(this.Tools.point === null)
           this.Tools.point = new L.ICT.DrawPoint(this._map);
      this.Tools.point.enable(callback,context); 
    },

    /*
    *绘折线
    */
    polyline:function(callback,context){
      this.disable();
      if(this.Tools.polyline === null){
        this.Tools.polyline = new L.ICT.DrawPolyline(this._map);
      }
      this.Tools.polyline.enable(callback,context);
    },

    /*
    *绘线段
    */
    path:function(callback,context){
      this.disable();
      if(this.Tools.path === null)
        this.Tools.path = new L.ICT.DrawPath(this._map);
      this.Tools.path.enable(callback,context);
    },

    /*
    *绘圆
    */
    circle:function(callback,context){
      this.disable();
      if(this.Tools.circle === null)
        this.Tools.circle = new L.ICT.DrawCircle(this._map);
      this.Tools.circle.enable(callback,context);
    },
    /*
    *绘矩形
    */
    rectangle:function(callback,context){       
      this.disable();
      if(this.Tools.rectangle === null)
           this.Tools.rectangle = new L.ICT.DrawRectangle(this._map);
      this.Tools.rectangle.enable(callback,context);       
    },

    /*
    *绘多边形
    */     
    polygon:function(callback,context){
       this.disable();
       if(this.Tools.polygon === null)
          this.Tools.polygon = new L.ICT.DrawPolygon(this._map);          
        this.Tools.polygon.enable(callback,context);
    },

    /*
    *绘扇形
    */     
    sector:function(callback,context){
       
    }

  });

  /*绘制点类*/
  L.ICT.DrawPoint = L.Draw.Marker.extend({

      options: {
          clickable: false,
          repeatMode: false,
          declaredClass: 'DrawPoint'
      },

      initialize: function () {
          L.Draw.Marker.prototype.initialize.apply(this, arguments);
         // this.options.icon = new L.Icon({
              //iconUrl: L.ICT.App.symbol.pointSymbol.iconUrl,
             // iconSize: L.ICT.App.symbol.pointSymbol.iconSize,
              //iconAnchor: [L.ICT.App.symbol.pointSymbol.iconSize[0] / 2, L.ICT.App.symbol.pointSymbol.iconSize[1] + 10]
        //  });
         // this.options.opacity = L.ICT.App.symbol.pointSymbol.opacity;
      },

      enable: function (ictcallback,ictcontext) {
          L.Draw.Marker.prototype.enable.call(this);
          this.ictcallback = ictcallback;
          this.ictcontext = ictcontext;
      },

      addHooks: function () {   //添加事件监听
          this._map.on('mouseup', this.exist, this);
          L.Draw.Marker.prototype.addHooks.call(this);
      },

      removeHooks: function () {  //移除事件监听
          this._map.off('mouseup', this.exist, this);
          L.Draw.Marker.prototype.removeHooks.call(this);
      },

      exist: function (e) {
          if (e.originalEvent.button == 2) {
              this.disable();
          }
      },

      clone: function () {
          return L.marker(this.getLatLng(), this.options);
      },

      clear: function () {

      },

      _fireCreatedEvent: function () {  //绘制完成回调                 
          var layer = L.marker(this._marker.getLatLng(), this.options);          
          L.Draw.Marker.prototype._fireCreatedEvent.call(this);  
          typeof this.ictcallback === "function" ? this.ictcallback.apply(this.ictcontext || this, [{ layer: layer, layerType: this.type }]) : null;
      }

  });   

  /*绘制折线*/
  L.ICT.DrawPolyline = L.Draw.Polyline.extend({

      options: {
          repeatMode: false,
          showLength: false, // Whether to display distance in the tooltip
          clickable: false
      },

      initialize: function () {
          L.Draw.Polyline.prototype.initialize.apply(this, arguments);
          //this.options.drawError.color = L.ICT.App.symbol.polylineSymbol.color;
      },
      

      enable: function (ictcallback, ictcontext) {
          L.Draw.Polyline.prototype.enable.call(this);
          this.ictcallback = ictcallback;
          this.ictcontext = ictcontext;
      },

      addHooks: function () {
          this._map.on('mouseup', this.exist, this);
          L.Draw.Polyline.prototype.addHooks.call(this);
          // this.options.shapeOptions = {
          //     color: L.ICT.App.symbol.polylineSymbol.color,
          //     weight: L.ICT.App.symbol.polylineSymbol.weight,
          //     clickable: true,
          //     opacity: L.ICT.App.symbol.polylineSymbol.opacity,
          //     declaredClass: 'DrawPolyline'
          // };
      },

      removeHooks: function () {
          this._map.off('mouseup', this.exist, this);
          L.Draw.Polyline.prototype.removeHooks.call(this);
      },

      exist: function (e) {
          if (e.originalEvent.button == 2) {
              this.disable();
          }
      },

      clone: function () {
          return L.polyline(this.getLatLngs(), this.options);
      },

      clear: function () {
        
      },

      _fireCreatedEvent: function () {
        var lay = L.polyline(this._poly.getLatLngs(), this.options.shapeOptions); 
        L.Draw.Polyline.prototype._fireCreatedEvent.call(this);
        typeof this.ictcallback === "function" ? this.ictcallback.apply(this.ictcontext || this, [{ layer: lay, layerType: this.type }]) : null;        
      }

  });

  /*绘制线段*/
  L.ICT.DrawPath = L.Draw.SimpleShape.extend({

      statics:{
          TYPE: 'path',
          tooltip_start_txt: '点击拖动绘制直线',
          tooltip_end_txt:'释放鼠标完成绘制',
      },

      options: {
          repeatMode: false,         
          clickable: false
      },

      initialize: function (map,options) {
          L.Draw.SimpleShape.prototype.initialize.call(this,map,options);
          this.type = L.ICT.DrawPath.TYPE;
          this._initialLabelText = L.ICT.DrawPath.tooltip_start_txt;
          this._endLabelText = L.ICT.DrawPath.tooltip_end_txt;         
      },

      enable: function (ictcallback, ictcontext) {
          L.Draw.SimpleShape.prototype.enable.call(this);
          this.ictcallback = ictcallback;
          this.ictcontext = ictcontext;
      },

      addHooks: function () {
          this._map.on('mouseup', this.exist, this);
          L.Draw.SimpleShape.prototype.addHooks.call(this);
          // this.options.shapeOptions = {
          //     color: L.ICT.App.symbol.polylineSymbol.color,
          //     weight: L.ICT.App.symbol.polylineSymbol.weight,
          //     clickable: false,
          //     opacity: L.ICT.App.symbol.polylineSymbol.opacity,
          //     declaredClass: 'DrawPath'
          // };
      },

      removeHooks: function () {
          this._map.off('mouseup', this.exist, this);
          L.Draw.SimpleShape.prototype.removeHooks.call(this);
      },

      exist: function (e) {
          if (e.originalEvent.button == 2) {
              this.disable();
          }
      },

      clone: function () {
          return L.polyline(this.getLatLngs(), this.options);
      },

      clear: function () {

      },

      _drawShape: function (latlng) {
          if (!this._shape) {
              this._shape = new L.Polyline([this._startLatLng, latlng], this.options.shapeOptions);
              this._map.addLayer(this._shape);
          } else {
              this._shape.setLatLngs([this._startLatLng, latlng]);
          }
      },

      _fireCreatedEvent: function () {       
          var path = new L.Polyline(this._shape.getLatLngs(), this.options.shapeOptions);          
          L.Draw.SimpleShape.prototype._fireCreatedEvent.call(this);
          typeof this.ictcallback === "function" ? this.ictcallback.apply(this.ictcontext || this, [{ layer: path, layerType: this.type }]) : null;
      }

  });

  /*绘制面*/
  L.ICT.DrawPolygon = L.Draw.Polygon.extend({

      options: {
          repeatMode: false,
          showArea: false,
          clickable: false
      },

      initialize: function () {
          L.Draw.Polygon.prototype.initialize.apply(this, arguments);
      },

      enable: function (ictcallback, ictcontext) {
          L.Draw.Polygon.prototype.enable.call(this);
          this.ictcallback = ictcallback;
          this.ictcontext = ictcontext;
      },

      addHooks: function () {
          this._map.on('mouseup', this.exist, this);
          L.Draw.Polygon.prototype.addHooks.call(this);

          // this.options.shapeOptions = {
          //     color: L.DCI.App.symbol.polygonSymbol.color,
          //     weight: L.DCI.App.symbol.polygonSymbol.weight,
          //     opacity: L.DCI.App.symbol.polygonSymbol.opacity,
          //     fill: false,       
          //     clickable: true,
          //     declaredClass: 'DrawPolygon2',
          // };
      },

      removeHooks: function () {
          this._map.off('mouseup', this.exist, this);
          L.Draw.Polygon.prototype.removeHooks.call(this);
      },

      exist: function (e) {
          if (e.originalEvent.button == 2) {
              this.disable();
          }
      },

      clone: function () {
          return L.polygon(this.getLatLngs(), this.options);
      },

      clear: function () {

      },

      _fireCreatedEvent: function () {      
          var lay = L.polygon(this._poly.getLatLngs(), this.options.shapeOptions);         
          L.Draw.Polygon.prototype._fireCreatedEvent.call(this); //通知地图    
          typeof this.ictcallback === "function" ? this.ictcallback.apply(this.ictcontext || this, [{ layer: lay, layerType: this.type }]) : null;
         
      }

  });

  /*绘制圆*/
  L.ICT.DrawCircle = L.Draw.Circle.extend({

      options: {
          repeatMode: false,
          showRadius: true,
          clickable: false
      },

      initialize: function () {
          L.Draw.Circle.prototype.initialize.apply(this, arguments);
          // this.options.shapeOptions = {
          //     color: L.DCI.App.symbol.polygonSymbol.color,
          //     weight: L.DCI.App.symbol.polygonSymbol.weight,
          //     opacity: L.DCI.App.symbol.polygonSymbol.opacity,
          //     fill: L.DCI.App.symbol.polygonSymbol.fill,
          //     fillColor: L.DCI.App.symbol.polygonSymbol.fillColor, //same as color by default
          //     fillOpacity: L.DCI.App.symbol.polygonSymbol.fillOpacity,
          //     clickable: false,
          //     declaredClass: 'DrawCircle2'
          // };
      },

      enable: function (ictcallback, ictcontext) {
          L.Draw.Circle.prototype.enable.call(this);
          this.ictcallback = ictcallback;
          this.ictcontext = ictcontext;
      },

      addHooks: function () {
          this._map.on('mouseup', this.exist, this);
          L.Draw.Circle.prototype.addHooks.apply(this, arguments);
      },

      removeHooks: function () {
          this._map.off('mouseup', this.exist, this);
          L.Draw.Circle.prototype.removeHooks.apply(this, arguments);
      },

      exist: function (e) {
          if (e.originalEvent.button == 2) {
              this.disable();
          }
      },

      clone: function () {
          return new L.Circle(this.getLatLng(), this.getRadius(), this.options);
      },

      clear: function () {

      },

      _fireCreatedEvent: function () {
          var lay = new L.Circle(this._startLatLng, this._shape.getRadius(), this.options);
          L.Draw.Circle.prototype._fireCreatedEvent.call(this);
          typeof this.ictcallback === "function" ? this.ictcallback.apply(this.ictcontext || this, [{ layer: lay, layerType: this.type }]) : null;
      }

  });

  /*绘制矩形类*/
  L.ICT.DrawRectangle = L.Draw.Rectangle.extend({

      options: {
          repeatMode: false,
          clickable: false
      },

      initialize: function () {
          L.Draw.Rectangle.prototype.initialize.apply(this, arguments);
          // this.options.shapeOptions = {
          //     color: L.ICT.App.symbol.polygonSymbol.color,
          //     weight: L.ICT.App.symbol.polygonSymbol.weight,
          //     opacity: L.ICT.App.symbol.polygonSymbol.opacity,
          //     fill: false,           
          //     clickable: false,
          //     declaredClass: 'DrawRectangle2'
          // };
      },

      enable: function (ictcallback, ictcontext) {
          L.Draw.Rectangle.prototype.enable.call(this);
          this.ictcallback = ictcallback;
          this.ictcontext = ictcontext;
      },

      addHooks: function () {
          this._map.on('mouseup', this.exist, this);
          L.Draw.Rectangle.prototype.addHooks.apply(this, arguments);
      },

      removeHooks: function () {
          this._map.off('mouseup', this.exist, this);
          L.Draw.Rectangle.prototype.removeHooks.apply(this, arguments);
      },

      exist: function (e) {
          if (e.originalEvent.button == 2) {
              this.disable();
          }
      },

      clone: function () {
          return new L.Rectangle(this.getBounds(), this.options);
      },

      clear: function () {

      },

      _fireCreatedEvent: function () {
          var lay = new L.Rectangle(this._shape.getBounds(), this.options.shapeOptions);          
          L.Draw.Rectangle.prototype._fireCreatedEvent.call(this);
          typeof this.ictcallback === "function" ? this.ictcallback.apply(this.ictcontext || this, [{ layer: lay, layerType: this.type }]) : null;
      }
      
  });


});

