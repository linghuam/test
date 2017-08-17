class EqpGraph {

  constructor() {

    this._eqpListData = null;
    this._nodesData = null;
    this._linkData = null;
    this._tagDocData = null;
    this._docData = null;
    this._timeData = null;
    this._radarData = null;
    this._mapData = null;

    this.categories = {
      all: '全部',
      qj: '器件',
      gz: '故障',
      xw: '行为'
    };
  }

  async getData() {    
    this._eqpListData = await Util.readFile('data/装备列表.csv');
    this._nodesData = await Util.readFile('data/装备关联点-时间戳.csv');
    this._linkData = await Util.readFile('data/装备关联边-时间戳-无向.csv');
    this._tagDocData = await Util.readFile('data/装备关联文章列表.csv');
    this._docData = await Util.readFile('data/文章列表.csv');
    this._timeData = await Util.readFile('data/装备关联最大值最小值-时间戳.csv');
    this._radarData = await Util.readFile('data/装备雷达-总.csv');
    this._mapData = await Util.readFile('data/装备故障地点-经纬度.csv');
  }

  loadData(callback) {
    var self = this;
    if(!this._eqpListData || !this._nodesData || !this._linkData || !this._tagDocData || !this._docData || !this._timeData || !this._radarData || !this._mapData) {
      $('#loading').css('display', 'block');
      this.getData().then(function () {
        self._callbackFunc();
        if (callback) callback();
      });
    } else {
      callback();
    }
  }
  
  getEqpListData () {
    return this._eqpListData;
  }

  updateRadar (elementIds, equipmentName) {
        this._xwData = this._radarData.where(o => o.equipment === equipmentName && o.tag_type === this.categories.xw);
        this._qjData = this._radarData.where(o => o.equipment === equipmentName && o.tag_type === this.categories.qj);
        this._gzData = this._radarData.where(o => o.equipment === equipmentName && o.tag_type === this.categories.gz);

        this._updateRadar(elementIds[0], this.categories.xw);
        this._updateRadar(elementIds[1], this.categories.qj);
        this._updateRadar(elementIds[2], this.categories.gz);
  }

  _updateRadar (elementId, category) {
       var myecharts = echarts.init(document.getElementById(elementId));
        if(category === this.categories.xw) { var { categoryData, countData } = this._getRadarOptData(this._xwData);
        } else if(category === this.categories.qj) { var { categoryData, countData } = this._getRadarOptData(this._qjData);
        } else if(category === this.categories.gz) { var { categoryData, countData } = this._getRadarOptData(this._gzData);
        }
        if(categoryData && countData) {
            var max = this.getMax(countData);
            if(max) {
                categoryData = categoryData.map(function (d) {
                    d.max = max;
                    return d;
                });
            }
            var option = {
                title: {
                    text: category,
                    left: 'center'
                },
                tooltip: {},
                radar: {
                    indicator: categoryData
                },
                series: [{
                    name: '装备',
                    type: 'radar',
                    data: [{
                        value: countData,
                        name: '行为'
                    }]
                }]
            };

            myecharts.setOption(option);
        }
  }

    _getRadarOptData(data) {
        var categoryData = [];
        var countData = [];
        if(data.length) {
            var d2 = data.groupBy('tag_name');
            for(let i = 0, len = d2.length; i < len; i++) {
                let obj = d2[i];
                let cd = {
                    name: obj.key,
                    max: 100
                };
                let sum = this.getSum(obj.value);
                categoryData.push(cd);
                countData.push(sum);
            }
        }
        return {
            categoryData,
            countData
        };
    }

        getMax(arr) {
        if(arr.length) {
            var max = arr[0];
            for(let i = 0, len = arr.length; i < len; i++) {
                if(arr[i] > max) {
                    max = arr[i];
                }
            }
            return max;
        }
    }

    getSum(arr) {
        var sum = 0;
        for(let i = 0, len = arr.length; i < len; i++) {
            let value = parseInt(arr[i].tag_count);
            sum += value;
        }
        return sum;
    }

  updateMap (elementId, equipmentName) {

  }

  _callbackFunc() {
    $('#loading').css('display', 'none');
  }


}