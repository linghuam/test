/**************开发环境下使用此配置，部署时请注释掉此配置*****************/
// require.config({
// 	paths:{
//         // 核心lib
//         "jquery": 'library/jquery/jquery.min',
//         "bootstrap": "library/bootstrap/js/bootstrap.min",

//         "leaflet": 'library/leaflet/leafletCore/leaflet-src',
//         "leaflet/draw":'library/leaflet/leafletDraw/leaflet.draw',
//         "leaflet/fix": 'library/leaflet/leaflet.fix',
//         "leaflet/playback":'library/leaflet/leafletPlayback/LeafletPlayback',  
//         "leaflet/rotateMarker":'library/leaflet/leaflet.rotateMarker',
//         "leaflet/chartLayer":'library/leaflet/chartLayer',
//         "leaflet/googleLayer":'library/leaflet/googleLayer',
//         "leaflet/shipDistLayer":'library/leaflet/shipDistLayer',
//         "leaflet/weatherLayer":'library/leaflet/weatherLayer',
//         "leaflet/rasterLayer":'library/leaflet/rasterLayer',
//         "esri/leaflet":'library/esrileaflet/esri-leaflet-src',

//         "echarts": 'library/echarts/echarts.min',

//         //core 
//         "core/application":'core/core.application',
//         "core/baseobject":'core/core.baseobject',
//         "core/map":'core/core.map',
//         "core/namespace":'core/core.namespace',
//         "core/pool":'core/core.pool',

//         //layout
//         "layout/base":'layout/layout.base',
//         "layout/menu":'layout/layout.menu',
//         "layout/toppanel":'layout/layout.toppanel',

//         //control
//         "control/draw":'control/control.draw',
//         "control/panel":'control/control.panel',
//         "control/playback":'control/control.playback',
//         "control/layerswitch":'control/control.layerswitch',
//         "control/paging":'control/control.paging',
//         "control/measure":'control/control.measure',
//         "control/loading":'control/control.loading',
//         // "control/fullscreen":'control/control.fullscreen',

//         //data
//         "data/ajax":'data/data.ajax',
//         "data/localStorage":'data/data.localStorage',
//         "data/sessionStorage":'data/data.sessionStorage',

//         //util
//         "util/base":'util/util.base',
//         "util/dialog":'util/util.dialog',
//         "util/tool":'util/util.tool',
//         "util/dateTime":'util/util.dateTime',

//         //plugins
//         "plugins/mcscroll":'plugins/jquery.customscrollbar/jquery.mCustomScrollbar.min',
//         "plugins/rangeSlider":'plugins/jquery.rangeSlider',
//         "plugins/jqueryi18n":'plugins/jquery.i18n.properties/jquery.i18n.properties',
//         "plugins/contextmenu":'plugins/jquery.contextmenu/jquery.contextMenu',
//         "plugins/uiposition":'plugins/jquery.contextmenu/jquery.ui.position',
//         // "plugins/my97DatePicker":'plugins/My97DatePicker/WdatePicker',
//         "plugins/ztree":'plugins/zTree/ztree',
//         "plugins/proj4js":'plugins/proj4js/proj4-src',
//         "plugins/wgs2mars":'plugins/wgs2mars/wgs2mars',
//         "plugins/gpscorrect":'plugins/wgs2mars/gpscorrect',
//         // "plugins/ajaxpoll":'plugins/jquery.ajaxpoll',

//         //func
//         "func/base":'func/func.base',
//         "func/tshf":'func/func.tshf',
//         "func/hjcx":'func/func.hjcx',
//         "func/oceanWeather":'func/func.oceanWeather',
//         // "func/abnormalAlarm":'func/func.abnormalAlarm',
//         // "func/monitorStatisc":'func/func.monitorStatisc',
//         // "func/productSub":'func/func.productSub',
//         "func/filterDisplay":'func/func.filterDisplay',
//         "func/userLogin":'func/func.userLogin',
//         "func/changepsw":'func/func.changepsw',
//         "func/realTarget":'func/func.realTarget',
//         "func/portInfo":'func/func.portInfo',
//         "func/keysearch":'func/func.keysearch',
//         "func/languages":'func/func.languages',
//         "func/heatmap":'func/func.heatmap',
//         "func/areaflow":'func/func.areaflow',
//         "func/portquery":'func/func.portquery',
//         "func/cdgl":'func/func.cdgl',
//         "func/cdgladdship":'func/func.cdgladdship',
//         "func/jrtx":'func/func.jrtx',
//         "func/weather":'func/func.weather'
//     },
//     shim: {
//         "bootstrap": { deps: ['jquery','css!library/bootstrap/css/bootstrap'] },
//         "leaflet": { deps: ['css!library/leaflet/leafletCore/leaflet'] },
//         "leaflet/draw": { deps: ['leaflet', 'css!library/leaflet/leafletDraw/leaflet.draw'] },
//         "leaflet/playback":{ deps:['leaflet'] },  

//         "core/application":{deps:['css!themes/css/system.main']},

//         "control/playback":{deps:['css!themes/css/control.playback']},
//         "control/panel":{deps:['css!themes/css/control.drawPopPanel']},
//         "control/layerswitch":{deps:['css!themes/css/control.layerswitch']},
//         "control/paging":{deps:['css!themes/css/control.paging']},
//         "control/measure":{deps:['css!themes/css/control.measure']},
//         "control/loading":{deps:['css!themes/css/control.loading']},
//         // "control/fullscreen":{deps:['css!themes/css/control.fullscreen']},

//         "plugins/mcscroll":{ deps:['jquery', 'css!plugins/jquery.customscrollbar/jquery.mCustomScrollbar'] },
//         "plugins/contextmenu":{deps:["jquery","plugins/uiposition","css!plugins/jquery.contextmenu/jquery.contextMenu"]},    
//         // "plugins/my97DatePicker":{deps:['css!plugins/My97DatePicker/skin/WdatePicker'],exports:'WdatePicker'},
//         "plugins/jqueryi18n":{deps:['jquery']},
//         "plugins/ztree":{ deps:['jquery', 'css!plugins/zTree/ztree'] },
//         // "plugins/ajaxpoll":{deps:['jquery']},

//         "func/tshf":{deps:['css!themes/css/func.tshf']},
//         "func/hjcx":{deps:['css!themes/css/func.hjcx']},
//         "func/oceanWeather":{deps:['css!themes/css/func.oceanWeather']},
//         // "func/abnormalAlarm":{deps:['css!themes/css/func.abnormalAlarm']},
//         // "func/productSub":{deps:['css!themes/css/func.productSub']},
//         // "func/monitorStatisc":{deps:['css!themes/css/func.monitorStatisc']},

//         "func/filterDisplay":{deps:['css!themes/css/func.filterDisplay']},
//         // "func/userLogin":{deps:['css!themes/css/func.userLogin']},
//         "func/changepsw":{deps:['css!themes/css/func.changepsw']},
//         "func/realTarget":{deps:['css!themes/css/func.realTarget']},
//         "func/portInfo":{deps:['css!themes/css/func.portInfo']},
//         "func/keysearch":{deps:['css!themes/css/func.keysearch']},
//         "func/heatmap":{deps:['css!themes/css/func.heatmap']},
//         "func/areaflow":{deps:['css!themes/css/func.areaflow']},
//         "func/portquery":{deps:['css!themes/css/func.portquery']},
//         "func/cdgl":{deps:['css!themes/css/func.cdgl']},
//         "func/jrtx":{deps:['css!themes/css/func.jrtx']},
//         "func/weather":{deps:['css!themes/css/func.weather']}
//     }
// });
/*******************************/

// require.config({
// 	 map:{'*':{'css':'library/requirejs/css'}}
// });

//*****************************应用入口-start***********************************//
require([
    "jquery",
    "leaflet",
    "bootstrap",
    "core/application"
], function () {
    $(document).ready(function () {       
        L.ICT.App = new L.ICT.Application(Project_ParamConfig);
        L.ict.app = L.ICT.App;
        L.ict.app.init();

    });

});
//*****************************应用入口-end***********************************//