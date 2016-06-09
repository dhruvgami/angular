LEEDOnApp.controller('dashboardController', function($rootScope, $scope) {
	$rootScope.header = 'Dashboard';
	var el = angular.element(document.querySelector('body'));
	el.removeAttr('data-spy');
	el.removeAttr('data-target');
});