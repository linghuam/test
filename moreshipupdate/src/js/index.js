import $ from 'jquery'
import L from 'leaflet'
import {Draw} from './draw.ship.js'
import './leaflet.googlelayer.js'

$(function () {
  var map = L.map('leaflet-map').setView([22.53, 113.50], 10);
  L.tileLayer.GoogleLayer().addTo(map);
  var draw = new Draw(map);
  var tag = false;
  var index = 1;
  var getDataFunc = function (indexs) {
  	$.getJSON('src/data/'+ indexs + '.json',function (data) {
  		console.log('本次获取的总目标数：'+ data.msg.shipList.length);
  		 data = data.msg.shipList;
  		 let newdata = [];
  		 for (let i = 0 , len = data.length; i < len; i++){
  		 	let obj = {};
  		 	obj.lat = data[i].la/600000;
  		 	obj.lng = data[i].lo/600000;
  		 	obj.dir = parseInt(data[i].di/10);
  		 	obj.info = [
  		 	  {key: 'mmsi', value:data[i].ti},
  		 	  {key: '船名', value:data[i].sn},
  		 	  {key: '经度', value:data[i].lo/600000},
  		 	  {key: '纬度', value:data[i].la/600000},
  		 	  {key: '航向', value:parseInt(data[i].di/10)}
  		 	];
  		 	newdata.push(obj);
  		 }
  		 draw.drawShips(newdata);
         tag = true;
         index++;
  	});
  };
  getDataFunc(1);
  setInterval(function () {
  	if (index > 1 ) {
  		index = 1;
  	}
  	if (tag) {
  		tag = false;
  		getDataFunc(index);
  	}
  } , 3*1000);
});