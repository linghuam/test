/*实时目标*/
define("func/realTarget",[
  "leaflet",
  "func/base",
  "core/namespace",
  "leaflet/shipDistLayer",
  "leaflet/rotateMarker",
  "plugins/contextmenu",
  "data/ajax",
  "data/webSocket",
  "func/tshf",
  "func/hjcx",
  "control/panel"

],function(L){

   L.ICT.RealTarget = L.Class.extend({

        _allRealTargetList:[], //所有实时目标数组

        _filterRealTargetList:[],//所有过滤后的实时目标

        _filterLayers:[], //过滤后的目标图集合

        _shipdistLayer:null,//绿点图层

        _realTargetFeatureGroup:null, //实时目标图层集

        rightClickTargetData:null,//右键点击目标

        rightClickTarget:null,//右键目标对象

        clickTarget:null,//左键点击对象

        _websocket:null,      

        _shipSelectMarker:null,//船舶图标选中状态图  

        initialize:function(ictmap){
           this.ajax = new L.ICT.Ajax();
           this.config = Project_ParamConfig.RealTargetConfig;          
           this.ictmap = ictmap;
           this._realTargetFeatureGroup = L.featureGroup([]);
           this.ictmap.map.addLayer(this._realTargetFeatureGroup);
           this.shipTypeList = Project_ParamConfig.FilterDisplayConfig.shipTypeList; //st
           this.shipFlagList = Project_ParamConfig.FilterDisplayConfig.shipFlagList;
           // this.shipStateList = Project_ParamConfig.FilterDisplayConfig.shipStateList; //sta
           this.shipSourceList = Project_ParamConfig.FilterDisplayConfig.shipSourceList; //sid           
           this._initWebSocket();           
        },

        //websocket 初始化
        _initWebSocket:function(){
           this._websocket = new L.ICT.WebSocket(this.config.shipRealSocketUrl);
           this._websocket.onMessage(function(event){
              var data = JSON.parse(event.data);
              L.ICT.Func["HJCX_HJXS"].getInstance().updateHJ(data);
              L.ICT.Func["HJCX_HJKZ"].getInstance().hjkzUpdateTarget(data);
              this.socketMsgHandler(data);               
           },this);
        },
        
        //websocket 发送实时消息
        sendMsg:function(){
           var rect = this.getCurRect(),
               mode = Project_ParamConfig.CurrentMode,
               data = [];
            //当前区域数据
           data.push(parseFloat(rect.ldlon),parseFloat(rect.ldlat),parseFloat(rect.rulon),parseFloat(rect.rulat),mode); 
           // data.push(-180,-90,180,90,mode); //全球数据
           data = data.join("~");
           this._websocket.send(data);           
        }, 
        
        //websocket 接收消息
        socketMsgHandler:function(data){

            if(data.state != 1) {return;}
            if(data.msg.shipList.length <= 0) {return;}
            if(this.ictmap.getCurZoom() < this.config.showLevel) {return ;}
            if(this.ictmap.OperateState.tshf){return;}
            // if(this.ictmap.OperateState.hjcx){return;}
            if(this.ictmap.OperateState.port){return;}
            if(this.ictmap.OperateState.wjfx){return;}
            if(this.ictmap.OperateState.wjfx_hdyc){return;}


            var shipList = data.msg.shipList;
            console.log("接收到实时数据，条数："+shipList.length);
              
            // console.time("websocket:datahandler");
             
            //更新目标列表
            for(var i=0,len=shipList.length;i<len;i++){
               var newobj = this.convertTargetObj(shipList[i]);
               if(this.isInCurBound(newobj) && this.checkFilter(newobj)){
                  this.updateFilterLayerWebSocket(newobj);
               }              
            }  

            // for(var i=0,len=shipList.length;i<len;i++){
            //    var newobj = this.convertTargetObj(shipList[i]);
            //    if(this.isInCurBound(newobj)){
            //       this.updateAllTargetList(newobj);
            //    }              
            // }
            
            //更新过滤列表
            // this.updateFilterList();
           
            // console.timeEnd("websocket:datahandler");  
            // console.time("websocket:render");
           
            //更新过滤图层            
            // this.updateFilterLayer();

            // console.timeEnd("websocket:render");
        },     
        
        //websocket推送的数据是否在当前视图范围
        isInCurBound:function(targetobj){
          var isInCurBound = false;
          var latlng = L.latLng(targetobj.lat,targetobj.lon);
          var curbounds = this.ictmap.getBounds();
          if(curbounds.contains(latlng)){
              isInCurBound = true;
          }          
          return isInCurBound;
        },          

        //首次获取实时目标 
        getRealTarget:function(){
           if(this.ictmap.map.getZoom() < this.config.showLevel) {
               this.showShipDistLayer();
               return ;
            }
           var url = this.config.shipRealUrl;
           var data = {};
           data.limit = this.config.limit;
           data.timeout = this.config.timeout;
           data.mode = Project_ParamConfig.CurrentMode;
           // data = L.extend(data,this.getCurRect());
           data = L.extend(data,this.getCurRectExtend());    
           // this.ajax.abort();
           this.ajax.post(url,data,true,this,function(res){
             if(res.state !== 1 ){
                console.error(res.msg);
             }else{
                var shiplist = res.msg.shipList;
                //所有目标列表
                this._allRealTargetList = [];
                for(var i=0,len=shiplist.length;i<len;i++){
                   var targetobj = this.convertTargetObj(shiplist[i]);
                    this._allRealTargetList.push(targetobj);
                }
                //过滤后的目标列表
                this.updateFilterList();
                //显示过滤后的图层
                this.firstAddRealTargetLayer();
                //发送websocket
                this.sendMsg();
             }
           },function(error){
                // console.error("获取实时目标出错");
           });
        },

        //以后每次获取实时目标 
        getRealTarget2:function(){
           if(this.ictmap.map.getZoom() < this.config.showLevel) {
               this.showShipDistLayer();
               return ;
            }
           var url = this.config.shipRealUrl;
           var data = {};
           data.limit = this.config.limit;
           data.timeout = this.config.timeout;
           data.mode = Project_ParamConfig.CurrentMode;
           data = L.extend(data,this.getCurRectExtend());  
           // this.ajax.abort();
           this.ajax.post(url,data,true,this,function(res){
             if(res.state !== 1 ){
                console.error(res.msg);
             }else{
                var shiplist = res.msg.shipList;
                //清除所有目标中不在当前范围的目标
                // this.removeUnuseTarget();
                //清除当前图层中不在缓冲范围的目标
                // this.removeUnuseFilterLayer();
                //更新目标
                this._allRealTargetList = [];
                for(var i=0,len=shiplist.length;i<len;i++){
                   var targetobj = this.convertTargetObj(shiplist[i]);
                    this._allRealTargetList.push(targetobj);
                }                
                // for(var i=0,len=shiplist.length;i<len;i++){
                //    var targetobj = this.convertTargetObj(shiplist[i]);
                //    this.updateAllTargetList(targetobj);
                // }
                //更新过滤后的目标列表
                this.updateFilterList();
                //更新目标图层
                this.updateFilterLayer();                
                //发送websocket
                this.sendMsg();
                 
             }
           },function(error){
                // console.error("获取实时目标出错");
           });
        },  

        //websocket rest  接口
        convertTargetObj:function(oneinfo){
            var onetarget = {};
            onetarget.country = this.getDetialConvertName(oneinfo.co,'country'); //国别country 中文
            onetarget.infotype = oneinfo.mt; //信息类型 int 
            onetarget.infosrc = oneinfo.ms; //信息来源 int 0;1,2,3
            onetarget.num = oneinfo.nu;//目标编号num int
            onetarget.lon =  parseFloat(oneinfo.lo/600000);//经度
            onetarget.lat =  parseFloat(oneinfo.la/600000);//纬度
            onetarget.dir =  parseFloat(parseInt(oneinfo.di/10).toFixed(1));//船航向 int
            onetarget.heading = oneinfo.he;//船首向 int
            onetarget.shipname = oneinfo.sn.replace(/@/g,'') || '未知';//船名 
            onetarget.shiptype =  this.getDetialConvertName(oneinfo.st,'ship_type');//船舶类型 int
            onetarget.time = oneinfo.ti;
            onetarget.speed = oneinfo.sp/10;
            //test start
            // if(isNaN(onetarget.speed)){
            //   console.error('船速数据出错，原始值：'+oneinfo.sp);
            // }
            //test end
            // 自定义属性
            onetarget.id  =  this.getShipIdMode(oneinfo).id; // 计算后的id，作为船舶的唯一id
            onetarget.mode  =  this.getShipIdMode(oneinfo).mode;//自定义 当前模式
            return onetarget;
        },  

        //获取船舶信息接口 
        convertTargetObj2:function(oneinfo){
          var onetarget={};
          onetarget.country = oneinfo.country_name.replace(/@/g,'') || "其他"; //国别country 中文
          onetarget.infotype = oneinfo.orig_info_type; //信息类型 int 
          onetarget.infosrc = oneinfo.orig_info_source; //信息来源 int 0;1,2,3
          onetarget.num = oneinfo.target_id;//目标编号num int         
          onetarget.lon= parseFloat(oneinfo.longitude/600000);//经度
          onetarget.lat= parseFloat(oneinfo.latitude/600000);//纬度
          onetarget.dir = parseFloat((oneinfo.direction/10).toFixed(1));//船航向 int
          onetarget.heading = oneinfo.heading;//船首向 int
          onetarget.shipname = oneinfo.ship_name.replace(/@/g,'') || '未知';//船名 
          onetarget.shiptype = this.getDetialConvertName(oneinfo.ship_type,'ship_type');//船舶类型 int  
          onetarget.time = oneinfo.record_utc_time;
          onetarget.speed = oneinfo.speed/10;
          //自定义属性
          onetarget.id = this.getShipIdMode2(oneinfo).id;  //计算后的id，作为船舶的唯一id    
          onetarget.mode = this.getShipIdMode2(oneinfo).mode;//当前模式 test
          return onetarget;
        },      

        getShipIdMode:function(targetobj){
           var idmo = {id:null,mode:null};
           if(Project_ParamConfig.CurrentMode === 0){
               idmo.id = targetobj.nu;
               idmo.mode = 0;
           }else{
              idmo.id = targetobj.nu;
              idmo.mode = targetobj.mt;
           }
           return idmo;
        }, 

        getShipIdMode2:function(targetobj){
           var idmo = {id:null,mode:null};
           if(Project_ParamConfig.CurrentMode === 0){
               idmo.id = targetobj.target_id;
               idmo.mode = 0;
           }else{
              idmo.id = targetobj.target_id_orig;
              idmo.mode = targetobj.targetIDOrig_Type;
           }
           return idmo;
        },    

        getDetialConvertName:function(code,type){
            var res = "";
            if(code.toString) code = code.toString();
            if (type=="ship_type"){//船舶类型
              switch(code){
                case "1": res = "货船";break;
                case "2": res = "搜救船";break;
                case "3": res = "油轮";break;
                case "4": res = "拖轮";break;
                case "5": res = "渔船";break;
                case "6": res = "拖船";break;
                case "7": res = "客船";break;
                default: res = "其他"; 
              }       
            }else if (type=="country"){//国别
              switch(code){
                case "中国": res = "中国";break;
                case "美国": res = "美国";break;
                case "英国": res = "英国";break;
                case "法国": res = "法国";break;
                case "俄罗斯": res = "俄罗斯";break;
                default: res = "其他"; 
              }
            }else if (type=="hwlx"){//货物类型
              res = code;
            }else if (type=="status"){//航行状态
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
        },          

        //更新所有实时目标列表
        updateAllTargetList:function(newtarget){
            for(var i=0,len=this._allRealTargetList.length;i<len;i++){
                 var onetarget = this._allRealTargetList[i];
                 if(newtarget.id === onetarget.id){
                    if(this.isChange(onetarget,newtarget)){
                       this._allRealTargetList[i] = newtarget;
                    }                    
                    break;
                 }
            }
            if(i === len && len<this.config.limit){
               this._allRealTargetList.push(newtarget);
            }
        },

        //更新过滤目标列表
        updateFilterList:function(){
            this._filterRealTargetList = [];
            for(var i=0,len=this._allRealTargetList.length;i<len;i++){
              var tr = this._allRealTargetList[i];
              if(this.checkFilter(tr)){
                this._filterRealTargetList.push(tr);
              }
            }
        },

        //更新实时目标图层websocket
        updateFilterLayerWebSocket:function(targetobj){
            //更新所有目标列表
            this.updateAllTargetList(targetobj);
            // 更新过滤目标列表
            for(var i=0,len=this._filterRealTargetList.length;i<len;i++){
                 var onetarget = this._filterRealTargetList[i];
                 if(targetobj.id === onetarget.id && this.isChange(onetarget,targetobj)){
                    this._filterRealTargetList[i] = targetobj;                   
                    break;
                 }
            }
            if(i === len && this._filterRealTargetList.length<this.config.limit){
               this._filterRealTargetList.push(targetobj);
            }
           //更新已有目标或添加不存在目标           
            for(var i=0,len=this._filterLayers.length;i<len;i++){
              var oldmarker = this._filterLayers[i];
              var data = oldmarker.options.data;
              if(data.id === targetobj.id && this.isChange(data,targetobj)){
                  var latlng = L.latLng(targetobj.lat,targetobj.lon);
                  oldmarker.setLatLng(latlng);
                  oldmarker.setRotationAngle(targetobj.dir);
                  oldmarker.options.data = targetobj;                 
                  break;
              }
           }
           if(i === len && this._filterLayers.length<this.config.limit){
              var marker = this.createMarker(targetobj,true);
              this._filterLayers.push(marker);             
              if(this._realTargetFeatureGroup){
                  this._realTargetFeatureGroup.addLayer(marker);
                }                
           }                
        },        

        //更新实时目标图层
        updateFilterLayer:function(){
           //更新已有目标或添加不存在目标
           for(var i=0,len=this._filterRealTargetList.length;i<len;i++){
                var showtarget = this._filterRealTargetList[i];
                for(var j=0,len2=this._filterLayers.length;j<len2;j++){
                  var oldmarker = this._filterLayers[j];
                  var data = oldmarker.options.data;
                  if(data.id === showtarget.id){
                     if(this.isChange(data,showtarget)){
                        var latlng = L.latLng(showtarget.lat,showtarget.lon);
                        oldmarker.setLatLng(latlng);
                        oldmarker.setRotationAngle(showtarget.dir);
                        oldmarker.options.data = showtarget;
                     }
                     break;
                  }
               }
               if(j === len2){
                  var marker = this.createMarker(showtarget,true);
                  this._filterLayers.push(marker);
                  if(this._realTargetFeatureGroup){
                      this._realTargetFeatureGroup.addLayer(marker);
                    }                
               }            
           }
           //移除无用目标
           // this.removeInFilterLayer();
           // console.log( this._filterLayers.length);   
        },

        removeInFilterLayer:function(){
           var self = this;
           self._filterLayers = $.map(self._filterLayers,function(layer){
                var isremove = true;
                var layerdata = layer.options.data;
                for(var i=0,len=self._filterRealTargetList.length;i<len;i++){
                  var targetobj = self._filterRealTargetList[i];                  
                  if(targetobj.id === layerdata.id){
                     isremove = false;
                     break;
                  }
               }
               if(isremove && self._realTargetFeatureGroup){
                 self._realTargetFeatureGroup.removeLayer(layer);  
                 return null;
               }else{
                 return layer;     
               }    
                    
           });            
        },        

        //更新实时目标图层2 对外接口
        updateFilterLayer2:function(){
           this._realTargetFeatureGroup.eachLayer(function(layer){
                var ishide = true;
                var layerdata = layer.options.data;
                for(var i=0,len=this._filterRealTargetList.length;i<len;i++){
                  var targetobj = this._filterRealTargetList[i];                  
                  if(targetobj.id === layerdata.id){
                     ishide = false;
                     break;
                  }
                }
                if(ishide){
                   layer.setOpacity(0);                  
                   layer.off("contextmenu", this._markerRightClickEvt,this);
                   layer.off("click", this._markerClickEvt,this);
                } else{
                   layer.setOpacity(1);
                   layer.on("contextmenu", this._markerRightClickEvt,this);                            
                   layer.on("click", this._markerClickEvt,this);
                }               

           },this);
        },        
        
        //通过id号删除图层中的某个目标
        removeTargetLayerById:function(id){
            for(var i=0,len=this._filterLayers.length;i<len;i++){
                 var layer = this._filterLayers[i];
                 if(id === layer.options.data.id && this._realTargetFeatureGroup){
                    this._filterLayers.splice(i,1);
                    this._realTargetFeatureGroup.removeLayer(layer);
                    break;
                 }
            }
        },

        //首次添加实时目标图层
        firstAddRealTargetLayer:function(){          
           this.removeRealTargetLayer();
           this._filterLayers = [];
           for(var i=0,len=this._filterRealTargetList.length;i<len;i++){
               var rt = this._filterRealTargetList[i];
               var marker = this.createMarker(rt,true);
               this._filterLayers.push(marker);
           }
           this._realTargetFeatureGroup = L.featureGroup(this._filterLayers);
           this.ictmap.map.addLayer(this._realTargetFeatureGroup);
        },

        //清除所有目标中不在当前范围的目标
        removeUnuseTarget:function(){
          var curbounds = this.ictmap.getBoundsExtend();
          var newlist = [];
          for(var i=0,len=this._allRealTargetList.length;i<len;i++){
              var target = this._allRealTargetList[i];
              var latlng = L.latLng(target.lat,target.lon);
              if(curbounds.contains(latlng)){
                  newlist.push(target);
              }
          }
          this._allRealTargetList = newlist;
        },  

        //清除当前图层中不在缓冲范围的目标
        removeUnuseFilterLayer:function(){
            var curbounds = this.ictmap.getBoundsExtend();
            var newlist = [];
            for(var i=0,len=this._filterLayers.length;i<len;i++){
                var layer = this._filterLayers[i];
                var latlng = layer.getLatLng();
                if(curbounds.contains(latlng)){
                    newlist.push(layer);
                } else {
                   if(this._realTargetFeatureGroup) this._realTargetFeatureGroup.removeLayer(layer);
                }
            }
            this._filterLayers = newlist;
        },
        
        //判断当前目标位置是否改变
        isChange:function(oldtarget,newtarget){
             var ischange = false;
             if(newtarget.lat !== oldtarget.lat || newtarget.lon !== oldtarget.lon){
                ischange = true;
             }
             return ischange;
        },
        
        //过滤目标
        checkFilter:function(targetobj){

          // return true;

           var shipTypeRes = false,
               shipFlagRes = false,
               // shipStateRes = false,
               shipSourceRes = false;

   
           //信息源
           var target_key = targetobj.infosrc.toString();
           if(this.shipSourceList.length ===0 || this.shipSourceList.indexOf(target_key)!== -1){
             shipSourceRes = true;
           }  

           //信息类型
           var target_key = targetobj.shiptype.toString();
           if(this.shipTypeList.length ===0 || this.shipTypeList.indexOf(target_key)!== -1){
             shipTypeRes = true;
           }

           //船旗
           var target_key = targetobj.country.toString();
           if(this.shipFlagList.length ===0 || this.shipFlagList.indexOf(target_key)!== -1){
             shipFlagRes = true;
           }                             

           // //船舶类型
           // var target_key = targetobj.shiptype.toString();
           // if(this.shipTypeList.length ===0 || this.shipTypeList.indexOf(target_key)!== -1){
           //   shipTypeRes = true;
           // }

           // //船旗
           // var target_key = targetobj.country.toString();
           // if(this.shipFlagList.length ===0 || this.shipFlagList.indexOf(target_key)!== -1){
           //   shipFlagRes = true;
           // }                
            
           // //航行状态
           // var target_key = targetobj.sta.toString();
           // if(this.shipStateList.length ===0 || this.shipStateList.indexOf(target_key)!== -1){
           //   shipStateRes = true;
           // }    
           // //来源
           // var target_key = targetobj.sid.toString();
           // if(this.shipSourceList.length ===0 || this.shipSourceList.indexOf(target_key)!== -1){
           //   shipSourceRes = true;
           // }
          
           return shipTypeRes && shipFlagRes  && shipSourceRes;         
        },

        //创建实时目标图标 --isAddEvent 是否添加单击和右击事件 默认不添加
        createMarker:function(targetobj,isAddEvent){
           var isAddEvent = isAddEvent ? isAddEvent : false;
           var latlng = L.latLng(targetobj.lat,targetobj.lon),
               tipText = targetobj.shipname,
               targetIcon = this.getTargetIcon(targetobj.shiptype);
           var markOptions = {
              icon:targetIcon,
              rotationAngle:targetobj.dir,//方向，正北是0，顺时针，共360，
              rotationOrigin:'center center',
              title:tipText, //添加鼠标移上后的提示信息
              data:targetobj
           };
           if(isAddEvent){
              //规定哪些有右键菜单
              markOptions.icon.options.className = "leaflet-marker-rightclick-icon";
           }
           var Lmarker = L.marker(latlng,markOptions);

            //标牌显示
           if(this.ictmap.labelType){
                var content = null;
                if(this.ictmap.labelType === 'shipname'){
                   content = targetobj.shipname.toString();
                }
                else if(this.ictmap.labelType === 'id'){
                   content = targetobj.id.toString();
                }     
                Lmarker.bindTooltip(content,this.getTootipOptions());   
                Lmarker.openTooltip();      
            }

           if(isAddEvent){ 
              this.addTargetEvt(Lmarker);                    
           }          
           return Lmarker;
        },

        //添加事件
        addTargetEvt:function(target){
              //添加鼠标右键点击事件
              target.on("contextmenu", this._markerRightClickEvt,this);                            
              //添加鼠标单击事件
              target.on("click", this._markerClickEvt,this);            
        },
        
        //移除事件
        removeTargetEvt:function(target){
              //添加鼠标右键点击事件
              target.off("contextmenu", this._markerRightClickEvt,this);                            
              //添加鼠标单击事件
              target.off("click", this._markerClickEvt,this);
        },      

        //鼠标右键点击事件
        _markerRightClickEvt:function(e){
           // e.stopPropagation();
           L.DomEvent.stopPropagation(e);
           var mapcontainer = this.ictmap.map.getContainer();
           var x = e.containerPoint.x + mapcontainer.offsetLeft;
           var y = e.containerPoint.y + mapcontainer.offsetTop;
           this.rightClickTarget = e.target;
           this.rightClickTargetData = e.target.options.data;
           //调出右键菜单
           $('#mappanel').contextMenu(false);
           $('.leaflet-marker-rightclick-icon').contextMenu(true);                     
           $('.leaflet-marker-rightclick-icon').contextMenu({x:x,y:y});          
        },

        //初始化船舶图标右键菜单
        initContextMenu:function(){
            var self = this;
            $.contextMenu({
                selector:'.leaflet-marker-rightclick-icon', 
                trigger: 'none',
                zIndex:99999,
                className:'ict_contextmenu_ship',              
                callback: function(key, options) {
                   self._rightClickCallback(key, options);
                },
                items: {
                    "bpxs":{
                       "name":"标牌显示",
                       "items":{
                           "bpxs-shipname":{"name":"船名"},
                           "bpxs-ph":{"name":"批号"},
                           "bpxs-close":{"name":"关闭显示"}
                       }
                    },
                    "hjxs": {"name": "航迹显示"},
                    "xskz": {
                        "name": "显示控制", 
                        "items": {
                            "xskz-key1": {"name": "全航迹"},
                            "xskz-key2": {"name": "10点"},
                            "xskz-key3": {"name": "100点"},
                            "xskz-key4": {"name": "1000点"}
                        }
                    },
                    "tshf": {"name": "态势回放"},
                    "addhf": {"name": "加入回放列表"}
                }
            });
        },  

        getTootipOptions:function(){
           return  {
                offset: [0, 0],
                direction: "top",
                permanent:true,
                opacity: 0.8
             };       
        },
        
        //右键回调
        _rightClickCallback:function(key,options){
           var curobj = this.rightClickTargetData;
           var curtarget = this.rightClickTarget;
           if(key === 'bpxs-shipname'){
              var shipname = curobj.shipname;
              curtarget.unbindTooltip();
              curtarget.bindTooltip(shipname,this.getTootipOptions());
              curtarget.openTooltip();
              
           }else if(key === 'bpxs-ph'){
              var ph = curobj.id.toString();
              curtarget.unbindTooltip();
              curtarget.bindTooltip(ph,this.getTootipOptions());
              curtarget.openTooltip();                        

           } else if(key === 'bpxs-close'){
              curtarget.unbindTooltip();

           }else if(key === "hjxs"){
              var hjxsObj =  L.ICT.Func["HJCX_HJXS"].getInstance();
              hjxsObj.start();

           }else if(key === "xskz-key1"){
                var xskzObj = L.ICT.Func["HJCX_HJKZ"].getInstance();
                xskzObj.start(0);

           }else if(key === "xskz-key2"){
                var xskzObj = L.ICT.Func["HJCX_HJKZ"].getInstance();
                xskzObj.start(10);
            
           }else if(key === "xskz-key3"){
                var xskzObj = L.ICT.Func["HJCX_HJKZ"].getInstance();
                xskzObj.start(100);
            
           }else if(key === "xskz-key4"){
                var xskzObj = L.ICT.Func["HJCX_HJKZ"].getInstance();
                xskzObj.start(1000);
            
           }else if(key === "tshf"){
              L.ICT.Func["TSHFOneShip"].run();

           }else if(key === "addhf"){              
              var tshfinstance = L.ICT.Func["TSHFMoreShip"].getInstance();
              tshfinstance.addTarget(curobj);
              if(tshfinstance._targetPanel){
                tshfinstance.updateList();
              }else {
                 L.ict.app.util.dialog.success("提示","成功加入回放列表！");
              }
           }
        },        
        
        //鼠标单击事件 获取指定船舶信息
        _markerClickEvt:function(event){
            var curship = event.target,
                url = this.config.shipInfoUrl,
                data = {};
            data.shipid = curship.options.data.id;
            data.mode = curship.options.data.mode;
            //test
            // console.log('鼠标点击船舶：['+curship.options.data.lat+','+curship.options.data.lon+']');
            //test
            // this.ajax.abort();
            this.removeSelectMarker();
            this.createSelectMarker(event);  
            this.clickTarget = event.target;          
            // this.ictmap.closePoppanel();
            this.ajax.post(url,data,true,this,function(res){
               if(res.state !== 1){
                  // this.removeSelectMarker();
                  L.ict.app.util.dialog.error("错误提示",res.msg.error);
                  this.removeShipInfoPopPanel();
               }else{
                  var targetobj = this.convertshipInfoObj(res.msg);
                  // var popupOptions = {
                  //     maxWidth:300,
                  //     minWidth:300,
                  //     className:'ict_realTarget_popupContainer'
                  // };
                  // curship.on("popupopen",function(){
                  //      this.removeSelectMarker();
                  //      this.createSelectMarker(event);
                  // },this);
                  // curship.on("popupclose",function(){
                  //     this.removeSelectMarker();
                  // },this);
                  // curship.bindPopup(this.getPopupContent(targetobj),popupOptions).openPopup();
                  this.showShipInfoPopPanel(targetobj);
                  this._initPopEvt();
               }
            },function(error){
                this.removeShipInfoPopPanel();
            });
        },   
        
        //船舶信息弹框
        showShipInfoPopPanel:function(targetobj){
            if( this._shipinfoPopPanel){ 
              this._shipinfoPopPanel.setContent(this.getPopupContent(targetobj));
              return;
            }
            var options = {
                title:'船舶信息',
                width:460,
                height:330,
                right:40,
                top:80,
                className:'ict_realTarget_popupContainer',
                contentHTML:this.getPopupContent(targetobj)
            };      
            this._shipinfoPopPanel = new L.ICT.PopPanel(options);
            this._shipinfoPopPanel.show();
            this._shipinfoPopPanel.on("popPanelRemove",function(){
               this._shipinfoPopPanel = null;
               this.removeSelectMarker();
            },this);
        },    

        removeShipInfoPopPanel:function(){
          if(this._shipinfoPopPanel){
              this._shipinfoPopPanel.remove();
              this._shipinfoPopPanel = null;
          }
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
            this._shipSelectMarker.on("contextmenu",function(){
              event.target.fire("contextmenu",event);
            },this);  
            this._shipSelectMarker.on("click",function(){
              event.target.fire("click",event);
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
         
        //移除选中状态图标
        removeSelectMarker:function(){
            if(this._shipSelectMarker && this.clickTarget){
                this._shipSelectMarker.remove();
                this._shipSelectMarker = null;
                this.clickTarget.options.hasSelectState = false;
            }
        },
        
        //标牌显示所有船舶
        labelAllShip:function(type){         
           if(this._realTargetFeatureGroup){
              this._realTargetFeatureGroup.eachLayer(function(layer){
                    var content,
                        data = layer.options.data;
                    if(type === 'shipname'){
                       content = data.shipname;
                    } else {
                       content = data.id.toString();
                    }
                    layer.unbindTooltip();
                    layer.bindTooltip(content,this.getTootipOptions());
                    layer.openTooltip();  
              },this);
           }
        },
        
        //隐藏所有标牌
        hideAlllabel:function(){
           if(this._realTargetFeatureGroup){
              this._realTargetFeatureGroup.eachLayer(function(layer){                    
                    layer.unbindTooltip();  
              },this);
           }
        },
        
        //根据船舶类型获取船舶图标
        getTargetIcon:function(type){
           var type = type.toString(),
               icon = null;
           switch (type){
             case "货船": icon=L.ICT.ShipIcon.ship1 ;break;
             case "搜救船": icon=L.ICT.ShipIcon.ship2 ;break;
             case "油轮": icon=L.ICT.ShipIcon.ship3 ;break;
             case "拖轮": icon=L.ICT.ShipIcon.ship7;break;
             case "渔船": icon=L.ICT.ShipIcon.ship4 ;break;
             case "拖船": icon=L.ICT.ShipIcon.ship7;break;
             case "客船": icon=L.ICT.ShipIcon.ship5 ;break;
             case "其他": icon=L.ICT.ShipIcon.ship6 ;break;
             default: icon=L.ICT.ShipIcon.ship7;
           }
           return icon;
        },
        
        //船舶详细信息转化
        convertshipInfoObj:function(shipobj){
           var obj = {};
           obj.id = shipobj.target_id === -1 ? shipobj.target_id_orig : shipobj.target_id; //目标唯一标识号
           obj.record_utc_time = shipobj.record_utc_time;//最后更新时间 unix时间戳
           obj.lon = parseFloat(shipobj.longitude/600000);//经度
           obj.lat = parseFloat(shipobj.latitude/600000);//纬度
           obj.di = parseInt(shipobj.direction/10).toFixed(1);//航向
           obj.he = shipobj.heading;//船艏向
           obj.sp = shipobj.speed/10; //船速（节）
           obj.st = this.getDetialConvertName(shipobj.status,"status");//状态
           obj.rot = shipobj.rot_sensor;//转向率
           obj.type = this.getDetialConvertName(shipobj.orig_info_type,"orig_info_type");//信息类型
           obj.src = this.getDetialConvertName(shipobj.orig_info_source,"orig_info_source");//信息来源
           obj.target_id_orig = shipobj.target_id_orig; //原始模式的目标编号
           obj.mmsi = shipobj.mmsi;
           obj.sn = shipobj.ship_name.replace(/@/g,'') || '未知';//船名
           obj.call_sign = shipobj.call_sign.replace(/@/g,'') || '未知';//呼号
           obj.imo = shipobj.imo_number;//imo编号
           obj.des = shipobj.destination;//目的港口
           obj.eta = shipobj.eta;//预计到达时间
           obj.draft = shipobj.draft;//目前最大静态吃水
           obj.cn = shipobj.country_name.replace(/@/g,'') || '其他';//国家名
           obj.ship_type = this.getDetialConvertName(shipobj.ship_type,"ship_type");//船舶类型
           obj.cargo_type = shipobj.cargo_type;//货物类型
           obj.ship_length = shipobj.ship_length;//船长（米）
           obj.ship_breadth = shipobj.ship_breadth;//船宽（米）
           obj.fixing_device = this.getDetialConvertName(shipobj.fixing_device,"fixing_device");//电子定位装置
           obj.pos_accuracy = this.getDetialConvertName(shipobj.pos_accuracy,"pos_accuracy");//船位精度
           obj.commun_state = this.getDetialConvertName(shipobj.commun_state,"commun_state");//通信状态
           return obj;   
        },
        
        //获取船舶详细信息页面
        getPopupContent:function(targetobj){
           var lat =  L.ict.app.util.tool.latlngTodfmStr(targetobj.lat,'lat'); 
           var lng =  L.ict.app.util.tool.latlngTodfmStr(targetobj.lon,'lng');      
           var time = L.ict.app.util.dateTime.getTimeStrFromUnix(targetobj.record_utc_time);     
           var html = [];
           html.push('<div class="shipInfo_Div">');
           // html.push('<div class="shipInfo_title">船舶信息</div>');
           html.push('<div class="shipInfo_table_div">');
           html.push('<table data-id="'+ targetobj.id +'">');
           html.push('<tr><td width="18%">批号:</td><td>'+ targetobj.id +'</td><td width="18%">信息源:</td><td>'+ targetobj.src +'</td></tr>');
           html.push('<tr><td>船名:</td><td>'+ targetobj.sn +'</td><td>MMSI:</td><td>'+ targetobj.mmsi +'</td></tr>');
           html.push('<tr><td>IMO:</td><td>'+ targetobj.imo +'</td><td>呼号:</td><td>'+ targetobj.call_sign +'</td></tr>');
           html.push('<tr><td>时间:</td><td>'+ time +'</td><td>地区:</td><td>'+ targetobj.cn +'</td></tr>');
           html.push('<tr><td>航行状态:</td><td>'+ targetobj.st +'</td><td>航向:</td><td>'+ targetobj.di +'°</td></tr>');
           html.push('<tr><td>经度:</td><td>'+ lng +'</td><td>纬度:</td><td>'+ lat +'</td></tr>');
           html.push('<tr><td>航艏向:</td><td>'+ targetobj.he +'°</td><td>转向率:</td><td>'+ targetobj.rot +'</td></tr>'); 
           html.push('<tr><td>航速:</td><td>'+ targetobj.sp +'节</td><td>通信状态:</td><td>'+ targetobj.commun_state +'</td></tr>'); 
           html.push('<tr><td>船舶类型:</td><td>'+ targetobj.ship_type +'</td><td>信息类型:</td><td>'+ targetobj.type +'</td></tr>');                                   
           html.push('</table>');           
           html.push('</div>');
           html.push('<div class="btnDiv">');
           html.push('<button type="button" data-id="'+ targetobj.id +'" class="daxx">档案信息</button>');          
           html.push('</div>');          
           html.push('</div>');
           return html.join("");                       
        }, 

        _initPopEvt:function(){
            var self = this;
            $(".ict_realTarget_popupContainer .btnDiv>button").on("click",function(e){
                 var id = $(this).data('id');
                 // window.location.href = 'resultpage/shiprecord.html'; //在同一窗口打开
                 window.open('resultpage/shiprecord.html');//在新窗口打开
            });
        },       

        //显示或加载绿点图 
        showShipDistLayer:function(){
            if(this._shipdistLayer){
               this._shipdistLayer.setOpacity(1);
            }else {
               this._shipdistLayer = new L.TileLayer.ShipDistLayer(this.config.shipDistLayerUrl);
               this.ictmap.map.addLayer(this._shipdistLayer); 
            }
        },
        
        //隐藏绿点图
        hideShipDistLayer:function(){
           if(this._shipdistLayer){
              this._shipdistLayer.setOpacity(0);
           }
        },        

        //添加绿点图
        addShipDistLayer:function(){     
            this.removeShipDistLayer();     
            this._shipdistLayer = new L.TileLayer.ShipDistLayer(this.config.shipDistLayerUrl);
            this.ictmap.map.addLayer(this._shipdistLayer);
        },
        
        //移除绿点图
        removeShipDistLayer:function(){
           if(this._shipdistLayer && this.ictmap.map.hasLayer(this._shipdistLayer)){
              this._shipdistLayer.remove();
              this._shipdistLayer = null;
           }          
        },

        //显示实时目标
        showRealTargetLayer:function(){
            if(this._realTargetFeatureGroup){
                this._realTargetFeatureGroup.eachLayer(function(layer){
                   if(layer.setOpacity) layer.setOpacity(1);
                   if(layer.setStyle) layer.setStyle({opacity:1,fillOpacity:1});
                   this.addTargetEvt(layer);
                },this);
            }
        },
        
        //隐藏实时目标
        hideRealTargetLayer:function(){
            if(this._realTargetFeatureGroup){
                this._realTargetFeatureGroup.eachLayer(function(layer){
                   if(layer.setOpacity) layer.setOpacity(0);
                   if(layer.setStyle) layer.setStyle({opacity:0,fillOpacity:0});
                   this.removeTargetEvt(layer);
                   this.removeShipInfoPopPanel();                   
                },this);
            }      
        },

        //移除实时目标图层
        removeRealTargetLayer:function(){
          if(this._realTargetFeatureGroup){
             this._realTargetFeatureGroup.clearLayers();        
             // this._realTargetFeatureGroup = null;   
          }
        },        

        //地图加载实时目标
        addRealTargetLayer:function(){
          if(this.ictmap.getCurZoom() < this.config.showLevel){            
             this.showShipDistLayer();
             this.removeRealTargetLayer();
          }else{
             this.hideShipDistLayer();
             this.getRealTarget();
          }
        },  

        //搜索定位 对外接口
        locateShip:function(data){
            this.clearLocatLyr();
            var layer = this.getShipById(data.shipid);
            if(layer){            
                this.ictmap.map.panTo(layer.getLatLng());
                layer.fire("click");
            } else{
                var url = this.config.shipInfoUrl;              
                this.ajax.post(url,data,true,this,function(res){
                   if(res.state !== 1){ 
                       L.ict.app.util.dialog.error("错误",res.msg.error);                          
                   }else{
                      var targetobj = this.convertshipInfoObj(res.msg);
                      var targetobjdata = this.convertTargetObj2(res.msg);                              
                      this._locateShiplyr = this.createMarker(targetobjdata,true);                   
                      this.ictmap.map.addLayer(this._locateShiplyr);
                      this._locateShiplyr.fire("click");
                      this.ictmap.map.panTo(this._locateShiplyr.getLatLng());                       

                   }
                },function(error){

                });             
            }
        },  
                
        //根据id定位到指定船舶 对外接口异常告警 驶入敏感区域定位
        locateShipById:function(id){
           if(typeof id === 'undefined') return ;
            if(this._realTargetFeatureGroup){
                this._realTargetFeatureGroup.eachLayer(function(layer){
                    var data = layer.options.data;
                    if(data.id == id){
                        this.ictmap.map.panTo(layer.getLatLng());
                    }
                },this);
            }             
        },
        
        //通过id在当前图层中寻找目标 对外接口
        getShipById:function(id){
            if(!this._realTargetFeatureGroup) return null;
            var target = null;
            this._realTargetFeatureGroup.eachLayer(function(layer){
                var data = layer.options.data;
                if(data.id === id && layer.options.opacity !==0){
                   target = layer;
                   return;
                }
            },this);
            return target;
        },
        
        //清除定位图层  
        clearLocatLyr:function(){
          if(this._locateShiplyr) {
             this.ictmap.map.removeLayer(this._locateShiplyr);
             this._locateShiplyr = null;
             this.removeShipInfoPopPanel();
          }         
        },

        //实时目标图层是否显示
        isRealTargetShow:function(){
            var isshow = false;
            if(this._realTargetFeatureGroup && this.ictmap.map.hasLayer(this._realTargetFeatureGroup)
               && this.ictmap.map.getZoom() >= this.config.showLevel){
                isshow = true;
            }
            return isshow;
        }
        
   });
});
