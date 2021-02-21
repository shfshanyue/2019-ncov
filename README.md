# 新型冠状病毒疫情实时动态省市地图

> 武汉加油，众志成城，共抗疫情

这是fork自[shfshanyue/2019-ncov](https://github.com/shfshanyue/2019-ncov)的项目，主要修复了丁香园页面参数修改后原代码运行报错的问题。


## 快速开始

``` bash
# 获取数据
$ node scripts/build-origin.js

$ npm start
```

## 部署

使用 `github actions` 与 `alioss` 自动部署，使用 `github actions` 的定时任务每半个小时部署一次(为了获取最新数据)。

关于部署可以参考以下两篇文章

+ [使用 AliOSS 部署及加速你的静态网站](https://github.com/shfshanyue/you-dont-need-vps/blob/master/deploy-fe-with-alioss.md)
+ [github actions 持续集成简介及实践](https://github.com/shfshanyue/you-dont-need-vps/blob/master/github-action-guide.md)

## 数据来源

数据爬自丁香园，使用脚本 `build-origin.js` 获取数据。数据每半个小时爬取一次，直接注入到前端，因此对丁香园造成的压力很小。

另外，如果你需要更详细的数据，可以参考项目 [BlankerL/DXY-2019-nCoV-Crawler](https://github.com/BlankerL/DXY-2019-nCoV-Crawler)。

## 截图

<img src="./public/screen.png">

