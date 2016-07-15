LEEDOnApp.controller('scoreController', function($rootScope, $scope) {
	$rootScope.header = 'Score';
	if (document.URL.indexOf('modal=projectActive') > -1){
		$('.addNewBuilding').modal('hide');
	}
});