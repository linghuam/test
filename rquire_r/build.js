//node r.js -o build.js
({ 
appDir: './',   //项目根目录
dir: './dist',  //输出目录，全部文件打包后要放入的文件夹（如果没有会自动新建的）

 baseUrl: './project',   //相对于appDir，代表要查找js文件的起始文件夹，下文所有文件路径的定义都是基于这个baseUrl的
 optimizeCss: "none",
  map: {
    '*': {
      css: '../../library/requirejs/css.min'
    }
  },
  
modules: [                      //要优化的模块
    { name:'project.init'}  //说白了就是各页面的入口文件，相对baseUrl的路径，也是省略后缀“.js”
], 

fileExclusionRegExp: /^(r|build)\.js|.*\.scss$/,    //过滤，匹配到的文件将不会被输出到输出目录去

optimizeCss: 'standard', 

removeCombined: true,   //如果为true，将从输出目录中删除已合并的文件

paths: {
    // 核心lib
    "jquery": '../library/jquery/jquery',
    "bootstrap": "../library/bootstrap/js/bootstrap",
    "css":"../library/requirejs/css.min",

    "leaflet": '../library/leaflet/leafletCore/leaflet-src',
    "leaflet/draw":'../library/leaflet/leafletDraw/leaflet.draw-src',
    "leaflet/label":'../library/leaflet/leafletLabel/leaflet.label',
    "leaflet/fix": '../library/leaflet/leaflet.fix',
    "leaflet/playback":'../library/leaflet/leafletPlayback/LeafletPlayback',  
    "leaflet/contextmenu":'../library/leaflet/leafletContextMenu/leaflet.contextmenu.min',
    "leaflet/rotateMarker":'../library/leaflet/leaflet.rotateMarker',
    "leaflet/chartLayer":'../library/leaflet/chartLayer',
    "leaflet/googleLayer":'../library/leaflet/googleLayer',
    "leaflet/shipDistLayer":'../library/leaflet/shipDistLayer',
    "leaflet/weatherLayer":'../library/leaflet/weatherLayer',
    "leaflet/rasterLayer":'../library/leaflet/rasterLayer',
    "esri/leaflet":'../library/esrileaflet/esri-leaflet-src',

    // "echarts": "../library/echarts/echarts",

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
    "control/fullscreen":'../control/control.fullscreen',

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
    "plugins/proj4":'../plugins/proj4js/proj4-src',
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
},

shim: {
    "bootstrap": { deps: ['jquery'] },
    "leaflet": { deps: ['css!../library/leaflet/leafletCore/leaflet.css'] },
    // "echarts":{exports:'echarts'},
    // "leaflet/draw": { deps: ['leaflet', 'css!../../leafletDraw/leaflet.draw.css'] },
    "leaflet/label":{ deps:['leaflet','css!../library/leaflet/leafletLabel/leaflet.label.css'] },
    "leaflet/playback":{ deps:['leaflet'] },  
    "leaflet/rotateMarker":{deps:['leaflet']},
    "leaflet/contextmenu":{ deps:['leaflet', 'css!../library/leaflet/leafletContextMenu/leaflet.contextmenu.min.css'] },

    "control/playback":{deps:['css!../../themes/css/control.playback.css']},
    "control/panel":{deps:['css!../../themes/css/control.drawPopPanel.css']},
    "control/layerswitch":{deps:['css!../../themes/css/control.layerswitch.css']},
    "control/paging":{deps:['css!../../themes/css/control.paging.css']},
    "control/measure":{deps:['css!../../themes/css/control.measure.css']},
    "control/fullscreen":{deps:['css!../../themes/css/control.fullscreen.css']},

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
}
}) 