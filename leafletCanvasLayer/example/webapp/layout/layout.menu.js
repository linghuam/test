/*
*菜单布局
*/
define("layout/menu",[
	"leaflet",
	"layout/base",
	"core/namespace",
  "func/tshf",
  "func/oceanWeather",
  "func/abnormalAlarm",
  "func/monitorStatisc",
  "func/filterDisplay",
  "func/wjAnalysis",
  "func/fullscreen"

],function(L){

  /*
  *菜单类
  */
  L.ICT.Menu = L.Class.extend({

    	mainmenu:null,

    	submenu:null,

    	initialize:function(){
    		this._container = $("#menupanel");
    		this.mainmenu = new L.ICT.Layout.MainMenu();
    		this.submenu = new L.ICT.Layout.SubMenu();
    	},

      show:function(){
         this._container.css("display","block");
      },

      hide:function(){
          this._container.css("display","none");
      },

      refresh:function(){

      },

      clear:function(){

      },

      getContainer:function(){
      	 return this._container;
      }

  });


  /*
  *主菜单类（一级菜单）
  */
  L.ICT.Layout.MainMenu = L.ICT.Layout.extend({
      
    //主菜单数据，用唯一id号来标识菜单项
  	_data:[
  	  {
  	  	id:'ict_menu_main_tshf',
  	    class:'menu_item',
  	    name:'态势回放',
  	    imgUrl:'themes/images/frame/menu_tshf.png',
  	    Handler:'',
  	    hasSub:true,
  	    available:true
  	 },
  	 {
  	  	id:'ict_menu_main_jktj',
  	    class:'menu_item',
  	    name:'监控统计',
  	    imgUrl:'themes/images/frame/menu_jktj.png',
  	    Handler:'',
  	    hasSub:false,
  	    available:true
  	 },
  	 {
  	  	id:'ict_menu_main_ycgj',
  	    class:'menu_item',
  	    name:'异常告警',
  	    imgUrl:'themes/images/frame/menu_ycgj.png',
  	    Handler:'',
  	    hasSub:false,
  	    available:true
  	 },
  	 {
  	  	id:'ict_menu_main_xwwj',
  	    class:'menu_item',
  	    name:'行为挖掘',
  	    imgUrl:'themes/images/frame/menu_xwfx.png',
  	    Handler:'',
  	    hasSub:true,
  	    available:true
  	 },
  	 {
  	  	id:'ict_menu_main_gkxx',
  	    class:'menu_item',
  	    name:'港口信息',
  	    imgUrl:'themes/images/frame/menu_gk.png',
  	    Handler:'',
  	    hasSub:false,
  	    available:true
  	 },
  	 {
  	  	id:'ict_menu_main_hyqx',
  	    class:'menu_item',
  	    name:'海洋气象',
  	    imgUrl:'themes/images/frame/menu_ocean_weather.png',
  	    Handler:'',
  	    hasSub:true,
  	    available:true
  	 },
  	 {
  	  	id:'ict_menu_main_glxs',
  	    class:'menu_item',
  	    name:'过滤显示',
  	    imgUrl:'themes/images/frame/menu_mbsx.png',
  	    Handler:'',
  	    hasSub:true,
  	    available:true
  	 },
  	 {
  	  	id:'ict_menu_main_qpxs',
  	    class:'menu_item',
  	    name:'全屏显示',
  	    imgUrl:'themes/images/frame/menu_max.png',
  	    Handler:'',
  	    hasSub:false,
  	    available:true
  	 }
  	],
      
    _menuSubs:[],

  	initialize:function(){
  		L.ICT.Layout.prototype.initialize.call(this);
  		this._container = $(".menu_main_panel");
  		this._init();
  	},

  	_getMainMenuHTML:function(){
           var html = [],
               data = this._data;
           html.push('<ul class="menu_main">');
           for(i=0,len=data.length;i<len;i++){
           	html.push('<li id="'+ data[i].id +'" class="'+ data[i].class +'" title="'+ data[i].name +'" data-available="' + data[i].available +'" data-sub="'+ data[i].hasSub +'">');
           	html.push('<img alt src="'+ data[i].imgUrl +'">');
           	html.push('</li>');
           }
           html.push('</ul>');
           return html.join("");
  	},

  	_init:function(){
  		var html = this._getMainMenuHTML();
  		this._container.html(html);
  		// this._container.find(".menu_item").on("click",{context:this},this._menuItemClickHandler);        
      var data = this._data;
  		for(var i=0,len=data.length;i<len;i++){			
  			if(data[i].available){
  				this.enableMenu(data[i].id);
  			}else{
  				this.disableMenu(data[i].id);
  			}
  		}
  	},
      
    //菜单点击事件
  	_menuItemClickHandler:function(event){
          event.stopPropagation();
          var _this = event.data.context;
              $this = $(event.currentTarget),
              menuid = $this.attr("id"),
              menuitem = _this.getMenuItemById(menuid),
              isactive = $this.hasClass("active");          
          //样式
          $this.toggleClass("active");
          //行为
          _this.menuHandler(menuid,!isactive);       
  	},
      
    //执行或关闭某个模块
  	menuHandler:function(menuid,isactive){

        switch(menuid){

          case "ict_menu_main_tshf":
               isactive ? L.ICT.Func["TSHFMoreShip"].run() : L.ICT.Func["TSHFMoreShip"].close()
               ;break;
          case "ict_menu_main_jktj": 
               isactive ? L.ICT.Func["MonitorStatisc"].run() : L.ICT.Func["MonitorStatisc"].close()
               ;break;
          case "ict_menu_main_ycgj":
               isactive ? L.ICT.Func["AbnormalAlarm"].run() : L.ICT.Func["AbnormalAlarm"].close()
               ;break;
          case "ict_menu_main_xwwj":
                isactive ? L.ICT.Func["WJAnalysis"].run() : L.ICT.Func["WJAnalysis"].close()
               ;break;
          case "ict_menu_main_gkxx":
                isactive ? L.ICT.Func["PortInfo"].run() : L.ICT.Func["PortInfo"].close()
               ;break;
          case "ict_menu_main_hyqx":
               isactive ? L.ICT.Func["OceanWeather"].run() : L.ICT.Func["OceanWeather"].close()
               ;break;
          case "ict_menu_main_glxs":  
               isactive ? L.ICT.Func["FilterDisplay"].run() : L.ICT.Func["FilterDisplay"].close()
               ;break;
          case "ict_menu_main_qpxs": 
               isactive ? L.ICT.Func["FullScreen"].run() : L.ICT.Func["FullScreen"].close()
               ;break;
     
        }         
  	},
      
    //激活并运行某个菜单项
  	activeMenu:function(menuid){ 
         if(!this._container.find("#"+menuid).hasClass("active")){
             this._container.find("#"+menuid).addClass("active");
             this.menuHandler(menuid,true);          
         }
  	},
      
    //关闭并退出某个菜单项
  	deactiveMenu:function(menuid){
        if(this._container.find("#"+menuid).hasClass("active")){
           this._container.find("#"+menuid).removeClass("active");
           this.menuHandler(menuid,false);          
        }
  	},

    //关闭并退出除当前菜单项以外的菜单项(不包括全屏菜单)
    deactiveMenuExceptOne:function(menuid){        
        var data = this._data;
        for(var i=0,len=data.length;i<len;i++){
           var id = data[i].id;
           if(id === 'ict_menu_main_qpxs'){return;}
           if(id !== menuid){
              if(this._container.find("#"+id).hasClass("active")){
                 this._container.find("#"+id).removeClass("active");
                 this.menuHandler(id,false);          
              }             
           }
        }
    },
      
    //禁用菜单项 ；如果没传参数，禁用所有菜单项(不包括全屏菜单)
  	disableMenu:function(menuid){
         if($.type(menuid) === "undefined"){  
         	  this._container.find(".menu_item:not(#ict_menu_main_qpxs)").off("click");       	  
         } else {
            this._container.find('#'+menuid).off("click");
         }
  	},

    //禁用菜单项 除某个菜单以外的菜单都禁用(不包括全屏菜单)
    disableMenuExceptOne:function(menuid){
         if($.type(menuid) === "undefined"){  
            this._container.find(".menu_item:not(#ict_menu_main_qpxs)").off("click");          
         } else {   
            if(menuid === 'ict_menu_main_qpxs'){return;};
            this._container.find('.menu_item:not(#'+menuid+')').off("click");
         }
    },    
      
    //启用菜单项；如果没传参数，启用所有菜单项
  	enableMenu:function(menuid){
         if($.type(menuid) === "undefined"){  
         	  this._container.find(".menu_item").off("click"); 
         	  this._container.find(".menu_item").on("click",{context:this},this._menuItemClickHandler);       	  
         } else {
            this._container.find('#'+menuid).off("click");
            this._container.find('#'+menuid).on("click",{context:this},this._menuItemClickHandler);
         }
  	},

  	getMenuItemById:function(menuid){
         var data = this._data;
         for(var i=0,len=data.length; i<len; i++){
         	   if(data[i].id === menuid){
         	   	  return data[i];
         	    }       	   	    
         }
  	},

  	getMenuSub:function(menuid){
  	   var submenuObj = null;

         if(menuid === 'ict_menu_main_tshf'){

            var html = '';
            submenuObj = new L.ICT.Layout.SubMenu(html);

         } else if(menuid === 'ict_menu_main_xwwj'){

         } else if(menuid === 'ict_menu_main_hyqx'){

         } else if(menuid === 'ict_menu_main_glxs'){

         }

         return submenuObj;
  	}
      
  });

  /*
  *子菜单类（二级菜单）
  */
  L.ICT.Layout.SubMenu = L.ICT.Layout.extend({

  	  _data:{}, //{id:$objhtml}

    	initialize:function(html){
    		L.ICT.Layout.prototype.initialize.call(this);
    		this._container = $(".menu_sub_panel");
    		this._isShow = false;
    		this._data = {};
    		// this._html = html;
    		// this._init();
    	},
      
      _init:function(){
         this._container.html(this._html);
      },

      show:function(pmenuid){
      	var $content = this._data[pmenuid];
      	this._container.html($content);
      	this._container.css("display","block");
      },

      hide:function(){    	
      	this._container.css("display","none");
      },

      add:function(pmenuid,html){ //html string or jquery obj
          var $html = html;
          if(typeof html === "string"){
          	$html = $(html);
          }
          this._data[pmenuid] = $html;    
      },

      has:function(pmenuid){
      	if(this._data.hasOwnProperty(pmenuid)){
      		return true;
      	} else{
      		return false;
      	}
      },

      update:function(pmenuid,html){
          this._html = html;
          this._init();
          this.show();
      },

      destory:function(pmenuid){
         this.hide();
         delete this._data[pmenuid];
      }

  });

});

