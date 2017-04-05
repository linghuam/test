/**
*过滤显示
*/
define("func/filterDisplay",[
	"leaflet",
	"func/base",
    "func/userLogin"

],function(L){

     
     L.ICT.Func.add("FilterDisplay",{

         Class: L.Class.extend({

            initialize:function(){
                this.menu = L.ict.app.menu;
                this.menuid = 'ict_menu_main_glxs';
                this.ictmap = L.ict.app.ictmap;
                this.shipTypeList = Project_ParamConfig.FilterDisplayConfig.shipTypeList; //st
                this.shipFlagList = Project_ParamConfig.FilterDisplayConfig.shipFlagList;
                this.shipStateList = Project_ParamConfig.FilterDisplayConfig.shipStateList; //sta
                this.shipSourceList = Project_ParamConfig.FilterDisplayConfig.shipSourceList; //sid

            },

            start:function(){
                this.menu.mainmenu.deactiveMenuExceptOne(this.menuid);
                if(!L.ICT.Func["UserLogin"].getInstance().isLogin()){
                    L.ICT.Func["UserLogin"].getInstance().alertLoginDialog();
                    this.menu.mainmenu.deactiveMenu(this.menuid);
                    return;
                }
                if(!this.menu.submenu.has(this.menuid)){
                    this.menu.submenu.add(this.menuid,this.getSubMenuHTML());
                }
                this.menu.submenu.show(this.menuid);
                this._initSubMenuEvts();
           
            },

            stop:function(){
                this.menu.submenu.hide();
                this.menu.mainmenu.deactiveMenu(this.menuid);
            },
            
            getSubMenuHTML:function(){
                var html = [];
                html.push('<ul class="submenu_glxs">');
                html.push('<li class="submenu_glxs_li">');
                html.push('<img src="themes/images/frame/menu_glxs_cblx.png">&nbsp&nbsp<label class="func_filter_shiptype">按船舶类型</label>&nbsp&nbsp<img class="arrowImg" src="themes/images/frame/arrow_down.png">');
                html.push('<ul class="filter_ul shipTypeList" style="display:none;">');
                for(var i=0,len=this.shipTypeList.length;i<len;i++){
                    html.push('<li>');
                    html.push('<img src="themes/images/filterdisplay/shipTypeList_'+this.shipTypeList[i]+'.png">');
                    html.push('&nbsp;&nbsp');
                    html.push('<label>'+ this.getNameByKey(this.shipTypeList[i],'shiptype') +'</label>');
                    html.push('&nbsp;&nbsp');
                    html.push('<input type="checkbox" value="'+this.shipTypeList[i]+'" checked>');
                    html.push('</li>');
                }
                html.push('</ul>');
                html.push('</li>');
                html.push('<li class="submenu_glxs_li">');
                html.push('<img src="themes/images/frame/menu_glxs_cq.png">&nbsp&nbsp<label class="func_filter_shipflag">按船旗</label>&nbsp&nbsp<img class="arrowImg" src="themes/images/frame/arrow_down.png">');
                html.push('<ul class="filter_ul shipFlagList" style="display:none;">');
                for(var i=0,len=this.shipFlagList.length;i<len;i++){
                    html.push('<li>');
                    html.push('<img src="themes/images/filterdisplay/country_'+this.shipFlagList[i]+'.png">');
                    html.push('&nbsp;&nbsp');
                    html.push('<label>'+ this.getNameByKey(this.shipFlagList[i],'shipflag') +'</label>');
                    html.push('&nbsp;&nbsp');
                    html.push('<input type="checkbox" value="'+this.shipFlagList[i]+'" checked>');
                    html.push('</li>');
                }                
                html.push('</ul>');
                html.push('</li>');
                html.push('<li class="submenu_glxs_li">');
                html.push('<img src="themes/images/frame/menu_glxs_hxzt.png">&nbsp&nbsp<label class="func_filter_shipsta">按航行状态</label>&nbsp&nbsp<img class="arrowImg" src="themes/images/frame/arrow_down.png">');
                html.push('<ul class="filter_ul shipStateList" style="display:none;">');
                for(var i=0,len=this.shipStateList.length;i<len;i++){
                    html.push('<li>');                    
                    html.push('<label>'+ this.getNameByKey(this.shipStateList[i],'shipstate') +'</label>');
                    html.push('&nbsp;&nbsp');
                    html.push('<input type="checkbox" value="'+this.shipStateList[i]+'" checked>');
                    html.push('</li>');
                }                 
                html.push('</ul>');
                html.push('</li>');
                html.push('<li class="submenu_glxs_li">');
                html.push('<img src="themes/images/frame/menu_glxs_aly.png">&nbsp&nbsp<label class="func_filter_shipsrc">按来源</label>&nbsp&nbsp<img class="arrowImg" src="themes/images/frame/arrow_down.png">');
                html.push('<ul class="filter_ul shipSourceList" style="display:none;">');
                for(var i=0,len=this.shipSourceList.length;i<len;i++){
                    html.push('<li>');                   
                    html.push('<label>'+ this.getNameByKey(this.shipSourceList[i],'shipsrc') +'</label>');
                    html.push('&nbsp;&nbsp');
                    html.push('<input type="checkbox" value="'+this.shipSourceList[i]+'" checked>');
                    html.push('</li>');
                }                      
                html.push('</ul>');
                html.push('</li>');
                html.push('</ul>');
                return html.join("");                

                //old 基于配置动态生成
                // var html = [];
                // html.push('<ul class="submenu_glxs">');
                // html.push('<li class="submenu_glxs_li">');
                // html.push('<img src="themes/images/frame/menu_glxs_cblx.png">&nbsp&nbsp<label>按船舶类型</label>&nbsp&nbsp<img class="arrowImg" src="themes/images/frame/arrow_down.png">');
                // html.push('<ul class="filter_ul shipTypeList" style="display:none;">');
                // for(var i=0,len=this.shipTypeList.length;i<len;i++){
                //     html.push('<li>');
                //     html.push('<img src="themes/images/shipIcons/shipTypeList_'+this.shipTypeList[i]+'.png">');
                //     html.push('&nbsp;&nbsp');
                //     html.push('<label>'+this.shipTypeList[i]+'</label>');
                //     html.push('&nbsp;&nbsp');
                //     html.push('<input type="checkbox" value="'+this.shipTypeList[i]+'" checked>');
                //     html.push('</li>');
                // }
                // html.push('</ul>');
                // html.push('</li>');
                // html.push('<li class="submenu_glxs_li">');
                // html.push('<img src="themes/images/frame/menu_glxs_cq.png">&nbsp&nbsp<label>按船旗</label>&nbsp&nbsp<img class="arrowImg" src="themes/images/frame/arrow_down.png">');
                // html.push('<ul class="filter_ul shipFlagList" style="display:none;">');
                // for(var i=0,len=this.shipFlagList.length;i<len;i++){
                //     html.push('<li>');
                //     html.push('<img src="themes/images/country/'+this.shipFlagList[i]+'.png">');
                //     html.push('&nbsp;&nbsp');
                //     html.push('<label>'+this.shipFlagList[i]+'</label>');
                //     html.push('&nbsp;&nbsp');
                //     html.push('<input type="checkbox" value="'+this.shipFlagList[i]+'" checked>');
                //     html.push('</li>');
                // }                
                // html.push('</ul>');
                // html.push('</li>');
                // html.push('<li class="submenu_glxs_li">');
                // html.push('<img src="themes/images/frame/menu_glxs_hxzt.png">&nbsp&nbsp<label>按航行状态</label>&nbsp&nbsp<img class="arrowImg" src="themes/images/frame/arrow_down.png">');
                // html.push('<ul class="filter_ul shipStateList" style="display:none;">');
                // for(var i=0,len=this.shipStateList.length;i<len;i++){
                //     html.push('<li>');                    
                //     html.push('<label>'+ this.ictmap.realtarget.getDetialConvertName(this.shipStateList[i],"status") +'</label>');
                //     html.push('&nbsp;&nbsp');
                //     html.push('<input type="checkbox" value="'+this.shipStateList[i]+'" checked>');
                //     html.push('</li>');
                // }                 
                // html.push('</ul>');
                // html.push('</li>');
                // html.push('<li class="submenu_glxs_li">');
                // html.push('<img src="themes/images/frame/menu_glxs_aly.png">&nbsp&nbsp<label>按来源</label>&nbsp&nbsp<img class="arrowImg" src="themes/images/frame/arrow_down.png">');
                // html.push('<ul class="filter_ul shipSourceList" style="display:none;">');
                // for(var i=0,len=this.shipSourceList.length;i<len;i++){
                //     html.push('<li>');                   
                //     html.push('<label>'+ this.ictmap.realtarget.getDetialConvertName(this.shipSourceList[i] ,"orig_info_source") +'</label>');
                //     html.push('&nbsp;&nbsp');
                //     html.push('<input type="checkbox" value="'+this.shipSourceList[i]+'" checked>');
                //     html.push('</li>');
                // }                      
                // html.push('</ul>');
                // html.push('</li>');
                // html.push('</ul>');
                // return html.join("");

            },

            getNameByKey:function(key,type){
               key = key.toString();
                var res = null;
                if(type === 'shiptype'){
                    switch(key){
                        case "1": res=$.i18n.prop('func_filter_shiptype_1');break;
                        case "2": res=$.i18n.prop('func_filter_shiptype_2');break;
                        case "3": res=$.i18n.prop('func_filter_shiptype_3');break;
                        case "4": res=$.i18n.prop('func_filter_shiptype_4');break;
                        case "5": res=$.i18n.prop('func_filter_shiptype_5');break;
                        case "6": res=$.i18n.prop('func_filter_shiptype_6');break;
                        case "7": res=$.i18n.prop('func_filter_shiptype_7');break;
                        case "8": res=$.i18n.prop('func_filter_shiptype_8');break;  
                        case "100": res=$.i18n.prop('func_filter_shiptype_100');break;                   
                    }

                }else if(type === 'shipflag'){
                    switch(key){
                        case "1": res=$.i18n.prop('func_filter_shipflag_1');break;
                        case "2": res=$.i18n.prop('func_filter_shipflag_2');break;
                        case "3": res=$.i18n.prop('func_filter_shipflag_3');break;
                        case "4": res=$.i18n.prop('func_filter_shipflag_4');break;
                        case "5": res=$.i18n.prop('func_filter_shipflag_5');break; 
                        case "100": res=$.i18n.prop('func_filter_shipflag_100');break;                   
                    }                    

                }else if(type === 'shipstate'){
                    switch(key){
                        case "0": res=$.i18n.prop('func_filter_shipsta_0');break;
                        case "1": res=$.i18n.prop('func_filter_shipsta_1');break;
                        case "2": res=$.i18n.prop('func_filter_shipsta_2');break;
                        case "3": res=$.i18n.prop('func_filter_shipsta_3');break;
                        case "4": res=$.i18n.prop('func_filter_shipsta_4');break;
                        case "5": res=$.i18n.prop('func_filter_shipsta_5');break;
                        case "6": res=$.i18n.prop('func_filter_shipsta_6');break;
                        case "7": res=$.i18n.prop('func_filter_shipsta_7');break;
                        case "8": res=$.i18n.prop('func_filter_shipsta_8');break;                   
                    }                    

                }else if(type === 'shipsrc'){
                    switch(key){
                        case "1": res=$.i18n.prop('func_filter_shipsrc_1');break;
                        case "2": res=$.i18n.prop('func_filter_shipsrc_2');break;                  
                    }                    

                }
                return res;

                // key = key.toString();
                // var res = null;
                // if(type === 'shiptype'){
                //     switch(key){
                //         case "1": res='货船';break;
                //         case "2": res='搜救船';break;
                //         case "3": res='油轮';break;
                //         case "4": res='拖轮';break;
                //         case "5": res='渔船';break;
                //         case "6": res='拖船';break;
                //         case "7": res='客船';break;
                //         case "8": res='军事船';break;  
                //         case "100": res='其他';break;                   
                //     }

                // }else if(type === 'shipflag'){
                //     switch(key){
                //         case "1": res='中国';break;
                //         case "2": res='英国';break;
                //         case "3": res='法国';break;
                //         case "4": res='美国';break;
                //         case "5": res='俄罗斯';break; 
                //         case "100": res='其他';break;                   
                //     }                    

                // }else if(type === 'shipstate'){
                //     switch(key){
                //         case "0": res='机动船在航';break;
                //         case "1": res='锚泊';break;
                //         case "2": res='船舶失控';break;
                //         case "3": res='船舶操作受限';break;
                //         case "4": res='吃水受限';break;
                //         case "5": res='系泊';break;
                //         case "6": res='搁浅';break;
                //         case "7": res='捕捞作业';break;
                //         case "8": res='风帆动力';break;                   
                //     }                    

                // }else if(type === 'shipsrc'){
                //     switch(key){
                //         case "1": res='星基AIS数据';break;
                //         case "2": res='岸基AIS数据';break;                  
                //     }                    

                // }
                // return res;

            },

            _initSubMenuEvts:function(){
                 var self = this,
                     $menuContainer = this.menu.getContainer();

                 //中英文
                 $menuContainer.find(".func_filter_shiptype").html($.i18n.prop('func_filter_shiptype'));
                 $menuContainer.find(".func_filter_shipflag").html($.i18n.prop('func_filter_shipflag'));
                 $menuContainer.find(".func_filter_shipsta").html($.i18n.prop('func_filter_shipsta'));
                 $menuContainer.find(".func_filter_shipsrc").html($.i18n.prop('func_filter_shipsrc'));

                 $menuContainer.find(".submenu_glxs .submenu_glxs_li").on("click",function(){
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
                 
                 $menuContainer.find(".submenu_glxs .filter_ul").on("click",function(event){
                    event.stopPropagation();
                 });
                 //按船舶类型
                 $menuContainer.find(".submenu_glxs .shipTypeList>li>input[type=checkbox]").on("click",function(event){
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
                 //按船旗
                 $menuContainer.find(".submenu_glxs .shipFlagList>li>input[type=checkbox]").on("click",function(event){
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
                 //按航行状态
                 $menuContainer.find(".submenu_glxs .shipStateList>li>input[type=checkbox]").on("click",function(event){
                     var value = $(this).val();
                     if(this.checked){
                        self.shipStateList.push(value);
                     }else{
                        var index = self.shipStateList.indexOf(value);
                        if(index !== -1){
                            self.shipStateList.splice(index,1);
                        }
                     }
                     //刷新地图...
                     self.updateShowTarget();                      
                 });
                 //按信息源
                 $menuContainer.find(".submenu_glxs .shipSourceList>li>input[type=checkbox]").on("click",function(event){
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

            updateShowTarget:function(){
                if(this.ictmap.realtarget.isRealTargetShow()){
                   this.ictmap.realtarget.updateFilterLayer();
                }

            }
            
         })

     });

});