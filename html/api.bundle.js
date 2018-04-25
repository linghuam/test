webpackJsonp([0],[
    /* 0 */
    /***/ (function(module, exports, __webpack_require__) {
    
    "use strict";
    
    
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    
    var _index = __webpack_require__(11);
    
    var _index2 = _interopRequireDefault(_index);
    
    var _index3 = __webpack_require__(12);
    
    var _index4 = _interopRequireDefault(_index3);
    
    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
    
    var default_ = {};
    
    default_.type = _index4.default;
    default_.style = _index2.default;
    
    exports.default = default_;
    
    /***/ }),
    /* 1 */
    /***/ (function(module, exports, __webpack_require__) {
    
    "use strict";
    
    
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    
    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
    
    var tms = function tms() {
        _classCallCheck(this, tms);
    };
    
    Object.defineProperty(tms, "urls", {
        enumerable: true,
        writable: true,
        value: {
            "Skobbler": "https://tiles{1-4}-bc7b4da77e971c12cb0e069bffcf2771.skobblermaps.com/TileService/tiles/2.0/01021113210/0/{z}/{x}/{y}.png@2x?traffic=false",
            "Google Map": "http://mt2.google.cn/vt/lyrs=m&hl=zh-CN&gl=cn&x={x}&y={y}&z={z}",
            "Google Skeleton Map Light": "http://mt2.google.cn/vt/lyrs=h&hl=zh-CN&gl=cn&x={x}&y={y}&z={z}",
            "Google Skeleton Map Dark": "http://mt2.google.cn/vt/lyrs=r&hl=zh-CN&gl=cn&x={x}&y={y}&z={z}",
            "Google Road": "http://mt2.google.cn/vt/lyrs=p&hl=zh-CN&gl=cn&x={x}&y={y}&z={z}",
            "Google Satellite": "http://www.google.cn/maps/vt?lyrs=s@702&gl=cn&x={x}&y={y}&z={z}",
            "Google Satellite V3": "http://mt3.google.cn/vt/lyrs=s&hl=zh-CN&gl=cn&x={x}&y={y}&z={z}",
            "Google DEM": "http://mt0.google.cn/vt/lyrs=t&hl=zh-CN&gl=cn&x={x}&y={y}&z={z}",
            'OSM Mapnik (de)': 'http://{a-d}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png',
            'Geofabrik Standard (OSM)': "https://{a-c}.tile.geofabrik.de/549e80f319af070f8ea8d0f149a149c2/{z}/{x}/{y}.png",
            'Geofabrik German (OSM)': "https://{a-c}.tile.geofabrik.de/23228979966ae9040ceb0597251e12a2/{z}/{x}/{y}.png",
            'Geofabrik Topo (OSM)': "https://{a-c}.tile.geofabrik.de/15173cf79060ee4a66573954f6017ab0/{z}/{x}/{y}.png",
            'OSM Toner': "http://{a,b}.tile.stamen.com/toner/{z}/{x}/{y}.png",
            'OSM Toner Retina': "http://{a,b}.tile.stamen.com/toner/{z}/{x}/{y}@2x.png",
            'OSM Watercolor': "http://{a-d}.tile.stamen.com/watercolor/{z}/{x}/{y}.png",
            'Maptookit Topo (OSM)': 'https://tile{1,2,3,4}.maptoolkit.net/terrain/{z}/{x}/{y}.png',
            'OSM FR': 'http://{a-c}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png',
            'OSM FR hot': 'http://{a-c}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
            'OSM FR openriverboatmap': 'http://{a-c}.tile.openstreetmap.fr/openriverboatmap/{z}/{x}/{y}.png',
            'OSM Roads': "http://korona.geog.uni-heidelberg.de/tiles/roads/x={x}&y={y}&z={z} ",
    
            'OSM Roads Grayscale': "http://korona.geog.uni-heidelberg.de/tiles/roadsg/x={x}&y={y}&z={z}",
    
            'OSM Semitransparent': "http://korona.geog.uni-heidelberg.de/tiles/hybrid/x={x}&y={y}&z={z}",
    
            'ASTER GDEM & SRTM': "http://korona.geog.uni-heidelberg.de/tiles/asterh/x={x}&y={y}&z={z}",
    
            'OSM Admin. Boundaries': "http://korona.geog.uni-heidelberg.de/tiles/adminb/x={x}&y={y}&z={z} ",
    
            'Falk OSM': "http://ec2.cdn.ecmaps.de/WmsGateway.ashx.jpg?TileX={x}&TileY={y}&ZoomLevel={z}&Experience=falk&MapStyle=Falk%20OSM",
    
            'Falk Original': "http://ec2.cdn.ecmaps.de/WmsGateway.ashx.jpg?TileX={x}&TileY={y}&ZoomLevel={z}&Experience=falk&MapStyle=Falk%20Base",
    
            'Kompass Touristik': "http://ec2.cdn.ecmaps.de/WmsGateway.ashx.jpg?TileX={x}&TileY={y}&ZoomLevel={z}&Experience=kompass&MapStyle=KOMPASS%20Touristik",
    
            'Kompass Winter Touristik': "http://ec2.cdn.ecmaps.de/WmsGateway.ashx.jpg?TileX={x}&TileY={y}&ZoomLevel={z}&Experience=kompass&MapStyle=Winter%20Touristik",
    
            'Kompass Summer': "http://ec2.cdn.ecmaps.de/WmsGateway.ashx.jpg?TileX={x}&TileY={y}&ZoomLevel={z}&Experience=kompass&MapStyle=su",
    
            'Visitnorway': 'http://services.geodataonline.no/arcgis/rest/services/Geocache_WMAS_WGS84/GeocacheBasis/MapServer/tile/{z}/{y}/{x}',
            'OSM Landscape': "https://{a-c}.tile.thunderforest.com/landscape/{z}/{x}/{y}@2x.png",
            'OSM Transport': "https://{a-c}.tile.thunderforest.com/transport/{z}/{x}/{y}@2x.png",
            'OpenMap Public Transport': "http://pt.openmap.lt/{z}/{x}/{y}.png",
    
            'OSM Transport Cycle': "https://{a-c}.tile.thunderforest.com/cycle/{z}/{x}/{y}@2x.png",
            'OSM Outdoors': "https://{a-c}.tile.thunderforest.com/outdoors/{z}/{x}/{y}@2x.png",
            'OSM Transport Dark': "https://{a-c}.tile.thunderforest.com/transport-dark/{z}/{x}/{y}@2x.png",
            'OSM Pioneer railroad': "https://{a-c}.tile.thunderforest.com/pioneer/{z}/{x}/{y}@2x.png",
            "MapBox Satellite": "https://{a-d}.tiles.mapbox.com/v3/tmcw.map-j5fsp01s/{z}/{x}/{y}.png",
            "MapBox Hybrid": "https://{a-d}.tiles.mapbox.com/v3/tmcw.map-j5fsp01s/{z}/{x}/{y}.png",
            "MapBox transportation": "http://{a-d}.tiles.mapbox.com/v4/peterqliu.9d05be4d/{z}/{x}/{y}@2x.png?access_token=pk.eyJ1IjoiZHVuY2FuZ3JhaGFtIiwiYSI6IlJJcWdFczQifQ.9HUpTV1es8IjaGAf_s64VQ",
            "MapBox terrain": "https://{a-d}.tiles.mapbox.com/v4/matt.72ef5189/{z}/{x}/{y}@2x.png?access_token=pk.eyJ1IjoiZHVuY2FuZ3JhaGFtIiwiYSI6IlJJcWdFczQifQ.9HUpTV1es8IjaGAf_s64VQ",
            "MapBox Runkeepers": "https://{a-d}.tiles.mapbox.com/v4/heyitsgarrett.kf2a2nb1/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiaGV5aXRzZ2FycmV0dCIsImEiOiIwdWt5ZlpjIn0.73b7Y47rgFnSD7QCNeS-zA",
            'Mapquest (OSM)': "http://otile{1,2,3,4}.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png",
            'Mapquest Labels': "http://ttiles0{1,2,3,4}.mqcdn.com/tiles/1.0.0/vy/hyb/{z}/{x}/{y}.png",
            'Mapquest Satellite': "http://ttiles0{1,2,3,4}.mqcdn.com/tiles/1.0.0/vy/sat/{z}/{x}/{y}.png",
            'Esri': "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}.jpg",
            'Esri Satellite': "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}.jpg",
            'Esri Physical': "https://server.arcgisonline.com/ArcGIS/rest/services/World_Physical_Map/MapServer/tile/{z}/{y}/{x}.jpg",
            'Esri Shaded Relief': "https://server.arcgisonline.com/ArcGIS/rest/services/World_Shaded_Relief/MapServer/tile/{z}/{y}/{x}.jpg",
    
            'Esri Terrain': "https://server.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer/tile/{z}/{y}/{x}.jpg",
            'Esri Topo': "http://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}.jpg",
            'Esri Gray': "http://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}.jpg",
            'Esri National Geographic': "http://services.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}.jpg",
            'Esri Ocean': "https://services.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}.jpg",
            'Esri Blue': "http://cache1.arcgisonline.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}.png",
    
            'Esri Boundaries & Places': "https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}.jpg",
    
            'Esri Reference Overlay': "https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Reference_Overlay/MapServer/tile/{z}/{y}/{x}.jpg",
    
            'Esri Transportation': "https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}.jpg",
    
            'Apple Map': "https://cdn{1,2,3,4}.apple-mapkit.com/ti/tile?type=tile&style=0&size=1&x={x}&y={y}&z={z}&scale=2&lang=en&imageFormat=jpg&v=1603142&poi=1&vendorkey=38da783db1ef0c2d9f8e783a063ffcdc6a6330fe",
            'Apple Hybrid': "https://cdn{1,2,3,4}.apple-mapkit.com/ti/tile?type=tile&style=46&size=1&x={x}&y={y}&z={z}&scale=2&lang=en&imageFormat=jpg&v=1603142&poi=1&vendorkey=38da783db1ef0c2d9f8e783a063ffcdc6a6330fe",
            'Apple Satellite': "https://sat-cdn{1,2,3,4}.apple-mapkit.com/tile?style=7&size=1&scale=1&z={z}&x={x}&y={y}&v=335&vendorkey=38da783db1ef0c2d9f8e783a063ffcdc6a6330fe",
            'Komoot (OSM)': "https://a.tile.hosted.thunderforest.com/komoot-2/{z}/{x}/{y}.png",
            'OSM GPS': "http://{a-c}.gps-tile.openstreetmap.org/lines/{z}/{x}/{y}.png",
            'CartoDB Positron (OSM)': "http://{a-d}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
            'CartoDB Dark Matter (OSM)': "http://{a-d}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
            'Sputnik (OSM)': "http://{a-d}.tiles.maps.sputnik.ru/tiles/kmt2/{z}/{x}/{y}.png",
            'Kosmosnimki (OSM)': "http://{a-d}.tile.osm.kosmosnimki.ru/kosmo/{z}/{x}/{y}.png",
            'Kosmosnimki night (OSM)': "http://{a-d}.tile.osm.kosmosnimki.ru/night/{z}/{x}/{y}.png",
            'OSM OpenSnowMap': "http://www.opensnowmap.org/opensnowmap-overlay/{z}/{x}/{y}.png",
            'OSM SouthEastAsia': 'http://{a-d}.tile.osm-tools.org/osm_then/{z}/{x}/{y}.png'
    
        }
    });
    exports.default = tms;
    
    /***/ }),
    /* 2 */,
    /* 3 */,
    /* 4 */,
    /* 5 */,
    /* 6 */,
    /* 7 */
    /***/ (function(module, exports, __webpack_require__) {
    
    "use strict";
    
    
    __webpack_require__(8);
    
    var _index = __webpack_require__(9);
    
    var _index2 = _interopRequireDefault(_index);
    
    var _index3 = __webpack_require__(0);
    
    var _index4 = _interopRequireDefault(_index3);
    
    var _index5 = __webpack_require__(13);
    
    var _index6 = _interopRequireDefault(_index5);
    
    var _index7 = __webpack_require__(18);
    
    var _index8 = _interopRequireDefault(_index7);
    
    var _index9 = __webpack_require__(1);
    
    var _index10 = _interopRequireDefault(_index9);
    
    var _index11 = __webpack_require__(19);
    
    var _index12 = _interopRequireDefault(_index11);
    
    var _index13 = __webpack_require__(20);
    
    var _index14 = _interopRequireDefault(_index13);
    
    var _index15 = __webpack_require__(21);
    
    var _index16 = _interopRequireDefault(_index15);
    
    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
    
    (function (global, mv) {
        //将对象暴露给全局
        global.format = "json";
        // global.APISERVER = "http://" + window.location.hostname + ":8090/";
        // global.IMAGESERVER = APISERVER + "com-mapvision-imageserver/";
        // global.MAPSERVER = APISERVER + "com-mapvision-mapserver/";
        global.TILEMANAGERSERVICE = IMAGESERVER + "manager";
        global.TILEMAPSERVICE = IMAGESERVER + "service/wms";
        global.MAPSERVICE = MAPSERVER + "ows?service=wms&version=1.0.0";
        global.CLIPSERVCE = IMAGESERVER + "clip";
        // =============analysis=============
        global.AnalysisSERVICE = MAPSERVER + "rest/analysis";
        global.SERVICEBUFFERANALYSIS = AnalysisSERVICE + "/bufferAnalysis." + format;
        global.SERVICECONVEXHULLANALYSIS = AnalysisSERVICE + "/convexHullAnalysis." + format;
        global.SERVICEINTERSECTIONANALYSIS = AnalysisSERVICE + "/intersectionAnalysis." + format;
        global.SERVICEUNIONANALYSIS = AnalysisSERVICE + "/unionAnalysis." + format;
        global.SERVICEMARGINANALYSIS = AnalysisSERVICE + "/marginAnalysis." + format;
        global.SERVICEMARGINANALYSISONLY = AnalysisSERVICE + "/marginAnalysisonly." + format;
        global.SERVICESPLITANALYSIS = AnalysisSERVICE + "/splitAnalysis." + format;
        global.SERVICEDIFFERENCEANALYSIS = AnalysisSERVICE + "/differenceAnalysis." + format;
        global.SERVICESYMDIFFERENCEANALYSIS = AnalysisSERVICE + "/symDifferenceAnalysis." + format;
        // =================statistics==================//
        global.SERVICESTATISTICS = MAPSERVER + "rest/statistics/notypestatics/{0}." + format;
        // ============query=============
        global.DataSERVICE = MAPSERVER + "rest/dataservice";
        global.POISERVICE = MAPSERVER + "rest/poi";
        // ============devision=========
        global.DivisionSERVICE = MAPSERVER + "rest/divisionservice";
        // ============theme============
        global.MANAGERSERVICE = MAPSERVER + "rest/manager";
    
        global.AQUISITION = MAPSERVER + "rest/acquisition";
        global.ADD_FEATURE = AQUISITION + "/addfeature";
        // 验证图层
        global.CHECK_LYR = AQUISITION + "/checklyr/-1.json";
        // 编辑属性
        global.EDIT_FEATURE = AQUISITION + "/updateFeatures";
        // 批量添加
        global.ADD_FEATURES = AQUISITION + "/addfeatures";
        // 删除要素
        global.DELETE_FEATURE = AQUISITION + "/deleteFeature";
        // 删除图层
        global.DEL_LAYER = AQUISITION + "/delLyr";
    
        global.FEATURE_STRUCTURE = AQUISITION + "/lyrstuct";
    
        global.ADDLYR = AQUISITION + "/addlayer/-1.json";
        //綁定全局对象
        global.mv = mv;
        //赋值
        mv.Core = _index2.default;
        mv.default_ = _index4.default;
        mv.control = _index6.default;
        mv.theme = _index8.default;
        mv.tms = _index10.default;
        mv.query = _index12.default;
        mv.editor = _index14.default;
        mv.util = _index16.default;
    })(window, {
        name: "mapapi",
        version: "0.0.1",
        owner: "Mapvision.com"
    });
    
    /***/ }),
    /* 8 */
    /***/ (function(module, exports) {
    
    // removed by extract-text-webpack-plugin
    
    /***/ }),
    /* 9 */
    /***/ (function(module, exports, __webpack_require__) {
    
    "use strict";
    
    
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    
    var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
    
    __webpack_require__(10);
    
    var _index = __webpack_require__(0);
    
    var _index2 = _interopRequireDefault(_index);
    
    var _index3 = __webpack_require__(1);
    
    var _index4 = _interopRequireDefault(_index3);
    
    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
    
    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
    
    var Core = function () {
        _createClass(Core, [{
            key: "map",
    
    
            /**
             * 获取map属性
             * */
    
            /**
             *动态图层
             * */
    
            /**
             * 基础地图
             * */
    
            /**
             * 自定义控件
             * @type {Array.<mv.control.Control>}
             * */
            get: function get() {
                return this.map_;
            }
    
            /**
             * 获取所有自定义控件
             * */
    
            /**
             * popups
             * */
    
            /**
             * 默认图层
             * */
    
            /**
             * 自定义交互
             * @type {Array}
             * */
    
            /**
             * 地图
             * */
    
        }, {
            key: "customControls",
            get: function get() {
                return this.customControls_;
            }
        }, {
            key: "defaultLayers",
            get: function get() {
                return this.defaultLayers_;
            }
        }, {
            key: "interactions",
            get: function get() {
                return this.interactions_;
            }
        }, {
            key: "dynamicLayers",
            get: function get() {
                return this.dynamicLayers_;
            }
        }, {
            key: "baseLayer",
            get: function get() {
                return this.baseLayer_;
            },
            set: function set(layer) {
                this.baseLayer_ = layer;
            }
        }, {
            key: "popups",
            get: function get() {
                return this.popups_;
            }
    
            /**
             * 初始化地图
             * @param {string} divd 地图容器id
             * @param {number} x 中心点x坐标
             * @param {number} y 中心点y坐标
             * @param {string} zoom 缩放级别
             * @param {string} lyrname 底图
             * */
    
        }]);
    
        function Core(divd, x, y, zoom, lyrname) {
            _classCallCheck(this, Core);
    
            Object.defineProperty(this, "customControls_", {
                enumerable: true,
                writable: true,
                value: []
            });
            Object.defineProperty(this, "interactions_", {
                enumerable: true,
                writable: true,
                value: []
            });
            Object.defineProperty(this, "baseLayer_", {
                enumerable: true,
                writable: true,
                value: null
            });
            Object.defineProperty(this, "defaultLayers_", {
                enumerable: true,
                writable: true,
                value: {}
            });
            Object.defineProperty(this, "dynamicLayers_", {
                enumerable: true,
                writable: true,
                value: {}
            });
            Object.defineProperty(this, "popups_", {
                enumerable: true,
                writable: true,
                value: {}
            });
    
            this.baseLayer = this.getTileLayer(lyrname);
            this.map_ = new ol.Map({
                view: new ol.View({
                    center: ol.proj.fromLonLat([x, y]),
                    zoom: zoom
                }),
                controls: ol.control.defaults(),
                interactions: ol.interaction.defaults({
                    doubleClickZoom: false // 防止绘制过程双击地图放大
                }),
                layers: [this.baseLayer],
                target: divd
            });
            this._initBaseLayer();
            this._initInteractions();
        }
    
        /**
         * 切换底图
         * */
    
    
        _createClass(Core, [{
            key: "switchBaseLayer",
            value: function switchBaseLayer(name, attributions) {
                // 移除当前底图
                this.map.removeLayer(this.baseLayer);
                //查找url
                this.baseLayer = this.getTileLayer(name);
                this.map.addLayer(this.baseLayer);
            }
        }, {
            key: "getTileLayer",
    
    
            /**
             * 得到基础图
             * @param {String} name 地图名称
             * @param {Object} attributions 参数
             * */
            value: function getTileLayer(name, attributions) {
                var options = attributions ? attributions : {};
                if (name.indexOf("Baidu") != -1) {
                    return this.getBaiduMap(options.mapType);
                } else if (name.indexOf("Amap") != -1) {
                    return this.getAMap(options.mapType);
                } else {
                    var url = _index4.default.urls[name];
                    if (!url) {
                        console.warn("未找到该图层" + name + "！,已切换至默认osm地图");
                        return new ol.layer.Tile({
                            source: new ol.source.OSM()
                        });
                    } else {
                        return new ol.layer.Tile({
                            source: new ol.source.XYZ({ url: url, attributions: attributions }),
                            zIndex: -999
                        });
                    }
                }
            }
    
            /**
             * 初始化百度地图
             * */
    
        }, {
            key: "getBaiduMap",
            value: function getBaiduMap(type) {
                return new ol.layer.Tile({
                    title: "百度地图",
                    source: new ol.source.BaiduMap({
                        mapType: type
                    }),
                    zIndex: -999
                });
            }
        }, {
            key: "getAMap",
            value: function getAMap(type) {
                return new ol.layer.Tile({
                    title: "百度地图",
                    source: new ol.source.AMap({
                        mapType: type
                    }),
                    zIndex: -999
                });
            }
        }, {
            key: "addBaiduMap",
    
            /**
             * 添加百度地图
             * */
            value: function addBaiduMap(type) {
                // 移除当前底图
                this.map.removeLayer(this.baseLayer);
                this.baseLayer = this.getBaiduMap(type);
                this.baseLayer.name = "Baidu";
                this.map.addLayer(this.baseLayer);
            }
    
            /**
             * 初始化默认图层
             * */
    
        }, {
            key: "_initBaseLayer",
            value: function _initBaseLayer() {
                this._drawLayer = new ol.layer.Vector({
                    source: new ol.source.Vector()
                });
                this._drawLayer.name = "绘制层";
                this._measureLayer = new ol.layer.Vector({
                    source: new ol.source.Vector(),
                    style: [new ol.style.Style({
                        fill: new ol.style.Fill({
                            color: 'rgba(255, 255, 255, 0.3)'
                        }),
                        stroke: new ol.style.Stroke({
                            color: '#993300',
                            width: 2
                        }),
                        image: new ol.style.Circle({
                            radius: 7,
                            fill: new ol.style.Fill({
                                color: '#ffcc33'
                            })
                        })
                    }), new ol.style.Style({
                        image: new ol.style.Circle({
                            radius: 5,
                            fill: new ol.style.Fill({
                                color: 'white'
                            }), stroke: new ol.style.Stroke({
                                color: '#993300',
                                width: 2
                            })
                        }),
                        geometry: function geometry(feature) {
                            // return the coordinates of the first ring of the polygon
                            var geometry = feature.getGeometry();
                            var coords = null;
                            if (geometry instanceof ol.geom.LineString) {
                                coords = geometry.getCoordinates();
                            } else if (geometry instanceof ol.geom.Polygon) {
                                coords = geometry.getCoordinates()[0];
                            }
                            if (coords) {
                                return new ol.geom.MultiPoint(coords);
                            }
                        }
                    })]
                });
                this._measureLayer.name = "测量层";
                this.defaultLayers_.draw = this._drawLayer;
                this.defaultLayers_.measure = this._measureLayer;
    
                for (var key in this.defaultLayers_) {
                    this.map_.addLayer(this.defaultLayers_[key]);
                }
            }
    
            /**
             * 初始化控件
             * */
    
        }, {
            key: "_initInteractions",
            value: function _initInteractions() {
    
                for (var i = 0; i < this.interactions_.length; i++) {
                    this.map_.addInteraction(this.interactions_[i]);
                }
            }
    
            /**
             * 根据名称获取图层
             * @param {string} lyrname 图层名称
             * */
    
        }, {
            key: "getLayerByName",
            value: function getLayerByName(lyrname) {
                var layers = this.map_.getLayers();
                var result = null;
                layers.forEach(function (layer) {
                    if (layer.name === lyrname) {
                        result = layer;
                    }
                });
                return result;
            }
    
            /**
             * 绘制
             * @param {string} type 绘制类型
             * @param {boolean} isReset 绘制完禁用绘制
             * @param {boolean} isRedraw 是否清除之前的绘制
             * @param {function} beforeDrawHandle 绘制前回调
             * @param {function} afterDrawHandle 绘制完成回调
             * */
    
        }, {
            key: "draw",
            value: function draw(type, isReset, isRedraw, beforeDrawHandle, afterDrawHandle) {
                var id = mv.util.createId();
                var length = null;
                var beforeDraw = null;
                var pointerMove = null;
                var outputcardm = null;
                var self = this;
                var layer = this.getLayerByName("绘制层");
                if (isRedraw) {
                    $(".ol-draw-label").remove();
                    layer.getSource().clear();
                }
                var draw = this.interactions_["draw"];
                if (draw) {
                    this.map_.removeInteraction(draw);
                }
                //判断类型
                if (type === _index2.default.type.geom.CIRCLE) {
                    var convertMToKM = function convertMToKM(mradius) {
                        var output = void 0;
                        if (mradius >= 1000) {
                            output = (mradius / 1000).toFixed(2) + 'KM';
                        } else {
                            output = mradius.toFixed(2) + 'M';
                        }
                        return output;
                    };
    
                    var maxRadius = 5000; // 单位米
                    var center = null;
                    //初始化overlay
                    var div = document.createElement("div");
                    div.setAttribute("class", "ol-draw-label");
                    div.setAttribute("id", "label-" + id);
                    var overlay = new ol.Overlay({
                        id: id,
                        element: div,
                        autoPan: true,
                        stopEvent: false, // 点击图标时完成绘制
                        positioning: "center-right"
                    });
                    this.map.addOverlay(overlay);
    
                    pointerMove = function pointerMove(evt) {
                        // 修复绘制中断，重复绘制 bug
                        if (!self.interactions_["draw"] || !document.getElementById("label-" + id)) {
                            return;
                        }
                        var coords = [];
                        var start = center.getCoordinates();
                        // let start = center;
                        coords.push(start);
                        coords.push(evt.coordinate);
                        var line = new ol.geom.LineString(coords);
                        length = ol.Sphere.getLength(line);
                        var output = void 0;
                        // if (length > 1000) {
                        //     output = (Math.round(length / 1000 * 100) / 100) +
                        //         ' ' + 'km';
                        // } else {
                        //     output = (Math.round(length * 100) / 100) +
                        //         ' ' + 'm';
                        // }
                        var lengthm = Math.round(length * 100) / 100;
                        // 超出最大半径,停止绘制
                        if (lengthm > maxRadius && draw) {
                            draw.finishDrawing();
                            lengthm = maxRadius;
                        }
                        outputcardm = self._getCircleCardRadius(lengthm);
                        output = convertMToKM(outputcardm);
                        document.getElementById("label-" + id).innerHTML = output;
                        var radius = Math.sqrt(Math.pow(evt.coordinate[0] - start[0], 2) + Math.pow(evt.coordinate[1] - start[1], 2));
                        //计算overlay显示的点
                        var position = [start[0] + Math.sqrt(2) / 2 * radius, start[1] - Math.sqrt(2) / 2 * radius];
                        overlay.setPosition(position);
                    };
                    beforeDraw = function beforeDraw(evt) {
                        center = evt.feature.getGeometry().getInteriorPoint();
                        // let geom = evt.feature.getGeometry();
                        // if (geom.getType() === "Circle"){
                        //     center = geom.getCenter();
                        // }
                        this.map.on("pointermove", pointerMove);
                    };
    
                    draw = new ol.interaction.Draw({
                        source: layer.getSource(),
                        geometryFunction: ol.interaction.Draw.createRegularPolygon(32),
                        type: type
                    });
                    draw.on("drawend", function (evt) {
                        var f = evt.feature;
                        if (outputcardm && outputcardm > 0) {
                            var radius = outputcardm;
                            var geo = f.getGeometry();
                            if (geo.getType() === "Circle") {
                                // geo.setRadius(radius);
                            }
                        }
                    }, this);
                } else if (type === "BOX") {
                    draw = new ol.interaction.Draw({
                        source: layer.getSource(),
                        geometryFunction: ol.interaction.Draw.createBox(),
                        type: 'Circle'
                    });
                } else {
                    draw = new ol.interaction.Draw({
                        source: layer.getSource(),
                        type: type
                    });
                }
    
                // 綁定事件
                draw.on("drawstart", function (evt) {
                    if (beforeDraw) {
                        beforeDraw.call(this, evt);
                    }
                    if (beforeDrawHandle) {
                        beforeDrawHandle.call(this, evt);
                    }
                }, this);
    
                draw.on("drawend", function (evt) {
                    var f = evt.feature;
                    f.set("id", id);
                    if (beforeDraw) {
                        this.map.un("pointermove", pointerMove);
                    }
                    if (isReset) {
                        this.interactions_["draw"].setActive(false);
                    }
                    if (afterDrawHandle) {
                        afterDrawHandle.call(this, evt);
                    }
                }, this);
                draw.setActive(true);
                this.map.addInteraction(draw);
                this.interactions_["draw"] = draw;
            }
    
            /**
             * 绘制圆时设置卡标
             * 返回新的圆半径
             */
    
        }, {
            key: "_getCircleCardRadius",
            value: function _getCircleCardRadius(oldRadius) {
                var card1 = 50; // 单位米
                var maxcard = 5000;
                var d = 50;
                var offset = 3; // 偏移值
                var n = Math.floor((maxcard - card1) / d + 1); // 等差数列 an = a1 + (n-1)d
                if (n <= 0) {
                    return oldRadius;
                }
                for (var i = 1; i <= n; i++) {
                    var an = card1 + (i - 1) * d;
                    if (Math.abs(oldRadius - an) <= offset * 2) {
                        return an;
                    }
                }
                return oldRadius;
            }
    
            /**
             * 添加自定义地图交互
             * @param {Control}
             * */
    
        }, {
            key: "addCustomControl",
            value: function addCustomControl(control) {
                if (control.isUnique) {
                    this.removeCustomControl(control);
                }
                this.customControls_.push(control);
                //调用初始化方法
                control.onInit(this.map_);
            }
    
            /**
             * 删除自定义地图交互
             * @param {Control}
             * */
    
        }, {
            key: "removeCustomControl",
            value: function removeCustomControl(control) {
                for (var i = 0; i < this.customControls_.length; i++) {
                    if (Object.is(control, this.customControls_[i])) {
                        var oldControl = this.customControls_.splice(i, 1)[0];
                        //调用清除方法
                        oldControl.onDispose();
                        i--;
                    }
                }
            }
    
            /**
             *添加矢量图层
             * @param {string} layerName - 图层名称
             * @param {Array} fs - 矢量对象
             * @param {string} renderMode - 渲染模式
             * @param {object} option - 额外参数
             * @param {Object} style - 图层样式 @deprecated 为保证图层有选中样式，样式规定如下{defaultStyle:{},selectStyle:{}}
             * @parma {Boolean} isAppend - 是否为追加模式
             * @param {function} onSuccess - 回调函数
             * */
    
        }, {
            key: "addVectorLayer",
            value: function addVectorLayer(layerName, fs, renderMode, style, isAppend, option, onSuccess) {
                var layer = this.getLayerByName(layerName);
                style = style ? style : Object.assign({}, mv.default_.style);
                var source = new ol.source.Vector();
                if (fs && fs.length) {
                    source.addFeatures(fs);
                }
                var default_option = {
                    style: style.default,
                    select_style: style.select,
                    name: layerName,
                    source: source,
                    /**@type {string} vector|image*/
                    renderMode: renderMode ? renderMode : "vector"
                };
                var finalOption = null;
                if (option) {
                    finalOption = Object.assign({}, default_option, option);
                } else {
                    finalOption = default_option;
                }
                if (layer && isAppend) {
                    layer.getSource().addFeatures(fs);
                } else if (layer && !isAppend) {
                    layer.getSource().clear();
                    layer.getSource().addFeatures(fs);
                } else if (!layer) {
                    layer = this.dynamicLayers_[layerName] = new ol.layer.Vector(finalOption);
                    layer.name = layerName;
                    this.map_.addLayer(layer);
                }
                if (onSuccess) {
                    onSuccess.apply(this, [layer]);
                }
            }
    
            /**
             *添加数据
             * @param {string} layerName - 图层名称
             * @param {Array} fs - 矢量对象
             * @param {function} onSuccess - 回调函数
             * */
    
        }, {
            key: "addFeautures",
            value: function addFeautures(layerName, fs, onSuccess) {
                var layer = this.dynamicLayers_[layerName];
                if (layer) {
                    layer.getSource().addFeatures(fs);
                    if (onSuccess) {
                        onSuccess.apply(this);
                    }
                } else {
                    this.addVectorLayer(layerName, fs, null, null, onSuccess);
                }
            }
    
            /**
             * 添加overlayer
             * @param {String} popupid - popup元素id
             * @param {String} closeid - 关闭按钮id
             * @param {String} name - popup名称
             * */
    
        }, {
            key: "addPopup",
            value: function addPopup(popupid, closeid, name) {
                var container = document.getElementById(popupid);
                var closer = document.getElementById(closeid);
                var popup = new ol.Overlay({
                    element: container,
                    autoPan: true,
                    autoPanAnimation: {
                        duration: 250
                    }
                });
                //綁定关闭事件
                if (closer) {
                    closer.onclick = function () {
                        popup.setPosition(undefined);
                        closer.blur();
                        return false;
                    };
                }
                this.popups[name] = popup;
                this.map.addOverlay(popup);
            }
    
            /**
             * 刪除popup
             * @param {String} popup名称
             * */
    
        }, {
            key: "removePopup",
            value: function removePopup(name) {
                var popup = this.popups[name];
                this.map.removeOverlay(popup);
                delete this.popups[name];
            }
    
            /**
             *  删除图层
             * @param {string} layerName - 图层名称
             * @param {function} onSuccess - 回调函数
             * */
    
        }, {
            key: "removeLayer",
            value: function removeLayer(layerName, onSuccess) {
                var layer = this.dynamicLayers_[layerName];
                if (layer) {
                    delete this.dynamicLayers_[layerName];
                    this.map_.removeLayer(layer);
                    if (onSuccess) {
                        onSuccess.apply(this);
                    }
                } else {
                    console.error("该图层不存在:" + layerName);
                }
            }
    
            /**
             * 清空图层
             * @param {string} layerName - 图层名称
             * @param {function} onSuccess - 回调函数
             * */
    
        }, {
            key: "clearLayer",
            value: function clearLayer(layerName, onSuccess) {
                var layer = this.dynamicLayers_[layerName];
                if (layer) {
                    layer.getSource().clear();
                    if (onSuccess) {
                        onSuccess.apply(this);
                    }
                } else {
                    console.error("该图层不存在:" + layerName);
                }
            }
    
            /**
             * 清除所有图层
             * */
    
        }, {
            key: "removeAllLayer",
            value: function removeAllLayer() {
                for (var key in this.dynamicLayers_) {
                    this.map_.removeLayer(this.dynamicLayers_[key]);
                    delete this.dynamicLayers_[key];
                }
            }
    
            /**
             * 选择地图对象
             * @param {ol.layer|Array<ol.layer>}  layer - 图层或者图层组
             * @param {Function} onSuccess - 回调参数
             * */
    
        }, {
            key: "select",
            value: function select(layer, onSuccess) {
                var _this = this;
    
                var interactions = this.map_.getInteractions();
                interactions.forEach(function (interaction) {
                    if (interaction instanceof ol.interaction.Select) {
                        _this.map_.removeInteraction(interaction);
                    }
                }, this);
                var options = {};
                if (layer instanceof ol.layer.Vector) {
                    options.layers = [layer];
                    options.style = layer.get("select_style");
                } else if (layer instanceof Array) {
                    options.layers = layer;
                    options.style = _index2.default.style.select;
                } else {
                    options.style = _index2.default.style.select;
                }
                var select = new ol.interaction.Select(options);
                this.map_.addInteraction(select);
                this.interactions.select = select;
                select.on("select", function (evt) {
                    if (onSuccess) {
                        onSuccess.call(this, evt);
                    }
                });
            }
    
            /**
             * 框选
             * @param {ol.layer|Array<ol.layer>} layer - 图层或者图层组
             * @param {Function} onSuccess - 回调
             * */
    
        }, {
            key: "selectByBox",
            value: function selectByBox(layer, onSuccess) {
                //重置地图控件
                this.reset();
                var sources = [];
                var options = {};
                //判断图层还是图层组
                if (layer instanceof ol.layer.Vector) {
                    options.layers = [layer];
                    options.style = layer.get("select_style");
                    sources.push(layer.getSource());
                } else if (layer instanceof Array) {
                    options.layers = layer;
                    options.style = _index2.default.style.select;
                    for (var i = 0; i < layer.length; i++) {
                        sources.push(layer[i].getSource());
                    }
                }
                var select = new ol.interaction.Select(options);
                this.map.addInteraction(select);
                //获取选中的对象组
                var selectedFeatures = select.getFeatures();
                var dragbox = new ol.interaction.DragBox();
                this.map.addInteraction(dragbox);
    
                var boxend = function boxend() {
                    var extent = dragbox.getGeometry().getExtent();
                    for (var _i = 0; _i < sources.length; _i++) {
                        sources[_i].forEachFeatureIntersectingExtent(extent, function (feature) {
                            selectedFeatures.push(feature);
                        });
                    }
                    if (onSuccess) {
                        onSuccess.call(this, selectedFeatures);
                    }
                };
                dragbox.on('boxend', boxend);
                // clear selection when drawing a new box and when clicking on the map
                dragbox.on('boxstart', function () {
                    selectedFeatures.clear();
                });
            }
    
            /**
             * 重置controls,interactions
             *
             * */
    
        }, {
            key: "reset",
            value: function reset() {
                var interactions = this.map_.getInteractions();
                //清除所有控件
                interactions = interactions.getArray();
                for (var i = 0; i < interactions.length; i++) {
                    if (interactions[i] instanceof ol.interaction.Select) {
                        interactions[i].getFeatures().clear();
                    }
                    this.map_.removeInteraction(interactions[i--]);
                }
                // let controls = this.map_.getControls();
                // controls = controls.getArray();
                // for (let i = 0; i < controls.length; i++) {
                //     this.map_.removeControl(controls[i--]);
                // }
                //卸载自定义组件
                for (var _i2 = 0; _i2 < this.customControls_.length; _i2++) {
                    this.removeCustomControl(this.customControls_[_i2]);
                }
                //装载默认控件
                ol.interaction.defaults({
                    doubleClickZoom: false
                }).extend([]).forEach(function (interaction) {
                    this.map_.addInteraction(interaction);
                }, this);
    
                $(".mv-measure-overlay").remove();
                // ol.control.defaults().extend([]).forEach(function (control) {
                //     this.map_.addControl(control);
                // }, this);
            }
        }]);
    
        return Core;
    }();
    
    exports.default = Core;
    
    /***/ }),
    /* 10 */
    /***/ (function(module, exports) {
    
    // removed by extract-text-webpack-plugin
    
    /***/ }),
    /* 11 */
    /***/ (function(module, exports, __webpack_require__) {
    
    "use strict";
    
    
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var DEFAULT_STYLE = {
        default: new ol.style.Style({
            image: new ol.style.Circle({
                fill: new ol.style.Fill({
                    color: 'rgba(0,0,255,1)'
                }),
                stroke: new ol.style.Stroke({
                    color: 'white',
                    width: 1.25
                }),
                radius: 5
            }),
            fill: new ol.style.Fill({
                color: 'rgba(255,255,255,0.4)'
            }),
            stroke: new ol.style.Stroke({
                color: 'blue',
                width: 1.25
            })
        }),
        select: new ol.style.Style({
            image: new ol.style.Circle({
                fill: new ol.style.Fill({
                    color: 'rgba(255,0,0,1)'
                }),
                stroke: new ol.style.Stroke({
                    color: 'white',
                    width: 1.25
                }),
                radius: 10
            }),
            fill: new ol.style.Fill({
                color: 'rgba(255,0,0,0.4)'
            }),
            stroke: new ol.style.Stroke({
                color: 'rgba(255,0,0,1)',
                width: 1.25
            })
        })
    };
    exports.default = DEFAULT_STYLE;
    
    /***/ }),
    /* 12 */
    /***/ (function(module, exports, __webpack_require__) {
    
    "use strict";
    
    
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var type = {
        geom: {
            CIRCLE: "Circle",
            GEOMETRY_COLLECTION: "GeometryCollection",
            LINEAR_RING: "LinearRing",
            LINE_STRING: "LineString",
            MULTI_LINE_STRING: "MultiLineString",
            MULTI_POINT: "MultiPoint",
            MULTI_POLYGON: "MultiPolygon",
            POINT: "Point",
            POLYGON: "Polygon",
            BOX: "BOX"
        }
    };
    exports.default = type;
    
    /***/ }),
    /* 13 */
    /***/ (function(module, exports, __webpack_require__) {
    
    "use strict";
    
    
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    
    var _index = __webpack_require__(14);
    
    var _index2 = _interopRequireDefault(_index);
    
    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
    
    var control = { Measure: _index2.default };
    
    exports.default = control;
    
    /***/ }),
    /* 14 */
    /***/ (function(module, exports, __webpack_require__) {
    
    "use strict";
    /* WEBPACK VAR INJECTION */(function(i18n) {
    
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    
    var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };
    
    var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
    
    __webpack_require__(16);
    
    var _index = __webpack_require__(17);
    
    var _index2 = _interopRequireDefault(_index);
    
    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
    
    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
    
    function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
    
    function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
    
    var Measure = function (_Control) {
        _inherits(Measure, _Control);
    
        _createClass(Measure, [{
            key: "pointerClickHandler",
    
    
            /**
             * Handle pointer single click.
             * @param {ol.MapBrowserEvent} evt The event.
             */
    
            //----------实现分段信息------------
            //记录当前绘制出的点坐标
    
            /**
             * Overlay to show the measurement.
             * @type {Array.<ol.Overlay>}
             */
    
            /**
             * The measure tooltip element.
             * @type {Element}
             */
    
            /**
             * The help tooltip element.
             * @type {Element}
             */
    
            /**
             * 绘制控件
             * @type {ol.interaction.Draw}
             * */
    
            /**
             * 测量类型
             * @type {String}
             * */
            value: function pointerClickHandler(evt) {
                var coordinate = evt.coordinate;
                if (this.currentPoint) {
                    var id = mv.util.createId();
                    //初始化overlay
                    var div = document.createElement("div");
                    div.setAttribute("class", "mv-measure-overlay ol-draw-label");
                    div.setAttribute("id", "label-" + id);
                    var overlay = new ol.Overlay({
                        id: id,
                        element: div,
                        autoPan: true,
                        positioning: "top-left"
                    });
                    this.map.addOverlay(overlay);
                    //计算距离
                    var coords = [];
                    coords.push(this.currentPoint);
                    coords.push(coordinate);
                    var line = new ol.geom.LineString(coords);
                    var length = ol.Sphere.getLength(line);
                    this.currentLength += length;
                    var output = void 0;
                    if (this.currentLength > 1000) {
                        output = Math.round(this.currentLength / 1000 * 100) / 100 + ' ' + 'km';
                    } else {
                        output = Math.round(this.currentLength * 100) / 100 + ' ' + 'm';
                    }
                    document.getElementById("label-" + id).innerHTML = output;
                    overlay.setPosition(coordinate);
                }
                this.currentPoint = coordinate;
            }
            /**
             * Handle pointer move.
             * @param {ol.MapBrowserEvent} evt The event.
             */
    
            /**
             * 绘制控件监听事件
             * */
    
            /**
             * Overlay to show the measurement.
             * @type {ol.Overlay}
             */
    
            /**
             * Overlay to show the help messages.
             * @type {ol.Overlay}
             */
    
            /**
             * Currently drawn feature.
             * @type {ol.Feature}
             */
    
            /**
             * 绘制中的样式
             * @type {Object|Function}
             */
    
        }, {
            key: "pointerMoveHandler",
            value: function pointerMoveHandler(evt) {
                if (evt.dragging) {
                    return;
                }
                /** @type {string} */
                var helpMsg = i18n.MEASURE_START_HELP_MSG;
    
                if (this.sketch_) {
                    var geom = this.sketch_.getGeometry();
                    if (geom instanceof ol.geom.Polygon) {
                        helpMsg = i18n.ContinuePolygonMsg;
                    } else if (geom instanceof ol.geom.LineString) {
                        helpMsg = i18n.ContinueLineString;
                    }
                }
                this.helpTooltipElement_.innerHTML = helpMsg;
                this.helpTooltip_.setPosition(evt.coordinate);
    
                this.helpTooltipElement_.classList.remove('hidden');
            }
        }, {
            key: "mouseOutHandle_",
    
    
            /**
             * mouse out handle
             *  @param {ol.MapBrowserEvent} evt The event.
             * */
            value: function mouseOutHandle_(evt) {
                this.helpTooltipElement_.classList.add('hidden');
            }
    
            /**
             * Format length output.
             * @param {ol.geom.LineString} line The line.
             * @return {string} The formatted length.
             */
    
        }, {
            key: "formatLength_",
            value: function formatLength_(line) {
                var length = ol.Sphere.getLength(line);
                var output = void 0;
                if (length > 1000) {
                    output = Math.round(length / 1000 * 100) / 100 + ' ' + 'km';
                } else {
                    output = Math.round(length * 100) / 100 + ' ' + 'm';
                }
                return output;
            }
        }, {
            key: "formatArea_",
    
    
            /**
             * Format area output.
             * @param {ol.geom.Polygon} polygon The polygon.
             * @return {string} Formatted area.
             */
            value: function formatArea_(polygon) {
                var area = ol.Sphere.getArea(polygon);
                var output = void 0;
                if (area > 10000) {
                    output = Math.round(area / 1000000 * 100) / 100 + ' ' + 'km<sup>2</sup>';
                } else {
                    output = Math.round(area * 100) / 100 + ' ' + 'm<sup>2</sup>';
                }
                return output;
            }
        }, {
            key: "addInteraction_",
            value: function addInteraction_() {
                var layers = this.map_.getLayers();
                var source = null;
                layers.forEach(function (layer) {
                    if (layer.name === "测量层") {
                        source = layer.getSource();
                    }
                });
                //声明绘制控件
                this.draw_ = new ol.interaction.Draw({
                    source: source,
                    type: this.measureType_,
                    style: this.style_
                });
                this.map_.addInteraction(this.draw_);
    
                this.createMeasureTooltip_();
                this.createHelpTooltip_();
    
                this.draw_.on('drawstart', function (evt) {
                    // set sketch
                    this.sketch_ = evt.feature;
                    /** @type {ol.Coordinate|undefined} */
                    var tooltipCoord = evt.coordinate;
                    this.listener_ = this.sketch_.getGeometry().on('change', function (evt) {
                        var geom = evt.target;
                        var output = void 0;
                        if (geom instanceof ol.geom.Polygon) {
                            output = this.formatArea_(geom);
                            tooltipCoord = geom.getInteriorPoint().getCoordinates();
                        } else if (geom instanceof ol.geom.LineString) {
                            output = this.formatLength_(geom);
                            tooltipCoord = geom.getLastCoordinate();
                        }
                        this.measureTooltipElement_.innerHTML = output;
                        this.measureTooltip_.setPosition(tooltipCoord);
                    }, this);
                }, this);
    
                this.draw_.on('drawend', function () {
                    this.measureTooltipElement_.className = 'ol-measure-tooltip tooltip-static';
                    this.measureTooltip_.setOffset([0, -7]);
                    // unset sketch
                    this.sketch_ = null;
                    // unset tooltip so that a new one can be created
                    this.measureTooltipElement_ = null;
                    this.createMeasureTooltip_();
                    ol.Observable.unByKey(this.listener_);
                    //重置当前点击节点
                    this.currentPoint = null;
                    this.currentLength = 0;
                }, this);
            }
    
            /**
             * Creates a new help tooltip
             */
    
        }, {
            key: "createHelpTooltip_",
            value: function createHelpTooltip_() {
                if (this.helpTooltipElement_) {
                    this.helpTooltipElement_.parentNode.removeChild(this.helpTooltipElement_);
                }
                this.helpTooltipElement_ = document.createElement('div');
                this.helpTooltipElement_.className = 'ol-measure-tooltip hidden';
                this.helpTooltip_ = new ol.Overlay({
                    element: this.helpTooltipElement_,
                    offset: [15, 0],
                    positioning: 'center-left'
                });
                this.map_.addOverlay(this.helpTooltip_);
            }
    
            /**
             * Creates a new measure tooltip
             */
    
        }, {
            key: "createMeasureTooltip_",
            value: function createMeasureTooltip_() {
                if (this.measureTooltipElement_) {
                    this.measureTooltipElement_.parentNode.removeChild(this.measureTooltipElement_);
                }
                this.measureTooltipElement_ = document.createElement('div');
                this.measureTooltipElement_.className = 'ol-measure-tooltip tooltip-measure';
                this.measureTooltip_ = new ol.Overlay({
                    element: this.measureTooltipElement_,
                    offset: [0, -15],
                    positioning: 'bottom-center'
                });
                this.measureTooltips_.push(this.measureTooltip_);
                this.map_.addOverlay(this.measureTooltip_);
            }
        }]);
    
        function Measure(options) {
            _classCallCheck(this, Measure);
    
            var _this = _possibleConstructorReturn(this, (Measure.__proto__ || Object.getPrototypeOf(Measure)).call(this, options));
    
            Object.defineProperty(_this, "measureTooltips_", {
                enumerable: true,
                writable: true,
                value: []
            });
            Object.defineProperty(_this, "currentPoint", {
                enumerable: true,
                writable: true,
                value: null
            });
            Object.defineProperty(_this, "currentLength", {
                enumerable: true,
                writable: true,
                value: 0
            });
    
            _this.isUnique_ = options.isUnique ? options.isUnique : false;
            _this.measureType_ = options.type;
            if (!_this.measureType_) {
                console.error("未给出测量类型");
            }
            _this.style_ = options.style ? options.style : [new ol.style.Style({
                fill: new ol.style.Fill({
                    color: 'rgba(255, 255, 255, 0.3)'
                }),
                stroke: new ol.style.Stroke({
                    color: '#993300',
                    lineDash: [10, 10],
                    width: 2
                }),
                image: new ol.style.Circle({
                    radius: 5,
                    stroke: new ol.style.Stroke({
                        color: '#993300',
                        width: 2
                    }),
                    fill: new ol.style.Fill({
                        color: 'rgba(153, 51, 0, 0.3)'
                    })
                })
            }), new ol.style.Style({
                image: new ol.style.Circle({
                    radius: 5,
                    fill: new ol.style.Fill({
                        color: 'white'
                    }), stroke: new ol.style.Stroke({
                        color: '#993300',
                        width: 2
                    })
                }),
                geometry: function geometry(feature) {
                    // return the coordinates of the first ring of the polygon
                    var geometry = feature.getGeometry();
                    var coords = null;
                    if (geometry instanceof ol.geom.LineString) {
                        coords = geometry.getCoordinates();
                    } else if (geometry instanceof ol.geom.Polygon) {
                        coords = geometry.getCoordinates()[0];
                    }
                    if (coords) {
                        return new ol.geom.MultiPoint(coords);
                    }
                }
            })];
            return _this;
        }
    
        /**
         *重载setmap
         * @override
         * */
    
    
        _createClass(Measure, [{
            key: "onInit",
            value: function onInit(map) {
                var that = this;
                _get(Measure.prototype.__proto__ || Object.getPrototypeOf(Measure.prototype), "onInit", this).call(this, map);
                //添加控件
                this.addInteraction_();
                //绑定鼠标移动事件
                this.map_.on('pointermove', this.pointerMoveHandler, this);
                //绑定鼠标点击事件
                this.map_.on("singleclick", this.pointerClickHandler, this);
                this.map_.getViewport().addEventListener('mouseout', function (evt) {
                    that.mouseOutHandle_.call(that, evt);
                });
            }
    
            /**
             *析构
             * */
    
        }, {
            key: "onDispose",
            value: function onDispose() {
                _get(Measure.prototype.__proto__ || Object.getPrototypeOf(Measure.prototype), "onDispose", this).call(this);
                this.map_.removeOverlay(this.helpTooltip_);
                //刪除测量标注
                for (var i = 0; i < this.measureTooltips_.length; i++) {
                    this.map_.removeOverlay(this.measureTooltips_[i]);
                }
                this.map_.removeInteraction(this.draw_);
    
                this.map_.un("pointermove", this.pointerMoveHandler);
                this.map_.un("mouseout", this.mouseOutHandle_);
                this.map_.un("singleclick", this.pointerClickHandler);
                var layers = this.map_.getLayers();
                layers.forEach(function (layer) {
                    if (layer.name === "测量层") {
                        layer.getSource().clear();
                    }
                });
            }
        }]);
    
        return Measure;
    }(_index2.default);
    
    exports.default = Measure;
    /* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(15)))
    
    /***/ }),
    /* 15 */
    /***/ (function(module, exports, __webpack_require__) {
    
    "use strict";
    
    
    var i18n = {
        MEASURE_START_HELP_MSG: "单击开始测量",
        MEASURE_END_HELP_MSG: "双击结束测量",
        ContinuePolygonMsg: "单击继续绘制多边形",
        ContinueLineString: "单击继续绘制线段"
    };
    
    module.exports = i18n;
    
    /***/ }),
    /* 16 */
    /***/ (function(module, exports) {
    
    // removed by extract-text-webpack-plugin
    
    /***/ }),
    /* 17 */
    /***/ (function(module, exports, __webpack_require__) {
    
    "use strict";
    
    
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    
    var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
    
    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
    
    //import util from "../../util/index";
    
    var Control = function () {
        _createClass(Control, [{
            key: "map",
            get: function get() {
                return this.map_;
            }
    
            /**
             * 控件是否只支持一个
             * @type {boolean}
             * */
    
            /**
             * 地图对象
             * */
    
        }, {
            key: "isUnique",
            get: function get() {
                return this.isUnique_;
            }
    
            /**
             * 控件Id
             * @type {String}
             * */
    
        }, {
            key: "id",
            get: function get() {
                return this._id;
            }
    
            /**
             * @constructor
             * */
    
        }]);
    
        function Control() {
            _classCallCheck(this, Control);
    
            //this._id = util.createId();
            this._id = mv.util.createId();
        }
    
        /**
         * 初始化方法
         * */
    
    
        _createClass(Control, [{
            key: "onInit",
            value: function onInit(map) {
                this.map_ = map;
            }
    
            /**
             * 失效方法
             * */
    
        }, {
            key: "onDispose",
            value: function onDispose() {}
        }]);
    
        return Control;
    }();
    
    exports.default = Control;
    
    /***/ }),
    /* 18 */
    /***/ (function(module, exports, __webpack_require__) {
    
    "use strict";
    
    
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var theme = {};
    
    exports.default = theme;
    
    /***/ }),
    /* 19 */
    /***/ (function(module, exports, __webpack_require__) {
    
    "use strict";
    
    
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    
    var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
    
    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
    
    var query = function () {
        function query() {
            _classCallCheck(this, query);
    
            Object.defineProperty(this, "_SERVICE_PROPERTYQUERY", {
                enumerable: true,
                writable: true,
                value: "propertyQuery"
            });
            Object.defineProperty(this, "_SERVICE_SPATIALQUERY", {
                enumerable: true,
                writable: true,
                value: "spatialQuery"
            });
        }
    
        _createClass(query, [{
            key: "propertyQuery",
    
    
            /**
             * 属性查询
             *
             * @param lryId
             *            图层id
             * @param whereCause
             *            过滤条件
             * @param onSuccess
             *            成功回调
             * @param onError
             *            失败回调
             * @param geoType
             *            返回空间数据类型 polygon | point
             * @function 属性查询
             */
            value: function propertyQuery(lryId, whereCause, onSuccess, onError, geoType, page, rows) {
                var url = DataSERVICE + "/" + lryId + "." + format;
                var data = {
                    method: this._SERVICE_PROPERTYQUERY,
                    userid: 1,
                    wherecause: encodeURIComponent(whereCause),
                    resultgeotype: geoType == null || geoType == undefined ? 'polygon' : 'point',
                    page: page ? page : 0,
                    rows: rows ? rows : 50000
                };
                jsonpRequest(url, data, function (jsonData) {
                    if (onSuccess) {
                        onSuccess(jsonData[0]);
                    }
                }, function () {
                    if (onError) {
                        onError();
                    }
                });
            }
        }, {
            key: "jdbcQuery",
    
    
            /**
             * 非空间属性查询
             *
             * @param lryId
             *            图层id
             * @param whereCause
             *            过滤条件
             * @param onSuccess
             *            回调
             * @param fields
             *            查询字段，以逗号分隔
             * @function 属性查询
             */
            value: function jdbcQuery(lryId, whereCause, onSuccess, onError, fields, isBuffer, page, rows) {
                var url = DataSERVICE + "/" + lryId + "." + format;
                var data = {
                    method: this._SERVICE_PROPERTYQUERY,
                    userid: 1,
                    wherecause: encodeURIComponent(whereCause),
                    resultgeotype: "data",
                    fields: fields,
                    isbuffer: isBuffer,
                    page: page ? page : 1,
                    rows: rows ? rows : 50000
                };
                jsonpRequest(url, data, function (jsonData) {
                    if (onSuccess) {
                        onSuccess(jsonData[0]);
                    }
                }, function () {
                    if (onError) {
                        onError();
                    }
                });
            }
        }, {
            key: "jdbcQuery2",
    
    
            /**
             * 非空间属性查询
             *
             * @param lryId
             *            图层id
             * @param fk
             *            属性表外键
             * @param spatatialId
             *            空间id（不需关联传-1）
             * @param fk2
             *            空间表外键
             * @param whereCause
             *            过滤条件
             * @param onSuccess
             *            回调
             * @param fields
             *            查询字段，以逗号分隔
             * @function 属性查询
             */
            value: function jdbcQuery2(lryId, fk, spatatialId, fk2, whereCause, onSuccess, onError, fields, page, rows, ajaxOption) {
                if (!whereCause) {
                    whereCause = "1=1";
                }
                var url = DataSERVICE + "/" + lryId + "." + format;
                var data = {
                    method: this._SERVICE_PROPERTYQUERY,
                    userid: 1,
                    wherecause: encodeURIComponent(whereCause),
                    resultgeotype: "data",
                    fields: fields,
                    spatatialId: spatatialId,
                    fk: fk,
                    fk2: fk2,
                    page: page ? page : 1,
                    rows: rows ? rows : 50000
                };
                jsonpRequest(url, data, function (jsonData) {
                    if (onSuccess) {
                        onSuccess(jsonData[0]);
                    }
                }, function () {
                    if (onError) {
                        onError();
                    }
                }, ajaxOption);
            }
        }, {
            key: "propertyQueryByCity",
    
    
            /**
             * 属性查询
             *
             * @param lryId
             *            图层id
             * @param whereCause
             *            过滤条件
             * @param onSuccess
             *            回调
             * @param geoType
             *            返回空间数据类型 polygon | point
             * @function 属性查询
             */
            value: function propertyQueryByCity(lryId, divitionId, city, whereCause, onSuccess, onError, userid, geoType, page, rows) {
                var url = DataSERVICE + "/" + lryId + "." + format;
                var data = {
                    method: this._SERVICE_PROPERTYQUERY,
                    userid: userid || -1,
                    city: city || "全国",
                    divition: divitionId,
                    wherecause: encodeURIComponent(whereCause),
                    resultgeotype: geoType || 'polygon',
                    page: page ? page : 0,
                    rows: rows ? rows : 500000
                };
                jsonpRequest(url, data, function (jsonData) {
                    if (onSuccess) {
                        onSuccess(jsonData[0]);
                    }
                }, function () {
                    if (onError) {
                        onError();
                    }
                });
            }
        }, {
            key: "joinQuery",
    
    
            /**
             * 关联查询
             *
             * @param source
             *            空间图层id
             * @param target
             *             数据图层id
             * @param whereCause1
             *            空间过滤条件
             * @param whereCause2
             *            屬性过滤条件
             * @param onSuccess
             *            回调
             * @param onError
             *            返回空间数据类型 polygon | point
             * @param {Number} page
             *            分页数
             * @param {Number} rows
             *            每页数
             * @function 属性查询
             */
            value: function joinQuery(source, target, whereCause1, whereCause2, onSuccess, onError, page, rows) {
                var url = DataSERVICE + "/999.json";
                var data = {
                    method: "joinQuery",
                    source: source,
                    target: target,
                    wherecause1: whereCause1,
                    wherecause2: whereCause2,
                    resultgeotype: "polygon",
                    page: page ? page : 0,
                    rows: rows ? rows : 100000
                };
                jsonpRequest(url, data, onSuccess, onError);
            }
    
            /**
             * 空间查询
             *
             * @param lryId
             *            图层id
             * @param strGeo
             *            113.752 38.2434,114.148 38.1695,114.048 37.8354,113.653
             *            37.9091,113.752 38.2434
             * @param whereCause
             *            过滤条件
             * @param onSuccess
             *            回调
             * @param onError
             *            错误回调
             * @param geoType
             *            返回空间数据类型 (polygon | point)
             * @param wktype
             *            geometry格式（full | null）
             * @function 空间查询
             */
    
        }, {
            key: "spatialQuery",
            value: function spatialQuery(lryId, strGeo, whereCause, onSuccess, onError, geoType, page, rows, method, wktype) {
                var url = DataSERVICE + "/" + lryId + "." + format;
                var data = {
                    method: this._SERVICE_SPATIALQUERY,
                    userid: 1,
                    geo: strGeo,
                    page: page ? page : 0,
                    rows: rows ? rows : 50000,
                    wherecause: encodeURIComponent(whereCause), // whereCause
                    resultgeotype: geoType == null || geoType == undefined ? 'polygon' : 'point',
                    wktype: wktype ? wktype : null
                };
                if (!method || method == "jsonp") {
                    jsonpRequest(url, data, function (jsonData) {
                        if (onSuccess) {
                            onSuccess(jsonData[0]);
                        }
                    }, function () {
                        if (onError) {
                            onError();
                        }
                    });
                } else if (method == "post") {
                    postRequest(url, data, function (jsonData) {
                        if (onSuccess) {
                            onSuccess(jsonData[0]);
                        }
                    }, function () {
                        if (onError) {
                            onError();
                        }
                    }, "json");
                }
            }
        }, {
            key: "twoSpatialQuery",
    
    
            /**
             * 两级空间查询
             *
             * @param lryId
             *            图层id
             * @param cluseId
             *            首次分析的图层id
             * @param cluseFields
             *            首次分析的图层要加入的字段
             * @param strGeo
             *            113.752 38.2434,114.148 38.1695,114.048 37.8354,113.653
             *            37.9091,113.752 38.2434
             * @param whereCause
             *            过滤条件
             * @param onSuccess
             *            回调
             * @param onError
             *            错误回调
             * @param geoType
             *            返回空间数据类型 (polygon | point)
             * @function 空间查询
             */
            value: function twoSpatialQuery(lryId, cluseId, cluseWhereCause, cluseFields, strGeo, whereCause, onSuccess, onError, geoType, page, rows, method, wktype) {
    
                var url = DataSERVICE + "/" + lryId + "." + format;
                var data = {
                    method: this._SERVICE_SPATIALQUERY,
                    cluseId: cluseId,
                    cluseFields: encodeURIComponent(cluseFields),
                    userid: 1,
                    cluseWhereCause: encodeURIComponent(cluseWhereCause),
                    geo: strGeo,
                    page: page ? page : 0,
                    rows: rows ? rows : 50000,
                    wherecause: encodeURIComponent(whereCause), // whereCause
                    resultgeotype: geoType == null || geoType == undefined ? 'polygon' : 'point',
                    wktype: wktype ? wktype : null
                };
                if (!method || method == "jsonp") {
                    jsonpRequest(url, data, function (jsonData) {
                        if (onSuccess) {
                            onSuccess(jsonData[0]);
                        }
                    }, function () {
                        if (onError) {
                            onError();
                        }
                    });
                } else if (method == "post") {
                    postRequest(url, data, function (jsonData) {
                        if (onSuccess) {
                            onSuccess(jsonData[0]);
                        }
                    }, function () {
                        if (onError) {
                            onError();
                        }
                    }, "json");
                }
            }
        }, {
            key: "twoSpatialQueryByCity",
    
    
            /**
             * 两级空间查询
             *
             * @param lryId
             *            图层id
             * @param cluseId
             *            首次分析的图层id
             * @param divition
             *            行政区划图层id
             * @param lryId
             *            图层id
             * @param strCity
             *            当前城市名
             * @param whereCause
             *            过滤条件
             * @param onSuccess
             *            回调
             * @param onError
             *            错误回调
             * @param geoType
             *            返回空间数据类型 (polygon | point)
             * @function 空间查询
             */
            value: function twoSpatialQueryByCity(lryId, divition, cluseId, cluseWhereCause, cluseFields, strCity, whereCause, onSuccess, onError, geoType, page, rows, method, wktype) {
    
                var url = DataSERVICE + "/" + lryId + "." + format;
                var data = {
                    method: this._SERVICE_SPATIALQUERY,
                    userid: 1,
                    divition: divition,
                    cluseId: cluseId,
                    cluseFields: encodeURIComponent(cluseFields),
                    cluseWhereCause: encodeURIComponent(cluseWhereCause),
                    city: encodeURIComponent(strCity),
                    page: page ? page : 0,
                    rows: rows ? rows : 50000,
                    wherecause: encodeURIComponent(whereCause), // whereCause
                    resultgeotype: geoType == null || geoType == undefined ? 'polygon' : 'point',
                    wktype: wktype ? wktype : null
                };
                if (!method || method == "jsonp") {
                    jsonpRequest(url, data, function (jsonData) {
                        if (onSuccess) {
                            onSuccess(jsonData[0]);
                        }
                    }, function () {
                        if (onError) {
                            onError();
                        }
                    });
                } else if (method == "post") {
                    postRequest(url, data, function (jsonData) {
                        if (onSuccess) {
                            onSuccess(jsonData[0]);
                        }
                    }, function () {
                        if (onError) {
                            onError();
                        }
                    }, "json");
                }
            }
        }, {
            key: "innerSpatialQuery",
            value: function innerSpatialQuery(lryId, strGeo, whereCause, onSuccess, onError, pageindex, pagesize) {
                var url = DataSERVICE + "/" + lryId + "." + format;
                var data = {
                    method: this._SERVICE_SPATIALQUERY,
                    userid: 1,
                    geo: strGeo,
                    page: pageindex,
                    rows: pagesize,
                    wherecause: "" // whereCause
                };
                jsonpRequest(url, data, function (jsonData) {
                    if (onSuccess) {
                        onSuccess(jsonData[0], false);
                    }
                }, function () {
                    if (onError) {
                        onError();
                    }
                });
            }
        }, {
            key: "poiQuery",
    
    
            /**
             * POI查询
             *
             * @param lryId
             *            图层id
             * @param strGeo
             *            113.752 38.2434,114.148 38.1695,114.048 37.8354,113.653
             *            37.9091,113.752 38.2434
             * @param whereCause
             *            过滤条件
             * @param onSuccess
             *            回调
             * @function POI查询
             */
            value: function poiQuery(lryId, strGeo, whereCause, onSuccess, onError) {
                var url = _POISERVICE + "/" + lryId + "." + format;
                var data = {
                    userid: 1,
                    geo: strGeo,
                    wherecause: encodeURIComponent(whereCause)
                };
                jsonpRequest(url, data, function (jsonData) {
                    if (onSuccess) {
                        onSuccess(jsonData[0]);
                    }
                }, function () {
                    alert('POI查询失败!');
                    if (onError) {
                        onError();
                    }
                });
            }
        }, {
            key: "wmsQuery",
    
    
            /**
             * wms查询
             *
             * @param lryId
             *            图层id
             * @param whereCause
             *            过滤条件
             * @param tolerance
             *            容差
             * @param onSuccess
             *            回调
             * @param onError
             *            失败回调
             * @param isReset
             *            是否单次查询
             * @function wms查询
             */
            value: function wmsQuery(lryId, whereCause, tolerance, onSuccess, onError, isReset) {
                var pobj = this;
                var mapHandler = handler == null ? this.handler : handler;
                // 1. draw
                mapHandler.draw("point", function (e) {
                    var geoData = e.x + " " + e.y;
    
                    // 2. get buffer
                    var a = new mv.Handle.Analysis();
                    var distance = tolerance / 96400;
                    a.bufferAnalysis(geoData, distance, function (strGeo) {
                        strGeo = strGeo.substring(strGeo.lastIndexOf('((') + 2, strGeo.length - 2);
    
                        // 3. spatial query
                        pobj.spatialQuery(lryId, strGeo, whereCause, onSuccess, onError, null);
                    }, onError);
                }, isReset, false);
            }
        }, {
            key: "wmsMultiQuery",
    
    
            /**
             * wms查询(多图层查询)
             *
             * @param tolerance
             *            容差
             * @param onSuccess
             *            回调
             * @param onError
             *            失败回调
             * @param isReset
             *            是否单次查询
             * @function wms查询
             */
            value: function wmsMultiQuery(tolerance, onSuccess, onError, isReset) {}
        }, {
            key: "networkPoiQuery",
    
    
            /**
             * 网络地图查询
             *
             * @param poiname
             *            查询名称
             * @param region
             *            所在城市
             * @param format
             *            返回格式
             * @param onSucces
             *            回调
             * @function 网络地图查询
             */
            value: function networkPoiQuery(poiname, region, onSuccess, onError) {
                var url = _POISERVICE + "/-1." + format;
                var data = {
                    q: poiname,
                    region: region
                };
                jsonpRequest(url, data, function (jsonData) {
                    if (onSuccess) {
                        onSuccess(jsonData[0]);
                    }
                }, function () {
                    alert('POI查询失败!');
                    if (onError) {
                        onError();
                    }
                });
            }
        }]);
    
        return query;
    }();
    
    exports.default = query;
    
    /***/ }),
    /* 20 */
    /***/ (function(module, exports, __webpack_require__) {
    
    "use strict";
    
    
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    
    var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
    
    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
    
    /**
     * 采集工具类
     * */
    var editor = function () {
        _createClass(editor, [{
            key: "map",
    
            /**
             * 编辑前的对象
             * */
    
            /**
             *  选择工具
             * */
    
            /**
             * 编辑图层
             * */
            get: function get() {
                return this.map_;
            }
            /**
             * 当前正在编辑的对象
             * */
    
            /**
             *  绘制工具
             * */
    
            /**
             *  编辑工具
             * */
            ,
            set: function set(map) {
                this.map_ = map;
            }
        }, {
            key: "oldFeature",
            get: function get() {
                return this.oldFeature_;
            },
            set: function set(f) {
                this.oldFeature_ = f;
            }
        }, {
            key: "currentFeature",
            get: function get() {
                return this.currentFeature_;
            },
            set: function set(f) {
                this.currentFeature_ = f;
            }
    
            /**
             * 构造函数
             * @param {ol.Map} map - 地图对象
             * @param {ol.layer.Vector} layer - 图层数据源
             * @param {	ol.geom.GeometryType} type - 图层类型
             * @param {Function} selected - 编辑图形选中事件
             * @param {	Function} drawend - 添加对象结束事件
             * @param {Function} modifyend - 编辑结束事件
             * */
    
        }]);
    
        function editor(map, layer, type, selected, drawend, modifyend) {
            _classCallCheck(this, editor);
    
            Object.defineProperty(this, "map_", {
                enumerable: true,
                writable: true,
                value: null
            });
    
            this.map_ = map;
            this.editLayer = layer;
            //初始化测量控件
            this.ctl_select = new ol.interaction.Select({
                wrapX: false,
                layers: [layer]
            });
            this.ctl_select.setActive(false);
            this.ctl_select.on("select", function (evt) {
                var fs = evt.selected;
                if (fs.length) {
                    //缓存选择的地图要素
                    this.currentFeature = fs[0];
                    this.oldFeature = this.currentFeature.clone();
                }
                if (selected) {
                    selected.call(this, evt);
                }
            }, this);
            //初始化编辑控件
            this.ctl_modify = new ol.interaction.Modify({
                features: this.ctl_select.getFeatures()
            });
            this.ctl_modify.setActive(false);
            this.ctl_modify.on("modifyend", modifyend);
            //初始化绘制控件
            this.ctl_draw = new ol.interaction.Draw({
                source: layer.getSource(),
                type: type
            });
            this.ctl_draw.setActive(false);
            this.ctl_draw.on("drawend", function (evt) {
                this.currentFeature = evt.feature;
                drawend.call(this, evt);
            }, this);
    
            this.map_.addInteraction(this.ctl_modify);
            this.map_.addInteraction(this.ctl_select);
            this.map_.addInteraction(this.ctl_draw);
        }
    
        /**
         * 添加对象
         * */
    
    
        _createClass(editor, [{
            key: "startAdd",
            value: function startAdd() {
                this.ctl_draw.setActive(true);
                this.ctl_select.setActive(false);
                this.ctl_modify.setActive(false);
            }
    
            /**
             * 开始编辑图形
             * */
    
        }, {
            key: "startModify",
            value: function startModify() {
                this.ctl_draw.setActive(false);
                this.ctl_select.setActive(true);
                this.ctl_modify.setActive(true);
            }
    
            /**
             * 添加对象
             * @param {Number} sid - 服务id
             * @param {Array<Object>} fs - 数据对象数组
             * @param {Number} uid - 用户id
             * @param {Function} onSuccess - 回调函数
             * */
    
        }, {
            key: "addFeatures",
            value: function addFeatures(sid, fs, uid, onSuccess) {
                var url = ADD_FEATURES + "/" + sid + ".json";
                $.post(url, {
                    fs: JSON.stringify(fs),
                    uid: uid
                }, function (data) {
                    onSuccess(data, fs);
                }, "json");
            }
    
            /**
             *更新对象属性
             * @param {Number} sid - 服务id
             * @param {Array<Object>} fs - 对象数组
             * @param {Number} uid - 用户id
             * @param {Function} onSuccess - 回调函数
             * */
    
        }, {
            key: "updateFeatures",
            value: function updateFeatures(sid, fs, uid, onSuccess) {
                var url = EDIT_FEATURE + "/" + sid + ".json";
                $.post(url, {
                    fs: JSON.stringify(fs),
                    uid: uid
                }, function (data) {
                    onSuccess(data);
                }, "json");
            }
    
            /**
             * 删除要素
             * @param {Number} sid - 服务id
             * @param {Object} f - 地图对象
             * @param {Number} uid - 用户id
             * @param {Function} onSuccess - 回调函数
             * */
    
        }, {
            key: "deleteFeature",
            value: function deleteFeature(sid, f, uid, onSuccess) {
                var url = DELETE_FEATURE + "/" + sid + ".json";
                $.post(url, {
                    f: JSON.stringify(f),
                    uid: uid
                }, function (data) {
                    onSuccess(data);
                }, "json");
            }
        }]);
    
        return editor;
    }();
    
    exports.default = editor;
    
    /***/ }),
    /* 21 */
    /***/ (function(module, exports, __webpack_require__) {
    
    "use strict";
    
    
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var Hashids = __webpack_require__(22);
    var hashids = new Hashids();
    var util = {
        createId: function createId() {
            return hashids.encode(new Date().getTime());
        }
    };
    
    exports.default = util;
    
    /***/ }),
    /* 22 */
    /***/ (function(module, exports, __webpack_require__) {
    
    var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
        if (true) {
            !(__WEBPACK_AMD_DEFINE_ARRAY__ = [module, exports], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
                    __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
                    (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
                    __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
        } else if (typeof exports !== "undefined") {
            factory(module, exports);
        } else {
            var mod = {
                exports: {}
            };
            factory(mod, mod.exports);
            global.Hashids = mod.exports;
        }
    })(this, function (module, exports) {
        'use strict';
    
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
    
        function _classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) {
                throw new TypeError("Cannot call a class as a function");
            }
        }
    
        var _createClass = function () {
            function defineProperties(target, props) {
                for (var i = 0; i < props.length; i++) {
                    var descriptor = props[i];
                    descriptor.enumerable = descriptor.enumerable || false;
                    descriptor.configurable = true;
                    if ("value" in descriptor) descriptor.writable = true;
                    Object.defineProperty(target, descriptor.key, descriptor);
                }
            }
    
            return function (Constructor, protoProps, staticProps) {
                if (protoProps) defineProperties(Constructor.prototype, protoProps);
                if (staticProps) defineProperties(Constructor, staticProps);
                return Constructor;
            };
        }();
    
        var Hashids = function () {
            function Hashids() {
                var salt = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
                var minLength = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
                var alphabet = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
    
                _classCallCheck(this, Hashids);
    
                var minAlphabetLength = 16;
                var sepDiv = 3.5;
                var guardDiv = 12;
    
                var errorAlphabetLength = 'error: alphabet must contain at least X unique characters';
                var errorAlphabetSpace = 'error: alphabet cannot contain spaces';
    
                var uniqueAlphabet = '',
                    sepsLength = void 0,
                    diff = void 0;
    
                /* funcs */
    
                this.escapeRegExp = function (s) {
                    return s.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
                };
                this.parseInt = function (v, radix) {
                    return (/^(\-|\+)?([0-9]+|Infinity)$/.test(v) ? parseInt(v, radix) : NaN
                    );
                };
    
                /* alphabet vars */
    
                this.seps = 'cfhistuCFHISTU';
                this.minLength = parseInt(minLength, 10) > 0 ? minLength : 0;
                this.salt = typeof salt === 'string' ? salt : '';
    
                if (typeof alphabet === 'string') {
                    this.alphabet = alphabet;
                }
    
                for (var i = 0; i !== this.alphabet.length; i++) {
                    if (uniqueAlphabet.indexOf(this.alphabet.charAt(i)) === -1) {
                        uniqueAlphabet += this.alphabet.charAt(i);
                    }
                }
    
                this.alphabet = uniqueAlphabet;
    
                if (this.alphabet.length < minAlphabetLength) {
                    throw errorAlphabetLength.replace('X', minAlphabetLength);
                }
    
                if (this.alphabet.search(' ') !== -1) {
                    throw errorAlphabetSpace;
                }
    
                /*
           `this.seps` should contain only characters present in `this.alphabet`
           `this.alphabet` should not contains `this.seps`
       */
    
                for (var _i = 0; _i !== this.seps.length; _i++) {
    
                    var j = this.alphabet.indexOf(this.seps.charAt(_i));
                    if (j === -1) {
                        this.seps = this.seps.substr(0, _i) + ' ' + this.seps.substr(_i + 1);
                    } else {
                        this.alphabet = this.alphabet.substr(0, j) + ' ' + this.alphabet.substr(j + 1);
                    }
                }
    
                this.alphabet = this.alphabet.replace(/ /g, '');
    
                this.seps = this.seps.replace(/ /g, '');
                this.seps = this._shuffle(this.seps, this.salt);
    
                if (!this.seps.length || this.alphabet.length / this.seps.length > sepDiv) {
    
                    sepsLength = Math.ceil(this.alphabet.length / sepDiv);
    
                    if (sepsLength > this.seps.length) {
    
                        diff = sepsLength - this.seps.length;
                        this.seps += this.alphabet.substr(0, diff);
                        this.alphabet = this.alphabet.substr(diff);
                    }
                }
    
                this.alphabet = this._shuffle(this.alphabet, this.salt);
                var guardCount = Math.ceil(this.alphabet.length / guardDiv);
    
                if (this.alphabet.length < 3) {
                    this.guards = this.seps.substr(0, guardCount);
                    this.seps = this.seps.substr(guardCount);
                } else {
                    this.guards = this.alphabet.substr(0, guardCount);
                    this.alphabet = this.alphabet.substr(guardCount);
                }
            }
    
            _createClass(Hashids, [{
                key: 'encode',
                value: function encode() {
                    for (var _len = arguments.length, numbers = Array(_len), _key = 0; _key < _len; _key++) {
                        numbers[_key] = arguments[_key];
                    }
    
                    var ret = '';
    
                    if (!numbers.length) {
                        return ret;
                    }
    
                    if (numbers[0] && numbers[0].constructor === Array) {
                        numbers = numbers[0];
                        if (!numbers.length) {
                            return ret;
                        }
                    }
    
                    for (var i = 0; i !== numbers.length; i++) {
                        numbers[i] = this.parseInt(numbers[i], 10);
                        if (numbers[i] >= 0) {
                            continue;
                        } else {
                            return ret;
                        }
                    }
    
                    return this._encode(numbers);
                }
            }, {
                key: 'decode',
                value: function decode(id) {
    
                    var ret = [];
    
                    if (!id || !id.length || typeof id !== 'string') {
                        return ret;
                    }
    
                    return this._decode(id, this.alphabet);
                }
            }, {
                key: 'encodeHex',
                value: function encodeHex(hex) {
    
                    hex = hex.toString();
                    if (!/^[0-9a-fA-F]+$/.test(hex)) {
                        return '';
                    }
    
                    var numbers = hex.match(/[\w\W]{1,12}/g);
    
                    for (var i = 0; i !== numbers.length; i++) {
                        numbers[i] = parseInt('1' + numbers[i], 16);
                    }
    
                    return this.encode.apply(this, numbers);
                }
            }, {
                key: 'decodeHex',
                value: function decodeHex(id) {
    
                    var ret = [];
    
                    var numbers = this.decode(id);
    
                    for (var i = 0; i !== numbers.length; i++) {
                        ret += numbers[i].toString(16).substr(1);
                    }
    
                    return ret;
                }
            }, {
                key: '_encode',
                value: function _encode(numbers) {
    
                    var ret = void 0,
                        alphabet = this.alphabet,
                        numbersIdInt = 0;
    
                    for (var i = 0; i !== numbers.length; i++) {
                        numbersIdInt += numbers[i] % (i + 100);
                    }
    
                    ret = alphabet.charAt(numbersIdInt % alphabet.length);
                    var lottery = ret;
    
                    for (var _i2 = 0; _i2 !== numbers.length; _i2++) {
    
                        var number = numbers[_i2];
                        var buffer = lottery + this.salt + alphabet;
    
                        alphabet = this._shuffle(alphabet, buffer.substr(0, alphabet.length));
                        var last = this._toAlphabet(number, alphabet);
    
                        ret += last;
    
                        if (_i2 + 1 < numbers.length) {
                            number %= last.charCodeAt(0) + _i2;
                            var sepsIndex = number % this.seps.length;
                            ret += this.seps.charAt(sepsIndex);
                        }
                    }
    
                    if (ret.length < this.minLength) {
    
                        var guardIndex = (numbersIdInt + ret[0].charCodeAt(0)) % this.guards.length;
                        var guard = this.guards[guardIndex];
    
                        ret = guard + ret;
    
                        if (ret.length < this.minLength) {
    
                            guardIndex = (numbersIdInt + ret[2].charCodeAt(0)) % this.guards.length;
                            guard = this.guards[guardIndex];
    
                            ret += guard;
                        }
                    }
    
                    var halfLength = parseInt(alphabet.length / 2, 10);
                    while (ret.length < this.minLength) {
    
                        alphabet = this._shuffle(alphabet, alphabet);
                        ret = alphabet.substr(halfLength) + ret + alphabet.substr(0, halfLength);
    
                        var excess = ret.length - this.minLength;
                        if (excess > 0) {
                            ret = ret.substr(excess / 2, this.minLength);
                        }
                    }
    
                    return ret;
                }
            }, {
                key: '_decode',
                value: function _decode(id, alphabet) {
    
                    var ret = [],
                        i = 0,
                        r = new RegExp('[' + this.escapeRegExp(this.guards) + ']', 'g'),
                        idBreakdown = id.replace(r, ' '),
                        idArray = idBreakdown.split(' ');
    
                    if (idArray.length === 3 || idArray.length === 2) {
                        i = 1;
                    }
    
                    idBreakdown = idArray[i];
                    if (typeof idBreakdown[0] !== 'undefined') {
    
                        var lottery = idBreakdown[0];
                        idBreakdown = idBreakdown.substr(1);
    
                        r = new RegExp('[' + this.escapeRegExp(this.seps) + ']', 'g');
                        idBreakdown = idBreakdown.replace(r, ' ');
                        idArray = idBreakdown.split(' ');
    
                        for (var j = 0; j !== idArray.length; j++) {
    
                            var subId = idArray[j];
                            var buffer = lottery + this.salt + alphabet;
    
                            alphabet = this._shuffle(alphabet, buffer.substr(0, alphabet.length));
                            ret.push(this._fromAlphabet(subId, alphabet));
                        }
    
                        if (this.encode(ret) !== id) {
                            ret = [];
                        }
                    }
    
                    return ret;
                }
            }, {
                key: '_shuffle',
                value: function _shuffle(alphabet, salt) {
    
                    var integer = void 0;
    
                    if (!salt.length) {
                        return alphabet;
                    }
    
                    alphabet = alphabet.split("");
    
                    for (var i = alphabet.length - 1, v = 0, p = 0, j = 0; i > 0; i--, v++) {
    
                        v %= salt.length;
                        p += integer = salt.charCodeAt(v);
                        j = (integer + v + p) % i;
    
                        var tmp = alphabet[j];
                        alphabet[j] = alphabet[i];
                        alphabet[i] = tmp;
                    }
    
                    alphabet = alphabet.join("");
    
                    return alphabet;
                }
            }, {
                key: '_toAlphabet',
                value: function _toAlphabet(input, alphabet) {
    
                    var id = '';
    
                    do {
                        id = alphabet.charAt(input % alphabet.length) + id;
                        input = parseInt(input / alphabet.length, 10);
                    } while (input);
    
                    return id;
                }
            }, {
                key: '_fromAlphabet',
                value: function _fromAlphabet(input, alphabet) {
    
                    return input.split("").map(function (item) {
                        return alphabet.indexOf(item);
                    }).reduce(function (carry, item) {
                        return carry * alphabet.length + item;
                    }, 0);
                }
            }]);
    
            return Hashids;
        }();
    
        exports.default = Hashids;
        module.exports = exports['default'];
    });
    
    
    /***/ })
    ],[7]);
    //# sourceMappingURL=api.bundle.js.map