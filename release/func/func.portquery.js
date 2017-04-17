/*
*港口查询模块
*/
define("func/portquery",[
	"leaflet",
	"func/base",
	"func/userLogin"

],function(L){

	L.ICT.Func.add("PortQuery",{

		Class:L.Class.extend({

			initialize:function(){
				this.menu = L.ict.app.menu;
				this.menuid = 'ict_menu_main_gkcx';

			},

			start:function(){
				this.menu.mainmenu.deactiveMenuExceptOne(this.menuid);
				if(!this.menu.submenu.has(this.menuid)){
					this.menu.submenu.add(this.menuid,this.getSubMenuHTML());
				}
				this.menu.submenu.show(this.menuid);
				this._initSubMenuEvts();
			},

			stop:function(){
 				this.menu.submenu.destory(this.menuid);
 				this.menu.mainmenu.deactiveMenu(this.menuid);
			},

	        //获取子菜单HTML
	        getSubMenuHTML:function(){
				var html = [];
				html.push('<ul class="submenu_portquery">');
				html.push('<li class="menu_item odfx"><img src="themes/images/frame/menu_tshf_zdqy.png">&nbsp<label class="port_query_odanalysis">OD分析</label></li>');
				html.push('<li class="menu_item gxys"><img src="themes/images/frame/menu_tshf_zdmb.png">&nbsp<label class="port_query_gxys">关系演示</label></li>');
				html.push('</ul>');
				return html.join("");
	        },
	       
	        //初始化子菜单点击事件
	        _initSubMenuEvts:function(){
	               var self = this;
	               var $menuContainer = this.menu.getContainer();
                   
                   //中英文
                   $menuContainer.find(".port_query_odanalysis").html($.i18n.prop("port_query_odanalysis"));
                   $menuContainer.find(".port_query_gxys").html($.i18n.prop("port_query_gxys"));

	               $menuContainer.find(".submenu_portquery .menu_item").on("click",function(event){
	                  event.stopPropagation();
	                  var $this = $(this);
	                  if($this.hasClass("odfx")){
			                if(!L.ICT.Func["UserLogin"].getInstance().isLogin()){
			                    L.ICT.Func["UserLogin"].getInstance().alertLoginDialog();
			                    self.menu.mainmenu.deactiveMenu(self.menuid);
			                    return;
			                }
			                window.open('resultpages/headod.html');	                                      
	                       // self.menu.submenu.hide();

	                  } else if($this.hasClass("gxys")){	
			                if(!L.ICT.Func["UserLogin"].getInstance().isLogin()){
			                    L.ICT.Func["UserLogin"].getInstance().alertLoginDialog();
			                    self.menu.mainmenu.deactiveMenu(self.menuid);
			                    return;
			                }	
			                window.open('resultpages/gxgl.html'); 	                                        
	                        // self.menu.submenu.hide();
	                  }                 
	               });
	        }			


		})
	});

});