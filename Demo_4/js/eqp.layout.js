class EquipMentLayout {

    constructor(containerClass) {
        this._contanier = $('.' + containerClass);
        this._eqpGraph = new EqpGraph();
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
                	this._eqpGraph.updateRadar(['eqp_qj_chart', 'eqp_gz_chart', 'eqp_xw_chart'], row.equipment);
                	this._eqpGraph.updateMap('eqp_map_chart', row.equipment);
                    this._updateTimeSlider(row.equipment);
                }.bind(this),
                data: data,
                sortable: true,
                height: 500
            });
        }
    }

    _updateTimeSlider(eqpName) {
        // 时间轴
        if(this._dateSilderObj) {
            this._dateSilderObj.dateRangeSlider("destroy");
        }
        this._dateSilderObj = $('#eqp_timeslider').dateRangeSlider({
            arrows: false, //是否显示左右箭头
            bounds: { min: new Date(this._eqpGraph.getStartTime() * 1000), max: new Date(this._eqpGraph.getEndTime() * 1000) }, //最大 最少日期
            defaultValues: { min: new Date(this._eqpGraph.getStartTime() * 1000), max: new Date(this._eqpGraph.getEndTime() * 1000) }, //默认选中区域
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
    }
}