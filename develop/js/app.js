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