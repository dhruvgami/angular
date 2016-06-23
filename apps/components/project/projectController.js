LEEDOnApp.controller('projectController', function($rootScope, $scope, $http) {
	$rootScope.header = 'Projects';
	$rootScope.main_appClass = 'overflow_y_scroll';
	$rootScope.bodyLayout = '';
	$rootScope.htmlLayout = 'js flexbox canvas canvastext webgl no-touch geolocation postmessage websqldatabase indexeddb hashchange history draganddrop websockets rgba hsla multiplebgs backgroundsize borderimage borderradius boxshadow textshadow opacity cssanimations csscolumns cssgradients cssreflections csstransforms csstransforms3d csstransitions fontface generatedcontent video audio localstorage sessionstorage webworkers applicationcache svg inlinesvg smil svgclippaths';
	$http.get('assets/json/countriesstates.json').success(function(csJson) {
		$http.get('assets/json/building_data.json').success(function(data) {
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
	                            data[i].state = csJson['divisions'][data[i].country][data[i].state]
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

	            }
			$scope.buildings = data;
		});
	});
});