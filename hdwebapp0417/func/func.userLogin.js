/**
 *用户登录模块
 */
define("func/userLogin",[
    "leaflet",
    "func/base",
    "data/ajax",
    "func/changepsw"

],function(L){
    
    //登录界面为单独页面版本
    L.ICT.Func.add("UserLogin",{

        Class: L.Class.extend({

            initialize:function(){
                this.ajax = new L.ICT.Ajax();
                this.sessionStorage = L.ict.app.sessionStorage;   
                this.dialog = L.ict.app.util.dialog;             
            },

            start:function(){
                // window.open('userpages/login.html');
                window.location.href = 'userpages/login.html';
            },

            stop:function(){

            },

            afterLoginFunc:function(){
                var userInfo = this.sessionStorage.getItem("userInfo");
                $(".userName_txt").html(userInfo.userName);
                $(".userlogin").css("display","none");
                $(".userlogin_after").css("display","block");   
                this._initUserLoginAfterEvts();             
            },

            _initUserLoginAfterEvts:function(){  
                var self = this;
                //退出登录
                $(".userlogin_after_exitlogin").on("click",function(){
                    self.dialog.confirm($.i18n.prop('dialog_alert_title'),$.i18n.prop('func_userlogin_exit_confirm'),function(){
                        $(".userName_txt").html("");
                        $(".userlogin").css("display","block");
                        $(".userlogin_after").css("display","none");
                        self.sessionStorage.removeItem("userInfo");

                    });
                }); 
                
                //修改密码
                $(".userlogin_after_changepsw").on("click",function(){
                     // window.open('userpages/changepsw');
                     L.ICT.Func["ChangePsw"].run();
                });                             
            },

            isLogin:function(){
                return !!this.sessionStorage.getItem("userInfo");
            },

            alertLoginDialog:function(){
                if(this.isLogin()) return;
                if(this._loginpanel){
                    this._loginpanel.remove();
                    this._loginpanel = null;
                }
                var options = {
                    title:$.i18n.prop('dialog_alert_title'),
                    width:340,
                    height:140,
                    ismodal:true,
                    contentHTML:this.getContentHtml()
                };             
                var pop = this._loginpanel = new L.ICT.PopPanel(options);
                pop.show(); 

                // 中英文
                var $container = this._loginpanel.getContainer();   
                $container.find(".func_userlogin_remind1").html($.i18n.prop('func_userlogin_remind1')); 
                $container.find(".func_userlogin_remind2").html($.i18n.prop('func_userlogin_remind2')); 
                $container.find(".func_userlogin_remind3").html($.i18n.prop('func_userlogin_remind3')); 
                $container.find(".func_userlogin_remind4").html($.i18n.prop('func_userlogin_remind4')); 
                $container.find(".func_userlogin_remind5").html($.i18n.prop('func_userlogin_remind5')); 

                $container.find("label").css({
                    "font-weight":"normal",
                    "font-size":"14px"
                });
            },

            getContentHtml:function(){
                var html = [];
                html.push('<div class="row login_block_container">');                
                html.push('<div class="col-md-3"><img src="themes/images/dialog/error.png"></div>');
                html.push('<div class="col-md-9">');
                html.push('<label class="func_userlogin_remind1">该功能需要登录后才能操作！</label>');
                html.push('<br>');
                html.push('<label class="func_userlogin_remind2">请</label>&nbsp;<a href="userpages/login.html" target="_self" class="func_userlogin_remind3">登录</a>&nbsp;<label class="func_userlogin_remind4">或</label>&nbsp;<a href="userpages/enroll.html" target="_blank" class="func_userlogin_remind5">免费注册</a>');
                html.push('</div>');
                html.push('</div>');
                return html.join("");
            }

        })

    });

    //登录界面为弹框版本
    // L.ICT.Func.add("UserLogin",{

    //     Class: L.Class.extend({

    //         initialize:function(){
    //             this._container = null;
    //             this._popPanel = null;
    //             this.ajax = new L.ICT.Ajax();
    //             this.sessionStorage = L.ict.app.sessionStorage;   
    //             this.dialog = L.ict.app.util.dialog;             
    //         },

    //         start:function(){
    //             if(this._container || this._popPanel) return ;
    //             this._initUi();
    //             this._bindEvts();
    //             this._container.find("#login_username").focus();
    //         },

    //         stop:function(){
    //           if(this._popPanel) this._popPanel.remove();
    //           this._container = null;
    //           this._popPanel = null;
    //         },

    //         _initUi:function(){
    //             var options = {
    //                 title:'用&nbsp户&nbsp登&nbsp录',
    //                 width:486,
    //                 height:375,
    //                 ismodal:true
    //             };
    //             var content = this._container = $(this.getContentHtml());
    //             options.contentHTML = content;
    //             var pop = this._popPanel = new L.ICT.PopPanel(options);
    //             pop.show();
    //             this._popPanel.on("popPanelRemove",function(e){
    //                 this._popPanel = null;
    //                 this._container = null;
    //             },this)
    //         },

    //         getContentHtml:function(){
    //             var html = [];
    //             html.push('<div class="loginContainer">');
    //             html.push('    <div class="login_input_div"><input type="text" class="form-control" id="login_username" placeholder="请输入用户名" autocomplete="off"/> <p class="login_error username_error_prompt"></p> </div>  ');
    //             html.push('    <div class="login_input_div"><input type="password" class="form-control" id="login_password" placeholder="请输入密码" autocomplete="off"/> <p class="login_error password_error_prompt"></p> </div> ');
    //             html.push('    <div class="login_input_div"><input type="radio" checked disabled />记住密码<span class="text-right" style="float: right">忘记密码</span></div> ');
    //             html.push('    <div class="text-center login_input_div"><button  id="login_btn_div">&nbsp;登录</button></div> ');
    //             html.push('</div>');
    //             return html.join("");
    //         },

    //         _bindEvts:function() {
    //             var _this = this;
    //             var url=Project_ParamConfig.ServiceUrl+'userinfo/login.do';

    //             _this._container.find("#login_btn_div").on("click",function(e){
    //                 var login = {};
    //                 login.userName = _this._container.find("#login_username").val().trim();
    //                 login.passWord =_this._container.find("#login_password").val().trim();
    //                 login.userType=parseInt(_this._container.find("input[type=radio]:checked").val());
    //                 _this._container.find(".login_error").html("");
    //                 if(login.userName==''){
    //                     _this._container.find('.username_error_prompt').html('请输入用户名');
    //                 }else if(login.passWord==''){
    //                     _this._container.find('.password_error_prompt').html('请输入密码');
    //                 }else{
    //                     _this.ajax.post(url,login,true,_this,_this._ajaxSucCallback,_this._ajaxFaiCallback);
    //                 }

    //             })
    //         },

    //         _ajaxSucCallback:function(res){
    //             if(res.state == 1){
    //                 var userInfo = {};
    //                 userInfo.userName=res.msg.userName;
    //                 userInfo.firmName=res.msg.firmName;
    //                 userInfo.userType=res.msg.userType;
    //                 userInfo.userId=res.msg.id;
    //                 userInfo.emailAddress=res.msg.emailAddress;
    //                 this.sessionStorage.setItem("userInfo",userInfo); 

    //                 this.stop(); 
    //                 this.afterLoginFunc();              
    //                 // $(".userName_txt").html(userInfo.userName);
    //                 // $(".userlogin").css("display","none");
    //                 // $(".userlogin_after").css("display","block");
                   
    //                 // this._initUserLoginAfterEvts();

    //             }else{
    //                 this._container.find('.password_error_prompt').html(res.msg.result);
    //             }
    //         },

    //         _ajaxFaiCallback:function(res){
    //             console.error("登录请求失败！");
    //         },

    //         afterLoginFunc:function(){
    //             var userInfo = this.sessionStorage.getItem("userInfo");
    //             $(".userName_txt").html(userInfo.userName);
    //             $(".userlogin").css("display","none");
    //             $(".userlogin_after").css("display","block");   
    //             this._initUserLoginAfterEvts();             
    //         },

    //         _initUserLoginAfterEvts:function(){  
    //             var self = this;
    //             $(".userlogin_after_exitlogin").on("click",function(){
    //                 self.dialog.confirm("提示","确认退出登录吗？",function(){
    //                     $(".userName_txt").html("");
    //                     $(".userlogin").css("display","block");
    //                     $(".userlogin_after").css("display","none");
    //                     self.sessionStorage.removeItem("userInfo");

    //                 });
    //             }); 

    //             $(".userlogin_after_changepsw").on("click",function(){
    //                 L.ICT.Func["ChangePsw"].run();
    //             });                             
    //         }

    //     })

    // });

});