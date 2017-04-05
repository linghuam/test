/*
*航迹查询功能
*/
define("func/hjcx",[   
    "leaflet",
    "func/base",
    "control/panel",
    "plugins/mcscroll",
    "plugins/my97DatePicker",
    "data/ajax",
    "func/userLogin"

],function(L){


  L.Class.HJCXBase = L.Class.extend({

	      initialize:function(){
             this.util = L.ict.app.util;
             this.ictmap = L.ict.app.ictmap;
             this.ajax = new L.ICT.Ajax(); 
             this.config = Project_ParamConfig.hjcxConfig;
             this._hjcxLayerGroup = null;
             this._hjcxlayerarr = {};
	      },

	      addHjLayerGroup:function(res){
	      	 this._hjcxLayerGroup = L.featureGroup().addTo(this.ictmap.map);
             var shiplist = res.msg.shipList;
             for(var i=0,len=shiplist.length;i<len;i++){
             	var oneship = shiplist[i];
             	var id = oneship.num;
             	var poslist = oneship.posList;
             	var allLayer=[], latlngs = [],hjline=null,shipmarker=null,closemarker=null;

                for(var j=0,lenj=poslist.length;j<lenj;j++){
                	var targetobj = this.convertShipObj(poslist[j]);

                	var latlng = L.latLng(targetobj.lat,targetobj.lon);
                	    latlngs.push(latlng);

                	var pt = this.createHjPoint(targetobj);
                	allLayer.push(pt);

                	if(j === 0) {
                	   var t1 = this.convertShipObj(poslist[0]);
                	   var latlng1 = L.latLng(t1.lat,t1.lon);
                	   if(lenj >= 2){
	                	   var t2 = this.convertShipObj(poslist[1]);
	                	   var latlng2 = L.latLng(t2.lat,t2.lon);
	                	   closemarker = this.createCloseMarker(latlng1,latlng2,id);
                	   } else {
                	   	   closemarker = this.createCloseMarker(latlng1,null,id);
                	   }

                	}

                    if(j === lenj-1){
                    	shipmarker = this.createShipMarker(targetobj);
                    }                  
                    
                }
                if(latlngs.length >=2){
                   hjline = this.createHjLine(latlngs);
                   allLayer.unshift(hjline);
                }
                if(shipmarker){
                   allLayer.push(shipmarker);
                }
                if(closemarker){
                	allLayer.push(closemarker);
                }
                if(allLayer.length > 0){
	                this._hjcxlayerarr[id] = allLayer;     
	                for(var k=0,lenk=allLayer.length;k<lenk;k++){
	                   this._hjcxLayerGroup.addLayer(allLayer[k]);
	                }
	                //定位
	                if(i === 0 && shipmarker){
	                    this.ictmap.map.panTo(shipmarker.getLatLng());
	                }                 	
                }         
                
             }

          },

          convertShipObj:function(targetobj){
	          	var obj = {};
	            obj.dir = targetobj.co/10;//航向
	            obj.heading = targetobj.he;
	            obj.lat = parseFloat(targetobj.la/600000);
	            obj.lon = parseFloat(targetobj.lo/600000);
	            obj.speed = targetobj.sp;
	            obj.time = targetobj.ti;
	          	return obj;

          },

          removeLayerGroup:function(){
           	  if(this._hjcxLayerGroup){
           	  	 this._hjcxLayerGroup.clearLayers();
           	  	 this._hjcxLayerGroup = null;
           	  }

          },

	  	  createHjPoint:function(targetobj){
	  	  	    //中英文
	  	  	    var unitlang = $.i18n.prop('common_ship_speed_unit');
                var lnglang = $.i18n.prop('common_ship_lng');
                var latlang = $.i18n.prop('common_ship_lat');
                var timelang = $.i18n.prop('common_time_info1');
                var helang =  $.i18n.prop('common_ship_dir');
                var splang = $.i18n.prop('common_ship_speed');

	   		    //时间 
	    		var time = this.util.dateTime.getTimeStrFromUnix(targetobj.time);
	    		//纬度
	    		var lat = this.util.tool.latlngTodfmStr(targetobj.lat,'lat');
	    	    //经度		
	    		var lon = this.util.tool.latlngTodfmStr(targetobj.lon,'lng');			
	    		//坐标
	    		var lnglat = L.latLng(targetobj.lat, targetobj.lon);
	            //航向
	            var hx = targetobj.dir;
	            //船速
	            var sp = targetobj.speed;

	            var tiptitle = lnglang + lon + "<br>";
	                tiptitle += latlang + lat + "<br>";
	                tiptitle += timelang + time + "<br>";
	                tiptitle += helang + hx + "°<br>";
	                tiptitle += splang + sp + ' ' +unitlang;
	    		
	    		var lmarkerOption={
	    			radius: 4,
	    			stroke:false,
	    			fill:true,
	    			fillColor:'#f00',
	                opacity:1,
	    			fillOpacity:1,
	    			data:targetobj	 
	    		};
	    		var Lmarker = L.circleMarker(lnglat,lmarkerOption);
	    		
	    		var tipOptin={
	    			offset: [0, 0], //偏移量，第一个参数是X方向，第二个参数是Y方向，当direction是left或者right时，只有第一个参数起作用，当direction是top或者bottom时，只有第二个参数起作用
	    			direction: "top",//提示信息显示位置，有 left right top bottom auto	    			
	    			opacity: 0.8,//透明度	
	    			permanent:false,
	    			className: "realtarget-label-target" //css文件中定义的样式名称，例如：.realtarget-label-target{background-color:transparent;background:transparent;background:rgba(255,255,255,0.3);background-clip:padding-box;border-color:#000000;border-radius:2px;border-style:solid;border-width:1;color:#000000;display:block;font:12px/1.5 "Helvetica Neue",Arial,Helvetica,sans-serif;font-weight:bold;padding:0;position:absolute;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;pointer-events:none;white-space:nowrap;z-index:-1; box-shadow:0 0 0 rgba(0,0,0,0);}
	    		};
	    		//添加鼠标移上后的提示信息
	    		Lmarker.bindTooltip(tiptitle,tipOptin).openTooltip();			
	    		return Lmarker;

	  	  },

	  	  createShipMarker:function(targetobj){
	  	  	    //中英文
	  	  	    var unitlang = $.i18n.prop('common_ship_speed_unit');
                var lnglang = $.i18n.prop('common_ship_lng');
                var latlang = $.i18n.prop('common_ship_lat');
                var timelang = $.i18n.prop('common_time_info1');
                var helang =  $.i18n.prop('common_ship_dir');
                var splang = $.i18n.prop('common_ship_speed');

				//时间 
				var time = this.util.dateTime.getTimeStrFromUnix(targetobj.time);
				//纬度
				var lat = this.util.tool.latlngTodfmStr(targetobj.lat,'lat');
				//经度		
				var lon = this.util.tool.latlngTodfmStr(targetobj.lon,'lng');			
				//坐标
				var lnglat = L.latLng(targetobj.lat, targetobj.lon);
				//航向
				var hx = targetobj.dir;
				//船速
				var sp = targetobj.speed;

				var tiptitle = lnglang + lon + "<br>";
                tiptitle += latlang + lat + "<br>";
                tiptitle += timelang + time + "<br>";
                tiptitle += helang + hx + "°<br>";
                tiptitle += splang + sp +' '+unitlang;

				// var tiptitle="经度:" +lon+"<br>纬度:"+lat+"<br>时间:"+time+"<br>航向:"+hx+"°"+"<br>航速:"+sp;

				var lmarkerOption={
							icon: L.ICT.ShipIcon.ship7,
							rotationAngle: hx, //方向，正北是0，顺时针，共360，
							data:targetobj	 //为了在点击时能获取到相关的信息		
					};
				var Lmarker = L.marker(lnglat,lmarkerOption);

				var tipOptin={
					offset: [0, 0], //偏移量，第一个参数是X方向，第二个参数是Y方向，当direction是left或者right时，只有第一个参数起作用，当direction是top或者bottom时，只有第二个参数起作用
					direction: "top",//提示信息显示位置，有 left right top bottom auto
					permanent: false,
					opacity: 0.8,//透明度	
					className: "realtarget-label-target" //css文件中定义的样式名称，例如：.realtarget-label-target{background-color:transparent;background:transparent;background:rgba(255,255,255,0.3);background-clip:padding-box;border-color:#000000;border-radius:2px;border-style:solid;border-width:1;color:#000000;display:block;font:12px/1.5 "Helvetica Neue",Arial,Helvetica,sans-serif;font-weight:bold;padding:0;position:absolute;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;pointer-events:none;white-space:nowrap;z-index:-1; box-shadow:0 0 0 rgba(0,0,0,0);}
				};
				//添加鼠标移上后的提示信息
				Lmarker.bindTooltip(tiptitle,tipOptin).openTooltip();
					
			    //添加鼠标单击事件
				var popupOptions = {
				     minWidth:200,
				     className:'ict_right_menu_xskz_popupContainer'
				};
				// Lmarker.bindPopup(this.getPopupContent(targetobj),popupOptions);
				return Lmarker;

	  	 },

	     getPopupContent:function(targetobj){
	     	   //中英文
	  	  	   var co = $.i18n.prop('common_ship_country');	     	   
	  	  	   var unitlang = $.i18n.prop('common_ship_speed_unit');
               var lnglang = $.i18n.prop('common_ship_lng');
               var latlang = $.i18n.prop('common_ship_lat');
               var timelang = $.i18n.prop('common_time_info1');
               var helang =  $.i18n.prop('common_ship_heading');
               var splang = $.i18n.prop('common_ship_speed');

		       var lat = this.util.tool.latlngTodfmStr(targetobj.lat,'lat');
		       var lng = this.util.tool.latlngTodfmStr(targetobj.lon,'lng');
		       var time = this.util.dateTime.getTimeStrFromUnix(targetobj.time);
		       
		       var html = [];
		       html.push('<div class="displayctr_div" style="padding:5px;">');
		       html.push('<table>');
		       html.push('<tr><td>'+ co +'</td><td>'+ targetobj.country +'</td></tr>');
		       html.push('<tr><td>'+ helang +'</td><td>'+ targetobj.heading +'°'+'</td></tr>'); 
		       html.push('<tr><td>'+ lnglang +'</td><td>'+ lng +'</td></tr>');
		       html.push('<tr><td>'+ latlang +'</td><td>'+ lat +'</td></tr>');		       
		       html.push('<tr><td>'+ splang +'</td><td>'+ targetobj.speed +unitlang+'</td></tr>');
		       html.push('<tr><td>'+ timelang +'</td><td>'+ time +'</td></tr>');	     
		       html.push('</table>');         
		       html.push('</div>');
		       return html.join("");        

	    },  	 
  
	  	createHjLine:function(latlngs){
	        var pathOptions = {
	          opacity:1,
	          fillOpacity:1
	        };		        
	        var line = L.polyline(latlngs,pathOptions);
	        return line;

	  	},	  

	    //创建关闭按钮
	    createCloseMarker:function(latlng,latlng1,id){
	         var icon =  L.icon({
	              iconUrl: 'themes/images/shipIcons/hjxs_close.png',
	              iconSize: [18, 18],  //图标的大小，格式，第一个参数是宽度，第二个参数是高度
	              iconAnchor: [28, 14] // 图标显示位置，例如宽度和高度是图标大小的一半，则经纬度的点正好在图标的中心点 
	          });
	         if(latlng1 && latlng1.lng < latlng.lng){
	            icon = L.icon({
	              iconUrl: 'themes/images/shipIcons/hjxs_close.png',//icon图标的左上角对准latlng点
	              iconSize: [18, 18],   
	              iconAnchor: [-9, 14] //程序解析后变成margin-left:9px;margin-top:-14px;
	            });
	         }
	         var markOptions = {
	            icon:icon,
	            id:id,
	            opacity:1
	         };
	         var Lmarker = L.marker(latlng,markOptions);
	          
	         //添加鼠标单击事件
	          Lmarker.on("click", this._markerCloseClickEvt,this);
	          return Lmarker;        

	    },
    
	    //关闭按钮点击事件
	   _markerCloseClickEvt:function(e){
	        var target = e.target;
	        var id = target.options.id;
	        // this.removeLayerById(id);
            
            this.removeLayerGroup();
            // this.ictmap.realtarget.getRealTarget(); 
            this.ictmap.realtarget.showRealTargetLayer();
	        this.ictmap.OperateState.hjcx = false;
	        this.config.hjcxList = [];

	   },

	   removeLayerById:function(id){
	  	    //移除图层
	  	    var layers = this._hjcxlayerarr[id];
	        for(var i=0,len=layers.length;i<len;i++){
	          this._hjcxLayerGroup.removeLayer(layers[i]);
	        } 
	        delete this._hjcxlayerarr[id];    

	   }


  });

  //多目标查询
  L.ICT.Func.add("HJCXMoreShip",{

  	  Class:L.Class.HJCXBase.extend({

  	  	  initialize:function(){
  	  	  	  	  	  
  	  	  	this.dateUtil = L.ict.app.util.dateTime;
  	  	  	this.menu = L.ict.app.menu;
		   	this.menuid = 'ict_menu_main_hjcx';
  	  	  	this._popPanel = null;
            L.Class.HJCXBase.prototype.initialize.apply(this,arguments);

  	  	  },

  	  	  start:function(){
  	  	  	 this.menu.mainmenu.deactiveMenuExceptOne(this.menuid);
	         if(!L.ICT.Func["UserLogin"].getInstance().isLogin()){
                L.ICT.Func["UserLogin"].getInstance().alertLoginDialog();
                this.menu.mainmenu.deactiveMenu(this.menuid);
                return;
	         }  	  	  	 
  	  	  	 if(this._popPanel) {return;}
             this._initUI();
             this._initEvts();
  	  	  },

  	  	  stop:function(){
  	  	  	  this.menu.mainmenu.deactiveMenu(this.menuid);
              if(this._popPanel) {this._popPanel.remove(false);}
              if(this.ictmap.OperateState.hjcx){
              	 this.ictmap.OperateState.hjcx = false;
              	 // this.ictmap.realtarget.getRealTarget(); 
              	 this.ictmap.realtarget.showRealTargetLayer();
              }              	         
              this.removeLayerGroup();
              this.config.hjcxList = [];
              this._popPanel = null;
  	  	  },

  	  	  _initUI:function(){
            var options = {
                title:$.i18n.prop('func_hjcx_title'),
                width:400,
                height:470,
                top:100,
                left:200,
                contentHTML:this.getContentHTML()
              };
            var pop = this._popPanel = new L.ICT.PopPanel(options);
	        //窗口关闭事件
	        this._popPanel.on("popPanelRemove",function(){
	            this._popPanel = null;
	            this.stop();

	        },this);            
            pop.show();
            this.updateList();            	  	

  	  	  },

  	  	  _initEvts:function(){
		       var $container = this._popPanel.getContainer().find(".hjcx_more_Container"),
		           $msg1 = $container.find(".msg1"),
		           $msg2 = $container.find(".msg2"),
		           self = this;

		         //中英文
		         $container.find(".func_tshf_zdmb_ship").html($.i18n.prop("func_tshf_zdmb_ship"));
		         $container.find(".func_tshf_zdmb_search_placeholder").attr('placeholder',$.i18n.prop("func_tshf_zdmb_search_placeholder"));
		         $container.find(".func_tshf_zdmb_addbtn").html($.i18n.prop("func_tshf_zdmb_addbtn"));
		         $container.find(".func_tshf_zdmb_cblb").html($.i18n.prop("func_tshf_zdmb_cblb"));
		         $container.find(".func_tshf_zdmb_allchk").html($.i18n.prop("func_tshf_zdmb_allchk"));
		         $container.find(".func_tshf_zdmb_delete").html($.i18n.prop("func_tshf_zdmb_delete"));         
		         $container.find(".func_tshf_zdmb_shipname").html($.i18n.prop("func_tshf_zdmb_shipname")); 
		         $container.find(".common_time_info1").html($.i18n.prop("common_time_info1")); 
		         $container.find(".common_time_info2").html($.i18n.prop("common_time_info2")); 
		         $container.find(".func_hjcx_okbtn").html($.i18n.prop("func_hjcx_okbtn")); 		           
		           	 
		         //日期控件
		         $container.find(".Wdate").on("focus",function(){
		              var config = {
		                 readOnly:true,
		                 dateFmt:'yyyy-MM-dd HH',
		                 isShowClear:false,
		                 startDate:'%y-%M-01 00:00:00',
		                 alwaysUseStartDate:true,
		                 lang: window.localStorage.getItem("language") === 'en' ? 'en' : 'zh-cn',
		                 maxDate:'%y-%M-%d %H:%m:%s'
		              };
		              WdatePicker(config);
		          });
	             var startTime = this.dateUtil.getNewDateTimeBeforHour(24);
	             startTime = this.dateUtil.formatDateH(startTime);
	             var endTime = this.dateUtil.formatDateH(new Date());
	             $container.find(".Wdate.startTime").val(startTime);
	             $container.find(".Wdate.endTime").val(endTime);         	         

		         //添加
		          $container.find(".addBtn").on("click",function(event){
		            var key = $container.find(".shipIMO").val();
		            $msg1.text("");
		            if(key == ""){
		                 $msg1.text($.i18n.prop('func_hjcx_mmsi'));
		                 return;
		            }
		            var url = self.config.getShipByMMSIUrl;
		            var data = {
						msi:key 
		            };
		            self.ajax.post(url,data,true,this,function(res){
		                if(res.state !== 1){
		                  console.error(res.msg.error);
		                  $msg1.text($.i18n.prop('func_tshf_zdmb_error_search1'));

		                }else{
        					var sp = self.ictmap.realtarget.convertshipInfoObj(res.msg.searchShip);
        					self.addTarget(nobj); 
        					self.updateList();
		                }
		            });      
		          
		         });

		         //删除
		         $container.find(".deleteBtn").on("click",function(event){
		           var $chks = $container.find(".listContent input:checked");
		           $chks.each(function(){
		                var targetId = $(this).parent().parent().data("key");
		                self.deleteTarget(targetId);
		           });
		           self.updateList();
		         });

		          //全选
		          $container.find("input.allchk").on("click",function(event){
		             var $chks = $container.find(".listContent input[type=checkbox]");
		             if(this.checked == true){
		               $chks.each(function(){this.checked = true});    
		             }else{
		               $chks.each(function(){this.checked = false});
		             }
		             
		           });

		          //查询
		          $container.find(".hjcxBtn").on("click",function(event){
		              $msg2.text("");
		              var $chks = $container.find(".listContent input:checked"),
		                  chkTargets = [];
		              $chks.each(function(){
		                 var id = $(this).parent().parent().data("key");
		                 var target = self.getTargetById(id);
		                 if(target) chkTargets.push(target);
		              });
		              if(chkTargets.length <=0 ){
		                $msg2.text($.i18n.prop('func_hjcx_target'));
		                return;
		              }
		              //判断时间
		              var startTime = $container.find(".startTime").val();
		              var endTime = $container.find(".endTime").val();                 
		              var checkRes = self.dateUtil.checkStrartEndTime(startTime+":00:00",endTime+":00:00",30);
		              if(!checkRes.result){
		                 $msg2.text(checkRes.msg);
		                 return ;
		              } 
		              startTime = self.dateUtil.getCusUnixTime(startTime+":00:00");
	                  endTime = self.dateUtil.getCusUnixTime(endTime+":00:00");               
		                  
		              var url = self.config.hjcxMoreUrl;
		              var data = {};
		              // var modeArr = [];
		              var shipIdArr = [];
		              for(var i=0;i<chkTargets.length;i++){
		                // modeArr.push(chkTargets[i].mode);
		                shipIdArr.push(chkTargets[i].id);
		              }
		              // data.modeArr = modeArr.join("~");
		              data.shipIdArr = shipIdArr.join("~");
		              data.startTime = startTime;
		              data.endTime = endTime;
		              self.ajax.post(url,data,true,self,function(res){
		              	self.config.hjcxList = [];
		                if(res.state != 1){
		                   console.error(res.msg.error);
		                   $msg2.text($.i18n.prop('func_hjcx_error'));

		                }else{
		                	self._popPanel.close();
		                	// self.ictmap.realtarget.removeRealTargetLayer();
		                	self.ictmap.realtarget.hideRealTargetLayer();
		                	self.ictmap.OperateState.hjcx = true;
		                   	self.removeLayerGroup();
	                        self.addHjLayerGroup(res); 
		                }
		              },function(error){

		              });

		           });

  	  	  },

		    //关闭按钮点击事件
		   _markerCloseClickEvt:function(e){
		   	    L.Class.HJCXBase.prototype._markerCloseClickEvt.call(this,e);
		        this.stop();

		   },  	  	  

	      //添加回放船舶
	      addTarget:function(target){
	          if(this.config.hjcxList.length == 0){
	             this.config.hjcxList.push(target);
	          } else{
	             isadd = true;
	             for(var i=0,len=this.config.hjcxList.length; i<len; i++){
	                if(this.config.hjcxList[i].id == target.id){
	                   isadd = false;
	                   break;
	                }
	             }
	             if(isadd){
	              this.config.hjcxList.push(target);
	             }
	          }

	      },
      
	      //通过id删除指定目标列表中的船舶
	      deleteTarget:function(targetId){
	          var targets = this.config.hjcxList;
	          var index = null;
	          for(var i=0,len=targets.length;i<len;i++){
	             if(targets[i].id == targetId){
	              index = i;
	              break;
	             }
	          }
	          if(index !== null){
	            targets.splice(index,1);
	          }

	      },
	      
	      //通过id获取船舶
	      getTargetById:function(targetId){
	          var targets = this.config.hjcxList,
	              target = null;
	          for(var i=0,len=targets.length;i<len;i++){
	             if(targets[i].id == targetId){
	              target = targets[i];
	              break;
	             }
	          }
	          return target;

	      },
          
          //更新显示列表
  	  	  updateList:function(){
	          var $container = this._popPanel.getContainer().find(".hjcx_more_Container"),
	              $listContent = $container.find(".listContent"),
	              items = this.config.hjcxList;
	          var html = [];  
	          html.push('<div class="mscroll"><table>');
	          for(var i=0,len=items.length;i<len;i++){
	          	 var id = items[i].id;
	             var mmsi = items[i].mmsi;
	             var name = items[i].shipname;
	             html.push('<tr>');
	             html.push('<td class="mmsi" data-key="'+id+'"><label><input type="checkbox" checked>'+'&nbsp&nbsp'+ mmsi +'</label></td><td>'+name+'</td>');
	             html.push('</tr>');
	          }
	          html.push('</table></div>');	                  
	          html = html.join("");
	          $listContent.html(html);
	          //滚动
	          $listContent.find(".mscroll").mCustomScrollbar({ theme: "minimal-dark" });

  	  	  },

  	  	  getContentHTML:function(){
	          var html = [];
	          html.push('<div class="hjcx_more_Container">');
	          html.push('  <div class="cbphDiv">');
	          html.push('    <label class="func_tshf_zdmb_ship">船舶:</label>');
	          html.push('    <input type="text" class="shipIMO func_tshf_zdmb_search_placeholder">');
              // html.push('    <img src="themes/images/frame/title_search_btn.png" class="icon_search">');	          
	          html.push('    <button class="btn addBtn func_tshf_zdmb_addbtn">添加</button>');
	          html.push('  </div>');
	          html.push('  <p class="msg msg1"></p>');
	          html.push('  <p class="cblb_txt func_tshf_zdmb_cblb">船舶列表:</p>');
	          html.push('  <div class="phlbDiv">');
	          // html.push('    <label>船舶批号列表:</label>');
	          html.push('    <input type="checkbox" class="allchk" checked><label class="func_tshf_zdmb_allchk">全选</label>');
	          html.push('    <button class="btn deleteBtn func_tshf_zdmb_delete">删除</button>');
	          html.push('  </div>');
	          html.push('  <div class="shiplist">');
	          html.push('    <div><table><tr><td>MMSI</td><td class="func_tshf_zdmb_shipname">船舶名</td></tr></table></div>');
	          html.push('    <hr>');
	          html.push('    <div class="listContent"></div>');
	          html.push('  </div>');
	          html.push('  <p class="msg msg2"></p>');
	          html.push('  <hr>  ');
	          html.push('  <div class="timeDiv"><label class="common_time_info1">时间:</label> <input type="text" class="Wdate startTime"> &nbsp<label class="common_time_info2">至</label>&nbsp<input type="text" class="Wdate endTime"></div>');
	          html.push('  <div class="btnDiv"><button type="button" class="hjcxBtn func_hjcx_okbtn">查询</button></div>');
	          html.push('</div>');
	          return html.join('');
  	  	  }

  	  })

  });


  //单目标查询
  L.ICT.Func.add("HJCXOneShip",{
       
       Class:L.Class.HJCXBase.extend({

           initialize:function(){
              this.config = Project_ParamConfig.hjcxConfig;           
              this.dateUtil = L.ict.app.util.dateTime;                        
              this._popPanel = null;      
              L.Class.HJCXBase.prototype.initialize.apply(this,arguments);

           },

           start:function(){
              if(this._popPanel){this._popPanel.remove();}
              this._initUi();
              this._initEvts();
              
           },

           stop:function(){
              if(this._popPanel){this._popPanel.remove();}
              this.removeLayerGroup();

           },

           _initUi:function(){
               var options = {
                   title:$.i18n.prop('func_hjcx_title'),
                   width:400,
                   height:160,
                   contentHTML:this.getContentHtml()
               };
               var pop = this._popPanel = new L.ICT.PopPanel(options);
               pop.show();

           },

           getContentHtml:function(){
               var html = [];
               html.push('<div class="hjcx_oneship_container">');
               html.push('<div class="timeDiv">');
               html.push('<label class="common_time_info1">时间：</label>');
               html.push('<input type="text" class="Wdate startTime">');
               html.push('&nbsp<label class="common_time_info2"> 至</label> &nbsp');
               html.push('<input type="text" class="Wdate endTime">');               
               html.push('</div>');
               html.push('<p class="msg"></p>');
               html.push('<div class="btnDiv">');
               html.push('<button type="button" class="confirm common_btn_ok">确定</button>');
               html.push('<button type="button" class="cancel common_btn_cancel">取消</button>');               
               html.push('</div>');
               html.push('</div>');
               return html.join("");
               
           },           

           _initEvts:function(){
               var $container = this._popPanel.getContainer().find(".hjcx_oneship_container"),
                   $msg = $container.find(".msg"),
                   self = this;

               //中英文
              $container.find(".common_time_info1").html($.i18n.prop("common_time_info1"));
              $container.find(".common_time_info2").html($.i18n.prop("common_time_info2"));
              $container.find(".common_btn_ok").html($.i18n.prop("common_btn_ok"));
              $container.find(".common_btn_cancel").html($.i18n.prop("common_btn_cancel")); 

               //窗口关闭
               this._popPanel.on("popPanelRemove",function(){
                   this._popPanel = null;
                   // this.removeLayerGroup();

               },this);

               //日期
               $container.find(".Wdate").on("focus",function(){
                    var config = {
                       readOnly:true,
                       dateFmt:'yyyy-MM-dd HH',
                       isShowClear:false,
                       startDate:'%y-%M-01 00:00:00',
                       alwaysUseStartDate:true,
                       lang: window.localStorage.getItem("language") === 'en' ? 'en' : 'zh-cn',
                       maxDate:'%y-%M-%d %H:%m:%s'
                    };
                    WdatePicker(config);                  
               });
               var startTime = this.dateUtil.getNewDateTimeBeforHour(24);
                   startTime = this.dateUtil.formatDateH(startTime);
               var endTime = this.dateUtil.formatDateH(new Date());
               $container.find(".Wdate.startTime").val(startTime);
               $container.find(".Wdate.endTime").val(endTime);               
               
               //确认
               $container.find(".confirm").on("click",function(){
                    $msg.text("");
                    //判断时间
                    var startTime = $container.find(".startTime").val();
                    var endTime = $container.find(".endTime").val();
                    var chkt = self.dateUtil.checkStrartEndTime(startTime+":00:00",endTime+":00:00",30);
                    if(!chkt.result){
                        $msg.text(chkt.msg);
                        return;
                    }
                    startTime = self.dateUtil.getCusUnixTime(startTime+":00:00");
                    endTime = self.dateUtil.getCusUnixTime(endTime+":00:00");
                    //航迹查询
                    var url = self.config.hjcxMoreUrl;
                    var sid = self.ictmap.realtarget.currentTarget.options.data.id;
                    var data = { 
                       // modeArr:self._curship.mode,                     
                       shipIdArr:sid,
                       startTime:startTime,
                       endTime:endTime
                    };
                    // var url = self.config.hjcxOneUrl;
                    // var data = {                      
                    //    shipId:self.curship.id,
                    //    startTime:startTime,
                    //    endTime:endTime
                    // };
                    self.ajax.post(url,data,true,self,function(res){
                      if(res.state !=1){
                      	console.error(res.msg.error);
                        $msg.text($.i18n.prop('func_hjcx_error'));

                      }else{
                      	 self._popPanel.remove();
                      	 // self.ictmap.realtarget.removeRealTargetLayer();
                      	 self.ictmap.realtarget.hideRealTargetLayer();
                      	 self.removeLayerGroup();
                         self.addHjLayerGroup(res);
                         self.ictmap.OperateState.hjcx = true;
                      }

                    },function(error){

                    });
                                 
               });

               //取消
               $container.find(".cancel").on("click",function(){
                    self.stop();
               });


           }


       })
  
  });

});