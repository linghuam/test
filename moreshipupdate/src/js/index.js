import $ from 'jquery'
import L from 'leaflet'
import './leaflet.googlelayer.js'

$(function () {
  var map = L.map('leaflet-map').setView([34, 133], 8);
  L.tileLayer.GoogleLayer().addTo(map);
});