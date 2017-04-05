/**
*监控统计
*/
define("func/monitorStatisc",[
	"leaflet",
	"func/base",
  "control/draw",
  "control/panel",
  // "plugins/ajaxpoll",
  "plugins/linqtojs",
  "data/ajax"

],function(L){

     
    L.ICT.Func.add("MonitorStatisc",{

         Class: L.Class.extend({

            _data:{
              historyChk:false,
              realtimeChk:false,
              startTime:null,
              endTime:null
            },

            initialize:function(){                                  
               this.ictmap = L.ict.app.ictmap;
               this.dateUtil = L.ict.app.util.dateTime;     
               this.dialog = L.ict.app.util.dialog;          
               this.menu = L.ict.app.menu;
               this.menuid = "ict_menu_main_jktj";
               this.config = Project_ParamConfig.monitorStatiscConfig;
               this.ajax = new L.ICT.Ajax();

               this._container = null;               
               this._popPanel = null;
               this._drawPopPanel = null;
               this._resultPopPanel = null;
               this._layer = null;
               this._layerType = null;  
            },

            start:function(){
               if(this._container || this._popPanel) return;
               this._initUi();
               this._initEvts();
               this._container.find("input[type=radio]").eq(0).click();
               this._container.find("input[type=checkbox]").eq(0).click();
               this.menu.mainmenu.deactiveMenuExceptOne(this.menuid);
               this.menu.mainmenu.disableMenuExceptOne(this.menuid);
            },

            stop:function(){
               if(this._popPanel) this._popPanel.remove();
               if(this._layer) this._layer.remove();
               if(this._drawPopPanel) this._drawPopPanel.remove();
               if(this._resultPopPanel) this._resultPopPanel.remove();
               if(this._timer){
                    clearInterval(this._timer);
                    this._timer = null;
                }
               this.ictmap.deactivate();
               this.menu.mainmenu.deactiveMenu(this.menuid);               
               this._container = null;
               this._popPanel = null;
               this._drawPopPanel = null;
               this._resultPopPanel = null;
               this._layer = null;
               this._layerType = null;   
               this.menu.mainmenu.enableMenu();  
            },

            _initUi:function(){
                var options = {
                    title:'监测统计',
                    width:400,
                    height:380,
                    left:100,
                    top:200
                };
                var content = this._container = $(this.getContentHTML());
                options.contentHTML = content;
                var pop = this._popPanel = new L.ICT.PopPanel(options);
                pop.show();
                pop.on("popPanelRemove",function(){
                    this._popPanel = null;
                    this._container = null;
                    this.stop();
                    // this.ictmap.deactivate();
                    // this.menu.mainmenu.deactiveMenu(this.menuid);
                },this);

            },

            getContentHTML:function(){
                var html = [];
                html.push('<div class="monitorStatiscContainer">');
                html.push('<p>绘制区域：</p>');
                html.push('<div class="form-group">');
                html.push('<label><input type="radio" name="drawRadio" value="rect">&nbsp矩形&nbsp<img src="themes/images/model/frame/ico_rect.png">&nbsp&nbsp</label>');
                html.push('<label><input type="radio" name="drawRadio" value="circle">&nbsp圆形&nbsp<img src="themes/images/model/frame/ico_circle.png">&nbsp&nbsp</label>');                
                html.push('<label><input type="radio" name="drawRadio" value="polygon">&nbsp多边形&nbsp<img src="themes/images/model/frame/ico_ployon.png">&nbsp&nbsp</label>');
                html.push('</div>');
                html.push('<hr>');
                html.push('<p>统计类型：</p>');
                html.push('<div class="form-group">');
                html.push('<label><input type="checkbox" name="staticType" value="realtime">区域实时船舶数量</label>');                
                html.push('</div>');
                html.push('<div class="form-group">');
                html.push('<label><input type="checkbox" name="staticType" value="history">区域历史进出数量</label>');
                html.push('</div>');
                html.push('<div class="timeDiv">');
                html.push('<label>时间:</label> <input type="text" class="Wdate startTime"> <label>&nbsp至&nbsp</label> <input type="text" class="Wdate endTime">');
                html.push('</div>');
                html.push('<p class="msg"></p>');
                html.push('<div class="btnDiv">');
                html.push('<button type="button" class="okBtn">确定</button>');
                html.push('<button type="button" class="cancelBtn">取消</button>');
                html.push('</div>');                
                html.push('</div>');
                return html.join("");

            },            

            _initEvts:function(){
               var self = this;
               //绘图
               self._container.find("input[type=radio]").on("click",function(){
                   if(self._layer) self._layer.remove();
                   if(self.__drawPopPanel) self._drawPopPanel.remove();
                   var type = $(this).val();
                   if(type == "circle"){
                      self.ictmap.activate(L.ICT.MapMouseState.CIRCLE,self._drawCallback,null,self);
                   }else if(type == "rect"){
                      self.ictmap.activate(L.ICT.MapMouseState.RECTANGLE,self._drawCallback,null,self);
                   }else if(type == "polygon"){
                      self.ictmap.activate(L.ICT.MapMouseState.POLYGON,self._drawCallback,null,self);
                   }

               });
               //选择模式
               self._container.find("input[type=checkbox]").on("change",function(){
                       var  allchks = self._container.find("input[type=checkbox]");
                       allchks.each(function(){
                           if(this.value == "realtime"){
                               if(this.checked == true) self._data.realtimeChk = true;
                               else self._data.realtimeChk = false;
                           }
                           if(this.value == "history"){
                              if(this.checked == true){
                                self._data.historyChk = true;
                                self._container.find(".timeDiv").css("display","block");
                              }else{
                                self._data.historyChk = false;
                                self._container.find(".timeDiv").css("display","none");
                              }                              
                           }
                       });

               });
               //时间
                self._container.find(".Wdate").on("focus",function(){
                    var config = {
                       readOnly:true,
                       dateFmt:'yyyy-MM-dd HH:mm',
                       isShowClear:false,
                       startDate:'%y-%M-01 00:00:00',
                       alwaysUseStartDate:true,
                       maxDate:'%y-%M-%d %H:%m:%s'
                    };
                    WdatePicker(config);
                });
                var startTime = self.dateUtil.getNewDateTimeBeforHour(7*24);
                   startTime = self.dateUtil.formatDateHM(startTime);
                var endTime = self.dateUtil.formatDateHM(new Date());
                self._container.find(".Wdate.startTime").val(startTime);
                self._container.find(".Wdate.endTime").val(endTime);                

                //确定
                self._container.find(".okBtn").on("click",function(){
                      var $msg = self._container.find(".msg"),
                          startTime = self._container.find(".startTime").val(),
                          endTime = self._container.find(".endTime").val();
                      $msg.html("");
                      //检查
                      if(!self._layer){
                          $msg.html("请绘制区域！");
                          return;
                      }
                      if(!self._data.realtimeChk && !self._data.historyChk){
                         $msg.html("请选择统计方式！");
                         return;
                      }
                      if(self._data.historyChk){
                          //判断时间
                          var startTime =  self._container.find(".startTime").val();
                          var endTime =  self._container.find(".endTime").val();                
                          var checkRes = self.dateUtil.checkStrartEndTime(startTime+":00",endTime+":00",7);
                          if(!checkRes.result){
                            $msg.text(checkRes.msg);
                            return ;
                          }
                          self._data.startTime = self.dateUtil.getCusUnixTime(startTime+":00");
                          self._data.endTime = self.dateUtil.getCusUnixTime(endTime+":00");
                      }
                      //分析
                      if(self._resultPopPanel){
                        self._resultPopPanel.remove();
                      }
                      self.analysis();
                      
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
                    // console.log(obj.obj.layer === layer);
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

            analysis:function(){
              var options = {
                  title:'监控统计结果',
                  width:900,
                  height:600,
                  contentHTML:this.getResultHTML()           
              };
              var pop = this._resultPopPanel = new L.ICT.PopPanel(options);                        
              pop.on("popPanelRemove",function(){
                this._resultPopPanel = null;
                this.config.isClose = true;
                this.stop();
              },this);
              pop.show();   

              this.config.isClose = false;   
              this._popPanel.close();
              this.ictmap.deactivate();

              this._initResEvts();
              var $container = this._resultPopPanel.getContainer().find(".monitotleResContainer");            
              if(this._data.realtimeChk && this._data.historyChk){
                 $container.find(".realTime-secondFilter").css("display","block");
                 $container.find(".histroy-secondFilter").css("display","none");            
              } else if(!this._data.realtimeChk){
                 $container.find(".result").css("display","none").end().find(".result-history").css("display","block");              
              } 
              $container.find(".nav-titleNav>li.active>a").click(); 
              
            },

            _initResEvts:function(){
                var $container = this._resultPopPanel.getContainer().find(".monitotleResContainer"),
                    self = this;
                $container.find(".nav-titleNav>li>a").on("click",{context:self},self._firstTitleEvt); 
                $container.find(".nav-secondNav>li>a").on("click",{context:self},self._secondFilterEvt); 
                $container.find(".histroy-secondFilter button").on("click",{context:self},self._historySecEvt); 
                $container.find(".histroy-secondFilter input").on("focus",{context:self},self._onFocus);                    
                
            },
             
            _firstTitleEvt:function(e){
                  var _this = e.data.context,
                      type = $(this).data("info"),
                      $container = _this._resultPopPanel.getContainer().find(".monitotleResContainer");

                  $(this).parent().addClass("active").siblings().removeClass("active");
                  if(type == "realTime"){
                      $container.find(".realTime-secondFilter").css("display","block");
                      $container.find(".histroy-secondFilter").css("display","none");
                      $container.find(".nav-secondNav>li:first-child>a").click();
                  } else if(type == "history"){
                      $container.find(".realTime-secondFilter").css("display","none");
                      $container.find(".histroy-secondFilter").css("display","block");
                      $container.find(".result").css("display","none").end().find(".result-history").css("display","block");
                      //发送请求，更新表格
                  }else{

                  }
            },

            _secondFilterEvt:function(e){
                var _this = e.data.context,
                    type = $(this).data("info"),
                    $container = _this._resultPopPanel.getContainer().find(".monitotleResContainer");

                $(this).parent().addClass("active").siblings().removeClass("active");

                //数量统计
                if(type == "realTime-0"){
                   $container.find(".result").css("display","none").end().find(".result-realTime-0").css("display","block");             
                   //数量统计
                   if(_this._timer){
                      clearInterval(_this._timer);
                      _this._timer = null;
                   }
                   //首次
                   var targets = _this.ictmap.realtarget.getTargetsInExtend(_this._layer);
                   if(targets.length){
                        _this.realtimeCountRes(targets);
                    } 
                    //轮询                  
                   _this._timer = setInterval(function(){
                      var targets = _this.ictmap.realtarget.getTargetsInExtend(_this._layer);
                      if(targets.length){
                          _this.realtimeCountRes(targets);
                      }
                  },_this.config.updateTime);

                 //目标列表
                }else if(type == "realTime-1"){
                   $container.find(".result").css("display","none").end().find(".result-realTime-1").css("display","block");        
                   //目标列表
                   if(_this._timer){
                      clearInterval(_this._timer);
                      _this._timer = null;
                   }
                   //首次
                    var targets = _this.ictmap.realtarget.getTargetsInExtend(_this._layer);
                    if(targets.length){
                        _this.realtimeAreaRes(targets);
                    }                    
                    //轮询
                   _this._timer = setInterval(function(){
                      var targets = _this.ictmap.realtarget.getTargetsInExtend(_this._layer);
                      if(targets.length){
                         _this.realtimeAreaRes(targets);
                      }
                   },_this.config.updateTime);                   
                }
            },
            

            realtimeCountRes:function(data){
                  if(! this._resultPopPanel) return;
                  //js linq -start
                  var gbco = data.groupBy('country');
                  var result = [];
                  for(var i=0,len=gbco.length;i<len;i++){
                    var obj = {};
                    obj.co = gbco[i].key;
                    var value = gbco[i].value;
                    var gbval = value.groupBy('shiptype');
                    for(var j=0,lenj=gbval.length;j<lenj;j++){
                      var gj = gbval[j];
                      if(gj.key === '货船'){
                        obj.tc1 = gj.value.length;
                      } else if(gj.key === '搜救船'){
                        obj.tc2 = gj.value.length;
                      } else if(gj.key === '油轮'){
                        obj.tc3 = gj.value.length;
                      }else if(gj.key === '拖船'){
                        obj.tc4 = gj.value.length;
                      }else if(gj.key === '渔船'){
                        obj.tc5 = gj.value.length;
                      }else if(gj.key === '客船'){
                        obj.tc6 = gj.value.length;
                      }else if(gj.key === '军事船'){
                        obj.tc7 = gj.value.length;
                      }else if(gj.key === '其他'){
                        obj.tc100 = gj.value.length;
                      }
                    }
                    if(!obj.tc1) obj.tc1 = 0;
                    if(!obj.tc2) obj.tc2 = 0; 
                    if(!obj.tc3) obj.tc3 = 0; 
                    if(!obj.tc4) obj.tc4 = 0; 
                    if(!obj.tc5) obj.tc5 = 0; 
                    if(!obj.tc6) obj.tc6 = 0; 
                    if(!obj.tc7) obj.tc7 = 0;       
                    if(!obj.tc100) obj.tc100 = 0; 
                    result.push(obj);
                  }
                  ///js linq -end
                  var $container = this._resultPopPanel.getContainer().find(".monitotleResContainer");
                  var sumCount = data.length;
                  var list = result;
                  var html = [];
                  html.push('<p>实时船舶总数：'+sumCount+'艘</p>');
                  html.push('<table>');
                  html.push('<thead><tr><th>国别</th><th>货船</th><th>搜救船</th><th>油轮</th><th>拖船</th><th>渔船</th><th>客船</th><th>军事船</th><th>其他</th></tr></thead>');
                  html.push('<tbody>');
                  for(var i=0,len=list.length;i<len;i++){
                    var eobj = list[i];
                    html.push('<tr>');
                    html.push('<td>'+'<img src="themes/images/country/'+eobj.co.trim()+'.png">'+eobj.co+'</td>');
                    html.push('<td>'+eobj.tc1+'</td>');
                    html.push('<td>'+eobj.tc2+'</td>');
                    html.push('<td>'+eobj.tc3+'</td>');
                    html.push('<td>'+eobj.tc4+'</td>');
                    html.push('<td>'+eobj.tc5+'</td>');
                    html.push('<td>'+eobj.tc6+'</td>');
                    html.push('<td>'+eobj.tc7+'</td>');
                    html.push('<td>'+eobj.tc100+'</td>');
                    html.push('</tr>');
                    if( i < len-1){
                       html.push('<tr class="splitTr"><td colspan="8">&nbsp</td></tr>');
                    }
                  }
                  html.push('</tbody>');
                  html.push('</table>');
                  html = html.join("");
                  $container.find(".result-realTime-0").html(html);
            },

            realtimeAreaRes:function(data){
                if(!this._resultPopPanel) {return;}
                var $container = this._resultPopPanel.getContainer().find(".monitotleResContainer");
                var list = data;
                var html = [];
                html.push('<table>');
                html.push('<thead><tr>');
                   // html.push('<th>序号</th>');
                   html.push('<th>批号</th>');
                   html.push('<th>模式</th>');
                   html.push('<th>船名</th>');
                   html.push('<th>船舶类型</th>');
                   html.push('<th>经度</th>');
                   html.push('<th>纬度</th>');
                   html.push('<th>时间</th>');
                   html.push('<th>船速</th>');
                   html.push('<th>航向</th>');
                   // html.push('<th>航艏向</th>');
                   // html.push('<th>国家</th>');
                   // html.push('<th>信息类型</th>');
                   html.push('<th>信息来源</th>');
                html.push('</tr></thead>');
                html.push('<tbody>');
                for(var i=0,len=list.length;i<len;i++){
                  var obj =  list[i];
                  var lat =  L.ict.app.util.tool.latlngTodfmStr(obj.lat,'lat'); 
                  var lng =  L.ict.app.util.tool.latlngTodfmStr(obj.lon,'lng');                   
                  var time = this.dateUtil.getTimeStrFromUnix(obj.time);
                  var xxlx = this.ictmap.realtarget.getDetialConvertName(obj.infotype,'orig_info_type');
                  var xxly = this.ictmap.realtarget.getDetialConvertName(obj.infosrc,'orig_info_source');
                  var mode = obj.mode === 0 ? '融合模式' : '原始模式';
                  html.push('<tr>');
                  // html.push('<td>'+ (i+1) +'</td>');
                  html.push('<td>'+ obj.id +'</td>');
                  html.push('<td>'+ mode +'</td>');                                    
                  html.push('<td>'+ obj.shipname +'</td>');
                  html.push('<td>'+ obj.shiptype +'</td>');
                  html.push('<td>'+ lng +'</td>');
                  html.push('<td>'+ lat +'</td>');
                  html.push('<td>'+ time +'</td>');
                  html.push('<td>'+ obj.speed +' 节</td>');
                  html.push('<td>'+ obj.dir +'°</td>');
                  // html.push('<td>'+ obj.heading +'°</td>');
                  // html.push('<td>'+ obj.country +'</td>');
                  // html.push('<td>'+ xxlx +'</td>');
                  html.push('<td>'+ xxly +'</td>');
                  html.push('</tr>');
                  if( i < len-1){
                     html.push('<tr class="splitTr"><td colspan="8">&nbsp</td></tr>');
                  }
                }
                html.push('</tbody>');
                html.push('</table>');
                html = html.join("");
                $container.find(".result-realTime-1").html(html);            
            },

            //ajax轮询
            sendAjaxPoll:function(url,data,callback){
                 $.poll({
                    url: url,
                    data:data,
                    currentFunc:'MonitorStatisc',//当前调用的功能
                    context:this,
                    dataType:'json',
                    method:'POST',              
                    pollDelay: 5000,
                    pollDone:function(res){
                        if(res.state !== 1){                            
                            this.dialog.error("错误提示","没有统计结果！");
                        } else{
                            typeof callback === "function" ? callback.call(this,res) : null;
                        } 
                    },
                    pollFail:function(err){              
                       console.log('pollfial');
                    }
                 });        
            },

            getArea:function(){
                if(this._layer && this._layer.getBounds){
                    var extend = {};
                    var bounds = this._layer.getBounds();
                    extend.ldlon = bounds.getWest();
                    extend.ldlat = bounds.getSouth();
                    extend.rulon = bounds.getEast();
                    extend.rulat = bounds.getNorth();
                    return extend;
                } else {
                  return {};
                }
            },            

            _historySecEvt:function(e){
                var _this = e.data.context;                
            },

            _onFocus:function(){
                var obj = {
                  readOnly:true,
                  dateFmt:'yyyy-MM-dd HH',
                  isShowClear:false,
                  startDate:'%y-%M-01 00:00:00',
                  alwaysUseStartDate:true
                };
                WdatePicker(obj);
            },             

            getResultHTML:function(){
               var html = [];
               html.push('<div class="monitotleResContainer">');
               html.push(this.getTitleNavHTML());
               html.push(this.getSecondFilterHtml());
               html.push('<div class="result result-realTime-0">正在统计，请您耐心等待...</div>');
               html.push('<div class="result result-realTime-1">正在统计，请您耐心等待...</div>');
               html.push('<div class="result result-history">正在统计，请您耐心等待...</div>');
               html.push('</div>');
               return html.join("");

            },

            getTitleNavHTML:function(){
                 var html = '';
                 html += '<ul  class="nav nav-titleNav">';
                 if(this._data.realtimeChk == false){
                    html += '<li class="active"><a href="#" data-info="history">历史进出统计</a></li>';
                 } else if(this._data.historyChk == false){
                    html += '<li class="active"><a href="#" data-info="realTime">实时船舶数量</a></li>';
                 } else{
                    html += '<li class="active"><a href="#" data-info="realTime">实时船舶数量</a></li>';
                    html += '<li><a href="#" data-info="history">历史进出统计</a></li>';
                 }
                 html += '</ul>';
                 return html;
            },

            getSecondFilterHtml:function(){
                 var realTimeHTML = '',historyHTML = '';
                 realTimeHTML += '<div class="realTime-secondFilter">';
                 realTimeHTML += '<ul class="nav nav-secondNav">';
                 realTimeHTML += '<li class="active"><a href="#" data-info="realTime-0">数量统计</a></li>';
                 realTimeHTML += '<li><a href="#" data-info="realTime-1">目标列表</a></li>';
                 realTimeHTML += '</ul>';
                 realTimeHTML += '</div>';
                 historyHTML += '<div class="histroy-secondFilter">';
                 historyHTML += '<label>时间范围：<input class="startTime Wdate" type="text"><span>&nbsp&nbsp</span>至<span>&nbsp&nbsp</span><input class="endTime Wdate" type="text"><label><span>&nbsp&nbsp</span>';
                 historyHTML += '<button type="button">确定</button>';
                 historyHTML += '</div>';
                 if(this._data.realtimeChk == false){
                    return historyHTML;

                 } else if(this._data.historyChk == false){
                    return realTimeHTML;

                 } else{
                    return realTimeHTML + historyHTML;
                 }
            } 

         })

    });

});