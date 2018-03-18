
define("control/panel",[
  "leaflet",
  "core/namespace",
  "plugins/mcscroll",
  "util/tool"
  
],function(L){

  /*面板基类*/
  L.ICT.Panel = L.Class.extend({
      
    initialize:function(){
        
    }

  });

  /*
  *弹出面板类
  *使用方式1：var options={...}; new L.ICT.PopPanel(options).show();
  *使用方式2：var options={...}; new L.ICT.PopPanel(options).setContent('<div style="height:400px;">aaaaaaaaaaaa</div>').show();
  *事件： popPanelRemove 参数：当前对象
  */
  L.ICT.PopPanel = L.ICT.Panel.extend({

    includes:L.Mixin.Events,

    options:{
      title:'add your title',
      width:400,
      height:300,
      position:"center", // enum(left|right|top|bottom|center)
      left:null,
      right:null,
      top:null,
      bottom:null,
      zIndex:1000, 
      scroll:false,//是否在元素溢出时添加滚动条   
      className:null,
      isDrag:true,//是否可拖动
      ismodal:false,//是否是模态对话框，如果设置为true,则会增加一个遮罩层，使之变成模态框     
      animation:true,//是否显示动画
      disableSelect:true,//是否禁止选中
      contentHTML:'<span>add your content here</span>'
    },

    initialize:function(options){
         L.setOptions(this,options);
         if(this.options.ismodal){ //如果是模态框，不可拖动
            this.options.isDrag = false;
         }
         this._isShow = false;
         this._container = null;     
    },

    show:function(){
      if(this._container === null){
        this._initUi();
        this._initEvents();
      }
      if(!this._isShow){
        if(this.options.animation) this._container.fadeIn("fast");
        else this._container.show();
        // this._container.css("display","block")
        this._isShow = true;
      }
      return this;
    },
    
    close:function(){
       if(this._container!==null && this._isShow){
        if(this.options.animation) this._container.fadeOut();
        else this._container.hide();
          // this._container.css("display","none");
          this._isShow = false;
       }
       return this;
    },
   
    remove:function(isTriggerRemoveEvt){ //移除时是否触发popPanelRemove事件
        if(isTriggerRemoveEvt === undefined){
           isTriggerRemoveEvt = true;
        }
        if(this._container){
           this._container.remove();
           this._container = null; 
           if(isTriggerRemoveEvt){
              this.fire("popPanelRemove",{obj:this});  
           }                    
        }    
   
    },
       
    getContainer:function(){
      return this._container;
    },
      
    setContent:function(html){  // String or JQquery Obj -->jquery content obj
      if(this._container === null){
        this._initUi();
        this._initEvents();
      }
      var $html = html;       
      if(typeof html === "string") $html = $(html);
      var $content = $('<div class="container-content"></div>');
      $content.append($html);
      this._container.find(".container-content").remove();
      this._container.append($content);
      //content样式 解决滚动条不显示问题
       this._setContentCss();
      //滚动
      if(this.options.scroll){
         $content.mCustomScrollbar({ theme: "minimal-dark" });    
      }        
      return this;
    },

    _initUi:function(){
        var $container = $('<div class="ictPanel-popPanel-container"></div>'),
            $title = $('<div class="container-title"></div>'),
            $content = $('<div class="container-content"></div>'),
            titleInnerHtml = '<span>'+this.options.title+'</span>'+'<img class="close" src="themes/images/dialog/dialog_close.png"/>';

        //内容
        $container.attr("id","ictPanel-popPanel-container"+ L.stamp({}));      
        $title.attr("id","container-title"+ L.stamp({}));
        $title.html(titleInnerHtml);
        $content.html(this.options.contentHTML);
        $container.append($title).append($content);

        //是否是模态框
        if(this.options.ismodal){
           $container.prepend('<div class="ict_modal_backdrop"></div>');
        }  
        $("body").append($container);

        //类名
        if(this.options.className){
            $container.addClass(this.options.className);
        }
        
        //禁止选中
        if(this.options.disableSelect){
           $container.addClass('disableSelect');
        }

        //滚动
        if(this.options.scroll){
          $content.mCustomScrollbar({ theme: "minimal-dark" }); 
        }    

        //拖动
        if(this.options.isDrag){
           L.ict.app.util.tool.drag($container.attr("id"),$title.attr("id"));          
        }

        this._container = $container;
         
        //初始化样式
        this._setCotainerCss();
        this._setTitleCss();
        this._setContentCss();
    },  

    _setCotainerCss:function(){
        var cssobj = {
          position:'fixed',   
          display:'none',
          backgroundColor:'#fff'
        };      
        if(this.options.left) cssobj.left = this.options.left + 'px';
        if(this.options.right) cssobj.right = this.options.right + 'px';
        if(this.options.top) cssobj.top = this.options.top + 'px';
        if(this.options.bottom) cssobj.bottom = this.options.bottom + 'px';
        if(!this.options.left && !this.options.right && !this.options.top && !this.options.bottom){
           cssobj.left = 0;
           cssobj.right = 0;
           cssobj.top = 0;
           cssobj.bottom = 0;
           cssobj.marginLeft = "auto";
           cssobj.marginRight = "auto";
           cssobj.marginBottom = "auto";
           cssobj.marginTop = "auto";
        }
        cssobj.width = this.options.width + 'px';
        cssobj.height = this.options.height + 'px';
        // cssobj.overflow = 'hidden'; //加此属性不能定义遮罩层了
        cssobj.border = '1px solid rgb(169, 169, 169)';
        cssobj.borderRadius = '6px';
        cssobj.boxShadow = 'silver 2px 2px 5px';
        cssobj.zIndex = this.options.zIndex;
        // this._container.find("*").css({margin:0,padding:0});
        this._container.css(cssobj);
    },

    _setTitleCss:function(){
        this._container.find(".container-title").css({
            position:'relative',
            left:0,
            top:0,
            width:'100%',
            height:'35px',
            backgroundColor:'#244474',
            lineHeight:'35px',
            textAlign:'center',
            cursor:'pointer',
            borderTopLeftRadius:'6px',
            borderTopRightRadius:'6px'
          }).find("span").css({
             fontSize:'14px',
             fontWeight:'normal',
             color:'#fff'
          }).end().find("img").css({
              float:'right',
              margin:'10px'
          });
    },

    _setContentCss:function(){
        this._container.find(".container-content").css({
          position:'relative',
          left:0,
          top:0,        
          width:'100%',
          overFlowX:'hidden',
          overFlowY:'auto',
          padding:'10px',
          backgroundColor:'#fff',
          borderBottomLeftRadius:'6px',
          borderBottomRightRadius:'6px'
          // paddingRight:0
        });
        var h = this._container.height()-this._container.find(".container-title").height();
        this._container.find(".container-content").outerHeight(h);
    },

    _initEvents:function(){
      var _this = this;
      //关闭按钮单击事件
      this._container.find(".container-title .close").on("click",function(e){
         _this.remove();        
      });
      //模态框单击事件
      this._container.find(".ict_modal_backdrop").on("click",function(){
         _this.remove();
      });
    }

  });

  /*
   *绘制弹框类
   *事件：OkDraw CancelDraw  popPanelRemove
  */
  L.ICT.DrawPopPanel = L.ICT.PopPanel.extend({

    initialize:function(layer,layerType,options){   
      
      this.layer = layer;
      this.layerType = layerType;
      this.tool = L.ict.app.util.tool;
      var options = options || {};  
      options.width = 400;
      options.height = 202;   
      switch(layerType){
        case "circle":
             options.contentHTML = this.getCircleContent();
             options.title = '绘制圆形区域';
             break;
        case "rectangle":
             options.contentHTML = this.getRectContent();
             options.title = '绘制矩形区域';
             break;
        case "polygon":
             options.contentHTML = this.getPolygonContent();
             options.title = '绘制多边形区域';
             options.height = 300;
             break;
        default:;
      }
      L.ICT.PopPanel.prototype.initialize.call(this,options);

    },
    
    updateContent:function(){
        switch(this.layerType){
          case "circle":
               var contentHTML = this.getCircleContent();              
               break;
          case "rectangle":
               var contentHTML = this.getRectContent();
               break;
          case "polygon":
               var contentHTML = this.getPolygonContent();
               break;
          default:;
        }
       this.setContent(contentHTML);
       this._initEvents(); //元素移除，事件也移除，要重新注册事件
       
    },

    getCircleContent:function(){
      var latlng = this.layer.getLatLng();
      var radius = this.layer.getRadius();
          radius = L.ict.app.util.tool.convertMileToNmile(radius);          
      var html = [];
      html.push('<div class="drawPopPanel circleContainer">');
      html.push('<ul>');
      html.push('<li><label>圆心:</label>'+this.getItemHtml(latlng)+'</li>');
      html.push('<li><label>半径:</label><input type="number" class="circleRadius" value="'+radius+'">&nbsp&nbsp<label>海里(nmi)</label></li>');
      html.push('</ul>');
      html.push(this.getBtnHTML());
      html.push('</div>');
      return html.join("");

    },

    getRectContent:function(){
       var sw = this.layer.getBounds().getSouthWest();
       var ne = this.layer.getBounds().getNorthEast();
       var html = [];
       html.push('<div class="drawPopPanel rectContainer">');
       html.push('<ul>');
       html.push('<li><label>左下:</label>'+this.getItemHtml(sw)+'</li>');
       html.push('<li><label>右上:</label>'+this.getItemHtml(ne)+'</li>');       
       html.push('</ul>');
       html.push(this.getBtnHTML());
       html.push('</div>');
       return html.join("");

    },

    getPolygonContent:function(){
       var latlngs = this.layer.getLatLngs();
       var html = [];
       latlngs = latlngs[0];
       html.push('<div class="drawPopPanel polygonContainer">');
       html.push('<div><ul>');
       for(var i=0,len=latlngs.length;i<len;i++){
          html.push('<li><label>'+(i+1)+'</label>'+this.getItemHtml(latlngs[i])+'</li>');
       }
       html.push('</ul></div>');
       html.push(this.getBtnHTML());
       html.push('</div>');
       return html.join("");

    },

    getBtnHTML:function(){
      var html = [];
      html.push('<div class="btnDiv">');
      html.push('<button type="button" class="btn okBtn">确定</button>');
      html.push('<button type="button" class="btn cancelBtn">取消</button>');
      html.push('</div>');
      return html.join("");

    },

    getItemHtml:function(latlng){
        var html=[];
        var lats = this.tool.latlngTodfm(latlng.lat,'lat');
        var lngs = this.tool.latlngTodfm(latlng.lng,'lng');
        html.push('<table class="latlngsTable">');
        html.push('<tr>');
        html.push('<td class="lat lat_d"><input type="text" value="'+lats[0]+'"></td>');
        html.push('<td class="dfm">°</td>');
        html.push('<td class="lat lat_f"><input type="text" value="'+lats[1]+'"></td>');
        html.push('<td class="dfm">\′</td>');
        html.push('<td class="lat lat_m"><input type="text" value="'+lats[2]+'"></td>');
        html.push('<td class="dfm">″</td>');
        if(lats[3] == "N"){
          html.push('<td class="latNS lat_N active">N</td>');
          html.push('<td class="latNS lat_S">S</td>');
        }else {
          html.push('<td class="latNS lat_N">N</td>');
          html.push('<td class="latNS lat_S active">S</td>');
        }      
        html.push('<td class="space">&nbsp&nbsp</td>');
        html.push('<td class="lng lng_d"><input type="text" value="'+lngs[0]+'"></td>');
        html.push('<td class="dfm">°</td>');
        html.push('<td class="lng lng_f"><input type="text" value="'+lngs[1]+'"></td>');
        html.push('<td class="dfm">\′</td>');
        html.push('<td class="lng lng_m"><input type="text" value="'+lngs[2]+'"></td>');
        html.push('<td class="dfm">″</td>');
        if(lngs[3] == "W"){
           html.push('<td class="lngWE lng_W active">W</td>');
           html.push('<td class="lngWE lng_E">E</td>');
        }else{
           html.push('<td class="lngWE lng_W">W</td>');
           html.push('<td class="lngWE lng_E active">E</td>');
        }        
        html.push('</tr>');
        html.push('</table>');
        return html.join("");

    },

    getLatLngs:function(){
        var latlngs = [];
        var ts = this._container.find(".latlngsTable");
        for(var i=0,len=ts.length;i<len;i++){
          var $tr = $(ts[i]).find("tr");
          var lad = $tr.find('.lat_d input').val(),
              laf = $tr.find('.lat_f input').val(),
              lam = $tr.find('.lat_m input').val(),
               ns = $tr.find('.latNS.active').text(),
              lgd = $tr.find('.lng_d input').val(),
              lgf = $tr.find('.lng_f input').val(),
              lgm = $tr.find('.lng_m input').val();
               we = $tr.find('.lngWE.active').text()
          var lat = Math.abs(parseFloat(lad)) + parseFloat(laf/60) + parseFloat(lam/3600),
              lng = Math.abs(parseFloat(lgd)) + parseFloat(lgf/60) + parseFloat(lgm/3600);
          lat = ns=="S" ? -lat : lat;
          lng = we=="W" ? -lng : lng;
          var latlng = L.latLng([lat,lng]);
          latlngs.push(latlng);          
        }
        return latlngs;

    },

    getCircleRadius:function(){
       var radius = this._container.find(".circleContainer .circleRadius").val();
       radius = L.ict.app.util.tool.convertNmileToMile(radius);
       return parseFloat(radius);
    },

    _latlngChangeEvt:function(){
       if(this.layer.editing){
         this.layer.editing.disable();                
       }
       var latlngs = this.getLatLngs();
       if(this.layerType == "circle"){
          var radius = this.getCircleRadius();
          this.layer.setLatLng(latlngs[0]);
          this.layer.setRadius(radius);

       } else if(this.layerType == "rectangle"){
          var bounds = L.latLngBounds(latlngs);
          this.layer.setBounds(bounds);

       } else if(this.layerType == "polygon"){
         this.layer.setLatLngs(latlngs);

       }

       if(this.layer.editing){
         this.layer.editing.enable();
       }
    },

    _initEvents:function(){
        
        var self = this;  
        
        //窗口关闭事件
        self._container.find(".container-title .close").on("click",function(event){  
            event.stopPropagation();          
            self.remove();
            self.layer.remove();
            self.layer = null;  
            self.fire("CancelDraw",{obj:self});         
        });
        
        //确定按钮点击事件
        self._container.find(".container-content .okBtn").on("click",function(event){
             event.stopPropagation(); 
             self.remove();
             //停止图层的编辑状态
             if(self.layer.editing){
              self.layer.editing.disable(); 
             }      
             self.fire("OkDraw",{layer:self.layer,obj:self});
        });
        
        //取消按钮点击事件
        self._container.find(".container-content .cancelBtn").on("click",function(event){
            event.stopPropagation();
            self.remove();
            self.layer.remove();
            self.layer = null;
            self.fire("CancelDraw",{obj:self});
        });
        
        //表单输入值改变事件
        self._container.find(".container-content input").on("change focusout",function(event){
             self._latlngChangeEvt();          
        });
      
        //纬度切换事件
       self._container.find(".container-content .latlngsTable .latNS").on("click",function(event){
            $(this).addClass("active").siblings(".latNS").removeClass("active");
            self._latlngChangeEvt();

        });
       
       //经度切换事件
       self._container.find(".container-content .latlngsTable .lngWE").on("click",function(event){
            $(this).addClass("active").siblings(".lngWE").removeClass("active");
            self._latlngChangeEvt();
        });

    }

  });

  /*表格类*/
  L.ICT.TablePanel = L.Class.extend({

    includes:L.Mixin.Events,

    options:{
      height:100,//表格整体高度
      thData:[], //[{name:'',value:'',width:10},{},{}], //宽度以百分比形式传入，如：10表示10%
      tbData:[], //[{key1:value1,key2:value2,...},{}]
      thLineHeight:34,//表头行高
      tbLineHeight:32,//表身行高
    },

    initialize:function(options){
      L.setOptions(this,options);
      this._tableObj = null;
    },
    
    getTableObj:function(){
      if(this._tableObj === null) this._init();
       return this._tableObj;
    },

    getTableHTML:function(){
      if(this._tableObj === null) this._init();
      return this._tableObj.get(0).outerHTML;
    },

    updateData:function(data){
       
    },

    addTo:function($div){
       if(this._tableObj === null) this._init();   
        $div.html(this._tableObj);
        //滚动
        this._tableObj.find(".tbDiv").mCustomScrollbar({ theme: "minimal-dark" });
        this._initStyle();
        return this;
    },

    _init:function(){
      this._initUi();
      this._initEvents();
    },

    _initUi:function(){
      var $tableObj = $('<div class="tableDiv"></div>'),
          $thObj = $('<div class="thDiv"></div>'),
          $tbObj = $('<div class="tbDiv"></div>'),
          thContent = "",
          tbContent = "",
          isSetWidth = false;
      for(var i=0,len=this.options.thData.length;i<len;i++){
          if(this.options.thData[i].width) isSetWidth = true;
      }   
      //th
      thContent += "<table><tr>"; 
      for(var i=0,len=this.options.thData.length;i<len;i++){
        if(isSetWidth === true && this.options.thData[i].width) 
          thContent += '<td style="width:'+this.options.thData[i].width+'%'+'">'+this.options.thData[i].value+'</td>';
        else 
          thContent += '<td>'+this.options.thData[i].value+'</td>';
      }
      thContent += "</tr></table>";
      $thObj.html(thContent);
      //tb
      tbContent += "<table>";
      for(var i=0,len=this.options.tbData.length;i<len;i++){
        if( typeof this.options.tbData[i].data_id !== 'undefined'){
           tbContent += '<tr data-id="'+this.options.tbData[i].data_id+'">';
        } else {
           tbContent += "<tr>";
         }       
        for(var j=0;j<this.options.thData.length;j++){
          if(isSetWidth === true && this.options.thData[j].width) 
            tbContent += '<td style="width:'+this.options.thData[j].width+'%'+'">'+this.options.tbData[i][this.options.thData[j].name]+'</td>';
          else 
            tbContent += "<td>"+this.options.tbData[i][this.options.thData[j].name]+"</td>";
        }      
        tbContent += "</tr>";
      }
      tbContent +="</table>";
      $tbObj.html(tbContent);
      //init
      $tableObj.append($thObj).append($tbObj);
      this._tableObj = $tableObj;    
    },
    
    _initStyle:function(){
       if(this._tableObj === null)  return;
       var tbHeight = this.options.height-this.options.thLineHeight;
       var rowCount = parseInt(tbHeight/this.options.tbLineHeight);
       var tbLineHeight = parseInt(tbHeight/rowCount);
       this._tableObj.css({
          position:'relative',
          width:'100%',
          height:this.options.height+'px',
          borderBottom:'solid 1px #d1d1d1',
          margin:0,
          padding:0
       });
       this._tableObj.find(".thDiv").css({
          position:'relative',
          width:'100%',
          height:this.options.thLineHeight + 'px',
          overflow:'hidden',
          margin:0,
          padding:0
       });
       this._tableObj.find(".tbDiv").css({
          position:'relative',
          width:'100%',
          height:tbHeight+'px',
          margin:0,
          padding:0
       });
       this._tableObj.find("table").css({
          tableLayout:'fixed',
          borderCollapse:'collapse',
          width:'100%'
       });
       this._tableObj.find(".thDiv table tr").css({
          fontWeight:'bold',
          fontSize:'11px',
          backgroundColor:'rgb(243,243,243)',
          lineHeight:this.options.thLineHeight + 'px'
       });   
       this._tableObj.find(".tbDiv table tr").css({
           lineHeight:tbLineHeight+'px'    
       });
       this._tableObj.find("table td").css({
          border:'solid 1px #d1d1d1',
          textAlign:'center'
          // whiteSpace:'nowrap',
          // textOverflow:'ellipsis',
          // overflow:'hidden'
       });
    },

    _initEvents:function(){

    }

  });

});