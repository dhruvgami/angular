LEEDOnApp.controller('dashboardController', function($rootScope, $scope, $http, $window, $stateParams, $ocLazyLoad) {
	$rootScope.header        = 'Dashboard';
	$rootScope.main_appClass = '';
	$rootScope.bodyLayout    = '';
	$rootScope.htmlLayout    = 'js flexbox canvas canvastext webgl no-touch geolocation postmessage websqldatabase indexeddb hashchange history draganddrop websockets rgba hsla multiplebgs backgroundsize borderimage borderradius boxshadow textshadow opacity cssanimations csscolumns cssgradients cssreflections csstransforms csstransforms3d csstransitions fontface no-generatedcontent video audio localstorage sessionstorage webworkers applicationcache svg inlinesvg smil svgclippaths';
	$scope.leed_id           = $stateParams.leed_id;
    $ocLazyLoad.load('assets/js/manualMeterSetup.js?v-11.96');

	$http.get('assets/json/building_' + $scope.leed_id + '.json').success(function(data) {
		$scope.building_name = data.name;
		$scope.building_data = data;
		if ($scope.building_data.state == $scope.building_data.country){
            $scope.building_address = $scope.building_data.city + ', ' + $scope.building_data.country;
        }
        else{
            if (isNaN($scope.building_data.state.split($scope.building_data.country)[1])){
                $scope.building_address = $scope.building_data.city + ', ' + $scope.building_data.state.split($scope.building_data.country)[1] + ', ' + $scope.building_data.country;
            }
            else{
                $.ajax({
                  type: "GET",
                  contentType: 'application/json',
                  url: "/buildings/LEED:" + plaque.LEED + "/getencodedcountrystate/"
                }).done(function(getencodedcountrystate_data) {
                    $scope.building_address = $scope.building_data.city + ', ' + getencodedcountrystate.state + ', ' + $scope.building_data.country;
                });
            }
        }
	});

	$http.get('assets/json/performance_' + $scope.leed_id + '.json').success(function(data) {
		$scope.performance_data = data;
	});

	
	$scope.redirectToGBIG = function () {
        $window.open('http://www.gbig.org/activities/leed-' + $scope.leed_id, '_blank');
    };
    // $ocLazyLoad.load('testModule.js');
});