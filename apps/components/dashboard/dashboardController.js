LEEDOnApp.controller('dashboardController', function($rootScope, $scope, $window, $ocLazyLoad, $stateParams) {
	$rootScope.header        = 'Dashboard';
	$rootScope.main_appClass = '';
	$rootScope.bodyLayout    = '';
	$rootScope.htmlLayout    = 'js flexbox canvas canvastext webgl no-touch geolocation postmessage websqldatabase indexeddb hashchange history draganddrop websockets rgba hsla multiplebgs backgroundsize borderimage borderradius boxshadow textshadow opacity cssanimations csscolumns cssgradients cssreflections csstransforms csstransforms3d csstransitions fontface no-generatedcontent video audio localstorage sessionstorage webworkers applicationcache svg inlinesvg smil svgclippaths';
	$scope.leed_id           = $stateParams.leed_id;

	$http.get('assets/json/building_1000000117.json').success(function(data) {
		$scope.building_name    = data.name;
		$scope.building_address = data.city + ', ' + data.state + ', ' + data.country
	});

	
	

	$scope.redirectToGBIG = function () {
        $window.open('http://www.gbig.org/activities/leed-' + $scope.leed_id, '_blank');
    };
    // $ocLazyLoad.load('testModule.js');
});