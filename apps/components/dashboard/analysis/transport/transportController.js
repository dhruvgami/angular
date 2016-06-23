LEEDOnApp.controller('transportAnalysisController', function($rootScope, $scope) {
	$rootScope.analysis_header = 'Transit Analysis';
	document.getElementById("energy_cat_color_angular").style.display    = "none";
	document.getElementById("water_cat_color_angular").style.display     = "none";
	document.getElementById("waste_cat_color_angular").style.display     = "none";
	document.getElementById("human_cat_color_angular").style.display     = "none";
	document.getElementById("transport_cat_color_angular").style.display = "block";
});