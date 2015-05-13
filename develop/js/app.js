var map, infowindow;

var gmarkers = [];

var foursquareApi = 'https://api.foursquare.com/v2/venues/search?client_id=' +
    '3P0CNNUW5YA1QIJAQUVRR0H4UI4FVASXURVLXGP4AOMAHXIM&client_secret=' + 
    'NJFWJLYRXMAHO2W2F1SIGOTA5LMHMSUTGLM2XBRAXV5YMUBM&v=20150401';
var googleStreetview = 'https://maps.googleapis.com/maps/api/streetview?size=' + 
    '300x150&location=';

var ViewModel = function() {
    // Data

    var self = this;
    
    self.locations = ko.observableArray([
        {name: "Soda Bar", latitude:40.678396 , longitude:-73.968349, pinId:0},
        {name: "Brooklyn Roasting Co.", latitude: 40.704334, longitude: -73.986524, pinId:1},
        {name: "Prospect Park", latitude: 40.661034, longitude: -73.968876, pinId:2},
        {name: "Brooklyn Public Library", latitude: 40.672371, longitude: -73.968254, pinId:3},
        {name: "Brooklyn Museum", latitude: 40.671207, longitude: -73.963619, pinId:4},
        {name: "Metropolitan Museum of Art", latitude: 40.779413, longitude: -73.963260, pinId:5},
        {name: "Lexington Candy Shop", latitude: 40.777467, longitude: -73.957295, pinId:6}
    ]);

    self.markers = ko.observable(gmarkers);
    self.filter = ko.observable('');

    // Behaviors

    self.apiRequest = function(marker) {
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

    // Making a Knockout binding handler to create the map.
    ko.bindingHandlers.googlemap = {
        init: function (element, valueAccessor) {
            var
              value = valueAccessor(),
              mapOptions = {
                zoom: 12,
                center: new google.maps.LatLng(value.centerLat, value.centerLon),
                mapTypeId: google.maps.MapTypeId.ROADMAP
                };
              map = new google.maps.Map(element, mapOptions);

              infowindow = new google.maps.InfoWindow();

              var image = 'develop/images/star.png';
              
            for (var l in value.locations())
            {
                var latLng = new google.maps.LatLng(
                                value.locations()[l].latitude, 
                                value.locations()[l].longitude);
                var marker = new google.maps.Marker({
                    position: latLng,
                    map: map,

                    title: value.locations()[l].name,
                    icon: image
                });

                google.maps.event.addListener(marker, 'click', (function(marker) {
                    return function() {
                        map.panTo(marker.position);
                        infowindow.setContent(marker.title + "<div id='content'></div>");
                        infowindow.open(map, marker);
                        self.apiRequest(marker);
                    };
                })(marker));

                // Push the marker to the gmarkers array
                gmarkers.push(marker);
            }
        }
    };
    
    /**
     * Function that will open a marker's infowindow when the user clicks on an
     * item from the list.
     */
    self.openWindow = function(locations) {
        var lat = locations.latitude;
        var lng = locations.longitude;
        var pin = gmarkers[locations.pinId];

        infowindow.open(map, pin);
        infowindow.setContent(pin.title + '<div id="content"></div>');
        self.apiRequest(pin);
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
        return ko.utils.arrayFilter(self.locations(), function(location) {
            return location.name.toLowerCase().indexOf(filter) !== -1;
        });
    };

    /**
     * After filtering the items, the displaySelected function calls setMap on 
     * those items -- which display's their markers on the map.
     */
    self.displaySelected = function(filteredMarkers) {
        for (var i = 0; i < filteredMarkers.length; i++) {
            gmarkers[filteredMarkers[i].pinId].setMap(map);
        }
    };

    /**
     * This function checks to see if there is anything to be filtered. If 
     * there's nothing to be filtered, it will display the entire item list and
     * all the markers.
     */
    self.filteredItems = ko.computed(function() {
        var filter = self.filter().toLowerCase();
        if (!filter) {
            self.toggleMarkers(map);
            return self.locations();
        } else {
            self.toggleMarkers(null);
            var filteredMarkers = [];
            filteredMarkers = self.filterArray(filter);
            self.displaySelected(filteredMarkers);
            return filteredMarkers;
        }
    }, self);
};
    
ko.applyBindings(new ViewModel());
