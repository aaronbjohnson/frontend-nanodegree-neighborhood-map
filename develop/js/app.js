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
                    apiRequest(marker);
                };
            })(marker));


        }
    }
};

var ViewModel = function() {
    // Data
    var self = this;
    self.locations = ko.observableArray([
        {name: "Soda Bar", latitude:40.678396 , longitude:-73.968349},
        {name: "Brooklyn Roasting Co.", latitude: 40.704334, longitude: -73.986524}
    ]);
    self.chosenLocationId = ko.observable();
    self.filter = ko.observable('');


    // Behaviors
    self.goToLocation = function(location) {
        self.chosenLocationId(location);
        //new trying
        var latlng = new google.maps.LatLng(locations.latitude, + locations.longitude);

        map.panTo(latlng);
        infowindow.open(map, chosenLocationId);
        infowindow.setContent(chosenLocationId.title + '<div id="content"></div>');
        apiRequest(chosenLocationId);
    };

    /* Create a thing*/
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
/*
// Search Function

    self.firstMatch = ko.computed(function() {
        var search = this.search().toLowerCase();
        if (!search) {
            return null;
        } else {
            return ko.utils.arrayFirst(this.filteredItems(), function(item) {
                return location.name.toLowerCase().indexOf(search) !== -1;
            });
        }
    }, self);
*/
};
    
ko.applyBindings(new ViewModel());
