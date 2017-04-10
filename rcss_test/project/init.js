require.config({   
    urlArgs:'v0.1', //版本号，加入版本号后可以在更新版本时实时更新
    baseUrl:'./',
    map:{'*':{'css':'css'}},
    paths: {
    	'func/e':'func/e'
    },
    shim: {
    	// 'func/e':{ deps: ['css!../css/e']}
    }
});

require(['core/a','core/b'],function(){
	console.log('-------------start----------------');
	require(['func/c','func/d','func/e'],function(){
		console.log('-------------end----------------');
	});
});