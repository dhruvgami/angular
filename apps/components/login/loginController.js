LEEDOnApp.controller('loginController', function($rootScope, $scope) {
	$rootScope.header = 'Login';
	var el = angular.element(document.querySelector('body'));
	el.removeAttr('data-spy');
	el.removeAttr('data-target');
});