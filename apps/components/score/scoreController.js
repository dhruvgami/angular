LEEDOnApp.controller('scoreController', function($rootScope, $scope, $ocLazyLoad) {
	$rootScope.header = 'Score';
	var el = angular.element(document.querySelector('#main_app'));
	el.removeAttr('data-spy');
	el.removeAttr('data-target');
	$ocLazyLoad.load(['assets/libs/js/countries_states.js?v=1', 'assets/js/dashboard-script.js?v=1']);
});