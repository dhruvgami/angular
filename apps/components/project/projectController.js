LEEDOnApp.controller('projectController', function($rootScope, $scope, $http, $ocLazyLoad) {
	$rootScope.header = 'Projects';
	$rootScope.main_appClass = 'overflow_y_scroll';
	$rootScope.bodyLayout = '';
	// $rootScope.htmlLayout = 'js flexbox canvas canvastext webgl no-touch geolocation postmessage websqldatabase indexeddb hashchange history draganddrop websockets rgba hsla multiplebgs backgroundsize borderimage borderradius boxshadow textshadow opacity cssanimations csscolumns cssgradients cssreflections csstransforms csstransforms3d csstransitions fontface generatedcontent video audio localstorage sessionstorage webworkers applicationcache svg inlinesvg smil svgclippaths';
	$scope.loading_more_projects = false;
    angular.module('infinite-scroll').value('THROTTLE_MILLISECONDS', 1000)
    $scope.buildings = [];
    $http.get('assets/json/countriesstates.json').success(function(json_data) {
        $rootScope.csJson = json_data;
        window.countries_states = json_data;
        $ocLazyLoad.load(['assets/libs/js/countries_states.js?v=1.2']);
    });

    $scope.openNewProjectModal = function () {
        $('.publicForm').each(function()
        {
            $(this).val("");
        });
        $('#bNameForm').val($('#id_building').val());
        $('.addNewBuilding').modal('show');
    };

    $scope.createNewProject = function () {
        $('.loader_bg_add_new').show();
        setTimeout(function(){
            $('.loader_bg_add_new').hide();
            $('.addNewBuilding').modal('hide');
            location.href = "#/dashboard/800000100/score/?modal=projectActive"; 
        }, 1000);
    };
	
    function filterBuildingdata(data){
        for (var i in data)
        {
            back = data[i].state;
            if (back == null)
            {
                back = 'None';
                data[i].state = 'None';
            }

            data[i].state = data[i].state.substr(2);
            if(data[i].state.length == 0 || back == 'None')
            {
                data[i].state = 'None';   
            }
            else if(data[i].state.length == 2 || data[i].state.length == 1)
            {
                if(data[i].state != data[i].country) 
                {
                    try {
                        data[i].state = $rootScope.csJson['divisions'][data[i].country][data[i].state]
                    }
                    catch(err) {
                        data[i].state = data[i].state
                    }    
                }
            }
            else
            {
                data[i].state = back;       
            }

            if(data[i].city == 'None')
                street = data[i].state;
            if(data[i].state == 'None')
                street = data[i].city;
            if(data[i].city == 'None' && data[i].state == 'None')
                street = '';
            else if(data[i].city != 'None' && data[i].state != 'None')
                street = data[i].city + ", " + data[i].state ;
            data[i].location = street;
            return data;
        }
        
    }
    
    $scope.loadMoreProjects = function() {
        var next = String($scope.buildings.length + 50);
        if ($scope.buildings.length > 250){
            return;
        }
        $scope.loading_more_projects = true;
        var url  = 'assets/json/project_data_' + next + '.json'
        $http.get(url).success(function(data) {
            var bld_data = filterBuildingdata(data);
            for (var i in bld_data){
                $scope.buildings.push(bld_data[i]);
            }
            $scope.loading_more_projects = false;
        });
    };
});
