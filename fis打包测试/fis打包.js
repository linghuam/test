fis打包

## 构建
fis-conf.js

fis3 release -d <path>
fis3 release -d ./output
fis3 release -d ../dist

## 查看文件命中属性情况
fis3 inspect

## 常用属性
useHash:true

//【构建】
//fis3 release -d ./output
//不指定 -d 参数时，构建结果被发送到内置 Web Server 的根目录下。此目录可以通过执行以下命令打开。
//fis3 server open

//【发布】
//fis3 release  //不加 -d 参数默认被发布到内置 Web Server的根目录下，当启动服务时访问此目录下的资源。

//【启动】
// fis3 server start //启动本地server
// fis3 server -h //得到更多启动参数

//【替代内置server】
// fis3 release -d D:\Program Files\Apache Software Foundation\Tomcat 8.5\webapps
//或
//fis3 release 
// fis.match('*', {
//   deploy: fis.plugin('local-deliver', {
//     to: 'D:\\Program Files\\Apache Software Foundation\\Tomcat 8.5\\webapps\\test'
//   })
// });

//【文件指纹】
fis.match('*.{js,css,png}',{
	useHash:true
});

//【压缩资源】
// 清除其他配置，只保留如下配置
fis.match('*.js', {
  // fis-optimizer-uglify-js 插件进行压缩，已内置
  optimizer: fis.plugin('uglify-js')
});

fis.match('*.css', {
  // fis-optimizer-clean-css 插件进行压缩，已内置
  optimizer: fis.plugin('clean-css')
});

fis.match('*.png', {
  // fis-optimizer-png-compressor 插件进行压缩，已内置
  optimizer: fis.plugin('png-compressor')
});

//【CssSprite图片合并】
// 启用 fis-spriter-csssprites 插件
fis.match('::package', {
  spriter: fis.plugin('csssprites')
});
//对css进行图片合并
fis.match('*.css',{
	useSprite:true
});

//【功能组合】
// 加 md5
fis.match('*.{js,css,png}', {
  useHash: true
});

// 启用 fis-spriter-csssprites 插件
fis.match('::package', {
  spriter: fis.plugin('csssprites')
});

// 对 CSS 进行图片合并
fis.match('*.css', {
  // 给匹配到的文件分配属性 `useSprite`
  useSprite: true
});

fis.match('*.js', {
  // fis-optimizer-uglify-js 插件进行压缩，已内置
  optimizer: fis.plugin('uglify-js')
});

fis.match('*.css', {
  // fis-optimizer-clean-css 插件进行压缩，已内置
  optimizer: fis.plugin('clean-css')
});

fis.match('*.png', {
  // fis-optimizer-png-compressor 插件进行压缩，已内置
  optimizer: fis.plugin('png-compressor')
});

//fis3 release debug 启用 media debug 的配置，覆盖上面的配置，把诸多功能关掉。
fis.media('debug').match('*.{js,css,png}', {
  useHash: false,
  useSprite: false,
  optimizer: null
});