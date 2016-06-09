LEEDOnApp.controller('homeController', function($rootScope, $scope) {
	$rootScope.header = 'LEED Dynamic Plaque';
	var el = angular.element(document.querySelector('body'));
	el.attr('data-spy', 'scroll');
	el.attr('data-target', '.navbar-collapse');
});