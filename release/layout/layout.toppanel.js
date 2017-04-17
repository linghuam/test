define("layout/toppanel",["leaflet","layout/base","core/namespace","func/userLogin","func/keysearch","func/languages","func/jrtx"],function(e){e.ICT.Layout.TopPanel=e.ICT.Layout.extend({tempHtml:'<nav  class="navbar navbar-default" role="navigation"><div class="container-fluid navbar-container"><div class="navbar-header"><img class="navbar-header-title" src="themes/images/frame/title_logo.png" alt=""/><label class="toppanel_left_title" style="font-size:18px;"></label></div><div class="collapse navbar-collapse"><form class="navbar-form navbar-left" role="search" onsubmit="return false;"><div class="form-group"><input type="text" class="form-control input-md toppanel_keysearch_remind" id="search_key" autocomplete="off"/><img src="themes/images/frame/title_search_btn.png" class="searchHander toppanel_keysearch_title"><select class="searchType"></select></div></form><ul class="nav navbar-nav navbar-right"><li class="eventRemind"><label class="toppanel_right_eventRemind"></label></li><li class="layerSelect"><label class="toppanel_right_layerSelect"></label>:&nbsp;&nbsp;<select class="layerSelectctr"></select></li><li class="languageSet"><label class="toppanel_right_langSetting"></label>:&nbsp;&nbsp;<select class="languageSetting"></select></li><li class="topmenubtn userlogin login_btn"><img src="themes/images/frame/title_exit.png">&nbsp;&nbsp;<label class="toppanel_right_login"></label></li><li class="topmenubtn userlogin enroll_btn"><img src="themes/images/frame/enroll.png">&nbsp;&nbsp;<a class="toppanel_right_enroll" href="userpages/enroll.html" target="_self"></a></li><li class="dropdown topmenubtn userlogin_after" style="display:none;">  <a href="#" class="dropdown-toggle" data-toggle="dropdown" style="display:inline;">    <img src="themes/images/frame/title_exit.png">&nbsp;&nbsp;    <label class="userName_txt"></label>  </a>  <ul class="dropdown-menu" role="menu">    <li class="userlogin_after_exitlogin"><a class="toppanel_right_signout" href="#"></a></li>    <li class="userlogin_after_changepsw"><a class="toppanel_right_changepsw" href="#"></a></li>  </ul></li></ul></div></div></nav>',_fullscreen:!1,initialize:function(){e.ICT.Layout.prototype.initialize.call(this),this.id="topPanel",this._container=$("#toppanel"),this._container.html(this.tempHtml),this._initUi(),this._bindEvts()},_initUi:function(){var e=[];for(var t=0,n=Project_ParamConfig.SearchConfig.searchOptions.length;t<n;t++){var r=Project_ParamConfig.SearchConfig.searchOptions[t];Project_ParamConfig.lang==="zh"?e.push('<option value="'+r.key+'">'+r.value+"</option>"):e.push('<option value="'+r.key+'">'+r.value_en+"</option>")}e=e.join(""),this._container.find(".searchType").html(e);var i=[];for(var t=0,n=Project_ParamConfig.layerSelect.length;t<n;t++){var r=Project_ParamConfig.layerSelect[t];Project_ParamConfig.lang==="zh"?i.push('<option value="'+r.key+'">'+r.value+"</option>"):i.push('<option value="'+r.key+'">'+r.value_en+"</option>")}i=i.join(""),this._container.find(".layerSelectctr").html(i)},_bindEvts:function(){var t=this;t._container.find(".navbar-left .searchHander").on("click",function(e){t.search(e)}),$("#search_key").on("keydown",function(n){var n=n||window.event;e.DomEvent.stopPropagation(n),n.keyCode===13&&t.search(n)}),t._container.find(".login_btn").on("click",function(t){e.ICT.Func.UserLogin.run()}),t._container.find(".eventRemind").on("click",function(t){e.ICT.Func.jrtx.run()}),t._container.find(".searchType").on("change",function(e){var n=$(this).val();n==="1"?t._container.find(".toppanel_keysearch_remind").attr("placeholder",$.i18n.prop("func_keysearch_ship_plh")):t._container.find(".toppanel_keysearch_remind").attr("placeholder",$.i18n.prop("func_keysearch_port_plh"))}),t._container.find(".layerSelectctr").on("change",function(t){var n=$(this).val();e.ict.app.ictmap.realtarget.changeShipDistLayer(n)})},search:function(t){var n={};n.searchText=this._container.find("#search_key").val().trim(),n.searchType=this._container.find(".navbar-left .searchType").val();var r=e.ICT.Func.KeySearch.getInstance();r.start(n)},show:function(){this.setVisible(!0)},hide:function(){this.setVisible(!1)}})});