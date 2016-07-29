LEEDOnApp.controller('setupController', function($rootScope, $scope, $http) {
	$rootScope.header = 'Setup';
	$http.get('assets/json/building_' + window.leed_id + '.json').success(function(data) {
		document.getElementById("buildingname").value   = data.name;
		document.getElementById("projectid").value      = data.leed_id;
		document.getElementById("yearbuilt").value      = data.year_constructed;
		document.getElementById("streetaddress1").value = data.street;
		document.getElementById("city").value           = data.city;
		document.getElementById("country").value        = data.country;
		document.getElementById("zipcode").value        = data.zip_code;
		document.getElementById("state").value          = data.state;
		document.getElementById("floorarea").value      = data.gross_area;
		document.getElementById("totalHours").value     = data.operating_hours;
		document.getElementById("occupancy").value      = data.occupancy;
	});

	$scope.plaqueLink = function(){
		window.open('http://plaque.dev.leedon.io/plaque/LEED:' + $scope.leed_id + '/?key=' + $scope.building_data.key, '_blank'); 
        e.stopPropagation();
        e.preventDefault();
        return false;
	};

	$scope.manualLink = function(){
		window.open('assets/files/LEED_Dynamic_Plaque_Manual.pdf');
        e.stopPropagation();
        e.preventDefault();
        return false;
	};

	$scope.emailLink = function(){
		var val = encodeURI(window.location.protocol + '//' + window.location.hostname + "#/dashboard/" + $scope.leed_id + "/data/survey");
        var url = val.replace(/&/g, "%26");
        var message = 'Hi there,%0A%0APlease fill out this quick survey to help us better understand our building performance and to make you as comfortable as possible. Click below to begin.%0A%0A' + url + ' %0A%0AThank you for your important contributions to our LEED Dynamic Plaque data!%0A%0AWant to learn more about how we use the LEED Dynamic Plaque to track building performance? Visit leedon.io.';
        window.open('mailto:?subject=LEED Dynamic Plaque - Survey Link&body=' + message, '_self');
	};
});