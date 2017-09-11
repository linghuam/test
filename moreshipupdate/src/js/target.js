export class Target {

	constructor (id, lat, lng) {
		this.id = id;
		this.lat = lat;
		this.lng = lng;
	}

	get lat () {
		return this.lat;
	}

	set lat (value) {
		if (value >= -90 && value <= 90) this.lat = value;
	}

	get lng () {
		return this.lng;
	}

	set lng (value) {
		if (value >= -180 && value <= 180) this.lng = value;
	}

}