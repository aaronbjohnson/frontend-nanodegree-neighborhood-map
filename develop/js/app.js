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
    },
    {
        name: 'Metropolitan Museum of Art',
        lat: 40.779413,
        lng: -73.963260,
        pinID: 5
    },
    {
        name: 'Lexington Candy Shop',
        lat: 40.777467,
        lng: -73.957295,
        pinID: 6
    }
];


var foursquareApi = 'https://api.foursquare.com/v2/venues/search?client_id=' +
    '3P0CNNUW5YA1QIJAQUVRR0H4UI4FVASXURVLXGP4AOMAHXIM&client_secret=' + 
    'NJFWJLYRXMAHO2W2F1SIGOTA5LMHMSUTGLM2XBRAXV5YMUBM&v=20150401';
var googleStreetview = 'https://maps.googleapis.com/maps/api/streetview?size=' + 
    '300x150&location=';

/**
 * Sends an API request to Foursquare and returns the venue's phone number, 
 * address, street number, city and country. This also sends a Google Street
 * View API request and returns a street view of that location based off of the 
 * street number, city, and country -- provided by the Foursquare API. This
 * information is then used to populate an infowindow. 
 */

var apiRequest = function(marker) {
    "use strict";
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
};

var ViewModel = function() {
    "use strict";
    var self = this;

    self.placeList = ko.observableArray(initialPlaces);

    self.markers = ko.observableArray(gmarkers);

    self.filter = ko.observable('');

    /**
     * http://stackoverflow.com/questions/18333679/google-maps-open-info-window-
     * after-click-on-a-link
     * Reference for making a loop to create markers
     */ 
    function createMap() {
      
        var mapOptions = {
            center: {lat: 40.722827, lng: -73.968343},
            zoom: 12
        };

        map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

        infowindow = new google.maps.InfoWindow();

        // Add image for custom map icon
        var image = 'develop/images/star.png';

        /**
         * Loop over the initialPlaces and create a Google Map marker for each item. 
         * Push these markers to the gmarkers array.
         * http://stackoverflow.com/questions/15531390/adding-array-of-markers-in- 
         * google-map
         */
        var i;
        for (i = 0; i < initialPlaces.length; i++) {
            marker = new google.maps.Marker({
                position: new google.maps.LatLng(initialPlaces[i].lat, +
                    initialPlaces[i].lng),
                title: initialPlaces[i].name,
                map: map,
                icon: image
            });

            google.maps.event.addListener(marker, 'click', (function(marker) {
                return function() {
                    map.panTo(marker.position);
                    infowindow.setContent(marker.title + "<div id='content'></div>");
                    infowindow.open(map, marker);
                    apiRequest(marker);
                };
            })(marker));

            // Push the marker to the 'gmarkers' array
            gmarkers.push(marker);
        }
    }

    /**
     * Create a function that will open a marker's infowindow when the user 
     * clicks on an item from the list. Also, pans the map view to center on the
     * marker.
     */
    self.openWindow = function(initialPlaces) {
        var pin = gmarkers[initialPlaces.pinID];
        var latLng = new google.maps.LatLng(initialPlaces.lat, +
            initialPlaces.lng);

        map.panTo(latLng);
        infowindow.open(map, pin);
        infowindow.setContent(pin.title + '<div id="content"></div>');
        apiRequest(pin);
    };

    // Function that will be used to turn the gmarkers on or off.

    self.toggleMarkers = function(toggle) {
        for (var i = 0; i < gmarkers.length; i++) {
            gmarkers[i].setMap(toggle);
        }
    };

    /**
     * Function that uses Knockout's arrayFilter utility function to pass in the
     * placeList array and control which items are filtered based on the result
     * of the function -- executed on each placeList item -- that returns those
     * items who's name matches the search input.
     * http://www.knockmeout.net/2011/04/utility-functions-in-knockoutjs.html
     */

    self.filterArray = function(filter) {
        return ko.utils.arrayFilter(self.placeList(), function(item) {
            return item.name.toLowerCase().indexOf(filter) >= 0;
        });
    };

    /**
     * After filtering the items, the displaySelected function calls setMap on 
     * those items -- which display's their markers on the map.
     */
    self.displaySelected = function(filteredmarkers) {
        for (var i = 0; i < filteredmarkers.length; i++) {
            gmarkers[filteredmarkers[i].pinID].setMap(map);
        }
    };

    /**
     * This function checks to see if there is anything to be filtered. If 
     * there's nothing to be filtered, it will display the entire item list.
     */
    self.filterList = function() {
        var filter = self.filter().toLowerCase();
        if (!filter) {
            self.toggleMarkers(map);
            return self.placeList();
        } else {
            self.toggleMarkers(null);
            var filteredmarkers = [];
            filteredmarkers = self.filterArray(filter);
            self.displaySelected(filteredmarkers);
            return filteredmarkers;
        }
    };
    google.maps.event.addDomListener(window, 'load', createMap);
};

ko.applyBindings(new ViewModel());