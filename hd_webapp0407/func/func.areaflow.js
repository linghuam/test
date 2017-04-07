/**
*区域流量分析
*/
define("func/areaflow",[
	"leaflet",
  "echarts",
	"func/base",
  "control/draw",
  "data/ajax",
  "plugins/mcscroll",
  "control/panel"

],function(L,echarts){

     
L.ICT.Func.add("AreaFlow",{

     Class: L.Class.extend({

        _data:{
          historyChk:false,
          realtimeChk:false,
          startTime:null,
          endTime:null
        },

        initialize:function(){
           this.ajax = new L.ICT.Ajax();     
           this.ictmap = L.ict.app.ictmap;
           this.dateUtil = L.ict.app.util.dateTime;               
           this.menu = L.ict.app.menu;
           this.menuid = "ict_menu_main_qyll";
           this.config = Project_ParamConfig.StasticConfig;

           this._container = null;               
           this._popPanel = null;
           this._drawPopPanel = null;
           this._resultPopPanel = null;
           this._layer = null;
           this._layerType = null; 

        },

        start:function(){
            this.menu.mainmenu.deactiveMenuExceptOne(this.menuid);
            this.menu.mainmenu.disableMenuExceptOne(this.menuid);
            if(!L.ICT.Func["UserLogin"].getInstance().isLogin()){
                L.ICT.Func["UserLogin"].getInstance().alertLoginDialog();
                this.menu.mainmenu.deactiveMenu(this.menuid);
                return;
            }          
           if(this._container || this._popPanel) {return;}
           this._initUi();
           this._initEvts();
           this._container.find("input[type=radio]").eq(0).click();

        },

        stop:function(){
           this.menu.mainmenu.enableMenu();
           this.menu.mainmenu.deactiveMenu(this.menuid);
           this.ictmap.deactivate();
           if(this._popPanel) {this._popPanel.remove(false);}
           if(this._layer) {this._layer.remove();}
           if(this._drawPopPanel) {this._drawPopPanel.remove();}
           if(this._resultPopPanel) {this._resultPopPanel.remove(false);}
           this._container = null;
           this._popPanel = null;
           this._drawPopPanel = null;
           this._resultPopPanel = null;
           this._layer = null;
           this._layerType = null;     

        },

        getContentHTML:function(){
            var html = [];
            html.push('<div class="areaflowAnalysisContainer">');
            html.push('<p class="common_draw_title">绘制区域：</p>');
            html.push('<div class="drawDiv">');
            html.push('<input type="radio" name="drawRadio" value="circle"><img src="themes/images/frame/ico_circle.png">&nbsp<label class="draw_circle_txt common_draw_circle">圆形</label>&nbsp&nbsp');
            html.push('<input type="radio" name="drawRadio" value="rect"><img src="themes/images/frame/ico_rect.png">&nbsp<label class="draw_rect_txt common_draw_rect">矩形</label>');
            html.push('</div>');
            html.push('<div class="timeDiv">');
            html.push('<label class="common_time_info1">时间:</label> <input type="text" class="Wdate startTime">');
            html.push('&nbsp<label class="common_time_info2">至</label>&nbsp<input type="text" class="Wdate endTime">');
            html.push('</div>');
            html.push('<p class="msg"></p>');
            html.push('<div class="btnDiv">');
            html.push('<button type="button" class="okBtn func_qyll_okbtn">查询</button>');
            html.push('</div>');                
            html.push('</div>');
            return html.join("");
        },

        _initUi:function(){
            var options = {
                title:$.i18n.prop('func_qyll_title'),
                width:400,
                height:270,
                left:100,
                top:200
            };
            var content = this._container = $(this.getContentHTML());
            options.contentHTML = content;
            var pop = this._popPanel = new L.ICT.PopPanel(options);          
            pop.on("popPanelRemove",function(){
                this._popPanel = this._container = null;
                this.stop();

            },this);
            pop.show();
        },

        _initEvts:function(){
           var self = this;

           //中英文
           self._container.find(".func_qyll_okbtn").html($.i18n.prop('func_qyll_okbtn'));
           self._container.find(".common_draw_title").html($.i18n.prop('common_draw_title'));
           self._container.find(".common_draw_circle").html($.i18n.prop('common_draw_circle'));
           self._container.find(".common_draw_rect").html($.i18n.prop('common_draw_rect'));
           self._container.find(".common_time_info1").html($.i18n.prop('common_time_info1'));
           self._container.find(".common_time_info2").html($.i18n.prop('common_time_info2'));
           
           //绘图
           self._container.find("input[type=radio]").on("click",function(){
               if(self._layer) self._layer.remove();
               if(self.__drawPopPanel) self._drawPopPanel.remove();
               var type = $(this).val();
               if(type == "circle"){
                  self.ictmap.activate(L.ICT.MapMouseState.CIRCLE,self._drawCallback,null,self);
               }else if(type == "rect"){
                  self.ictmap.activate(L.ICT.MapMouseState.RECTANGLE,self._drawCallback,null,self);
               }               

           });

           //时间
           self._container.find(".Wdate").on("focus",function(){
              var config = {
                 readOnly:true,
                 dateFmt:'yyyy-MM-dd HH',
                 isShowClear:false,
                 startDate:'%y-%M-01 00:00:00',
                 alwaysUseStartDate:true,
                 maxDate:'%y-%M-%d %H:%m:%s',
                 lang: window.localStorage.getItem("language") === 'en' ? 'en' : 'zh-cn'
              };
              WdatePicker(config);

           });
          var startTime = self.dateUtil.getNewDateTimeBeforHour(24*3);
             startTime = self.dateUtil.formatDateH(startTime);
          var endTime = self.dateUtil.formatDateH(new Date());
          self._container.find(".Wdate.startTime").val(startTime);
          self._container.find(".Wdate.endTime").val(endTime);  

           //确定
           self._container.find(".okBtn").on("click",function(){
                var $msg = self._container.find(".msg"),
                    startTime = self._container.find(".startTime").val(),
                    endTime = self._container.find(".endTime").val();
                $msg.html("");
                //检查
                if(!self.ictmap.map.hasLayer(self._layer)){
                  $msg.html($.i18n.prop('common_draw_error1'));
                   return; 
                 }
                //时间
                var chkt = self.dateUtil.checkStrartEndTime(startTime+":00:00",endTime+":00:00",self.config.timerange);
                if(!chkt.result){ 
                  $msg.html(chkt.msg);
                  return; 
                }
               startTime = L.ict.app.util.dateTime.getCusUnixTime(startTime+":00:00");
               endTime = L.ict.app.util.dateTime.getCusUnixTime(endTime+":00:00"); 
               //隐藏输入框
               self._popPanel.close();
               //数据
               var data = {};
               var bounds = self._layer.getBounds();
               data.ldlon = bounds.getSouthWest().lng; //左下经度
               data.ldlat = bounds.getSouthWest().lat; //左下纬度
               data.rulon = bounds.getNorthEast().lng;
               data.rulat = bounds.getNorthEast().lat;
               data.startTime = startTime;
               data.endTime = endTime;
               //分析
               self.analysis(data);
                
           });

           //取消
           self._container.find(".cancelBtn").on("click",function(){
               self.stop();
           });

        },

        _drawCallback:function(e){
            var layer = this._layer = e.layer,
                layerType = this._layerType =  e.layerType;
            if(this._drawPopPanel){
               this._drawPopPanel.remove();
            }
            //弹出图层编辑框
            this._drawPopPanel = new L.ICT.DrawPopPanel(layer,layerType);
            this._drawPopPanel.on("popPanelRemove",function(){
               this._drawPopPanel = null;
            },this);
            this._drawPopPanel.on("CancelDraw",function(obj){
                this._layer = null;              
            },this);               
            this._drawPopPanel.show();   
            //添加图层
            this.ictmap.map.addLayer(layer);           
            //图层可编辑              
            if(layer.editing){
              layer.editing.enable();
              layer.on("edit",function(){
                this._drawPopPanel.updateContent();
              },this);
            }          

        },

        analysis:function(data){
            var options = {
                title:$.i18n.prop('func_qyll_title'),
                width:800,
                height:600,
                contentHTML:this.getResultHTML()           
            };
            var pop = this._resultPopPanel = new L.ICT.PopPanel(options);
            pop.on("popPanelRemove",function(){
               this._resultPopPanel = null;
               this.stop();
            },this);
            pop.show();            
            // this._initResEvts();
            this.sendAjax(data);
        },

        _initResEvts:function(){
            var $container = this._resultPopPanel.getContainer().find(".areaflow_stastic_container");
            var self = this;
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

        sendAjax:function(data){
            var url = this.config.areaflowUrl;
            this.ajax.post(url,data,true,this,function(res){
               if(res.state !== 1){
                  console.error(res.msg.error);
                  L.ict.app.util.dialog.error($.i18n.prop('dialog_alert_title'),$.i18n.prop('func_qyll_error1'));
               } else {                               
                  this.showStasticRes(res);
                  this._initResEvts();
               }
            },function(error){
               L.ict.app.util.dialog.error($.i18n.prop('dialog_alert_title'),$.i18n.prop('func_qyll_error1'));  
            });            
        },

        showStasticRes:function(data){
            var $stasticChartDiv = this._resultPopPanel.getContainer().find(".stasticChartDiv"); 
            var $stasticTableDiv = this._resultPopPanel.getContainer().find(".stasticTableDiv");
            $stasticChartDiv.html(this.getstasticChartHtml(data)); 
            $stasticTableDiv.html(this.getstasticTableHtml(data)); 
            this.initecharts(data);          
        },

        getstasticChartHtml:function(data){
           var sr = $.i18n.prop('func_qyll_qysr');
           var sl = $.i18n.prop('func_qyll_qysl');
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
           var enterList = data.msg.shipList[0].areacountlist;
           var outList = data.msg.shipList[1].areacountlist;
           var enterCount = enterList.length;
           var outCount = outList.length;      
           var qc = $.i18n.prop('func_qyll_qysrcount',enterCount);
           var ql = $.i18n.prop('func_qyll_qyslcount',outCount);
           var co = $.i18n.prop('common_ship_country2');
           var t1 = $.i18n.prop('func_filter_shiptype_1');
           var t2 = $.i18n.prop('func_filter_shiptype_3');
           var t3 = $.i18n.prop('func_filter_shiptype_6');
           var t4 = $.i18n.prop('func_filter_shiptype_5');
           var t5 = $.i18n.prop('func_filter_shiptype_7');
           var t6 = $.i18n.prop('func_filter_shiptype_4');
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
              var countryimg = this.ictmap.realtarget.convertNameToKey(eobj.co.trim(),'shipflag');
              var coname = window.localStorage.getItem("language") === 'en' ? eobj.coen : eobj.co;
              html.push('<tr>');
              html.push('<td>'+'<img src="themes/images/filterdisplay/country_'+ countryimg +'.png">'+ coname +'</td>');
              html.push('<td>'+ eobj.tc1 +'</td>');
              html.push('<td>'+ eobj.tc3 +'</td>');
              html.push('<td>'+ eobj.tc6 +'</td>');
              html.push('<td>'+ eobj.tc5 +'</td>');
              html.push('<td>'+ eobj.tc7 +'</td>');
              html.push('<td>'+ eobj.tc4 +'</td>');
              html.push('<td>'+ eobj.tc100 +'</td>');
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
              var countryimg = this.ictmap.realtarget.convertNameToKey(otbj.co.trim(),'shipflag');
              var coname = window.localStorage.getItem("language") === 'en' ? otbj.coen : otbj.co;
              html.push('<tr>');
              html.push('<td>'+'<img src="themes/images/filterdisplay/country_'+ countryimg +'.png">'+ coname +'</td>');
              html.push('<td>'+ otbj.tc1 +'</td>');
              html.push('<td>'+ otbj.tc3 +'</td>');
              html.push('<td>'+ otbj.tc6 +'</td>');
              html.push('<td>'+ otbj.tc5 +'</td>');
              html.push('<td>'+ otbj.tc7 +'</td>');
              html.push('<td>'+ otbj.tc4 +'</td>');
              html.push('<td>'+ otbj.tc100 +'</td>');
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
            var $container = this._resultPopPanel.getContainer();
            var ydata_enter ={};
            var ydata_out = {};
            var enterList = data.msg.shipList[0].areacountlist;
            var outList = data.msg.shipList[1].areacountlist;
            for(var i=0,len=enterList.length;i<len;i++){
              var eobj = enterList[i];
              ydata_enter[eobj.co] = [];
              ydata_enter[eobj.co].push(eobj.tc1);
              ydata_enter[eobj.co].push(eobj.tc3);
              ydata_enter[eobj.co].push(eobj.tc6);
              ydata_enter[eobj.co].push(eobj.tc5);
              ydata_enter[eobj.co].push(eobj.tc7);
              ydata_enter[eobj.co].push(eobj.tc4);
              ydata_enter[eobj.co].push(eobj.tc100);
            }
            for(var i=0,len=outList.length;i<len;i++){
              var otobj = outList[i];
              ydata_out[otobj.co] = [];
              ydata_out[otobj.co].push(otobj.tc1);
              ydata_out[otobj.co].push(otobj.tc3);
              ydata_out[otobj.co].push(otobj.tc6);
              ydata_out[otobj.co].push(otobj.tc5);
              ydata_out[otobj.co].push(otobj.tc7);
              ydata_out[otobj.co].push(otobj.tc4);
              ydata_out[otobj.co].push(otobj.tc100);

            }            
            //echarts 
            this.echart_enter = echarts.init($container.find(".stastic_chart_enter").get(0));
            this.echart_out = echarts.init($container.find(".stastic_chart_out").get(0));
            var option_enter = this.getChartOption(ydata_enter);
            var option_out = this.getChartOption(ydata_out);
            this.echart_enter.setOption(option_enter, true);
            this.echart_out.setOption(option_out,true);
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
           var t6 = $.i18n.prop('func_filter_shiptype_4');
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
                          data:ydata["中国"]
                      },
                      {
                          name:c2,
                          type:'bar',
                          stack: 'stastic',
                          data:ydata["俄罗斯"]
                      },
                      {
                          name:c3,
                          type:'bar',
                          stack: 'stastic',
                          data:ydata["英国"]
                      },
                      {
                          name:c4,
                          type:'bar',
                          stack: 'stastic',
                          data:ydata["法国"]
                      },
                      {
                          name:c5,
                          type:'bar',
                          stack: 'stastic',
                          data:ydata["美国"]
                      },
                      {
                          name:c6,
                          type:'bar',
                          stack: 'stastic',
                          data:ydata["其他"]
                      }                                            
                  ]
              };
              return option;            
        },              

        getResultHTML:function(){
           var t1 = $.i18n.prop('port_static_chart');
           var t2 = $.i18n.prop('port_static_table');
           var html = [];
           html.push('<div class="areaflow_stastic_container">');
           html.push('<div class="titleDiv">');
           html.push('<ul class="nav nav_titleNav">');
           html.push('<li class="active" data-info="chart"><a href="#" >'+ t1 +'</a></li>');
           html.push('<li data-info="table"><a href="#">'+ t2 +'</a></li>');
           html.push('</ul>');
           html.push('</div>');
           html.push('<div class="contentDiv">');
           html.push('<div class="stasticChartDiv" style="display:block;"></div>');
           html.push('<div class="stasticTableDiv" style="display:none;"></div>');
           html.push('</div>');
           html.push('</div>');
           return html.join("");

        }

      })

   });

});