(function() 
{
    var cquery = '';
    var certquery = '';
    var LEEDquery = '';
    var lastScrollTop = 0;
    var delta = 5;
    var navbarHeight = $('.header').outerHeight();
    var show = 1;
    var returnData = 100;
    
    window.projectList = {
		
		search_count : 0,
		xhr : undefined, 
		xhr2: undefined,

        getUrlParameter: function(sParam)
        {
              var sPageURL = window.location.search.substring(1);
              var sURLVariables = sPageURL.split('&');
              for (var i = 0; i < sURLVariables.length; i++)
              {
                var sParameterName = sURLVariables[i].split('=');
                if(sParameterName[0] == sParam)
                {
                  return sParameterName[1];
                }
              }
        },
        getCertFilters: function()
        {
            certquery = '';
            $('.checkboxCert:checked').each(function()
            {
                certquery+=$(this).attr('value') + ',';
            });
			show = 1;
            projectList.search(1);
        },

        pageLoader: function(display)
        {
            if(display == 'hide')
            {
                $('.pageLoader').hide();	
            }
            else if(display == 'show')
            {
                $('.pageLoader').show();
            }
        },

        projectListClick: function(display)
        {
            $('body').on('click', '.list.project_row', function(e){
                LEED = $(this).attr('lid');
                PUBLIC = $(this).attr('class').split(' ')[0];
                SOURCE = $(this).attr('source');
                
                if(SOURCE == 'LEED')
                {
                    window.location.href = window.location.protocol + '//' + window.location.host + '/v3/dashboard/?page=score&LEED=' + LEED + '&public=' + PUBLIC;   
                }
                else
                {
                    GBIG = $(this).attr('gbig_id');
                    window.location.href = window.location.protocol + '//' + window.location.host + '/v3/dashboard/?page=score&LEED=' +LEED+'&public=' + PUBLIC+'&gbig=' + GBIG;        
                }

//                $.ajax(
//                {
//                    url: window.location.protocol + '//' + window.location.host + '/getByLEED/?lid='+ LEED,
//                    type: 'GET',
//                    contentType: 'application/json'
//                }).done(function(data)
//                {
//                    PUBLIC = data[0].id;  
//                    if(data[0].source_name == 'LEED')
//                    {
//                        window.location.href = window.location.protocol + '//' + window.location.host + '/v3/dashboard/?page=score&LEED=' + LEED + '&public=' + PUBLIC;
//                    }
//                    else
//                    {
//                        window.location.href = window.location.protocol + '//' + window.location.host + '/v3/dashboard/?page=score&LEED=0&public=' + PUBLIC;
//                    }
//                }).fail(function()
//                {
//                });

            });
        },
        
        initPage: function()
        {
            $('.hideLabel').hide();
            projectList.projectListClick();
            
            $('#id_building').on('blur', function()
            {
                if($('#id_building').val().length == 0)
                {
					show = 1;
                    projectList.search(1)
                }
            });


            $('#id_building').keyup('#id_building', function(e)
            {
				show = 1;
                clearTimeout($.data(this, 'timer'));
                if (e.keyCode == 13)
                {
				  projectList.search(1)
                }
                else
                {
                  $(this).data('timer', setTimeout(projectList.search(1), 50));
                }
            });
            
            if(String(projectList.getUrlParameter('q')) == 'undefined' || projectList.getUrlParameter('q').length >= 0)
            {
                $("#id_building").val(projectList.getUrlParameter('q'));
                $('#id_building').val($('#id_building').val().replace(/%20/g, " "));
            }

            $(window).bind("scroll.projectPageScroll", function(){
                if($(window).scrollTop() + $(window).height() >= $(document).height() - 10 && returnData >= 100) 
                   {
					   
					   if(logIn == 'True')
                       {
                           if(ACTIVATE_GBIG_SEARCH == 'True')
                           {
                                if(projectList.search_count > $('.list').length && projectList.xhr.status != undefined && projectList.xhr2.status != undefined)
                                {
                                   show += 1;
                                   projectList.pageLoader('show');
                                   projectList.search(show);			
                                }    
                           }
                           else if(ACTIVATE_GBIG_SEARCH == 'False')
                           {
                                if(projectList.search_count > $('.list').length && projectList.xhr.status != undefined)
                                {
                                   show += 1;
                                   projectList.pageLoader('show');
                                   projectList.search(show);			
                                }    
                           }
                       }
                       else if (logIn == 'False' && ACTIVATE_GBIG_SEARCH == 'True')
                       {
                            if(projectList.search_count > $('.list').length && projectList.xhr2.status != undefined)
                            {
                               show += 1;
                               projectList.pageLoader('show');
                               projectList.search(show);			
                            }    
                       }
				
                   }
            });

            $.ajax(
            {
                type: "GET",
                url: "/getcountriesstates/"
            }).done(function(data_code)
            {
                countries_states = data_code
                print_country("bCountry");
                print_state("bState", "");
            });

            for(i = new Date().getFullYear(); i >= 1900; i--)
            {
                $("#bYear").html($("#bYear").html() + '<option value="'+i+'">'+i+'</option>');      
            }

            $('.publicForm').on('keyup', function()
            {
                $(this).attr('placeholder', '');
                $(this).css('border-color', 'rgb(231, 227,223)');
                if($(this).attr('id') == "bNameForm" || $(this).attr('id') == "bCity")
                {
                    if($(this).val().length > 64)
                    {
                      $(this).val($(this).val().substr(0, 64));
                    }
                }
                else if($(this).attr('id') == "bAddress")
                {
                    if($(this).val().length > 128)
                    {
                      $(this).val($(this).val().substr(0, 128));
                    }
                }
                else if($(this).attr('id') == "bZipCode")
                {
                    if($(this).val().length > 10)
                    {
                      $(this).val($(this).val().substr(0, 10));
                    }
                }
                else if($(this).attr('id') == "bSqfeet")
                {
                    for(i=0;i<$(this).val().length;i++)
                    {
                        if(String(parseInt($(this).val()[i])) == "NaN")
                        {
                          $(this).val('');
                          $(this).attr('placeholder', 'Enter a number');
                          $(this).css('border-color', 'red');
                      } 
                    } 
                }
            });

            $(".publicForm").keyup(function(event)
            {
                if(event.keyCode == 13)
                {
                    $("#bSaveProject").click();
                }
            });

            $('#bSaveProject').on('click', function()
            {
                var proceed = 'true';
                $('.publicForm').each(function()
                {
                    $(this).val($(this).val().trim());

                    if($(this).val() == '')
                    {
                        if ($(this).attr('id') == "bState" && $(this).text() == "Not applicable"){
                            //do nothing
                        }
                        else{
                            proceed = false;      
                            $(this).attr('placeholder', 'Required');
                            $(this).css('border-color', 'red');
                        }
                    }
                    else if($(this).attr('placeholder') == 'Required')
                    {
                        proceed = false;  
                        $(this).css('border-color', 'red');
                    }
                });

                if(proceed)
                {
                    $('#bSaveProject').addClass('not-active');
					$('.form_field_modal_input').addClass('not-active');
                    json = {};   
                    $('.publicForm').each(function()
                    {
                        json[$(this).attr('name')] = $(this).val();
                    });
                    json['occupancy'] = "0";
                    json['operating_hours'] = "0";
                    json['points'] = "0";
                    json['certification'] = "";
                    json['publish'] = "true";
                    json['submitted_state'] = $("#bState").val();
                    json['year_constructed'] = $('#bYear').val();
                    json['confidential'] = "false";
                    json['rating_system_name'] = "LEED-NC 1.0 Pilot";
                    json['source'] = "LEED";
                    
                    $('#bSaveProject').html('SAVING...');
        //			$('#bSaveProject').css('background', '#95BF58 url("/static/dashboard/img/ajax-loader.gif") no-repeat 96%');

                    $('.addNewBuilding .loader_bg_add_new').show();
                    $('.addNewBuilding .loader').show();

                    $.ajax(
                    {
                        url: '/buildings/',
                        type: 'POST',
                        contentType: 'application/json',
                        data: JSON.stringify(json)
                    }).done(function(data)
                    {
                        json['id'] = data.leed_id;
                        json['source_id'] = data.leed_id;
						LEED_ID = data.leed_id;
                        $.ajax(
                        {
                            url: '/buildings/search_gbig/',
                            type: 'POST',
                            contentType: 'application/json',
                            data: JSON.stringify(json)
                        }).done(function(data)
                        {
                            $('#bSaveProject').removeClass('not-active');
                            $('.form_field_modal_input').removeClass('not-active');
                            $('.addNewBuilding').modal('toggle');
                            $('#bSaveProject').removeClass('not-active');
                            $('.form_field_modal_input').removeClass('not-active');
                                window.location.href = window.location.protocol + '//' + window.location.host + '/dashboard/?page=overview' + '&LEED='+ LEED_ID + '&modal=projectActive';    
                        });
                        
                    }).fail(function()
                    {
                        $('#bSaveProject').html('ADD PROJECT');
                        $('#bSaveProject').removeClass('not-active');
                        $('.form_field_modal_input').removeClass('not-active');
                    }); 
                    
//                    $.ajax(
//                    {
//                        url: '/buildings/search_gbig/',
//                        type: 'POST',
//                        contentType: 'application/json',
//                        data: JSON.stringify(json)
//                    }).done(function(data)
//                    {
//                        $('#bSaveProject').removeClass('not-active');
//						$('.form_field_modal_input').removeClass('not-active');
//                        window.location.href = window.location.protocol + '//' + window.location.host + '/dashboard/?page=overview' + '&LEED='+ data.leed_id + '&modal=projectActive';
//                    }).fail(function()
//					{
//						$('#bSaveProject').html('ADD PROJECT');
//						$('#bSaveProject').removeClass('not-active');
//						$('.form_field_modal_input').removeClass('not-active');
//					}); 

                }
            });

            $('#bCountry').change(function()
            {
              $('#bState').attr('placeholder', '');
              $('#bState').css('border-color', 'rgb(231, 227,223)');

              if($(this).val() == '')
              {
                  proceed = false;      
                  $(this).attr('placeholder', 'Required');
                  $(this).css('border-color', 'red');
              }
              else
              {
                  proceed = true; 
                  $(this).attr('placeholder', '');
                  $(this).css('border-color', 'rgb(231, 227,223)');
              }
            });

            $('#bState').change(function()
            {   
              if($(this).val() == '')
              {
                  proceed = false;      
                  $(this).attr('placeholder', 'Required');
                  $(this).css('border-color', 'red');
              }
              else
              {
                  proceed = true; 
                  $(this).attr('placeholder', '');
                  $(this).css('border-color', 'rgb(231, 227,223)');
              }
            });

            function addNewModal()
            {
                if(logIn == 'True')
                {
                    $('.addNewBuilding').modal('toggle');
                    $('.publicForm').each(function()
                    {
                        $(this).val("");
                    });	
                    $('#bNameForm').val($('#id_building').val());
                }
                else
                {
                    $("#login_iFrame").attr('src',window.location.protocol + '//' + window.location.host+'/auth/login/?NAME='+$("#id_building").val());
                    $('.login_modal').modal('toggle');	
                }
            }

//            $.ajax(
//            {
//                url: "/filters/",
//                type: 'GET',
//                contentType: 'application/json'
//            }).done(function(data)
//            {
////                for(cont in data[0])
//                {
//                    $('#listC').html($('#listC').html() + '<li country='+data[0][cont][0]+' class="deselected">'+data[0][cont][2]+' ('+String(data[0][cont][1]).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, ""+ String(data[0][cont][1])[0] +",")+')'+'</li>');
//                }  
                
            
                $('#id_country').html('<option value="none">Select country</option>');
            
                for(a in csJson.countries)
                {
//                    $('#listC').html($('#listC').html() + '<li country='+a+' class="deselected">'+csJson.countries[a]+'</li>');    
                    $('#id_country').html($('#id_country').html() + '<option value="'+a+'">'+csJson.countries[a]+'</option>');  
                }

                $('#id_country').on('change', function()
                {
                    
                    x = $('#id_country').val();
                    x_name = $('#id_country :selected').text();
                    
                    if($.inArray(x, showCard) == -1 && x != 'none')
                    {
                        showCard.push(x);
                        showCard_name.push(x_name);    
                        $('.selectedCountries').append('<div class="countryItem" country="'+x+'">'+x_name+'<span class="deleteC mont"> x</span></div>');
                    }
                    
                    if(x == 'none')
                    {
                        showCard = [];
                        showCard_name = [];
                        $('.countryItem').remove();
                    }
                    
                    $(".deleteC").on('click', function(e)
                    {
                        x = $(this).parent('.countryItem').attr('country');
                        x_name = showCard_name[showCard.indexOf(x)];
                        
                        $(this).parent('.countryItem[country='+x+']').remove();
                        showCard = jQuery.grep(showCard, function(value) 
                        {
                            return value != x;
                        });  
                        showCard_name = jQuery.grep(showCard_name, function(value) 
                        {
                            return value != x_name;
                        }); 
                        
                        cquery = '';
                        for (a in showCard)
                        {
                            cquery+=showCard[a] + ',';
                        }
                        show = 1;
                        projectList.search(1);
                        
                        e.stopPropagation();
                    });
                    
                    
                    cquery = '';
                    for (a in showCard)
                    {
                        cquery+=showCard[a] + ',';
                    }
                    show = 1;
                    projectList.search(1);
                    
//                    if($(this).parent().attr('id') == "listC")
//                    {
//                       x = $(this).attr('country');
//                       x_name = $(this).html();
//                    }
//                    if($(this).hasClass('selected'))
//                    {
//                        $(this).addClass('deselected');  
//                        $(this).removeClass('selected'); 
//                        if($(this).parent().attr('id') == "listC")
//                        {
//                            showCard = jQuery.grep(showCard, function(value) 
//                            {
//                              return value != x;
//                            });  
//                            showCard_name = jQuery.grep(showCard_name, function(value) 
//                            {
//                              return value != x_name;
//                            });  
//                        }
//                    }
//                    else if ($(this).hasClass('deselected'))
//                    {
//                        $(this).addClass('selected');  
//                        $(this).removeClass('deselected');
//                        if($(this).parent().attr('id') == "listC")
//                        {
//                            showCard.push(x);
//                            showCard_name.push(x_name);
//                        }
//                    }
//                    cquery = '';
//                    
//                    for (a in showCard)
//                    {
//                        cquery+=showCard[a] + ',';
//                    }
//					show = 1;
//                    projectList.search(1);
//
//                    $(".deleteC").on('click', function(e)
//                    {
//                        x = $(this).parent().attr('country');
//                        x_name = $(this).parent().find('.contName').html();
//                        
//                        showCard = jQuery.grep(showCard, function(value) 
//                        {
//                          return value != x;
//                        });  
//                        showCard_name = jQuery.grep(showCard_name, function(value) 
//                        {
//                          return value != x_name;
//                        });
//                        
//                        cquery = '';
//                        for (a in showCard)
//                        {
//                            cquery+=showCard[a] + ',';
//                        }
//
//                        show = 1;
//                        projectList.search(1);
//                    });
                });


//            });

            $('#listC').on('mouseover', function()
            {
                $('#listC').css('overflow-y', 'scroll');    
            });
            $('#listC').on('mouseout', function()
            {
                $('#listC').css('overflow-y', 'hidden');    
            });

            $('#addNew').on('click', function()
            {
                addNewModal();
            });
            $('#searchButton').on('click', function(e)
            {
				show = 1;
                projectList.search(1);
                e.stopPropagation();
            });
            $('#id_filters').on('click', function() {
                $('#filterSelectDiv').toggle();
                $(this).toggleClass('filterUpIcon');
            });
            $(".checkboxCert").change(function() 
            {
                projectList.getCertFilters();
            });
            
//            $(window).scroll(function() 
//            {
//                var div1 = $(".header");
//                var div2 = $(".searchLabels");
//                var div1_top = div1.offset().top;
//                var div2_top = div2.offset().top;
//                var div1_bottom = div1_top + div1.height();
//                var div2_bottom = div2_top + div2.height();
//
//                if (div1_bottom >= div2_top && div1_top < div2_bottom) 
//                {
//                    div2.addClass('labelFixed');
//                    div2.css('width', $('.search_results').css('width'));
//                }
//                else
//                {
//                    div2.removeClass('labelFixed');   
//                }
//            });
            
            
        },
        
        search: function(page)
        {
        //    $('#search_public').html('');
            
            html2 = "";
            html = "";

            if($("#id_building").val().length > 0)
            {
                History.pushState({}, "USGBC LEED Dashboard", '/v3/dashboard/?q='+$("#id_building").val());
            }
            else
            {
                if (document.URL.indexOf('page') > -1){
                    //Do nothing
                }
                else{
                    History.pushState({}, "USGBC LEED Dashboard", '/v3/dashboard/');
                }
            }
            
            if(logIn == 'True')
            {
                $('#search_public').hide();
                url = window.location.protocol + '//' + window.location.host +'/buildings/search/?input='+$("#id_building").val()+'&page='+page + '&country=' + cquery + '&cert=' + certquery;
                
                if (projectList.xhr != undefined)
                    projectList.xhr.abort();

                projectList.xhr = $.ajax({
                url: url,
                type: 'GET',
                contentType: 'application/json',
                }).done(function(data)
                {
                    $('#search_public').show();
                    if(data.length == 0)
                    {
                        $('#search_private').removeClass('mb60');    
                    }
                    else
                    {
                        $('#search_private').addClass('mb60');        
                    }
                    
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

                        id = data[i].id;
                        name = data[i].name;
                        if(data[i].city == 'None')
                            street = data[i].state;
                        if(data[i].state == 'None')
                            street = data[i].city;
                        if(data[i].city == 'None' && data[i].state == 'None')
                            street = '';
                        else if(data[i].city != 'None' && data[i].state != 'None')
                            street = data[i].city + ", " + data[i].state ;
                        points = parseInt(data[i].points);
                        lid = data[i].leed_id;
                        source_name = 'LEED';
                        cname = data[i].certification;
                        country = data[i].country;
                        trial_expire_date = data[i].trial_expire_date;
                        trial_status = data[i].trial_version_status;
                        building_status = data[i].building_status;

                        if(String(points) == "NaN")
                            points = '';

                        if (!(cname == 'Gold' || cname == 'Silver' || cname == 'Platinum' || cname == 'Bronze'))
                        {
                            cname = 'None';
                            cert_name = "";
                        }
                        else
                        {
                            cert_name = cname; 
                        }

                        if(trial_status == 'True' || building_status == 'activated' || building_status == 'agreement_pending' || building_status == 'payment_pending')
                        {
                            leedon_activated = 'True';
                        }
                        else
                        {
                            leedon_activated = 'False';
                        }

                        if(leedon_activated == 'False')
                        {
                            lid_show = lid;
                        }
                        else
                        {
                            lid_show = lid;    
                        }
                        
                        html = html + "<div leedon_activated = '"+leedon_activated+"' class='"+id+" list project_row mont' country = '"+country+"' cert = '"+cert_name+"' lid='"+lid+"' source = '"+source_name+"' trial_expire_date='"+trial_expire_date+"' trial_status='"+trial_status+"' building_status='"+building_status+"'><div class='listAttr' style='color: rgb(88, 150, 211);font-weight:bold;'>"+name+"</div><div class='listAttr'>"+street+"</div><div class='listAttr'>"+lid_show+"</div><div class='listAttr'>"+cert_name+"</div></div>";
                    }

                    if(page == 1)
                        $('#search_private').html(html);
                    else 
                        $('#search_private').html( $('#search_private').html() + html);


                    if (ACTIVATE_GBIG_SEARCH == "False"){
                        if($('#id_building').val().length > 0)
                        {
                            $('#srchStatus').html('<span id="srchCount"></span> Results for "<span id="srchTerm"></span>"');
                            $('#srchCount').html(data.length).toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                            $('#srchTerm').html($('#id_building').val());
                        }
                        else
                        {
                            $('#srchStatus').html((data.length).toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " Projects");    
                        }
                    }

                });
            }
            else{
                $('#search_private').parent().hide();
                $('.project_heading').removeClass('mt30');
            }

                url2 = window.location.protocol + '//' + window.location.host + '/buildings/search_gbig/?q=' + $("#id_building").val() + '&country=' + cquery + '&leed_level=' + certquery + '&page=' + page;
            
            if (projectList.xhr2 != undefined)
                projectList.xhr2.abort();

            projectList.xhr2 = $.ajax({
            url: url2,
            type: 'GET',
            contentType: 'application/json',
            }).done(function(data)
            {
				projectList.search_count = data.total_count;
                count = data.total_count;
                data = data.results;
                for (var i in data)
                {
                    
                    if(data[i].data.most_recent_leed != undefined)
                    {
                        cname = cert_name = data[i].data.most_recent_leed.level; 
                        
                        if (!(cert_name == 'Gold' || cert_name == 'Silver' || cert_name == 'Platinum' || cert_name == 'Bronze'))
                        {
                            cert_name = 'None';  
                            cname = '';
                        }
                        
                        lid = data[i].data.most_recent_leed.source_id;
                        id = data[i].data.most_recent_leed.id;
                        source_name = 'LEED';
                    }
                    else
                    {
                        cert_name = 'None';
                        cname = '';
                        lid = '0';
                        source_name = 'GBIG';
                        id = data[i].model_id;
                    }
                    
                    if(String(lid) == '0')
                    {
                        lid_show = '';        
                    }
                    else
                    {
                        lid_show = lid;    
                    }
                    
                    address = data[i].data.address.split(',');
                    leedon_activated = '';
                    country = address[address.length - 1]; 
                    trial_expire_date = '';
                    name = data[i].data.names[0];
                    street = address;
                    model_id = data[i].model_id;
                    
                    html2 = html2 + "<div gbig_id='"+model_id+"' leedon_activated = '"+leedon_activated+"' class='"+id+" list project_row gotham' country = '"+country+"' cert = '"+cert_name+"' lid='"+lid+"' source = '"+source_name+"' trial_expire_date='"+trial_expire_date+"'><div class='listAttr' style='color: rgb(88, 150, 211);font-weight:bold;'>"+name+"</div><div class='listAttr'>"+street+"</div><div class='listAttr'>"+lid_show+"</div><div class='listAttr'>"+cname+"</div></div>";    
                }
                
                if(page == 1)
                    $('#search_public').html(html2);
                 else
                    $('#search_public').html( $('#search_public').html() + html2);

                if (ACTIVATE_GBIG_SEARCH == "True"){
                    if($('#id_building').val().length > 0)
                    {
                        $('#srchStatus').html('<span id="srchCount"></span> Results for "<span id="srchTerm"></span>"');
                        $('#srchCount').html(count + $('#search_private .list').length).toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                        $('#srchTerm').html($('#id_building').val());
                    }
                    else
                    {
                        $('#srchStatus').html((count + $('#search_private .list').length).toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " Projects");    
                    }
                }

				projectList.pageLoader('hide');
            });

        }
        
    };
    $(document).ready(function()
    {
       // projectList.initPage();
//        projectList.search(1);
        
    });
    
}).call(this);
