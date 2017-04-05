/**
*港口信息
*/
define("func/portInfo",[
	"leaflet",
  "echarts",
	"func/base",
  "data/ajax",
  "control/panel",
  "plugins/mcscroll"


],function(L,echarts){

      L.ICT.PortInfo =  L.Class.extend({

        initialize:function(ictmap){
            this.config = Project_ParamConfig.PortConfig;
            this.ajax = new L.ICT.Ajax();
            this.ictmap = ictmap;
            this._portList = [];
            this._portLayerList = [];
            this.portLayerGroup = L.featureGroup([]);
            this.ictmap.map.addLayer(this.portLayerGroup);
            //获取港口列表
            this.getPortList();

        },

        getPortList:function(){
            var url = this.config.listUrl;
            this.ajax.get(url,null,true,this,function(res){
                if(res.state !== 1){
                   console.error(res.msg.error);
                }else{
                   var listinfo = res.msg.portsList;
                   this._portList = [];
                   for(var i=0,len=listinfo.length;i<len;i++){
                       var port = this.convertPortObj(listinfo[i]); 
                       this._portList.push(port);
                   }
                   this.setPortLayerList();
                   this.addPortLayer();
                }
            },function(error){
               console.error("获取港口信息列表出错！");
            });

        },

        convertPortObj:function(obj){
            var oneobj={};
            oneobj.id=obj.id;
            oneobj.cc=obj.cc;
            oneobj.lon=obj.lo/600000;     
            oneobj.lat=obj.la/600000;
            oneobj.name=obj.pn;
            return oneobj;

        },

        createPortMarker:function(portobj,isAddEvent){
           isAddEvent = (isAddEvent === undefined ? true : isAddEvent );
           var latlng = L.latLng(portobj.lat,portobj.lon),
               tipText = portobj.name,
               portIcon = L.icon({
                    iconUrl: 'themes/images/shipIcons/port.png',
                    iconSize: [20, 20],  //图标的大小，格式，第一个参数是宽度，第二个参数是高度
                    iconAnchor: [10, 10] //图标显示位置，例如宽度和高度是图标大小的一半，则经纬度的点正好在图标的中心点
                });
           var markOptions = {
              icon:portIcon,                  
              title:tipText, //添加鼠标移上后的提示信息
              data:portobj
           };
           var Lmarker = L.marker(latlng,markOptions);
           if(isAddEvent){
             Lmarker.on("click",this.portClickEvt,this);
           }           
           return Lmarker;

        },

        portClickEvt:function(event){
            var curPort = event.target,
                data = {},
                url = this.config.infoUrl;
            data.id = curPort.options.data.id;
            this.ajax.post(url,data,true,this,function(res){
               if(res.state != 1){
                 console.error(res.msg.error);
               }else{
                  var portobj = this.convertPortInfoObj(res.msg.portObject);
                  // portobj = L.extend(portobj,curPort.options.data);
                  var popupOptions = {
                      maxWidth:300,
                      minWidth:300,
                      className:'ict_portInfo_popupContainer'
                   };
                  curPort.on("popupopen",function(){
                    this._initInfoPopEvts();
                  },this);
                  curPort.bindPopup(this.getPopupContent(portobj),popupOptions).openPopup();                    
               }       
            },function(error){
              console.error("获取港口信息出错！");
            });

        },

        //搜索定位
        locateByPortId:function(id){

             var port = this.getPortById(id);
             if(port){
                 // if(port.options.opacity === 0){
                 //      port.setOpacity(1);
                 //      port.on("click",this.portClickEvt,this);
                 // }
                 // port.openPopup();

                 this.ictmap.map.setView(port.getLatLng(),this.config.showLevel);
                  port.fire('click');
                 // this.ictmap.map.panTo(port.getLatLng());
             }
            // var url = this.config.infoUrl,
            //     data = {};
            // data.id = id;
            // this.ajax.post(url,data,true,this,function(res){
            //    if(res.state != 1){
            //        console.error(res.msg.error);
            //        L.ict.app.util.dialog.error($.i18n.prop('dialog_alert_title'),"获取港口信息出错！");
            //    }else{
            //       var portobj = this.convertPortInfoObj(res.msg.portObject);
            //       // portobj = L.extend(portobj,this.getPortobjById(id));

            //       var popupOptions = {
            //           maxWidth:300,
            //           minWidth:300,
            //           className:'ict_portInfo_popupContainer'
            //        };
            //        this.clearLocatLyr();
            //        this._locatePortLyr = this.createPortMarker(portobj);
            //        this._locatePortLyr.addTo(this.ictmap.map);
            //        this._locatePortLyr.bindPopup(this.getPopupContent(portobj),popupOptions).openPopup(); 
            //        this._locatePortLyr.on("popupclose",function(){
            //           // this.clearLocatLyr();
            //           // this.addPortLayer();
            //           // this.ictmap.realtarget.addRealTargetLayer();
            //        },this);
            //        this._locatePortLyr.on("popupopen",function(){
            //           // this.clearLocatLyr();
            //           // this.addPortLayer();
            //           // this.ictmap.realtarget.addRealTargetLayer();
            //           this._initInfoPopEvts();
            //        },this);                   
            //        // this.ictmap.map.setView(this._locatePortLyr.getLatLng(),this.config.showLevel);     
            //        this.ictmap.map.panTo(this._locatePortLyr.getLatLng());
            //        this._initInfoPopEvts();
            //    }
            // },function(error){

            // });
        },

        //进离港统计
        portStastic:function(data){
           var url = this.config.portStaticUrl;
           this.ajax.post(url,data,true,this,function(res){
               if(res.state !== 1){
                  console.error(res.msg.error);
                  L.ict.app.util.dialog.error($.i18n.prop('dialog_alert_title'),$.i18n.prop('port_info_stastic_error'));
               } else {     
                  this._locatePortLyr.closePopup();             
                  this.showStasticRes(res);
               }
           },function(error){
               L.ict.app.util.dialog.error($.i18n.prop('dialog_alert_title'),$.i18n.prop('port_info_stastic_error'));  
               // $(".ict_portInfo_popupContainer").find(".msg").text("统计出错！");
           });
        },

        showStasticRes:function(data){
            var options = {
               title:$.i18n.prop('port_static_title'),
               width:800,
               height:600
            };
            options.contentHTML = this.getStasticHtml(data);
            var pop = this._stasticPanel = new L.ICT.PopPanel(options);
            pop.show();
            this._initStasticEvts();   
            this.initecharts(data);         
        },

        getStasticHtml:function(data){
           var t1 = $.i18n.prop('port_static_chart');
           var t2 = $.i18n.prop('port_static_table');
           var html = [];
           html.push('<div class="port_stastic_container">');
           html.push('<div class="titleDiv">');
           html.push('<ul class="nav nav_titleNav">');
           html.push('<li class="active" data-info="chart"><a href="#" >'+ t1 +'</a></li>');
           html.push('<li data-info="table"><a href="#">'+ t2 +'</a></li>');
           html.push('</ul>');
           html.push('</div>');
           html.push('<div class="contentDiv">');
           html.push(this.getstasticChartHtml(data));
           html.push(this.getstasticTableHtml(data));
           html.push('</div>');
           html.push('</div>');
           return html.join("");
        },

        getstasticChartHtml:function(data){
           var sr = $.i18n.prop('port_static_qysr');
           var sl = $.i18n.prop('port_static_qysl');
           var html = [];
           html.push('<div class="stasticChartDiv" style="display:block;">');
           html.push('<p>'+ sr +'</p>');
           html.push('<div class="stastic_chart_enter"></div>');
           html.push('<p>'+ sl +'</p>');
           html.push('<div class="stastic_chart_out"></div>');           
           html.push('</div>');
           return html.join("");
        },

        getstasticTableHtml:function(data){
           var enterList = data.msg.shipDst;
           var outList = data.msg.shipSrc;
           var enterCount = enterList.length;
           var outCount = outList.length;      
           var qc = $.i18n.prop('port_static_qysrcount',enterCount);
           var ql = $.i18n.prop('port_static_qyslcount',outCount);
           var co = $.i18n.prop('common_ship_country');
           var t1 = $.i18n.prop('func_filter_shiptype_1');
           var t2 = $.i18n.prop('func_filter_shiptype_3');
           var t3 = $.i18n.prop('func_filter_shiptype_6');
           var t4 = $.i18n.prop('func_filter_shiptype_5');
           var t5 = $.i18n.prop('func_filter_shiptype_7');
           var t6 = $.i18n.prop('func_filter_shiptype_8');
           var t7 = $.i18n.prop('func_filter_shiptype_100');


           var html = [];
           html.push('<div class="stasticTableDiv" style="display:none;">');
           html.push('<p>'+ qc +'</p>');
           html.push('<div class="stastic_table_enter">');
           html.push('<table>');
           html.push('<thead><tr><th>'+ co +'</th><th>'+ t1 +'</th><th>'+ t2 +'</th><th>'+ t3 +'</th><th>'+ t4 +'</th><th>'+ t5 +'</th><th>'+ t6 +'</th><th>'+ t7 +'</th></tr></thead>');
           html.push('<tbody>');
           for(var i=0,len=enterList.length;i<len;i++){
              var eobj = enterList[i];
              html.push('<tr>');
              html.push('<td>'+'<img src="themes/images/country/'+eobj.countryCn.trim()+'.png">'+eobj.countryCn+'</td>');
              html.push('<td>'+eobj.shiphuo+'</td>');
              html.push('<td>'+eobj.shipyou+'</td>');
              html.push('<td>'+eobj.shiptuo+'</td>');
              html.push('<td>'+eobj.shipyu+'</td>');
              html.push('<td>'+eobj.shipke+'</td>');
              html.push('<td>'+eobj.shipjun+'</td>');
              html.push('<td>'+eobj.shipother+'</td>');
              html.push('</tr>');
              if( i < len-1){
                 html.push('<tr class="splitTr"><td colspan="8">&nbsp</td></tr>');
              }
           }
           html.push('</tbody>');
           html.push('</table>');
           html.push('</div>');
           html.push('<p>'+ ql +'</p>');
           html.push('<div class="stastic_table_out">'); 
           html.push('<table>');
            html.push('<thead><tr><th>'+ co +'</th><th>'+ t1 +'</th><th>'+ t2 +'</th><th>'+ t3 +'</th><th>'+ t4 +'</th><th>'+ t5 +'</th><th>'+ t6 +'</th><th>'+ t7 +'</th></tr></thead>');
           html.push('<tbody>');
           for(var i=0,len=outList.length;i<len;i++){
              var otbj = outList[i];
              html.push('<tr>');
              html.push('<td>'+'<img src="themes/images/country/'+otbj.countryCn.trim()+'.png">'+otbj.countryCn+'</td>');
              html.push('<td>'+otbj.shiphuo+'</td>');
              html.push('<td>'+otbj.shipyou+'</td>');
              html.push('<td>'+otbj.shiptuo+'</td>');
              html.push('<td>'+otbj.shipyu+'</td>');
              html.push('<td>'+otbj.shipke+'</td>');
              html.push('<td>'+otbj.shipjun+'</td>');
              html.push('<td>'+otbj.shipother+'</td>');
              html.push('</tr>');
              if( i < len-1){
                 html.push('<tr class="splitTr"><td colspan="8">&nbsp</td></tr>');
              }            
           }   
           html.push('</tbody>');        
           html.push('</table>');
           html.push('</div>');      
           html.push('</div>');
           return html.join("");
        },

        initecharts:function(data){
            var $container = this._stasticPanel.getContainer();
            var ydata_enter ={};
            var ydata_out = {};
            for(var i=0,len=data.msg.shipDst.length;i<len;i++){
              var eobj = data.msg.shipDst[i];
              ydata_enter[eobj.countryCn] = [];
              ydata_enter[eobj.countryCn].push(eobj.shiphuo);
              ydata_enter[eobj.countryCn].push(eobj.shipyou);
              ydata_enter[eobj.countryCn].push(eobj.shiptuo);
              ydata_enter[eobj.countryCn].push(eobj.shipyu);
              ydata_enter[eobj.countryCn].push(eobj.shipke);
              ydata_enter[eobj.countryCn].push(eobj.shipjun);
              ydata_enter[eobj.countryCn].push(eobj.shipother);

            }
            for(var i=0,len=data.msg.shipSrc.length;i<len;i++){
              var otobj = data.msg.shipSrc[i];
              ydata_out[otobj.countryCn] = [];
              ydata_out[otobj.countryCn].push(otobj.shiphuo);
              ydata_out[otobj.countryCn].push(otobj.shipyou);
              ydata_out[otobj.countryCn].push(otobj.shiptuo);
              ydata_out[otobj.countryCn].push(otobj.shipyu);
              ydata_out[otobj.countryCn].push(otobj.shipke);
              ydata_out[otobj.countryCn].push(otobj.shipjun);
              ydata_out[otobj.countryCn].push(otobj.shipother);

            }            
            //echarts 
            this.echart_enter = echarts.init($container.find(".stastic_chart_enter").get(0));
            this.echart_out = echarts.init($container.find(".stastic_chart_out").get(0));
            var option_enter = this.getChartOption(ydata_enter);
            var option_out = this.getChartOption(ydata_out);
            this.echart_enter.setOption(option_enter, true);
            this.echart_out.setOption(option_out,true);
        },

        _initStasticEvts:function(){
            var self = this;
            var $container = this._stasticPanel.getContainer();
            //图表切换
            $container.find(".nav_titleNav>li").on("click",function(){
                $(this).addClass("active").siblings().removeClass("active");
                var type = $(this).data("info");
                if(type === "chart"){
                   $container.find(".stasticChartDiv").css("display","block");
                   $container.find(".stasticTableDiv").css("display","none");
                } else{
                   $container.find(".stasticChartDiv").css("display","none");
                   $container.find(".stasticTableDiv").css("display","block");
                }

            });
            //滚动
            $container.find(".stastic_table_enter").mCustomScrollbar({ theme: "minimal-dark" });  
            $container.find(".stastic_table_out").mCustomScrollbar({ theme: "minimal-dark" });              

        },

        getChartOption:function(ydata){
           var c1 = $.i18n.prop('func_filter_shipflag_1');
           var c2 = $.i18n.prop('func_filter_shipflag_5');
           var c3 = $.i18n.prop('func_filter_shipflag_2');
           var c4 = $.i18n.prop('func_filter_shipflag_3');
           var c5 = $.i18n.prop('func_filter_shipflag_4');
           var c6 = $.i18n.prop('func_filter_shipflag_100');

           var t1 = $.i18n.prop('func_filter_shiptype_1');
           var t2 = $.i18n.prop('func_filter_shiptype_3');
           var t3 = $.i18n.prop('func_filter_shiptype_6');
           var t4 = $.i18n.prop('func_filter_shiptype_5');
           var t5 = $.i18n.prop('func_filter_shiptype_7');
           var t6 = $.i18n.prop('func_filter_shiptype_8');
           var t7 = $.i18n.prop('func_filter_shiptype_100');

          var  option = {
                  tooltip : {
                      trigger: 'axis',
                      axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                          type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                      }
                  },
                  legend: {
                      // orient:'top',
                      data:[c1,c2,c3,c4,c5,c6]
                  },
                  xAxis : [
                      {
                          type : 'category',
                          data : [t1,t2,t3,t4,t5,t6,t7]
                      }
                  ],
                  yAxis : [
                      {
                          type : 'value'
                      }
                  ],
                  color:["#065F89", "#0A7CB0", "#0FA0E3", "#3AD3FF", "#6DDEFE", "#BDF1FF"],
                  series : [
                      {
                         
                          name:c1,
                          type:'bar',
                          barWidth : 10,
                          stack: 'stastic',
                          data:ydata[c1]
                      },
                      {
                          name:c2,
                          type:'bar',
                          stack: 'stastic',
                          data:ydata[c2]
                      },
                      {
                          name:c3,
                          type:'bar',
                          stack: 'stastic',
                          data:ydata[c3]
                      },
                      {
                          name:c4,
                          type:'bar',
                          stack: 'stastic',
                          data:ydata[c4]
                      },
                      {
                          name:c5,
                          type:'bar',
                          stack: 'stastic',
                          data:ydata[c5]
                      },
                      {
                          name:c6,
                          type:'bar',
                          stack: 'stastic',
                          data:ydata[c6]
                      }                                            
                  ]
              };
              return option;
              
        },

        _initInfoPopEvts:function(){
           var self = this,
               $container =  $(".ict_portInfo_popupContainer"),
               $msg = $container.find(".msg"),
               dateUtil = L.ict.app.util.dateTime;
            //日期控件
           $container.find(".Wdate").on("focus",function(){
                var config = {
                   readOnly:true,
                   dateFmt:'yyyy-MM-dd HH',
                   isShowClear:false,
                   startDate:'%y-%M-01 00:00:00',
                   alwaysUseStartDate:true,
                   maxDate:'%y-%M-%d %H:%m:%s'
                };
                WdatePicker(config);
            });
           var startTime = dateUtil.getNewDateTimeBeforHour(24);
               startTime = dateUtil.formatDateH(startTime);
           var endTime = dateUtil.formatDateH(new Date());
           $container.find(".Wdate.startTime").val(startTime);
           $container.find(".Wdate.endTime").val(endTime);  
           //确定点击事件
           $(".ict_portInfo_popupContainer .btnDiv button").on("click",function(){
               //id
               var portid = $(this).data("id");
               //判断时间
               var startTime = $container.find(".startTime").val();
               var endTime = $container.find(".endTime").val();    
               var chkt = dateUtil.checkStrartEndTime(startTime+":00:00",endTime+":00:00",1);
               if(!chkt.result){ $msg.text(chkt.msg); return;}
               startTime = dateUtil.getCusUnixTime(startTime+":00:00");
               endTime = dateUtil.getCusUnixTime(endTime+":00:00"); 
               //data 
               var data = {
                  portid:portid,
                  startTime:startTime,
                  endTime:endTime
               };               
               //统计
               self.portStastic(data);
                
           });

        },
        
        convertPortInfoObj:function(portobj){
            var obj = {};
            obj.id = portobj.id;
            obj.areaname = portobj.area_Name;
            obj.name = portobj.port_Name;
            obj.countryen = portobj.country;
            obj.countryzh = portobj.country_Chinese;
            obj.countrycode = portobj.country_Code;
            obj.portsize = portobj.harbor_Size;
            obj.porttype = portobj.harbor_Type;
            obj.lat =  portobj.latitude/600000;
            obj.lon = portobj.longitude/600000;
            return obj;

        },
        
        clearLocatLyr:function(){
           if(this._locatePortLyr) this._locatePortLyr.remove();
           this._locatePortLyr = null;          
        },

        getPortobjById:function(id){
           var port = {};
           for(var i=0,len=this._portList.length;i<len;i++){
              if(this._portList[i].id == id){
                port = this._portList[i];
                break;
              }
           }
           return port;
        },

        getPopupContent:function(portobj){
            var lat = L.ict.app.util.tool.latlngTodfmStr(portobj.lat,'lat'); 
            var lng = L.ict.app.util.tool.latlngTodfmStr(portobj.lon,'lng');
            var p = $.i18n.prop('port_info_title');
            var p1 = $.i18n.prop('port_info_id');
            var p2 = $.i18n.prop('port_info_areaenname');
            var p3 = $.i18n.prop('port_info_enname');
            var p4 = $.i18n.prop('port_info_coenname');
            var p5 = $.i18n.prop('port_info_cozhname');
            var p6 = $.i18n.prop('port_info_size');
            var p7 = $.i18n.prop('port_info_type');
            var p8 = $.i18n.prop('common_ship_lng');
            var p9 = $.i18n.prop('common_ship_lat');
            var p10 = $.i18n.prop('port_info_conum');
            var p11 = $.i18n.prop('port_static_jltj');
            var p12 = $.i18n.prop('common_time_info2');
            var p13 = $.i18n.prop('common_btn_ok');

            var html = [];
            html.push('<div class="portInfo_Div">');
            html.push('<div class="portInfo_title">'+ p +'</div>');
            html.push('<div class="portInfo_table_div">');
            html.push('<table>');
            html.push('<tr><td>'+ p1 +'</td><td>'+ portobj.id +'</td></tr>');
            html.push('<tr><td'+ p2 +'</td><td>'+ portobj.areaname +'</td></tr>');
            html.push('<tr><td>'+ p3 +'</td><td>'+ portobj.name +'</td></tr>');
            html.push('<tr><td>'+ p4 +'</td><td>'+ portobj.countryen +'</td></tr>');
            html.push('<tr><td>'+ p5 +'</td><td>'+ portobj.countryzh +'</td></tr>');
            html.push('<tr><td>'+ p6 +'</td><td>'+ portobj.portsize +'</td></tr>');
            html.push('<tr><td>'+ p7 +'</td><td>'+ portobj.porttype +'</td></tr>');
            html.push('<tr><td>'+ p8 +'</td><td>'+ lng +'</td></tr>');
            html.push('<tr><td>'+ p9 +'</td><td>'+ lat +'</td></tr>');   
            html.push('<tr><td>'+ p10 +'</td><td>'+ portobj.countrycode +'</td></tr>');                                            
            html.push('</table>');
            html.push('</div>');
            html.push('<div class="port_stastic">');
            html.push('<p>'+ p11 +'</p>');
            html.push('<input type="text" class="Wdate startTime">&nbsp<label>'+ p12 +'</label>&nbsp<input type="text" readonly  class="Wdate endTime">');
            html.push('</div>');
            html.push('<p class="msg"></p>');
            html.push('<div class="btnDiv">');
            html.push('<button type="button" data-id="'+ portobj.id +'">'+ p13 +'</button>');
            html.push('</div>');
            html.push('</div>');
            return html.join("");

            // var lat = L.ict.app.util.tool.latlngTodfm(portobj.lat,'lat'); 
            // lat = lat[3]+' '+lat[0]+'°'+lat[1]+'′'+lat[2]+'″';
            // var lng = L.ict.app.util.tool.latlngTodfm(portobj.lon,'lng');
            // lng = lng[3]+' '+lng[0]+'°'+lng[1]+'′'+lng[2]+'″';
            // var html = [];
            // html.push('<div class="portInfo_Div">');
            // html.push('<div class="portInfo_title">港口信息资料</div>');
            // html.push('<div class="portInfo_table_div">');
            // html.push('<table>');
            // html.push('<tr><td>港口ID:</td><td>'+portobj.id+'</td></tr>');
            // html.push('<tr><td>区域英文名:</td><td>'+portobj.area_name+'</td></tr>');
            // html.push('<tr><td>港口英文名:</td><td>'+portobj.port_name+'</td></tr>');
            // html.push('<tr><td>国家英文名:</td><td>'+portobj.country+'</td></tr>');
            // html.push('<tr><td>国家中文名:</td><td>'+portobj.country_chinese+'</td></tr>');
            // html.push('<tr><td>港口大小:</td><td>'+portobj.harbor_size+'</td></tr>');
            // html.push('<tr><td>港口类型:</td><td>'+portobj.harbor_type+'</td></tr>');
            // html.push('<tr><td>经度:</td><td>'+lng+'</td></tr>');
            // html.push('<tr><td>纬度:</td><td>'+lat+'</td></tr>');   
            // html.push('<tr><td>国家代码:</td><td>'+portobj.cc+'</td></tr>');                                            
            // html.push('</table>');
            // html.push('</div>');
            // html.push('</div>');
            // return html.join("");

        },

        setPortLayerList:function(){
            this._portLayerList = [];
            for(var i=0,len=this._portList.length;i<len;i++){
                var p = this._portList[i];
                var marker = this.createPortMarker(p);
                this._portLayerList.push(marker);
            }

        },     

        showOrHidePortLayer:function(){
           if(this.ictmap.getCurZoom() < this.config.showLevel){
              this.hidePortLayer();
           }else{
              this.showPortLayer();
           }
        },

        showPortLayer:function(){
            if(!this.portLayerGroup){
                this.getPortList();
            } else{
              this.portLayerGroup.eachLayer(function(layer){
                 layer.setOpacity(1);
                 layer.on("click",this.portClickEvt,this);
              },this);
            }
        },

        hidePortLayer:function(){
            if(!this.portLayerGroup) return;
            this.portLayerGroup.eachLayer(function(layer){
               layer.setOpacity(0);
               layer.off("click",this.portClickEvt,this);
            },this);
        },
        
        getPortById:function(id){
           var port = null;
           if(this.portLayerGroup){
              this.portLayerGroup.eachLayer(function(layer){
                 var data = layer.options.data;
                 if(data.id === id){
                    port = layer;
                 }
              },this);
           }
           return port;           

        },

        addPortLayer:function(){
            this.portLayerGroup = new L.FeatureGroup(this._portLayerList);
            if(this.ictmap.getCurZoom() < this.config.showLevel){
               this.hidePortLayer();
            }
            this.ictmap.map.addLayer(this.portLayerGroup);

        },

        removePortLayer:function(){
            if(this.portLayerGroup && this.ictmap.map.hasLayer(this.portLayerGroup)){
                 this.ictmap.map.removeLayer(this.portLayerGroup);
            }
            this.portLayerGroup = null;
        }

      });


     // L.ICT.Func.add("PortInfo",{

     //     Class: L.Class.extend({

     //        id:'PortInfo',

     //        initialize:function(ictmap){
     //            this.config = Project_ParamConfig.PortConfig;
     //            this.ajax = new L.ICT.Ajax();
     //            this.ictmap = ictmap;
     //            this._portList = [];
     //            this._portLayerList = [];
     //            this.portLayerGroup = null;
     //            //获取港口列表
     //            this.getPortList();

     //        },

     //        start:function(){
     //           // this.getPortList();

     //        },

     //        stop:function(){
     //          // this.removePortLayer();

     //        },

     //        getPortList:function(){
     //            var url = this.config.listUrl;
     //            this.ajax.get(url,null,true,this,function(res){
     //                if(res.state != 1){
     //                   console.error(res.msg.error);
     //                }else{
     //                   var listinfo = res.msg.portlist;
     //                   this._portList = [];
     //                   for(var i=0,len=listinfo.length;i<len;i++){
     //                       var port = this.convertPortObj(listinfo[i]); 
     //                       this._portList.push(port);
     //                   }
     //                   this.setPortLayerList();
     //                   // this.addPortLayer();
     //                }
     //            },function(error){
     //               console.error("获取港口信息列表出错！");
     //            });

     //        },

     //        convertPortObj:function(obj){
     //            var oneobj={};
     //            oneobj.id=obj.id;
     //            oneobj.cc=obj.cc;
     //            oneobj.lon=obj.lon/600000;     
     //            oneobj.lat=obj.lat/600000;
     //            oneobj.name=obj.name;
     //            return oneobj;

     //        },

     //        createPortMarker:function(portobj){
     //           var latlng = L.latLng(portobj.lat,portobj.lon),
     //               tipText = portobj.name,
     //               portIcon = L.icon({
     //                    iconUrl: 'themes/images/shipIcons/port.png',
     //                    iconSize: [32, 32],  //图标的大小，格式，第一个参数是宽度，第二个参数是高度
     //                    iconAnchor: [16, 16] //图标显示位置，例如宽度和高度是图标大小的一半，则经纬度的点正好在图标的中心点
     //                });
     //           var markOptions = {
     //              icon:portIcon,                  
     //              title:tipText, //添加鼠标移上后的提示信息
     //              data:portobj
     //           };
     //           var Lmarker = L.marker(latlng,markOptions);
     //           Lmarker.on("click",this.portClickEvt,this);
     //           return Lmarker;

     //        },
            
     //        portClickEvt:function(event){
     //            var curPort = event.target,
     //                data = {},
     //                url = this.config.infoUrl;
     //            data.id = curPort.options.data.id;
     //            this.ajax.post(url,data,true,this,function(res){
     //               if(res.state != 1){
     //                  console.error(res.msg.error);
     //               }else{
     //                  var portobj = res.msg.port;
     //                  portobj = L.extend(portobj,curPort.options.data);
     //                  var popupOptions = {
     //                      maxWidth:300,
     //                      minWidth:300,
     //                      className:'ict_portInfo_popupContainer'
     //                   };
     //                  curPort.bindPopup(this.getPopupContent(portobj),popupOptions).openPopup();                    
     //               }       
     //            },function(error){
     //              console.error("获取港口信息出错！");
     //            });

     //        },

     //        getPopupContent:function(portobj){
     //            var lat = L.ict.app.util.tool.latlngTodfm(portobj.lat,'lat'); 
     //            lat = lat[3]+' '+lat[0]+'°'+lat[1]+'′'+lat[2]+'″';
     //            var lng = L.ict.app.util.tool.latlngTodfm(portobj.lon,'lng');
     //            lng = lng[3]+' '+lng[0]+'°'+lng[1]+'′'+lng[2]+'″';
     //            var html = [];
     //            html.push('<div class="portInfo_Div">');
     //            html.push('<div class="portInfo_title">港口信息资料</div>');
     //            html.push('<div class="portInfo_table_div">');
     //            html.push('<table>');
     //            html.push('<tr><td>港口ID:</td><td>'+portobj.id+'</td></tr>');
     //            html.push('<tr><td>区域英文名:</td><td>'+portobj.area_name+'</td></tr>');
     //            html.push('<tr><td>港口英文名:</td><td>'+portobj.port_name+'</td></tr>');
     //            html.push('<tr><td>国家英文名:</td><td>'+portobj.country+'</td></tr>');
     //            html.push('<tr><td>国家中文名:</td><td>'+portobj.country_chinese+'</td></tr>');
     //            html.push('<tr><td>港口大小:</td><td>'+portobj.harbor_size+'</td></tr>');
     //            html.push('<tr><td>港口类型:</td><td>'+portobj.harbor_type+'</td></tr>');
     //            html.push('<tr><td>经度:</td><td>'+lng+'</td></tr>');
     //            html.push('<tr><td>纬度:</td><td>'+lat+'</td></tr>');   
     //            html.push('<tr><td>国家代码:</td><td>'+portobj.cc+'</td></tr>');                                            
     //            html.push('</table>');
     //            html.push('</div>');
     //            html.push('</div>');
     //            return html.join("");

     //        },

     //        setPortLayerList:function(){
     //            this._portLayerList = [];
     //            for(var i=0,len=this._portList.length;i<len;i++){
     //                var p = this._portList[i];
     //                var marker = this.createPortMarker(p);
     //                this._portLayerList.push(marker);
     //            }

     //        },     

     //        addPortLayer:function(){
     //            if(this.ictmap.getCurZoom() < this.config.showLevel){
     //              this.removePortLayer();
     //            }else{
     //              this.portLayerGroup = new L.FeatureGroup(this._portLayerList).addTo(this.ictmap.map);
     //            }
     //            // this.removePortLayer();
     //            // // this.setPortLayerList();
     //            // this.portLayerGroup = new L.FeatureGroup(this._portLayerList).addTo(this.ictmap.map);

     //        },

     //        removePortLayer:function(){
     //            if(this.portLayerGroup && this.ictmap.map.hasLayer(this.portLayerGroup)){
     //                 this.ictmap.map.removeLayer(this.portLayerGroup);
     //            }
     //            this.portLayerGroup = null;
     //            // this.portLayerGroup.clearLayers();

     //        }

     //     })

     // });

});