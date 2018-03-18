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
		   	  // this._submenu = new L.ICT.Layout.SubMenu(this.getSubMenuHTML());
		   	  // this.menu.submenu.add(this.menuid,this.getSubMenuHTML());              		   	  
		   },

		   start:function(){
              // this._submenu.show();
              if(!this.menu.submenu.has(this.menuid)){
                this.menu.submenu.add(this.menuid,this.getSubMenuHTML());
              }
              this.menu.submenu.show(this.menuid);
              this._initSubMenuEvts();
		   },

		   stop:function(){
              // this._submenu.hide();
              this.menu.submenu.destory(this.menuid);
		   },

		   getSubMenuHTML:function(){
		   	  var html = [];
		   	  html.push('<ul class="submenu_oceanWeather">');
		   	  html.push('<li class="menu_item qxxx"><img src="themes/images/model/frame/menu-weather.png">&nbsp<label>气象信息</label></li>');
		   	  html.push('<li class="menu_item hyxx"><img src="themes/images/model/frame/menu-ocean.png">&nbsp<label>海洋信息</label></li>');
		   	  html.push('</ul>');
		   	  return html.join("");
		   },

		   _initSubMenuEvts:function(){
		   	   var self = this;
               var menuContainer = this.menu.getContainer();
               menuContainer.find(".submenu_oceanWeather .menu_item").on("click",function(event){
                  event.stopPropagation();
                  var $this = $(this);
                  $this.addClass('active').siblings().removeClass('active');
               });
		   }

		})
	});

});

