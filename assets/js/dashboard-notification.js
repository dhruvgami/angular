(function()
{

    window.notification = {
        stream_foreign_id: [],
        decoded_building_data: '',
        unique_notification_arr: [],
        one_time_tour_done: false,
        
        setup: function()
        {
            $(document).mouseup(function(e)
            {
                var container = $(".meterInfo");

                if (!container.is(e.target) // if the target of the click isn't the container...
                    && container.has(e.target).length === 0) // ... nor a descendant of the container
                {
                    if ($(".notification_module").css("display") == "block")
                    {
                        $(".notification_module").toggle(300);
                    }
                }
            });

            $(".meterInfo").on('click', function()
            {
                $(".notification_module").toggle(300);
            });    
            
            $('body').on('click', ".red_bell_notification", function()            
            {                
                notification_selected = $(this).attr('id');
                page_selected = plaqueNav.getParameterByName("page");
                if(notification_selected == 'data_input_human_from_notification')
                {
                    page = 'data_input';
                    History.pushState(
                    {
                        goto: page
                    }, page.charAt(0).toUpperCase() + page.slice(1), "?page=" + page + "&section=humanexperience&LEED=" + plaque.LEED);    
                }
                else if(notification_selected == 'data_input_transportation_from_notification')
                {
                    page = 'data_input';
                    $('#enterOccupancy').show();
                    $('#enterOccupancy').on('click', function()
                    {
                        page = 'manage';
                        History.pushState(
                        {
                            goto: page
                        }, page.charAt(0).toUpperCase() + page.slice(1), "?page=" + page + "&section=project_plaque&LEED=" + plaque.LEED);
                    });

                    if(plaque.buildingData.occupancy > 0)
                    {
                        if (building_status_backend != 'activated' && trial_version_backend != 'True')
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
                            
                            if (is_agreement_required == 'True')
                            {
                                $('#mandatory_step_text').html(trial_text_for_modal + '. Please sign agreement and pay for your project to access the dashboard.');
                                $('#sign_agreement_popup').modal('toggle');
                            }
                            else
                            {
                                $('#mandatory_step_text').html(trial_text_for_modal + '. Please pay for your project to access the dashboard.');
                                $('#sign_agreement_popup').modal('toggle');
                            }
                        }
                        else
                        {
                            var val = encodeURI(window.location.protocol + '//' + window.location.hostname + '/v3/dashboard/?page=survey&LEED=' + window.plaque.LEED + '&key=' + window.plaque.key);
                            var url = val.replace(/&/g, "%26");
                            var message = 'Hi there,%0A%0APlease fill out this quick survey to help us better understand our building performance and to make you as comfortable as possible. Click below to begin.%0A%0A'+url+' %0A%0AThank you for your important contributions to our LEED Dynamic Plaque data!%0A%0AWant to learn more about how we use the LEED Dynamic Plaque to track building performance? Visit leedon.io.';
                            window.open('mailto:?subject=LEED Dynamic Plaque - Survey Link&body='+message, '_self');
                        }
                    }
                    else
                    {
                        $('#noOccupancyModal').modal('toggle');
                    }
                }
                else if(notification_selected == 'data_input_waste_from_notification')
                {
                    page = 'data_input';
                    History.pushState(
                    {
                        goto: page
                    }, page.charAt(0).toUpperCase() + page.slice(1), "?page=" + page + "&section=waste&LEED=" + plaque.LEED);    
                }
                else if(notification_selected == 'data_input_water_from_notification')
                {
                    page = 'data_input';
                    History.pushState(
                    {
                        goto: page
                    }, page.charAt(0).toUpperCase() + page.slice(1), "?page=" + page + "&section=water&LEED=" + plaque.LEED);    
                                    }
                else if(notification_selected == 'data_input_energy_from_notification')
                {
                    page = 'data_input';
                    History.pushState(
                    {
                        goto: page
                    }, page.charAt(0).toUpperCase() + page.slice(1), "?page=" + page + "&section=energy&LEED=" + plaque.LEED);    
                }
                else if(notification_selected == 'data_input_setup_from_notification')
                {
                    page = 'manage';
                    History.pushState(
                    {
                        goto: page
                    }, page.charAt(0).toUpperCase() + page.slice(1), "?page=" + page + "&section=project_plaque&LEED=" + plaque.LEED);
                }
                else if(notification_selected == 'add_team_from_notification')
                {
                    page = 'manage';
                    History.pushState(
                    {
                        goto: page
                    }, page.charAt(0).toUpperCase() + page.slice(1), "?page=" + page + "&section=team&LEED=" + plaque.LEED);
                }
                else if(notification_selected == 'select_plan_from_notification')
                {
                    var switch_url = document.URL.split('v3/').join('');
                    if (switch_url[(switch_url.length)-1] == '/'){
                        switch_url = switch_url.substring(0, (switch_url.length)-1);
                    }
                    window.location = plaqueNav.switchUIException('score', '', switch_url + '&trigger=' + notification_selected);
                }
                else if(notification_selected == 'sign_agreement_from_notification')
                {
                    var switch_url = document.URL.split('v3/').join('');
                    if (switch_url[(switch_url.length)-1] == '/'){
                        switch_url = switch_url.substring(0, (switch_url.length)-1);
                    }
                    window.location = plaqueNav.switchUIException('score', '', switch_url + '&trigger=' + notification_selected);
                }
                
            });

            plaque.elements.getPerformanceScore();

            $('body').on('click', "#building_per_data_link", function(e){
                $('#building_per_data_modal').toggle("complete", function(){

                    if(!$(this).hasClass("active")){
                        window.notification.loadPerformanceScoreNotif();
                    }
                    $(this).addClass("active");
                });                 
                e.stopPropagation();
            });
            
            $('body').on('click', "#building_per_data_link_dashboard", function(e){

                $('#building_per_data_modal').toggle("complete", function(){
                    if(!$(this).hasClass("active")){
                        window.notification.loadPerformanceScoreNotif();
                    }
                    $(this).addClass("active");
                });
                e.stopPropagation();
            });

            $('#building_per_data_link_dashboard').circleProgress({
                value: 1,
                size: 46,
                thickness: 5,
                animation:false,
                startAngle:-Math.PI / 4 * 2,
                fill: { color: '#E6E6E6' }
            }); 

        },

        loadPerformanceScoreNotif: function(){
            plaque.elements.getPerformanceData();
                        
            if(plaque.elements.snapshot_flag == true){
                plaque.elements.getPrereqData();                            
                plaque.elements.getBasePoints();
                plaque.elements.createNotifications();
            }
            else{

                $("#building_per_data_modal #building_per_data_body #building_per_prereq").addClass("inactiveLink");
                $("#leed_certification_modal .nav1 .leed-prerequisites").addClass("inactiveLink");
                $("#building_per_data_modal #building_per_data_body #building_per_prereq .ajax_loader_leed_cert").removeClass("display_inline").addClass("display_none");
                $("#building_per_data_modal #building_per_data_body #building_per_prereq .current-score").removeClass("display_none");
                $("#building_per_data_modal #building_per_data_body #building_per_prereq .current-divider").removeClass("display_none");
                $("#building_per_data_modal #building_per_data_body #building_per_prereq .total-score").removeClass("display_none");

                $("#building_per_data_modal #building_per_data_body #building_per_basepoints").addClass("inactiveLink");
                $("#leed_certification_modal .nav1 .leed-base-points").addClass("inactiveLink");
                $("#building_per_data_modal #building_per_data_body #building_per_basepoints .ajax_loader_leed_cert").removeClass("display_inline").addClass("display_none");
                $("#building_per_data_modal #building_per_data_body #building_per_basepoints .current-score").removeClass("display_none");
                $("#building_per_data_modal #building_per_data_body #building_per_basepoints .current-divider").removeClass("display_none");
                $("#building_per_data_modal #building_per_data_body #building_per_basepoints .total-score").removeClass("display_none");
            }

            $('#applyLeedOnline').show();
            
            if ( plaque.elements.per_score_notif_flag == true && plaque.elements.per_data_notif_flag == true && plaque.elements.per_prereq_notif_flag == true && LEEDON_FLAG == 'False')
            {
                $('#applyLeedOnline').show();
            }

        },
        
        dateFromISO: function(s) 
        {
            s = s.split(/\D/);
            return new Date(Date.UTC(s[0], --s[1]||'', s[2]||'', s[3]||'', s[4]||'', s[5]||'', s[6]||''))
        },
        checkNotification: function()
        {
            notification.stream_foreign_id = ['skipped_buildingConfirmation', 'skipped_payment', 'skipped_teamManagement', 'score_computation', 'request_access', 'data_input_setup', 'data_input_energy', 'data_input_water', 'data_input_waste', 'data_input_transportation', 'data_input_human', 'new_user_manual'];



            $.ajax(
            {
                type: "GET",
                url: "/buildings/LEED:" + plaque.LEED + "/notification/"
            }).done(function(data)
            {
                var notification_arr = [];
                if (data.results.length)
                {
                    for (var i = 0; i < data.results.length; i++)
                    {
                        if (data.results[i].foreign_id != "" && data.results[i].foreign_id != null && ($.inArray(data.results[i].foreign_id, notification.stream_foreign_id) > -1))
                        {
                            notification_arr.push(data.results[i].foreign_id);
                        }
                    };
                }

                // Remove duplicates
                notification.unique_notification_arr = [];
                $.each(notification_arr, function(i, el)
                {
                    if ($.inArray(el, notification.unique_notification_arr) === -1) notification.unique_notification_arr.push(el);
                });

                if (notification.unique_notification_arr.length)
                {
                    page = plaqueNav.getParameterByName('page');
                    if (page != 'explore') {
                        $('.meterInfo').show();
                    }
                    if (show_helptext == "True" && !(notification.one_time_tour_done) && (window.location.search.substring(1).split('&modal')).length == 1)
                    {
                        $.prompt(tourStates);
                        notification.one_time_tour_done = true;
                    }

                    if (trial_version_backend == 'True')
                    {
                        (notification.unique_notification_arr).unshift('trial_notification');
                    }

                    $('.meterInfoNumber').html(String(notification.unique_notification_arr.length));
                    $('.notification_module').html('<div class="notification_module_header">Just a couple more steps and you\'ll be all set up!</div>')

                    if (!(notification.unique_notification_arr.indexOf("skipped_buildingConfirmation") > -1))
                    {
                        $('.next_steps_check_agreement').attr('src', '/static/payment_v3/images/Checkmark.svg');
                    }

                    if (!(notification.unique_notification_arr.indexOf("skipped_payment") > -1))
                    {
                        $('.next_steps_check_plan').attr('src', '/static/payment_v3/images/Checkmark.svg');
                    }

                    if (!(notification.unique_notification_arr.indexOf("skipped_teamManagement") > -1))
                    {
                        $('.next_steps_check_team').attr('src', '/static/payment_v3/images/Checkmark.svg');
                    }

                    if (is_agreement_required == 'True')
                    {
                        if (!(notification.unique_notification_arr.indexOf("skipped_buildingConfirmation") > -1) && !(notification.unique_notification_arr.indexOf("skipped_payment") > -1))
                        {
                            $('.step-complete').show();
                            $('.prj_active').addClass('display_cell');
                            $('.prj_active').removeClass('pl0');
                            $('.prj_active').html(' Your project is active!');
                            $('#prj_active_text').html('Now you can invite your team members, and begin adding meter data to calculate your score.');
                        }
                        else
                        {
                            $('.step-complete').hide();
                            $('.prj_active').removeClass('display_cell');
                            $('.prj_active').addClass('pl0');
                            $('.prj_active').html(' Next Steps');
                            $('#prj_active_text').html('At this time you can activate your project, or invite your team members, and begin adding meter data to calculate your score.');
                        }
                    }
                    else
                    {
                        if (!(notification.unique_notification_arr.indexOf("skipped_payment") > -1))
                        {
                            $('.step-complete').show();
                            $('.prj_active').removeClass('pl0');
                            $('.prj_active').addClass('display_cell');
                            $('.prj_active').html(' Your project is active!');
                            $('#prj_active_text').html('Now you can invite your team members, and begin adding meter data to calculate your score.');
                        }
                        else
                        {
                            $('.step-complete').hide();
                            $('.prj_active').addClass('pl0');
                            $('.prj_active').removeClass('display_cell');
                            $('.prj_active').html(' Next Steps');
                            $('#prj_active_text').html('At this time you can activate your project, or invite your team members, and begin adding meter data to calculate your score.');
                        }
                    }

                    // if (notification.unique_notification_arr.indexOf("skipped_buildingConfirmation") > -1 || notification.unique_notification_arr.indexOf("skipped_payment") > -1 || notification.unique_notification_arr.indexOf("skipped_teamManagement") > -1 || notification.unique_notification_arr.indexOf("data_input_energy") > -1 || notification.unique_notification_arr.indexOf("data_input_water") > -1 || notification.unique_notification_arr.indexOf("data_input_waste") > -1 || notification.unique_notification_arr.indexOf("data_input_human") > -1){
                    //   $('#project_is_active_close').hide();
                    //   $('#skip_for_now_project_is_active').show();
                    //   $('.project_is_active_body').removeClass('pt30').addClass('pt50');
                    // }
                    // else{
                    //   $('#project_is_active_close').show();
                    //   $('#skip_for_now_project_is_active').hide();
                    //   $('.project_is_active_body').removeClass('pt50').addClass('pt30');
                    // }

                    var meterStatus = false;
                    // YA: ACP starts
                    $('.notification_module').append('<div class="pd20 cursor_pointer display_none" id="building_per_data_link" style="height: 100px;"><i class="icon-info-sign fa-lg light_color mr15" style="float: left;"></i><p style="float: left;font-weight: bold;">Want to Proceed to Certification?</p><p style="margin-left: 30px;">Complete these strategies to get LEED certified.</p></div>');
                    $('.notification_module').append('<div class="notification_line"></div>');
                    // YA: ACP ends
                    for (var i = 0; i < notification.unique_notification_arr.length; i++)
                    {

                        if (notification.unique_notification_arr[i] == 'trial_notification')
                        {
                            var one_day = 1000 * 60 * 60 * 24;
                            var today_date_time = new Date();
                            var expiry_date_time = notification.dateFromISO(trial_expire_backend);
                            var trial_time_left = expiry_date_time - today_date_time;
                            var trial_time_days = Math.round(trial_time_left / one_day);
                            var trial_time_days_string = "";
                            if (trial_time_days <= 1)
                            {
                                trial_time_days_string = String(trial_time_days) + " day trial left";
                            }
                            else
                            {
                                trial_time_days_string = String(trial_time_days) + " days trial left";
                            }
                            if (($('.red_bell_notification')).length)
                            {
                                $('.notification_module').append('<div class="notification_line"></div>');
                            }
                            $('.notification_module').append('<div class="pd20 red_bell_notification" id="trial_from_notification"><i class="icon-info-sign fa-lg light_color mr15"></i><span>' + trial_time_days_string + '</span></div>');
                        }
                        else if (notification.unique_notification_arr[i] == "new_user_manual")
                        {
                            if (($('.red_bell_notification')).length)
                            {
                                $('.notification_module').append('<div class="notification_line"></div>');
                            }
                            $('.notification_module').append('<div class="pd20 cursor_pointer red_bell_notification" id="new_user_manual_from_notification"><i class="icon-info-sign fa-lg light_color mr15"></i><span>User manual has been updated</span><i class="icon-angle-right flr fa-2x light_color "></i></div>');
                        }
                        else if (notification.unique_notification_arr[i] == "skipped_buildingConfirmation")
                        {
                            $('#sign_agreement_span_md').removeClass('not-active');
                            $.ajax(
                            {
                                type: "GET",
                                url: "/buildings/LEED:" + plaque.LEED + "/sentagreementdetail/"
                            }).done(function(sent_data)
                            {
                                if (sent_data.status == "Sent")
                                {
                                    var sent_datetime = ((sent_data.time).split('T')[0]).split('-');
                                    var sent_time = ((sent_data.time).split('T')[1]).split('.')[0]
                                    if (($('.red_bell_notification')).length)
                                    {
                                        $('.notification_module').append('<div class="notification_line"></div>');
                                    }
                                    $('.notification_module').append('<div class="pd20 cursor_pointer red_bell_notification" id="sign_agreement_from_notification"><i class="icon-info-sign fa-lg light_color mr15"></i><span>Re-sign user agreement</span><p class="agreement_sent_datetime">Sent at : ' + sent_datetime[1] + '-' + sent_datetime[2] + '-' + sent_datetime[0] + ' T ' + sent_time + '</p><i class="icon-angle-right flr fa-2x light_color "></i></div>');
                                }
                                else
                                {
                                    if (($('.red_bell_notification')).length)
                                    {
                                        $('.notification_module').append('<div class="notification_line"></div>');
                                    }
                                    $('.notification_module').append('<div class="pd20 cursor_pointer red_bell_notification" id="sign_agreement_from_notification"><i class="icon-info-sign fa-lg light_color mr15"></i><span>Sign user agreement</span><i class="icon-angle-right flr fa-2x light_color "></i></div>');
                                }
                            });
                        }
                        else if (notification.unique_notification_arr[i] == "skipped_payment")
                        {
                            $('#select_plan_span_md').removeClass('not-active');
                            if (($('.red_bell_notification')).length)
                            {
                                $('.notification_module').append('<div class="notification_line"></div>');
                            }
                            $('.notification_module').append('<div class="pd20 cursor_pointer red_bell_notification" id="select_plan_from_notification"><i class="icon-info-sign fa-lg light_color mr15"></i><span>Select a plan</span><i class="icon-angle-right flr fa-2x light_color "></i></div>');
                        }
                        else if (notification.unique_notification_arr[i] == "skipped_teamManagement")
                        {
                            if (trial_version_backend == 'True' || building_status_backend == 'activated')
                            {
                                $('#add_team_span_md').removeClass('not-active');
                            }
                            if (($('.red_bell_notification')).length)
                            {
                                $('.notification_module').append('<div class="notification_line"></div>');
                            }
                            $('.notification_module').append('<div class="pd20 cursor_pointer red_bell_notification" id="add_team_from_notification"><i class="icon-info-sign fa-lg light_color mr15"></i><span>Add team members now</span><i class="icon-angle-right flr fa-2x light_color "></i></div>');
                        }
                        else if (notification.unique_notification_arr[i] == "score_computation")
                        {
                            if (($('.red_bell_notification')).length)
                            {
                                $('.notification_module').append('<div class="notification_line"></div>');
                            }
                            $('.notification_module').append('<div class="pd20 cursor_pointer red_bell_notification" id="score_computation_from_notification"><i class="icon-info-sign fa-lg light_color mr15"></i><span>Score computation is in progress</span></div>');
                        }
                        else if (notification.unique_notification_arr[i] == "request_access")
                        {
                            if (plaqueNav.userBuilding_permission.role == 'Project Team Member')
                            {
                                $('#request_access_from_notification').hide();
                                $('.meterInfoNumber').html(parseInt($('.meterInfoNumber').html()) - 1);
                            }
                            else if (plaqueNav.userBuilding_permission.role == 'Project Admin')
                            {
                                if (($('.red_bell_notification')).length)
                                {
                                    $('.notification_module').append('<div class="notification_line"></div>');
                                }
                                $('.notification_module').append('<div class="pd20 cursor_pointer red_bell_notification" id="request_access_from_notification"><i class="icon-info-sign fa-lg light_color mr15"></i><span>Permission request</span><i class="icon-angle-right flr fa-2x light_color "></i></div>');
                            }
                        }
                        else if (notification.unique_notification_arr[i] == "data_input_setup")
                        {
                            if (($('.red_bell_notification')).length)
                            {
                                $('.notification_module').append('<div class="notification_line"></div>');
                            }
                            $('.notification_module').append('<div class="pd20 cursor_pointer red_bell_notification" id="data_input_setup_from_notification"><i class="icon-info-sign fa-lg light_color mr15"></i><span>Add basic info now</span><i class="icon-angle-right flr fa-2x light_color "></i></div>');
                        }
                        else if (notification.unique_notification_arr[i] == "data_input_energy")
                        {
                            if (($('.red_bell_notification')).length)
                            {
                                $('.notification_module').append('<div class="notification_line"></div>');
                            }
                            $('.notification_module').append('<div class="pd20 cursor_pointer red_bell_notification" id="data_input_energy_from_notification"><i class="icon-info-sign fa-lg light_color mr15"></i><span>Add energy meter now</span><i class="icon-angle-right flr fa-2x light_color "></i></div>');
                            meterStatus = true;
                        }
                        else if (notification.unique_notification_arr[i] == "data_input_water")
                        {
                            if (($('.red_bell_notification')).length)
                            {
                                $('.notification_module').append('<div class="notification_line"></div>');
                            }
                            $('.notification_module').append('<div class="pd20 cursor_pointer red_bell_notification" id="data_input_water_from_notification"><i class="icon-info-sign fa-lg light_color mr15"></i><span>Add water meter now</span><i class="icon-angle-right flr fa-2x light_color "></i></div>');
                            meterStatus = true;
                        }
                        else if (notification.unique_notification_arr[i] == "data_input_waste")
                        {
                            if (($('.red_bell_notification')).length)
                            {
                                $('.notification_module').append('<div class="notification_line"></div>');
                            }
                            $('.notification_module').append('<div class="pd20 cursor_pointer red_bell_notification" id="data_input_waste_from_notification"><i class="icon-info-sign fa-lg light_color mr15"></i><span>Add waste meter now</span><i class="icon-angle-right flr fa-2x light_color "></i></div>');
                            meterStatus = true;
                        }
                        else if (notification.unique_notification_arr[i] == "data_input_transportation")
                        {
                            if (($('.red_bell_notification')).length)
                            {
                                $('.notification_module').append('<div class="notification_line"></div>');
                            }
                            $('.notification_module').append('<div class="pd20 cursor_pointer red_bell_notification" id="data_input_transportation_from_notification"><i class="icon-info-sign fa-lg light_color mr15"></i><span>Send survey now</span><i class="icon-angle-right flr fa-2x light_color "></i></div>');
                        }
                        else if (notification.unique_notification_arr[i] == "data_input_human")
                        {
                            if (($('.red_bell_notification')).length)
                            {
                                $('.notification_module').append('<div class="notification_line"></div>');
                            }
                            $('.notification_module').append('<div class="pd20 cursor_pointer red_bell_notification" id="data_input_human_from_notification"><i class="icon-info-sign fa-lg light_color mr15"></i><span>Add co2/voc meter now</span><i class="icon-angle-right flr fa-2x light_color "></i></div>');
                            meterStatus = true;
                        }
                    };

                    if (meterStatus = true)
                    {
                        if (trial_version_backend == 'True' || building_status_backend == 'activated')
                        {
                            $('#add_meter_span_md').removeClass('not-active');
                        }
                    }
                    else
                    {
                        $('.next_steps_check_meter').attr('src', '/static/payment_v3/images/Checkmark.svg');
                    }

                    if (notification.unique_notification_arr.indexOf("data_input_setup") > -1)
                    {
                        if ($('.data_input_nav.on').attr('data-page') == "setup")
                        {
                            $('.data_input_nav_container .on[data-page=setup]').css('background-position', '28px -242px');
                        }
                        else
                        {
                            $('.data_input_nav_container [data-page=setup]').css('background-position', '62px -605px');
                        }
                        $('.req_error_notice_setup').css('display', 'block');
                        $('.req_error_para_setup').html("Please add the Floor area, Week total or Occupancy data in order to calculate the performance score.");
                    }
                    else
                    {
                        $('.req_error_notice_setup').css('display', 'none');
                        if ($('.data_input_nav.on').attr('data-page') == "setup")
                        {
                            $('.data_input_nav_container .on[data-page=setup]').css('background-position', '28px -242px');
                        }
                        else
                        {
                            $('.data_input_nav_container [data-page=setup]').css('background-position', '64px -64px');
                        }
                    }

                    if (notification.unique_notification_arr.indexOf("data_input_energy") > -1)
                    {
                        if ($('.data_input_nav.on').attr('data-page') == "energy")
                        {
                            $('.data_input_nav_container .on[data-page=energy]').css('background-position', '28px -152px');
                        }
                        else
                        {
                            $('.data_input_nav_container [data-page=energy]').css('background-position', '62px -605px');
                        }
                        $('.req_error_notice_energy').css('display', 'block');
                        $('.req_error_para_energy').html("Please add energy meter data in order to calculate your energy performance score.");
                    }
                    else
                    {
                        $('.req_error_notice_energy').css('display', 'none');
                        if ($('.data_input_nav.on').attr('data-page') == "energy")
                        {
                            $('.data_input_nav_container .on[data-page=energy]').css('background-position', '28px -152px');
                        }
                        else
                        {
                            $('.data_input_nav_container [data-page=energy]').css('background-position', '64px -64px');
                        }
                    }

                    if (notification.unique_notification_arr.indexOf("data_input_water") > -1)
                    {
                        if ($('.data_input_nav.on').attr('data-page') == "water")
                        {
                            $('.data_input_nav_container .on[data-page=water]').css('background-position', '28px -513px');
                        }
                        else
                        {
                            $('.data_input_nav_container [data-page=water]').css('background-position', '65px -605px');
                        }
                        $('.req_error_notice_water').css('display', 'block');
                        $('.req_error_para_water').html("Please add a water meter with data in order to calculate your water performance score.");
                    }
                    else
                    {
                        $('.req_error_notice_water').css('display', 'none');
                        if ($('.data_input_nav.on').attr('data-page') == "water")
                        {
                            $('.data_input_nav_container .on[data-page=water]').css('background-position', '28px -513px');
                        }
                        else
                        {
                            $('.data_input_nav_container [data-page=water]').css('background-position', '64px -64px');
                        }
                    }

                    if (notification.unique_notification_arr.indexOf("data_input_waste") > -1)
                    {
                        if ($('.data_input_nav.on').attr('data-page') == "waste")
                        {
                            $('.data_input_nav_container .on[data-page=waste]').css('background-position', '28px -422px');
                        }
                        else
                        {
                            $('.data_input_nav_container [data-page=waste]').css('background-position', '65px -605px');
                        }
                        $('.req_error_notice_waste').css('display', 'block');
                        $('.req_error_para_waste').html("Please enter the waste readings in order to calculate your waste performance score.");
                    }
                    else
                    {
                        $('.req_error_notice_waste').css('display', 'none');
                        if ($('.data_input_nav.on').attr('data-page') == "waste")
                        {
                            $('.data_input_nav_container .on[data-page=waste]').css('background-position', '28px -422px');
                        }
                        else
                        {
                            $('.data_input_nav_container [data-page=waste]').css('background-position', '64px -64px');
                        }
                    }

                    if (notification.unique_notification_arr.indexOf("data_input_transportation") > -1)
                    {
                        if ($('.data_input_nav.on').attr('data-page') == "transportation")
                        {
                            $('.data_input_nav_container .on[data-page=transportation]').css('background-position', '24px 28px');
                        }
                        else
                        {
                            $('.data_input_nav_container [data-page=transportation]').css('background-position', '64px -605px');
                        }
                        $('.req_error_notice_transport').css('display', 'block');
                        $('.req_error_para_transport').html("Please ask for more survey data in order to calculate your transportation performance score.");
                    }
                    else
                    {
                        $('.req_error_notice_transport').css('display', 'none');
                        if ($('.data_input_nav.on').attr('data-page') == "transportation")
                        {
                            $('.data_input_nav_container .on[data-page=transportation]').css('background-position', '24px 28px');
                        }
                        else
                        {
                            $('.data_input_nav_container [data-page=transportation]').css('background-position', '64px -64px');
                        }
                    }

                    if (notification.unique_notification_arr.indexOf("data_input_human") > -1)
                    {
                        if ($('.data_input_nav.on').attr('data-page') == "human")
                        {
                            $('.data_input_nav_container .on[data-page=human]').css('background-position', '24px -332px');
                        }
                        else
                        {
                            $('.data_input_nav_container [data-page=human]').css('background-position', '50px -605px');
                        }
                        $('.req_error_notice_human').css('display', 'block');
                        $('.req_error_para_human').html("Please enter the co2 or voc readings in order to calculate your human experience performance score.");
                    }
                    else
                    {
                        $('.req_error_notice_human').css('display', 'none');
                        $('#humanco2_new_reading').addClass('correctTopCo2');
                        $('#humanvocs_new_reading').addClass('correctTopVOC');
                        if ($('.data_input_nav.on').attr('data-page') == "human")
                        {
                            $('.data_input_nav_container .on[data-page=human]').css('background-position', '24px -332px');
                        }
                        else
                        {
                            $('.data_input_nav_container [data-page=human]').css('background-position', '64px -64px');
                        }
                    }

                    if (notification.unique_notification_arr.indexOf("skipped_payment") > -1)
                    {
                        $("#planSelection").css("cssText", "background-position: -150% 100.5%");
                    }
                }
                else
                {
                    if (show_helptext == "True" && !(notification.one_time_tour_done) && (window.location.search.substring(1).split('&modal')).length == 1)
                    {
                        $.prompt(tourStates_without_notification);
                        notification.one_time_tour_done = true;
                    }
                }
                $('#preloader_project_is_active').hide();
                $('#status_project_is_active').hide();

                if (ACTIVATE_ACP_ANALYSIS == "True"){
                    $('#building_per_data_link').show();
                    $('#building_per_data_link_dashboard').show();
                }
                else{
                    $('#building_per_data_link').hide();
                    $('#building_per_data_link_dashboard').hide();
                }

            }).fail(function(data)
            {
                $('#preloader_project_is_active').hide();
                $('#status_project_is_active').hide();
            });
        },
    };
    $( document ).ready(function() 
    {
    	notification.setup(); 
    });

}).call(this);