/**
 * Created by oceanuser on 2017/3/9.
 */
ajaxFun('0','2015','0','0');
var entranceChart=echarts.init(document.getElementById("entrance"));
var exitChart=echarts.init(document.getElementById("exit"));
var tradeRelationsChart=echarts.init(document.getElementById("tradeRelations"));

function odanalysisopen(){

    var shiptype = $("#shiptype").find(" option:selected").val();
    var shipyear = $("#shipyear").find(" option:selected").val();
    var shipmonth = $("#shipmonth").find(" option:selected").val();
    var shipquarter = $("#shipquarter").find(" option:selected").val();

    ajaxFun(shiptype,shipyear,shipmonth,shipquarter)

}
function ajaxFun(shiptype,shipyear,shipmonth,shipquarter){
    var exportCountry=[];//出口港口
    var exportMore=[];
    var importCountry=[];//出口港口
    var tradePort=[],tradePrice=[];
    shipquarter = (shipquarter===undefined ? 0 :shipquarter);
    $.ajax({
        url:Project_ParamConfig.PortConfig.odAnlysisUrl,
        type: "POST",
        data:{limit:10,ship_type:shiptype,years:shipyear,month:shipmonth,quarter:shipquarter},
        dataType: "json",
        success: function (data) {
            var exportList=data.msg.exportWeight;
            // console.log(exportList)
            var importList=data.msg.importWeight;
            var weightList=data.msg.weight;
            var abcd=[], abcde=[]
            for(var i=0;i<exportList.length;i++){
                exportCountry.push(exportList[i].port_name);
                abcd.push((exportList[i].tonnageMore/200000).toFixed(2));
                exitOption = {
                    color: ['#055f88', '#0a7cb0', '#1992ca', '#0ea0e3','#17b6ff', '#17cbff', '#3ad3ff', '#6ddeff','#a0eaff', '#bef1ff'],
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b}: {c} ({d}%)"
                    },
                    title: {
                        text: $.i18n.prop('port_query_odanalysis_out_pie'),
                        x: 'center',
                        y: 'center',
                        //itemGap: 20,
                        textStyle : {
                            color : 'rgba(77,95,113,1)',
                            fontFamily : '微软雅黑',
                            fontSize : 18,
                            fontWeight : 'bolder'
                        }
                    },
                    legend: {
                        orient: 'vertical',
                        x: 'left',
                        data:exportCountry
                    },
                    series: [
                        {
                            name:$.i18n.prop('port_query_odanalysis_out_units'),
                            type:'pie',
                            radius: ['40%', '60%'],
                            avoidLabelOverlap: false,
                            labelLine: {
                                normal: {
                                    show: true
                                }
                            },
                            data:[
                                {value:(exportList[0].tonnageMore/200000).toFixed(2), name:exportList[0].port_name},
                                {value:(exportList[1].tonnageMore/200000).toFixed(2), name:exportList[1].port_name},
                                {value:(exportList[2].tonnageMore/200000).toFixed(2), name:exportList[2].port_name},
                                {value:(exportList[3].tonnageMore/200000).toFixed(2), name:exportList[3].port_name},
                                {value:(exportList[4].tonnageMore/200000).toFixed(2), name:exportList[4].port_name},
                                {value:(exportList[5].tonnageMore/200000).toFixed(2), name:exportList[5].port_name},
                                {value:(exportList[6].tonnageMore/200000).toFixed(2), name:exportList[6].port_name},
                                {value:(exportList[7].tonnageMore/200000).toFixed(2), name:exportList[7].port_name},
                                {value:(exportList[8].tonnageMore/200000).toFixed(2), name:exportList[8].port_name},
                                {value:(exportList[9].tonnageMore/200000).toFixed(2), name:exportList[9].port_name}
                            ]
                        }
                    ]
                };
            }

            for(var i=0;i<importList.length;i++){
                importCountry.push(importList[i].port_name);
                abcde.push(importList[i].tonnageMore/200000);
                entranceOption = {
                    color: ['#055f88', '#0a7cb0', '#1992ca', '#0ea0e3','#17b6ff', '#17cbff', '#3ad3ff', '#6ddeff','#a0eaff', '#bef1ff'],
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b}: {c} ({d}%)"
                    },
                    grid: {
                        //borderWidth: 0,

                        left: '20%',
                        // right: '4%',
                        // top:'2%',
                        // bottom: '3%',
                        containLabel: true
                    },
                    title: {
                        text: $.i18n.prop('port_query_odanalysis_enter_pie'),
                        x: 'center',
                        y: 'center',
                        //itemGap: 20,
                        textStyle : {
                            color : 'rgba(77,95,113,1)',
                            fontFamily : '微软雅黑',
                            fontSize : 18,
                            fontWeight : 'bolder'
                        }
                    },
                    legend: {
                        orient: 'vertical',
                        x: 'left',
                        data:importCountry
                    },
                    series: [
                        {
                            name: $.i18n.prop('port_query_odanalysis_enter_units'),
                            type:'pie',
                            radius: ['40%', '60%'],
                            avoidLabelOverlap: false,
                            labelLine: {
                                normal: {
                                    show:true
                                }
                            },
                            data:[
                                {value:(importList[0].tonnageMore/200000).toFixed(2), name:importList[0].port_name},
                                {value:(importList[1].tonnageMore/200000).toFixed(2), name:importList[1].port_name},
                                {value:(importList[2].tonnageMore/200000).toFixed(2), name:importList[2].port_name},
                                {value:(importList[3].tonnageMore/200000).toFixed(2), name:importList[3].port_name},
                                {value:(importList[4].tonnageMore/200000).toFixed(2), name:importList[4].port_name},
                                {value:(importList[5].tonnageMore/200000).toFixed(2), name:importList[5].port_name},
                                {value:(importList[6].tonnageMore/200000).toFixed(2), name:importList[6].port_name},
                                {value:(importList[7].tonnageMore/200000).toFixed(2), name:importList[7].port_name},
                                {value:(importList[8].tonnageMore/200000).toFixed(2), name:importList[8].port_name},
                                {value:(importList[9].tonnageMore/200000).toFixed(2), name:importList[9].port_name}
                            ]
                        }
                    ]
                };
            }
            // console.log(importCountry)
            // console.log(abcde)
            for(var i=0;i<weightList.length;i++){
                var name=weightList[i].port_nameA+'\n'+weightList[i].port_nameB;
                tradePort.push(name);
                tradePrice.push((weightList[i].tonnageMore/200000).toFixed(2));
                $('.tName').eq(i).html(weightList[i].port_nameA+'——'+weightList[i].port_nameB);
                $('.tW').eq(i).html(weightList[i].tonnageMore/200000)
            }

            tradeRelationsOption = {
                tooltip : {
                    trigger: 'item',
                    axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                        type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                calculable: true,
                grid: {
                    //borderWidth: 0,
                    y: 0,
                    left: '3%',
                    right: '4%',
                    top:'2%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: [
                    {
                        type: 'category',
                        data:  tradePort,
                        axisTick: {
                            alignWithLabel: true
                        }
                    }
                ],
                yAxis: [
                    {
                        type: 'value'

                    }
                ],
                series: [
                    {
                        name: $.i18n.prop('port_query_odanalysis_trade_units'),
                        type: 'bar',
                        barCategoryGap: '65%',
                        itemStyle: {
                            normal: {
                                color: function(params) {
                                    // build a color map as your need.
                                    var colorList = ['#055f88', '#0a7cb0', '#1992ca', '#0ea0e3','#17b6ff', '#17cbff', '#3ad3ff', '#6ddeff','#a0eaff', '#bef1ff'];
                                    return colorList[params.dataIndex]
                                }

                            }
                        },
                        data: tradePrice

                    }
                ]
            };
            tradeRelationsChart.setOption(tradeRelationsOption);
            entranceChart.setOption(entranceOption);
            exitChart.setOption(exitOption);
        }
    })
    window.onresize = function () {
        tradeRelationsChart.resize();
        entranceChart.resize();
        exitChart.resize();
    }
}