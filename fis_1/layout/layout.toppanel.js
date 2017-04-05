
define("layout/toppanel",[
  "leaflet",
  "layout/base",
  "core/namespace",
  "func/keysearch",
  "func/productSub"

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
                            + '<img class="navbar-header-title" src="themes/images/frame/title_logo.png"/>'
                          + '</div>'
                          + '<div class="collapse navbar-collapse">'
                            + '<form class="navbar-form navbar-left" role="search" onsubmit="return false;">'  //navbar-left search
                                + '<div class="form-group">'                                
                                    + '<input type="text" class="form-control input-md" id="search_key" placeholder="请输入关键字"/>'
                                    + '<img src="themes/images/frame/title_search_btn.png" class="searchHander">'
                                    + '<select class="searchType"></select>'
                                + '</div>'
                            + '</form>'
                            + '<ul class="nav navbar-nav navbar-right">' // navbar-right other
                              + '<li class="menu_item"><img src="themes/images/frame/title_cpdy.png">&nbsp&nbsp<label>产品订阅</label></li>'
                              + '<li class="split_img"><img src="themes/images/frame/title_splite.png"></li>'
                              + '<li class="menu_item_mode"><label class="active menu_item">原始模式</label><label class="menu_item">综合模式</label></li>'
                              + '<li class="split_img"><img src="themes/images/frame/title_splite.png"></li>'
                              + '<li class="menu_item"><img src="themes/images/frame/title_exit.png">&nbsp&nbsp<label>退出登录</label></li>'
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
           this._bindEvts();
       },
       
       _bindEvts:function(){

         var _this = this;

         _this._container.find(".navbar-left .searchHander").on("click",function(e){
           _this.search(e);
         });
         
         $("#search_key").on("keydown",function(e){
            var e = e || window.event;
            L.DomEvent.stopPropagation(e);
            if (e.keyCode === 13) {
                _this.search(e);
            }
         });

          _this.updateSearchSelect(); 

         _this._container.find(".menu_item").on("click",function(e){
             var type = $(this).text().trim();
             switch (type){
               case "产品订阅":
                //调用相关Func接口
                L.ICT.Func["ProductSub"].run();
                break;
               case "原始模式": 
                 if($(this).hasClass("active")){return;}               
                 $(this).addClass("active").siblings().removeClass("active");                                 
                 Project_ParamConfig.CurrentMode = 1;
                 _this.updateSearchSelect();               
                 L.ict.app.ictmap.realtarget.stopInterval();
                 L.ict.app.ictmap.realtarget.removeRealTargetLayer();                 
                 L.ict.app.ictmap.realtarget.getRealTarget();
                 // if(L.ict.app.ictmap.realtarget.isRealTargetShow()){
                 //     L.ict.app.ictmap.realtarget.removeRealTargetLayer();
                 //     L.ict.app.ictmap.realtarget.getRealTarget();
                 // }      
                 break;
               case "综合模式":
                 if($(this).hasClass("active")){return;}   
                 $(this).addClass("active").siblings().removeClass("active");
                 Project_ParamConfig.CurrentMode = 0; 
                 _this.updateSearchSelect();                              
                 L.ict.app.ictmap.realtarget.stopInterval();
                 L.ict.app.ictmap.realtarget.removeRealTargetLayer();                
                 L.ict.app.ictmap.realtarget.getRealTarget();                  
                 // if(L.ict.app.ictmap.realtarget.isRealTargetShow()){
                 //     L.ict.app.ictmap.realtarget.removeRealTargetLayer();
                 //     L.ict.app.ictmap.realtarget.getRealTarget();
                 // } 
               break;
               case "退出登录":
               //调用相关Func接口
                L.ict.app.util.dialog.confirm("提示","确认退出登录吗？",function(){
                      L.ict.app.sessionStorage.removeItem("userInfo");
                      window.location.href = "login.html";

                 });
                break;
               default:;
             }
         });
       },

       updateSearchSelect:function(){
          var $search = this._container.find(".searchType");          
          var html = [];
          html.push('<option value ="MMSI">MMSI</option>');
          html.push('<option value="IMO">IMO</option>');
          html.push('<option value="呼号">呼号</option>');
          html.push('<option value="船名">船名</option>'); 
          html.push('<option value="批号">批号</option>');
          $search.html(html.join(""));
          if(Project_ParamConfig.CurrentMode === 0){
              $search.val('批号');
          }
       },

       search:function(o){
          var param = {};
          param.searchText = this._container.find("#search_key").val().trim();
          param.searchType = this._container.find(".navbar-left .searchType").val();
          //调用search接口
          L.ICT.Func["KeySearch"].getInstance().start(param);
       },

       show:function(){
         this.setVisible(true);
       }, 

       hide:function(){
         this.setVisible(false);
       }
  });

});


