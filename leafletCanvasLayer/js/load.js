var map = L.map('map', {
    center: [30, 116],
    zoom: 4
});

// L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
// }).addTo(map);

L.tileLayer.GoogleLayer().addTo(map);


/*
 * 1 采用SVG绘制矢量图  https://developer.mozilla.org/docs/Web/SVG
 * 用一个svg包裹船舶，性能和交互效果都比较好
 * renderer:L.canvas()  在canvas上绘制矢量图，效率比svg好，但leaflet对事件支持不太好
 * renderer:L.svg() 在svg上绘制矢量图，对事件支持较好，但效率比canvas差
 */
$.getJSON('data/data.json', function(res) {
    var data = res.msg.data;
    var options = { stroke: false, color: '#ef0300', fillColor: '#ef0300', fillOpacity: 1, radius: 4, pane: 'markerPane', className: 'leaflet-shipmarker' };
    var layers = [];
    console.time("render");
    for (var i = 0, len = data.length; i < len; i++) {
        var obj = data[i];

        var latlng = L.latLng(obj.lat, obj.lon);
        options.data = obj.v;
        var circlemarker = L.shipVector(latlng, options);
        circlemarker.on("click", function(e) {
            alert(e.target.options.data);
        }, this);
        circlemarker.bindTooltip('shipship');
        layers.push(circlemarker);

        // var latlngbounds = L.latLngBounds(L.latLng(obj.lat,obj.lon),L.latLng(obj.lat+1,obj.lon+1));
        // layers.push(L.rectangle(latlngbounds));
    }
    L.featureGroup(layers).addTo(map);
    console.timeEnd("render");

    //contextmenu 
    $.contextMenu({
        selector: '.leaflet-shipmarker', //选择右键菜单触发的元素
        items: {
            foo: { name: "Foo", callback: function(key, opt) { alert("Foo!"); } },
            bar: { name: "Bar", callback: function(key, opt) { alert("Bar!") } }
        }
    });
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
// var boats = [];
// for(var i=0;i<1;i++){
// 	var boatMarker = L.boatMarker(map.getCenter(), { color: "#f1c40f" });
// 	boatMarker.setHeading(30);	
// 	boats.push(boatMarker);
// }
// var boatsFeatureGroup = L.featureGroup(boats);
// map.addLayer(boatsFeatureGroup);

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
