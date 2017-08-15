class TagRect {

  constructor(filename, elementId) {

    this._worldsData = null;
    this._echarts = echarts.init(document.getElementById(elementId));
    this.getData(filename).then(this._callbackFunc.bind(this));
  }

  async getData(filename) {
    this._worldsData = await Util.readFile(filename);
  }

  _callbackFunc() {
    var x = [], y = [];
    for(let i = 0, len = this._worldsData.length; i < len; i++) {
      x.push(this._worldsData[i].tag_name);
      y.push(parseInt(this._worldsData[i].tag_count));
    }

    var option = {
      title: {
        text:'柱状图'
      },
      color: ['#3398DB'],
      tooltip: {
        trigger: 'axis',
        axisPointer: { // 坐标轴指示器，坐标轴触发有效
          type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [{
        type: 'category',
        data: x,
        axisTick: {
          alignWithLabel: true
        }
      }],
      yAxis: [{
        type: 'value'
      }],
      series: [{
        name: '直接访问',
        type: 'bar',
        barWidth: '60%',
        data: y
      }]
    };

    this._echarts.setOption(option);
  }

}