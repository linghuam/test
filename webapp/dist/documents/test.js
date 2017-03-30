//定位北京
var latlng = L.latLng(39.901309,116.405640);
L.marker(latlng).addTo(L.ict.app.ictmap.map);

var x = L.GPS.transform(39.901309,116.405640);

//华盛顿
var latlng = L.latLng(38.666915440148564,283.18359375000006);
L.marker(latlng).addTo(L.ict.app.ictmap.map);

//纠偏后
var latlng = L.latLng(39.90271252296095,116.41188241553021);
L.marker(latlng).addTo(L.ict.app.ictmap.map);

//找出国别为中国的图层并定位
 L.ict.app.ictmap.realtarget._realTargetFeatureGroup.eachLayer(function(layer){
        if(layer.options.data.country === "中国" && layer.options.opacity !== 0){
        	L.ict.app.ictmap.map.panTo(layer.getLatLng());
        	layer.fire("click");
        }
 });

http://www.myships.com/myships/map/ShipMap.swf?ver=1.4

 首次请求
 1、直接添加所有船舶图层
 2、初始化事件
 3、设置透明度
 
 后续请求，在原来基础上更新
 对每个后续目标，
 1、以前有的（交集），更新
 2、以前没有的（差集），添加
 
//
4km:[18.24782,109.4357] [18.175744,109.5116]
50km:[18.66223,108.9994] [17.76133,109.94784]

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

},   

function utcToBJ(utc){    
    var t = parseInt(utc);   
    

}

{"lat":39.89636506582549,"lng":116.47705078125001} epsg:3395
{"lat":39.91394967016644,"lng":116.39465332031251} epsg:3857

offsetLat:0.01758460434094644   0.1978457170017336
offsetLng:-0.0823974609375  

