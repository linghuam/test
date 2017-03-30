define("control/playback",["leaflet","jquery","leaflet/playback","plugins/rangeSlider"],function(t){t.ICT.Control=t.ICT.Control||{},t.ICT.Control.PlayBack=t.Class.extend({options:{position:"topright",speed:1,Max_Speed:64,LAT_LON_TRANSFORM:6e5,trackLineOptions:{weight:2,color:"#ef0300"},OriginCircleOptions:{stroke:!1,color:"#ef0300",fillColor:"#ef0300",fillOpacity:1,radius:4},layer:{},marker:{icon:t.icon({iconUrl:"themes/images/model/stateplayback/ship.png",iconSize:[12,25],iconAnchor:[5,12]})}},templateHtml:'<div class="playback-operation"><ul><li class="item item-start play" data-info="2" title="播放"><img src="themes/images/model/stateplayback/ico_play.png"></li><li class="item item-restart" data-info="3" title="重播"><img src="themes/images/model/stateplayback/ico_restart.png"></li><li class="item item-slow" data-info="4" title="减速"><img src="themes/images/model/stateplayback/ico_pre.png"></li><li class="item item-quick" data-info="5" title="加速"><img src="themes/images/model/stateplayback/ico_next.png"></li><li class="item item-speed"><span>X1</span></li><li class="item item-close" data-info="6" title="关闭"><img src="themes/images/model/stateplayback/ico_close.png"></li></ul></div><div class="playback-scrollbar"><ul><li class="item item-time"><span class="startTime"></span><span class="endTime"></span></li><li class="item item-scroll"><input type="range" class="range"></li><li class="item item-curtime"><span class="curTime"></span></li></ul></div>',initialize:function(i,a,e,s){t.setOptions(this,s),this._data=i,this._clockCallback=a,this._closeCallback=e},show:function(t){return t?(this._map=t,this.onAdd(t),this):void 0},close:function(){return t.DomUtil.remove(this._container),this.onRemove&&this.onRemove(this._map),this},onAdd:function(i){this._map=i,this._initUi();for(var a=this.dataTransform(this._data),e=[],s=0,n=a.length;n>s;s++){var l=new t.Playback.Track(i,a[s],this.options);e.push(l)}return this._trackController=new t.Playback.TrackController(i,e,this.options),this._playbackClock=new t.Playback.Clock(this._trackController,this._clockCallback,this.options),this.setCursor(this.getStartTime()),this._initEvts(),this.setTime(),this._container},clearData:function(){this._trackController.clearTracks()},onRemove:function(){this.clearData(),"function"==typeof this._closeCallback&&this._closeCallback.call(this,this)},_initUi:function(){{var i="ict-control-playback",a=this._container=t.DomUtil.create("div",i);this.options}a.innerHTML=this.templateHtml,$("body").append($(a));var e="ict-control-playback"+t.stamp({}),s="playback-operation"+t.stamp({});$(a).attr("id",e),$(a).find(".playback-operation").attr("id",s),t.ict.app.util.tool.drag(e,s)},_initEvts:function(){var i=this,a=$(i._container).find(".playback-operation>ul>li"),e=$(i._container).find(".playback-scrollbar input")[0];a.each(function(){t.DomEvent.on(this,"mousedown dbclick",t.DomEvent.stopPropagation).on(this,"click",t.DomEvent.stop).on(this,"click",i._btnClick,i)}),e.min=i.getStartTime(),e.max=i.getEndTime(),e.value=i.getTime(),t.DomEvent.on(e,"click mousedown dbclick",t.DomEvent.stopPropagation).on(e,"click",t.DomEvent.preventDefault).on(e,"change",i._onRangeChange,i).on(e,"mousemove",i._onRangeChange,i),i.addCallback(function(t){e.value=t;var i=parseInt((t-e.min)/(e.max-e.min)*100);$(e).css("background-size",i+"% 100%")})},_btnClick:function(t){var i=$(t.currentTarget),a=$(t.currentTarget).data("info");switch(a){case 1:break;case 2:i.hasClass("play")?(i.removeClass("play"),i.find("img").attr("src","themes/images/model/stateplayback/ico_push.png"),i.attr("title","暂停"),this.start()):(i.addClass("play"),i.find("img").attr("src","themes/images/model/stateplayback/ico_play.png"),i.attr("title","播放"),this.stop());break;case 3:i.siblings(".item-start").removeClass("play"),i.siblings(".item-start").find("img").attr("src","themes/images/model/stateplayback/ico_push.png"),i.siblings(".item-start").attr("title","暂停"),this.rePlaying();break;case 4:this.slowSpeed();break;case 5:this.quickSpeed();break;case 6:this.close()}},_onRangeChange:function(t){var i=Number(t.target.value);this.setCursor(i)},setTime:function(){var i=$(this._container),a=t.ict.app.util.dateTime.formatDateHM(new Date(this.getStartTime())),e=t.ict.app.util.dateTime.formatDateHM(new Date(this.getEndTime())),s=t.ict.app.util.dateTime.formatDateHM(new Date(this.getTime()));i.find(".playback-scrollbar .startTime").text(a),i.find(".playback-scrollbar .endTime").text(e),i.find(".playback-scrollbar .curTime").text(s);var n=this;this.addCallback(function(){s=t.ict.app.util.dateTime.formatDateHM(new Date(n.getTime())),i.find(".playback-scrollbar .curTime").text(s)})},addCallback:function(t){this._playbackClock.addCallback(t)},start:function(){this._playbackClock.start()},stop:function(){this._playbackClock.stop()},quickSpeed:function(){this._playbackClock.quickSpeed();var t=this._playbackClock.getSpeed();$(this._container).find(".playback-operation .item-speed span").text("X"+parseInt(t/this.options.speed))},slowSpeed:function(){this._playbackClock.slowSpeed();var t=this._playbackClock.getSpeed();$(this._container).find(".playback-operation .item-speed span").text("X"+parseInt(t/this.options.speed))},rePlaying:function(){this._playbackClock.rePlaying()},getSpeed:function(){return this._playbackClock.getSpeed()},isPlaying:function(){return this._playbackClock.isPlaying()},setSpeed:function(t){this._playbackClock.setSpeed(t)},setCursor:function(t){this._playbackClock.setCursor(t)},getTime:function(){return this._playbackClock.getTime()},getStartTime:function(){return this._playbackClock.getStartTime()},getEndTime:function(){return this._playbackClock.getEndTime()},getTickLen:function(){return this._playbackClock.getTickLen()},dataTransform:function(i){if(!i||!i.length)return void console.log("playback_error:data transform error!");for(var a=[],e=0,s=i.length;s>e;e++){var n=i[e].num,l={};l.timePosList=[];for(var o=0,c=i[e].posList.length;c>o;o++){var r={},p=i[e].posList[o];r.lng=p.lo/this.options.LAT_LON_TRANSFORM,r.lat=p.la/this.options.LAT_LON_TRANSFORM,r.time=1e3*p.ti,r.dir=parseFloat(p.co/10),r.heading=parseInt(p.he),r.speed=parseFloat(p.sp/10),r.info_ph=n,r.info_lng=t.ict.app.util.tool.latlngTodfmStr(r.lng,"lng"),r.info_lat=t.ict.app.util.tool.latlngTodfmStr(r.lat,"lat"),r.info_time=t.ict.app.util.dateTime.getTimeStrFromUnix(p.ti),r.info_dir=(p.co/10).toFixed(1)+"°",r.info_heading=p.he+"°",r.info_speed=parseInt(p.sp/10)+"节",l.timePosList.push(r)}a.push(l)}return a}})});