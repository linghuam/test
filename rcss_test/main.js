require.config({   
    urlArgs:'v0.1', //版本号，加入版本号后可以在更新版本时实时更新
    baseUrl:'./',   
    map:{'*':{'css':'css'}},
    paths: {
    	funce:'func/e'
    },
    shim: {
    	funce:{ deps: ['css!css/e','css!css/f']}
    }
});

require(['core/a','core/b'],function(){
	console.log('-------------start----------------');
	require(['func/c','func/d','funce'],function(){
		console.log('-------------end----------------');
	});
});