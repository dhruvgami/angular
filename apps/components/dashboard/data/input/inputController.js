LEEDOnApp.controller('inputController', function($rootScope, $scope) {
	$rootScope.header = 'Data Input';
	document.getElementById("manual_img").style.display = "block";
	$scope.selectedTab = 'energy';
});