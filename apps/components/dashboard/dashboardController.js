LEEDOnApp.controller('dashboardController', function($rootScope, $scope, $ocLazyLoad) {
	$rootScope.header = 'Dashboard';
	var el = angular.element(document.querySelector('#main_app'));
	el.removeAttr('data-spy');
	el.removeAttr('data-target');
});