var map = L.map('map', {
    center: [30, 116],
    zoom: 4
});
map.on("mousemove", function(e) {
    var latlng = e.latlng;
    $('#msg').text(JSON.stringify(latlng));
}, this);
L.tileLayer.GoogleLayer().addTo(map);


var OceanWeather = {};
OceanWeather.pressure = function() {
    PapaParse('data/pressure.csv');
}
OceanWeather.mb500 = function() {
    PapaParse('data/500mb.csv');
}
OceanWeather.wind = function() {
    PapaParse('data/wind.csv');
}
OceanWeather.waveheight = function() {
    PapaParse('data/waveheight.csv');
}
OceanWeather.surge = function() {
    PapaParse('data/surge.csv');
}
OceanWeather.flow = function() {
    PapaParse('data/flow.csv');
}
OceanWeather.temperature = function() {
    PapaParse('data/temperature.csv');
}
OceanWeather.visibility = function() {
    PapaParse('data/visibility.csv');
}

var featueGroup = L.featureGroup([]).addTo(map);

function PapaParse(url) {
    featueGroup.clearLayers();
    this.arr = [];
    Papa.parse(url, {
        download: true,
        complete: function(results) {
            // console.log("Finished:", results.data);
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
                        if (extend >= 180) { //解决经度范围超过180连线异常
                            featueGroup.addLayer(L.polyline(latlngs));
                            latlngs = [];
                            latlngs.push(latlng);
                        } else {
                            latlngs.push(latlng);
                            if (i === len - 1) {
                                featueGroup.addLayer(L.polyline(latlngs));
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
}
