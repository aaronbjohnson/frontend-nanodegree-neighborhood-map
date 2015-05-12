var map, infowindow;

var gmarkers = [];

var foursquareApi = 'https://api.foursquare.com/v2/venues/search?client_id=' +
    '3P0CNNUW5YA1QIJAQUVRR0H4UI4FVASXURVLXGP4AOMAHXIM&client_secret=' + 
    'NJFWJLYRXMAHO2W2F1SIGOTA5LMHMSUTGLM2XBRAXV5YMUBM&v=20150401';
var googleStreetview = 'https://maps.googleapis.com/maps/api/streetview?size=' + 
    '300x150&location=';





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







ko.bindingHandlers.googlemap = {
    init: function (element, valueAccessor) {
        var
          value = valueAccessor(),
          mapOptions = {
            zoom: 12,
            center: new google.maps.LatLng(value.centerLat, value.centerLon),
            mapTypeId: google.maps.MapTypeId.ROADMAP
            }
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
                    // apiRequest(marker);
                };
            })(marker));

            // Push the marker to the gmarkers array
            gmarkers.push(marker);
        }
    }
};

var ViewModel = function() {
    // Data
    var self = this;
    
    self.locations = ko.observableArray([
        {name: "Soda Bar", latitude:40.678396 , longitude:-73.968349, pinId:0},
        {name: "Brooklyn Roasting Co.", latitude: 40.704334, longitude: -73.986524, pinId:1}
    ]);

    self.markers = ko.observable(gmarkers);
    self.chosenLocationId = ko.observable();
    // Define a chosenApiData property on ViewModel
    self.chosenApiData = ko.observable();
    self.filter = ko.observable('');

    // Behaviors

    self.openWindow = function(locations) {
        var lat = locations.latitude;
        var lng = locations.longitude;
        var pin = gmarkers[locations.pinId];

        // Added this stuff in
        var url = foursquareApi + '&ll=' + lat + ',' + lng + '&query=\'' + 
            pin.title + '\'&limit=1';


        self.chosenLocationId(locations);
        // When user clicks on list item, populate chosenApiData by performing an Ajax request:
        $.get(url, {}, self.chosenApiData);



        //var latLng = new google.maps.LatLng(locations.latitude, locations.longitude);
        //map.panTo(latLng);
        infowindow.open(map, pin);
        // we may need to remove the <div===content>> stuff out of here because
        // we may be putting this stuff on the View (HTML)...after all, that was
        // our problem before right? Right?
        infowindow.setContent(pin.title + '<div id="content"></div>');
        // apiRequest(pin);
    };

    // Search filter
    self.filteredItems = ko.computed(function() {
        var filter = self.filter().toLowerCase();
        if (!filter) {
            return self.locations();
        } else {
            return ko.utils.arrayFilter(self.locations(), function(location) {
                return location.name.toLowerCase().indexOf(filter) !== -1;
            });
        }
    }, self);
};
    
ko.applyBindings(new ViewModel());
