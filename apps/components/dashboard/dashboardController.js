LEEDOnApp.controller('dashboardController', function($rootScope, $scope, $http, $window, $stateParams, $ocLazyLoad) {
	$rootScope.header        = 'Dashboard';
	$rootScope.main_appClass = '';
	$rootScope.bodyLayout    = '';
	// $rootScope.htmlLayout    = 'js flexbox canvas canvastext webgl no-touch geolocation postmessage websqldatabase indexeddb hashchange history draganddrop websockets rgba hsla multiplebgs backgroundsize borderimage borderradius boxshadow textshadow opacity cssanimations csscolumns cssgradients cssreflections csstransforms csstransforms3d csstransitions fontface no-generatedcontent video audio localstorage sessionstorage webworkers applicationcache svg inlinesvg smil svgclippaths';
	if ($stateParams.leed_id == "800000100"){
        localStorage.setItem($stateParams.leed_id + '_notification', 'full');
        window.trial_version_backend   = "True";
        window.building_status_backend = "False";
        window.trial_expire_backend    = "None";
    }
    else{
        localStorage.setItem($stateParams.leed_id + '_notification', 'nothing');
        window.trial_version_backend   = "False";
        window.building_status_backend = "True";
        window.trial_expire_backend    = "None";
    }
    $scope.leed_id                 = $stateParams.leed_id;
    window.leed_id                 = $scope.leed_id;
    window .section                = '';
    window.PAYMENT_VERSION         = 'V1';
    window.show_helptext           = "False";
    window.is_agreement_required   = "True";
    window.full_version_arr        = ["buildingInfo", "softwareSubscription", "hardwareSubscription", "orderSelection", "payment", "receipt", "buildingConfirmation", "teamManagement", "meterSetup"];
    $http.get('assets/json/countriesstates.json').success(function(json_data) {
        $rootScope.csJson = json_data;
        window.countries_states = json_data;
        $ocLazyLoad.load(['assets/libs/js/countries_states.js?v=1.2', 'assets/libs/js/countries_states.js?v=1.2', 'assets/js/manualMeterSetup.js?v-12.23', 'assets/js/survey.js?v-12.31', 'assets/libs/js/jquery-ui.js', 'assets/libs/js/jquery.timepicker.js', 'assets/js/notification.js?v-12.56', 'assets/js/activationFlow-v1.js?v-12.46']);
    });

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
                // $.ajax({
                //   type: "GET",
                //   contentType: 'application/json',
                //   url: "/buildings/LEED:" + plaque.LEED + "/getencodedcountrystate/"
                // }).done(function(getencodedcountrystate_data) {
                //     $scope.building_address = $scope.building_data.city + ', ' + getencodedcountrystate.state + ', ' + $scope.building_data.country;
                // });
            }
        }
	});

	$http.get('assets/json/performance_' + $scope.leed_id + '.json').success(function(data) {
		$scope.performance_data = data;
	});

	
	$scope.redirectToGBIG = function () {
        $window.open('http://www.gbig.org/activities/leed-' + $scope.leed_id, '_blank');
    };
});