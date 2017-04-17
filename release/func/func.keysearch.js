/**
*搜索模块
*/
define("func/keysearch",[
    "leaflet",
    "func/base",
    "data/ajax",
    "plugins/mcscroll",
    "control/paging",
    "control/panel",
    "func/userLogin"

],function(L){
     
  L.ICT.Func.add("KeySearch",{

     Class: L.Class.extend({

        initialize:function(){                
            this.dialog = L.ict.app.util.dialog;
            this.ajax = new L.ICT.Ajax();
            this.config = Project_ParamConfig.SearchConfig;
            this.ictmap = L.ict.app.ictmap;
            this.perPageCount = 9;//每页显示条数
            this._respopPanel = null;
            this._container = null;
        },

        start:function(param){
            //验证登录
            if(!L.ICT.Func["UserLogin"].getInstance().isLogin()){
                L.ICT.Func["UserLogin"].getInstance().alertLoginDialog();                
                return;
            }                 
           this.stop(); 
           this.param = param;       
           if(this.param.searchText == ""){
               if(this.param.searchType === "1"){
                  this.dialog.warn($.i18n.prop('dialog_alert_title'),$.i18n.prop('func_keysearch_ship_error1'));
               }
               else if(this.param.searchType === "2"){
                  this.dialog.warn($.i18n.prop('dialog_alert_title'),$.i18n.prop('func_keysearch_port_error1'));           
               }
               return;             
           }   
           var searchType = this.param.searchType;
           if(searchType === "1"){
              var type = 4;
              this.shipSearch(type);

           } else if(searchType === "2"){
              this.portSearch();
           }

        },

        stop:function(){
            if(this._respopPanel) {this._respopPanel.remove(false);}
            this._respopPanel = this._container = null;
            this.ictmap.realtarget.clearLocatLyr();            
            // this.ictmap.portlayer.clearLocatLyr();
        },
        
        /*以下为船舶搜索代码*/
        shipSearch:function(searchType){
           this.curPage = 1;          
           this.ajaxCount = 0;
           this.data = {
              type:searchType,
              num:this.param.searchText,        
              pageid:this.curPage,
              pagecount:this.perPageCount
           };          
           this.searchAjax(this.data);
        },

        searchAjax:function(data){
           var url = this.config.shipSearchUrl;
           this.ajax.post(url,data,true,this,function(res){
                this.ajaxCount++;
                if(res.state !== 1){
                    console.error(res.msg.error);
                    this.dialog.warn($.i18n.prop('dialog_alert_title'),$.i18n.prop('func_keysearch_ship_error2'));                        
                }else{
                    this.showSearchResult(res);
                }
           },function(error){
               this.ajaxCount++;
               // console.error(error.message);
           });

        },

        showSearchResult:function(data){      
            var self = this;
            var tablehtml = this.getTableHtml(data);    

            if(this.ajaxCount == 1){  //首次展示搜索结果                    
               this._initRespopPanel(data);
               this._initResEvts(data);

            } else{ //分页更新内容
                this._container.find(".searchTableContainer").html(tablehtml);
                this._container.find(".searchTableContainer").find(".mscrollbar").mCustomScrollbar({ theme: "minimal-dark",axis:'yx'});
                this._container.find(".searchTableContainer").find("table tr").on("click",function(event){self._clickRowEvt(event);});   
            }

        },
        
        _initRespopPanel:function(data){
            var options = {
                title:$.i18n.prop('func_keysearch_res_title',data.msg.total),
                width:290,
                height:280,
                left:345,
                top:60,
                isDrag:false
            };
            options.contentHTML = this._container = $(this.getResContentHtml(data));
            this._respopPanel =  new L.ICT.PopPanel(options).show();
            this._respopPanel.on("popPanelRemove",function(){
                this._container = null;
                this._respopPanel = null;
                this.stop();
            },this);

        },

        _initResEvts:function(data){
            var self = this;  
            //分页
            var options = {
                total:data.msg.max_page,
                count:5,
                present:this.curPage            
            };        
            options.pageChange = function(index){
                self.curPage = index;
                self.data.pageid=self.curPage;
                self.searchAjax(self.data);
            };
           var paging = new L.ICT.Control.Paging(options);
           paging.addTo(this._container.find(".pageContainer")[0]);
           //注册表格单击事件
           this._container.find("table tr").on("click",function(event){self._clickRowEvt(event);});
           //滚动
           this._container.find(".mscrollbar").mCustomScrollbar({ theme: "minimal-dark",axis:'yx' }); 
                         
        },   

        getTableHtml:function(data){
            var html = [];
            var listinfo = data.msg.shipList; 
            html.push('<div class="mscrollbar"><table>');
            for (var i=0,len=listinfo.length;i<len;i++){
                var onetarget=this.convertOneTargetFromObj(listinfo[i]);    
                var id = onetarget.id;
                // var mode = onetarget.mode;
                var shipname = $.i18n.prop('common_ship_shipname');
                // var tdtext = 'MMSI:'+ onetarget.mmsi + ';' + shipname + onetarget.sn + ';' + 'IMO:' + onetarget.cs;
                // html.push('<tr data-id="'+id+'"><td>'+tdtext+'</td></tr>');
                html.push('<tr data-id="'+ id +'">');
                html.push('<td>'+ 'MMSI:'+ onetarget.mmsi +'</td>');
                html.push('<td>'+ shipname + onetarget.sn +'</td>');
                html.push('<td>'+'IMO:'+ onetarget.imo +'</td>');                
                html.push('</tr>');
            }
            html.push('</table></div>');
            return html.join("");
        },

        getResContentHtml:function(data){
            var html = [];
            var listinfo = data.msg.shipList; 
            html.push('<div class="searchResContainer">');
            html.push('<div class="searchTableContainer" >');
            html.push(this.getTableHtml(data));
            html.push('</div>');
            html.push('<div class="pageContainer"></div>');
            html.push('</div>');
            return html.join("");

        },                    

        convertOneTargetFromObj:function(oneinfo){
            var onetarget = {};
            onetarget.mmsi = oneinfo.mmsi;
            // onetarget.imo=oneinfo.imo;
            onetarget.imo = oneinfo.imo; //呼号
            onetarget.sn = oneinfo.sn.replace(/@/g,""); //船名
            onetarget.id = oneinfo.mmsi; 
            onetarget.mode = oneinfo.mode;
            return onetarget;

        },  

        _clickRowEvt:function(e){
            $(e.currentTarget).addClass("active").siblings().removeClass("active");
            var shipid = $(e.currentTarget).data("id");  
            // var mode = $(e.currentTarget).data("mode");                
            var data = {};
            data.shipid = shipid;
            // data.mode = mode;
            this.ictmap.realtarget.locateShip(data);
        },

        /*以下为港口搜索代码*/
        portSearch:function(){
           var url = this.config.portSearchUrl;
           var data = {
               portname:this.param.searchText
           };
           this.ajax.post(url,data,true,this,function(res){
               if(res.state !== 1){
                   console.error(res.msg);
                   this.dialog.error($.i18n.prop('dialog_alert_title'),$.i18n.prop('func_keysearch_port_error2'));
               } else{
                   this.showPortSearchRes(res);
               }
              
           },function(error){

           });

        },

        showPortSearchRes:function(data){
            //ui
            var options = {
                title: $.i18n.prop('func_keysearch_res_title',data.msg.limit),
                width:290,
                height:280,
                left:345,
                top:60,
                isDrag:false
            };
            options.contentHTML = this._container = $(this.getPortResContentHtml(data));
            this._respopPanel =  new L.ICT.PopPanel(options).show();
            this._respopPanel.on("popPanelRemove",function(){
                this._container = null;
                this._respopPanel = null;
                // this.ictmap.portlayer.clearLocatLyr();

            },this);
            
           //events 
           var self = this;  
           //滚动
           this._container.find(".mscrollbar").mCustomScrollbar({ theme: "minimal-dark" });              
           //注册表格单击事件
           this._container.find("table tr").on("click",function(e){
              $(e.currentTarget).addClass("active").siblings().removeClass("active");
              var portid = $(e.currentTarget).data("id");                
              self.ictmap.portlayer.locateByPortId(portid);          
           });
        
            
        },

        getPortResContentHtml:function(data){
            var html = [];
            var listinfo = data.msg.portNames; 
            html.push('<div class="searchResContainer">');
            html.push('<div class="searchTableContainer" >');
            html.push('<div class="mscrollbar"><table>');
            for (var i=0,len=listinfo.length;i<len;i++){
                var onetarget = listinfo[i];    
                var id = onetarget.id;
                var name = onetarget.pn;
                // var tdtext = 'Id:'+ id + ';' + '港口名:' + name;
                var pn = $.i18n.prop('port_info_name');
                var tdtext = pn + name;                
                html.push('<tr data-id="'+id+'"><td>'+tdtext+'</td></tr>');
            }
            html.push('</table></div>');
            html.push('</div>');            
            html.push('</div>');
            return html.join("");          
        }        

     })

  });

});