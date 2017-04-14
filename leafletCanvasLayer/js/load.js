
var mymap = L.map('map',{
	center:[49,116],
	zoom:6
});

// L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
// }).addTo(mymap);

L.tileLayer.GoogleLayer().addTo(mymap);

// L.canvastilelayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png').addTo(mymap);

var boats = [];
for(var i=0;i<5000;i++){
	var boatMarker = L.boatMarker(mymap.getCenter(), { color: "#f1c40f" });
	boatMarker.setHeading(30);	
	boats.push(boatMarker);
}
var boatsFeatureGroup = L.featureGroup(boats);
mymap.addLayer(boatsFeatureGroup);

