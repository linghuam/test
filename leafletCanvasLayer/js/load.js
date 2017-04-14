
var mymap = L.map('map',{
	center:[49,116],
	zoom:6,
	timer: 1000  // seconds
});

// L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
// }).addTo(mymap);

L.tileLayer.GoogleLayer().addTo(mymap);

var clayer = new L.CanvasTileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png');
mymap.addLayer(clayer);

