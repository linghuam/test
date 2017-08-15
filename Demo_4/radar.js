class RadarGraph {

  constructor(filename, elementId, equipmentName) {

    this._eqname = equipmentName;
    this.categories = ["行为", "器件", "故障"];
    this._allData = [];
    this._xwData = [];
    this._qjData　 = [];
    this._gzData = [];
    this._echarts = echarts.init(document.getElementById(elementId));
    this.getData(filename).then(this._callbackFunc.bind(this));

  }

  async getData(filename) {
    this._allData = await Util.readFile(filename);
  }

  _callbackFunc() {

    this._xwData = this._allData.where(o => o.equipment === this._eqname && o.tag_type === this.categories[0]);
    this._qjData　 = this._allData.where(o => o.equipment === this._eqname && o.tag_type === this.categories[1]);
    this._gzData = this._allData.where(o => o.equipment === this._eqname && o.tag_type === this.categories[2]);
    
    var {categoryData, countData} = this.getOptData(this._gzData);
    var option = {
      title: {
        text: '基础雷达图'
      },
      tooltip: {
          // position: ['50%', '50%']
      },
      // legend: {
      //   data: ['预算分配（Allocated Budget）', '实际开销（Actual Spending）']
      // },
      radar: {
        indicator: categoryData
      },
      series: [{
        name: '装备',
        type: 'radar',
        data: [{
            value: countData,
            name: '行为'
          }
        ]
      }]
    };

    this._echarts.setOption(option);

    window.onresize = this._echarts.resize;
  }

  getOptData(data) {
    var categoryData = [];
    var countData = [];
    if(data.length) {
      var d2 = data.groupBy('tag_name');
      for(let i = 0, len = d2.length; i < len; i++) {
        let obj = d2[i];
        let cd = {
          name: obj.key,
          max: 1000
        };
        let sum = this.getSum(obj.value);
        cd.max = sum;
        categoryData.push(cd);
        countData.push(sum);
      }
    }
    return {
      categoryData,
      countData
    };
  }

  getSum(arr) {
    var sum = 0;
    for(let i = 0, len = arr.length; i < len; i++) {
      let value = parseInt(arr[i].tag_count);
      sum += value;
    }
    return sum;
  }

}