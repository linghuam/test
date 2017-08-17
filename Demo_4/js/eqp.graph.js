class EqpGraph {

  constructor() {

    this._eqpListData = null;
    this._nodesData = null;
    this._linkData = null;
    this._tagDocData = null;
    this._docData = null;
    this._timeData = null;

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
  }

  loadData(callback) {
    var self = this;
    if(!this._eqpListData || !this._nodesData || !this._linkData || !this._tagDocData || !this._docData || !this._timeData) {
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

  _callbackFunc() {
    $('#loading').css('display', 'none');
  }


}