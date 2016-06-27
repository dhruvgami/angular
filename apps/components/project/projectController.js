LEEDOnApp.controller('projectController', function($rootScope, $scope, $http, Load_more) {
	$rootScope.header = 'Projects';
	$rootScope.main_appClass = 'overflow_y_scroll';
	$rootScope.bodyLayout = '';
	$rootScope.htmlLayout = 'js flexbox canvas canvastext webgl no-touch geolocation postmessage websqldatabase indexeddb hashchange history draganddrop websockets rgba hsla multiplebgs backgroundsize borderimage borderradius boxshadow textshadow opacity cssanimations csscolumns cssgradients cssreflections csstransforms csstransforms3d csstransitions fontface generatedcontent video audio localstorage sessionstorage webworkers applicationcache svg inlinesvg smil svgclippaths';
	$http.get('assets/json/countriesstates.json').success(function(csJson) {
		$http.get('assets/json/project_data_50.json').success(function(data) {
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
			$scope.Load_more = new Load_more();
		});
	});
});

LEEDOnApp.factory('Load_more', function($http) {
  var Load_more = function() {
    this.buildings = [];
    this.busy = false;
    this.after = '';
  };

  Load_more.prototype.nextPage = function() {
    if (this.busy) return;
    this.busy = true;
    this.after = "100";

    var url = "assets/json/project_data_" + this.after + ".json";
    $http.get(url).success(function(data) {

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
        this.buildings.push(data[i]);
    }

      this.after = String(this.buildings.length + 50);
      this.busy = false;
    }.bind(this));
  };

  return Load_more;
});