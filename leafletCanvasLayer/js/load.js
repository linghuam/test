var map = L.map('map', {
    center: [49, 116],
    zoom: 6
});

// L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
// }).addTo(map);

L.tileLayer.GoogleLayer().addTo(map);


/*
 * 1 采用SVG绘制矢量图
 * 用一个svg包裹船舶，性能和交互效果都比较好
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
        // circlemarker.addTo(map);
	}
	L.featureGroup(layers,{pane:'markerPane'}).addTo(map);
	console.timeEnd("render");
});


/*
 * 2 按区域使用canvas作为切片加载
 * 将船舶批量绘制在canvas上，性能很好，但动态交互实现太复杂
 */
// L.canvastilelayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png').addTo(map);


/*
 * 3 船舶例子
 * 每个船舶是一个canvas，性能与使用图片差不多
 */
/*var boats = [];
for(var i=0;i<5000;i++){
	var boatMarker = L.boatMarker(map.getCenter(), { color: "#f1c40f" });
	boatMarker.setHeading(30);	
	boats.push(boatMarker);
}
var boatsFeatureGroup = L.featureGroup(boats);
map.addLayer(boatsFeatureGroup);*/


/*
 * 4 leaflet-vector-markers
 * 每个船舶是一个svg，性能与使用图片差不多
 */
// $.getJSON('data/data.json', function(res) {
//     var data = res.msg.data;
//     var layers = [];
//     console.time("render");
//     var redMarker = L.VectorMarkers.icon({
//         icon: 'coffee',
//         markerColor: 'red'
//     });
//     for (var i = 0, len = data.length; i < 5000; i++) {
//         var obj = data[i];
//         var latlng = L.latLng(obj.lat, obj.lon);
//         var marker = L.marker(latlng, { icon: redMarker }).addTo(map);
//         layers.push(marker);
//     }
//     // L.featureGroup(layers, { pane: 'markerPane' }).addTo(map);
//     console.timeEnd("render");
// });
