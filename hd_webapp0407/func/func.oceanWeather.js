/*
*海洋气象功能模块
*/
define("func/oceanWeather",[
	"leaflet",
    "func/base"
],function(L){

	L.ICT.Func.add("OceanWeather",{

		Class:L.Class.extend({

		   initialize:function(){
		   	  this.menu = L.ict.app.menu;
		   	  this.menuid = 'ict_menu_main_hyqx';             		   	  
		   },

		   start:function(){
              if(!this.menu.submenu.has(this.menuid)){
                this.menu.submenu.add(this.menuid,this.getSubMenuHTML());
              }
              this.menu.submenu.show(this.menuid);
              this._initSubMenuEvts();
		   },

		   stop:function(){
                // this.menu.submenu.hide();
              this.menu.submenu.destory(this.menuid);
              this.removeSWLayer();
              this.removeWeatherLayer();
		   },

		   getSubMenuHTML:function(){
		   	  var html = [];
		   	  html.push('<ul class="submenu_oceanWeather">');
		   	  html.push('<li class="menu_item swxx" data-key="1"><img src="themes/images/frame/menu-hrdrology.png">&nbsp<label>水文信息</label></li>');
		   	  html.push('<li class="menu_item qxxx" data-key="2"><img src="themes/images/frame/menu-weather.png">&nbsp<label>气象信息</label></li>');
		   	  html.push('</ul>');
		   	  return html.join("");
		   },

		   _initSubMenuEvts:function(){
		   	   var self = this;
               var $menuContainer = this.menu.getContainer();
               $menuContainer.find(".submenu_oceanWeather .menu_item").on("click",function(event){
                  event.stopPropagation();
                  var $this = $(this);
                  if($this.data("key") == "1"){
                  	 if($this.hasClass("active")){
                        self.removeSWLayer();
                  	 }else{
                        self.addSWLayer();
                  	 }

                  }else if($this.data("key") == "2"){
                     if($this.hasClass("active")){
                        self.removeWeatherLayer();
                     }else{
                        self.addWeatherLayer();
                     } 
                  }
                  $this.toggleClass('active');
               });
		   },

		   addSWLayer:function(){},

		   removeSWLayer:function(){},

		   addWeatherLayer:function(){},

		   removeWeatherLayer:function(){}


		})
	});

});

