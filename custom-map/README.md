# 从零开始做一个web HTML5地图展示框架(只做Canvas显示)

[WebGIS前端地图显示之地图比例尺换算原理](http://www.cnblogs.com/naaoveGIS/p/3898607.html)

[WebGIS前端地图显示之根据地理范围换算出瓦片行列号的原理(核心)](http://www.cnblogs.com/naaoveGIS/p/3899821.html)

[墨卡托投影坐标系](http://blog.csdn.net/liyan_gis/article/details/8021514)
http://blog.csdn.net/kikitamoon/article/details/46124935


问题一：经纬度坐标如何转换成投影坐标？Leaflet-1.2.0/src/geo/projection
WGS84坐标系
墨卡托投影
Web墨卡托坐标系

问题二：地图不同级别下对应的地图比例尺？Leaflet-1.2.0/src/geo/crs
地图比例尺
转换公式：256 * Math.pow(2, zoom);

问题三：投影坐标系下原有坐标缩放、平移后新的坐标位置？Leaflet-1.2.0/src/geometry/Transformation.js
仿射变换
