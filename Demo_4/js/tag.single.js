class TagSingle {

  constructor(containerClass) {
    this._contanier = $('.' + containerClass);
    this._months = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];
    this._dataOptions = {
      language: 'zh-CN',
      format: 'yyyy-mm-dd',
      minView: 2,
      maxView: 3,
      startView: 2,
      autoclose: true,
      todayHighlight: true,
      todayBtn: true,
      pickerPosition: "bottom-left"
    };
    this._singleGraph = new TagSingleGraph('tag_single_relationchart');
  }

  start(tagname) {
    this._contanier.css('display', 'block');
    this._tagname = tagname;
    this._singleGraph.loadData(this._loadDataCallback.bind(this), tagname);
  }

  stop() {
    this._contanier.css('display', 'none');
  }

  _loadDataCallback() {
    this._initEvt();
  }

  _initEvt() {
    var self = this;
    // 标题
    this._contanier.find('.tagname').html(this._tagname);
    // back按钮
    this._contanier.find('.backbtn').on('click', function () {
      self._contanier.css('display', 'none');
      $('.tag_container').css('display', 'block');
    });
    // 日期控件
    $('#tag_single_time_start').datetimepicker(this._dataOptions).on('changeDate', function (ev) {
      // var endt = Util.getCusUnixDate($('#tag_single_time_end').find('input').val() + ' 00:00:00');
      var endt = self._dateSilderObj.dateRangeSlider('values').max;
      if(self._dateSilderObj)
        self._dateSilderObj.dateRangeSlider("values", new Date(ev.timeStamp), endt);
    });
    $('#tag_single_time_end').datetimepicker(this._dataOptions).on('changeDate', function (ev) {
      // var start = Util.getCusUnixDate($('#tag_single_time_start').find('input').val() + ' 00:00:00');
      var start = self._dateSilderObj.dateRangeSlider('values').min;      
      if(self._dateSilderObj)
        self._dateSilderObj.dateRangeSlider("values", start, new Date(ev.timeStamp));
    });
    $('#tag_single_time_start').find('input').val(Util.getTimeStrFromUnixYMD(this._singleGraph.getStartTime()));
    $('#tag_single_time_end').find('input').val(Util.getTimeStrFromUnixYMD(this._singleGraph.getEndTime()));
    // 时间轴
    this._dateSilderObj = $('#tag_single_timeslider').dateRangeSlider({
      arrows: false, //是否显示左右箭头
      bounds: { min: new Date(this._singleGraph.getStartTime() * 1000), max: new Date(this._singleGraph.getEndTime() * 1000) }, //最大 最少日期
      defaultValues: { min: new Date(this._singleGraph.getStartTime() * 1000), max: new Date(this._singleGraph.getEndTime() * 1000) }, //默认选中区域
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

    //重新赋值（整个时间轴）
    // dateSilderObj.dateRangeSlider("bounds", new Date(2013, 8, 1), new Date(2014, 7, 31, 12, 59, 59));

    //重新赋值（选中区域）
    // dateSilderObj.dateRangeSlider("values", new Date(2014, 2, 23), new Date(2014, 5, 23));

    //拖动完毕后的事件
    this._dateSilderObj.bind("valuesChanged", function (e, data) {
      var val = data.values;
      var stime = val.min.getFullYear() + "-" + (val.min.getMonth() + 1) + "-" + val.min.getDate();
      var etime = val.max.getFullYear() + "-" + (val.max.getMonth() + 1) + "-" + val.max.getDate();
      // $('#tag_single_time_start').find('input').val(stime);
      // $('#tag_single_time_end').find('input').val(etime);
      self._singleGraph.updateGraph(Util.getCusUnixTime(stime + ' 00:00:00'), Util.getCusUnixTime(etime + ' 00:00:00'));
      console.log("起止时间：" + stime + " 至 " + etime);
    });

    this._singleGraph.updateGraph(this._singleGraph.getStartTime(), this._singleGraph.getEndTime());

  }

}