/*
*功能菜单模块
*/
define("layout/menu",[
	"leaflet",
	"layout/base",
	"core/namespace",
  "func/tshf",
  "func/oceanWeather",
	"func/filterDisplay",
  "func/portInfo",
  "func/heatmap",
  "func/areaflow",
  "func/portquery",
  "func/cdgl",
  "func/weather"

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
      this._container.addClass("disableSelect");
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
    
  /*主菜单数据，用唯一id号来标识菜单项*/
	_data:[

   {
      id:'ict_menu_main_glxs',
      class:'menu_item',
      name:'过滤显示',
      name_en:'Filters',
      imgUrl:'themes/images/frame/menu_mbsx.png',
      Handler:'',
      hasSub:true,
      available:true
   },
   {
      id:'ict_menu_main_gkcx',
      class:'menu_item',
      name:'港口查询',
      name_en:'Ports',
      imgUrl:'themes/images/frame/menu_gkcx.png',
      Handler:'',
      hasSub:true,
      available:true
   }, 
   {
      id:'ict_menu_main_weather',
      class:'menu_item',
      name:'水文、气象信息',
      name_en:'Hydrological & meteorological information',
      imgUrl:'themes/images/frame/menu-swqxxx.png',
      Handler:'',
      hasSub:false,
      available:true
   },  
   {
      id:'ict_menu_main_cdgl',
      class:'menu_item',
      name:'船队管理',
      name_en:'Fleets',
      imgUrl:'themes/images/frame/menu_cdgl.png',
      Handler:'',
      hasSub:false,
      available:true
   },        
	 {
	  	id:'ict_menu_main_qyll',
	    class:'menu_item',
	    name:'区域流量分析',
      name_en:'Arrivals & Departures of Area',
	    imgUrl:'themes/images/frame/menu_xwfx.png',
	    Handler:'',
	    hasSub:false,
	    available:true
	 },
	 {
		 id:'ict_menu_main_tshf',
		 class:'menu_item',
		 name:'态势回放',
     name_en:'track playback',
		 imgUrl:'themes/images/frame/menu_tshf.png',
		 Handler:'',
		 hasSub:true,
		 available:true
	 },
	 {
	  	id:'ict_menu_main_rlt',
	    class:'menu_item',
	    name:'热力图',
      name_en:'Density Maps',
	    imgUrl:'themes/images/frame/menu_rlt.png',
	    Handler:'',
	    hasSub:false,
	    available:true
	 },
	 {
	  	id:'ict_menu_main_hjcx',
	    class:'menu_item',
	    name:'历史轨迹查询',
      name_en:'History tracks',
	    imgUrl:'themes/images/frame/menu_qyllfx.png',
	    Handler:'',
	    hasSub:true,
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
            if(Project_ParamConfig.lang === 'zh'){
               var name = data[i].name;
            } else{
               var name = data[i].name_en;
            }
           	html.push('<li id="'+ data[i].id +'" class="'+ data[i].class +'" title="'+ name +'" data-available="' + data[i].available +'" data-sub="'+ data[i].hasSub +'">');
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
        
        // if(menuid == "ict_menu_main_glxs"){
        //    _this.deactiveMenu("ict_menu_main_hyqx");
        // }
        // if(menuid == "ict_menu_main_hyqx"){
        //    _this.deactiveMenu("ict_menu_main_glxs");
        // }
        //行为
        _this.menuHandler(menuid,!isactive);
     

	},
    
  //执行或关闭某个模块
	menuHandler:function(menuid,isactive){

    switch(menuid){

      case "ict_menu_main_glxs":
           isactive ? L.ICT.Func["FilterDisplay"].run() : L.ICT.Func["FilterDisplay"].close()
           ;break;
      case "ict_menu_main_gkcx": 
           isactive ? L.ICT.Func["PortQuery"].run() : L.ICT.Func["PortQuery"].close()
           ;break;
      case "ict_menu_main_weather":
           isactive ? L.ICT.Func["weather"].run() : L.ICT.Func["weather"].close()
           ;break;
      case "ict_menu_main_cdgl":
           isactive ? L.ICT.Func["cdgl"].run() : L.ICT.Func["cdgl"].close()
           ;break;
      case "ict_menu_main_qyll":
            isactive ? L.ICT.Func["AreaFlow"].run() : L.ICT.Func["AreaFlow"].close()
           ;break;
      case "ict_menu_main_tshf":
           isactive ? L.ICT.Func["TSHF"].run() : L.ICT.Func["TSHF"].close()
           ;break;
      case "ict_menu_main_rlt":  
           isactive ? L.ICT.Func["HeatMap"].run() : L.ICT.Func["HeatMap"].close()
           ;break;
      case "ict_menu_main_hjcx": 
           isactive ? L.ICT.Func["HJCXMoreShip"].run() : L.ICT.Func["HJCXMoreShip"].close()
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

    //关闭并退出除当前菜单项以外的菜单项
    deactiveMenuExceptOne:function(menuid){
        var data = this._data;
        for(var i=0,len=data.length;i<len;i++){
           var id = data[i].id;
           if(id !== menuid){
              if(this._container.find("#"+id).hasClass("active")){
                 this._container.find("#"+id).removeClass("active");
                 this.menuHandler(id,false);          
              }             
           }
        }

    },    
    
  //禁用菜单项 ；如果没传参数，禁用所有菜单项
	disableMenu:function(menuid){
       if($.type(menuid) === "undefined"){  
       	  this._container.find(".menu_item").off("click");       	  
       } else {
          this._container.find('#'+menuid).off("click");
       }
	},
    
    //禁用菜单项 除某个菜单以外的菜单都禁用
    disableMenuExceptOne:function(menuid){
         if($.type(menuid) === "undefined"){  
            this._container.find(".menu_item").off("click");          
         } else {
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

