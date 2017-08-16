class LayoutTagAnalysis {

	constructor (containerClass) {
		this._contanier = $('.' + containerClass);
	}

	start () {
		this._contanier.css('display', 'block');
	}

	stop () {
		this._contanier.css('display', 'none');
	}
}