var ShipGridPoints = new Array();
var ShipGridPolygons;
var pointVectors = new Array();
$(document).ready(function () {
    initShipMapData('全球');
    setTimeout('addShipGridRealTimelayer()',2000);
});
var layerInfo = false;
var localData;
var pointVectors1 = new Array();
var pointVectors2 = new Array();
var ShipGridPolygonsall1 = new Array();
var ShipGridPolygonsall2 = new Array();
var ShipGridPolygonsall3 = new Array();
var ShipGridPolygonsall4 = new Array();
var ShipGridPolygonsall5 = new Array();
//加载船舶网格图层
var gridPolygons1 =[];
var gridPolygons2 = [];
var gridPolygons3 = [];
var gridPolygons4 = [];
var gridPolygons5 = [];
function addShipGridRealTimelayer() {
    gridPolygons1 = makeGrid(1);
     gridPolygons2 = makeGrid(2);
     gridPolygons3 = makeGrid(3);
     gridPolygons4 = makeGrid(4);
     gridPolygons5 = makeGrid(5);
    // Play with returned data in JSON format
    var myDate = new Date();
    $('#geting-Time').html("  最近更新：" + myDate.getHours() + ":" + myDate.getMinutes() + ":00" + "  " + myDate.getFullYear() + "/" + (myDate.getMonth() + 1) + "/" + myDate.getDate());
    $.ajax({
        type: "GET",
        url: "../realTime/GridStatistics/appointArea.do",
        data: {},
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            // Play with returned data in JSON format

            localData = data;
            if (data.state == 1) {
                shipVector.removeAllFeatures();
                var count = data.msg.list.length;
                ShipGridPolygons = new Array();
                for (var i = 0; i < count; i++) {
                    var lon = data.msg.list[i].lon;
                    var lat = data.msg.list[i].lat;
                    var lon1;
                    if (lon == 180) {
                        lon1 = 180;
                    } else if (lon == -180) {
                        lon = 180;
                        lon1 = 180;
                    } else if (lon + 1 == 180) {
                        lon1 = -180;
                    }
                    else {
                        lon1 = lon + 1;
                    }
                    if (lat == -90) {
                        lat = -89
                    }
                    var points = [makeNewPoint(new SuperMap.Geometry.Point(lon, lat)),
                        makeNewPoint(new SuperMap.Geometry.Point(lon1, lat)),
                        makeNewPoint(new SuperMap.Geometry.Point(lon1, lat + 1)),
                        makeNewPoint(new SuperMap.Geometry.Point(lon, lat + 1))];
                    var linearRings = new SuperMap.Geometry.LinearRing(points);
                    var Polygon = new SuperMap.Geometry.Polygon([linearRings]);
                    var polygonVector = new SuperMap.Feature.Vector(Polygon);
                    polygonVector.label = data.msg.list[i].cou;
                    ShipGridPolygons.push(polygonVector);
                }
                var gridPolygons= makeGrid(map.getZoom());;
                //switch (map.getZoom()) {
                //    case  0:
                //        gridPolygons = gridPolygons1;
                //        break;
                //    case  1:
                //        gridPolygons = gridPolygons1;
                //        break
                //    case  2:
                //        gridPolygons = gridPolygons2;
                //        break;
                //    case  3:
                //        gridPolygons = gridPolygons3;
                //        break;
                //    case  4:
                //        gridPolygons = gridPolygons4;
                //        break;
                //    case  5:
                //        gridPolygons = gridPolygons5;
                //        break;
                //}
                var ShipGridPolygonsall = makeGridInfo(gridPolygons, ShipGridPolygons, map.getZoom());
                shipVector.setVisibility(true);
                shipVector.addFeatures(ShipGridPolygonsall);
            }
        },
        error: function (XMLHttpRequest) {
            showErr(XMLHttpRequest);
        }
    });

}

function makeGridInfo(gridPolygons, ShipGridPolygons, zoom) {
    var ShipGridPolygonsall = [];
    var level = 8;
    if (zoom <= 1) {
        level = 32;
    } else if (zoom == 2) {
        level = 16;
    } else if (zoom == 3) {
        level = 8;
    } else if (zoom == 4) {
        level = 6;
    }
    if (zoom == 5) {
        ShipGridPolygonsall = ShipGridPolygons;
        for (var i = 0; i < ShipGridPolygonsall.length; i++) {
            ShipGridPolygonsall[i].style = getPolygonStyle(ShipGridPolygonsall[i].label);
        }
    } else {
        if (gridPolygons.length > ShipGridPolygons.length) {
            for (var i = 0; i < gridPolygons.length; i++) {
                var countship = 0;
                var k = 0;
                for (var j = 0, k = 0; j < ShipGridPolygons.length && k < level; j++) {
                    if (gridPolygons[i].geometry.components[0].components[0].x <= ShipGridPolygons[j].geometry.components[0].components[0].x &&
                        gridPolygons[i].geometry.components[0].components[0].y >= ShipGridPolygons[j].geometry.components[0].components[0].y &&
                        gridPolygons[i].geometry.components[0].components[1].x >= ShipGridPolygons[j].geometry.components[0].components[1].x &&
                        gridPolygons[i].geometry.components[0].components[1].y >= ShipGridPolygons[j].geometry.components[0].components[1].y &&
                        gridPolygons[i].geometry.components[0].components[2].x >= ShipGridPolygons[j].geometry.components[0].components[2].x &&
                        gridPolygons[i].geometry.components[0].components[2].y <= ShipGridPolygons[j].geometry.components[0].components[2].y &&
                        gridPolygons[i].geometry.components[0].components[3].x <= ShipGridPolygons[j].geometry.components[0].components[3].x &&
                        gridPolygons[i].geometry.components[0].components[3].y <= ShipGridPolygons[j].geometry.components[0].components[3].y
                    ) {
                        countship += parseInt(ShipGridPolygons[j].label);
                        k++;
                    }
                }
                gridPolygons[i].label = countship;
                if (gridPolygons[i].label != 0) {
                    gridPolygons[i].style = getPolygonStyle(gridPolygons[i].label);
                    ShipGridPolygonsall.push(gridPolygons[i]);
                }
            }
        } else {
            for (var j = 0; j < ShipGridPolygons.length; j++) {
                var countship = 0;
                var k = 0;
                for (var i = 0, k = 0; i < gridPolygons.length && k < level; i++) {
                    if (gridPolygons[i].geometry.components[0].components[0].x < ShipGridPolygons[j].geometry.components[0].components[0].x &&
                        gridPolygons[i].geometry.components[0].components[0].y > ShipGridPolygons[j].geometry.components[0].components[0].y &&
                        gridPolygons[i].geometry.components[0].components[1].x > ShipGridPolygons[j].geometry.components[0].components[1].x &&
                        gridPolygons[i].geometry.components[0].components[1].y > ShipGridPolygons[j].geometry.components[0].components[1].y &&
                        gridPolygons[i].geometry.components[0].components[2].x > ShipGridPolygons[j].geometry.components[0].components[2].x &&
                        gridPolygons[i].geometry.components[0].components[2].y < ShipGridPolygons[j].geometry.components[0].components[2].y &&
                        gridPolygons[i].geometry.components[0].components[3].x < ShipGridPolygons[j].geometry.components[0].components[3].x &&
                        gridPolygons[i].geometry.components[0].components[3].y < ShipGridPolygons[j].geometry.components[0].components[3].y
                    ) {
                        gridPolygons[i].label += parseInt(ShipGridPolygons[j].label);
                        k++;
                    }
                }
            }
            for (var i = 0; i < gridPolygons.length; i++) {
                if (gridPolygons[i].label != 0) {
                    gridPolygons[i].style = getPolygonStyle(gridPolygons[i].label);
                    ShipGridPolygonsall.push(gridPolygons[i]);
                }
            }
        }

    }
    return ShipGridPolygonsall;
}

function getPolygonStyle(count) {
    var PolygonStyle;
    if (count <= 10) {
        PolygonStyle = {
            strokeColor: "#91E201",
            strokeWidth: 1,
            strokeOpacity: 0,
            fillColor: "#91E201",
            label: count.toString(),
            fontColor: "#000",
            fontSize: "10px",
            fillOpacity: 0.25
        }
    }
    else if (count > 10 && count <= 50) {
        PolygonStyle = {
            strokeColor: "#009E01",
            strokeWidth: 1,
            strokeOpacity: 0,
            fillColor: "#009E01",
            label: count.toString(),
            fontColor: "#000",
            fontSize: "10px",
            fillOpacity: 0.3
        }
    }
    else if (count > 50 && count <= 100) {
        PolygonStyle = {
            strokeColor: "#FFFF01",
            strokeWidth: 1,
            strokeOpacity: 0,
            fillColor: "#FFFF01",
            label: count.toString(),
            fontColor: "#000",
            fontSize: "10px",
            fillOpacity: 0.35
        }
    }
    else if (count > 100 && count <= 500) {
        PolygonStyle = {
            strokeColor: "#FCCF00",
            strokeWidth: 1,
            strokeOpacity: 0,
            fillColor: "#FCCF00",
            label: count.toString(),
            fontColor: "#000",
            fontSize: "10px",
            fillOpacity: 0.4
        }
    }
    else if (count > 500 && count <= 1000) {
        PolygonStyle = {
            strokeColor: "#FD910B",
            strokeWidth: 1,
            strokeOpacity: 0,
            fillColor: "#FD910B",
            label: count.toString(),
            fontColor: "#000",
            fontSize: "10px",
            fillOpacity: 0.45
        }
    }
    else if (count > 1000 && count <= 5000) {
        PolygonStyle = {
            strokeColor: "#FA5E11",
            strokeWidth: 1,
            strokeOpacity: 0,
            fillColor: "#FA5E11",
            label: count.toString(),
            fontColor: "#000",
            fontSize: "10px",
            fillOpacity: 0.5
        }
    }
    else if (count > 5000) {
        PolygonStyle = {
            strokeColor: "#F11415",
            strokeWidth: 1,
            strokeOpacity: 0,
            fillColor: "#F11415",
            label: count.toString(),
            fontColor: "#000",
            fontSize: "10px",
            fillOpacity: 0.65
        }
    }
    return PolygonStyle;
}

function makeGrid(zoom) {
    var features = [];
    if (zoom <= 1) {
        makeNewGridArray(16, features);
    } else if (zoom == 2) {
        makeNewGridArray(8, features);
    } else if (zoom == 3) {
        makeNewGridArray(4, features);
    } else if (zoom == 4) {
        makeNewGridArray(2, features);
    } else if (zoom == 5) {
        makeNewGridArray(1, features);
    }
    return features;
}

function makeNewGridArray(temp, features) {
    var x = -180, y = 90;
    for (var i = 0; (y - temp * i) > -90; i++) {
        for (var k = 0; (x + temp * k) < 180; k++) {
            var points = [makeNewPoint(new SuperMap.Geometry.Point(x + temp * k, y - temp * i)),
                makeNewPoint(new SuperMap.Geometry.Point(x + temp * (k + 1), y - temp * i)),
                makeNewPoint(new SuperMap.Geometry.Point(x + temp * (k + 1), y - temp * (i + 1))),
                makeNewPoint(new SuperMap.Geometry.Point(x + temp * k, y - temp * (i + 1)))];
            var linearRings = new SuperMap.Geometry.LinearRing(points);
            var region = new SuperMap.Geometry.Polygon([linearRings]);
            var polygonVector = new SuperMap.Feature.Vector(region);
            polygonVector.label = 0;
            features.push(polygonVector);
        }
    }
    return features;
}

function loadStartListener() {
    var zoom = map.getZoom();
    if (zoom <= 5) {
        redrawshipVector(zoom);
    } else {
        shipVector.setVisibility(false);
        regionshipVector.setVisibility(true);
        pointVectors = [];
        loadregionship();
    }
}
function redrawshipVector(zoom) {
    if (ShipGridPolygons && ShipGridPolygons.length != 0) {
        shipVector.setVisibility(true);
        regionshipVector.setVisibility(false);
        shipVector.removeAllFeatures();
        if (zoom <= 1) {
            if (ShipGridPolygonsall1.length != 0) {
                shipVector.addFeatures(ShipGridPolygonsall1);
            } else {

                ShipGridPolygonsall1 = makeGridInfo(gridPolygons1, ShipGridPolygons, zoom);
                shipVector.addFeatures(ShipGridPolygonsall1);
            }

        } else if (zoom == 2) {
            if (ShipGridPolygonsall2.length != 0) {

                shipVector.addFeatures(ShipGridPolygonsall2);
            } else {
                ShipGridPolygonsall2 = makeGridInfo(gridPolygons2, ShipGridPolygons, zoom);
                shipVector.addFeatures(ShipGridPolygonsall2);
            }
        } else if (zoom == 3) {
            if (ShipGridPolygonsall3.length != 0) {
                shipVector.addFeatures(ShipGridPolygonsall3);
            } else {
                ShipGridPolygonsall3 = makeGridInfo(gridPolygons3, ShipGridPolygons, zoom);
                shipVector.addFeatures(ShipGridPolygonsall3);
            }
        } else if (zoom == 4) {
            if (ShipGridPolygonsall4.length != 0) {
                shipVector.addFeatures(ShipGridPolygonsall4);
            } else {
                ShipGridPolygonsall4 = makeGridInfo(gridPolygons4, ShipGridPolygons, zoom);
                shipVector.addFeatures(ShipGridPolygonsall4);
            }
        } else if (zoom == 5) {
            if (ShipGridPolygonsall5.length != 0) {
                shipVector.addFeatures(ShipGridPolygonsall5);
            } else {
                ShipGridPolygonsall5 = makeGridInfo(gridPolygons5, ShipGridPolygons, zoom);
                shipVector.addFeatures(ShipGridPolygonsall5);
            }
        }


    }
}

function moveendListener(evens) {
    if (evens.object.zoom == 6 || (evens.object.zoom > 6 && !evens.zoomChanged)) {
        loadregionship(evens.zoomChanged);
    } else if (evens.object.zoom <= 5) {
        shipVector.setVisibility(true);
        regionshipVector.setVisibility(false);
    }
}

function loadregionship(zoomChanged) {
    var center = map.getCenter();
    var point = new SuperMap.Geometry.Point(center.lon, center.lat);
    pointChinge(point);
    getAllShip(point, zoomChanged);
}

function VectorAddFeatures(b) {
    if (b) {
        regionshipVector.removeAllFeatures();
        regionshipVector.addFeatures(pointVectors1);
    } else {
        regionshipVector.removeAllFeatures();
        regionshipVector.addFeatures(pointVectors2);
    }
}
function isHasships(arr, val) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].geometry.x == val.geometry.x && arr[i].geometry.y == val.geometry.y)
            return true;
    }
    return false;
}


function openInfoWinRegion(feature) {

    getOneShipInfo(feature);

}


// 关闭信息框
function closeInfoWinRegion() {
    if (infowinRegion) {
        try {
            infowinRegion.hide();
            infowinRegion.destroy();
        } catch (e) {
        }
    }
}
