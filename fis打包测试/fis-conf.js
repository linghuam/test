// fis.match('*', {
//   deploy: fis.plugin('local-deliver', {
//     to: 'D:\\Program Files\\Apache Software Foundation\\Tomcat 8.5\\webapps\\fis_test'
//   })
// });

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