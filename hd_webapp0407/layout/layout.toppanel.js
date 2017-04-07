/*
* 顶部菜单模块
*/
define("layout/toppanel",[
    "leaflet",
    "layout/base",
    "core/namespace",
    "func/userLogin",
    "func/keysearch",
    "func/languages",
    "func/jrtx"

],function(L){

    /*
     *顶部导航栏类
     */
    L.ICT.Layout.TopPanel = L.ICT.Layout.extend({

        /**
         *html模版
         *@property tempHtml
         *@type {String}
         *@private
         */
        tempHtml: '<nav  class="navbar navbar-default" role="navigation">'
        + '<div class="container-fluid navbar-container">'
        + '<div class="navbar-header">'    //navbar-header
        + '<img class="navbar-header-title" src="themes/images/frame/title_logo.png" alt=""/>'
        + '<label class="toppanel_left_title" style="font-size:18px;"></label>'
        + '</div>'
        + '<div class="collapse navbar-collapse">'
        + '<form class="navbar-form navbar-left" role="search" onsubmit="return false;">'  //navbar-left search
        + '<div class="form-group">'
        + '<input type="text" class="form-control input-md toppanel_keysearch_remind" id="search_key" autocomplete="off"/>'
        + '<img src="themes/images/frame/title_search_btn.png" class="searchHander toppanel_keysearch_title">'
        + '<select class="searchType"></select>'
        + '</div>'
        + '</form>'
        + '<ul class="nav navbar-nav navbar-right">' // navbar-right other
        + '<li class="eventRemind"><label class="toppanel_right_eventRemind"></label></li>'        
        + '<li class="layerSelect"><label class="toppanel_right_layerSelect"></label>:&nbsp;&nbsp;<select class="layerSelectctr"></select></li>'
        + '<li class="languageSet"><label class="toppanel_right_langSetting"></label>:&nbsp;&nbsp;<select class="languageSetting"></select></li>'
        + '<li class="topmenubtn userlogin login_btn"><img src="themes/images/frame/title_exit.png">&nbsp;&nbsp;<label class="toppanel_right_login"></label></li>'
        + '<li class="topmenubtn userlogin enroll_btn"><img src="themes/images/frame/enroll.png">&nbsp;&nbsp;<a class="toppanel_right_enroll" href="userpages/enroll.html" target="_self"></a></li>'
        + '<li class="dropdown topmenubtn userlogin_after" style="display:none;">'
        + '  <a href="#" class="dropdown-toggle" data-toggle="dropdown" style="display:inline;">'
        + '    <img src="themes/images/frame/title_exit.png">&nbsp;&nbsp;'
        + '    <label class="userName_txt"></label>'
        + '  </a>'
        + '  <ul class="dropdown-menu" role="menu">'
        + '    <li class="userlogin_after_exitlogin"><a class="toppanel_right_signout" href="#"></a></li>'
        + '    <li class="userlogin_after_changepsw"><a class="toppanel_right_changepsw" href="#"></a></li>'
        + '  </ul>'
        + '</li>'        
        + '</ul>'
        + '</div>'
        + '</div>'
        + '</nav>',

        _fullscreen:false,

        initialize:function(){
            L.ICT.Layout.prototype.initialize.call(this);
            this.id = "topPanel";
            this._container = $("#toppanel");
            this._container.html(this.tempHtml);
            this._initUi();
            this._bindEvts();
        },

        _initUi:function(){
            //搜索条件
            var searchOptions = [];
            for(var i=0,len=Project_ParamConfig.SearchConfig.searchOptions.length;i<len;i++){
                var option = Project_ParamConfig.SearchConfig.searchOptions[i];
                if(Project_ParamConfig.lang === 'zh'){
                   searchOptions.push('<option value="'+option.key+'">'+ option.value +'</option>');
                }else {
                   searchOptions.push('<option value="'+option.key+'">'+ option.value_en +'</option>');
                }
                
            }
            searchOptions = searchOptions.join("");
            this._container.find(".searchType").html(searchOptions);

            //图层选择
            var layerOptions = [];
            for(var i=0,len=Project_ParamConfig.layerSelect.length;i<len;i++){
                var option = Project_ParamConfig.layerSelect[i];
                if(Project_ParamConfig.lang === 'zh'){
                    layerOptions.push('<option value="'+option.key+'">'+ option.value +'</option>');
                } else {
                    layerOptions.push('<option value="'+option.key+'">'+ option.value_en +'</option>');
                }
            }
            layerOptions = layerOptions.join("");
            this._container.find(".layerSelectctr").html(layerOptions);

            //语言种类
            // L.ICT.Func["Languages"].run();
            // var languages = [];
            // for( i=0,len=Project_ParamConfig.languages.length;i<len;i++){
            //     var lan = Project_ParamConfig.languages[i];
            //     languages.push('<option value="'+lan+'">'+lan+'</option>');
            // }
            // languages = languages.join("");
            // this._container.find(".languageSetting").html(languages);
        },

        _bindEvts:function(){

            var _this = this;

            //用户搜索
            _this._container.find(".navbar-left .searchHander").on("click",function(e){
                _this.search(e);
            });

            $("#search_key").on("keydown",function(e){
                var e = e || window.event;
                L.DomEvent.stopPropagation(e);
                // L.DomEvent.preventDefault(e);
                if (e.keyCode === 13) {
                    _this.search(e);
                }
            });
            
            //用户登录
            _this._container.find(".login_btn").on("click",function(e){
                L.ICT.Func["UserLogin"].run();
            });
            
            //今日事件提醒
            _this._container.find(".eventRemind").on("click",function(e){
                L.ICT.Func["jrtx"].run();
            });
            
            //搜索框文字
            _this._container.find(".searchType").on("change",function(e){
                var type = $(this).val();
                if(type === '1'){
                    _this._container.find(".toppanel_keysearch_remind").attr("placeholder",$.i18n.prop('func_keysearch_ship_plh'));  
                }else {
                    _this._container.find(".toppanel_keysearch_remind").attr("placeholder",$.i18n.prop('func_keysearch_port_plh'));  
                }
            });

            //栅格图、绿点图切换
            _this._container.find(".layerSelectctr").on("change",function(e){
                var type = $(this).val();
                L.ict.app.ictmap.realtarget.changeShipDistLayer(type);
            });

        },

        search:function(o){
            var param = {};
            param.searchText = this._container.find("#search_key").val().trim();
            param.searchType = this._container.find(".navbar-left .searchType").val();
            //调用search接口
            var instance =  L.ICT.Func["KeySearch"].getInstance();
            instance.start(param);            

        },

        show:function(){
            this.setVisible(true);

        },

        hide:function(){
            this.setVisible(false);

        }
    });

});


