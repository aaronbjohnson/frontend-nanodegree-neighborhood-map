var map, infowindow;

var gmarkers = [];

ko.bindingHandlers.googlemap = {
    init: function (element, valueAccessor) {
        var
          value = valueAccessor(),
          mapOptions = {
            zoom: 12,
            center: new google.maps.LatLng(value.centerLat, value.centerLon),
            mapTypeId: google.maps.MapTypeId.ROADMAP
            },
          map = new google.maps.Map(element, mapOptions);

          // adding stuff
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
                // adding here
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
    self.filter = ko.observable('');

    // Behaviors
    self.goToLocation = function(location) {
        self.chosenLocationId(location);
    };

    self.openWindow = function(locations) {
        //new trying
        var pin = gmarkers[locations.pinId];
        //var latLng = new google.maps.LatLng(locations.latitude, locations.longitude);
        console.log(map);
        //map.panTo(latLng);
        infowindow.open(map, pin);
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
