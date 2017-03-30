define("func/keysearch",["leaflet","func/base","data/ajax","plugins/mcscroll","control/paging","control/panel"],function(t){t.ICT.Func.add("KeySearch",{Class:t.Class.extend({initialize:function(){this.dialog=t.ict.app.util.dialog,this.ajax=new t.ICT.Ajax,this.config=Project_ParamConfig.SearchConfig,this.ictmap=t.ict.app.ictmap,this.perPageCount=20,this._respopPanel=null,this._container=null},start:function(t){if(this.stop(),this.param=t,""==this.param.searchText)return void this.dialog.alert("提示","请输入搜索关键字");var a=this.param.searchType;switch(a){case"MMSI":a=1;break;case"呼号":a=2;break;case"批号":a=3;break;case"船名":a=4;break;case"IMO":a=5}this.curPage=1,this.ajaxCount=0,this.data={type:a,num:this.param.searchText,mode:Project_ParamConfig.CurrentMode,pageid:this.curPage,pagecount:this.perPageCount},this.searchAjax(this.data)},stop:function(){this._respopPanel&&this._respopPanel.remove(),this._respopPanel=this._container=null,this.ictmap.realtarget.clearLocatLyr()},searchAjax:function(t){var a=this.config.url;this.ajax.post(a,t,!0,this,function(t){this.ajaxCount++,1!==t.state?this.dialog.alert("提示",t.msg.error):this.showSearchResult(t)},function(){this.ajaxCount++})},showSearchResult:function(t){var a=[],e=this;a=this.getResTableHtml(t),1==this.ajaxCount?(this._initRespopPanel(t),this._initResEvts(t)):(this._container.find(".searchTableContainer").html(a),this._container.find(".searchTableContainer").find(".mscrollbar").mCustomScrollbar({theme:"minimal-dark"}),this._container.find(".searchTableContainer").find("table tr").on("click",function(t){e._clickRowEvt(t)}))},getResTableHtml:function(t){var a=[],e=t.msg.shipList||t.msg["shipList "];a.push('<div class="mscrollbar"><table>');for(var i=0,n=e.length;n>i;i++){var s=this.convertOneTargetFromObj(e[i]),r=s.num,o=s.mode;if(1===this.data.type)var c="MMSI:"+s.mmsi;else if(5===this.data.type)var c="IMO:"+s.imo;else if(2===this.data.type)var c="呼号:"+s.cs;else if(4===this.data.type)var c="船名:"+s.name;else if(3===this.data.type)var c="批号:"+s.num;a.push('<tr data-id="'+r+'" data-mode="'+o+'"><td>'+c+"</td></tr>")}return a.push("</table></div>"),a.join("")},_initRespopPanel:function(a){var e={title:"搜索结果("+a.msg.total+"条)",width:290,height:280,left:168,top:60};e.contentHTML=this._container=$(this.getResContentHtml(a)),this._respopPanel=new t.ICT.PopPanel(e).show(),this._respopPanel.on("popPanelRemove",function(){this._container=null,this._respopPanel=null,this.ictmap.realtarget.clearLocatLyr()},this)},_initResEvts:function(a){var e=this,i={total:a.msg.max_page,count:5,present:this.curPage};i.pageChange=function(t){e.curPage=t,e.data.pageid=e.curPage,e.searchAjax(e.data)};var n=new t.ICT.Control.Paging(i);n.addTo(this._container.find(".pageContainer")[0]),this._container.find("table tr").on("click",function(t){e._clickRowEvt(t)}),this._container.find(".mscrollbar").mCustomScrollbar({theme:"minimal-dark"})},getResContentHtml:function(t){var a=[];return a.push('<div class="searchResContainer">'),a.push('<div class="searchTableContainer" >'),a.push(this.getResTableHtml(t)),a.push("</div>"),a.push('<div class="pageContainer"></div>'),a.push("</div>"),a.join("")},convertOneTargetFromObj:function(t){var a={};return a.mmsi=t.mmsi,a.imo=t.imo,a.cs=t.cs.replace(/@/g,"")||"未知",a.name=t.sn,a.num=t.num,a.mode=t.mode,a},_clickRowEvt:function(t){$(t.currentTarget).addClass("active").siblings().removeClass("active");var a=$(t.currentTarget).data("id"),e=$(t.currentTarget).data("mode"),i={};i.shipid=a,i.mode=0===Project_ParamConfig.CurrentMode?0:e,this.ictmap.realtarget.locateShip(i)}})})});