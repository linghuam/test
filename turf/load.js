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



// Parse local CSV file
// Papa.parse('data.csv', {
//     download: true,
//     complete: function(results) {
//         console.log("Finished:", results.data);
//         var points = {
//             type: "FeatureCollection",
//             features: []
//         };
//         for (var i = 0, len = results.data.length; i < len; i++) {
//             var row = results.data[i];
//             var lat = +row[0];
//             var lng = +row[1];
//             var value = +row[2];
//             var point = {
//                 type: 'Feature',
//                 bbox: [-180.0, -90.0, 180.0, 90.0],
//                 geometry: {
//                     type: 'Point',
//                     coordinates: [lng, lat]
//                 },
//                 properties: {
//                     z: value
//                 }
//             };
//             points.features.push(point);
//         }
//         var breaks = [0,0.1,0.2,0.3,0.4,0.5,0.6,0.7];
//         var isolined = turf.isolines(points, 'z', 15, breaks);
//         L.geoJSON(isolined).addTo(map);
//     }
// });


Papa.parse('data.csv', {
    download: true,
    complete: function(results) {
        console.log("Finished:", results.data);
    },
    step: function(results, parser) {
        if (results.data[0][0] === '' && this.arr.length) {
            // console.log(JSON.stringify(this.arr));

            // handler data -------------start------------------------
            var latlngs = [];
            for (var i = 0, len = this.arr.length; i < len; i++) {
                var row = this.arr[i];
                var lat = +row[0];
                var lng = +row[1];
                var value = +row[2];
                var latlng = L.latLng(lat, lng);

                if (i === 0) {
                    latlngs.push(latlng);
                } else {
                    var lastlng = (latlngs[latlngs.length - 1]).lng;
                    var extend = Math.abs(lng - lastlng);
                    if (extend >= 180) {  //解决经度范围超过180连线异常
                        L.polyline(latlngs).addTo(map);
                        latlngs = [];
                        latlngs.push(latlng);
                    } else {
                    	latlngs.push(latlng);
                        if (i === len - 1) {
                            L.polyline(latlngs).addTo(map);
                            latlngs = [];
                        }
                    }
                }
            }
            // handler datq ----------------end-----------------------------
            // 
            this.arr = [];
        } else {
            if (this.arr) {
                this.arr.push(results.data[0]);
            } else {
                this.arr = [];
            }
        }
    }
});
