var map = L.map('map', {
    center: [30, 116],
    zoom: 4
});
map.on("mousemove", function(e) {
    var latlng = e.latlng;
    $('#msg').text(JSON.stringify(latlng));
}, this);
L.tileLayer.GoogleLayer().addTo(map);

// create random points with random
// z-values in their properties
// var points = turf.random('point', 100, {
//   bbox: [0, 30, 20, 50]
// });
// for (var i = 0; i < points.features.length; i++) {
//   points.features[i].properties.z = Math.random() * 10;
// }
// var breaks = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
// var isolined = turf.isolines(points, 'z', 15, breaks);
// L.geoJSON(isolined).addTo(map);

d3.json('d3.json', function(data) {
    var points = {
        type: "FeatureCollection",
        features: []
    };
    for (var i = 0, len = data.length; i < len; i++) {
        var row = data[i];
        var lat = +row['lat'];
        var lng = +row['lng'];
        var value = +row['value'];
        var point = {
            type: 'Feature',
            bbox: [-180.0, -90.0, 180.0, 90.0],
            geometry: {
                type: 'Point',
                coordinates: [lng, lat]
            },
            properties: {
                z: value
            }
        };
        points.features.push(point);
    }
    var breaks = d3.range(2, 800, 10);
    // isobands弃用 https://gis.stackexchange.com/questions/198482/turf-isobands-doesnt-work/207075#207075?newreg=b8ac26f38a0c411e928cd37e3391d6f8
    // var isobands = turf.isobands(points,breaks,'z',{}); 
    var isolined = turf.isolines(points, 'z', 50, breaks);
    L.geoJSON(isolined).addTo(map);
});
