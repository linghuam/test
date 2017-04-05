/* linghuam 封装播放控件 依赖 [playback,jquery,leaflet1.0.0]
* 示例
   new L.ICT.Control.PlayBack (data,null,null,options).show(map);
*/

define("control/playback",[
   "leaflet",
   "jquery",
   "leaflet/playback",
   "plugins/rangeSlider"

],function(L){

L.ICT.Control = L.ICT.Control || {};

L.ICT.Control.PlayBack = L.Class.extend({

    statics:{

      MoveableMarker : L.Playback.MoveableMarker,
      Track : L.Playback.Track,
      TrackController : L.Playback.TrackController,
      Clock : L.Playback.Clock,
      Util : L.Playback.Util,

      LAT_LON_TRANSFORM:600000  //经纬度转化参数

    },

    options:{
       position:'topright',
       tickLen:1000, //根据最小时间单位来确定，最好能整除(否则一些原始信息点可能丢失)
       speed:5000*1,//默认速度
       Max_Speed:10, //最大速度倍数
       maxInterpolationTime: 24*60*60*1000, //插值时间间隔 1 DAY 时间间隔大于它，船将一直保持在这个位置不动，直到时间间隔小于它
       orientIcons:true, //是否使用方向图标
       labels:false,//是否显示标记
       popups:false,//是否显示弹框
       fadeMarkersWhenStale :false,

       trackLineOptions:{weight:2,color:'#ef0300'}, //轨迹线配置
       OriginCircleOptions:{stroke:false,color:'#ef0300',fillColor:'#ef0300',fillOpacity:1,radius:4},//轨迹点配置

       // options
       layer: {
           // pointToLayer(featureData, latlng)
       },

       marker:{  //marker options

        // getPopup:function(feature){
            //  return feature.properties.title;
           //},

          icon: L.icon({
                iconUrl: 'themes/images/model/stateplayback/ship.png',
                iconSize: [12, 25],
                iconAnchor: [5, 12] // 解析后：margin-left:-5px;margin-top:-12px;
           })    
       }

    },

    templateHtml:'<div class="playback-operation">'
                    +'<ul>'
                    // +'<li class="item item-stop" data-info="1" title="停止"><img src="themes/images/model/stateplayback/ico_stop.png"></li>'
                    +'<li class="item item-start play" data-info="2" title="播放"><img src="themes/images/model/stateplayback/ico_play.png"></li>'
                    +'<li class="item item-restart" data-info="3" title="重播"><img src="themes/images/model/stateplayback/ico_restart.png"></li>'
                    +'<li class="item item-slow" data-info="4" title="减速"><img src="themes/images/model/stateplayback/ico_pre.png"></li>'
                    +'<li class="item item-quick" data-info="5" title="加速"><img src="themes/images/model/stateplayback/ico_next.png"></li>' 
                    +'<li class="item item-speed"><span>X1</span></li>'                                       
                    +'<li class="item item-close" data-info="6" title="关闭"><img src="themes/images/model/stateplayback/ico_close.png"></li>' 
                    +'</ul>'
                +'</div>'               
                +'<div class="playback-scrollbar">'
                    +'<ul>'
                    +'<li class="item item-time"><span class="startTime"></span><span class="endTime"></span></li>'
                    +'<li class="item item-scroll"><input type="range" class="range"></li>'
                    +'<li class="item item-curtime"><span class="curTime"></span></li>'
                    +'</ul>'                   
                +'</div>',                
    
    /*
    *@map obj 
    *@data Array objArr
    *@clockCallback Function 时钟变化时触发回调
    *@closeCallback Function 关闭控件时触发回调
    *@options obj 
    */
    initialize:function(data,clockCallback,closeCallback,options) {
      L.setOptions(this,options);
      this._data = data;
      this._clockCallback = clockCallback;
      this._closeCallback = closeCallback;

    },
    
    //显示控件
    show:function(map){
       if(!map){
         return;         
       } 
       this._map = map;
       this.onAdd(map);
       return this;

    },
    
    //关闭控件
    close:function(){
       L.DomUtil.remove(this._container);
       if(this.onRemove){
          this.onRemove(this._map);
       }
       return this;

    },
    
    //添加
    onAdd:function(map){
        this._map = map;        
        this._initUi();
        this._initStyle();
        this._trackController = new L.Playback.TrackController(map, null, this.options);
        this._playbackClock = new L.Playback.Clock(this._trackController,this._clockCallback,this.options);
        var geoJSON = this._dataTogeoJSON(this._data);
        this.setData(geoJSON);  
        this.setTime();
        this._initEvts();           
        return this._container;

    },

    //移除
    onRemove:function(){
        this.clearData()
        // this._map.off('playback:add_tracks');
        // $(this._container).remove();
        if( typeof this._closeCallback === "function"){
            this._closeCallback.call(this,this);
        }

    },

    _initUi:function(){
        var playbackName = 'ict-control-playback',
            container = this._container =  L.DomUtil.create('div',playbackName),
            options = this.options;
        // L.DomEvent.disableClickPropagation(container);  //不能禁用事件冒泡，否则不能拖动
        container.innerHTML = this.templateHtml;
        $("body").append($(container));
         //拖动
         var pid = "ict-control-playback"+L.stamp({});
         var cid = "playback-operation"+L.stamp({});
         $(container).attr("id",pid);
         $(container).find(".playback-operation").attr("id",cid)
         L.Playback.Util.drag(pid,cid);

    },

    _initStyle:function(){
       var $container = $(this._container);
       // $container.css({
       //    position:'absolute',
       //    right:'20px',
       //    top:'20px',
       //    zIndex:9999
       // });

    },

    _initEvts:function(){  //jquery
      var self = this,
          btns = $(self._container).find('.playback-operation>ul>li'),
          range = $(self._container).find('.playback-scrollbar input')[0];
        
        btns.each(function(){
          L.DomEvent
              .on(this,'mousedown dbclick',L.DomEvent.stopPropagation)
              .on(this,'click',L.DomEvent.stop)
              .on(this,'click',self._btnClick,self);
        });
        
        range.min = self.getStartTime();
        range.max = self.getEndTime();
        range.value = self.getTime();
        L.DomEvent
          .on(range,'click mousedown dbclick',L.DomEvent.stopPropagation)
          .on(range,'click',L.DomEvent.preventDefault)
          .on(range,'change',self._onRangeChange,self)
          .on(range,'mousemove',self._onRangeChange,self);
        
       self.addCallback(function(ms){
          range.value = ms;
          //给滑动块添加颜色
          var percent = parseInt((ms-range.min)/(range.max-range.min)*100);
          $(range).css( 'background-size', percent + '% 100%' ); 
          // $(range).css( 'background', 'linear-gradient(to right, #059CFA ' + percent + '%, white)' );          
       });
          
      //给滑动块添加颜色
      // $(range).rangeSlider({min: 0,  max: 100,  step: 1,  callback: null});

       // self._map.on('playback:add_tracks',function(){
       //     range.min = self.getStartTime();
       //     range.max = self.getEndTime();
       //     range.value = self.getTime();
       // });

    },

    _btnClick:function(e){
        var $this = $(e.currentTarget);
        var type = $(e.currentTarget).data("info");
        switch (type){
          case 1:;
             break;
          case 2:
          if($this.hasClass("play")){
             $this.removeClass("play");
             $this.find("img").attr("src","themes/images/model/stateplayback/ico_push.png");
             $this.attr("title","暂停");
             this.start();
          }else{
             $this.addClass("play");
             $this.find("img").attr("src","themes/images/model/stateplayback/ico_play.png");
             $this.attr("title","播放");
             this.stop();
          }         
             break;
          case 3:this.rePlaying();
             break;
          case 4:this.slowSpeed();
             break;
          case 5:this.quickSpeed();
             break;
          case 6:this.close();
             break;
          default:;
        }

    },
    
    _onRangeChange:function(e){
       var val = Number(e.target.value);
       this.setCursor(val);
       // this.stop();
    },

    setTime:function(){
      var $container = $(this._container),
          startTime = L.Playback.Util.formatDateHM(new Date(this.getStartTime())),
          endTime = L.Playback.Util.formatDateHM(new Date(this.getEndTime())),
          curTime = L.Playback.Util.formatDateHM(new Date(this.getTime()));
      $container.find(".playback-scrollbar .startTime").text(startTime);
      $container.find(".playback-scrollbar .endTime").text(endTime);
      $container.find(".playback-scrollbar .curTime").text(curTime);  
      var self = this;   
      this.addCallback(function(){
          curTime = L.Playback.Util.formatDateHM(new Date(self.getTime()));
          $container.find(".playback-scrollbar .curTime").text(curTime);   
      }); 

    },
    
    setData:function(geoJSON){
        this.clearData();
        this.addData(geoJSON,this.getTime());
        this.setCursor(this.getStartTime());

    },

    addData:function(geoJSON,ms){
        var map = this._map; //linghuam add
        if(!geoJSON) {
          return;
        }        

        if(geoJSON instanceof Array){
          for(var i=0,len=geoJSON.length;i<len;i++){
            this._trackController.addTrack(new L.Playback.Track(map,geoJSON[i],this.options),ms);
          }
        }else{
          this._trackController.addTrack(new L.Playback.Track(map,geoJSON,this.options),ms);
        }
        this._map.fire('playback:set:data');

    },

    clearData:function(){
       this._trackController.clearTracks();       
    },
    
    addCallback:function(fn){
      this._playbackClock.addCallback(fn);
    },
    
    //开始播放
    start:function(){
      this._playbackClock.start();
    },
    
    //停止播放
    stop:function(){
      this._playbackClock.stop();
    },
    
    //加速播放
    quickSpeed:function(){
      this._playbackClock.quickSpeed();
      var sp = this._playbackClock.getSpeed();
      $(this._container).find(".playback-operation .item-speed span").text("X" + parseInt(sp/this.options.speed));

    },

    //减速播放
    slowSpeed:function(){
      this._playbackClock.slowSpeed();
      var sp = this._playbackClock.getSpeed();
      $(this._container).find(".playback-operation .item-speed span").text("X" + parseInt(sp/this.options.speed));

    },

    //重新播放
    rePlaying:function(){
       this._playbackClock.rePlaying();
    },    
    
    //获取当前播放速度
    getSpeed:function(){
      return this._playbackClock.getSpeed();
    },
    
    //是否处于播放状态
    isPlaying:function(){
      return this._playbackClock.isPlaying();
    },
    
    //设置播放速度
    setSpeed:function(speed){
        this._playbackClock.setSpeed(speed);
    },
    
    //设置进度条指针
    setCursor:function(ms){
        this._playbackClock.setCursor(ms);
    },
    
    //获取当前时间
    getTime:function(){
      return this._playbackClock.getTime();
    },
      
    //获取开始时间  
    getStartTime:function(){
      return this._playbackClock.getStartTime();
    },
    
    //获取结束时间
    getEndTime:function(){
      return this._playbackClock.getEndTime();
    },
    
    //获取时间间隔
    getTickLen:function(){
      return this._playbackClock.getTickLen();
    },
     
    //数据格式转换
    _dataTogeoJSON:function(data){
      if(data.length<=0){
        console.log("error:dataToGeoJSON error!");
        return;
      }
      var geoJSON = [] ;
      for(var i=0,len=data.length;i<len;i++){
        var ph = data[i].num;
        var obj = {};
        obj.type = "Feature";
        obj.geometry = {};
        obj.properties = {};
        obj.geometry.type = "MultiPoint";
        obj.geometry.coordinates = [];
        obj.properties.title = "title"+i;
        obj.properties.time = [];
        obj.properties.speed = [];
		    obj.properties.info = {};						 
        for(var j=0,lenj=data[i].posList.length;j<lenj;j++){
          var sp = data[i].posList[j];
          var lng = sp.lo/L.ICT.Control.PlayBack.LAT_LON_TRANSFORM;
          var lat = sp.la/L.ICT.Control.PlayBack.LAT_LON_TRANSFORM;
					var lngstr = L.ict.app.util.tool.latlngTodfmStr(lng,'lng');
          var latstr = L.ict.app.util.tool.latlngTodfmStr(lat,'lat');
          var time =  L.ict.app.util.dateTime.getTimeStrFromUnix(sp.ti);
          obj.properties.info[sp.ti*1000] = {
             lat:latstr,
             lon:lngstr,
             time:time,
             ph:ph,
             dir:(sp.co/10).toFixed(1) + "°",
             heading: sp.he + "°",
             speed:(sp.sp/10) +'节'
          };																	 																													 																	   											  								   				
          obj.geometry.coordinates.push([lng,lat]);
          obj.properties.time.push(sp.ti*1000);
          obj.properties.speed.push(1000);
        }
        geoJSON.push(obj);
      }
      return geoJSON;

    }

  });

});
