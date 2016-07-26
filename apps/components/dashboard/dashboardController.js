LEEDOnApp.controller('dashboardController', function($rootScope, $scope, $http, $window, $stateParams, $ocLazyLoad) {
	$rootScope.header        = 'Dashboard';
	$rootScope.main_appClass = '';
	// $rootScope.bodyLayout    = '';
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
    window.full_version_arr   = ["buildingInfo", "softwareSubscription", "hardwareSubscription", "orderSelection", "payment", "receipt", "buildingConfirmation", "teamManagement", "meterSetup"];
    $scope.PAYMENT_VERSION    = 'V1';
    $scope.want_plaque_global     = true;
    $scope.purchase_plaque_global = false;
    $scope.pay_full_global        = false;
    $scope.term_of_com_global     = 3; 
    $scope.paymode_flag           = true;
    $scope.flag_ship              = 1;
    $scope.ctr_ship               = 1;
    $scope.global_version         = 'full';
    $scope.only_agreement         = false;
    $scope.only_payment_pages     = false;
    $scope.only_teamMember        = false;
    $scope.only_meterSetup        = false;
    $scope.mode_check             = false;
    $scope.plaque;
    $scope.sub;
    $scope.payment_details        = {};
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

    //Converts numeric value 600 to string value $600.00
    $scope.numericToString = function(num) {
        var str = (num + '').replace(/(\d)(?=(\d{3})+$)/g, '$1,');
        if (str.indexOf('.') == -1)
            str = '$' + str + '.00';
        else
            str = '$' + str
        return str;
    }
    $scope.check_BackAndNextPage = function(pageName, direction, version) {
        var next_arr_page = "";
        var arr = [];

        if (version == "full") {
            arr = window.full_version_arr;
        } else {
            arr = window.full_version_arr;
        }

        if (direction == "next") {
            if (arr[arr.indexOf(pageName) + 1] == undefined) {
                next_arr_page = undefined;
            } else {
                next_arr_page = arr[arr.indexOf(pageName) + 1];
            }
        } else {
            if (arr[arr.indexOf(pageName) - 1] == undefined) {
                next_arr_page = undefined;
            } else {
                next_arr_page = arr[arr.indexOf(pageName) - 1];
            }
        }
        return next_arr_page;
    }

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

    //paynow order data starts
    $scope.paynowSelectedData = function() {

        if ($scope.pay_full_global) {
            $('#auto_renewal_com_box').css('display', 'none');
            $('#auto_renewal').attr('data-chk', 'unchecked');
        } else {
            $('#auto_renewal_com_box').css('display', 'block');
        }

        if ($scope.want_plaque_global) {
            $('.needplaque_tbl').show();
        } else {
            $('.needplaque_tbl').hide();
        }

        if ($scope.want_plaque_global) {
            if ($scope.purchase_plaque_global) {
                $('.needplaque_tbl').show();
                $('.rowHide').show();
                if ($scope.pay_full_global) {
                    $('.pay_full_span').hide();
                } else {
                    $('.pay_full_span').show();
                }
            } else {
                $('.plaque_one_time_price').text($scope.plaque);
                $('.subs_price').text($scope.sub);

                if ($scope.pay_full_global) {
                    $('.pay_full_span').hide();
                } else {
                    $('.pay_full_span').show();
                }
            }
        } else {
            if ($scope.pay_full_global) {
                $('.pay_full_span').hide();
            } else {
                $('.pay_full_span').show();
            }
        }
    }
    //paynow order data ends

    //Calculation starts
    $scope.sendValuesTotal = function(pageName) {
        if ($scope.PAYMENT_VERSION == 'V2' && $scope.want_plaque_global == true) {
            $('.payment_option_2').hide();
            $('#value_3').css('top', '149px');
        } else {
            $('.payment_option_2').show();
        }
        $.ajax({
            type: "GET",
            url: "assets/json/" + $scope.want_plaque_global + "_" + $scope.purchase_plaque_global + "_" + $scope.pay_full_global + "_" + $scope.term_of_com_global + "_" + pageName +  ".json",
            success: function(data) {
                if ($scope.term_of_com_global == 1) {
                    $('.if_one_year').hide();
                } else {
                    $('.if_one_year').show();
                }

                if (pageName == 'softwareSubscription') {
                    $('select>option:eq(' + (data.term_of_com_global - 1) + ')').attr('selected', true);
                    if ($scope.PAYMENT_VERSION == 'V2') {
                        $('.amount_in_full').hide()
                        $('.amount_yearly').html($scope.numericToString(data.subs_price));
                    } else {
                        $('.amount_in_full').html($scope.numericToString(data.subs_price));
                        $('.amount_yearly').html($scope.numericToString(data.subs_price_per_year));
                    }
                } else if (pageName == 'hardwareSubscription') {

                    if ($scope.PAYMENT_VERSION == 'V2') {
                        $('.amount_in_full').hide()
                        $('.amount_yearly').html($scope.numericToString(data.subs_price));
                        $('.plaque_one_type_price_hrd').html($scope.numericToString(data.plaque_cost));
                        $('.plaque_anual_price_hrd').html($scope.numericToString(data.plaque_one_time_price));
                    } else {
                        $('.amount_in_full').html($scope.numericToString(data.subs_price));
                        $('.amount_yearly').html($scope.numericToString(data.subs_price_per_year));
                        $('.plaque_one_type_price_hrd').html($scope.numericToString(data.plaque_one_time_price));
                        $('.plaque_anual_price_hrd').html($scope.numericToString(data.plaque_price_only));
                    }
                    var tem_selected_with_year = "";
                    if ($scope.term_of_com_global > 1) {
                        tem_selected_with_year = $scope.term_of_com_global + ' years';
                    } else {
                        tem_selected_with_year = $scope.term_of_com_global + ' year';
                    }
                    $('.tem_selected_with_year').html(tem_selected_with_year);
                } else if (pageName == 'orderSelection') {
                    if ($scope.PAYMENT_VERSION == 'V2') {
                        $('#orderselection_discount').show();

                        if ($scope.purchase_plaque_global == true) {
                            $('#payment_plan_select').val('2');
                        } else {
                            $('#payment_plan_select').val('1');
                        }

                        $('.pay_full_span').text('(' + $scope.term_of_com_global + ' Years)');
                        if ($('#payment_plan_select').val() == '1') {
                            $('#payment_plan_select').html($('.payment_option_1').html());
                            $('.subs_price').html($scope.numericToString(data.subs_price));
                            $('.plaque_one_time_price').html($scope.numericToString(data.plaque_one_time_price));
                        } else if ($('#payment_plan_select').val() == '2') {
                            $('#payment_plan_select').html($('.payment_option_2').html());
                            $('.subs_price').html($scope.numericToString(data.subs_price));
                            $('.plaque_one_time_price').html($scope.numericToString(data.plaque_cost));
                        }
                    } else {
                        $('#orderselection_discount').hide();

                        if ($scope.pay_full_global == true) {
                            $('.pay_full_span').text('(' + $scope.term_of_com_global + ' Years)');

                            $('#payment_plan_select').val("2");
                            $('#payment_plan_select').html($('.payment_option_2').html());

                            if ($scope.purchase_plaque_global == true)
                                $('.purchase_plaque_span').text('');
                            else
                                $('.purchase_plaque_span').text('(' + $scope.term_of_com_global + ' Years)');
                        } else {
                            if ($scope.purchase_plaque_global == true) {
                                $('#payment_plan_select').val("3");
                                $('#payment_plan_select').html($('.payment_option_3').html());
                            } else {
                                $('#payment_plan_select').val("1");
                                $('#payment_plan_select').html($('.payment_option_1').html());
                            }
                            $('.pay_full_span').text('(1 Year)');
                            $('.pay_full_span').text('(1 Year)');
                            if ($scope.purchase_plaque_global == true)
                                $('.purchase_plaque_span').text('');
                            else
                                $('.purchase_plaque_span').text('(1 Year)');
                        }

                        if ($scope.purchase_plaque_global == true) {
                            $('.plaque_one_time_price').text($scope.numericToString(data.plaque_one_time_price));
                        } else if ($scope.purchase_plaque_global == false) {
                            $('.plaque_one_time_price').text($scope.numericToString(data.plaque_price_only));
                        }
                        $('.subs_price').html($scope.numericToString(data.subs_price_only));

                    }
                    $('.total_plaque_price').html($scope.numericToString(data.tot_cost));
                    $scope.paynowSelectedData();
                } else if (pageName == 'payment') {
                    if ($scope.PAYMENT_VERSION == 'V2') {
                        $('.pay_full_span').text('(' + $scope.term_of_com_global + ' Years)');
                        if ($scope.purchase_plaque_global == false) {
                            $('.subs_price').html($scope.numericToString(data.subs_price));
                            $('.plaque_one_time_price').html($scope.numericToString(data.plaque_one_time_price));
                        } else if ($scope.purchase_plaque_global == true) {
                            $('.subs_price').html($scope.numericToString(data.subs_price));
                            $('.plaque_one_time_price').html($scope.numericToString(data.plaque_cost));
                        }
                    } else {
                        if ($scope.pay_full_global == true) {
                            $('#auto_renewal_com_box').hide();
                            $('#auto_renewal').attr('data-chk', 'unchecked');
                        } else {
                            $('#auto_renewal_com_box').show();
                            if ($scope.pay_full_global == false && ($scope.want_plaque_global == true && $scope.purchase_plaque_global == false)) {
                                $('#auto_renewal_check').html($scope.numericToString(parseInt(data.plaque_price_only) + parseInt(data.subs_price)));
                            } else if ($scope.pay_full_global == false && ($scope.want_plaque_global == true && $scope.purchase_plaque_global == true)) {
                                $('#auto_renewal_check').html($scope.numericToString(parseInt(data.subs_price)));
                            } else if ($scope.pay_full_global == true && ($scope.want_plaque_global == true && $scope.purchase_plaque_global == false)) {
                                $('#auto_renewal_check').html($scope.numericToString(parseInt(data.plaque_price_only)));
                            } else if ($scope.pay_full_global == false && $scope.want_plaque_global == false) {
                                $('#auto_renewal_check').html($scope.numericToString(parseInt(data.subs_price_only)));
                            }
                        }

                        if ($scope.pay_full_global == true) {
                            $('.pay_full_span').text('(' + $scope.term_of_com_global + ' Years)');
                            $('#payment_plan_select').val("2");
                            if ($scope.purchase_plaque_global == true)
                                $('.purchase_plaque_span').text('');
                            else
                                $('.purchase_plaque_span').text('(' + $scope.term_of_com_global + ' Years)');
                        } else {
                            $('.pay_full_span').text('(1 Year)');
                            $('#payment_plan_select').val("1");
                            $('.pay_full_span').text('(1 Year)');
                            if ($scope.purchase_plaque_global == true)
                                $('.purchase_plaque_span').text('');
                            else
                                $('.purchase_plaque_span').text('(1 Year)');
                        }

                        if ($scope.purchase_plaque_global == true) {
                            $('.plaque_one_time_price').text($scope.numericToString(data.plaque_one_time_price));
                        } else if ($scope.purchase_plaque_global == false) {
                            $('.plaque_one_time_price').text($scope.numericToString(data.plaque_price_only));
                        }
                        $('.subs_price').html($scope.numericToString(data.subs_price_only));
                    }
                    $('.total_plaque_price').html($scope.numericToString(data.tot_cost));

                    $scope.paynowSelectedData();
                }
            }
        });
    }
    //Calculation ends

    $scope.buildingSetup = function (){
        $('#activation_modal_container').removeClass('activation_modal_w450').addClass('activation_modal_w875');
        $('.back_btn_access').html('< CHECKLIST');
        $('.back_btn_access, .back_btn').attr('onclick','').unbind('click');
        $('.back_btn_access, .back_btn').on('click', function(){
            $('#activation_modal').modal('hide');
            $('#project_is_active').modal('show');
        });
        $('#correct_btn').on('click', function() {
            $scope.activationFlow($scope.check_BackAndNextPage('buildingInfo', 'next', $scope.global_version));
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
        $('#activation_modal_container').removeClass('activation_modal_w450').addClass('activation_modal_w875');
        if (!$scope.only_payment_pages) {
            $('.back_btn_access').show();
            $('.back_btn').show();
        } else {
            $('.back_btn_access').hide();
            $('.back_btn').hide();
        }

        $('.back_btn_access').html('< REVIEW INFO');
        $('.back_btn_access, .back_btn').attr('onclick', '').unbind('click');
        $('.back_btn_access, .back_btn').on('click', function() {
            $scope.activationFlow($scope.check_BackAndNextPage('softwareSubscription', 'back', 'full'));
        });

        $('.forward_btn_access').html('DISPLAY >');
        $('.forward_btn_access, .forward_btn').attr('onclick', '').unbind('click');
        $('.forward_btn_access, .forward_btn').on('click', function() {
            $scope.activationFlow('hardwareSubscription');
        });

        for (var i = 1; i < 101; i++) {
            if (i == 1)
                $("#year").html($("#year").html() + '<option value="' + i + '">' + i + ' Year</option>');
            else if (i == $scope.term_of_com_global)
                $("#year").html($("#year").html() + '<option value="' + i + '" selected>' + i + ' Years</option>');
            else
                $("#year").html($("#year").html() + '<option value="' + i + '">' + i + ' Years</option>');
        }

        $scope.sendValuesTotal('softwareSubscription');
        $('.sw_term_select_year').on('change', function() {
            if ($('.sw_term_select_year :selected').text() == '100 Years')
                $scope.term_of_com_global = 100;
            else
                $scope.term_of_com_global = parseInt($('.sw_term_select_year :selected').text().substring(0, 2).trim());

            $scope.sendValuesTotal('softwareSubscription');
        });

        $("#continue2").on('click', function() {
            $scope.activationFlow('hardwareSubscription');
        });

        if ($scope.PAYMENT_VERSION == 'V2') {
            $('.summaryCost').html('Your subscription can be paid in <b>annual increments of <span class="amount_yearly"></span></b></span>.');
        }
    };

    $scope.hardwareSubscription = function() {

        $('#activation_modal_container').removeClass('activation_modal_w450').addClass('activation_modal_w875');

        $('.back_btn_access').show();
        $('.back_btn').show();

        $('.back_btn_access').html('< SUBSCRIBE');
        $('.back_btn_access, .back_btn').attr('onclick', '').unbind('click');
        $('.back_btn_access, .back_btn').on('click', function() {
            $scope.activationFlow('softwareSubscription');
        });

        $('.forward_btn_access').html('PAYMENT PLAN >');
        $('.forward_btn_access, .forward_btn').attr('onclick', '').unbind('click');
        $('.forward_btn_access, .forward_btn').on('click', function() {
            $scope.activationFlow('orderSelection');
        });

        $scope.sendValuesTotal('hardwareSubscription');

        $("#continue3, #previous3").on('click', function() {
            if ($(this).attr('id') == "previous3") {
                $scope.want_plaque_global = false;
            } else {
                $scope.want_plaque_global = true;
            }
            $('#preloader_activationFlow').show();
            $('#status_activationFlow').show();

            $.ajax({
                type: "GET",
                url: "assets/json/true_false_false_3_hardwareSubscription.json",
            }).done(function(data) {
                $scope.activationFlow('orderSelection');
            }).error(function() {
                $('#preloader_activationFlow').hide();
                $('#status_activationFlow').hide();
            });
        });

        if (window.PAYMENT_VERSION == 'V2') {
            $('.summaryCost').html('Your subscription can be paid in <b>annual increments of <span class="amount_yearly"></span></b></span>.');
        }
    };

    $scope.orderSelection = function() {

        if (window.PAYMENT_VERSION == 'V2') {
            $scope.purchase_plaque_global = true;
        }

        $('#activation_modal_container').removeClass('activation_modal_w450').addClass('activation_modal_w875');

        $('.back_btn_access').html('< DISPLAY');
        $('.back_btn_access, .back_btn').attr('onclick', '').unbind('click');
        $('.back_btn_access, .back_btn').on('click', function() {
            $scope.activationFlow('hardwareSubscription');
        });

        $('.forward_btn_access').html('PAYMENT INFO >');
        $('.forward_btn_access, .forward_btn').attr('onclick', '').unbind('click');
        $('.forward_btn_access, .forward_btn').on('click', function() {
            $scope.activationFlow('payment');
        });

        if ($scope.want_plaque_global == true) {
            $('.payment_option_1').html('Pay annually for both display and subscription');
            $('.payment_option_2').html('Pay up front for both display and subscription');
            $('.payment_option_3').show();
        } else {
            $('.payment_option_1').html('Pay annually for subscription');
            $('.payment_option_2').html('Pay up front for subscription');
            $('.payment_option_3').hide();
        }

        $(document).on('click', function(e) {
            var container = $("#payment_plan_select");

            if (!container.is(e.target) // if the target of the click isn't the container...
                &&
                container.has(e.target).length === 0) // ... nor a descendant of the container
            {
                if ($('.optionsCont').css('display') != 'none') {
                    $('.optionsCont').hide();
                }
            }
        });

        $('#payment_plan_select').on('click', function() {

            if ($('.optionsCont').css('display') == 'none') {
                $('.optionsCont').show();
            } else {
                $('.optionsCont').hide();
            }

            $.ajax({
                type: "GET",
                url: "assets/json/true_false_false_3_orderSelection.json",
                success: function(data) {
                    $('#value_1').html($scope.numericToString(data.tot_cost) + ' /year');
                }
            });
            $.ajax({
                type: "GET",
                url: "assets/json/true_true_true_3_orderSelection.json",
                success: function(data) {
                    $('#value_2').html($scope.numericToString(data.tot_cost) + ' now ');
                }
            });
            $.ajax({
                type:"GET",
                url: "assets/json/true_true_false_3_orderSelection.json",
                success: function(data)
                {
                    $('#value_3').html($scope.numericToString(data.plaque_cost) + ' now + ' + $scope.numericToString(data.subs_price) + ' /year'); 
                }
            });
        });

        $('.options').on('click', function() {
            if ($(this).attr('value') == '1') {
                $('#payment_plan_select').val('1');
                $scope.purchase_plaque_global = false;
                $scope.pay_full_global = false;
            } else if ($(this).attr('value') == '2') {
                $('#payment_plan_select').val('2');
                $scope.purchase_plaque_global = true;
                $scope.pay_full_global = true;
            } else if ($(this).attr('value') == '3') {
                $('#payment_plan_select').val('3');
                $scope.purchase_plaque_global = true;
                $scope.pay_full_global = false;
            }
            $scope.sendValuesTotal('orderSelection');
        });
        $scope.sendValuesTotal('orderSelection');

        $("#continue4").on('click', function() {
            $scope.activationFlow('payment');
        });
    };

    $scope.payment = function (){

        $scope.sendValuesTotal('payment');

        print_country("country1");
        print_state("state1", "");
        print_country("country2");
        print_state("state2", "");

        $('#activation_modal_container').removeClass('activation_modal_w450').addClass('activation_modal_w875');

        $('.back_btn_access').html('< PAYMENT PLAN');
        $('.back_btn_access, .back_btn').attr('onclick','').unbind('click');
        $('.back_btn_access, .back_btn').on('click', function(){
            $scope.activationFlow('hardwareSubscription');
        });

        $('.forward_btn_access').html('');
        $('.forward_btn_access, .forward_btn').attr('onclick','').unbind('click');
        $('.forward_btn_access, .forward_btn').on('click', function(){
            $scope.activationFlow('receipt');
        });

        $('.shipping_details_card').hide();
        $('.billing_details').css('margin-top', '-50px');

        $('.activationFlow_parent_container').on('click', '.checkbox_img', function () {
            if($('.checkbox_img').hasClass('address_same')) {
                $(this).removeClass('address_same').addClass('address_notsame');
                $('#checkbox_card').attr('checked', false);
                $('.checkbox_img').attr('src', 'assets/images/checkboxEmpty.png');
                $('.shipping_details_card').show();
            }
            else{
                $('.checkbox_img').removeClass('address_notsame').addClass('address_same');
                $('#checkbox_card').attr('checked', true);
                $('.checkbox_img').attr('src','assets/images/checkboxFull.png');
                $('.shipping_details_card').hide();
            }
        });

        $('.activationFlow_parent_container').on('click', '.auto_renewal_chk', function () {
            if($('#auto_renewal').attr('data-chk') == 'checked') {
                $('#auto_renewal').attr('data-chk','unchecked');
                $('#auto_renewal').attr('src', 'assets/images/checkboxEmpty.png');
            }
            else {
                $('#auto_renewal').attr('data-chk','checked');
                $('#auto_renewal').attr('src','assets/images/checkboxFull.png');
            }
        });

        $('.activationFlow_parent_container').on('click', '.pay_mode', function () {
            if ($(this).attr("value") == "card") {
                $('.billing_details').css('margin-top', '-50px');
                $('.card_type').show();
                $('#check').attr("src", "assets/images/radioEmpty.png");
                $('#card').attr("src", "assets/images/radioFull.png");
                $("#DIeCommFrame_payment").show();
                $(".instruction_section").hide();
                $('#cc').css("font-weight", "Bold");
                $('#chq').css("font-weight", "normal");

            } else if ($(this).attr("value") == "check") {
                $('.billing_details').css('margin-top', '0px');
                $('.card_type').hide();
                $('.card_number').css('cssText', 'border-color: rgba(204,204,204,1)');
                $('.paynow_cvv').css('cssText', 'border-color: rgba(204,204,204,1)');

                $('#check').attr("src", "assets/images/radioFull.png");
                $('#card').attr("src", "assets/images/radioEmpty.png");
                $("#DIeCommFrame_payment").hide();
                $('#auto_renewal_com_box').hide();
                $(".instruction_section").show();
                $('#chq').css("font-weight", "Bold");
                $('#cc').css("font-weight", "normal");
            }
        });

        $("#confirm_payment").on('click', function() {
            var auto_renewal = true;
            var paymode_flag = "check";
            if (($('#auto_renewal_com_box').css('display') == "block") && $('#auto_renewal').attr('data-chk') == "checked") {
                auto_renewal = true;
            } else {
                auto_renewal = false;
            }

            //Billing details
            var CC_first_name = $('#paynow_f_name').val();
            var CC_last_name = $('#paynow_l_name').val();
            var CC_address = $('#paynow_add').val();
            var CC_city = $('#paynow_city').val();
            var CC_po_code = $('#paynow_po_code').val();
            var CC_country = $('#country1 option:selected').val().trim();
            var CC_state = $('#state1 option:selected').val().trim();
            var CC_email = $('#paynow_email').val();
            var CC_phone = $('#paynow_phone').val();

            //Shipping details
            if ($('.address_same').is(':visible')) {
                var CC_ship_first_name = CC_first_name;
                var CC_ship_last_name = CC_last_name;
                var CC_ship_address = CC_address;
                var CC_ship_city = CC_city;
                var CC_ship_po_code = CC_po_code;
                var CC_ship_country = CC_country;
                var CC_ship_state = CC_state;
                var CC_ship_email = CC_email;
                var CC_ship_phone = CC_phone;
            } else {
                var CC_ship_first_name = $('.paynow_ship_f_name').val();
                var CC_ship_last_name = $('.paynow_ship_l_name').val();
                var CC_ship_address = $('.paynow_ship_add').val();
                var CC_ship_city = $('.paynow_ship_city').val();
                var CC_ship_po_code = $('#paynow_ship_po_code').val();
                var CC_ship_country = $('#country2 option:selected').val().trim();
                var CC_ship_state = $('#state2 option:selected').val().trim();
                var CC_ship_email = $('.paynow_ship_email').val();
                var CC_ship_phone = $('.paynow_ship_phone').val();
            }

            if ($scope.paymode_flag) {
                payment_mode = "check";
                $scope.payment_details = {

                    'CC_first_name': CC_first_name,
                    'CC_last_name': CC_last_name,
                    'CC_address': CC_address,
                    'CC_city': CC_city,
                    'CC_po_code': CC_po_code,
                    'CC_country': CC_country,
                    'CC_state': CC_state,
                    'CC_email': CC_email,
                    'CC_phone': CC_phone,
                    'CC_ship_first_name': CC_ship_first_name,
                    'CC_ship_last_name': CC_ship_last_name,
                    'CC_ship_address': CC_ship_address,
                    'CC_ship_city': CC_ship_city,
                    'CC_ship_po_code': CC_ship_po_code,
                    'CC_ship_country': CC_ship_country,
                    'CC_ship_state': CC_ship_state,
                    'CC_ship_email': CC_ship_email,
                    'CC_ship_phone': CC_ship_phone,
                    'paymetric_r': "",
                    'paymetric_s': "",
                    'auto_renewal': auto_renewal,
                    'payment_mode': payment_mode
                }

            } else {
                payment_mode = "credit";

                $scope.payment_details = {

                    'CC_first_name': CC_first_name,
                    'CC_last_name': CC_last_name,
                    'CC_address': CC_address,
                    'CC_city': CC_city,
                    'CC_po_code': CC_po_code,
                    'CC_country': CC_country,
                    'CC_state': CC_state,
                    'CC_email': CC_email,
                    'CC_phone': CC_phone,
                    'CC_ship_first_name': CC_ship_first_name,
                    'CC_ship_last_name': CC_ship_last_name,
                    'CC_ship_address': CC_ship_address,
                    'CC_ship_city': CC_ship_city,
                    'CC_ship_po_code': CC_ship_po_code,
                    'CC_ship_country': CC_ship_country,
                    'CC_ship_state': CC_ship_state,
                    'CC_ship_email': CC_ship_email,
                    'CC_ship_phone': CC_ship_phone,
                    'paymetric_r': token.split('&s=')[0],
                    'paymetric_s': token.split('&s=')[1],
                    'auto_renewal': auto_renewal,
                    'payment_mode': payment_mode
                }
            }
            $scope.activationFlow('receipt');
        });
    };

    $scope.receipt = function (){
        $('#activation_modal_container').removeClass('activation_modal_w875').addClass('activation_modal_w450');
        $('.back_btn_access').hide();
        $('.forward_btn_access').hide();
        $('.back_btn').hide();
        $('.forward_btn').hide();

        $("#comp_btn").on('click', function() {
            $scope.activationFlow('buildingConfirmation');
        });

        $.ajax({
            url: 'assets/json/getpaymentdetail_800000169.json',
            contentType: 'application/json'
        }).done(function(response) {

            var currentTime = new Date();

            $('#preloader_activationFlow').hide();
            $('#status_activationFlow').hide();

            var need_plaque = response.leed_plaque;
            var purchase_plaque = response.purchase_plaque;
            var paid_full = response.paid_full;
            var receipt_date = [currentTime.getFullYear(), currentTime.getMonth() + 1, currentTime.getDate()]

            if (response.payment_mode == 'check') {
                $('.build_head').html("INVOICE");
            }

            $('.receipt_sap_order_id').html(response.sap_order_id);
            $('.building_address').html(response.address);
            $('.receipt_payer_name').html($scope.payment_details.CC_first_name + " " + $scope.payment_details.CC_last_name);
            $('.receipt_total_amount').html($scope.numericToString(parseInt(response.amount_paid)));
            $('.receipt_building_name').html(response.building_name);
            $('.receipt_building_ID').html(parseInt($scope.leed_id));
            $('.receipt_date').html(receipt_date[1] + '/' + receipt_date[2] + '/' + receipt_date[0]);
            $('.receipt_payer').html(response.payer_name);
            $('.credit_card_number').html(response.credit_card_number);

            var payment_mode = response.payment_mode;
            if (payment_mode == "check") {
                $('#ccrow_payment').css('display', 'none');
            }

            if (response.term_com == "1") {
                $('.receipt_term').html(response.term_com + ' Year');
            } else {
                $('.receipt_term').html(response.term_com + ' Years');
            }

            if (need_plaque) {
                $('.needpl_tbl').show();
                if (purchase_plaque) {} else {
                    if (paid_full) {
                        if (response.term_com == "1") {
                            $('.pay_full_span_hardware').html("(" + response.term_com + " Year)");
                        } else {
                            $('.pay_full_span_hardware').html("(" + response.term_com + " Years)");
                        }
                    } else {
                        $('.pay_full_span_hardware').html("(1 Year)");
                    }
                }
                $('.plaque_one_time_price').html($scope.numericToString(parseInt(response.plaque_cost)));
            } else {
                $('.needpl_tbl').hide();
            }

            if (paid_full) {
                if (response.term_com == "1") {
                    $('.pay_full_span_subs').html("(" + response.term_com + " Year)");
                } else {
                    $('.pay_full_span_subs').html("(" + response.term_com + " Years)");
                }
            } else {
                $('.pay_full_span_subs').html("(1 Year)");
            }

            $('.subs_price').html($scope.numericToString((response.subs_price)));
            $('.order_sum_input').html($scope.numericToString((response.amount_paid)));
        });
    };

    $scope.agreement = function (){
        $('#activation_modal_container').removeClass('activation_modal_w450').addClass('activation_modal_w875');
        $("#agreement_other").click(function() {
            $('input.continue_building_owner_sign.btnGreen').css('background', '#CCCCCC');
            $('input.continue_building_owner_sign.btnGreen').css('border', 'solid 1px #CCCCCC');
            $('input#sendAgreement_buildConf').css('background', '#3E93A9');
            $('input#sendAgreement_buildConf').css('border', 'solid 1px #3E93A9');
            $('#agreement_other').removeClass('agreement_disable').addClass('agreement_active');
            $('#agreement_self').removeClass('agreement_active').addClass('agreement_disable');
        });
        $("#agreement_self").click(function() {
            $('input.continue_building_owner_sign.btnGreen').css('background', '#95BF58');
            $('input.continue_building_owner_sign.btnGreen').css('border', 'solid 1px #95BF58');
            $('input#sendAgreement_buildConf').css('background', '#CCCCCC');
            $('input#sendAgreement_buildConf').css('border', 'solid 1px #CCCCCC');
            $('#agreement_self').removeClass('agreement_disable').addClass('agreement_active');
            $('#agreement_other').removeClass('agreement_active').addClass('agreement_disable');
        });

        $("#agreement_other").hover(function() {
            $('input.continue_building_owner_sign.btnGreen').css('background', '#CCCCCC');
            $('input.continue_building_owner_sign.btnGreen').css('border', 'solid 1px #CCCCCC');
            $('input#sendAgreement_buildConf').css('background', '#3E93A9');
            $('input#sendAgreement_buildConf').css('border', 'solid 1px #3E93A9');
            $('#agreement_other').removeClass('agreement_disable').addClass('agreement_active');
            $('#agreement_self').removeClass('agreement_active').addClass('agreement_disable');
        });
        $("#agreement_self").hover(function() {
            $('input.continue_building_owner_sign.btnGreen').css('background', '#95BF58');
            $('input.continue_building_owner_sign.btnGreen').css('border', 'solid 1px #95BF58');
            $('input#sendAgreement_buildConf').css('background', '#CCCCCC');
            $('input#sendAgreement_buildConf').css('border', 'solid 1px #CCCCCC');
            $('#agreement_self').removeClass('agreement_disable').addClass('agreement_active');
            $('#agreement_other').removeClass('agreement_active').addClass('agreement_disable');
        });

        $(".continue_building_owner_sign").on('click', function() {
            $scope.signAgreement();
        });
    };

    $scope.signAgreement = function (){
        $('#activation_modal').modal('hide');
        $('#skipped_modal').modal('hide');
        $('#project_is_active').modal('hide');
        $('#agreement_embedded_modal').modal('show');
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
          window.location.href = window.location.protocol + '//' + window.location.host + "/v3/#/dashboard/" + $scope.leed_id + "/manage/team";
        });

        $('#add_meter_span_md').on('click', function(){
          $('#project_is_active').modal('hide');
          $('#skipped_modal').modal('hide');
          $('#activation_modal').modal('hide');
          window.location.href = window.location.protocol + '//' + window.location.host + "/v3/#/dashboard/" + $scope.leed_id + "/data/input/";
        });

        $('#select_plan_span_md').on('click', function(){
          $('#project_is_active').modal('hide');
          $('#skipped_modal').modal('hide');
          $scope.activationFlow('buildingInfo');
        });

        $('#sign_agreement_span_md').on('click', function(){
          $('#project_is_active').modal('hide');
          $('#skipped_modal').modal('hide');
          $scope.activationFlow('buildingConfirmation');
        });
      }

    if (document.URL.indexOf("?modal")>-1){
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