(function() 
{
    window.editMeterData = 
    {
		tab_selected: 'meter',
		dataProvider: [],
        meter_data: [],
		start_date: '',
		end_date: '',
		max_reading: 0,
		min_reading: 0,
        meter_id: 0,
        color: '',
        color1: '',
        color2: '',
        energy_units: ['kWh','MWh','MBtu','kBtu','GJ'],
        water_units: ['gal', 'kGal', 'MGal', 'cf', 'ccf', 'kcf', 'mcf', 'l', 'cu m', 'gal(UK)', 'kGal(UK)', 'MGal(UK)'],
        waste_units: ['lbs', 'kg', 'tons'],
        meter_type: '',
        meter_unit: '',
        meter_sub_type: '',
        meter_sub_type_id: '',
        meter_backend_type: '',
        sortOrder: 'asc',
		
		splitDate: function(date)
		{
            
            if(Modernizr.touch)
            {
                var dateAr = date.split('/');
			    return dateAr[1] + '/' + dateAr[2] + '/' + dateAr[0];
            }
			else
            {
                var dateAr = date.split('-');
			    return dateAr[1] + '-' + dateAr[2] + '-' + dateAr[0];    
            }
			
		},
		splitDateBack: function(date)
		{
			if(Modernizr.touch)
            {
                var dateAr = date.split('/');
			    return dateAr[2] + '/' + dateAr[0] + '/' + dateAr[1];        
            }
            else
            {
                var dateAr = date.split('-');
			    return dateAr[2] + '-' + dateAr[0] + '-' + dateAr[1];    
            }
			
		},
     	setup: function()
		{
            var selType = '';
            var selUnit = '';
            $('body').on('click', '.data_input_tool_bar',function()
			{
				if($(this).html != 'Inputs')
				{
                    if(editMeterData.meter_type == 'waste')
                    {
                    	chart_id = editMeterData.meter_type.toLowerCase() + "_meter" ;
						if(getMeterData.waste.length == 0)
						{
							getMeterData.drawEmptyWasteChart(chart_id, editMeterData.color1, editMeterData.color, editMeterData.meter_unit)	
						}
						else
						{
							getMeterData.drawWasteChart(chart_id, editMeterData.color1, editMeterData.color2, getMeterData.waste, editMeterData.meter_unit); 		
						}    
                    }
                    else if(editMeterData.meter_type == 'humanexperience')
                    {
                        
                    }
                    else
                    {
                        chart_id = editMeterData.meter_type.toLowerCase() + "_meter_" + editMeterData.meter_id;
                        if(editMeterData.dataProvider.length == 0)
						{
							getMeterData.drawEmptyChart(chart_id, editMeterData.color, editMeterData.meter_unit);
						}
						else
						{
							getMeterData.drawChart(chart_id, editMeterData.dataProvider, editMeterData.color,  'smoothedLine', editMeterData.meter_unit);    
						}  
                    }
                    
					$('.meterList').show();	
					$('.editMeter').hide();
					$('#meter_chart').html('');
					$('.data_input_tool_bar').html('Inputs');
                    $('.data_input_category_nav').show();
                    $('.survey_tool_bar').show();
                    $('.data_input_tool_bar').removeClass('back_to_all_img');
                    $('.data_input_tool_bar').addClass('input_nav_active');
					editMeterData.dataProvider = [];
                    $('.waste_meter').show();
                    $('#add_data_button').hide();
					
					$('.start_date_manually').val("");
					$('.end_date_manually').val("");
					$('.usage_manually').val("");
					$('.generated_manually').val("");
					$('.diverted_manually').val("");
				}
				
			});
			$('body').on('click', '.tab_item', function(event) 
			{
				$('.tab_item[tab-data='+editMeterData.tab_selected+']').removeClass('tab_active').addClass('tab_inactive');
				$(this).addClass('tab_active');
				
				editMeterData.tab_selected = $(this).attr('tab-data');
				$('.tab_content').hide();
				 
				$('.tab_content[tab-data='+editMeterData.tab_selected+']').show();
			});
            
            $('body').on('click', '#add_data_button', function(event) 
			{
				$('#add_data_modal').modal('toggle');
			});
            
            $('body').on('click','#add_reading_btn', function()
            {
                if(Modernizr.touch)
                {
                    start = $('.start_date_manually_modal').val();   
                    end = $('.end_date_manually_modal').val();   
                    reading = $('.usage_manually_modal').val();
                    generated = $('.generated_manually_modal').val();
                    diverted = $('.diverted_manually_modal').val();     
                }
                else
                {
                    start = $('.start_date_manually').val();   
                    end = $('.end_date_manually').val();   
                    reading = $('.usage_manually').val();
                    generated = $('.generated_manually').val();
                    diverted = $('.diverted_manually').val();    
                }
				
				if(new Date(editMeterData.exceptionForNewDate(start)) > new Date(editMeterData.exceptionForNewDate(end)))
				{
					$('.error_data_text').html('Start Date for the reading is greater than the End Date.');	
					$('#incorrectManualData').modal('toggle');
				}
				else if(reading < 0)
				{
					$('.error_data_text').html('Meter reading should be greater than 0.');	
					$('#incorrectManualData').modal('toggle');		
				}
				else if(generated < 0)
				{
					$('.error_data_text').html('Waste generated reading should be greater than 0.');	
					$('#incorrectManualData').modal('toggle');		
				}
				else if(diverted < 0)
				{
					$('.error_data_text').html('Waste diverted reading should be greater than 0.');	
					$('#incorrectManualData').modal('toggle');		
				}
                else if(editMeterData.meter_type == 'waste')
                {
                    editMeterData.insertDataRow(editMeterData.splitDateBack(start), editMeterData.splitDateBack(end), generated, diverted);   
                }
                else
                {
                    editMeterData.insertDataRow(editMeterData.splitDateBack(start), editMeterData.splitDateBack(end), reading);    
                }
            });
            
            $('body').on('click', '.unit_menu li a', function ()
            {
                editMeterData.meter_unit = $(this).text();
                $('#selectUnit').html(editMeterData.meter_unit + '<i class="fa fa-angle-down" style="float: right;margin-top: 3px;"></i>');
            });
            
            $('body').on('click', '.cat_menu li a', function ()
            {
                editMeterData.meter_sub_type = $(this).text();  
                editMeterData.meter_sub_type_id = parseInt($(this).attr('value'), 10);  
                $('#selectCat').html(editMeterData.meter_sub_type + '<i class="fa fa-angle-down" style="float: right;margin-top: 3px;"></i>');
            });
            $('body').on('click', "#area_type li a", function(){
                  var typeId = $(this).attr('value');
                  $("#area_type_energy_text:first-child").find('.area_type_txt').text($(this).text());
                  $("#area_type_energy_text:first-child").find('.area_type_txt').attr('value', typeId);
            });
              $('body').on('click', "#responsibility li a", function(){
                  var typeId = $(this).attr('value');
                  $("#responsibility_text:first-child").find('.responsibility_txt').text($(this).text());
                  $("#responsibility_text:first-child").find('.responsibility_txt').attr('value', typeId);
            });
            
//            $('body').on('click', '.cat_item', function ()
//            {
//                var selText = $(this).html();
//                html = '';
//                if(selText == 'Energy')
//                {
//                    for(a in editMeterData.energy_units)
//                    {
//                        html += '<li><a>'+editMeterData.energy_units[a]+'</a></li>';        
//                    }
//                }
//                else if(selText == 'Water')
//                {
//                    for(a in editMeterData.water_units)
//                    {
//                        html += '<li><a>'+editMeterData.water_units[a]+'</a></li>';        
//                    }
//                }
//                $('.unit_menu').html(html);
//            });
            
            $('body').on('click', '#updateMeterSetting', function()
            {
                $('.loader_gif_editMeter_unit').show();
                if(editMeterData.meter_type != 'waste')
                {
                    json = {
                        'name': $('.meter_name_edit').val(),
                        'native_unit': editMeterData.meter_unit,
                        'data_coverage_area': $('#data_coverage_area').val(),
                        'max_coverage_area': $('#max_coverage_area').val(),
                        'area_choice': $('.area_type_txt').attr('value'),
                        'responsibility': $('.responsibility_txt').attr('value'),
                        'type':{
                                'id': editMeterData.meter_sub_type_id
                            }
                        }
                    $.ajax(
                    {
                        url: '/buildings/LEED:' + plaque.LEED + '/meters/ID:' + editMeterData.meter_id + '/?recompute_score=1',
                        type: 'PUT',
                        contentType: 'application/json',
                        data: JSON.stringify(json)
                    }).done(function(data)
                    {
                        for(a in getMeterData[editMeterData.meter_type.toLowerCase()])
                        {
                            if(getMeterData[editMeterData.meter_type.toLowerCase()][a].id == editMeterData.meter_id)
                            {
                                getMeterData[editMeterData.meter_type.toLowerCase()][a] = data;        
                            }
                        }
                        $('#'+editMeterData.meter_type.toLowerCase()+'_meter_'+editMeterData.meter_id).attr('unit', data.native_unit);
                        $('#'+editMeterData.meter_type.toLowerCase()+'_meter_'+editMeterData.meter_id).siblings().find('.meterName').html(data.name);
                        editMeterData.meter_unit = data.native_unit;
                        $('#meterName').html(data.name);
                        $('.loader_gif_editMeter_unit').hide();
						$('.selected_meter_unit').html(editMeterData.meter_unit);
                        getMeterData.drawChart('meter_chart', editMeterData.dataProvider, editMeterData.color, 'smoothedLine', editMeterData.meter_unit);
                    }).fail(function(data){
                        $('.loader_gif_editMeter_unit').hide();
                    });   
                }
                else
                {
                    json = {'unit': editMeterData.meter_unit}
                    $.ajax(
                    {
                        url: '/buildings/LEED:' + plaque.LEED + '/update/waste/generated/?recompute_score=1',
                        type: 'PUT',
                        contentType: 'application/json',
                        data: JSON.stringify(json)
                    }).done(function(data)
                    {
                        $.ajax(
                        {
                            url: '/buildings/LEED:' + plaque.LEED + '/update/waste/diverted/?recompute_score=1',
                            type: 'PUT',
                            contentType: 'application/json',
                            data: JSON.stringify(json)
                        }).done(function(data)
                        {
                            for(a in getMeterData[editMeterData.meter_type.toLowerCase()])
                            {
                                getMeterData[editMeterData.meter_type.toLowerCase()][a].unit = editMeterData.meter_unit;            
                            }
                            $('#waste_meter').attr('unit', editMeterData.meter_unit);
                            $('.loader_gif_editMeter_unit').hide();
							$('.selected_meter_unit').html(editMeterData.meter_unit);
                            getMeterData.drawWasteChart('meter_chart', editMeterData.color1, editMeterData.color2, getMeterData.waste, editMeterData.meter_unit);
                        }).fail(function(data){
                            $('.loader_gif_editMeter_unit').hide();
                        });   
                    }).fail(function(data){
                        $('.loader_gif_editMeter_unit').hide();
                    }); 
                }
            });
            
            $('body').on('click', '.delete_meter', function()
            {
                $('#delete_meter_alert').modal('toggle');    
            });
            
            $('body').on('click', '#delete_meter_alert_submit', function()
            {
                $.ajax({
                url: '/buildings/LEED:' + plaque.LEED + '/meters/ID:' + editMeterData.meter_id + '/?recompute_score=1',
                type: 'DELETE',
                contentType: 'application/json'
                }).done(function(data)
                {
                    $('.meterChart[meter_id='+editMeterData.meter_id+']').remove();
                    $('.data_input_tool_bar').click();
                });  
            });
            
            $('body').on('click', '#sortOrder', function()
            {
                if(editMeterData.sortOrder == 'asc')
                {
                    editMeterData.sortOrder = 'desc';
                    $(this).html('OLDEST ↓');    
                }
                else if(editMeterData.sortOrder == 'desc')
                {
                    editMeterData.sortOrder = 'asc';
                    $(this).html('NEWEST ↓');    
                }
                editMeterData.sortRows(editMeterData.sortOrder);
            });
		},
        insertDataRow: function(start, end, reading, reading1)
        {
            index = -2;
            
            if(Modernizr.touch)
            {
                start = start.split('-').join('/');
                end = end.split('-').join('/');
            }
            
            if(editMeterData.start_date == '' && editMeterData.end_date == '')
            {
                index = 0;   
                editMeterData.start_date = start;
                editMeterData.end_date = end;
            }
            else if(new Date(editMeterData.exceptionForNewDate(start)) >= new Date(editMeterData.exceptionForNewDate(editMeterData.end_date)) && new Date(editMeterData.exceptionForNewDate(end)) >= new Date(editMeterData.exceptionForNewDate(editMeterData.end_date)))
            {
                if(editMeterData.sortOrder == 'asc')
                {
                    index = editMeterData.meter_data.length - 1;    
                }
                else
                {
                    index = -1;    
                }
                editMeterData.end_date = end;
            }
            else if(new Date(editMeterData.exceptionForNewDate(start)) <= new Date(editMeterData.exceptionForNewDate(editMeterData.start_date)) && new Date(editMeterData.exceptionForNewDate(end)) <= new Date(editMeterData.exceptionForNewDate(editMeterData.start_date)))
            {
                if(editMeterData.sortOrder == 'asc')
                {
                    index = -1;    
                }
                else
                {
                    index = editMeterData.meter_data.length - 1;          
                }
                editMeterData.start_date = start;
            }
            else
            {
                for(i = 0; i < editMeterData.meter_data.length - 1; i++)
                {
                    end_date = editMeterData.meter_data[i].end_date;
                    next_start_date = editMeterData.meter_data[i + 1].start_date;

                    if(editMeterData.sortOrder == 'asc')
                    {
                        if(new Date(editMeterData.exceptionForNewDate(start)) >= new Date(editMeterData.exceptionForNewDate(end_date)) && new Date(editMeterData.exceptionForNewDate(end)) <= new Date(editMeterData.exceptionForNewDate(next_start_date)))
                        {
                            index = i;
                        }    
                    }
                    else
                    {
                        if(new Date(editMeterData.exceptionForNewDate(start)) <= new Date(editMeterData.exceptionForNewDate(end_date)) && new Date(editMeterData.exceptionForNewDate(end)) >= new Date(editMeterData.exceptionForNewDate(next_start_date)))
                        {
                            index = i;
                        }    
                    }
                } 
                if(editMeterData.sortOrder == 'desc')
                {
                    index -= 1;    
                }
            }
            
            console.log(index);
            
            if(index == -2)
            {
                $('#add_data_modal').modal('hide');
                $('.overlapDates').modal('toggle');    
            }
            else if(index >= -1)
            {
                if(editMeterData.meter_type != 'waste')
                {
                    $('.single_row').each(function()
                    {
                        if($(this).attr('row-count') == index)
                        {
                            $('.single_row[row-count='+ index +']').after('<div class="single_row" row-count="'+(index + 1)+'"><div class="start_date dates reading_row"><input value="'+editMeterData.splitDate(start)+'"></div><div class="end_date dates reading_row"><input value="'+editMeterData.splitDate(end)+'"></div><div class="reading reading_row"><input value="'+reading+'"></div><div class="reading_row edit_button pointer">Edit</div><img src="/static/dashboard/img/ajax-loader.gif" class="mb5 meter_row_loader loader_gif_meter_row'+(index + 1)+'"></div>');    
                        }
                        else if($(this).attr('row-count') == (index + 1) && $(this).attr('row-count') == 0)
                        {
                            $('.single_row[row-count='+ (index + 1) +']').before('<div class="single_row" row-count="'+(index + 1)+'"><div class="start_date dates reading_row"><input value="'+editMeterData.splitDate(start)+'"></div><div class="end_date dates reading_row"><input value="'+editMeterData.splitDate(end)+'"></div><div class="reading reading_row"><input value="'+reading+'"></div><div class="reading_row edit_button pointer">Edit</div><img src="/static/dashboard/img/ajax-loader.gif" class="mb5 meter_row_loader loader_gif_meter_row'+(index + 1)+'"></div>');    
                        }
                        else if($(this).attr('row-count') > (index))
                        {
                            $(this).attr('row-count', parseInt($(this).attr('row-count')) + 1);    
                        }
                    }); 
                    
                    if( $('.single_row').length == 0)
                    {
                        $('.readings').html('<div class="single_row" row-count="0"><div class="start_date dates reading_row"><input value="'+editMeterData.splitDate(start)+'"></div><div class="end_date dates reading_row"><input value="'+editMeterData.splitDate(end)+'"></div><div class="reading reading_row"><input value="'+reading+'"></div><div class="reading_row edit_button pointer">Edit</div><img src="/static/dashboard/img/ajax-loader.gif" class="mb5 meter_row_loader loader_gif_meter_row0"></div>');            
                    }

                    reading = parseInt(reading);
                    
                    if(editMeterData.sortOrder == 'asc')
                    {
                        editMeterData.meter_data.splice(index + 1, 0, {'start_date':start, 'end_date': end, 'reading': reading});
                        editMeterData.dataProvider.splice(index + 1, 0, {'date':start, 'value': reading});    
                    }
                    else if(editMeterData.sortOrder == 'desc')
                    {
                        editMeterData.meter_data.splice(index + 1, 0, {'start_date':start, 'end_date': end, 'reading': reading});
                        
                        index = ($('.single_row').length - 2) - index;
                        
                        editMeterData.dataProvider.splice(index , 0, {'date':start, 'value': reading});    
                    }
                    
                    getMeterData.drawChart('meter_chart', editMeterData.dataProvider, editMeterData.color, 'smoothedLine', editMeterData.meter_unit);
                    
                    if(Modernizr.touch)
                        editMeterData.saveReadings(start.split('/').join('-'),end.split('/').join('-'),reading);  
                    else
                        editMeterData.saveReadings(start,end,reading);  
                        
                }
                else if(editMeterData.meter_type == 'waste')
                {
                    $('.single_row').each(function()
                    {
                        if($(this).attr('row-count') == index)
                        {
                            console.log("here1");
                        $('.single_row[row-count='+ index +']').after('<div class="single_row" row-count="'+(index + 1)+'"><div class="start_date dates waste_reading_row"><input value='+editMeterData.splitDate(start)+'></div><div class="end_date dates waste_reading_row"><input value='+editMeterData.splitDate(end)+'></div><div class="waste_generated waste_reading_row"><input value='+reading+'></div><div class="waste_diverted waste_reading_row"><input value='+reading1+'></div><div class="waste_reading_row edit_waste_button pointer">Edit</div><img src="/static/dashboard/img/ajax-loader.gif" class="mb5 meter_row_loader loader_gif_meter_row'+(index + 1)+'"><button id="waste_detail_latest" data-href="/waste-detail/" type="button" class="btn btn-default waste_detail_btn edit_waste_button display_none" data-toggle="modal" data-target="#wasteDetailModal" data-waste="" data-diverted="" style="margin-left: 40px;">Detail</button></div>');    
                        }
                        else if($(this).attr('row-count') == (index + 1) && $(this).attr('row-count') == 0)
                        {
                            console.log("here2");
                            $('.single_row[row-count='+ (index + 1) +']').before('<div class="single_row" row-count="'+(index + 1)+'"><div class="start_date dates waste_reading_row"><input value='+editMeterData.splitDate(start)+'></div><div class="end_date dates waste_reading_row"><input value='+editMeterData.splitDate(end)+'></div><div class="waste_generated waste_reading_row"><input value='+reading+'></div><div class="waste_diverted waste_reading_row"><input value='+reading1+'></div><div class="waste_reading_row edit_waste_button pointer">Edit</div><img src="/static/dashboard/img/ajax-loader.gif" class="mb5 meter_row_loader loader_gif_meter_row'+(index + 1)+'"><button id="waste_detail_edit" data-href="/waste-detail/" type="button" class="btn btn-default waste_detail_btn edit_waste_button" data-toggle="modal" data-target="#wasteDetailModal" data-waste="" data-diverted="" style="margin-left: 40px;">Detail</button></div>');    
                        }
                        else if($(this).attr('row-count') > (index))
                        {
                            console.log("inside the elsse man");
                            $(this).attr('row-count', parseInt($(this).attr('row-count')) + 1);    
                        }
                    }); 
                    
                    if( $('.single_row').length == 0)
                    {
                        console.log("here3");
                        $('.readings').html('<div class="single_row" row-count="0"><div class="start_date dates waste_reading_row"><input value='+editMeterData.splitDate(start)+'></div><div class="end_date dates waste_reading_row"><input value='+editMeterData.splitDate(end)+'></div><div class="waste_generated waste_reading_row"><input value='+reading+'></div><div class="waste_diverted waste_reading_row"><input value='+reading1+'></div><div class="waste_reading_row edit_waste_button pointer">Edit</div><img src="/static/dashboard/img/ajax-loader.gif" class="mb5 meter_row_loader loader_gif_meter_row0"><button id="waste_detail_nolength" data-href="/waste-detail/" type="button" class="btn btn-default waste_detail_btn edit_waste_button" data-toggle="modal" data-target="#wasteDetailModal" data-waste="" data-diverted="" style="margin-left: 40px;">Detail</button></div>');            
                    }

                    reading1 = parseInt(reading1);
                    
                    if(editMeterData.sortOrder == 'asc')
                    {
                        editMeterData.meter_data.splice(index + 1, 0, {'start_date':start, 'end_date': end, 'unit': editMeterData.meter_unit, 'waste_diverted': parseInt(reading1), 'waste_generated': parseInt(reading)});
                        getMeterData.waste = editMeterData.meter_data;
                        getMeterData.drawWasteChart('meter_chart', editMeterData.color1, editMeterData.color2, getMeterData.waste, editMeterData.meter_unit);
                    }
                    else
                    {
                        index += 1;
                        editMeterData.meter_data.splice(index, 0, {'start_date':start, 'end_date': end, 'unit': editMeterData.meter_unit, 'waste_diverted': parseInt(reading1), 'waste_generated': parseInt(reading)}); 
                        getMeterData.drawWasteChart('meter_chart', editMeterData.color1, editMeterData.color2, getMeterData.waste.reverse(), editMeterData.meter_unit);
                        getMeterData.waste.reverse();
                    }
                    
                    
                    if(Modernizr.touch)
                        editMeterData.saveWasteReadings(start.split('/').join('-'),end.split('/').join('-'),reading, reading1);
                    else
                        editMeterData.saveWasteReadings(start,end,reading, reading1);
                }
                
             }
            
            year = editMeterData.modifyDates(editMeterData.end_date, 'date', '+', '1').year;
            month = editMeterData.modifyDates(editMeterData.end_date, 'date', '+', '1').month;
            date = editMeterData.modifyDates(editMeterData.end_date, 'date', '+', '1').date;
            
            if(Modernizr.touch)
            {
                $('.start_date_manually').val(month + '/' + date + '/' + year);    
            }
            else
            {
                $('.start_date_manually').val(month + '-' + date + '-' + year);          
            }
            
            year = editMeterData.modifyDates($('.start_date_manually').val(), 'month', '+', '1').year;
            month = editMeterData.modifyDates($('.start_date_manually').val(), 'month', '+', '1').month;
            date = editMeterData.modifyDates($('.start_date_manually').val(), 'month', '+', '1').date;
            
            if(Modernizr.touch)
            {
                $('.end_date_manually').val(month + '/' + date + '/' + year);      
            }
            else
            {
                $('.end_date_manually').val(month + '-' + date + '-' + year);         
            }
            
            $('#add_data_modal').modal('hide');
            $('.usage_manually_modal').val('');
            $('.usage_manually').val('');
        },
        quantifyDates: function(date)
        {
            date = new Date(editMeterData.exceptionForNewDate(date));
            year = date.getFullYear();
            month = date.getMonth() + 1;
            date = date.getDate();
            
            if(month < 10)
                month = '0' + month;
            
            if(date < 10)
                date = '0' + date;
            
            return {"year": year, "month": month , "date": date};  
        },
        modifyDates: function(date, field, operation, value)
        {
            date = new Date(editMeterData.exceptionForNewDate(date));
            if(field == 'year')
            {
                temp = eval(date.getFullYear() + operation + value);
                date.setFullYear(temp);    
            }
            if(field == 'month')
            {
                temp = eval(date.getMonth() + operation + value);
                date.setMonth(temp);    
            }
            if(field == 'date')
            {
                temp = eval(date.getDate() + operation + value);
                date.setDate(temp);    
            }
            return editMeterData.quantifyDates(date);
        },
        addMeterReading: function(json)
        {
            $.ajax(
            {
                url: '/buildings/LEED:' + plaque.LEED + '/meters/ID:' + editMeterData.meter_id + '/data/?recompute_score=1',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(json)
            }).done(function(data) 
            {
            
            }).fail(function(data)
            {
            
            });
        },
        initAddManaullayDates: function()
        {
            compare_year = parseInt(editMeterData.quantifyDates(editMeterData.end_date).year);
            compare_month = parseInt(editMeterData.quantifyDates(editMeterData.end_date).month) - 1;
            compare_day = parseInt(editMeterData.quantifyDates(editMeterData.end_date).date);
            
            if(editMeterData.meter_data.length != 0)
			{
                start_temp = editMeterData.modifyDates(editMeterData.end_date, 'date', '+', '1');
				$('.start_date_manually').val(start_temp.month + '-' + start_temp.date + '-' + start_temp.year);
				end_temp = editMeterData.modifyDates($('.start_date_manually').val(), 'month', '+', '1');
				$('.end_date_manually').val(end_temp.month + '-' + end_temp.date + '-' + end_temp.year);
                
                if(Modernizr.touch)
                {
                    start_temp = editMeterData.modifyDates(editMeterData.end_date.split('-').join('/'), 'date', '+', '1');
                    $('.start_date_manually_modal').val(start_temp.month + '/' + start_temp.date + '/' + start_temp.year);
                    end_temp = editMeterData.modifyDates($('.start_date_manually_modal').val().split('-').join('/'), 'month', '+', '1');
                    $('.end_date_manually_modal').val(end_temp.month + '/' + end_temp.date + '/' + end_temp.year);    
                }
                
			}
			else
			{
				$('.start_date_manually').val(editMeterData.start_date);
				$('.end_date_manually').val(editMeterData.end_date);
                if(Modernizr.touch)
                {
                    $('.start_date_manually_modal').val(editMeterData.start_date.split('-').join('/')	);
                    $('.end_date_manually_modal').val(editMeterData.end_date.split('-').join('/')	);
                }
			}
            
            var start = $('.start_date_manually').fdatepicker(
            {
                format: 'mm-dd-yyyy',
//                onRender: function (date) 
//                {
//                    return date.valueOf() < now.valueOf() ? 'disabled' : '';
//                }
            }).on('changeDate', function (env)
            {
                year = editMeterData.modifyDates($('.start_date_manually').val(), 'month', '+', '1').year;
                month = editMeterData.modifyDates($('.start_date_manually').val(), 'month', '+', '1').month;
                date = editMeterData.modifyDates($('.start_date_manually').val(), 'month', '+', '1').date;
    
                $('.end_date_manually').val(month + '-' + date + '-' + year);  
            }).data('datepicker');
            
            $('.end_date_manually').fdatepicker(
            {
                format: 'mm-dd-yyyy'
            });
        },
		editMeter: function(meter, type, color)
		{
            $('#add_data_button').show();
            $('.normal_meter').show();
            console.log(window.ActivateGresbFlag);
            if (!window.ActivateGresbFlag) {
                $('.gresb-elem').hide();
            }
            $('.waste_meter').hide();
            $('.meterList').hide();	
			$('.editMeter').show();
			$('.data_input_tool_bar').html('Back to All Data');
            $('.data_input_tool_bar').addClass('back_to_all_img');
            $('.data_input_tool_bar').removeClass('input_nav_active');
            $('.survey_tool_bar').hide();
            $('.data_input_category_nav').hide();
			
//			$('.labels.gotham').css('marginRight', '27%');
			$("#area_type_energy_text:first-child").find('.area_type_txt').text($('#area_type').find('a[value='+meter.area_choice+']').text());
            $("#area_type_energy_text:first-child").find('.area_type_txt').attr('value', meter.area_choice);
            $("#responsibility_text:first-child").find('.responsibility_txt').text($('#responsibility').find('a[value='+meter.responsibility+']').text());
            $("#responsibility_text:first-child").find('.responsibility_txt').attr('value', meter.responsibility);
			$('#data_coverage_area').val(meter.data_coverage_area);
            $('#max_coverage_area').val(meter.max_coverage_area);
            $('#meterName').html(meter.name);
            $('.meter_name_edit').val($('#meterName').html());
            
//            if(Modernizr.touch)
//            {
//                $('.desktop_version').hide(); 
//                $('.touch_version').show();
//            }
//            else
//            {
//                $('.desktop_version').show();
//                $('.touch_version').hide();
//            }
            $('.desktop_version').show();
            $('.touch_version').hide();
			
			if(meter.updated_at != null)
			{
				$('#lastUpdated').html('Last Updated: ' + moment(meter.updated_at, "YYYY-MM-DD").format('ll'));
            }
			else
			{
				$('#lastUpdated').html('');
			}
			
			editMeterData.meter_id = meter.id;
            editMeterData.color = color;
            if(meter.type.kind == 'electricity' || meter.type.kind == 'fuel')
            {
                editMeterData.meter_type = 'Energy';
            }
            else
            {
                editMeterData.meter_type = meter.type.kind;        
            }
            editMeterData.meter_unit = meter.native_unit;
            
            $('#selectUnit').html(editMeterData.meter_unit + '<i class="fa fa-angle-down" style="float: right;margin-top: 3px;"></i>');
            
            html_menu = '';
            if(editMeterData.meter_type == 'Energy')
            {
                for(a in editMeterData.energy_units)
                {
                    html_menu += '<li><a>'+editMeterData.energy_units[a]+'</a></li>';        
                }
            }
            else if(editMeterData.meter_type == 'water')
            {
                for(a in editMeterData.water_units)
                {
                    html_menu += '<li><a>'+editMeterData.water_units[a]+'</a></li>';        
                }
            }
            $('.unit_menu').html(html_menu);
			
			$.ajax(
            {
                type: "GET",
                dataType: 'jsonp',
                url: "/buildings/LEED:" + plaque.LEED + "/meters/ID:" + meter.id + "/data/?start=2012-01-01&end=2020-01-01&limit=12&order=recent"
            }).done(function(data)
            {
                editMeterData.meter_data = data;
                if(data.length > 0)
                {
					
					if(Modernizr.touch)
					{
						editMeterData.start_date = editMeterData.splitDate(data[0].start_date.substring(0, 10).split('-').join('/'));
						editMeterData.end_date = editMeterData.splitDate(data[data.length - 1].end_date.substring(0, 10).split('-').join('/'));
					}
					else
					{	
						editMeterData.start_date = editMeterData.splitDate(data[0].start_date.substring(0, 10));
                    	editMeterData.end_date = editMeterData.splitDate(data[data.length - 1].end_date.substring(0, 10));
					}
						
                    editMeterData.max_reading = data[0].reading;
                    editMeterData.min_reading = data[0].reading;
                    var chart_id = 'meter_chart';
                    editMeterData.dataProvider = [];
                    for (x in data)
                    {
                        if(data[x].reading > editMeterData.max_reading)
                            editMeterData.max_reading = data[x].reading;
                        if(data[x].reading < editMeterData.min_reading)
                            editMeterData.min_reading = data[x].reading;

                        if(Modernizr.touch)
						{
							editMeterData.dataProvider.push({ 
								"date" : data[x].start_date.substring(0, 10).split('-').join('/'),
								"value" : data[x].reading,
							});	
						}
						else
						{
							editMeterData.dataProvider.push({ 
								"date" : data[x].start_date.substring(0, 10),
								"value" : data[x].reading,
							});
						}
                    }
                    getMeterData.drawChart(chart_id, editMeterData.dataProvider, color,  'smoothedLine', editMeterData.meter_unit);
					$('.date_start').val(editMeterData.start_date);
                    $('.date_end').val(editMeterData.end_date);
					$('.selected_meter_unit').html(editMeterData.meter_unit);
					
                }
                else
                {
					editMeterData.meter_unit = editMeterData[editMeterData.meter_type.toLowerCase()+'_units'][0]
					month = parseInt(editMeterData.quantifyDates(new Date()).month);
					year = editMeterData.quantifyDates(new Date()).year;
					date = editMeterData.quantifyDates(new Date()).date;

					if(Modernizr.touch)
					{
						startDate = month + '/' + date + '/' + year;	
					}
					else
					{
						startDate = month + '-' + date + '-' + year;	
					}
					
					$('.date_start').val(startDate);
					
					month = editMeterData.modifyDates(startDate, 'month', '+', '1').month;
					year = editMeterData.modifyDates(startDate, 'month', '+', '1').year;
					date = editMeterData.modifyDates(startDate, 'month', '+', '1').date;
					
					$('.date_end').val(month + '-' + date + '-' + year);
					
					editMeterData.start_date = "";
					editMeterData.end_date = "";
                    $('.selected_meter_unit').html(editMeterData.meter_unit);
					
					getMeterData.drawEmptyChart('meter_chart', color, editMeterData.meter_unit);
					
                }
				
				editMeterData.sortRows(editMeterData.sortOrder);
                
                editMeterData.initEditButton();
                
                editMeterData.initAddManaullayDates();
                
                for(a in getMeterData[editMeterData.meter_type.toLowerCase()])
                {
                    if(getMeterData[editMeterData.meter_type.toLowerCase()][a].id == editMeterData.meter_id)
                    {
                        editMeterData.meter_sub_type = getMeterData[editMeterData.meter_type.toLowerCase()][a].type.type; 
                        editMeterData.meter_sub_type_id = getMeterData[editMeterData.meter_type.toLowerCase()][a].type.id;
                        editMeterData.meter_backend_type = getMeterData[editMeterData.meter_type.toLowerCase()][a].type.kind;
                    }
                }
                
                if(editMeterData.meter_type == 'Energy' && editMeterData.meter_sub_type_id == 25)
                {
                    $('#selectCat').html('Purchased from grid<i class="fa fa-angle-down" style="float: right;margin-top: 3px;"></i>');
                    editMeterData.meter_sub_type = "Purchased from grid";
                }
                else
                {
                    $('#selectCat').html(editMeterData.meter_sub_type + '<i class="fa fa-angle-down" style="float: right;margin-top: 3px;"></i>');   
                }

            }); 
            
            $.ajax(
            {
                url: '/fuels/',
                type: 'GET',
                contentType: 'application/json'
            }).done(function(data)
            {
                html = '';
                for(i in data)
                {
                    if(editMeterData.meter_backend_type == data[i].kind && data[i].include_in_dropdown_list == true)
                    {
                        if(editMeterData.meter_backend_type == 'electricity')
                            html = '<li><a class="cat_item" value="25">Purchased from grid</a></li>';
                        html += '<li><a class="cat_item" value="'+data[i].id+'">'+data[i].type+'</a></li>';
                    }
                }
                $('.cat_menu').html(html); 
                
                if(editMeterData.meter_type == 'Energy' && editMeterData.meter_sub_type_id != 25)
                {
                    notFound = true;
                    $('.cat_item').each(function()
                    {
                        if(parseInt($(this).attr('value')) == editMeterData.meter_sub_type_id)
                        {
                            notFound = false;    
                        }
                    });   
                    if(notFound == true)
                    {
                        $('#selectCat').html('Purchased from grid<i class="fa fa-angle-down" style="float: right;margin-top: 3px;"></i>');
                        editMeterData.meter_sub_type = "Purchased from grid";    
                        editMeterData.meter_sub_type_id = 25;        
                    }
                }
            });
			
		},
        sortRows: function(sortOrder)
        {
            html = '';
            
            editMeterData.sortOrder = sortOrder;
            
            data = editMeterData.meter_data;
            
            data.sort(function(obj1, obj2) 
            {
                if(sortOrder == 'asc')
                {
                    return new Date(editMeterData.exceptionForNewDate(obj1.start_date)) - new Date(editMeterData.exceptionForNewDate(obj2.start_date));    
                }
                else
                {
                    return new Date(editMeterData.exceptionForNewDate(obj2.start_date)) - new Date(editMeterData.exceptionForNewDate(obj1.start_date));    
                }
            });
            
            if(editMeterData.meter_type != 'waste')
            {
                for (x in data)
                {

                    if(Modernizr.touch)
                    {
                        row_start_date = editMeterData.splitDate(data[x].start_date.substring(0, 10).split('-').join('/'));
                        row_end_date = editMeterData.splitDate(data[x].end_date.substring(0, 10).split('-').join('/'));
                        row_end_date = editMeterData.modifyDates(row_end_date, 'date', '-', '1');
                        row_end_date = row_end_date.month + '/' + row_end_date.date + '/' + row_end_date.year;
                    }
                    else
                    {
                        row_start_date = editMeterData.splitDate(data[x].start_date.substring(0, 10));
                        row_end_date = editMeterData.splitDate(data[x].end_date.substring(0, 10));
                        row_end_date = editMeterData.modifyDates(row_end_date, 'date', '-', '1');
                        row_end_date = row_end_date.month + '-' + row_end_date.date + '-' + row_end_date.year;
                    }

                    value = Math.round(parseFloat(data[x].reading) * 100) / 100;
                    html += '<div class="single_row" row-count="'+x+'"><div class="start_date dates reading_row"><input value='+row_start_date+'></div><div class="end_date dates reading_row"><input value='+row_end_date+'></div><div class="reading reading_row"><input value='+value+'></div><div class="reading_row edit_button pointer">Edit</div><img src="/static/dashboard/img/ajax-loader.gif" class="mb5 meter_row_loader loader_gif_meter_row'+x+'"></div>'        
                }

                $('.readings').html(html);
                $('.reading_row input').prop('readonly', true);
            }
            else
            {
                html = '';
                for (x in data)
                {
                    valueG = Math.round(parseFloat(data[x].waste_generated) * 100) / 100;
                    valueD = Math.round(parseFloat(data[x].waste_diverted) * 100) / 100;
                    generated = data[x].generated_id;
                    diverted = data[x].diverted_id;

                    if(Modernizr.touch)
                    {
                        row_start_date = editMeterData.splitDate(data[x].start_date.substring(0, 10).split('-').join('/'));
                        row_end_date = editMeterData.splitDate(data[x].end_date.substring(0, 10).split('-').join('/'));

                        row_end_date = editMeterData.modifyDates(row_end_date, 'date', '-', '1');
                        row_end_date = row_end_date.month + '/' + row_end_date.date + '/' + row_end_date.year;
                    }
                    else
                    {
                        row_start_date = editMeterData.splitDate(data[x].start_date.substring(0, 10));
                        row_end_date = editMeterData.splitDate(data[x].end_date.substring(0, 10));

                        row_end_date = editMeterData.modifyDates(row_end_date, 'date', '-', '1');
                        row_end_date = row_end_date.month + '-' + row_end_date.date + '-' + row_end_date.year;
                    }
                    console.log("here4");
                    console.log(generated);
                    console.log(diverted);
                    html += '<div class="single_row" row-count="'+x+'"><div class="start_date dates waste_reading_row"><input value='+row_start_date+'></div><div class="end_date dates waste_reading_row"><input value='+row_end_date+'></div><div class="waste_generated waste_reading_row"><input value='+valueG+'></div><div class="waste_diverted waste_reading_row"><input value='+valueD+'></div><div class="waste_reading_row edit_waste_button pointer">Edit</div><img src="/static/dashboard/img/ajax-loader.gif" class="mb5 meter_row_loader loader_gif_meter_row'+x+'"><button data-href="/waste-detail/?generated='+generated+'&diverted='+diverted+'" type="button" class="btn btn-default waste_detail_btn edit_waste_button display_none" data-toggle="modal" data-target="#wasteDetailModal" data-waste="" data-diverted="" style="margin-left: 40px;">Detail</button></div>'        
                }

                $('.readings').html(html);
                $('.waste_reading_row input').prop('readonly', true);    
            }
            
        },
        initEditButton: function()
        {
            $('.single_row').on('click', '.edit_button',function(e)
            {
                if($(this).html() == 'Edit')
                {
                    $(this).html('Save'); 
                    $(this).css('background-color', '#95BF58');
                    $(this).css('color', 'white');
                    $(this).siblings().addClass('edit');

                    $(this).siblings('.dates').children('input').fdatepicker(
                    {
                        format: 'mm-dd-yyyy'
                    });
                    $(this).siblings('.start_date').children('input').prop('readonly', false);
                    $(this).siblings('.end_date').children('input').prop('readonly', false);
                    $(this).siblings('.reading').children('input').prop('readonly', false);
                }
                else if($(this).html() == 'Save')
                {
                    reading = parseInt($(this).siblings('.reading').children('input').val());
                    start = $(this).siblings('.start_date').children('input').val();
                    end = $(this).siblings('.end_date').children('input').val();
                    row_count = $(this).parent().attr('row-count');
                    
                    if(Modernizr.touch)
                    {
                        start = start.split('-').join('/'); 
                        end = end.split('-').join('/'); 
                    }

                    if(parseInt(row_count) >= editMeterData.dataProvider.length)
                    {
                        editMeterData.dataProvider.push({ 
                            "date" : editMeterData.splitDateBack(start),
                            "value" : reading,
                        });    
                    }
                    else
                    {
                        editMeterData.dataProvider[row_count].value = reading;
                        editMeterData.dataProvider[row_count].date = editMeterData.splitDateBack(start);    
                    }

                    getMeterData.drawChart('meter_chart', editMeterData.dataProvider, editMeterData.color,  'smoothedLine', editMeterData.meter_unit);
                    editMeterData.saveReadings(editMeterData.splitDateBack(start).split('/').join('-'), editMeterData.splitDateBack(end).split('/').join('-'), reading,$(this).parent().attr('row-count')); 
                }
				e.stopPropagation();
            });   
        },
        initEditWasteReadings: function()
        {
            $('.single_row').on('click', '.edit_waste_button',function()
            {
                if($(this).html() == 'Edit')
                {
                    $(this).html('Save'); 
                    $(this).css('background-color', '#95BF58');
                    $(this).css('color', 'white');
                    $(this).siblings().addClass('edit');

                    $(this).siblings('.dates').children('input').fdatepicker(
                    {
                        format: 'mm-dd-yyyy'
                    });
                    
                    $(this).siblings('.start_date').children('input').prop('readonly', false);
                    $(this).siblings('.end_date').children('input').prop('readonly', false);
                    $(this).siblings('.waste_generated').children('input').prop('readonly', false);
                    $(this).siblings('.waste_diverted').children('input').prop('readonly', false);
                }
                else if($(this).html() == 'Save')
                {
                    if(Modernizr.touch)
                    {
                        start = editMeterData.splitDateBack($(this).siblings('.start_date').children('input').val().split('-').join('/'));
                        end = editMeterData.splitDateBack($(this).siblings('.end_date').children('input').val().split('-').join('/'));    
                    }
                    else
                    {
                        start = editMeterData.splitDateBack($(this).siblings('.start_date').children('input').val());
                        end = editMeterData.splitDateBack($(this).siblings('.end_date').children('input').val());        
                    }
                    row_count = $(this).parent().attr('row-count');
                    
                    waste_diverted = $(this).siblings('.waste_diverted').children('input').val();
                    waste_generated = $(this).siblings('.waste_generated').children('input').val();
                    getMeterData.waste[row_count].waste_diverted = waste_diverted; 
                    getMeterData.waste[row_count].waste_generated = waste_generated;
                    getMeterData.waste[row_count].date = start;
                    getMeterData.waste[row_count].end_date = end;

                    getMeterData.drawWasteChart('meter_chart', editMeterData.color1, editMeterData.color2, getMeterData.waste, editMeterData.meter_unit);
//                    editMeterData.saveReadings(start,end,reading); 
                    
                    editMeterData.saveWasteReadings(start.split('/').join('-'), end.split('/').join('-'), waste_generated, waste_diverted, $(this).parent().attr('row-count'));
                    
                }	
            });    
        },
        saveWasteReadings: function(start, end, waste_generated, waste_diverted, row_count)
        {
            end = editMeterData.modifyDates(end, 'date', '+', '1');
            end = end.year + '-' + end.month + '-' + end.date;
            
			editMeterData.lockWasteRow(row_count);
            $.ajax(
            {
                url: '/buildings/LEED:' + plaque.LEED + '/waste/generated/?start=' + start + '&end=' + end + '&recompute_score=1',
                type: 'DELETE',
                contentType: 'application/json'
            }).done(function(data) 
            {
                json = [{"reading":waste_generated,"start_date":start,"end_date":end, "unit": editMeterData.meter_unit}]
                $.ajax(
                {
                    url: '/buildings/LEED:' + plaque.LEED + '/waste/generated/?start=' + start + '&end=' + end + '&recompute_score=1',
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify(json)
                }).done(function(data){
                    $('#waste_detail_latest').attr('data-href', $('#waste_detail_latest').attr('data-href')+"?generated="+data[0].instance.id);
                    console.log("success of generated");
                    console.log(data);
                }).fail(function(data){});   
            }).fail(function(data){});
            
            $.ajax(
            {
                url: '/buildings/LEED:' + plaque.LEED + '/waste/diverted/?start=' + start + '&end=' + end + '&recompute_score=1',
                type: 'DELETE',
                contentType: 'application/json'
            }).done(function(data) 
            {
                json = [{"reading":waste_diverted,"start_date":start,"end_date":end, "unit": editMeterData.meter_unit}]
                $.ajax(
                {
                    url: '/buildings/LEED:' + plaque.LEED + '/waste/diverted/?start=' + start + '&end=' + end + '&recompute_score=1',
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify(json)
                }).done(function(data)
				{
                    $('#waste_detail_latest').attr('data-href', $('#waste_detail_latest').attr('data-href')+"&diverted="+data[0].instance.id);
                    console.log(data);
					
					editMeterData.unlockWasteRow(row_count);
					
				}).fail(function(data)
				{
					editMeterData.unlockWasteRow(row_count);
				});   
            }).fail(function(data){});
            if (window.ActivateGresbFlag) {
                $(".waste_detail_btn").removeClass('display_none');
            }
            $('.waste_detail_btn').on('click', function(){
                // $('body').css('overflow', 'hidden');
                $('#id_waste_detail_iframe').attr('src', $(this).attr('data-href'));
            });
        },
        saveReadings: function(start, end, reading, row_count)
        {
            end = editMeterData.modifyDates(end, 'date', '+', '1');
            end = end.year + '-' + end.month + '-' + end.date;
            
			editMeterData.lockRow(row_count);
            $.ajax(
            {
                url: '/buildings/LEED:' + plaque.LEED + '/meters/ID:' + editMeterData.meter_id + '/data/?start=' + start + '&end=' + end + '&recompute_score=1',
                type: 'DELETE',
                contentType: 'application/json'
            }).done(function(data) 
            {
                json = [{"reading":reading,"start_date":start,"end_date":end}]
                editMeterData.addMeterReading(json);    
				editMeterData.unlockRow(row_count);
            }).fail(function(data) 
            {
				editMeterData.unlockRow(row_count);
            });        
        },
		lockRow: function(row_count)
		{
			$('.loader_gif_meter_row'+row_count).show();
			$('.single_row[row-count='+row_count+']').children('.edit_button').html('Saving...'); 
		},
		unlockRow: function(row_count)
		{
			$('.loader_gif_meter_row'+row_count).hide();
			$('.single_row[row-count='+row_count+']').children('.edit_button').html('Edit'); 
			$('.single_row[row-count='+row_count+']').children('.edit_button').css('background-color', 'white');
			$('.single_row[row-count='+row_count+']').children('.edit_button').css('color', 'black');
			$('.single_row[row-count='+row_count+']').children('.edit_button').siblings().removeClass('edit');
			
			$('.single_row[row-count='+row_count+']').children('.start_date').children('input').prop('readonly', true);
			$('.single_row[row-count='+row_count+']').children('.end_date').children('input').prop('readonly', true);
			$('.single_row[row-count='+row_count+']').children('.reading').children('input').prop('readonly', true);
            
            $('.single_row[row-count='+row_count+']').children('.edit_button').siblings('.dates').children('input').fdatepicker("remove");
		},
		lockWasteRow: function(row_count)
		{
			$('.loader_gif_meter_row'+row_count).show();
			$('.single_row[row-count='+row_count+']').children('.edit_waste_button').html('Saving...'); 
		},
		unlockWasteRow: function(row_count)
		{
			$('.loader_gif_meter_row'+row_count).hide();
			$('.single_row[row-count='+row_count+']').children('.edit_waste_button').html('Edit'); 
			$('.single_row[row-count='+row_count+']').children('.edit_waste_button').css('background-color', 'white');
			$('.single_row[row-count='+row_count+']').children('.edit_waste_button').css('color', 'black');
			$('.single_row[row-count='+row_count+']').children('.edit_waste_button').siblings().removeClass('edit');
			$('.single_row[row-count='+row_count+']').children('.edit_waste_button').siblings('.dates').children('input').fdatepicker("destroy");
			
			$('.single_row[row-count='+row_count+']').children('.start_date').children('input').prop('readonly', false);
			$('.single_row[row-count='+row_count+']').children('.end_date').children('input').prop('readonly', false);
			$('.single_row[row-count='+row_count+']').children('.waste_generated').children('input').prop('readonly', false);
			$('.single_row[row-count='+row_count+']').children('.waste_diverted').children('input').prop('readonly', false);
		},
        editWasteMeter: function(type, color1, color2)
        {
            $('#add_data_button').show();
            
            $('.normal_meter').hide();
            $('.waste_meter').show();
            $('.meterList').hide();	
			$('.editMeter').show();
			$('.data_input_tool_bar').html('Back to All Data');
            $('.data_input_tool_bar').addClass('back_to_all_img');
            $('.data_input_tool_bar').removeClass('input_nav_active');
            $('.survey_tool_bar').hide();
            $('.data_input_category_nav').hide();
			if(Modernizr.touch)
            {
                $('.desktop_version').hide(); 
                $('.touch_version').show();
            }
            else
            {
                $('.desktop_version').show();
                $('.touch_version').hide();
            }
            
//			$('.labels.gotham').css('marginRight', '17%');
			
			$('#meterName').html('Waste Stream');
//			$('#lastUpdated').html('Last Updated: ' + meter.updated_at);
            editMeterData.meter_id = '';
            editMeterData.meter_type = type;
            
            if(getMeterData.waste[0] == undefined)
            {
                month = parseInt(editMeterData.quantifyDates(new Date()).month);
				year = editMeterData.quantifyDates(new Date()).year;
				date = editMeterData.quantifyDates(new Date()).date;

				startDate = month + '-' + date + '-' + year;
				
				$('.date_start').val(startDate);

				month = editMeterData.modifyDates(startDate, 'month', '+', '1').month;
				year = editMeterData.modifyDates(startDate, 'month', '+', '1').year;
				date = editMeterData.modifyDates(startDate, 'month', '+', '1').date;

				$('.date_end').val(month + '-' + date + '-' + year);
				editMeterData.start_date = "";
				editMeterData.end_date = "";
				editMeterData.meter_unit = 'lbs';
				
				getMeterData.drawEmptyWasteChart('meter_chart', color1, color2, unit)
				
            }
			else
			{
				editMeterData.meter_unit = getMeterData.waste[0].unit;
				editMeterData.start_date = editMeterData.splitDate(getMeterData.waste[0].start_date);
				editMeterData.end_date = editMeterData.splitDate(getMeterData.waste[getMeterData.waste.length - 1].end_date);
                
                if(Modernizr.touch)
                {
                    editMeterData.start_date = editMeterData.splitDate(getMeterData.waste[0].start_date.split('-').join('/'));
                    editMeterData.end_date = editMeterData.splitDate(getMeterData.waste[getMeterData.waste.length - 1].end_date.split('-').join('/'));
                }
                
				$('.date_start').val(editMeterData.start_date);
            	$('.date_end').val(editMeterData.end_date);
				getMeterData.drawWasteChart('meter_chart', color1, color2, getMeterData.waste, editMeterData.meter_unit);
			}
            
            editMeterData.color1 = color1;
            editMeterData.color2 = color2;
            editMeterData.meter_data = getMeterData.waste;
            
            $('#selectUnit').html(editMeterData.meter_unit + '<i class="fa fa-angle-down" style="float: right;margin-top: 3px;"></i>');
//            $('#selectCat').html(editMeterData.meter_sub_type + '<i class="fa fa-angle-down" style="float: right;margin-top: 3px;"></i>');
            $('.selected_meter_unit').html(editMeterData.meter_unit);
            
            html_menu = '';
            for(a in editMeterData.waste_units)
            {
                html_menu += '<li><a>'+editMeterData.waste_units[a]+'</a></li>';        
            }
            $('.unit_menu').html(html_menu);  
            
            editMeterData.sortRows(editMeterData.sortOrder);
            
            editMeterData.initEditWasteReadings();
            editMeterData.initAddManaullayDates();
            if (window.ActivateGresbFlag) {
                $(".waste_detail_btn").removeClass('display_none');
            }
            $('.waste_detail_btn').on('click', function(){
                // $('body').css('overflow', 'hidden');
                $('#id_waste_detail_iframe').attr('src', $(this).attr('data-href'));
            });
        },
        exceptionForNewDate: function(string)
        {
            var rt;
            if (typeof(string) == "string" && string.indexOf('-') > -1){
                rt =  string.replace(/-/g, "/");
                return rt;
            }
            else{
                return string;
            }
        }
    };
	
    $( document ).ready(function() 
    {
    	editMeterData.setup(); 
    });
        
}).call(this);