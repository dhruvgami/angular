LEEDOnApp.controller('loginController', function($rootScope, $scope, $ocLazyLoad) {
	$rootScope.header = 'Login';

	var el = angular.element(document.querySelector('#main_app'));
	el.removeAttr('data-spy');
	el.removeAttr('data-target');
	$ocLazyLoad.load('assets/js/login-login_closeFrame.js?v=4.2');

});