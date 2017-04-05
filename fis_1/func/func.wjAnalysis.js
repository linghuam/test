/**
*挖掘分析
*/
define("func/wjAnalysis",[
	"leaflet",
    "esri/leaflet",
	"func/base",
    "func/fxpg",
    "data/ajax",
    "leaflet/rasterLayer"

],function(L){
     
     L.ICT.Func.add("WJAnalysis",{

         Class: L.Class.extend({

            initialize:function(){
               this.menu = L.ict.app.menu;
               this.menuid = "ict_menu_main_xwwj";
               this.ictmap = L.ict.app.ictmap;
               this.config = Project_ParamConfig.wjAnalysisConfig;
               this.ajax = new L.ICT.Ajax();

               this._layer = null;
               this._ssfblayergroup = null;
               this._activeForecateLayer = null;
               this.fxpgObj = null;

            },

            start:function(){               
                if(this.menu.submenu.has(this.menuid)){
                    this.menu.submenu.destory(this.menuid);
                }
                this.menu.submenu.add(this.menuid,this.getSubMenuHTML());
                this.menu.submenu.show(this.menuid);
                this._initSubMenuEvts();   
                this.menu.mainmenu.deactiveMenuExceptOne(this.menuid); 
                this.menu.mainmenu.disableMenuExceptOne(this.menuid);            
            },

            stop:function(){
                this.menu.submenu.hide();
                this.removeLayer();
                this.removeHdycLayer();
                if(this.fxpgObj){
                    this.fxpgObj.stop();
                    this.fxpgObj = null;
                }
                this.menu.mainmenu.deactiveMenu(this.menuid);
                this.menu.mainmenu.enableMenu();

            },

            getSubMenuHTML:function(){
                var html = [];
                //交通模式
                html.push('<div class="submenu_wjanalysis">');
                html.push('<div class="submenu_wjanalysis_jtms">');
                html.push('<label><img src="themes/images/frame/menu_xwfx_skfx.png">&nbsp&nbsp交通模式</label>');
                html.push('<ul>');
                //密度分布
                html.push('<li class="submenu_li submenu_li_mdfb">');
                html.push('<label>密度分布</label>');
                html.push('<ul class="time_ul"  style="display:none;">');
                html.push('<li>');
                html.push('<label>时间:</label>');
                html.push('<select name="mdfb_time">');
                for(var i=0,len=this.config.densityArr.length;i<len;i++){
                    var o = this.config.densityArr[i];
                    html.push('<option value="'+i+'">'+o.time+'</option>');
                }
                html.push('</select>');
                html.push('</li>');
                html.push('</ul>');
                html.push('</li>');
                //流量分布
                html.push('<li class="submenu_li submenu_li_llfb">');
                html.push('<label>流量分布</label>');
                html.push('<ul class="time_ul" style="display:none;">');
                html.push('<li>');
                html.push('<label>时间:</label>');
                html.push('<select name="llfb_time">');
                for(var i=0,len=this.config.flowArr.length;i<len;i++){
                    var o = this.config.flowArr[i];
                    html.push('<option value="'+i+'">'+o.time+'</option>');
                }
                html.push('</select>');
                html.push('</li>');
                html.push('</ul>');
                html.push('</li>');
                //失事分布
                html.push('<li class="submenu_li submenu_li_ssfb"><label>失事分布</label></li>');
                html.push('</ul>');
                html.push('</div>');

                //预测评估
                html.push('<div class="submenu_wjanalysis_ycpg">');
                html.push('<label><img src="themes/images/frame/menu_xwfx_ycpg.png">&nbsp&nbsp预测评估</label>'); 
                html.push('<ul>');
                html.push('<li class="submenu_li submenu_li_hdyc"><label>活动预测</label></li>');
                html.push('<li class="submenu_li submenu_li_fxpg"><label>风险评估</label></li>');
                html.push('</ul>');
                html.push('</div>');
                html.push('</div>');

                return html.join("");

            },

            _initSubMenuEvts:function(){
                var $menuContainer = this.menu.getContainer(),
                    self = this;
                //密度分布
                $menuContainer.find(".submenu_wjanalysis .submenu_li_mdfb").on("click",function(){
                     var $this = $(this);
                     if($this.hasClass("active")){
                        $this.find(".time_ul").css("display","none");
                        $this.removeClass("active");
                        self.removeLayer();
                        self.ictmap.realtarget.addRealTargetLayer();
                        self.ictmap.OperateState.wjfx = false;
                     } else {
                        $this.find(".time_ul").css("display","block");
                        $this.addClass("active").siblings(':not(.submenu_li_hdyc)').removeClass("active");
                        $this.siblings().find(".time_ul").css("display","none");
                        // self.ictmap.realtarget.removeRealTargetLayer();
                        self.ictmap.realtarget.hideRealTargetLayer();                        
                        $this.find("select").change();
                        self.ictmap.OperateState.wjfx = true;
                     }
                });

                //流量分布
                $menuContainer.find(".submenu_wjanalysis .submenu_li_llfb").on("click",function(){
                     var $this = $(this);
                     if($this.hasClass("active")){
                        $this.find(".time_ul").css("display","none");
                        $this.removeClass("active");
                        self.removeLayer();
                        self.ictmap.realtarget.addRealTargetLayer();
                        self.ictmap.OperateState.wjfx = false;
                     } else {
                        $this.find(".time_ul").css("display","block");
                        $this.addClass("active").siblings(':not(.submenu_li_hdyc)').removeClass("active");
                        $this.siblings().find(".time_ul").css("display","none");
                        // self.ictmap.realtarget.removeRealTargetLayer();
                         self.ictmap.realtarget.hideRealTargetLayer();
                        $this.find("select").change();
                        self.ictmap.OperateState.wjfx = true;
                     }
                });

                //失事分布
                $menuContainer.find(".submenu_wjanalysis .submenu_li_ssfb").on("click",function(){
                     var $this = $(this);
                     if($this.hasClass("active")){                        
                        $this.removeClass("active");
                        self.removeLayer();
                        self.ictmap.realtarget.addRealTargetLayer();
                        self.ictmap.OperateState.wjfx = false;
                     } else {                       
                        $this.addClass("active").siblings(':not(.submenu_li_hdyc)').removeClass("active");
                        $this.siblings().find(".time_ul").css("display","none");
                        // self.ictmap.realtarget.removeRealTargetLayer();
                         self.ictmap.realtarget.hideRealTargetLayer();
                        //add ssfb layer 
                        self._ssfblayergroup = L.featureGroup();
                        self.ictmap.map.addLayer(self._ssfblayergroup);
                        self.removeLayer();
                        self.addSsfbLayer();
                        self.ictmap.OperateState.wjfx = true;
                     }
                });

                //活动预测
                $menuContainer.find(".submenu_wjanalysis .submenu_li_hdyc").on("click",function(){
                     var $this = $(this);
                     if($this.hasClass("active")){                        
                        $this.removeClass("active");
                        self.removeHdycLayer();
                        self.ictmap.realtarget.addRealTargetLayer();
                        self.ictmap.OperateState.wjfx_hdyc = false;
                     } else {                       
                        $this.addClass("active");  
                        // self.ictmap.realtarget.removeRealTargetLayer();
                         self.ictmap.realtarget.hideRealTargetLayer();                    
                        self.addHdycLayer();
                        self.ictmap.OperateState.wjfx_hdyc = true;
                     }
                });
                
                //风险评估
                $menuContainer.find(".submenu_wjanalysis  .submenu_li_fxpg").on("click",function(){
                     var $this = $(this);
                     self.fxpgObj = L.ICT.Func["FXPG"].getInstance();
                     if($this.hasClass("active")){                       
                        $this.removeClass("active");
                        self.removeLayer();
                        self.fxpgObj.stop();
                        self.ictmap.OperateState.wjfx = false;
                        self.ictmap.realtarget.addRealTargetLayer();
                        
                     } else {                        
                        $this.addClass("active");
                        $menuContainer.find(".submenu_wjanalysis_jtms .submenu_li").removeClass("active");
                        $menuContainer.find(".submenu_wjanalysis_jtms .time_ul").css("display","none");
                        // self.ictmap.realtarget.removeRealTargetLayer();
                         self.ictmap.realtarget.hideRealTargetLayer();
                        self.removeLayer();
                        //run fxpg
                        self.ictmap.OperateState.wjfx = true;
                        self.fxpgObj.start();
                       
                     }
                });                

                $menuContainer.find(".submenu_wjanalysis .submenu_li > ul").on("click",function(e){
                    e.stopPropagation();
                });

                $menuContainer.find(".submenu_wjanalysis .submenu_li >ul >li >select").on("change",function(){
                    var $this = $(this);
                    var type = $this.attr("name");
                    var val = parseInt($this.val());
                    var curUrl = null;
                    if(type === "mdfb_time"){
                        curUrl = self.config.densityArr[val].url;

                    } else if(type === "llfb_time"){
                        curUrl =  self.config.flowArr[val].url;

                    } 
                    if(curUrl){
                        self.updateLayer(curUrl);
                    }
                    
                    
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
                this.ictmap.map.addLayer(this._layer);
            },

            addSsfbLayer:function(){
                var url = this.config.accidentUrl;
                this.ajax.get(url,null,true,this,function(data){
                      if(data.state !== 1){
                        console.log(data.msg.error);
                      }else{
                         this.displaySsfbData(data);                    
                      }
                 });
            },

            displaySsfbData:function(data){
                var shiplist = data.msg.list;
                if(shiplist.length <= 0) return;
                for(var i=0,len=shiplist.length;i<len;i++){
                    var dataobj = shiplist[i];
                    this.convertData(dataobj);
                    var marker = this.createCircleMarker(dataobj);
                    if(!this._ssfblayergroup){
                        this._ssfblayergroup = L.featureGroup();
                        this.ictmap.map.addLayer(this._ssfblayergroup);
                    }
                    this._ssfblayergroup.addLayer(marker);
                }                
            },

            convertData:function(dataobj){
                 dataobj.lon = parseFloat(dataobj.lon/600000);
                 dataobj.lat = parseFloat(dataobj.lat/600000);

            },

            createCircleMarker:function(dataobj){       
                var latlng = L.latLng(dataobj.lat,dataobj.lon);            
                var markerOptions={
                    radius: 4,
                    stroke:false,
                    fill:true,
                    fillColor:'#f00',
                    opacity:1,
                    fillOpacity:1,
                    data:dataobj     
                };
                var marker = L.circleMarker(latlng,markerOptions);

                var popup = this.createPopPanel(dataobj);
                marker.bindPopup(popup);
                
                // var tipOptin={
                //  offset: [6, 8], //偏移量
                //  direction: "right",//提示信息显示位置，有 left right top bottom auto
                //  permanent: false,
                //  opacity: 0.8,//透明度  
                //  className: "realtarget-label-target" //css文件中定义的样式名称，例如：.realtarget-label-target{background-color:transparent;background:transparent;background:rgba(255,255,255,0.3);background-clip:padding-box;border-color:#000000;border-radius:2px;border-style:solid;border-width:1;color:#000000;display:block;font:12px/1.5 "Helvetica Neue",Arial,Helvetica,sans-serif;font-weight:bold;padding:0;position:absolute;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;pointer-events:none;white-space:nowrap;z-index:-1; box-shadow:0 0 0 rgba(0,0,0,0);}
                // };
                // //添加鼠标移上后的提示信息
                // Lmarker.bindTooltip(tiptitle,tipOptin).openTooltip();            
                return marker;

            },    

            createPopPanel:function(dataobj){
                var options = {
                    minWidth:200,
                    maxWidth:300                    
                };
                var popup = L.popup(options);
                var content = this.getPopPanelContent(dataobj);
                popup.setContent(content);
                return popup;
            },

            getPopPanelContent:function(dataobj){
                var lat = L.ict.app.util.tool.latlngTodfmStr(dataobj.lat,"lat");
                var lng = L.ict.app.util.tool.latlngTodfmStr(dataobj.lon,"lng");
                var time = L.ict.app.util.dateTime.getTimeStrFromUnix(dataobj.tim/1000);
                var html = [];
                html.push('<div style="padding:5px;">');
                html.push('<table>');
                html.push('<tr><td>ID号：</td><td>'+ dataobj.id +'</td></tr>');
                html.push('<tr><td>经度：</td><td>'+ lng +'</td></tr>');
                html.push('<tr><td>纬度：</td><td>'+ lat +'</td></tr>');
                html.push('<tr><td>描述：</td><td>'+ dataobj.des||'' +'</td></tr>');
                html.push('<tr><td>危险等级：</td><td>'+ dataobj.dlev +'</td></tr>');
                html.push('<tr><td>更新时间：</td><td>'+ time +'</td></tr>');
                html.push('<tr><td>事件类型：</td><td>'+ this.getEvtType(dataobj.itp) +'</td></tr>');
                html.push('<tr><td>更新人：</td><td>'+ dataobj.uby||'' +'</td></tr>');
                html.push('</table>');
                html.push('</div>');
                return html.join("");

            },

            getEvtType:function(type){
                var res = "";
                if(type == 1 ){
                   res = "翻船";
                }else if(type == 2){
                   res = "撞船";
                }else if(type == 3){
                   res = "海盗";
                }else {
                   res = type;
                }
                return res;
            },

            addHdycLayer:function(){
                var url = this.config.activeForecastUrl;
                // this.ajax.post(url,{},true,this,function(res){
                //      if(res.state !== 1){
                //          console.error(res.msg.error);
                //      }else{
                //          //todo
                //      }
                // },function(e){
                //     console.error(e);
                // }); 
                this._activeForecateLayer = L.gridLayer.rasterLayer({
                    opacity:0.5,//定义栅格图层的透明度
                    tileSize:64,//定义栅格的大小，单位为：像素
                    minZoom:0,//定义显示的最小级别
                    maxZoom:18,//定义显示的最大级别
                    bounds:L.latLngBounds(L.latLng(-90,-180),L.latLng(90,180)) //定义显示栅格的区域
                });
                this.ictmap.map.addLayer( this._activeForecateLayer);                  
            },

            removeHdycLayer:function(){
                if( this._activeForecateLayer){
                    this.ictmap.map.removeLayer( this._activeForecateLayer);
                    this._activeForecateLayer = null;
                }
            },

            removeLayer:function(){
                // L.ict.app.util.tool.invoke(function(){
                if(this._layer){
                    this.ictmap.map.removeLayer(this._layer);
                    this._layer = null;
                }
                if(this._ssfblayergroup){
                    this.ictmap.map.removeLayer(this._ssfblayergroup);
                    this._ssfblayergroup = null;
                }

                // }.bind(this),0,1000,60000);
            }   
         })

     });

});