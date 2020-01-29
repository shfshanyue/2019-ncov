# 武汉肺炎疫情实时动态省市地图

> 众志成城，共抗疫情

在 [丁香园肺炎疫情实时动态](https://3g.dxy.cn/newh5/view/pneumonia?from=timeline) 中提供了疫情地图及实时权威新闻，但其中并没有省市地图。我在每天闭门不出为国家做贡献的同时，对疫情地图做了简单的扩展，旨在帮助大家更加直观了解自己家乡的情况。

以下是湖北疫情的截图

<img src="./public/screen.png" width="400">

## 快速开始

``` bash
# 获取数据
$ node build-origin.js

$ npm start
```

## 数据来源

数据爬自丁香园，使用脚本 `build-origin.js` 获取数据

## 部署

使用 `github actions` 与 `alioss` 自动部署，每半个小时部署一次(为了获取最新数据)。
