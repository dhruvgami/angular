LEEDOnApp.controller('humanAnalysisController', function($rootScope, $scope) {
	$rootScope.analysis_header = 'Environment Analysis';
	document.getElementById("energy_cat_color_angular").style.display    = "none";
	document.getElementById("water_cat_color_angular").style.display     = "none";
	document.getElementById("waste_cat_color_angular").style.display     = "none";
	document.getElementById("human_cat_color_angular").style.display     = "block";
	document.getElementById("transport_cat_color_angular").style.display = "none";
});