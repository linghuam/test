class TagLayout {

	constructor (containerClass) {
		this._contanier = $('.' + containerClass);
        this._tagGraph = new TagGraph();
		this._initEvt();		
	}

	start () {
		this._contanier.css('display', 'block');
	}

 	stop () {
		this._contanier.css('display', 'none');
	}   

    _initEvt () {
    	this._contanier.find('.operate_container .tag_select').on('click', function(){
    		$(this).addClass('active').siblings().removeClass('active');
    		if ($(this).hasClass('tag_all')){
    			this._update('all');
    		} else if ($(this).hasClass('tag_gz')) {
    			this._update('gz');

    		} else if ($(this).hasClass('tag_qj')) {
    			this._update('qj');

    		} else if ($(this).hasClass('tag_xw')) {
    			this._update('xw');

    		}
    	})
    }

    _update (type){

    	if (type === 'all') {
    		new WordCloud3('data/全部标签统计.csv', 'tag_wordcloud');
    		new TagPie('data/全部标签统计.csv', 'tagpie');
    	} else if (type === 'gz') {
    		new WordCloud3('data/故障原因标签统计.csv', 'tag_wordcloud');    		
    	} else if (type === 'qj') {
    		new WordCloud3('data/器件原因标签统计.csv', 'tag_wordcloud');
    	} else if (type === 'xw') {
    		new WordCloud3('data/行为原因标签统计.csv', 'tag_wordcloud');
    	}
    }


}