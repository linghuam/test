/*
*航迹查询功能
*/
define("func/hjcx",[   
    "leaflet",
    "func/base",
    "data/ajax"

],function(L){

  //航迹查询基类
  L.Class.HJCXBase = L.Class.extend({

	      initialize:function(){
             this.util = L.ict.app.util;
             this.ictmap = L.ict.app.ictmap;
             this.ajax = new L.ICT.Ajax(); 
             this.config = Project_ParamConfig.hjcxConfig;
             this._hjcxLayerGroup = null;
             this._hjcxlayerarr = {};
             this._shipmarker = null;//船舶图标

	      },

	      addHjLayerGroup:function(poslist,ph){
	      	    this._hjcxLayerGroup = L.featureGroup().addTo(this.ictmap.map);
	      	    var curship = this.ictmap.realtarget.currentTarget.options.data;
	            var id = curship.id;	         	
	         	var allLayer=[], latlngs = [],hjline=null,shipmarker=null,closemarker=null;
	            for(var j=0,lenj=poslist.length;j<lenj;j++){
	            	var targetobj = this.convertShipObj(poslist[j]);

	            	var latlng = L.latLng(targetobj.lat,targetobj.lon);
	            	    latlngs.push(latlng);

	            	var pt = this.createHjPoint(targetobj,ph);
	            	allLayer.push(pt);
                    //在第一个点处创建关闭按钮
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
                    //在最后一个点处创建船舶图标
	                if(j === lenj-1){
	                	targetobj.shipname = curship.shipname;
	                	targetobj.shiptype = curship.shiptype;	                	
	                	targetobj.mode = curship.mode;
	                	targetobj.id = curship.id;
	                	// shipmarker = this._shipmarker = this.createShipMarker(targetobj);
	                	var shiplayer = this.ictmap.realtarget.getShipById(curship.id);
	                	if(!shiplayer){
	                	    shipmarker = this._shipmarker = this.ictmap.realtarget.createMarker(targetobj,true);
	                	    allLayer.push(shipmarker);
	                	} else{
	                		shipmarker = this._shipmarker = shiplayer;
	                	}
	                	
	                }                  
	                
	            }
	            //创建航迹线
	            if(latlngs.length >=2){
	               hjline = this.createHjLine(latlngs);
	               allLayer.unshift(hjline);
	            }
	            if(shipmarker){
	               // allLayer.push(shipmarker);
	            }
	            if(closemarker){
	            	allLayer.push(closemarker);
	            }
	            if(allLayer.length > 0){
	                this._hjcxlayerarr[id] = allLayer;     
	                for(var k=0,lenk=allLayer.length;k<lenk;k++){
	                   this._hjcxLayerGroup.addLayer(allLayer[k]);
	                }                 	
	            }
	            //定位
                if(shipmarker){
                    this.ictmap.map.panTo(shipmarker.getLatLng());
                }         
                            
          },

          convertShipObj:function(targetobj){
	          	var obj = {};
	            obj.dir = targetobj.co/10;//航向
	            obj.heading = targetobj.he;
	            obj.lat = parseFloat(targetobj.la/600000);
	            obj.lon = parseFloat(targetobj.lo/600000);
	            obj.speed = targetobj.sp/10;
	            obj.time = targetobj.ti;
	          	return obj;

          },

          removeLayerGroup:function(){
           	  if(this._hjcxLayerGroup){
           	  	 this._hjcxLayerGroup.clearLayers();
           	  	 this._hjcxLayerGroup = null;
           	  }

          },

	  	  createHjPoint:function(targetobj,ph){
	  	  	    //批号
	  	  	    var ph = ph;
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

	            var tiptitle = [];
	            tiptitle.push('<table>');
	            tiptitle.push('<tr><td>批号:</td><td>'+ph+'</td></tr>');
	            tiptitle.push('<tr><td>经度:</td><td>'+lon+'</td></tr>');
	            tiptitle.push('<tr><td>纬度:</td><td>'+lat+'</td></tr>');
	            tiptitle.push('<tr><td>时间:</td><td>'+time+'</td></tr>');
	            tiptitle.push('<tr><td>航向:</td><td>'+hx+'°'+'</td></tr>');
	            tiptitle.push('<tr><td>航速:</td><td>'+sp+' 节</td></tr>');
	            tiptitle.push('</table>');
	            tiptitle = tiptitle.join("");
	            // "批号:"+ph+"</br>经度:" +lon+"</br>纬度:"+lat+"</br>时间:"+time+"</br>航向:"+hx+"°"+"</br>航速:"+sp;
	    		
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
	    			offset: [6, 8], //偏移量，第一个参数是X方向，第二个参数是Y方向，当direction是left或者right时，只有第一个参数起作用，当direction是top或者bottom时，只有第二个参数起作用
	    			direction: "top",//提示信息显示位置，有 left right top bottom auto
	    			permanent: false,
	    			opacity: 0.8,//透明度	
	    			className: "realtarget-label-target" //css文件中定义的样式名称，例如：.realtarget-label-target{background-color:transparent;background:transparent;background:rgba(255,255,255,0.3);background-clip:padding-box;border-color:#000000;border-radius:2px;border-style:solid;border-width:1;color:#000000;display:block;font:12px/1.5 "Helvetica Neue",Arial,Helvetica,sans-serif;font-weight:bold;padding:0;position:absolute;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;pointer-events:none;white-space:nowrap;z-index:-1; box-shadow:0 0 0 rgba(0,0,0,0);}
	    		};
	    		//添加鼠标移上后的提示信息
	    		Lmarker.bindTooltip(tiptitle,tipOptin).openTooltip();			
	    		return Lmarker;

	  	  },

	  	  createShipMarker:function(targetobj){
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
				var sp = targetobj.speed + "节";

				var tiptitle="经度:" +lon+"<br>纬度:"+lat+"<br>时间:"+time+"<br>航向:"+hx+"°"+"<br>航速:"+sp;

				var lmarkerOption={
							icon: L.ICT.ShipIcon.ship7,
							rotationAngle: hx, //方向，正北是0，顺时针，共360，
							data:targetobj	 //为了在点击时能获取到相关的信息		
					};
				var Lmarker = L.marker(lnglat,lmarkerOption);

				var tipOptin={
					offset: [6, 8], //偏移量，第一个参数是X方向，第二个参数是Y方向，当direction是left或者right时，只有第一个参数起作用，当direction是top或者bottom时，只有第二个参数起作用
					direction: "right",//提示信息显示位置，有 left right top bottom auto
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
		       var lat = this.util.tool.latlngTodfmStr(targetobj.lat,'lat');
		       var lng = this.util.tool.latlngTodfmStr(targetobj.lon,'lng');
		       var time = this.util.dateTime.getTimeStrFromUnix(targetobj.time);
		       var html = [];
		       html.push('<div class="displayctr_div" style="padding:5px;">');
		       html.push('<table>');
		       html.push('<tr><td>国别:</td><td>'+targetobj.country+'</td></tr>');
		       html.push('<tr><td>船艏向:</td><td>'+targetobj.heading+'°'+'</td></tr>'); 
		       html.push('<tr><td>经纬度:</td><td>'+lng+' '+lat+'</td></tr>');
		       html.push('<tr><td>航速:</td><td>'+targetobj.speed+'节'+'</td></tr>');
		       html.push('<tr><td>时间:</td><td>'+time+'</td></tr>');	     
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

	  	  //创建航迹线
		  createhjPly:function(oldObj,newObj){
		        var oldlatlng = L.latLng(oldObj.lat, oldObj.lon);
		        var newlatlng = L.latLng(newObj.lat, newObj.lon);
		        var latlngs = [oldlatlng,newlatlng];
		        var pathOptions = {
		          opacity:1,
		          fillOpacity:1
		        };        
		        var path = L.polyline(latlngs,pathOptions);
		        return path;

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
	         //    this.ictmap.realtarget.getRealTarget(); 
		        // this.ictmap.OperateState.hjcx = false;
		        this.config.hjcxList = [];

		  },

		  removeLayerById:function(id){
		  	    //移除图层
		  	    var layers = this._hjcxlayerarr[id];
		        for(var i=0,len=layers.length;i<len;i++){
		          this._hjcxLayerGroup.removeLayer(layers[i]);
		        } 
		        delete this._hjcxlayerarr[id];    

		  },

		  //船舶位置是否发生改变
	      isChange:function(oldObj,newObj){
	    	   return !(oldObj.lon === newObj.lon && oldObj.lat === newObj.lat);
	      }

  });

   //航迹显示
  L.ICT.Func.add("HJCX_HJXS",{

  	  Class:L.Class.HJCXBase.extend({

  	  	  initialize:function(){

				L.Class.HJCXBase.prototype.initialize.apply(this,arguments);

				this.ictmap = L.ict.app.ictmap;

				this.hjxsShipArr = []; //被跟踪的船舶列表

				this.hjxsShipLayerArr = {};//船舶对应的轨迹图层

				// this.hjxsShipFeatureGroup = null;

				this.hjxsLineLayer = null;

				this.hjxsPointLayer = null;

				this.isShow = true;//是否显示当前航迹   

  	  	  },

  	  	  start:function(){
  	  	  	    var curship = this.ictmap.realtarget.currentTarget.options.data;
                if(!this.isShowhj(curship)){
                	curship.ISHJXSPPOINTONE = true;//标记为第一次跟踪
                	this.hjxsShipArr.push(curship); //加入到显示列表
                	this.hjxsShipLayerArr[curship.id] = [];//初始化显示图层数组
                	L.ict.app.util.dialog.success("提示","成功加入航迹显示列表！");
                }
                // if(this.hjxsShipFeatureGroup === null){
                // 	this.hjxsShipFeatureGroup = L.featureGroup().addTo(this.ictmap.map);
                // }
                if(this.hjxsLineLayer === null){
                	this.hjxsLineLayer = L.featureGroup();
                	this.ictmap.map.addLayer(this.hjxsLineLayer);
                }
                if(this.hjxsPointLayer === null){
                	this.hjxsPointLayer = L.featureGroup();
                	this.ictmap.map.addLayer(this.hjxsPointLayer);
                }

  	  	  },

  	  	  stop:function(){
               this.removeLayerGroup();
  	  	  },

		  //是否跟踪目标轨迹
		  isShowhj:function(targetobj){
			    var isShow = false;
			    for(var i=0,len=this.hjxsShipArr.length;i<len;i++){
			    	var obj = this.hjxsShipArr[i];
			    	if(targetobj.id === obj.id){
			    		isShow = true;
			    	}
			    }
			    return isShow;

		  },

		   //跟踪并更新航迹
		   updateHJ:function(data){
		       if(data.state !== 1 || !data.msg.shipList || !data.msg.shipList.length){return;}
		       var shipList = data.msg.shipList;
		       //遍历所有目标
		       for(var i=0,len=shipList.length;i<len;i++){
		       	   var newObj = this.ictmap.realtarget.convertTargetObj(shipList[i]);
		       	   //如果目标已被添加到跟踪列表	
		       	   if(this.isShowhj(newObj)){ 
		               var oldObj = this.getTargetByid(newObj.id);
		               if(this.isChange(oldObj,newObj)){
		               	   this.createPath(oldObj,newObj);
		                   this.updateTarget(newObj);
		               }
		       	   }
		       }

		   },

		   //创建跟踪轨迹路径
	       createPath:function(oldObj,newObj){
			      var oldlatlng = L.latLng(oldObj.lat, oldObj.lon);
			      var newlatlng = L.latLng(newObj.lat, newObj.lon);
			      var id = newObj.id;
			      //线
			      var linelyr = this.createHjLine([oldlatlng,newlatlng]);
			      this.hjxsLineLayer.addLayer(linelyr);
			      this.hjxsShipLayerArr[id].push(linelyr);
			      //起点
			      if(oldObj.ISHJXSPPOINTONE){
			          var oldpt = this.createHjPoint(oldObj,id);
			          this.hjxsPointLayer.addLayer(oldpt);
			          this.hjxsShipLayerArr[id].push(oldpt);   
			          //关闭按钮       
			          var closeMarker = this.createCloseMarker(oldlatlng,newlatlng,id);
			          this.hjxsPointLayer.addLayer(closeMarker);
			          this.hjxsShipLayerArr[id].push(closeMarker);                    
			      }
			      //下一个点
			      var newpt = this.createHjPoint(newObj,id);
			      this.hjxsPointLayer.addLayer(newpt);
			      this.hjxsShipLayerArr[id].push(newpt);                    
	       
	       },	

		   //用新轨迹点替换旧的轨迹点
		   updateTarget:function(newobj){
		        for(var i=0,len=this.hjxsShipArr.length;i<len;i++){
		        	var obj = this.hjxsShipArr[i];
		        	if(newobj.id === obj.id){
		        		this.hjxsShipArr[i] = newobj;
		        		break;
		        	}
		        }
		   },

		   //根据id获取被跟踪的目标
		   getTargetByid:function(id){
		        for(var i=0,len=this.hjxsShipArr.length;i<len;i++){
		        	var obj = this.hjxsShipArr[i];
		        	if(id === obj.id){
		        		return obj;
		        	}
		        }
		         
		   },

		    //关闭按钮点击事件
		   _markerCloseClickEvt:function(e){
		        var target = e.target;
		        var id = target.options.id;
		        var lyrs = this.hjxsShipLayerArr[id];
		        //移除图层
		        for(var i=0;i<lyrs.length;i++){
		          this.ictmap.map.removeLayer(lyrs[i]);
		        }
		        //更新数组
                this.deleteFromShipArr(id);
		        //更新图集数组
		        delete this.hjxsShipLayerArr[id];

		   },	

		   deleteFromShipArr:function(id){
              this.hjxsShipArr = $.map(this.hjxsShipArr,function(obj){
                     if(obj.id === id){
                     	return null;
                     } else {
                     	return obj;
                     }
              });

		   },	   

		   //船舶位置是否发生改变
	       isChange:function(oldObj,newObj){
	    	   return !(oldObj.lon === newObj.lon && oldObj.lat === newObj.lat);
	       },
    
		    //显示轨迹图层
		    showPathLayer:function(){
		       if(this.hjxsLineLayer && this.hjxsPointLayer){
		          this.hjxsLineLayer.eachLayer(function(layer){
		            if(layer.setOpacity) layer.setOpacity(1);
		            if(layer.setStyle) layer.setStyle({opacity:1,fillOpacity:1});
		          },this);
		          this.hjxsPointLayer.eachLayer(function(layer){
		            if(layer.setOpacity) layer.setOpacity(1);
		            if(layer.setStyle) layer.setStyle({opacity:1,fillOpacity:1});
		          },this);		          
		          this.isShow = true;
		       }
		    },
		    
		    //隐藏轨迹图层
		    hidePathLayer:function(){
		       if(this.hjxsLineLayer && this.hjxsPointLayer){
		          this.hjxsLineLayer.eachLayer(function(layer){
		            if(layer.setOpacity) layer.setOpacity(0);
		            if(layer.setStyle) layer.setStyle({opacity:0,fillOpacity:0});
		          },this);
		          this.hjxsPointLayer.eachLayer(function(layer){
		            if(layer.setOpacity) layer.setOpacity(0);
		            if(layer.setStyle) layer.setStyle({opacity:0,fillOpacity:0});
		          },this);		          
		          this.isShow = false;
		       }
		    },
		    
		    //移除轨迹图层
		    removeLayerGroup:function(){
		        if(this.hjxsLineLayer){
		            this.hjxsLineLayer.clearLayers();  
		            this.hjxsLineLayer = null;         
		          }
		        if(this.hjxsPointLayer){
		        	this.hjxsPointLayer.clearLayers();
		        	this.hjxsPointLayer = null;
		        }
		    }	       
         
  	  })

  });


   //航迹控制
  L.ICT.Func.add("HJCX_HJKZ",{
       
       Class:L.Class.HJCXBase.extend({

           initialize:function(){  
              L.Class.HJCXBase.prototype.initialize.apply(this,arguments);                         
              this.hjkzCurtarget = null; //当前进行航迹跟踪的目标
           },

           start:function(limit){
           	   var curship = this.ictmap.realtarget.currentTarget.options.data;
           	   var url = this.config.hjkzUrl;
           	   var data = {};
           	   data.modeType = curship.mode;
           	   data.shipId = curship.id;
           	   data.limit = limit;
           	   this.hjkzCurtarget = curship;//当前跟踪目标
           	   this.ajax.post(url,data,true,this,function(res){
           	   	  	if(res.state !== 1){
	                    this.util.dialog.error("错误提示","没有航迹数据！");
	  		        	console.error(res.msg.error);
	  		        	this.hjkzCurtarget = null;
	  		        }else{
	  		        	var poslist = res.msg.posList;
	                    this.sucessHandler(poslist);
	  		        }
           	   });              
           },

           stop:function(){           

           },

		   //请求成功
		   sucessHandler:function(data){		   	    
		        if(!data.length) {
		        	this.util.dialog.error("错误提示","没有航迹数据！");
		        	this.hjkzCurtarget = null;
		        	return;
		        }
		        var curship = this.ictmap.realtarget.currentTarget.options.data;
		        this.removeLayerGroup();
		        this.addHjLayerGroup(data,curship.id);
		        //当前目标位置变成最后一个点
		        var obj = this.convertShipObj(data.pop());
		        obj.id = curship.id;
		        this.hjkzCurtarget = obj;
		   },

		   //处理websocket返回的当前目标信息
		   hjkzUpdateTarget:function(data){
		       if(this.hjkzCurtarget === null || !this._hjcxLayerGroup) {return;}
		       if(data.state != 1 || !data.msg.shipList || data.msg.shipList.length<=0){return;}
		       var shipList = data.msg.shipList;
		       //遍历所有目标
		       for(var i=0,len=shipList.length;i<len;i++){
		           var newObj = this.ictmap.realtarget.convertTargetObj(shipList[i]);
		           var newid = newObj.id;
		           var oldid = this.hjkzCurtarget.id;
		           if(oldid === newid && this.isChange(this.hjkzCurtarget,newObj)){
		               var hjply = this.createhjPly(this.hjkzCurtarget,newObj);
		               this._hjcxLayerGroup.addLayer(hjply);
		               var hjpt = this.createHjPoint(newObj,newid);
		               this._hjcxLayerGroup.addLayer(hjpt); 
		               var latlng = L.latLng(newObj.lat, newObj.lon);
		               this._shipmarker.setLatLng(latlng);				               
		               this.hjkzCurtarget = newObj;
		               this.hjkzCurtarget.id = newid;
		               break;
		           }
		       }
		   },

		   //关闭按钮点击事件
		  _markerCloseClickEvt:function(e){
                L.Class.HJCXBase.prototype._markerCloseClickEvt.call(this,e);        
		        this.hjkzCurtarget = null		       
		  }
       })
  
  });

});