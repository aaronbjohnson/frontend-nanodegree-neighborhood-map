var infowindow = new google.maps.InfoWindow();


//TODO: Ok, so may put the "Pin" stuff under here and follow that guy's thing...
var Place = function(data) {
    var self = this;

    this.name = ko.observable(data.name);
    this.lat = ko.observable(data.lat);
    this.long = ko.observable(data.long);

    var titleString = String(data.name);

    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(data.lat, data.long),
        title: titleString,
        map: map
    });

    google.maps.event.addListener(marker, 'click', function () {
        map.panTo(marker.position);
        infowindow.open(map, marker);
        infowindow.setContent(titleString);
    });

    markers.push(marker);

};

// So maybe make this an observable array...
var markers = ko.observableArray([]);

var mapCanvas = document.getElementById('map-canvas');
var mapOptions = { center: { lat: 40.675087, lng: -73.975524},
    zoom: 12,
    disableDefaultUI: true
    };

map = new google.maps.Map(mapCanvas, mapOptions);

// All this should be in the view at some point probably...??
/*
function initMap() {
    var mapOptions = {
        center: { lat: 40.675087, lng: -73.975524},
        zoom: 12,
        disableDefaultUI: true
    };

    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
}*/

/* http://softwarewalker.com/2014/05/07/using-google-maps-in-a-responsive-design/
 * This resizes the map
 */
function resizeBootstrapMap() {
    var mapParentWidth = $('#mapContainer').width();
    $('#map-canvas').width(mapParentWidth);
    $('#map-canvas').height(3 * mapParentWidth / 4);
    google.maps.event.trigger($('#map-canvas'), 'resize');
    console.log(mapParentWidth);
}

// resize the map whenever the window resizes
$(window).resize(resizeBootstrapMap);

// Triggers the marker click, 'id' is the reference index to the 'markers' array.
// http://stackoverflow.com/questions/18333679/google-maps-open-info-window-after-click-on-a-link
function myClick(id) {
    google.maps.event.trigger(markers[id], 'click');
};

/*
function loadScript() {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyCYXJZc_ouALNulqbg9ZivoqNYDd2qJfVY&libraries=places' + '&signed_in=true&callback=initMap';
    document.body.appendChild(script);
};

window.onload = loadScript;
*/


var foursquareApi = 'https://api.foursquare.com/v2/venues/4075e780f964a52056f21ee3?client_id=3P0CNNUW5YA1QIJAQUVRR0H4UI4FVASXURVLXGP4AOMAHXIM&client_secret=NJFWJLYRXMAHO2W2F1SIGOTA5LMHMSUTGLM2XBRAXV5YMUBM&v=20150401';

// Venue ID's are provided by foursquare.com

var initialPlaces = [
    { 
        name: 'Soda Bar',
        lat: '40.678396',
        long: '-73.968349'
    },
    {
        name: 'Brooklyn Roasting Co.',
        lat: '40.704334',
        long: '-73.986524'
    },
    {
        name: 'Prospect Park',
        lat: '40.661034',
        long: '-73.968876'
    }
];

// Here defining a "Place" so that the ViewModel can connect to the Model...



var ViewModel = function() {
    var self = this;

    this.places = ko.observableArray([
        /*
        new Place('Soda Bar', '40.678396', '-73.968349'),
        new Place('Brooklyn Roasting Co.', '40.678396', '-73.986524'),
        new Place('Prospect Park', '40.661034', '-73.968876')
        */
        ]);

    this.placeList = ko.observableArray([]);

    initialPlaces.forEach(function(placeItem){
        self.placeList.push( new Place(placeItem));
        console.log(placeItem);
    });

    this.currentPlace = ko.observable(this.placeList()[0]);

    this.setPlace = function(clickedPlace) {
        self.currentPlace(clickedPlace);
        infowindow.open(map, marker);
    };
    /*
     * Create a thing to hold search entry
     */
    this.searchEntry = ko.observable('things will go here one day...ok?')
};

ko.applyBindings(new ViewModel());
