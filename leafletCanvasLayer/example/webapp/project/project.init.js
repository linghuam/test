//********************************模块配置-start****************************************//
/*
 *定义模块ID和模块路径
 */
var Default_Paths = {

    // 核心lib
    "jquery": 'library/jquery/jquery.min',
    "bootstrap": "library/bootstrap/js/bootstrap.min",
    "leaflet": 'library/leaflet/leafletCore/leaflet-src',
    "leaflet/fix": 'library/leaflet/leaflet.fix',
    "leaflet/draw": 'library/leaflet/leafletDraw/leaflet.draw-src',
    "leaflet/playback": 'library/leaflet/leafletPlayback/LeafletPlayback',
    "leaflet/rotateMarker": 'library/leaflet/leaflet.rotateMarker',
    "leaflet/chartLayer": 'library/leaflet/chartLayer',
    "leaflet/googleLayer": 'library/leaflet/googleLayer',
    "leaflet/shipDistLayer": 'library/leaflet/shipDistLayer',
    "leaflet/weatherLayer": 'library/leaflet/weatherLayer',
    "leaflet/rasterLayer": 'library/leaflet/rasterLayer',
    "leaflet/pip":'library/leaflet/leaflet.pip',
    "esri/leaflet": 'library/esrileaflet/esri-leaflet-src',
    "echarts": "library/echarts/echarts.min",

    //core
    "core/application": 'core/core.application',
    "core/baseobject": 'core/core.baseobject',
    "core/map": 'core/core.map',
    "core/namespace": 'core/core.namespace',
    "core/pool": 'core/core.pool',

    //layout
    "layout/base": 'layout/layout.base',
    "layout/menu": 'layout/layout.menu',
    "layout/toppanel": 'layout/layout.toppanel',

    //control
    "control/draw": 'control/control.draw',
    "control/panel": 'control/control.panel',
    "control/playback": 'control/control.playback',
    "control/measure": 'control/control.measure',
    "control/paging": 'control/control.paging',
    "control/fullscreen": 'control/control.fullscreen',

    //data
    "data/ajax": 'data/data.ajax',
    "data/localStorage": 'data/data.localStorage',
    "data/sessionStorage": 'data/data.sessionStorage',
    "data/webSocket": 'data/data.webSocket',

    //util
    "util/base": 'util/util.base',
    "util/dialog": 'util/util.dialog',
    "util/tool": 'util/util.tool',
    "util/dateTime": 'util/util.dateTime',

    //plugins
    "plugins/mcscroll": 'plugins/jquery.customscrollbar/jquery.mCustomScrollbar.min',
    "plugins/rangeSlider": 'plugins/jquery.rangeSlider',
    "plugins/contextmenu": 'plugins/jquery.contextmenu/jquery.contextMenu',
    "plugins/uiposition": 'plugins/jquery.contextmenu/jquery.ui.position',
    "plugins/ajaxpoll": 'plugins/jquery.ajaxpoll',
    "plugins/linqtojs": 'plugins/LinqToJavascript',

    //func
    "func/base": 'func/func.base',
    "func/tshf": 'func/func.tshf',
    "func/oceanWeather": 'func/func.oceanWeather',
    "func/abnormalAlarm": 'func/func.abnormalAlarm',
    "func/monitorStatisc": 'func/func.monitorStatisc',
    "func/productSub": 'func/func.productSub',
    "func/realTarget": 'func/func.realTarget',
    "func/keysearch": 'func/func.keysearch',
    "func/portInfo": 'func/func.portInfo',
    "func/filterDisplay": 'func/func.filterDisplay',
    "func/hjcx": 'func/func.hjcx',
    "func/fxpg": 'func/func.fxpg',
    "func/wjAnalysis": 'func/func.wjAnalysis',
    "func/fullscreen": 'func/func.fullscreen'
};

/*
 *对于非AMD规范的外部文件引入(依赖模块和依赖外部文件)
 */
var Default_Shims = {
    "bootstrap": { deps: ['jquery'] },
    "leaflet": { deps: ['css!library/leaflet/leafletCore/leaflet.css'] },
    "leaflet/draw": { deps: ['leaflet', 'css!library/leaflet/leafletDraw/leaflet.draw.css'] },
    "leaflet/playback": { deps: ['leaflet'] },
    "leaflet/rotateMarker": { deps: ['leaflet'] },

    "control/playback": { deps: ['css!themes/css/control.playback.css'] },
    "control/panel": { deps: ['css!themes/css/control.drawPopPanel.css'] },
    "control/measure": { deps: ['css!themes/css/control.measure.css'] },
    "control/paging": { deps: ['css!themes/css/control.paging.css'] },
    "control/fullscreen": { deps: ['css!themes/css/control.fullscreen.css'] },

    "plugins/mcscroll": { deps: ['jquery', 'css!plugins/jquery.customscrollbar/jquery.mCustomScrollbar.css'] },
    "plugins/contextmenu": { deps: ["jquery", "plugins/uiposition", "css!plugins/jquery.contextmenu/jquery.contextMenu.css"] },
    "plugins/ajaxpoll": { deps: ['jquery'] },

    "func/tshf": { deps: ['css!themes/css/func.tshf.css'] },
    "func/oceanWeather": { deps: ['css!themes/css/func.oceanWeather.css'] },
    "func/abnormalAlarm": { deps: ['css!themes/css/func.abnormalAlarm.css'] },
    "func/productSub": { deps: ['css!themes/css/func.productSub.css'] },
    "func/realTarget": { deps: ['css!themes/css/func.realTarget.css'] },
    "func/portInfo": { deps: ['css!themes/css/func.portInfo.css'] },
    "func/keysearch": { deps: ['css!themes/css/func.keysearch.css'] },
    "func/filterDisplay": { deps: ['css!themes/css/func.filterDisplay.css'] },
    "func/monitorStatisc": { deps: ['css!themes/css/func.monitorStatisc.css'] },
    "func/hjcx": { deps: ['css!themes/css/func.hjcx.css'] },
    "func/wjAnalysis": { deps: ['css!themes/css/func.wjAnalysis.css'] },
    "func/fxpg": { deps: ['css!themes/css/func.fxpg.css'] }
};


require.config({
    urlArgs: 'V1.0', //"bust=" +  (new Date()).getTime(), //版本号，加入版本号后可以在更新版本时实时更新
    baseUrl: './', //相对于引入该文件的页面路径
    map: { '*': { 'css': 'library/requirejs/css.min' } }, //require-css插件引入
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
], function() {
    $(document).ready(function() {
        document.title = Project_ParamConfig.title;
        L.ICT.App = new L.ICT.Application(Project_ParamConfig);
        L.ict.app = L.ICT.App;
        L.ict.app.init();
    });

});
//*****************************加载后执行-end***********************************//
