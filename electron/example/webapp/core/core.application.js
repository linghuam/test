/**
*系统全局对象类
*@module core
*@class ICT.Application
*@constructor initialize
*@extends ICT.BaseObject
*/
define("core/application", [
    "leaflet",
    "leaflet/fix",
    "core/namespace",
    "core/baseobject",
    "core/map",
    "data/ajax",
    "data/localStorage",
    "data/sessionStorage",    
    "func/base",
    "layout/base",
    "layout/menu",
    "layout/toppanel",
    "util/base"

], function (L) {
    
    L.ICT.Application = L.ICT.BaseObject.extend({

        /**
        *对象缓冲池
        *@property pool
        *@type {Object}
        */
        pool: null,


        /**
        *工具
        *@property util
        *@type {Object}
        */
        util: null,


        /**
        *菜单
        *@property menu
        *@type {Object}
        */
        menu: null,
        
        /**
        *地图类
        *@property map
        *@type {Object}
        */
        ictmap:null,

        /**
        *本地存储类localStorge
        *@property localStorge
        *@type {Object}
        */
        localStorage:null,        

        /**
        *会话存储类sessionStorage
        *@property sessionStorage
        *@type {Object}
        */
        sessionStorage:null,           

        /**
        *顶部面板类
        *@property toppanel
        *@type {Object}
        */
        toppanel:null,


        //time 记录系统启动的unix时间
        startTime:null,

        /**
        *配置
        *@property options
        *@type {Object}
        */
        options: {},


        /**
        *初始化
        *@method initialize
        */
        initialize: function (options) {  //options 为project_config对象

            try {                
                this.options = options;
                // this.pool = new L.ICT.Pool();
                this.util = new L.ICT.Util.Base();                             
                this.toppanel = new  L.ICT.Layout.TopPanel();
                this.menu = new L.ICT.Menu();  
                this.localStorage = new L.ICT.LocalStorage();
                this.sessionStorage = new L.ICT.SessionStorage(); 
                this.ictmap = new L.ICT.Map(options); 
            } catch (e) {
                console.log(e.message);
            }
        },

        /**
        *初始化界面
        *
        *@method init
        */
        init: function () {
            //判断用户是否已经登录
            if(this.sessionStorage.getItem("userInfo") == null){
                window.location.href = "login.html";
            } 
            //获取系统启动的时间
            this.startTime =  this.util.dateTime.getCurrentUnixTime();          
        }


    });

    return L.ICT.Application;
});
