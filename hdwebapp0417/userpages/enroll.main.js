require([
	'css!../library/bootstrap/css/bootstrap',
	'jquery',
	'plugins/jqueryi18n'
],function(){

    var lang = window.localStorage.getItem("language") || 'zh';
    var $username = $("#inputusername");
    var $psw = $("#inputPassword");
    var $confirmpsw = $("#inputPasswordConfirm");
    var $email = $("#inputEmail");
    var $error = $(".enroll_error");
    var pswPattern =  /^[A-z0-9]{6,12}$/;
    var emailPattern = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@(([0-9a-zA-Z])+([-\w]*[0-9a-zA-Z])*\.)+[a-zA-Z]{2,9})$/;

    //中英文对照
    lang === 'zh' ?  '' : lang;
    $.i18n.properties({
        name:'strings', // 资源文件名称
        path:'../languages/', // 资源文件路径
        mode:'both', //vars map both
        language:lang, //ISO-639 指定的语言编码（如：“en”表示英文、“zh”表示中文）
        cache:false, 
        checkAvailableLanguages: true,
        async: false,
        callback:function(){
            $(".register_title").html($.i18n.prop('register_title'));
            $(".register_title_systemname").html($.i18n.prop('register_title_systemname'));
            $(".register_reminder").html($.i18n.prop('register_reminder'));          
            $(".register_username").html($.i18n.prop('register_username'));  
            // $(".register_username_placeholder").attr('placeholder',$.i18n.prop('register_username_placeholder'));  
            $(".register_psw").html($.i18n.prop('register_psw'));
            // $(".register_psw_placeholder").attr('placeholder',$.i18n.prop('register_psw_placeholder'));  
            $(".register_psw_confirm").html($.i18n.prop('register_psw_confirm'));  
            // $(".register_psw_confirm_placeholder").attr('placeholder',$.i18n.prop('register_psw_confirm_placeholder'));  
            $(".register_email").html($.i18n.prop('register_email'));   
            // $(".register_email_placeholder").attr('placeholder',$.i18n.prop('register_email_placeholder'));                                  
            $(".register_okbtn").html($.i18n.prop('register_okbtn'));                             
        }
    }); 
    
    $username.focus();

    $("body").on('keydown',function(e){
        var e = e || window.event;
        if (e.keyCode === 13) {
           $(".register_okbtn").click();
        }

    });

    $(".enroll_logo").on("click",function(){
        window.location.href = "../index.html";
    });

    $(".register_okbtn").on("click",function(){
        var username = $username.val();
            username = $.trim(username);
        var psw = $psw.val();
            psw = $.trim(psw);
        var confirmpsw = $confirmpsw.val();
            confirmpsw = $.trim(confirmpsw);
        var email = $email.val();
            email = $.trim(email);
        
        $error.html('&nbsp;');
        if(username === ''){
            $(".username_error_prompt").text($.i18n.prop('register_error_username')); 
             $username.focus();           
        } else if (psw === ''){
            $(".password_error_prompt").text($.i18n.prop('register_error_psw1'));
            $psw.focus();
        } else if(!pswPattern.test(psw)){
            $(".password_error_prompt").text($.i18n.prop('register_error_psw2'));
        } else if(confirmpsw == ''){
            $(".againPsd_error_prompt").text($.i18n.prop('register_error_psw3'));
            $confirmpsw.focus();
        }else if(psw !== confirmpsw){
            $(".againPsd_error_prompt").text($.i18n.prop('register_error_psw4'));
        } else if(email === ''){
            $(".email_error_prompt").text($.i18n.prop('register_error_email'));
            $email.focus();
        } else if(!emailPattern.test(email)){
            $(".email_error_prompt").text($.i18n.prop('register_error_email2'));
        } else {
            var url = Project_ParamConfig.userConfig.enrollUrl;
            var data = {
               userName:username,
               passWord:psw,
               emailAddress:email
            };           
            $.ajax({
                url:url,
                data:data,
                method:'POST',
                dataType:'JSON',
                success:function(res){
                   //用户名已存在
                   if(res.state === 10010){ 
                      $(".username_error_prompt").html($.i18n.prop('register_error_result1'));
                   } else if(res.state === 10101){
                      $(".email_error_prompt").html($.i18n.prop('register_error_result2'));
                   } else if(res.state === 10102){
                      $(".email_error_prompt").html($.i18n.prop('register_error_result3'));
                   }else if(res.state === 1){                         
                        $("input").val('');
                        // window.open('enrollsuccess.html?enrollemail='+email);  
                        $(".enrollres_error_prompt").html($.i18n.prop('register_success_msg',email));
                   }
                },
                error:function(error){
                    $(".email_error_prompt").html($.i18n.prop('register_error_result'));
                }
            });
        }

    });
});