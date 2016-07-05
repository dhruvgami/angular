(function() {
    window.plaqueNav = {

        currentPage             : '',
        homePage                : 'projects',
        racetrack               : false,
        defaultLEEDID           : '1000005063',
        pageSwitchSpeed         : 300,
        dataInputSection        : '',
        dataAnalysisSection     : '',
        manageSection           : 'setup',
        current_score_index     : 0,
        next_score_index        : 1,
        current_score_direction : 'down',
        loaded_score_first_time : false,
        scroll_active           : true,
        proj_total_attempted    : 0,
        proj_total_available    : 0,
        proj_total_awarded      : 0,
        proj_total_pending      : 0,
        proj_total_denied       : 0,
        cat_scorecard_value     : {
                                    "pi": {"cat_total_attempted":0, "cat_total_available":0, "cat_total_awarded":0},
                                    "ss": {"cat_total_attempted":0, "cat_total_available":0, "cat_total_awarded":0},
                                    "we": {"cat_total_attempted":0, "cat_total_available":0, "cat_total_awarded":0},
                                    "ea": {"cat_total_attempted":0, "cat_total_available":0, "cat_total_awarded":0},
                                    "mr": {"cat_total_attempted":0, "cat_total_available":0, "cat_total_awarded":0},
                                    "iq": {"cat_total_attempted":0, "cat_total_available":0, "cat_total_awarded":0},
                                    "id": {"cat_total_attempted":0, "cat_total_available":0, "cat_total_awarded":0}  
                                  },
        meter_type_list         : [],
        userBuilding_permission : {},
        notify_downtime: notifyDowntime(),
        formBase64              : '',
        plaqueScore             : [],
		
		navSetup: function() {
            
            $('.selectViewText').html($('.UI_option[option='+UI_Version+']').html()); 
            
            $('body').on('click', 'svg', function(e)
            {
                section_page = $(this).parent().attr("id").split("_")[1];
                
                if(section_page == "overview")
                {
                    section_page = "energy";    
                }
                
                window.location.href = window.location.protocol + '//' + window.location.host + '/v3/dashboard/?page=data_input&section=' + section_page + '&LEED=' + plaque.LEED;
            });
            
            $('.logo_header').on('click', function()
            {
                window.location.href = window.location.protocol + '//' + window.location.host + '/v3/dashboard/';        
            });
            
            $('body').on('click', '.pdf_button', function(e)
            {
//                $.ajax(
//                {
//                    url: "/getLEEDONForm/LEED:" + plaque.LEED + '/?credit_id=' + $(this).attr('credit_id'),
//                    type: 'GET',
//                    contentType: 'application/json'
//                }).done(function(data)
//                {
//                    plaqueNav.formBase64 = data;
//                });
                $('#creditFormPDFObj').attr('data', "/getLEEDONForm/LEED:" + plaque.LEED + '/?credit_id=' + $(this).attr('credit_id'));
            });
            
//            $('.hoverOverview').mouseenter(function(e)
//            {
//                $('.navigation-tab-header').slideDown(); 
//                console.log('Enter');
//            });
//            
//            $('.navigation-tab-header').mouseleave(function(e)
//            {
//                if(projectList.getUrlParameter('page') == 'score')
//                {
//                    $('.navigation-tab-header').slideUp();    
//                }
//            });
            
            $('.closeImg').click(function()
            {
                $('.headerNotification').slideToggle();    
            });
            
            $('body').on('click', '#applyLeedOnline' ,function(e)
            {
                NProgress.configure({ ease: 'ease', speed: 500,
                                    showSpinner: false });
                NProgress.set(0.3);
                $('#notificationStat').html('Adding project to LEED Online  <p class="saving"><span>.</span><span>.</span><span>.</span></p>');
                $('.headerStatus').fadeToggle();

                json = {};

//                json['construction_start_date'] = '2015-01-01';
//                json['construction_end_date'] = '2015-01-02';
                json['longitude'] = '20.1';
                json['latitude'] = '70.1';
//                json['owner_name'] = 'TestName';
//                json['owner_city'] = 'New York';
//                json['owner_district'] = 'TestDistrict';
//                json['owner_zip_code'] = '10001';
//                json['owner_street'] = 'OwnerStreet';
//                json['owner_country'] = 'US';
//                json['owner_region'] = 'NY';
//                json['owner_telephone'] = '909090909090';
//                json['owner_email'] = 'rsohal@usgbc.org';

                $.ajax(
                {
                    url: "/registerLEEDON/LEED:" + plaque.LEED + '/',
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify(json)
                }).done(function(data)
                {
                    
                    if(data.message == 'ERROR')
                    {
                        $('#notificationDes').html(data.result);
                        $('.headerNotification').slideToggle();  
                        NProgress.done();  
                        
                        $('#notificationStat').html('Adding project to LEED Online  <p class="saving"><span>.</span><span>.</span><span>.</span></p>');
                        $('.headerStatus').hide();
                    }
                    else
                    {
                        $.ajax(
                        {
                            url: "/addProjectTimeline/LEED:" + plaque.LEED + '/',
                            type: 'GET',
                            contentType: 'application/json',
                        }).done(function(data)
                        {
                            if(data.message == 'ERROR')
                            {
                                $('#notificationDes').html(data.result);
                                $('.headerNotification').slideToggle();  
                                NProgress.done();  

                                $('#notificationStat').html('Adding project to LEED Online  <p class="saving"><span>.</span><span>.</span><span>.</span></p>');
                                $('.headerStatus').hide();
                            }
                            else
                            {
                                json = {};
//                                json['billing_name'] = 'TestName';
//                                json['billing_city'] = 'New York';
//                                json['billing_zip_code'] = '10001';
//                                json['billing_street'] = 'TestStreet';
//                                json['billing_country'] = 'US';
//                                json['billing_region'] = 'NY';
//                                json['billing_mail'] = 'rsohal@usgbc.org';
                                $.ajax(
                                {
                                    url: "/payment/paynowLEEDOnline/LEED:" + plaque.LEED + '/',
                                    type: 'POST',
                                    contentType: 'application/json',
                                    data: JSON.stringify(json)
                                }).done(function(data)
                                {
                                    if(data.message == 'ERROR')
                                    {
                                        $('#notificationDes').html(data.result);
                                        $('.headerNotification').slideToggle(); 
                                        $('#notificationStat').html('Adding project to LEED Online  <p class="saving"><span>.</span><span>.</span><span>.</span></p>');
                                        $('.headerStatus').hide();
                                        NProgress.done(); 
                                    }
                                    else
                                    {
                                        NProgress.done(); 
                                        $('#notificationStat').html('Redirecting to scorecard  <p class="saving"><span>.</span><span>.</span><span>.</span></p>');
                                        window.location.href = window.location.protocol + '//' + window.location.host + '/v3/dashboard/?page=data_scorecard&LEED=' + plaque.LEED;
                                    }   
                                });    
                            }
                            NProgress.set(0.8); 
                            $('#notificationStat').html('Adding project on LEED Online Timeline <p class="saving"><span>.</span><span>.</span><span>.</span></p>');
                        }).fail(function()
                        {
                            $('#notificationDes').html("timed out");
                            $('.headerNotification').slideToggle(); 
                            NProgress.done();
                            
                            $('#notificationStat').html('Adding project to LEED Online  <p class="saving"><span>.</span><span>.</span><span>.</span></p>');
                            $('.headerStatus').fadeToggle();
                        });
                    }
                    NProgress.set(0.5);  
                    $('#notificationStat').html('Registring project on LEED Online <p class="saving"><span>.</span><span>.</span><span>.</span></p>');
                }).fail(function()
                {
                    $('#notificationDes').html("Please try againg later.");
                    $('.headerNotification').slideToggle(); 
                    NProgress.done(); 
                    
                    $('#notificationStat').html('Adding project to LEED Online  <p class="saving"><span>.</span><span>.</span><span>.</span></p>');
                    $('.headerStatus').hide();
                });
            });
            
            $('body').on('click', '.scoreUpButton', function(e)
            {
                $('.controlBtns_betterScroll_a').each(function()
                {
                    if($(this).hasClass('active') == true)
                    {
                        nextIndex = (parseInt($(this).attr('index')) - 1);
                    }
                });
                
                if(nextIndex == -2)
                {
                    nextIndex = $('.controlBtns_betterScroll_a').length - 2;    
                }
                
                $('.controlBtns_betterScroll_a[index=' + nextIndex + ']').click();
        
            });
            
            $('body').on('click', '.scoreDownButton', function(e)
            {
                $('.controlBtns_betterScroll_a').each(function()
                {
                    if($(this).hasClass('active') == true)
                    {
                        nextIndex = (parseInt($(this).attr('index')) + 1);
                    }
                });
                
                if(nextIndex == $('.controlBtns_betterScroll_a').length - 1)
                {
                    nextIndex = -1;    
                }
                
                $('.controlBtns_betterScroll_a[index=' + nextIndex + ']').click();
            });

            /* YA: Building data modal window*/
            ///////////////////////////////////
            
            /*
            $('#building_per_data_link').on('click', function(e)
            {   
                if(!$(this).hasClass("active")){
                    plaque.elements.getPrereqData();
                    plaque.elements.getPerformanceScore();
                    plaque.elements.getPerformanceData();
                    plaque.elements.createNotifications();
                }
                $(this).addClass("active");

                $('#building_per_data_modal').toggle(300);
                e.stopPropagation();
            });*/

            /* Performance Score modal starts*/
            $("#building_per_score").on('click', function(e) {
                $('#building_per_data_modal').hide(300);
                $('#leed_certification_modal').modal('toggle');
                $('a[data-toggle=tab][href="#performance-score"]').tab('show');
            });
            /* Performance Score modal ends*/

            /* Performance Data modal starts*/
            $("#building_per_data").on('click', function(e) {
                $('#building_per_data_modal').hide(300);
                $('#leed_certification_modal').modal('toggle');
                $('a[data-toggle=tab][href="#performance-data"]').tab('show');
            });
            /* Performance Data modal ends*/

            /* LEED Prerequisites modal starts*/
            $("#building_per_prereq").on('click', function(e) {
                $('#building_per_data_modal').hide(300);
                $('#leed_certification_modal').modal('toggle');
                $('a[data-toggle=tab][href="#leed-prerequisites"]').tab('show');
            });
            /* LEED Prerequisites modal starts*/

            /* LEED Base Points modal starts*/
            $("#building_per_basepoints").on('click', function(e) {
                $('#building_per_data_modal').hide(300);
                $('#leed_certification_modal').modal('toggle');
                $('a[data-toggle=tab][href="#leed-base-points"]').tab('show');
            });
            /* LEED Base Points modal starts*/

            /* YA: Building data modal window*/
            ///////////////////////////////////
            
//            $('body').on('click', '#gbig_link', function(e)
//            {
//                $('#gbig_module').toggle(300);
//                e.stopPropagation();
//            });
            
            $('body').on('click',  function(e)
            {
                if(!($(e.target).attr('id') =='gbig_link' || $(e.target).attr('id') =='gbig_module' 
                    || $(e.target).attr('class') =='sourceContainer' 
                    || $(e.target).attr('class') =='sourceDetails' || $(e.target).attr('id') =='building_per_data_link'
                    || $(e.target).attr('id') =='building_per_data_link_dashboard'
                    || $(e.target).attr('id') =='building_per_data_modal' || $(e.target).attr('id') =='building_per_data_heading'
                    || $(e.target).attr('id') =='building_per_title' || $(e.target).attr('id') =='building_per_leed_cert'
                    || $(e.target).attr('id') =='building_per_data_body' || $(e.target).attr('class') =='building_per_body'
                    || $(e.target).attr('class') =='building_per_title' || $(e.target).attr('class') =='building_per_score'
                    || $(e.target).attr('class') =='current-score' || $(e.target).attr('class') =='current-divider'
                    || $(e.target).attr('class') =='total-score' || $(e.target).attr('class') =='building_per_status btn'
                ))
                {
                    $('#gbig_module').hide(300);
                    $('#building_per_data_modal').hide(300); //YA        
                }
            });
            
            $('#gbig_link').click(function()
            {
                if(projectList.getUrlParameter('LEED') != '0')
                {
                    url = "http://www.gbig.org/activities/leed-" + $(this).attr('leed_id');  
                }
                else
                {
                    url = "http://www.gbig.org/buildings/" + $(this).attr('gbig_id');      
                }
                window.open(url, '_blank');    
            });
            
            plaqueNav.navItemOnClick();
            $('body').on('click', '.input_nav', function()
            {
                page = $(this).attr('data-page');
                if (page == "data_analysis"){

                    if (ACTIVATE_BASIC_ANALYSIS == "True" && ACTIVATE_ACP_ANALYSIS == "False"){
                        History.pushState({
                            goto: page
                            }, page.charAt(0).toUpperCase() + page.slice(1), "?page=" + page + "&section=energy" + "&LEED=" + plaque.LEED);
                    }
                    else if (ACTIVATE_BASIC_ANALYSIS == "True" && ACTIVATE_ACP_ANALYSIS == "True"){
                        History.pushState({
                            goto: page
                            }, page.charAt(0).toUpperCase() + page.slice(1), "?page=" + page + "&section=energy" + "&LEED=" + plaque.LEED);
                    }
                }
                else if(page == "strategy_input"){
                    if (plaque.buildingData.scorecard_selected == false){
                        History.pushState({
                            goto: page
                            }, page.charAt(0).toUpperCase() + page.slice(1), "?page=" + page + "&LEED=" + plaque.LEED);
                    }
                    else{
                        History.pushState({
                            goto: "data_scorecard"
                            }, page.charAt(0).toUpperCase() + page.slice(1), "?page=data_scorecard" + "&LEED=" + plaque.LEED);   
                    }
                }
                else{
                    History.pushState({
                        goto: page
                        }, page.charAt(0).toUpperCase() + page.slice(1), "?page=" + page + "&LEED=" + plaque.LEED);
                }           
            });
            plaque.elements.setup(); // YA added for elements
            
            window.onresize = function(event) 
            {
                
                pageFixNav = plaqueNav.getParameterByName('page');
                
                if(pageFixNav == 'data_input')
                {
//                    $('.data_input_stratergy_nav').css('left', $('.meterList').offset().left);
//                    $('.header_data_input').css('left', $('.meterList').offset().left);    
                }
                
                else if(pageFixNav == 'strategy_input')
                {
//                    $('.data_input_stratergy_nav').css('left', $('#strategy_content').offset().left);
//                    $('.header_strategies').css('left', $('#strategy_content').offset().left);
                }
                
                else if(pageFixNav == 'data_scorecard')
                {
//                    $('.data_input_stratergy_nav').css('left', $('#scorecard_content').offset().left);
//                    $('.header_scorecard').css('left', $('#scorecard_content').offset().left);
                }
                
                else if(pageFixNav == 'data_analysis')
                {                    
//                    $('.data_input_stratergy_nav').css('left', $('#data_analysis_content').offset().left);
//                    $('.header_analysis_input').css('left', $('#data_analysis_content').offset().left);
                }
                
            };
            
        },
        
        getBasicBuildingDetails: function(forceCall) 
        {
            
            if(projectList.getUrlParameter('LEED') != '0')
            {
//                $.ajax(
//                {
//                    url: "/buildings/search_gbig/?q=" + plaque.LEED,
//                    type: 'GET',
//                    contentType: 'application/json'
//                }).done(function(data)
//                {
//                    if(data.results[0] != undefined)
//                    {
////                        $('#gbig_link').show(); 
//                        $('#gbig_link').attr('gbig_id', data.results[0].model_id);  
//                    }
//                    else
//                    {
//                        $('#gbig_link').hide();    
//                    }
//                });      
                $('#gbig_link').attr('leed_id', plaque.LEED);
            }
            else
            {
//                $('#gbig_link').show(); 
                $('#gbig_link').attr('gbig_id',projectList.getUrlParameter('gbig'));          
            }
            
            var forceCall = (typeof forceCall === "undefined") ? false : forceCall;
            if ((plaque.buildingData.name == undefined) && !forceCall) {
                $.ajax(
                {
                    url: "/buildings/LEED:" + plaque.LEED + "/",
                    type: 'GET',
                    async: false,
                    contentType: 'application/json'
                }).done(function(bldg){
                    plaque.buildingData = bldg;
                }).fail(function()
                {
                    ID = plaqueNav.getParameterByName('public'); 
                    LEED = plaqueNav.getParameterByName('LEED'); 
                    
                    if(LEED != '0')
                    {
                        url = window.location.protocol + '//' + window.location.host + "/buildings/search_gbig/ID:"+ ID +"/";    
                    }
                    else
                    {
                        url = window.location.protocol + '//' + window.location.host + "/buildings/search_gbig/ID:"+ ID +"/?LEED=False";   
                    }
                    
//                    $.ajax(
//                    {
//                        url: window.location.protocol + '//' + window.location.host + '/getByID?id='+ ID,
//                        type: 'GET',
//                        async: false,
//                        contentType: 'application/json'
//                    }).done(function(bldg){
//                        plaque.buildingData = bldg[0];
//                    });
                    
                    $.ajax(
                    {
                        url: url,
                        type: 'GET',
                        async: false,
                        contentType: 'application/json'
                    }).done(function(bldg){
                        plaque.buildingData = bldg;
                    });
                    
                });

                $.ajax(
                {
                    url: "/buildings/LEED:" + plaque.LEED + "/assosiatedcategories/",
                    type: 'GET',
                    async: false,
                    contentType: 'application/json'
                }).done(function(data_assosiatedcategories){
                    plaque.assosiatedCategories = data_assosiatedcategories;
                });
            }
            else if (forceCall){
                $.ajax(
                {
                    url: "/buildings/LEED:" + plaque.LEED + "/",
                    type: 'GET',
                    async: false,
                    contentType: 'application/json'
                }).done(function(bldg){
                    plaque.buildingData = bldg;
                }).fail(function()
                {
                    ID = plaqueNav.getParameterByName('public'); 
                    LEED = plaqueNav.getParameterByName('LEED'); 
                    
                    if(LEED != '0')
                    {
                        url = window.location.protocol + '//' + window.location.host + "/buildings/search_gbig/ID:"+ ID +"/";    
                    }
                    else
                    {
                        url = window.location.protocol + '//' + window.location.host + "/buildings/search_gbig/ID:"+ ID +"/?LEED=False";   
                    }
                    
//                    $.ajax(
//                    {
//                        url: window.location.protocol + '//' + window.location.host + '/getByID?id='+ ID,
//                        type: 'GET',
//                        async: false,
//                        contentType: 'application/json'
//                    }).done(function(bldg){
//                        plaque.buildingData = bldg[0];
//                    });
                    
                    $.ajax(
                    {
                        url: url,
                        type: 'GET',
                        async: false,
                        contentType: 'application/json'
                    }).done(function(bldg){
                        plaque.buildingData = bldg;
                    });
                });

                $.ajax(
                {
                    url: "/buildings/LEED:" + plaque.LEED + "/assosiatedcategories/",
                    type: 'GET',
                    async: false,
                    contentType: 'application/json'
                }).done(function(data_assosiatedcategories){
                    plaque.assosiatedCategories = data_assosiatedcategories;
                });
            }
        },
        
        initializeVariables: function() 
        {
            //Update user building permission
            if(plaqueNav.userBuilding_permission.role == undefined){
                $.ajax(
                {
                    url: '/buildings/LEED:' + plaque.LEED + '/permission/',
                    type: 'GET',
                    contentType: 'application/json',
                    async: false,
                }).done(function(permissionGet)
                {
                    plaqueNav.userBuilding_permission = permissionGet;
                    manageNav.survey_visibility();
                    manageNav.data_input_visibility();
                    manageNav.building_info_visibility();
                });
            }
            //End

            if(plaque.buildingData.trial_version_status == true)
            {
                trial_version_backend = 'True';    
            }
            else
            {
                trial_version_backend = 'False';    
            }
            
        },
        
        selectNavItem: function()
        {
            $('.nav_item').removeClass('nav_item_active');
//            $('.input_nav_active').removeClass('nav_item_active');
            if(plaqueNav.getParameterByName('page') == '')
            {
                $('.nav_item').addClass('disabled');
                $('.projects_nav').removeClass('disabled');
                $('.projects_nav').addClass('nav_item_active');        
            }
            else
            {
                $('.nav_item').removeClass('disabled');
                if(plaqueNav.getParameterByName('page') == 'data_input' || plaqueNav.getParameterByName('page') == 'data_scorecard' || plaqueNav.getParameterByName('page') == 'data_analysis' || plaqueNav.getParameterByName('page') == 'strategy_input')
                {
                    $('.nav_item[data-page=strategy_input]').addClass('nav_item_active');    
                }
                else
                {
                    $('.nav_item[data-page='+plaqueNav.getParameterByName('page')+']').addClass('nav_item_active');    
                }
                
//                if(plaqueNav.getParameterByName('page') == 'manage' || plaqueNav.getParameterByName('page') == 'score')
//                {
//                    $('.input_nav[data-page='+plaqueNav.getParameterByName('page')+']').addClass('input_nav_active');       
//                }
            }
        },
        
        navItemOnClick: function() {

            $('.nav_item').on('click', function() {

                var page;
                page = $(this).data('page');

                page = plaqueNav.checkActiveFunctionality(page);

                plaqueNav.currentPage = page;

                var ID = plaqueNav.getParameterByName('public');  

                if(logIn == 'False')
                {
                    if(plaque.LEED == 0)
                    {
//                        $.ajax(
//                        {
//                            url: window.location.protocol + '//' + window.location.host + '/getByID?id='+ ID,
//                            type: 'GET',
//                            contentType: 'application/json'
//                        }).done(function(data)
//                        {
//                            if(data[0].source_name != 'LEED')
//                            {
//                                $("#login_iFrame").attr('src',window.location.protocol + '//' + window.location.host+'/auth/login/?STAT=add_activate&LEED='+ID);
//                                $('#login_modal').modal('toggle');       
//                            }   
//                        });   
                        
                        $("#login_iFrame").attr('src',window.location.protocol + '//' + window.location.host+'/auth/login/?STAT=add_activate&LEED='+ID + '&name='+plaque.buildingData.name+'&street='+plaque.buildingData.street+'&city='+plaque.buildingData.city+'&state='+plaque.buildingData.state+'&country='+plaque.buildingData.country+'&zip_code='+plaque.buildingData.zip_code+'&gross_area='+plaque.buildingData.gross_area);
                        $('#login_modal').modal('toggle'); 
                        
                    }
                    else if(plaque.LEED != 0)
                    {
//                        $.ajax(
//                        {
//                            url: '/getByLEED/?lid='+ plaque.LEED,
//                            type: 'GET',
//                            contentType: 'application/json'
//                        }).done(function(data)
//                        {
//                            if(data[0].leedon_activated == "True")  
//                            {
//                                $("#login_iFrame").attr('src',window.location.protocol + '//' + window.location.host+'/auth/login/?STAT=view&LEED='+plaque.LEED+ '&ID=' + ID);
//                                $('#login_modal').modal('toggle'); 
//                            }
//                            else
//                            {
//                                $("#login_iFrame").attr('src',window.location.protocol + '//' + window.location.host+'/auth/login/?STAT=activate&LEED='+plaque.LEED+ '&ID=' + ID);
//                                $('#login_modal').modal('toggle'); 
//                            }
//                        });
                        
                        if(plaque.buildingData.leedon_activated == "True")  
                        {
                            $("#login_iFrame").attr('src',window.location.protocol + '//' + window.location.host+'/auth/login/?STAT=view&LEED='+plaque.LEED+ '&ID=' + ID);
                            $('#login_modal').modal('toggle'); 
                        }
                        else
                        {
                            $("#login_iFrame").attr('src',window.location.protocol + '//' + window.location.host+'/auth/login/?STAT=activate&LEED='+plaque.LEED+ '&ID=' + ID);
                            $('#login_modal').modal('toggle'); 
                        }
                        
                    }    
                }
                else if (access_to_project == 'True' && logIn == 'True' && plaque.LEED != '0' && trial_version_backend != 'True' && building_status_backend != 'activated') 
                {
                    // console.log("2");
                  if (building_status_backend == 'activated' || trial_version_backend == 'True') {
                    //do nothing
                  }
                  else{
                    if($(this).attr('data-page') == 'projects' || $(this).attr('data-page') == undefined || $(this).attr('data-page') == 'score')
                    {
                      //do nothing
                    }
                    else
                    {

                        var trial_text_for_modal = "It seems like your trial has expired";
                        if (trial_expire_backend == "None"){
                          $('.mandatory_step_header').html("ACTIVATE YOUR PROJECT");
                          trial_text_for_modal = "It seems like your project is deactivated";
                        }
                        else{
                          $('.mandatory_step_header').html("TRIAL EXPIRED");
                          trial_text_for_modal = "It seems like your trial has expired";
                        }
                            
                      if (is_agreement_required == 'True'){
                        $('#mandatory_step_text').html(trial_text_for_modal + '. Please sign agreement and pay for your project to access the dashboard.');
                        $('#sign_agreement_popup').modal('toggle');
                          return true;
                      }
                      else{
                        $('#mandatory_step_text').html(trial_text_for_modal + '. Please pay for your project to access the dashboard.');
                        $('#sign_agreement_popup').modal('toggle');
                          return true;
                      }
                    }
                  }
                }
                else if(!(building_status_backend != 'deactivated' || trial_version_backend == 'True') && logIn=='True' && access_to_project=='True')
                {
                       $.ajax(
                        {
                            url: '/buildings/activate/LEED:'+plaque.LEED+'/',
                            type: 'POST',
                            dataType: 'jsonp',
                            contentType: 'application/json',
                            data: JSON.stringify({'ID':ID})
                        }).done(function(data)
                        {
                            if(data == 'No Access')
                            {
                                if (document.URL.indexOf("LEED") > -1){
                                    History.pushState({
                                        goto: 'score'
                                        }, 'Score', "?page=score" + "&LEED=" + plaque.LEED + "&PERM=False");
                                }
                                else{
                                    History.pushState({
                                        goto: 'score'
                                        }, 'Score', "?page=score" + "&LEED=" + plaque.ID + "&PERM=False");
                                }
                            }
                            else
                            {
                                window.location.href = window.location.protocol + '//' + window.location.host + '/dashboard/?page=score' + '&LEED='+ plaque.LEED + '&modal=projectActive';
                            }
                            e.stopPropagation();   
                        });   
                }
                else if (logIn=='True' && plaque.LEED=='0')
                {
                    // console.log("1");
                    $.ajax(
                    {
                        url: '/buildings/activate/LEED:'+plaque.LEED+'/',
                        type: 'POST',
                        dataType: 'jsonp',
                        contentType: 'application/json',
                        data: JSON.stringify(plaque.buildingData)
                    }).done(function(data)
                    {
                        window.location.href = window.location.protocol + '//' + window.location.host + '/dashboard/?page=overview' + '&LEED='+ data + '&modal=projectActive';
                    });
                }

                if (access_to_project == 'False'){
                  if($(this).attr('data-page') == 'projects' || $(this).attr('data-page') == undefined)
                  {
                    // console.log("5");
                    //do nothing
                  }
                  else if(plaque.LEED!='0'){
                    // console.log("6");
                    $.ajax({ 
                      url: '/buildings/LEED:' + plaqueNav.getParameterByName('LEED') + '/permission/check/', 
                      async: true, 
                      success: function(response) {
                        if(building_status_backend == 'deactivated' && trial_version_backend == 'False')
                        {
                          $('#modalText').html("Project is not yet activated.");
                          $('.noShowLEED').modal('toggle');
                        }
                        else if (response == "DENIED")
                        {
                            $('#permission_needed').modal('hide');
                            $('#permission_denied').modal('show');
                        }
                        else if (response == "ALREADY EXIST"){
                          $('.request_sent_header').html('ALREADY SENT');
                          $('.request_sent_text').html('You have already sent a message to the project admin to get added to this project.');
                          $('#permission_needed_request_sent').val('OK');
                          $('#permission_needed_sent').modal('toggle');
                        }
                        else{
                          $('#permission_needed').modal('toggle');
                          $('.request_sent_header').html('REQUEST SENT');
                          $('.request_sent_text').html('Thank you! You will be notified when the admin has responded to the request.');
                          $('#permission_needed_request_sent').val('DONE');
                        }
                      },
                      error: function(xhr) 
                      {}
                    });
                  return;
                  }
                }

                if (page == 'projects'){
                     History.pushState({
                         goto: page
                         }, page.charAt(0).toUpperCase() + page.slice(1), "/v3/dashboard/");
                }
                else if (page == 'manage'){
//                    if (document.URL.indexOf("LEED") > -1){
//                        History.pushState({
//                            goto: page
//                            }, page.charAt(0).toUpperCase() + page.slice(1), "?page=" + page + "&section=setup&LEED=" + plaque.LEED);
//                    }
//                    else{
//                        History.pushState({
//                        goto: page
//                      }, page.charAt(0).toUpperCase() + page.slice(1), "?page=" + page + "&section=setup&ID=" + plaque.ID);
//                    }
                }
                else if (page == 'strategy_input'){
                    if (String(plaque.buildingData.scorecard_selected == false)){
                        History.pushState({
                            goto: page
                            }, page.charAt(0).toUpperCase() + page.slice(1), "?page=" + page + "&LEED=" + plaque.LEED);
                    }
                    else{
                        History.pushState({
                            goto: "data_scorecard"
                            }, page.charAt(0).toUpperCase() + page.slice(1), "?page=data_scorecard" + "&LEED=" + plaque.LEED);   
                    }
                }
                else{
                    if (document.URL.indexOf("LEED") > -1){
                        History.pushState({
                            goto: page
                            }, page.charAt(0).toUpperCase() + page.slice(1), "?page=" + page + "&LEED=" + plaque.LEED);
                    }
                    else{
                        // console.log("7");
                        History.pushState({
                        goto: page
                      }, page.charAt(0).toUpperCase() + page.slice(1), "?page=" + page + "&ID=" + plaque.ID);
                    }
                }
            });
        },
        drawRaceTrack: function(i)
        {
            plaque.kill();
            if (i < 0){
                $("#score-puck").fadeIn(plaqueNav.pageSwitchSpeed);
                plaque.setup({
                    page       : 'overview',
                    container  : 'racetrack_overview'
                }, false);
                $( window ).resize(function() {
                    plaque.racetracksize("overview");
                });
            }
            else{
                $(".name-puck-" + plaque.assosiatedCategories[i]["category"]).fadeIn(plaqueNav.pageSwitchSpeed);
                $(".name-puck-" + plaque.assosiatedCategories[i]["category"] + " .text").text(plaque.assosiatedCategories[i]["puck_name"]);
                plaque.setup(
                {
                    page       : plaque.assosiatedCategories[i]["category"],
                    container  : 'racetrack' + '_' + plaque.assosiatedCategories[i]["category"]
                }, false);
                plaque.racetracksize(plaque.assosiatedCategories[i]["category"]);
            }
            plaqueNav.scroll_active = true;
        },
        historySetup: function() {
            var History;

            History = window.History;
            History.enabled;
            return History.Adapter.bind(window, 'statechange', function() {
                var State, goto;
                State = History.getState();
                goto = State.data.goto;
                return plaqueNav.loadPage(goto);
          });
        },
        testIfBookmark: function() {
            var currPage;

            currPage = plaqueNav.getParameterByName('page');
            plaqueNav.currentPage = currPage;
            if (currPage === '') {
                return plaqueNav.loadPage(plaqueNav.homePage);
            } 
            else {
                return plaqueNav.loadPage(plaqueNav.getParameterByName('page'));
            }
        },
        getParameterByName: function(name) {
            var regex, regexS, results;

            name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
            regexS = "[\\?&]" + name + "=([^&#]*)";
            regex = new RegExp(regexS);
            results = regex.exec(window.location.search);
            // console.log(results);
            if (results === null) {
                return "";
            }
            else {
                return decodeURIComponent(results[1].replace(/\+/g, " "));
            }
        },
        loadPage: function(page) {
            
            $('.hideLabel').show();
            
            if(page == undefined)
                return;

            if (page!='projects'){
                plaqueNav.getBuildingKeyAndId();
                plaqueNav.getBasicBuildingDetails();
                plaqueNav.initializeVariables();
                page = plaqueNav.checkActiveFunctionality(page);
                getMeterData.setup();
                if (plaqueNav.getParameterByName('LEED') != '') {
                    $('#building_name').html(plaque.buildingData.name);
                    if (plaque.buildingData.scorecard_selected == false){
                        $('.strategy_input_tab_txt').html('Strategies');
                    }
                    else{
                        $('.strategy_input_tab_txt').html('Scorecard');
                    }
                    var building_address_header = "";
                    if (plaque.buildingData.state == plaque.buildingData.country){
                        building_address_header = plaque.buildingData.city + ', ' + plaque.buildingData.country;
                        $('#building_address').html(building_address_header);
                    }
                    else{
                        if (isNaN(plaque.buildingData.state.split(plaque.buildingData.country)[1])){
                            building_address_header = plaque.buildingData.city + ', ' + plaque.buildingData.state.split(plaque.buildingData.country)[1] + ', ' + plaque.buildingData.country;
                            $('#building_address').html(building_address_header);
                        }
                        else{
                            $.ajax({
                              type: "GET",
                              contentType: 'application/json',
                              url: "/buildings/LEED:" + plaque.LEED + "/getencodedcountrystate/"
                            }).done(function(data) {
                                building_address_header = plaque.buildingData.city + ', ' + data.state + ', ' + plaque.buildingData.country;
                                $('#building_address').html(building_address_header);
                            });
                        }
                    }
                }
                
                if(notification.stream_foreign_id.length == 0)
                {
                    notification.checkNotification();    
                }
            }
                
            if(page == 'data_input_section' || page == "data_analysis_section"){
                return;
            }

            $('.nav_item').removeClass('current');
            $('.nav_item[data-page=' + page + ']').addClass('current');
            $('.category_nav').hide();

            if ((page == "strategy_input" && plaque.buildingData.scorecard_selected == false) || (page == "data_scorecard" && plaque.buildingData.scorecard_selected == true)){
                if (plaque.buildingData.scorecard_selected == false){
                    History.pushState({
                        goto: "strategy_input"
                        }, page.charAt(0).toUpperCase() + page.slice(1), "?page=strategy_input&LEED=" + plaque.LEED);
                }
                else{
                    History.pushState({
                        goto: "data_scorecard"
                        }, page.charAt(0).toUpperCase() + page.slice(1), "?page=data_scorecard&LEED=" + plaque.LEED);   
                }
//                return;
            }

            if(page === "projects"){

                document.title = "USGBC LEED Dashboard";
                plaqueNav.racetrack = false;
                plaqueNav.refreshInitialVariables();
                url = '/static/dashboard_v3/projects.html';
            }
            else if(page === "score"){
                document.title = "Score";
                plaqueNav.racetrack = true;
                $(window).unbind('.projectPageScroll');
                url = '/static/dashboard_v3/score.html';
                $('.input_nav').removeClass('input_nav_active');
                $('.input_nav[data-page='+page+']').addClass('input_nav_active');
                plaqueNav.selectNavItem();
            }
            else if(page === "data_input")
            {
                $('.input_nav').removeClass('input_nav_active');
                $('.input_nav[data-page='+page+']').addClass('input_nav_active');
                document.title = "Data Input";
                plaqueNav.racetrack = false;
//                $('.data_input_category_nav').show();
//                $('.manage_category_nav').hide();
                $(window).unbind('.projectPageScroll');
                url = '/static/dashboard_v3/input_html/input.html';
                $('.nav_item[data-page=strategy_input]').addClass('current');
                plaqueNav.selectNavItem();
                plaqueNav.showStrategiesLoadingMessage('Loading your meters...');
            }
            else if(page === "strategy_input")
            {   
                $('.strategy_input_tab_txt').html('Strategies');
                $('.input_nav').removeClass('input_nav_active');
                $('.input_nav[data-page='+page+']').addClass('input_nav_active');
                document.title = "Strategies";
                plaqueNav.racetrack = false;
                url = '/static/dashboard_v3/input_html/strategies.html';
                plaqueNav.selectNavItem();
//                $('.data_input_category_nav').show();
//                $('.meter_types_nav').hide();
            }
            else if(page === "data_scorecard")
            {
                $('.strategy_input_tab_txt').html('Scorecard');
                $('.input_nav').removeClass('input_nav_active');
                $('.input_nav[data-page=strategy_input]').addClass('input_nav_active');
                document.title = "Scorecard";
                plaqueNav.racetrack = false;
                url = '/static/dashboard_v3/input_html/data_scorecard.html';
                plaqueNav.initScorecard();
//                $('.data_input_category_nav').show();
//                $('.meter_types_nav').hide();
            }
            else if(page === "data_analysis")
            {
                $('.input_nav').removeClass('input_nav_active');
                $('.input_nav[data-page='+page+']').addClass('input_nav_active');
                document.title = "Data Analysis";
                plaqueNav.racetrack = false;
//                $('.data_input_category_nav').show();
//                $('.manage_category_nav').hide();
                $(window).unbind('.projectPageScroll');
                url = '/static/dashboard_v3/input_html/analysis.html';
                $('.nav_item[data-page=strategy_input]').addClass('current');
                plaqueNav.selectNavItem();
                
            }
            else if(page === "survey")
            {
                document.title = "Survey";
                plaqueNav.racetrack = false;
                $(window).unbind('.projectPageScroll');
                if (plaqueNav.getParameterByName('language') === 'fr') {
                    url = '/static/dashboard_v3/survey_french.html?date=04042016-v2';
                } else {
                    url = '/static/dashboard_v3/survey.html?date=04042016-v2';
                }
            }
            else if(page === "manage")
            {
                $('.input_nav').removeClass('input_nav_active');
                $('.input_nav[data-page='+page+']').addClass('input_nav_active');
                document.title = "Manage";
                plaqueNav.racetrack = false;
                $(window).unbind('.projectPageScroll');
                $('.manage_category_nav').show();
                $('.data_input_category_nav').hide();

                if (document.URL.indexOf("section") > -1 ){
                    plaqueNav.manageSection = plaqueNav.getParameterByName('section');
                }
                else
                {
                    if (document.URL.indexOf("LEED") > -1){
                        History.pushState({
                            goto: page
                            }, page.charAt(0).toUpperCase() + page.slice(1), "?page=" + page + "&section=setup&LEED=" + plaque.LEED);
                    }
                    else{
                        History.pushState({
                        goto: page
                      }, page.charAt(0).toUpperCase() + page.slice(1), "?page=" + page + "&section=setup&ID=" + plaque.ID);
                    }    
                }
                
                url = '/static/dashboard_v3/manage_html/' + plaqueNav.manageSection + '.html';
            }
            else if(page === "explore") {
                document.title = "Explore";
                plaqueNav.racetrack = false;
                $(window).unbind('.projectPageScroll');
                url = '/static/dashboard_v3/explore.html';
            }

            else if(page === "help")
            {
                document.title = "Help";
                plaqueNav.racetrack = false;
                $(window).unbind('.projectPageScroll');
                
                url = '/static/dashboard_v3/help.html';
            }

            $.ajax({
                url: url,
                cache: true,
            }).done(function(data) {
                
				page_content = data;
                $('.main_container').html(page_content);
                
                if(page == 'score')
                {
                    $('.scoreUpButton').hide();  
                    $('.hideLabel').hide();
                }
                
                if (page !== 'score'){
                    try {
                        $.fn.fullpage.destroy();
                        plaqueNav.loaded_score_first_time = false;
                    }
                    catch(err) {
                        //do nothing
                    }
					$('body').css('overflow-y', 'scroll');
                }
                
                if(page == 'strategy_input')
                {
//                    $('.data_input_stratergy_nav').css('left', $('#strategy_content').offset().left);
                    $('.header_strategies').css('left', $('#strategy_content').offset().left);
                    manageNav.data_input_visibility();
                    $('.data_input_category_nav').show();
                    $('.meter_types_nav').hide();
                }
                /*
                if(page == 'strategy_input_test')
                {
                    $('.data_input_stratergy_nav').css('left', $('#strategy_content').offset().left);
                    $('.header_strategies').css('left', $('#strategy_content').offset().left);
                }
                */

                if(page == 'data_scorecard')
                {
//                    $('.data_input_stratergy_nav').css('left', $('#scorecard_content').offset().left);
                    $('.header_scorecard').css('left', $('#scorecard_content').offset().left);
                    $('.data_input_category_nav').show();
                    $('.meter_types_nav').hide();
                }

                if(page == 'projects')
                {
                    projectList.initPage(); 
                    projectList.search(1);
                    $('#building_name').html('');
                    $('#building_address').html('');
                }
                else if(page == 'data_input')
                {
                    $('.data_input_category_nav').show();
                    $('.manage_category_nav').hide();
                    
                    getMeterData.getMeters();
                    getMeterData.get_meter_types();
                    
//                    if (document.URL.indexOf("section") > -1 ){
//                        var section_page = plaqueNav.getParameterByName('section');
//                        plaqueNav.dataInputNav($('.data_input_category[category-type=' + section_page + ']'));
//                    }
//                    $('.data_input_stratergy_nav').css('left', $('.meterList').offset().left);
//                    $('.header_data_input').css('left', $('.meterList').offset().left);
                }
                else if(page == 'data_analysis')
                {
//                    $('.data_input_stratergy_nav').css('left', $('#data_analysis_content').offset().left);
//                    $('.header_analysis_input').css('left', $('#data_analysis_content').offset().left);
                    if (document.URL.indexOf("section") > -1 ){
                        var section_page = plaqueNav.getParameterByName('section');
                        plaqueNav.dataAnalysisNav($('.data_input_category[category-type=' + section_page + ']'), true);
                    }
                    $('.data_input_category_nav').show();
                    $('.manage_category_nav').hide();
                }
                else if(page == 'survey')
                {
                    plaque.survey.initsurvey();
                }
                else if(page == 'manage')
                {
                    $('.manage_category_nav').show();
                    $('.data_input_category_nav').hide();
                    $('.color_bar').hide();
                    var section_page = plaqueNav.getParameterByName('section');
                    plaqueNav.manageNav($('.manage_category[category-type=' + section_page + ']'));
					if(plaqueNav.manageSection == 'team')
					{
						manageNav.projectTeamInfo();
					}
                    else if(plaqueNav.manageSection == 'account')
					{
						manageNav.userAgreement();
                        manageNav.accountDataInfo();
					}
					else if(plaqueNav.manageSection == 'setup')
					{
//                        $('#expand_lobby').click();
						manageNav.buildingInfo();
						manageNav.buildingSetupSubmit();
                        manageNav.linksSetup();
						hoursCalculator.setup();
                        manageNav.projectStrategies();
					}
                    else if(plaqueNav.manageSection == 'connected_apps')
                    {
                        manageNav.connectedApps();
                    }
                    else if(plaqueNav.manageSection == 'certifications')
                    {
                        performancePeriod.setup();    
                    }
                    manageNav.account_visibility();
                    manageNav.building_info_visibility();
                }
                else if(page == 'help')
                {
                    plaqueNav.initHelp();
                }
                else if (page === 'explore') {
                    plaqueExplore.initexplore();
                }
                
                if (plaqueNav.racetrack) {
                    
                    for (var i = 0; i < plaque.assosiatedCategories.length; i++) {
                        $('.main_track_container').append("<div class='racetrack_design section'><div class='div_center' id='racetrack_" + plaque.assosiatedCategories[i]["category"] + "'><div class='name-puck' id='name-puck-"  + plaque.assosiatedCategories[i]["category"] + "'" + "><div class='text'></div></div></div></div>"); 
                        $("#racetrack_" + plaque.assosiatedCategories[i]["category"]).css({'height': '750px'});
                        $('.controlBtns_betterScroll').append("<a class='controlBtns_betterScroll_a controlBtns_" + plaque.assosiatedCategories[i]["category"] + "' index='" + i + "'></a>");
                    };

                    plaque.kill();

                    plaque.setup({
                        page       : 'overview',
                        container  : 'racetrack_overview'
                    }, true);

                    $( window ).resize(function() {
                        plaque.racetracksize("overview");
                    });

                    $('#fullpage').fullpage({
                    afterLoad: function(anchorLink, index){
                        if (!plaqueNav.loaded_score_first_time){
                            plaqueNav.loaded_score_first_time = true;
                            $('.controlBtns_overview').css('background-color', '#82A74E');
                            return;
                        }

                        plaque.kill();
                        $("#fullpage").find('svg').remove();
                        $("#score-puck").hide();
                        $("#fullpage").find('.name-puck').hide();

                        if (index == 1){
                            $("#score-puck").fadeIn(plaqueNav.pageSwitchSpeed);
                            plaque.setup({
                                page       : 'overview',
                                container  : 'racetrack_overview'
                            }, false);
                            $( window ).resize(function() {
                                plaque.racetracksize("overview");
                            });
                        }
                        else{
                            $("#name-puck-" + plaque.assosiatedCategories[index-2]["category"]).fadeIn(plaqueNav.pageSwitchSpeed);
                            $("#name-puck-" + plaque.assosiatedCategories[index-2]["category"] + " .text").text(plaque.assosiatedCategories[index-2]["puck_name"]);
                            plaque.setup(
                            {
                                page       : plaque.assosiatedCategories[index-2]["category"],
                                container  : 'racetrack' + '_' + plaque.assosiatedCategories[index-2]["category"]
                            }, false);
                            plaque.racetracksize(plaque.assosiatedCategories[index-2]["category"]);
                        }
                        plaqueNav.scroll_active = true;
                    },
                    onLeave: function(index, nextIndex, direction){
                        plaqueNav.scroll_active = false;
                        var leavingSection = $(this);
                        plaqueNav.current_score_direction = direction;
                        plaqueNav.current_score_index     = index-1;
                        plaqueNav.next_score_index        = nextIndex-1;

                        //Control buttons starts
                        $('.controlBtns_betterScroll').find('a').removeClass('active');
                        $('.controlBtns_betterScroll').find('a').css('background-color', '#ccc');
                        $('.controlBtns_betterScroll a').each(function( index_btr, value ){
                            if (index_btr == plaqueNav.next_score_index){
                                $(this).addClass('active');
                                if ($(this).index() == 0){
                                    $(this).css('background-color', '#82A74E');
                                }
                                else{
                                    $(this).css('background-color', plaque.assosiatedCategories[$(this).index()-1].color);
                                }
                            }
                        });
                        
                        if(plaqueNav.next_score_index == 0)
                        {
                            $('.scoreUpButton').hide(); 
                            $('.scoreDownButton').show(); 
                        }
                        else if(plaqueNav.next_score_index == 5)
                        {
                            $('.scoreDownButton').hide();
                            $('.scoreUpButton').show(); 
                        }

                        if(plaqueNav.next_score_index < 5 && plaqueNav.next_score_index > 0)
                        {
                            $('.scoreDownButton').show(); 
                            $('.scoreUpButton').show(); 
                        }

                        //Control buttons ends
                    },
                    "scrollingSpeed": 1000
                });
                plaqueNav.controlScoreScroll();
            }
            plaqueNav.selectNavItem();
            plaqueNav.selectHeaderItem(page);
//            plaqueNav.switchOverviewUI();
            });


        },
        getBuildingKeyAndId: function() {
            var LEED, key;

            key = plaqueNav.getParameterByName('key');
            plaque.key = key ? key : 'dae17c00693b7dda7c020d09';
            LEED = plaqueNav.getParameterByName('LEED');
            plaque.LEED = LEED ? LEED : plaqueNav.defaultLEEDID;
        },
        selectHeaderItem: function(page)
        {
            if(page != 'projects' && page != 'explore')
            {
                $('.searchFields').hide();
                $('.buildingInfo').show();
            }
            else
            {
                $('.searchFields').show(); 
                $('.buildingInfo').hide();
                if (page == 'explore') {
                    $('.country_filter').addClass('displayNoneClass');
                    $('.main_container').addClass('overflow_hidden');
                    $('.country_filter').addClass('fullWidth');
                    $('#filterSelectDiv').addClass('width276');
                    $('.certification_list').addClass('no-border');
                }else{
                    $('.country_filter').removeClass('displayNoneClass');
                    $('.main_container').removeClass('overflow_hidden');
                    $('.country_filter').removeClass('fullWidth');
                    $('#filterSelectDiv').removeClass('width276');
                    $('.certification_list').removeClass('no-border');
                }
            }
            if (page == 'explore') {
                $(".meterInfo").css("display","none !important");
            }
        },
        initNavMenus: function()
        {
            $('.hamMenu').on('click', function()
            {
                if($('.nav').css('display') == 'none')
                {
                    $('.nav').show('slide', {direction: 'left'}, 250);    
                }
                else
                {
                    $('.nav').hide('slide', {direction: 'left'}, 250);    
                }
            });

            $('html').click(function(e) 
            {
                if(e.target.className != 'nav_item' && e.target.className != 'hamMenu' && $('.hamMenu').css('display') == 'block')
                    $('.nav').hide('slide', {direction: 'left'}, 250); 
            });

            $('body').on('click' ,'.data_input_category' , function()
            {

                page = plaqueNav.getParameterByName('page');
                
                if (page == "data_input"){
                    plaqueNav.dataInputNav(this);
                    if (plaqueNav.dataInputSection == ''){
                        if (document.URL.indexOf("LEED") > -1){
                            History.pushState({
                                goto: 'data_input_section'
                            }, 'Data Input', "?page="+page+"&LEED=" + plaque.LEED);
                        }
                        else{
                            History.pushState({
                                goto: 'data_input_section'
                            }, 'Data Input', "?page="+page+"&ID=" + plaque.ID);
                        }
                    }
                    else{
                        if (document.URL.indexOf("LEED") > -1){
                            History.pushState({
                                goto: 'data_input_section'
                            }, 'Data Input', "?page="+page+"&section=" + $(this).attr('category-type') + "&LEED=" + plaque.LEED);
                        }
                        else{
                            History.pushState({
                                goto: 'data_input_section'
                            }, 'Data Input', "?page="+page+"&section=" + $(this).attr('category-type') + "&ID=" + plaque.ID);
                        }
                    }
                }
                else if (page == "data_analysis"){
                    plaqueNav.dataAnalysisNav(this);
                    if (document.URL.indexOf("LEED") > -1){
                        History.pushState({
                            goto: 'data_analysis_section'
                        }, 'Data Analysis', "?page="+page+"&section=" + $(this).attr('category-type') + "&LEED=" + plaque.LEED);
                    }
                    else{
                        History.pushState({
                            goto: 'data_analysis_section'
                        }, 'Data Analysis', "?page="+page+"&section=" + $(this).attr('category-type') + "&ID=" + plaque.ID);
                    }
                }

            });

            // YA test
            $('.performance-score .category_type').on('click', function(){
                page = "data_input"; 
                section =  $(this).attr('category-type');    
                
                if (document.URL.indexOf("LEED") > -1){
                    window.location.href = window.location.protocol + '//' + window.location.host + '/v3/dashboard/?page=data_input&section='+section+'&LEED=' + plaque.LEED;
                }
                else{
                    window.location.href = window.location.protocol + '//' + window.location.host + '/v3/dashboard/?page=data_input&section='+section+'&ID=' + plaque.ID;
                }
            });

            $(document.body).on('click','.performance-score .prereq-intent-title', function () {

                if (document.URL.indexOf("LEED") > -1){
                    window.location.href = window.location.protocol + '//' + window.location.host + '/v3/dashboard/?page=strategy_input&LEED=' + plaque.LEED;
                }
                else{
                    window.location.href = window.location.protocol + '//' + window.location.host + '/v3/dashboard/?page=strategy_input&ID=' + plaque.ID;
                }
            });
            // YA test

            $('.manage_category').on('click', function()
            {
                if (document.URL.indexOf("LEED") > -1){
                    History.pushState({
                        goto: 'manage'
                    }, 'Manage', "?page=manage&section=" + $(this).attr('category-type') + "&LEED=" + plaque.LEED);
                }
                else{
                    History.pushState({
                        goto: 'manage'
                    }, 'Manage', "?page=manage&section=" + $(this).attr('category-type') + "&ID=" + plaque.ID);
                }
            });

            $('#login').on('click', function()
            {
				if(plaqueNav.getParameterByName('page') != '')
				{
					$("#login_iFrame").attr('src',window.location.protocol + '//' + window.location.host+"/auth/login/?STAT=view&LEED="+plaqueNav.getParameterByName('LEED')+"&ID="+plaqueNav.getParameterByName('public'));	
				}
				else
				{
					$("#login_iFrame").attr('src',window.location.protocol + '//' + window.location.host+"/auth/login/");
				}
                $('.login_modal').modal('toggle');
            });

            $('#drp_btn_header').on('click', function()
            {
                if($('#drp_btn_header_black').css('display')=="none"){
                    $('#drp_btn_header_black').css('display', 'block');
                }
                else{
                    $('#drp_btn_header_black').css('display', 'none');
                }
            });

            $(document).mouseup(function (e){
                var container = $('#drp_btn_header');
                if (!container.is(e.target) // if the target of the click isn't the container...
                    && container.has(e.target).length === 0) // ... nor a descendant of the container
                {
                    $('#drp_btn_header_black').css('display', 'none');
                }
            });
            
            $('.switch_UI').on('click', function()
            {
                $('.UI_option').toggle();    
                
                if($('.selectViewText').html() == "Choose View ")
                {
                    $('.selectViewText').html($('.UI_option[option='+UI_Version+']').html());        
                }
                else
                {
                    $('.selectViewText').html("Choose View ");        
                }
            });
            
            $('.UI_option').on('click', function() 
            {
                UI_option = $(this).attr('option');
                
                $.ajax({
                    url: '/auth/version/',
                    type: 'POST',
                    dataType: 'jsonp',
                    contentType: 'application/json',
                    data: JSON.stringify({"version": UI_option})
                }).done(function(data) {
                    if(UI_option == 'v1')
                    {
                        var switch_url = document.URL.split('v3/').join('');   
                    }
                    else if(UI_option == 'v2')
                    {
                        var switch_url = document.URL.split('v3/').join('v2/');           
                    }
                    
                    if (switch_url[(switch_url.length)-1] == '/')
                    {
                        switch_url = switch_url.substring(0, (switch_url.length)-1);
                    } 
                    
                    if(UI_option != 'v3')
                    {
                        window.location = plaqueNav.switchUIException(plaqueNav.getParameterByName('page'), plaqueNav.getParameterByName('section'), switch_url);    
                    }
                });
            });

            if(plaqueNav.getParameterByName('req_access') == 'true')
            {
                $("#permission_needed").modal("toggle");   
            }

            $('#login_iFrame').load(function()
            {
                res = $('#login_iFrame').contents().find("pre").html();
                if(res != undefined)
                {
                    $('#login_modal').hide();
                    $('.modal-backdrop').hide();
                    $('#modalText').html("You don't have permission to activate this building");
                    $('.noShowLEED').modal('toggle');
                }
            });

            $('#dismiss').on('click', function()
            {
                if(logIn == 'False')
                {
                    location.reload();
                }
            });

            $('.main_container').on('click', '#analysis_building_info_header', function() {
                var degrees = 0;
                if($('#analysis_basic_details').css('display') == 'none')
                {
                  $('#analysis_basic_details').slideDown();
                  $('#analysis_absolute_CC').slideDown();
                }
                else
                {
                  $('#analysis_basic_details').slideUp();
                  $('#analysis_absolute_CC').slideUp();
                  degrees = -90;
                }
                $(this).find('.caret').css({'-webkit-transform' : 'rotate('+ degrees +'deg)',
                     '-moz-transform' : 'rotate('+ degrees +'deg)',
                     '-ms-transform' : 'rotate('+ degrees +'deg)',
                     'transform' : 'rotate('+ degrees +'deg)'});
            });

            $('.main_container').on('click', '#analysis_performance_score_header', function() {
                var degrees = 0;
                if($('.analysis_performance_scale').css('display') == 'none')
                {
                  $('.analysis_performance_scale').slideDown();
                }
                else
                {
                  $('.analysis_performance_scale').slideUp();
                  degrees = -90;
                }
                $(this).find('.caret').css({'-webkit-transform' : 'rotate('+ degrees +'deg)',
                     '-moz-transform' : 'rotate('+ degrees +'deg)',
                     '-ms-transform' : 'rotate('+ degrees +'deg)',
                     'transform' : 'rotate('+ degrees +'deg)'});
            });

            $('.main_container').on('click', '#analysis_info_header', function() {
                var degrees = 0;
                if($('.confidence_level_container').css('display') == 'none')
                {
                  $('.confidence_level_container').slideDown();
                  $('#analysis_CC').slideDown();
                  $('#last_12_month_data_container').slideDown();
                }
                else
                {
                  $('.confidence_level_container').slideUp();
                  $('#analysis_CC').slideUp();
                  $('#last_12_month_data_container').slideUp();
                  degrees = -90;
                }
                $(this).find('.caret').css({'-webkit-transform' : 'rotate('+ degrees +'deg)',
                     '-moz-transform' : 'rotate('+ degrees +'deg)',
                     '-ms-transform' : 'rotate('+ degrees +'deg)',
                     'transform' : 'rotate('+ degrees +'deg)'});
            });

            $('.main_container').on('click', '#analysis_tool', function() {
                var degrees = 0;
                if($('#analysis_if_reduce').css('display') == 'none')
                {
                  $('#analysis_if_reduce').slideDown();
                  $('#analysis_if_increase').slideDown();
                }
                else
                {
                  $('#analysis_if_reduce').slideUp();
                  $('#analysis_if_increase').slideUp();
                  degrees = -90;
                }
                $(this).find('.caret').css({'-webkit-transform' : 'rotate('+ degrees +'deg)',
                     '-moz-transform' : 'rotate('+ degrees +'deg)',
                     '-ms-transform' : 'rotate('+ degrees +'deg)',
                     'transform' : 'rotate('+ degrees +'deg)'});
            });

            $('.main_container').on('change', '.absolute_CC_drp', function ()
            {
                var val_occ = parseFloat($('#mtco2e_occ').html()).toFixed(6);
                var val_SF = parseFloat($('#mtco2e_sq').html()).toFixed(6);
                if($('.absolute_CC_drp :selected').text() == 'Per year'){
                    $('#mtco2e_occ').html(parseFloat((val_occ/30) * 365).toFixed(2));
                    $('#mtco2e_sq').html(parseFloat((val_SF/30) * 365).toFixed(2));
                }
                else if ($('.absolute_CC_drp :selected').text() == 'Per month'){
                    $('#mtco2e_occ').html(parseFloat((val_occ/365) * 30).toFixed(2));
                    $('#mtco2e_sq').html(parseFloat((val_SF/365) * 30).toFixed(2));
                }
            });

        },
        dataInputNav: function(el)
        {
            
            $('.data_input_category').each(function()
            {
                $(this).removeClass($(this).attr("category-type") + '_cat_active');
            });

            if($('.data_input_tool_bar').html() != 'Inputs'){
                $('.data_input_tool_bar').trigger('click');
            }

            $('.color_bar').hide();
            $('.' + plaqueNav.dataInputSection + '_cat').removeClass(plaqueNav.dataInputSection + '_cat_active');
            
            if($(el).attr('category-type') != plaqueNav.dataInputSection)
            {
//                selectedCat = $(el).attr('category-type');
//                $(el).addClass(selectedCat + '_cat_active');
//                $('.' + selectedCat + '_cat_color').show();   
                plaqueNav.dataInputSection = $(el).attr('category-type');
                $(el).addClass(plaqueNav.dataInputSection + '_cat_active');
                $('.' + plaqueNav.dataInputSection + '_cat_color').show();   
            }
            else
            {
                plaqueNav.dataInputSection = '';
            }
            
//            var target = '.' + selectedCat + '_meter_label';
//            $('html, body').animate(
//            {
//                scrollTop: $(target).offset().top - 260
//            }, 500);
//            
//            plaqueNav.dataInputSection = selectedCat;
            
            getMeterData.filterMeters();
        },
        dataAnalysisNav: function(el, initial)
        {
            initial=false;
            if($(el).attr('category-type') != plaqueNav.dataAnalysisSection || initial)
            {
                $('.data_input_category').each(function()
                {
                    $(this).removeClass($(this).attr("category-type") + '_cat_active');
                });

                $('.color_bar').hide();
                $('.' + plaqueNav.dataAnalysisSection + '_cat').removeClass(plaqueNav.dataAnalysisSection + '_cat_active');
                plaqueNav.dataAnalysisSection = $(el).attr('category-type');
                $(el).addClass(plaqueNav.dataAnalysisSection + '_cat_active');
                $('.' + plaqueNav.dataAnalysisSection + '_cat_color').show();
                if (!getAnalysisData.last_12_month_score_flag){
                  getAnalysisData.getLastTwelveMonthScore();
                }
                $('#analysis_info_header').hide();
                $('.confidence_level_container').hide();
                $('#analysis_tool').hide();
                $('.analysis_label').attr('class', 'analysis_label');
                $('.therm_meter_color').attr('class', 'therm_meter_color');
                $('.therm_meter_color').css('width', '0%');
                $('.therm_meter_temp_color').css('width', '0%');
                $('#conf_level_container').show();
                $('#analysis_if_reduce').show();
                $('#analysis_if_increase').show();
                $('.partition_line_analysis_if').show();
                $('.mtco2e_occ_main').show();
                $('.mtco2e_sq_main').show();
                $('#analysis_CC').show();
                $('.partition_line_analysis_CC').show();
                $('#month_of_data_container').attr('class', 'col-md-6');
                eval("getAnalysisData." + plaqueNav.dataAnalysisSection + "()");
            }
        },
        manageNav: function(el)
        {
            $('.manage_category').removeClass('manage_cat_active');

            plaqueNav.manageSection = $(el).attr('category-type');
            $(el).addClass('manage_cat_active');
            $('.' + plaqueNav.manageSection + '_cat_color').show();

            if ((IS_SUPERUSER == "True" || String(plaqueNav.userBuilding_permission.role) == 'Project Admin') && ACTIVATE_CONNECTED_APPS_UI == "True"){
                $('.manage_category[category-type=connected_apps]').show();
            }

            if (plaque.buildingData.lobby_survey_status){
                $('#checkbox-lobbySurvey').prop('checked', true);
                
                var today_date_time  = new Date();
                var expiry_date_time = new Date(plaque.buildingData.survey_expire_date);
                var display_date     = manageNav.formattedDate(expiry_date_time);
                var display_hours    = String(expiry_date_time.getHours());
                if (display_hours.length===1){
                  display_hours = '0' + display_hours;
                }
                var display_minutes  = String(expiry_date_time.getMinutes());
                if (display_minutes.length===1){
                  display_minutes = '0' + display_minutes;
                }
                var display_time     = display_hours + ":" + display_minutes;


                if (today_date_time > expiry_date_time)
                {
                    $('#survey_expire_date').html("");
                }
                else
                {
                    $('#survey_expire_date').html('Until '+ display_date + ' ' + display_time);    
                }
                
                $('#survey_expire_date').show();
            }
            else{
                $('#checkbox-lobbySurvey').prop('checked', false);
                $('#survey_expire_date').hide();
            }

            if (plaque.buildingData.leed_score_public){
                $('#checkbox-LDP-confidential').prop('checked', false);
            }
            else{
                $('#checkbox-LDP-confidential').prop('checked', true);
            }

            if (plaque.buildingData.survey_with_dashboard){
                $('#checkbox-LDP-showRacetrack').prop('checked', true);
            }
            else{
                $('#checkbox-LDP-showRacetrack').prop('checked', false);
            }

            $('#expand_lobby').on('click', function() {
                if ($('#expand_lobby span').html() == 'Expand'){
                    $('#expand_lobby span').html("Close");
                }
                else{
                    $('#expand_lobby span').html("Expand");
                }
                $('.expand_lobby_slide').slideToggle();
            });

            $('#expand_LDP_visibility').on('click', function() {
                if ($('#expand_LDP_visibility span').html() == 'Expand'){
                    $('#expand_LDP_visibility span').html("Close");
                }
                else{
                    $('#expand_LDP_visibility span').html("Expand");
                }
                $('.LDP_slide').slideToggle();
            });

            $('.connected_apps_expand').on('click', function() {
                if ($(this).find('span').html() == 'Expand') {
                    $(this).find('span').html("Close");
                }
                else{
                     $(this).find('span').html("Expand");
                }
                $(this).parent().parent().parent().find('.expand_connected_apps').slideToggle();
            });

            $('.switch_UI_manage').on('click', function() {
                
                var switch_url = document.URL.split('v3/').join('');
                if (switch_url[(switch_url.length)-1] == '/'){
                    switch_url = switch_url.substring(0, (switch_url.length)-1);
                }
                window.location = plaqueNav.switchUIException(plaqueNav.getParameterByName('page'), plaqueNav.manageSection, switch_url);
            });

            $("#checkbox-lobbySurvey").change(function() {
                var lobbyData = {};
                if(this.checked) {
                    lobbyData = {"lobby_survey_status": "True"};
                }
                else{
                    lobbyData = {"lobby_survey_status": "False"};
                }

                $.ajax({
                  type: "PUT",
                  contentType: 'application/json',
                  data: JSON.stringify(lobbyData),
                  url: "/buildings/LEED:" + plaque.LEED + "/"
                }).done(function(data) {
                    
                    var today_date_time  = new Date();
                    var expiry_date_time = new Date(data.survey_expire_date);
                    var display_date     = manageNav.formattedDate(expiry_date_time);
                    var display_hours    = String(expiry_date_time.getHours());
                    if (display_hours.length===1){
                      display_hours = '0' + display_hours;
                    }
                    var display_minutes  = String(expiry_date_time.getMinutes());
                    if (display_minutes.length===1){
                      display_minutes = '0' + display_minutes;
                    }
                    var display_time     = display_hours + ":" + display_minutes;
                    
                    
                    if (today_date_time > expiry_date_time)
                    {
                        $('#survey_expire_date').html("");
                    }
                    else
                    {
                        $('#survey_expire_date').html('Until '+ display_date + ' ' + display_time);    
                    }
                    
                    if(data.lobby_survey_status == false)
                    {
                        $('#survey_expire_date').hide();   
                    }
                    else
                    {
                        $('#survey_expire_date').show();       
                    }
                    
                   
                    //do nothing
                });
            });

            $("#checkbox-LDP-confidential").change(function() {
                var leed_score_public = {};
                if(this.checked) {
                    leed_score_public = {"leed_score_public": "False"};
                }
                else{
                    leed_score_public = {"leed_score_public": "True"};
                }

                $.ajax({
                  type: "PUT",
                  contentType: 'application/json',
                  data: JSON.stringify(leed_score_public),
                  url: "/buildings/LEED:" + plaque.LEED + "/"
                }).done(function(data) {
                    //do nothing
                });
            });

            $("#checkbox-LDP-showRacetrack").change(function() {
                var surveyData = {};
                if(this.checked) {
                    surveyData = {"survey_with_dashboard": "True"};
                }
                else{
                    surveyData = {"survey_with_dashboard": "False"};
                }

                $.ajax({
                  type: "PUT",
                  contentType: 'application/json',
                  data: JSON.stringify(surveyData),
                  url: "/buildings/LEED:" + plaque.LEED + "/"
                }).done(function(data) {
                    //do nothing
                });
            });
        },
        switchUIException: function(page, section, url){
            var new_url = url;

            if (page == '' && section == ''){
                //do nothing
            }
            else if (page == 'score' && section == ''){
                new_url = new_url.replace("score", "overview");
            }
            else if (page == 'strategy_input'){
                if (new_url.indexOf("&subsection=strategies&LEED") < 0){
                    new_url = new_url.replace("&LEED", "&subsection=strategies&LEED");
                }
                if (section == 'humanexperience'){
                    new_url = new_url.replace("humanexperience", "human");
                }
            }
            else if (page == 'data_scorecard'){
                if (new_url.indexOf("&subsection=data_scorecard&LEED") < 0){
                    new_url = new_url.replace("&LEED", "&subsection=data_scorecard&LEED");
                }
                if (section == 'humanexperience'){
                    new_url = new_url.replace("humanexperience", "human");
                }
            }
            else if (page == 'data_input'){
                if (section == 'humanexperience'){
                    new_url = new_url.replace("humanexperience", "human");
                }
            }
            else if (page == 'data_analysis'){
                new_url = new_url.replace("data_analysis", "data_input");
                if (section == 'humanexperience'){
                    new_url = new_url.replace("humanexperience", "human");
                }
            }
            else if (page == 'survey' && section == ''){
                //do nothing
            }
            else if (page == 'manage'){
                if (section == 'setup'){
                    new_url = new_url.replace("manage", "data_input");
                }
                else if (section == 'team'){
                    new_url = new_url.replace("manage", "account");
                    new_url = new_url.replace("team", "teamManagement");
                }
                else if (section == 'account'){
                    new_url = new_url.replace("account", "useragreement");
                    new_url = new_url.replace("manage", "account");
                }
                else if (section == "connected_apps"){
                    new_url = new_url.replace("manage&section=connected_apps", "connected_apps");
                }
            }

            return new_url;
        },
        refreshInitialVariables: function(){
            notification.stream_foreign_id = [];
            plaque.buildingData = {};
            plaque.assosiatedCategories = [];
        },
        showStrategiesLoadingMessage: function(msg){
            $(document).ready(function() {
                $.blockUI({
                    message: msg,
                    css: { 
                        'font-size': '121%',
                        border: 'none', 
                position: 'absolute',
                backgroundColor: '#000', 
                'border-radius': '10px',
                opacity: 0.6, 
                color: '#fff',
                top: '60%', /* YA: new UI */
                left: '40%'
              }, 
            });
            
          }); 
        },

        removeStrategiesLoadingMessage: function(time) {
          setTimeout($.unblockUI, time);     
        },
        initHelp: function(){
            
        },
        controlScoreScroll: function(){
            $('body').on('click', '.controlBtns_betterScroll_a', function(e) {
                if (plaqueNav.scroll_active){
                    var clicked_btn = parseInt($(this).attr('index')) + 1;
                    
                    if (!$(this).hasClass('active')) {

                        $('.controlBtns_betterScroll').find('a').removeClass('active');
                        $('.controlBtns_betterScroll').find('a').css('background-color', '#ccc');
                        $('.controlBtns_betterScroll a').each(function( index_btr, value ){
                            if (index_btr == clicked_btn){
                                $(this).addClass('active');
                                if ($(this).index() == 0){
                                    $(this).css('background-color', '#82A74E');
                                }
                                else{
                                    $(this).css('background-color', plaque.assosiatedCategories[$(this).index()-1].color);
                                }
                            }
                        });

                        var move_to = clicked_btn+1;
                        $.fn.fullpage.moveTo(move_to);
                    }
                    else{
                        return;
                    }
                }
                
            });
       },
       initScorecard: function(){

            $.ajax(
            {
                url: "/buildings/LEED:" + plaque.LEED + "/scorecard/",
                type: 'GET',
                contentType: 'application/json'
            }).done(function(data)
            {   
                //Create scorecard category heeader dynamically
                var category_names = {};

                for (var i = 0; i < data.length; i++) {
                    if (data[i].creditcategorydescrption.trim() != ""){
                        var shortcat = data[i].creditshortid.trim().toLowerCase().substr(0,2);
                        if(shortcat == 'ie' || shortcat == 'eq')
                            shortcat = "iq";
                        else if (shortcat == 'io')
                            shortcat = "id";
                        if (data[i].creditcategorydescrption.trim() != 'Innovation and Design Process'){
                            if (category_names[data[i].creditcategorydescrption.trim()] == undefined){
                                category_names[data[i].creditcategorydescrption.trim()] = shortcat;                            
                            }
                        }
                    }
                }

                var div_header = "";
                for(key in category_names){
                    div_header += '<div class="cataegory-div parent-accordion-section pb18" id="section-' + category_names[key] + '">';
                    div_header += '<div class="parent-accordion-section-title scorecard_row_color_change pt0 background_e1e1e1 br18" data-href="#parent-section-' + category_names[key] + '">';
                    div_header += '<p class="inline-block_important mb0 w45p scorecard_header_responsive">' + key + '</p>';
                    div_header += '<div class="inline_block scorecard_row_color_change cat_scorecard_row cat_outOf_scorecard"><span class="scorecard_row_color_change mr8 cat_total_attempted inline-block_important"></span><span class="scorecard_row_color_change mr8 inline-block_important">of</span><span class="scorecard_row_color_change mr8 cat_total_available inline-block_important"></span></div>';
                    div_header += '<div class="inline_block scorecard_row_color_change cat_scorecard_row w18p"><span class="scorecard_row_color_change mr35 inline-block_important header_status_scorecard">AWARDED</span><span class="scorecard_row_color_change cat_total_awarded inline-block_important"></span></div>';
                    div_header += '<img class="cat_img_scorecard" alt="" src="/static/dashboard/img/leed/' + category_names[key] + '-border.png">';
                    div_header += '</div>';
                    div_header += '<div class="parent-accordion-section-content mt10" id="parent-section-' + category_names[key] + '"></div>'
                    div_header += '</div>';
                }

                $('#scorecard_content').append(div_header);
                //

                var categories_data       = data;
                var rating_system         = "";
                var final_point_available = "";
                var final_point_awarded   = "";

                plaqueNav.proj_total_attempted = 0;
                plaqueNav.proj_total_available = 0;
                plaqueNav.proj_total_awarded   = 0;
                plaqueNav.proj_total_pending   = 0;
                plaqueNav.proj_total_denied    = 0;

                if ((data[0].crediturl).indexOf('LEED-')>-1){
                    rating_system = data[0].crediturl.split('LEED-')[1];
                }
                else{
                    rating_system = data[0].crediturl
                }
                

                for (var i = 0; i < categories_data.length; i++) {

                    if (isNaN((categories_data[i].creditshortid)[(categories_data[i].creditshortid).length-1])){
                        continue;
                    }
                    if ((categories_data[i].creditshortid).toLowerCase().substr(0,2) == "pi"){
                        $('#parent-section-pi').append(plaqueNav.scorecardRow("pi", rating_system, categories_data[i]));
                    }
                    else if ((categories_data[i].creditshortid).toLowerCase().substr(0,2) == "ss"){
                        $('#parent-section-ss').append(plaqueNav.scorecardRow("ss", rating_system, categories_data[i]));
                    }
                    else if ((categories_data[i].creditshortid).toLowerCase().substr(0,2) == "we"){
                        $('#parent-section-we').append(plaqueNav.scorecardRow("we", rating_system, categories_data[i]));
                    }
                    else if ((categories_data[i].creditshortid).toLowerCase().substr(0,2) == "ea"){
                        $('#parent-section-ea').append(plaqueNav.scorecardRow("ea", rating_system, categories_data[i]));
                    }
                    else if ((categories_data[i].creditshortid).toLowerCase().substr(0,2) == "mr"){
                        $('#parent-section-mr').append(plaqueNav.scorecardRow("mr", rating_system, categories_data[i]));
                    }
                    else if ((categories_data[i].creditshortid).toLowerCase().substr(0,2) == "ie" || (categories_data[i].creditshortid).toLowerCase().substr(0,2) == "eq" || (categories_data[i].creditshortid).toLowerCase().substr(0,2) == "iq"){
                        $('#parent-section-iq').append(plaqueNav.scorecardRow("iq", rating_system, categories_data[i]));
                    }
                    else if ((categories_data[i].creditshortid).toLowerCase().substr(0,2) == "io" || (categories_data[i].creditshortid).toLowerCase().substr(0,2) == "id"){
                        $('#parent-section-id').append(plaqueNav.scorecardRow("id", rating_system, categories_data[i]));
                    }
                }
                $("#proj_total_attempted").html(plaqueNav.proj_total_attempted);
                $("#proj_total_available").html(plaqueNav.proj_total_available);
                $("#proj_total_awarded").html(plaqueNav.proj_total_awarded);
                $("#proj_total_pending").html(plaqueNav.proj_total_pending);
                $("#proj_total_denied").html(plaqueNav.proj_total_denied);

                $( "#leed_score_progressbar" ).progressbar({
                    value: (plaqueNav.proj_total_awarded / plaqueNav.proj_total_available) * 100
                });
                $('#project_total_points').html('<b>' + plaqueNav.proj_total_awarded +'</b>/'+ plaqueNav.proj_total_available);
            });
       },
       scorecardRow: function(category, rating_system, categories_data){
            var div                = '';
            var pointsavailable    = categories_data.pointsavailable;
            var creditPoints       = categories_data.pointsawarded;
            var creditStatus       = categories_data.creditstatus;
            var pointsawarded      = (categories_data.pointsawarded).split('.')[0];
            var pointsatempted_txt = "";

            if (category == "id" && categories_data.phasedescription == "Design Phase"){
              // Do nothing
            }
            else{
              if (categories_data.pointsattempted != "" && !isNaN(categories_data.pointsattempted)){
                  plaqueNav.proj_total_attempted += parseFloat(categories_data.pointsattempted);
                  plaqueNav.cat_scorecard_value[category]["cat_total_attempted"] += parseFloat(categories_data.pointsattempted);
              }

              if (categories_data.pointsawarded != "" && !isNaN(categories_data.pointsawarded)){
                  plaqueNav.proj_total_awarded   += parseFloat(categories_data.pointsawarded);
                  plaqueNav.cat_scorecard_value[category]["cat_total_awarded"] += parseFloat(categories_data.pointsawarded);
              }

              if (categories_data.pendingpts != "" && !isNaN(categories_data.pendingpts)){
                  plaqueNav.proj_total_pending   += parseFloat((categories_data.pendingpts).trim());
              }

              if (categories_data.deniedpts != "" && !isNaN(categories_data.deniedpts)){
                  plaqueNav.proj_total_denied    += parseFloat((categories_data.deniedpts).trim());
              }
              

              if (pointsavailable.indexOf('-')>-1){
                  if (pointsavailable.split("-")[1] != "" && !isNaN(pointsavailable.split("-")[1])){
                      plaqueNav.proj_total_available += parseFloat(pointsavailable.split("-")[1]);
                      plaqueNav.cat_scorecard_value[category]["cat_total_available"] += parseFloat(pointsavailable.split("-")[1]);
                  }
              }
              else{
                  if (pointsavailable != "" && !isNaN(pointsavailable)){
                      plaqueNav.proj_total_available += parseFloat(pointsavailable);
                      plaqueNav.cat_scorecard_value[category]["cat_total_available"] += parseFloat(pointsavailable);
                  }
              }
            }

            if(pointsavailable == "0"){
                pointsatempted_txt = "REQUIRED";
            }
            else if (creditStatus == ""){
                if (pointsavailable.indexOf("-")>-1){
                    pointsatempted_txt = "<div class='inline_block mr15 w60p'>ATTEMPTED</div>" + "  " + pointsavailable.split("-")[0] + " - " + pointsavailable.split("-")[1];
                    $("#section-" + category).find(".cat_scorecard_row").css("display","inline-block");
                }
                else{
                    pointsatempted_txt = "<div class='inline_block mr15 w60p'>ATTEMPTED</div>" + "  0 - " + pointsavailable;
                    $("#section-" + category).find(".cat_scorecard_row").css("display","inline-block");
                }
            }
            else if (creditStatus == "Awarded"){
                pointsatempted_txt = "<div class='display_inlineb mr15 w60p'>AWARDED</div class='inline_block mr10'>" + "  " + pointsawarded;
                $("#section-" + category).find(".cat_scorecard_row").css("display","inline-block");
            }

            if (categories_data.creditstatuscode == 'C003'){
                creditStatus = 'Attempted';
            }
            else if(categories_data.creditstatuscode == 'C006'){
                creditStatus = 'Anticipated';
            }
            else if(categories_data.creditstatuscode == 'C007'){
                creditStatus = 'Denied';
            }
            else if(categories_data.creditstatuscode == 'C008'){
                creditStatus = 'Pending';
            }
            else if(categories_data.creditstatuscode == 'C010'){
                creditStatus = 'Awarded';
            }
            else if(categories_data.creditstatuscode == 'C011'){
                creditStatus = 'Under Review';
            }
            else if(categories_data.creditstatuscode == 'C019'){
                creditStatus = 'Approved';
            }
            else if(categories_data.creditstatuscode == 'C020'){
                creditStatus = 'Not Approved';
            }
            else if(categories_data.creditstatuscode == 'C023' || categories_data.creditstatuscode == 'C024'){
                creditStatus = 'Ready for review';
            }
            else{
                creditStatus = (categories_data.possible == "Reviewed") ? "In Progress":"Not Attempted";
            }

            if (creditStatus.toLowerCase()=="not attempted"){
                filter_creditStatus = "unattempted";
            }
            else if (creditStatus.toLowerCase()=="not approved"){
                filter_creditStatus = "not-approved";
            }
            else if(creditStatus.toLowerCase()=="ready for review"){
                filter_creditStatus = "completed";
            }
            else if(creditStatus.toLowerCase()=="under review"){
                filter_creditStatus = "completed";
            }
            else{
                filter_creditStatus = creditStatus.toLowerCase();
            }

            $('#parent-section-' + category).parent().find('.cat_total_attempted').html(plaqueNav.cat_scorecard_value[category]["cat_total_attempted"]);
            $('#parent-section-' + category).parent().find('.cat_total_available').html(plaqueNav.cat_scorecard_value[category]["cat_total_available"]);
            $('#parent-section-' + category).parent().find('.cat_total_awarded').html(plaqueNav.cat_scorecard_value[category]["cat_total_awarded"]);

            div += '<div class="item intent-div section accordion-section scorecard_row display_inlineb w100p gotham status-' + filter_creditStatus + '" id="category-row-' + categories_data.creditshortid + '">';
            div += '<div class="scorecard_check_img scorecard_child_row display_inlineb">';
            div += '</div>';
            div += '<div class="category_code scorecard_child_row display_inlineb">';
            div += categories_data.creditshortid;
            div += '</div>';
            div += '<div class="category_name scorecard_child_row display_inlineb">';
            div += categories_data.creditdescription;
            div += '</div>';
            div += '<div class="category_rating_system scorecard_child_row display_inlineb">';
            div += rating_system;
            div += '</div>';
            div += '<div class="category_status scorecard_child_row display_inlineb bold">';
            div += creditStatus;
            div += '</div>';
            div += '<div class="category_points_range scorecard_child_row display_inlineb bold">';
            div += pointsatempted_txt;
            div += '</div>';
           
            div += '<div class="pdf_button scorecard_child_row display_inlineb" credit_id = "'+ categories_data.creditid +'">';
            div += 'Form';
            div += '</div>';
           
            div += '</div>';
            return div;
       },
       checkActiveFunctionality: function(page){

            $('.data_input_category.energy_cat').show();
            $('.data_input_category.water_cat').show();
            $('.data_input_category.waste_cat').show();
            $('.data_input_category.transportation_cat').show();
            $('.data_input_category.humanexperience_cat').show();

            if (ACTIVATE_EXPLORE_IN_NEW_UI == "False"){
                $('.nav_item.explore_nav').hide();
            }
            else{
                $('.nav_item.explore_nav').show();
            }

            if (ACTIVATE_ELEMENTS_IN_NEW_UI == "False" && plaque.buildingData.scorecard_selected == false){
                $(".navigation-tab.input_nav[data-page=strategy_input]").hide();
            }
            else if(ACTIVATE_SCORECARD == "False" && plaque.buildingData.scorecard_selected == true){
                $(".navigation-tab.input_nav[data-page=strategy_input]").hide();
            }
            else if(ACTIVATE_ELEMENTS_IN_NEW_UI == "True" && plaque.buildingData.scorecard_selected == false){
                $(".navigation-tab.input_nav[data-page=strategy_input]").show();
                $(".navigation-tab.input_nav[data-page=data_scorecard]").hide();
            }
            else if(ACTIVATE_SCORECARD == "True" && plaque.buildingData.scorecard_selected == true){
                $(".navigation-tab.input_nav[data-page=strategy_input]").hide();
                $(".navigation-tab.input_nav[data-page=data_scorecard]").show();
            }

            if (ACTIVATE_BASIC_ANALYSIS == "False" && ACTIVATE_ACP_ANALYSIS == "False"){
                $("div[data-page='data_analysis']").hide();
            }
            else if (ACTIVATE_BASIC_ANALYSIS == "True" || ACTIVATE_ACP_ANALYSIS == "True"){
                $("div[data-page='data_analysis']").show();
            }

            if (ACTIVATE_ACP_ANALYSIS == "True"){
                $('#building_per_data_link').show();
                $('#building_per_data_link_dashboard').show();
            }
            else{
                $('#building_per_data_link').hide();
                $('#building_per_data_link_dashboard').hide();
            }

            if (page == "strategy_input" && ACTIVATE_ELEMENTS_IN_NEW_UI == "False" && plaque.buildingData.scorecard_selected == false){
                page = "data_input";
            }
            else if (page == "strategy_input" && ACTIVATE_SCORECARD == "False" && plaque.buildingData.scorecard_selected == true){
                page = "data_input";
            }
            else if (page == "data_scorecard" && ACTIVATE_SCORECARD == "False" && plaque.buildingData.scorecard_selected == true){
                page = "data_input";
            }

            if (page == "data_analysis"){
                if (ACTIVATE_BASIC_ANALYSIS == "False"){
                    page = "data_input";
                }
                else if (ACTIVATE_BASIC_ANALYSIS == "True"){
                    $('.data_input_category.energy_cat').show();
                    $('.data_input_category.water_cat').show();
                    $('.data_input_category.waste_cat').show();
                    $('.data_input_category.transportation_cat').show();
                    $('.data_input_category.humanexperience_cat').show();
                    $('.data_input_category_nav').find('.energy_cat_color').show();
                }
            }

            return page;
       },
        switchOverviewUI: function()
        {
            if(plaqueNav.racetrack)
            {
                $('.buildingHeaderName').addClass('buildingHeaderName_overview');
                $('.buildingHeaderAddress').addClass('buildingHeaderAddress_overview');  
                $('.header').addClass('header_overview');
                $('.navigation-tab-header').addClass('navigation-tab-header_overview');
                $('.navigation-tab-header').hide();
                $('.hoverOverview').show();
            }
            else
            {
                $('.buildingHeaderName').removeClass('buildingHeaderName_overview');
                $('.buildingHeaderAddress').removeClass('buildingHeaderAddress_overview'); 
                $('.header').removeClass('header_overview');
                $('.navigation-tab-header').removeClass('navigation-tab-header_overview');
                $('.navigation-tab-header').show();
                $('.hoverOverview').hide();
            }
        }

        
    };
    
    function notifyDowntime()
    {
        if (intimate_downtime)
        {
            $(document).ready(function()
            {
                $('.all_logout').click(function()
                {
                    sessionStorage.intimate_downtime = "activate";
                });

                if (sessionStorage.intimate_downtime)
                {
                    if (sessionStorage.intimate_downtime == "activate")
                    {
                        //do nothing
                    }
                    else
                    {
                        return;
                    }
                }
                sessionStorage.setItem("intimate_downtime", "activate");
                $('.jquery-header-bar').css('font-family', '"Montserrat", Helvetica, sans-serif');
                $('.notification p').first().html("<span style='font-size: 16px;'><b>LEEDON.IO SCHEDULED MAINTENANCE MAY 6 - MAY 7</b></span><br><span style='font-size: 13px;'>LEEDON.IO will be offline from 9 pm EST on May 6, 2016 until 12 pm on May, 7, 2016 for maintenance. During this time, you will not be able to log into the system, while we perform routine maintenance and implement system updates.<br><a href='mailto:contact@leedon.io'>Contact us for more information.</a>");
                $('.jquery-header-bar').hide().delay(3000).slideDown(400);
                $('.jquery-arrow').click(function()
                {
                    sessionStorage.intimate_downtime = "deactivate";
                    $('.jquery-header-bar').slideUp();
                });
            });
        }
    }
    
    $( document ).ready(function() 
    {
        plaqueNav.initNavMenus();
        plaqueNav.navSetup();
        plaqueNav.historySetup();
        plaqueNav.selectNavItem();
        return plaqueNav.testIfBookmark();
    });
}).call(this);
