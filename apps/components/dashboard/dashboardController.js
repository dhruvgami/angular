LEEDOnApp.controller('dashboardController', function($rootScope, $scope, $window, $ocLazyLoad) {
	$rootScope.header = 'Dashboard';
	$rootScope.main_appClass = '';
	$rootScope.bodyLayout = '';
	$rootScope.htmlLayout = 'js flexbox canvas canvastext webgl no-touch geolocation postmessage websqldatabase indexeddb hashchange history draganddrop websockets rgba hsla multiplebgs backgroundsize borderimage borderradius boxshadow textshadow opacity cssanimations csscolumns cssgradients cssreflections csstransforms csstransforms3d csstransitions fontface no-generatedcontent video audio localstorage sessionstorage webworkers applicationcache svg inlinesvg smil svgclippaths';
	$scope.redirectToGBIG = function () {
        $window.open('http://www.gbig.org/activities/leed-' + '1000000117', '_blank');
    };
    $ocLazyLoad.load('testModule.js');
});