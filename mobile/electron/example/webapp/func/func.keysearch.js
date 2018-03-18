/**
*搜索模块
*/
define("func/keysearch",[
    "leaflet",
    "func/base",
    "data/ajax",
    "plugins/mcscroll",
    "control/paging",
    "control/panel"

],function(L){
     
  L.ICT.Func.add("KeySearch",{

     Class: L.Class.extend({

        initialize:function(){                
            this.dialog = L.ict.app.util.dialog;
            this.ajax = new L.ICT.Ajax();
            this.config = Project_ParamConfig.SearchConfig;
            this.ictmap = L.ict.app.ictmap;
            this.perPageCount = 20;//每页显示条数
            this._respopPanel = null;
            this._container = null;
        },

        start:function(param){    
           this.stop(); 
           this.param = param;       
           if(this.param.searchText == ""){
               this.dialog.alert("提示","请输入搜索关键字");      
               return;             
           }   
           var searchType = this.param.searchType;
           switch (searchType){
                case "MMSI": searchType=1;break;
                case "呼号": searchType=2;break;
                case "批号": searchType=3;break;
                case "船名": searchType=4;break;
                case "IMO": searchType=5;break;
                default:;
           }
           this.curPage = 1;
           
           this.ajaxCount = 0;
           this.data = {
              type:searchType,
              num:this.param.searchText,
              mode:Project_ParamConfig.CurrentMode,
              pageid:this.curPage,
              pagecount:this.perPageCount
           };          
           this.searchAjax(this.data);
        },

        stop:function(){
            if(this._respopPanel) this._respopPanel.remove();
            this._respopPanel = this._container = null;
            this.ictmap.realtarget.clearLocatLyr();

        },

        searchAjax:function(data){
           var url = this.config.url;
           this.ajax.post(url,data,true,this,function(res){
                this.ajaxCount++;
                if(res){
                    if(res.state !== 1){
                        this.dialog.alert("提示",res.msg.error);
                    }else{
                        this.showSearchResult(res);
                    }
                }
           });
        },
        
        showSearchResult:function(data){
            var  reshtml = [];  
            var self = this;
            reshtml = this.getResTableHtml(data);   
            if(this.ajaxCount == 1){  //首次展示搜索结果                    
               this._initRespopPanel(data);
               this._initResEvts(data);

            } else{ //分页更新内容
                this._container.find(".searchTableContainer").html(reshtml);
                this._container.find(".searchTableContainer").find(".mscrollbar").mCustomScrollbar({ theme: "minimal-dark" });
                this._container.find(".searchTableContainer").find("table tr").on("click",function(event){self._clickRowEvt(event);});   
            }

        },

        getResTableHtml:function(data){
            var html = [];
            var listinfo = data.msg.shipList || data.msg["shipList "];
            html.push('<div class="mscrollbar"><table>');
            for (var i=0,len=listinfo.length;i<len;i++){
                var onetarget=this.convertOneTargetFromObj(listinfo[i]);    
                var num = onetarget.num;
                var mode = onetarget.mode;
                if(this.data.type === 1) var tdtext='MMSI:'+onetarget.mmsi;
                else if(this.data.type === 5) var tdtext='IMO:'+onetarget.imo;
                else if(this.data.type === 2) var tdtext='呼号:'+onetarget.cs;
                else if(this.data.type === 4) var tdtext='船名:'+onetarget.name;
                else if(this.data.type === 3) var tdtext='批号:'+onetarget.num;
                html.push('<tr data-id="'+num+'" data-mode="'+mode+'"><td>'+tdtext+'</td></tr>');
            }
            html.push('</table></div>');
            return html.join("");
        },
        
        _initRespopPanel:function(data){
            var options = {
                title:'搜索结果('+ data.msg.total +'条)',
                width:290,
                height:280,
                left:168,
                top:60
            };
            options.contentHTML = this._container = $(this.getResContentHtml(data));
            this._respopPanel =  new L.ICT.PopPanel(options).show();
            this._respopPanel.on("popPanelRemove",function(){
                this._container = null;
                this._respopPanel = null;
                this.ictmap.realtarget.clearLocatLyr();
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
           this._container.find(".mscrollbar").mCustomScrollbar({ theme: "minimal-dark" }); 
                         
        },   

        getResContentHtml:function(data){
            var html = [];
            html.push('<div class="searchResContainer">');
            html.push('<div class="searchTableContainer" >');
            html.push(this.getResTableHtml(data));
            html.push('</div>');
            html.push('<div class="pageContainer"></div>');
            html.push('</div>');
            return html.join("");

        },                    

        convertOneTargetFromObj:function(oneinfo){
            var onetarget={};
            onetarget.mmsi=oneinfo.mmsi;
            onetarget.imo=oneinfo.imo;
            onetarget.cs=oneinfo.cs.replace(/@/g,'') || '未知'; //呼号
            onetarget.name=oneinfo.sn;
            onetarget.num=oneinfo.num;
            onetarget.mode=oneinfo.mode;
            return onetarget;

        },  

        _clickRowEvt:function(e){
            $(e.currentTarget).addClass("active").siblings().removeClass("active");
            var shipid = $(e.currentTarget).data("id"); 
            var mode = $(e.currentTarget).data("mode");                
            var data = {};
            data.shipid = shipid;
            data.mode = Project_ParamConfig.CurrentMode===0 ? 0 : mode;  //融合模式下始终传0,后台没有对融合模式下的值做设置，需要前端设置
            this.ictmap.realtarget.locateShip(data);
        }

     })

  });
});