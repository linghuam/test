define("util/dialog",["leaflet","core/namespace"],function(e){e.ICT.Util.Dialog=e.Class.extend({_body:'<div class="modal fade" id="modal-dialog"><div class="modal-dialog modal-sm"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button><h5 class="modal-title" id="modal-title">标题</h5></div><div class="modal-body"><img class="infoImg" src="themes/images/dialog/error.png" style="width:30px;height:30px;"><p id="modal-text">内容</p></div><div class="modal-footer"><button type="button" class="btn btn-primary common_btn_ok" id="modal-todo">确认</button><button type="button" class="btn btn-primary common_btn_cancel" data-dismiss="modal" id="modal-close">取消</button></div></div></div></div>',_container:null,initialize:function(){this._container=e.DomUtil.create("div","",document.body),this._container.innerHTML=this._body,this._setCss(),e.DomEvent.addListener(e.DomUtil.get("modal-close"),"click",function(){this._close()},this)},alert:function(e,t){this._setClose(!1),this._setDialog(e,t),this._setImg(null),this._show(),$("#modal-todo").unbind(),$("#modal-todo").bind("click",this,function(e){e.data._close()})},success:function(e,t){this._setClose(!1),this._setDialog(e,t),this._setImg("success"),this._show(),$("#modal-todo").unbind(),$("#modal-todo").bind("click",this,function(e){e.data._close()})},error:function(e,t){this._setClose(!1),this._setDialog(e,t),this._setImg("error"),this._show(),$("#modal-todo").unbind(),$("#modal-todo").bind("click",this,function(e){e.data._close()})},warn:function(e,t){this._setClose(!1),this._setDialog(e,t),this._setImg("warn"),this._show(),$("#modal-todo").unbind(),$("#modal-todo").bind("click",this,function(e){e.data._close()})},confirm:function(e,t,n){this._setClose(!0),this._setDialog(e,t),this._setImg(null),this._show(),$("#modal-todo").unbind(),$("#modal-todo").bind("click",this,function(e){e.data._close(),n()}),$("#modal-close").bind("click",this,function(e){e.data._close()})},_setImg:function(e){var t=$(this._container).find(".infoImg");e==="success"?t.attr("src","themes/images/dialog/success.png"):e==="error"?t.attr("src","themes/images/dialog/error.png"):e==="warn"?t.attr("src","themes/images/dialog/warn.png"):t.remove()},_setCss:function(){$(this._container).find(".modal-dialog").css({margin:"260px auto"}),$(this._container).find(".modal-header").css({padding:"5px","text-align":"center",color:"#fff","background-color":"#1c5da9"}),$(this._container).find(".modal-header button span").css({"font-size":"16px",color:"#fff","line-height":"20px"}),$(this._container).find(".modal-body").css({"text-align":"center"}),$(this._container).find(".modal-body p").css({"font-size":"16px","font-weight":"500",margin:"5px"}),$(this._container).find(".modal-footer").css({"text-align":"center",padding:"5px",border:"none"}),$(this._container).find(".modal-footer .btn").css({})},_close:function(){$("#modal-dialog").modal("hide")},_show:function(){$("#modal-dialog").find(".common_btn_ok").html($.i18n.prop("common_btn_ok")),$("#modal-dialog").find(".common_btn_cancel").html($.i18n.prop("common_btn_cancel")),$("#modal-dialog").modal("show")},_setDialog:function(t,n){e.DomUtil.get("modal-title").innerHTML=t,e.DomUtil.get("modal-text").innerHTML=n},_setClose:function(t){t==1?e.DomUtil.get("modal-close").style.display="":e.DomUtil.get("modal-close").style.display="none"}})});