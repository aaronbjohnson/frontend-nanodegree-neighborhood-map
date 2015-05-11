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
          
        for (var l in value.locations())
        {
            var latLng = new google.maps.LatLng(
                            value.locations()[l].latitude, 
                            value.locations()[l].longitude);
            var marker = new google.maps.Marker({
                position: latLng,
                map: map
              });
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

    // Behaviors
    self.goToLocation = function(location) {
        self.chosenLocationId(location);
    };
}
    
ko.applyBindings(new ViewModel());
