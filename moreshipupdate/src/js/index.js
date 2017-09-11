import $ from 'jquery'
import L from 'leaflet'
import './leaflet.googlelayer.js'
import {RealTarget} from './realtargetWebsocket.js'

$(function () {
  var map = L.map('leaflet-map').setView([22.53, 113.50], 10);
  L.tileLayer.GoogleLayer().addTo(map);
  var r = new RealTarget(map);
  r.getData();
});