class TagLine {

  constructor(filename, elementId) {

    this._worldsData = null;
    this._echarts = echarts.init(document.getElementById(elementId));
    this.getData(filename).then(this._callbackFunc.bind(this));
  }

  async getData(filename) {
    this._worldsData = await Util.readFile(filename);
  }

  _callbackFunc() {
    var x = [],
      y = [];
    for(let i = 0, len = this._worldsData.length; i < len; i++) {
      x.push(this._worldsData[i].tag_name);
      y.push(parseInt(this._worldsData[i].tag_count));
    }

    var option = {
      title: {
        text: '折线图'
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: x
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      toolbox: {
        feature: {
          saveAsImage: {}
        }
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: x
      },
      yAxis: {
        type: 'value'
      },
      series: [{
          name: '总量',
          type: 'line',
          data: y
        }
      ]
    };


    this._echarts.setOption(option);
  }

}