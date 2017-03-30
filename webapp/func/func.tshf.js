/*
*态势回放功能模块
*/
define("func/tshf",[
    "leaflet",
    "func/base",
    "control/panel",
    "control/draw",
    "control/playback",
    "plugins/mcscroll",
    "plugins/my97DatePicker",
    "data/ajax",
    "func/userLogin"

],function(L){


  //多船态势回放
  L.ICT.Func.add("TSHF",{

    Class:L.Class.extend({

       initialize:function(){

          this.menu = L.ict.app.menu;
          this.menuid = 'ict_menu_main_tshf';
          this.config = Project_ParamConfig.tshfConfig;
          this.ictmap = L.ict.app.ictmap;
          this.dateUtil = L.ict.app.util.dateTime;
          this.ajax = new L.ICT.Ajax();

          this._areaPanel = null;
          this._targetPanel = null;
          this._drawPopPanel = null;
          this._layer = null;
          this._playback = null;

       },

       start:function(){
          this.menu.mainmenu.deactiveMenuExceptOne(this.menuid);
          if(!this.menu.submenu.has(this.menuid)){
            this.menu.submenu.add(this.menuid,this.getSubMenuHTML());
          }
          this.menu.submenu.show(this.menuid);
          this._initSubMenuEvts();

       },

       stop:function(){
          if(this._areaPanel) this._areaPanel.remove(false);
          if(this._targetPanel) this._targetPanel.remove(false);
          if(this._drawPopPanel) this._drawPopPanel.remove(false);
          if(this._layer) this._layer.remove();

          this._areaPanel = null;
          this._targetPanel = null;
          this._drawPopPanel = null;
          this._layer = null;      
          
          this.ictmap.deactivate();
          this.menu.submenu.destory(this.menuid);
          this.menu.mainmenu.deactiveMenu(this.menuid);  

       },
      
       //获取子菜单HTML
       getSubMenuHTML:function(){
          var html = [];
          html.push('<ul class="submenu_tshf">');
          html.push('<li class="menu_item zdqy"><img src="themes/images/frame/menu_tshf_zdqy.png">&nbsp<label class="func_tshf_zdqy">指定区域</label></li>');
          html.push('<li class="menu_item zdmb"><img src="themes/images/frame/menu_tshf_zdmb.png">&nbsp<label class="func_tshf_zdmb">指定目标</label></li>');
          html.push('</ul>');
          return html.join("");

       },
       
       //初始化子菜单点击事件
       _initSubMenuEvts:function(){
           var self = this;
           var $menuContainer = this.menu.getContainer();
           //中英文
           $menuContainer.find(".func_tshf_zdqy").html($.i18n.prop('func_tshf_zdqy'));
           $menuContainer.find(".func_tshf_zdmb").html($.i18n.prop('func_tshf_zdmb'));

           $menuContainer.find(".submenu_tshf .menu_item").on("click",function(event){
              event.stopPropagation();
              //登录提示
              if(!L.ICT.Func["UserLogin"].getInstance().isLogin()){
                  L.ICT.Func["UserLogin"].getInstance().alertLoginDialog();
                  self.menu.mainmenu.deactiveMenu(self.menuid);
                  return;
              }              
              var $this = $(this);
              if($this.hasClass("zdqy")){                    
                  // 指定区域 
                  if(self._areaPanel){
                    self._areaPanel.remove(false);
                    self._areaPanel = null;
                  }
                  self.areaPlayback();
                  self.menu.submenu.hide();

              } else if($this.hasClass("zdmb")){
                  //指定目标
                  if(self._targetPanel){
                    self._targetPanel.remove(false);
                    self._targetPanel = null;
                  }
                  self.targetPlayback();
                  self.menu.submenu.hide();
              }                 
           });

       },
           
       //弹出指定区域窗口
       areaPlayback:function(){
           var options = {
                title:$.i18n.prop('func_tshf_zdqy'),
                width:400,
                height:270,
                top:100,
                left:200,
                contentHTML:this.getAreaHtml()
              };
            var pop =  this._areaPanel = new L.ICT.PopPanel(options);
            //窗口关闭事件
            this._areaPanel.on("popPanelRemove",function(){
               this._areaPanel = null;
               this.stop();                    
               
            },this);              
            pop.show();
            this._initAreaEvts();  
            this.ictmap.activate(L.ICT.MapMouseState.CIRCLE,this._drawCallback,null,this);                         

       },

       //初始化指定区域事件
       _initAreaEvts:function(){
           var $container = this._areaPanel.getContainer().find(".areaPlaybackContainer");
           var $msg = $container.find(".msg");
           var self = this;  

           //中英文
           $container.find(".common_draw_title").html($.i18n.prop("common_draw_title"));
           $container.find(".common_draw_circle").html($.i18n.prop("common_draw_circle"));
           $container.find(".common_draw_rect").html($.i18n.prop("common_draw_rect"));
           $container.find(".common_time_info1").html($.i18n.prop("common_time_info1"));
           $container.find(".common_time_info2").html($.i18n.prop("common_time_info2"));
           $container.find(".func_tshf_okbtn").html($.i18n.prop("func_tshf_okbtn"));
           
           //绘制事件
           $container.find("input[type=radio]").on("click",function(event){
               if(self._layer) {self._layer.remove();self._layer = null;}
               if(self._drawPopPanel) {self._drawPopPanel.remove();self._drawPopPanel=null;}
               var type = $(this).val();
               if(type == "circle"){                     
                  self.ictmap.activate(L.ICT.MapMouseState.CIRCLE,self._drawCallback,null,self);
               } else if(type =="rect"){
                  self.ictmap.activate(L.ICT.MapMouseState.RECTANGLE,self._drawCallback,null,self);
               }
           });

           //日期控件
           $container.find("input[type=text]").on("focus",function(){
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
           var startTime = this.dateUtil.getNewDateTimeBeforHour(24);
               startTime = this.dateUtil.formatDateH(startTime);
           var endTime = this.dateUtil.formatDateH(new Date());
           $container.find(".Wdate.startTime").val(startTime);
           $container.find(".Wdate.endTime").val(endTime); 

           //回放按钮点击事件
           $container.find(".playbackbtn").on("click",function(event){
               $msg.text('');
               //判断区域
               if(!self.ictmap.map.hasLayer(self._layer)){
                $msg.text($.i18n.prop('common_draw_error1'));
                return;
               }
              //判断时间
             var startTime = $container.find(".startTime").val();
             var endTime = $container.find(".endTime").val();                
             var checkRes = self.dateUtil.checkStrartEndTime(startTime+":00:00",endTime+":00:00",30);
             if(!checkRes.result){
               $msg.text(checkRes.msg);
               return ;
             }
             startTime = self.dateUtil.getCusUnixTime(startTime+":00:00");
             endTime = self.dateUtil.getCusUnixTime(endTime+":00:00"); 

             //发送请求
             var data = {};
             var bounds = self._layer.getBounds();
             data.ldlon = bounds.getSouthWest().lng; //左下经度
             data.ldlat = bounds.getSouthWest().lat; //左下纬度
             data.rulon = bounds.getNorthEast().lng;
             data.rulat = bounds.getNorthEast().lat;
             data.limit = self.config.limit;
             data.startTime = startTime;
             data.endTime = endTime;
             var url = self.config.areaUrl;
             self.ajax.post(url,data,true,self,function(res){
                  if(res.state !== 1){
                    console.error(res.msg.error);
                    $msg.text($.i18n.prop('func_tshf_error'));
                }else{
                   //回放
                   this.playBack(res);
                }
             },function(error){

             });
             
           });

       },

       //绘图回调
       _drawCallback:function(e){
          var layer = this._layer = e.layer,
              layerType = e.layerType;
          if(this._drawPopPanel){
             this._drawPopPanel.remove();             
          }              
          this._drawPopPanel = new L.ICT.DrawPopPanel(layer,layerType);
          this._drawPopPanel.on("popPanelRemove",function(){
            this._drawPopPanel = null;
          },this);
          this._drawPopPanel.show();              
          //加图层
          this.ictmap.map.addLayer(layer);
          this._layer = layer;
          //可编辑
          if(layer.editing){
            layer.editing.enable();
            layer.on("edit",function(o){
              // alert("edit"+o+layer);
                this._drawPopPanel.updateContent();
            },this);
          }

       },       

       //弹出指定目标窗口
       targetPlayback:function(){
            var options = {
                title:$.i18n.prop('func_tshf_zdmb'),
                width:400,
                height:470,
                top:100,
                left:200,
                contentHTML:this.getTargetHtml()
              };
            var pop = this._targetPanel = new L.ICT.PopPanel(options);
            //窗口关闭事件
            this._targetPanel.on("popPanelRemove",function(){
               this._targetPanel = null;               
               this.config.playbackList = [];
               this.stop();
               
            },this);                
            pop.show();
            this.updateList();
            this._initTargetEvts();

       },
  
      //指定目标事件
       _initTargetEvts:function(){
          var $container = this._targetPanel.getContainer().find(".playbackTargetContainer"),
               $msg1 = $container.find(".msg1"),
               $msg2 = $container.find(".msg2"),
               self = this;  

         //中英文
         $container.find(".func_tshf_zdmb_ship").html($.i18n.prop("func_tshf_zdmb_ship"));
         $container.find(".func_tshf_zdmb_search_placeholder").attr('placeholder',$.i18n.prop("func_tshf_zdmb_search_placeholder"));
         $container.find(".func_tshf_zdmb_addbtn").html($.i18n.prop("func_tshf_zdmb_addbtn"));
         $container.find(".func_tshf_zdmb_cblb").html($.i18n.prop("func_tshf_zdmb_cblb"));
         $container.find(".func_tshf_zdmb_allchk").html($.i18n.prop("func_tshf_zdmb_allchk"));
         $container.find(".func_tshf_zdmb_delete").html($.i18n.prop("func_tshf_zdmb_delete"));         
         $container.find(".func_tshf_zdmb_shipname").html($.i18n.prop("func_tshf_zdmb_shipname")); 
         $container.find(".common_time_info1").html($.i18n.prop("common_time_info1")); 
         $container.find(".common_time_info2").html($.i18n.prop("common_time_info2")); 
         $container.find(".func_tshf_okbtn").html($.i18n.prop("func_tshf_okbtn")); 

         //日期控件
         $container.find(".Wdate").on("focus",function(){
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
         var startTime = this.dateUtil.getNewDateTimeBeforHour(24);
             startTime = this.dateUtil.formatDateH(startTime);
         var endTime = this.dateUtil.formatDateH(new Date());
         $container.find(".Wdate.startTime").val(startTime);
         $container.find(".Wdate.endTime").val(endTime);         

         //搜索添加
          $container.find(".addBtn").on("click",function(event){
            var key = $container.find(".shipIMO").val();
            $msg1.text("");
            if(key == ""){
                 $msg1.text($.i18n.prop('func_tshf_zdmb_search_placeholder'));
                 return;
            }
            var url = self.config.getShipByMMSIUrl;
            var data = {
                msi:key              
            };
            self.ajax.post(url,data,true,this,function(res){
                if(res.state !== 1){
                  console.error(res.msg.error);
                  $msg1.text($.i18n.prop('func_tshf_zdmb_error_search1'));
                }else{
                  var sp = self.ictmap.realtarget.convertshipInfoObj(res.msg.searchShip);
                  self.addTarget(sp);  
                  self.updateList();
                }
            });      
          
         });

         //删除
         $container.find(".deleteBtn").on("click",function(event){
           var $chks = $container.find(".listContent input:checked");
           $chks.each(function(){
                var targetId = $(this).parent().parent().data("key");
                self.deleteTarget(targetId);
           });
           self.updateList();
         });

          //全选
          $container.find("input.allchk").on("click",function(event){
             var $chks = $container.find(".listContent input[type=checkbox]");
             if(this.checked == true){
               $chks.each(function(){this.checked = true});    
             }else{
               $chks.each(function(){this.checked = false});
             }
             
           });

          //回放
          $container.find(".playbackBtn").on("click",function(event){
              $msg2.text("");
              var $chks = $container.find(".listContent input:checked"),
                  chkTargets = [];
              $chks.each(function(){
                 var id = $(this).parent().parent().data("key");
                 var target = self.getTargetById(id);
                 chkTargets.push(target);
              });
              if(chkTargets.length <=0 ){
                $msg2.text($.i18n.prop('func_tshf_zdmb_error_target'));
                return;
              }
              //判断时间
              var startTime = $container.find(".startTime").val();
              var endTime = $container.find(".endTime").val();    
              var chkt = self.dateUtil.checkStrartEndTime(startTime+":00:00",endTime+":00:00",30);
              if(!chkt.result){
                  $msg2.text(chkt.msg);
                  return;
              }
              startTime = self.dateUtil.getCusUnixTime(startTime+":00:00");
              endTime = self.dateUtil.getCusUnixTime(endTime+":00:00");             
                  
              var url = self.config.moreshipUrl;
              var data = {};
              // var modeArr = [];
              var shipIdArr = [];
              for(var i=0;i<chkTargets.length;i++){
                // modeArr.push(chkTargets[i].mode);
                shipIdArr.push(chkTargets[i].id);
              }
              // data.modeArr = modeArr.join("~");
              data.shipIdArr = shipIdArr.join("~");
              data.startTime = startTime;
              data.endTime = endTime;
              self.ajax.post(url,data,true,self,function(res){
                if(res.state != 1){
                   console.error(res.msg.error);
                   $msg2.text($.i18n.prop('func_tshf_error'));

                }else{
                   //回放
                    this.playBack(res);
                }
            },function(error){});

           });

       },
          
       //添加回放船舶
       addTarget:function(target){
          if(this.config.playbackList.length === 0){
             this.config.playbackList.push(target);
          } else{
             isadd = true;
             for(var i=0,len=this.config.playbackList.length; i<len; i++){
                if(this.config.playbackList[i].id === target.id){
                   isadd = false;
                   break;
                }
             }
             if(isadd){
              this.config.playbackList.push(target);
             }
          }

       },
      
       //通过id删除指定目标列表中的船舶
       deleteTarget:function(targetId){
          var targets = this.config.playbackList;
          var index = null;
          for(var i=0,len=targets.length;i<len;i++){
             if(targets[i].id == targetId){
              index = i;
              break;
             }
          }
          if(index !== null){
            targets.splice(index,1);
          }

       },
      
       //通过id获取船舶
       getTargetById:function(targetId){
          var targets = this.config.playbackList,
              target = null;
          for(var i=0,len=targets.length;i<len;i++){
             if(targets[i].id == targetId){
              target = targets[i];
              break;
             }
          }
          return target;

       },
       
       //更新指定目标船舶列表
       updateList:function(){
          var $container = this._targetPanel.getContainer().find(".playbackTargetContainer"),
              $listContent = $container.find(".listContent"),
              items = this.config.playbackList;
          var html = [];  

          html.push('<div class="mscroll"><table>');
          for(var i=0,len=items.length;i<len;i++){
             var id = items[i].id;
             var mmsi = items[i].mmsi;
             var name = items[i].shipname;
             html.push('<tr>');
             html.push('<td class="mmsi" data-key="'+ id +'"><label><input type="checkbox" checked>'+'&nbsp&nbsp'+ mmsi +'</label></td><td>'+name+'</td>');
             html.push('</tr>');
          }
          html.push('</table></div>');
          html = html.join("");
          $listContent.html(html); 

          // html.push('<div class="mscroll"><ul>');
          // for(var i=0,len=items.length;i<len;i++){
          //    var id = items[i].id;
          //    var name = items[i].sn;
          //    html.push('<li data-key="'+id+'"><label><input type="checkbox" checked>'+'&nbsp&nbsp'+ name +'</label></li>');
          // }
          // html.push('</ul></div>');
          // html = html.join("");
          // $listContent.html(html);

          //滚动
          $listContent.find(".mscroll").mCustomScrollbar({ theme: "minimal-dark" }); 

       },

       //调用回放控件
       playBack:function(data){
           //回放前处理
           if(this._targetPanel) this._targetPanel.remove();
           if(this._areaPanel) this._areaPanel.remove();        
           this.ictmap.realtarget.hideRealTargetLayer(); // this.ictmap.realtarget.removeRealTargetLayer();
           this.config.playbackList = [];
           if(this._playback){
              this._playback.close();
              this._playback = null;
           }
           this.ictmap.OperateState.tshf = true;
           this.menu.mainmenu.disableMenu(); //禁用所有一级菜单           
           var beforeZoom = this.ictmap.map.getZoom();
           var beforeCenter = this.ictmap.map.getCenter();          

           //回放
           data = data.msg.shipList;
           var self = this;
           this._playback = new L.ICT.Control.PlayBack (data,null,function(){
               self._playback = null;
               self.ictmap.map.setView(beforeCenter,beforeZoom);
               self.ictmap.OperateState.tshf = false;  
               self.menu.mainmenu.enableMenu();  
               self.ictmap.realtarget.addRealTargetLayer();           
           },null).show(this.ictmap.map);

       },       
       
       //获取指定区域HTML
       getAreaHtml:function(){
          var html = [];
          html.push('<div class="areaPlaybackContainer">');
          html.push('<fieldset class="drawDiv">');
          html.push('<legend class="common_draw_title">绘制区域：</legend> ');
          html.push('<form class="form-inline">');
          html.push('<div class="form-group">');
          html.push('<div class="radio"><input type="radio" name="drawRadio" value="circle" checked ><img src="themes/images/frame/ico_circle.png"><label class="common_draw_circle">圆形</label></div>');
          html.push('<div class="radio"><input type="radio" name="drawRadio" value="rect"><img src="themes/images/frame/ico_rect.png"><label class="common_draw_rect">矩形</label></div>');
          html.push('</div>');
          html.push('</form>');
          html.push('</fieldset>');
          html.push('<div class="timeDiv">');
          html.push('<label class="common_time_info1">时间:</label> <input type="text" class="Wdate startTime">&nbsp<label class="common_time_info2">至</label>&nbsp<input type="text" class="Wdate endTime"> ');
          html.push('</div>');
          html.push('<p class="msg"></p>');
          html.push('<div class="btnDiv"><button type="button" class="btn playbackbtn func_tshf_okbtn">回放</button></div>');
          html.push('</div>');
          return html.join('');

       },
      
       //获取指定目标HTML
       getTargetHtml:function(){
          var html = [];
          html.push('<div class="playbackTargetContainer">');
          html.push('  <div class="cbphDiv">');
          html.push('    <label class="func_tshf_zdmb_ship">船舶:</label>');
          html.push('    <input type="text" class="shipIMO func_tshf_zdmb_search_placeholder">');
          // html.push('    <img src="themes/images/frame/title_search_btn.png" class="icon_search">');
          html.push('    <button class="btn addBtn func_tshf_zdmb_addbtn">添加</button>');
          html.push('  </div>');
          html.push('  <p class="msg msg1"></p>');
          html.push('  <p class="cblb_txt func_tshf_zdmb_cblb">船舶列表:</p>');
          html.push('  <div class="phlbDiv">');
          // html.push('    <label>船舶批号列表:</label>');
          html.push('    <input type="checkbox" class="allchk" checked><label class="func_tshf_zdmb_allchk">全选</label>');
          html.push('    <button class="btn deleteBtn func_tshf_zdmb_delete">删除</button>');
          html.push('  </div>');
          html.push('  <div class="shiplist">');
          html.push('    <div><table><tr><td>MMSI</td><td class="func_tshf_zdmb_shipname">船舶名</td></tr></table></div>');
          html.push('    <hr>');
          html.push('    <div class="listContent"></div>');
          html.push('  </div>');
          html.push('  <p class="msg msg2"></p>');
          html.push('  <hr>  ');
          html.push('  <div class="timeDiv"><label class="common_time_info1">时间:</label> <input type="text" class="Wdate startTime"> &nbsp<label class="common_time_info2">至</label> &nbsp<input type="text" class="Wdate endTime"></div>');
          html.push('  <div class="btnDiv"><button type="button" class="btn playbackBtn func_tshf_okbtn">回放</button></div>');
          html.push('</div>');
          return html.join('');
       }  

    })

  });

  //单船态势回放
  L.ICT.Func.add("TSHFOneShip",{
       
       Class:L.Class.extend({

           initialize:function(){
              this.config = Project_ParamConfig.tshfConfig;
              this.ictmap = L.ict.app.ictmap;
              this.dateUtil = L.ict.app.util.dateTime;
              this.ajax = new L.ICT.Ajax();  
              this.menu = L.ict.app.menu; 
            
              this._popPanel = null;   
              this._playback = null;        
           },

           start:function(){
              if(this._popPanel){this._popPanel.remove();}
              this._initUi();
              this._initEvts();
              
           },

           stop:function(){
              if(this._popPanel){this._popPanel.remove();}
              if(this._playback){this._playback.close();}

           },

           _initUi:function(){
               var options = {
                   title:$.i18n.prop('func_tshf_title'),
                   width:400,
                   height:160,
                   contentHTML:this.getContentHtml()
               };
               var pop = this._popPanel = new L.ICT.PopPanel(options);
               //窗口关闭
               this._popPanel.on("popPanelRemove",function(){
                  this._popPanel = null;
               },this);
               pop.show();

           },

           getContentHtml:function(){
               var html = [];
               html.push('<div class="tshf_oneship_container">');
               html.push('<div class="timeDiv">');
               html.push('<label class="common_time_info1">时间：</label>');
               html.push('<input type="text" class="Wdate startTime">');
               html.push('&nbsp<label class="common_time_info2">至 </label>&nbsp');
               html.push('<input type="text" class="Wdate endTime">');               
               html.push('</div>');
               html.push('<p class="msg"></p>');
               html.push('<div class="btnDiv">');
               html.push('<button type="button" class="confirm common_btn_ok">确定</button>');
               html.push('<button type="button" class="cancel common_btn_cancel">取消</button>');               
               html.push('</div>');
               html.push('</div>');
               return html.join("");
               
           },           

           _initEvts:function(){
               var $container = this._popPanel.getContainer().find(".tshf_oneship_container"),
                   $msg = $container.find(".msg"),
                   self = this;

               //中英文
              $container.find(".common_time_info1").html($.i18n.prop("common_time_info1"));
              $container.find(".common_time_info2").html($.i18n.prop("common_time_info2"));
              $container.find(".common_btn_ok").html($.i18n.prop("common_btn_ok"));
              $container.find(".common_btn_cancel").html($.i18n.prop("common_btn_cancel"));               

               //日期
               $container.find(".Wdate").on("focus",function(){
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
               var startTime = this.dateUtil.getNewDateTimeBeforHour(24);
                   startTime = this.dateUtil.formatDateH(startTime);
               var endTime = this.dateUtil.formatDateH(new Date());
               $container.find(".Wdate.startTime").val(startTime);
               $container.find(".Wdate.endTime").val(endTime);
               
               //确认
               $container.find(".confirm").on("click",function(){
                    $msg.text("");
                    //判断时间
                    var startTime = $container.find(".startTime").val();
                    var endTime = $container.find(".endTime").val();
                    var chkt = self.dateUtil.checkStrartEndTime(startTime+":00:00",endTime+":00:00",30);
                    if(!chkt.result){
                        $msg.text(chkt.msg);
                        return;
                    }
                    startTime = self.dateUtil.getCusUnixTime(startTime+":00:00");
                    endTime = self.dateUtil.getCusUnixTime(endTime+":00:00");
                    //多船的接口也适用于单船
                    var url = self.config.moreshipUrl;
                    var sid = self.ictmap.realtarget.currentTarget.options.data.id;
                    var data = {
                       // modeArr:self._curship.mode,
                       shipIdArr:sid,
                       startTime:startTime,
                       endTime:endTime
                    };                    
                    // var data = {
                    //    modeType:self._curship.mode,
                    //    shipId:self._curship.id,
                    //    startTime:startTime,
                    //    endTime:endTime
                    // };
                    self.ajax.post(url,data,true,self,function(res){

                      if(res.state !== 1){
                        console.error(res.msg.error);
                        $msg.text($.i18n.prop('func_tshf_error'));

                      }else{
                         //进入态势回放状态
                         self.playBack(res);
                      }

                    },function(error){

                    });
                                 
               });

               //取消
               $container.find(".cancel").on("click",function(){
                    self.stop();
               });


           },


           //调用回放控件
           playBack:function(data){
               this._popPanel.remove();
               this.ictmap.realtarget.hideRealTargetLayer(); //this.ictmap.realtarget.removeRealTargetLayer();
               if(this._playback){
                  this._playback.close();
                  this._playback = null;
               }               
               this.ictmap.OperateState.tshf = true;
               this.menu.mainmenu.disableMenu();
               data = data.msg.shipList;
               var beforeZoom = this.ictmap.map.getZoom();
               var beforeCenter = this.ictmap.map.getCenter();
               var self = this;
               this._playback = new L.ICT.Control.PlayBack(data,null,function(){
                   self._playback = null;
                   self.ictmap.OperateState.tshf = false;
                   self.ictmap.map.setView(beforeCenter,beforeZoom);
                   self.menu.mainmenu.enableMenu();
                   self.ictmap.realtarget.addRealTargetLayer();                  

               },null).show(this.ictmap.map);


           }

       })
  
  });
  
});