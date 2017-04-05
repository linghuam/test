/*实时目标*/
define("func/realTarget",[
  "leaflet",
  "func/base",
  "core/namespace",
  "leaflet/shipDistLayer",
  "leaflet/rotateMarker",
  "plugins/contextmenu",
  "data/ajax",
  "func/hjcx",
  "func/tshf",
  "func/userLogin",
  "plugins/ajaxpoll"

],function(L){

   L.ICT.RealTarget = L.Class.extend({

        _allRealTargetList:[], //所有实时目标数组

        _filterRealTargetList:[],//所有过滤后的实时目标

        _filterLayers:[], //过滤后的目标图集合

        _shipdistLayer:null,//绿点图层

        _realTargetFeatureGroup:null, //实时目标图层集

        rightClickTargetData:null,//右键点击目标

        clickTarget:null,//左键点击对象

        _websocket:null,      

        _shipSelectMarker:null,//船舶图标选中状态  

        initialize:function(ictmap){
           this.ajax = new L.ICT.Ajax();
           this.config = Project_ParamConfig.RealTargetConfig;          
           this.ictmap = ictmap;
           this._realTargetFeatureGroup = L.featureGroup([]);
           this.ictmap.map.addLayer(this._realTargetFeatureGroup);
           this.shipTypeList = Project_ParamConfig.FilterDisplayConfig.shipTypeList; //st
           this.shipFlagList = Project_ParamConfig.FilterDisplayConfig.shipFlagList;
           this.shipStateList = Project_ParamConfig.FilterDisplayConfig.shipStateList; //sta
           this.shipSourceList = Project_ParamConfig.FilterDisplayConfig.shipSourceList; //sid
           
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
           data = L.extend(data,this.getCurRectExtend());
           // this.ajax.abort();
           this.ajax.post(url,data,true,this,function(res){
             if(res.state !== 1 ){
                console.error(res.msg);
             }else{
                var shiplist = res.msg.shipList;
                this._allRealTargetList = [];
                for(var i=0,len=shiplist.length;i<len;i++){
                   var targetobj = this.convertTargetObj(shiplist[i]);
                    this._allRealTargetList.push(targetobj);
                }
                //过滤后的目标列表
                this.updateFilterList();
                //显示过滤后的图层
                this.firstAddRealTargetLayer();
                
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
                 
             }
           },function(error){
                // console.error("获取实时目标出错");
           });

        },  

        //ajax轮询
        sendAjaxPoll:function(url,data,callback){
               $.poll({
                  url: url,
                  data:data,                 
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

        convertTargetObj:function(oneinfo){
          var onetarget = {};
          onetarget.id =  oneinfo.ti; 
          onetarget.time = oneinfo.re; //最后更新时间
          onetarget.lon = parseFloat(oneinfo.lo/600000);//经度
          onetarget.lat = parseFloat(oneinfo.la/600000);//纬度
          onetarget.dir = (oneinfo.di/10).toFixed(1);//船航向 int
          onetarget.heading = oneinfo.he;//船首向 int
          onetarget.speed = (oneinfo.sp/10).toFixed(1);//船速 int
          onetarget.status = oneinfo.st;//船状态 int          
          onetarget.infosrc= oneinfo.os; //信息来源 int 0;1,2,3
          onetarget.mmsi=oneinfo.mi; //mmsi int 
          onetarget.shipname = oneinfo.sn.replace(/@/g,'');//船名
          onetarget.callsign = oneinfo.cs.replace(/@/g,'');//呼号 
          onetarget.imo = oneinfo.imn;//IMO编号
          onetarget.country = this.getDetialConvertName(oneinfo.cn,'country'); //国别country 中文
          onetarget.shiptype = oneinfo.ast; //this.getDetialConvertName(oneinfo.ast,'ship_type');//船舶类型 int   
          return onetarget;

          // var onetarget = {};
          // onetarget.id =  oneinfo.target_id === -1 ? oneinfo.target_id_orig : oneinfo.target_id; 
          // onetarget.time = oneinfo.record_utc_time;
          // onetarget.lon = parseFloat(oneinfo.longitude/600000);//经度
          // onetarget.lat = parseFloat(oneinfo.latitude/600000);//纬度
          // onetarget.dir = (oneinfo.direction/10).toFixed(2);//船航向 int
          // onetarget.heading = oneinfo.heading;//船首向 int
          // onetarget.speed = oneinfo.speed/10;//船速 int
          // onetarget.status = this.getDetialConvertName(oneinfo.status,"status");//船状态 int
          // onetarget.infotype = oneinfo.orig_info_type; //信息类型 int
          // onetarget.mode = oneinfo.targetIDOrig_Type;
          // onetarget.infosrc= oneinfo.orig_info_source; //信息来源 int 0;1,2,3
          // onetarget.mmsi=oneinfo.mmsi; //mmsi int 
          // onetarget.shipname = oneinfo.ship_name;//船名
          // onetarget.callsign = oneinfo.call_sign;//呼号 
          // onetarget.imo = oneinfo.imo_number;//IMO编号
          // onetarget.country = oneinfo.country_name.trim() || "其他"; //国别country 中文
          // onetarget.shiptype = this.getDetialConvertName(oneinfo.ship_type,'ship_type');//船舶类型 int   
          // return onetarget;

        },   

        getDetialConvertName:function(code,type){
            var res = "";
            code = code.toString();
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
                        oldmarker.setOpacity(1);
                     }
                     break;
                  }
               }
               if(j === len2 &&  this._realTargetFeatureGroup){
                  var marker = this.createMarker(showtarget,true);
                  this._filterLayers.push(marker);
                  this._realTargetFeatureGroup.addLayer(marker);
               }            
           }
           //移除无用目标
           // this.removeInFilterLayer();
           console.log( this._filterLayers.length);
    
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


        //首次添加实时目标图层
        firstAddRealTargetLayer:function(){          
           this.removeRealTargetLayer();
           this._filterLayers = [];
           for(var i=0,len=this._filterRealTargetList.length;i<len;i++){
               var rt = this._filterRealTargetList[i];
               var marker = this.createMarker(rt,true);
               this._filterLayers.push(marker);
           }
           this._realTargetFeatureGroup = L.featureGroup(this._filterLayers).addTo(this.ictmap.map);

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

        //移除实时目标图层
        removeRealTargetLayer:function(){
          if(this._realTargetFeatureGroup){
            this._realTargetFeatureGroup.clearLayers();           
          }

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
                 this._realTargetFeatureGroup.removeLayer(layer);
              }
          }
          this._filterLayers = newlist;

        },
        
        //判读当前目标位置是否改变
        isChange:function(oldtarget,newtarget){
             var ischange = false;
             if(newtarget.lat !== oldtarget.lat || newtarget.lon !== oldtarget.lon){
                ischange = true;
             }
             return ischange;

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
           if(this.shipTypeList.length ===0 || this.shipTypeList.indexOf(target_key)!== -1){
             shipTypeRes = true;
           }

           //船旗
           var target_key = this.convertNameToKey(targetobj.country,"shipflag");
           if(this.shipFlagList.length ===0 || this.shipFlagList.indexOf(target_key)!== -1){
             shipFlagRes = true;
           }                
            
           //航行状态
           var target_key = targetobj.status.toString();
           if(this.shipStateList.length ===0 || this.shipStateList.indexOf(target_key)!== -1){
             shipStateRes = true;
           }    
           //来源
           var target_key = targetobj.infosrc.toString();
           if(this.shipSourceList.length ===0 || this.shipSourceList.indexOf(target_key)!== -1){
             shipSourceRes = true;
           }
          
           return shipTypeRes && shipFlagRes && shipStateRes && shipSourceRes;         

        }, 
        
        //过滤显示 
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

        //创建实时目标图标 --isAddEvent 是否添加单击和右击事件 默认不添加
        createMarker:function(targetobj,isAddEvent){
           var isAddEvent = isAddEvent ? isAddEvent : false;
           var latlng = L.latLng(targetobj.lat,targetobj.lon),
               tipText = targetobj.shipname,
               targetIcon = this.getTargetIcon(targetobj.shiptype);
           var markOptions = {
              icon:targetIcon,
              rotationAngle:targetobj.dir,//方向，正北是0，顺时针，共360，
              title:tipText, //添加鼠标移上后的提示信息
              data:targetobj
           };
           if(isAddEvent){
              //规定哪些有右键菜单
              markOptions.icon.options.className = "leaflet-marker-rightclick-icon";
           }
           var Lmarker = L.marker(latlng,markOptions);
           if(isAddEvent){ 
              //添加鼠标右键点击事件
              Lmarker.on("contextmenu", this._markerRightClickEvt,this);
              Lmarker.once("contextmenu",function(e){
                this.initContextMenu();
                this._markerRightClickEvt(e);
              },this);                         
              //添加鼠标单击事件
              Lmarker.on("click", this._markerClickEvt,this);                        
           }
           // this.initContextMenu();
           return Lmarker;

        },    

        //鼠标右键点击事件
        _markerRightClickEvt:function(e){
           L.DomEvent.stopPropagation(e);
           var mapcontainer = this.ictmap.map.getContainer();
           var x = e.containerPoint.x + mapcontainer.offsetLeft;
           var y = e.containerPoint.y + mapcontainer.offsetTop;
           this.rightClickTargetData = e.target.options.data;
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
                selector:'.leaflet-marker-rightclick-icon', 
                trigger: 'none',
                callback: function(key, options) {
                   self._rightClickCallback(key, options);
                },
                items: {
                    "tshf": {"name": tshf, "icon": "edit"},
                    "addhf": {"name": addhf, "icon": "edit"},
                    "hjcx":{"name":hjcx,"icon":"edit"},
                    "addcx":{"name":addcx,"icon":"edit"}
                }
            });

        },  
        
        //右键回调
        _rightClickCallback:function(key,options){
            //验证登录
            if(!L.ICT.Func["UserLogin"].getInstance().isLogin()){
                L.ICT.Func["UserLogin"].getInstance().alertLoginDialog();                
                return;
            }          
           var curobj = this.rightClickTargetData;
           if(key === "tshf"){
              L.ICT.Func["TSHFOneShip"].run();

           }else if(key === "addhf"){             
              var tshfinstance = L.ICT.Func["TSHF"].getInstance();
              tshfinstance.addTarget(curobj);
              if(tshfinstance._targetPanel){
                tshfinstance.updateList();
              }else{
                 L.ict.app.util.dialog.success("提示","添加成功");
              }
              

           }else if(key === "hjcx"){
             L.ICT.Func["HJCXOneShip"].run();

           }else if(key === "addcx"){
             var hjcxinstance = L.ICT.Func["HJCXMoreShip"].getInstance();
             hjcxinstance.addTarget(curobj);
             if(hjcxinstance._popPanel){
                hjcxinstance.updateList();
             } else{
                L.ict.app.util.dialog.success("提示","添加成功");
             }
             
             
           }

        },        
        
        //鼠标单击事件
        _markerClickEvt:function(event){
            var curship = event.target,
                url = this.config.shipInfoUrl,
                id = event.target.options.data.id,
                // mode = event.target.options.data.mode,
                data = {};
            data.shipid = id;
            // data.mode = mode;
            this.removeSelectMarker();
            this.createSelectMarker(event);  
            this.clickTarget = event.target;             
            this.ajax.post(url,data,true,this,function(res){
               if(res.state !== 1){
                  console.error(res.msg.result);
                  L.ict.app.util.dialog.error("错误提示",res.msg.error);
                  this.removeShipInfoPopPanel();                 
               }else{

                  //创建船舶图标选中样式
                  // this.removeSelectMarker();
                  // this.createSelectMarker(event);
                  var targetobj = this.convertshipInfoObj(res.msg);
                  // var popupOptions = {
                  //     maxWidth:300,
                  //     minWidth:300,
                  //     className:'ict_realTarget_popupContainer'
                  // };
                  // curship.on("popupopen",function(){
                  //     this.createSelectMarker(event);
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
                top:100,
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

        removeSelectMarker:function(){
            if(this._shipSelectMarker && this.clickTarget){
                this._shipSelectMarker.remove();
                this._shipSelectMarker = null;
                this.clickTarget.options.hasSelectState = false;
            }

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
        
        //船舶详细信息转化
        convertshipInfoObj:function(oneinfo){
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
          onetarget.shipname = oneinfo.sn.replace(/@/g,'') || '未知';//船名
          onetarget.callsign = oneinfo.cs.replace(/@/g,'') || '未知';//呼号 
          onetarget.imo = oneinfo.imn;//IMO编号
          onetarget.country = oneinfo.cn.replace(/@/g,'') || "其他"; //国别country 中文
          onetarget.shiptype = this.getDetialConvertName(oneinfo.ast,'ship_type');//船舶类型 int              
          onetarget.shiplength = oneinfo.sl +"米"; //int 米
          onetarget.shipwidth  = oneinfo.sb + "米";
          onetarget.rotsensor  = oneinfo.ro; //转向率
          onetarget.destination = oneinfo.de.replace(/@/g,'') || '未知';//目的地
          onetarget.reachtime = oneinfo.et;//预计到达时间        
          return onetarget;

           // var obj = {};
           // obj.cas = shipobj.cas == '@@@@@@@' ? '': shipobj.cas;
           // obj.des = shipobj.des == '@@@@@@@@@@@@@@@@@@@@' ? '' : shipobj.des;
           // obj.dir = shipobj.dir == 3600 ? '' : shipobj.dir/10+'°';
           // obj.dra = shipobj.dra;
           // obj.dyc = shipobj.dyc;
           // obj.dyi = shipobj.dyi;
           // obj.eta = shipobj.eta;
           // obj.hea = shipobj.hea+'°';
           // obj.imn = shipobj.imn;
           // obj.lat = shipobj.lat/600000;
           // obj.len = shipobj.len;
           // obj.lon = shipobj.lon/600000;
           // obj.msi = shipobj.msi;
           // obj.red = shipobj.red;
           // obj.rev = shipobj.rev;
           // obj.rot = shipobj.rot;
           // obj.sid = shipobj.sid;
           // obj.sna = shipobj.sna == '@@@@@@@@@@@@@@@@@@@@' ? '': shipobj.sna;
           // obj.spe = shipobj.spe == 1023 ? '' : shipobj.spe/10;
           // obj.st = shipobj.st;
           // obj.sta = shipobj.sta;
           // obj.stc = shipobj.stc;
           // obj.sti = shipobj.sti;
           // obj.wid = shipobj.wid;
           // return obj;

        },
        
        //获取船舶详细信息页面
        getPopupContent:function(targetobj){
           var lat =  L.ict.app.util.tool.latlngTodfmStr(targetobj.lat,'lat'); 
           var lng =  L.ict.app.util.tool.latlngTodfmStr(targetobj.lon,'lng'); 
           var updatetime = L.ict.app.util.dateTime.getTimeStrFromUnix(targetobj.time);
           var html = [];
           html.push('<div class="shipInfo_Div">');
           // html.push('<div class="shipInfo_title">船舶信息</div>');
           html.push('<div class="shipInfo_table_div">');
           html.push('<table data-id="'+targetobj.id+'">');
           html.push('<tr><td width="20%">船名:</td><td>'+targetobj.shipname+'</td><td width="20%">国别:</td><td>'+targetobj.country+'</td></tr>');
           html.push('<tr><td>呼号:</td><td>'+targetobj.callsign+'</td><td>MMSI:</td><td>'+targetobj.mmsi+'</td></tr>'); 
           html.push('<tr><td>IMO:</td><td>'+targetobj.imo+'</td><td>船长:</td><td>'+targetobj.shiplength+'</td></tr>');
           html.push('<tr><td>船舶类型:</td><td>'+targetobj.shiptype+'</td><td>船宽:</td><td>'+targetobj.shipwidth+'</td></tr>');
           html.push('<tr><td>经度:</td><td>'+lng+'</td><td>纬度:</td><td>'+lat+'</td></tr>');
           html.push('<tr><td>航向:</td><td>'+targetobj.dir+'°</td><td>船艏向:</td><td>'+targetobj.heading+'°</td></tr>');
           html.push('<tr><td>转向率:</td><td>'+targetobj.rotsensor+'</td><td>目的地:</td><td>'+targetobj.destination+'</td></tr>');
           html.push('<tr><td>预计到达时间:</td><td>'+targetobj.reachtime+'</td><td>数据更新时间:</td><td>'+updatetime+'</td></tr>');                                               
           html.push('</table>');
           html.push('</div>');
           html.push('<div class="btnDiv">');
           html.push('<button type="button" class="btn daxx">档案信息</button>');
           html.push('<button type="button" class="btn addcd">添加船队</button>');
           html.push('</div>');
           html.push('</div>');
           return html.join("");                       
        },

        _initPopEvt:function(){
            var self = this;
            $(".ict_realTarget_popupContainer .btnDiv>button").on("click",function(e){
                 var id = $(".ict_realTarget_popupContainer table").data('id');
                 // window.location.href = 'resultpage/shiprecord.html'; //在同一窗口打开
                 // window.open('resultpage/shiprecord.html');//在新窗口打开
            });
        },                       

        //显示绿点图 
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
           if(this._shipdistLayer || this.ictmap.map.hasLayer(this._shipdistLayer)){
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
                },this);
            } else{
               this.getRealTarget();
            }

        },
        
        //隐藏实时目标
        hideRealTargetLayer:function(){
            if(this._realTargetFeatureGroup){
                this._realTargetFeatureGroup.eachLayer(function(layer){
                   if(layer.setOpacity) layer.setOpacity(0);
                   if(layer.setStyle) layer.setStyle({opacity:0,fillOpacity:0});
                },this);
            }      

        },

        //移除实时目标图层
        removeRealTargetLayer:function(){
          if(this._realTargetFeatureGroup){
             this._realTargetFeatureGroup.clearLayers();        
             this._realTargetFeatureGroup = null;   
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
                      var targetobjdata = this.convertTargetObj(res.msg);                              
                      this._locateShiplyr = this.createMarker(targetobjdata,true);                   
                      this.ictmap.map.addLayer(this._locateShiplyr);
                      this._locateShiplyr.fire("click");
                      this.ictmap.map.panTo(this._locateShiplyr.getLatLng());                     

                   }
                },function(error){

                });             
            }
        },             
                      
        //搜索定位 对外接口
        // locateShip:function(data){
        //     var url = this.config.shipInfoUrl;
        //     this.ajax.post(url,data,true,this,function(res){
        //        if(res.state !== 1){ 
        //            L.ict.app.util.dialog.error("错误",res.msg.error);
        //        }else{
        //           var targetobj = this.convertshipInfoObj(res.msg);
        //           var targetobjdata = this.convertTargetObj(res.msg);
        //           var popupOptions = {
        //               maxWidth:300,
        //               minWidth:300,
        //               className:'ict_realTarget_popupContainer'
        //           };
        //           this.clearLocatLyr();
        //           // this._locateShiplyr = this.createMarker(targetobj,true);
        //           this._locateShiplyr = this.createMarker(targetobjdata,true);                   
        //           this._locateShiplyr.addTo(this.ictmap.map);                 
        //           this._locateShiplyr.bindPopup(this.getPopupContent(targetobj),popupOptions).openPopup();
        //           this._locateShiplyr.on("popupclose",function(){
        //              // this.clearLocatLyr();
        //              // this.addRealTargetLayer();
        //           },this);
        //           // this.ictmap.map.setView(this._locateShiplyr.getLatLng(),this.config.showLevel);
        //           this.ictmap.map.panTo(this._locateShiplyr.getLatLng());

        //        }
        //     },function(error){

        //     });

        // },
        
        //清除定位图层  
        clearLocatLyr:function(){
          if(this._locateShiplyr) {
             this.ictmap.map.removeLayer(this._locateShiplyr);
             this._locateShiplyr = null;
             this.removeShipInfoPopPanel();
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

        //实时目标图层是否显示
        isRealTargetShow:function(){
            var res = false;
            if(this._realTargetFeatureGroup && this.ictmap.map.hasLayer(this._realTargetFeatureGroup)
               && this.ictmap.map.getZoom() >= this.config.showLevel){
                res = true;
            }            
            // if(this._realTargetFeatureGroup && this.ictmap.map.hasLayer(this._realTargetFeatureGroup)
            //    && this._realTargetFeatureGroup.getLayers().length>0){
            //     res = true;
            // }
            return res;
        }        
        


   });
});