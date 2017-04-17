require([
	'css!../library/bootstrap/css/bootstrap',
	'css!../themes/css/func.user',
	'jquery',
	'plugins/jqueryi18n'
],function(){
      var lang = window.localStorage.getItem("language") || 'zh';
       var  $username = $(".username");
       var  $email = $(".email");
       var  $error = $(".login_error");
       var emailPattern = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@(([0-9a-zA-Z])+([-\w]*[0-9a-zA-Z])*\.)+[a-zA-Z]{2,9})$/;
    
       $username.focus();

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
                $(".forgetpsw_title").html($.i18n.prop('forgetpsw_title'));
                $(".forgetpsw_title_reminder").html($.i18n.prop('forgetpsw_title_reminder'));
                $(".forgetpsw_username_placeholder").attr("placeholder",$.i18n.prop('forgetpsw_username_placeholder'));
                $(".forgetpsw_email_placeholder").attr("placeholder",$.i18n.prop('forgetpsw_email_placeholder'));
                $(".forgetpsw_okbtn").html($.i18n.prop('forgetpsw_okbtn'));                

            }
       });        

      $("body").on('keydown',function(e){
          var e = e || window.event;
          if (e.keyCode === 13) {
             $(".login_btn_div").click();
          }

       });

       $(".login_btn_div").on("click",function(){
          var username = $username.val();
              username = $.trim(username);
          var email = $email.val();
              email = $.trim(email);
           $error.text('');
           if(username === ''){
              $(".error_username").text($.i18n.prop('forgetpsw_username_error'));
              $username.focus();
           } else if(email === ''){
              $(".error_email").text($.i18n.prop('forgetpsw_email_error1'));
              $email.focus();
           } else if(!emailPattern.test(email)){
              $(".error_email").text($.i18n.prop('forgetpsw_email_error2'));
           } else {
                var url = Project_ParamConfig.userConfig.forgetpswUrl;
                var data = {
                   userName:username,
                   emailAddress:email
                };
                $.ajax({
                    url:url,
                    data:data,
                    method:'POST',
                    dataType:'JSON',
                    success:function(res){
                       if(res.state !== 1){
                          // console.error(res.msg.result);
                          // $(".error_email").text('邮箱和用户名不匹配！');
                          $(".error_email").text($.i18n.prop('forgetpsw_res_error'));
                          
                       } else {
                          $(".msg").text($.i18n.prop('forgetpsw_res_success'));
                       }
                    },
                    error:function(error){
                          $(".error_email").text($.i18n.prop('forgetpsw_res_error'));
                    }
                });               
           }
       });
});