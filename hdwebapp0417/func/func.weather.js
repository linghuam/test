
define("func/weather",[
    "leaflet",
    "leaflet/weatherLayer",
    "func/base",
    "control/panel",
    "plugins/mcscroll",
    "data/ajax",
    "layout/menu"

],function(L){

    L.ICT.Func.add("weather",{

        id:'weather',

        Class: L.Class.extend({

            initialize:function(){
                this.menu = L.ict.app.menu;
                this.util = L.ict.app.util;
                this.dateUtil = L.ict.app.util.dateTime;
                this.ajax = new L.ICT.Ajax();
                this.config = Project_ParamConfig.cdglConfig;
                this.mapConfig=Project_ParamConfig.MapOptions;
                this.mymap = L.ict.app.ictmap.map;
                this.menuid = 'ict_menu_main_weather';
                this._popPanel = null;

                this.w_press="Pressure_";
                this.w_500mb="500MB_";
                this.w_wind="Wind_";
                this.w_wave="WaveHeight_";
                this.w_surge="Swell_";
                this.w_current="Current_";
                this.w_temp="SeaTemp_";
                this.w_visi="Visibility_";

                this.arrDate=[];
                this.layerIds=[];
                this.a_press=[];
                this.a_500mb=[];
                this.a_wind=[];
                this.a_wave=[];
                this.a_surge=[];
                this.a_current=[];
                this.a_temp=[];

                this.w_visi="Visibility_";
                this.layerArr=new Object();

                this.curType=null;
                this.weatherLayers=new L.layerGroup();

            },
            start:function(){
                this.menu.mainmenu.deactiveMenuExceptOne(this.menuid);
                //登录提示
                if(!L.ICT.Func["UserLogin"].getInstance().isLogin()){
                    L.ICT.Func["UserLogin"].getInstance().alertLoginDialog();  
                    this.menu.mainmenu.deactiveMenu(this.menuid);                  
                    return;
                 }  
                if(this._popPanel) return;
                this.mymap = L.ict.app.ictmap.map;
                this._initUI();
                this._initEvts();

                this.getWeatherData();
            },

            stop:function(){
                if(this._popPanel) this._popPanel.remove();

                this.weatherLayers.clearLayers();
            },
            _initUI:function(){
                var func_weather_titlename=$.i18n.prop('func_weather_titlename');
                var lanset=window.localStorage.getItem("language");
                var widthpan=125;
                if (lanset=="en"){
                    widthpan=245;
                }
                var options = {
                    title:func_weather_titlename,
                    width:widthpan,
                    height:300,
                    top:100,
                    left:200,
                    contentHTML:this._getContentHTML()
                };
                var pop = this._popPanel = new L.ICT.PopPanel(options);
                pop.show();
            },
            _initEvts:function(){
                    self = this;

                this._popPanel.on("popPanelRemove",function(){
                    this._popPanel = null;
                    this.menu.mainmenu.deactiveMenu(this.menuid);
                },this);
            },
            _getContentHTML:function(){
                var func_weather_lb_selectweather=$.i18n.prop('func_weather_lb_selectweather');
                var func_weather_lb_qy=$.i18n.prop('func_weather_lb_qy');
                var func_weather_lb_f=$.i18n.prop('func_weather_lb_f');
                var func_weather_lb_l=$.i18n.prop('func_weather_lb_l');
                var func_weather_lb_y=$.i18n.prop('func_weather_lb_y');
                var func_weather_lb_yl=$.i18n.prop('func_weather_lb_yl');
                var func_weather_lb_hw=$.i18n.prop('func_weather_lb_hw');
                var func_weather_lb_njd=$.i18n.prop('func_weather_lb_njd');
                var html = [];
                html.push('   <div class="weather_nav_box_weather"  box-type="display_hide_change" box-display="dishide">');
                html.push('           <div class="weather_tyhoon">');
				html.push('              <p>'+func_weather_lb_selectweather+'</p>');
				html.push('              <p> <input type="checkbox" name="weather" value="w1"  id="weather1" class="weather_radioclass" style="margin:0px;padding:0px;" /><span class="weatherlab" for="weather1">'+func_weather_lb_qy+'</span></p>');
				html.push('              <p> <input type="checkbox" name="weather" value="w2"  id="weather2" class="weather_radioclass" style="margin:0px;padding:0px;"/><span class="weatherlab" for="weather2">500mb</span></p>');
				html.push('              <p> <input type="checkbox" name="weather" value="w3"  id="weather3" class="weather_radioclass" style="margin:0px;padding:0px;"/><span class="weatherlab" for="weather3">'+func_weather_lb_f+'</span></p>');
				html.push('              <p> <input type="checkbox" name="weather" value="w4"  id="weather4" class="weather_radioclass" style="margin:0px;padding:0px;"/><span class="weatherlab" for="weather4">'+func_weather_lb_l+'</span></p>');
				html.push('              <p> <input type="checkbox" name="weather" value="w5"  id="weather5" class="weather_radioclass" style="margin:0px;padding:0px;"/><span class="weatherlab" for="weather5">'+func_weather_lb_y+'</span></p>');
				html.push('              <p> <input type="checkbox" name="weather" value="w6"  id="weather6" class="weather_radioclass" style="margin:0px;padding:0px;"/><span class="weatherlab" for="weather6">'+func_weather_lb_yl+'</span></p>');
				html.push('              <p  style="display:none"> <input type="checkbox" name="weather" value="w7"  id="weather7" class="weather_radioclass" style="margin:0px;padding:0px;"/><span class="weatherlab"  for="weather7">'+func_weather_lb_hw+'</span></p>');
				html.push('              <p> <input type="checkbox" name="weather" value="w8"  id="weather8" class="weather_radioclass" style="margin:0px;padding:0px;"/><span class="weatherlab" for="weather8">'+func_weather_lb_njd+'</span></p>');
				html.push('          </div><label>');
				html.push('  </div> ');
                return html.join('');
            },
            initCheckEvent:function(){
                $("input[name='weather']").bind("click", function() {
                    var wvalue = $(this).val();
                    var wcheck = $(this).is(':checked');
                    if (wvalue == 'w1') {
                        self.curWeather = self.w_press;
                        self.changeWeather(self.w_press, self.mymap, wcheck);
                    } else if (wvalue == 'w2') {
                        self.curWeather = self.w_500mb;
                        self.changeWeather(self.w_500mb, self.mymap, wcheck);
                    } else if (wvalue == 'w3') {
                        self.curWeather = self.w_wind;
                        self.changeWeather(self.w_wind, self.mymap, wcheck);
                    } else if (wvalue == 'w4') {
                        self.curWeather = self.w_wave;
                        self.changeWeather(self.w_wave, self.mymap, wcheck);
                    } else if (wvalue == 'w5') {
                        self.curWeather = self.w_surge;
                        self.changeWeather(self.w_surge, self.mymap, wcheck);
                    } else if (wvalue == 'w6') {
                        self.curWeather = self.w_current;
                        self.changeWeather(self.w_current, self.mymap, wcheck);
                    } else if (wvalue == 'w7') {
                        self.curWeather = self.w_temp;
                        self.changeWeather(self.w_temp, self.mymap, wcheck);
                    } else if (wvalue == 'w8') {
                        self.curWeather = self.w_visi;
                        self.changeWeather(self.w_visi, self.mymap, wcheck);
                    }
                });
            },
            getWeatherData:function () {
                var func_weather_error_tip=$.i18n.prop('func_weather_error_tip');
                var nowsj = new Date();
                var data={};
                data.timespane=nowsj.getTime().toString();
                var url = self.config.getWeatherInfoUrl;
                self.ajax.post(url,data,true,this,function(res){
                    if(res.state!=1){
                        this._showErrorMsg(func_weather_error_tip);
                    }else{
                        this._getWeatherDataSucess(res);
                        this.initCheckEvent();
                    }
                },function(res){
                    this._showErrorMsg(func_weather_error_tip);
                });
            },
            _getWeatherDataSucess:function (data) {
                if (data.w_press != null) {
                    this.a_press = data.w_press;
                } else {
                    $("input[id='weather1']").attr("disabled", "disabled");
                }
                if (data.w_500mb != null) {
                    this.a_500mb = data.w_500mb;
                } else {
                    $("input[id='weather2']").attr("disabled", "disabled");
                }
                if (data.w_wind != null) {
                    this.a_wind = data.w_wind;
                } else {
                    $("input[id='weather3']").attr("disabled", "disabled");
                }
                if (data.w_wave != null) {
                    this.a_wave = data.w_wave;
                } else {
                    $("input[id='weather4']").attr("disabled", "disabled");
                }

                if (data.w_surge != null) {
                    this.a_surge = data.w_surge;
                } else {
                    $("input[id='weather5']").attr("disabled", "disabled");
                }
                if (data.w_current != null) {
                    this.a_current = data.w_current;
                } else {
                    $("input[id='weather6']").attr("disabled", "disabled");
                }

                if (data.w_visi != null) {
                    this.a_visi = data.w_visi;
                } else {
                    $("input[id='weather8']").attr("disabled", "disabled");
                }
            },
            /*获取气象的有效时间段标签*/
            _getWeatherValue: function(wtype) {
                var arr;
                if (wtype == this.w_press) {
                    arr = this.a_press;
                } else if (wtype == this.w_500mb) {
                    arr = this.a_500mb;
                } else if (wtype == this.w_wind) {
                    arr = this.a_wind;
                } else if (wtype == this.w_wave) {
                    arr = this.a_wave;
                } else if (wtype == this.w_surge) {
                    arr = this.a_surge;
                } else if (wtype == this.w_current) {
                    arr = this.a_current;
                } else if (wtype == this.w_temp) {
                    arr = [];
                } else if (wtype == this.w_visi) {
                    arr = this.a_visi;
                }

                var arrdate = [];
                /*
                var current_date = (this.dateFormat(new Date(), "yyyy-MM-dd h:m:s")).substring(0, 10);
                for (var i in arr) {
                    if (arr[i].themetimekey >= current_date) {
                        arrdate.push(arr[i].themetimevalue);
                    }
                }
                */
                //只拿数组中的第一个时间
                if (arr!=null && arr.length>0){
                    arrdate.push(arr[0].themetimevalue);
                }
                return arrdate;
            },
            dateFormat: function(date, format) {
                var o = {
                    "M+": date.getMonth() + 1, //month
                    "d+": date.getDate(), //day
                    "h+": date.getHours(), //hour
                    "m+": date.getMinutes(), //minute
                    "s+": date.getSeconds(), //second
                    "q+": Math.floor((date.getMonth() + 3) / 3), //quarter
                    "S": date.getMilliseconds() //millisecond
                };
                if (/(y+)/.test(format)) {
                    format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
                }

                for (var k in o) {
                    if (new RegExp("(" + k + ")").test(format)) {
                        format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
                    }
                }
                return format;
            },
            /*生成气象的时间段标签*/
            /*
            _createWeatherDate: function(wtype) {
                //每天2次，每隔12小时一次，查询5天的数据
                var preDate;
                var nowHour = new Date().getHours();

                for (var i = 0; i < 10; i++) {
                    var nowDate = new Date();
                    nowDate.setHours(0);
                    nowDate.setMinutes(0);
                    nowDate.setSeconds(0);
                    nowDate = nowDate.DateAdd('h', -24);

                    if (i % 2 == 0) {
                        if (i > 0) {
                            preDate = nowDate.DateAdd('h', 24 * i);
                        } else {
                            preDate = nowDate.DateAdd('h', 24);
                        }
                        if (nowHour > 0 && nowHour < 8) {
                            preDate = preDate.DateAdd('h', -24);
                        }
                    }
                    var proDate = preDate.Format("yyyyMMdd");
                    var time1 = "00";
                    var time2 = "12";

                    if (nowHour > 0 && nowHour < 8) {
                        nowDate = nowDate.DateAdd('h', -24);
                    }

                    if (i % 2 == 0) {
                        if (nowHour < 20) {
                            nowDate = nowDate.Format("yyyyMMdd");
                            this.arrDate.push(wtype + nowDate + "_" + time2 + "_" + proDate + "_" + time1);
                        } else {
                            nowDate = nowDate.DateAdd('h', 24);
                            nowDate = nowDate.Format("yyyyMMdd");
                            this.arrDate.push(wtype + nowDate + "_" + time1 + "_" + proDate + "_" + time1);
                        }
                    } else {
                        if (nowHour < 20) {
                            nowDate = nowDate.Format("yyyyMMdd");
                            this.arrDate.push(wtype + nowDate + "_" + time2 + "_" + proDate + "_" + time2);
                        } else {
                            nowDate = nowDate.DateAdd('h', 24);
                            nowDate = nowDate.Format("yyyyMMdd");
                            this.arrDate.push(wtype + nowDate + "_" + time1 + "_" + proDate + "_" + time2);
                        }
                    }
                }
            },
            */
            /*切换气象*/
            changeWeather: function(wtype, map, ischecked) {
                if (!ischecked) {
                    var tlayers = this.layerArr[wtype];
                    for (var i = 0; i < tlayers.length; i++) {
                        this.weatherLayers.removeLayer(tlayers[i]);
                    }
                    return;
                }
                this.curType = wtype;
                this.arrDate = [];
                this.arrDate = this._getWeatherValue(wtype);

                var tlayer = [];
                for (var i = 0; i < this.arrDate.length; i++) {
                    var layerOpt;
                    if (i == 0) {
                        layerOpt = {
                            type: this.arrDate[i],
                            maxZoom: this.mapConfig.maxZoom,
                            minZoom: this.mapConfig.minZoom,
                            opacity: 0.7,
                            continuousWorld: true,
                            id: this.arrDate[i]
                        };
                    } else {
                        layerOpt = {
                            type: this.arrDate[i],
                            maxZoom: this.mapConfig.maxZoom,
                            minZoom: this.mapConfig.minZoom,
                            opacity: 0.7,
                            continuousWorld: true,
                            id: this.arrDate[i]
                        };
                    }

                    var layer = L.tileLayer.WeatherLayer("", layerOpt);
                    layer.id = this.arrDate[i];
                    this.weatherLayers.addLayer(layer);
                    layer.setOpacity(0.7);
                    tlayer.push(layer);
                }

                for (var i = 0; i < this.weatherLayers.getLayers().length; i++) {
                    this.layerIds.push(this.weatherLayers.getLayers()[i]._leaflet_id);
                }

                this.layerArr[wtype] = tlayer;
                this.weatherLayers.addTo(map);

            },
            /*
            showFirstLayer: function() {
                var layers = this.layerArr[this.curType];
                var preLayer = layers[0];
                if (preLayer != null) {
                    preLayer.setOpacity(0.7);
                }
            },
            */
            /*
            showInitalLayer: function() {
                var arrChk = [];
                $('input[name="weather"]:checked').each(function() {
                    var wvalue = $(this).val();
                    if (wvalue == 'w1') {
                        arrChk.push(this.w_press);
                    } else if (wvalue == 'w2') {
                        arrChk.push(this.w_500mb);
                    } else if (wvalue == 'w3') {
                        arrChk.push(this.w_wind);
                    } else if (wvalue == 'w4') {
                        arrChk.push(this.w_wave);
                    } else if (wvalue == 'w5') {
                        arrChk.push(this.w_surge);
                    } else if (wvalue == 'w6') {
                        arrChk.push(this.w_current);
                    } else if (wvalue == 'w7') {
                        arrChk.push(this.w_temp);
                    } else if (wvalue == 'w8') {
                        arrChk.push(this.w_visi);
                    }
                });
                //遍历得到每个checkbox的value值
                for (var i = 0; i < arrChk.length; i++) {
                    var layers = this.layerArr[arrChk[i]];
                    for (var j in layers) {
                        var preLayer = layers[j];
                        if (j == 0) {
                            preLayer.setOpacity(0.7);
                            preLayer.bringToFront();
                        } else {
                            preLayer.setOpacity(0);
                        }
                    }
                }
            },
            */
            /*轮播气象---下一个*/
            /*
            nextWeather: function(wtype, index) {
                var arrChk = [];
                $('input[name="weather"]:checked').each(function() {
                    var wvalue = $(this).val();
                    if (wvalue == 'w1') {
                        arrChk.push(this.w_press);
                    } else if (wvalue == 'w2') {
                        arrChk.push(this.w_500mb);
                    } else if (wvalue == 'w3') {
                        arrChk.push(this.w_wind);
                    } else if (wvalue == 'w4') {
                        arrChk.push(this.w_wave);
                    } else if (wvalue == 'w5') {
                        arrChk.push(this.w_surge);
                    } else if (wvalue == 'w6') {
                        arrChk.push(this.w_current);
                    } else if (wvalue == 'w7') {
                        arrChk.push(this.w_temp);
                    } else if (wvalue == 'w8') {
                        arrChk.push(this.w_visi);
                    }
                });
                //遍历得到每个checkbox的value值
                for (var i = 0; i < arrChk.length; i++) {
                    var layers = this.layerArr[arrChk[i]];
                    var preLayer = layers[index];
                    var nextLayer = layers[index + 1];
                    if (preLayer != null && nextLayer != null) {
                        preLayer.setOpacity(0);
                        nextLayer.setOpacity(0.7);
                    }
                }
            },
            */
            /*轮播气象---上一个*/
            /*
            preWeather: function(wtype, index) {
                var arrChk = [];
                $('input[name="weather"]:checked').each(function() {
                    var wvalue = $(this).val();
                    if (wvalue == 'w1') {
                        arrChk.push(this.w_press);
                    } else if (wvalue == 'w2') {
                        arrChk.push(this.w_500mb);
                    } else if (wvalue == 'w3') {
                        arrChk.push(this.w_wind);
                    } else if (wvalue == 'w4') {
                        arrChk.push(this.w_wave);
                    } else if (wvalue == 'w5') {
                        arrChk.push(this.w_surge);
                    } else if (wvalue == 'w6') {
                        arrChk.push(this.w_current);
                    } else if (wvalue == 'w7') {
                        arrChk.push(this.w_temp);
                    } else if (wvalue == 'w8') {
                        arrChk.push(this.w_visi);
                    }
                });
                //遍历得到每个checkbox的value值
                for (var i = 0; i < arrChk.length; i++) {
                    var layers = this.layerArr[arrChk[i]];
                    var preLayer = layers[index + 1];
                    var nextLayer = layers[index];
                    if (preLayer != null && nextLayer != null) {
                        preLayer.setOpacity(0);
                        nextLayer.setOpacity(0.7);
                        nextLayer.bringToFront();
                    }
                }
            },
            */
            _showMsg:function (msginfo) {
                // alert(msginfo);
                L.ict.app.util.dialog.warn($.i18n.prop('dialog_alert_title'),msginfo);
            },
            _showErrorMsg:function (errormsg) {
                // alert(errormsg);
                L.ict.app.util.dialog.error($.i18n.prop('dialog_alert_title'),errormsg);                                
            }

    })

});

});

