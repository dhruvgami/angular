(function() {
    plaque.elements = {
            per_score_notif_flag:   false,
            per_data_notif_flag:    false,
            per_prereq_notif_flag:  false,
            intents_from_prereq:    '',
            categoryList_from_prereq: '',
            snapshot_flag:          false,

            setup: function() {
                $(document).ready(function(){
                                       
                  $(document.body).on('click','.parent-accordion-section-title', function(e) {
                        // Grab current anchor value
                        var currentAttrValue = $(this).attr('data-href');
                 
                        if($(this).hasClass('active')) {
                            $(this).removeClass('active');
                            $(this).siblings('.parent-accordion-section-content').slideUp(300).removeClass('open');
                            //plaque.elements.close_parent_accordion_section();
                        }else {
                            //plaque.elements.close_parent_accordion_section();
                 
                            // Add active class to section title
                            $(this).addClass('active');
                            $(this).find('span.ui-accordion-header-icon').addClass('expanded');
                            // Open up the hidden content panel
                            $('.accordion ' + currentAttrValue).slideDown(300).addClass('open'); 
                        }
                 
                        e.preventDefault();
                    });
                    
                });
                
                $(document.body).on('click', '#apply_certification', function(event) {
                    $('#submit_certification_confirmation').modal('toggle');
                });
                
            },
            close_accordion_section: function(){
                $('.accordion .accordion-section-title').removeClass('active');
                $('.accordion .accordion-section-content').slideUp(300).removeClass('open');
            },
            close_parent_accordion_section: function(){
                $('.accordion .parent-accordion-section-title').removeClass('active');
                $('.accordion .parent-accordion-section-content').slideUp(300).removeClass('open');
            },
            sticky_relocate: function () {
                var window_top = $(window).scrollTop();
                var div_top = $('#content_container').offset().top;
                if(plaque.elements.getQueryStringParams('subsection') != 'strategies'){
                    $('.strategy_sticky_nav').removeClass('main-nav-stick');
                }else{
                    if (window_top > div_top) {
                        //$('.data_input_nav_container').addClass('main-nav-stick');
                        //$('.data_input_nav_subcontainer').addClass('inner-nav-stick');
                        $('.strategy_sticky_nav').addClass('main-nav-stick');
                        
                    } else {
                        //$('.data_input_nav_container').removeClass('main-nav-stick');
                        //$('.data_input_nav_subcontainer').removeClass('inner-nav-stick');
                        $('.strategy_sticky_nav').removeClass('main-nav-stick');
                    }
                }
            },
            bindScroll: function() {
                if($(window).scrollTop() + $(window).height() > $(document).height() - 100) {
                    $(window).unbind('scroll');
                    plaque.elements.loadMoreStrategies();
                }
            },
            loadMoreStrategies: function(){
                var current_strategy = plaque.elements.getQueryStringParams('section');
                var current = '';
                if(current_strategy == 'energy')
                    current = 'water';
                else if(current_strategy == 'water')
                    current = 'waste';
                else if(current_strategy == 'waste')
                    current = 'transportation';
                else if(current_strategy == 'transportation')
                    current = 'human';
                
                if(current != ''){
                    var data_input_water = $(".data_input_nav_container").find("[data-page='" + current + "']");
                    data_input_water.click();
                    data_input_water.parent(".data_input_nav_container").siblings(".data_input_nav_subcontainer").find("[data-subsection='strategies']").click();
                    if(current != 'human'){
                        //$(window).bind("scroll", plaque.elements.sticky_relocate);
                        $(window).bind("scroll", plaque.elements.bindScroll);
                    }
                 }
            },
            anchorNav: function(options){
                
                return options.each(function(){
                    var sections = [];
                    
                    // Gather the sections
                    $(this).find('a').each(function(){
                        sections.push($($(this).attr('href')));
                    });

                    $(window).scroll(determineActiveSection);       // Bind positioning script to window scroll
                    //determineActiveSection();                     // Fire once on page load
                    
                    function determineActiveSection(){
                        var scroll = $(window).scrollTop();
                        
                        // Iterate over sections to find out which is the last section to cross the top of the viewport
                        $.each(sections, function(i, section){
                            if(section.length >= 1){
                                var offset = section.offset();
                                if(offset.top - scroll <= 1){
                                    var target = section.attr('id');
                                    $('#menu .on').removeClass('on');
                                    $('#menu .on').parent().removeClass('on');
                                    $('#menu a[href="#' + target + '"]').addClass('on');
                                    $('#menu a[href="#' + target + '"]').parent().addClass('on');
                                    $sub_nav = $('.data_input_subnav[data-subsection=strategies]');
                                    $sub_nav.attr( 'data-page', target.replace("overview-", "") ); 
                                    $sub_nav.siblings().attr( 'data-page', target.replace("overview-", "") );
                                    
                                    if(target == "overview-energy")
                                        $('.data_input_nav_container .on[data-page=energy]').css('background-position','28px -152px');
                                    else
                                        $('.data_input_nav_container [data-page=energy]').css('background-position','62px -605px');
                                    
                                    if(target == "overview-water")
                                        $('.data_input_nav_container .on[data-page=water]').css('background-position','28px -513px');
                                    else
                                        $('.data_input_nav_container [data-page=water]').css('background-position','65px -605px');
                                    
                                    if(target == "overview-waste")
                                        $('.data_input_nav_container .on[data-page=waste]').css('background-position','28px -422px');
                                    else
                                        $('.data_input_nav_container [data-page=waste]').css('background-position','65px -605px');
                                    
                                    if(target == "overview-transportation")
                                        $('.data_input_nav_container .on[data-page=transportation]').css('background-position','24px 28px');
                                    else
                                        $('.data_input_nav_container [data-page=transportation]').css('background-position','64px -605px');
                                    
                                    if(target == "overview-human")
                                        $('.data_input_nav_container .on[data-page=human]').css('background-position','24px -332px');
                                    else
                                        $('.data_input_nav_container [data-page=human]').css('background-position','50px -605px');
                                    
                                }
                            }
                        });
                        
                        // If none is found, set the first section to active
                        if($('#menu .on').length === 0){
                            $('#menu li:first-child a').addClass('on');
                            $('#menu li:first-child a').parent().addClass('on');
                        }
                    };
                });
            },
            scrollToElement: function(ele) {
                var $currsection = $('#overview-'+ele);
                //console.log($currsection.offset());
                //$(document).scrollTop($currsection.offset().top);
                location.href = '#overview-'+ele;
            },
            setRequiredProgress: function(intentId, requiredStrategies, appliedRequiredStrategies){
                var totalAppliedStrategies = appliedRequiredStrategies[intentId].length;
                var totalRequiredStrategies = requiredStrategies[intentId].length;
                var val = totalAppliedStrategies/totalRequiredStrategies;
                if(totalAppliedStrategies == 0 || totalRequiredStrategies == 0){
                    val = 0.0;
                }
                $('#intent-required-counter-'+intentId).find('strong').text(totalAppliedStrategies+'/'+totalRequiredStrategies);
                $('#intent-required-counter-'+intentId).circleProgress('value', val);
                return true;
            },
            findRequiredStrategy: function(strategyId,requiredStrategies){
                 return $.grep(requiredStrategies, function(item){
                      return item.strategyid == strategyId;
                 });
            },
            calculateScore: function(projectId, intentId){
                jQuery.ajax( {
                    async:false, 
                    url: "/elements/intent/scoring/LEED:" + projectId + "?intent_id=" + intentId,
                    type: "GET",
                    contentType: 'application/json',
                    success:function(response){
                        plaque.elements.getProjectScore();
                    }
                });
            },
            getProjectScore: function(){
                var projectId = plaque.elements.getQueryStringParams('LEED');                
                jQuery.ajax( {
                    async:false, 
                    url: "/elements/project/score/LEED:" + projectId,
                    type: "GET",
                    contentType: 'application/json',
                    success:function(response){
                    	if(response.status == "Success"){
                    		$('#project_total_points').html('<b>' + response.total_points_achieved+'</b>/'+response.total_possible_points);
                    	//	$('#elements_scoring_text').html('LEED points');
                    		$( "#leed_score_progressbar" ).progressbar({
                    		      value: (response.total_points_achieved / response.total_possible_points) * 100
                    		});
                    	}
                    }
                });
            },
            addCustomStrategies: function(projectId, customStrategy){
                var data = {};
                data["title"]        = customStrategy['title'];
                data["intent_id"]    = customStrategy['intent_id'];
                data["description"]  = customStrategy['description'];
                data["file"]         = customStrategy['file'];
                //data["strategy_id"]  = customStrategy['strategy_id'];
                
                return jQuery.ajax( {
                    async:false, 
                    url: "/elements/strategies/LEED:" + projectId+"/",
                    type: "POST",
                    contentType: 'application/json',
                    data: JSON.stringify(data),
                });
            },
            updateLinkToCertification: function(){
                var buildingID = plaque.elements.getQueryStringParams('LEED');
                $.get("/elements/strategies/LEED:"+ buildingID, function(data, status){
                    var result = data.result;
                    var intents = result.intent;
                    var final_intents = [];
                    var required_intents = []
                    
                    $.each(intents, function(i, intent) {
                        $.each(intent.strategies, function(i, strategy) {
                            if(strategy.required == "required" && strategy.status != 'attempted'){
                                required_intents.push(intent);
                                return false;
                            }
                        });
                    });
                    
                    if(required_intents.length > 0){
                        $('#link_to_review').show();
                        $('#link_to_cerification.attempted').hide();
                        $('#submission_options').hide();
                    }else{
                        $('#link_to_review').hide();
                        $('#link_to_cerification.attempted').show();
                        $('#submission_options').show();
                    }
                    
                });

            },
            deleteAnswer: function(){
                
            },
            closePopout: function(event){
                var object = event.closest('.collapsible');
                $panel_headers = object.find('> li > .collapsible-header');
                   
                if (object.hasClass('active')) {
                    object.parent().addClass('active');
                }
                else {
                    object.parent().removeClass('active');
                }
                if (object.parent().hasClass('active')){
                  object.siblings('.collapsible-body').stop(true,false).slideDown({ duration: 350, easing: "easeOutQuart", queue: false, complete: function() {$(this).css('height', '');}});
                }
                else{
                  object.siblings('.collapsible-body').stop(true,false).slideUp({ duration: 350, easing: "easeOutQuart", queue: false, complete: function() {$(this).css('height', '');}});
                }

                $panel_headers.not(object).removeClass('active').parent().removeClass('active');
                $panel_headers.not(object).parent().children('.collapsible-body').stop(true,false).slideUp(
                  {
                    duration: 350,
                    easing: "easeOutQuart",
                    queue: false,
                    complete:
                      function() {
                        event.css('height', '');
                      }
                  });
            },
            questionBox: function(questionnaireDiv, intentId, strategyId, questions, number, direct_outcome, prevnumber) {
                var questionnaire = questionnaireDiv;
                var buildingID = plaque.elements.getQueryStringParams('LEED');
                var strategy_details = questions.details;
                var template = '';
                
                if(direct_outcome == 'document'){
                    template += '<div class="strategy-document">';
                        //if(strategy_details.documentmessage != '')
                        //  template += '<p class="strategy-question"><i class="fa fa-check-circle"></i> '+strategy_details.documentmessage+'</p>';
                        //else
                            template += '<p class="strategy-question">You have succesfully applied this strategy to your project. At this point, you can upload further documentation to increase your chances for certification.</p>';
                        if(strategy_details.learnmore){
                            template += '<a target="_blank" href="' + strategy_details.learnmore + '" class="learn-more right">Learn More <i class="icon-external-link"></i></a>';
                        }
                        template +='<div class="button-group">';
                            template += '<div class="elements_questionnaire_upload" id="elements_questionnaire_upload-' + strategyId + '" data-intentid="'+intentId+'" data-strategyid="' + strategyId + '">';
                            
                            var strategyFiles = "";                     
                            if(strategy_details.file){ 
                                strategyFiles = $.parseJSON(strategy_details.file.replace(/'/g, '"')); 
                            }

                            // YA: IE issue
                            var keys_files = [];
                            for(var key in strategyFiles){
                                  keys_files.push(key);
                            }

                            if(keys_files.length >= 1){
                                if(keys_files.length > 1){
                                     $.each(strategyFiles, function(i, file) {
                                         
                                        var filename =  file['filename'];
                                        var filepath =  file['filepath'].replace("/deploy/", "/");
                                        
                                        template += '<div class="files-list"><i class="delete-document-file'+i+' icon-remove-sign" data-intentid="' + intentId + '" data-strategyid="' + strategyId + '" data-filename="' + filename + '"></i>';
                                        template += '<a class="elements-file-name" target="_blank" id="uploaded-file-' + strategyId + '" href="' + filepath + '">' + filename + '</a></div>';    
                                        $("#elements_questionnaire_upload-" + strategyId).attr("data-filename", filename);
    
                                        $(document.body).off("click",".delete-document-file"+i).on("click",".delete-document-file"+i, function (event) {
                                            plaque.elements.deleteStrategyDocumentUploadedFileAWS($(this));
                                        });
                                    });
                                }else{
                                    var filename =  strategyFiles[0]['filename'];
                                    var filepath =  strategyFiles[0]['filepath'].replace("/deploy/", "/");
                                    
                                    template += '<div class="files-list"><i class="delete-document-file0 icon-remove-sign" data-intentid="' + intentId + '" data-strategyid="' + strategyId + '" data-filename="' + filename + '"></i>';
                                    template += '<a class="elements-file-name" target="_blank" id="uploaded-file-' + strategyId + '" href="' + filepath + '">' + filename + '</a></div>';    
                                    $("#elements_questionnaire_upload-" + strategyId).attr("data-filename", filename);

                                    $(document.body).off("click",".delete-document-file0").on("click",".delete-document-file0", function (event) {
                                        plaque.elements.deleteStrategyDocumentUploadedFileAWS($(this));
                                    });
                                }
                                template += '<span class="btn btn-success fileinput-button">';
                                    template += '<i class="fa fa-upload"></i><span>Add Document</span>';
                                    template += '<input class="elements_file_data_new upload" name="elements_file_data_new" id="elements_upload_data' + strategyId + '" data-intentid="'+intentId+'" data-strategyid="'+strategyId+'" type="file" name="files[]" multiple="">';
                                template += '</span>';                  
                            }else{
                                template += '<span class="btn btn-success fileinput-button">';
                                    template += '<i class="fa fa-upload"></i><span>Add Document</span>';
                                    template += '<input class="elements_file_data_new upload" name="elements_file_data_new" data-intentid="'+intentId+'" data-strategyid="' + strategyId + '" type="file" name="files[]" multiple="">';
                                template += '</span>';
                            }
                            
                            template += '</div>';
                            template += '<a id="skipq" data-intentid="'+intentId+'" data-strategyid="'+strategyId+'" class="waves-effect waves-light btn btn-skip">Skip</a>';
                            template += '<a id="completeq" data-intentid="'+intentId+'" data-strategyid="'+strategyId+'" class="waves-effect waves-light btn btn-green">Complete</a>';
                        template += '</div>';
                    template += '</div>';
                }else if(direct_outcome == 'success'){
                    var data = {};
                    data["strategy_id"] = strategyId;
                    data["status"] = 'added';
                    data["update_flag"] = 'status';
                    plaque.elements.updateStrategyStatus(buildingID, data);
                    
                    var strategyLi = questionnaireDiv.closest('li');
                    
					/*Start logic for scoring*/
					var intentUl = strategyLi.parent('ul.collapsible');
					plaque.elements.calculateScore(buildingID, intentUl.data('intentid'));
					/*End logic for scoring*/
                    
                    strategyLi.removeClass('not-applicable').addClass('added');
                    
                    template += '<div class="strategy-success">';
                        if(strategy_details.successmessage != '' && strategy_details.successmessage != 'null')
                            template += '<p class="strategy-question"><span class="category-icon"></span><span class="success-message">'+strategy_details.successmessage+'</p>';
                        else
                            template += '<p class="strategy-question"><span class="category-icon"></span> <span class="success-message">Congratulations! You have succesfully applied this strategy to your project</span></p>';
                                                
                        if(strategy_details.learnmore){
                            template += '<a target="_blank" href="' + strategy_details.learnmore + '" class="learn-more right">Learn More <i class="icon-external-link"></i></a>';
                        }
                        // start changes
                        template += '<hr class="success-msg-divider">';
                        template += '<div class="strategy-upload-message">';
                            template +='<div class="upload-message-div">';
                                template +='<p class="upload-message">';
                                    template +='Upload further documentation to increase your chances for certification.';
                                template +='</p>'
                            template +='</div>';
                            template += '<div class="elements_questionnaire_upload" id="elements_questionnaire_upload-' + strategyId + '" data-intentid="'+intentId+'" data-strategyid="' + strategyId + '">';
                                var strategyFiles = "";                     
                                if(strategy_details.file){ 
                                    strategyFiles = $.parseJSON(strategy_details.file.replace(/'/g, '"')); 
                                }
                                var keys_files = [];
                                for(var key in strategyFiles){
                                      keys_files.push(key);
                                }
                                if(keys_files.length >= 1){
                                    if(keys_files.length > 1){
                                        $.each(strategyFiles, function(i, file) {
                                         
                                            var filename =  file['filename'];
                                            var filepath =  file['filepath'].replace("/deploy/", "/");
                                            
                                            template += '<div class="files-list"><i class="delete-document-file'+i+' icon-remove-sign" data-intentid="' + intentId + '" data-strategyid="' + strategyId + '" data-filename="' + filename + '"></i>';
                                            template += '<a class="elements-file-name" target="_blank" id="uploaded-file-' + strategyId + '" href="' + filepath + '">' + filename + '</a></div>';    
                                            $("#elements_questionnaire_upload-" + strategyId).attr("data-filename", filename);
        
                                            $(document.body).off("click",".delete-document-file"+i).on("click",".delete-document-file"+i, function (event) {
                                                plaque.elements.deleteStrategyDocumentUploadedFileAWS($(this));
                                            });
                                        });
                                    }else{
                                        var filename =  strategyFiles[0]['filename'];
                                        var filepath =  strategyFiles[0]['filepath'].replace("/deploy/", "/");
                                        
                                        template += '<div class="files-list"><i class="delete-document-file0 icon-remove-sign" data-intentid="' + intentId + '" data-strategyid="' + strategyId + '" data-filename="' + filename + '"></i>';
                                        template += '<a class="elements-file-name" target="_blank" id="uploaded-file-' + strategyId + '" href="' + filepath + '">' + filename + '</a></div>';    
                                        $("#elements_questionnaire_upload-" + strategyId).attr("data-filename", filename);

                                        $(document.body).off("click",".delete-document-file0").on("click",".delete-document-file0", function (event) {
                                            plaque.elements.deleteStrategyDocumentUploadedFileAWS($(this));
                                        });
                                    }

                                    template += '<span class="btn btn-success fileinput-button">';
                                        template += '<i class="fa fa-plus"></i><span>Add Document</span>';
                                        template += '<input class="elements_file_data_new upload" name="elements_file_data_new" id="elements_upload_data' + strategyId + '" data-intentid="'+intentId+'" data-strategyid="'+strategyId+'" type="file" name="files[]" multiple="">';
                                    template += '</span>';                     
                                }
                                else{
                                    template += '<span class="btn btn-success fileinput-button">';
                                        template += '<i class="fa fa-plus"></i><span>Add Document</span>';
                                        template += '<input class="elements_file_data_new upload" name="elements_file_data_new" data-intentid="'+intentId+'" data-strategyid="' + strategyId + '" type="file" name="files[]" multiple="">';
                                    template += '</span>';
                                }                                                               
                            template += '</div>';
                        template += '</div>';

                        /*
                        template+= '<div class="strategy-complete-div">';
                            template+= '<div class="complete-message-div">';
                                template +='<p class="complete-message">';
                                    template +='<span class="strategy-upload-step">Step 2.</span> Complete credit now.';
                                template +='</p>'
                            template+= '</div>';
                            template+= '<div class="complete-credit">';
                                template += '<a id="completeq" data-intentid="'+intent.id+'" data-strategyid="'+strategyId+'" class="waves-effect waves-light btn btn-green">Complete credit</a>';
                            template+= '</div>';
                        template+= '</div>';
                        */
                        template += '<hr class="documentation-message-button-group">';
                    
                        template += '<div class="button-group button-group-success">';
                            template += '<a id="completeq" data-intentid="'+intent.id+'" data-strategyid="'+strategyId+'" class="waves-effect waves-light btn btn-green">Complete credit</a>';
                            
                        //  template += '<a id="next-strategy" data-intentid="'+intentId+'" data-strategyid="'+strategyId+'" class="waves-effect waves-light btn btn-white"><span>Next Strategy</span><i class="fa fa-angle-right"></i></a>';
                            template += '<a id="continueq" data-intentid="'+intentId+'" data-strategyid="'+strategyId+'" class="waves-effect waves-light btn btn-white">SKIP</a>';
                            template += '<span class="button-group-or-text">Or</span>';
                            template += '<a id="restartq" data-intentid="'+intentId+'" data-strategyid="'+strategyId+'" class="waves-effect waves-light btn-back-step"><span>Back to Last Step</span></a>';
                        template += '</div>';
                    template += '</div>'; 

                template += '</div>';
                }else if(direct_outcome == 'fail'){
                    var data = {};
                    data["strategy_id"] = strategyId;
                    data["status"] = 'not-added';
                    data["update_flag"] = 'status';
                    plaque.elements.updateStrategyStatus(buildingID, data);
                    
                    var strategyLi = questionnaireDiv.closest('li');
                    
					/*Start logic for scoring*/
					var intentUl = strategyLi.parent('ul.collapsible');					
                    /* YA: We dont need to calculate again since we already calculated when button was clicked
                    var intentUl = strategyLi.parent('ul.collapsible');
                    plaque.elements.calculateScore(buildingID, intentUl.data('intentid'));*/
					/*End logic for scoring*/
                    
                    strategyLi.removeClass('not-applicable').addClass('not-added');

                    template += '<div class="strategy-fail">';
                        if(strategy_details.failuremessage != '')
                            template += '<p class="strategy-question">'+strategy_details.failuremessage+'</p>';
                        else
                            template += '<p class="strategy-question">Looks like you couldn\'t apply this strategy to your project.</p>';

                        if(strategy_details.recommendations != ''){
                            template += '<p>Please consider the following options if you wish to try again:</p>';
                            template += '<div class="strategy-recommendations">' + strategy_details.recommendations + '</div>'
                        }
                        if(strategy_details.learnmore){
                            template += '<a target="_blank" href="' + strategy_details.learnmore + '" class="learn-more right">Learn More <i class="icon-external-link"></i></a>';
                        }
                        template +='<div class="button-group">';
                            template += '<a id="continueq" data-intentid="'+intentId+'" data-strategyid="'+strategyId+'" class="waves-effect waves-light btn btn-green">Continue</a>';
                            template += '<a id="restartq" data-intentid="'+intentId+'" data-strategyid="'+strategyId+'" class="waves-effect waves-light btn-back-step">Back to Last Step</a>';
                        template += '</div>';
                    template += '</div>';   
                }else if(number != ''){    
                    template += '<p class="strategy-question">' + questions[number]['question'] + '</p>';
                    if(strategy_details.learnmore){
                        template += '<a target="_blank" href="' + strategy_details.learnmore + '" class="learn-more right">Learn More <i class="icon-external-link"></i></a>';
                    }
                    template +='<div class="button-group">';    
                    
                    if(questions[number]['qtype'] == 'radio') {
                        template += '<div class="controls radiob">';
                        $.each(questions[number]['answers'], function(i, answer) {
                            $selected = '';
                            if(answer.key == questions[number]['existinganswer']) $selected = 'checked="checked"';
                            template += '<div class="rule">';
                                template += '<label class="radio">';
                                    template += '<input type="radio" data-intentid="'+intentId+'" data-strategyid="'+strategyId+'" data-previousquestion="'+prevnumber+'" data-currentquestion="'+number+'" data-goto="' + answer.gotoquestion + '" data-directoutcome="' + answer.direct_outcome + '" class="answerbutton ' + number + '" id="' + number + '-' + answer.key + '" name="' + number + '" value="' + answer.key + '"' + $selected + '>';
                                    template += answer.value;
                                template += '</label>';
                            template += '</div>';
                        });
                        template += '</div>';
                    }else if (questions[number]['qtype'] == 'yesno') {
                        template += '<div class="controls">';
                        $.each(questions[number]['answers'], function(i, answer) {
                            var cssclass = 'btn-green';
                            if(answer.key.toLowerCase() == 'no') cssclass = 'btn-white';
                            
                            if((answer.key == questions[number]['existinganswer']) && answer.key.toLowerCase() == 'no') cssclass += ' noselected';
                            if((answer.key == questions[number]['existinganswer']) && answer.key.toLowerCase() == 'yes') cssclass += ' yesselected';
                            
                            template += '<a data-intentid="'+intentId+'" data-strategyid="'+strategyId+'" data-previousquestion="'+prevnumber+'" data-currentquestion="'+number+'" data-goto="' + answer.gotoquestion + '" data-directoutcome="' + answer.direct_outcome + '" class="answerbutton waves-effect waves-light btn '+ cssclass +'" data-value="' + answer.key + '" id="' + number + '-' + answer.key + '">' + answer.value + '</a>';
                        });
                        template += '</div>';
                    }else if (questions[number]['qtype'] == 'text') {
                        $show = 'style="display:none;"';
                        if(questions[number]['existinganswer']) $show = 'style="display:block;"';
                        
                        template += '<div class="controls">';
                            //template += '<span>' + question.prefix + ' </span>';
                            template += '<input value="'+questions[number]['existinganswer']+'" type="text" data-intentid="'+intentId+'" data-strategyid="'+strategyId+'" data-previousquestion="'+prevnumber+'" data-currentquestion="'+number+'" data-goto="' + questions[number]['gotoquestion'] + '" data-directoutcome="' + questions[number]['direct_outcome'] + '" class="questiontext text-' + number + ' span5" id="' + number + '" name="' + number + '">';
                            //template += '<span> ' + question.suffix + '</span>';
                            template += '<a '+$show+' data-intentid="'+intentId+'" data-strategyid="'+strategyId+'" data-previousquestion="'+prevnumber+'" data-currentquestion="'+number+'" data-goto="' + questions[number]['gotoquestion'] + '" data-directoutcome="' + questions[number]['direct_outcome'] + '" class="answerbutton waves-effect waves-light btn btn-green right" id="button-' + number + '">Next</a>';
                        template += '</div>';
                    }else if (questions[number]['qtype'] == 'narrative') {
                        $show = 'style="display:none;"';
                        if(questions[number]['existinganswer']) $show = 'style="display:block;"';
                        
                        template += '<div class="controls">';
                            template += '<textarea placeholder="Please describe..." data-intentid="'+intentId+'" data-strategyid="'+strategyId+'" data-previousquestion="'+prevnumber+'" data-currentquestion="'+number+'" data-goto="' + questions[number]['gotoquestion'] + '" data-directoutcome="' + questions[number]['direct_outcome'] + '" class="questiontextarea textarea-' + number + ' span5" id="'+ number + '" name="' + number + '">'+questions[number]['existinganswer']+'</textarea>';
                            template += '<a '+$show+' data-intentid="'+intentId+'" data-strategyid="'+strategyId+'" data-previousquestion="'+prevnumber+'" data-currentquestion="'+number+'" data-goto="' + questions[number]['gotoquestion'] + '" data-directoutcome="' + questions[number]['direct_outcome'] + '" class="answerbutton waves-effect waves-light btn btn-green right" id="button-' + number + '">Next</a>';
                        template += '</div>';
                    }else if (questions[number]['qtype'] == 'select') {
                        template += '<div class="controls select">';
                            template += '<select data-intentid="'+intentId+'" data-strategyid="'+strategyId+'" data-previousquestion="'+prevnumber+'" data-currentquestion="'+number+'" data-goto="' + answer.gotoquestion + '" data-directoutcome="' + answer.direct_outcome + '" class="answerbutton ' + number + '" id="' + number + '" name="select' + number + '">';
                            $.each(questions[number]['answers'], function(i, answer) {
                                template += '<option data-goto="' + answer.gotoquestion + '" value="' + answer.key + '">' + answer.value + '</option>';
                            });
                            template += '</select>';
                        template += '</div>';
                    }else if (questions[number]['qtype'] == 'slider') {
                        $show = 'style="display:none;"';
                        $slider_value = 0;
                        if(questions[number]['existinganswer']){
                            $slider_value = questions[number]['existinganswer'];
                            $show = 'style="display:block;"';
                        }
                        template += '<div class="controls slider">';
                            template += '<div class="slider-div" id="slider-control-' + number + '" style="width:400px;"';
                                template += '<form>';
                                    template += '<span id="min-slider-value">'+questions[number]['min_val']+'</span>';
                                    template += '<input id="slider-value" type="range" name="rangeInput" min="'+questions[number]['min_val']+'" max="'+questions[number]['max_val']+'" value="'+$slider_value+'"/>';
                                    template += '<span id="max-slider-value">'+questions[number]['max_val']+'</span><br/>';                             
                                    template += '<span id="slider-selected-value">'+ $slider_value + '</span>';
                                template += '</form>';
                            template += '</div>';
                        template += '</div>';
                        template += '<a '+$show+' data-intentid="'+intentId+'" data-strategyid="'+strategyId+'" data-previousquestion="'+prevnumber+'" data-currentquestion="'+number+'" data-goto="' + questions[number]['gotoquestion'] + '" data-directoutcome="' + questions[number]['direct_outcome'] + '" class="answerbutton waves-effect waves-light btn btn-green right " id="button-' + number + '" style="visibility: hidden">Next</a>';
                    }else if(questions[number]['qtype'] == 'file'){
                        
                        $show = 'style="display:none;"';                        
                                            
                        if(questions[number]['existinganswer']){   
                            
                            $show = 'style="display:block;"';
                            $ans = questions[number]['existinganswer'];
                            
                            template += '<div style="clear: left;margin-left: 0px;padding-left: 0px;" class="elements_questionnaire_upload file_type_question" id="elements_upload_data-' + questions[number]['qid'] + '" data-qid="' + questions[number]['qid'] + '" data-intentid="'+intentId+'" data-strategyid="'+strategyId+'">';
                                var questionFiles = "";    
                                questionFiles = $.parseJSON(questions[number]['existinganswer'].replace(/'/g, '"')); 
                                
                                var keys_files = [];
                                for(var key in questionFiles){
                                      keys_files.push(key);
                                }
                                if(keys_files.length > 1){
                                    $.each(questionFiles, function(i, file) {
                                     
                                        var filename =  file['filename'];
                                        var filepath =  file['filepath'].replace("/deploy/", "/");
                                        
                                        template += '<div class="files-list"><i class="delete-document-file'+i+' icon-remove-sign" data-qid="' + questions[number]['qid'] + '" data-intentid="' + intentId + '" data-strategyid="' + strategyId + '" data-filename="' + filename + '"></i>';
                                        template += '<a class="elements-file-name" target="_blank" id="uploaded-file-' + strategyId + '" href="' + filepath + '">' + filename + '</a></div>';    
                                        $("#elements_questionnaire_upload-" + strategyId).attr("data-filename", filename);
    
                                        $(document.body).off("click",".delete-document-file"+i).on("click",".delete-document-file"+i, function (event) {
                                            plaque.elements.deleteQuestionDocumentUploadedFileAWS($(this));
                                        });
                                    });
                                }else if(keys_files.length == 1){
                                    var filename =  questionFiles[0]['filename'];
                                    var filepath =  questionFiles[0]['filepath'].replace("/deploy/", "/");
                                    
                                    template += '<div class="files-list"><i class="delete-document-file0 icon-remove-sign" data-qid="' + questions[number]['qid'] + '" data-intentid="' + intentId + '" data-strategyid="' + strategyId + '" data-filename="' + filename + '"></i>';
                                    template += '<a class="elements-file-name" target="_blank" id="uploaded-file-' + strategyId + '" href="' + filepath + '">' + filename + '</a></div>';    
                                    $("#elements_questionnaire_upload-" + strategyId).attr("data-filename", filename);

                                    $(document.body).off("click",".delete-document-file0").on("click",".delete-document-file0", function (event) {
                                         plaque.elements.deleteQuestionDocumentUploadedFileAWS($(this));
                                    });
                                }

                                template += '<span class="btn btn-success fileinput-button">';
                                    template += '<i class="fa fa-upload"></i><span>Add Document</span>';
                                    template += '<input class="elements_file_data_new upload" name="elements_file_data_new" id="elements_upload_data' + strategyId + '" data-qid="' + questions[number]['qid'] + '" data-intentid="'+intentId+'" data-strategyid="'+strategyId+'" type="file" name="files[]" multiple="">';
                                template += '</span>';                     
                                                                                              
                            template += '</div>';

                        }else{
                            template += '<div style="clear: left;margin-left: 0px;padding-left: 0px;" class="elements_questionnaire_upload file_type_question" id="elements_upload_data-' + questions[number]['qid'] + '" data-qid="' + questions[number]['qid'] + '" data-intentid="'+intentId+'" data-strategyid="'+strategyId+'">';
                                template += '<span class="btn btn-success fileinput-button">';
                                    template += '<i class="fa fa-upload"></i><span>Add Document</span>';
                                    template += '<input class="elements_file_data_new upload" name="elements_file_data_new" id="elements_upload_data' + questions[number]['qid'] + '" data-qid="' + questions[number]['qid'] + '" data-intentid="'+intentId+'" data-strategyid="'+strategyId+'" type="file" name="files[]" multiple="">';
                                template += '</span>';
                            template += '</div>';
                        }
                        template += '<a style="margin-top: 20px;" data-intentid="'+intentId+'" data-strategyid="'+strategyId+'" data-previousquestion="'+prevnumber+'" data-currentquestion="'+number+'" data-goto="' + questions[number]['gotoquestion'] + '" data-directoutcome="' + questions[number]['direct_outcome'] + '" class="answerbutton waves-effect waves-light btn btn-green right" id="button-' + questions[number]['qid'] + '">Next</a>'; 
                        
                    }
                    template +='</div>';
                    if(number != questions['firstquestion']){
                        //template += '<div class="previousbutton" data-intentid="'+intentId+'" data-strategyid="'+strategyId+'" data-previousquestion="'+prevnumber+'" data-currentquestion="'+number+'" data-goto="' + questions[number]['gotoquestion'] + '" data-directoutcome="' + questions[number]['direct_outcome'] + '"><img src="/static/dashboard/img/previous-arrow.png" width="25px" height="25px"></div>';
                    }
                }else{
                    template += '<div class="strategy-no-questions">';
                        template += '<p class="strategy-question">No questions at this time. Please revisit!!</p>';
                        if(strategy_details.learnmore){
                            template += '<a target="_blank" href="' + strategy_details.learnmore + '" class="learn-more right">Learn More <i class="icon-external-link"></i></a>';
                        }
                        template +='<div class="button-group">';
                        template += '</div>';
                    template += '</div>';
                }
                questionnaire.html(template);
            },
            submitAnswer: function(projectId, questionId, answer){
                var data = {};
                data["question_id"] = questionId;
                data["answer"] = answer;
                
                jQuery.ajax( {
                    async:false, 
                    url: "/elements/questions/LEED:" + projectId,
                    type: "PUT",
                    contentType: 'application/json',
                    data: JSON.stringify(data),
                    success:function(msg){
                        return msg;
                    }
                });
            },
            updateStrategyStatus: function(projectId, data){
                
                jQuery.ajax( {
                    async:false, 
                    url: "/elements/strategies/LEED:" + projectId,
                    type: "PUT",
                    contentType: 'application/json',
                    data: JSON.stringify(data),
                    success:function(msg){
                        return msg;
                    }
                });
            },
            getFilesUploadedForStrategy: function(projectId, strategyId){
                var response = "";
                jQuery.ajax( {
                    async:false, 
                    url: "/elements/filesUploadedForStrategy/LEED:" + projectId + "/STRATEGYID:" + strategyId + '/',
                    type: "GET",
                    contentType: 'application/json',
                    success:function(msg){
                        response = msg;
                        return msg;
                    }
                });
                return response;
            },
            submitStrategy: function(projectId, answerObject){
                var data = {};
                data["title"]        = answerObject['title'];
                data["intent_id"]    = answerObject['intent_id'];
                data["description"]  = answerObject['description'];
                data["file"]         = answerObject['file'];
                data["strategy_id"]  = answerObject['strategy_id'];
                
                return jQuery.ajax( {
                    async:false, 
                    url: "/elements/strategies/LEED:" + projectId,
                    type: "POST",
                    contentType: 'application/json',
                    data: JSON.stringify(data),
                    //success:function(msg){
                    //  return msg.strategy;
                    //}
                });
            },
            deleteStrategy: function(projectId,intentId,strategyId){
                
                jQuery.ajax( {
                    async:false, 
                    url: "/elements/strategies/delete/LEED:" + projectId + "/INTENTID:" + intentId + "/STRATEGYID:" + strategyId,
                    type: "DELETE",
                    contentType: 'application/json',
                    success:function(msg){
                        return msg;
                    }
                });
            },
            prepareUpload: function(object, event) {
                event.preventDefault();
                var random_key = plaque.elements.makeid();
                var files = event.target.files;
                var buildingID = plaque.elements.getQueryStringParams('LEED');
                var questionId = object.data('qid');
                var intentId = $("#elements_upload_data-" + questionId).data("intentid");
                var strategyId = $("#elements_upload_data-" + questionId).data("strategyid");
                
                if(typeof $("#elements_upload_data-" + questionId).data("strategyid") == 'undefined'){
                    return true;
                }
 
                var data = new FormData();
                data.append('elements_file_data', event.target.files[0]);
                data.append('qid',questionId);
                data.append('random_key',random_key);
                //console.log(event.target.files);
                $("#elements_upload_data-" + questionId).html('<div id="prog'+ questionId +'"></div>');
                $("#prog" + questionId).progressbar({value:false});
                $.ajax({
                  url: "/elements/file/LEED:" + buildingID,
                  type: 'POST',
                  headers: { 'X-CSRFToken': plaque.elements.getCookie('csrftoken') },
                  data: data,
                  contentType: false,
                  cache: false,
                  processData: false,
                  success: function(response) {
                    var upload_key = response.key;
                     
                    if(response.status == "Success"){
                        var filename =  response.file_name;
                        var filepath =  response.file_path.replace("/deploy/", "/");
                        var answer = {};
                        answer["filename"] = filename;
                        answer["filepath"] = filepath;
                        
                        plaque.elements.submitAnswer(buildingID, questionId, answer);
                        
                        var ancharTag = '<i class="delete-file icon-remove-sign" data-qid="' + questionId + '" data-filename="' + filename + '"></i>';
                        ancharTag += '<a class="elements-file-name" target="_blank" id="uploaded-file-' + questionId + '" data-qid="' + questionId + '" href="' + filepath + '">' + filename + '</a>';
                        $("#elements_upload_data-" + questionId).attr("data-filename", filename);
                        $("#elements_upload_data-" + questionId).html(ancharTag);
                        $(document.body).off('change', '.not-applicable .delete-file').on('change', '.not-applicable .delete-file', function(event) {
                            plaque.elements.deleteUploadedFile($("#elements_upload_data-" + questionId));
                        });
                        
                        $("#elements_upload_data-" + questionId).siblings('.answerbutton').show();
                    }
                    else if(response.status == "Error") {
                        var template = '<div class="elements_questionnaire_upload" id="elements_upload_data-' + questionId + '" data-qid="' + questionId + '" data-intentid="'+intentId+'" data-strategyid="'+strategyId+'">';
                        template += '<span class="btn btn-success fileinput-button">';
                            template += '<i class="fa fa-upload"></i><span>Add Document</span>';
                            template += '<input class="elements_file_data_new upload" name="elements_file_data_new" id="elements_upload_data' + questionId + '" data-qid="' + questionId + '" data-intentid="'+intentId+'" data-strategyid="'+strategyId+'" type="file" name="files[]" multiple="">';
                        template += '</span>';
                        template += '</div>';
                        template += '<span class="fileuploaderror">Error uploading file: ' + response.message + '</span>';
                        $("#elements_upload_data-" + questionId).html(template);
                        $(document.body).off('change', '.not-applicable .questionnaire input[type=file]').on('change', '.not-applicable .questionnaire input[type=file]', function(event) {
                            plaque.elements.prepareUpload($(this),event);
                        });
                        $("#elements_upload_data-" + questionId).siblings('.answerbutton').hide();
                    }
                  },
                  error: function(err){
                        var template = '<div class="elements_questionnaire_upload" id="elements_upload_data-' + questionId + '" data-qid="' + questionId + '" data-intentid="'+intentId+'" data-strategyid="'+strategyId+'">';
                        template += '<span class="btn btn-success fileinput-button">';
                            template += '<i class="fa fa-upload"></i><span>Add Document</span>';
                            template += '<input class="elements_file_data_new upload" name="elements_file_data_new" id="elements_upload_data' + questionId + '" data-qid="' + questionId + '" data-intentid="'+intentId+'" data-strategyid="'+strategyId+'" type="file" name="files[]" multiple="">';
                        template += '</span>';
                        template += '</div>';
                        template += '<span class="fileuploaderror">Error uploading file: ' + err.status + '</span>';
                        $("#elements_upload_data-" + questionId).html(template);
                        $(document.body).off('change', '.not-applicable .questionnaire input[type=file]').on('change', '.not-applicable .questionnaire input[type=file]', function(event) {
                            plaque.elements.prepareUpload($(this),event);
                        });
                        $("#elements_upload_data-" + questionId).siblings('.answerbutton').hide();
                  },
                  progress: function(e) {
                      if(e.lengthComputable) {
                          var pct = (e.loaded / e.total) * 100;
                          $("#prog" + questionId)
                              .progressbar('option', 'value', pct)
                              .children('.ui-progressbar-value')
                              .html('<span class="percentage-text">' + pct.toPrecision(3) + '%</span>')
                              .css('display', 'block');
                      }
                  }
                });
            },
            deleteUploadedFile: function(file){
                var questionId = file.data('qid');
                var filename = file.data('filename'); 
                var buildingID = plaque.elements.getQueryStringParams('LEED');
                var intentId = file.data("intentid");
                var strategyId = file.data("strategyid");
                
                if(typeof file.data('filename') == 'undefined' || typeof file.data('strategyid') == 'undefined'){
                    return true;
                }

                var data = {};
                data["qid"] = questionId;
                data["filename"] = file.data('filename');
                
                jQuery.ajax( {
                    async:false, 
                    url: "/elements/file/delete/LEED:" + buildingID + "/QID:" + questionId + "/FILENAME:" + filename,
                    type: "DELETE",
                    contentType: 'application/json',
                    success:function(msg){
                        var template = '<div class="elements_questionnaire_upload" id="elements_upload_data-' + questionId + '" data-qid="' + questionId + '" data-intentid="'+intentId+'" data-strategyid="'+strategyId+'">';
                        template += '<span class="btn btn-success fileinput-button">';
                            template += '<i class="fa fa-upload"></i><span>Add Document</span>';
                            template += '<input class="elements_file_data_new upload" name="elements_file_data_new" id="elements_upload_data' + questionId + '" data-qid="' + questionId + '" data-intentid="'+intentId+'" data-strategyid="'+strategyId+'" type="file" name="files[]" multiple="">';
                        template += '</span>';
                        template += '</div>';
                        $("#elements_upload_data-" + questionId).html(template);
                        $(document.body).off('change', '.not-applicable .questionnaire input[type=file]').on('change', '.not-applicable .questionnaire input[type=file]', function(event) {
                            plaque.elements.prepareUpload($(this),event);
                        });
                        $("#elements_upload_data-" + questionId).siblings('.answerbutton').hide();
                    }
                });
            },
            prepareStrategyUpload: function(object, event) {
                event.preventDefault();
                var random_key = plaque.elements.makeid();
                var files = event.target.files;
                var buildingID = plaque.elements.getQueryStringParams('LEED');
                var intentId = object.data("intentid");
                var strategyId = object.data("strategyid");
                
                var id = "#elements_questionnaire_upload-" + strategyId;
                
                var data = new FormData();
                data.append('elements_file_data', event.target.files); //JM - need to add [0] back...
                data.append('qid',strategyId);
                data.append('random_key',random_key);
                
                $(id).html('<div id="prog'+ strategyId +'"></div>');
                $("#prog" + strategyId).progressbar({value:false});
                $.ajax({
                  url: "/elements/file/LEED:" + buildingID,
                  type: 'POST',
                  headers: { 'X-CSRFToken': plaque.elements.getCookie('csrftoken') },
                  data: data,
                  contentType: false,
                  cache: false,
                  processData: false,
                  success: function(response) {
                    var upload_key = response.key;
                     
                    if(response.status == "Success"){
                        var filename =  response.file_name;
                        var filepath =  response.file_path.replace("/deploy/", "/");
                        var answer = {};
                        answer["filename"] = filename;
                        answer["filepath"] = filepath;
                        
                        var data = {};
                        data["strategy_id"] = strategyId;
                        data["file"] = answer;
                        data["update_flag"] = 'file';
                        plaque.elements.updateStrategyStatus(buildingID, data);
                        
                        var ancharTag = '<i class="delete-custom-file icon-remove-sign" data-intentid="' + intentId + '" data-strategyid="' + strategyId + '" data-filename="' + filename + '"></i>';
                        ancharTag += '<a class="elements-file-name" target="_blank" id="uploaded-file-' + strategyId + '" href="' + filepath + '">' + filename + '</a>';
                        $(id).data("filename", filename);
                        $(id).html(ancharTag);
                        /*$(document.body).off("click",".delete-custom-file").on("click",".delete-custom-file", function (event) {
                            var delId = "#elements_questionnaire_upload-" + strategyId + " .delete-custom-file";
                            plaque.elements.deleteStrategyUploadedFile(delId);
                        });*/
                        
                        $(id).siblings('.customstrategy-answerbutton').show();
                    }
                    else if(response.status == "Error") {
                        var template = '<div class="elements_questionnaire_upload" id="elements_questionnaire_upload-' + strategyId + '" data-intentid="'+intentId+'" data-strategyid="'+strategyId+'">';
                        template += '<span class="btn btn-success fileinput-button">';
                            template += '<i class="fa fa-upload"></i><span>Add Document</span>';
                            template += '<input class="elements_file_data_new upload" name="elements_file_data_new" id="elements_upload_data' + strategyId + '" data-intentid="'+intentId+'" data-strategyid="'+strategyId+'" type="file" name="files[]" multiple="">';
                        template += '</span>';
                        template += '</div>';
                        template += '<span class="fileuploaderror">Error uploading file: ' + response.message + '</span>';
                        $("#elements_questionnaire_upload-" + strategyId).replaceWith(template);
                        $(document.body).off('change', '#elements_upload_data' + strategyId).on('change', '#elements_upload_data' + strategyId, function(event) {
                            plaque.elements.prepareStrategyUpload($(this),event);
                        });
                        $(id).siblings('.customstrategy-answerbutton').hide();
                    }
                  },
                  error: function(err){
                        var template = '<div class="elements_questionnaire_upload" id="elements_questionnaire_upload-' + strategyId + '" data-intentid="'+intentId+'" data-strategyid="'+strategyId+'">';
                        template += '<span class="btn btn-success fileinput-button">';
                            template += '<i class="fa fa-upload"></i><span>Add Document</span>';
                            template += '<input class="elements_file_data_new upload" name="elements_file_data_new" id="elements_upload_data' + strategyId + '" data-intentid="'+intentId+'" data-strategyid="'+strategyId+'" type="file" name="files[]" multiple="">';
                        template += '</span>';
                        template += '</div>';
                        template += '<span class="fileuploaderror">Error uploading file: ' + err.message + '</span>';
                        $("#elements_questionnaire_upload-" + strategyId).replaceWith(template);
                        $(document.body).off('change', '#elements_upload_data' + strategyId).on('change', '#elements_upload_data' + strategyId, function(event) {
                            plaque.elements.prepareStrategyUpload($(this),event);
                        });
                        $(id).siblings('.customstrategy-answerbutton').hide();
                  },
                  progress: function(e) {
                      if(e.lengthComputable) {
                          var pct = (e.loaded / e.total) * 100;
                          $("#prog" + strategyId)
                              .progressbar('option', 'value', pct)
                              .children('.ui-progressbar-value')
                              .html('<span class="percentage-text">' + pct.toPrecision(3) + '%</span>')
                              .css('display', 'block');
                      }
                  }
                });
            },
            deleteStrategyUploadedFile: function(file){
                var filename = file.data("filename"); 
                var buildingID = plaque.elements.getQueryStringParams('LEED');
                var intentId = file.data("intentid");
                var strategyId = file.data("strategyid");
                
                if(typeof file.data('filename') == 'undefined'){
                    return true;
                }
                
                jQuery.ajax( {
                    async:false, 
                    url: "/elements/file/strategy/delete/LEED:" + buildingID + "/SID:" + strategyId + "/FILENAME:" + filename,
                    type: "DELETE",
                    contentType: 'application/json',
                    success:function(msg){
                        
                        var data = {};
                        data["strategy_id"] = strategyId;
                        data["file"] = '';
                        data["update_flag"] = 'file';
                        plaque.elements.updateStrategyStatus(buildingID, data);
                        
                        var template = '<div class="elements_questionnaire_upload" id="elements_questionnaire_upload-' + strategyId + '" data-intentid="'+intentId+'" data-strategyid="'+strategyId+'">';
                        template += '<span class="btn btn-success fileinput-button">';
                            template += '<i class="fa fa-upload"></i><span>Add Document</span>';
                            template += '<input class="elements_file_data_new upload" name="elements_file_data_new" id="elements_upload_data' + strategyId + '" data-intentid="'+intentId+'" data-strategyid="'+strategyId+'" type="file" name="files[]" multiple="">';
                        template += '</span>';
                        template += '</div>';
                        var id = "#elements_questionnaire_upload-" + strategyId;
                        $(id).replaceWith(template);
                        /*$(document.body).on('change', '#elements_upload_data' + strategyId, function(event) {
                            console.log('delete strategy custom upload');
                            plaque.elements.prepareStrategyUpload($(this),event);
                        });*/
                        $(id).siblings('.customstrategy-answerbutton').hide();
                    }
                });
            },
            /*

            uploadFileAWS: function(object, event){
                AWS.config.update({
                    accessKeyId : 'AKIAINABVKVQZI4IRPRQ',
                    secretAccessKey : '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'
                });
                AWS.config.region = 'us-east-1';
                var bucket = new AWS.S3({params: {Bucket: 'elements-strategy-questions'}});
                var files = event.target.files;
                var MAX_SIZE = 104857600;
                var buildingID = "1000000117";
                var intentId = "611";
                var strategyId= "3905";
                var uploadErrorMsg = "";
                for(i=0;i<files.length;i++){
                    if(files[i].size > MAX_SIZE){
                        uploadErrorMsg = "Size limit is 100MB";
                    }                   
                }

                if(uploadErrorMsg == ""){
                    $('.file-size-error-msg').remove(); 
                    $.each(files, function(i, file){
                    console.log(i);
                        if (file) {
                            var filesUploading = "";
                            filesUploading += '<div class="upload-container"> <i id="delete-document-file'+i+'" class="delete-document-file icon-remove-sign" data-intentid="' + intentId + '" data-strategyid="' + strategyId + '" data-filename="' + file + '" style="visibility:visible;"></i>';
                            filesUploading += '<a class="elements-file-name" target="_blank" id="uploaded-file-' + i + '" href="" style="pointer-events: none;">' + file.name + '</a>';
                            filesUploading += '<div id="files-ajax-progress">'
                            filesUploading += '<button class="btn-link btn-stop-file-upload" id="stop-upload-'+i+'">Stop</button>';
                            filesUploading += '<div id="prog'+ i +'" class="file-progress"></div>';                         
                            filesUploading += '</div></div>'
                            var tempFileName = buildingID+"/"+strategyId+"/"+file.name;
                            $('.aws-file-upload').find("div.fileinput-button").before(filesUploading);
                            $("#prog" + i).progressbar({value:false});

                            var params = {Key: tempFileName, ContentType: file.type, Body: file};
                            request = bucket.putObject(params);
                            request.on('httpUploadProgress', function(evt) {

                                //console.log("Uploaded :: " + parseInt((evt.loaded * 100) / evt.total)+'%');
                                var pct = parseInt((evt.loaded * 100) / evt.total);
                                $("#prog" + i)
                                  .progressbar('option', 'value', pct)
                                  .children('.ui-progressbar-value')
                                  .html('<span class="percentage-text">' + pct.toPrecision(3) + '%</span>')
                                  .css('display', 'block');

                                $('input[type="file"]').prop('disabled', true);
                                if(pct.toPrecision(3)==100){
                                    $("#stop-upload-"+i).fadeOut(500);
                                    //$("#stop-upload-"+i).remove();
                                    $("#prog" + i).fadeOut(500);
                                    //$("#prog" + i).remove();
                                    $("#stop-upload-"+i).parent().parent("div.upload-container").fadeOut(100);
                                    $("#stop-upload-"+i).parent().parent("div.upload-container").remove();
                                    $('input[type="file"]').prop('disabled', false);
                                }
                            }).send(function(err, data) {
                                if(err){
                                    console.log('Error' + err);
                                }else if(data){
                                    console.log(data);
                                    plaque.elements.objectExistAWS(tempFileName);
                                    
                                    //plaque.elements.getObjectAWS(file.name);
                                    var filesArray = {};
                                    var fileIndex = 0;
                                    var answer = {};
                                    var fname = file.name.replace(/\s/g,"%20");
                                    answer["filename"] = file.name;
                                    answer["filepath"] = "https://elements-strategy-questions.s3.amazonaws.com/"+buildingID+"/"+strategyId+"/"+fname;
                                    
                                    filesArray[fileIndex] = answer;
                                    fileIndex = fileIndex + 1;

                                    plaque.elements.listFileAWS(buildingID, strategyId);
                                    var filesUploadedForStrategy = "";
                                    filesUploadedForStrategy = plaque.elements.getFilesUploadedForStrategy(buildingID, strategyId);
                                    //console.log(filesUploadedForStrategy);
                                    if(filesUploadedForStrategy.files){
                                        var strategyFiles = $.parseJSON(filesUploadedForStrategy.files.replace(/'/g, '"'));
                                        $.each(strategyFiles, function(i, file) {
                                            var answer = {};
                                            answer["filename"] = file['filename'];
                                            answer["filepath"] = file['filepath']
                                            filesArray[fileIndex] = answer;
                                            fileIndex = fileIndex + 1;
                                        });
                                    } //appending new files to prev files added 
                                    //console.log(filesArray);
                                    var data = {};
                                    data["strategy_id"] = strategyId;
                                    data["file"] = filesArray;
                                    data["update_flag"] = 'file';
                                    //console.log(data);
                                    plaque.elements.updateStrategyStatus(buildingID, data); // updating status with all files
                                    
                                }
                            });
                        }
                    });
                }else{
                    $("div.fileinput-button").before("<div class='file-size-error-msg'><font color='red'><strong>Size limit is 100MB</strong></font></div>");
                }
            },

            listFileAWS: function(buildingID, strategyId){
                //console.log(buildingID+":"+strategyId);
                AWS.config.update({
                    accessKeyId : 'AKIAINABVKVQZI4IRPRQ',
                    secretAccessKey : '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'
                });
                AWS.config.region = 'us-east-1';
                var bucket = new AWS.S3({params: {Bucket: 'elements-strategy-questions'}});
                var temp = "";
                bucket.listObjects(function(err, data){
                    //console.log(err);
                    //console.log(data);
                    if(data){
                        //console.log("array: "+data.Contents);
                        $.each(data.Contents, function(i, file){
                            var fileLocation = file.Key.replace(/\s/g,"%20");
                            var filename = file.Key.split("/").pop();
                            if( fileLocation.indexOf(strategyId) != -1 ){
                                temp += '<i id="delete-aws-file'+i+'" class="delete-aws-file icon-remove-sign"  data-filename=' + fileLocation +'></i><a href="https://elements-strategy-questions.s3.amazonaws.com/'+fileLocation+'" target=_blank >'+filename+'</a><br>';
                            }
                        });
                        $('.aws-file-upload > .files-list').html(temp);
                            //$('.aws-file-upload > .files-list').append('<i id="delet
                    }
                });
            },

            deleteFileAWS: function(file) {
                var filesArray = {};
                var fileIndex = 0;
                var answer = {};
                var buildingID = "1000000117";
                var intentId = "611";
                var strategyId= "3905";
                var filename = file.data('filename');
                filename = filename.replace(/%20/g, " ");
                var fname = filename.split("/").pop();
                console.log("in delete"+filename);
                AWS.config.update({
                    accessKeyId : 'AKIAINABVKVQZI4IRPRQ',
                    secretAccessKey : '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'
                });
                AWS.config.region = 'us-east-1';
                var bucket = new AWS.S3({params: {Bucket: 'elements-strategy-questions'}});
                var params = {Key: filename};
                bucket.deleteObject(params, function (err, data) {
                    if(err) {
                        console.log("Check if you have sufficient permissions : "+err);
                        //console.log(err.stack);
                    }
                    else{
                        console.log(data);
                        var filesUploadedForStrategy = "";
                        filesUploadedForStrategy = plaque.elements.getFilesUploadedForStrategy(buildingID, strategyId);
                        console.log(filesUploadedForStrategy);
                        if(filesUploadedForStrategy.files){
                            var strategyFiles = $.parseJSON(filesUploadedForStrategy.files.replace(/'/g, '"'));
                            $.each(strategyFiles, function(i, file) {
                                if( file['filename'] != fname ){
                                    var answer = {};
                                    answer["filename"] = file['filename'];
                                    answer["filepath"] = file['filepath']
                                    filesArray[fileIndex] = answer;
                                    fileIndex = fileIndex + 1;
                                }
                            });
                        }
                        var data = {};
                        data["strategy_id"] = strategyId;
                        data["file"] = filesArray;
                        data["update_flag"] = 'file';
                        console.log(data);
                        plaque.elements.updateStrategyStatus(buildingID, data);
                        $(file).next("a").next("br").remove();
                        $(file).next("a").remove();
                        $(file).remove();
                    }
                    
                });

            },

            objectExistAWS: function(fileName){
                console.log("File name in getObjectAWS "+fileName);
                AWS.config.update({
                    accessKeyId : 'AKIAINABVKVQZI4IRPRQ',
                    secretAccessKey : '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'
                });
                AWS.config.region = 'us-east-1';
                var bucket = new AWS.S3();
                var params = {Bucket: 'elements-strategy-questions', Key: fileName};
                try {
                    bucket.headObject(params, function(err, data) {
                        if (err) console.log(err, err.stack); // an error occurred
                        else     console.log(data);           // successful response
                    });
                }catch(ex) {
                    console.log(ex);
                }
                
            },
            

            

            stopFileAWS: function(file) {
                console.log("stop called");
                plaque.elements.abort();
                $(file).parent('div').parent('.upload-container').fadeOut(500);
                $(file).parent('div').parent('.upload-container').remove();
                request = null;
                $('.aws-file-upload').find('.fileinput-button').remove();
                $('.aws-file-upload').append('<div class="btn btn-success fileinput-button"><i class="fa fa-upload"></i><span>Add Document</span><input type="file" name="file" id="file" multiple=""></div>');
                $('input[type="file"]').prop('disabled', false);
            },

            */
            uploadFileAwsBoto: function(Object, event){
                event.preventDefault();
                var random_key  = plaque.elements.makeid();
                var files       = event.target.files;
                var buildingID = "1000000117";
                var intentId = "611";
                var strategyId= "3905";
                $.each(files, function(j, file) {       
                        var data = new FormData();
                        data.append('buildingID',buildingID);
                        data.append('strategyId',strategyId);
                        data.append('random_key',random_key);
                        data.append('fileType', file.type);
                        data.append('elements_file_data_multi', file);              
                        var xhr =
                        $.ajax({
                            url: "/elements/awsupload/",
                            type: 'POST',
                            headers: { 'X-CSRFToken': plaque.elements.getCookie('csrftoken') },
                            data: data,
                            contentType: false,
                            cache: false,
                            processData: false,
                            success: function(response) {
                                //console.log(response);
                            },
                            error: function(err){
                                //console.log(err);
                            }
                        });
                    });
            },

            abort: function(){
                //console.log("abort called");
                request.abort();
            },

            deleteStrategyDocumentUploadedFileAWS: function(file){
                var response = plaque.elements.getAWScredentials();
                //console.log("deleteStrategy "+ file.data('filename'));
                var filename = file.data('filename'); 
                var buildingID = plaque.elements.getQueryStringParams('LEED');
                var intentId = file.data("intentid");
                var strategyId = file.data("strategyid");
                var filesArray = {};
                var fileIndex = 0;
                var answer = {};
                
                if(typeof file.data('filename') == 'undefined' || typeof file.data('strategyid') == 'undefined'){
                    return true;
                }
                filename = filename.replace(/%20/g, " ");
                var fname = filename.split("/").pop();
                //console.log("in delete"+buildingID+"/"+strategyId+"/"+filename);
                AWS.config.update({
                    accessKeyId : response.accessKeyId,
                    secretAccessKey : response.secretAccessKey
                });
                AWS.config.region = 'us-east-1';
                var bucket = new AWS.S3({params: {Bucket: 'elements-strategy-questions'}});
                var params = {Key: buildingID+"/"+strategyId+"/"+filename};
                bucket.deleteObject(params, function (err, data) {
                    if(err) {
                        //console.log("Check if you have sufficient permissions : "+err);
                        //console.log(err.stack);
                    }
                    else{
                        //console.log(data);
                        var filesUploadedForStrategy = "";
                        filesUploadedForStrategy = plaque.elements.getFilesUploadedForStrategy(buildingID, strategyId);
                        //console.log(filesUploadedForStrategy);
                        if(filesUploadedForStrategy.files){
                            var strategyFiles = $.parseJSON(filesUploadedForStrategy.files.replace(/'/g, '"'));
                            $.each(strategyFiles, function(i, file) {
                                if( file['filename'] != fname ){
                                //if( "undefined" != "undefined" ){
                                    //console.log(file['filename']+" -> "+ fname);
                                    var answer = {};
                                    answer["filename"] = file['filename'];
                                    answer["filepath"] = file['filepath']
                                    filesArray[fileIndex] = answer;
                                    fileIndex = fileIndex + 1;
                                }
                            });
                        }
                        var data = {};
                        data["strategy_id"] = strategyId;
                        data["file"] = filesArray;
                        data["update_flag"] = 'file';
                        //console.log(data);
                        plaque.elements.updateStrategyStatus(buildingID, data);
                        $(file).next("a").remove();
                        $(file).parent("div").remove();
                        $(file).remove();
                    }
                    
                });

            },

            deleteStrategyUploadsForLastStepAWS: function(filesToDelete, strategyId){
                
                var response = plaque.elements.getAWScredentials();               
                var buildingID = plaque.elements.getQueryStringParams('LEED');

                AWS.config.update({
                    accessKeyId : response.accessKeyId,
                    secretAccessKey : response.secretAccessKey
                });

                AWS.config.region = 'us-east-1';
                var bucket = new AWS.S3({params: {Bucket: 'elements-strategy-questions'}});                
                
                for(var i=0; i<filesToDelete.length; i++){
                    
                    var filename = filesToDelete[i]; //file.data('filename');
                    filename = filename.replace(/%20/g, " ");
                    var params = {Key: buildingID+"/"+strategyId+"/"+filename};
                    bucket.deleteObject(params, function (err, data) {
                        if(err) {
                            //console.log("Check if you have sufficient permissions : "+err);
                            //console.log(err.stack);
                        }
                        else{
                            //console.log(data);
                        }                        
                    });                    
                }

                var data = {};
                data["strategy_id"] = strategyId;
                data["file"] = "";
                data["update_flag"] = 'file';
                plaque.elements.updateStrategyStatus(buildingID, data);
            },

            stopStrategyDocumentUploadAWS: function(file){
                //console.log(file);
                plaque.elements.abort();
                $(file).parent('div').parent('.files-list').fadeOut(500);
                //$(file).parent('div').parent('.files-list').remove();
                //request = null;
                $(file).parent('div').parent('div.elements_questionnaire_upload').find('span.fileinput-button').find('.elements_file_data_new upload').val("").clone(true);
                $('input[type="file"]').prop('disabled', false);
            },

            getAWScredentials: function(){
                var message = null;
                $.ajax({
                    url: "/elements/getawscredentials/",
                    type: 'GET',
                    async: false,
                    cache: false,
                    processData: false,
                    success: function(response) {
                        message = response;
                    },
                    error: function(err){
                        //console.log(err);
                        plaque.elements.getAWScredentials();
                    }
                });
                return message;
            },

            trimFileName: function(filename) {
                var tempFilename = "";
                filename_ext = filename.substr(filename.lastIndexOf("."), filename.length-1);
                filename_title = filename;
                filename_title = filename_title.replace(/(\.[^/.]+)+$/, "");
                if(filename_title.length>40){
                    filename_title = filename_title.substr(0,40); /* VR 15 jan: fixed for long name and repeating extension name*/
                    tempFilename = filename_title+".."+filename_ext;
                }
                else{
                    tempFilename = filename;
                } 
                return tempFilename;
            },

            deleteDuplicateErrorMsg: function(object){
                //console.log(object);
                $(object).parent('div.file-duplicate-error-msg').remove();
            },

            prepareStrategyDocumentUploadAWS: function(object, event){
                //console.log(object);
                //console.log(event);
                var response = plaque.elements.getAWScredentials();
                AWS.config.update({
                    accessKeyId : response.accessKeyId,
                    secretAccessKey : response.secretAccessKey
                });
                AWS.config.region = 'us-east-1';
                var bucket = new AWS.S3({params: {Bucket: 'elements-strategy-questions'}});
                event.preventDefault();
                var random_key  = plaque.elements.makeid();
                var files       = event.target.files;
                var MAX_SIZE    = 104857600;
                var buildingID  = plaque.elements.getQueryStringParams('LEED');
                var intentId    = object.data("intentid");
                var strategyId  = object.data("strategyid");
                //console.log("strategyid"+strategyId);
                var uploadErrorMsg = "";
                var fileDuplicateMsg = "";
                filesUploading = "";
                var id = "#elements_questionnaire_upload-" + strategyId;
                var fileUploadArray = [];
                var filename_duplicate = [];
                if(typeof object.data('strategyid') == 'undefined'){
                    return true;
                }
                $('.file-duplicate-error-msg-container').remove();
                $('.file-progress').removeAttr('id');
                $('.delete-document-file').removeAttr('id');
                $('.elements-file-name').removeAttr('id');
                $('.btn-stop-file-upload').removeAttr('id');
                /*
                for(i=0;i<files.length;i++){
                    if(files[i].size > MAX_SIZE){
                        uploadErrorMsg = "Size limit is 100MB";
                    }                   
                }
                */
                $.each(files, function(i, file){
                    if(file.size > MAX_SIZE){
                        uploadErrorMsg = "Size limit is 100MB";
                    }
                });

                var filesUploadedForStrategy = "";
                filesUploadedForStrategy = plaque.elements.getFilesUploadedForStrategy(buildingID, strategyId);
                //console.log(filesUploadedForStrategy);
                if(filesUploadedForStrategy.files){
                    var strategyFiles = $.parseJSON(filesUploadedForStrategy.files.replace(/'/g, '"'));
                    //console.log(strategyFiles);
                }
                    

                if(uploadErrorMsg == ""){
                    fileDuplicateMsg = "<div class='file-duplicate-error-msg-container'>";
                    $('.file-size-error-msg').remove();
                    $.each(files, function(i, file){
                        var flag = 0;
                        if(strategyFiles){
                            $.each(strategyFiles, function(j, fileStrategy) {
                                if(file.name == fileStrategy['filename']){
                                    flag = 1;
                                    fileDuplicateMsg += "<div class='file-duplicate-error-msg' style='margin-left:18px;'><font color='#FF615C'><strong>"+ file.name + " - already exists, please rename and then upload.</strong></font></div>";
                                }
                            });
                        }

                        if(flag == 0){
                            fileUploadArray.push(file);
                        }  
                    });

                    fileDuplicateMsg += "</div>";

                    $.each(fileUploadArray, function(i, file){
                        var filename = "";
                        filename_ext = file.name.substr(file.name.lastIndexOf("."), file.name.length-1);
                        filename_title = file.name;
                        filename_title = filename_title.replace(/(\.[^/.]+)+$/, "");
                        if(filename_title.length>40){
                            filename_title = filename_title.substr(0,40); /* VR 15 jan: fixed for long name and repeating extension name*/
                            filename = filename_title+".."+filename_ext;
                        }
                        else{
                            filename = file.name;
                        } 
                        filesUploading += '<div class="files-list">';
                            filesUploading += '<i id="delete-document-file'+i+'" class="delete-document-file icon-remove-sign" data-intentid="' + intentId + '" data-strategyid="' + strategyId + '" data-filename="' + file.name + '" style="visibility:hidden;"></i>';
                            filesUploading += '<a class="elements-file-name" target="_blank" id="uploaded-file-' + i + '" href="" style="pointer-events: none;">' + filename + '</a>';
                            filesUploading += '<div id="files-ajax-progress">'
                            filesUploading += '<button class="btn-link btn-stop-file-upload" id="stop-upload-'+i+'">Stop</button>';
                            filesUploading += '<div id="prog'+ i +'" class="file-progress"></div>';                         
                            filesUploading += '</div>'
                        filesUploading += '</div>';
                    });
                    //$("#elements_questionnaire_upload-" + strategyId).find("span.fileinput-button").before(filesUploading);
                    $(object).parent().parent().find("span.fileinput-button").before(filesUploading);
                    //console.log($("#elements_questionnaire_upload-" + strategyId));
                    $.each(fileUploadArray, function(j, file){
                        $("#prog" + j).progressbar({value:false});
                        $("#prog" + j)
                              .progressbar('option', 'value', 0.0)
                              .children('.ui-progressbar-value')
                              .html('<span class="percentage-text">' + 0.0 + '%</span>')
                              .css('display', 'block');

                        var tempFileName = buildingID+"/"+strategyId+"/"+file.name;
                        var params = {Key: tempFileName, ContentType: file.type, Body: file};
                        request = bucket.putObject(params);
                        request.on('httpUploadProgress', function(evt) {
                            var pct = parseInt((evt.loaded * 100) / evt.total);
                            $("#prog" + j)
                              .progressbar('option', 'value', pct)
                              .children('.ui-progressbar-value')
                              .html('<span class="percentage-text">' + pct.toPrecision(3) + '%</span>')
                              .css('display', 'block');

                            $('input[type="file"]').prop('disabled', true);
                            if(pct.toPrecision(3)==100){
                                $("#stop-upload-"+j).fadeOut(500);
                                $("#prog" + j).fadeOut(500);
                                //$("#stop-upload-"+j).parent().parent().fadeOut(100);
                                //$("#stop-upload-"+i).parent().parent().remove();
                                $('input[type="file"]').prop('disabled', false);
                            }
                        }).send(function(err, data) {
                            if(err){
                                //console.log('Error' + err);
                                //console.log('Error' + err.stack);
                            }else if(data){
                                //console.log(data);
                                var filesArray = {};
                                var fileIndex = 0;
                                var answer = {};
                                var fname = file.name.replace(/\s/g,"%20");
                                var filepath = "https://elements-strategy-questions.s3.amazonaws.com/"+buildingID+"/"+strategyId+"/"+fname;
                                answer["filename"] = file.name;
                                answer["filepath"] = "https://elements-strategy-questions.s3.amazonaws.com/"+buildingID+"/"+strategyId+"/"+fname;
                                
                                filesArray[fileIndex] = answer;
                                fileIndex = fileIndex + 1;

                                $("#uploaded-file-"+j).attr("href",filepath).css("pointer-events","auto");
                                $("#uploaded-file-"+j).prev().css("visibility", "visible");

                                var filesUploadedForStrategy = "";
                                filesUploadedForStrategy = plaque.elements.getFilesUploadedForStrategy(buildingID, strategyId);
                                if(filesUploadedForStrategy.files){
                                    var strategyFiles = $.parseJSON(filesUploadedForStrategy.files.replace(/'/g, '"'));
                                    $.each(strategyFiles, function(i, file) {
                                        var answer = {};
                                        answer["filename"] = file['filename'];
                                        answer["filepath"] = file['filepath']
                                        filesArray[fileIndex] = answer;
                                        fileIndex = fileIndex + 1;
                                    });
                                } 
                                var data = {};
                                data["strategy_id"] = strategyId;
                                data["file"] = filesArray;
                                data["update_flag"] = 'file';
                                plaque.elements.updateStrategyStatus(buildingID, data);
                            }
                        });
                        //request = null;
                    });
                    //console.log(fileDuplicateMsg);
                    //$("span.fileinput-button").before(fileDuplicateMsg);
                    $(object).parent().parent().find("span.fileinput-button").before(fileDuplicateMsg);

                }else{
                    //$("span.fileinput-button").before("<div class='file-size-error-msg'><font color='red'><strong>Size limit is 100MB</strong></font></div>");
                    $(object).parent().parent().find("span.fileinput-button").before("<div class='file-size-error-msg'><font color='red'><strong>Size limit is 100MB</strong></font></div>");
                }

            },

            prepareStrategyDocumentUpload: function(object, event) {
                event.preventDefault();
                var random_key  = plaque.elements.makeid();
                var files       = event.target.files;
                var MAX_SIZE    = 104857600;
                var buildingID  = plaque.elements.getQueryStringParams('LEED');
                var intentId    = object.data("intentid");
                var strategyId  = object.data("strategyid");

                var id = "#elements_questionnaire_upload-" + strategyId;
                
                if(typeof object.data('strategyid') == 'undefined'){
                    return true;
                }

                $('.file-progress').removeAttr('id');
                $('.delete-document-file').removeAttr('id');
                $('.elements-file-name').removeAttr('id');
                $('.btn-stop-file-upload').removeAttr('id');

                var filesToBeUploadedArray = [];
                var uploadErrorMsg = "";
                for(i=0;i<files.length;i++){
                    if(files[i].size < MAX_SIZE){
                        filesToBeUploadedArray[i] = files[i].name;
                    }else{
                        uploadErrorMsg = "Size limit is 100MB";
                    }                   
                }

                if(uploadErrorMsg == ""){   
                    $('.file-size-error-msg').remove();             
                    var filesUploading ="";
                    $.each(filesToBeUploadedArray, function(i, file) {
                        if(file.length>20){
                            filename_title = file.substr(0,45);
                            filename_ext = file.substr(file.lastIndexOf("."), file.length-1)
                            filename = filename_title+".."+filename_ext;
                        }
                        else{
                            filename = file;
                        }                       

                        filesUploading += '<div class="files-list">';
                            filesUploading += '<i id="delete-document-file'+i+'" class="delete-document-file icon-remove-sign" data-intentid="' + intentId + '" data-strategyid="' + strategyId + '" data-filename="' + file + '" style="visibility:hidden;"></i>';
                            filesUploading += '<a class="elements-file-name" target="_blank" id="uploaded-file-' + i + '" href="" style="pointer-events: none;">' + filename + '</a>';
                            filesUploading += '<div id="files-ajax-progress">'
                            filesUploading += '<button class="btn-link btn-stop-file-upload" id="stop-upload-'+i+'">Stop</button>';
                            filesUploading += '<div id="prog'+ i +'" class="file-progress"></div>';                         
                            filesUploading += '</div>'
                        filesUploading += '</div>';
                    });
                    $(id).find("span.fileinput-button").before(filesUploading);             

                    var xhrArray = []; //keep track of all ajax uploads: for stopping ajax
                    
                    $.each(filesToBeUploadedArray, function(j, file) {      
                        var data = new FormData();
                        data.append('qid',strategyId);
                        data.append('random_key',random_key);       
                        data.append('elements_file_data_multi', files[j]);              
                        
                        $("#prog" + j).progressbar({value:false});      

                        var xhr =
                        $.ajax({
                            url: "/elements/file/LEED:" + buildingID,
                        //  url: "/elements/awsfileupload/LEED:" + buildingID, // implementing AWS upload
                            type: 'POST',
                            headers: { 'X-CSRFToken': plaque.elements.getCookie('csrftoken') },
                            data: data,
                            contentType: false,
                            cache: false,
                            processData: false,
                            success: function(response) {
                                if(response.status == 'Success'){
                                    var filesArray = {};
                                    var fileIndex = 0;                                  
                                //  $.each(response.files, function(i, file) { 
                                    var file = response.files;
                                    var filename =  file[0].file_name;
                                    var filepath =  file[0].file_path.replace("/deploy/", "/");
                                    
                                    $("#uploaded-file-"+j).attr("href",filepath).css("pointer-events","auto");
                                    $("#uploaded-file-"+j).prev().css("visibility", "visible");
                                    
                                    $(document.body).on("click",".delete-document-file"+j, function (event) {
                                        plaque.elements.deleteStrategyDocumentUploadedFileAWS($(this));
                                    });

                                    var answer = {};
                                    answer["filename"] = filename;
                                    answer["filepath"] = filepath
                                    
                                    filesArray[fileIndex] = answer;
                                    fileIndex = fileIndex + 1;
                                //  }); //array of new files uploaded                                   
                                    
                                    var filesUploadedForStrategy = "";
                                    filesUploadedForStrategy = plaque.elements.getFilesUploadedForStrategy(buildingID, strategyId);
                                    
                                    if(filesUploadedForStrategy.files){
                                        var strategyFiles = $.parseJSON(filesUploadedForStrategy.files.replace(/'/g, '"'));
                                        $.each(strategyFiles, function(i, file) {
                                            var answer = {};
                                            answer["filename"] = file['filename'];
                                            answer["filepath"] = file['filepath']
                                            filesArray[fileIndex] = answer;
                                            fileIndex = fileIndex + 1;
                                        });
                                    } //appending new files to prev files added 
                                
                                    var data = {};
                                    data["strategy_id"] = strategyId;
                                    data["file"] = filesArray;
                                    data["update_flag"] = 'file';
                                    
                                    plaque.elements.updateStrategyStatus(buildingID, data); // updating status with all files
                                    
                                }
                                else if(response.status == "Error") {
                                    var template = '<div class="elements_questionnaire_upload" id="elements_questionnaire_upload-' + strategyId + '" data-intentid="'+intentId+'" data-strategyid="'+strategyId+'">';
                                    template += '<span class="btn btn-success fileinput-button">';
                                        template += '<i class="fa fa-upload"></i><span>Add Document</span>';
                                        template += '<input class="elements_file_data_new upload" name="elements_file_data_new" id="elements_upload_data' + strategyId + '" data-intentid="'+intentId+'" data-strategyid="'+strategyId+'" type="file" name="files[]" multiple="">';
                                    template += '</span>';
                                    template += '</div>';
                                    template += '<span class="fileuploaderror">Error uploading file: ' + response.message + '</span>';
                                    $("#elements_questionnaire_upload-" + strategyId).replaceWith(template);
                                    $(document.body).off('change', '#elements_upload_data' + strategyId).on('change', '#elements_upload_data' + strategyId, function(event) {
                                        plaque.elements.prepareStrategyDocumentUpload($(this),event);
                                    });
                                    $(id).siblings('.customstrategy-answerbutton').hide();
                                }
                            
                            },/*
                            error: function(err){
                                    console.log(err);
                                    var template = '<div class="elements_questionnaire_upload" id="elements_questionnaire_upload-' + strategyId + '" data-intentid="'+intentId+'" data-strategyid="'+strategyId+'">';
                                    template += '<span class="btn btn-success fileinput-button">';
                                        template += '<i class="fa fa-upload"></i><span>Add Document</span>';
                                        template += '<input class="elements_file_data_new upload" name="elements_file_data_new" id="elements_upload_data' + strategyId + '" data-intentid="'+intentId+'" data-strategyid="'+strategyId+'" type="file" name="files[]" multiple="">';
                                    template += '</span>';
                                    template += '</div>';
                                    template += '<span class="fileuploaderror">Error uploading file: ' + err.message + '</span>';
                                    $("#elements_questionnaire_upload-" + strategyId).replaceWith(template);
                                    $(document.body).off('change', '#elements_upload_data' + strategyId).on('change', '#elements_upload_data' + strategyId, function(event) {
                                        plaque.elements.prepareStrategyDocumentUpload($(this),event);
                                    });
                                    $(id).siblings('.customstrategy-answerbutton').hide();
                            },*/
                            progress: function(e) {
                                if(e.lengthComputable) {
                                    var pct = (e.loaded / e.total) * 100;
                                    $("#prog" + j)
                                      .progressbar('option', 'value', pct)
                                      .children('.ui-progressbar-value')
                                      .html('<span class="percentage-text">' + pct.toPrecision(3) + '%</span>')
                                      .css('display', 'block');

                                    $('input[type="file"]').prop('disabled', true);
                                    if(pct.toPrecision(3)==100){
                                        $("#stop-upload-"+j).fadeOut(500);
                                        $("#prog" + j).fadeOut(500);
                                    }
                                }else{
                                    $('input[type="file"]').prop('disabled', false);
                                    $("#stop-upload-"+j).fadeOut(500);
                                }
                            }
                        });
                        
                        xhrArray.push(xhr);
                        
                        $("#stop-upload-"+j).click(function() {
                            xhrArray[j].abort();
                            $(this).parent().parent().fadeOut(500);
                        });     
                    });
                    
                }else{
                    $(id).find("span.fileinput-button").before("<div class='file-size-error-msg'><font color='red'><strong>Size limit is 100MB</strong></font></div>");
                }
                
            },
            deleteStrategyDocumentUploadedFile: function(file){
                var filename = file.data('filename'); 
                var buildingID = plaque.elements.getQueryStringParams('LEED');
                var intentId = file.data("intentid");
                var strategyId = file.data("strategyid");
                
                if(typeof file.data('filename') == 'undefined' || typeof file.data('strategyid') == 'undefined'){
                    return true;
                }
                
                jQuery.ajax( {
                    async:false, 
                    url: "/elements/file/strategy/delete/LEED:" + buildingID + "/SID:" + strategyId + "/FILENAME:" + filename,
                    type: "DELETE",
                    contentType: 'application/json',
                    success:function(msg){
                        
                        if(msg.status == 'Success'){
                        
                            var filesArray = {};
                            $.each(msg.files, function(i, file) { 
                                var filename =  file.file_name;
                                var filepath =  file.file_path.replace("/deploy/", "/");
                                
                                var answer = {};
                                answer["filename"] = filename;
                                answer["filepath"] = filepath
                                filesArray[i] = answer;
                            });
                            
                            var data = {};
                            data["strategy_id"] = strategyId;
                            data["file"] = filesArray;
                            data["update_flag"] = 'file';
                            plaque.elements.updateStrategyStatus(buildingID, data);
                            
                            $(file).next("a").remove();
                            $(file).parent("div").remove();
                            $(file).remove();
                        }else{
                            // console.log(msg.message);
                        }
                    }
                });
            },
            getStrategies: function(leed_id){
                var strategies_url = '/elements/strategies/LEED:'+leed_id;
                jQuery.ajax( {
                    async:false, 
                    type : 'GET',
                    url: strategies_url,
                    dataType: 'json',
                    success:function(strategies){
                        return strategies;
                    }
                });
                
                return false;
            },
            getQueryStringParams: function(sParam){
                var sPageURL = window.location.search.substring(1);
                var sURLVariables = sPageURL.split('&');
                for (var i = 0; i < sURLVariables.length; i++){
                  var sParameterName = sURLVariables[i].split('=');
                  if(sParameterName[0] == sParam){
                    return sParameterName[1];
                  }
                }
            },
            getCookie: function(name){
                var cookieValue = null;
                if (document.cookie && document.cookie != '') {
                    var cookies = document.cookie.split(';');
                    for (var i = 0; i < cookies.length; i++) {
                        var cookie = jQuery.trim(cookies[i]);
                        // Does this cookie string begin with the name we want?
                        if (cookie.substring(0, name.length + 1) == (name + '=')) {
                            cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                            break;
                        }
                    }
                }
                return cookieValue;
            },
            makeid: function(){
                var text = "";
                var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
                for( var i=0; i < 10; i++ )
                    text += possible.charAt(Math.floor(Math.random() * possible.length));

                return text;
            },
            responsiveSetup: function(){
                $("#navContainer").remove(); $(".strategy_sticky_nav").remove();
                $(".main_container").css("width","100%");
                $(".main_container .content").css("width","100%");
                $(".main_container .content").css("margin-left","0px");
                $("#non_racetrack_container").css("margin-left","270px");
                $("#non_racetrack_container").css("margin-right","25px")
            },
            /////////////////////////////////////////////
            ///// Elements new API changes starts ///////
            /////////////////////////////////////////////

            //get questions starts            
            getQuestions: function(intentId, strategyId){
                var buildingID = plaque.elements.getQueryStringParams('LEED');
                var questions = "";
                $.ajax({                    
                    async: false,
                    type: 'GET',
                    url: "/elements/questions/LEED:"+ buildingID+"/INTENTID:"+intentId+"/STRATEGYID:"+strategyId,
                    success: function(response) {
                        questions = response;
                    },
                    error:function(){
                        // failed request; give feedback to user
                       // $('#strategy_content').html('<p class="error"><strong>Oops!</strong> Try again in a few moments.</p>');
                      //  window.plaqueNav.removeStrategiesLoadingMessage(1500);
                    }
                });
                return questions;
            },
            // get questions ends

            // get Rating System starts
            getRatingSystem: function(){
                var buildingID = plaque.elements.getQueryStringParams('LEED');
                var ratingSystem = "";
                $.ajax({
                    async: false,
                    type: "GET",
                    url: "/elements/ratingsystems",
                    success: function(response) {
                        ratingSystem = response
                    }
                }); 
                return ratingSystem;
            },
            // get Rating System ends

            // get Building Rating System starts
            getBuildingRatingSystem: function(){
                var buildingID = plaque.elements.getQueryStringParams('LEED');
                var buildingRatingSystem = "";
                $.ajax({
                    async: false,
                    type: "GET",
                    url: "/elements/ratingsystems/LEED:"+ buildingID,
                    success: function(response) {
                        buildingRatingSystem = response;
                    }
                }); 
                return buildingRatingSystem;
            },
            // get Building Rating System ends

            // get SnapShot starts
            getSnapShot: function(){
                var buildingID = plaque.elements.getQueryStringParams('LEED');
                $.ajax({
                    async: false,
                    type: "GET",
                    url: "/elements/snapshot/LEED:"+ buildingID,
                    success: function(data) {
                        var status = data.status;
                        var ratingSystems = "";
                        var buildingRatingSystems = "";

                        if(status == "Success"){
                            $(".create-snapshot-div").css("display","none");
                            $("#strategy_content").css("margin-top","285px");
                            $(".strategies_container .header_strategies").css("display","block");
                            //plaque.elements.getIntents();
                            plaque.elements.snapshot_flag = true;
                            plaque.elements.showIntents(data);
                        }else{
                            $("#strategy_content").css("margin-top","199px");
                            $(".strategies_container .header_strategies").css("display","none");

                            ratingSystems = plaque.elements.getRatingSystem();
                            $.each(ratingSystems.ratingsystems, function(i, ratingSystem){ 
                                $('.select-system-dropdown ul.dropdown-menu').append('<li data-ratingsystem-key="'+ratingSystem.key+'">'+ratingSystem.value+'</li>');
                            });
                        }
                    },
                    error:function(){
                        $('#strategy_content').html('<p class="error"><strong>Oops!</strong> Try again in a few moments.</p>');
                    }
                }); 
            },
            // getSnapShot ends

            
            // create snapshot starts
            createSnapshot: function(selectedRatingSystem){                 
                var buildingID = plaque.elements.getQueryStringParams('LEED');
                var data = {};
                data["rating_system"]  = selectedRatingSystem;
                
                return jQuery.ajax( {
                    async:false, 
                    url: "/elements/snapshot/LEED:" + buildingID,
                    type: "POST",
                    contentType: 'application/json',
                    data: JSON.stringify(data),
                });
            },
            // create snapshot ends

            // manage strategies starts
            manageStrategies: function(){
                console.log("manageStrategies");
                var buildingID = plaque.elements.getQueryStringParams('LEED');
                var buildingRatingSystemCount = "";
                var buildingRatingSystem = [];
                
                $.ajax({
                    async:false, 
                    url: "/elements/ratingsystems/LEED:"+ buildingID,
                    type: "GET",
                    contentType: 'application/json',
                    success:function(response){

                        var status = response.status;

                        // pre selected rating system
                        if(status == "Success"){
                          var buildingratingsystems = response.buildingratingsystems;
                          buildingRatingSystemCount = buildingratingsystems.length;
                          
                          $.each(buildingratingsystems, function(i, ratingsystem) {
                            buildingRatingSystem.push(ratingsystem.key);
                          });

                        }
            
                        // for selecting RS
                        $.ajax({
                            async:false, 
                            url: "/elements/ratingsystems",
                            type: "GET",
                            contentType: 'application/json',
                            success:function(response){
                              
                            var ratingsystems = response.ratingsystems;
                               
                            var ratingsystemListDiv = "";
                            $.each(ratingsystems, function(i, ratingSystem){ 
                                ratingsystemListDiv+= '<li data-ratingsystem-key="'+ratingSystem.key+'">'+ratingSystem.value+'</li>';
                              //$('.select-system-dropdown ul.dropdown-menu').append('<li data-ratingsystem-key="'+ratingSystem.key+'">'+ratingSystem.value+'</li>');
                            });

                            console.log(buildingRatingSystem);
                            console.log(buildingRatingSystemCount);

                            var ratingSystemDiv = ""
                            for (var i = 0; i < buildingRatingSystemCount; i++) {
                                ratingSystemDiv+='<div class="selected-system-dropdown-grp">';
                                    ratingSystemDiv+='<div class="btn-group select-system-dropdown" style="border: 2px solid rgba(153, 153, 153, 0.82);">';
                                        ratingSystemDiv+='<button style="font-weight: bold;" class="btn btn-default dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">';
                                            ratingSystemDiv+='<span class="selected-system-text">';                                     
                                                //key = buildingRatingSystem[i]+
                                            var buildingRatingSystemKey = ""
                                            $.each(ratingsystems, function(j, ratingSystem){                                          
                                                if(ratingSystem.key == buildingRatingSystem[i]){
                                                    ratingSystemDiv+=ratingSystem.value;
                                                    buildingRatingSystemKey = ratingSystem.key;
                                                }
                                            });
                                            ratingSystemDiv+='</span>';
                                            ratingSystemDiv+='<span class="fa fa-angle-down"></span>';
                                        ratingSystemDiv+='</button>';
                                        ratingSystemDiv+='<ul class="dropdown-menu" role="menu">';

                                        var ratingsystemListDiv = "";
                                        $.each(ratingsystems, function(i, ratingSystem){
                                            var addClass = "";

                                            if(buildingRatingSystem.indexOf(ratingSystem.key)>=0){
                                                addClass = "already-selected-rs";
                                            } 
                                            ratingsystemListDiv+= '<li class="'+addClass+'" data-ratingsystem-key="'+ratingSystem.key+'">'+ratingSystem.value+'</li>';
                                        });
                                        ratingSystemDiv+= ratingsystemListDiv;

                                        ratingSystemDiv+='</ul>';
                                    ratingSystemDiv+='</div>'

                                    ratingSystemDiv+='<div class="delete-building-system" data-ratingsystem-key="'+buildingRatingSystemKey+'">';
                                        ratingSystemDiv+='<img src="/static/dashboard/img/fa-times-thin.png">';
                                        ratingSystemDiv+='<span style="margin-left: 5px;">Delete</span>';
                                    ratingSystemDiv+='</div>';
                                ratingSystemDiv+='</div>';
                            };

                            $.each(ratingsystems, function(i, ratingSystem){ 
                                $('.select-system-dropdown ul.dropdown-menu').append('<li data-ratingsystem-key="'+ratingSystem.key+'">'+ratingSystem.value+'</li>');
                            });

                            $(".manage_block #create-snapshot-body .pull-left .select-system-label").after(ratingSystemDiv);
                            }
                        });
                    }
                }); 
            },
            // manage strategies ends

            // delete RatingSystem From Snapshot starts
            updateRatingSystemFromSnapshot: function(data){                 
                var buildingID = plaque.elements.getQueryStringParams('LEED');

                $.ajax( {
                    async:false, 
                    url: "/elements/snapshot/LEED:" + buildingID,
                    type: "PUT",
                    contentType: 'application/json',
                    data: JSON.stringify(data),
                    success:function(msg){
                        return msg;
                    }
                });
            },
            // delete RatingSystem From Snapshot ends

            // get Category Name starts
            getCategoryName: function(categoryId, categoryList){
                var categoryName="";
                $.each(categoryList, function(i, category) {
                    if(categoryId == category.key){
                        categoryName = category.value;                        
                    }
                });
                return categoryName;
            },
            // get Category Name ends

            // show Intents starts
            showIntents: function(data){ 

                var status =  data.status;
                var result = data.result;
                if(status == 'Success'){
                    var intents = result.intents;
                    var categoryList = result.categoryList;
                    var strategyQuestions = [];
                    var answers = [];
                    var credits = {};
                    var categories = [];
                    var appliedRequiredStrategies = {};
                    var requiredStrategies = {};
                    var categoryCustom = [];
                    var categoryCustomCounter = 0;

                    $.each(intents, function(i, intent) {
                        if(!credits[intent.category]){
                            credits[intent.category] = [];
                        }
                        credits[intent.category].push({"intent":intent});
                        categories[intent.category] = plaque.elements.getCategoryName(intent.category, categoryList);
                    });

                    $.each(credits, function(i, categoryIntents){
                        var divIntent = '';
                        var category = {};
                        category['id'] = i;
                        category['name'] = categories[i];

                        categoryCustom[categoryCustomCounter] = i;
                        categoryCustomCounter+=1;
                        
                        $('#categoryList-dropdown ul.dropdown-menu').append('<li data-category-value="'+category['id']+'">'+category['name']+'</li>');
                                                                       
                        divIntent += '<div class="cataegory-div parent-accordion-section" id="section-'+category['id']+'">';
                            divIntent += '<div class="parent-accordion-section-title" data-href="#parent-section-'+category['id']+'">';
                                divIntent += '<p>'+category['name']+'</p>';
                                divIntent += '<img alt="" src="/static/dashboard/img/leed/'+category['id']+'-border.png">';
                            divIntent += '</div>';
                            
                            divIntent += '<div class="parent-accordion-section-content" id="parent-section-'+category['id']+'">';
                                $.each(categoryIntents, function(i, intents) {
                                    intent = intents.intent;                                            
                                    requiredStrategies[intent.id] = [];
                                    appliedRequiredStrategies[intent.id] = [];
                                    
                                    if(category['id'] == categoryCustom[0]/*'lt'*/){
                                        $('#intentList-dropdown ul.dropdown-menu').append('<li data-intent-value="'+intent.id+'">'+intent.name+'</li>');
                                    }                                            
                                    divIntent += '<div class="intent-div section accordion-section" id="overview-'+intent.category+'">';
                                        divIntent += '<div class="title-description">';
                                            divIntent += '<p class="intent-title">'+intent.name+'</p>';
                                            divIntent += '<p class="intent-description">'+intent.description+'</p>';
                                            divIntent += '<div class="circle" id="intent-required-counter-'+intent.id+'">';
                                                divIntent += '<strong></strong>';
                                                //divIntent += '<span class="intent-required">Required</span>'
                                            divIntent += '</div>';
                                        divIntent += '</div>';
                                        divIntent += '<div class="accordion-section-title" data-href="#index-banner-'+intent.id+'" data-intentid="'+intent.id+'"><p><i class="arrow-down"></i> <span class="credit-count">'+ intent.numberofstrategies +'</span> Strategies</p></div>';
                                        divIntent += '<div class="section accordion-section-content index-banner" id="index-banner-'+intent.id+'">';
                                            divIntent += '<ul class="collapsible popout" data-collapsible="accordion" style="width: 100%;" data-intentid="'+intent.id+'">';
                                               
                                            divIntent += '</ul>';
                                        divIntent += '</div>';
                                    divIntent += '</div>';
                                    
                                });
                    
                            divIntent += '</div>';
                        divIntent += '</div>';              
                        $('#strategy_content').append(divIntent);
                    });

                    // new changes : select dropdown issue          
                    $("#categoryList-dropdown ul.dropdown-menu li:first-child").addClass("selected-category");
                    $("#intentList-dropdown ul.dropdown-menu li:first-child").addClass("selected-intent");

                    $("#categoryList-dropdown .category-selected-text").text($("#categoryList-dropdown ul.dropdown-menu li:first-child").text());
                    $("#intentList-dropdown .intent-selected-text").text($("#intentList-dropdown ul.dropdown-menu li:first-child").text());         

                    $(document.body).on('click', '#categoryList-dropdown ul.dropdown-menu li', function() {
                        $(this).siblings().removeClass("selected-category");
                        $(this).addClass("selected-category");
                        
                        $(this).parents("#categoryList-dropdown").find('.category-selected-text').html($(this).text());
                    });

                    $(document.body).on('click', '#intentList-dropdown ul.dropdown-menu li', function() {
                        $(this).siblings().removeClass("selected-intent");
                        $(this).addClass("selected-intent");
                        
                        $(this).parents("#intentList-dropdown").find('.intent-selected-text').html($(this).text());
                    });

                    $(document.body).on('click', '#categoryList-dropdown ul.dropdown-menu li', function() {
                        
                        $('#add_custom_strategies #intentList-dropdown').find('li').remove();
                        
                        var catId = $(this).data("category-value");
                        $.each(credits, function(i, categoryIntents){               
                            var category = {};
                            category['id'] = i;
                            category['name'] = categories[i];
                            if(category['id'] != catId) return true;
                            $.each(categoryIntents, function(i, intents) {
                                var intent = intents.intent;
                                $('#intentList-dropdown ul.dropdown-menu').append('<li data-intent-value="'+intent.id+'">'+intent.name+'</li>');
                            });

                            $("#intentList-dropdown").find('.intent-selected-text').html(categoryIntents[0]["intent"].name);
                            $("#intentList-dropdown ul.dropdown-menu li:first-child").addClass("selected-intent");
                        });
                    });
                    // new changes: select dropdown issue

                    $(document.body).on('click','#customStrategyName', function(event) {    
                        $("#customStrategyName").removeClass("error");
                        $("#error-customStrategyName").slideUp(500)

                    });

                    $(document.body).on('click','#customStrategyDescription', function(event) { 
                        $("#customStrategyDescription").removeClass("error");
                        $("#error-customStrategyDescription").slideUp(500)

                    });
                    
                    // add custom strategy
                    $(document.body).on('click','#addCustomStrategy', function(event) { 
                        var intentId = $("#add_custom_strategies #intentList-dropdown .selected-intent").data("intent-value");
                        var categoryId = $("#add_custom_strategies #categoryList-dropdown .selected-category").data("category-value");
                        var strategyDesc = $.trim($('#customStrategyDescription').val());
                        var strategyName = $.trim($('#customStrategyName').val());

                        var emptyFieldsFlag = false;

                        if(strategyName ===''){
                            emptyFieldsFlag = true;
                            $("#customStrategyName").addClass("error");
                            $("#error-customStrategyName").addClass("error").slideDown(500);//show();
                        }

                        if(strategyDesc ===''){
                            emptyFieldsFlag = true;
                            $("#customStrategyDescription").addClass("error");
                            $("#error-customStrategyDescription").addClass("error").slideDown(500);//.show();
                        }

                        if(emptyFieldsFlag)
                            return;             
                    
                        var customStrategy = {};
                        customStrategy["title"]        = strategyName;
                        customStrategy["intent_id"]    = intentId;
                        customStrategy["description"]  = strategyDesc;
                        customStrategy["file"]       = '';

                        var strategyId ="";
                        $.when(plaque.elements.addCustomStrategies(buildingID,customStrategy))
                          .done(function( data ) {
                              var strategy = data.strategy;
                              strategyId = strategy.id;  
                        });

                        var divIntent = '';
                        divIntent += '<li class="custom-added strategy-custom new-custom-added">';
                            divIntent += '<div class="collapsible-header" data-strategyid="'+strategyId+'">';
                                divIntent += '<div class="strategy-counter"><div class="strategy-counter-content"><i class="fa fa-asterisk"></i></div></div>';
                                divIntent += '<div class="strategy-name">'+strategyName+'</div>';
                                divIntent += '<div class="hover-apply-strategy">';
                                    divIntent += '<div class="hover-apply-strategy-content">';
                                        divIntent += '<a class="waves-effect waves-light applyStrategy applied" data-intentid="'+intentId+'" data-strategyid="'+strategyId+'"><span class="yes-apply-circle">YES</span></a>';
                                        divIntent += '<a class="waves-effect waves-light notApplyStrategy" data-intentid="'+intentId+'" data-strategyid="'+strategyId+'"><span class="no-apply-circle">NO</span></a>';
                                        divIntent += '<a class="waves-effect waves-light fa fa-file-text-o documentStrategy" data-intentid="'+intentId+'" data-strategyid="'+strategyId+'"></a>';
                                        divIntent += '<a class="waves-effect waves-light fa fa-star-o starStrategy" data-intentid="'+intentId+'" data-strategyid="'+strategyId+'"></a>';
                                    divIntent += '</div>';
                                divIntent += '</div>';
                                divIntent += '<div class="strategy-action-menu">';
                                    divIntent += '<div class="hover-apply-strategy-content">';
                                        divIntent += '<div class="waves-effect waves-light actionmenuStrategy custom-actionmenuStrategy-'+strategyId+'" data-intentid="'+intentId+'" data-strategyid="'+strategyId+'"><i class="icon-ellipsis-horizontal icon-large"></i></div>';
                                        divIntent += '<ul class="strategy-action-nav pop-menu-'+categoryId+'" style="display:none;">';
                                            divIntent += '<li class="first-item">';
                                                divIntent += '<div class="apply-content">';
                                                    divIntent += '<span>Doing this credit?</span>';
                                                    divIntent += '<a class="waves-effect waves-light applyStrategy applied" data-intentid="'+intentId+'" data-strategyid="'+strategyId+'"><span class="yes-apply-circle">YES</span></a>';
                                                    divIntent += '<a class="waves-effect waves-light notApplyStrategy" data-intentid="'+intentId+'" data-strategyid="'+strategyId+'" ><span class="no-apply-circle">NO</span></a>';
                                                    divIntent += '<a class="waves-effect waves-light unDecidedStrategy" data-intentid="'+intentId+'" data-strategyid="'+strategyId+'"><span class="undecided-circle">Maybe</span></a>';
                                                divIntent += '</div>';
                                            divIntent += '</li>';
                                            divIntent += '<li class="navDocumentStrategy">';
                                                divIntent += '<a class="waves-effect waves-light action-item fa fa-file-text-o documentStrategy" data-intentid="'+intentId+'" data-strategyid="'+strategyId+'"></a><div class="action-text">Add Document</div>';
                                            divIntent += '</li>';
                                            divIntent += '<li class="navStarStrategy">';
                                                divIntent += '<a class="waves-effect waves-light action-item fa fa-star-o starStrategy" data-intentid="'+intentId+'" data-strategyid="'+strategyId+'"></a><div class="action-text">Star</div>';
                                            divIntent += '</li>';
                                        divIntent += '</ul>';
                                    divIntent += '</div>';
                                divIntent += '</div>';
                            divIntent += '</div>';
                            divIntent += '<div class="collapsible-body">';
                                divIntent += '<div class="questionnaire strategy-custom default-strategy-'+strategyId+'">'
                                    divIntent += '<div>';
                                        divIntent += '<p class="custom-strategy-description">Title</p>';
                                    divIntent += '</div>';
                                    divIntent += '<div class="button-group">';
                                        divIntent += '<div class="controls">';
                                            divIntent += '<input value="'+strategyName+'" placeholder="Strategy title" type="text" data-intentid="'+intentId+'" data-strategyid="'+strategyId+'" class="questiontext span5">';
                                        divIntent += '</div>';
                                    divIntent += '</div>';
                                    divIntent += '<div>';
                                        divIntent += '<p class="custom-strategy-description">Description</p>';
                                    divIntent += '</div>';
                                    divIntent += '<div class="button-group">';
                                        divIntent += '<div class="controls">';
                                            divIntent += '<textarea placeholder="Description" data-intentid="'+intentId+'" data-strategyid="'+strategyId+'" class="questiontextarea span5">'+strategyDesc+'</textarea>';
                                        divIntent += '</div>';
                                    divIntent += '</div>';
                                    divIntent += '<div>';
                                        divIntent += '<p class="custom-strategy-description">Document</p>';
                                    divIntent += '</div>';
                                    
                                    divIntent += '<div class="button-group">';

                                        divIntent += '<div class="elements_questionnaire_upload" id="elements_questionnaire_upload-' + strategyId + '" data-intentid="'+intentId+'" data-strategyid="' + strategyId + '">';
                                            divIntent += '<span class="btn btn-success fileinput-button">';
                                                divIntent += '<i class="fa fa-upload"></i><span>Add Document</span>';
                                                divIntent += '<input class="elements_file_data_new upload" name="elements_file_data_new" data-intentid="'+intentId+'" data-strategyid="' + strategyId + '" type="file" name="files[]" multiple="">';
                                            divIntent += '</span>';
                                        divIntent += '</div>';

                                    divIntent += '</div>';
                                    divIntent += '<div class="button-group deletestrategy">';
                                        divIntent += '<a class="waves-effect waves-light btn btn-red" data-intentid="'+intentId+'" data-strategyid="'+strategyId+'" id="delete-strategy">Delete</a>';
                                    divIntent += '</div>';
                                divIntent += '</div>';
                            divIntent += '</div>';
                        divIntent += '</li>';

                        var ul = $('#index-banner-'+intentId).find('ul');
                        ul.append(divIntent);
                        
                        $('.collapsible').collapsible({
                            accordion : false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
                        });
                        
                        var creditCount = $('#index-banner-'+intentId).siblings('.accordion-section-title').find('p').find('.credit-count').text();
                        creditCount = parseInt(creditCount) + 1;
                        $('#index-banner-'+intentId).siblings('.accordion-section-title').find('p').find('.credit-count').text(creditCount);

                        $('#customStrategyName').val('');
                        $('#customStrategyDescription').val('');
                        $('#add_custom_strategies').modal('toggle');
                          
                        var elem = $('.custom-actionmenuStrategy-'+strategyId);//$(this);
                        elem.qtip({ 
                            prerender: true,    
                            content: '<ul class="'+elem.next().attr("class")+'">' + elem.siblings('.strategy-action-nav').html() + '</ul>',
                            position: {
                                my: 'center right',
                                at: 'center left'
                            },
                            show: {
                                event: 'click',
                                solo:true 
                            },
                            hide: {
                                event: 'click'
                            },
                            style: {
                                classes: 'action-menu-popup',
                            }
                            
                        });
                    
                        $('.custom-actionmenuStrategy-'+strategyId).on("click",function(e){
                            e.stopPropagation();
                        });
                            

                    //  $(document.body).on("click", ".applyStrategy", function(e){
                        $(".new-custom-added .applyStrategy").on("click", function(e){
                            if(!$(this).hasClass("applied")){                   
                                var strategyDiv = $(".collapsible-header[data-strategyid="+strategyId+"]");
                                
                                var data = {};
                                data["strategy_id"] = strategyId;
                                data["status"] = 'applicable';
                                data["update_flag"] = 'status';
                                plaque.elements.updateStrategyStatus(buildingID, data);
                                
                                $(this).addClass('applied');
                                
                                var strategyLi = strategyDiv.closest('li');
                                strategyLi.removeClass('not-applicable').removeClass('not-added').removeClass('attempted').removeClass('added').addClass('applicable');
                                
                                strategyDiv.find('.strategy-action-menu').find('.strategy-action-nav').find('.applyStrategy').addClass('applied');
                                strategyDiv.find('.strategy-action-menu').find('.strategy-action-nav').find('.notApplyStrategy').removeClass('notApplied');
                                strategyDiv.find('.strategy-action-menu').find('.strategy-action-nav').find('.unDecidedStrategy').removeClass('undecided');
                                
                                var actionMenu = strategyDiv.find('.strategy-action-menu').find('.hover-apply-strategy-content').find('.actionmenuStrategy');
                                var actionQtipID = actionMenu.attr('aria-describedby');
                                $('#'+actionQtipID).find('.strategy-action-nav').find('.applyStrategy').addClass('applied');
                                $('#'+actionQtipID).find('.strategy-action-nav').find('.notApplyStrategy').removeClass('notApplied');
                                $('#'+actionQtipID).find('.strategy-action-nav').find('.unDecidedStrategy').removeClass('undecided');
                                
                                strategyDiv.find('.hover-apply-strategy').find('.hover-apply-strategy-content').find('.applyStrategy').addClass('applied');
                                strategyDiv.find('.hover-apply-strategy').find('.hover-apply-strategy-content').find('.notApplyStrategy').removeClass('notApplied');

                                if(!strategyLi.is('.strategy-custom','.custom-added')){
                                    var strategyDiv = strategyLi.children('.collapsible-body').children('.default-strategy-'+strategyId);
                                    var strategyQuestionnaire = strategyDiv.siblings('.questionnaire-strategy-'+strategyId);
                                    strategyDiv.hide();
                                    strategyQuestionnaire.empty();
                                    // Begin loading questionnaire
                                    plaque.elements.questionBox(strategyQuestionnaire, intentId, strategyId, strategyQuestions[strategyId], strategyQuestions[strategyId]['firstquestion'],'','');
                                    strategyQuestionnaire.show();
                                    
                                    var availableRequiredStrategy = plaque.elements.findRequiredStrategy(strategyId,requiredStrategies[intentId])[0];
                                    if(availableRequiredStrategy){
                                        if(availableRequiredStrategy.strategyid == strategyId){
                                            appliedRequiredStrategies[intentId].push({'strategyid':strategyId});
                                            plaque.elements.setRequiredProgress(intentId,requiredStrategies,appliedRequiredStrategies);
                                        }
                                    }
                                }
                                // refreshing filter data
                                if($("#intent-filter span.filter-selected-text").text()=="No"){
                                    strategyLi.addClass('filter-applied');
                                }
                            }
                            e.stopPropagation();
                        });

                    //  $(document.body).on("click", ".custom-added .notApplyStrategy", function(e){
                        $(".new-custom-added .notApplyStrategy").on("click", function(e){
                            
                            if(!$(this).hasClass("notApplied")){
                                var strategyDiv = $(".collapsible-header[data-strategyid="+strategyId+"]");
                                var data = {};
                                data["strategy_id"] = strategyId;
                                data["status"] = 'not-applicable';
                                data["update_flag"] = 'status';
                                plaque.elements.updateStrategyStatus(buildingID, data);
                                                    
                                var questions = $.makeArray(strategyQuestions[strategyId]);
                                $.each(questions, function(i, question) {
                                    if(typeof question != 'undefined'){
                                        plaque.elements.submitAnswer(buildingID, question['qid'], '');
                                    }
                                });
                                
                                var strategyLi = strategyDiv.closest('li');
                                strategyLi.removeClass('applicable').removeClass('attempted').removeClass('added').removeClass('not-added').addClass('not-applicable');
                                
                                strategyDiv.find('.strategy-action-menu').find('.strategy-action-nav').find('.applyStrategy').removeClass('applied');
                                strategyDiv.find('.strategy-action-menu').find('.strategy-action-nav').find('.notApplyStrategy').addClass('notApplied');
                                strategyDiv.find('.strategy-action-menu').find('.strategy-action-nav').find('.unDecidedStrategy').removeClass('undecided');
                                
                                var actionMenu = strategyDiv.find('.strategy-action-menu').find('.hover-apply-strategy-content').find('.actionmenuStrategy');                   
                                var actionQtipID = actionMenu.attr('aria-describedby');
                                $('#'+actionQtipID).find('.strategy-action-nav').find('.applyStrategy').removeClass('applied');
                                $('#'+actionQtipID).find('.strategy-action-nav').find('.notApplyStrategy').addClass('notApplied');
                                $('#'+actionQtipID).find('.strategy-action-nav').find('.unDecidedStrategy').removeClass('undecided');
                                
                                strategyDiv.find('.hover-apply-strategy').find('.hover-apply-strategy-content').find('.applyStrategy').removeClass('applied');
                                strategyDiv.find('.hover-apply-strategy').find('.hover-apply-strategy-content').find('.notApplyStrategy').addClass('notApplied');   
                                
                                // refreshing filter data
                                if($("#intent-filter span.filter-selected-text").text()=="Yes" ||
                                    $("#intent-filter span.filter-selected-text").text()=="All"){
                                    strategyLi.addClass('filter-applied');
                                }
                                
                            }
                            e.stopPropagation();
                        });

                        $(".new-custom-added .starStrategy").on('click', function(e) {
                            
                            var strategyDiv = $(".collapsible-header[data-strategyid="+strategyId+"]");
                            
                            var data = {};
                            data["strategy_id"] = strategyId;
                            
                            if($(this).hasClass('favorite')){
                                data["favorite"] = 'False';
                                $(this).removeClass('favorite')
                                strategyDiv.find('.strategy-action-menu').find('.strategy-action-nav').find('.starStrategy').removeClass('favorite');
                                var actionMenu = strategyDiv.find('.strategy-action-menu').find('.hover-apply-strategy-content').find('.actionmenuStrategy');
                                var actionQtipID = actionMenu.attr('aria-describedby');
                                $('#'+actionQtipID).find('.strategy-action-nav').find('.starStrategy').removeClass('favorite');
                                strategyDiv.find('.hover-apply-strategy').find('.hover-apply-strategy-content').find('.starStrategy').removeClass('favorite');
                            }else{
                                data["favorite"] = 'True';
                                $(this).addClass('favorite')
                                strategyDiv.find('.strategy-action-menu').find('.strategy-action-nav').find('.starStrategy').addClass('favorite');
                                var actionMenu = strategyDiv.find('.strategy-action-menu').find('.hover-apply-strategy-content').find('.actionmenuStrategy');
                                var actionQtipID = actionMenu.attr('aria-describedby');
                                $('#'+actionQtipID).find('.strategy-action-nav').find('.starStrategy').addClass('favorite');
                                strategyDiv.find('.hover-apply-strategy').find('.hover-apply-strategy-content').find('.starStrategy').addClass('favorite');
                            }
                            
                            data["update_flag"] = 'favorite';
                            plaque.elements.updateStrategyStatus(buildingID, data);
                            
                            e.stopPropagation();
                        });

                    });
                    // add custom strategy 

                    // delete custom strategy starts
                    $(document.body).off('click', '#delete-strategy').on('click', '#delete-strategy', function(event) {
                        var strategyId = $(this).data('strategyid');
                        var intentId = $(this).data('intentid');
                        plaque.elements.deleteStrategy(buildingID,intentId,strategyId);
                        
                        $(this).closest('li.strategy-custom').remove();
                        
                        var creditCount = $('#index-banner-'+intentId).siblings('.accordion-section-title').find('p').find('.credit-count').text();
                        creditCount = parseInt(creditCount) - 1;
                        $('#index-banner-'+intentId).siblings('.accordion-section-title').find('p').find('.credit-count').text(creditCount);
                        
                    });
                    // delete custom strategy ends

                    plaque.elements.getProjectScore();
                }
            },
            // show Intents ends

            // get Intents starts
            getIntents: function(){
                var buildingID = plaque.elements.getQueryStringParams('LEED');
                $.ajax({
                    async: false,
                    type: "GET",
                    url: "/elements/intents/LEED:"+ buildingID,
                    success: function(data) {
                        var status =  data.status;
                        var result = data.result;    

                        if(status == 'Success'){
                            var intents = result.intents;
                            var categoryList = result.categoryList;
                            var strategyQuestions = [];
                            var answers = [];
                            var credits = {};
                            var categories = [];
                            var appliedRequiredStrategies = {};
                            var requiredStrategies = {};
                            var categoryCustom = [];
                            var categoryCustomCounter = 0;

                            $.each(intents, function(i, intent) {
                                if(!credits[intent.category]){
                                    credits[intent.category] = [];
                                }
                                credits[intent.category].push({"intent":intent});
                                categories[intent.category] = plaque.elements.getCategoryName(intent.category, categoryList);
                            });

                            $.each(credits, function(i, categoryIntents){
                                var divIntent = '';
                                var category = {};
                                category['id'] = i;
                                category['name'] = categories[i];

                                categoryCustom[categoryCustomCounter] = i;
                                categoryCustomCounter+=1;
                                
                                $('#categoryList-dropdown ul.dropdown-menu').append('<li data-category-value="'+category['id']+'">'+category['name']+'</li>');
                                                                               
                                divIntent += '<div class="cataegory-div parent-accordion-section" id="section-'+category['id']+'">';
                                    divIntent += '<div class="parent-accordion-section-title" data-href="#parent-section-'+category['id']+'">';
                                        divIntent += '<p>'+category['name']+'</p>';
                                        divIntent += '<img alt="" src="/static/dashboard/img/leed/'+category['id']+'-border.png">';
                                    divIntent += '</div>';
                                    
                                    divIntent += '<div class="parent-accordion-section-content" id="parent-section-'+category['id']+'">';
                                        $.each(categoryIntents, function(i, intents) {
                                            intent = intents.intent;                                            
                                            requiredStrategies[intent.id] = [];
                                            appliedRequiredStrategies[intent.id] = [];
                                            
                                            if(category['id'] == categoryCustom[0]/*'lt'*/){
                                                $('#intentList-dropdown ul.dropdown-menu').append('<li data-intent-value="'+intent.id+'">'+intent.name+'</li>');
                                            }                                            
                                            divIntent += '<div class="intent-div section accordion-section" id="overview-'+intent.category+'">';
                                                divIntent += '<div class="title-description">';
                                                    divIntent += '<p class="intent-title">'+intent.name+'</p>';
                                                    divIntent += '<p class="intent-description">'+intent.description+'</p>';
                                                    divIntent += '<div class="circle" id="intent-required-counter-'+intent.id+'">';
                                                        divIntent += '<strong></strong>';
                                                        //divIntent += '<span class="intent-required">Required</span>'
                                                    divIntent += '</div>';
                                                divIntent += '</div>';
                                                divIntent += '<div class="accordion-section-title" data-href="#index-banner-'+intent.id+'" data-intentid="'+intent.id+'"><p><i class="arrow-down"></i> <span class="credit-count">'+ intent.numberofstrategies +'</span> Strategies</p></div>';
                                                divIntent += '<div class="section accordion-section-content index-banner" id="index-banner-'+intent.id+'">';
                                                    divIntent += '<ul class="collapsible popout" data-collapsible="accordion" style="width: 100%;" data-intentid="'+intent.id+'">';
                                                       
                                                    divIntent += '</ul>';
                                                divIntent += '</div>';
                                            divIntent += '</div>';
                                            
                                        });
                            
                                    divIntent += '</div>';
                                divIntent += '</div>';              
                                $('#strategy_content').append(divIntent);
                        //$('.data_input_stratergy_nav').css('left', $('#strategy_content').offset().left);
                        //$('.header_strategies').css('left', $('#strategy_content').offset().left);
                            //    window.plaqueNav.removeStrategiesLoadingMessage(100);
                            });

                            // new changes : select dropdown issue          
                            $("#categoryList-dropdown ul.dropdown-menu li:first-child").addClass("selected-category");
                            $("#intentList-dropdown ul.dropdown-menu li:first-child").addClass("selected-intent");

                            $("#categoryList-dropdown .category-selected-text").text($("#categoryList-dropdown ul.dropdown-menu li:first-child").text());
                            $("#intentList-dropdown .intent-selected-text").text($("#intentList-dropdown ul.dropdown-menu li:first-child").text());         

                            $(document.body).on('click', '#categoryList-dropdown ul.dropdown-menu li', function() {
                                $(this).siblings().removeClass("selected-category");
                                $(this).addClass("selected-category");
                                
                                $(this).parents("#categoryList-dropdown").find('.category-selected-text').html($(this).text());
                            });

                            $(document.body).on('click', '#intentList-dropdown ul.dropdown-menu li', function() {
                                $(this).siblings().removeClass("selected-intent");
                                $(this).addClass("selected-intent");
                                
                                $(this).parents("#intentList-dropdown").find('.intent-selected-text').html($(this).text());
                            });
    
                            $(document.body).on('click', '#categoryList-dropdown ul.dropdown-menu li', function() {
                                
                                $('#add_custom_strategies #intentList-dropdown').find('li').remove();
                                
                                var catId = $(this).data("category-value");
                                $.each(credits, function(i, categoryIntents){               
                                    var category = {};
                                    category['id'] = i;
                                    category['name'] = categories[i];
                                    if(category['id'] != catId) return true;
                                    $.each(categoryIntents, function(i, intents) {
                                        var intent = intents.intent;
                                        $('#intentList-dropdown ul.dropdown-menu').append('<li data-intent-value="'+intent.id+'">'+intent.name+'</li>');
                                    });

                                    $("#intentList-dropdown").find('.intent-selected-text').html(categoryIntents[0]["intent"].name);
                                    $("#intentList-dropdown ul.dropdown-menu li:first-child").addClass("selected-intent");
                                });
                            });
                            // new changes: select dropdown issue

                            $(document.body).on('click','#customStrategyName', function(event) {    
                                $("#customStrategyName").removeClass("error");
                                $("#error-customStrategyName").slideUp(500)

                            });

                            $(document.body).on('click','#customStrategyDescription', function(event) { 
                                $("#customStrategyDescription").removeClass("error");
                                $("#error-customStrategyDescription").slideUp(500)

                            });
                            
                            // add custom strategy
                            $(document.body).on('click','#addCustomStrategy', function(event) { 
                                var intentId = $("#add_custom_strategies #intentList-dropdown .selected-intent").data("intent-value");
                                var categoryId = $("#add_custom_strategies #categoryList-dropdown .selected-category").data("category-value");
                                var strategyDesc = $.trim($('#customStrategyDescription').val());
                                var strategyName = $.trim($('#customStrategyName').val());

                                var emptyFieldsFlag = false;

                                if(strategyName ===''){
                                    emptyFieldsFlag = true;
                                    $("#customStrategyName").addClass("error");
                                    $("#error-customStrategyName").addClass("error").slideDown(500);//show();
                                }

                                if(strategyDesc ===''){
                                    emptyFieldsFlag = true;
                                    $("#customStrategyDescription").addClass("error");
                                    $("#error-customStrategyDescription").addClass("error").slideDown(500);//.show();
                                }

                                if(emptyFieldsFlag)
                                    return;             
                            
                                var customStrategy = {};
                                customStrategy["title"]        = strategyName;
                                customStrategy["intent_id"]    = intentId;
                                customStrategy["description"]  = strategyDesc;
                                customStrategy["file"]       = '';

                                var strategyId ="";
                                $.when(plaque.elements.addCustomStrategies(buildingID,customStrategy))
                                  .done(function( data ) {
                                      var strategy = data.strategy;
                                      strategyId = strategy.id;  
                                });

                                var divIntent = '';
                                divIntent += '<li class="custom-added strategy-custom new-custom-added">';
                                    divIntent += '<div class="collapsible-header" data-strategyid="'+strategyId+'">';
                                        divIntent += '<div class="strategy-counter"><div class="strategy-counter-content"><i class="fa fa-asterisk"></i></div></div>';
                                        divIntent += '<div class="strategy-name">'+strategyName+'</div>';
                                        divIntent += '<div class="hover-apply-strategy">';
                                            divIntent += '<div class="hover-apply-strategy-content">';
                                                divIntent += '<a class="waves-effect waves-light applyStrategy applied" data-intentid="'+intentId+'" data-strategyid="'+strategyId+'"><span class="yes-apply-circle">YES</span></a>';
                                                divIntent += '<a class="waves-effect waves-light notApplyStrategy" data-intentid="'+intentId+'" data-strategyid="'+strategyId+'"><span class="no-apply-circle">NO</span></a>';
                                                divIntent += '<a class="waves-effect waves-light fa fa-file-text-o documentStrategy" data-intentid="'+intentId+'" data-strategyid="'+strategyId+'"></a>';
                                                divIntent += '<a class="waves-effect waves-light fa fa-star-o starStrategy" data-intentid="'+intentId+'" data-strategyid="'+strategyId+'"></a>';
                                            divIntent += '</div>';
                                        divIntent += '</div>';
                                        divIntent += '<div class="strategy-action-menu">';
                                            divIntent += '<div class="hover-apply-strategy-content">';
                                                divIntent += '<div class="waves-effect waves-light actionmenuStrategy custom-actionmenuStrategy-'+strategyId+'" data-intentid="'+intentId+'" data-strategyid="'+strategyId+'"><i class="icon-ellipsis-horizontal icon-large"></i></div>';
                                                divIntent += '<ul class="strategy-action-nav pop-menu-'+categoryId+'" style="display:none;">';
                                                    divIntent += '<li class="first-item">';
                                                        divIntent += '<div class="apply-content">';
                                                            divIntent += '<span>Doing this credit?</span>';
                                                            divIntent += '<a class="waves-effect waves-light applyStrategy applied" data-intentid="'+intentId+'" data-strategyid="'+strategyId+'"><span class="yes-apply-circle">YES</span></a>';
                                                            divIntent += '<a class="waves-effect waves-light notApplyStrategy" data-intentid="'+intentId+'" data-strategyid="'+strategyId+'" ><span class="no-apply-circle">NO</span></a>';
                                                            divIntent += '<a class="waves-effect waves-light unDecidedStrategy" data-intentid="'+intentId+'" data-strategyid="'+strategyId+'"><span class="undecided-circle">Maybe</span></a>';
                                                        divIntent += '</div>';
                                                    divIntent += '</li>';
                                                    divIntent += '<li class="navDocumentStrategy">';
                                                        divIntent += '<a class="waves-effect waves-light action-item fa fa-file-text-o documentStrategy" data-intentid="'+intentId+'" data-strategyid="'+strategyId+'"></a><div class="action-text">Add Document</div>';
                                                    divIntent += '</li>';
                                                    divIntent += '<li class="navStarStrategy">';
                                                        divIntent += '<a class="waves-effect waves-light action-item fa fa-star-o starStrategy" data-intentid="'+intentId+'" data-strategyid="'+strategyId+'"></a><div class="action-text">Star</div>';
                                                    divIntent += '</li>';
                                                divIntent += '</ul>';
                                            divIntent += '</div>';
                                        divIntent += '</div>';
                                    divIntent += '</div>';
                                    divIntent += '<div class="collapsible-body">';
                                        divIntent += '<div class="questionnaire strategy-custom default-strategy-'+strategyId+'">'
                                            divIntent += '<div>';
                                                divIntent += '<p class="custom-strategy-description">Title</p>';
                                            divIntent += '</div>';
                                            divIntent += '<div class="button-group">';
                                                divIntent += '<div class="controls">';
                                                    divIntent += '<input value="'+strategyName+'" placeholder="Strategy title" type="text" data-intentid="'+intentId+'" data-strategyid="'+strategyId+'" class="questiontext span5">';
                                                divIntent += '</div>';
                                            divIntent += '</div>';
                                            divIntent += '<div>';
                                                divIntent += '<p class="custom-strategy-description">Description</p>';
                                            divIntent += '</div>';
                                            divIntent += '<div class="button-group">';
                                                divIntent += '<div class="controls">';
                                                    divIntent += '<textarea placeholder="Description" data-intentid="'+intentId+'" data-strategyid="'+strategyId+'" class="questiontextarea span5">'+strategyDesc+'</textarea>';
                                                divIntent += '</div>';
                                            divIntent += '</div>';
                                            divIntent += '<div>';
                                                divIntent += '<p class="custom-strategy-description">Document</p>';
                                            divIntent += '</div>';
                                            
                                            divIntent += '<div class="button-group">';

                                                divIntent += '<div class="elements_questionnaire_upload" id="elements_questionnaire_upload-' + strategyId + '" data-intentid="'+intentId+'" data-strategyid="' + strategyId + '">';
                                                    divIntent += '<span class="btn btn-success fileinput-button">';
                                                        divIntent += '<i class="fa fa-upload"></i><span>Add Document</span>';
                                                        divIntent += '<input class="elements_file_data_new upload" name="elements_file_data_new" data-intentid="'+intentId+'" data-strategyid="' + strategyId + '" type="file" name="files[]" multiple="">';
                                                    divIntent += '</span>';
                                                divIntent += '</div>';

                                            divIntent += '</div>';
                                            divIntent += '<div class="button-group deletestrategy">';
                                                divIntent += '<a class="waves-effect waves-light btn btn-red" data-intentid="'+intentId+'" data-strategyid="'+strategyId+'" id="delete-strategy">Delete</a>';
                                            divIntent += '</div>';
                                        divIntent += '</div>';
                                    divIntent += '</div>';
                                divIntent += '</li>';

                                var ul = $('#index-banner-'+intentId).find('ul');
                                ul.append(divIntent);
                                
                                $('.collapsible').collapsible({
                                    accordion : false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
                                });
                                
                                var creditCount = $('#index-banner-'+intentId).siblings('.accordion-section-title').find('p').find('.credit-count').text();
                                creditCount = parseInt(creditCount) + 1;
                                $('#index-banner-'+intentId).siblings('.accordion-section-title').find('p').find('.credit-count').text(creditCount);

                                $('#customStrategyName').val('');
                                $('#customStrategyDescription').val('');
                                $('#add_custom_strategies').modal('toggle');
                                  
                                var elem = $('.custom-actionmenuStrategy-'+strategyId);//$(this);
                                elem.qtip({ 
                                    prerender: true,    
                                    content: '<ul class="'+elem.next().attr("class")+'">' + elem.siblings('.strategy-action-nav').html() + '</ul>',
                                    position: {
                                        my: 'center right',
                                        at: 'center left'
                                    },
                                    show: {
                                        event: 'click',
                                        solo:true 
                                    },
                                    hide: {
                                        event: 'click'
                                    },
                                    style: {
                                        classes: 'action-menu-popup',
                                    }
                                    
                                });
                            
                                $('.custom-actionmenuStrategy-'+strategyId).on("click",function(e){
                                    e.stopPropagation();
                                });
                                    

                            //  $(document.body).on("click", ".applyStrategy", function(e){
                                $(".new-custom-added .applyStrategy").on("click", function(e){
                                    if(!$(this).hasClass("applied")){                   
                                        var strategyDiv = $(".collapsible-header[data-strategyid="+strategyId+"]");
                                        
                                        var data = {};
                                        data["strategy_id"] = strategyId;
                                        data["status"] = 'applicable';
                                        data["update_flag"] = 'status';
                                        plaque.elements.updateStrategyStatus(buildingID, data);
                                        
                                        $(this).addClass('applied');
                                        
                                        var strategyLi = strategyDiv.closest('li');
                                        strategyLi.removeClass('not-applicable').removeClass('not-added').removeClass('attempted').removeClass('added').addClass('applicable');
                                        
                                        strategyDiv.find('.strategy-action-menu').find('.strategy-action-nav').find('.applyStrategy').addClass('applied');
                                        strategyDiv.find('.strategy-action-menu').find('.strategy-action-nav').find('.notApplyStrategy').removeClass('notApplied');
                                        strategyDiv.find('.strategy-action-menu').find('.strategy-action-nav').find('.unDecidedStrategy').removeClass('undecided');
                                        
                                        var actionMenu = strategyDiv.find('.strategy-action-menu').find('.hover-apply-strategy-content').find('.actionmenuStrategy');
                                        var actionQtipID = actionMenu.attr('aria-describedby');
                                        $('#'+actionQtipID).find('.strategy-action-nav').find('.applyStrategy').addClass('applied');
                                        $('#'+actionQtipID).find('.strategy-action-nav').find('.notApplyStrategy').removeClass('notApplied');
                                        $('#'+actionQtipID).find('.strategy-action-nav').find('.unDecidedStrategy').removeClass('undecided');
                                        
                                        strategyDiv.find('.hover-apply-strategy').find('.hover-apply-strategy-content').find('.applyStrategy').addClass('applied');
                                        strategyDiv.find('.hover-apply-strategy').find('.hover-apply-strategy-content').find('.notApplyStrategy').removeClass('notApplied');

                                        if(!strategyLi.is('.strategy-custom','.custom-added')){
                                            var strategyDiv = strategyLi.children('.collapsible-body').children('.default-strategy-'+strategyId);
                                            var strategyQuestionnaire = strategyDiv.siblings('.questionnaire-strategy-'+strategyId);
                                            strategyDiv.hide();
                                            strategyQuestionnaire.empty();
                                            // Begin loading questionnaire
                                            plaque.elements.questionBox(strategyQuestionnaire, intentId, strategyId, strategyQuestions[strategyId], strategyQuestions[strategyId]['firstquestion'],'','');
                                            strategyQuestionnaire.show();
                                            
                                            var availableRequiredStrategy = plaque.elements.findRequiredStrategy(strategyId,requiredStrategies[intentId])[0];
                                            if(availableRequiredStrategy){
                                                if(availableRequiredStrategy.strategyid == strategyId){
                                                    appliedRequiredStrategies[intentId].push({'strategyid':strategyId});
                                                    plaque.elements.setRequiredProgress(intentId,requiredStrategies,appliedRequiredStrategies);
                                                }
                                            }
                                        }
                                        // refreshing filter data
                                        if($("#intent-filter span.filter-selected-text").text()=="No"){
                                            strategyLi.addClass('filter-applied');
                                        }
                                    }
                                    e.stopPropagation();
                                });

                            //  $(document.body).on("click", ".custom-added .notApplyStrategy", function(e){
                                $(".new-custom-added .notApplyStrategy").on("click", function(e){
                                    
                                    if(!$(this).hasClass("notApplied")){
                                        var strategyDiv = $(".collapsible-header[data-strategyid="+strategyId+"]");
                                        var data = {};
                                        data["strategy_id"] = strategyId;
                                        data["status"] = 'not-applicable';
                                        data["update_flag"] = 'status';
                                        plaque.elements.updateStrategyStatus(buildingID, data);
                                                            
                                        var questions = $.makeArray(strategyQuestions[strategyId]);
                                        $.each(questions, function(i, question) {
                                            if(typeof question != 'undefined'){
                                                plaque.elements.submitAnswer(buildingID, question['qid'], '');
                                            }
                                        });
                                        
                                        var strategyLi = strategyDiv.closest('li');
                                        strategyLi.removeClass('applicable').removeClass('attempted').removeClass('added').removeClass('not-added').addClass('not-applicable');
                                        
                                        strategyDiv.find('.strategy-action-menu').find('.strategy-action-nav').find('.applyStrategy').removeClass('applied');
                                        strategyDiv.find('.strategy-action-menu').find('.strategy-action-nav').find('.notApplyStrategy').addClass('notApplied');
                                        strategyDiv.find('.strategy-action-menu').find('.strategy-action-nav').find('.unDecidedStrategy').removeClass('undecided');
                                        
                                        var actionMenu = strategyDiv.find('.strategy-action-menu').find('.hover-apply-strategy-content').find('.actionmenuStrategy');                   
                                        var actionQtipID = actionMenu.attr('aria-describedby');
                                        $('#'+actionQtipID).find('.strategy-action-nav').find('.applyStrategy').removeClass('applied');
                                        $('#'+actionQtipID).find('.strategy-action-nav').find('.notApplyStrategy').addClass('notApplied');
                                        $('#'+actionQtipID).find('.strategy-action-nav').find('.unDecidedStrategy').removeClass('undecided');
                                        
                                        strategyDiv.find('.hover-apply-strategy').find('.hover-apply-strategy-content').find('.applyStrategy').removeClass('applied');
                                        strategyDiv.find('.hover-apply-strategy').find('.hover-apply-strategy-content').find('.notApplyStrategy').addClass('notApplied');   
                                        
                                        // refreshing filter data
                                        if($("#intent-filter span.filter-selected-text").text()=="Yes" ||
                                            $("#intent-filter span.filter-selected-text").text()=="All"){
                                            strategyLi.addClass('filter-applied');
                                        }
                                        
                                    }
                                    e.stopPropagation();
                                });

                                $(".new-custom-added .starStrategy").on('click', function(e) {
                                    
                                    var strategyDiv = $(".collapsible-header[data-strategyid="+strategyId+"]");
                                    
                                    var data = {};
                                    data["strategy_id"] = strategyId;
                                    
                                    if($(this).hasClass('favorite')){
                                        data["favorite"] = 'False';
                                        $(this).removeClass('favorite')
                                        strategyDiv.find('.strategy-action-menu').find('.strategy-action-nav').find('.starStrategy').removeClass('favorite');
                                        var actionMenu = strategyDiv.find('.strategy-action-menu').find('.hover-apply-strategy-content').find('.actionmenuStrategy');
                                        var actionQtipID = actionMenu.attr('aria-describedby');
                                        $('#'+actionQtipID).find('.strategy-action-nav').find('.starStrategy').removeClass('favorite');
                                        strategyDiv.find('.hover-apply-strategy').find('.hover-apply-strategy-content').find('.starStrategy').removeClass('favorite');
                                    }else{
                                        data["favorite"] = 'True';
                                        $(this).addClass('favorite')
                                        strategyDiv.find('.strategy-action-menu').find('.strategy-action-nav').find('.starStrategy').addClass('favorite');
                                        var actionMenu = strategyDiv.find('.strategy-action-menu').find('.hover-apply-strategy-content').find('.actionmenuStrategy');
                                        var actionQtipID = actionMenu.attr('aria-describedby');
                                        $('#'+actionQtipID).find('.strategy-action-nav').find('.starStrategy').addClass('favorite');
                                        strategyDiv.find('.hover-apply-strategy').find('.hover-apply-strategy-content').find('.starStrategy').addClass('favorite');
                                    }
                                    
                                    data["update_flag"] = 'favorite';
                                    plaque.elements.updateStrategyStatus(buildingID, data);
                                    
                                    e.stopPropagation();
                                });

                            });
                            // add custom strategy 

                            // delete custom strategy starts
                            $(document.body).off('click', '#delete-strategy').on('click', '#delete-strategy', function(event) {
                                var strategyId = $(this).data('strategyid');
                                var intentId = $(this).data('intentid');
                                plaque.elements.deleteStrategy(buildingID,intentId,strategyId);
                                
                                $(this).closest('li.strategy-custom').remove();
                                
                                var creditCount = $('#index-banner-'+intentId).siblings('.accordion-section-title').find('p').find('.credit-count').text();
                                creditCount = parseInt(creditCount) - 1;
                                $('#index-banner-'+intentId).siblings('.accordion-section-title').find('p').find('.credit-count').text(creditCount);
                                
                            });
                            // delete custom strategy ends

                            plaque.elements.getProjectScore();
                        }
                    },
                    error:function(){
                        // failed request; give feedback to user
                        $('#strategy_content').html('<p class="error"><strong>Oops!</strong> Try again in a few moments.</p>');
                        //$('.data_input_stratergy_nav').css('left', $('#strategy_content').offset().left);
                        //$('.header_strategies').css('left', $('#strategy_content').offset().left);
                        //window.plaqueNav.removeStrategiesLoadingMessage(1500);
                    }
                }); 
            },
            // get Intents ends
            
            // get strategies of Intent starts
            getStrategiesOfIntent: function(intentId, categoryId){
                var buildingID = plaque.elements.getQueryStringParams('LEED');
                intent.id = intentId;
                $.ajax({
                    async: false,
                    type: "GET",
                    url: "/elements/strategies/LEED:"+ buildingID+"/INTENTID:"+intentId,
                    success: function(data) {
                        var status =  data.status;                        
                        if(status == 'Success'){
                            var strategies = data.strategies;
                        //  var strategyQuestions = [];
                            var answers = [];
                            var credits = {};
                            var categories = [];
                            var appliedRequiredStrategies = {};
                            var requiredStrategies = {};

                            var divIntent = "";
                            var strategyCounter = 1;

                            $.each(strategies, function(i, strategy) {
                                strategyQuestions[strategy.id] = [];
                                strategyQuestions[strategy.id]['details'] = strategy;
                                divIntent += '<li class="' + strategy.status + ' strategy-' + strategy.strategytype+'">';
                                if(strategy.strategytype == 'system' || strategy.strategytype == 'custom'){
                                    if(strategy.required == 'required'){
                                    //    requiredStrategies[intentId].push({'strategyid':strategy.id});
                                        
                                        if(strategy.status != 'not-applicable' && strategy.status != 'undecided'){
                                    //        appliedRequiredStrategies[intentId].push({'strategyid':strategy.id});
                                        }

                                        divIntent += '<span class="strategy-required">Required</span>';
                                    }
                                    divIntent += '<div class="collapsible-header" data-status="'+strategy.status+'" data-intentid="'+intent.id+'" data-strategyid="'+strategy.id+'">';
                                    if(strategy.strategytype == 'system'){
                                        divIntent += '<div class="strategy-counter"><div class="strategy-counter-content">'+strategyCounter+'.</div></div>';
                                    }else{
                                        divIntent += '<div class="strategy-counter"><div class="strategy-counter-content"><i class="fa fa-asterisk"></i></div></div>';
                                    }
                                    strategyCounter += 1;
                                    var applicable = '';
                                    var notapplicable = '';
                                    var documented = '';
                                    var favorite = '';
                                    var undecided = '';
                                    if(strategy.status != 'undecided'){
                                        if(strategy.status != 'not-applicable'){
                                            applicable = 'applied';
                                        }else{
                                            notapplicable = 'notApplied';
                                        }
                                    }else{
                                        undecided = 'undecided';
                                    }
                                    if(strategy.status == 'attempted'){
                                        documented = 'documented';
                                    }
                                    if(strategy.favorite){
                                        favorite = 'favorite';
                                    }
                                    //divIntent += '<div class="hover-select-strategy"><div class="hover-select-strategy-content"><input type="checkbox" data-intentid="'+intent.id+'" data-strategyid="'+strategy.id+'" id="strategy_'+strategy.id+'" class="multiCheckStrategyXYZ" value=""></div></div>';
                                    divIntent += '<div class="strategy-name">'+strategy.name+'</div>';
                                        divIntent += '<div class="hover-apply-strategy">';
                                            divIntent += '<div class="hover-apply-strategy-content">';
                                                divIntent += '<a class="waves-effect waves-light applyStrategy '+applicable+'" data-intentid="'+intent.id+'" data-strategyid="'+strategy.id+'"><span class="yes-apply-circle">YES</span></a>';
                                                divIntent += '<a class="waves-effect waves-light notApplyStrategy '+notapplicable+'" data-intentid="'+intent.id+'" data-strategyid="'+strategy.id+'"><span class="no-apply-circle">NO</span></a>';
                                                divIntent += '<a class="waves-effect waves-light fa fa-file-text-o documentStrategy '+documented+'" data-intentid="'+intent.id+'" data-strategyid="'+strategy.id+'"></a>';
                                                divIntent += '<a class="waves-effect waves-light fa fa-star-o starStrategy '+favorite+'" data-intentid="'+intent.id+'" data-strategyid="'+strategy.id+'"></a>';
                                            divIntent += '</div>';
                                        divIntent += '</div>';
                                        divIntent += '<div class="strategy-action-menu">';
                                            divIntent += '<div class="hover-apply-strategy-content">';
                                                divIntent += '<div class="waves-effect waves-light actionmenuStrategy" data-intentid="'+intent.id+'" data-strategyid="'+strategy.id+'"><i class="icon-ellipsis-horizontal icon-large"></i></div>';
                                                divIntent += '<ul class="strategy-action-nav pop-menu-'+categoryId+'" style="display:none;">';
                                                    divIntent += '<li class="first-item">';
                                                        divIntent += '<div class="apply-content">';
                                                            divIntent += '<span>Doing this credit?</span>';
                                                            divIntent += '<a class="waves-effect waves-light applyStrategy '+applicable+'" data-intentid="'+intent.id+'" data-strategyid="'+strategy.id+'"><span class="yes-apply-circle">YES</span></a>';
                                                            divIntent += '<a class="waves-effect waves-light notApplyStrategy '+notapplicable+'" data-intentid="'+intent.id+'" data-strategyid="'+strategy.id+'"><span class="no-apply-circle">NO</span></a>';
                                                            divIntent += '<a class="waves-effect waves-light unDecidedStrategy '+undecided+'" data-intentid="'+intent.id+'" data-strategyid="'+strategy.id+'"><span class="undecided-circle">Maybe</span></a>';
                                                        divIntent += '</div>';
                                                    divIntent += '</li>';
                                                    divIntent += '<li class="navDocumentStrategy">';
                                                        divIntent += '<a class="waves-effect waves-light action-item fa fa-file-text-o documentStrategy '+documented+'" data-intentid="'+intent.id+'" data-strategyid="'+strategy.id+'"></a><div class="action-text">Add Document</div>';
                                                    divIntent += '</li>';
                                                    divIntent += '<li class="navStarStrategy">';
                                                        divIntent += '<a class="waves-effect waves-light action-item fa fa-star-o starStrategy '+favorite+'" data-intentid="'+intent.id+'" data-strategyid="'+strategy.id+'"></a><div class="action-text">Star</div>';
                                                    divIntent += '</li>';
                                                divIntent += '</ul>';
                                            divIntent += '</div>';
                                        divIntent += '</div>';
                                    divIntent += '</div>';
                                    divIntent += '<div class="collapsible-body">';
                                    
                                    if(strategy.strategytype == 'custom'){
                                        divIntent += '<div class="questionnaire strategy-custom default-strategy-'+strategy.id+'">'
                                            divIntent += '<div>';
                                                divIntent += '<p class="custom-strategy-description">Title</p>';
                                            divIntent += '</div>';
                                            divIntent += '<div class="button-group">';
                                                divIntent += '<div class="controls">';
                                                    divIntent += '<input value="'+strategy.name+'" placeholder="Strategy title" type="text" data-intentid="'+intent.id+'" data-strategyid="'+strategy.id+'" class="questiontext span5">';
                                                divIntent += '</div>';
                                            divIntent += '</div>';
                                            divIntent += '<div>';
                                                divIntent += '<p class="custom-strategy-description">Description</p>';
                                            divIntent += '</div>';
                                            divIntent += '<div class="button-group">';
                                                divIntent += '<div class="controls">';
                                                    divIntent += '<textarea placeholder="Description" data-intentid="'+intent.id+'" data-strategyid="'+strategy.id+'" class="questiontextarea span5">'+strategy.description+'</textarea>';
                                                divIntent += '</div>';
                                            divIntent += '</div>';
                                            
                                            divIntent += '<div>';
                                                divIntent += '<p class="custom-strategy-description">Document</p>';
                                            divIntent += '</div>';
                                            divIntent += '<div class="button-group">';
                                            
                                                divIntent += '<div class="elements_questionnaire_upload" id="elements_questionnaire_upload-' + strategy.id + '" data-intentid="'+intent.id+'" data-strategyid="'+strategy.id+'">';
                                                var strategyFiles = "";                     
                                                if(strategy.file){ 
                                                    strategyFiles = $.parseJSON(strategy.file.replace(/'/g, '"')); 
                                                }
                                                // YA: IE issue
                                                var keys_files = [];
                                                for(var key in strategyFiles){
                                                      keys_files.push(key);
                                                }
                                                
                                                if(keys_files.length >= 1){
                                                    if(keys_files.length > 1){
                                                         $.each(strategyFiles, function(i, file) {
                                                             
                                                            var filename =  file['filename'];
                                                            var trimedFileName = plaque.elements.trimFileName(filename);
                                                            var filepath =  file['filepath'].replace("/deploy/", "/");
                                                            divIntent += '<div class="files-list"><i class="delete-document-file'+i+' icon-remove-sign" data-intentid="' + intent.id + '" data-strategyid="' + strategy.id + '" data-filename="' + filename + '"></i>';
                                                            divIntent += '<a class="elements-file-name" target="_blank" id="uploaded-file-' + strategy.id + '" href="' + filepath + '">' + trimedFileName + '</a></div>';    
                                                            $("#elements_questionnaire_upload-" + strategy.id).attr("data-filename", filename);
                        
                                                            $(document.body).off("click",".delete-document-file"+i).on("click",".delete-document-file"+i, function (event) {
                                                                plaque.elements.deleteStrategyDocumentUploadedFileAWS($(this));
                                                            });
                                                        });
                                                    }else{
                                                        var filename =  strategyFiles[0]['filename'];
                                                        var trimedFileName = plaque.elements.trimFileName(filename);
                                                        var filepath =  strategyFiles[0]['filepath'].replace("/deploy/", "/");
                                                        
                                                        divIntent += '<div class="files-list"><i class="delete-document-file0 icon-remove-sign" data-intentid="' + intent.id + '" data-strategyid="' + strategy.id + '" data-filename="' + filename + '"></i>';
                                                        divIntent += '<a class="elements-file-name" target="_blank" id="uploaded-file-' + strategy.id + '" href="' + filepath + '">' + trimedFileName + '</a></div>';    
                                                        $("#elements_questionnaire_upload-" + strategy.id).attr("data-filename", filename);
                    
                                                        $(document.body).off("click",".delete-document-file0").on("click",".delete-document-file0", function (event) {
                                                            plaque.elements.deleteStrategyDocumentUploadedFileAWS($(this));
                                                        });
                                                    }
                                                    divIntent += '<span class="btn btn-success fileinput-button">';
                                                    divIntent += '<i class="fa fa-upload"></i><span>Add Document</span>';
                                                    divIntent += '<input class="elements_file_data_new upload" name="elements_file_data_new" id="elements_upload_data' + strategy.id + '" data-intentid="'+intent.id+'" data-strategyid="'+strategy.id+'" type="file" name="files[]" multiple="">';
                                                    divIntent += '</span>';                     
                                                }
                                                else{
                                                    divIntent += '<span class="btn btn-success fileinput-button">';
                                                    divIntent += '<i class="fa fa-upload"></i><span>Add Document</span>';
                                                    divIntent += '<input class="elements_file_data_new upload" name="elements_file_data_new" data-intentid="'+intent.id+'" data-strategyid="' + strategy.id + '" type="file" name="files[]" multiple="">';
                                                    divIntent += '</span>';
                                                }
                                            
                                                divIntent += '</div>';

                                            divIntent += '</div>';
                                            divIntent += '<div class="button-group deletestrategy">';
                                                divIntent += '<a class="waves-effect waves-light btn btn-red" data-intentid="'+intent.id+'" data-strategyid="'+strategy.id+'" id="delete-strategy">Delete</a>';
                                            divIntent += '</div>';
                                        divIntent += '</div>';
                                    }else if(strategy.status == 'attempted-old'){
                                        divIntent += '<div class="questionnaire questionnaire-strategy-'+strategy.id+'">'
                                            divIntent += '<div class="strategy-document">';
                                                //if(strategy.documentmessage != ''){ 
                                                //  divIntent += '<p class="strategy-question">'+strategy.documentmessage+'</p>';
                                                //}else{  
                                                    divIntent += '<p class="strategy-question">You have succesfully applied this strategy to your project. At this point, you can upload further documentation to increase your chances for certification.</p>';
                                                //}
                                                if(strategy.learnmore){
                                                    divIntent += '<a target="_blank" href="' + strategy.learnmore + '" class="learn-more right">Learn More <i class="icon-external-link"></i></a>';
                                                }
                                                divIntent += '<div class="button-group">';
                                                    divIntent += '<div class="elements_questionnaire_upload" id="elements_questionnaire_upload-' + strategy.id + '" data-intentid="'+intent.id+'" data-strategyid="'+strategy.id+'">';
                                                        var strategyFiles = "";                     
                                                        if(strategy.file){ 
                                                            strategyFiles = $.parseJSON(strategy.file.replace(/'/g, '"'));                  
                                                        }
                                                        var keys_files = [];
                                                        for(var key in strategyFiles){
                                                              keys_files.push(key);
                                                        }           
                                                            if(keys_files.length >= 1){                                                                
                                                                if(keys_files.length > 1){
                                                                     $.each(strategyFiles, function(i, file) {
                                                                        var filename =  file['filename'];
                                                                        var trimedFileName = plaque.elements.trimFileName(filename);
                                                                        var filepath =  file['filepath'].replace("/deploy/", "/");
                                                                        
                                                                        divIntent += '<div class="files-list"><i class="delete-document-file'+i+' icon-remove-sign" data-intentid="' + intent.id + '" data-strategyid="' + strategy.id + '" data-filename="' + filename + '"></i>';
                                                                        divIntent += '<a class="elements-file-name" target="_blank" id="uploaded-file-' + strategy.id + '" href="' + filepath + '">' + trimedFileName + '</a></div>';    
                                                                        $("#elements_questionnaire_upload-" + strategy.id).attr("data-filename", filename);
                                    
                                                                        $(document.body).off("click",".delete-document-file"+i).on("click",".delete-document-file"+i, function (event) {
                                                                            plaque.elements.deleteStrategyDocumentUploadedFileAWS($(this));
                                                                        });
                                                                    });
                                                                }else{
                                                                    var filename =  strategyFiles[0]['filename'];
                                                                    var trimedFileName = plaque.elements.trimFileName(filename);
                                                                    var filepath =  strategyFiles[0]['filepath'].replace("/deploy/", "/");
                                                                    
                                                                    divIntent += '<div class="files-list"><i class="delete-document-file0 icon-remove-sign" data-intentid="' + intent.id + '" data-strategyid="' + strategy.id + '" data-filename="' + filename + '"></i>';
                                                                    divIntent += '<a class="elements-file-name" target="_blank" id="uploaded-file-' + strategy.id + '" href="' + filepath + '">' + trimedFileName + '</a></div>';    
                                                                    $("#elements_questionnaire_upload-" + strategy.id).attr("data-filename", filename);
                                
                                                                    $(document.body).off("click",".delete-document-file0").on("click",".delete-document-file0", function (event) {
                                                                        plaque.elements.deleteStrategyDocumentUploadedFileAWS($(this));
                                                                    });
                                                                }
                                                                divIntent += '<span class="btn btn-success fileinput-button">';
                                                                divIntent += '<i class="fa fa-upload"></i><span>Add Document</span>';
                                                                divIntent += '<input class="elements_file_data_new upload" name="elements_file_data_new" id="elements_upload_data' + strategy.id + '" data-intentid="'+intent.id+'" data-strategyid="'+strategy.id+'" type="file" name="files[]" multiple="">';
                                                                divIntent += '</span>';                     
                                                            }else{
                                                                divIntent += '<span class="btn btn-success fileinput-button">';
                                                                    divIntent += '<i class="fa fa-upload"></i><span>Add Document</span>';
                                                                    divIntent += '<input class="elements_file_data_new upload" name="elements_file_data_new" data-intentid="'+intent.id+'" data-strategyid="' + strategy.id + '" type="file" name="files[]" multiple="">';
                                                                divIntent += '</span>';
                                                            }
                                                    divIntent += '</div>';
                                                    divIntent += '<a id="skipq" data-intentid="'+intent.id+'" data-strategyid="'+strategy.id+'" class="waves-effect waves-light btn btn-skip">Skip</a>';
                                                    divIntent += '<a id="completeq" data-intentid="'+intent.id+'" data-strategyid="'+strategy.id+'" class="waves-effect waves-light btn btn-green">Complete</a>';                                               
                                                divIntent += '</div>';
                                            divIntent += '</div>';
                                        divIntent += '</div>';
                                    }else if(strategy.status == 'added' || strategy.status == 'attempted'){
                                        divIntent += '<div class="questionnaire questionnaire-strategy-'+strategy.id+'">'
                                                            
                                            divIntent += '<div class="strategy-success">';
                                                if(strategy.successmessage != ''){
                                                    divIntent += '<p class="strategy-question"><span class="category-icon"></span><span class="success-message">'+strategy.successmessage+'</span></p>';
                                                }else{
                                                    divIntent += '<p class="strategy-question"><span class="category-icon"></span> <span class="success-message">Congratulations! You have succesfully applied this strategy to your project</span></p>';
                                                }
                                                if(strategy.learnmore){
                                                    divIntent += '<a target="_blank" href="' + strategy.learnmore + '" class="learn-more right">Learn More <i class="icon-external-link"></i></a>';
                                                }
                                                // start changes
                                                divIntent += '<div class="strategy-upload-message">';
                                                    divIntent +='<div class="upload-message-div">';
                                                        divIntent +='<p class="upload-message">';
                                                            divIntent +='<span class="strategy-upload-step">Step 1.</span> Upload further documentation to increase your chances for certification.';
                                                        divIntent +='</p>'
                                                    divIntent +='</div>';
                                                    divIntent += '<div class="elements_questionnaire_upload" id="elements_questionnaire_upload-' + strategy.id + '" data-intentid="'+intent.id+'" data-strategyid="'+strategy.id+'">';
                                                        var strategyFiles = "";                     
                                                        if(strategy.file){ 
                                                            strategyFiles = $.parseJSON(strategy.file.replace(/'/g, '"')); 
                                                        }
                                                        var keys_files = [];
                                                        for(var key in strategyFiles){
                                                              keys_files.push(key);
                                                        }
                                                        if(keys_files.length >= 1){
                                                            if(keys_files.length > 1){
                                                                $.each(strategyFiles, function(i, file) {                                                                                        
                                                                    var filename =  file['filename'];
                                                                    var trimedFileName = plaque.elements.trimFileName(filename);
                                                                    var filepath =  file['filepath'].replace("/deploy/", "/");
                                                                    
                                                                    divIntent += '<div class="files-list"><i class="delete-document-file'+i+' icon-remove-sign" data-intentid="' + intent.id + '" data-strategyid="' + strategy.id + '" data-filename="' + filename + '"></i>';
                                                                    divIntent += '<a class="elements-file-name" target="_blank" id="uploaded-file-' + strategy.id + '" href="' + filepath + '">' + trimedFileName + '</a></div>';    
                                                                    $("#elements_questionnaire_upload-" + strategy.id).attr("data-filename", filename);
                                
                                                                    $(document.body).off("click",".delete-document-file"+i).on("click",".delete-document-file"+i, function (event) {
                                                                        plaque.elements.deleteStrategyDocumentUploadedFileAWS($(this));
                                                                    });
                                                                });
                                                            }else{
                                                                var filename =  strategyFiles[0]['filename'];
                                                                var trimedFileName = plaque.elements.trimFileName(filename);
                                                                var filepath =  strategyFiles[0]['filepath'].replace("/deploy/", "/");
                                                                    
                                                                divIntent += '<div class="files-list"><i class="delete-document-file0 icon-remove-sign" data-intentid="' + intent.id + '" data-strategyid="' + strategy.id + '" data-filename="' + filename + '"></i>';
                                                                divIntent += '<a class="elements-file-name" target="_blank" id="uploaded-file-' + strategy.id + '" href="' + filepath + '">' + trimedFileName + '</a></div>';    
                                                                $("#elements_questionnaire_upload-" + strategy.id).attr("data-filename", filename);
                            
                                                                $(document.body).off("click",".delete-document-file0").on("click",".delete-document-file0", function (event) {
                                                                    plaque.elements.deleteStrategyDocumentUploadedFileAWS($(this));
                                                                });
                                                            }
                                                            divIntent += '<span class="btn btn-success fileinput-button">';
                                                            divIntent += '<i class="fa fa-upload"></i><span>Add Document</span>';
                                                            divIntent += '<input class="elements_file_data_new upload" name="elements_file_data_new" id="elements_upload_data' + strategy.id + '" data-intentid="'+intent.id+'" data-strategyid="'+strategy.id+'" type="file" name="files[]" multiple="">';
                                                            divIntent += '</span>';                     
                                                        }
                                                        else{
                                                            divIntent += '<span class="btn btn-success fileinput-button">';
                                                            divIntent += '<i class="fa fa-upload"></i><span>Add Document</span>';
                                                            divIntent += '<input class="elements_file_data_new upload" name="elements_file_data_new" data-intentid="'+intent.id+'" data-strategyid="' + strategy.id + '" type="file" name="files[]" multiple="">';
                                                            divIntent += '</span>';
                                                        }                                                               
                                                    divIntent += '</div>';
                                                divIntent += '</div>';

                                                divIntent+= '<div class="strategy-complete-div">';
                                                    divIntent+= '<div class="complete-message-div">';
                                                        divIntent +='<p class="complete-message">';
                                                            divIntent +='<span class="strategy-upload-step">Step 2.</span> Complete credit now.';
                                                        divIntent +='</p>'
                                                    divIntent+= '</div>';
                                                    divIntent+= '<div class="complete-credit">';
                                                        divIntent += '<a id="completeq" data-intentid="'+intent.id+'" data-strategyid="'+strategy.id+'" class="waves-effect waves-light btn btn-green">Complete credit</a>';
                                                    divIntent+= '</div>';
                                                divIntent+= '</div>';
                                                divIntent += '<hr class="documentation-message-button-group">';
                                            
                                                divIntent += '<div class="button-group button-group-success">';
                                                    divIntent += '<a id="restartq" data-intentid="'+intent.id+'" data-strategyid="'+strategy.id+'" class="waves-effect waves-light btn-back-step"><i class="fa fa-angle-left"></i><span>Back to Last Step</span></a>';
                                                    divIntent += '<a id="next-strategy" data-intentid="'+intent.id+'" data-strategyid="'+strategy.id+'" class="waves-effect waves-light btn btn-white"><span>Next Strategy</span><i class="fa fa-angle-right"></i></a>';
                                                    divIntent += '<span class="button-group-or-text">OR</span>';
                                                    divIntent += '<a id="continueq" data-intentid="'+intent.id+'" data-strategyid="'+strategy.id+'" class="waves-effect waves-light btn btn-white">Skip</a>';
                                                divIntent += '</div>';
                                            divIntent += '</div>'; 
                                            //end changes
                                            
                                        divIntent += '</div>';
                                    }else if(strategy.status == 'applicable'){
                                        
                                    //  var questions = strategyQuestions[strategy.id];
                                        var strategyId = strategy.id;
                                        var questions = plaque.elements.getQuestions(intentId, strategyId);
                                        
                                        $.each(questions.questions, function(i, question) {
                                            
                                            var question_data = question.question;
                                            if(strategyQuestions[strategyId].length === 0) 
                                                strategyQuestions[strategyId]['firstquestion'] = question_data.question_original_id;
                                            strategyQuestions[strategyId][question_data.question_original_id] = [];
                                            strategyQuestions[strategyId][question_data.question_original_id]['qid'] = question_data.id;
                                            strategyQuestions[strategyId][question_data.question_original_id]['question'] = question_data.question;
                                            strategyQuestions[strategyId][question_data.question_original_id]['qtype'] = question_data.qtype;
                                            strategyQuestions[strategyId][question_data.question_original_id]['min_val'] = question_data.min_val;
                                            strategyQuestions[strategyId][question_data.question_original_id]['max_val'] = question_data.max_val;
                                            strategyQuestions[strategyId][question_data.question_original_id]['existinganswer'] = question_data.answer;
                                            strategyQuestions[strategyId][question_data.question_original_id]['gotoquestion'] = question_data.goto_question;
                                            strategyQuestions[strategyId][question_data.question_original_id]['direct_outcome'] = question_data.direct_outcome;
                                            var choices = [];
                                            $.each(question.choices, function(i, choice) {
                                                choices.push({"key":choice.key,"value":choice.value,"gotoquestion":choice.goto_question,"direct_outcome":choice.direct_outcome});
                                            });
                                            strategyQuestions[strategyId][question_data.question_original_id]['answers'] = choices;
                                            
                                        });

                                        var questions = strategyQuestions[strategy.id];
                                        var number = strategyQuestions[strategy.id]['firstquestion'];
                                        
                                        divIntent += '<div class="questionnaire questionnaire-strategy-'+strategy.id+'">'
                                            divIntent += '<p class="strategy-question">'+ questions[number]['question'] +'</p>';
                                            if(strategy.learnmore){
                                                divIntent += '<a target="_blank" href="' + strategy.learnmore + '" class="learn-more right">Learn More <i class="icon-external-link"></i></a>';
                                            }
                                            divIntent +='<div class="button-group">';
                                                divIntent += '<div class="controls">';
                                                $.each(questions[number]['answers'], function(i, answer) {
                                                    var cssclass = 'btn-green';
                                                    if(answer.key.toLowerCase() == 'no') cssclass = 'btn-white';
                                                    
                                                    if((answer.key == questions[number]['existinganswer']) && answer.key.toLowerCase() == 'no') cssclass += ' noselected';
                                                    if((answer.key == questions[number]['existinganswer']) && answer.key.toLowerCase() == 'yes') cssclass += ' yesselected';
                                                    
                                                    divIntent += '<a data-intentid="'+intent.id+'" data-strategyid="'+strategy.id+'" data-previousquestion="" data-currentquestion="'+number+'" data-goto="' + answer.gotoquestion + '" data-directoutcome="' + answer.direct_outcome + '" class="answerbutton waves-effect waves-light btn '+ cssclass +'" data-value="' + answer.key + '" id="' + number + '-' + answer.key + '">' + answer.value + '</a>';
                                                });
                                                divIntent += '</div>';
                                            divIntent +='</div>';
                                        divIntent += '</div>';
                                    }else if(strategy.status == 'not-added'){
                                        divIntent += '<div class="questionnaire questionnaire-strategy-'+strategy.id+'">'
                                            divIntent += '<div class="strategy-fail">';
                                                if(strategy.failuremessage != ''){
                                                    divIntent += '<p class="strategy-question">'+strategy.failuremessage+'</p>';
                                                }else{
                                                    divIntent += '<p class="strategy-question">Looks like you couldn\'t apply this strategy to your project.</p>';
                                                }
                                                if(strategy.recommendations != ''){
                                                    divIntent += '<p>Please consider the following options if you wish to try again:</p>';
                                                    divIntent += '<div class="strategy-recommendations">' + strategy.recommendations + '</div>'
                                                }
                                                if(strategy.learnmore){
                                                    divIntent += '<a target="_blank" href="' + strategy.learnmore + '" class="learn-more right">Learn More <i class="icon-external-link"></i></a>';
                                                }
                                                divIntent += '<div class="button-group">';
                                                    divIntent += '<a id="continueq" data-intentid="'+intent.id+'" data-strategyid="'+strategy.id+'" class="waves-effect waves-light btn btn-green">Continue</a>';
                                                    divIntent += '<a id="restartq" data-intentid="'+intent.id+'" data-strategyid="'+strategy.id+'" class="waves-effect waves-light btn-back-step">Back to Last Step</a>';
                                                divIntent += '</div>';
                                            divIntent += '</div>';  
                                        divIntent += '</div>';
                                    }else if(strategy.status == 'undecided' || strategy.status == 'not-applicable'){
                                        // not-applicable
                                        divIntent += '<div class="strategy-not-applicable default-strategy-'+strategy.id+'">'
                                            divIntent += '<div>';
                                                divIntent += '<p class="strategy-description">'+strategy.description+'</p>';
                                                if(strategy.learnmore){
                                                    divIntent += '<a target="_blank" href="' + strategy.learnmore + '" class="learn-more right">Learn More <i class="icon-external-link"></i></a>';
                                                }
                                                divIntent += '<p class="strategy-question">Does this apply to you?</p>';
                                            divIntent += '</div>';
                                            divIntent += '<div class="button-group">';
                                                divIntent += '<a class="waves-effect waves-light btn btn-green" data-intentid="'+intent.id+'" data-strategyid="'+strategy.id+'" id="initiateQuestionnaire">Yes</a>';
                                                divIntent += '<a class="waves-effect waves-light btn btn-white close-popout">No</a>';
                                            divIntent += '</div>';
                                        divIntent += '</div>';
                                        divIntent += '<div style="display:none;" class="questionnaire questionnaire-strategy-'+strategy.id+'"></div>';
                                    }
                                    divIntent += '</div>';
                                }else{
                                    // custom
                                    divIntent += '<div class="collapsible-header" data-strategyid="'+strategy.id+'">'+strategy.name+'</div>';
                                    divIntent += '<div class="collapsible-body">';
                                        divIntent += '<div class="questionnaire strategy-custom default-strategy-'+strategy.id+'">'
                                            divIntent += '<div>';
                                                divIntent += '<p class="custom-strategy-description">Title</p>';
                                            divIntent += '</div>';
                                            divIntent += '<div class="button-group">';
                                                divIntent += '<div class="controls">';
                                                    divIntent += '<input value="'+strategy.name+'" placeholder="Strategy title" type="text" data-intentid="'+intent.id+'" data-strategyid="'+strategy.id+'" class="questiontext span5">';
                                                divIntent += '</div>';
                                            divIntent += '</div>';
                                            divIntent += '<div>';
                                                divIntent += '<p class="custom-strategy-description">Description</p>';
                                            divIntent += '</div>';
                                            divIntent += '<div class="button-group">';
                                                divIntent += '<div class="controls">';
                                                    divIntent += '<textarea placeholder="Description" data-intentid="'+intent.id+'" data-strategyid="'+strategy.id+'" class="questiontextarea span5">'+strategy.description+'</textarea>';
                                                divIntent += '</div>';
                                            divIntent += '</div>';
                                            
                                            divIntent += '<div>';
                                                divIntent += '<p class="custom-strategy-description">Document</p>';
                                            divIntent += '</div>';
                                            divIntent += '<div class="button-group">';
                                                if(strategy.file){
                                                    var fileDetails = $.parseJSON(strategy.file.replace(/'/g, '"'));
                                                    divIntent += '<div class="elements_questionnaire_upload" id="elements_questionnaire_upload-' + strategy.id + '" data-intentid="'+intent.id+'" data-strategyid="'+strategy.id+'" data-filename="' + fileDetails['filename'] + '">';
                                                    divIntent += '';
                                                    $.each(fileDetails, function(i, file) {
                                                        var filename =  file['filename'];
                                                        /* VR 15 jan: fixed for long name and repeating extension name*/
                                                        var trimedFileName = plaque.elements.trimFileName(filename); 
                                                        var filepath =  file['filepath'].replace("/deploy/", "/");
                                                        
                                                        divIntent += '<div class="files-list"><i class="delete-document-file'+i+' icon-remove-sign" data-intentid="' + intent.id + '" data-strategyid="' + strategy.id + '" data-filename="' + filename + '"></i>';
                                                        divIntent += '<a class="elements-file-name" target="_blank" id="uploaded-file-' + strategy.id + '" href="' + filepath + '">' + trimedFileName + '</a></div>';    
                                                        $("#elements_questionnaire_upload-" + strategy.id).attr("data-filename", filename);
                    
                                                        $(document.body).off("click",".delete-document-file"+i).on("click",".delete-document-file"+i, function (event) {
                                                            plaque.elements.deleteStrategyDocumentUploadedFileAWS($(this));
                                                        });
                                                    });
                                                    divIntent += '</div>';
                                                }
                                                
                                                divIntent += '<div class="elements_questionnaire_upload" id="elements_questionnaire_upload-' + strategy.id + '" data-intentid="'+intent.id+'" data-strategyid="' + strategy.id + '">';
                                                    divIntent += '<span class="btn btn-success fileinput-button">';
                                                        divIntent += '<i class="fa fa-upload"></i><span>Add Document</span>';
                                                        divIntent += '<input class="elements_file_data_new upload" name="elements_file_data_new" data-intentid="'+intent.id+'" data-strategyid="' + strategy.id + '" type="file" name="files[]" multiple="">';
                                                    divIntent += '</span>';
                                                divIntent += '</div>';

                                            divIntent += '</div>';
                                            divIntent += '<div class="button-group deletestrategy">';
                                                divIntent += '<a class="waves-effect waves-light btn btn-red" data-intentid="'+intent.id+'" data-strategyid="'+strategy.id+'" id="delete-strategy">Delete</a>';
                                            divIntent += '</div>';
                                        divIntent += '</div>';
                                    divIntent += '</div>';
                                }
                                divIntent += '</li>';
                            });
                        //  $("#index-banner-"+intentId+" > ul").append(divIntent);
                            $("#index-banner-"+intentId+" > ul").html(divIntent);
                            
                            // hover div functionality
                            $(document.body).on('mouseenter','div.collapsible-header', function (event) {
                                if($('.multiCheckStrategyXYZ').is(':checked')){
                                    $('.hover-apply-strategy').hide();
                                }else{
                                    if($(this).hasClass('active')){ //|| $(this).parent('li').hasClass('attempted')
                                        $(this).children('.hover-apply-strategy').hide();
                                        $(this).children('.hover-select-strategy').hide();
                                    }else{
                                        var height = $(this).parent('li').height();
                                        $(this).css('position', 'relative');
                                        $(this).children('.hover-apply-strategy').css('height', height);
                                        $(this).children('.hover-select-strategy').css('height', height);
                                        $(this).children('.hover-apply-strategy').show();
                                        $(this).children('.hover-select-strategy').show();
                                        $(this).children('.hover-apply-strategy').find('.applyStrategy').show();
                                        $(this).children('.hover-apply-strategy').find('.notApplyStrategy').show();
                                        $(this).children('.hover-apply-strategy').find('.documentStrategy').show();
                                        $(this).children('.hover-apply-strategy').find('.starStrategy').show();
                                    }
                                }
                            }).on('mouseleave','div.collapsible-header',  function(){
                                //$(this).css('position','');
                                //$(this).children('.hover-apply-strategy').hide();
                                if($(this).children('.hover-apply-strategy').find('.documentStrategy').hasClass('documented')){
                                    $(this).children('.hover-apply-strategy').find('.documentStrategy').show();
                                }else{
                                    $(this).children('.hover-apply-strategy').find('.documentStrategy').hide();
                                }
                                if($(this).children('.hover-apply-strategy').find('.applyStrategy').hasClass('applied')){
                                    //$(this).children('.hover-apply-strategy').find('.applyStrategy').show();
                                }else{
                                    //$(this).children('.hover-apply-strategy').find('.applyStrategy').hide();
                                }
                                $(this).children('.hover-apply-strategy').find('.applyStrategy').hide();
                                $(this).children('.hover-apply-strategy').find('.notApplyStrategy').hide();
                                if($(this).children('.hover-apply-strategy').find('.starStrategy').hasClass('favorite')){
                                    $(this).children('.hover-apply-strategy').find('.starStrategy').show();
                                }else{
                                    $(this).children('.hover-apply-strategy').find('.starStrategy').hide();
                                }
                                if(!$('.multiCheckStrategyXYZ').is(':checked')){
                                    $(this).children('.hover-select-strategy').hide();
                                }
                            });
                            // hover div functionality

                            // tooltip functionality
                            $('.actionmenuStrategy').each(function() {                  
                                var elem = $(this);                 
                                elem.qtip({ 
                                    prerender: true,// YA fixed:Tooltip doesnot works for the first time    
                                    content: '<ul class="'+$(this).next().attr("class")+'">' + $(this).siblings('.strategy-action-nav').html() + '</ul>', //YA fixed    empty content issue                
                                    position: {
                                        my: 'center right',
                                        at: 'center left'
                                    },
                                    show: {
                                        event: 'click',
                                        solo:true // YA fixed multi qtip 
                                    },
                                    hide: {
                                        event: 'click'
                                    },
                                    style: {
                                        classes: 'action-menu-popup',
                                    }                       
                                });
                            }).on("click", $(this), function(e){                    
                                e.stopPropagation(); 
                            });
                            // tooltip functionality


                            // hover div - Yes clicked starts
                            $(".applyStrategy").on("click", function(e){
                                if(!$(this).hasClass("applied")){                   
                                    var strategyId = $(this).data('strategyid');
                                    var intentId = $(this).data('intentid');
                                    
                                    var strategyDiv = $(".collapsible-header[data-strategyid="+strategyId+"]");
                                    
                                    var data = {};
                                    data["strategy_id"] = strategyId;
                                    data["status"] = 'applicable';
                                    data["update_flag"] = 'status';
                                    plaque.elements.updateStrategyStatus(buildingID, data);
                                    
                                    $(this).addClass('applied');
                                    
                                    var strategyLi = strategyDiv.closest('li');
                                    
                                    /*Start logic for scoring*/
                                    var intentUl = strategyLi.parent('ul.collapsible');
                                    plaque.elements.calculateScore(buildingID, intentUl.data('intentid'));
                                    /*End logic for scoring*/
                                    
                                    strategyLi.removeClass('not-applicable').removeClass('not-added').removeClass('attempted').removeClass('added').addClass('applicable');
                                    
                                    strategyDiv.find('.strategy-action-menu').find('.strategy-action-nav').find('.applyStrategy').addClass('applied');
                                    strategyDiv.find('.strategy-action-menu').find('.strategy-action-nav').find('.notApplyStrategy').removeClass('notApplied');
                                    strategyDiv.find('.strategy-action-menu').find('.strategy-action-nav').find('.unDecidedStrategy').removeClass('undecided');
                                    
                                    var actionMenu = strategyDiv.find('.strategy-action-menu').find('.hover-apply-strategy-content').find('.actionmenuStrategy');
                                    var actionQtipID = actionMenu.attr('aria-describedby');
                                    $('#'+actionQtipID).find('.strategy-action-nav').find('.applyStrategy').addClass('applied');
                                    $('#'+actionQtipID).find('.strategy-action-nav').find('.notApplyStrategy').removeClass('notApplied');
                                    $('#'+actionQtipID).find('.strategy-action-nav').find('.unDecidedStrategy').removeClass('undecided');
                                    
                                    strategyDiv.find('.hover-apply-strategy').find('.hover-apply-strategy-content').find('.applyStrategy').addClass('applied');
                                    strategyDiv.find('.hover-apply-strategy').find('.hover-apply-strategy-content').find('.notApplyStrategy').removeClass('notApplied');
                                    
                                    if(!strategyLi.is('.strategy-custom','.custom-added')){
                                        var strategyDiv = strategyLi.children('.collapsible-body').children('.default-strategy-'+strategyId);
                                        var strategyQuestionnaire = strategyDiv.siblings('.questionnaire-strategy-'+strategyId);
                                        strategyDiv.hide();
                                        strategyQuestionnaire.empty();
                                    //  Begin loading questionnaire
                                        var questions = plaque.elements.getQuestions(intentId, strategyId);
                                       
                                        $.each(questions.questions, function(i, question) {                                            
                                            var question_data = question.question;
                                            if(strategyQuestions[strategyId].length === 0) 
                                                strategyQuestions[strategyId]['firstquestion'] = question_data.question_original_id;
                                            strategyQuestions[strategyId][question_data.question_original_id] = [];
                                            strategyQuestions[strategyId][question_data.question_original_id]['qid'] = question_data.id;
                                            strategyQuestions[strategyId][question_data.question_original_id]['question'] = question_data.question;
                                            strategyQuestions[strategyId][question_data.question_original_id]['qtype'] = question_data.qtype;
                                            strategyQuestions[strategyId][question_data.question_original_id]['min_val'] = question_data.min_val;
                                            strategyQuestions[strategyId][question_data.question_original_id]['max_val'] = question_data.max_val;
                                            strategyQuestions[strategyId][question_data.question_original_id]['existinganswer'] = question_data.answer;
                                            strategyQuestions[strategyId][question_data.question_original_id]['gotoquestion'] = question_data.goto_question;
                                            strategyQuestions[strategyId][question_data.question_original_id]['direct_outcome'] = question_data.direct_outcome;
                                            var choices = [];
                                            $.each(question.choices, function(i, choice) {
                                                choices.push({"key":choice.key,"value":choice.value,"gotoquestion":choice.goto_question,"direct_outcome":choice.direct_outcome});
                                            });
                                            strategyQuestions[strategyId][question_data.question_original_id]['answers'] = choices;                                            
                                        });
                                        plaque.elements.questionBox(strategyQuestionnaire, intentId, strategyId, strategyQuestions[strategyId], strategyQuestions[strategyId]['firstquestion'],'','');
                                        strategyQuestionnaire.show();
                                        
                                        /*
                                        var availableRequiredStrategy = plaque.elements.findRequiredStrategy(strategyId,requiredStrategies[intentId])[0];
                                        if(availableRequiredStrategy){
                                            if(availableRequiredStrategy.strategyid == strategyId){
                                                appliedRequiredStrategies[intentId].push({'strategyid':strategyId});
                                                plaque.elements.setRequiredProgress(intentId,requiredStrategies,appliedRequiredStrategies);
                                            }
                                        }*/
                                    }
                                    // refreshing filter data
                                    if($("#intent-filter span.filter-selected-text").text()=="No"){
                                        strategyLi.addClass('filter-applied');
                                    }

                                }
                                // Again clicking Yes
                                else{
                                    var strategyId = $(this).data('strategyid');
                                    var intentId = $(this).data('intentid');
                                    
                                    var strategyDiv = $(".collapsible-header[data-strategyid="+strategyId+"]");

                                    var data = {};
                                    data["strategy_id"] = strategyId;
                                    data["status"] = 'undecided';
                                    data["update_flag"] = 'status';
                                    plaque.elements.updateStrategyStatus(buildingID, data);
                                    
                                    var questions = $.makeArray(strategyQuestions[strategyId]);
                                    $.each(questions, function(i, question) {
                                        if(typeof question != 'undefined'){
                                            plaque.elements.submitAnswer(buildingID, question['qid'], '');
                                        }
                                    });
                                    
                                    var strategyLi = strategyDiv.closest('li');
                                    
                                    /*Start logic for scoring*/
                                    var intentUl = strategyLi.parent('ul.collapsible');
                                    plaque.elements.calculateScore(buildingID, intentUl.data('intentid'));
                                    /*End logic for scoring*/
                                    
                                    strategyLi.removeClass('applicable').removeClass('attempted').removeClass('added').removeClass('not-added').removeClass('not-applicable').addClass('undecided');
                                    
                                    strategyDiv.find('.strategy-action-menu').find('.strategy-action-nav').find('.applyStrategy').removeClass('applied');
                                    strategyDiv.find('.strategy-action-menu').find('.strategy-action-nav').find('.documentStrategy').removeClass('documented');
                                    strategyDiv.find('.strategy-action-menu').find('.strategy-action-nav').find('.notApplyStrategy').removeClass('notApplied');
                                    strategyDiv.find('.strategy-action-menu').find('.strategy-action-nav').find('.unDecidedStrategy').addClass('undecided');
                                    
                                    var actionMenu = strategyDiv.find('.strategy-action-menu').find('.hover-apply-strategy-content').find('.actionmenuStrategy');
                                    var actionQtipID = actionMenu.attr('aria-describedby');
                                    $('#'+actionQtipID).find('.strategy-action-nav').find('.applyStrategy').removeClass('applied');
                                    $('#'+actionQtipID).find('.strategy-action-nav').find('.notApplyStrategy').removeClass('notApplied');
                                    $('#'+actionQtipID).find('.strategy-action-nav').find('.documentStrategy').removeClass('documented');
                                    $('#'+actionQtipID).find('.strategy-action-nav').find('.unDecidedStrategy').addClass('undecided');
                                    
                                    strategyDiv.find('.hover-apply-strategy').find('.hover-apply-strategy-content').find('.applyStrategy').removeClass('applied');
                                    strategyDiv.find('.hover-apply-strategy').find('.hover-apply-strategy-content').find('.notApplyStrategy').removeClass('notApplied');
                                    strategyDiv.find('.hover-apply-strategy').find('.hover-apply-strategy-content').find('.documentStrategy').removeClass('documented');
                                    
                                    
                                    if(!strategyLi.is('.strategy-custom','.custom-added')){
                                        var strategy = strategyQuestions[strategyId]['details'];
                                        var defaultDiv = '<div class="strategy-undecided default-strategy-'+strategy.id+'">'
                                            defaultDiv += '<div>';
                                                defaultDiv += '<p class="strategy-description">'+strategy.description+'</p>';
                                                if(strategy.learnmore){
                                                    defaultDiv += '<a target="_blank" href="' + strategy.learnmore + '" class="learn-more right">Learn More <i class="icon-external-link"></i></a>';
                                                }
                                                defaultDiv += '<p class="strategy-question">Does this apply to you?</p>';
                                            defaultDiv += '</div>';
                                            defaultDiv += '<div class="button-group">';
                                                defaultDiv += '<a class="waves-effect waves-light btn btn-green" data-intentid="'+intentId+'" data-strategyid="'+strategy.id+'" id="initiateQuestionnaire">Yes</a>';
                                                defaultDiv += '<a class="waves-effect waves-light btn btn-white close-popout">No</a>';
                                            defaultDiv += '</div>';
                                        defaultDiv += '</div>';

                                        strategyLi.children('.collapsible-body').find('.strategy-not-applicable').remove();
                                        strategyLi.children('.collapsible-body').prepend(defaultDiv);
                                        var strategyQuestionnaire = strategyLi.children('.collapsible-body').children('.questionnaire-strategy-'+strategyId);
                                        
                                        strategyQuestionnaire.hide();
                                    }                                    

                                    // refreshing filter data
                                    if($("#intent-filter span.filter-selected-text").text()=="No"){
                                        strategyLi.addClass('filter-applied');
                                    }

                                }
                                // Again clicking Yes
                                e.stopPropagation();
                            });
                            // hover div - Yes clicked ends

                            // tooltip div - Yes clicked starts
                            $(document.body).on("click", ".apply-content .applyStrategy", function(e){
                                
                                if(!$(this).hasClass("applied")){
                                    var strategyId = $(this).data('strategyid');
                                    var intentId = $(this).data('intentid');
                                    
                                    var strategyDiv = $(".collapsible-header[data-strategyid="+strategyId+"]");
                                    
                                    var data = {};
                                    data["strategy_id"] = strategyId;
                                    data["status"] = 'applicable';
                                    data["update_flag"] = 'status';
                                    plaque.elements.updateStrategyStatus(buildingID, data);
                                    
                                    $(this).addClass('applied');
                                    
                                    var strategyLi = strategyDiv.closest('li');
                                    
                                    /*Start logic for scoring*/
                                    var intentUl = strategyLi.parent('ul.collapsible');
                                    plaque.elements.calculateScore(buildingID, intentUl.data('intentid'));
                                    /*End logic for scoring*/
                                    
                                    strategyLi.removeClass('not-applicable').removeClass('not-added').removeClass('attempted').removeClass('added').addClass('applicable');
                                    
                                    strategyDiv.find('.strategy-action-menu').find('.strategy-action-nav').find('.applyStrategy').addClass('applied');
                                    strategyDiv.find('.strategy-action-menu').find('.strategy-action-nav').find('.notApplyStrategy').removeClass('notApplied');
                                    strategyDiv.find('.strategy-action-menu').find('.strategy-action-nav').find('.unDecidedStrategy').removeClass('undecided');
                                    
                                    var actionMenu = strategyDiv.find('.strategy-action-menu').find('.hover-apply-strategy-content').find('.actionmenuStrategy');
                                    var actionQtipID = actionMenu.attr('aria-describedby');
                                    $('#'+actionQtipID).find('.strategy-action-nav').find('.applyStrategy').addClass('applied');
                                    $('#'+actionQtipID).find('.strategy-action-nav').find('.notApplyStrategy').removeClass('notApplied');
                                    $('#'+actionQtipID).find('.strategy-action-nav').find('.unDecidedStrategy').removeClass('undecided');
                                    
                                    strategyDiv.find('.hover-apply-strategy').find('.hover-apply-strategy-content').find('.applyStrategy').addClass('applied');
                                    strategyDiv.find('.hover-apply-strategy').find('.hover-apply-strategy-content').find('.notApplyStrategy').removeClass('notApplied');
                                    
                                    if(!strategyLi.is('.strategy-custom','.custom-added')){
                                        var strategyDiv = strategyLi.children('.collapsible-body').children('.default-strategy-'+strategyId);
                                        var strategyQuestionnaire = strategyDiv.siblings('.questionnaire-strategy-'+strategyId);
                                        strategyDiv.hide();
                                        strategyQuestionnaire.empty();
                                        // Begin loading questionnaire
                                        var questions = plaque.elements.getQuestions(intentId, strategyId);
                                        
                                        $.each(questions.questions, function(i, question) {
                                            
                                            var question_data = question.question;
                                            if(strategyQuestions[strategyId].length === 0) 
                                                strategyQuestions[strategyId]['firstquestion'] = question_data.question_original_id;
                                            strategyQuestions[strategyId][question_data.question_original_id] = [];
                                            strategyQuestions[strategyId][question_data.question_original_id]['qid'] = question_data.id;
                                            strategyQuestions[strategyId][question_data.question_original_id]['question'] = question_data.question;
                                            strategyQuestions[strategyId][question_data.question_original_id]['qtype'] = question_data.qtype;
                                            strategyQuestions[strategyId][question_data.question_original_id]['min_val'] = question_data.min_val;
                                            strategyQuestions[strategyId][question_data.question_original_id]['max_val'] = question_data.max_val;
                                            strategyQuestions[strategyId][question_data.question_original_id]['existinganswer'] = question_data.answer;
                                            strategyQuestions[strategyId][question_data.question_original_id]['gotoquestion'] = question_data.goto_question;
                                            strategyQuestions[strategyId][question_data.question_original_id]['direct_outcome'] = question_data.direct_outcome;
                                            var choices = [];
                                            $.each(question.choices, function(i, choice) {
                                                choices.push({"key":choice.key,"value":choice.value,"gotoquestion":choice.goto_question,"direct_outcome":choice.direct_outcome});
                                            });
                                            strategyQuestions[strategyId][question_data.question_original_id]['answers'] = choices;
                                            
                                        });
                                        plaque.elements.questionBox(strategyQuestionnaire, intentId, strategyId, strategyQuestions[strategyId], strategyQuestions[strategyId]['firstquestion'],'','');
                                        strategyQuestionnaire.show();
                                        
                                    }
                                    // refreshing filter data
                                    if($("#intent-filter span.filter-selected-text").text()=="No"){
                                        strategyLi.addClass('filter-applied');
                                    }
                                    
                                    var tooltip = $(this).parents('.qtip');
                                    if(tooltip.length){
                                        tooltip.toggle();
                                    }
                                }
                                // Again clicking Yes
                                else{
                                    var strategyId = $(this).data('strategyid');
                                    var intentId = $(this).data('intentid');
                                    
                                    var strategyDiv = $(".collapsible-header[data-strategyid="+strategyId+"]");

                                    var data = {};
                                    data["strategy_id"] = strategyId;
                                    data["status"] = 'undecided';
                                    data["update_flag"] = 'status';
                                    plaque.elements.updateStrategyStatus(buildingID, data);
                                    
                                    var questions = $.makeArray(strategyQuestions[strategyId]);
                                    $.each(questions, function(i, question) {
                                        if(typeof question != 'undefined'){
                                            plaque.elements.submitAnswer(buildingID, question['qid'], '');
                                        }
                                    });
                                    
                                    var strategyLi = strategyDiv.closest('li');
                                    
                                    /*Start logic for scoring*/
                                    var intentUl = strategyLi.parent('ul.collapsible');
                                    plaque.elements.calculateScore(buildingID, intentUl.data('intentid'));
                                    /*End logic for scoring*/
                                    
                                    strategyLi.removeClass('applicable').removeClass('attempted').removeClass('added').removeClass('not-added').removeClass('not-applicable').addClass('undecided');
                                    
                                    strategyDiv.find('.strategy-action-menu').find('.strategy-action-nav').find('.applyStrategy').removeClass('applied');
                                    strategyDiv.find('.strategy-action-menu').find('.strategy-action-nav').find('.notApplyStrategy').removeClass('notApplied');
                                    strategyDiv.find('.strategy-action-menu').find('.strategy-action-nav').find('.documentStrategy').removeClass('documented');
                                    strategyDiv.find('.strategy-action-menu').find('.strategy-action-nav').find('.unDecidedStrategy').addClass('undecided');
                                    
                                    var actionMenu = strategyDiv.find('.strategy-action-menu').find('.hover-apply-strategy-content').find('.actionmenuStrategy');
                                    var actionQtipID = actionMenu.attr('aria-describedby');
                                    $('#'+actionQtipID).find('.strategy-action-nav').find('.applyStrategy').removeClass('applied');
                                    $('#'+actionQtipID).find('.strategy-action-nav').find('.notApplyStrategy').removeClass('notApplied');
                                    $('#'+actionQtipID).find('.strategy-action-nav').find('.documentStrategy').removeClass('documented');
                                    $('#'+actionQtipID).find('.strategy-action-nav').find('.unDecidedStrategy').addClass('undecided');
                                    
                                    strategyDiv.find('.hover-apply-strategy').find('.hover-apply-strategy-content').find('.applyStrategy').removeClass('applied');
                                    strategyDiv.find('.hover-apply-strategy').find('.hover-apply-strategy-content').find('.notApplyStrategy').removeClass('notApplied');
                                    strategyDiv.find('.hover-apply-strategy').find('.hover-apply-strategy-content').find('.documentStrategy').removeClass('documented');
                                    
                                    if(!strategyLi.is('.strategy-custom','.custom-added')){
                                        var strategy = strategyQuestions[strategyId]['details'];
                                        var defaultDiv = '<div class="strategy-undecided default-strategy-'+strategy.id+'">'
                                            defaultDiv += '<div>';
                                                defaultDiv += '<p class="strategy-description">'+strategy.description+'</p>';
                                                if(strategy.learnmore){
                                                    defaultDiv += '<a target="_blank" href="' + strategy.learnmore + '" class="learn-more right">Learn More <i class="icon-external-link"></i></a>';
                                                }
                                                defaultDiv += '<p class="strategy-question">Does this apply to you?</p>';
                                            defaultDiv += '</div>';
                                            defaultDiv += '<div class="button-group">';
                                                defaultDiv += '<a class="waves-effect waves-light btn btn-green" data-intentid="'+intentId+'" data-strategyid="'+strategy.id+'" id="initiateQuestionnaire">Yes</a>';
                                                defaultDiv += '<a class="waves-effect waves-light btn btn-white close-popout">No</a>';
                                            defaultDiv += '</div>';
                                        defaultDiv += '</div>';

                                        strategyLi.children('.collapsible-body').find('.strategy-not-applicable').remove();
                                        strategyLi.children('.collapsible-body').prepend(defaultDiv);
                                        var strategyQuestionnaire = strategyLi.children('.collapsible-body').children('.questionnaire-strategy-'+strategyId);
                                        
                                    //  strategyQuestionnaire.empty();
                                        // Begin loading questionnaire
                                    //  plaque.elements.questionBox(strategyQuestionnaire, intentId, strategyId, strategyQuestions[strategyId], strategyQuestions[strategyId]['firstquestion'],'','');
                                        strategyQuestionnaire.hide();
                                    }

                                    // refreshing filter data
                                    if($("#intent-filter span.filter-selected-text").text()=="No"){
                                        strategyLi.addClass('filter-applied');
                                    }

                                    var tooltip = $(this).parents('.qtip');
                                    if(tooltip.length){
                                        tooltip.toggle();
                                    }

                                }
                                // Again clicking Yes
                                e.stopPropagation();
                            });
                            // tooltip div - Yes clicked ends

                            // hover div - No clicked
                            $(".notApplyStrategy").on("click", function(e){
                                
                                if(!$(this).hasClass("notApplied")){
                                    var strategyId = $(this).data('strategyid');
                                    var intentId = $(this).data('intentid');
                                    
                                    var strategyDiv = $(".collapsible-header[data-strategyid="+strategyId+"]");
                                    
                                    var data = {};
                                    data["strategy_id"] = strategyId;
                                    data["status"] = 'not-applicable';
                                    data["update_flag"] = 'status';
                                    plaque.elements.updateStrategyStatus(buildingID, data);
                                    
                                    $(this).removeClass('applied');
                                    
                                    var questions = $.makeArray(strategyQuestions[strategyId]);
                                    $.each(questions, function(i, question) {
                                        if(typeof question != 'undefined'){
                                            plaque.elements.submitAnswer(buildingID, question['qid'], '');
                                        }
                                    });
                                    
                                    var strategyLi = strategyDiv.closest('li');
                                    
                                    /*Start logic for scoring*/
                                    var intentUl = strategyLi.parent('ul.collapsible');
                                    plaque.elements.calculateScore(buildingID, intentUl.data('intentid'));
                                    /*End logic for scoring*/
                                    
                                    strategyLi.removeClass('applicable').removeClass('attempted').removeClass('added').removeClass('not-added').addClass('not-applicable');
                                    
                                    strategyDiv.find('.strategy-action-menu').find('.strategy-action-nav').find('.applyStrategy').removeClass('applied');
                                    strategyDiv.find('.strategy-action-menu').find('.strategy-action-nav').find('.notApplyStrategy').addClass('notApplied');
                                    strategyDiv.find('.strategy-action-menu').find('.strategy-action-nav').find('.documentStrategy').removeClass('documented');
                                    strategyDiv.find('.strategy-action-menu').find('.strategy-action-nav').find('.unDecidedStrategy').removeClass('undecided');
                                    
                                    var actionMenu = strategyDiv.find('.strategy-action-menu').find('.hover-apply-strategy-content').find('.actionmenuStrategy');
                                    var actionQtipID = actionMenu.attr('aria-describedby');
                                    $('#'+actionQtipID).find('.strategy-action-nav').find('.applyStrategy').removeClass('applied');
                                    $('#'+actionQtipID).find('.strategy-action-nav').find('.notApplyStrategy').addClass('notApplied');
                                    $('#'+actionQtipID).find('.strategy-action-nav').find('.documentStrategy').removeClass('documented');
                                    $('#'+actionQtipID).find('.strategy-action-nav').find('.unDecidedStrategy').removeClass('undecided');
                                    
                                    strategyDiv.find('.hover-apply-strategy').find('.hover-apply-strategy-content').find('.applyStrategy').removeClass('applied');
                                    strategyDiv.find('.hover-apply-strategy').find('.hover-apply-strategy-content').find('.notApplyStrategy').addClass('notApplied');
                                    strategyDiv.find('.hover-apply-strategy').find('.hover-apply-strategy-content').find('.documentStrategy').removeClass('documented');
                                    
                                    if(!strategyLi.is('.strategy-custom','.custom-added')){
                                        if(!strategyLi.children('.collapsible-body').find('.strategy-not-applicable').length){
                                            var strategy = strategyQuestions[strategyId]['details'];
                                            var defaultDiv = '<div class="strategy-not-applicable default-strategy-'+strategy.id+'">'
                                                defaultDiv += '<div>';
                                                    defaultDiv += '<p class="strategy-description">'+strategy.description+'</p>';
                                                    if(strategy.learnmore){
                                                        defaultDiv += '<a target="_blank" href="' + strategy.learnmore + '" class="learn-more right">Learn More <i class="icon-external-link"></i></a>';
                                                    }
                                                    defaultDiv += '<p class="strategy-question">Does this apply to you?</p>';
                                                defaultDiv += '</div>';
                                                defaultDiv += '<div class="button-group">';
                                                    defaultDiv += '<a class="waves-effect waves-light btn btn-green" data-intentid="'+intentId+'" data-strategyid="'+strategy.id+'" id="initiateQuestionnaire">Yes</a>';
                                                    defaultDiv += '<a class="waves-effect waves-light btn btn-white close-popout">No</a>';
                                                defaultDiv += '</div>';
                                            defaultDiv += '</div>';

                                            strategyLi.children('.collapsible-body').find(".strategy-undecided").remove(); // YA testing changes
                                            strategyLi.children('.collapsible-body').find('.strategy-not-applicable').remove();
                                            strategyLi.children('.collapsible-body').prepend(defaultDiv);
                                            var strategyQuestionnaire = strategyLi.children('.collapsible-body').children('.questionnaire-strategy-'+strategyId);
                                            
                                        //  strategyQuestionnaire.empty();
                                            // Begin loading questionnaire
                                        //  plaque.elements.questionBox(strategyQuestionnaire, intentId, strategyId, strategyQuestions[strategyId], strategyQuestions[strategyId]['firstquestion'],'','');
                                            strategyQuestionnaire.hide();

                                        }else{
                                            strategyLi.children('.collapsible-body').find(".strategy-not-applicable").eq(0).show();
                                            strategyLi.children('.collapsible-body').find(".questionnaire").hide();
                                            strategyLi.children('.collapsible-body').find(".strategy-undecided").hide();
                                        }
                                    }
                                    
                                    // refreshing filter data                                    
                                    if($("#intent-filter span.filter-selected-text").text()=="Yes" ||
                                        $("#intent-filter span.filter-selected-text").text()=="All"){
                                        strategyLi.addClass('filter-applied');
                                    }

                                    var tooltip = $(this).parents('.qtip');
                                    if(tooltip.length){
                                        tooltip.toggle();
                                    }
                                }
                                // Again clicking No
                                else{
                                    var strategyId = $(this).data('strategyid');
                                    var intentId = $(this).data('intentid');
                                    
                                    var strategyDiv = $(".collapsible-header[data-strategyid="+strategyId+"]");

                                    var data = {};
                                    data["strategy_id"] = strategyId;
                                    data["status"] = 'undecided';
                                    data["update_flag"] = 'status';
                                    plaque.elements.updateStrategyStatus(buildingID, data);
                                    
                                    var questions = $.makeArray(strategyQuestions[strategyId]);
                                    $.each(questions, function(i, question) {
                                        if(typeof question != 'undefined'){
                                            plaque.elements.submitAnswer(buildingID, question['qid'], '');
                                        }
                                    });
                                    
                                    var strategyLi = strategyDiv.closest('li');
                                    
                                    /*Start logic for scoring*/
                                    var intentUl = strategyLi.parent('ul.collapsible');
                                    plaque.elements.calculateScore(buildingID, intentUl.data('intentid'));
                                    /*End logic for scoring*/
                                    
                                    strategyLi.removeClass('applicable').removeClass('attempted').removeClass('added').removeClass('not-added').removeClass('not-applicable').addClass('undecided');
                                    
                                    strategyDiv.find('.strategy-action-menu').find('.strategy-action-nav').find('.applyStrategy').removeClass('applied');
                                    strategyDiv.find('.strategy-action-menu').find('.strategy-action-nav').find('.notApplyStrategy').removeClass('notApplied');
                                    strategyDiv.find('.strategy-action-menu').find('.strategy-action-nav').find('.documentStrategy').removeClass('documented');
                                    strategyDiv.find('.strategy-action-menu').find('.strategy-action-nav').find('.unDecidedStrategy').addClass('undecided');
                                    
                                    var actionMenu = strategyDiv.find('.strategy-action-menu').find('.hover-apply-strategy-content').find('.actionmenuStrategy');
                                    var actionQtipID = actionMenu.attr('aria-describedby');
                                    $('#'+actionQtipID).find('.strategy-action-nav').find('.applyStrategy').removeClass('applied');
                                    $('#'+actionQtipID).find('.strategy-action-nav').find('.notApplyStrategy').removeClass('notApplied');
                                    $('#'+actionQtipID).find('.strategy-action-nav').find('.documentStrategy').removeClass('documented');
                                    $('#'+actionQtipID).find('.strategy-action-nav').find('.unDecidedStrategy').addClass('undecided');
                                    
                                    strategyDiv.find('.hover-apply-strategy').find('.hover-apply-strategy-content').find('.applyStrategy').removeClass('applied');
                                    strategyDiv.find('.hover-apply-strategy').find('.hover-apply-strategy-content').find('.notApplyStrategy').removeClass('notApplied');
                                    strategyDiv.find('.hover-apply-strategy').find('.hover-apply-strategy-content').find('.documentStrategy').removeClass('documented');
                                    
                                    if(!strategyLi.is('.strategy-custom','.custom-added')){
                                        if(!strategyLi.children('.collapsible-body').find('.strategy-undecided').length){
                                            var strategy = strategyQuestions[strategyId]['details'];
                                            var defaultDiv = '<div class="strategy-undecided default-strategy-'+strategy.id+'">'
                                                defaultDiv += '<div>';
                                                    defaultDiv += '<p class="strategy-description">'+strategy.description+'</p>';
                                                    if(strategy.learnmore){
                                                        defaultDiv += '<a target="_blank" href="' + strategy.learnmore + '" class="learn-more right">Learn More <i class="icon-external-link"></i></a>';
                                                    }
                                                    defaultDiv += '<p class="strategy-question">Does this apply to you?</p>';
                                                defaultDiv += '</div>';
                                                defaultDiv += '<div class="button-group">';
                                                    defaultDiv += '<a class="waves-effect waves-light btn btn-green" data-intentid="'+intentId+'" data-strategyid="'+strategy.id+'" id="initiateQuestionnaire">Yes</a>';
                                                    defaultDiv += '<a class="waves-effect waves-light btn btn-white close-popout">No</a>';
                                                defaultDiv += '</div>';
                                            defaultDiv += '</div>';

                                            strategyLi.children('.collapsible-body').find('.strategy-not-applicable').remove();
                                            strategyLi.children('.collapsible-body').prepend(defaultDiv);
                                            var strategyQuestionnaire = strategyLi.children('.collapsible-body').children('.questionnaire-strategy-'+strategyId);
                                            
                                        //   strategyQuestionnaire.empty();
                                            // Begin loading questionnaire
                                        //   plaque.elements.questionBox(strategyQuestionnaire, intentId, strategyId, strategyQuestions[strategyId], strategyQuestions[strategyId]['firstquestion'],'','');
                                            strategyQuestionnaire.hide();

                                        }else{
                                            strategyLi.children('.collapsible-body').find(".strategy-undecided").eq(0).show();
                                            strategyLi.children('.collapsible-body').find(".questionnaire").hide();
                                            strategyLi.children('.collapsible-body').find(".strategy-not-applicable").hide();
                                        }
                                    }

                                    // refreshing filter data
                                    
                                    if($("#intent-filter span.filter-selected-text").text()=="Yes"){
                                        strategyLi.addClass('filter-applied');
                                    }

                                }
                                // Again clicking No
                                e.stopPropagation();
                            });
                            // hover div - No clicked ends

                            // tooltip div - No clicked
                            $(document.body).on("click", ".apply-content .notApplyStrategy", function(e){
                                
                                if(!$(this).hasClass("notApplied")){

                                    var strategyId = $(this).data('strategyid');
                                    var intentId = $(this).data('intentid');
                                    
                                    var strategyDiv = $(".collapsible-header[data-strategyid="+strategyId+"]");
                                    
                                    var data = {};
                                    data["strategy_id"] = strategyId;
                                    data["status"] = 'not-applicable';
                                    data["update_flag"] = 'status';
                                    plaque.elements.updateStrategyStatus(buildingID, data);
                                    
                                    $(this).removeClass('applied');
                                    
                                    var questions = $.makeArray(strategyQuestions[strategyId]);
                                    $.each(questions, function(i, question) {
                                        if(typeof question != 'undefined'){
                                            plaque.elements.submitAnswer(buildingID, question['qid'], '');
                                        }
                                    });
                                    
                                    var strategyLi = strategyDiv.closest('li');
                                    
                                    /*Start logic for scoring*/
                                    var intentUl = strategyLi.parent('ul.collapsible');
                                    plaque.elements.calculateScore(buildingID, intentUl.data('intentid'));
                                    /*End logic for scoring*/
                                    
                                    strategyLi.removeClass('applicable').removeClass('attempted').removeClass('added').removeClass('not-added').addClass('not-applicable');
                                    
                                    strategyDiv.find('.strategy-action-menu').find('.strategy-action-nav').find('.applyStrategy').removeClass('applied');
                                    strategyDiv.find('.strategy-action-menu').find('.strategy-action-nav').find('.notApplyStrategy').addClass('notApplied');
                                    strategyDiv.find('.strategy-action-menu').find('.strategy-action-nav').find('.documentStrategy').removeClass('documented');
                                    strategyDiv.find('.strategy-action-menu').find('.strategy-action-nav').find('.unDecidedStrategy').removeClass('undecided');
                                    
                                    var actionMenu = strategyDiv.find('.strategy-action-menu').find('.hover-apply-strategy-content').find('.actionmenuStrategy');
                                    var actionQtipID = actionMenu.attr('aria-describedby');
                                    $('#'+actionQtipID).find('.strategy-action-nav').find('.applyStrategy').removeClass('applied');
                                    $('#'+actionQtipID).find('.strategy-action-nav').find('.notApplyStrategy').addClass('notApplied');
                                    $('#'+actionQtipID).find('.strategy-action-nav').find('.documentStrategy').removeClass('documented');
                                    $('#'+actionQtipID).find('.strategy-action-nav').find('.unDecidedStrategy').removeClass('undecided');
                                    
                                    strategyDiv.find('.hover-apply-strategy').find('.hover-apply-strategy-content').find('.applyStrategy').removeClass('applied');
                                    strategyDiv.find('.hover-apply-strategy').find('.hover-apply-strategy-content').find('.notApplyStrategy').addClass('notApplied');
                                    strategyDiv.find('.hover-apply-strategy').find('.hover-apply-strategy-content').find('.documentStrategy').removeClass('documented');
                                    
                                    if(!strategyLi.is('.strategy-custom','.custom-added')){
                                        if(!strategyLi.children('.collapsible-body').find('.strategy-not-applicable').length){
                                            var strategy = strategyQuestions[strategyId]['details'];
                                            var defaultDiv = '<div class="strategy-not-applicable default-strategy-'+strategy.id+'">'
                                                defaultDiv += '<div>';
                                                    defaultDiv += '<p class="strategy-description">'+strategy.description+'</p>';
                                                    if(strategy.learnmore){
                                                        defaultDiv += '<a target="_blank" href="' + strategy.learnmore + '" class="learn-more right">Learn More <i class="icon-external-link"></i></a>';
                                                    }
                                                    defaultDiv += '<p class="strategy-question">Does this apply to you?</p>';
                                                defaultDiv += '</div>';
                                                defaultDiv += '<div class="button-group">';
                                                    defaultDiv += '<a class="waves-effect waves-light btn btn-green" data-intentid="'+intentId+'" data-strategyid="'+strategy.id+'" id="initiateQuestionnaire">Yes</a>';
                                                    defaultDiv += '<a class="waves-effect waves-light btn btn-white close-popout">No</a>';
                                                defaultDiv += '</div>';
                                            defaultDiv += '</div>';

                                            strategyLi.children('.collapsible-body').find(".strategy-undecided").remove(); // YA testing changes
                                            strategyLi.children('.collapsible-body').find('.strategy-not-applicable').remove();
                                            strategyLi.children('.collapsible-body').prepend(defaultDiv);
                                            var strategyQuestionnaire = strategyLi.children('.collapsible-body').children('.questionnaire-strategy-'+strategyId);
                                            
                                        //  strategyQuestionnaire.empty();
                                            // Begin loading questionnaire
                                        //  plaque.elements.questionBox(strategyQuestionnaire, intentId, strategyId, strategyQuestions[strategyId], strategyQuestions[strategyId]['firstquestion'],'','');
                                            strategyQuestionnaire.hide();
                                            
                                        }else{
                                            strategyLi.children('.collapsible-body').find(".strategy-not-applicable").eq(0).show();
                                            strategyLi.children('.collapsible-body').find(".questionnaire").hide();
                                            strategyLi.children('.collapsible-body').find(".strategy-undecided").hide();
                                        }
                                    }
                                    
                                    // refreshing filter data
                                    
                                    if($("#intent-filter span.filter-selected-text").text()=="Yes" ||
                                        $("#intent-filter span.filter-selected-text").text()=="All"){
                                        strategyLi.addClass('filter-applied');
                                    }

                                    var tooltip = $(this).parents('.qtip');
                                    if(tooltip.length){
                                        tooltip.toggle();
                                    }
                                }
                                // Again clicking No
                                else{
                                    var strategyId = $(this).data('strategyid');
                                    var intentId = $(this).data('intentid');
                                    
                                    var strategyDiv = $(".collapsible-header[data-strategyid="+strategyId+"]");

                                    var data = {};
                                    data["strategy_id"] = strategyId;
                                    data["status"] = 'undecided';
                                    data["update_flag"] = 'status';
                                    plaque.elements.updateStrategyStatus(buildingID, data);
                                    
                                    var questions = $.makeArray(strategyQuestions[strategyId]);
                                    $.each(questions, function(i, question) {
                                        if(typeof question != 'undefined'){
                                            plaque.elements.submitAnswer(buildingID, question['qid'], '');
                                        }
                                    });
                                    
                                    var strategyLi = strategyDiv.closest('li');
                                    
                                    /*Start logic for scoring*/
                                    var intentUl = strategyLi.parent('ul.collapsible');
                                    plaque.elements.calculateScore(buildingID, intentUl.data('intentid'));
                                    /*End logic for scoring*/
                                    
                                    strategyLi.removeClass('applicable').removeClass('attempted').removeClass('added').removeClass('not-added').removeClass('not-applicable').addClass('undecided');
                                    
                                    strategyDiv.find('.strategy-action-menu').find('.strategy-action-nav').find('.applyStrategy').removeClass('applied');
                                    strategyDiv.find('.strategy-action-menu').find('.strategy-action-nav').find('.notApplyStrategy').removeClass('notApplied');
                                    strategyDiv.find('.strategy-action-menu').find('.strategy-action-nav').find('.documentStrategy').removeClass('documented');
                                    strategyDiv.find('.strategy-action-menu').find('.strategy-action-nav').find('.unDecidedStrategy').addClass('undecided');
                                    
                                    var actionMenu = strategyDiv.find('.strategy-action-menu').find('.hover-apply-strategy-content').find('.actionmenuStrategy');
                                    var actionQtipID = actionMenu.attr('aria-describedby');
                                    $('#'+actionQtipID).find('.strategy-action-nav').find('.applyStrategy').removeClass('applied');
                                    $('#'+actionQtipID).find('.strategy-action-nav').find('.notApplyStrategy').removeClass('notApplied');
                                    $('#'+actionQtipID).find('.strategy-action-nav').find('.documentStrategy').removeClass('documented');
                                    $('#'+actionQtipID).find('.strategy-action-nav').find('.unDecidedStrategy').addClass('undecided');
                                    
                                    strategyDiv.find('.hover-apply-strategy').find('.hover-apply-strategy-content').find('.applyStrategy').removeClass('applied');
                                    strategyDiv.find('.hover-apply-strategy').find('.hover-apply-strategy-content').find('.notApplyStrategy').removeClass('notApplied');
                                    strategyDiv.find('.hover-apply-strategy').find('.hover-apply-strategy-content').find('.documentStrategy').removeClass('documented');
                                    
                                    
                                    if(!strategyLi.is('.strategy-custom','.custom-added')){
                                        if(!strategyLi.children('.collapsible-body').find('.strategy-undecided').length){
                                            var strategy = strategyQuestions[strategyId]['details'];
                                            var defaultDiv = '<div class="strategy-undecided default-strategy-'+strategy.id+'">'
                                                defaultDiv += '<div>';
                                                    defaultDiv += '<p class="strategy-description">'+strategy.description+'</p>';
                                                    if(strategy.learnmore){
                                                        defaultDiv += '<a target="_blank" href="' + strategy.learnmore + '" class="learn-more right">Learn More <i class="icon-external-link"></i></a>';
                                                    }
                                                    defaultDiv += '<p class="strategy-question">Does this apply to you?</p>';
                                                defaultDiv += '</div>';
                                                defaultDiv += '<div class="button-group">';
                                                    defaultDiv += '<a class="waves-effect waves-light btn btn-green" data-intentid="'+intentId+'" data-strategyid="'+strategy.id+'" id="initiateQuestionnaire">Yes</a>';
                                                    defaultDiv += '<a class="waves-effect waves-light btn btn-white close-popout">No</a>';
                                                defaultDiv += '</div>';
                                            defaultDiv += '</div>';

                                            strategyLi.children('.collapsible-body').find('.strategy-not-applicable').remove();
                                            strategyLi.children('.collapsible-body').prepend(defaultDiv);
                                            var strategyQuestionnaire = strategyLi.children('.collapsible-body').children('.questionnaire-strategy-'+strategyId);
                                            
                                        //  strategyQuestionnaire.empty();
                                            // Begin loading questionnaire
                                        //  plaque.elements.questionBox(strategyQuestionnaire, intentId, strategyId, strategyQuestions[strategyId], strategyQuestions[strategyId]['firstquestion'],'','');
                                            strategyQuestionnaire.hide();

                                            var availableRequiredStrategy = plaque.elements.findRequiredStrategy(strategyId,requiredStrategies[intentId])[0];
                                            if(availableRequiredStrategy){
                                                if(availableRequiredStrategy.strategyid == strategyId){
                                                appliedRequiredStrategies[intentId] = $.grep(appliedRequiredStrategies[intentId], function(value) {
                                                      return value.strategyid != strategyId;
                                                    });
                                                plaque.elements.setRequiredProgress(intentId,requiredStrategies,appliedRequiredStrategies);
                                                }
                                            }
                                        }else{
                                            strategyLi.children('.collapsible-body').find(".strategy-undecided").eq(0).show();
                                            strategyLi.children('.collapsible-body').find(".questionnaire").hide();
                                            strategyLi.children('.collapsible-body').find(".strategy-not-applicable").hide();
                                        }
                                    }

                                    // refreshing filter data
                                    
                                    if($("#intent-filter span.filter-selected-text").text()=="Yes"){
                                        strategyLi.addClass('filter-applied');
                                    }

                                    var tooltip = $(this).parents('.qtip');
                                    if(tooltip.length){
                                        tooltip.toggle();
                                    }

                                }
                                // Again clicking No
                                e.stopPropagation();
                            });

                            // tooltip div - May be clicked
                            $(document.body).on('click', '.unDecidedStrategy', function(e) {
                            //$(".unDecidedStrategy").on("click", function(e){

                                var strategyId = $(this).data('strategyid');
                                var intentId = $(this).data('intentid');
                                
                                var strategyDiv = $(".collapsible-header[data-strategyid="+strategyId+"]");

                                var data = {};
                                data["strategy_id"] = strategyId;
                                data["status"] = 'undecided';
                                data["update_flag"] = 'status';
                                plaque.elements.updateStrategyStatus(buildingID, data);
                                
                                var questions = $.makeArray(strategyQuestions[strategyId]);
                                $.each(questions, function(i, question) {
                                    if(typeof question != 'undefined'){
                                        plaque.elements.submitAnswer(buildingID, question['qid'], '');
                                    }
                                });
                                
                                var strategyLi = strategyDiv.closest('li');
                                
                                /*Start logic for scoring*/
                                var intentUl = strategyLi.parent('ul.collapsible');
                                plaque.elements.calculateScore(buildingID, intentUl.data('intentid'));
                                /*End logic for scoring*/
                                
                                strategyLi.removeClass('applicable').removeClass('attempted').removeClass('added').removeClass('not-added').removeClass('not-applicable').addClass('undecided');
                                
                                strategyDiv.find('.strategy-action-menu').find('.strategy-action-nav').find('.applyStrategy').removeClass('applied');
                                strategyDiv.find('.strategy-action-menu').find('.strategy-action-nav').find('.notApplyStrategy').removeClass('notApplied');
                                strategyDiv.find('.strategy-action-menu').find('.strategy-action-nav').find('.documentStrategy').removeClass('documented');
                                strategyDiv.find('.strategy-action-menu').find('.strategy-action-nav').find('.unDecidedStrategy').addClass('undecided');
                                
                                var actionMenu = strategyDiv.find('.strategy-action-menu').find('.hover-apply-strategy-content').find('.actionmenuStrategy');
                                var actionQtipID = actionMenu.attr('aria-describedby');
                                $('#'+actionQtipID).find('.strategy-action-nav').find('.applyStrategy').removeClass('applied');
                                $('#'+actionQtipID).find('.strategy-action-nav').find('.notApplyStrategy').removeClass('notApplied');
                                $('#'+actionQtipID).find('.strategy-action-nav').find('.documentStrategy').removeClass('documented');
                                $('#'+actionQtipID).find('.strategy-action-nav').find('.unDecidedStrategy').addClass('undecided');
                                
                                strategyDiv.find('.hover-apply-strategy').find('.hover-apply-strategy-content').find('.applyStrategy').removeClass('applied');
                                strategyDiv.find('.hover-apply-strategy').find('.hover-apply-strategy-content').find('.notApplyStrategy').removeClass('notApplied');
                                strategyDiv.find('.hover-apply-strategy').find('.hover-apply-strategy-content').find('.documentStrategy').removeClass('documented');
                                
                                
                                if(!strategyLi.is('.strategy-custom','.custom-added')){
                                    if(!strategyLi.children('.collapsible-body').find(".strategy-undecided").length){
                                        var strategy = strategyQuestions[strategyId]['details'];
                                        var defaultDiv = '<div class="strategy-undecided default-strategy-'+strategy.id+'">'
                                            defaultDiv += '<div>';
                                                defaultDiv += '<p class="strategy-description">'+strategy.description+'</p>';
                                                if(strategy.learnmore){
                                                    defaultDiv += '<a target="_blank" href="' + strategy.learnmore + '" class="learn-more right">Learn More <i class="icon-external-link"></i></a>';
                                                }
                                                defaultDiv += '<p class="strategy-question">Does this apply to you?</p>';
                                            defaultDiv += '</div>';
                                            defaultDiv += '<div class="button-group">';
                                                defaultDiv += '<a class="waves-effect waves-light btn btn-green" data-intentid="'+intentId+'" data-strategyid="'+strategy.id+'" id="initiateQuestionnaire">Yes</a>';
                                                defaultDiv += '<a class="waves-effect waves-light btn btn-white close-popout">No</a>';
                                            defaultDiv += '</div>';
                                        defaultDiv += '</div>';

                                        strategyLi.children('.collapsible-body').find('.strategy-not-applicable').remove();
                                        strategyLi.children('.collapsible-body').prepend(defaultDiv);
                                        
                                        
                                        var strategyQuestionnaire = strategyLi.children('.collapsible-body').children('.questionnaire-strategy-'+strategyId);
                                        
                                    //  strategyQuestionnaire.empty();
                                        // Begin loading questionnaire
                                    //  plaque.elements.questionBox(strategyQuestionnaire, intentId, strategyId, strategyQuestions[strategyId], strategyQuestions[strategyId]['firstquestion'],'','');
                                        strategyQuestionnaire.hide();
                                        /*
                                        var availableRequiredStrategy = plaque.elements.findRequiredStrategy(strategyId,requiredStrategies[intentId])[0];
                                        if(availableRequiredStrategy){
                                            if(availableRequiredStrategy.strategyid == strategyId){
                                            appliedRequiredStrategies[intentId] = $.grep(appliedRequiredStrategies[intentId], function(value) {
                                                  return value.strategyid != strategyId;
                                                });
                                            plaque.elements.setRequiredProgress(intentId,requiredStrategies,appliedRequiredStrategies);
                                            }
                                        }*/
                                    }
                                    else{
                                        strategyLi.children('.collapsible-body').find(".strategy-undecided").eq(0).show();
                                        strategyLi.children('.collapsible-body').find(".questionnaire").hide();
                                    }
                                }
                                
                                // refreshing filter data
                                if($("#intent-filter span.filter-selected-text").text()=="Yes"){
                                    strategyLi.addClass('filter-applied');
                                }

                                var tooltip = $(this).parents('.qtip');
                                if(tooltip.length){
                                    tooltip.toggle();
                                }

                                e.stopPropagation();
                            });

                            // hover div - documentStrategy clicked
                            $(".documentStrategy").on("click", function(e){
                                var strategyId = $(this).data('strategyid');
                                var intentId = $(this).data('intentid');
                                
                                var strategyDiv = $(".collapsible-header[data-strategyid="+strategyId+"]").parent('li').children('.collapsible-body');
                                var strategyLi = strategyDiv.closest('li');
                                if(!strategyLi.is('.strategy-custom','.custom-added')){

                                    var strategyQuestionnaire = strategyDiv.children('.questionnaire-strategy-'+strategyId);
                                    if(!strategyQuestionnaire.find('.strategy-success').length){
                                        plaque.elements.questionBox(strategyQuestionnaire, intentId, strategyId, strategyQuestions[strategyId], '','success','');
                                    }
                                    
                                    strategyQuestionnaire.siblings().hide();
                                    strategyQuestionnaire.show();

                                    $(this).siblings(".applyStrategy").addClass("applied");
                                    $(this).siblings(".notApplyStrategy").removeClass("notApplied");
                                    $(this).parents(".hover-apply-strategy").siblings(".strategy-action-menu").find(".notApplyStrategy").removeClass("notApplied");
                                    $(this).parents(".hover-apply-strategy").siblings(".strategy-action-menu").find(".applyStrategy").addClass("applied");
                                    $(this).parents(".hover-apply-strategy").siblings(".strategy-action-menu").find('.unDecidedStrategy').removeClass('undecided');

                                    var actionMenu = $(this).parents(".hover-apply-strategy").siblings(".strategy-action-menu").find('.hover-apply-strategy-content').find('.actionmenuStrategy');
                                    
                                    var actionQtipID = actionMenu.attr('aria-describedby');
                                    
                                //  $('#'+actionQtipID).find('.strategy-action-nav').find('.documentStrategy').addClass('documented');
                                    
                                    $('#'+actionQtipID).find('.strategy-action-nav').find('.applyStrategy').addClass('applied');
                                    $('#'+actionQtipID).find('.strategy-action-nav').find('.notApplyStrategy').removeClass('notApplied');
                                    $('#'+actionQtipID).find('.strategy-action-nav').find('.unDecidedStrategy').removeClass('undecided');
                                }
                                var tooltip = $(this).parents('.qtip');
                                if(tooltip.length){
                                    $(".collapsible-header[data-strategyid="+strategyId+"]").click();
                                    tooltip.toggle();
                                }
                                
                                /*var data = {};
                                data["strategy_id"] = strategyId;
                                data["status"] = 'applicable';
                                data["update_flag"] = 'status';
                                plaque.elements.updateStrategyStatus(buildingID, data);
                                
                                var strategyLi = $(this).closest('li');
                                strategyLi.removeClass('not-applicable').removeClass('.not-added').addClass('applicable');*/

                                //e.stopPropagation();
                            });
                            
                            // tooltip div - documentStrategy clicked
                            $(document.body).off('click', '.navDocumentStrategy').on('click', '.navDocumentStrategy', function(e) {
                                
                                var strategyId = $(this).find('.documentStrategy').data('strategyid');
                                var intentId = $(this).find('.documentStrategy').data('intentid');
                                
                                var strategyDiv = $(".collapsible-header[data-strategyid="+strategyId+"]");//.parent('li').children('.collapsible-body');
                                var strategyLi = strategyDiv.closest('li');

                                if(!strategyLi.is('.strategy-custom','.custom-added')){                 
                                    var strategyQuestionnaire = strategyDiv.parent('li').children('.collapsible-body').children('.questionnaire-strategy-'+strategyId);
                                    if(!strategyQuestionnaire.find('.strategy-success').length){
                                        plaque.elements.questionBox(strategyQuestionnaire, intentId, strategyId, strategyQuestions[strategyId], '','success','');
                                    }
                                    
                                    strategyQuestionnaire.siblings().hide();
                                    strategyQuestionnaire.show();

                                    strategyDiv.find('.hover-apply-strategy').find('.hover-apply-strategy-content').find('.applyStrategy').addClass('applied');
                                    strategyDiv.find('.hover-apply-strategy').find('.hover-apply-strategy-content').find('.notApplyStrategy').removeClass('notApplied');

                                    strategyDiv.find('.strategy-action-menu').find('.strategy-action-nav').find('.applyStrategy').addClass('applied');
                                    strategyDiv.find('.strategy-action-menu').find('.strategy-action-nav').find('.notApplyStrategy').removeClass('notApplied');
                                    strategyDiv.find('.strategy-action-menu').find('.strategy-action-nav').find('.unDecidedStrategy').removeClass('undecided');

                                    var actionMenu = strategyDiv.find('.strategy-action-menu').find('.hover-apply-strategy-content').find('.actionmenuStrategy');
                                    var actionQtipID = actionMenu.attr('aria-describedby');
                                    
                                    $('#'+actionQtipID).find('.strategy-action-nav').find('.applyStrategy').addClass('applied');
                                    $('#'+actionQtipID).find('.strategy-action-nav').find('.notApplyStrategy').removeClass('notApplied');
                                    $('#'+actionQtipID).find('.strategy-action-nav').find('.unDecidedStrategy').removeClass('undecided');
                                    //

                                }
                                var tooltip = $(this).find('.documentStrategy').parents('.qtip');
                                if(tooltip.length){
                                    $(".collapsible-header[data-strategyid="+strategyId+"]").click();
                                    tooltip.toggle();
                                }
                                
                                /*var data = {};
                                data["strategy_id"] = strategyId;
                                data["status"] = 'applicable';
                                data["update_flag"] = 'status';
                                plaque.elements.updateStrategyStatus(buildingID, data);
                                
                                var strategyLi = $(this).closest('li');
                                strategyLi.removeClass('not-applicable').removeClass('.not-added').addClass('applicable');*/

                                //e.stopPropagation();
                            });             
                            
                            //  hover div - starStrategy clicked
                            $(".starStrategy").on('click', function(e) {
                                // console.log("starStrategy");
                                var strategyId = $(this).data('strategyid');
                                var intentId = $(this).data('intentid');
                                
                                var strategyDiv = $(".collapsible-header[data-strategyid="+strategyId+"]");
                                
                                var data = {};
                                data["strategy_id"] = strategyId;
                                
                                if($(this).hasClass('favorite')){
                                    data["favorite"] = 'False';
                                    $(this).removeClass('favorite')
                                    strategyDiv.find('.strategy-action-menu').find('.strategy-action-nav').find('.starStrategy').removeClass('favorite');
                                    var actionMenu = strategyDiv.find('.strategy-action-menu').find('.hover-apply-strategy-content').find('.actionmenuStrategy');
                                    var actionQtipID = actionMenu.attr('aria-describedby');
                                    $('#'+actionQtipID).find('.strategy-action-nav').find('.starStrategy').removeClass('favorite');
                                    strategyDiv.find('.hover-apply-strategy').find('.hover-apply-strategy-content').find('.starStrategy').removeClass('favorite');
                                }else{
                                    data["favorite"] = 'True';
                                    $(this).addClass('favorite')
                                    strategyDiv.find('.strategy-action-menu').find('.strategy-action-nav').find('.starStrategy').addClass('favorite');
                                    var actionMenu = strategyDiv.find('.strategy-action-menu').find('.hover-apply-strategy-content').find('.actionmenuStrategy');
                                    var actionQtipID = actionMenu.attr('aria-describedby');
                                    $('#'+actionQtipID).find('.strategy-action-nav').find('.starStrategy').addClass('favorite');
                                    strategyDiv.find('.hover-apply-strategy').find('.hover-apply-strategy-content').find('.starStrategy').addClass('favorite');
                                }
                                
                                data["update_flag"] = 'favorite';
                                plaque.elements.updateStrategyStatus(buildingID, data);
                                
                                var tooltip = $(this).parents('.qtip');
                                if(tooltip.length){
                                    tooltip.toggle();
                                }

                                e.stopPropagation();
                            });

                            // tooltip div - starStrategy clicked
                            $(document.body).off('click', '.navStarStrategy').on('click', '.navStarStrategy', function(e) {
                                var strategyId = $(this).find('.starStrategy').data('strategyid');
                                var intentId = $(this).find('.starStrategy').data('intentid');
                                
                                var strategyDiv = $(".collapsible-header[data-strategyid="+strategyId+"]");
                                
                                var data = {};
                                data["strategy_id"] = strategyId;
                                
                                if($(this).find('.starStrategy').hasClass('favorite')){
                                    data["favorite"] = 'False';
                                    $(this).find('.starStrategy').removeClass('favorite')
                                    strategyDiv.find('.strategy-action-menu').find('.strategy-action-nav').find('.starStrategy').removeClass('favorite');
                                    var actionMenu = strategyDiv.find('.strategy-action-menu').find('.hover-apply-strategy-content').find('.actionmenuStrategy');
                                    var actionQtipID = actionMenu.attr('aria-describedby');
                                    $('#'+actionQtipID).find('.strategy-action-nav').find('.starStrategy').removeClass('favorite');
                                    strategyDiv.find('.hover-apply-strategy').find('.hover-apply-strategy-content').find('.starStrategy').removeClass('favorite');
                                }else{
                                    data["favorite"] = 'True';
                                    $(this).find('.starStrategy').addClass('favorite')
                                    strategyDiv.find('.strategy-action-menu').find('.strategy-action-nav').find('.starStrategy').addClass('favorite');
                                    var actionMenu = strategyDiv.find('.strategy-action-menu').find('.hover-apply-strategy-content').find('.actionmenuStrategy');
                                    var actionQtipID = actionMenu.attr('aria-describedby');
                                    $('#'+actionQtipID).find('.strategy-action-nav').find('.starStrategy').addClass('favorite');
                                    strategyDiv.find('.hover-apply-strategy').find('.hover-apply-strategy-content').find('.starStrategy').addClass('favorite');
                                }
                                
                                data["update_flag"] = 'favorite';
                                plaque.elements.updateStrategyStatus(buildingID, data);
                                
                                var tooltip = $(this).find('.starStrategy').parents('.qtip');
                                if(tooltip.length){
                                    tooltip.toggle();
                                }
                                e.stopPropagation();
                            });
                            
                            // close popout - when No is clicked starts
                            $(document.body).on('click', '.close-popout', function(event) {

                                var object =$(this).closest('.collapsible');
                                $panel_headers = object.find('> li > .collapsible-header');
                                   
                                if (object.hasClass('active')) {
                                    object.parent().addClass('active');
                                }
                                else {
                                    object.parent().removeClass('active');
                                }
                                if (object.parent().hasClass('active')){
                                    //$(this).siblings('.hover-apply-strategy').hide();
                                    //$(this).siblings('.hover-select-strategy').hide();
                                    object.siblings('.collapsible-body').stop(true,false).slideDown({ duration: 350, easing: "easeOutQuart", queue: false, complete: function() {$(this).css('height', '');}});
                                }
                                else{
                                  object.siblings('.collapsible-body').stop(true,false).slideUp({ duration: 350, easing: "easeOutQuart", queue: false, complete: function() {$(this).css('height', '');}});
                                }
                                object.find('.strategy-action-menu').show();
                                $panel_headers.not(object).removeClass('active').parent().removeClass('active');
                                $panel_headers.not(object).parent().children('.collapsible-body').stop(true,false).slideUp(
                                  {
                                    duration: 350,
                                    easing: "easeOutQuart",
                                    queue: false,
                                    complete:
                                      function() {
                                        $(this).css('height', '');
                                      }
                                  });
                            });
                            // close popout - when No is clicked ends

                            // initiate questionnaire - click Yes on first screen starts
                        //  $(document.body).on('click', '#initiateQuestionnaire', function(event) {
                            $(document.body).off('click', '#initiateQuestionnaire').on('click', '#initiateQuestionnaire', function(event) {
                                
                                var strategyId = $(this).data('strategyid');
                                var intentId = $(this).data('intentid');
                                
                                var data = {};
                                data["strategy_id"] = strategyId;
                                data["status"] = 'applicable';
                                data["update_flag"] = 'status';
                                plaque.elements.updateStrategyStatus(buildingID, data);
                    
                                var strategyDiv = $(this).closest('.default-strategy-'+strategyId);
                                var strategyQuestionnaire = strategyDiv.siblings('.questionnaire-strategy-'+strategyId);
                                
                                
                                var listrategyDiv = $(".collapsible-header[data-strategyid="+strategyId+"]");
                                
                                var strategyLi = $(this).closest('li');
                                /*Start logic for scoring*/
                                var intentUl = strategyLi.parent('ul.collapsible');
                                plaque.elements.calculateScore(buildingID, intentUl.data('intentid'));
                                /*End logic for scoring*/
                                strategyLi.removeClass().addClass('applicable active strategy-system');
                                listrategyDiv.find('.hover-apply-strategy').find('.hover-apply-strategy-content').find('.applyStrategy').addClass('applied');
                                listrategyDiv.find('.hover-apply-strategy').find('.hover-apply-strategy-content').find('.notApplyStrategy').removeClass('notApplied');
                                
                                listrategyDiv.find('.strategy-action-menu').find('.strategy-action-nav').find('.applyStrategy').addClass('applied');
                                listrategyDiv.find('.strategy-action-menu').find('.strategy-action-nav').find('.notApplyStrategy').removeClass('notApplied');
                                listrategyDiv.find('.strategy-action-menu').find('.strategy-action-nav').find('.unDecidedStrategy').removeClass('undecided');
                                
                                var actionMenu = listrategyDiv.find('.strategy-action-menu').find('.hover-apply-strategy-content').find('.actionmenuStrategy');
                                var actionQtipID = actionMenu.attr('aria-describedby');
                                $('#'+actionQtipID).find('.strategy-action-nav').find('.applyStrategy').addClass('applied');
                                $('#'+actionQtipID).find('.strategy-action-nav').find('.notApplyStrategy').removeClass('notApplied');
                                $('#'+actionQtipID).find('.strategy-action-nav').find('.unDecidedStrategy').removeClass('undecided');

                                strategyDiv.hide();
                                
                                strategyQuestionnaire.empty();
                                // Begin loading questionnaire
                                var questions = plaque.elements.getQuestions(intentId, strategyId);
                                
                                $.each(questions.questions, function(i, question) {                                            
                                    var question_data = question.question;
                                    if(strategyQuestions[strategyId].length === 0) 
                                        strategyQuestions[strategyId]['firstquestion'] = question_data.question_original_id;
                                    strategyQuestions[strategyId][question_data.question_original_id] = [];
                                    strategyQuestions[strategyId][question_data.question_original_id]['qid'] = question_data.id;
                                    strategyQuestions[strategyId][question_data.question_original_id]['question'] = question_data.question;
                                    strategyQuestions[strategyId][question_data.question_original_id]['qtype'] = question_data.qtype;
                                    strategyQuestions[strategyId][question_data.question_original_id]['min_val'] = question_data.min_val;
                                    strategyQuestions[strategyId][question_data.question_original_id]['max_val'] = question_data.max_val;
                                    strategyQuestions[strategyId][question_data.question_original_id]['existinganswer'] = question_data.answer;
                                    strategyQuestions[strategyId][question_data.question_original_id]['gotoquestion'] = question_data.goto_question;
                                    strategyQuestions[strategyId][question_data.question_original_id]['direct_outcome'] = question_data.direct_outcome;
                                    var choices = [];
                                    $.each(question.choices, function(i, choice) {
                                        choices.push({"key":choice.key,"value":choice.value,"gotoquestion":choice.goto_question,"direct_outcome":choice.direct_outcome});
                                    });
                                    strategyQuestions[strategyId][question_data.question_original_id]['answers'] = choices;
                                    
                                });

                                plaque.elements.questionBox(strategyQuestionnaire, intentId, strategyId, strategyQuestions[strategyId], strategyQuestions[strategyId]['firstquestion'],'','');
                                
                                strategyQuestionnaire.show();
                                
                                /*
                                var availableRequiredStrategy = plaque.elements.findRequiredStrategy(strategyId,requiredStrategies[intentId])[0];
                                if(availableRequiredStrategy){
                                    if(availableRequiredStrategy.strategyid == strategyId){
                                        appliedRequiredStrategies[intentId].push({'strategyid':strategyId});
                                        plaque.elements.setRequiredProgress(intentId,requiredStrategies,appliedRequiredStrategies);
                                    }
                                }
                                */

                            });
                            // initiate questionnaire - click Yes on first screen ends

                            // questionnaire - click Yes on second screen starts
                            $(document.body).off('click', '.answerbutton').on('click', '.answerbutton', function(event) {
                                
                                var strategyId = $(this).data('strategyid');
                                var intentId = $(this).data('intentid');
                                var currentQuestionId = $(this).data('currentquestion');
                                var questionDetails = strategyQuestions[strategyId][currentQuestionId];
                                var questionId = questionDetails['qid'];
                                var questionType = questionDetails['qtype'];

                                var answer = '';
                                if(questionType == 'radio') {
                                    answer = $(this).val();
                                }else if (questionType == 'yesno') {
                                    answer = $(this).data('value');
                                }else if (questionType == 'text') {
                                    answer = $(this).prev("input[id="+currentQuestionId+"]").val();
                                }else if (questionType == 'narrative') {
                                    answer = $(this).closest('.questionnaire-strategy-'+strategyId).find('textarea').val();
                                }else if (questionType == 'select') {
                                    answer = $(this).val();
                                }else if (questionType == 'slider') {
                                    answer = $("#slider-value").val();
                                }
                                
                                if(questionType != 'file'){
                                    plaque.elements.submitAnswer(buildingID, questionId, answer);   
                                }
                                
                                var strategyQuestionnaire = $(this).closest('.questionnaire-strategy-'+strategyId);
                                
                                // Disable all buttons currently on the page 
                                //$('.answerbutton').attr('disabled', 'disabled');
                                // Load the next question
                                plaque.elements.questionBox(strategyQuestionnaire, intentId, strategyId, strategyQuestions[strategyId], $(this).data('goto'),$(this).data('directoutcome'),currentQuestionId);
                            });
                            // questionnaire - click Yes on second screen ends

                            // questionnaire - click Continue in failure screen starts
                            $(document.body).off('click', '.strategy-fail #continueq').on('click', '.strategy-fail #continueq', function(event) {
                                var strategyId = $(this).data('strategyid');
                                var intentId = $(this).data('intentid');
                                
                                var strategyLi = $(this).closest('li');
                                /*Start logic for scoring*/
                                var intentUl = strategyLi.parent('ul.collapsible');
                                plaque.elements.calculateScore(buildingID, intentUl.data('intentid'));
                                /*End logic for scoring*/
                                
                                //plaque.elements.closePopout($(this));
                                
                                //Load the fail screen
                                var strategyDiv = strategyLi.children('.default-strategy-'+strategyId);
                                var strategyQuestionnaire = strategyLi.children('.questionnaire-strategy-'+strategyId);

                                var questions = plaque.elements.getQuestions(intentId, strategyId);
                                                                
                                $.each(questions.questions, function(i, question) {                                            
                                    var question_data = question.question;
                                    if(strategyQuestions[strategyId].length === 0) 
                                        strategyQuestions[strategyId]['firstquestion'] = question_data.question_original_id;
                                    strategyQuestions[strategyId][question_data.question_original_id] = [];
                                    strategyQuestions[strategyId][question_data.question_original_id]['qid'] = question_data.id;
                                    strategyQuestions[strategyId][question_data.question_original_id]['question'] = question_data.question;
                                    strategyQuestions[strategyId][question_data.question_original_id]['qtype'] = question_data.qtype;
                                    strategyQuestions[strategyId][question_data.question_original_id]['min_val'] = question_data.min_val;
                                    strategyQuestions[strategyId][question_data.question_original_id]['max_val'] = question_data.max_val;
                                    strategyQuestions[strategyId][question_data.question_original_id]['existinganswer'] = question_data.answer;
                                    strategyQuestions[strategyId][question_data.question_original_id]['gotoquestion'] = question_data.goto_question;
                                    strategyQuestions[strategyId][question_data.question_original_id]['direct_outcome'] = question_data.direct_outcome;
                                    var choices = [];
                                    $.each(question.choices, function(i, choice) {
                                        choices.push({"key":choice.key,"value":choice.value,"gotoquestion":choice.goto_question,"direct_outcome":choice.direct_outcome});
                                    });
                                    strategyQuestions[strategyId][question_data.question_original_id]['answers'] = choices;                                    
                                });

                                plaque.elements.questionBox(strategyQuestionnaire, intentId, strategyId, strategyQuestions[strategyId], '','fail','');
                                strategyDiv.hide();
                                strategyQuestionnaire.show();
                                
                                //plaque.elements.updateLinkToCertification();
                                
                                $('.close-popout').click();
                            });
                            // questionnaire - click Continue on failure screen ends

                        //  questionnaire - click Back to Last Step on failure/success screen starts
                        //  $(document.body).on('click', '#restartq', function(event) {
                            $(document.body).off('click', '#restartq').on('click', '#restartq', function(event) {
                                
                                var strategyId = $(this).data('strategyid');

                                var filesToDelete = [];
                                var filesCount = $("#elements_questionnaire_upload-"+strategyId+" .files-list i").length;
                                if(filesCount>=1){
                                    for(var i=0; i<filesCount; i++){
                                        filesToDelete[i] = $("#elements_questionnaire_upload-"+strategyId+" .files-list i").eq(i).data("filename")
                                    }
                                    plaque.elements.deleteStrategyUploadsForLastStepAWS(filesToDelete, strategyId);
                                }

                                var intentId = $(this).data('intentid');                                
                                var data = {};
                                data["strategy_id"] = strategyId;
                                data["status"] = 'applicable';//'added';
                                data["update_flag"] = 'status';
                                plaque.elements.updateStrategyStatus(buildingID, data);
                                var questions = $.makeArray(strategyQuestions[strategyId]);
                                $.each(questions, function(i, question) {
                                    if(typeof question != 'undefined'){
                                        plaque.elements.submitAnswer(buildingID, question['qid'], '');
                                    }
                                });

                                var strategyLi = $(this).closest('li');
                                
                                /*Start logic for scoring*/
                                var intentUl = strategyLi.parent('ul.collapsible');
                                plaque.elements.calculateScore(buildingID, intentUl.data('intentid'));
                                /*End logic for scoring*/
                                
                                strategyLi.removeClass().addClass('applicable active strategy-system');
                                var strategyQuestionnaire = $(this).closest('.questionnaire-strategy-'+strategyId);
                                
                                strategyQuestionnaire.empty();
                                // Begin loading questionnaire

                                var questions = plaque.elements.getQuestions(intentId, strategyId);
                                
                                $.each(questions.questions, function(i, question) {
                                            
                                    var question_data = question.question;
                                    if(strategyQuestions[strategyId].length === 0) 
                                        strategyQuestions[strategyId]['firstquestion'] = question_data.question_original_id;
                                    strategyQuestions[strategyId][question_data.question_original_id] = [];
                                    strategyQuestions[strategyId][question_data.question_original_id]['qid'] = question_data.id;
                                    strategyQuestions[strategyId][question_data.question_original_id]['question'] = question_data.question;
                                    strategyQuestions[strategyId][question_data.question_original_id]['qtype'] = question_data.qtype;
                                    strategyQuestions[strategyId][question_data.question_original_id]['min_val'] = question_data.min_val;
                                    strategyQuestions[strategyId][question_data.question_original_id]['max_val'] = question_data.max_val;
                                    strategyQuestions[strategyId][question_data.question_original_id]['existinganswer'] = question_data.answer;
                                    strategyQuestions[strategyId][question_data.question_original_id]['gotoquestion'] = question_data.goto_question;
                                    strategyQuestions[strategyId][question_data.question_original_id]['direct_outcome'] = question_data.direct_outcome;
                                    var choices = [];
                                    $.each(question.choices, function(i, choice) {
                                        choices.push({"key":choice.key,"value":choice.value,"gotoquestion":choice.goto_question,"direct_outcome":choice.direct_outcome});
                                    });
                                    strategyQuestions[strategyId][question_data.question_original_id]['answers'] = choices;                                    
                                });

                                plaque.elements.questionBox(strategyQuestionnaire, intentId, strategyId, strategyQuestions[strategyId], strategyQuestions[strategyId]['firstquestion'],'','');
                                
                                strategyQuestionnaire.show();
                            });
                            // questionnaire - click Back to Last Step on failure/success ends


                            // success screen - ciick on Complete Credit starts
                        //  $(document.body).on('click', '.strategy-document #completeq, .strategy-success #completeq', function(event) {
                            $(document.body).off('click', '.strategy-document #completeq, .strategy-success #completeq').on('click', '.strategy-document #completeq, .strategy-success #completeq', function(event) {
                                
                                var strategyId = $(this).data('strategyid');
                                var intentId = $(this).data('intentid');
                                var data = {};
                                data["strategy_id"] = strategyId;
                                data["status"] = 'attempted';
                                data["update_flag"] = 'status';
                                plaque.elements.updateStrategyStatus(buildingID, data);
                                
                                var strategyDiv = $(".collapsible-header[data-strategyid="+strategyId+"]");
                                
                                var strategyLi = $(this).closest('li');
                                /*Start logic for scoring*/
                                var intentUl = strategyLi.parent('ul.collapsible');
                                plaque.elements.calculateScore(buildingID, intentUl.data('intentid'));
                                /*End logic for scoring*/
                                //if(!strategyLi.hasClass("attempted")){
                                    strategyLi.removeClass().addClass('attempted');
                                    //strategyLi.prepend('<i class="fa fa-file-o"></i>');
                                    strategyDiv.find('.strategy-action-menu').find('.strategy-action-nav').find('.documentStrategy').addClass('documented');
                                    strategyDiv.find('.hover-apply-strategy').find('.hover-apply-strategy-content').find('.documentStrategy').addClass('documented');
                                    
                                    strategyDiv.find('.strategy-action-menu').find('.strategy-action-nav').find('.applyStrategy').addClass('applied');
                                    strategyDiv.find('.strategy-action-menu').find('.strategy-action-nav').find('.notApplyStrategy').removeClass('notApplied');
                                    
                                    var actionMenu = strategyDiv.find('.strategy-action-menu').find('.hover-apply-strategy-content').find('.actionmenuStrategy');
                                    var actionQtipID = actionMenu.attr('aria-describedby');
                                    $('#'+actionQtipID).find('.strategy-action-nav').find('.documentStrategy').addClass('documented');
                                    
                                    $('#'+actionQtipID).find('.strategy-action-nav').find('.applyStrategy').addClass('applied');
                                    $('#'+actionQtipID).find('.strategy-action-nav').find('.notApplyStrategy').removeClass('notApplied');
                                    $('#'+actionQtipID).find('.strategy-action-nav').find('.unDecidedStrategy').removeClass('undecided');
                                    
                                    strategyDiv.find('.hover-apply-strategy').find('.hover-apply-strategy-content').find('.applyStrategy').addClass('applied');
                                //  strategyDiv.find('.hover-apply-strategy').find('.hover-apply-strategy-content').find('.notApplyStrategy').addClass('notApplied');
                                //}
                                
                                //plaque.elements.updateLinkToCertification();

                                //Load the document completion screen
                                //var strategyQuestionnaire = $(this).closest('.questionnaire-strategy-'+strategyId);
                                //plaque.elements.questionBox(strategyQuestionnaire, intentId, strategyId, strategyQuestions[strategyId], '','document','');
                                //strategyQuestionnaire.show();
                                //plaque.elements.closePopout($(this));
                                $('.close-popout').click();
                                
                            });
                            // success screen - ciick on Complete Credit ends

                            // success screen -  Click on SKIP starts
                            $(document.body).on('click', '.strategy-success #continueq', function(event) {

                                var object =$(this).closest('.collapsible');
                                $panel_headers = object.find('> li > .collapsible-header');
                   
                                if (object.hasClass('active')) {
                                    object.parent().addClass('active');
                                }
                                else {
                                    object.parent().removeClass('active');
                                }
                                if (object.parent().hasClass('active')){
                                    //$(this).siblings('.hover-apply-strategy').hide();
                                    //$(this).siblings('.hover-select-strategy').hide();
                                    object.siblings('.collapsible-body').stop(true,false).slideDown({ duration: 350, easing: "easeOutQuart", queue: false, complete: function() {$(this).css('height', '');}});
                                }
                                else{
                                  object.siblings('.collapsible-body').stop(true,false).slideUp({ duration: 350, easing: "easeOutQuart", queue: false, complete: function() {$(this).css('height', '');}});
                                }
                                object.find('.strategy-action-menu').show();
                                $panel_headers.not(object).removeClass('active').parent().removeClass('active');
                                $panel_headers.not(object).parent().children('.collapsible-body').stop(true,false).slideUp(
                                  {
                                    duration: 350,
                                    easing: "easeOutQuart",
                                    queue: false,
                                    complete:
                                      function() {
                                        $(this).css('height', '');
                                      }
                                  });
                                
                            });
                            // success screen -  Click on SKIP ends

                            // success screen -  Click on Next Strategy starts
                            $(document.body).off('click', '.strategy-success #next-strategy').on('click', '.strategy-success #next-strategy', function(event) {
                                $(this).closest('li').next().find('.collapsible-header').click();                          
                            });
                            // success screen -  Click on Next Strategy ends

                            // file upload starts
                            $(document.body).off('change', '.aws-file-upload input[type=file]').on('change', '.aws-file-upload input[type=file]', function(event) {
                    
                                plaque.elements.uploadFileAwsBoto($(this),event);
                            });

                            $(document.body).off('click', '.file-duplicate-error-msg .delete-duplicate-error-msg').on('click', '.file-duplicate-error-msg .delete-duplicate-error-msg', function(event) {
                               
                                plaque.elements.deleteDuplicateErrorMsg($(this));
                            });

                            $(document.body).off('click', '.btn-stop-file-upload').on('click', '.btn-stop-file-upload', function(event) {
                                
                                plaque.elements.stopStrategyDocumentUploadAWS($(this));
                            });

                            $(document.body).off('change', '.strategy-success .elements_questionnaire_upload input[type=file]').on('change', '.strategy-success .elements_questionnaire_upload input[type=file]', function(event) {
                                
                                plaque.elements.prepareStrategyDocumentUploadAWS($(this),event);
                            });
                
                            $(document.body).off('change', '.strategy-document .elements_questionnaire_upload input[type=file]').on('change', '.strategy-document .elements_questionnaire_upload input[type=file]', function(event) {
                               
                                plaque.elements.prepareStrategyDocumentUploadAWS($(this),event);
                            });

                            //strategies custom upload
                            $(document.body).off('change', '.strategy-custom .elements_questionnaire_upload input[type=file]').on('change', '.strategy-custom .elements_questionnaire_upload input[type=file]', function(event) {
                                
                                plaque.elements.prepareStrategyDocumentUploadAWS($(this),event);
                            });

                            /////// file type question upload ////////
                            /////////////////////////////////////////
                            $(document.body).off('change', '.file_type_question input[type=file]').on('change', '.file_type_question input[type=file]', function(event) {
                                
                                plaque.elements.prepareQuestionDocumentUploadAWS($(this),event);
                            });
                            /////// file type question upload ////////
                            /////////////////////////////////////////

                            
                            ///// file type question delete /////
                            /////////////////////////////////////               
                            $(document.body).off('click', '.file_type_question .delete-document-file').on('click', '.file_type_question .delete-document-file', function(event) {
                                
                                plaque.elements.deleteQuestionDocumentUploadedFileAWS($(this));
                            });
                            ///// file type question delete /////
                            /////////////////////////////////////

                            // strategies custom delete
                            $(document.body).off('click', '.strategy-custom .delete-document-file').on('click', '.strategy-custom .delete-document-file', function(event) {
                                
                                plaque.elements.deleteStrategyDocumentUploadedFileAWS($(this));
                            });

                            $(document.body).off('click', '.strategy-success .delete-document-file').on('click', '.strategy-success .delete-document-file', function(event) {
                               
                                plaque.elements.deleteStrategyDocumentUploadedFileAWS($(this));
                            });
                            
                            $(document.body).off('click', '.strategy-document .delete-document-file').on('click', '.strategy-document .delete-document-file', function(event) {
                                
                                plaque.elements.deleteStrategyDocumentUploadedFileAWS($(this));
                            });
                            // file upload ends

                            // changes not known: just copied from strategies.html starts
                            $(document.body).on('keyup', '.questionnaire input[type=text]', function(event) {
                                 if (this.value.length > 1) {
                                    $(this).siblings('.answerbutton').show();
                                    $(this).siblings('.customstrategy-answerbutton').show();
                                 }else{
                                    $(this).siblings('.answerbutton').hide();
                                    $(this).siblings('.customstrategy-answerbutton').hide();
                                 }
                            });
                            
                            $(document.body).on('keyup', '.questionnaire .questiontextarea', function(event) {
                                 if (this.value.length > 1) {
                                    $(this).siblings('.answerbutton').show();
                                    $(this).siblings('.customstrategy-answerbutton').show();
                                 }else{
                                    $(this).siblings('.answerbutton').hide();
                                    $(this).siblings('.customstrategy-answerbutton').hide();
                                 }
                            });
                            
                            $(document.body).on('change','.questionnaire #slider-value', function(event){
                                $(this).parents('.controls').siblings('.answerbutton').show();
                                $('#slider-selected-value').html($(this).val());
                            });  
                
                            $(document.body).on('blur', '.custom-added .strategy-custom input[type=text]', function(event) {
                                 if (this.value.length > 1) {
                                    var strategyId = $(this).data('strategyid');
                                    var data = {};
                                    data["strategy_id"] = strategyId;
                                    data["title"] = this.value;
                                    data["update_flag"] = 'title';
                                    plaque.elements.updateStrategyStatus(buildingID, data);
                                    
                                    $(this).closest('li.strategy-custom').children('.collapsible-header').find('.strategy-name').html(this.value);
                                 }
                            });
                
                            $(document.body).on('blur', '.custom-added .strategy-custom .questiontextarea', function(event) {
                                 if (this.value.length > 1) {
                                    var strategyId = $(this).data('strategyid');
                                    var data = {};
                                    data["strategy_id"] = strategyId;
                                    data["description"] = this.value;
                                    data["update_flag"] = 'description';
                                    plaque.elements.updateStrategyStatus(buildingID, data);
                                 }
                            });
                            
                            $(document.body).on('click', '.customstrategy-answerbutton', function(event) {
                                var currentObject = $(this);
                                var intentId = $(this).data('intentid');
                                var nextScreen = '.strategy-custom-'+$(this).data('goto');
                                var currentScreen = '.strategy-custom-'+$(this).data('currentquestion');
                                var strategyId = '';

                                if(currentScreen == '.strategy-custom-description'){
                                    strategyName =  $(this).parents('.collapsible-body').find('.strategy-custom-title input[type=text]').val();
                                    strategyDesc = $(this).prev('textarea').val();
                                
                                    var answerObject = {};
                                    answerObject["title"]        = strategyName;
                                    answerObject["intent_id"]    = intentId;
                                    answerObject["description"]  = strategyDesc;
                                    answerObject["file"]         = '';
                                    answerObject["strategy_id"]  = '';

                                    $.when(plaque.elements.submitStrategy(buildingID,answerObject))
                                      .done(function( data ) {
                                          var strategy = data.strategy;
                                          strategyId = strategy.id;    
                                      });
                                    
                                }

                                if(nextScreen != '.strategy-custom-final'){
                                    var collapsibleBody = $(this).parents('.collapsible-body');
                                    if(nextScreen == '.strategy-custom-file'){
                                        id="elements_upload_data-" + strategyId;
                                        collapsibleBody.children(nextScreen).attr('id', id);
                                        collapsibleBody.children(nextScreen).data('strategyid', strategyId);
                                        collapsibleBody.children(nextScreen).find('.elements_questionnaire_upload').data('strategyid', strategyId);
                                        collapsibleBody.children(nextScreen).find('.elements_questionnaire_upload').attr('id','elements_questionnaire_upload-'+strategyId);
                                        collapsibleBody.children(nextScreen).find('.elements_file_data_new').data('strategyid', strategyId);
                                        
                                        $(document.body).on('change', '.questionnaire input[type=file]', function(event) {
                                            //changed for multiple upload
                                            plaque.elements.prepareStrategyDocumentUploadAWS($(this),event);
                                        });
                                    }

                                    // Load the next question
                                    collapsibleBody.children(currentScreen).hide();
                                    collapsibleBody.children(nextScreen).show();
                                }else{
                                    var strategyId = $(this).parents('.collapsible-body').find('.strategy-custom-file').data('strategyid');
                                    var strategyName =  $(this).parents('.collapsible-body').find('.strategy-custom-title input[type=text]').val();
                                    var strategyDesc = $(this).parents('.collapsible-body').find('.strategy-custom-description textarea').val();
                                    var file = $(this).parents('.collapsible-body').find('.strategy-custom-file');
                                    var fileHolder = file.find('#elements_questionnaire_upload-'+strategyId);
                                    file = file.find('#elements_questionnaire_upload-'+strategyId).html();
                                    var filename = fileHolder.attr("data-filename");
                                
                                    var divIntent = '';
                                    divIntent += '<li class="custom-added strategy-custom">';
                                        divIntent += '<div class="collapsible-header" data-strategyid="'+strategyId+'">'+strategyName+'</div>';
                                            divIntent += '<div class="collapsible-body">';
                                                divIntent += '<div class="questionnaire strategy-custom default-strategy-'+strategyId+'">'
                                                    divIntent += '<div>';
                                                        divIntent += '<p class="custom-strategy-description">Title</p>';
                                                    divIntent += '</div>';
                                                    divIntent += '<div class="button-group">';
                                                        divIntent += '<div class="controls">';
                                                            divIntent += '<input value="'+strategyName+'" placeholder="Strategy title" type="text" data-intentid="'+intentId+'" data-strategyid="'+strategyId+'" class="questiontext span5">';
                                                        divIntent += '</div>';
                                                    divIntent += '</div>';
                                                    divIntent += '<div>';
                                                        divIntent += '<p class="custom-strategy-description">Implementation</p>';
                                                    divIntent += '</div>';
                                                    divIntent += '<div class="button-group">';
                                                        divIntent += '<div class="controls">';
                                                            divIntent += '<textarea placeholder="Implementation plan" data-intentid="'+intentId+'" data-strategyid="'+strategyId+'" class="questiontextarea span5">'+strategyDesc+'</textarea>';
                                                        divIntent += '</div>';
                                                    divIntent += '</div>';
                                                    divIntent += '<div>';
                                                            divIntent += '<p class="custom-strategy-description">Document</p>';
                                                    divIntent += '</div>';
                                                    divIntent += '<div class="button-group">';
                                                        divIntent += '<div class="elements_questionnaire_upload" data-filename="'+filename+'" data-strategyid="'+strategyId+'" data-intentid="'+intentId+'" id="elements_questionnaire_upload-'+strategyId+'">';
                                                            divIntent += file;
                                                        divIntent += '</div>';  
                                                    divIntent += '</div>';
                                                    divIntent += '<div class="button-group deletestrategy">';
                                                        divIntent += '<a class="waves-effect waves-light btn btn-red" data-intentid="'+intentId+'" data-strategyid="'+strategyId+'" id="delete-strategy">Delete</a>';
                                                    divIntent += '</div>';
                                                divIntent += '</div>';
                                            divIntent += '</div>';
                                        divIntent += '</div>';
                                    divIntent += '</li>';

                                    var ul = currentObject.closest('ul.collapsible');
                                    ul.children('li:last').prev().after(divIntent); 
                                        
                                    $('.collapsible').collapsible({
                                        accordion : false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
                                    });
                                    
                                    /*$(document.body).off('click', '.delete-custom-file').on('click', '.delete-custom-file', function(event) {
                                        plaque.elements.deleteStrategyUploadedFile('#elements_questionnaire_upload-'+strategyId+' .delete-custom-file');
                                    });*/
                                
                                    //Reload custom add strategy section
                                    currentObject.parents('.collapsible-body').find('.strategy-custom-title input[type=text]').val('');
                                    currentObject.parents('.collapsible-body').find('.customstrategy-answerbutton').hide();
                                    currentObject.parents('.collapsible-body').find('.strategy-custom .questiontextarea').val('');
                                    currentObject.parents('.collapsible-body').children(currentScreen).hide();
                                    currentObject.parents('.collapsible-body').children('.strategy-custom-title').show();
                                    $('.close-popout').click();
                                }                   
                            });
                            // changes not known: just copied from strategies.html ends

                            // YA: text shortening starts
                            var elements_to_minimize = $('.intent-description');
                            var showChar = 320;    
                            elements_to_minimize.each(function(){    
                                var t = $(this).text();        
                                if(t.length < showChar) return;
                                
                                $(this).html(
                                    t.slice(0,showChar)+'<span>... </span><a href="#" class="more-text">Show more</a>'+
                                    '<span style="display:none;">'+ t.slice(showChar,t.length)+' <a href="#" class="less-text">Show less</a></span>'
                                );                  
                            }); 
                            
                            $('a.more-text', elements_to_minimize).click(function(event){
                                event.preventDefault();
                                $(this).hide().prev().hide();
                                $(this).next().show();        
                            });
                            
                            $('a.less-text', elements_to_minimize).click(function(event){
                                event.preventDefault();
                                $(this).parent().hide().prev().show().prev().show();    
                            });
                            // YA: text shortening ends

                            // YA: styling counter top align to div starts                   
                            $(document.body).on('click', '.accordion-section-title', function(event) {
                                var strategyDiv= $(this).next().find('.strategy-name');                     
                                strategyDiv.each(function(){    

                                    if($(this).prev().find(".strategy-counter-content").offset().top != $(this).offset().top){
                                        var marginTop = $(this).prev().find(".strategy-counter-content").offset().top - $(this).offset().top;
                                        $(this).prev().find(".strategy-counter-content").css("margin-top","-"+marginTop+"px");
                                    }               
                                });
                                event.stopPropagation(); 
                            });
                            // YA: styling counter top align to div ends

                            $(document.body).on('click','div.collapsible-header', function (e) {
                                e.stopPropagation();
                            });
                            
                            $('.collapsible').collapsible({
                                accordion : false
                            });                      
                        }
                        manageNav.data_input_visibility();
                    },
                    error:function(){
                        // failed request; give feedback to user
                        $('#strategy_content').html('<p class="error"><strong>Oops!</strong> Try again in a few moments.</p>');
                        //$('.data_input_stratergy_nav').css('left', $('#strategy_content').offset().left);
                        //$('.header_strategies').css('left', $('#strategy_content').offset().left);
                        //  window.plaqueNav.removeStrategiesLoadingMessage(1500);
                    }
                }); 
            },
            //get strategies of Intent ends

            getMissingDuration: function(gap_duration){
                var duration = "";
                if(gap_duration == 1)
                    duration = "1 Day";
                else if(gap_duration > 1 && gap_duration<30)
                    duration = gap_duration+" Days";
                else{
                    duration = Math.round(gap_duration/12)+" Months";
                }
                return duration;
            },

            getPerformanceScore: function(){
                var buildingID = plaque.elements.getQueryStringParams('LEED');
                $.ajax({
                    async: false,
                    type: "GET",
                    url: "/buildings/LEED:"+ buildingID + "/performance/",
                    success: function(data) {                     
                        var score = data.scores;
                        var maxima = data.maxima;

                        var current_score = "";
                        var max_score= "";

                        if(score.base == null)
                            score.base = 0;
                        if(score.energy == null)
                            score.energy = 0;
                        if(score.human_experience == null)
                            score.human_experience = 0;
                        if(score.transport == null)
                            score.transport = 0;
                        if(score.waste == null)
                            score.waste = 0;
                        if(score.water == null)
                            score.water = 0;

                        var current_score = score.base + score.energy + 
                                        score.human_experience + score.transport + score.waste + score.water;

                        if(maxima == null)
                            max_score = 0;
                        else{
                            if(maxima.base == null)
                                maxima.base = 0;
                            if(maxima.energy == null)
                                maxima.energy = 0;
                            if(maxima.human_experience == null)
                                maxima.human_experience = 0;
                            if(maxima.transport == null)
                                maxima.transport = 0;
                            if(maxima.waste == null)
                                maxima.waste = 0;
                            if(maxima.water == null)
                                maxima.water = 0;

                            max_score = maxima.base + maxima.energy + 
                                            maxima.human_experience + maxima.transport + maxima.waste + maxima.water;
                        }

                        $('#building_per_data_link_dashboard div').html(current_score);
                        
                        var current_score_value = current_score/40;
                        $('#building_per_data_link_dashboard').circleProgress({
                            value: current_score_value,
                            size: 46,
                            thickness: 5,
                            animation:true,
                            startAngle:-Math.PI / 4 * 2,
                            fill: { color: 'gray' }
                        });                        

                        /** small modal window changes starts **/
                        $("#building_per_data_modal #building_per_data_body #building_per_score .ajax_loader_leed_cert").removeClass("display_inline").addClass("display_none");

                        $("#building_per_data_modal #building_per_data_body #building_per_score .current-score").html(current_score).removeClass("display_none").addClass("display_inline");
                        $("#building_per_data_modal #building_per_data_body #building_per_score .current-divider").removeClass("display_none").addClass("display_inline");
                        $("#building_per_data_modal #building_per_data_body #building_per_score .total-score").removeClass("display_none").addClass("display_inline");
                    //  $("#building_per_data_modal #building_per_data_body #building_per_score .total-score").html(max_score);
                        /** small modal window changes ends **/


                        /** big modal changes starts **/                  
                        $("#leed_certification_modal #performance-score .energy_cat_points").html(score.energy);
                        $("#leed_certification_modal #performance-score .water_cat_points").html(score.water);
                        $("#leed_certification_modal #performance-score .waste_cat_points").html(score.waste);
                        $("#leed_certification_modal #performance-score .transportation_cat_points").html(score.transport);
                        $("#leed_certification_modal #performance-score .humanexperience_cat_points").html(score.human_experience);
                      
                        
                        if(current_score >= 40){

                            plaque.elements.per_score_msg_flag = true;

                            $("#building_per_data_modal #building_per_data_body #building_per_score .current-score").addClass("complete").html(current_score);                           
                            $("#leed_certification_modal #performance-score .total_points_cat_points").addClass("complete").html(current_score);
                            
                            
                            $("#leed_certification_modal #performance-score .performance-notifications .performance-status i").addClass("fa fa-check");                            
                            $("#leed_certification_modal #performance-score .performance-notifications .performance-status .points-needed").html("Completed");
                            $("#leed_certification_modal #performance-score .performance-notifications .performance-status .points-needed").addClass("complete");

                            $("#leed_certification_modal #performance-score .performance-notifications .performance-status .points-needed-text").hide();
                            $("#leed_certification_modal #performance-score .performance-notifications .performance-status .acp-eligibility-text").hide();
                        
                        }else{

                            points_needed = 40 - current_score;
                            $("#building_per_data_modal #building_per_data_body #building_per_score .current-score").addClass("incomplete").html(current_score);                            
                            
                            $("#leed_certification_modal #performance-score .performance-score .total_points_cat_points").addClass("incomplete").html(current_score);
                            
                            
                            $("#leed_certification_modal #performance-score .performance-notifications .performance-status i").addClass("fa fa-times");
                            $("#leed_certification_modal #performance-score .performance-notifications .performance-status .points-needed").html(points_needed).addClass("incomplete");
                            $("#leed_certification_modal #performance-score .performance-notifications .performance-status .points-needed-text").html(" points away").addClass("incomplete");
                            $("#leed_certification_modal #performance-score .performance-notifications .performance-status .acp-eligibility-text").html(" from LEED ACP eligibility");
                        
                        }                        
                        /** big modal changes ends **/
                    }
                });
            },

            getPerformanceData: function(){
                var buildingID = plaque.elements.getQueryStringParams('LEED');
                $.ajax({
                    async: false,
                    type: "GET",
                    url: "/check_requirements/LEED:"+ buildingID + "/", //1000000117
                    success: function(data) {                     
                        var water = data.water;
                        var energy = data.energy;
                        var waste = data.waste;
                        var survey = data.survey;
                        var transport = survey.transport;

                        var human_experience = data.human_experience;

                        var energy_gap_duration = energy.gap_duration;
                        var water_gap_duration = water.gap_duration;
                        var waste_gap_duration = waste.gap_duration;
                        var transport_reason = transport.reason;
                        var human_experience_gap_duration = human_experience.gap_duration;

                        var energy_req_status = energy.requirement_status;
                        var water_req_status = water.requirement_status;
                        var waste_req_status = waste.requirement_status;
                        var transport_req_status = transport.requirement_status;
                        var human_experience_req_status = human_experience.requirement_status;

                        var energy_msg = "";
                        var water_msg = "";
                        var waste_msg = "";
                        var transport_msg = "";
                        var human_experience_msg = "";

                        var current_score = 0;

                        /** big modal changes starts **/

                        //// Energy Data ////
                        if(energy_req_status == false && energy_gap_duration == 0){
                            energy_msg = "No meters present";
                            $("#leed_certification_modal #performance-data .energy_cat_msg").html(energy_msg).addClass("incomplete");
                        }else if(energy_req_status == true && energy_gap_duration == 0){
                            current_score +=1;
                            energy_msg = "Correct data for all meters";
                            $("#leed_certification_modal #performance-data .energy_cat_msg").html(energy_msg).addClass("complete");
                        }                            
                        else{
                            energy_msg = plaque.elements.getMissingDuration(energy_gap_duration);//energy_gap_duration+" Day";
                            $("#leed_certification_modal #performance-data .energy_cat_msg").html(energy_msg).addClass("incomplete");
                        }                            

                        //// Water Data ////
                        if(water_req_status == false && water_gap_duration == 0){
                            water_msg = "No meters present";
                            $("#leed_certification_modal #performance-data .water_cat_msg").html(water_msg).addClass("incomplete");
                        }
                        else if(water_req_status == true && water_gap_duration == 0){
                            current_score +=1;
                            water_msg = "Correct data for all meters";
                            $("#leed_certification_modal #performance-data .water_cat_msg").html(water_msg).addClass("complete");
                        }
                        else{
                            water_msg = plaque.elements.getMissingDuration(water_gap_duration);//+" Day";
                            $("#leed_certification_modal #performance-data .water_cat_msg").html(water_msg).addClass("incomplete");
                        }
                        
                        //// Waste Data ////
                        if(waste_req_status == false){
                            waste_msg = "No readings present";
                            $("#leed_certification_modal #performance-data .waste_cat_msg").html(waste_msg).addClass("incomplete");
                        }
                        else if(waste_req_status == false && waste_gap_duration == 0){
                            waste_msg = "No readings present";
                            $("#leed_certification_modal #performance-data .waste_cat_msg").html(waste_msg).addClass("incomplete");
                        }else if(waste_req_status == true && waste_gap_duration == 0){
                            current_score +=1;
                            waste_msg = "Correct readings present";
                            $("#leed_certification_modal #performance-data .waste_cat_msg").html(waste_msg).addClass("complete");
                        }                            
                        else{
                            waste_msg = plaque.elements.getMissingDuration(waste_gap_duration);//+" Day";
                            $("#leed_certification_modal #performance-data .waste_cat_msg").html(waste_msg).addClass("incomplete");
                        }

                        //// Transport Data ////
                        if(transport_req_status == false){
                            transport_msg = "No Survey Data";
                            $("#leed_certification_modal #performance-data .transportation_cat_msg").html(transport_msg).addClass("incomplete");
                        }                            
                        else{
                            current_score +=1;
                            transport_msg = "Survey filled by Min 25%";
                            $("#leed_certification_modal #performance-data .transportation_cat_msg").html(transport_msg).addClass("complete");
                        }                            

                        //// Human Experience Data ////
                        if(human_experience_req_status == false && human_experience_gap_duration == 0){
                            human_experience_msg = "No meters present";
                            $("#leed_certification_modal #performance-data .humanexperience_cat_msg").html(human_experience_msg).addClass("incomplete");
                        }else if(human_experience_req_status == true && human_experience_gap_duration == 0){
                            current_score +=1;
                            human_experience_msg = "Correct data for all meters";
                            $("#leed_certification_modal #performance-data .humanexperience_cat_msg").html(human_experience_msg).addClass("complete");
                        }                               
                        else{
                            human_experience_msg = plaque.elements.getMissingDuration(human_experience_gap_duration);//+" Day";
                            $("#leed_certification_modal #performance-data .humanexperience_cat_msg").html(human_experience_msg).addClass("incomplete");
                        }
                        /** big modal changes ends **/



                        /** small modal window changes starts **/

                        $("#building_per_data_modal #building_per_data_body #building_per_data .ajax_loader_leed_cert").removeClass("display_inline").addClass("display_none");
                        $("#building_per_data_modal #building_per_data_body #building_per_data .current-score").html(current_score).removeClass("display_none").addClass("display_inline");

                        $("#building_per_data_modal #building_per_data_body #building_per_data .current-divider").removeClass("display_none").addClass("display_inline");
                        $("#building_per_data_modal #building_per_data_body #building_per_data .total-score").removeClass("display_none").addClass("display_inline");
                        
                        /** small modal window changes ends **/

                        if(current_score == 5){
                            plaque.elements.per_data_notif_flag = true;
                        //  $("#building_per_data_modal #building_per_data_body #building_per_data .building_per_status").html("Completed");
                            $("#building_per_data_modal #building_per_data_body #building_per_data .current-score").addClass("complete");
                            $("#leed_certification_modal #performance-data .performance-notifications .performance-status i").addClass("fa fa-check");
                            
                            $("#leed_certification_modal #performance-data .performance-notifications .performance-status .points-needed").html("Completed");
                            $("#leed_certification_modal #performance-data .performance-notifications .performance-status .points-needed").addClass("complete");

                            $("#leed_certification_modal #performance-data .performance-notifications .performance-status .points-needed-text").hide();
                            $("#leed_certification_modal #performance-data .performance-notifications .performance-status .acp-eligibility-text").hide();


                        }else{
                        //  $("#building_per_data_modal #building_per_data_body #building_per_data .building_per_status").html("Incomplete");
                            $("#building_per_data_modal #building_per_data_body #building_per_data .current-score").addClass("incomplete");
                            
                            $("#leed_certification_modal #performance-data .performance-notifications .performance-status i").addClass("fa fa-times");
                            
                            $("#leed_certification_modal #performance-data .performance-notifications .performance-status .points-needed").html("Add").addClass("incomplete");
                            $("#leed_certification_modal #performance-data .performance-notifications .performance-status .points-needed-text").html(" missing data").addClass("incomplete");
                            $("#leed_certification_modal #performance-data .performance-notifications .performance-status .acp-eligibility-text").html(" to be eligibile for LEED ACP");

                        }
                        /** small modal window changes ends **/
                        
                    }
                });
            },            

            getPrereqData: function(){
                var buildingID = plaque.elements.getQueryStringParams('LEED');
                $.ajax({
                    async: false,
                    type: "GET",
                    url: "/elements/intents/LEED:"+ buildingID,
                    success: function(data) {
                        var status =  data.status;
                        var result = data.result;    

                        if(status == 'Success'){
                            var intents = result.intents;
                            var categoryList = result.categoryList;
                            var credits = {};
                            var categories = [];
                            var prereq = [];

                            var all_prereq_data = [];

                            var all_prereq_points = 0;
                            var all_met_prereq_points = 0;


                            $.each(intents, function(i, intent) {
                                if(!credits[intent.category]){
                                    credits[intent.category] = [];
                                }
                                credits[intent.category].push({"intent":intent});
                                categories[intent.category] = plaque.elements.getCategoryName(intent.category, categoryList);
                            });

                            plaque.elements.intents_from_prereq = credits;
                            plaque.elements.categoryList_from_prereq = categoryList;
                            
                            $.each(credits, function(i, credit) {
                                categoryId = i;
                                i = plaque.elements.getCategoryName(i, categoryList);
                                prereq[i] = [];
                                prereq[i]["list_of_prereq"] = [];
                                var met_prereq = 0;
                                var all_prereq = 0;
                                $.each(credit, function(j, creditData) {
                                    var intent = creditData.intent                                    
                                    if(intent.requiredflag == true){
                                        all_prereq+=1;
                                        all_prereq_points+=1;
                                        if(intent.metprereq == true){
                                            met_prereq+=1;
                                            all_met_prereq_points+=1;
                                        }
                                        prereq[i]["list_of_prereq"][intent.name] = intent.metprereq;
                                    }
                                    prereq[i]["met_prereq_points"] = met_prereq;
                                    prereq[i]["prereq_points"]=all_prereq;
                                    prereq[i]["categoryId"]=categoryId;
                                });

                            });

                           
                            all_prereq_data["prereq_data"] = prereq;
                            all_prereq_data["all_prereq_points"] = all_prereq_points;
                            all_prereq_data["all_met_prereq_points"] = all_met_prereq_points;

                        //    $("#building_per_data_modal #building_per_data_body #building_per_prereq .current-score").html(all_met_prereq_points);
                        //    $("#building_per_data_modal #building_per_data_body #building_per_prereq .total-score").html(all_prereq_points);

                            $("#building_per_data_modal #building_per_data_body #building_per_prereq .ajax_loader_leed_cert").removeClass("display_inline").addClass("display_none");
                            
                            $("#building_per_data_modal #building_per_data_body #building_per_prereq .current-score").html(all_met_prereq_points).removeClass("display_none").addClass("display_inline");
                            $("#building_per_data_modal #building_per_data_body #building_per_prereq .current-divider").removeClass("display_none").addClass("display_inline");
                            $("#building_per_data_modal #building_per_data_body #building_per_prereq .total-score").html(all_prereq_points).removeClass("display_none").addClass("display_inline");

                            if(all_prereq_points!=0 && all_met_prereq_points == all_prereq_points){
                                plaque.elements.per_prereq_notif_flag = true;

                            //  $("#building_per_data_modal #building_per_data_body #building_per_prereq .building_per_status").html("Completed");
                                $("#building_per_data_modal #building_per_data_body #building_per_prereq .current-score").addClass("complete");
                                
                                $("#leed_certification_modal #leed-prerequisites .performance-notifications .performance-status i").addClass("fa fa-check");
                                
                                $("#leed_certification_modal #leed-prerequisites .performance-notifications .performance-status .points-needed").html("Completed");
                                $("#leed_certification_modal #leed-prerequisites .performance-notifications .performance-status .points-needed").addClass("complete");

                                $("#leed_certification_modal #leed-prerequisites .performance-notifications .performance-status .points-needed-text").hide();
                                $("#leed_certification_modal #leed-prerequisites .performance-notifications .performance-status .acp-eligibility-text").hide();

                            }else{

                            //  $("#building_per_data_modal #building_per_data_body #building_per_prereq .building_per_status").html("Incomplete");
                                $("#building_per_data_modal #building_per_data_body #building_per_prereq .current-score").addClass("incomplete");
                                $("#leed_certification_modal #leed-prerequisites .performance-notifications .performance-status i").addClass("fa fa-times");
                                
                                $("#leed_certification_modal #leed-prerequisites  .performance-notifications .performance-status .points-needed").html("Add").addClass("incomplete");
                                $("#leed_certification_modal #leed-prerequisites  .performance-notifications .performance-status .points-needed-text").html(" missing data").addClass("incomplete");
                                $("#leed_certification_modal #leed-prerequisites  .performance-notifications .performance-status .acp-eligibility-text").html(" to be eligibile for LEED ACP");
                            }

                            var tempDiv = "";
                            var prereq_data = all_prereq_data["prereq_data"];
                            for (var key in prereq_data) {
                                var prereq_category_title = key;
                                var catId = prereq_data[key]["categoryId"];
                                var current_score = prereq_data[key]["met_prereq_points"];
                                var total_score = prereq_data[key]["prereq_points"];
                                var list_of_prereq = prereq_data[key]["list_of_prereq"];
                                
                                tempDiv+='<div class="prereq-category">'
                                    tempDiv+='<div class="prereq-category-header">';
                                        tempDiv+='<img class="prereq-img" alt="" src="/static/dashboard/img/leed/'+catId+'-border.png">';
                                        tempDiv+='<p class="prereq-category-title">'+ prereq_category_title +'</p>';
                                        tempDiv+='<div class="prereq-score">';
                                            tempDiv+='<span class="current-score">'+ current_score +'</span>';
                                            tempDiv+='<span class="current-divider">/</span>';
                                            tempDiv+='<span class="total-score">'+ total_score +'</span>';
                                        tempDiv+='</div>';
                                    tempDiv+='</div>';

                                var catBodyDiv = "";
                                catBodyDiv+='<div class="prereq-category-body"></div>';
                                for(var key_prereq in list_of_prereq){
                                    catBodyDiv+='<div class="prereq-category-body">';
                                        catBodyDiv+='<div class="prereq-intent-body">';
                                            if(list_of_prereq[key_prereq] == true)
                                                catBodyDiv+='<i class="fa fa-check complete"></i>';
                                            else
                                                catBodyDiv+='<i class="fa fa-times incomplete"></i>';
                                            catBodyDiv+='<p class="prereq-intent-title">'+ key_prereq +'</p>';
                                        catBodyDiv+='</div>'; 
                                    catBodyDiv+='</div>';
                                }  
                                tempDiv+=catBodyDiv;
                                tempDiv+='</div>'; 
                            }

                            $("#leed-prerequisites .performance-score").append(tempDiv);

                           
                        }
                    }
                });
            },

            getBasePoints: function(){
                var buildingID = plaque.elements.getQueryStringParams('LEED');
                $.ajax({
                    async: false,
                    type: "GET",
                    url: "/elements/basepoints/LEED:"+ buildingID,
                    success: function(data) {

                        var base_points_list = data.base_points_list;
                        var basepoints_array = [];

                        $.each(base_points_list, function(k, basePointsList) {
                            basepoints_array[basePointsList.intent_id] = basePointsList.points.replace ( /[^\d.]/g, '' );
                        });

                        var basepoints = [];
                        var all_basepoints_data = [];
                        
                        var all_basepoints = 0;
                        var all_met_basepoints = 0;

                        credits = plaque.elements.intents_from_prereq;
                        categoryList = plaque.elements.categoryList_from_prereq;
                        
                        $.each(credits, function(i, credit) {
                            categoryId = i;
                            i = plaque.elements.getCategoryName(i, categoryList);
                            basepoints[i] = [];
                            basepoints[i]["list_of_basepoints"] = [];
                           
                            var met_basepoints = 0;
                            var total_basepoints = 0;
                           
                            $.each(credit, function(j, creditData) {
                                var intent = creditData.intent;

                                if(basepoints_array[intent.genericintentid]){
                                    basepoints[i]["list_of_basepoints"][intent.name] = [];

                                    basepoints[i]["list_of_basepoints"][intent.name]["intentId"] = intent.genericintentid;
                                    basepoints[i]["list_of_basepoints"][intent.name]["maxpointspossible"] = intent.maxpointspossible;
                                    basepoints[i]["list_of_basepoints"][intent.name]["pointsachieved"] = intent.pointsachieved;
                                    basepoints[i]["list_of_basepoints"][intent.name]["basepoints"] = basepoints_array[intent.genericintentid];
                                    
                                    all_basepoints      +=  parseInt(basepoints_array[intent.genericintentid]);
                                    all_met_basepoints  +=  intent.pointsachieved;  

                                    total_basepoints      +=  parseInt(basepoints_array[intent.genericintentid]);
                                    met_basepoints  +=  intent.pointsachieved;                                 
                                    
                                }
                                basepoints[i]["met_basepoints"] = met_basepoints;
                                basepoints[i]["total_basepoints"]=total_basepoints;
                                basepoints[i]["categoryId"]=categoryId;
                            });

                        });
                        all_basepoints_data["basepoints_data"] = basepoints;
                        all_basepoints_data["all_basepoints"] = all_basepoints;
                        all_basepoints_data["all_met_basepoints"] = all_met_basepoints;

                        console.log(all_basepoints_data);
                        ////////////////////////////////////////////////////////////////
                        ///////////////////////////////////////////////////////////////

                        $("#building_per_data_modal #building_per_data_body #building_per_basepoints .ajax_loader_leed_cert").removeClass("display_inline").addClass("display_none");
                            
                        $("#building_per_data_modal #building_per_data_body #building_per_basepoints .current-score").html(all_met_basepoints).removeClass("display_none").addClass("display_inline");
                        $("#building_per_data_modal #building_per_data_body #building_per_basepoints .current-divider").removeClass("display_none").addClass("display_inline");
                        $("#building_per_data_modal #building_per_data_body #building_per_basepoints .total-score").html(all_basepoints).removeClass("display_none").addClass("display_inline");

                        if(all_basepoints!=0 && all_met_basepoints == all_basepoints){
                        //  plaque.elements.per_prereq_notif_flag = true;
                            $("#building_per_data_modal #building_per_data_body #building_per_basepoints .current-score").addClass("complete");                            
                        }else{
                            $("#building_per_data_modal #building_per_data_body #building_per_basepoints .current-score").addClass("incomplete");
                        }

                        var tempDiv = "";
                        var basepoints_data = all_basepoints_data["basepoints_data"];
                        for (var key in basepoints_data) {
                            if(/*basepoints_data[key]["met_basepoints"]!=0 && */basepoints_data[key]["total_basepoints"]!=0){
                                var basepoints_category_title = key;
                                var catId = basepoints_data[key]["categoryId"];
                                var current_score = basepoints_data[key]["met_basepoints"];
                                var total_score = basepoints_data[key]["total_basepoints"];
                                var list_of_basepoints = basepoints_data[key]["list_of_basepoints"];
                                
                                tempDiv+='<div class="prereq-category">'
                                    tempDiv+='<div class="prereq-category-header">';
                                        tempDiv+='<img class="prereq-img" alt="" src="/static/dashboard/img/leed/'+catId+'-border.png">';
                                        tempDiv+='<p class="prereq-category-title">'+ basepoints_category_title +'</p>';
                                        tempDiv+='<div class="prereq-score">';
                                            tempDiv+='<span class="current-score">'+ current_score +'</span>';
                                            tempDiv+='<span class="current-divider">/</span>';
                                            tempDiv+='<span class="total-score">'+ total_score +'</span>';
                                        tempDiv+='</div>';
                                    tempDiv+='</div>';

                                
                                var catBodyDiv = "";
                                catBodyDiv+='<div class="prereq-category-body"></div>';
                                for(var key_basepoints in list_of_basepoints){
                                    catBodyDiv+='<div class="prereq-category-body">';
                                        catBodyDiv+='<div class="prereq-intent-body">';
                                            if(list_of_basepoints[key_basepoints]["pointsachieved"] != 0)
                                                catBodyDiv+='<i class="fa fa-check complete"></i>';
                                            else
                                                catBodyDiv+='<i class="fa fa-times incomplete"></i>';
                                            catBodyDiv+='<p class="prereq-intent-title">'+ key_basepoints +'</p>';
                                        catBodyDiv+='</div>'; 
                                    catBodyDiv+='</div>';
                                }  
                                tempDiv+=catBodyDiv;
                                tempDiv+='</div>';
                            }
                             
                        }
                        $("#leed-base-points .performance-score").append(tempDiv);                  
                    }
                });
            },

            createNotifications: function(){

                if(plaque.elements.per_score_msg_flag == true &&
                    plaque.elements.per_data_notif_flag == true &&
                     plaque.elements.per_prereq_notif_flag == true){
                    $("#leed_certification_modal .performance-req-success-msg .about-leed-cert").show();
                    $("#leed_certification_modal .performance-req-success-msg .apply-now").show();
                    $("#leed_certification_modal .performance-req-success-msg .congrats-msg").show();
                    $("#leed_certification_modal .performance-req-success-msg .congrats-body").show();

                    $("#leed_certification_modal .performance-req-success-msg .requirements-msg").hide();
                    $("#leed_certification_modal .performance-req-steps").hide();
                }else{
                    $("#leed_certification_modal .performance-req-success-msg .about-leed-cert").hide();
                    $("#leed_certification_modal .performance-req-success-msg .apply-now").hide();
                    $("#leed_certification_modal .performance-req-success-msg .congrats-msg").hide();
                    $("#leed_certification_modal .performance-req-success-msg .congrats-body").hide();

                    $("#leed_certification_modal .performance-req-success-msg .requirements-msg").show();
                    $("#leed_certification_modal .performance-req-steps").show();
                }

            }
    }; 

}).call(this);