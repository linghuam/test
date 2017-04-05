/**
*港口信息模块
*/
define("func/portInfo",[
	"leaflet",
	"func/base",
  "data/ajax"

],function(L){

     L.ICT.Func.add("PortInfo",{

         Class: L.Class.extend({

            initialize:function(){
                this.config = Project_ParamConfig.PortConfig;
                this.ajax = new L.ICT.Ajax();
                this.ictmap = L.ict.app.ictmap;
                this.menu = L.ict.app.menu;
                this.menuid = 'ict_menu_main_gkxx';
                this._portList = [];
                this._portLayerList = [];
                this._portLayerGroup = null;
                this.isShow = false;

            },

            start:function(){
               this.ictmap.OperateState.port = true;
               // this.ictmap.realtarget.removeRealTargetLayer();
               // this.ictmap.realtarget.hideRealTargetLayer();
               if(this._portLayerGroup){
                  this.showPortLayer();
               }else{
                  this.getPortList();
               }              
               this.menu.mainmenu.deactiveMenuExceptOne(this.menuid);
               this.menu.mainmenu.disableMenuExceptOne(this.menuid);
             
            },

            stop:function(){
               this.ictmap.OperateState.port = false;
               this.hidePortLayer();      
               // this.ictmap.realtarget.addRealTargetLayer();                      
               this.menu.mainmenu.deactiveMenu(this.menuid);
               this.menu.mainmenu.enableMenu();
                    
            },

            getPortList:function(){
                var url = this.config.listUrl;
                this.ajax.get(url,null,true,this,function(res){
                    if(this.ictmap.OperateState.port === false){
                        return;
                    }
                    if(res.state != 1){
                       console.error(res.msg.error);
                       L.ict.app.util.dialog.error("错误提示","没有港口信息！");
                    }else{
                       var listinfo = res.msg.portlist;
                       this._portList = [];
                       for(var i=0,len=listinfo.length;i<len;i++){
                           var port = this.convertPortObj(listinfo[i]); 
                           this._portList.push(port);
                       }
                       this.setPortLayerList();
                       this.addPortLayer();
                    }
                },function(error){
                    // console.error("获取港口信息列表出错！");
                });

            },

            convertPortObj:function(obj){
                var oneobj={};
                oneobj.id=obj.id;
                oneobj.cc=obj.cc;
                oneobj.lon=obj.lon/600000;     
                oneobj.lat=obj.lat/600000;
                oneobj.name=obj.name;
                return oneobj;

            },

            setPortLayerList:function(){
                this._portLayerList = [];
                for(var i=0,len=this._portList.length;i<len;i++){
                    var p = this._portList[i];
                    var marker = this.createPortMarker(p);
                    this._portLayerList.push(marker);
                }

            },                 

            createPortMarker:function(portobj){
               var latlng = L.latLng(portobj.lat,portobj.lon),
                   tipText = portobj.name,
                   portIcon = L.icon({
                        iconUrl: 'themes/images/shipIcons/port.png',
                        iconSize: [20, 20],  //图标的大小，格式，第一个参数是宽度，第二个参数是高度
                        iconAnchor: [16, 16] //图标显示位置 margin-left:-16px;margin-top:-16px
                    });
               var markOptions = {
                  icon:portIcon,                  
                  title:tipText, //添加鼠标移上后的提示信息
                  data:portobj
               };
               var Lmarker = L.marker(latlng,markOptions);
               Lmarker.on("click",this._portClickEvt,this);
               return Lmarker;

            },
            
            _portClickEvt:function(event){
                var curPort = event.target,
                    data = {},
                    url = this.config.infoUrl;
                data.id = curPort.options.data.id;
                this.ajax.post(url,data,true,this,function(res){
                   if(res.state != 1){
                      console.error(res.msg.error);
                   }else{
                      var portobj = res.msg.port;
                      portobj = L.extend(portobj,curPort.options.data);
                      var popupOptions = {
                          maxWidth:300,
                          minWidth:300,
                          className:'ict_portInfo_popupContainer'
                       };
                      curPort.bindPopup(this.getPopupContent(portobj),popupOptions).openPopup();                    
                   }       
                },function(error){
                  console.error("获取港口信息出错！");
                });

            },

            getPopupContent:function(portobj){
                var lat = L.ict.app.util.tool.latlngTodfm(portobj.lat,'lat'); 
                lat = lat[3]+' '+lat[0]+'°'+lat[1]+'′'+lat[2]+'″';
                var lng = L.ict.app.util.tool.latlngTodfm(portobj.lon,'lng');
                lng = lng[3]+' '+lng[0]+'°'+lng[1]+'′'+lng[2]+'″';
                var html = [];
                html.push('<div class="portInfo_Div">');
                html.push('<div class="portInfo_title">港口信息资料</div>');
                html.push('<div class="portInfo_table_div">');
                html.push('<table>');
                html.push('<tr><td>港口ID:</td><td>'+portobj.id+'</td></tr>');
                html.push('<tr><td>区域英文名:</td><td>'+portobj.area_name+'</td></tr>');
                html.push('<tr><td>港口英文名:</td><td>'+portobj.port_name+'</td></tr>');
                html.push('<tr><td>国家英文名:</td><td>'+portobj.country+'</td></tr>');
                html.push('<tr><td>国家中文名:</td><td>'+portobj.country_chinese+'</td></tr>');
                html.push('<tr><td>港口大小:</td><td>'+portobj.harbor_size+'</td></tr>');
                html.push('<tr><td>港口类型:</td><td>'+portobj.harbor_type+'</td></tr>');
                html.push('<tr><td>经度:</td><td>'+lng+'</td></tr>');
                html.push('<tr><td>纬度:</td><td>'+lat+'</td></tr>');   
                html.push('<tr><td>国家代码:</td><td>'+portobj.cc+'</td></tr>');                                            
                html.push('</table>');
                html.push('</div>');
                html.push('</div>');
                return html.join("");

            },


            showPortLayer:function(){
                if(this._portLayerGroup){
                  this._portLayerGroup.eachLayer(function(layer){
                    if(layer.setOpacity) layer.setOpacity(1);
                    if(layer.setStyle) layer.setStyle({opacity:1,fillOpacity:1});
                  },this);
                  this.isShow = true;
               }                    
            },


            hidePortLayer:function(){
               if(this._portLayerGroup){
                  this._portLayerGroup.eachLayer(function(layer){
                    if(layer.setOpacity) layer.setOpacity(0);
                    if(layer.setStyle) layer.setStyle({opacity:0,fillOpacity:0});             
                  },this);
                  this.isShow = false;
               }
            },            

            addPortLayer:function(){
                // this.ictmap.realtarget.removeRealTargetLayer();
                // this.ictmap.realtarget.hideRealTargetLayer();                
                this._portLayerGroup = new L.FeatureGroup(this._portLayerList);
                this.ictmap.map.addLayer(this._portLayerGroup);
                this.isShow = true;

            },

            removePortLayer:function(){
                if(this._portLayerGroup){
                     this.ictmap.map.removeLayer(this._portLayerGroup);
                }
                this._portLayerGroup = null;
                this.isShow = false;

            }

         })

     });    

});