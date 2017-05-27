/*
 * https://github.com/d3/d3-contour
 * https://en.wikipedia.org/wiki/Marching_squares
 * http://blog.csdn.net/silangquan/article/details/47054309
 * https://bost.ocks.org/mike/leaflet/
 */
OceanWeather.d3 = function() {
    if (map.hasLayer(this.d3Overlay)) { map.removeLayer(this.d3Overlay); }
    this.d3Overlay = L.d3SvgOverlay(function(selection, projection) {
        d3DrawChina(selection, projection);
    });
    map.addLayer(this.d3Overlay);
};

function d3DrawChina(selection, projection) {

    d3.json('data/geojson.json', function(data) {

        var transform = d3.geoTransform({
            point: function(x, y) {
            	var pt = projection.latLngToLayerPoint(L.latLng(y,x));
                this.stream.point(pt.x, pt.y);
            }
        });
        selection.append("path")
            .datum(data)
            .attr("d", d3.geoPath().projection(transform));
    });
}
