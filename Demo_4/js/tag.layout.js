class TagLayout {

	constructor (containerClass) {
		this._contanier = $('.' + containerClass);
        this._tagGraph = new TagGraph();
        this._initEvt();               
	}

	start () {
		this._contanier.css('display', 'block');
        this._tagGraph.loadData();
	}

 	stop () {
		this._contanier.css('display', 'none');
	}   

    _initEvt () {
        var self = this;
    	this._contanier.find('.tag_select').on('click', function(){
    		$(this).addClass('active').siblings().removeClass('active');
    		if ($(this).hasClass('tag_all')){
    			self._update('all');

    		} else if ($(this).hasClass('tag_gz')) {
    			self._update('gz');

    		} else if ($(this).hasClass('tag_qj')) {
    			self._update('qj');

    		} else if ($(this).hasClass('tag_xw')) {
    			self._update('xw');

    		}
    	});
    }

    _update (type){
        this._tagGraph.updateWordCloud(type, 'tag_wordcloud');
        this._tagGraph.updatePie(type, 'tag_pie');
        this._tagGraph.updateBar(type, 'tag_bar');
        this._tagGraph.updateLine(type, 'tag_line');
        this._tagGraph.updateTable(type, 'tag_table');
    }


}