/**
 *项目配置
 *@module config
 *@class Project_ParamConfig
 *@static
 */

//开发测试
var DefaultIP = 'localhost';//默认ip

var DefaultPORT = '8080';//默认端口号

//服务器部署
// var DefaultIP = '122.5.51.230'; //默认ip

// var DefaultPORT = '10002'; //默认端口号

var Project_ParamConfig = {

    /**
     *系统标题
     *@property title
     *@type {String}
     */
    title: '信工所项目正样',

    //默认服务端地址
    ServiceUrl: 'http://' + DefaultIP + ':' + DefaultPORT + '/rest/',

    //模式 融合模式为0，原始模式为1
    CurrentMode: 1,

    /**
     *底图设置
     *@property baseLayer
     *@type {Object}
     */
    baseLayer: {

        id: 'baseLayer',

        center: [24, 106],

        minZoom: 1,

        maxZoom: 18,

        zoom: 4
    },

    //电子海图地址
    ChartLayerUrl: 'http://enc-cmap.myships.com/ChartMap/',

    //searchConfig
    SearchConfig: {
        //搜索过滤条件
        searchOptions: [
            "MMSI",
            "IMO",
            "呼号",
            "船名",
            "批号"
        ],
        url: "http://" + DefaultIP + ":" + DefaultPORT + "/rest/realtime/targetlocation.do"
    },

    //态势回放配置文件
    tshfConfig: {
        playbackList: [],
        areaUrl: 'http://' + DefaultIP + ':' + DefaultPORT + '/rest/AreaTrackFuse.do', //指定区域
        moreshipUrl: 'http://' + DefaultIP + ':' + DefaultPORT + '/rest/track/moreship.do', //指定目标
        oneshipUrl: 'http://' + DefaultIP + ':' + DefaultPORT + '/rest/track/oneship.do', //单船态势回放
        getShipByMMSIUrl: "http://" + DefaultIP + ":" + DefaultPORT + "/rest/realtime/targetlocation.do" //根据批号获取船舶 

    },

    //实时目标显示配置
    RealTargetConfig: {
        showLevel: 10, //实时目标显示的最小级别【8级或8级以上为合理区间】 {船讯网上显级别：10}
        bufferRatio: 0, //缓冲区【每个方向增加的倍速，为0表示不增加，为1表示增加到原来的（8[8个方向]+1[原来的一个]）倍】
        limit: 5000, //限制一次获取的目标条数（也同时作为上显的最大目标数）【经测试，为了性能和用户体验，1000个比较合理】
        timeout: 1000000, //消批时间(分钟)【待确认】
        updatetime: 5, //ajax轮询时间间隔（秒）{船讯网刷新频率：30秒}
        isZoomEndRequest: true, //是否在缩放到特定级别时才进行请求
        shipDistLayerUrl: 'http://' + DefaultIP + ':' + DefaultPORT + '/Chart/', //绿点图地址
        shipRealUrl: "http://" + DefaultIP + ":" + DefaultPORT + "/rest/realtime/areaships.do", //实时目标rest地址
        shipRealSocketUrl: "ws://" + DefaultIP + ":" + DefaultPORT + "/websocket/realtimelimit",
        // locateUrl:"http://"+DefaultIP+":"+DefaultPORT+"/rest/realtime/shipinfo.do",//搜索定位地址
        shipInfoUrl: 'http://' + DefaultIP + ':' + DefaultPORT + '/rest/realtime/shipinfo.do' //船舶信息获取地址

    },

    //过滤显示配置
    FilterDisplayConfig: {
        shipSourceList: ["1", "2", "3", "4", "5"], //信息源
        shipTypeList: ["货船", "搜救船", "油轮", "拖船", "渔船", "客船", "军事船", "其他"], //目标类型
        shipFlagList: ["中国", "美国", "英国", "法国", "俄罗斯", "其他"] //国家
    },

    //港口信息配置
    PortConfig: {
        showLevel: 6, //港口图层显示的最小级别
        listUrl: 'http://' + DefaultIP + ':' + DefaultPORT + '/rest/port/getlist.do', //港口信息列表查询
        infoUrl: 'http://' + DefaultIP + ':' + DefaultPORT + '/rest/port/getinfo.do' //港口信息查询

    },

    //航迹查询配置
    hjcxConfig: {
        hjkzUrl: 'http://' + DefaultIP + ':' + DefaultPORT + '/rest/track/limitpoint.do'
    },

    //监控统计
    monitorStatiscConfig: {
        isClose: true, //监控统计结果页面是否关闭，用于判断是否停止ajax轮询
        updateTime: 1000, //结果刷新的时间间隔(毫秒)
        realtimeCountUrl: 'http://' + DefaultIP + ':' + DefaultPORT + '/rest/realtime/areacount.do',
        realtimeAreaUrl: "http://" + DefaultIP + ":" + DefaultPORT + "/rest/realtime/areaships.do"
    },

    //挖掘分析配置
    wjAnalysisConfig: {
        densityArr: [
            { time: '2016-1', url: 'http://10.5.0.189:6080/arcgis/rest/services/densitymap/vesselcrosstime201500/MapServer' },
            { time: '2016-2', url: '' }
        ],
        flowArr: [
            { time: '2016-1', url: 'http://10.5.0.189:6080/arcgis/rest/services/densitymap/vesseldensitymap201500/MapServer' },
            { time: '2016-2', url: '' }
        ],
        accidentUrl: 'http://' + DefaultIP + ':' + DefaultPORT + '/rest/behavior/incidents.do',
        activeForecastUrl: '',
        fxpgUrl: 'http://' + DefaultIP + ':' + DefaultPORT + '/rest/behavior/safetyindex.do'

    },

    //异常告警配置
    abnormalAlarmConfig: {
        isClose: true, //异常告警页面是否关闭，用于判断是否停止ajax轮询
        url_area: 'http://' + DefaultIP + ':' + DefaultPORT + '/rest/abnormal/getzoneentry.do',
        url_behavior: 'http://' + DefaultIP + ':' + DefaultPORT + '/rest/abnormal/getanomalyships.do',
        url_gather: 'http://' + DefaultIP + ':' + DefaultPORT + '/rest/abnormal/getanomalygrids.do',
        url_ais: 'http://' + DefaultIP + ':' + DefaultPORT + '/rest/abnormal/getaisoffline.do'
    }

};
