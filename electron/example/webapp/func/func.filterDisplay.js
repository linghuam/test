/**
*过滤显示模块
*/
define("func/filterDisplay",[
    "leaflet",
    "func/base"

],function(L){

     
     L.ICT.Func.add("FilterDisplay",{

         Class: L.Class.extend({

            initialize:function(){
                this.menu = L.ict.app.menu;
                this.menuid = 'ict_menu_main_glxs';
                this.ictmap = L.ict.app.ictmap;
                this.shipTypeList = Project_ParamConfig.FilterDisplayConfig.shipTypeList; //st
                this.shipFlagList = Project_ParamConfig.FilterDisplayConfig.shipFlagList;
                this.shipSourceList = Project_ParamConfig.FilterDisplayConfig.shipSourceList; //sid

            },

            start:function(){
                if(!this.menu.submenu.has(this.menuid)){
                    this.menu.submenu.add(this.menuid,this.getSubMenuHTML());
                }
                this.menu.submenu.show(this.menuid);
                this._initSubMenuEvts();
           
            },

            stop:function(){
                this.menu.submenu.hide();
            },
            
            getSubMenuHTML:function(){
                var html = [];
                html.push('<ul class="submenu_glxs">');

                html.push('<li class="submenu_glxs_li">');
                html.push('<img src="themes/images/frame/menu_glxs_aly.png">&nbsp&nbsp<label>信息源</label>&nbsp&nbsp<img class="arrowImg" src="themes/images/frame/arrow_down.png">');
                html.push('<ul class="filter_ul shipSourceList" style="display:none;">');
                for(var i=0,len=this.shipSourceList.length;i<len;i++){
                    html.push('<li>');                    
                    html.push('<label>'+this.getSourceValue(this.shipSourceList[i])+'</label>');
                    html.push('&nbsp;&nbsp');
                    html.push('<input type="checkbox" value="'+this.shipSourceList[i]+'" checked>');
                    html.push('</li>');
                }                      
                html.push('</ul>');
                html.push('</li>');                

                html.push('<li class="submenu_glxs_li">');
                html.push('<img src="themes/images/frame/menu_glxs_cblx.png">&nbsp&nbsp<label>目标类型</label>&nbsp&nbsp<img class="arrowImg" src="themes/images/frame/arrow_down.png">');
                html.push('<ul class="filter_ul shipTypeList" style="display:none;">');
                for(var i=0,len=this.shipTypeList.length;i<len;i++){
                    html.push('<li>');    
                    html.push('<img src="themes/images/shipIcons/'+ this.getshiptypeimg(this.shipTypeList[i]) +'.png">');
                    html.push('&nbsp;&nbsp');
                    html.push('<label>'+this.shipTypeList[i]+'</label>');
                    html.push('&nbsp;&nbsp');
                    html.push('<input type="checkbox" value="'+this.shipTypeList[i]+'" checked>');
                    html.push('</li>');
                }
                html.push('</ul>');
                html.push('</li>');

                html.push('<li class="submenu_glxs_li">');
                html.push('<img src="themes/images/frame/menu_glxs_cq.png">&nbsp&nbsp<label>目标国别</label>&nbsp&nbsp<img class="arrowImg" src="themes/images/frame/arrow_down.png">');
                html.push('<ul class="filter_ul shipFlagList" style="display:none;">');
                for(var i=0,len=this.shipFlagList.length;i<len;i++){
                    html.push('<li>');
                    html.push('<img src="themes/images/country/'+ this.getCountryimg(this.shipFlagList[i]) +'.png">');
                    html.push('&nbsp;&nbsp');
                    html.push('<label>'+this.shipFlagList[i]+'</label>');
                    html.push('&nbsp;&nbsp');
                    html.push('<input type="checkbox" value="'+this.shipFlagList[i]+'" checked>');
                    html.push('</li>');
                }                
                html.push('</ul>');
                html.push('</li>');

                html.push('</ul>');
                return html.join("");

            },

            getCountryimg:function(co){
              var res = "other";
               switch(co){
                case "中国": res = "China";break;
                case "美国": res = "America";break;
                case "英国": res = "britain";break;
                case "法国": res = "france";break;
                case "俄罗斯": res = "russia";break;
                default: res = "other"; 
              }  
              return res;

            },

            _initSubMenuEvts:function(){
                 var self = this,
                     menuContainer = this.menu.getContainer();

                 menuContainer.find(".submenu_glxs .submenu_glxs_li").on("click",function(){
                     if($(this).hasClass("active")){
                        $(this).find(".filter_ul").css("display","none");
                        $(this).find(".arrowImg").attr("src","themes/images/frame/arrow_down.png");
                        $(this).removeClass("active");
                     }else{
                        $(this).find(".filter_ul").css("display","block");
                        $(this).find(".arrowImg").attr("src","themes/images/frame/arrow_up.png");
                        $(this).addClass("active").siblings().removeClass("active");
                        $(this).siblings().find(".filter_ul").css("display","none");
                        $(this).siblings().find(".arrowImg").attr("src","themes/images/frame/arrow_down.png");
                     }
                 });
                 
                 menuContainer.find(".submenu_glxs .filter_ul").on("click",function(event){
                    event.stopPropagation();
                 });

                 menuContainer.find(".submenu_glxs .shipTypeList>li>input[type=checkbox]").on("click",function(event){
                     var value = $(this).val();
                     if(this.checked){
                        self.shipTypeList.push(value);
                     }else{
                        var index = self.shipTypeList.indexOf(value);
                        if(index !== -1){
                            self.shipTypeList.splice(index,1);
                        }
                     }
                     //刷新地图...
                     self.updateShowTarget();                     
                 });

                 menuContainer.find(".submenu_glxs .shipFlagList>li>input[type=checkbox]").on("click",function(event){
                     var value = $(this).val();
                     if(this.checked){
                        self.shipFlagList.push(value);
                     }else{
                        var index = self.shipFlagList.indexOf(value);
                        if(index !== -1){
                            self.shipFlagList.splice(index,1);
                        }
                     }
                     //刷新地图...
                     self.updateShowTarget();                 
                 });

                 // menuContainer.find(".submenu_glxs .shipStateList>li>input[type=checkbox]").on("click",function(event){
                 //     var value = $(this).val();
                 //     if(this.checked){
                 //        self.shipStateList.push(value);
                 //     }else{
                 //        var index = self.shipStateList.indexOf(value);
                 //        if(index !== -1){
                 //            self.shipStateList.splice(index,1);
                 //        }
                 //     }
                 //     //刷新地图...
                 //     self.updateShowTarget();                      
                 // });

                 menuContainer.find(".submenu_glxs .shipSourceList>li>input[type=checkbox]").on("click",function(event){
                     var value = $(this).val();
                     if(this.checked){
                        self.shipSourceList.push(value);
                     }else{
                        var index = self.shipSourceList.indexOf(value);
                        if(index !== -1){
                            self.shipSourceList.splice(index,1);
                        }
                     }
                     //刷新地图...
                    self.updateShowTarget();                       
                 });

            },

            getshiptypeimg:function(type){
               var type = type.toString(),
                   icon = null;
               switch (type){
                 case "货船": icon='target_1' ;break;
                 case "搜救船": icon='target_8';break;
                 case "油轮": icon='target_2';break;
                 case "拖船": icon='target_3' ;break;
                 case "渔船": icon='target_4';break;
                 case "客船": icon='target_5';break;
                 case "军事船": icon='target_6' ;break;                                             
                 case "其他": icon='target_7' ;break;
                 default: icon='target_7';            
               }
               return icon;
            },

            getSourceValue:function(key){
                var value = "";
                if(key == "1"){
                    value = "渔政局";
                }else if(key == "2"){
                    value = "海监";
                }else if(key == "3"){
                    value = "北斗信息";
                }else if(key == "4"){
                    value = "救捞局";
                }else if(key == "5"){
                     value = "星载AIS";
                }else if(key == "6"){
                    value = "";
                }else if(key == "7"){
                    value = "";
                }else if(key == "8"){
                    value = "";
                }
                return value;

            },

            updateShowTarget:function(){
                if(this.ictmap.realtarget.isRealTargetShow()){
                    this.ictmap.realtarget.updateFilterLayer();
                }
                
            }
            
         })

     });

});