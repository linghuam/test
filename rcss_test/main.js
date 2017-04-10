// require.config({   
//     urlArgs:'v0.1', //版本号，加入版本号后可以在更新版本时实时更新
//     baseUrl:'./',   
//     map:{'*':{'css':'css'}},
//     paths: {
//       'corea':'core/a',
//       'coreb':'core/b',
//       'funcc':'func/c',
//       'funcd':'func/d',
//       'funce':'func/e'
//     },
//     shim: {
//       'funcc':{ deps: ['css!css/c']},
//       'funcd':{deps:['css!css/d']},
//       'funce':{ deps: ['css!css/e','css!css/f']}
//     }
// });

require(['corea','coreb','funcc','funcd','funce'],function(){ //,'funcc','funcd','funce'
	// console.log('-------------start----------------');
	// require(['funcc','funcd','funce'],function(){
	// 	console.log('-------------end----------------');
	// });
});