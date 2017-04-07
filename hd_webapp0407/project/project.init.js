﻿//********************************模块配置-start****************************************//
/*
 *定义模块ID和模块路径
 */
var Default_Paths = {

    // 核心lib
    "jquery": '../library/jquery/jquery.min',
    "bootstrap": "../library/bootstrap/js/bootstrap.min",
    "css":"../library/requirejs/css.min",

    "leaflet": '../library/leaflet/leafletCore/leaflet-src',
    "leaflet/draw":'../library/leaflet/leafletDraw/leaflet.draw',
    "leaflet/fix": '../library/leaflet/leaflet.fix',
    "leaflet/playback":'../library/leaflet/leafletPlayback/LeafletPlayback',  
    "leaflet/rotateMarker":'../library/leaflet/leaflet.rotateMarker',
    "leaflet/chartLayer":'../library/leaflet/chartLayer',
    "leaflet/googleLayer":'../library/leaflet/googleLayer',
    "leaflet/shipDistLayer":'../library/leaflet/shipDistLayer',
    "leaflet/weatherLayer":'../library/leaflet/weatherLayer',
    "leaflet/rasterLayer":'../library/leaflet/rasterLayer',
    "esri/leaflet":'../library/esrileaflet/esri-leaflet-src',

    "echarts": '../library/echarts/echarts',

    //core 
    "core/application":'../core/core.application',
    "core/baseobject":'../core/core.baseobject',
    "core/map":'../core/core.map',
    "core/namespace":'../core/core.namespace',
    "core/pool":'../core/core.pool',

    //layout
    "layout/base":'../layout/layout.base',
    "layout/menu":'../layout/layout.menu',
    "layout/toppanel":'../layout/layout.toppanel',

    //control
    "control/draw":'../control/control.draw',
    "control/panel":'../control/control.panel',
    "control/playback":'../control/control.playback',
    "control/layerswitch":'../control/control.layerswitch',
    "control/paging":'../control/control.paging',
    "control/measure":'../control/control.measure',
    // "control/fullscreen":'../control/control.fullscreen',

    //data
    "data/ajax":'../data/data.ajax',
    "data/localStorage":'../data/data.localStorage',
    "data/sessionStorage":'../data/data.sessionStorage',

    //util
    "util/base":'../util/util.base',
    "util/dialog":'../util/util.dialog',
    "util/tool":'../util/util.tool',
    "util/dateTime":'../util/util.dateTime',

    //plugins
    "plugins/mcscroll":'../plugins/jquery.customscrollbar/jquery.mCustomScrollbar.min',
    "plugins/rangeSlider":'../plugins/jquery.rangeSlider',
    "plugins/jqueryi18n":'../plugins/jquery.i18n.properties/jquery.i18n.properties',
    "plugins/contextmenu":'../plugins/jquery.contextmenu/jquery.contextMenu',
    "plugins/uiposition":'../plugins/jquery.contextmenu/jquery.ui.position',
    "plugins/my97DatePicker":'../plugins/My97DatePicker/WdatePicker',
    "plugins/ztree":'../plugins/zTree/ztree',
    "plugins/proj4js":'../plugins/proj4js/proj4-src',
    "plugins/wgs2mars":'../plugins/wgs2mars/wgs2mars',
    "plugins/gpscorrect":'../plugins/wgs2mars/gpscorrect',
    // "plugins/ajaxpoll":'../plugins/jquery.ajaxpoll',

    //func
    "func/base":'../func/func.base',
    "func/tshf":'../func/func.tshf',
    "func/hjcx":'../func/func.hjcx',
    "func/oceanWeather":'../func/func.oceanWeather',
    // "func/abnormalAlarm":'../func/func.abnormalAlarm',
    // "func/monitorStatisc":'../func/func.monitorStatisc',
    // "func/productSub":'../func/func.productSub',
    "func/filterDisplay":'../func/func.filterDisplay',
    "func/userLogin":'../func/func.userLogin',
    "func/changepsw":'../func/func.changepsw',
    "func/realTarget":'../func/func.realTarget',
    "func/portInfo":'../func/func.portInfo',
    "func/keysearch":'../func/func.keysearch',
    "func/languages":'../func/func.languages',
    "func/heatmap":'../func/func.heatmap',
    "func/areaflow":'../func/func.areaflow',
    "func/portquery":'../func/func.portquery',
    "func/cdgl":'../func/func.cdgl',
    "func/cdgladdship":'../func/func.cdgladdship',
    "func/jrtx":'../func/func.jrtx',
    "func/weather":'../func/func.weather'

};

/*
 *对于非AMD规范的外部文件引入(依赖模块和依赖外部文件)
 */
var Default_Shims = {

    "bootstrap": { deps: ['jquery'] },
    "leaflet": { deps: ['css!../library/leaflet/leafletCore/leaflet.css'] },
    "leaflet/draw": { deps: ['leaflet', 'css!../../leafletDraw/leaflet.draw.css'] },
    "leaflet/playback":{ deps:['leaflet'] },  

    "control/playback":{deps:['css!../../themes/css/control.playback.css']},
    "control/panel":{deps:['css!../../themes/css/control.drawPopPanel.css']},
    "control/layerswitch":{deps:['css!../../themes/css/control.layerswitch.css']},
    "control/paging":{deps:['css!../../themes/css/control.paging.css']},
    "control/measure":{deps:['css!../../themes/css/control.measure.css']},
    // "control/fullscreen":{deps:['css!../../themes/css/control.fullscreen.css']},

    "plugins/mcscroll":{ deps:['jquery', 'css!../../plugins/jquery.customscrollbar/jquery.mCustomScrollbar.css'] },
    "plugins/contextmenu":{deps:["jquery","plugins/uiposition","css!../../plugins/jquery.contextmenu/jquery.contextMenu.css"]},    
    "plugins/my97":{deps:[],exports:'WdatePicker'},
    "plugins/jqueryi18n":{deps:['jquery']},
    "plugins/ztree":{ deps:['jquery', 'css!../../plugins/zTree/ztree.css'] },
    // "plugins/ajaxpoll":{deps:['jquery']},

    "func/tshf":{deps:['css!../../themes/css/func.tshf.css']},
    "func/hjcx":{deps:['css!../../themes/css/func.hjcx.css']},
    "func/oceanWeather":{deps:['css!../../themes/css/func.oceanWeather.css']},
    // "func/abnormalAlarm":{deps:['css!../../themes/css/func.abnormalAlarm.css']},
    // "func/productSub":{deps:['css!../../themes/css/func.productSub.css']},
    // "func/monitorStatisc":{deps:['css!../../themes/css/func.monitorStatisc.css']},

    "func/filterDisplay":{deps:['css!../../themes/css/func.filterDisplay.css']},
    // "func/userLogin":{deps:['css!../../themes/css/func.userLogin.css']},
    "func/changepsw":{deps:['css!../../themes/css/func.changepsw.css']},
    "func/realTarget":{deps:['css!../../themes/css/func.realTarget.css']},
    "func/portInfo":{deps:['css!../../themes/css/func.portInfo.css']},
    "func/keysearch":{deps:['css!../../themes/css/func.keysearch.css']},
    "func/heatmap":{deps:['css!../../themes/css/func.heatmap.css']},
    "func/areaflow":{deps:['css!../../themes/css/func.areaflow.css']},
    "func/portquery":{deps:['css!../../themes/css/func.portquery.css']},
    "func/cdgl":{deps:['css!../../themes/css/func.cdgl.css']},
    "func/jrtx":{deps:['css!../../themes/css/func.jrtx.css']},
    "func/weather":{deps:['css!../../themes/css/func.weather.css']}
};


require.config({   
    urlArgs:'v0.3', //版本号，加入版本号后可以在更新版本时实时更新
    paths: Default_Paths,
    shim: Default_Shims
});

//********************************模块配置-end****************************************//


//*****************************加载后执行-start***********************************//
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
//*****************************加载后执行-end***********************************//