/*实时目标*/
define("func/realTarget",[
  "leaflet",
  "core/namespace",
  "leaflet/shipDistLayer",
  "leaflet/rotateMarker",
  "plugins/contextmenu",
  "data/ajax",
  "func/base",
  "func/hjcx",
  "func/tshf",
  "func/cdgladdship"

],function(L,transform){

   L.ICT.RealTarget = L.Class.extend({

        initialize:function(ictmap){
           this.ajax = new L.ICT.Ajax();
           this.config = Project_ParamConfig.RealTargetConfig;          
           this.ictmap = ictmap;
           this.realtargetFeatureGroup = L.featureGroup([]);
           this.currentTarget = null;//当前点击对象
           this._greendisLayer = null;//绿点图层
           this._shipSelectMarker = null;//船舶图标选中状态
           this._curDistType = '1';//默认叠加绿点图
           this.lang = window.localStorage.getItem("language") || 'zh';

           this.ictmap.map.addLayer(this.realtargetFeatureGroup);
           this.shipTypeList = Project_ParamConfig.FilterDisplayConfig.shipTypeList; //st
           this.shipFlagList = Project_ParamConfig.FilterDisplayConfig.shipFlagList;
           this.shipStateList = Project_ParamConfig.FilterDisplayConfig.shipStateList; //sta
           this.shipSourceList = Project_ParamConfig.FilterDisplayConfig.shipSourceList; //sid 

           //获取实时目标
           if(this.config.isZoomEndRequest){
               this.getRealTarget();     
           }                             
        },

        /******************对外接口部分 -start**********************/
        
        //地图切换，设置坐标偏移
        chartToGoogle:function(){
            this.realtargetFeatureGroup.eachLayer(function(layer){
                var latlng = layer.getLatLng();
                var offsetLat = Project_ParamConfig.MapOptions.offset.offsetLat;
                var offsetLng = Project_ParamConfig.MapOptions.offset.offsetLng;
                var newlatlng = L.latLng(latlng.lat+offsetLat,latlng.lng+offsetLng);
                layer.setLatLng(newlatlng);
            },this);
        },

        googleToChart:function(){
            this.realtargetFeatureGroup.eachLayer(function(layer){
                var latlng = layer.getLatLng();
                var offsetLat = Project_ParamConfig.MapOptions.offset.offsetLat;
                var offsetLng = Project_ParamConfig.MapOptions.offset.offsetLng;
                var newlatlng = L.latLng(latlng.lat-offsetLat,latlng.lng-offsetLng);
                layer.setLatLng(newlatlng);
            },this);            
        },

        reloadTargets:function(){          
            if(this.ictmap.map.hasLayer(this.realtargetFeatureGroup)){
              this.realtargetFeatureGroup.clearLayers();                    
            }
            this.getRealTarget();
            if(this.ictmap.map.hasLayer(this._shipSelectMarker) && this.currentTarget){
              this._shipSelectMarker.setLatLng(this.currentTarget.getLatLng());
            }
        },

        //过滤显示 更新图层
        updateFilterLayer:function(){          
            this.realtargetFeatureGroup.eachLayer(function(layer){
                var ishide = true;
                var dataobj = layer.options.data;
                if(this.checkFilter(dataobj)){
                   ishide = false;
                }
                if(ishide){
                   layer.setOpacity(0);
                   this.removeTargetEvt(layer);
                } else{
                   layer.setOpacity(1);
                   this.addTargetEvt(layer);
                }               
            },this);      
        },   

        //过滤显示 将过滤字段名转化成key
        convertNameToKey:function(name,type){
            name = name.toString();
            var res = null;
            if(type === 'shiptype'){
                // switch(name){
                //     case "1": res=$.i18n.prop('func_filter_shiptype_1');break;
                //     case "2": res=$.i18n.prop('func_filter_shiptype_2');break;
                //     case "3": res=$.i18n.prop('func_filter_shiptype_3');break;
                //     case "4": res=$.i18n.prop('func_filter_shiptype_4');break;
                //     case "5": res=$.i18n.prop('func_filter_shiptype_5');break;
                //     case "6": res=$.i18n.prop('func_filter_shiptype_6');break;
                //     case "7": res=$.i18n.prop('func_filter_shiptype_7');break;
                //     case "8": res=$.i18n.prop('func_filter_shiptype_8');break;  
                //     case "100": res=$.i18n.prop('func_filter_shiptype_100');break;                   
                // }

            }else if(type === 'shipflag'){
                switch(name){
                    case "中国": res = "1";break;
                    case "英国": res = "2";break;
                    case "法国": res = "3";break;
                    case "美国": res = "4";break;
                    case "俄罗斯": res = "5";break; 
                    default: res = "100";
                }                    

            }else if(type === 'shipstate'){
                // switch(name){
                //     case "0": res=$.i18n.prop('func_filter_shipsta_0');break;
                //     case "1": res=$.i18n.prop('func_filter_shipsta_1');break;
                //     case "2": res=$.i18n.prop('func_filter_shipsta_2');break;
                //     case "3": res=$.i18n.prop('func_filter_shipsta_3');break;
                //     case "4": res=$.i18n.prop('func_filter_shipsta_4');break;
                //     case "5": res=$.i18n.prop('func_filter_shipsta_5');break;
                //     case "6": res=$.i18n.prop('func_filter_shipsta_6');break;
                //     case "7": res=$.i18n.prop('func_filter_shipsta_7');break;
                //     case "8": res=$.i18n.prop('func_filter_shipsta_8');break;                   
                // }                    

            }else if(type === 'shipsrc'){
                // switch(name){
                //     case "1": res=$.i18n.prop('func_filter_shipsrc_1');break;
                //     case "2": res=$.i18n.prop('func_filter_shipsrc_2');break;                  
                // }                    

            }
            return res;                
        },

        //根据船舶类型获取船舶图标
        getTargetIcon:function(type){
            var type = type.toString(),
               icon = null;
            switch (type){
             case "1": icon=L.ICT.ShipIcon.ship1 ;break;
             case "2": icon=L.ICT.ShipIcon.ship2 ;break;
             case "3": icon=L.ICT.ShipIcon.ship3 ;break;
             case "4": icon=L.ICT.ShipIcon.ship4 ;break;
             case "5": icon=L.ICT.ShipIcon.ship5 ;break;
             case "6": icon=L.ICT.ShipIcon.ship6 ;break;             
             case "7": icon=L.ICT.ShipIcon.ship7 ;break;
             case "8": icon=L.ICT.ShipIcon.ship8 ;break;
             default: icon=L.ICT.ShipIcon.ship100;
            }
            return icon;
        },        
        
        //搜索定位 对外接口
        locateShip:function(data){
            //中英文
            var remind_error = $.i18n.prop('dialog_alert_title');
            var info_error = $.i18n.prop('func_realtarget_infoerror');

            this.clearLocatLyr();
            var layer = this.getShipById(data.shipid);
            if(layer){            
                this.locateLayer(layer);
            } else{
                var url = this.config.shipInfoUrl;              
                this.ajax.post(url,data,true,this,function(res){
                   if(res.state !== 1){ 
                      L.ict.app.util.dialog.error(remind_error,info_error);                          
                   }else{
                      var targetobj = this.convertshipInfoObj(res.msg);
                      var targetobjdata = this.convertTargetObj(res.msg);                              
                      this._locateShiplyr = this.createMarker(targetobjdata,true);                   
                      this.ictmap.map.addLayer(this._locateShiplyr);
                      // this._locateShiplyr.fire("click");
                      // this.ictmap.map.panTo(this._locateShiplyr.getLatLng());  
                      this.locateLayer(this._locateShiplyr);                   
                   }
                },function(error){
                    // L.ict.app.util.dialog.error(remind_error,info_error);
                });             
            }
        },   

        locateLayer:function(layer){
            if(this.isRealTargetShow()){              
                this.ictmap.map.panTo(layer.getLatLng());              
                layer.fire("click");
            } else{
                this.ictmap.map.setView(layer.getLatLng(),this.config.showLevel);                 
                layer.setOpacity(1);
                // this.addTargetEvt(layer);                              
                layer.fire("click");
            }  
        },

        //清除定位图层  
        clearLocatLyr:function(){
            if(this._locateShiplyr) {                            
               if(this._locateShiplyr.options.hasSelectState){
                  this.removeShipInfoPopPanel();
               }  
               this.ictmap.map.removeLayer(this._locateShiplyr);
               this._locateShiplyr = null;            
            }         
        },

        //显示定位图层
        showLocateLayer:function(){
            if(this._locateShiplyr){
                this._locateShiplyr.setOpacity(1);
            }
        },

        //隐藏定位图层
        hideLocateLayer:function(){
            if(this._locateShiplyr){
                this._locateShiplyr.setOpacity(0);
            }
        },         

        //通过id在当前图层中寻找目标 
        getShipById:function(id){           
            var target = null;
            var layers = this.realtargetFeatureGroup.getLayers();
            for(var i=0,len=layers.length;i<len;i++){
                var layer = layers[i];
                var dataobj = layer.options.data;
                if(id === dataobj.id){
                    target = layer;
                    break;
                }
            }            
            return target;
        },        

        //实时目标图层是否显示
        isRealTargetShow:function(){
            var isshow = false;
            if(this.realtargetFeatureGroup && this.ictmap.map.hasLayer(this.realtargetFeatureGroup)
               && this.ictmap.map.getZoom() >= this.config.showLevel){
                isshow = true;
            }            
            return isshow;
        },       

        changeShipDistLayer:function(type){
            this._curDistType = type;
            if(type === '1'){ //绿点图
                this.hideRasterLayer();
                if(this.ictmap.map.getZoom() < this.config.showLevel){
                   this.showGreenDistLayer();
                }                
            } else {
                this.hideGreenDistLayer();
                if(this.ictmap.map.getZoom() < this.config.showLevel){
                   this.showRasterLayer();
                }                   
            }
        },

        showShipDistLayer:function(){
            if(this._curDistType === '1'){
                this.showGreenDistLayer();
            } else {
               this.showRasterLayer();
            }
        },

        hideShipDistLayer:function(){
            if(this._curDistType === '1'){
                this.hideGreenDistLayer();
            } else{
                this.hideRasterLayer();
            }
        },

        //添加绿点图
        addGreenDistLayer:function(){     
            this.removeGreenDistLayer();     
            this._greendisLayer = new L.TileLayer.ShipDistLayer(this.config.shipDistLayerUrl);
            this.ictmap.map.addLayer(this._greendisLayer);
        },
        
        //移除绿点图
        removeGreenDistLayer:function(){
           if(this._greendisLayer){
              this.ictmap.map.removeLayer(this._greendisLayer);
              this._greendisLayer = null;
           }          
        },

        //显示或加载绿点图 
        showGreenDistLayer:function(){
            if(this._greendisLayer){
               this._greendisLayer.setOpacity(1);
            }else {
               this.addGreenDistLayer();
            }
        },
        
        //隐藏绿点图
        hideGreenDistLayer:function(){
           if(this._greendisLayer){
              this._greendisLayer.setOpacity(0);
           }
        },          
        
        // //添加栅格图
        // addRasterLayer:function(){
        //     this.removeRasterLayer();
        //     // var url = this.config.rasterUrl;
        //     var url = './documents/data.json';
        //     this.ajax.get(url,null,true,this,function(res){
        //          if(res.state !== 1){
        //               console.error(res.msg.error);
        //          }else{
        //               this._rasterLayer = L.gridLayer.rasterLayer({
        //                   data:res.msg.data,
        //                   opacity:0.5,//定义栅格图层的透明度
        //                   tileSize:16,//定义栅格的大小，单位为：像素
        //                   minZoom:0,//定义显示的最小级别
        //                   maxZoom:18,//定义显示的最大级别
        //                   bounds:L.latLngBounds(L.latLng(-90,-180),L.latLng(90,180)) //定义显示栅格的区域
        //               });
        //               this.ictmap.map.addLayer(this._rasterLayer); 
        //               if(this._curDistType !== '2' || this.ictmap.map.getZoom() >= this.config.showLevel){
        //                   this.hideRasterLayer();
        //               }
        //          }
        //     },function(e){
        //         console.error(e);
        //     });               
        // },

        //添加栅格图
        addRasterLayer:function(){
            this.removeRasterLayer();
            var url = this.config.rasterUrl;
            // var url = './documents/data.json';
            this.ajax.get(url,null,true,this,function(res){
                 if(res.state !== 1){
                      console.error(res.msg.error);
                 }else{
                      this._rasterLayer = L.featureGroup([]);
                      this.ictmap.map.addLayer(this._rasterLayer); 
                      this._rasterLayer.bringToFront();
                      this.makeGrid(res.msg.data);
                      if(this._curDistType !== '2' || this.ictmap.map.getZoom() >= this.config.showLevel){
                          this.hideRasterLayer();
                      }
                 }
            },function(e){
                console.error(e);
            });               
        },

        makeGrid:function(data){
            for(var i=0,len=data.length;i<len;i++){
                var obj = data[i];
                var newlat = obj.lat;
                var newlon = obj.lon;
                if(newlat > 90-1){
                    newlat = 90-1;
                }
                if(newlon > 180-1){
                    newlon = 180-1;
                }
                var sw = L.latLng(newlat,newlon);
                var ne = L.latLng(newlat+1,newlon+1);
                var bounds = L.latLngBounds(sw,ne);
                var rect = L.rectangle(bounds,{
                  stroke:false,
                  text:obj.v,
                  fillColor:this.getBgColor(obj.v),
                  fillOpacity:0.6              
                });
                this._rasterLayer.addLayer(rect);
            }
        },       

        //根据值获取背景颜色
        getBgColor:function(value){
          if(value<=10){
            return "#91E201";
          }else if(value>10 && value<=50){
                return "#009E01";
          }else if(value>50 && value<=100){
            return "#FFFF01";
          }else if(value>100 && value<=500){
            return "#FCCF00";
          }else if(value>500 && value<=1000){
            return "#FD910B";
          }else if(value>1000 && value<=5000){
            return "#FA5E11";
          }else if(value>5000){
            return "#F11415";
          }
        },         

        //移除栅格图
        removeRasterLayer:function(){
            if(this._rasterLayer){
              this.ictmap.map.removeLayer(this._rasterLayer);
              this._rasterLayer = null;              
            }
        },

        //显示或加载栅格图
        showRasterLayer:function(){
            if(this._rasterLayer){
                this._rasterLayer.eachLayer(function(layer){
                    layer.setStyle({fillOpacity:0.6});
                },this);
                // this._rasterLayer.setOpacity(0.5);
            } else{
                this.addRasterLayer();
            }
        },

        //隐藏栅格图
        hideRasterLayer:function(){
            if(this._rasterLayer){
                this._rasterLayer.eachLayer(function(layer){
                    layer.setStyle({fillOpacity:0});
                },this);              
                // this._rasterLayer.setOpacity(0);
            }
        },

        //显示实时目标
        showRealTargetLayer:function(){
            this.realtargetFeatureGroup.eachLayer(function(layer){
               if(this.checkFilter(layer.options.data)){ //只显示符合过滤条件的目标
                   layer.setOpacity(1);
                   // this.addTargetEvt(layer);
               }               
            },this);
            this.showLocateLayer();//显示定位图层
            this.showShipInfoPopPanel();
        },
        
        //隐藏实时目标
        hideRealTargetLayer:function(){
            this.realtargetFeatureGroup.eachLayer(function(layer){
               layer.setOpacity(0);
               // this.removeTargetEvt(layer);              
            },this);
            this.hideLocateLayer();//隐藏定位图层
            this.hideShipInfoPopPanel();
        },

        //移除实时目标图层
        removeRealTargetLayer:function(){
          if(this.ictmap.map.hasLayer(this.realtargetFeatureGroup)){
             this.realtargetFeatureGroup.clearLayers();                    
          }
          this.removeShipInfoPopPanel();
        },        

        //地图加载实时目标
        addRealTargetLayer:function(){
            if(this.ictmap.getCurZoom() < this.config.showLevel){            
               this.showShipDistLayer();
               // this.removeRealTargetLayer();   
               this.hideRealTargetLayer();         
            }else{
               this.hideShipDistLayer();
               // this.getRealTarget();
               this.showRealTargetLayer();          
            }
        },   

        /******************对外接口部分 -end**********************/

        //获取当前范围内(包括缓冲区域)的实时目标
        getRealTarget:function(){
            var url = this.config.shipRealUrl;
            var data = {};
            data.limit = this.config.limit;
            data.timeout = this.config.timeout;  
            data = L.extend(data,this.getCurRectExtend());
            this.ajax.post(url,data,true,this,this._getRectTargetSuccessCallback,this._getRectTargetFailCallback);            
            this.stopInterval();
            this._interval = window.setInterval(function(){
                this.ajax.post(url,data,true,this,this._getRectTargetSuccessCallback,this._getRectTargetFailCallback); 
            }.bind(this), this.config.updatetime*1000);                
        },

        //请求成功回调
        _getRectTargetSuccessCallback:function(data){
            if(data.state !==1 || !data.msg.shipList || !data.msg.shipList.length){
                // L.ict.app.util.dialog.error($.i18n.prop('dialog_alert_title'),$.i18n.prop('func_realtarget_geterror')); 
                return;           
            }           
            this.updateLayer(data);
        },
        
        //请求失败回调
        _getRectTargetFailCallback:function(error){
            // L.ict.app.util.dialog.error($.i18n.prop('dialog_alert_title'),$.i18n.prop('func_realtarget_geterror'));            
        },

        stopInterval:function(){
            if(this._interval){
                window.clearInterval(this._interval);
                this._interval = null;
            }            
        },                
        
        updateLayer:function(data){            
            var newlist = this.convertShipList(data);
            this.updateAllTarget(newlist);
            this.removeInvalidTarget(newlist);
        },

        convertShipList:function(data){
            var shiplist = data.msg.shipList;
            var newlist = [];
            for(var i=0,len=shiplist.length;i<len;i++){
                var targetobj = this.convertTargetObj(shiplist[i]);
                newlist.push(targetobj);
            }
            return newlist;
        }, 

        convertTargetObj:function(oneinfo){
            var onetarget = {};
            onetarget.id =  oneinfo.mi; 
            onetarget.time = oneinfo.re; //最后更新时间
            onetarget.lon = parseFloat(oneinfo.lo/600000);//经度
            onetarget.lat = parseFloat(oneinfo.la/600000);//纬度
            onetarget.dir = (oneinfo.di/10).toFixed(1);//船航向 int
            onetarget.heading = oneinfo.he;//船首向 int
            onetarget.speed = (oneinfo.sp/10).toFixed(1);//船速 int
            onetarget.status = oneinfo.st;//船状态 int          
            onetarget.infosrc= oneinfo.os; //信息来源 int 0;1,2,3
            onetarget.mmsi = oneinfo.mi; //mmsi int 
            onetarget.shipname = oneinfo.sn.replace(/@/g,'');//船名
            onetarget.callsign = oneinfo.cs.replace(/@/g,'');//呼号 
            onetarget.imo = oneinfo.imn;//IMO编号
            onetarget.country = this.getDetialConvertName(oneinfo.cn,'country'); //国别country 中文
            onetarget.shiptype = oneinfo.ast; //this.getDetialConvertName(oneinfo.ast,'ship_type');//船舶类型 int   
            return onetarget;
        },                  
        
        updateAllTarget:function(newlist){
            for(var i=0,len=newlist.length;i<len;i++){
                var obj = newlist[i];
                this.updateOneTarget(obj);
            }
        },

        updateOneTarget:function(obj){
            var iscontain = false;
            var layers = this.realtargetFeatureGroup.getLayers();
            for(var i=0,len=layers.length;i<len;i++){
                var layer = layers[i];
                var data = layer.options.data;
                //如果当前图层有新目标，更新
                if(data.id === obj.id){
                    iscontain = true;
                    if(this.isChange(data,obj)){ //如果目标状态发生改变
                        var latlng = L.latLng(obj.lat,obj.lon);
                        layer.setLatLng(latlng);
                        layer.setRotationAngle(obj.dir);
                        layer.options.data = obj;
                    }
                    break;
                }
            }

            //如果当前图层没有新目标，添加（可以加上个数限制）
            if(!iscontain && layers.length < this.config.limit){
                var marker = this.createMarker(obj,true);
                if(!this.isShowNewTarget(obj)){ //如果不符合过滤条件或达不到显示级别
                    marker.setOpacity(0);                    
                }                            
                this.realtargetFeatureGroup.addLayer(marker);
            }          
        },

        //判断是否显示新增目标
        isShowNewTarget:function(obj){             
            return !this.ictmap.OperateState.tshf 
                  && !this.ictmap.OperateState.hjcx 
                  && !this.ictmap.OperateState.heatmap 
                  && this.checkFilter(obj) 
                  && this.isRealTargetShow();
        },        

        //判断当前目标位置是否改变
        isChange:function(oldtarget,newtarget){
            var ischange = false;
            if(newtarget.lat !== oldtarget.lat || newtarget.lon !== oldtarget.lon){
                ischange = true;
            }
            return ischange;
        }, 

        //创建实时目标图标 --isAddEvent 是否添加单击和右击事件 默认不添加
        createMarker:function(targetobj,isAddEvent){
           var isAddEvent = isAddEvent ? isAddEvent : false;
           var latlng = L.latLng(targetobj.lat,targetobj.lon),
               tipText = targetobj.shipname,
               targetIcon = this.getTargetIcon(targetobj.shiptype);
           var markOptions = {
              icon:targetIcon,
              opacity:1,
              rotationAngle:targetobj.dir,//方向，正北是0，顺时针，共360，
              rotationOrigin:'center center',//船舶旋转的参考点
              title:tipText, //添加鼠标移上后的提示信息
              data:targetobj
           };
           //test -start
            // L.circleMarker(latlng,{
            //   radius:6,
            //   stroke:false,
            //   fill:true,
            //   fillColor:'#f00',
            //   fillOpacity:1
            // }).addTo(this.ictmap.map);
           // var p = transform(targetobj.lon,targetobj.lat);
           // var latlng = L.latLng(p.lat,p.lng);
           //test -end
           markOptions.icon.options.className = "leaflet-marker-rightclick-icon";
           var Lmarker = L.marker(latlng,markOptions);
           if(isAddEvent){ 
              this.addTargetEvt(Lmarker);                     
           }
           return Lmarker;
        },   

        //过滤目标
        checkFilter:function(targetobj){

            return true; //test

           var shipTypeRes = false,
               shipFlagRes = false,
               shipStateRes = false,
               shipSourceRes = false;

           //船舶类型
           var target_key = targetobj.shiptype.toString();
           if(this.shipTypeList.indexOf(target_key)!== -1){
             shipTypeRes = true;
           }

           //船旗
           var target_key = this.convertNameToKey(targetobj.country,"shipflag");
           if(this.shipFlagList.indexOf(target_key)!== -1){
             shipFlagRes = true;
           }                
            
           //航行状态
           var target_key = targetobj.status.toString();
           if(this.shipStateList.indexOf(target_key)!== -1){
             shipStateRes = true;
           }    
           //来源
           var target_key = targetobj.infosrc.toString();
           if(this.shipSourceList.indexOf(target_key)!== -1){
             shipSourceRes = true;
           }
          
           return shipTypeRes && shipFlagRes && shipStateRes && shipSourceRes;         
        },                              

        //去除当前图层中无效的目标
        removeInvalidTarget:function(newlist){
            var layers = this.realtargetFeatureGroup.getLayers();
            for(var i=0,len=layers.length;i<len;i++){
                var layer = layers[i];
                var dataobj = layer.options.data;
                if(!this.isContain(dataobj,newlist)){
                    this.realtargetFeatureGroup.removeLayer(layer);
                }
            }
        },

        //数组是否包含某个目标
        isContain:function(obj,arr){
            var iscontain = false;
            for(var i=0,len=arr.length;i<len;i++){
                if(arr[i].id === obj.id){
                    iscontain = true;
                    break;
                }
            }
            return iscontain;
        },
        
        //添加事件
        addTargetEvt:function(target){
            //右键点击事件
            target.on("contextmenu", this._markerRightClickEvt,this);
            //如果右键菜单不存在，则初始化它，只用初始化一次
            // target.once("contextmenu",function(e){
            //   this.initContextMenu();
            //   this._markerRightClickEvt(e);
            // },this);                
                    
            //单击事件
            target.on("click", this._markerClickEvt,this);           
        },
        
        //移除事件
        removeTargetEvt:function(target){
            //右键点击事件
            target.off("contextmenu", this._markerRightClickEvt,this);                        
            //单击事件
            target.off("click", this._markerClickEvt,this);  
        },           

        //鼠标右键点击事件
        _markerRightClickEvt:function(e){
            L.DomEvent.stopPropagation(e);
            var mapcontainer = this.ictmap.map.getContainer();
            var x = e.containerPoint.x + mapcontainer.offsetLeft;
            var y = e.containerPoint.y + mapcontainer.offsetTop;
            this.currentTarget = e.target;
            //调出右键菜单
            $('.leaflet-marker-rightclick-icon').contextMenu({x:x,y:y});

        },

        //初始化右键菜单
        initContextMenu:function(){
            var self = this;
            var tshf = $.i18n.prop('contextmenu_tshf');
            var addhf =  $.i18n.prop('contextmenu_addhf');
            var hjcx = $.i18n.prop('contextmenu_hjcx');
            var addcx = $.i18n.prop('contextmenu_addhj');
            $.contextMenu({ 
                selector:'.leaflet-marker-rightclick-icon', //选择右键菜单触发的元素
                trigger: 'none',
                callback: function(key, options) {
                   self._rightClickCallback(key, options);
                },
                items: {
                    "tshf": {"name": tshf, "icon": self.getContextMenuIcon('tshf')},
                    "addhf": {"name": addhf, "icon": self.getContextMenuIcon('add')},
                    "hjcx":{"name":hjcx,"icon":self.getContextMenuIcon('hjcx')},
                    "addcx":{"name":addcx,"icon":self.getContextMenuIcon('add')}
                }
            });
            //鼠标悬浮事件
            $(".ict_contextmenu_item_li").hover(function(){
                $(this).addClass('hover');
            },function(){
                $(this).removeClass('hover');
            });
        },  

        getContextMenuIcon:function(type){

            return function(opt, $itemElement, itemKey, item){
              // Set the content to the menu trigger selector and add an bootstrap icon to the item.
              var iconname = 'icon-contextmenu-' + type;
              var itemhtml = [];
              itemhtml.push('<span class="'+ iconname +'"></span>');
              // itemhtml.push('&nbsp;&nbsp;');
              itemhtml.push('<span class="nametxt">'+ item.name +'</span>');
              itemhtml = itemhtml.join('');
              $itemElement.html(itemhtml);

              // Add the context-menu-icon-updated class to the item
              return 'ict_contextmenu_item_li';
            }

        },
        
        //右键回调
        _rightClickCallback:function(key,options){
            //验证登录
            if(!L.ICT.Func["UserLogin"].getInstance().isLogin()){
                L.ICT.Func["UserLogin"].getInstance().alertLoginDialog();                
                return;
            }          
           var curobj = this.currentTarget.options.data;
           if(key === "tshf"){
              L.ICT.Func["TSHFOneShip"].run();

           }else if(key === "addhf"){             
              var tshfinstance = L.ICT.Func["TSHF"].getInstance();
              tshfinstance.addTarget(curobj);
              if(tshfinstance._targetPanel){
                tshfinstance.updateList();
              }else{
                 L.ict.app.util.dialog.success($.i18n.prop('dialog_alert_title'),$.i18n.prop('func_realtarget_right_add'));
              }
              

           }else if(key === "hjcx"){
             L.ICT.Func["HJCXOneShip"].run();

           }else if(key === "addcx"){
             var hjcxinstance = L.ICT.Func["HJCXMoreShip"].getInstance();
             hjcxinstance.addTarget(curobj);
             if(hjcxinstance._popPanel){
                hjcxinstance.updateList();
             } else{
                L.ict.app.util.dialog.success($.i18n.prop('dialog_alert_title'),$.i18n.prop('func_realtarget_right_add'));
             }                         
           }
        },        
        
        //鼠标单击事件
        _markerClickEvt:function(event){
            var curship = event.target,
                url = this.config.shipInfoUrl,
                id = event.target.options.data.id,
                data = {};
            data.shipid = id;
            this.currentTarget = event.target;
            this.removeSelectMarker();
            this.createSelectMarker(event);                        
            this.ajax.post(url,data,true,this,function(res){
               if(res.state !== 1){              
                  L.ict.app.util.dialog.error($.i18n.prop('dialog_alert_title'),$.i18n.prop('func_realtarget_geterror'));
                  this.removeShipInfoPopPanel();                 
               }else{
                  var targetobj = this.convertshipInfoObj(res.msg);
                  this.createShipInfoPopPanel(targetobj);
                  this._initPopEvt();                  
               }
            },function(error){
                this.removeShipInfoPopPanel();                     
            });
        },  

        //创建选中状态样式
        createSelectMarker:function(event){
            var latlng = event.target.getLatLng();
            var divIcon = L.divIcon({
                iconSize:[24,24],
                iconAnchor:[12,12],
                className:'ict_markerselect_divicon'
             });
            this._shipSelectMarker =  L.marker(latlng,{icon:divIcon});
            this._shipSelectMarker.on("contextmenu",function(contextmenuEvt){
                var data = {};
                data.containerPoint = contextmenuEvt.containerPoint;
                data.layerPoint = contextmenuEvt.layerPoint; 
                data.latlng = event.target.getLatLng(); 
                event.target.fire("contextmenu",data);              
            },this);  
            this._shipSelectMarker.on("click",function(clickEvt){  
                var data = {};
                data.containerPoint = clickEvt.containerPoint;
                data.layerPoint = clickEvt.layerPoint; 
                data.latlng = event.target.getLatLng(); 
                event.target.fire("click",data);
            },this);       
            this._shipSelectMarker.addTo(this.ictmap.map);
            $(".ict_markerselect_divicon").css('border','dotted 2px #f00');
            //监听图标移动事件
            event.target.options.hasSelectState = true;
            event.target.on("move",function(e){
               if(this._shipSelectMarker && event.target.options.hasSelectState){
                   this._shipSelectMarker.setLatLng(e.target.getLatLng());
               }
            },this);
        },    

        removeSelectMarker:function(){
            if(this._shipSelectMarker){
                this._shipSelectMarker.remove();
                this._shipSelectMarker = null;
                this.clearSelectState();
            }
        },

        showSelectMarker:function(){
            if(this._shipSelectMarker){
                this._shipSelectMarker.setOpacity(1);                
            }
        },

        hideSelectMarker:function(){
            if(this._shipSelectMarker){
                this._shipSelectMarker.setOpacity(0);
            }
        },

        clearSelectState:function(){
            var layers = this.realtargetFeatureGroup.getLayers();
            for(var i=0,len=layers.length;i<len;i++){
                var layer = layers[i]; 
                if(layer.options.hasSelectState){
                    layer.options.hasSelectState = false;
                }             
            }
        },        

        //船舶信息弹框
        createShipInfoPopPanel:function(targetobj){
            if( this._shipinfoPopPanel){ 
              this.showShipInfoPopPanel();
              this._shipinfoPopPanel.setContent(this.getPopupContent(targetobj));
              return;
            }
            //中英文            
            var titlang = $.i18n.prop('func_realtarget_info_title');

            var options = {
                title:titlang,
                width:460,
                height:330,
                right:40,
                top:100,
                disableSelect:false,
                className:'ict_realTarget_popupContainer',
                contentHTML:this.getPopupContent(targetobj)
            };      
            this._shipinfoPopPanel = new L.ICT.PopPanel(options);          
            this._shipinfoPopPanel.on("popPanelRemove",function(){
               this._shipinfoPopPanel = null;
               this.removeSelectMarker();
            },this);
            this._shipinfoPopPanel.show();
        }, 

        removeShipInfoPopPanel:function(){
            if(this._shipinfoPopPanel){
                this._shipinfoPopPanel.remove();
                this._shipinfoPopPanel = null;
            }
        },  

        showShipInfoPopPanel:function(){
            if(this._shipinfoPopPanel){
                this._shipinfoPopPanel.show();
                this.showSelectMarker();
            }
        }, 

        hideShipInfoPopPanel:function(){
            if(this._shipinfoPopPanel){
                this._shipinfoPopPanel.close();
                this.hideSelectMarker();
            }
        },                       

        //船舶详细信息转化
        convertshipInfoObj:function(oneinfo){
            //中英文
            var wz = $.i18n.prop('common_default_val');         
            var mile =  $.i18n.prop('common_unit_mile'); 
            var gbqt = $.i18n.prop('func_filter_shipflag_100'); 

            var onetarget = {};
            onetarget.id =  oneinfo.ti; 
            onetarget.time = oneinfo.re;
            onetarget.lon = parseFloat(oneinfo.lo/600000);//经度
            onetarget.lat = parseFloat(oneinfo.la/600000);//纬度
            onetarget.dir = (oneinfo.di/10).toFixed(1);//船航向 int
            onetarget.heading = oneinfo.he;//船首向 int
            onetarget.speed = oneinfo.sp/10;//船速 int
            onetarget.status = this.getDetialConvertName(oneinfo.st,"status");//船状态 int
            onetarget.infosrc=oneinfo.os; //信息来源 int 0;1,2,3
            onetarget.mmsi=oneinfo.mi; //mmsi int 
            onetarget.shipname = oneinfo.sn.replace(/@/g,'') || wz;//船名
            onetarget.callsign = oneinfo.cs.replace(/@/g,'') || wz;//呼号 
            onetarget.imo = oneinfo.imn;//IMO编号
            var co = this.lang === 'en' ? oneinfo.cne.replace(/@/g,'') : oneinfo.cn.replace(/@/g,'');
            onetarget.country = co || gbqt; //国别country 中文
            onetarget.shiptype = this.getDetialConvertName(oneinfo.ast,'ship_type');//船舶类型 int              
            onetarget.shiplength = oneinfo.sl + ' '+mile; //int 米
            onetarget.shipwidth  = oneinfo.sb + ' '+mile;
            onetarget.rotsensor  = oneinfo.ro; //转向率
            onetarget.destination = oneinfo.de.replace(/@/g,'') || wz;//目的地
            onetarget.reachtime = oneinfo.et;//预计到达时间        
            return onetarget;
        },
        
        //获取船舶详细信息页面
        getPopupContent:function(targetobj){
            //中英文
            var cm = $.i18n.prop('common_ship_shipname');
            var gb = $.i18n.prop('common_ship_country');
            var hh = $.i18n.prop('common_ship_callsign');
            var cc = $.i18n.prop('common_ship_len');
            var cblx = $.i18n.prop('common_ship_type');
            var ck = $.i18n.prop('common_ship_width');
            var jd = $.i18n.prop('common_ship_lng');
            var wd = $.i18n.prop('common_ship_lat');
            var hx = $.i18n.prop('common_ship_dir');
            var hsx = $.i18n.prop('common_ship_heading');
            var zxl = $.i18n.prop('common_ship_rot');
            var mdd = $.i18n.prop('common_ship_des');
            var yjddsj = $.i18n.prop('common_ship_arrivetime');
            var sjgxsj = $.i18n.prop('common_ship_updatetime');
            var daxx = $.i18n.prop('common_ship_record');
            var tjcd = $.i18n.prop('common_ship_addcd');
            var sp = $.i18n.prop('common_ship_speed');
            var jie = $.i18n.prop('common_ship_speed_unit');
            var hxzt = $.i18n.prop('common_ship_status');

            var lat =  L.ict.app.util.tool.latlngTodfmStr(targetobj.lat,'lat'); 
            var lng =  L.ict.app.util.tool.latlngTodfmStr(targetobj.lon,'lng'); 
            var updatetime = L.ict.app.util.dateTime.getTimeStrFromUnix(targetobj.time);
            var html = [];
            html.push('<div class="shipInfo_Div">');
            // html.push('<div class="shipInfo_title">船舶信息</div>');
            html.push('<div class="shipInfo_table_div">');
            html.push('<table data-id="'+targetobj.id+'">');
            html.push('<tr><td width="20%">'+ cm +'</td><td>'+targetobj.shipname+'</td><td width="20%">'+ gb +'</td><td>'+targetobj.country+'</td></tr>');
            html.push('<tr><td>'+ hh +'</td><td>'+targetobj.callsign+'</td><td>MMSI:</td><td>'+targetobj.mmsi+'</td></tr>'); 
            html.push('<tr><td>IMO:</td><td>'+targetobj.imo+'</td><td>'+ cc +'</td><td>'+targetobj.shiplength+'</td></tr>');
            html.push('<tr><td>'+ cblx +'</td><td>'+targetobj.shiptype+'</td><td>'+ ck +'</td><td>'+targetobj.shipwidth+'</td></tr>');
            html.push('<tr><td>'+ jd +'</td><td>'+lng+'</td><td>'+ wd +'</td><td>'+lat+'</td></tr>');
            html.push('<tr><td>'+ hx +'</td><td>'+targetobj.dir+'°</td><td>'+ hsx +'</td><td>'+targetobj.heading+'°</td></tr>');
            //增加航速字段
            html.push('<tr><td>'+ sp +'</td><td>'+targetobj.speed+' ' +jie +'</td><td>'+ hxzt +'</td><td>'+targetobj.status+'</td></tr>');            
            html.push('<tr><td>'+ zxl +'</td><td>'+targetobj.rotsensor+ '°/min' +'</td><td>'+ mdd +'</td><td>'+targetobj.destination+'</td></tr>');
            html.push('<tr><td>'+ yjddsj +'</td><td>'+targetobj.reachtime+'</td><td>'+ sjgxsj+'</td><td>'+updatetime+'</td></tr>');                                               
            html.push('</table>');
            html.push('</div>');
            html.push('<div class="btnDiv">');
            html.push('<button type="button" class="btn daxx">'+ daxx +'</button>');
            html.push('<button type="button" class="btn addcd">'+ tjcd +'</button>');
            html.push('</div>');
            html.push('</div>');
            return html.join("");                       
        },

        _initPopEvt:function(){
            var self = this;
            $(".ict_realTarget_popupContainer .btnDiv>button").on("click",function(e){
                //登录提示
                if(!L.ICT.Func["UserLogin"].getInstance().isLogin()){
                    L.ICT.Func["UserLogin"].getInstance().alertLoginDialog();                    
                    return;
                 }  
                 var id = self.currentTarget.options.data.id;
                 var shipname = self.currentTarget.options.data.shipname;
                 var mmsi = self.currentTarget.options.data.mmsi;
                 if($(this).hasClass('daxx')){
                    // window.location.href = 'resultpage/shiprecord.html'; //在同一窗口打开
                    // window.open('resultpage/shiprecord.html');//在新窗口打开
                 } else {
                    var  cdglshipadd=new L.ICT.CdglAddShip();
                    cdglshipadd.addShipToFleet(cdglshipadd,id,shipname,mmsi);
                 }

            });
        }, 

        getDetialConvertName:function(code,type){
            var res = "";
            code = code.toString();
            if (type=="ship_type"){//船舶类型
              switch(code){
                case "1": res = $.i18n.prop('func_filter_shiptype_1');break;
                case "2": res = $.i18n.prop('func_filter_shiptype_2');break;
                case "3": res = $.i18n.prop('func_filter_shiptype_3');break;
                case "4": res = $.i18n.prop('func_filter_shiptype_4');break;
                case "5": res = $.i18n.prop('func_filter_shiptype_5');break;
                case "6": res = $.i18n.prop('func_filter_shiptype_6');break;
                case "7": res = $.i18n.prop('func_filter_shiptype_7');break;
                default: res = $.i18n.prop('func_filter_shiptype_100');
              }       
            }else if (type == "country"){//国别
              switch(code){
                case "中国": res = "中国";break;
                case "英国": res = "英国";break;
                case "法国": res = "法国";break;
                case "美国": res = "美国";break;
                default: res = "其他"; 
              }
            }else if (type=="hwlx"){//货物类型
              res = code;
            }else if (type=="status"){//状态
              switch(code){
                case "0": res = $.i18n.prop('func_filter_shipsta_0');break;
                case "1": res = $.i18n.prop('func_filter_shipsta_1');break;
                case "2": res = $.i18n.prop('func_filter_shipsta_2');break;
                case "3": res = $.i18n.prop('func_filter_shipsta_3');break;
                case "4": res = $.i18n.prop('func_filter_shipsta_4');break;
                case "5": res = $.i18n.prop('func_filter_shipsta_5');break;
                case "6": res = $.i18n.prop('func_filter_shipsta_6');break;
                case "7": res = $.i18n.prop('func_filter_shipsta_7');break;
                case "8": res = $.i18n.prop('func_filter_shipsta_8');break;
                default: res = $.i18n.prop('common_default_val'); 
              }
            }else if (type=="fixing_device"){//电子定位装置
               switch(code){
                case "-1": res1="非法";break;
                case "0": res="默认";break;
                case "1": res="GPS";break;
                case "2": res="GLONASS";break;
                case "3": res="GPS/GLONASS组合";break;
                case "4": res="Loran-C";break;
                case "5": res="Chayka";break;
                case "6": res="综合导航系统";break;
                case "7": res="观测";break;
                case "8": res="北斗";break;
                case "9": 
                case "10":
                case "11":
                case "12":
                case "13":
                case "14": res="未使用";break;
                case "15": res="内部GNSS";break;
                default:res=code;
               }
            }else if (type=="commun_state"){//通信状态
               switch(code){
                case "0": res="未知";break;
                case "1": res="SOTDMA";break;
                case "2": res="ITDMA";break;
                default:res=code;
               }         
            } else if(type=="pos_accuracy"){//船位精度
               switch(code){
                case "0": res="未知";break;
                case "1": res="定位误差大于10米";break;
                case "2": res="定位误差小于等于10米";break;
                default:res=code;
               }  
            } else if(type=="orig_info_source"){//信息来源
               switch(code){
                case "1": res="农业部";break;
                case "2": res="海事局";break;
                case "3": res="海监";break;
                default:res=code;
               }   
            }else if(type=="orig_info_type"){//信息类型
              switch(code){
                case "1": res = "Argos及海事卫星";break;
                case "2": res = "北斗";break;
                case "3": res = "AIS静态";break;
                case "4": res = "AIS动态";break;
                case "5": res = "LRIT";break;
                case "7": res = "海监";break;
                case "15": res = "综合信息";break;
                default: res = code; 
              }
            }
            return res;
        },  

        getDetialConvertName_lang:function(oneinfo,type){
            var res = "";
            if (type === "shiptype"){//船舶类型
              var value = oneinfo.ast.trim();
              switch(value){
                case "1": res = $.i18n.prop('func_filter_shiptype_1');break;
                case "2": res = $.i18n.prop('func_filter_shiptype_2');break;
                case "3": res = $.i18n.prop('func_filter_shiptype_3');break;
                case "4": res = $.i18n.prop('func_filter_shiptype_4');break;
                case "5": res = $.i18n.prop('func_filter_shiptype_5');break;
                case "6": res = $.i18n.prop('func_filter_shiptype_6');break;
                case "7": res = $.i18n.prop('func_filter_shiptype_7');break;
                default: res = $.i18n.prop('func_filter_shiptype_100');
              }       
            }else if (type == "country"){//国别
              var value = this.lang === 'en' ? oneinfo.cn.replace(/@/g,'') : oneinfo.cne.replace(/@/g,'');
              switch(value){
                case "中国": res = "中国";break;
                case "英国": res = "英国";break;
                case "法国": res = "法国";break;
                case "美国": res = "美国";break;
                default: res = "其他"; 
              }
            }else if (type=="hwlx"){//货物类型
              res = code;
            }else if (type=="status"){//状态
              switch(code){
                case "0": res = "机动船在航";break;
                case "1": res = "锚泊";break;
                case "2": res = "船舶失控";break;
                case "3": res = "船舶操作受限";break;
                default: res = code; 
              }
            }else if (type=="fixing_device"){//电子定位装置
               switch(code){
                case "-1": res1="非法";break;
                case "0": res="默认";break;
                case "1": res="GPS";break;
                case "2": res="GLONASS";break;
                case "3": res="GPS/GLONASS组合";break;
                case "4": res="Loran-C";break;
                case "5": res="Chayka";break;
                case "6": res="综合导航系统";break;
                case "7": res="观测";break;
                case "8": res="北斗";break;
                case "9": 
                case "10":
                case "11":
                case "12":
                case "13":
                case "14": res="未使用";break;
                case "15": res="内部GNSS";break;
                default:res=code;
               }
            }else if (type=="commun_state"){//通信状态
               switch(code){
                case "0": res="未知";break;
                case "1": res="SOTDMA";break;
                case "2": res="ITDMA";break;
                default:res=code;
               }         
            } else if(type=="pos_accuracy"){//船位精度
               switch(code){
                case "0": res="未知";break;
                case "1": res="定位误差大于10米";break;
                case "2": res="定位误差小于等于10米";break;
                default:res=code;
               }  
            } else if(type=="orig_info_source"){//信息来源
               switch(code){
                case "1": res="农业部";break;
                case "2": res="海事局";break;
                case "3": res="海监";break;
                default:res=code;
               }   
            }else if(type=="orig_info_type"){//信息类型
              switch(code){
                case "1": res = "Argos及海事卫星";break;
                case "2": res = "北斗";break;
                case "3": res = "AIS静态";break;
                case "4": res = "AIS动态";break;
                case "5": res = "LRIT";break;
                case "7": res = "海监";break;
                case "15": res = "综合信息";break;
                default: res = code; 
              }
            }
            return res;
        },          

        //获取当前视图范围内的区域
        getCurRect:function(){
            var obj = {},
                bounds = this.ictmap.getBounds(),
                southwest = bounds.getSouthWest(),
                northeast = bounds.getNorthEast();
            obj.ldlon = parseFloat(southwest.lng.toFixed(6));
            obj.ldlat = parseFloat(southwest.lat.toFixed(6));
            obj.rulon = parseFloat(northeast.lng.toFixed(6));
            obj.rulat = parseFloat(northeast.lat.toFixed(6));
            return obj;
        },      
        
        //获取当前视图加了缓冲区后的区域
        getCurRectExtend:function(){
            var obj = {},
                bounds = this.ictmap.getBounds().pad(this.config.bufferRatio),
                southwest = bounds.getSouthWest(),
                northeast = bounds.getNorthEast();
            obj.ldlon = parseFloat(southwest.lng.toFixed(6));
            obj.ldlat = parseFloat(southwest.lat.toFixed(6));
            obj.rulon = parseFloat(northeast.lng.toFixed(6));
            obj.rulat = parseFloat(northeast.lat.toFixed(6));
            return obj;
        }

   });
});