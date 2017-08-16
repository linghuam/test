class TagSingle {

  constructor(containerClass) {
    this._contanier = $('.' + containerClass);
    this._months = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];
  }

  start(tagname) {
    this._contanier.css('display', 'block');
    this._tagname = tagname;
    this._initEvt();
  }

  stop() {
    this._contanier.css('display', 'none');
  }

  _initEvt() {
    var self = this;
    // 标题
    this._contanier.find('.tagname').html(this._tagname );
    // back按钮
    this._contanier.find('.backbtn').on('click', function () {
    	self._contanier.css('display', 'none');
    	$('.tag_container').css('display', 'block');
    });
    // 日期控件
    $(".form_datetime").datetimepicker({
      language: 'zh-CN',
      format: 'yyyy-mm-dd',
      minView: 2,
      maxView: 3,
      startView: 2,
      autoclose: true,
      todayHighlight: true,
      todayBtn: true,
      pickerPosition: "bottom-left"
    });
    // 时间轴
    this._createDemos();
  }

  _createDemos() {
    var self = this;
    var date = $("<div id='date' />").appendTo($(".dateSlider")); //渲染日期组件
    var dateSilderObj = date.dateRangeSlider({
      arrows: false, //是否显示左右箭头
      bounds: { min: new Date(2013, 7, 1), max: new Date(2014, 6, 31, 12, 59, 59) }, //最大 最少日期
      defaultValues: { min: new Date(2014, 1, 23), max: new Date(2014, 4, 23) } //默认选中区域
      ,
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

    }); //日期控件

    //重新赋值（整个时间轴）
    dateSilderObj.dateRangeSlider("bounds", new Date(2013, 8, 1), new Date(2014, 7, 31, 12, 59, 59));

    //重新赋值（选中区域）
    dateSilderObj.dateRangeSlider("values", new Date(2014, 2, 23), new Date(2014, 5, 23));

    //拖动完毕后的事件
    dateSilderObj.bind("valuesChanged", function (e, data) {
      var val = data.values;
      var stime = val.min.getFullYear() + "-" + (val.min.getMonth() + 1) + "-" + val.min.getDate();
      var etime = val.max.getFullYear() + "-" + (val.max.getMonth() + 1) + "-" + val.max.getDate();
      console.log("起止时间：" + stime + " 至 " + etime);
    });
  }

}