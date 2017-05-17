var map = L.map('map', {
    center: [30, 116],
    zoom: 4
});
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

// Parse local CSV file
Papa.parse('data.csv', {
    download: true,
    complete: function(results) {
        console.log("Finished:", results.data);
        var points = {
            type: "FeatureCollection",
            features: []
        };
        for (var i = 0, len = results.data.length; i < len; i++) {
            var row = results.data[i];
            var lat = +row[0];
            var lng = +row[1];
            var value = +row[2];
            var point = {
                type: 'Feature',
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
        var breaks = [0, 0.2, 0.4, 0.6,  0.8, 1,1.2,1.4];
        var isolined = turf.isolines(points, 'z', 15, breaks);
        L.geoJSON(isolined).addTo(map);
    }
});
