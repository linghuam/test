
var mymap = L.map('map',{
	center:[49,116],
	zoom:6
});

// L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
// }).addTo(mymap);

L.tileLayer.GoogleLayer().addTo(mymap);

/*
* 采用SVG绘制矢量图
 */
$.getJSON('data/data.json',function(res){
	var data = res.msg.data;
	var options = {stroke:false,color:'#ef0300',fillColor:'#ef0300',fillOpacity:1,radius:4,pane:'markerPane'};
	var layers = [];
	console.time("render");
	for(var i=0,len=data.length;i<len;i++){
		var obj = data[i];
		var latlng = L.latLng(obj.lat,obj.lon);
		options.data = obj.v;
        var circlemarker = L.circleMarker(latlng,options);
        circlemarker.on("click",function(e){
        	alert(e.target.options.data);
        },this);
        circlemarker.bindTooltip('shipship');
        layers.push(circlemarker);
        // circlemarker.addTo(mymap);
	}
	L.featureGroup(layers,{pane:'markerPane'}).addTo(mymap);
	console.timeEnd("render");
})

/*
按区域使用canvas作为切片加载
 */
// L.canvastilelayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png').addTo(mymap);

/*
船舶例子
 */
/*var boats = [];
for(var i=0;i<5000;i++){
	var boatMarker = L.boatMarker(mymap.getCenter(), { color: "#f1c40f" });
	boatMarker.setHeading(30);	
	boats.push(boatMarker);
}
var boatsFeatureGroup = L.featureGroup(boats);
mymap.addLayer(boatsFeatureGroup);*/

