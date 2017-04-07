// fis3 release -d ../release

fis.match('*', {
  useHash: false,
  useSprite:false
});

fis.match('*.js', {
  optimizer: fis.plugin('uglify-js')
});

fis.match('*.css', {
  optimizer: fis.plugin('clean-css')
});

fis.match('*.png', {
  optimizer: fis.plugin('png-compressor')
});

//发布的时候忽略以下目录或文件
fis.set('project.ignore', [
  'documents/**',
  'node_modules/**',
  '.git/**',
  '.svn/**',
  'package.json',
  'fis-conf.js'
]);

// 启用相对路径插件
fis.hook('relative');

// 让所有文件，都使用相对路径。
fis.match('**', {
  relative: true
});