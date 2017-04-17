require([
	'css!../library/bootstrap/css/bootstrap',
	'css!../themes/css/func.user',
	'jquery',
	'plugins/jqueryi18n'
],function(){
	    var lang = window.localStorage.getItem("language") || 'zh';
        var $loginError = $(".login_error");
        var $usernameError = $(".username_error");
        var $pswError = $(".psw_error");
        var $username = $(".username");
        var $psw = $(".psw");
        var $loginBtn = $(".login_btn_div");

        //中英文对照
        lang === 'zh' ?  '' : lang;
        $.i18n.properties({
            name:'strings', // 资源文件名称
            path:'../languages/', // 资源文件路径
            mode:'both', //vars map both
            language:lang, //ISO-639 指定的语言编码（如：“en”表示英文、“zh”表示中文）
            cache:false, 
            checkAvailableLanguages: true,
            async: true,
            callback:function(){
                $(".userlogin_title").html($.i18n.prop('userlogin_title'));
                $(".userlogin_title_welcom").html($.i18n.prop('userlogin_title_welcom'));
                $(".userlogin_username_placeholder").attr("placeholder",$.i18n.prop('userlogin_username_placeholder'));
                $(".userlogin_psw_placeholder").attr("placeholder",$.i18n.prop('userlogin_psw_placeholder'));
                $(".userlogin_forgetpsw").html($.i18n.prop('userlogin_forgetpsw'));
                $(".userlogin_login_button").html($.i18n.prop('userlogin_login_button'));
                $(".userlogin_enroll_a").html($.i18n.prop('userlogin_enroll_a'));                

            }
        }); 
    
        $username.focus();
        
        //回车键
        $("body").on('keydown',function(e){
            var e = e || window.event;
            if (e.keyCode === 13) {
               $loginBtn.click();
            }

        });
        
        //登录按钮
        $(".login_btn_div").on("click",function(){
            var username = $.trim($username.val());
            var psw = $.trim($psw.val());

            $loginError.text('');

            if(username === ''){
               $usernameError.text($.i18n.prop('userlogin_username_error'));
               $username.focus();
               return;
            }
            if(psw === ''){
                $pswError.text($.i18n.prop('userlogin_psw_error'));
                $psw.focus();
                return ;
            }

            var url = Project_ParamConfig.userConfig.loginUrl;
            var data = {
                userName:username,
                passWord:psw
            };             
            $.ajax({
                url:url,
                data:data,
                method:'POST',
                dataType:'JSON',
                success:function(res){
                    if(res.state === 10020 || res.state === 10021){
                        $pswError.text($.i18n.prop('userloing_result_error_1'));  
                    }else if(res.state === 10022){
                        $pswError.text($.i18n.prop('userloing_result_error_2')); 
                    } else if(res.state === 1){
                        var userInfo = {};
                        userInfo.userName = res.msg.userName;
                        userInfo.userId = res.msg.id;
                        userInfo.ifActive=res.msg.ifActive;
                        userInfo.emailAddress=res.msg.emailAddress;
                        userInfo = JSON.stringify(userInfo);
                        window.sessionStorage.setItem("userInfo",userInfo); 
                        window.location.href = "../index.html";                        
                    } else{
                       $pswError.text($.i18n.prop('userloing_result_error_3'));  
                    }
                },
                error:function(error){
                    $pswError.text($.i18n.prop('userloing_result_error_3'));  
                }

            })

        });

});