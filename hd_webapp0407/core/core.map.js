/*
*地图类
*/
define("core/map",[
	  "leaflet",
	  "core/baseobject",
    "leaflet/chartLayer",
    "leaflet/googleLayer",
    "esri/leaflet",
    "data/ajax",   
    "control/draw",
    "control/layerswitch",   
    "func/realTarget",
    "func/portInfo"

],function(L){

    /*地图类*/	
    L.ICT.Map = L.ICT.BaseObject.extend({
          
          //地图对象
  		    map:null,

          //底图
  		    _baseLayer:null,
          
          //地图绘制
  	     _drawTool:null,  
          
          //实时目标类对象
          realtarget:null,

          //港口图层对象
          portlayer:null,
          
          //地图操作状态
          OperateState:{
              tshf:false,//态势回放
              hjcx:false, //航迹查询
              heatmap:false //热力图
          },

      		initialize:function(options){
        			L.setOptions(this,options);
              this.ajax = new L.ICT.Ajax();
        			var center = options.MapOptions.center,
        			    zoom = options.MapOptions.zoom,
        			    minZoom = options.MapOptions.minZoom,
        			    maxZoom = options.MapOptions.maxZoom;

              //地图对象
              var crs =  L.CRS.EPSG3857;
              this.options.changeLayers.forEach(function(i,obj,arr){
                  if(obj.id === 'baseLayer-ocean' && obj.active){
                     crs = L.CRS.EPSG3395;
                  }
              });
        			var map = L.map('mappanel', {
        					center:L.latLng(center),
        					zoom: zoom,
        					minZoom: minZoom,
        					maxZoom: maxZoom,
                  crs:crs,
                  // crs: L.CRS.EPSG3857, //google准确，海图不准 (WGS 84 Pseudo-Mercator -- Spherical Mercator, Google Maps, OpenStreetMap, Bing, ArcGIS, ESRI)
                  // crs:L.CRS.EPSG3395, //海图准确，google不准 (WGS 84 / World Mercator)
        					zoomControl: false,
        					attributionControl: false,
        					closePopupOnClick: false,
        					doubleClickZoom:false,
                  continuousWorld: true,
                  maxBounds:L.latLngBounds(L.latLng(-90,-180),L.latLng(90,180)),
                  renderer: new L.VectorLabelCanvas()
        			});

              //底图切换
              for(var i=0;i<this.options.changeLayers.length;i++){
                  var obj = this.options.changeLayers[i];
                  switch (obj.id){
                      case "baseLayer-ocean":
                           obj.layer = L.tileLayer.ChartLayer(null,{id:obj.id,opacity:0});
                           break;
                      case "baseLayer-googleRoadMap":
                           obj.layer = L.tileLayer.GoogleLayer(null,{id:obj.id,lyrs:'m',opacity:0});// m地图
                           break;
                      case "baseLayer-gooleSatellite":
                           obj.layer = L.tileLayer.GoogleLayer(null,{id:obj.id,lyrs:'y',opacity:0});// y带标签的卫星图
                           break;
                      default: ;
                  }
                  map.addLayer(obj.layer);
                  if(obj.active){
                      this._baseLayer = obj.layer;
                  }
              }
           
              if(this._baseLayer){
                  this._baseLayer.setOpacity(1);
               }
    		      this.map = map;

              //地图控件
              new L.ICT.Control.LayerSwitch()
                 .addTo(this.map)
                 .on("baseLayerChangeEvent",function(e){
                     var layer = e.curBaseLayer;
                     var oldlayer =  this.getBaseLayer();
                     this.setBaseLayer(e.curBaseLayer);
                     //google切换到海图
                     if(layer.options.id === 'baseLayer-ocean'){  
                         var center = this.map.getCenter();
                         this.map.options.crs = L.CRS.EPSG3395;
                         this.map.panTo(center);
                         this.realtarget.reloadTargets();                     
                         this.portlayer.reloadPortLayer();  

                     }  else if(oldlayer.options.id === 'baseLayer-ocean'){ 
                        //海图切换到google
                         var center = this.map.getCenter();
                         this.map.options.crs = L.CRS.EPSG3857;
                         this.map.panTo(center);
                         this.realtarget.reloadTargets();                     
                         this.portlayer.reloadPortLayer();                   
                     }

                  },this);
              L.control.zoom({position:'topright'}).addTo(this.map);
              L.control.scale({position:'bottomleft'}).addTo(this.map);
              this._attrcontrol = L.control.attribution({position:'bottomright',prefix:false}).addTo(this.map);

              //地图事件
              this.map.on("movestart",this._movestartEvt,this)
                      .on("click",this._mapClickEvt,this)
                      .on("mousemove",this._mousemoveEvt,this)
                      .on("moveend",this._moveendEvt,this);             
              
              //其他
              this.portlayer = new L.ICT.PortInfo(this);
              this.realtarget = new L.ICT.RealTarget(this);              
              this.realtarget.addRealTargetLayer();   
              this.realtarget.initContextMenu();    

              //test
              // var url = 'http://localhost:6080/arcgis/rest/services/MyMapService2/MapServer';
              // L.esri.dynamicMapLayer({
              //   url: url
              // }).addTo(this.map);         
      		},

          pointChinge:function(pon) {
              Proj4js.defs["EPSG:4326"] = "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs ";
              Proj4js.defs["EPSG:41001"] = "+title=simple mercator EPSG:41001 +proj=merc +lat_ts=0 +lon_0=0 +k=1.000000 +x_0=0 +y_0=0 +ellps=WGS84 +datum=WGS84 +units=m";
              var sourceProj = new Proj4js.Proj("WGS84");
              var destProj = new Proj4js.Proj("EPSG:41001");
              Proj4js.transform(destProj, sourceProj, pon);
              return pon;
          },

          _movestartEvt:function(e){
             this._moverstartBounds  =  e.target.getBounds();    
             this._startzoom = e.target.getZoom();   
             this._startcenter = e.target.getCenter();
          },

          _mousemoveEvt:function(e){
              var latlng = e.latlng;
              var lat = L.ict.app.util.tool.latlngTodfmStr(latlng.lat,'lat');
              var lng = L.ict.app.util.tool.latlngTodfmStr(latlng.lng,'lng');
              var lattip = $.i18n.prop('common_ship_lat');
              var lngtip = $.i18n.prop('common_ship_lng');
              var html = [];
              if(Project_ParamConfig.lang === 'en'){
                 html.push('<table style="width:260px;">');
              } else{
                 html.push('<table style="width:230px;">');
              }
              html.push('<tr>');
              html.push('<td style="width:16%;">'+ lngtip +'</td>');
              html.push('<td style="width:34%;">'+ lng +'</td>');
              html.push('<td style="width:16%;">'+ lattip +'</td>');
              html.push('<td style="width:34%;">'+ lat +'</td>');
              html.push('</tr>');
              html.push('</table>');
              html = html.join('');
              if(this._attrcontrol){
                  var container = this._attrcontrol.getContainer();
                  $(container).html(html);
              }
          },

          _moveendEvt:function(e){
             if(this.hasPoppanel()) {return;}
             if(!this.realtarget){return;}
             if(this.OperateState.tshf){return;}
             if(this.OperateState.hjcx){return;}         
             if(this.OperateState.heatmap){return;}

             this._moveendBounds =  e.target.getBounds();
             this._endzoom = e.target.getZoom();
             this._endcenter = e.target.getCenter();

             this._moverstartBoundsExtend = this._moverstartBounds.pad(this.realtarget.config.bufferRatio);
             this._moveendBoundsExtend = this._moveendBounds.pad(this.realtarget.config.bufferRatio);

             //港口处理
             this.portlayer.showOrHidePortLayer();

             //范围无变化
             if(this._endzoom === this._startzoom && this._startcenter.equals(this._endcenter)){
                 
             }           
             //范围平移
             else if(this._endzoom === this._startzoom && !this._startcenter.equals(this._endcenter)){
                  if(this._endzoom >= this.realtarget.config.showLevel){
                      //相交
                      if(this._moveendBoundsExtend.intersects(this._moverstartBoundsExtend)){
                          // this.realtarget.sendMsg();
                          this.realtarget.getRealTarget();                        
                      } else{ //相离
                          this.realtarget.getRealTarget();
                      }

                  }

             }
             //范围缩放
             else {           
                 if(this._startzoom < this.realtarget.config.showLevel && this._endzoom < this.realtarget.config.showLevel){
                    //缩放前后都是绿点图
                    return ;

                 }else if(this._startzoom >= this.realtarget.config.showLevel && this._endzoom >= this.realtarget.config.showLevel){
                    //缩放前后都是实时船舶图
                    //范围放大
                     if(this._endzoom > this._startzoom){
                         // this.realtarget.sendMsg();
                         this.realtarget.getRealTarget(); 
                     }
                     //范围缩小
                     if(this._endzoom < this._startzoom){
                         // this.realtarget.sendMsg();
                          this.realtarget.getRealTarget();                                               
                     }

                 }else if (this._startzoom < this.realtarget.config.showLevel && this._endzoom >= this.realtarget.config.showLevel){
                    //缩放前是绿点图，缩放后是实时图
                    // this.realtarget.hideShipDistLayer();
                    // this.realtarget.showRealTargetLayer();

                    this.realtarget.hideShipDistLayer();
                    this.realtarget.showRealTargetLayer();


                 }else if (this._startzoom >= this.realtarget.config.showLevel && this._endzoom < this.realtarget.config.showLevel){
                    //缩放前是实时图，缩放后是绿点图
                    // this.realtarget.hideRealTargetLayer();
                    // this.realtarget.showShipDistLayer();
                    
                    this.realtarget.hideRealTargetLayer();
                    this.realtarget.showShipDistLayer();
                 }            
             }
     
          },

          _mapClickEvt:function(e){
             // console.log(JSON.stringify(e.latlng));
             // L.ict.app.menu.submenu.hide();
          },
          
          /**
          *激活鼠标状态
          *@method activate
          *@param type {string} 鼠标状态类型
          *@param callback {Object}  回调函数
          *@param precall {Object} 激活后执行函数
          *@param context {Object} 当前上下文
          */
          activate:function(type,callback,precall,context){
              this.deactivate();
              this.setCursor(type);
              switch(type){
              	case L.ICT.MapMouseState.PAN:
              	     ;
              	     break;

              	case L.ICT.MapMouseState.ZOOM_IN:
              	     this.map.zoomIn();
              	     break;

              	case L.ICT.MapMouseState.ZOOM_OUT:
              	     this.map.zoomOut();
              	     break;

              	case L.ICT.MapMouseState.POINT:
              	     if(this._drawTool == null)
              	     	 this._drawTool = new L.ICT.Draw(this.map);
              	      this._drawTool.point(callback,context);
              	      break;

              	case L.ICT.MapMouseState.POLYLINE:
              	     if(this._drawTool == null)
              	        this._drawTool = new L.ICT.Draw(this.map);
              	     this._drawTool.polyline(callback,context);
              	     break;

              	case L.ICT.MapMouseState.PATH:
              	     if(this._drawTool == null)
              	        this._drawTool = new L.ICT.Draw(this.map);
              	     this._drawTool.path(callback,context); 
              	     break;

              	case L.ICT.MapMouseState.CIRCLE:
              	     if(this._drawTool == null)
              	        this._drawTool = new L.ICT.Draw(this.map);
              	     this._drawTool.circle(callback,context);   
              	     break;  

              	case L.ICT.MapMouseState.RECTANGLE:
              	     if(this._drawTool == null)
              	        this._drawTool = new L.ICT.Draw(this.map);
              	     this._drawTool.rectangle(callback,context); 
              	     break;

              	case L.ICT.MapMouseState.POLYGON:
              	     if(this._drawTool == null)
              	        this._drawTool = new L.ICT.Draw(this.map);
              	     this._drawTool.polygon(callback,context); 
              	     break;

              	 case L.ICT.MapMouseState.MEASURELEN:
              	      ;
              	      break;

              	 case L.ICT.MapMouseState.MEASUREAREA:
              	      ;
              	      break;

              	 default:;break;            	     
              }
              if(precall != null){
              	precall();
              }
              this.status = type;
          },
           
          /**
          *重置鼠标状态
          *@method deactivate
          */
          deactivate:function(){
              if(this._drawTool) this._drawTool.disable();
              //清除地图事件
              //....
              //重置鼠标状态
              this.setCursor(L.ICT.MapMouseState.PAN);
          },

          /*设置鼠标状态*/
          setCursor: function (type) {
              if (type == L.ICT.MapMouseState.PAN) {
                  this.map.getContainer().style.cursor = "";
              } else {
                  this.map.getContainer().style.cursor = "default";
              }

          },
          
          /*设置鼠标状态样式*/
          setCursorImg: function (cursorImg) {
              if (cursorImg != undefined)
                  this.map.getContainer().style.cursor = "url(themes/images/cursor/"+cursorImg+"),auto";
              else
                  this.map.getContainer().style.cursor = "";
          },
          
          //获取底图
          getBaseLayer:function(){
              return this._baseLayer;
          },
          
          //设置底图
          setBaseLayer:function(baselayer){
              this._baseLayer = baselayer;
          },
          
          //获取地图对象
        	getMap:function(){
        	   	return this.map;
        	},

          getCurZoom:function(){
              return this.map.getZoom();
          },

          getMinZoom:function(){
              return this.map.getMinZoom();
          },

          getMaxZoom:function(){
              return this.map.getMaxZoom();
          },

          getBounds:function(){
              return this.map.getBounds();
          },

          getBoundsExtend:function(){
              return this.map.getBounds().pad(Project_ParamConfig.RealTargetConfig.bufferRatio);
          },        

          hasPoppanel:function(){
              if(this.map.getPane("popupPane").innerHTML == ""){
                  return false;
              }else{
                  return true;
              }
          }
  	});

    /*鼠标状态*/
    L.ICT.MapMouseState = {

    	PAN:'pan',

    	ZOOM_IN:'zoom_in',

    	ZOOM_OUT:'zoom_out',

    	POINT:'point',

    	PATH:'path',

    	POLYLINE:'polyline',

    	CIRCLE:'circle',

    	RECTANGLE:'rectangle',

    	POLYGON: "polygon",

    	MEASURELEN: "measurelen",

    	MEASUREAREA: 'meausrearea'
    };

    /*船舶图标*/
    L.ICT.ShipIcon = {

        ship1: L.icon({
            iconUrl: 'themes/images/filterdisplay/shipTypeList_1.png',
            iconSize: [10, 22],  //图标的大小，格式，第一个参数是宽度，第二个参数是高度
            iconAnchor: [5, 11] //图标显示位置，例如宽度和高度是图标大小的一半，则经纬度的点正好在图标的中心点
        }),

        ship2: L.icon({
            iconUrl: 'themes/images/filterdisplay/shipTypeList_100.png',
            iconSize: [10, 22],  //图标的大小，格式，第一个参数是宽度，第二个参数是高度
            iconAnchor: [5, 11] //图标显示位置，例如宽度和高度是图标大小的一半，则经纬度的点正好在图标的中心点
        }),

        ship3: L.icon({
            iconUrl: 'themes/images/filterdisplay/shipTypeList_3.png',
            iconSize: [10, 22],  //图标的大小，格式，第一个参数是宽度，第二个参数是高度
            iconAnchor: [5, 11] //图标显示位置，例如宽度和高度是图标大小的一半，则经纬度的点正好在图标的中心点
        }),

        ship4: L.icon({
            iconUrl: 'themes/images/filterdisplay/shipTypeList_4.png',
            iconSize: [10, 22],  //图标的大小，格式，第一个参数是宽度，第二个参数是高度
            iconAnchor: [5, 11] //图标显示位置，例如宽度和高度是图标大小的一半，则经纬度的点正好在图标的中心点
        }),

        ship5: L.icon({
            iconUrl: 'themes/images/filterdisplay/shipTypeList_5.png',
            iconSize: [10, 22],  //图标的大小，格式，第一个参数是宽度，第二个参数是高度
            iconAnchor: [5, 11] //图标显示位置，例如宽度和高度是图标大小的一半，则经纬度的点正好在图标的中心点
        }),

        ship6: L.icon({
            iconUrl: 'themes/images/filterdisplay/shipTypeList_6.png',
            iconSize: [10, 22],  //图标的大小，格式，第一个参数是宽度，第二个参数是高度
            iconAnchor: [5, 11] //图标显示位置，例如宽度和高度是图标大小的一半，则经纬度的点正好在图标的中心点
        }),

        ship7: L.icon({
            iconUrl: 'themes/images/filterdisplay/shipTypeList_7.png',
            iconSize: [10, 22],  //图标的大小，格式，第一个参数是宽度，第二个参数是高度
            iconAnchor: [5, 11] //图标显示位置，例如宽度和高度是图标大小的一半，则经纬度的点正好在图标的中心点
        }),

        ship8: L.icon({
            iconUrl: 'themes/images/filterdisplay/shipTypeList_8.png',
            iconSize: [10, 22],  //图标的大小，格式，第一个参数是宽度，第二个参数是高度
            iconAnchor: [5, 11] //图标显示位置，例如宽度和高度是图标大小的一半，则经纬度的点正好在图标的中心点
        }),

        ship100: L.icon({
            iconUrl: 'themes/images/filterdisplay/shipTypeList_100.png',
            iconSize: [10, 22],  //图标的大小，格式，第一个参数是宽度，第二个参数是高度
            iconAnchor: [5, 11] //图标显示位置，例如宽度和高度是图标大小的一半，则经纬度的点正好在图标的中心点
        }),        

        close:L.icon({
                  iconUrl: 'images/dialog/hjxs_close.png',
                  iconSize: [18, 18],  //图标的大小，格式，第一个参数是宽度，第二个参数是高度
                  iconAnchor: [28, 14] // 图标显示位置，例如宽度和高度是图标大小的一半，则经纬度的点正好在图标的中心点 
              })
    };

});
