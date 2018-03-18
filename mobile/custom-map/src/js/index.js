import { Map } from './map'
import {TileLayer} from './tileLayer'

var map = new Map('map', {});
var layer = new TileLayer('http://mt2.google.cn/vt/lyrs=m&hl=zh-CN&gl=cn&s=Gal&z={z}&x={x}&y={y}');
map.addLayer(layer);