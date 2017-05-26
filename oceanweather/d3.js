/*
 * https://github.com/d3/d3-contour
 * https://en.wikipedia.org/wiki/Marching_squares
 * http://blog.csdn.net/silangquan/article/details/47054309
 */
OceanWeather.d3 = function() {
    if (map.hasLayer(this.d3Overlay)) { map.removeLayer(this.d3Overlay); }
    this.d3Overlay = L.d3SvgOverlay(function(selection, projection) {
        d3Draw(selection, projection);
    });
    map.addLayer(this.d3Overlay);
};

function d3Draw(selection, projection) {
    d3.json('data/geojson.json', function(data) {
        selection.append("path")
            .datum(data)
            .attr("d", d3.geoPath());
    });
}
