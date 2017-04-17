require([	
	'jquery',
	'plugins/jqueryi18n'
],function(){

        var lang = window.localStorage.getItem("language") || 'zh';
        var $msg = $(".active_success_msg");

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
                $msg.html($.i18n.prop('active_success_msg'));
                $(".active_success_title").html($.i18n.prop('active_success_title'));
            }
       }); 
});