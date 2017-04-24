/*实时目标*/
define("func/realTarget", [
    "leaflet",
    "leaflet/pip",
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

], function(L, leafletPip) {

    L.ICT.RealTarget = L.Class.extend({

        initialize: function(ictmap) {
            this.ajax = new L.ICT.Ajax();
            this.ajaxShipInfo = new L.ICT.Ajax();
            this.ajaxLocateShip = new L.ICT.Ajax();
            this.config = Project_ParamConfig.RealTargetConfig;
            this.ictmap = ictmap;
            this.realtargetFeatureGroup = L.featureGroup([]);
            this.currentTarget = null; //当前点击对象
            this._shipdistLayer = null; //绿点图层
            this._shipSelectMarker = null; //船舶图标选中状态

            this.ictmap.map.addLayer(this.realtargetFeatureGroup);
            this.shipTypeList = Project_ParamConfig.FilterDisplayConfig.shipTypeList; //st
            this.shipFlagList = Project_ParamConfig.FilterDisplayConfig.shipFlagList;
            this.shipSourceList = Project_ParamConfig.FilterDisplayConfig.shipSourceList; //sid

            //获取实时目标
            // this._initWebSocket();
            if (!this.config.isZoomEndRequest) {
                this.getRealTarget();
            }
        },

        /******************websocket部分 -start**********************/
        //websocket 初始化
        _initWebSocket: function() {
            this._websocket = new L.ICT.WebSocket(this.config.shipRealSocketUrl);
            this._websocket.onMessage(function(event) {
                var data = JSON.parse(event.data);
                L.ICT.Func["HJCX_HJXS"].getInstance().updateHJ(data);
                L.ICT.Func["HJCX_HJKZ"].getInstance().hjkzUpdateTarget(data);
                this.socketMsgHandler(data);
            }, this);
        },

        //websocket 发送实时消息
        sendMsg: function() {
            var rect = this.getCurRect(),
                mode = Project_ParamConfig.CurrentMode,
                data = [];
            //当前区域数据
            data.push(parseFloat(rect.ldlon), parseFloat(rect.ldlat), parseFloat(rect.rulon), parseFloat(rect.rulat), mode);
            // data.push(-180,-90,180,90,mode); //全球数据
            data = data.join("~");
            if (this._websocket && this._websocket.getState() === 1) {
                this._websocket.send(data);
            }
        },

        //websocket 接收消息
        socketMsgHandler: function(data) {

            if (data.state !== 1) {
                return;
            }
            if (data.msg.shipList.length <= 0) {
                return;
            }
            // if(this.ictmap.getCurZoom() < this.config.showLevel) {return ;}
            if (this.ictmap.OperateState.tshf) {
                return;
            }
            // if(this.ictmap.OperateState.port){return;}
            if (this.ictmap.OperateState.wjfx) {
                return;
            }
            if (this.ictmap.OperateState.wjfx_hdyc) {
                return;
            }


            var shipList = data.msg.shipList;
            console.log("接收到实时数据，条数：" + shipList.length);
            // console.log(JSON.stringify(shipList));

            // console.time("websocket");

            //更新目标图层
            for (var i = 0, len = shipList.length; i < len; i++) {
                var newobj = this.convertTargetObj(shipList[i]);
                if (this.isInCurBound(newobj)) {
                    this.updateOneTarget(newobj);
                }
            }

            // console.timeEnd("websocket");
        },

        //websocket推送的数据是否在当前视图范围
        isInCurBound: function(targetobj) {
            var isInCurBound = false;
            var latlng = L.latLng(targetobj.lat, targetobj.lon);
            var curbounds = this.ictmap.getBounds();
            if (curbounds.contains(latlng)) {
                isInCurBound = true;
            }
            return isInCurBound;
        },

        /******************websocket部分 -end**********************/

        /******************对外接口部分 -start**********************/
        //过滤显示 更新图层
        updateFilterLayer: function() {
            this.realtargetFeatureGroup.eachLayer(function(layer) {
                var ishide = true;
                var dataobj = layer.options.data;
                if (this.checkFilter(dataobj)) {
                    ishide = false;
                }
                if (ishide) {
                    layer.setOpacity(0);
                    // this.removeTargetEvt(layer);
                    if (layer.options.hasSelectState) {
                        this.hideShipInfoPopPanel();
                    }
                } else {
                    layer.setOpacity(1);
                    // this.addTargetEvt(layer);
                    if (layer.options.hasSelectState) {
                        this.showShipInfoPopPanel();
                    }
                }
            }, this);
        },

        //根据船舶类型获取船舶图标
        getTargetIcon: function(type) {
            var type = type.toString(),
                icon = null;
            switch (type) {
                case "货船":
                    icon = L.ICT.ShipIcon.ship1;
                    break;
                case "搜救船":
                    icon = L.ICT.ShipIcon.ship8;
                    break;
                case "油轮":
                    icon = L.ICT.ShipIcon.ship2;
                    break;
                case "拖船":
                    icon = L.ICT.ShipIcon.ship3;
                    break;
                case "渔船":
                    icon = L.ICT.ShipIcon.ship4;
                    break;
                case "客船":
                    icon = L.ICT.ShipIcon.ship5;
                    break;
                case "军事船":
                    icon = L.ICT.ShipIcon.ship6;
                    break;
                case "其他":
                    icon = L.ICT.ShipIcon.ship7;
                    break;
                default:
                    icon = L.ICT.ShipIcon.ship7;
                    // case "货船": icon=L.ICT.ShipIcon.ship1 ;break;
                    // case "搜救船": icon=L.ICT.ShipIcon.ship2 ;break;
                    // case "油轮": icon=L.ICT.ShipIcon.ship3 ;break;
                    // case "拖轮": icon=L.ICT.ShipIcon.ship7;break;
                    // case "渔船": icon=L.ICT.ShipIcon.ship4 ;break;
                    // case "拖船": icon=L.ICT.ShipIcon.ship7;break;
                    // case "客船": icon=L.ICT.ShipIcon.ship5 ;break;
                    // case "其他": icon=L.ICT.ShipIcon.ship6 ;break;
                    // default: icon=L.ICT.ShipIcon.ship7;
            }
            return icon;
        },

        //搜索定位 对外接口
        locateShip: function(data) {
            this.clearLocatLyr();
            var layer = this.getShipById(data.shipid);
            if (layer) {
                this.locateLayer(layer);
            } else {
                var url = this.config.shipInfoUrl;
                this.ajaxLocateShip.abort();
                this.ajaxLocateShip.post(url, data, true, this, function(res, error) {
                    if (error) {
                        return;
                    }
                    if (res.state !== 1) {
                        L.ict.app.util.dialog.error("提示", "获取指定船舶信息失败！");
                    } else {
                        var targetobj = this.convertshipInfoObj(res.msg);
                        var targetobjdata = this.convertTargetObj2(res.msg);
                        this._locateShiplyr = this.createMarker(targetobjdata, true);
                        this.ictmap.map.addLayer(this._locateShiplyr);
                        // this.realtargetFeatureGroup.addLayer(this._locateShiplyr);
                        this.locateLayer(this._locateShiplyr);
                    }
                });
            }
        },

        locateLayer: function(layer) {
            if (this.isRealTargetShow()) {
                this.ictmap.map.panTo(layer.getLatLng());
                layer.fire("click");
            } else {
                this.ictmap.map.setView(layer.getLatLng(), this.config.showLevel);
                layer.setOpacity(1);
                // this.addTargetEvt(layer);                              
                layer.fire("click");
            }
        },

        //清除定位图层  
        clearLocatLyr: function() {
            if (this._locateShiplyr) {
                if (this._locateShiplyr.options.hasSelectState) {
                    this.removeShipInfoPopPanel();
                }
                this.ictmap.map.removeLayer(this._locateShiplyr);
                this._locateShiplyr = null;
            }
        },

        //显示定位图层
        showLocateLayer: function() {
            if (this._locateShiplyr) {
                this._locateShiplyr.setOpacity(1);
            }
        },

        //隐藏定位图层
        hideLocateLayer: function() {
            if (this._locateShiplyr) {
                this._locateShiplyr.setOpacity(0);
            }
        },

        //通过id在当前图层中寻找目标 
        getShipById: function(id) {
            var target = null;
            var layers = this.realtargetFeatureGroup.getLayers();
            for (var i = 0, len = layers.length; i < len; i++) {
                var layer = layers[i];
                var dataobj = layer.options.data;
                if (id === dataobj.id) {
                    target = layer;
                    break;
                }
            }
            return target;
        },

        //获取在绘制范围（圆形或矩形）内的目标
        getTargetsInExtend: function(extendlyr) {
            var targets = [];
            var layers = this.realtargetFeatureGroup.getLayers();
            for (var i = 0, len = layers.length; i < len; i++) {
                var layer = layers[i];
                var latlng = layer.getLatLng();
                if (layer.options.opacity !== 0 && this.isInExtend(latlng, extendlyr)) {
                    targets.push(layer.options.data);
                }
            }
            return targets;
        },

        //判断某个点是否在绘制范围内
        isInExtend: function(latlng, extendlyr) {
            if (extendlyr instanceof L.Rectangle) {
                var bounds = extendlyr.getBounds();
                return bounds.contains(latlng);
            } else if (extendlyr instanceof L.Circle) {
                var center = extendlyr.getLatLng();
                var radius = extendlyr.getRadius();
                var distance = latlng.distanceTo(center);
                return distance <= radius;
            } else if (extendlyr instanceof L.Polygon) {
                var geojsonlayer = L.geoJSON(extendlyr.toGeoJSON());
                var polygons = leafletPip.pointInLayer(latlng, geojsonlayer, true);
                return !!polygons.length;
            } else {
                return false;
            }
        },

        //实时目标图层是否显示
        isRealTargetShow: function() {
            var isshow = false;
            if (this.realtargetFeatureGroup && this.ictmap.map.hasLayer(this.realtargetFeatureGroup) && this.ictmap.map.getZoom() >= this.config.showLevel) {
                isshow = true;
            }
            return isshow;
        },

        //显示或加载绿点图 
        showShipDistLayer: function() {
            if (this._shipdistLayer) {
                this._shipdistLayer.setOpacity(1);
            } else {
                this._shipdistLayer = new L.TileLayer.ShipDistLayer(this.config.shipDistLayerUrl);
                this.ictmap.map.addLayer(this._shipdistLayer);
            }
        },

        //隐藏绿点图
        hideShipDistLayer: function() {
            if (this._shipdistLayer) {
                this._shipdistLayer.setOpacity(0);
            }
        },

        //添加绿点图
        addShipDistLayer: function() {
            this.removeShipDistLayer();
            this._shipdistLayer = new L.TileLayer.ShipDistLayer(this.config.shipDistLayerUrl);
            this.ictmap.map.addLayer(this._shipdistLayer);
        },

        //移除绿点图
        removeShipDistLayer: function() {
            if (this._shipdistLayer && this.ictmap.map.hasLayer(this._shipdistLayer)) {
                this.ictmap.map.removeLayer(this._shipdistLayer);
                this._shipdistLayer = null;
            }
        },

        //显示实时目标
        showRealTargetLayer: function() {
            this.realtargetFeatureGroup.eachLayer(function(layer) {
                if (this.checkFilter(layer.options.data)) { //只显示符合过滤条件的目标
                    layer.setOpacity(1);
                    // this.addTargetEvt(layer);
                }
            }, this);
            this.showLocateLayer(); //显示定位图层
            this.showShipInfoPopPanel();
        },

        //隐藏实时目标
        hideRealTargetLayer: function() {
            this.realtargetFeatureGroup.eachLayer(function(layer) {
                layer.setOpacity(0);
                // this.removeTargetEvt(layer);              
            }, this);
            this.hideLocateLayer(); //隐藏定位图层
            this.hideShipInfoPopPanel();
        },

        //移除实时目标图层
        removeRealTargetLayer: function() {
            if (this.realtargetFeatureGroup) {
                this.realtargetFeatureGroup.clearLayers();
            }
            this.removeShipInfoPopPanel();
        },

        //地图加载实时目标
        addRealTargetLayer: function() {
            if (this.ictmap.getCurZoom() < this.config.showLevel) {
                this.showShipDistLayer();
                // this.removeRealTargetLayer();   
                this.hideRealTargetLayer();
            } else {
                this.hideShipDistLayer();
                // this.getRealTarget();
                this.showRealTargetLayer();
            }
        },

        //标牌显示所有船舶
        labelAllShip: function(type) {
            if (this.realtargetFeatureGroup) {
                this.realtargetFeatureGroup.eachLayer(function(layer) {
                    var content,
                        data = layer.options.data;
                    if (type === 'shipname') {
                        content = data.shipname;
                    } else {
                        content = data.id.toString();
                    }
                    layer.unbindTooltip();
                    layer.bindTooltip(content, this.getTootipOptions());
                    layer.openTooltip();
                }, this);
            }
        },

        //隐藏所有标牌
        hideAlllabel: function() {
            if (this.realtargetFeatureGroup) {
                this.realtargetFeatureGroup.eachLayer(function(layer) {
                    layer.unbindTooltip();
                }, this);
            }
        },

        /******************对外接口部分 -end**********************/

        //获取当前范围内(包括缓冲区域)的实时目标
        getRealTarget: function() {
            var url = this.config.shipRealUrl;
            var data = {};
            data.limit = this.config.limit;
            data.timeout = this.config.timeout;
            data.mode = Project_ParamConfig.CurrentMode;
            data = L.extend(data, this.getCurRectExtend());
            this._beforeMode = data.mode;
            this.stopInterval();            
            this.ajax.post(url, data, true, this, this._getRectTargetCallback);
            // this._interval = window.setInterval(function() {
            //     this.ajax.post(url, data, true, this, this._getRectTargetCallback);
            // }.bind(this), this.config.updatetime * 1000);
        },

        //请求回调
        _getRectTargetCallback: function(data, error) {
            if (error) {
                return;
            }
            if (data.state !== 1 || !data.msg.shipList || !data.msg.shipList.length) {
                console.error("未获取指定区域目标！");
                return;
            }
            L.ICT.Func["HJCX_HJXS"].getInstance().updateHJ(data);
            L.ICT.Func["HJCX_HJKZ"].getInstance().hjkzUpdateTarget(data);
            this.updateLayer(data);
        },

        stopInterval: function() {
            // if(this.ajax){
            //     this.ajax.abort();
            // }
            if (this._interval) {
                window.clearInterval(this._interval);
                this._interval = null;
            }
        },

        updateLayer: function(data) {
            var newlist = this.convertShipList(data);
            this.removeInvalidTarget(newlist);
            this.updateAllTarget(newlist);
        },

        convertShipList: function(data) {
            var shiplist = data.msg.shipList;
            var newlist = [];
            for (var i = 0, len = shiplist.length; i < len; i++) {
                var targetobj = this.convertTargetObj(shiplist[i]);
                newlist.push(targetobj);
            }
            return newlist;
        },

        convertTargetObj: function(oneinfo) {
            var onetarget = {};
            onetarget.country = this.getDetialConvertName(oneinfo.co, 'country'); //国别country 中文
            onetarget.infotype = oneinfo.mt; //信息类型 int 
            onetarget.infosrc = oneinfo.ms; //信息来源 int 0;1,2,3
            onetarget.num = oneinfo.nu; //目标编号num int
            onetarget.lon = parseFloat(oneinfo.lo / 600000); //经度
            onetarget.lat = parseFloat(oneinfo.la / 600000); //纬度
            onetarget.dir = parseFloat((oneinfo.di / 10).toFixed(1)); //船航向 int
            onetarget.heading = oneinfo.he; //船首向 int
            onetarget.shipname = oneinfo.sn.replace(/@/g, '') || '未知'; //船名 
            onetarget.shiptype = this.getDetialConvertName(oneinfo.st, 'ship_type'); //船舶类型 int
            onetarget.time = oneinfo.ti;
            onetarget.speed = oneinfo.sp / 10 || '未知';
            //test start
            // if(isNaN(onetarget.speed)){
            //   console.error('船速数据出错，原始值：'+oneinfo.sp);
            // }
            //test end
            // 自定义属性
            onetarget.id = this.getShipIdMode(oneinfo).id; // 计算后的id，作为船舶的唯一id
            onetarget.mode = this.getShipIdMode(oneinfo).mode; //自定义 当前模式
            return onetarget;
        },

        //获取船舶信息接口 
        convertTargetObj2: function(oneinfo) {
            var onetarget = {};
            onetarget.country = oneinfo.country_name.replace(/@/g, '') || "其他"; //国别country 中文
            onetarget.infotype = oneinfo.orig_info_type; //信息类型 int 
            onetarget.infosrc = oneinfo.orig_info_source; //信息来源 int 0;1,2,3
            onetarget.num = oneinfo.target_id; //目标编号num int         
            onetarget.lon = parseFloat(oneinfo.longitude / 600000); //经度
            onetarget.lat = parseFloat(oneinfo.latitude / 600000); //纬度
            onetarget.dir = parseFloat((oneinfo.direction / 10).toFixed(1)); //船航向 int
            onetarget.heading = oneinfo.heading; //船首向 int
            onetarget.shipname = oneinfo.ship_name.replace(/@/g, '') || '未知'; //船名 
            onetarget.shiptype = this.getDetialConvertName(oneinfo.ship_type, 'ship_type'); //船舶类型 int  
            onetarget.time = oneinfo.record_utc_time;
            onetarget.speed = oneinfo.speed / 10 || '未知';
            //自定义属性
            onetarget.id = this.getShipIdMode2(oneinfo).id; //计算后的id，作为船舶的唯一id    
            onetarget.mode = this.getShipIdMode2(oneinfo).mode; //当前模式 
            return onetarget;
        },

        getShipIdMode: function(targetobj) {
            var idmo = { id: null, mode: null };
            if (Project_ParamConfig.CurrentMode === 0) {
                idmo.id = targetobj.nu;
                idmo.mode = 0;
            } else {
                idmo.id = targetobj.nu;
                idmo.mode = targetobj.mt;
            }
            return idmo;
        },

        getShipIdMode2: function(targetobj) {
            var idmo = { id: null, mode: null };
            if (Project_ParamConfig.CurrentMode === 0) {
                idmo.id = targetobj.target_id;
                idmo.mode = 0;
            } else {
                idmo.id = targetobj.target_id_orig;
                idmo.mode = targetobj.targetIDOrig_Type;
            }
            return idmo;
        },

        updateAllTarget: function(newlist) {
            for (var i = 0, len = newlist.length; i < len; i++) {
                var obj = newlist[i];
                this.updateOneTarget(obj);
            }
        },

        updateOneTarget: function(obj) {
            var iscontain = false;
            var layers = this.realtargetFeatureGroup.getLayers();
            for (var i = 0, len = layers.length; i < len; i++) {
                var layer = layers[i];
                var data = layer.options.data;
                //如果当前图层有新目标，更新
                if (data.id === obj.id) {
                    iscontain = true;
                    if (this.isChange(data, obj)) { //如果目标状态发生改变
                        var latlng = L.latLng(obj.lat, obj.lon);
                        layer.setLatLng(latlng);
                        layer.setRotationAngle(obj.dir);
                        layer.options.data = obj;
                    }
                    break;
                }
            }

            //如果当前图层没有新目标，添加（可以加上个数限制）
            if (!iscontain && layers.length < this.config.limit && (this._beforeMode === Project_ParamConfig.CurrentMode)) {
                var marker = this.createMarker(obj, true);
                if (!this.isShowNewTarget(obj)) { //如果不符合过滤条件或达不到显示级别
                    marker.setOpacity(0);
                    // this.removeTargetEvt(marker);
                }
                this.realtargetFeatureGroup.addLayer(marker);
            }
        },

        //判断是否显示新增目标
        isShowNewTarget: function(obj) {
            return !this.ictmap.OperateState.tshf && !this.ictmap.OperateState.wjfx && !this.ictmap.OperateState.wjfx_hdyc && this.checkFilter(obj) && this.isRealTargetShow();
        },

        //判断当前目标位置是否改变
        isChange: function(oldtarget, newtarget) {
            var ischange = false;
            if (newtarget.lat !== oldtarget.lat || newtarget.lon !== oldtarget.lon) {
                ischange = true;
            }
            return ischange;
        },

        //创建实时目标图标 --isAddEvent 是否添加单击和右击事件 默认不添加
        createMarker: function(targetobj, isAddEvent) {
            var isAddEvent = isAddEvent ? isAddEvent : false;
            var latlng = L.latLng(targetobj.lat, targetobj.lon),
                tipText = targetobj.shipname,
                targetIcon = this.getTargetIcon(targetobj.shiptype);
            // var markOptions = {
            //     icon: targetIcon,
            //     opacity: 1,
            //     rotationAngle: targetobj.dir, //方向，正北是0，顺时针，共360，
            //     rotationOrigin: 'center center', //船舶旋转的参考点
            //     title: tipText, //添加鼠标移上后的提示信息
            //     data: targetobj
            // };
            var markOptions = {
                stroke: false,
                color: '#ef0300',
                fillColor: '#ef0300',
                fillOpacity: 1,
                radius: 10,
                data: targetobj,
                pane: 'markerPane',
                className: 'leaflet-marker-rightclick-icon'
            };
            // markOptions.icon.options.className = "leaflet-marker-rightclick-icon";
            // var Lmarker = L.marker(latlng, markOptions);
            var Lmarker = L.shipVector(latlng, markOptions);

            //标牌显示
            if (this.ictmap.labelType) {
                var content = null;
                if (this.ictmap.labelType === 'shipname') {
                    content = targetobj.shipname.toString();
                } else if (this.ictmap.labelType === 'id') {
                    content = targetobj.id.toString();
                }
                Lmarker.bindTooltip(content, this.getTootipOptions());
                Lmarker.openTooltip();
            }

            if (isAddEvent) {
                this.addTargetEvt(Lmarker);
            }

            return Lmarker;
        },

        getTootipOptions: function() {
            return {
                offset: [0, 0],
                direction: "top",
                permanent: true,
                opacity: 0.8
            };
        },

        //过滤目标
        checkFilter: function(targetobj) {

            // return true; //test

            var shipTypeRes = false,
                shipFlagRes = false,
                shipSourceRes = false;

            //信息源
            var target_key = targetobj.infosrc.toString();
            if (this.shipSourceList.indexOf(target_key) !== -1) {
                shipSourceRes = true;
            }

            //信息类型
            var target_key = targetobj.shiptype.toString();
            if (this.shipTypeList.indexOf(target_key) !== -1) {
                shipTypeRes = true;
            }

            //船旗
            var target_key = targetobj.country.toString();
            if (this.shipFlagList.indexOf(target_key) !== -1) {
                shipFlagRes = true;
            }

            return shipTypeRes && shipFlagRes && shipSourceRes;
        },

        //去除当前图层中无效的目标
        removeInvalidTarget: function(newlist) {
            var layers = this.realtargetFeatureGroup.getLayers();
            for (var i = 0, len = layers.length; i < len; i++) {
                var layer = layers[i];
                var dataobj = layer.options.data;
                if (!this.isContain(dataobj, newlist)) {
                    // if(dataobj.id == '1959'){  //test
                    //   alert('不在当前区域');
                    // }
                    this.realtargetFeatureGroup.removeLayer(layer);
                }
            }
        },

        //数组是否包含某个目标
        isContain: function(obj, arr) {
            var iscontain = false;
            for (var i = 0, len = arr.length; i < len; i++) {
                if (arr[i].id === obj.id) {
                    iscontain = true;
                    break;
                }
            }
            return iscontain;
        },

        //添加事件
        addTargetEvt: function(target) {
            //添加鼠标右键点击事件
            target.on("contextmenu", this._markerRightClickEvt, this);
            //添加鼠标单击事件
            target.on("click", this._markerClickEvt, this);
        },

        //移除事件
        removeTargetEvt: function(target) {
            //添加鼠标右键点击事件
            target.off("contextmenu", this._markerRightClickEvt, this);
            //添加鼠标单击事件
            target.off("click", this._markerClickEvt, this);
        },

        //鼠标右键点击事件
        _markerRightClickEvt: function(e) {
            L.DomEvent.stopPropagation(e);
            var mapcontainer = this.ictmap.map.getContainer();
            var x = e.containerPoint.x + mapcontainer.offsetLeft;
            var y = e.containerPoint.y + mapcontainer.offsetTop;
            this.currentTarget = e.target;
            //调出右键菜单
            $('#mappanel').contextMenu(false);
            $('.leaflet-marker-rightclick-icon').contextMenu(true);
            $('.leaflet-marker-rightclick-icon').contextMenu({ x: x, y: y });
        },

        //初始化右键菜单
        initContextMenu: function() {
            var self = this;
            $.contextMenu({
                selector: '.leaflet-marker-rightclick-icon', //选择右键菜单触发的元素
                trigger: 'none',
                callback: function(key, options) {
                    self._rightClickCallback(key, options);
                },
                items: {
                    "bpxs": {
                        "name": "标牌显示",
                        "items": {
                            "bpxs-shipname": { "name": "船名" },
                            "bpxs-ph": { "name": "批号" },
                            "bpxs-all": { "name": "目标信息" }, //test
                            "bpxs-close": { "name": "关闭显示" }
                        }
                    },
                    "hjxs": { "name": "航迹显示" },
                    "xskz": {
                        "name": "显示控制",
                        "items": {
                            "xskz-key1": { "name": "全航迹" },
                            "xskz-key2": { "name": "10点" },
                            "xskz-key3": { "name": "100点" },
                            "xskz-key4": { "name": "1000点" }
                        }
                    },
                    "tshf": { "name": "态势回放" },
                    "addhf": { "name": "加入回放列表" }
                }
            });
        },

        //右键回调
        _rightClickCallback: function(key, options) {
            var curtarget = this.currentTarget;
            var curobj = curtarget.options.data;
            if (key === 'bpxs-shipname') {
                var shipname = curobj.shipname;
                curtarget.unbindTooltip();
                curtarget.bindTooltip(shipname, this.getTootipOptions());
                curtarget.openTooltip();

            } else if (key === 'bpxs-ph') {
                var ph = curobj.id.toString();
                curtarget.unbindTooltip();
                curtarget.bindTooltip(ph, this.getTootipOptions());
                curtarget.openTooltip();

            } else if (key === 'bpxs-all') { //目标信息显示标签
                var lat = L.ict.app.util.tool.latlngTodfmStr(curobj.lat, 'lat');
                var lng = L.ict.app.util.tool.latlngTodfmStr(curobj.lon, 'lng');
                var time = L.ict.app.util.dateTime.getTimeStrFromUnix(curobj.time);
                var info = "船舶编号：" + curobj.num + "<br>" +
                    "船名：" + curobj.shipname + "<br>" +
                    "船舶类型：" + curobj.shiptype + "<br>" +
                    "经度：" + lat + "<br>" +
                    "纬度：" + lng + "<br>" +
                    "航向：" + curobj.dir + "<br>" +
                    "船首向：" + curobj.heading + "<br>" +
                    "时间：" + time + "<br>" +
                    "船速：" + curobj.speed + "节<br>" +
                    "国家：" + curobj.country + "<br>" +
                    "信息类型：" + this.getDetialConvertName(curobj.infotype, "orig_info_type") + "<br>" +
                    "信息来源：" + this.getDetialConvertName(curobj.infosrc, "orig_info_source") + "<br>" +
                    "id：" + curobj.id;
                curtarget.unbindTooltip();
                curtarget.bindTooltip(info, this.getTootipOptions());
                curtarget.openTooltip();

            } else if (key === 'bpxs-close') {
                curtarget.unbindTooltip();

            } else if (key === "hjxs") {
                var hjxsObj = L.ICT.Func["HJCX_HJXS"].getInstance();
                hjxsObj.start();

            } else if (key === "xskz-key1") {
                var xskzObj = L.ICT.Func["HJCX_HJKZ"].getInstance();
                xskzObj.start(0);

            } else if (key === "xskz-key2") {
                var xskzObj = L.ICT.Func["HJCX_HJKZ"].getInstance();
                xskzObj.start(10);

            } else if (key === "xskz-key3") {
                var xskzObj = L.ICT.Func["HJCX_HJKZ"].getInstance();
                xskzObj.start(100);

            } else if (key === "xskz-key4") {
                var xskzObj = L.ICT.Func["HJCX_HJKZ"].getInstance();
                xskzObj.start(1000);

            } else if (key === "tshf") {
                L.ICT.Func["TSHFOneShip"].run();

            } else if (key === "addhf") {
                var tshfinstance = L.ICT.Func["TSHFMoreShip"].getInstance();
                tshfinstance.addTarget(curobj);
                if (tshfinstance._targetPanel) {
                    tshfinstance.updateList();
                } else {
                    L.ict.app.util.dialog.success("提示", "成功加入回放列表！");
                }
            }
        },

        //鼠标单击事件
        _markerClickEvt: function(event) {
            var curship = event.target,
                url = this.config.shipInfoUrl,
                data = {};
            data.shipid = event.target.options.data.id;
            data.mode = event.target.options.data.mode;
            this.currentTarget = event.target;
            this.removeSelectMarker();
            this.createSelectMarker(event);
            this.ajaxShipInfo.abort();
            this.ajaxShipInfo.post(url, data, true, this, function(res, error) {
                if (error) {
                    return;
                }
                if (res.state !== 1) {
                    L.ict.app.util.dialog.error("提示", "获取指定船舶信息失败！");
                    this.removeShipInfoPopPanel();
                } else {
                    var targetobj = this.convertshipInfoObj(res.msg);
                    this.createShipInfoPopPanel(targetobj);
                    this._initPopEvt();
                }
            });
        },

        //船舶图标选中状态
        createSelectMarker: function(event) {
            var latlng = event.target.getLatLng();
            var divIcon = L.divIcon({
                iconSize: [26, 26],
                iconAnchor: [13, 13],
                className: 'ict_markerselect_divicon'
            });
            this._shipSelectMarker = L.marker(latlng, { icon: divIcon });
            this._shipSelectMarker.on("contextmenu", function(contextmenuEvt) {
                var data = {};
                data.containerPoint = contextmenuEvt.containerPoint;
                data.layerPoint = contextmenuEvt.layerPoint;
                data.latlng = event.target.getLatLng();
                event.target.fire("contextmenu", data);
            }, this);
            this._shipSelectMarker.on("click", function(clickEvt) {
                var data = {};
                data.containerPoint = clickEvt.containerPoint;
                data.layerPoint = clickEvt.layerPoint;
                data.latlng = event.target.getLatLng();
                event.target.fire("click", data);
            }, this);
            this._shipSelectMarker.addTo(this.ictmap.map);
            $(".ict_markerselect_divicon").css('border', 'dotted 3px #f00');
            //监听图标移动事件
            event.target.options.hasSelectState = true;
            event.target.on("move", function(e) {
                if (this._shipSelectMarker && event.target.options.hasSelectState) {
                    this._shipSelectMarker.setLatLng(e.target.getLatLng());
                }
            }, this);
        },

        removeSelectMarker: function() {
            if (this._shipSelectMarker) {
                this._shipSelectMarker.remove();
                this._shipSelectMarker = null;
                this.clearSelectState();
            }
        },

        showSelectMarker: function() {
            if (this._shipSelectMarker) {
                this._shipSelectMarker.setOpacity(1);
            }
        },

        hideSelectMarker: function() {
            if (this._shipSelectMarker) {
                this._shipSelectMarker.setOpacity(0);
            }
        },

        clearSelectState: function() {
            var layers = this.realtargetFeatureGroup.getLayers();
            for (var i = 0, len = layers.length; i < len; i++) {
                var layer = layers[i];
                if (layer.options.hasSelectState) {
                    layer.options.hasSelectState = false;
                }
            }
        },

        //船舶信息弹框
        createShipInfoPopPanel: function(targetobj) {
            if (this._shipinfoPopPanel) {
                this.showShipInfoPopPanel();
                this._shipinfoPopPanel.setContent(this.getPopupContent(targetobj));
                return;
            }
            var options = {
                title: '船舶信息',
                width: 460,
                height: 330,
                right: 40,
                top: 80,
                disableSelect: false,
                className: 'ict_realTarget_popupContainer',
                contentHTML: this.getPopupContent(targetobj)
            };
            this._shipinfoPopPanel = new L.ICT.PopPanel(options);
            this._shipinfoPopPanel.on("popPanelRemove", function() {
                this._shipinfoPopPanel = null;
                this.removeSelectMarker();
            }, this);
            this._shipinfoPopPanel.show();
        },

        removeShipInfoPopPanel: function() {
            if (this._shipinfoPopPanel) {
                this._shipinfoPopPanel.remove();
                this._shipinfoPopPanel = null;
            }
        },

        showShipInfoPopPanel: function() {
            if (this._shipinfoPopPanel) {
                this._shipinfoPopPanel.show();
                this.showSelectMarker();
            }
        },

        hideShipInfoPopPanel: function() {
            if (this._shipinfoPopPanel) {
                this._shipinfoPopPanel.close();
                this.hideSelectMarker();
            }
        },

        //船舶详细信息
        convertshipInfoObj: function(shipobj) {
            var obj = {};
            obj.id = shipobj.target_id === -1 ? shipobj.target_id_orig : shipobj.target_id; //目标唯一标识号
            obj.record_utc_time = shipobj.record_utc_time; //最后更新时间 unix时间戳
            obj.lon = parseFloat(shipobj.longitude / 600000); //经度
            obj.lat = parseFloat(shipobj.latitude / 600000); //纬度
            obj.di = parseFloat(shipobj.direction / 10).toFixed(1); //航向
            obj.he = shipobj.heading; //船艏向
            obj.sp = shipobj.speed / 10; //船速（节）
            obj.st = this.getDetialConvertName(shipobj.status, "status"); //状态
            obj.rot = shipobj.rot_sensor; //转向率
            obj.type = this.getDetialConvertName(shipobj.orig_info_type, "orig_info_type"); //信息类型
            obj.src = this.getDetialConvertName(shipobj.orig_info_source, "orig_info_source"); //信息来源
            obj.target_id_orig = shipobj.target_id_orig; //原始模式的目标编号
            obj.mmsi = shipobj.mmsi;
            obj.sn = shipobj.ship_name.replace(/@/g, '') || '未知'; //船名
            obj.call_sign = shipobj.call_sign.replace(/@/g, '') || '未知'; //呼号
            obj.imo = shipobj.imo_number; //imo编号
            obj.des = shipobj.destination; //目的港口
            obj.eta = shipobj.eta; //预计到达时间
            obj.draft = shipobj.draft; //目前最大静态吃水
            obj.cn = shipobj.country_name.replace(/@/g, '') || '其他'; //国家名
            obj.ship_type = this.getDetialConvertName(shipobj.ship_type, "ship_type"); //船舶类型
            obj.cargo_type = shipobj.cargo_type; //货物类型
            obj.ship_length = shipobj.ship_length; //船长（米）
            obj.ship_breadth = shipobj.ship_breadth; //船宽（米）
            obj.fixing_device = this.getDetialConvertName(shipobj.fixing_device, "fixing_device"); //电子定位装置
            obj.pos_accuracy = this.getDetialConvertName(shipobj.pos_accuracy, "pos_accuracy"); //船位精度
            obj.commun_state = this.getDetialConvertName(shipobj.commun_state, "commun_state"); //通信状态
            return obj;
        },

        getPopupContent: function(targetobj) {
            var lat = L.ict.app.util.tool.latlngTodfmStr(targetobj.lat, 'lat');
            var lng = L.ict.app.util.tool.latlngTodfmStr(targetobj.lon, 'lng');
            var time = L.ict.app.util.dateTime.getTimeStrFromUnix(targetobj.record_utc_time);
            var html = [];
            html.push('<div class="shipInfo_Div">');
            html.push('<div class="shipInfo_table_div">');
            html.push('<table data-id="' + targetobj.id + '">');
            html.push('<tr><td width="18%">批号:</td><td>' + targetobj.id + '</td><td width="18%">信息源:</td><td>' + targetobj.src + '</td></tr>');
            html.push('<tr><td>船名:</td><td>' + targetobj.sn + '</td><td>MMSI:</td><td>' + targetobj.mmsi + '</td></tr>');
            html.push('<tr><td>IMO:</td><td>' + targetobj.imo + '</td><td>呼号:</td><td>' + targetobj.call_sign + '</td></tr>');
            html.push('<tr><td>时间:</td><td>' + time + '</td><td>地区:</td><td>' + targetobj.cn + '</td></tr>');
            html.push('<tr><td>航行状态:</td><td>' + targetobj.st + '</td><td>航向:</td><td>' + targetobj.di + '°</td></tr>');
            html.push('<tr><td>经度:</td><td>' + lng + '</td><td>纬度:</td><td>' + lat + '</td></tr>');
            html.push('<tr><td>航艏向:</td><td>' + targetobj.he + '°</td><td>转向率:</td><td>' + targetobj.rot + '</td></tr>');
            html.push('<tr><td>航速:</td><td>' + targetobj.sp + '节</td><td>通信状态:</td><td>' + targetobj.commun_state + '</td></tr>');
            html.push('<tr><td>船舶类型:</td><td>' + targetobj.ship_type + '</td><td>信息类型:</td><td>' + targetobj.type + '</td></tr>');
            html.push('</table>');
            html.push('</div>');
            html.push('<div class="btnDiv">');
            html.push('<button type="button" data-id="' + targetobj.id + '" class="daxx">档案信息</button>');
            html.push('</div>');
            html.push('</div>');
            return html.join("");
        },

        _initPopEvt: function() {
            var self = this;
            $(".ict_realTarget_popupContainer .btnDiv>button").on("click", function(e) {
                var id = $(this).data('id');
                // window.location.href = 'resultpage/shiprecord.html'; //在同一窗口打开
                window.open('resultpage/shiprecord.html'); //在新窗口打开
            });
        },

        getDetialConvertName: function(code, type) {
            var res = "";
            if (code.toString) code = code.toString();
            if (type == "ship_type") { //船舶类型
                switch (code) {
                    case "1":
                        res = "货船";
                        break;
                    case "2":
                        res = "搜救船";
                        break;
                    case "3":
                        res = "油轮";
                        break;
                    case "4":
                        res = "拖船";
                        break;
                    case "5":
                        res = "渔船";
                        break;
                    case "6":
                        res = "客船";
                        break;
                    case "7":
                        res = "军事船";
                        break;
                    default:
                        res = "其他";
                }
            } else if (type == "country") { //国别
                switch (code) {
                    case "中国":
                        res = "中国";
                        break;
                    case "美国":
                        res = "美国";
                        break;
                    case "英国":
                        res = "英国";
                        break;
                    case "法国":
                        res = "法国";
                        break;
                    case "俄罗斯":
                        res = "俄罗斯";
                        break;
                    default:
                        res = "其他";
                }
            } else if (type == "hwlx") { //货物类型
                res = code;
            } else if (type == "status") { //航行状态
                switch (code) {
                    case "0":
                        res = "机动船在航";
                        break;
                    case "1":
                        res = "锚泊";
                        break;
                    case "2":
                        res = "船舶失控";
                        break;
                    case "3":
                        res = "船舶操作受限";
                        break;
                    case "4":
                        res = "受吃水限制，船舶行动受限";
                        break;
                    case "5":
                        res = "系泊";
                        break;
                    case "6":
                        res = "搁浅";
                        break;
                    case "7":
                        res = "从事捕捞";
                        break;
                    case "8":
                        res = "船舶在航";
                        break;
                    default:
                        res = "未知";
                }
            } else if (type == "fixing_device") { //电子定位装置
                switch (code) {
                    case "-1":
                        res1 = "非法";
                        break;
                    case "0":
                        res = "默认";
                        break;
                    case "1":
                        res = "GPS";
                        break;
                    case "2":
                        res = "GLONASS";
                        break;
                    case "3":
                        res = "GPS/GLONASS组合";
                        break;
                    case "4":
                        res = "Loran-C";
                        break;
                    case "5":
                        res = "Chayka";
                        break;
                    case "6":
                        res = "综合导航系统";
                        break;
                    case "7":
                        res = "观测";
                        break;
                    case "8":
                        res = "北斗";
                        break;
                    case "9":
                    case "10":
                    case "11":
                    case "12":
                    case "13":
                    case "14":
                        res = "未使用";
                        break;
                    case "15":
                        res = "内部GNSS";
                        break;
                    default:
                        res = code;
                }
            } else if (type == "commun_state") { //通信状态
                switch (code) {
                    case "0":
                        res = "未知";
                        break;
                    case "1":
                        res = "SOTDMA";
                        break;
                    case "2":
                        res = "ITDMA";
                        break;
                    default:
                        res = code;
                }
            } else if (type == "pos_accuracy") { //船位精度
                switch (code) {
                    case "0":
                        res = "未知";
                        break;
                    case "1":
                        res = "定位误差大于10米";
                        break;
                    case "2":
                        res = "定位误差小于等于10米";
                        break;
                    default:
                        res = code;
                }
            } else if (type == "orig_info_source") { //信息来源
                switch (code) {
                    case "1":
                        res = "农业部";
                        break;
                    case "2":
                        res = "海事局";
                        break;
                    case "3":
                        res = "海监";
                        break;
                    default:
                        res = code;
                }
            } else if (type == "orig_info_type") { //信息类型
                switch (code) {
                    case "1":
                        res = "Argos及海事卫星";
                        break;
                    case "2":
                        res = "北斗";
                        break;
                    case "3":
                        res = "AIS静态";
                        break;
                    case "4":
                        res = "AIS动态";
                        break;
                    case "5":
                        res = "LRIT";
                        break;
                    case "7":
                        res = "海监";
                        break;
                    case "15":
                        res = "综合信息";
                        break;
                    default:
                        res = code;
                }
            }
            return res;
        },

        //获取范围
        getCurRect: function() {
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

        getCurRectExtend: function() {
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
