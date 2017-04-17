/*项目构建文件
*使用方法
1、进入跟目录
2、执行命令行 node r.js -o build.js
*/
({ 
    appDir: './',   //项目根目录
    dir: '../release',  //输出目录，全部文件打包后要放入的文件夹（如果没有会自动新建的）
    baseUrl: '.',   //相对于appDir，代表要查找js文件的起始文件夹，下文所有文件路径的定义都是基于这个baseUrl的  
    map:{'*':{'css':'../hdwebapp0417/library/requirejs/css'}},
    modules: [                      //要优化的模块
        {name:'project/main'}  //说白了就是各页面的入口文件，相对baseUrl的路径，也是省略后缀“.js”
        // {name:'userpages/login.main'},
        // {name:'userpages/enroll.main'},
        // {name:'userpages/forgetpsw.main'},
        // {name:'userpages/enrollsuccess.main'},
        // {name:'userpages/activesuccess.main'}
    ], 
    fileExclusionRegExp: /^(r|build|fis-conf)\.js|.*\.scss|(documents)$/,    //过滤，匹配到的文件将不会被输出到输出目录去
    // JS 文件优化方式，目前支持以下几种：
    //   uglify: （默认） 使用 UglifyJS 来压缩代码
    //   closure: 使用 Google's Closure Compiler 的简单优化模式
    //   closure.keepLines: 使用 closure，但保持换行
    //   none: 不压缩代码
    optimize: "uglify",
    // CSS 优化方式，目前支持以下几种：
    // none: 不压缩，仅合并
    // standard: 标准压缩，移除注释、换行，以及可能导致 IE 解析出错的代码
    // standard.keepLines: 除标准压缩外，保留换行
    // standard.keepComments: 除标准压缩外，保留注释 (r.js 1.0.8+)
    // standard.keepComments.keepLines: 除标准压缩外，保留注释和换行 (r.js 1.0.8+)
    optimizeCss: 'standard',
    removeCombined:false,   //如果为true，将从输出目录中删除已合并的文件
    paths:{
        // 核心lib
        "jquery": 'library/jquery/jquery.min',
        "bootstrap": "library/bootstrap/js/bootstrap.min",

        "leaflet": 'library/leaflet/leafletCore/leaflet',
        "leaflet/draw":'library/leaflet/leafletDraw/leaflet.draw',
        "leaflet/fix": 'library/leaflet/leaflet.fix',
        "leaflet/playback":'library/leaflet/leafletPlayback/LeafletPlayback',  
        "leaflet/rotateMarker":'library/leaflet/leaflet.rotateMarker',
        "leaflet/chartLayer":'library/leaflet/chartLayer',
        "leaflet/googleLayer":'library/leaflet/googleLayer',
        "leaflet/shipDistLayer":'library/leaflet/shipDistLayer',
        "leaflet/weatherLayer":'library/leaflet/weatherLayer',
        "leaflet/rasterLayer":'library/leaflet/rasterLayer',
        "esri/leaflet":'library/esrileaflet/esri-leaflet-src',

        "echarts": 'library/echarts/echarts.min',

        //core 
        "core/application":'core/core.application',
        "core/baseobject":'core/core.baseobject',
        "core/map":'core/core.map',
        "core/namespace":'core/core.namespace',
        "core/pool":'core/core.pool',

        //layout
        "layout/base":'layout/layout.base',
        "layout/menu":'layout/layout.menu',
        "layout/toppanel":'layout/layout.toppanel',

        //control
        "control/draw":'control/control.draw',
        "control/panel":'control/control.panel',
        "control/playback":'control/control.playback',
        "control/layerswitch":'control/control.layerswitch',
        "control/paging":'control/control.paging',
        "control/measure":'control/control.measure',
        "control/loading":'control/control.loading',
        // "control/fullscreen":'control/control.fullscreen',

        //data
        "data/ajax":'data/data.ajax',
        "data/localStorage":'data/data.localStorage',
        "data/sessionStorage":'data/data.sessionStorage',

        //util
        "util/base":'util/util.base',
        "util/dialog":'util/util.dialog',
        "util/tool":'util/util.tool',
        "util/dateTime":'util/util.dateTime',

        //plugins
        "plugins/mcscroll":'plugins/jquery.customscrollbar/jquery.mCustomScrollbar.min',
        "plugins/rangeSlider":'plugins/jquery.rangeSlider',
        "plugins/jqueryi18n":'plugins/jquery.i18n.properties/jquery.i18n.properties',
        "plugins/contextmenu":'plugins/jquery.contextmenu/jquery.contextMenu',
        "plugins/uiposition":'plugins/jquery.contextmenu/jquery.ui.position',
        // "plugins/my97DatePicker":'plugins/My97DatePicker/WdatePicker',
        "plugins/ztree":'plugins/zTree/ztree',
        "plugins/proj4js":'plugins/proj4js/proj4-src',
        "plugins/wgs2mars":'plugins/wgs2mars/wgs2mars',
        "plugins/gpscorrect":'plugins/wgs2mars/gpscorrect',
        // "plugins/ajaxpoll":'plugins/jquery.ajaxpoll',

        //func
        "func/base":'func/func.base',
        "func/tshf":'func/func.tshf',
        "func/hjcx":'func/func.hjcx',
        "func/oceanWeather":'func/func.oceanWeather',
        // "func/abnormalAlarm":'func/func.abnormalAlarm',
        // "func/monitorStatisc":'func/func.monitorStatisc',
        // "func/productSub":'func/func.productSub',
        "func/filterDisplay":'func/func.filterDisplay',
        "func/userLogin":'func/func.userLogin',
        "func/changepsw":'func/func.changepsw',
        "func/realTarget":'func/func.realTarget',
        "func/portInfo":'func/func.portInfo',
        "func/keysearch":'func/func.keysearch',
        "func/languages":'func/func.languages',
        "func/heatmap":'func/func.heatmap',
        "func/areaflow":'func/func.areaflow',
        "func/portquery":'func/func.portquery',
        "func/cdgl":'func/func.cdgl',
        "func/cdgladdship":'func/func.cdgladdship',
        "func/jrtx":'func/func.jrtx',
        "func/weather":'func/func.weather'
    },
    shim: {
        "bootstrap": { deps: ['jquery','css!library/bootstrap/css/bootstrap'] },
        "leaflet": { deps: ['css!library/leaflet/leafletCore/leaflet'] },
        "leaflet/draw": { deps: ['leaflet', 'css!library/leaflet/leafletDraw/leaflet.draw'] },
        "leaflet/playback":{ deps:['leaflet'] },  

        "core/application":{deps:['css!themes/css/system.main']},

        "control/playback":{deps:['css!themes/css/control.playback']},
        "control/panel":{deps:['css!themes/css/control.drawPopPanel']},
        "control/layerswitch":{deps:['css!themes/css/control.layerswitch']},
        "control/paging":{deps:['css!themes/css/control.paging']},
        "control/measure":{deps:['css!themes/css/control.measure']},
        "control/loading":{deps:['css!themes/css/control.loading']},
        // "control/fullscreen":{deps:['css!themes/css/control.fullscreen']},

        "plugins/mcscroll":{ deps:['jquery', 'css!plugins/jquery.customscrollbar/jquery.mCustomScrollbar'] },
        "plugins/contextmenu":{deps:["jquery","plugins/uiposition","css!plugins/jquery.contextmenu/jquery.contextMenu"]},    
        // "plugins/my97DatePicker":{deps:['css!plugins/My97DatePicker/skin/WdatePicker'],exports:'WdatePicker'},
        "plugins/jqueryi18n":{deps:['jquery']},
        "plugins/ztree":{ deps:['jquery', 'css!plugins/zTree/ztree'] },
        // "plugins/ajaxpoll":{deps:['jquery']},

        "func/tshf":{deps:['css!themes/css/func.tshf']},
        "func/hjcx":{deps:['css!themes/css/func.hjcx']},
        "func/oceanWeather":{deps:['css!themes/css/func.oceanWeather']},
        // "func/abnormalAlarm":{deps:['css!themes/css/func.abnormalAlarm']},
        // "func/productSub":{deps:['css!themes/css/func.productSub']},
        // "func/monitorStatisc":{deps:['css!themes/css/func.monitorStatisc']},

        "func/filterDisplay":{deps:['css!themes/css/func.filterDisplay']},
        // "func/userLogin":{deps:['css!themes/css/func.userLogin']},
        "func/changepsw":{deps:['css!themes/css/func.changepsw']},
        "func/realTarget":{deps:['css!themes/css/func.realTarget']},
        "func/portInfo":{deps:['css!themes/css/func.portInfo']},
        "func/keysearch":{deps:['css!themes/css/func.keysearch']},
        "func/heatmap":{deps:['css!themes/css/func.heatmap']},
        "func/areaflow":{deps:['css!themes/css/func.areaflow']},
        "func/portquery":{deps:['css!themes/css/func.portquery']},
        "func/cdgl":{deps:['css!themes/css/func.cdgl']},
        "func/jrtx":{deps:['css!themes/css/func.jrtx']},
        "func/weather":{deps:['css!themes/css/func.weather']}
    }
}) 
