LEEDOnApp.controller('dashboardController', function($rootScope, $scope, $http, $window, $stateParams, $ocLazyLoad) {
	$rootScope.header        = 'Dashboard';
	$rootScope.main_appClass = '';
	$rootScope.bodyLayout    = '';
	// $rootScope.htmlLayout    = 'js flexbox canvas canvastext webgl no-touch geolocation postmessage websqldatabase indexeddb hashchange history draganddrop websockets rgba hsla multiplebgs backgroundsize borderimage borderradius boxshadow textshadow opacity cssanimations csscolumns cssgradients cssreflections csstransforms csstransforms3d csstransitions fontface no-generatedcontent video audio localstorage sessionstorage webworkers applicationcache svg inlinesvg smil svgclippaths';
	if ($stateParams.leed_id == "800000100"){
        localStorage.setItem($stateParams.leed_id + '_notification', 'full');
    }
    else{
        localStorage.setItem($stateParams.leed_id + '_notification', 'nothing');
    }
    $scope.leed_id = $stateParams.leed_id;
    window.leed_id = $scope.leed_id;
    $scope.progress_bar_details = {
        "buildingInfo": {
          "data-div" : "buildingInfo",
          "title"    : "Review Project Info"
        },
        "softwareSubscription": {
          "data-div" : "softwareSubscription",
          "title"    : "Order Selection"
        },
        "payment": {
          "data-div" : "payment",
          "title"    : "Payment"
        },
        "receipt": {
          "data-div" : "receipt",
          "title"    : "Receipt"
        },
        "buildingConfirmation": {
          "data-div" : "buildingConfirmation",
          "title"    : "Confirm Building Owner"
        },
        "teamManagement": {
          "data-div" : "teamManagement",
          "title"    : "Team Management"
        },
        "meterSetup": {
          "data-div" : "meterSetup",
          "title"    : "Meter Setup"
        }
    };
    window.full_version_arr = ["buildingInfo", "softwareSubscription", "hardwareSubscription", "orderSelection", "payment", "receipt", "buildingConfirmation", "teamManagement", "meterSetup"];
    
    $ocLazyLoad.load(['assets/js/survey.js?v-12.31', 'assets/libs/js/jquery-ui.js']);

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
        }
	});

	$http.get('assets/json/performance_' + $scope.leed_id + '.json').success(function(data) {
		$scope.performance_data = data;
	});

	$scope.redirectToGBIG = function () {
        $window.open('http://www.gbig.org/activities/leed-' + $scope.leed_id, '_blank');
    };

    $scope.getUrlParameter = function(param, dummyPath) {
        var sPageURL = dummyPath || window.location.hash.substring(1),
            sURLVariables = sPageURL.split(/[&||?]/),
            res;

        for (var i = 0; i < sURLVariables.length; i += 1) {
            var paramName = sURLVariables[i],
                sParameterName = (paramName || '').split('=');

            if (sParameterName[0] === param) {
                res = sParameterName[1];
            }
        }

        return res;
    };

    $scope.check_progressBar = function (pageName){
        $('.progress_bar').each(function(index, value) {
            if ( $(this).attr('data-div') == pageName){
                return false;
            }
            $(this).addClass('bg-green-progress');
            if (pageName == 'receipt' || pageName=='buildingConfirmation'){
                $(this).addClass('not-active');
            }
            else{
                $(this).addClass('cursor_pointer');
            }
        });
    };

    $scope.removeArr = function (arr) {
        var what, a = arguments, L = a.length, ax;
        while (L > 1 && arr.length) {
            what = a[--L];
            while ((ax= arr.indexOf(what)) !== -1) {
            arr.splice(ax, 1);
          }
        }
        return arr;
    }

    $scope.buildingSetup = function (){
        $('#activation_modal_container').removeClass('activation_modal_w450').addClass('activation_modal_w875');
        $('.back_btn_access').html('< CHECKLIST');
        $('.back_btn_access, .back_btn').attr('onclick','').unbind('click');
        $('.back_btn_access, .back_btn').on('click', function(){
            $('#activation_modal').modal('hide');
            $('#project_is_active').modal('show');
        });
        if (($scope.building_data.state).length > 2){
            final_state = ($scope.building_data.state).substring(2, ($scope.building_data.state).length);
        }
        print_country("building_country");
        print_state('building_state', $("#building_country option:selected").val());
        $("#building_country option").filter(function() {
            return $(this).val() == $scope.building_data.country;
        }).attr('selected', true);
        print_state('building_state', $scope.building_data.country);
        $('#building_state').val(final_state);
        $('#building_country').prop('disabled',true);
        $('#building_state').prop('disabled',true);
        $('#building_name_flow').val($scope.building_data.name);
        $('#building_id').val($scope.building_data.leed_id);
        $('#building_year').val($scope.building_data.year_constructed);
        $('#building_street').val($scope.building_data.street);
        $('#building_city').val($scope.building_data.city);
        $('#gfa_input').val($scope.building_data.gross_area);
        $('#occ_input').val($scope.building_data.occupancy);
        $('#hours_input').val($scope.building_data.operating_hours);
        $('#building_zipcode').val($scope.building_data.zip_code);

        $('#edit_btn').off('click');
        $('#edit_btn').on('click', function() {
            if($('#edit_btn').val()== 'EDIT') {
                $('#building_id').attr('disabled', 'true');
                $('.enable_edit').attr('readonly', false);  
                $('.enable_edit').removeClass('disable_edit');
                $('.enable_edit').removeClass('not-active');
                $('.enable_edit').addClass('form-control');
                $('.enable_edit').addClass('height_35');
                $('#hours_input').addClass('hours_input_calc');
                $('.hours_input_2').show();
                $('#edit_btn').val('DONE');
                $('#correct_btn').attr('disabled',true);
                $('#building_country').prop('disabled',false);
                $('#building_state').prop('disabled',false);
            }
            else if($('#edit_btn').val()== 'DONE') {
                $('#building_id').removeAttr('disabled');
                $('.enable_edit').attr('readonly', true);
                if($('.enable_edit').hasClass('editable'))
                $('.editable').attr('readonly', false);
                $('#edit_btn').val('EDIT');
                $('.enable_edit').addClass('disable_edit');
                $('.enable_edit').addClass('not-active');
                $('.enable_edit').removeClass('form-control');
                $('.enable_edit').removeClass('height_35');
                $('#hours_input').removeClass('hours_input_calc');
                $('.hours_input_2').hide();
                $('#correct_btn').attr('disabled',false);
                $('#building_country').prop('disabled',true);
                $('#building_state').prop('disabled',true);
            }
        });
    };

    $scope.softwareSubscription = function (){
    };

    $scope.hardwareSubscription = function (){
    };

    $scope.orderSelection = function (){
    };

    $scope.payment = function (){
    };

    $scope.receipt = function (){
    };

    $scope.agreement = function (){
    };

    $scope.activationFlow = function (pageName) {
        $('#preloader_activationFlow').show();
        $('#status_activationFlow').show();
        $http.get('assets/templates/' + pageName + '.html').success(function(page_content) {
            $( ".activationFlow_parent_container" ).html('');
            $( ".activationFlow_parent_container" ).append(page_content);
            $('#preloader_activationFlow').hide();
            $('#status_activationFlow').hide();
            if (!$('#activation_modal').hasClass('in')){
                $('#activation_modal').modal('show');
            }

            if(pageName == 'buildingInfo'){
                $scope.buildingSetup();
            }
            else if(pageName == 'softwareSubscription') {
                $scope.check_progressBar(pageName);
                $scope.softwareSubscription();
            }
            else if(pageName == 'hardwareSubscription') {
                $scope.hardwareSubscription();
            }
            else if(pageName == 'orderSelection') {
                $scope.orderSelection();
            }
            else if(pageName == 'payment') {
                $scope.check_progressBar(pageName);
                $scope.payment();
            }
            else if(pageName == 'receipt') {
                $scope.check_progressBar(pageName);
                $scope.receipt();
            }
            else if(pageName == 'buildingConfirmation'){
                $('body').css('overflow', 'visible');
                $scope.check_progressBar(pageName);
                $scope.agreement();
            }
        });
    };

    $scope.projectActive = function(){

        var updated_full_version_arr = window.full_version_arr.slice();
        updated_full_version_arr = $scope.removeArr(updated_full_version_arr, 'orderSelection');
        updated_full_version_arr = $scope.removeArr(updated_full_version_arr, 'hardwareSubscription');
        $( ".progress_bar" ).each(function( index ) {
          $(this).attr('data-div', $scope.progress_bar_details[updated_full_version_arr[index]]['data-div']);
          $(this).attr('title', $scope.progress_bar_details[updated_full_version_arr[index]]['title']);
        });

        $('#add_team_span_md').on('click', function(){
          $('#project_is_active').modal('hide');
          $('#skipped_modal').modal('hide');
          $('#activation_modal').modal('hide');
          window.location.href = window.location.protocol + '//' + window.location.host + "/v3/#/dashboard/" + $scope.leed_id + "/data/input/";
        });

        $('#add_meter_span_md').on('click', function(){
          $('#project_is_active').modal('hide');
          $('#skipped_modal').modal('hide');
          $('#activation_modal').modal('hide');
          $('body').removeClass('modal-open');
          $('.modal-backdrop').remove();
          window.location.href = window.location.protocol + '//' + window.location.host + "/v3/#/dashboard/" + $scope.leed_id + "/manage/team";
        });

        $('#select_plan_span_md').on('click', function(){
          $('#project_is_active').modal('hide');
          $('#skipped_modal').modal('hide');
          $('body').removeClass('modal-open');
          $('.modal-backdrop').remove();
          $scope.activationFlow('buildingInfo');
        });

        $('#sign_agreement_span_md').on('click', function(){
          $('#project_is_active').modal('hide');
          $('#skipped_modal').modal('hide');
          $scope.activationFlow('buildingConfirmation');
        });
      }

    if (document.URL.indexOf("?modal")>-1){
        $('body').removeClass('modal-open');
        $('.modal-backdrop').remove();
        if ($scope.getUrlParameter("modal").trim() == ""){
        }
        else if ($scope.getUrlParameter("modal").trim() == "projectActive"){
            $('#activation_modal').modal('hide');
            $('#skipped_modal').modal('hide');
            $('#project_is_active').modal('show');
            $scope.projectActive();
        }
        else if ($scope.getUrlParameter("modal").trim() == "skippedModal"){
            $('#activation_modal').modal('hide');
            $('#project_is_active').modal('hide');
            $('#skipped_modal').modal('show');
        }
        else{
            $('#project_is_active').modal('hide');
            $('#skipped_modal').modal('hide');
            var updated_full_version_arr = window.full_version_arr.slice();
            updated_full_version_arr = $scope.removeArr(updated_full_version_arr, 'orderSelection');
            updated_full_version_arr = $scope.removeArr(updated_full_version_arr, 'hardwareSubscription');
            $( ".progress_bar" ).each(function( index ) {
                $(this).attr('data-div', $scope.progress_bar_details[updated_full_version_arr[index]]['data-div']);
                $(this).attr('title', $scope.progress_bar_details[updated_full_version_arr[index]]['title']);
            });
            $scope.activationFlow($scope.getUrlParameter("modal"));
        }
    }

});