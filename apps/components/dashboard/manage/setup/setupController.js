LEEDOnApp.controller('setupController', function($rootScope, $scope, $http) {
	$rootScope.header = 'Setup';
	$http.get('assets/json/building_1000000117.json').success(function(data) {
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
});