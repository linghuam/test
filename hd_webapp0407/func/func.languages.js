/*
*语言切换模块
*/
define("func/languages",[
   "leaflet",
   "func/base",
   "plugins/jqueryi18n"

],function(){
    
    L.ICT.Func.add("Languages",{

    	Class:L.Class.extend({
              
             initialize:function(){
                  this._container = L.ict.app.toppanel.getContainer();
                  this.config = Project_ParamConfig.languages;
                  this.localStorage = L.ict.app.localStorage;
                  this.lang = this.localStorage.getItem("language") || 'zh'; //值为zh或en
             },

             start:function(){
             	this.initi18n();
                this.initLang();
                this.initEvts();               
             },

             stop:function(){ 
                
             },             
             
             //初始化语言插件
             initi18n:function(){
             	var self = this;
                var lang = this.lang === 'zh' ?  '' : this.lang;
              	$.i18n.properties({
				    name:'strings', // 资源文件名称
				    path:'languages/', // 资源文件路径
				    mode:'both', //vars map both
				    language:lang, //ISO-639 指定的语言编码（如：“en”表示英文、“zh”表示中文）
				    cache:true, 
				    checkAvailableLanguages: true,
				    async: false,
				    callback:function(){
                       self.langLoadCallback();
				    }
		       });  

             },
        
             //语言切换html
             initLang:function(){
             	var langhtml = [];
             	for(var i=0,len=this.config.length;i<len;i++){
             		var lan = this.config[i];
                    if(this.lang === lan.key){
                        if(this.lang === 'zh')	langhtml.push('<option selected value="'+lan.key+'">'+ lan.value +'</option>');
                        else langhtml.push('<option selected value="'+lan.key+'">'+ lan.value_en +'</option>');
                    } else{
                    	if(this.lang === 'zh') langhtml.push('<option value="'+lan.key+'">'+lan.value+'</option>');
                        else  langhtml.push('<option value="'+lan.key+'">'+lan.value_en+'</option>');                   	
                    }
             	}
             	langhtml = langhtml.join("");
                this.localStorage.setItem("language",this.lang);
             	this._container.find(".languageSetting").html(langhtml);
                
             },        
             
             // 语言选择事件
             initEvts:function(){
             	var self  = this;
                this._container.find(".languageSetting").on("change",function(e){
                     var lang = $(this).val();
                     self.localStorage.setItem("language",lang);
                     window.location.reload();
                });

             },     
             
             //语言资源文件加载完成后回调
             langLoadCallback:function(){
                 this.loadMainPageLang();
                 this.loadFuncPageLang();
             },

             /*
             *对外接口
             *主页面语言 主体页面的语言设置
             *
             */ 
             loadMainPageLang:function(){
                 //title
                 document.title = $.i18n.prop('systemname');
                 //顶部菜单栏
                 this._toppanel = L.ict.app.toppanel.getContainer();
                 this._toppanel.find(".toppanel_left_title").html($.i18n.prop('toppanel_left_title'));
                 this._toppanel.find(".toppanel_keysearch_remind").attr("placeholder",$.i18n.prop('func_keysearch_ship_plh'));  
                 this._toppanel.find(".toppanel_keysearch_title").attr("title",$.i18n.prop('toppanel_keysearch_title'));  
                 this._toppanel.find(".toppanel_right_eventRemind").html($.i18n.prop('toppanel_right_eventRemind'));    
                 this._toppanel.find(".toppanel_right_layerSelect").html($.i18n.prop('toppanel_right_layerSelect'));                                      
                 this._toppanel.find(".toppanel_right_langSetting").html($.i18n.prop('toppanel_right_langSetting'));
                 this._toppanel.find(".toppanel_right_login").html($.i18n.prop('toppanel_right_login'));
                 this._toppanel.find(".toppanel_right_enroll").html($.i18n.prop('toppanel_right_enroll'));
                 this._toppanel.find(".toppanel_right_signout").html($.i18n.prop('toppanel_right_signout'));
                 this._toppanel.find(".toppanel_right_changepsw").html($.i18n.prop('toppanel_right_changepsw'));

             },

             /*
             *对外接口
             *功能页面设置 对应各个功能模块的语言设置
             *
             */
             loadFuncPageLang:function(){

             }
    	})
    }); 

});