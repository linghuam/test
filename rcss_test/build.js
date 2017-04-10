// ({
//   appDir: 'www',
//   dir: 'www-built',
//   baseUrl: '.',
//   fileExclusionRegExp: /(^example)|(.git)|(node_modules)|(bower_components)$/,
//   //separateCSS: true,
//   //buildCSS: false,
//   optimizeCss: "none",
//   map: {
//     '*': {
//       css: 'require-css/css'
//     }
//   },
//   modules: [
//   {
//     name: 'app',
//     exclude: ['app/core-components'],
//   },
//   {
//     name: 'app/core-components',
//     create: true,
//     include: ['components/component'], 
//     exclude: ['require-css/normalize']
//   },
//   {
//     name: 'popup',
//     exclude: ['app/core-components', 'require-css/normalize']
//   }
//   ]
//   //name: 'app.js',
//   //out: 'app-built.js'
// })

//项目构建文件
//node r.js -o build.js
({ 
appDir: './',   //项目根目录
dir: './dist',  //输出目录，全部文件打包后要放入的文件夹（如果没有会自动新建的）
 baseUrl: '.',   //相对于appDir，代表要查找js文件的起始文件夹，下文所有文件路径的定义都是基于这个baseUrl的
 map:{'*':{'css':'css'}},
modules: [                      //要优化的模块
    { name:'main'}  //说白了就是各页面的入口文件，相对baseUrl的路径，也是省略后缀“.js”
], 

fileExclusionRegExp: /^(r|build)\.js|.*\.scss$/,    //过滤，匹配到的文件将不会被输出到输出目录去

optimizeCss: 'standard', 

removeCombined: true,   //如果为true，将从输出目录中删除已合并的文件

paths:{
  'corea':'core/a',
  'coreb':'core/b',
  'funcc':'func/c',
  'funcd':'func/d',
  'funce':'func/e'
},

shim: {
  'funcc':{ deps: ['css!css/c']},
  'funcd':{deps:['css!css/d']},
  'funce':{ deps: ['css!css/e','css!css/f']}
}
}) 