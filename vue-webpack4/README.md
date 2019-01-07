# vue-webpack4

> A Vue.js project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).


# Vue 项目升级小纪

## step1

npm-check -u 更新 npm 包

## step2 

[webpack升级](https://webpack.js.org/migrate/4/)

[vue-loader升级](https://vue-loader.vuejs.org/zh/migrating.html#%E5%80%BC%E5%BE%97%E6%B3%A8%E6%84%8F%E7%9A%84%E4%B8%8D%E5%85%BC%E5%AE%B9%E5%8F%98%E6%9B%B4)


## step3

CommonsChunkPlugin => splitChunks

ExtractTextPlugin => MiniCssExtractPlugin

OptimizeCSSPlugin 删除


# 参考

- [Vue项目升级到Webpack 4.x初步踩坑总结](https://blog.csdn.net/harsima/article/details/80819747)