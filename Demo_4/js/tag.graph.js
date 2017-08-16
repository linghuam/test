class TagGraph {

  constructor() {

  	this._allData = null;
  	this._gzData = null;
  	this._qjData = null;
  	this._xwData = null;
  	this._lineData = null;
  }

  async getData() {
     this._allData = await Util.readFile('../data/全部标签统计.csv');
     this._gzData = await Util.readFile('../data/故障原因标签统计.csv');
     this._qjData = await Util.readFile('../data/器件原因标签统计.csv');
     this._xwData = await Util.readFile('../data/行为原因标签统计.csv');
     this._lineData = await Util.readFile('../data/TOP5折线图 - 日期.csv');
  }

  _loadData () {
  	if (!this._allData || !this._gzData || !this._qjData || !this._xwData || !this._lineData) {
  		$('#loading').css('display','block');
  		this.getData().then(this._callbackFunc.bind(this));  	
  	}
  }

  _callbackFunc() {
  	 $('#loading').css('display','none');  	 
  }
}