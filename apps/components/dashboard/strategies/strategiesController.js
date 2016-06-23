LEEDOnApp.controller('strategiesController', function($rootScope, $scope) {
	$rootScope.header = 'Strategies';
	$scope.isActive_ea = false;
	$scope.isActive_ss = false;
	$scope.isActive_we = false;
	$scope.isActive_mr = false;
	$scope.isActive_iq = false;
	$scope.isActive_lt = false;
	$scope.activeButton_ea = function() {
		$scope.isActive_ea = !$scope.isActive_ea;
		if ($scope.isActive_ea){
			document.getElementById('parent-section-ea').style.display = "block";
		}
		else{
			document.getElementById('parent-section-ea').style.display = "none";
		}
	}
	$scope.activeButton_ss = function() {
		$scope.isActive_ss = !$scope.isActive_ss;
		if ($scope.isActive_ss){
			document.getElementById('parent-section-ss').style.display = "block";
		}
		else{
			document.getElementById('parent-section-ss').style.display = "none";
		}
	}
	$scope.activeButton_we = function() {
		$scope.isActive_we = !$scope.isActive_we;
		if ($scope.isActive_we){
			document.getElementById('parent-section-we').style.display = "block";
		}
		else{
			document.getElementById('parent-section-we').style.display = "none";
		}
	}
	$scope.activeButton_mr = function() {
		$scope.isActive_mr = !$scope.isActive_mr;
		if ($scope.isActive_mr){
			document.getElementById('parent-section-mr').style.display = "block";
		}
		else{
			document.getElementById('parent-section-mr').style.display = "none";
		}
	}
	$scope.activeButton_iq = function() {
		$scope.isActive_iq = !$scope.isActive_iq;
		if ($scope.isActive_iq){
			document.getElementById('parent-section-iq').style.display = "block";
		}
		else{
			document.getElementById('parent-section-iq').style.display = "none";
		}
	}
	$scope.activeButton_lt = function() {
		$scope.isActive_lt = !$scope.isActive_lt;
		if ($scope.isActive_lt){
			document.getElementById('parent-section-lt').style.display = "block";
		}
		else{
			document.getElementById('parent-section-lt').style.display = "none";
		}
	}
});