LEEDOnApp.controller('dataController', function($rootScope, $scope) {
	$rootScope.header = 'Data';
	$scope.openAddMeterModal = function () {
        $('#manual_meter_setup').modal('show');
    };
});