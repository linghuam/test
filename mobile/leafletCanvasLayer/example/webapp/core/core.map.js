define("core/map", [
    "leaflet",
    "core/baseobject",
    "core/namespace",
    "leaflet/chartLayer",
    "leaflet/weatherLayer",
    "leaflet/shipDistLayer",
    "leaflet/rasterLayer",
    "leaflet/googleLayer",
    "control/draw",
    // "control/fullscreen",
    "func/realTarget",
    "func/portInfo",
    "data/ajax",
    "control/measure",
    "plugins/contextmenu"

], function(L) {

    /*地图类*/
    L.ICT.Map = L.ICT.BaseObject.extend({

        //地图对象
        map: null,

        //底图
        _baseLayer: null,

        //地图绘制
        _drawTool: null,

        //实时目标类对象
        realtarget: null,

        //港口信息
        portlayer: null,

        //标牌显示的类型
        labelType: null, // 值有‘shipname’ ，‘id’

        //地图操作状态
        OperateState: {
            tshf: false, //态势回放
            hjcx: false, //航迹查询
            port: false, //港口信息
            wjfx: false, //挖掘分析
            wjfx_hdyc: false //活动预测

        },

        initialize: function(options) {
            L.setOptions(this, options);
            this.ajax = new L.ICT.Ajax();

            var center = options.baseLayer.center,
                zoom = options.baseLayer.zoom,
                minZoom = options.baseLayer.minZoom,
                maxZoom = options.baseLayer.maxZoom;

            //地图容器大小
            this._initMapStyle();

            //地图对象
            var map = new L.Map('mappanel', {
                center: new L.latLng(center),
                zoom: zoom,
                minZoom: minZoom,
                maxZoom: maxZoom,
                crs: L.CRS.EPSG3395,
                zoomControl: false,
                attributionControl: false,
                closePopupOnClick: false,
                doubleClickZoom: false,
                continuousWorld: true,
                maxBounds: L.latLngBounds(L.latLng(-90, -180), L.latLng(90, 180))
            });

            //底图图层
            var baseLayer = new L.tileLayer.ChartLayer("", {
                continuousWorld: false,
                id: options.baseLayer.id
            });
            map.addLayer(baseLayer);
            this.map = map;

            //地图控件
            L.control.zoom({ position: 'bottomright' }).addTo(this.map);
            L.control.scale({ position: 'bottomleft' }).addTo(this.map);

            //地图事件
            this.map.on("movestart", this._movestartEvt, this)
                .on("moveend", this._moveendEvt, this)
                .on("contextmenu", this._mapContextMenuEvt, this);

            //实时目标
            this.realtarget = new L.ICT.RealTarget(this);
            this.realtarget.addRealTargetLayer();

            //初始化目标右键菜单
            this.realtarget.initContextMenu();
            this._initMapContextMenu();

            //地图量测
            this.measureTool = new L.ICT.Measure.Length(this.map, null);

            //窗口变化时地图大小变化
            $(window).resize(function() {
                this._initMapStyle();
                this.map.invalidateSize(false);
            }.bind(this));

            /******************栅格图test -start******************/
            // map.addLayer( L.gridLayer.rasterLayer({
            //     opacity:0.5,//定义栅格图层的透明度
            //     tileSize:64,//定义栅格的大小，单位为：像素
            //     minZoom:0,//定义显示的最小级别
            //     maxZoom:18,//定义显示的最大级别
            //     bounds:L.latLngBounds(L.latLng(-90,-180),L.latLng(90,180)) //定义显示栅格的区域
            // }) );  
            /******************栅格图test -end******************/

            /******************水文气象test -start******************/

            // L.tileLayer.weatherLayer("",{}).addTo(map);

            // L.GridLayer.DebugCoords = L.GridLayer.extend({
            //     createTile: function (coords) {
            //         var tile = document.createElement('div');
            //         tile.innerHTML = [coords.x, coords.y, coords.z].join(', ');
            //         tile.style.outline = '1px solid red';
            //         if(coords.x == 24) tile.style.backgroundColor = "#f00";
            //         return tile;
            //     }
            // });

            // L.gridLayer.debugCoords = function(opts) {
            //     return new L.GridLayer.DebugCoords(opts);
            // };

            // map.addLayer( L.gridLayer.debugCoords() );      

            /******************水文气象test -end**********************/

            
            // var self = this;
            // $.getJSON('data/data.json', function(res) {
            //     var data = res.msg.data;
            //     var options = { width: 10, height: 22, stroke: false, color: '#ef0300', fillColor: '#ef0300', fillOpacity: 1, radius: 4, pane: 'markerPane', className: 'leaflet-shipmarker' };
            //     var layers = [];
            //     console.time("render");
            //     for (var i = 0, len = data.length; i < len; i++) {
            //         var obj = data[i];

            //         var latlng = L.latLng(obj.lat, obj.lon);
            //         options.data = obj.v;
            //         var circlemarker = L.shipVector(latlng, options);
            //         circlemarker.on("click", function(e) {
            //             alert(e.target.options.data);
            //         }, this);
            //         circlemarker.bindTooltip('shipship');
            //         layers.push(circlemarker);
            //     }
            //     L.featureGroup(layers).addTo(self.map);
            //     console.timeEnd("render");
            // });

        },

        _initMapStyle: function() {
            var bodyHeight = $('.container-fluid').outerHeight();
            var topHeight = $('#toppanel').outerHeight();
            var height = bodyHeight - topHeight;
            var width = $('.container-fluid').outerWidth();
            $('#mappanel').height(height);
            $('#mappanel').width(width);
        },

        _initMapContextMenu: function() {
            var self = this;
            $.contextMenu({
                selector: '#mappanel',
                trigger: 'none',
                zIndex: 99999,
                className: 'ict_contextmenu_map',
                callback: function(key, options) {
                    self._rightClickCallback(key, options);
                },
                items: {
                    "bpxs": {
                        "name": "标牌显示",
                        "items": {
                            "bpxs-shipname": { "name": "船名" },
                            "bpxs-ph": { "name": "批号" },
                            "bpxs-close": { "name": "关闭显示" }
                        }
                    },
                    "hqdw": {
                        "name": "海区定位",
                        "items": {
                            "hqdw-key1": { "name": "东黄海区" },
                            "hqdw-key2": { "name": "东南沿海海区" },
                            "hqdw-key3": { "name": "南海北部海区" },
                            "hqdw-key4": { "name": "南沙海区" }
                        }
                    },
                    "jlls": { "name": "距离量算" }
                }
            });
        },

        _rightClickCallback: function(key, options) {
            switch (key) {
                case "bpxs-shipname":
                    this.realtarget.labelAllShip('shipname');
                    this.labelType = 'shipname';;
                    break;
                case "bpxs-ph":
                    this.realtarget.labelAllShip('id');
                    this.labelType = 'id';;
                    break;
                case "bpxs-close":
                    this.realtarget.hideAlllabel();
                    this.labelType = null;;
                    break;
                case "hqdw-key1":
                    this.locateToArea('DH');;
                    break;
                case "hqdw-key2":
                    this.locateToArea('DN');;
                    break;
                case "hqdw-key3":
                    this.locateToArea('NH');;
                    break;
                case "hqdw-key4":
                    this.locateToArea('NS');;
                    break;
                case "jlls":
                    this.measureTool.disable();
                    this.measureTool.enable();;
                    break;
                default:
                    ;
            }
        },

        _movestartEvt: function(e) {
            this._moverstartBounds = e.target.getBounds();
            this._startzoom = e.target.getZoom();
            this._startcenter = e.target.getCenter();
        },

        _moveendEvt: function(e) {
            if (this.hasPoppanel()) {
                return; }
            if (this.OperateState.tshf) {
                return; }
            // if(this.OperateState.hjcx){return;}
            // if(this.OperateState.port){return;}
            if (this.OperateState.wjfx) {
                return; }
            if (this.OperateState.wjfx_hdyc) {
                return; }

            this._moveendBounds = e.target.getBounds();
            this._endzoom = e.target.getZoom();
            this._endcenter = e.target.getCenter();

            this._moverstartBoundsExtend = this._moverstartBounds && this._moverstartBounds.pad(this.realtarget.config.bufferRatio);
            this._moveendBoundsExtend = this._moveendBounds.pad(this.realtarget.config.bufferRatio);

            this._startzoom = this._startzoom || this.map.getZoom();
            this._startcenter = this._startcenter || this.map.getCenter();

            //范围无变化
            if (this._endzoom === this._startzoom && this._startcenter.equals(this._endcenter)) {

            }
            //范围平移
            else if (this._endzoom === this._startzoom && !this._startcenter.equals(this._endcenter)) {
                if (this._endzoom >= this.realtarget.config.showLevel) {
                    //相交
                    if (this._moveendBoundsExtend.intersects(this._moverstartBoundsExtend)) {
                        // this.realtarget.sendMsg();
                        this.realtarget.getRealTarget();                        
                    } else { //相离
                        this.realtarget.getRealTarget();
                    }

                }

            }
            //范围缩放
            else {
                if (this._startzoom < this.realtarget.config.showLevel && this._endzoom < this.realtarget.config.showLevel) {
                    //缩放前后都是绿点图
                    return;

                } else if (this._startzoom >= this.realtarget.config.showLevel && this._endzoom >= this.realtarget.config.showLevel) {
                    //缩放前后都是实时船舶图
                    //范围放大
                    if (this._endzoom > this._startzoom) {
                        this.realtarget.getRealTarget();
                        // this.realtarget.sendMsg();
                    }
                    //范围缩小
                    if (this._endzoom < this._startzoom) {
                        // this.realtarget.sendMsg();
                        this.realtarget.getRealTarget();
                    }

                } else if (this._startzoom < this.realtarget.config.showLevel && this._endzoom >= this.realtarget.config.showLevel) {
                    //缩放前是绿点图，缩放后是实时图

                    this.realtarget.hideShipDistLayer();
                    this.realtarget.showRealTargetLayer();
                    this.realtarget.getRealTarget();
                    // this.realtarget.hideShipDistLayer();
                    // this.realtarget.getRealTarget();

                } else if (this._startzoom >= this.realtarget.config.showLevel && this._endzoom < this.realtarget.config.showLevel) {
                    //缩放前是实时图，缩放后是绿点图
                    this.realtarget.hideRealTargetLayer();
                    this.realtarget.showShipDistLayer();

                    // this.realtarget.removeRealTargetLayer();
                    // this.realtarget.showShipDistLayer();
                }
            }
        },

        _mapContextMenuEvt: function(e) {
            // console.log("contextmenu");
            var mapcontainer = this.map.getContainer();
            var x = e.containerPoint.x + mapcontainer.offsetLeft;
            var y = e.containerPoint.y + mapcontainer.offsetTop;
            //调出右键菜单 
            if ($('.leaflet-marker-rightclick-icon').length > 0) {
                $('.leaflet-marker-rightclick-icon').contextMenu(false);
            }
            $('#mappanel').contextMenu(true);
            $('#mappanel').contextMenu({ x: x, y: y });
        },

        /**
         *激活鼠标状态
         *@method activate
         *@param type {string} 鼠标状态类型
         *@param callback {Object}  回调函数
         *@param precall {Object} 激活后执行函数
         *@param context {Object} 当前上下文
         */
        activate: function(type, callback, precall, context) {
            this.deactivate();
            this.setCursor(type);
            switch (type) {
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
                    if (this._drawTool == null)
                        this._drawTool = new L.ICT.Draw(this.map);
                    this._drawTool.point(callback, context);
                    break;

                case L.ICT.MapMouseState.POLYLINE:
                    if (this._drawTool == null)
                        this._drawTool = new L.ICT.Draw(this.map);
                    this._drawTool.polyline(callback, context);
                    break;

                case L.ICT.MapMouseState.PATH:
                    if (this._drawTool == null)
                        this._drawTool = new L.ICT.Draw(this.map);
                    this._drawTool.path(callback, context);
                    break;

                case L.ICT.MapMouseState.CIRCLE:
                    if (this._drawTool == null)
                        this._drawTool = new L.ICT.Draw(this.map);
                    this._drawTool.circle(callback, context);
                    break;

                case L.ICT.MapMouseState.RECTANGLE:
                    if (this._drawTool == null)
                        this._drawTool = new L.ICT.Draw(this.map);
                    this._drawTool.rectangle(callback, context);
                    break;

                case L.ICT.MapMouseState.POLYGON:
                    if (this._drawTool == null)
                        this._drawTool = new L.ICT.Draw(this.map);
                    this._drawTool.polygon(callback, context);
                    break;

                case L.ICT.MapMouseState.MEASURELEN:
                    ;
                    break;

                case L.ICT.MapMouseState.MEASUREAREA:
                    ;
                    break;

                default:
                    ;
                    break;
            }
            if (precall != null) {
                precall();
            }
            this.status = type;
        },

        /**
         *重置鼠标状态
         *@method deactivate
         */
        deactivate: function() {
            if (this._drawTool) this._drawTool.disable();
            //清除地图事件
            //....
            //重置鼠标状态
            this.setCursor(L.ICT.MapMouseState.PAN);
        },

        /*设置鼠标状态*/
        setCursor: function(type) {
            if (type == L.ICT.MapMouseState.PAN) {
                this.map.getContainer().style.cursor = "";
            } else {
                this.map.getContainer().style.cursor = "default";
            }
        },

        /*设置鼠标状态样式*/
        setCursorImg: function(cursorImg) {
            if (cursorImg != undefined)
                this.map.getContainer().style.cursor = "url(themes/images/cursor/" + cursorImg + "),auto";
            else
                this.map.getContainer().style.cursor = "";
        },

        //获取底图
        getBaseLayer: function() {
            return this._baseLayer;
        },

        //设置底图
        setBaseLayer: function(baselayer) {
            this._baseLayer = baselayer;
        },

        //获取地图对象
        getMap: function() {
            return this.map;
        },

        getCurZoom: function() {
            return this.map.getZoom();
        },

        getMinZoom: function() {
            return this.map.getMinZoom();
        },

        getMaxZoom: function() {
            return this.map.getMaxZoom();
        },

        getBounds: function() {
            return this.map.getBounds();
        },

        getBoundsExtend: function() {
            return this.map.getBounds().pad(Project_ParamConfig.RealTargetConfig.bufferRatio);
        },

        hasPoppanel: function() {
            if (this.map.getPane("popupPane").innerHTML == "") {
                return false;
            } else {
                return true;
            }
        },

        closePoppanel: function() {
            if (this.hasPoppanel) {
                this.map.closePopup();
            }

        },

        locateToArea: function(areaName) {
            switch (areaName) {
                case "DH":
                    var sw = L.latLng(25, 119);
                    var ne = L.latLng(37, 126);
                    var bounds = L.latLngBounds(sw, ne);
                    break;
                case "DN":
                    var sw = L.latLng(21, 113);
                    var ne = L.latLng(30, 126);
                    var bounds = L.latLngBounds(sw, ne);
                    break;
                case "NH":
                    var sw = L.latLng(14, 110);
                    var ne = L.latLng(20, 120);
                    var bounds = L.latLngBounds(sw, ne);
                    break;
                case "NS":
                    var sw = L.latLng(5, 109);
                    var ne = L.latLng(13, 119);
                    var bounds = L.latLngBounds(sw, ne);
                    break;
            }
            this.map.fitBounds(bounds);
        }

    });

    /*鼠标状态*/
    L.ICT.MapMouseState = {

        PAN: 'pan',

        ZOOM_IN: 'zoom_in',

        ZOOM_OUT: 'zoom_out',

        POINT: 'point',

        PATH: 'path',

        POLYLINE: 'polyline',

        CIRCLE: 'circle',

        RECTANGLE: 'rectangle',

        POLYGON: "polygon",

        MEASURELEN: "measurelen",

        MEASUREAREA: 'meausrearea'

    };

    /*船舶图标*/
    L.ICT.ShipIcon = {

        ship1: L.icon({
            iconUrl: 'themes/images/shipIcons/target_1.png',
            iconSize: [10, 22], //图标的大小，格式，第一个参数是宽度，第二个参数是高度
            iconAnchor: [5, 11] //图标显示位置，例如宽度和高度是图标大小的一半，则经纬度的点正好在图标的中心点
        }),

        ship2: L.icon({
            iconUrl: 'themes/images/shipIcons/target_2.png',
            iconSize: [10, 22], //图标的大小，格式，第一个参数是宽度，第二个参数是高度
            iconAnchor: [5, 11] //图标显示位置，例如宽度和高度是图标大小的一半，则经纬度的点正好在图标的中心点
        }),

        ship3: L.icon({
            iconUrl: 'themes/images/shipIcons/target_3.png',
            iconSize: [10, 22], //图标的大小，格式，第一个参数是宽度，第二个参数是高度
            iconAnchor: [5, 11] //图标显示位置，例如宽度和高度是图标大小的一半，则经纬度的点正好在图标的中心点
        }),

        ship4: L.icon({
            iconUrl: 'themes/images/shipIcons/target_4.png',
            iconSize: [10, 22], //图标的大小，格式，第一个参数是宽度，第二个参数是高度
            iconAnchor: [5, 11] //图标显示位置，例如宽度和高度是图标大小的一半，则经纬度的点正好在图标的中心点
        }),

        ship5: L.icon({
            iconUrl: 'themes/images/shipIcons/target_5.png',
            iconSize: [10, 22], //图标的大小，格式，第一个参数是宽度，第二个参数是高度
            iconAnchor: [5, 11] //图标显示位置，例如宽度和高度是图标大小的一半，则经纬度的点正好在图标的中心点
        }),

        ship6: L.icon({
            iconUrl: 'themes/images/shipIcons/target_6.png',
            iconSize: [10, 22], //图标的大小，格式，第一个参数是宽度，第二个参数是高度
            iconAnchor: [5, 11] //图标显示位置，例如宽度和高度是图标大小的一半，则经纬度的点正好在图标的中心点
        }),

        ship7: L.icon({
            iconUrl: 'themes/images/shipIcons/target_7.png',
            iconSize: [10, 22], //图标的大小，格式，第一个参数是宽度，第二个参数是高度
            iconAnchor: [5, 11] //图标显示位置，例如宽度和高度是图标大小的一半，则经纬度的点正好在图标的中心点
        }),

        ship8: L.icon({
            iconUrl: 'themes/images/shipIcons/target_8.png',
            iconSize: [10, 22], //图标的大小，格式，第一个参数是宽度，第二个参数是高度
            iconAnchor: [5, 11] //图标显示位置，例如宽度和高度是图标大小的一半，则经纬度的点正好在图标的中心点
        })
    };

});
