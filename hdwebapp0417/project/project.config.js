/**
*项目配置
*@module config
*@class Project_ParamConfig
*@static
*/
var DefaultIP = '10.5.0.138';//默认ip   部署服务器地址 http://123.57.242.185:8081
var DefaultPORT = '8080';//默认端口号

//项目配置
var Project_ParamConfig = {

    /**
    *系统标题
    *@property title
    *@type {String}
    */
    title: '和德宇航数据服务系统',

    //默认服务端地址
    ServiceUrl:'http://'+DefaultIP+':'+DefaultPORT+'/hdsample/',

    //电子海图地址
    ChartLayerUrl:'http://enc-cmap.myships.com/ChartMap/',

    
    //系统当前使用的语言种类 值为zh或en
    lang:window.localStorage.getItem("language") || 'zh',
     
    /**
    *地图设置
    *@property baseLayer
    *@type {Object}
    */
    MapOptions: {

        center: [24, 106], //地图中心点 [纬度，经度]
    
        minZoom: 2, //最小缩放级别

        maxZoom: 14, //最大缩放级别

        zoom: 4, //初始化缩放级别

        offset:{ //海图到google地图的偏移值
            offsetLng:0,
            offsetLat: 0.1978457170017336
        }
    },

    /**
    *底图切换服务设置
    *@property changeLayers
    *@type {Object}
    */
    changeLayers: [
        {
            id: 'baseLayer-ocean', //图层的唯一id值
            name: '海图',
            name_en:'chart',
            layer:null,//图层对象
            active:true//是否显示
        }, 
        {
            id:'baseLayer-googleRoadMap',
            name:'地图',
            name_en:'map',
            layer:null,
            active:false
        },
        {
            id: 'baseLayer-gooleSatellite',
            name: '卫星图',
            name_en:'satellite',
            layer:null,
            active:false
        }
    ],    

    //图层选择
    layerSelect:[
        {key:'1',value:'绿点图',value_en:'scatterplot'},
        {key:'2',value:'栅格图',value_en:'raster'}
    ],

    //语言种类
    languages:[
      {key:'zh',value:'汉语',value_en:'汉语'},
      {key:'en',value:'English',value_en:'English'}
      
    ],
    
    //用户管理配置
    userConfig:{
        loginUrl:'http://'+DefaultIP+':'+DefaultPORT+'/userinfo/login.do',
        enrollUrl:'http://'+DefaultIP+':'+DefaultPORT+'/userinfo/register.do',
        forgetpswUrl:'http://'+DefaultIP+':'+DefaultPORT+'/userinfo/backPassWord.do',
        modifypswUrl:'http://'+DefaultIP+':'+DefaultPORT+'/userinfo/updatepw.do'

    },

    //图层配置文件
    LayersConfig:{ 
        
        //覆盖密度
        OverlayDensity:[
           {time:'2015',url:'http://10.5.0.189:6080/arcgis/rest/services/densitymap/vesselAIS201500/MapServer'}
           // {time:'2017年2月',url:''},
           // {time:'2017年3月',url:''}
        ],
        //船舶密度
        ShipDensity:[
              {time:'2015',url:'http://10.5.0.189:6080/arcgis/rest/services/densitymap/vesselcrosstime201500/MapServer'}
           // {time:'2017年2月',url:''},
           // {time:'2017年3月',url:''}
        ],
        //交通密度图
        TrafficDensity:[
           {time:'2015',url:'http://10.5.0.189:6080/arcgis/rest/services/densitymap/vesseldensitymap201500/MapServer'}
           // {time:'2017年2月',url:''},
           // {time:'2017年3月',url:''}
        ]

    },

    //searchConfig
    SearchConfig:{
        //搜索过滤条件
        searchOptions:[
            {key:1,value:'船舶',value_en:'Vessel'},
            {key:2,value:'港口',value_en:'Port'}
        ],
        shipSearchUrl:"http://"+DefaultIP+":"+DefaultPORT+"/hdsample/realtime/targetlocation.do",
        portSearchUrl:"http://"+DefaultIP+":"+DefaultPORT+"/hdsample/portinfo/portsSearch.do",
        locatUrl:"http://"+DefaultIP+":"+DefaultPORT+"/rest/realtime/shipinfo.do"
    },

    //态势回放配置文件
    tshfConfig:{
        playbackList:[],
        limit:5000,//条数限制
        timerange:3,//时间范围，3天
        areaUrl:'http://'+ DefaultIP +':'+ DefaultPORT +'/hdsample/track/hisAreaPlayBack.do',//指定区域
        moreshipUrl:'http://'+ DefaultIP +':'+ DefaultPORT +'/hdsample/track/moreship.do',//指定目标
        oneshipUrl:'http://'+ DefaultIP +':'+ DefaultPORT +'/hdsample/track/oneship.do',//单船态势回放
        getShipByMMSIUrl:"http://"+DefaultIP+":"+DefaultPORT+"/hdsample/searchShipByMsi.do"//根据批号获取船舶
    },    
    
    //航迹查询配置
    hjcxConfig:{
        hjcxList:[],
        timerange:3,//时间范围，3天
        hjcxMoreUrl:'http://'+ DefaultIP +':'+ DefaultPORT +'/hdsample/track/moreship.do',
        hjcxOneUrl:'http://'+ DefaultIP +':'+ DefaultPORT +'/hdsample/track/oneship.do',
        getShipByMMSIUrl:"http://"+DefaultIP+":"+DefaultPORT+"/hdsample/searchShipByMsi.do"//根据批号获取船舶
    },

    //船队管理配置
    cdglConfig:{
        getTreeUrl:"http://"+DefaultIP+":"+DefaultPORT+"/hdsample/baochuan/getShipFleetTree.do",
        saveShipFleetUrl:"http://"+DefaultIP+":"+DefaultPORT+"/hdsample/baochuan/saveShipFleet.do",
        delShipFleetUrl:"http://"+DefaultIP+":"+DefaultPORT+"/hdsample/baochuan/delShipFleet.do",
        delShipUrl:"http://"+DefaultIP+":"+DefaultPORT+"/hdsample/baochuan/delShip.do",
        saveShipUrl:"http://"+DefaultIP+":"+DefaultPORT+"/hdsample/baochuan/saveShip.do",
        getEventListUrl:"http://"+DefaultIP+":"+DefaultPORT+"/hdsample/baochuan/getEventList.do",
        getWeatherInfoUrl:"http://"+DefaultIP+":"+DefaultPORT+"/hdsample/baochuan/getWeatherInfo.do",
        getShipFleetUrl:"http://"+DefaultIP+":"+DefaultPORT+"/hdsample/baochuan/getShipFleet.do",
        saveShipForAddUrl:"http://"+DefaultIP+":"+DefaultPORT+"/hdsample/baochuan/saveShipForAdd.do"
    },

    //实时目标显示配置
    RealTargetConfig:{
        showLevel:10, //实时目标显示的最小级别【8级或8级以上为合理区间】
        bufferRatio:0.125,//缓冲区【每个方向增加的倍速，为0表示不增加，为1表示增加到原来的（8[8个方向]+1[原来的一个]）倍】
        limit:1000,//限制一次获取的目标条数（也同时作为上显的最大目标数）【经测试，为了性能和用户体验，1000个比较合理】
        timeout:6*60,//消批时间分钟【待确认】
        updatetime:15,//规定多长时间(单位：秒)更新一下数据
        isZoomEndRequest:true,//是否在缩放到显示级别时才进行请求
        shipDistLayerUrl:'http://'+ DefaultIP +':'+ DefaultPORT +'/Chart/',//绿点图地址
        shipRealUrl:'http://'+ DefaultIP +':'+ DefaultPORT +'/hdsample/realtime/areaships.do',//实时目标rest地址
        rasterUrl:'http://'+ DefaultIP +':'+ DefaultPORT +'/hdsample/realtime/gridCountX1.do',//栅格图地址
        shipInfoUrl:'http://'+ DefaultIP +':'+ DefaultPORT +'/hdsample/realtime/shipinfo.do',//船舶详细信息
        isIncdUrl:'http://'+ DefaultIP +':'+ DefaultPORT +'/hdsample/ShipFleetOnByMMSI.do'
    },

    //过滤显示配置
    FilterDisplayConfig:{    
        //"1":"货船","2":"搜救船","3":"油轮","4":"拖轮","5":"渔船","6":"拖船","7":"客船","8":"军事船""100":"其他"
        shipTypeList:["1","3","6","5","7","4","100"], //st
        //"1":中国","2":"英国","3":"法国","4":"美国",“5”：俄罗斯，"100":"其他"
        shipFlagList:["1","2","3","4","5","100"],
        //"0":机动船在航,"1":锚泊,"2"：船舶失控,"3"：船舶操作受限,"4":吃水受限,"5":系泊,"6":搁浅,"7":捕捞作业,"8":风帆动力
        shipStateList:["0","1","2","3","4","5","6","7","8"], //status  航行状态
        //"1":星基AIS数据，“2”:岸基AIS数据
        shipSourceList:["1","2"] //infosrc 信息来源
    },

    //港口信息配置
    PortConfig:{
        showLevel:10, //港口图层显示的最小级别
        listUrl:'http://'+ DefaultIP +':'+ DefaultPORT +'/hdsample/portinfo/portsSearchByLoLa.do',//港口信息列表查询
        infoUrl:'http://'+ DefaultIP +':'+ DefaultPORT +'/hdsample/portinfo/portinformation.do',//港口信息查询
        portStaticUrl:'http://'+ DefaultIP +':'+ DefaultPORT +'/hdsample/portHistoryInformationStatistics.do',//进离港统计
        odAnlysisUrl:'http://'+ DefaultIP +':'+ DefaultPORT +'/hdsample/GetPortByTimes.do'
    },
    
    //统计分析
    StasticConfig:{
        timerange:3,//时间范围，3天
        areaflowUrl:'http://'+ DefaultIP +':'+ DefaultPORT +'/hdsample/track/distract.do' //区域流量分析
    }

};