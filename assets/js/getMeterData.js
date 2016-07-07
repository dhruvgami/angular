(function() 
{
    window.getMeterData = 
    {
        meterData: [],
        energy: [],
        water: [],
        humanexperience: [],
        waste: [],
        waste_chart: [],
        energy_flag: false,
        water_flag: false,
        setup_flag: false,
        waste_flag: false,
        transport_flag: false,
        human_flag: false,
        voc_flag : false,
        total_occupants : 0,
        total_respondent:0,
        payment_mode: '',
        counter_required_field: 0,
        stream_foreign_id: [],
        decoded_building_data: '',
        unique_notification_arr: [],
        one_time_tour_done: false,
        returnData : 100,
        disData : [],
        satisData: [],
        transport_data: [],
        meterAdded: false,
        meterListAdded: [],
		payment_mode: '',
        meter_type_list: [],
        
        isScrolledIntoView: function(elem)
        {
            var rect = elem[0].getBoundingClientRect();
            return (
                (rect.height > 0 || rect.width > 0) &&
                rect.bottom >= 0 &&
                rect.right >= 0 &&
                rect.top <= (window.innerHeight - 280 || document.documentElement.clientHeight - 280) &&
                rect.left <= (window.innerWidth || document.documentElement.clientWidth)
            );

            return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
        },        
        get_meter_types: function()
        {
            $electricity_meter_type = '<li class="other_fuel_unit"><a class="fuel_type_name" value="25">Purchased from grid</a></li>';
            $water_meter_type = '';
            $fuel_meter_type = '';
            if ((getMeterData.meter_type_list).length == 0)
            {
                $.ajax(
                {
                    url: 'assets/json/fuels.json',
                    type: 'GET',
                    contentType: 'application/json'
                }).done(function(data_fuelType)
                {
                    getMeterData.meter_type_list = data_fuelType;
                    for (var i = 0; i < (data_fuelType).length; i++)
                    {
                        if (data_fuelType[i].include_in_dropdown_list)
                        {
                            if (data_fuelType[i].kind == "electricity")
                            {
                                if (data_fuelType[i].subtype == 'On-site solar')
                                {
                                    $electricity_meter_type += '<li class="other_fuel_unit"><a class="fuel_type_name" value="' + data_fuelType[i].id + '">' + 'Generated onsite - solar' + '</a></li>';
                                }
                                else if (data_fuelType[i].subtype == "")
                                {
                                    $electricity_meter_type += '<li class="other_fuel_unit"><a class="fuel_type_name" value="' + data_fuelType[i].id + '">' + data_fuelType[i].type + '</a></li>';
                                }
                                else
                                {
                                    $electricity_meter_type += '<li class="other_fuel_unit"><a class="fuel_type_name" value="' + data_fuelType[i].id + '">' + data_fuelType[i].type + ' (' + data_fuelType[i].subtype + ')' + '</a></li>';
                                }
                            }
                            else if (data_fuelType[i].kind == "water")
                            {
                                if (data_fuelType[i].subtype == "")
                                {
                                    $water_meter_type += '<li class="other_fuel_unit"><a class="fuel_type_name" value="' + data_fuelType[i].id + '">' + data_fuelType[i].type + '</a></li>';
                                }
                                else
                                {
                                    $water_meter_type += '<li class="other_fuel_unit"><a class="fuel_type_name" value="' + data_fuelType[i].id + '">' + data_fuelType[i].type + ' (' + data_fuelType[i].subtype + ')' + '</a></li>';
                                };
                            }
                            else if (data_fuelType[i].kind == "fuel")
                            {
                                if (data_fuelType[i].subtype == "")
                                {
                                    $fuel_meter_type += '<li class="other_fuel_unit"><a class="fuel_type_name" value="' + data_fuelType[i].id + '">' + data_fuelType[i].type + '</a></li>';
                                }
                                else
                                {
                                    $fuel_meter_type += '<li class="other_fuel_unit"><a class="fuel_type_name" value="' + data_fuelType[i].id + '">' + data_fuelType[i].type + ' (' + data_fuelType[i].subtype + ')' + '</a></li>';
                                }
                            }
                        }
                    };
                    $('.energy_manual_ul').append($electricity_meter_type);
                    $('.water_manual_drp_ul').append($water_meter_type);
                    $('.other_fuel_drp_ul').append($fuel_meter_type);
                }).fail(function(data) {});
            }
        },
        
        setup: function()
        {
            $('body').on('click', '#addMeter', function()
            {
                $('#activation_modal').modal('toggle');   
            });
            
            $(window).scroll(function() 
            {
                if($(window).scrollTop() + $(window).height() >= $(document).height() - 10 && getMeterData.returnData >= 100) 
                {
                    if(plaqueNav.dataInputSection == '')
                    {
                        for (var x in plaque.assosiatedCategories)
                        {
                            if(plaque.assosiatedCategories[x].include_meter == true)
                            {
                                cat = plaque.assosiatedCategories[x].category;
                                len = $('.meterChart[type='+cat+']').length;
                                
                                if(getMeterData[cat] != undefined && $('.meterChart[type='+cat+']').length < getMeterData[cat].length && cat != 'waste' && editMeterData.dataProvider.length == 0)
                                {
                                    getMeterData.showMeters(len, plaque.assosiatedCategories[x]);  
                                }
                            }           
                        }        
                    }
                    else if(plaqueNav.dataInputSection != 'waste')
                    {
                        var flag = 0;
                        for (var x in plaque.assosiatedCategories)
                        {
                            if(plaque.assosiatedCategories[x].category == plaqueNav.dataInputSection) 
                            {
                                flag = x;    
                            }
                        }
                        cat = plaqueNav.dataInputSection;
                        len = $('.meterChart[type='+cat+']').length;
                        if(getMeterData[cat] != undefined && $('.meterChart[type='+cat+']').length < getMeterData[cat].length)
                        {
                            getMeterData.showMeters(len, plaque.assosiatedCategories[flag]);  
                        }    
                    }
                }
                
//                label  = $('.meterChart:in-viewport');
//                    
//                if(label.length > 0)
//                {
//                    if($(label[1]).attr('type') != type)
//                    {
//                        $('.color_bar').hide();
//                        $('.' + plaqueNav.dataInputSection + '_cat').removeClass(plaqueNav.dataInputSection + '_cat_active');    
//                    }
//
//                    type = $(label[1]).attr('type');
//                }

//                console.log(type);
//                
//                if (document.URL.indexOf("section") > -1 )
//                {
//                    var section_page = section;
//                    type = section_page;
//                }
//                else
//                {
//                    if(getMeterData.meterData.length == 0)
//                    {
//                        type = 'waste';
//                    }
//                    else
//                    {
//                        if(getMeterData.meterData[0].type.kind != 'water')    
//                        {
//                            type = 'energy';
//                        }
//                        else
//                        {
//                            type = 'water';
//                        }
//                    }
//                }
                
//                plaqueNav.dataInputSection = type;
//                $('.' + plaqueNav.dataInputSection + '_cat').addClass(plaqueNav.dataInputSection + '_cat_active');
//                $('.' + plaqueNav.dataInputSection + '_cat_color').show();  
                
            });           
			
			$('body').on('click', '.meterName',function()
			{
				meter_id = $(this).parent().parent().attr('meter_id');
				type = $(this).parent().parent().attr('type');
				color = $(this).parent().parent().attr('color');
                
                if(type == 'waste')
                {
                    color1 = $(this).parent().parent().attr('color1');
                    color2 = $(this).parent().parent().attr('color2');
                    editMeterData.editWasteMeter(type, color1, color2);        
                }
                else if(type == 'humanexperience')
                {
                    $('#upload_data').click();    
                }
				else
                {
                    for(a in getMeterData[type.toLowerCase()])
                    {
                        if(getMeterData[type.toLowerCase()][a].id == meter_id)
                        {
                            editMeterData.editMeter(getMeterData[type.toLowerCase()][a], type, color);
                        }
                    } 
                }
				
			});
            
        },
        
        getMeters: function(page)
        {
            $.ajax({
            url: 'assets/json/waste_generated_' + leed_id + '.json',
            type: "GET",
            }).done(function(waste_generated)
            {
                $.ajax({
                url: 'assets/json/waste_diverted_' + leed_id + '.json',
                type: "GET",
                }).done(function(waste_diverted)
                {
                    $.ajax(
                    {
                        url: 'assets/json/meters_' + leed_id + '.json',
                        type: "GET",
                        dataType: 'jsonp'
                    }).done(function(data) 
                    {
                        getMeterData.meterData = data;
                        getMeterData.water = [];
                        getMeterData.energy = [];
                        getMeterData.humanexperience = [];
                        getMeterData.waste = [];
                        getMeterData.waste_chart = [];
                        meterData_temp = [];
                        meterData_temp_co2_voc = [];
                        
                        for (a in waste_generated)
                        {
                            getMeterData.waste.push({ 
                                "start_date" : waste_generated[a].start_date.substring(0, 10),
                                "waste_generated" : waste_generated[a].reading,
                                "waste_diverted" : waste_diverted[a].reading,
                                "generated_id": waste_generated[a].id,
                                "diverted_id": waste_diverted[a].id,
                                "unit": waste_generated[a].unit,
                                "end_date": waste_generated[a].end_date.substring(0, 10),
                            });
                            
                            getMeterData.waste_chart.push({ 
                                "start_date" : waste_generated[a].start_date.substring(0, 10),
                                "waste_generated" : waste_generated[a].reading,
                                "waste_diverted" : waste_diverted[a].reading,
                                "generated_id": waste_generated[a].id,
                                "diverted_id": waste_diverted[a].id,
                                "unit": waste_generated[a].unit,
                                "end_date": waste_generated[a].end_date.substring(0, 10),
                            });
                        }
                        
                        for (var i = 0; i < getMeterData.meterData.length; i++) 
                        {
                            if (getMeterData.meterData[i].type.kind === "water" && getMeterData.meterData[i].status === "synced") 
                            {
                                getMeterData.water.push(getMeterData.meterData[i]);
                            }
                            else if (getMeterData.meterData[i].type.kind === "electricity"  && getMeterData.meterData[i].status === "synced") 
                            {getMeterData
                                meterData_temp.unshift(getMeterData.meterData[i]);
                            }
                            else if ((getMeterData.meterData[i].type.kind === "co2" || getMeterData.meterData[i].type.kind === "voc") && getMeterData.meterData[i].status === "synced")
                            {
                                meterData_temp_co2_voc.push(getMeterData.meterData[i]);
                            }
                            else 
                            {
                                if (getMeterData.meterData[i].status === "synced")
                                    getMeterData.energy.push(getMeterData.meterData[i]);
                            }
                        }
                        for (var i = 0; i < meterData_temp.length; i++) 
                        {
                            getMeterData.energy.unshift(meterData_temp[i]);
                        };

                        for (var i = 0; i < meterData_temp_co2_voc.length; i++) 
                        {
                            getMeterData.humanexperience.push(meterData_temp_co2_voc[i]);
                        };

                        for (var x in plaque.assosiatedCategories)
                        {
                            if(plaque.assosiatedCategories[x].category == 'humanexperience')
							{
								type = plaque.assosiatedCategories[x].category;
								label = plaque.assosiatedCategories[x].label;
								if (document.URL.indexOf("section") > -1 )
								{
									if (type  == section)
									{
										$('.meterList').append('<div class="meterType '+type+'_meter_label"><a href="#'+type+'_anchor">'+label+'</a></div>');
									}
									else
									{
										$('.meterList').append('<div class="meterType '+type+'_meter_label"><a href="#'+type+'_anchor">'+label+'</a></div>');
									}
								}
								else
								{
									$('.meterList').append('<div class="meterType '+type+'_meter_label"><a href="#'+type+'_anchor">'+label+'</a></div>');
                                }	
							}
							if(plaque.assosiatedCategories[x].include_meter == true && plaque.assosiatedCategories[x].category != 'waste')
                            {
                                getMeterData.showMeters(0, plaque.assosiatedCategories[x]);     
                            }
                            if(plaque.assosiatedCategories[x].category == 'waste')
                            {
                                type = plaque.assosiatedCategories[x].category;
                                label = plaque.assosiatedCategories[x].label;

                                if (document.URL.indexOf("section") > -1 ){
                                    if (type  == section){
                                        $('.meterList').append('<div class="meterType '+type+'_meter_label"><a href="#'+type+'_anchor">'+label+'</a></div>');
                                    }
                                    else{
                                        $('.meterList').append('<div class="meterType '+type+'_meter_label"><a href="#'+type+'_anchor">'+label+'</a></div>');
                                    }
                                }
                                else{
                                    $('.meterList').append('<div class="meterType '+type+'_meter_label"><a href="#'+type+'_anchor">'+label+'</a></div>');
                                }

                                
                                color1 = '#A29479';
                                color2 = '#74D681';
                                chart_id = 'waste_meter';
								
								if(getMeterData.waste.length == 0)
								{
									unit = 'lbs';
								}
								else
								{
									unit = getMeterData.waste[0].unit;	
								}

                                if (document.URL.indexOf("section") > -1 ) {
                                    if (type  == section){
                                        html = '<div color1="'+color1+'" color2="'+color2+'" type="'+type+'" class="meterChart '+type+'_meter"><div class="meterHeader"><div class="meterName">Waste Stream</div><div class="meterSetting"></div></div><div id="'+chart_id+'" class="chartArea" unit="'+unit+'"></div>';
                                    }
                                    else{
                                        html = '<div color1="'+color1+'" color2="'+color2+'" type="'+type+'" class="meterChart '+type+'_meter "><div class="meterHeader"><div class="meterName">Waste Stream</div><div class="meterSetting"></div></div><div id="'+chart_id+'" class="chartArea" unit="'+unit+'"></div>';
                                    }
                                }
                                else{
                                    html = '<div color1="'+color1+'" color2="'+color2+'" type="'+type+'" class="meterChart '+type+'_meter"><div class="meterHeader"><div class="meterName">Waste Stream</div><div class="meterSetting"></div></div><div id="'+chart_id+'" class="chartArea" unit="'+unit+'"></div>';
                                }


                                $('.'+type+'_meter_label').after(html);  

                                if(getMeterData.waste.length == 0)
                                {
									getMeterData.drawEmptyWasteChart(chart_id, color1, color2, unit)
                                }
                                else
                                {
                                    getMeterData.drawWasteChart(chart_id, color1, color2,getMeterData.waste, unit);   
                                }
                            }
                        }
                        getMeterData.getAndDrawTransportChart(plaque.assosiatedCategories[3]);
						getMeterData.getAndDrawSurveyChart(plaque.assosiatedCategories[4]); 
//						$('.data_input_stratergy_nav').css('left', $('.meterList').offset().left);
//                        $('.header_data_input').css('left', $('.meterList').offset().left);
                        manageNav.data_input_visibility();
                        
                        if (document.URL.indexOf("section") > -1 )
                        {
                            var section_page = section;
                            plaqueNav.dataInputNav($('.data_input_category[category-type=' + section_page + ']'));
                            plaqueNav.dataInputSection = section_page;
                        }
                        else
                        {
//                            if(getMeterData.meterData.length == 0)
//                            {
//                                plaqueNav.dataInputNav($('.data_input_category[category-type=waste]'));
//                                plaqueNav.dataInputSection = 'waste';
//                            }
//                            else
//                            {
//                                if(getMeterData.meterData[0].type.kind != 'water')    
//                                {
//                                    plaqueNav.dataInputNav($('.data_input_category[category-type=energy]'));
//                                    plaqueNav.dataInputSection = 'energy';
//                                }
//                                else
//                                {
//                                    plaqueNav.dataInputNav($('.data_input_category[category-type=water]'));
//                                    plaqueNav.dataInputSection = 'water';
//                                }
//                            }
                        }
                    });    
                });   
            });
        },
		drawEmptyChart: function(chart_id, color, unit)
		{
			start_date = new Date(new Date().getFullYear() + '-01-01');
			end_date = "";
			dataProvider_temp = [];
			for(i=0; i<=11; i++)
			{
			   date = new Date(editMeterData.modifyDates(start_date, 'month', '+' , i).year + '-' + editMeterData.modifyDates(start_date, 'month', '+' , i).month + '-' + editMeterData.modifyDates(start_date, 'month', '+' , i).date);

				dataProvider_temp.push({ 
					"date" : date,
					"value" : 0,
				});        
			}
			getMeterData.drawChart(chart_id, dataProvider_temp, color, 'empty', unit); 	
		},
        drawChart: function(chart_id, dataProvider, lineColor, type, unit)
        {
            
            if (chart_id == 'survey_chart' || chart_id == 'dissatisfation_chart'){
                custom_units = '%';
                graph_title  = '% of Respondents';
            }
            else{
                custom_units = '';
                graph_title  = '';
            }

            if(type == 'column')
            {
                if (chart_id == "dissatisfation_chart" || chart_id == "survey_chart" || chart_id == "transport_chart"){
                    categoryAxis = {
                        "gridPosition": "start",
                        "gridAlpha": 0,
                        "tickPosition": "start",
                        "tickLength": 20,
                        "dateFormats":[{period:'fff',format:'JJ:NN:SS'},
                                        {period:'ss',format:'JJ:NN:SS'},
                                        {period:'mm',format:'JJ:NN'},
                                        {period:'hh',format:'JJ:NN'},
                                        {period:'DD',format:'MMM DD'},
                                        {period:'WW',format:'MMM DD'},
                                        {period:'MM',format:'DD MMM'},
                                        {period:'YYYY',format:'YYYY'}]
                        }
                }
                else{
                    categoryAxis = {
                        "gridPosition": "start",
                        "title": "Dates",
                        "parseDates": true,
                        "dateFormats":[{period:'fff',format:'JJ:NN:SS'},
                                        {period:'ss',format:'JJ:NN:SS'},
                                        {period:'mm',format:'JJ:NN'},
                                        {period:'hh',format:'JJ:NN'},
                                        {period:'DD',format:'DD MMM'},
                                        {period:'WW',format:'MMM DD'},
                                        {period:'MM',format:'DD MMM'},
                                        {period:'YYYY',format:'YYYY'}]
                    }
                }
                
                var chart = AmCharts.makeChart( chart_id, {
                  "type": "serial",
                  "dataProvider": dataProvider,
                  "valueAxes": [ {
                    "unit": custom_units,
                    "gridAlpha": 0.2,
                    "dashLength": 0,
                    "axisAlpha": 0,
                    "position": "left",
                    "title": graph_title,
                    "minimum": 0
                  } ],
                  "gridAboveGraphs": true,
                  "startDuration": 1,
                  "graphs": [ {
                    "balloonText": "[[category]]: <b>[[value]]</b>",
                    "fillAlphas": 0.9,
                    "type": "column",
                    "valueField": "value",
                    "lineColor": lineColor,
                    "fixedColumnWidth": 20,
                  } ],
                   "dataDateFormat": "YYYY-MM-DD",
                  "chartCursor": {
                    "categoryBalloonEnabled": false,
                    "cursorAlpha": 0,
                    "zoomable": false
                  },
                  "categoryField": "date",
                  "categoryAxis": categoryAxis,
                  "export": {
                    "enabled": true
                  }

                } );    
            }
            else
            {
                var chart = AmCharts.makeChart(chart_id, {
                    "type": "serial",
                    "marginRight": 40,
                    "marginLeft": 40,
                    "autoMarginOffset": 20,
                    "dataDateFormat": "YYYY-MM-DD",
                    "valueAxes": [{
                        "position": "left",
						"title": unit,
                        "minimum": 0
                    }],
                    "balloon": {
                        "borderThickness": 1,
                        "shadowAlpha": 0
                    },
                    "graphs": [{
                        "id":"g1",
                        "balloonText": "[[category]]<br><b><span style='font-size:14px;'>[[value]]</span></b>",
                        "bullet": "round",
                        "bulletSize": 8,         
                        "lineColor": lineColor,
                        "lineThickness": 2,
                        "valueField": "value",
                         "fillAlphas":0.9,
                    }],

                    "chartCursor": {
                        "valueLineEnabled": true,
                        "valueLineBalloonEnabled": true,
                        "cursorAlpha":0,
                        "zoomable":false,
                        "valueZoomable":true,
                        "valueLineAlpha":0.5,
                        "cursorColor": lineColor,
                    },
                    "categoryField": "date",
                    "categoryAxis": {
                        "parseDates": true,
                        "dashLength": 1,
                        "minorGridEnabled": true,
                        "gridThickness": 0,
						"title": "Dates",
                        "dateFormats":[{period:'fff',format:'JJ:NN:SS'},
                                        {period:'ss',format:'JJ:NN:SS'},
                                        {period:'mm',format:'JJ:NN'},
                                        {period:'hh',format:'JJ:NN'},
                                        {period:'DD',format:'MMM DD'},
                                        {period:'WW',format:'MMM DD'},
                                        {period:'MM',format:'DD MMM'},
                                        {period:'YYYY',format:'YYYY'}]
                    },

                    "dataProvider": dataProvider
                });  
            
    
            }
            
        },
		drawEmptyWasteChart: function(chart_id, color1, color2, unit)
		{
			waste_temp_array = [];
			start_date = new Date(new Date().getFullYear() + '-01-01');
			end_date = "";
			dataProvider = [];
			for(i=0; i<=11; i++)
			{
				start_date = editMeterData.modifyDates(start_date, 'month', '+' , 1).year + '-' + editMeterData.modifyDates(start_date, 'month', '+' , 1).month + '-' + editMeterData.modifyDates(start_date, 'month', '+' , 1).date;

end_date = editMeterData.modifyDates(start_date, 'month', '+' , 1).year + '-' + editMeterData.modifyDates(start_date, 'month', '+' , 1).month + '-' + editMeterData.modifyDates(start_date, 'month', '+' , 1).date;

				waste_temp_array.push({ 
					"start_date" : start_date,
					"end_date" : end_date,
					"waste_diverted" : 0,
					"waste_generated" : 0,
				});        
			}
			getMeterData.drawWasteChart(chart_id, color1, color2, waste_temp_array, unit); 
		},
        drawWasteChart: function(chart_id, color1, color2,dataProvider, unit)
        {
            var chart = AmCharts.makeChart(chart_id, {
                "theme": "light",
                "type": "serial",
                "dataProvider": dataProvider,
                "valueAxes": [{
                    "position": "left",
					"title": unit,
                    "minimum": 0
                }],
                "startDuration": 1,
                "graphs": [{
                    "balloonText": "Waste Generated : <b>[[value]]</b>",
                    "fillAlphas": 0.9,
                    "lineAlpha": 0.2,
                    "lineColor": color1,
                    "title": "Waste Generated",
                    "type": "column",
                    "valueField": "waste_generated",
                    "fixedColumnWidth": 20,
                }, {
                    "balloonText": "Waste Diverted: <b>[[value]]</b>",
                    "fillAlphas": 0.9,
                    "lineAlpha": 0.2,
                    "title": "Waste Diverted",
                    "lineColor": color2,
                    "type": "column",
                    "clustered":false,
                    "valueField": "waste_diverted",
                    "fixedColumnWidth": 20,
                }],
                "plotAreaFillAlphas": 0.1,
                "categoryField": "start_date",
                "categoryAxis": {
                    "gridPosition": "start",
					"title": "Dates",
                    "parseDates": true,
                    "dateFormats":[{period:'fff',format:'JJ:NN:SS'},
                                    {period:'ss',format:'JJ:NN:SS'},
                                    {period:'mm',format:'JJ:NN'},
                                    {period:'hh',format:'JJ:NN'},
                                    {period:'DD',format:'DD MMM'},
                                    {period:'WW',format:'MMM DD'},
                                    {period:'MM',format:'DD MMM'},
                                    {period:'YYYY',format:'YYYY'}]
                },
                "export": {
                    "enabled": true
                 }

            });
        },
        getAndDrawTransportChart: function(category)
        {
            $.ajax({
                type: "GET",
                dataType: 'jsonp',
                url: "/buildings/LEED:" + plaque.LEED + "/survey/transit/summary/"
            }).done(function(data)
            {
                type = category.category;   
                label = category.label;
                color = category.color;
                getMeterData.transport_data = [];
                
                for (a in data.modes)
                {
                    getMeterData.transport_data.push({
                        "date": a,
                        "value": data.modes[a]
                    });   
                }
                
                if (document.URL.indexOf("section") > -1 )
                {
                    if (type  == section)
                    {
                        $('.meterChart.waste_meter').after('<div class="meterType '+type+'_meter_label"><a href="#'+type+'_anchor">'+label+'</a></div>');
                    }
                    else
                    {
                        $('.meterChart.waste_meter').after('<div class="meterType '+type+'_meter_label "><a href="#'+type+'_anchor">'+label+'</a></div>');
                    }
                }
                else
                {
                    $('.meterChart.waste_meter').after('<div class="meterType '+type+'_meter_label "><a href="#'+type+'_anchor">'+label+'</a></div>');  
                }
                if (document.URL.indexOf("section") > -1 ) 
                {
                    if (type  == section)
                    {
                        $('.'+type+'_meter_label').after('<div color="'+color+'" type="'+type+'" class="meterChart '+type+'_meter"><div class="meterHeader"><div class="meterName">Survey Response</div></div><div id="transport_chart" class="chartArea"></div>');
                    }
                    else
                    {
                        $('.'+type+'_meter_label').after('<div color="'+color+'" type="'+type+'" class=" meterChart '+type+'_meter"><div class="meterHeader"><div class="meterName">Survey Response</div></div><div id="transport_chart" class="chartArea"></div>');
                    }
                }
                else
                {
                    $('.'+type+'_meter_label').after('<div color="'+color+'" type="'+type+'" class="meterChart '+type+'_meter"><div class="meterHeader"><div class="meterName">Survey Response</div></div><div id="transport_chart" class="chartArea"></div>');
                }
                getMeterData.drawChart("transport_chart", getMeterData.transport_data, color, 'column'); 
                
            });    
        },
        getAndDrawSurveyChart: function(category)
        {
            $.ajax({
              type: "GET",
              dataType: 'jsonp',
              url: "/buildings/LEED:" + plaque.LEED + "/survey/environment/summary/"
            }).done(function(data)
            {
                disCategories = ['dirty', 'smelly', 'stuffy', 'loud', 'hot', 'cold', 'dark', 'glare', 'privacy', 'other'];
                getMeterData.disData = [];
                $.each(disCategories, function(index, value) 
                {
                    if (value == "other" && data.other > 0) 
                    {
                        var sum = getMeterData.disData.reduce(function(pv, cv) { return pv + cv; }, 0);
                        return getMeterData.disData.push(100-sum);
                    }
                    else 
                    {
                        if (data.complaints[value]) 
                        {
                            return getMeterData.disData.push(data.complaints[value]);
                        } 
                        else 
                        {
                            return getMeterData.disData.push(0);
                        }
                    }
                });
                for(a in getMeterData.disData)
                {
                    getMeterData.disData[a] = {"date": disCategories[a], "value": getMeterData.disData[a]};        
                }
                
                type1 = category.category;
                
                for (a in data.satisfaction)
                {
                    getMeterData.satisData.push({
                        "date": a,
                        "value": data.satisfaction[a]
                    });   
                }

                if (document.URL.indexOf("section") > -1 ) 
                {
                    if (type1  == section)
                    {
                        $('.'+type1+'_meter_label').after('<div color="#9E8FC4" type="'+type1+'" class="meterChart '+type1+'_meter"><div class="meterHeader"><div class="meterName">Dissatisfation Level</div></div><div id="dissatisfation_chart" class="chartArea"></div>');
                    }
                    else
                    {
                        $('.'+type1+'_meter_label').after('<div color="#9E8FC4" type="'+type1+'" class=" meterChart '+type1+'_meter"><div class="meterHeader"><div class="meterName">Dissatisfation Level</div></div><div id="dissatisfation_chart" class="chartArea"></div>');
                    }
                }
                else
                {
                    $('.'+type1+'_meter_label').after('<div color="#9E8FC4" type="'+type1+'" class="meterChart '+type1+'_meter"><div class="meterHeader"><div class="meterName">Dissatisfation Level</div></div><div id="dissatisfation_chart" class="chartArea"></div>');
                }

                getMeterData.drawChart("dissatisfation_chart", getMeterData.disData, category.color, 'column');
                
                if (document.URL.indexOf("section") > -1 ) 
                {
                    if (type1  == section)
                    {
                        $('.'+type1+'_meter_label').after('<div color="#9E8FC4" type="'+type1+'" class="meterChart '+type1+'_meter"><div class="meterHeader"><div class="meterName">Satisfaction Rating</div></div><div id="survey_chart" class="chartArea"></div>');
                    }
                    else
                    {
                        $('.'+type1+'_meter_label').after('<div color="#9E8FC4" type="'+type1+'" class=" meterChart '+type1+'_meter"><div class="meterHeader"><div class="meterName">Satisfaction Rating</div></div><div id="survey_chart" class="chartArea"></div>');
                    }
                }
                else
                {
                    $('.'+type1+'_meter_label').after('<div color="#9E8FC4" type="'+type1+'" class="meterChart '+type1+'_meter"><div class="meterHeader"><div class="meterName">Satisfaction Rating</div></div><div id="survey_chart" class="chartArea"></div>');
                }

                getMeterData.drawChart("survey_chart", getMeterData.satisData, category.color,  'column'); 
                
                // plaqueNav.removeStrategiesLoadingMessage();
            });    
        },
        fetchMeterData: function(options)
        {
            $.ajax(
            {
                type: "GET",
                dataType: 'jsonp',
                url: "/buildings/LEED:" + plaque.LEED + "/meters/ID:" + options.id + "/data/?start=2012-01-01&end=2020-01-01&limit=12&order=recent"
            }).done(function(data)
            {
                if(data.length > 0)
                {
                    start_date = data[0].start_date.substring(0, 10);
                    end_date = data[data.length - 1].end_date.substring(0, 10);
                    max_reading = data[0].reading;
                    min_reading = data[0].reading;
                    var chart_id = options.chart_id;
                    dataProvider = [];
                    temp = '';
                    for (x in data)
                    {
                        if(data[x].reading > max_reading)
                            max_reading = data[x].reading;
                        if(data[x].reading < min_reading)
                            min_reading = data[x].reading;

                        dataProvider.push({ 
                            "date" : data[x].start_date.substring(0, 10),
                            "value" : data[x].reading,
                        });
                        temp += '{"date": "'+data[x].start_date.substring(0, 10)+'", "value": '+data[x].reading+'},'
                    }
                    if(options.type == 'humanexperience')
                    {
                        getMeterData.drawChart(chart_id, dataProvider, options.lineColor, 'column', options.unit);    
                    }
                    else
                    {
                        getMeterData.drawChart(chart_id, dataProvider, options.lineColor, 'smoothedLine', options.unit);    
                    }
                }
                else
                {
                    getMeterData.drawEmptyChart(options.chart_id, options.lineColor, options.unit);
                }

                manageNav.data_input_visibility();
            });    
        },
        showMeters: function(start, category)
        {
            type = category.category;
            color = category.color;
            label = category.label;
            
            meterList = getMeterData[type];
            html = '';
            
            if(meterList != undefined && meterList.length > 0)
            {
                limit = start;
                i = 0;
                if (start == 0 && type != 'humanexperience')
                {   
                    if (document.URL.indexOf("section") > -1 ){
                        if (type  == section){
                            $('.meterList').append('<div class="meterType '+type+'_meter_label"><a href="#'+type+'_anchor">'+label+'</a></div>');
                        }
                        else{
                            $('.meterList').append('<div class="meterType '+type+'_meter_label"><a href="#'+type+'_anchor">'+label+'</a></div>');
                        }
                    }
                    else{
                        $('.meterList').append('<div class="meterType '+type+'_meter_label "><a href="#'+type+'_anchor">'+label+'</a></div>');  
                    }
                }
                for(i in meterList)
                {
                    if(limit < (start + 5) && limit < meterList.length)
                    {
                        title = meterList[limit].name;
                        id = meterList[limit].id;
                        unit = meterList[limit].native_unit;
                        var start_date, end_date;
                        var max_reading, min_reading;
                        var chart_id = type + '_meter_' + id;

                        if (document.URL.indexOf("section") > -1 ) {
                            if (type  == section){
                                html = '<div color="'+color+'" type="'+type+'" class="meterChart '+type+'_meter" meter_id="'+ id +'"><div class="meterHeader"><div class="meterName">'+title+'</div><div class="meterSetting"></div></div><div id="'+chart_id+'" class="chartArea" unit="'+unit+'"></div>';
                            }
                            else{
                                html = '<div color="'+color+'" type="'+type+'" class="meterChart '+type+'_meter " meter_id="'+ id +'"><div class="meterHeader"><div class="meterName">'+title+'</div><div class="meterSetting"></div></div><div id="'+chart_id+'" class="chartArea" unit="'+unit+'"></div>';
                            }
                        }
                        else{
                            html = '<div color="'+color+'" type="'+type+'" class="meterChart '+type+'_meter" meter_id="'+ id +'"><div class="meterHeader"><div class="meterName">'+title+'</div><div class="meterSetting"></div></div><div id="'+chart_id+'" class="chartArea" unit="'+unit+'"></div>';
                        }

                        if(start == 0)
                        {
                            $('.'+type+'_meter_label').after(html);    
                        }
                        else
                        {
                            $('.'+type+'_meter').last().after(html);    
                        }
                        
                        getMeterData.fetchMeterData({
                            "id": id,
                            "type": type,
                            "lineColor": color,
                            "chart_id": chart_id,
							"unit": unit,
                        }); 

                        limit += 1;
                    }
                }
            }
        },
        showNewMeter: function(type, id, title, unit)
        {
            var color = "";
            var chart_id = type + "_meter_" + id;
            var label = "";
            for (var x in plaque.assosiatedCategories)
            {
                if(plaque.assosiatedCategories[x].category == type)
                {
                    color = plaque.assosiatedCategories[x].color;
                    label = plaque.assosiatedCategories[x].label;
                }           
            }  
            
			if ($('.' +type+ '_meter_label').length == 0)
            {   
                if(type == 'water')
                {
                    if (document.URL.indexOf("section") > -1 )
                    {
                        if (type  == section)
                        {
                            $('.waste_meter_label').before('<div class="meterType '+type+'_meter_label"><a href="#'+type+'_anchor">'+label+'</a></div>');
                        }
                        else
                        {
                            $('.waste_meter_label').before('<div class="meterType '+type+'_meter_label "><a href="#'+type+'_anchor">'+label+'</a></div>');
                        }
                    }
                    else
                    {
                        $('.waste_meter_label').before('<div class="meterType '+type+'_meter_label "><a href="#'+type+'_anchor">'+label+'</a></div>');  
                    }     
                }
                else if(type == 'energy')
                {
                    if (document.URL.indexOf("section") > -1 )
                    {
                        if (type  == section)
                        {
                            $('.meterList').prepend('<div class="meterType '+type+'_meter_label"><a href="#'+type+'_anchor">'+label+'</a></div>');
                        }
                        else
                        {
                            $('.meterList').prepend('<div class="meterType '+type+'_meter_label "><a href="#'+type+'_anchor">'+label+'</a></div>');
                        }
                    }
                    else
                    {
                        $('.meterList').prepend('<div class="meterType '+type+'_meter_label "><a href="#'+type+'_anchor">'+label+'</a></div>');  
                    }    
                }
            }
            
            if (document.URL.indexOf("section") > -1)
            {
                if (type == section)
                {
                    html = '<div color="' + color + '" type="' + type + '" class="meterChart ' + type + '_meter" meter_id="' + id + '"><div class="meterHeader"><div class="meterName">' + title + '</div><div class="meterSetting"></div></div><div id="' + chart_id + '" class="chartArea" unit="'+unit+'"></div>';
                }
                else
                {
                    html = '<div color="' + color + '" type="' + type + '" class="meterChart ' + type + '_meter " meter_id="' + id + '"><div class="meterHeader"><div class="meterName">' + title + '</div><div class="meterSetting"></div></div><div id="' + chart_id + '" class="chartArea" unit="'+unit+'"></div>';
                }
            }
            else
            {
                html = '<div color="' + color + '" type="' + type + '" class="meterChart ' + type + '_meter" meter_id="' + id + '"><div class="meterHeader"><div class="meterName">' + title + '</div><div class="meterSetting"></div></div><div id="' + chart_id + '" class="chartArea" unit="'+unit+'"></div>';
            }
            
            getMeterData.setup();
            $('.' + type + '_meter_label').after(html);
			getMeterData.drawEmptyChart(chart_id, color, unit);
//            $('.meterChart[meter_id='+ id +'] .meterHeader .meterSetting').click();
        },
        filterMeters: function()
        {
            if(plaqueNav.dataInputSection != '')
            {
                $('.meterChart').hide();
                $('.meterType').hide();
                $('.' + plaqueNav.dataInputSection + '_meter').show();   
                $('.' + plaqueNav.dataInputSection + '_meter_label').show();
//                getMeterData.jump('.' + plaqueNav.dataInputSection + '_meter_label');
            
            }
            else
            {
                $('.meterChart').show();  
                $('.meterType').show();
//                getMeterData.jump('.energy_meter_label');
            }
        },
        jump: function(h) 
        {
            var top = $(h).offset().top,
                left = $(h).offset().left;
            var animator = createAnimator({
                start: [0,0],
                end: [left, top - 260],
                duration: 1000
            }, function(vals){
                console.log(arguments);
                window.scrollTo(vals[0], vals[1]);
            });

            //run
            animator();
            
            //Animator
            //Licensed under the MIT License
            function createAnimator(config, callback, done)
            {
                if (typeof config !== "object") throw new TypeError("Arguement config expect an Object");

                var start = config.start,
                    mid = $.extend(
                    {}, start), //clone object
                    math = $.extend(
                    {}, start), //precalculate the math
                    end = config.end,
                    duration = config.duration || 1000,
                    startTime, endTime;

                //t*(b-d)/(a-c) + (a*d-b*c)/(a-c);
                function precalculate(a, b, c, d)
                {
                    return [(b - d) / (a - c), (a * d - b * c) / (a - c)];
                }

                function calculate(key, t)
                {
                    return t * math[key][0] + math[key][1];
                }

                function step()
                {
                    var t = Date.now();
                    var val = end;
                    if (t < endTime)
                    {
                        val = mid;
                        for (var key in mid)
                        {
                            mid[key] = calculate(key, t);
                        }
                        callback(val);
                        requestAnimationFrame(step);
                    }
                    else
                    {
                        callback(val);
                        done && done();
                    }
                }

                return function()
                {
                    startTime = Date.now();
                    endTime = startTime + duration;

                    for (var key in math)
                    {
                        math[key] = precalculate(startTime, start[key], endTime, end[key]);
                    }

                    step();
                }
            }
            
        }
        
    };
    $( document ).ready(function() 
    {
        getMeterData.setup();
        getMeterData.getMeters();
        getMeterData.get_meter_types();
    });
        
}).call(this);