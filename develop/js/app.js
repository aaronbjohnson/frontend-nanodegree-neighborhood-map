var gmarkers = [];

var map, infowindow, marker, initialPlaces;

// Model array to hold data for each favorite venue
initialPlaces = [
    {
        name: 'Soda Bar',
        lat: 40.678396,
        lng: -73.968349,
        pinID: 0
    },
    {
        name: 'Brooklyn Roasting Co.',
        lat: 40.704334,
        lng: -73.986524,
        pinID: 1
    },
    {
        name: 'Prospect Park',
        lat: 40.661034,
        lng: -73.968876,
        pinID: 2
    },
    {
        name: 'Brooklyn Public Library',
        lat: 40.672371,
        lng: -73.968254,
        pinID: 3
    },
    {
        name: 'Brooklyn Museum',
        lat: 40.671207,
        lng: -73.963619,
        pinID: 4
    }
];

/* 
 * http://stackoverflow.com/questions/18333679/google-maps-open-info-window-
 * after-click-on-a-link
 * Reference for making a loop to create markers
 */ 
var initMap = function() {
    var mapOptions = {
        center: {lat: 40.675087, lng: -73.975524},
        zoom: 12
    };

    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

    infowindow = new google.maps.InfoWindow();

    // Add image for custom map icon
    var image = 'develop/images/star.png';

    var i;
    for (i = 0; i < initialPlaces.length; i++) {
        marker = new google.maps.Marker({
            position: new google.maps.LatLng(initialPlaces[i].lat, +
                initialPlaces[i].lng),
            title: initialPlaces[i].name,
            map: map,
            icon: image
        });
        // removed i from function arguments
        google.maps.event.addListener(marker, 'click', (function(marker) {
            return function() {
                // div content not working
                infowindow.setContent(marker.title + "<div id='content'></div>");
                infowindow.open(map, marker);
                apiRequest(marker);
            }
        })(marker));

        // Push the marker to the 'gmarkers' array
        gmarkers.push(marker);
    };
}


var foursquareApi = 'https://api.foursquare.com/v2/venues/search?client_id=' +
    '3P0CNNUW5YA1QIJAQUVRR0H4UI4FVASXURVLXGP4AOMAHXIM&client_secret=' + 
    'NJFWJLYRXMAHO2W2F1SIGOTA5LMHMSUTGLM2XBRAXV5YMUBM&v=20150401';
var googleStreetview = 'https://maps.googleapis.com/maps/api/streetview?size=' + 
    '400x200&location=';

var apiRequest = function(marker) {
    var lat = marker.position.lat(); 
    var lng = marker.position.lng();

    var $windowContent = $('#content');

    var url = foursquareApi + '&ll=' + lat + ',' + lng + '&query=\'' + 
        marker.title + '\'&limit=1';

    $.getJSON(url, function(response) {
        var venue = response.response.venues[0];
        var venuePhone = venue.contact.formattedPhone;
        var venueAddress = venue.location.formattedAddress;
        var venueStreet = venue.location.address;
        var venueCity = venue.location.city;
        var venueCountry = venue.location.country;
        var venueLocation = venueStreet + venueCity + venueCountry;
        var streetPhotoUrl = googleStreetview + venueLocation;

        // Handles undefined error if phone number cannot be found
        if (venuePhone === undefined) {
            venuePhone = '<i>Could not find phone number for this location<i>';
        } else {
            venuePhone = venuePhone;
        }

        $windowContent.append('<p>' + venuePhone + '</p>');
        $windowContent.append('<p>' + venueAddress + '</p>');
        $windowContent.append('<img class="street-img" src="' + streetPhotoUrl +
            '">');
    }).error(function(err) {
        $windowContent.text('No information can be retrieved at this time.');
    });
}

var ViewModel = function() {
    var self = this;

    self.placeList = ko.observableArray(initialPlaces);

    self.markers = ko.observableArray(gmarkers);
    // got this from neighborhood explorer master repository
    self.filter = ko.observable('');

    /* 
     * Create a function that will open a marker's infowindow when an item from
     * the list is clicked on.
     */
    self.openWindow = function(initialPlaces) {
        var pin = gmarkers[initialPlaces.pinID];

        infowindow.open(map, pin);
        infowindow.setContent(pin.title + '<div id="content"></div>');
        apiRequest(pin);
    }

    /*
     * 
     */
    self.toggleMarkers = function(state) {
        for (var i = 0; i < gmarkers.length; i++) {
            gmarkers[i].setMap(state);
        };
    }

    self.filterArray = function(filter) {
        return ko.utils.arrayFilter(self.placeList(), function(location) {
            return location.name.toLowerCase().indexOf(filter) >= 0;
        })
    }

    self.displaySelected = function(filteredmarkers) {
        for (var i = 0; i < filteredmarkers.length; i++) {
            gmarkers[filteredmarkers[i].pinID].setMap(map);
        };
    }

    self.filterList = function() {
        var filter = self.filter().toLowerCase();
        if (!filter) {
            self.toggleMarkers(map);
            return self.placeList();
        } else {
            self.toggleMarkers(null)
            var filteredmarkers = [];
            filteredmarkers = self.filterArray(filter);
            self.displaySelected(filteredmarkers);
            return filteredmarkers;
        }
    }
};

google.maps.event.addDomListener(window, 'load', initMap);

ko.applyBindings(new ViewModel());
