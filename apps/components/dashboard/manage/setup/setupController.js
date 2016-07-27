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

	$('body').on('click', '#plaque_link', function(e)
    {
        window.open($('#plaque_link').val(), '_blank'); 
        e.stopPropagation();
        e.preventDefault();
        return false;
    });
    $('body').on('click', '#survey_link', function(e)
    {
        window.open('assets/files/LEED_Dynamic_Plaque_Manual.pdf');
        e.stopPropagation();
        e.preventDefault();
        return false;
    });
});