# Vue 项目升级到 webpack4.x 小纪【附完整升级后代码】

自 webpack 4.x 发布以来，就独得码农恩宠。我公司的项目是基于 webpack 3.x 版本的 vue 项目，
当时是用 vue-cli 工具构建的项目，项目开发完成后发现打包性能低下，而且项目是多页面的，需要将
打包文件分离，webpack 原有的 `CommonsChunkPlugin` 插件难以满足需要，想用 `SplitChunksPlugin`
替换它，于是开始了折磨人的升级过程。

现将自己的升级过程记录如下，希望能给需要升级 vue 项目的朋友一点参考价值。

## 第一步：用 [vue-cli](https://www.npmjs.com/package/vue-cli) 工具创建一个简单的 vue webpack 项目

```bash
vue init webpack vue-webpack4-v2
```

打开 `package.json` 文件，查看 webpack 版本信息, 发现 webpack 还是 3.x 版本

```json
    "webpack": "^3.6.0",
    "webpack-bundle-analyzer": "^2.9.0",
    "webpack-dev-server": "^2.9.1",
    "webpack-merge": "^4.1.0"
```

## 第二步： 升级 npm 包

由于要升级的包很多，一个个操作起来麻烦，所以建议用[npm-check](https://www.npmjs.com/package/npm-check)工具来检查和更新包版本。

由于手动更新太麻烦，可以运行 `npm-check -u` 命令批量更新 npm 包
 
需新增的包：
- "webpack-cli": "^3.1.0"
- "mini-css-extract-plugin": "^0.4.1"

需删除的包（webpack 配置中引用该包的插件也要删除）:
- "extract-text-webpack-plugin": "^3.0.0"
- "uglifyjs-webpack-plugin": "^1.1.1"
- "optimize-css-assets-webpack-plugin": "^5.0.0"

注意：
- "eslint": "^5.3.0" 版本号不宜太高，改成 "^4.0.0"

## 第三步： webpack 配置升级

参考官方升级文档 [To v4 from v3](https://webpack.js.org/migrate/4/)

主要修改 `build/webpack.xxx.conf.js` 文件

## 第四步：vue-loader 配置升级

参考官方升级文档 [从 v14 迁移](https://vue-loader.vuejs.org/zh/migrating.html#%E5%80%BC%E5%BE%97%E6%B3%A8%E6%84%8F%E7%9A%84%E4%B8%8D%E5%85%BC%E5%AE%B9%E5%8F%98%E6%9B%B4)

主要修改 `build/vue-loader.conf.js` 和 `build/webpack.xxx.conf.js` 文件

注意：
- 去除掉 `build/webpack.prod.conf.js` 中的 `OptimizeCSSPlugin` 插件

## 总结



经过上面四步，基本上能将项目成功运行了，但自己能力有限，有些配置的原理也似懂非懂，但成长的过程就是要敢于不断的
失败和尝试，这样才能一步步从陌生到熟悉。