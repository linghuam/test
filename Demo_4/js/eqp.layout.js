class EquipMentLayout {

    constructor(containerClass) {
        this._contanier = $('.' + containerClass);
        this._eqpGraph = new EqpGraph();
        this._months = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];
    }

    start() {
        this._contanier.css('display', 'block');
        this._eqpGraph.loadData(this._loadDataCallback.bind(this));
    }

    stop() {
        this._contanier.css('display', 'none');
    }

    _loadDataCallback() {
        this._updateEqList('eqp_list_all_table');
    }

    _updateEqList(tableId) {
        var data = this._eqpGraph.getEqpListData();
        var self = this;
        if(data && data.length) {
            $('#' + tableId).bootstrapTable('destroy');
            $('#' + tableId).bootstrapTable({
                columns: [{
                    field: 'equipment',
                    title: '装备列表'
                }],
                onClickRow: function (row, $element, field) {
                    this._updateTimeSlider(row.equipment);
                    this._eqpGraph.updateRadar(['eqp_xw_chart', 'eqp_qj_chart', 'eqp_gz_chart'], row.equipment);
                    this._eqpGraph.updateMap('eqp_map_chart', row.equipment);
                    this._eqpGraph.setChartClickCallback(this._chartClickCallBack.bind(this));
                }.bind(this),
                data: data,
                sortable: true,
                height: 500
            });
        }
    }

    _updateTimeSlider(eqpName) {
        var self = this;
        var { startTime, endTime} = this._eqpGraph.getStartEndTime(eqpName);
        // 时间轴
        if(this._dateSilderObj) {
            this._dateSilderObj.dateRangeSlider("destroy");
        }
        this._dateSilderObj = $('#eqp_timeslider').dateRangeSlider({
            arrows: false, //是否显示左右箭头
            bounds: { min: new Date(startTime * 1000), max: new Date(endTime * 1000) }, //最大 最少日期
            defaultValues: { min: new Date(startTime * 1000), max: new Date(endTime * 1000) }, //默认选中区域
            scales: [{
                first: function (value) { return value; },
                end: function (value) { return value; },
                next: function (val) {
                    var next = new Date(val);
                    return new Date(next.setMonth(next.getMonth() + 1));
                },
                label: function (val) {
                    return self._months[val.getMonth()];
                },
                format: function (tickContainer, tickStart, tickEnd) {
                    tickContainer.addClass("myCustomClass");
                }
            }]
        });

        //拖动完毕后的事件
        this._dateSilderObj.bind("valuesChanged", function (e, data) {
            var val = data.values;
            var stime = val.min.getFullYear() + "-" + (val.min.getMonth() + 1) + "-" + val.min.getDate();
            var etime = val.max.getFullYear() + "-" + (val.max.getMonth() + 1) + "-" + val.max.getDate();
            self._eqpGraph.updateLinkChart('eqp_relation_chart', eqpName, Util.getCusUnixTime(stime + ' 00:00:00'), Util.getCusUnixTime(etime + ' 00:00:00'));
            // console.log("起止时间：" + stime + " 至 " + etime);
        });

        self._eqpGraph.updateLinkChart('eqp_relation_chart', eqpName, startTime, endTime);
    }

    _updateLinkDocTable(tableId, data) {
        var self = this;
        if(data && data.length) {
            $('#' + tableId).bootstrapTable('destroy');
            $('#' + tableId).bootstrapTable({
                columns: [{
                    field: 'id',
                    title: '序号'
                }, {
                    field: 'title',
                    title: '标题'
                }, {
                    field: 'create_time',
                    title: '时间'
                }],
                onClickRow: function (row, $element, field) {
                    console.log(row);
                },
                data: data,
                sortable: true,
                height: 500
            });
        }
    }

    _chartClickCallBack(param) {
        var docData = this._eqpGraph.getDocsByids(param.data.docids);
        this._updateLinkDocTable('eqp_doc_table', docData);
    }

}