/**
 *修改密码
 */
define("func/changepsw",[
    "leaflet",
    "func/base",
    "data/ajax"

],function(L){


    L.ICT.Func.add("ChangePsw",{

        Class: L.Class.extend({

            initialize:function(){
                this._container = null;
                this._popPanel = null;
                this.ajax = new L.ICT.Ajax();
                this.sessionStorage = L.ict.app.sessionStorage;
                this.dialog = L.ict.app.util.dialog;  
                this.config = Project_ParamConfig.userConfig;
            },

            start:function(){
                if(this._popPanel || this._container) return;
                this._initUi();
                this._bindEvts();
            },

            stop:function(){
                if(this._popPanel) this._popPanel.remove();
                this._container = null;
                this._popPanel = null;
            },

            _initUi:function(){
                var options = {
                    title:$.i18n.prop('changepsw_title'),
                    width:486,
                    height:338,
                    ismodal:true
                };
                var content = this._container = $(this.getContentHtml());
                options.contentHTML = content;
                amendPop = this._popPanel =  new L.ICT.PopPanel(options);
                amendPop.show();
                this._popPanel.on("popPanelRemove",function(){
                    this._container = null;
                    this._popPanel = null;
                },this);                            

            },

            getContentHtml:function(){
                var html = [];
                html.push('<div class="amendContainer">');
                html.push('     <div class="text-center amend_input"><span class="amend_font changepsw_oldpsw">原密码:</span><input type="password"  id="old_password" autocomplete="off"/><span  class="amend_font"></span><span class=" login_error oldPsd_prompt"></span></div>');
                html.push('     <div class="text-center amend_input"><span class="amend_font changepsw_newpsw">新密码:</span><input type="password"  id="new_password" autocomplete="off"/><span  class="amend_font"></span><span class="login_error newPsd_prompt"></span></div>');
                html.push('     <div class="text-center amend_input"><span class="amend_font changepsw_confirmpsw">确认密码:</span><input type="password" id="again_new_password"  autocomplete="off"/><span  class="amend_font"></span><span class="login_error again_newPsd_prompt"></span></div>');
                html.push('     <div class="text-center "><button class="btn amend_confirm_btn changepsw_okbtn">确定</button><button class="btn amend_cancel_btn changepsw_cancelbtn">取消</button></div>');
                html.push('</div>');
                return html.join("");
            },

            _bindEvts:function() {
                var _this = this;      
                 _this._container.find("#old_password").focus();
                //中英文
                 _this._container.find(".changepsw_oldpsw").html($.i18n.prop('changepsw_oldpsw'));
                 _this._container.find(".changepsw_newpsw").html($.i18n.prop('changepsw_newpsw'));
                 _this._container.find(".changepsw_confirmpsw").html($.i18n.prop('changepsw_confirmpsw'));
                 _this._container.find(".changepsw_okbtn").html($.i18n.prop('changepsw_okbtn'));
                 _this._container.find(".changepsw_cancelbtn").html($.i18n.prop('changepsw_cancelbtn'));

                //确定         
                _this._container.find(".amend_confirm_btn").on("click",function(e){
                    $('.oldPsd_prompt').html('');
                    $('.newPsd_prompt').html('');
                    $('.again_newPsd_prompt').html('');
                    var uPsdReg=/^[a-zA-Z0-9]{6,12}$/;

                   var Opsd = _this._container.find("#old_password").val();
                       Opsd = $.trim(Opsd);
                   var Npsd =_this._container.find("#new_password").val();
                       Npsd = $.trim(Npsd); 
                   var AgainNpsd =_this._container.find("#again_new_password").val();
                       AgainNpsd = $.trim(AgainNpsd);

                    if(Opsd == ''){
                        $('.oldPsd_prompt').html($.i18n.prop('changepsw_error_oldpsw'));
                    }else if( Npsd == ''){
                        $('.newPsd_prompt').html($.i18n.prop('changepsw_error_newpsw'));
                    }else if(!uPsdReg.test(Npsd)){
                        $('.newPsd_prompt').html($.i18n.prop('changepsw_error_newpsw2'));
                    }else if(AgainNpsd == ''){
                        $('.again_newPsd_prompt').html($.i18n.prop('changepsw_error_confirmpsw'));
                    }else if(AgainNpsd !== Npsd){
                        $('.again_newPsd_prompt').html($.i18n.prop('changepsw_error_confirmpsw2'));
                    }else {
                        var userinfo = _this.sessionStorage.getItem("userInfo");
                        var url = _this.config.modifypswUrl;
                        var amend = {};                        
                        amend.id = userinfo.userId;
                        amend.oldPassWord = Opsd;
                        amend.newPassWord = Npsd;
                        _this.ajax.post(url,amend,true,_this,_this._ajaxSucCallback,_this._ajaxFaiCallback);
                    }

                });

                //取消
                _this._container.find(".amend_cancel_btn").on("click",function(){
                   _this.stop();
                });
            },

            _ajaxSucCallback:function(res){
                if(res.state === 1) {                                     
                   this.dialog.alert($.i18n.prop('dialog_alert_title'),$.i18n.prop('changepsw_res_success'));
                   this.stop();
                }else if(res.state === 10031){
                    $('.oldPsd_prompt').html($.i18n.prop('changepsw_res_error1'));
                } else{
                     $('.oldPsd_prompt').html($.i18n.prop('changepsw_res_error'));
                }
            },

            _ajaxFaiCallback:function(res){
                $('.oldPsd_prompt').html($.i18n.prop('changepsw_res_error'));
            }
        })

    });

});
