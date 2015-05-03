// So maybe make this an observable array...
var gmarkers = [];


// All this should be in the view at some point probably...??

function initMap() {
	var mapOptions = {
		center: { lat: 40.675087, lng: -73.975524},
		zoom: 12
	};

	var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

	var infowindow = new google.maps.InfoWindow;

	var marker, i;

	for (i = 0; i < initialPlaces.length; i++) {
		marker = new google.maps.Marker({
			position: new google.maps.LatLng(initialPlaces[i].latitude, initialPlaces[i].longitude),
			title: initialPlaces[i].name,
			map: map
		});

		google.maps.event.addListener(marker, 'click', (function(marker, i) {
			return function() {
				infowindow.setContent(initialPlaces[i].name);
				infowindow.open(map, marker);
			}
		})(marker, i));

		// Push the marker to the 'gmarkers' array
		gmarkers.push(marker);
	};

	google.maps.event.addDomListener(window, 'load', initMap);
};

// Triggers the marker click, 'id' is the reference index to the 'gmarkers' array.
// http://stackoverflow.com/questions/18333679/google-maps-open-info-window-after-click-on-a-link
function myClick(id) {
	google.maps.event.trigger(gmarkers[id], 'click');
};

function loadScript() {
	var script = document.createElement('script');
	script.type = 'text/javascript';
	script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyCYXJZc_ouALNulqbg9ZivoqNYDd2qJfVY&libraries=places' + '&signed_in=true&callback=initMap';
	document.body.appendChild(script);
};

window.onload = loadScript;



var foursquareApi = 'https://api.foursquare.com/v2/venues/4075e780f964a52056f21ee3?client_id=3P0CNNUW5YA1QIJAQUVRR0H4UI4FVASXURVLXGP4AOMAHXIM&client_secret=NJFWJLYRXMAHO2W2F1SIGOTA5LMHMSUTGLM2XBRAXV5YMUBM&v=20150401';

// Venue ID's are provided by foursquare.com
var initialPlaces = [
	{
		name: 'Soda Bar',
		foursquareID: '4075e780f964a52056f21ee3',
		latitude: '40.678396',
		longitude: '-73.968349'
	},
	{
		name: 'Brooklyn Roasting Co.',
		latitude: '40.704334',
		longitude: '-73.986524'
	},
	{
		name: 'Prospect Park',
		latitude: '40.661034',
		longitude: '-73.968876'
	}
];

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
