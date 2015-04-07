

// All this should be in the view at some point probably

function initMap() {
	var mapOptions = {
		center: { lat: 40.675087, lng: -73.975524},
		zoom: 13
	};

	var map = new google.maps.Map(document.getElementById('map-canvas'),
		mapOptions);

	google.maps.event.addDomListener(window, 'load', initMap);
};

function loadScript() {
	var script = document.createElement('script');
	script.type = 'text/javascript';
	script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp' + '&signed_in=true&callback=initMap';
	document.body.appendChild(script);
};

window.onload = loadScript;

// Venue ID's are provided by foursquare.com
var initialPlaces = [
	{
		name: 'Soda Bar',
		foursquareID: '4075e780f964a52056f21ee3'
	},
	{
		name: 'Brooklyn Roasting Co.'
	}
];

var foursquareApi = 'https://api.foursquare.com/v2/venues/4075e780f964a52056f21ee3?client_id=3P0CNNUW5YA1QIJAQUVRR0H4UI4FVASXURVLXGP4AOMAHXIM&client_secret=NJFWJLYRXMAHO2W2F1SIGOTA5LMHMSUTGLM2XBRAXV5YMUBM&v=20150401';

/*
$.getJSON(foursquareApi, function(data){
	$
})
*/

// Here defining a "Place" so that the ViewModel can connect to the Model...

var Place = function(data) {
	this.name = ko.observable(data.name);
	this.foursquareID = ko.observable(data.foursquareID);
};

var ViewModel = function() {
	var self = this;

	this.placeList = ko.observableArray([]);

	initialPlaces.forEach(function(placeItem){
		self.placeList.push( new Place(placeItem));
	});

	this.currentPlace = ko.observable(this.placeList()[0]);

	this.setPlace = function(clickedPlace) {
		self.currentPlace(clickedPlace);
	};
};

ko.applyBindings(new ViewModel());
