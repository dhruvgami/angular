LEEDOnApp.controller('teamController', function($rootScope, $scope, $http) {
	$rootScope.header = 'Team';
	$scope.teamMember = [];
	$http.get('assets/json/teamMember.json').success(function(json_data) {
       $scope.teamMember = json_data; 
    });

    $scope.edit_team_permission = function(event) {
    	$(event.target).parent().parent().find('.permission_dropdown_TM').prop("disabled", false);
		$(event.target).parent().parent().find('.permission_dropdown_TM').removeClass("permission_dropdown_disabled_TM");
    };

    $scope.addTeamMember = function(event) {
		$('#add_team_members_modal').modal('show');
    };
});