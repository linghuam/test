/*
*异常告警功能模块
*/
define("func/abnormalAlarm",[
	"leaflet",
    "func/base",
    "control/panel",
    "plugins/ajaxpoll"

],function(L){

	L.ICT.Func.add("AbnormalAlarm",{

		Class:L.Class.extend({

		  initialize:function(){
		   	  this.ictmap = L.ict.app.ictmap;
		   	  this.menu = L.ict.app.menu;
		   	  this.menuid = 'ict_menu_main_ycgj';
		   	  this.config = Project_ParamConfig.abnormalAlarmConfig;

		   	  this._container = null;
		   	  this._popPanel = null;		
		   	  this._data = [];   	 

		  },

		  start:function(){
		   	 if(this._container || this._popPanel) return;
         this._initUi();
         this._initEvts();
         this.curtype = 'area';
         this._container.find(".alarmNav>li:first-child").click();
         this.menu.mainmenu.deactiveMenuExceptOne(this.menuid);
		  },

		  stop:function(){
		   	  if(this._popPanel) this._popPanel.remove();
          this.removeLayer();

          this._container = null;
          this._popPanel = null;
          this._data = [];
          
          this.menu.mainmenu.deactiveMenu(this.menuid);

		  },

		  _initUi:function(){             
              var options = {
              	title:'异常告警',
              	width:510,
              	height:458,
              	left:100,
              	top:200
              };
              options.contentHTML = this._container = $(this.getContentHtml());
              var pop = new L.ICT.PopPanel(options);           
              pop.show();
              this.config.isClose = false;
              this._popPanel = pop;
              this._popPanel.on("popPanelRemove",function(e){
              	 this.menu.mainmenu.deactiveMenu(this.menuid);
              	 this._popPanel = this._container = null;
              	 this._data = [];
              	 this.config.isClose = true;
              },this)
              
		  },

		  getContentHtml:function(){
            var html = [];
            html.push('<div class="alarmContainer">');
    				html.push('   <ul class="alarmNav">');
    				html.push('      <li class="active" data-info="area"><a href="#" >驶入敏感区域</a></li>');
    				html.push('      <li  data-info="behavior"><a href="#">船速过快</a></li>');
    				html.push('      <li data-info="gather"><a href="#" >异常聚集</a></li>');
    				html.push('      <li data-info="ais"><a href="#" >AIS关闭</a></li>');
    				html.push('   </ul>');
    				html.push('	<div class="tableContainer"></div>');
    				html.push('</div>');
    				return html.join("");
		  },

		  _initEvts:function(){
		   	  var self = this;
		   	  self._container.find(".alarmNav>li").on("click",function(event){

		   	  	     $(this).addClass("active").siblings().removeClass("active");
                  self.removeLayer();
		   	  	     var type = $(this).data("info"),
		   	  	     url = null;                
                 switch (type){
                	case "area": url = self.config.url_area;break;
                	case "behavior": url = self.config.url_behavior;break;
                	case "gather": url = self.config.url_gather;break;
                	case "ais": url = self.config.url_ais;break;
                	default:;
                 } 
                 self.curtype = type;     
                 var data = {};
                 data.tim = L.ict.app.startTime;  
                 if(url) {
                 	 self.sendAjaxPoll(url,data,self._ajaxSucCallback);
                 }                 
                 
		   
		   	  });		   	  
		  },

      //ajax轮询
      sendAjaxPoll:function(url,data,callback){
             $.poll({
                url: url,
                data:data,
                currentFunc:'AbnormalAlarm',//当前调用的功能
                context:this,
                dataType:'json',
                method:'POST',              
                pollDelay: 5000,
                pollDone:function(res){
                    if(res.state !== 1){       
                        console.error(res.msg.result);                     
                        // L.ict.app.util.dialog.error("错误提示","没有统计结果！");
                    } else{
                        typeof callback === "function" ? callback.call(this,res) : null;
                    } 
                },
                pollFail:function(err){              
                   console.log('pollfial');
                }
             });        

      },		

      _ajaxSucCallback:function(res){		   	   
            var tableOptions = {
	   	  	     	height:358,
	   	  	     	thData:[{name:'time',value:'时间',width:35},{name:'detail',value:'详细信息'}],
	   	  	     	tbData:[]
	   	  	  };
		   	  	if(res.state !== 1) return;
		   	  	tableOptions.tbData = [];
		   	  	var list = this._data = res.msg.anomalyList;
            if(this.curtype == 'area'){                   
		            for(var i=0,len=list.length;i<len;i++){
		              var obj = {}, r = list[i];
		              obj.data_id = i;
		              obj.time = L.ict.app.util.dateTime.getTimeStrFromUnix(r.tim);		
		              var lon = L.ict.app.util.tool.latlngTodfmStr(r.lon/600000,"lng");
                      var lat = L.ict.app.util.tool.latlngTodfmStr(r.lat/600000,"lat"); 
                      var ph = r.tid ===-1 ? r.tio : r.tid;        
		              obj.detail = '位置:'+ lon +' '+ lat + '，' + '批号:'+ ph + '，' + 'mmsi:'+ r.msi;
		              tableOptions.tbData.push(obj);
		            }
            } else if(this.curtype == 'behavior'){
                  for(var i=0,len=list.length;i<len;i++){
		              var obj = {} , r = list[i];
		              obj.data_id = i;
		              obj.time = L.ict.app.util.dateTime.getTimeStrFromUnix(r.tim);
		              var lon = L.ict.app.util.tool.latlngTodfmStr(r.lon/600000,"lng");
                      var lat = L.ict.app.util.tool.latlngTodfmStr(r.lat/600000,"lat");
                      var ph = r.tid ===-1 ? r.tio : r.tid; 
                      var sp = (r.cog/10)+'节';
		              obj.detail = '位置:'+ lon  +' '+ lat + '，' + '批号:'+ ph + '，' + 'mmsi:'+r.msi +'，'+ '航速:'+ sp;
		              tableOptions.tbData.push(obj);
		            }
            } else if(this.curtype == 'gather'){
		            for(var i=0,len=list.length;i<len;i++){
		              var obj = {} , r = list[i];
		              obj.data_id = i;
		              obj.time = L.ict.app.util.dateTime.getTimeStrFromUnix(r.tim);
		              var shiptype = this.getShipType(r);
		              var ldlon = L.ict.app.util.tool.latlngTodfmStr(r.ldlon/600000,"lng");
                      var ldlat = L.ict.app.util.tool.latlngTodfmStr(r.ldlat/600000,"lat");
                      var rulon = L.ict.app.util.tool.latlngTodfmStr(r.rulon/600000,"lng");
                      var rulat = L.ict.app.util.tool.latlngTodfmStr(r.rulat/600000,"lat");
		              obj.detail = '位置:'+ '左下'+'('+ldlon+' '+ldlat+')'+'右上'+'('+rulon+' '+rulat+')' +'，'+ '船舶类型:' + shiptype + '，'+'当前数量:' + r.scou +'，'+ '历史期望:'+ r.cavg;
		              tableOptions.tbData.push(obj);
		            }
            } else if(this.curtype == 'ais'){
		            for(var i=0,len=list.length;i<len;i++){
		              var obj = {} ,  r = list[i];
		              obj.data_id = i;
		              obj.time = L.ict.app.util.dateTime.getTimeStrFromUnix(r.tim);
                      var lon = L.ict.app.util.tool.latlngTodfmStr(r.lon/600000,"lng");
                      var lat = L.ict.app.util.tool.latlngTodfmStr(r.lat/600000,"lat");		
                      var ph = r.tid ===-1 ? r.tio : r.tid; 
                      var stoptime = r.offs+"秒";            
		              obj.detail = '位置:'+ lon  +' '+ lat + '，' + '批号:'+ ph + '，' + 'mmsi:'+r.msi + '，'+'关闭时间:'+ stoptime;
		              tableOptions.tbData.push(obj);
		            } 
            }
            if(this._container){
              var tableContainer = this._container.find('.tableContainer');
              new L.ICT.TablePanel(tableOptions).addTo(tableContainer);
              tableContainer.find(".tbDiv tr").on("click",$.proxy(this._rowClickEvt,this));   	
            }

      },

		  getShipType:function(obj){
		    	var type = parseInt(obj.ast);
		    	var res = '';
		    	switch(type){
                    case 0 : res = '';break;
                    case 1 : res = '货船';break;
                    case 2 : res = '搜救船';break;
                    case 3 : res = '油轮';break;
                    case 4 : res = '拖轮';break;
                    case 5 : res = '渔船';break;
                    case 6 : res = '拖船';break;
                    case 7 : res = '客船';break;
                    case 100: res = '其他';break;
                    default:;

		    	}
		    	return res;

		  },
		    
		  _rowClickEvt:function(e){
             var $this = $(e.currentTarget);
             var id = $this.data('id');
             this.removeLayer();
             if(id>=0 && this._data && this.curtype === 'area'){
             	  var dataobj = this._data[id];
                this._marker = this.createShipMarker(dataobj);                
                this.ictmap.map.addLayer(this._marker);
                this.ictmap.map.panTo(this._marker.getLatLng());
                this._marker.openPopup();
               

                // var lat = dataobj.lat/600000;
                // var lng = dataobj.lon/600000;
                // var latlng = L.latLng(lat,lng);
                // var shipid = dataobj.tid ===-1 ? dataobj.tio : dataobj.tid;              
                // this.ictmap.map.panTo(latlng);
                // this.ictmap.realtarget.locateShipById(shipid);

             }
		  },

      removeLayer:function(){
          if(this._marker){
              this.ictmap.map.removeLayer(this._marker);
              this._marker = null;
          }
      },

      createShipMarker:function(dataobj){
          var lat = dataobj.lat/600000;
          var lng = dataobj.lon/600000;
          var latlng = L.latLng(lat,lng);
          var icon = this.getTargetIcon(dataobj.ast);
          var lmarkerOption={
                icon: icon,                
                data:dataobj   //为了在点击时能获取到相关的信息    
          };
          var Lmarker = L.marker(latlng,lmarkerOption);
  
          //添加鼠标单击事件
          var popupOptions = {
               minWidth:200
          };
          Lmarker.bindPopup(this.getPopupContent(dataobj),popupOptions);
          return Lmarker;

      },

      getPopupContent:function(dataobj){
         var lat = L.ict.app.util.tool.latlngTodfmStr(dataobj.lat/600000,'lat');
         var lng = L.ict.app.util.tool.latlngTodfmStr(dataobj.lon/600000,'lng');
         var time = L.ict.app.util.dateTime.getTimeStrFromUnix(dataobj.tim);
         var type = this.ictmap.realtarget.getDetialConvertName(dataobj.ast,"ship_type");
         var html = [];
         html.push('<div style="padding:5px;">');
         html.push('<table>');
         html.push('<tr><td>船舶类型:</td><td>'+ type +'</td></tr>');
         html.push('<tr><td>MMSI:</td><td>'+ dataobj.msi +'</td></tr>'); 
         html.push('<tr><td>经纬度:</td><td>'+lng+','+lat+'</td></tr>');
         html.push('<tr><td>敏感区域id:</td><td>'+ dataobj.rid +'</td></tr>');
         html.push('<tr><td>时间:</td><td>'+time+'</td></tr>');     
         html.push('</table>');         
         html.push('</div>');
         return html.join("");        

      },

      //根据船舶类型获取船舶图标
      getTargetIcon:function(type){
         var icon;
         switch (type){
           case 1: icon=L.ICT.ShipIcon.ship1 ;break;
           case 2: icon=L.ICT.ShipIcon.ship2 ;break;
           case 3: icon=L.ICT.ShipIcon.ship3 ;break;
           case 4: icon=L.ICT.ShipIcon.ship7;break;
           case 5: icon=L.ICT.ShipIcon.ship4 ;break;
           case 6: icon=L.ICT.ShipIcon.ship7;break;
           case 7: icon=L.ICT.ShipIcon.ship5 ;break;
           case 100: icon=L.ICT.ShipIcon.ship6 ;break;
           default: icon=L.ICT.ShipIcon.ship7;
         }
         return icon;

      }      

		})

	});

});



