/*
*热力图模块
*/

define("func/heatmap",[
       "leaflet",
       "esri/leaflet",
       "func/base",
       "func/userLogin"

],function(L){

	L.ICT.Func.add("HeatMap",{
        
        Class:L.Class.extend({

        	initialize:function(){
               this.menu = L.ict.app.menu;
               this.menuid = "ict_menu_main_rlt";
               this.ictmap = L.ict.app.ictmap;
               this.OverlayConfig = Project_ParamConfig.LayersConfig.OverlayDensity;
               this.ShipConfig = Project_ParamConfig.LayersConfig.ShipDensity;
               this.TrafficConfig =  Project_ParamConfig.LayersConfig.TrafficDensity;

               this._layer = null;
        	},

        	start:function(){   
                this.menu.mainmenu.deactiveMenuExceptOne(this.menuid); 
                if(!L.ICT.Func["UserLogin"].getInstance().isLogin()){
                    L.ICT.Func["UserLogin"].getInstance().alertLoginDialog();
                    this.menu.mainmenu.deactiveMenu(this.menuid);
                    return;
                }      
                this.ictmap.OperateState.heatmap = true;     
                // this.ictmap.realtarget.removeRealTargetLayer();  
                this.ictmap.realtarget.hideRealTargetLayer();                                                 	
                if(this.menu.submenu.has(this.menuid)){
                    this.menu.submenu.destory(this.menuid);
                }
                this.menu.submenu.add(this.menuid,this.getSubMenuHTML());
                this.menu.submenu.show(this.menuid);
                this._initSubMenuEvts();                
        	},

        	stop:function(){
                this.menu.submenu.destory(this.menuid);
                this.menu.mainmenu.deactiveMenu(this.menuid);
                this.removeLayer();
                this.ictmap.OperateState.heatmap = false;     
                this.ictmap.realtarget.addRealTargetLayer();                 
        	},

        	getSubMenuHTML:function(){
        		var html = [];
        		html.push('<ul class="submenu_heatmap">');
        		html.push('<li class="submenu_heatmap_li">');
                html.push('<img src="themes/images/frame/menu_glxs_cblx.png">&nbsp&nbsp<label class="func_heatmap_overlay">覆盖密度</label>');  
                html.push('<ul class="time_ul" style="display:none;">');
                html.push('<li>');
                html.push('<label class="func_heatmap_timeselect">时间选择:</label>');
                html.push('<select name="heatmap_overlay_time">');
                for(var i=0,len=this.OverlayConfig.length;i<len;i++){
                    var o = this.OverlayConfig[i];
                    html.push('<option value="'+i+'">'+o.time+'</option>');
                }
                html.push('</select>');
                html.push('</li>');
                html.push('</ul>');
        		html.push('</li>');
        		html.push('<li class="submenu_heatmap_li">');
                html.push('<img src="themes/images/frame/menu_glxs_cblx.png">&nbsp&nbsp<label class="func_heatmap_ship">船舶密度</label>');  
                html.push('<ul class="time_ul" style="display:none;">');
                html.push('<li>');
                html.push('<label class="func_heatmap_timeselect">时间选择:</label>');
                html.push('<select name="heatmap_ship_time">');
                for(var i=0,len=this.ShipConfig.length;i<len;i++){
                    var o = this.ShipConfig[i];
                    html.push('<option value="'+i+'">'+o.time+'</option>');
                }
                html.push('</select>');
                html.push('</li>');                
                html.push('</ul>');
        		html.push('</li>');
        		html.push('<li class="submenu_heatmap_li">');
                html.push('<img src="themes/images/frame/menu_glxs_cblx.png">&nbsp&nbsp<label class="func_heatmap_traffic">交通密度</label>');  
                html.push('<ul class="time_ul" style="display:none;">');
                html.push('<li>');
                html.push('<label class="func_heatmap_timeselect">时间选择:</label>');
                html.push('<select name="heatmap_traffic_time">');
                for(var i=0,len=this.TrafficConfig.length;i<len;i++){
                    var o = this.TrafficConfig[i];
                    html.push('<option value="'+i+'">'+o.time+'</option>');
                }
                html.push('</select>');
                html.push('</li>');                
                html.push('</ul>');
        		html.push('</li>');
        		html.push('</ul>');
        		return html.join("");

        	},

        	_initSubMenuEvts:function(){
        		var $menuContainer = this.menu.getContainer(),
        		    self = this;
                //中英文
                $menuContainer.find(".func_heatmap_timeselect").html($.i18n.prop('func_heatmap_timeselect')); 
                $menuContainer.find(".func_heatmap_overlay").html($.i18n.prop('func_heatmap_overlay')); 
                $menuContainer.find(".func_heatmap_ship").html($.i18n.prop('func_heatmap_ship')); 
                $menuContainer.find(".func_heatmap_traffic").html($.i18n.prop('func_heatmap_traffic')); 

        		$menuContainer.find(".submenu_heatmap > .submenu_heatmap_li").on("click",function(){
                     var $this = $(this);
                     if($this.hasClass("active")){
                     	$this.find(".time_ul").css("display","none");
                     	$this.removeClass("active");
                     	self.removeLayer();
                     } else {
                     	$this.find(".time_ul").css("display","block");
                     	$this.addClass("active").siblings().removeClass("active");
                     	$this.siblings().find(".time_ul").css("display","none");
                     	$this.find("select").change();
                     }
        		});

        		$menuContainer.find(".submenu_heatmap > .submenu_heatmap_li > ul").on("click",function(e){
                    e.stopPropagation();
        		});

        		$menuContainer.find(".submenu_heatmap > .submenu_heatmap_li >ul >li >select").on("change",function(){
                    var $this = $(this);
                    var type = $this.attr("name");
                    var val = parseInt($this.val());
                    var curUrl = null;
                    if(type === "heatmap_overlay_time"){
                        curUrl = self.OverlayConfig[val].url;

                    } else if(type === "heatmap_ship_time"){
                        curUrl = self.ShipConfig[val].url;

                    } else {
                        curUrl = self.TrafficConfig[val].url;
                    }
                    self.updateLayer(curUrl);
                    
        		});
               
        	},

        	createLayer:function(url){
		      return   L.esri.dynamicMapLayer({
		          url: url
		        });
        	},

        	updateLayer:function(url){
                this.removeLayer();
                this._layer = this.createLayer(url);
                this._layer.addTo(this.ictmap.map);
        	},

        	removeLayer:function(){
        		if(this._layer){
        			this._layer.remove();
        			this._layer = null;
        		}
        	}


        })

	});

});