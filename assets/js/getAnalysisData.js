(function() 
{
    window.getAnalysisData = 
    {    
        performance_data         : {},
        energyAnalysis_data      : {},
        waterAnalysis_data       : {},
        wasteAnalysis_data       : {},
        transportAnalysis_data   : {},
        humanAnalysis_data       : {},
        use_date                 : [],
        use_date_chart           : [],
        last_12_month_score_flag : false,
        last_12_month_score      :[
                                    {'energy':0, 'water':0, 'waste':0, 'transport':0, 'human':0, 'base':0},
                                    {'energy':0, 'water':0, 'waste':0, 'transport':0, 'human':0, 'base':0},
                                    {'energy':0, 'water':0, 'waste':0, 'transport':0, 'human':0, 'base':0},
                                    {'energy':0, 'water':0, 'waste':0, 'transport':0, 'human':0, 'base':0},
                                    {'energy':0, 'water':0, 'waste':0, 'transport':0, 'human':0, 'base':0},
                                    {'energy':0, 'water':0, 'waste':0, 'transport':0, 'human':0, 'base':0},
                                    {'energy':0, 'water':0, 'waste':0, 'transport':0, 'human':0, 'base':0},
                                    {'energy':0, 'water':0, 'waste':0, 'transport':0, 'human':0, 'base':0},
                                    {'energy':0, 'water':0, 'waste':0, 'transport':0, 'human':0, 'base':0},
                                    {'energy':0, 'water':0, 'waste':0, 'transport':0, 'human':0, 'base':0},
                                    {'energy':0, 'water':0, 'waste':0, 'transport':0, 'human':0, 'base':0},
                                    {'energy':0, 'water':0, 'waste':0, 'transport':0, 'human':0, 'base':0}
                                ],

        energy: function(){
            $(".main_container .analysis_input").show(); // YA added for cert analysis.html
            $('.header_analysis_text').html('Energy Analysis');
            $('.month_data_above').attr('class', 'month_data_above');
            $('#month_of_other_data_tag').html('MONTHS OF TEMPERATURE DATA');
            $('.month_data_below').show();
            $('.month_data_below_voc').hide();
            $('.month_data_above').addClass('mt50');
            $('.analysis_label').addClass('leed-bg-energy');
            $('.reduce_by_section').addClass('energy-section-color');
            $('.reduce_by_section').html('energy');
            $('.analysis_performance_energy_template_img').attr('src', '/static/dashboard/img/icons/energy_gray.svg');
            $('.analysis_dynamic_section_value').attr('src', '/static/dashboard/img/icons/energy.svg');
            $('#analysisincrease_by_img').attr('src', '/static/dashboard/img/icons/energy_white.png');

            getAnalysisData.startLoader();
            $.ajax({
                url: '/buildings/LEED:' + plaque.LEED + '/energyinfo/',
                type: "GET",
                dataType: 'jsonp'
            }).done(function(data) {

                getAnalysisData.energyAnalysis_data = data;
                if (data){
                        getAnalysisData.initialize_slider("energy");
                }
                $('#analysis_slider_red_emission .ui-slider-handle').html("10%");
                $('#analysis_slider_inc_score .ui-slider-handle').html("+1");

                if (data) {
                        var mtco2_per_occupant = parseFloat(Number(data['Adjusted Emissions per Occupant'])).toFixed(6);
                        var mtco2_per_SF       = parseFloat(Number(data['Adjusted Emissions per SF'])).toFixed(6);
                        $('#mtco2e_occ').html(parseFloat(mtco2_per_occupant *365).toFixed(2));
                        $('#mtco2e_sq').html(parseFloat(mtco2_per_SF *365).toFixed(2));

                        if ( data['Adjusted Emissions per Occupant'] == undefined){
                                $('.mtco2e_occ_main').hide();
                                $('.mtco2e_sq_main').addClass('ml25p');
                        }

                        if ( data['Adjusted Emissions per SF'] == undefined) {
                                $('.mtco2e_sq_main').hide();
                                $('.mtco2e_occ_main').addClass('ml25p');
                        }

                        if ( data['Adjusted Emissions per Occupant'] == undefined && data['Adjusted Emissions per SF'] == undefined) {
                                $('#analysis_CC').hide();
                                $('.partition_line_analysis_CC').hide();
                        }
                }
                else{
                        $('#analysis_CC').hide();
                        $('.partition_line_analysis_CC').hide();
                }

                if (data){
                        if (data['Energy Score Uncertainty'] != undefined){
                                 if (data['Energy Score Uncertainty'] < 2){
                                        $('#analysis_confidence_value').html('HIGH');
                                        $('#analysis_confidence_value').css('color', '#95BF58');
                                        $('#analysis_confidence_signal').addClass('confidence-rating-high');
                                }
                                else if(data['Energy Score Uncertainty'] < 8){
                                        $('#analysis_confidence_value').html('MEDIUM');
                                        $('#analysis_confidence_value').css('color', '#FCD603' );
                                        $('#analysis_confidence_signal').addClass('confidence-rating-medium');
                                }
                                else {
                                        $('#analysis_confidence_value').html('LOW');
                                        $('#analysis_confidence_value').css('color', '#FF736D' );
                                        $('#analysis_confidence_signal').addClass('confidence-rating-low');
                                }
                        }
                        else{
                                $('#conf_level_container').hide();
                                $('#month_of_data_container').attr('class', 'col-md-9');
                        }
                }
                else{
                        $('#conf_level_container').hide();
                        $('#month_of_data_container').attr('class', 'col-md-9');
                }

                if (data){

                        $('.therm_meter_color').addClass('leed-bg-energy');
                        $('.therm_meter_temp_color').addClass('leed-bg-energy');

                        if (data['Months of Energy Data'] != undefined){
                                $('#analysis_month_data_value').html(data['Months of Energy Data']);
                                $('.therm_meter_color').show();
                                var data_perc = (parseInt($('#analysis_month_data_value').html())/12)*100;
                                $('.therm_meter_color').animate({ width: data_perc+'%' }, 2000);
                        }

                        if (data['Months of Temperature Data'] != undefined){
                                $('#analysis_month_temp_data_value').html(data['Months of Temperature Data']);
                                $('.therm_meter_temp_color').show();
                                var data_perc = (parseInt($('#analysis_month_temp_data_value').html())/12)*100;
                                $('.therm_meter_temp_color').animate({ width: data_perc+'%' }, 2000);
                        }
                }

                if (data){
                        if (data['Energy Plaque Score with 10% Lower Emissions'] != undefined){
                                $('#analysis_energy_score_dynamic').html(data['Energy Plaque Score with 10% Lower Emissions']);
                                var increased_by = parseInt(data['Energy Plaque Score with 10% Lower Emissions']) - parseInt(data['Energy Plaque Score']);
                                $('#analysis_score_increased_by').html(increased_by);
                        }
                        else{
                                $('#analysis_if_reduce').hide();
                        }

                        var new_val = 'Percent emissions reduction for a plaque score of ' + String(parseInt(data['Energy Plaque Score'])+1);
                        if (data[new_val] != undefined){
                                $('#analysis_reduce_emission_by_value').html(data[new_val]);
                        }
                        else{
                                $('#analysis_if_increase').hide();
                        }

                        if (data['Energy Plaque Score with 10% Lower Emissions'] == undefined  && data[new_val] == undefined) {
                                $('#analysis_tool').hide();
                                $('.partition_line_analysis_if').hide();
                        }
                }
                else{
                        $('#analysis_tool').hide();
                        $('.partition_line_analysis_if').hide();
                        $('#analysis_if_reduce').hide();
                        $('#analysis_if_increase').hide();
                }

                getAnalysisData.endLoader();

                if(getAnalysisData.last_12_month_score_flag){
                    getAnalysisData.analysis_last12Month_graph();
                }
            }).fail(function(data) {
                    getAnalysisData.endLoader();

                    if(getAnalysisData.last_12_month_score_flag){
                            getAnalysisData.analysis_last12Month_graph();
                    }
            });
            getAnalysisData.performancedata();
            $('#analysis_total_value').html(getAnalysisData.nullToZero(getAnalysisData.performance_data.scores.energy));
            $('#analysis_total_value_outof').html(getAnalysisData.performance_data.maxima.energy);

        },

        water: function(){
                $(".main_container .analysis_input").show(); // YA added for cert analysis.html

                $('.header_analysis_text').html('Water Analysis');
                $('.month_data_below').hide();
                $('.month_data_below_voc').hide();
                $('.month_data_above').attr('class', 'month_data_above');
                $('.month_data_above').addClass('mt65');
                $('#absolute_consumption_header').html("ABSOLUTE WATER CONSUMPTION");
                $('#absolute_consumption_occ').html("gal/occupant");
                $('#absolute_consumption_SF').html("gal/square foot");
                $('#month_of_data_tag').html('MONTHS OF WATER DATA');
                $('.analysis_label').addClass('leed-bg-water');
                $('#analysis_if_increase').hide();
                $('.reduce_by_section').addClass('water-section-color');
                $('.reduce_by_section').html('water');
                $('.analysis_performance_energy_template_img').attr('src', '/static/dashboard/img/icons/water_gray.svg');
                $('.analysis_dynamic_section_value').attr('src', '/static/dashboard/img/icons/water.svg');
                $('#analysisincrease_by_img').attr('src', '/static/dashboard/img/icons/water_white.png');                

                getAnalysisData.startLoader();
                $.ajax({
                        url: '/buildings/LEED:' + plaque.LEED + '/waterinfo/',
                        type: "GET",
                        dataType: 'jsonp'
                }).done(function(data) {

                        getAnalysisData.waterAnalysis_data = data;
                        if (data){
                                getAnalysisData.initialize_slider("water");
                        }
                        $('#analysis_slider_red_emission .ui-slider-handle').html("10%");

                        if (data) {
                                var mtco2_per_occupant = parseFloat(Number(data['Adjusted Gallons per Occupant'])).toFixed(6);
                                var mtco2_per_SF       = parseFloat(Number(data['Adjusted Gallons per SF'])).toFixed(6);
                                $('#mtco2e_occ').html(parseFloat(mtco2_per_occupant *365).toFixed(2));
                                $('#mtco2e_sq').html(parseFloat(mtco2_per_SF *365).toFixed(2));

                                if (data['Adjusted Gallons per Occupant'] == undefined ){
                                        $('.mtco2e_occ_main').hide();
                                        $('.mtco2e_sq_main').addClass('ml25p');
                                }

                                if ( data['Adjusted Gallons per SF'] == undefined) {
                                        $('.mtco2e_sq_main').hide();
                                        $('.mtco2e_occ_main').addClass('ml25p');
                                }

                                if ( data['Adjusted Gallons per Occupant'] == undefined && data['Adjusted Gallons per SF'] == undefined) {
                                        $('#analysis_CC').hide();
                                        $('.partition_line_analysis_CC').hide();
                                }
                        }
                        else{
                                $('#analysis_CC').hide();
                                $('.partition_line_analysis_CC').hide();
                        }

                        if (data){
                                if (data['Water Score Uncertainty'] != undefined){
                                         if (data['Water Score Uncertainty'] < 2){
                                                $('#analysis_confidence_value').html('HIGH');
                                                $('#analysis_confidence_value').css('color', '#95BF58');
                                                $('#analysis_confidence_signal').addClass('confidence-rating-high');
                                        }
                                        else if(data['Water Score Uncertainty'] < 8){
                                                $('#analysis_confidence_value').html('MEDIUM');
                                                $('#analysis_confidence_value').css('color', '#FCD603' );
                                                $('#analysis_confidence_signal').addClass('confidence-rating-medium');
                                        }
                                        else {
                                                $('#analysis_confidence_value').html('LOW');
                                                $('#analysis_confidence_value').css('color', '#FF736D' );
                                                $('#analysis_confidence_signal').addClass('confidence-rating-low');
                                        }
                                }
                                else{
                                        $('#conf_level_container').hide();
                                        $('#month_of_data_container').attr('class', 'col-md-9');
                                }
                        }
                        else{
                                $('#conf_level_container').hide();
                                $('#month_of_data_container').attr('class', 'col-md-9');
                        }

                        if (data){
                                $('.therm_meter_color').addClass('leed-bg-water');
                                if (data['Months of Water Data'] != undefined){
                                        $('#analysis_month_data_value').html(data['Months of Water Data']);
                                        $('.therm_meter_color').show();
                                        var data_perc = (parseInt($('#analysis_month_data_value').html())/12)*100;
                                        $('.therm_meter_color').animate({ width: data_perc+'%' }, 2000);
                                }
                        }

                        if (data){
                                if (data['Water Plaque Score with 10% Lower Emissions'] != undefined){
                                        $('#analysis_energy_score_dynamic').html(data['Water Plaque Score with 10% Lower Emissions']);
                                        var increased_by = parseInt(data['Water Plaque Score with 10% Lower Emissions']) - parseInt(data['Water Plaque Score']);
                                        $('#analysis_score_increased_by').html(increased_by);
                                }
                                else{
                                        $('#analysis_tool').hide();
                                        $('.partition_line_analysis_if').hide();
                                        $('#analysis_if_reduce').hide();
                                }
                        }
                        else{
                                $('#analysis_tool').hide();
                                $('.partition_line_analysis_if').hide();
                                $('#analysis_if_reduce').hide();
                        }

                        getAnalysisData.endLoader();

                        if(getAnalysisData.last_12_month_score_flag){
                                getAnalysisData.analysis_last12Month_graph();
                        }
                }).fail(function(data) {
                        getAnalysisData.endLoader();

                        if(getAnalysisData.last_12_month_score_flag){
                                getAnalysisData.analysis_last12Month_graph();
                        }
                });
                getAnalysisData.performancedata();
                $('#analysis_total_value').html(getAnalysisData.nullToZero(getAnalysisData.performance_data.scores.water));
                $('#analysis_total_value_outof').html(getAnalysisData.performance_data.maxima.water);

        },
        waste: function(){
                $(".main_container .analysis_input").show(); // YA added for cert analysis.html
                $('.header_analysis_text').html('Waste Analysis');
                $('.month_data_below').hide();
                $('.month_data_below_voc').hide();
                $('.month_data_above').attr('class', 'month_data_above');
                $('.month_data_above').addClass('mt65');
                $('#absolute_consumption_header').html("GENERATED & UNDIVERTED WASTE");
                $('#mtco2e_sq_icon').attr('src', '/static/dashboard/img/human-grey.svg');
                $('#mtco2e_sq_icon').removeClass('w10').addClass('w18');
                $('#absolute_consumption_occ').html("lbs/occupant");
                $('#absolute_consumption_SF').html("lbs/occupant");
                $('#month_of_data_tag').html('MONTHS OF WASTE DATA');
                $('.analysis_label').addClass('leed-bg-waste');
                $('#analysis_if_increase').hide();
                $('.reduce_by_section').addClass('waste-section-color');
                $('.reduce_by_section').html('waste');
                $('.analysis_performance_energy_template_img').attr('src', '/static/dashboard/img/icons/waste_gray.svg');
                $('.analysis_performance_energy_template_img').css('width', '25px');
                $('.analysis_dynamic_section_value').attr('src', '/static/dashboard/img/icons/waste.svg');
                $('#analysisincrease_by_img').attr('src', '/static/dashboard/img/icons/waste_white.png');                

                var resample_url = getAnalysisData.getResamplingUrl();
                var waste_last_month_data = 0;
                $.ajax({
                        url: '/buildings/LEED:' + plaque.LEED + '/waste/generated' + resample_url,
                        type: "GET",
                        dataType: 'jsonp'
                }).done(function(data) {
                        for (var i = 0; i < data.length; i++) {
                                if (!isNaN(data[i].reading)){
                                        waste_last_month_data+=1;
                                }
                        };
                });

                getAnalysisData.startLoader();
                $.ajax({
                        url: '/buildings/LEED:' + plaque.LEED + '/wasteinfo/',
                        type: "GET",
                        dataType: 'jsonp'
                }).done(function(data) {

                        getAnalysisData.wasteAnalysis_data = data;
                        if (data){
                                getAnalysisData.initialize_slider("waste");
                        }
                        $('#analysis_slider_red_emission .ui-slider-handle').html("10%");

                        if (data) {
                                var mtco2_per_occupant = parseFloat(Number(data['Generated Waste (lbs per occupant per day)'])).toFixed(6);
                                var mtco2_per_SF       = parseFloat(Number(data['Undiverted Waste (lbs per occupant per day)'])).toFixed(6);
                                $('#mtco2e_occ').html(parseFloat(mtco2_per_occupant *365).toFixed(2));
                                $('#mtco2e_sq').html(parseFloat(mtco2_per_SF *365).toFixed(2));

                                if (data['Generated Waste (lbs per occupant per day)'] == undefined ){
                                        $('.mtco2e_occ_main').hide();
                                        $('.mtco2e_sq_main').addClass('ml25p');
                                }

                                if ( data['Undiverted Waste (lbs per occupant per day)'] == undefined) {
                                        $('.mtco2e_sq_main').hide();
                                        $('.mtco2e_occ_main').addClass('ml25p');
                                }

                                if ( data['Generated Waste (lbs per occupant per day)'] == undefined && data['Undiverted Waste (lbs per occupant per day)'] == undefined) {
                                        $('#analysis_CC').hide();
                                        $('.partition_line_analysis_CC').hide();
                                }
                        }
                        else{
                                $('#analysis_CC').hide();
                                $('.partition_line_analysis_CC').hide();
                        }

                        if (data){
                                if (data['Waste Score Uncertainty'] != undefined){
                                         if (data['Waste Score Uncertainty'] < 2){
                                                $('#analysis_confidence_value').html('HIGH');
                                                $('#analysis_confidence_value').css('color', '#95BF58');
                                                $('#analysis_confidence_signal').addClass('confidence-rating-high');
                                        }
                                        else if(data['Waste Score Uncertainty'] < 8){
                                                $('#analysis_confidence_value').html('MEDIUM');
                                                $('#analysis_confidence_value').css('color', '#FCD603' );
                                                $('#analysis_confidence_signal').addClass('confidence-rating-medium');
                                        }
                                        else {
                                                $('#analysis_confidence_value').html('LOW');
                                                $('#analysis_confidence_value').css('color', '#FF736D' );
                                                $('#analysis_confidence_signal').addClass('confidence-rating-low');
                                        }
                                }
                                else{
                                        $('#conf_level_container').hide();
                                        $('#month_of_data_container').attr('class', 'col-md-9');
                                }
                        }
                        else{
                                $('#conf_level_container').hide();
                                $('#month_of_data_container').attr('class', 'col-md-9');
                        }

                        if (waste_last_month_data){
                                $('.therm_meter_color').addClass('leed-bg-waste');
                                        $('#analysis_month_data_value').html(waste_last_month_data);
                                        $('.therm_meter_color').show();
                                        var data_perc = (parseInt(waste_last_month_data)/12)*100;
                                        $('.therm_meter_color').animate({ width: data_perc+'%' }, 2000);
                        }

                        if (data){
                                if (data['Water Plaque Score with 10% Lower Emissions'] != undefined){
                                        $('#analysis_energy_score_dynamic').html(data['Water Plaque Score with 10% Lower Emissions']);
                                        var increased_by = parseInt(data['Water Plaque Score with 10% Lower Emissions']) - parseInt(data['Water Plaque Score']);
                                        $('#analysis_score_increased_by').html(increased_by);
                                }
                                else{
                                        $('#analysis_tool').hide();
                                        $('.partition_line_analysis_if').hide();
                                        $('#analysis_if_reduce').hide();
                                }
                        }
                        else{
                                $('#analysis_tool').hide();
                                $('.partition_line_analysis_if').hide();
                                $('#analysis_if_reduce').hide();
                        }

                        getAnalysisData.endLoader();

                        if(getAnalysisData.last_12_month_score_flag){
                                getAnalysisData.analysis_last12Month_graph();
                        }
                }).fail(function(data) {
                        getAnalysisData.endLoader();

                        if(getAnalysisData.last_12_month_score_flag){
                                getAnalysisData.analysis_last12Month_graph();
                        }
                });
                getAnalysisData.performancedata();
                $('#analysis_total_value').html(getAnalysisData.nullToZero(getAnalysisData.performance_data.scores.waste));
                $('#analysis_total_value_outof').html(getAnalysisData.performance_data.maxima.waste);
        },
        transportation: function(){
                $(".main_container .analysis_input").show(); // YA added for cert analysis.html
                $('.header_analysis_text').html('Transit Analysis');

                var percent_responded = 0;
                var total_occupants = plaque.buildingData.occupancy
                $.ajax({
                        type: "GET",
                        dataType: 'jsonp',
                        url: "/buildings/LEED:" + plaque.LEED + "/survey/transit/summary/"
                }).done(function(transit_data) {
                        var transport_respondents = transit_data.responses;
                        percent_responded = parseFloat((transport_respondents / total_occupants)*100).toFixed(2);
                        if (percent_responded > 100){
                                percent_responded = 100;
                        }
                });
                $('.month_data_below').hide();
                $('.month_data_below_voc').hide();
                $('.month_data_above').attr('class', 'month_data_above');
                $('.month_data_above').addClass('mt65');
                $('#month_of_data_tag').html('% OF PEOPLE RESPONDED');
                $('.analysis_label').addClass('leed-bg-transport');
                $('.reduce_by_section').addClass('transport-section-color');
                $('.reduce_by_section').html('transportation');
                $('#reduce_by_container').addClass('w145');
                $('.analysis_performance_energy_template_img').attr('src', '/static/dashboard/img/icons/transport_gray.svg');
                $('.analysis_performance_energy_template_img').css('width', '25px');
                $('.analysis_dynamic_section_value').attr('src', '/static/dashboard/img/icons/transport.svg');
                $('#analysisincrease_by_img').attr('src', '/static/dashboard/img/icons/transport_white.png');
                $('#analysis_CC').hide();
                $('.partition_line_analysis_CC').hide();
                $('.analysis_total_score_container').css('color', '#4F4A5A');

                getAnalysisData.startLoader();
                $.ajax({
                        url: '/buildings/LEED:' + plaque.LEED + '/transitinfo/',
                        type: "GET",
                        dataType: 'jsonp'
                }).done(function(data) {

                        getAnalysisData.transportAnalysis_data = data;
                        if (data){
                                getAnalysisData.initialize_slider("transport");
                        }
                        $('#analysis_slider_red_emission .ui-slider-handle').html("10%");
                        $('#analysis_slider_inc_score .ui-slider-handle').html("+1");

                        if (data){
                                if (data['Transportation Score Uncertainty'] != undefined){
                                         if (data['Transportation Score Uncertainty'] < 2){
                                                $('#analysis_confidence_value').html('HIGH');
                                                $('#analysis_confidence_value').css('color', '#95BF58');
                                                $('#analysis_confidence_signal').addClass('confidence-rating-high');
                                        }
                                        else if(data['Transportation Score Uncertainty'] < 8){
                                                $('#analysis_confidence_value').html('MEDIUM');
                                                $('#analysis_confidence_value').css('color', '#FCD603' );
                                                $('#analysis_confidence_signal').addClass('confidence-rating-medium');
                                        }
                                        else {
                                                $('#analysis_confidence_value').html('LOW');
                                                $('#analysis_confidence_value').css('color', '#FF736D' );
                                                $('#analysis_confidence_signal').addClass('confidence-rating-low');
                                        }
                                }
                                else{
                                        $('#conf_level_container').hide();
                                        $('#month_of_data_container').attr('class', 'col-md-9');
                                }
                        }
                        else{
                                $('#conf_level_container').hide();
                                $('#month_of_data_container').attr('class', 'col-md-9');
                        }

                        if (data){

                                $('.therm_meter_color').addClass('leed-bg-transport');
                                $('#analysis_month_data_value').html(percent_responded);
                                $('.therm_meter_color').show();
                                $('.therm_meter_color').animate({ width: percent_responded+'%' }, 2000);
                        }

                        if (data){
                                if (data['Transportation Plaque Score with 10% Lower Emissions'] != undefined){
                                        $('#analysis_energy_score_dynamic').html(data['Transportation Plaque Score with 10% Lower Emissions']);
                                        var increased_by = parseInt(data['Transportation Plaque Score with 10% Lower Emissions']) - parseInt(data['Transportation Plaque Score']);
                                        $('#analysis_score_increased_by').html(increased_by);
                                }
                                else{
                                        $('#analysis_if_reduce').hide();
                                }

                                var new_val = 'Percent emissions reduction for a plaque score of ' + String(parseInt(data['Transportation Plaque Score'])+1);
                                if (data[new_val] != undefined){
                                        $('#analysis_reduce_emission_by_value').html(data[new_val]);
                                }
                                else{
                                        $('#analysis_if_increase').hide();
                                }

                                if (data['Transportation Plaque Score with 10% Lower Emissions'] == undefined  && data[new_val] == undefined) {
                                        $('#analysis_tool').hide();
                                        $('.partition_line_analysis_if').hide();
                                }
                        }
                        else{
                                $('#analysis_tool').hide();
                                $('.partition_line_analysis_if').hide();
                                $('#analysis_if_reduce').hide();
                                $('#analysis_if_increase').hide();
                        }

                        getAnalysisData.endLoader();

                        if(getAnalysisData.last_12_month_score_flag){
                                getAnalysisData.analysis_last12Month_graph();
                        }
                }).fail(function(data) {
                        getAnalysisData.endLoader();

                        if(getAnalysisData.last_12_month_score_flag){
                                getAnalysisData.analysis_last12Month_graph();
                        }
                });
                getAnalysisData.performancedata();
                $('#analysis_total_value').html(getAnalysisData.nullToZero(getAnalysisData.performance_data.scores.transport));
                $('#analysis_total_value_outof').html(getAnalysisData.performance_data.maxima.transport);
        },
        humanexperience: function(){
                $(".main_container .analysis_input").show(); // YA added for cert analysis.html
                $('.header_analysis_text').html('Environment Analysis');
                $('.analysis_label ').css('height', '200px');
                $('.month_data_below').show();
                $('.month_of_data').css('height', '200px');
                $('.analysis_confidence_level').css('height', '200px');
                $('.analysis_performance_energy_template_img').css('margin-top', '44px'); 
                $('.analysis_performance_energy_template_img').css('width', '15px');
                $('.month_data_below_voc').show();
                $('.month_data_above').attr('class', 'month_data_above');
                $('.month_data_above').addClass('mt20');
               
                var percent_responded = 0;

                var total_occupants = plaque.buildingData.occupancy
                $.ajax({
                        type: "GET",
                        dataType: 'jsonp',
                        url: "/buildings/LEED:" + plaque.LEED + "/survey/environment/summary/"
                }).done(function(env_data) {
                        var transport_respondents = env_data.responses;
                        percent_responded = parseFloat((transport_respondents / total_occupants)*100).toFixed(2);
                        if (percent_responded > 100){
                                percent_responded = 100;
                        }
                });

                $('#month_of_data_tag').html('% OF PEOPLE RESPONDED');
                $('#month_of_other_data_tag').html('MONTHS OF CO2 DATA');
                $('.analysis_label').addClass('leed-bg-human');
                $('.reduce_by_section').addClass('human-section-color');
                $('.reduce_by_section').html('human');
                $('#reduce_by_container').addClass('w145');
                $('.analysis_performance_energy_template_img').attr('src', '/static/dashboard/img/icons/human_gray.svg');
                $('.analysis_dynamic_section_value').attr('src', '/static/dashboard/img/icons/human.svg');
                $('#analysisincrease_by_img').attr('src', '/static/dashboard/img/icons/human_white.png');
                $('#analysis_CC').hide();
                $('.partition_line_analysis_CC').hide();                

                var resample_url = getAnalysisData.getResamplingUrl();
                var co2_last_month_data = 0;
                var voc_last_month_data = 0;
                $.ajax({
                        url: '/buildings/LEED:' + plaque.LEED + '/co2' + resample_url,
                        type: "GET",
                        dataType: 'jsonp'
                }).done(function(data) {
                        for (var i = 0; i < data.length; i++) {
                                if (!isNaN(data[i].reading)){
                                        co2_last_month_data+=1;
                                }
                        };
                });
                $.ajax({
                        url: '/buildings/LEED:' + plaque.LEED + '/voc' + resample_url,
                        type: "GET",
                        dataType: 'jsonp'
                }).done(function(data) {
                        for (var i = 0; i < data.length; i++) {
                                if (!isNaN(data[i].reading)){
                                        voc_last_month_data+=1;
                                }
                        };
                });


                getAnalysisData.startLoader();
                $.ajax({
                        url: '/buildings/LEED:' + plaque.LEED + '/environmentinfo/',
                        type: "GET",
                        dataType: 'jsonp'
                }).done(function(data) {

                        getAnalysisData.humanAnalysis_data = data;
                        if (data){
                                getAnalysisData.initialize_slider("human");
                        }
                        $('#analysis_slider_red_emission .ui-slider-handle').html("10%");
                        $('#analysis_slider_inc_score .ui-slider-handle').html("+1");

                        if (data){
                                if (data['Human Experience Score Uncertainty'] != undefined){
                                         if (data['Human ExperienceHuman Experience Score Uncertainty'] < 2){
                                                $('#analysis_confidence_value').html('HIGH');
                                                $('#analysis_confidence_value').css('color', '#95BF58');
                                                $('#analysis_confidence_signal').addClass('confidence-rating-high');
                                        }
                                        else if(data['Human Experience Score Uncertainty'] < 8){
                                                $('#analysis_confidence_value').html('MEDIUM');
                                                $('#analysis_confidence_value').css('color', '#FCD603' );
                                                $('#analysis_confidence_signal').addClass('confidence-rating-medium');
                                        }
                                        else {
                                                $('#analysis_confidence_value').html('LOW');
                                                $('#analysis_confidence_value').css('color', '#FF736D' );
                                                $('#analysis_confidence_signal').addClass('confidence-rating-low');
                                        }
                                }
                                else{
                                        $('#conf_level_container').hide();
                                        $('#month_of_data_container').attr('class', 'col-md-9');
                                }
                        }
                        else{
                                $('#conf_level_container').hide();
                                $('#month_of_data_container').attr('class', 'col-md-9');
                        }

                        if (data){

                                $('.therm_meter_color').addClass('leed-bg-human');
                                $('.therm_meter_temp_color').addClass('leed-bg-human');
                                $('.therm_meter_temp_color_voc').addClass('leed-bg-human');

                                $('#analysis_month_data_value').html(percent_responded);
                                $('.therm_meter_color').show();
                                $('.therm_meter_color').animate({ width: percent_responded+'%' }, 2000);

                                // $('#analysis_month_temp_data_value').html(percent_responded);
                                // $('.therm_meter_temp_color').show();
                                // $('.therm_meter_temp_color').animate({ width: percent_responded+'%' }, 2000);

                                // $('#analysis_month_voc_data_value').html(percent_responded);
                                // $('.therm_meter_temp_color').show();
                                // $('.therm_meter_temp_color').animate({ width: percent_responded+'%' }, 2000);
                        }

                        if (co2_last_month_data){
                                $('#analysis_month_temp_data_value').html(co2_last_month_data);
                                $('.therm_meter_temp_color').show();
                                var data_perc = (parseInt(co2_last_month_data)/12)*100;
                                $('.therm_meter_temp_color').animate({ width: data_perc+'%' }, 2000);
                        }

                        if (voc_last_month_data){
                                $('#analysis_month_voc_data_value').html(voc_last_month_data);
                                $('.therm_meter_temp_color_voc').show();
                                var data_perc = (parseInt(voc_last_month_data)/12)*100;
                                $('.therm_meter_temp_color_voc').animate({ width: data_perc+'%' }, 2000);
                        }

                        if (data){
                                if (data['Human Experience Plaque Score with 10% Lower Emissions'] != undefined){
                                        $('#analysis_energy_score_dynamic').html(data['Human Experience Plaque Score with 10% Lower Emissions']);
                                        var increased_by = parseInt(data['Human Experience Plaque Score with 10% Lower Emissions']) - parseInt(data['Human Experience Plaque Score']);
                                        $('#analysis_score_increased_by').html(increased_by);
                                }
                                else{
                                        $('#analysis_if_reduce').hide();
                                }

                                var new_val = 'Percent emissions reduction for a plaque score of ' + String(parseInt(data['Human Experience Plaque Score'])+1);
                                if (data[new_val] != undefined){
                                        $('#analysis_reduce_emission_by_value').html(data[new_val]);
                                }
                                else{
                                        $('#analysis_if_increase').hide();
                                }

                                if (data['Human Experience Plaque Score with 10% Lower Emissions'] == undefined  && data[new_val] == undefined) {
                                        $('#analysis_tool').hide();
                                        $('.partition_line_analysis_if').hide();
                                }
                        }
                        else{
                                $('#analysis_tool').hide();
                                $('.partition_line_analysis_if').hide();
                                $('#analysis_if_reduce').hide();
                                $('#analysis_if_increase').hide();
                        }

                        getAnalysisData.endLoader();

                        if(getAnalysisData.last_12_month_score_flag){
                                getAnalysisData.analysis_last12Month_graph();
                        }
                }).fail(function(data) {
                        getAnalysisData.endLoader();

                        if(getAnalysisData.last_12_month_score_flag){
                                getAnalysisData.analysis_last12Month_graph();
                        }
                });
                getAnalysisData.performancedata();
                $('#analysis_total_value').html(getAnalysisData.nullToZero(getAnalysisData.performance_data.scores.human_experience));
                $('#analysis_total_value_outof').html(getAnalysisData.performance_data.maxima.human_experience);
        },
        nullToZero: function(val){
                if (val == null) {
                        return 0;
                }
                else {
                        return val;
                }
        },
        getLastTwelveMonthScore: function() {

          var current_date = new Date();
          var current_month = current_date.getMonth() + 1;
          var current_year = current_date.getFullYear();
          var use_month = current_month;
          var use_year = current_year;

          getAnalysisData.use_date = [];
          getAnalysisData.use_date_chart = [];

          for (var i = 0; i < 12; i++) {
            if (use_month < 10){
                getAnalysisData.use_date.push(use_year + '-0' + use_month + '-' + '01');
                getAnalysisData.use_date_chart.push(use_year + '-0' + use_month + '-' + '01');
            }
            else{
                getAnalysisData.use_date.push(use_year + '-' + use_month + '-' + '01');
                getAnalysisData.use_date_chart.push(use_year + '-' + use_month + '-' + '01');
            }
            if (use_month-1 == 0){
              use_month = 12;
              use_year = current_year-1;
            }
            else{
              use_month = use_month-1;
            }
          }

          if (current_month < 10){
                getAnalysisData.use_date_chart[0] = current_year + '-0' + current_month + '-' + current_date.getDate()
          }
          else{
              getAnalysisData.use_date_chart[0] = current_year + '-' + current_month + '-' + current_date.getDate()
          }

          
          
          $.when($.ajax({ type: "GET",
            url: '/buildings/LEED:' + plaque.LEED + '/performance/?at=' + getAnalysisData.use_date[0] + '&within=1'}),
            $.ajax({ type: "GET",
            url: '/buildings/LEED:' + plaque.LEED + '/performance/?at=' + getAnalysisData.use_date[1] + '&within=1'}),
            $.ajax({ type: "GET",
            url: '/buildings/LEED:' + plaque.LEED + '/performance/?at=' + getAnalysisData.use_date[2] + '&within=1'}),
            $.ajax({ type: "GET",
            url: '/buildings/LEED:' + plaque.LEED + '/performance/?at=' + getAnalysisData.use_date[3] + '&within=1'}),
            $.ajax({ type: "GET",
            url: '/buildings/LEED:' + plaque.LEED + '/performance/?at=' + getAnalysisData.use_date[4] + '&within=1'}),
            $.ajax({ type: "GET",
            url: '/buildings/LEED:' + plaque.LEED + '/performance/?at=' + getAnalysisData.use_date[5] + '&within=1'}),
            $.ajax({ type: "GET",
            url: '/buildings/LEED:' + plaque.LEED + '/performance/?at=' + getAnalysisData.use_date[6] + '&within=1'}),
            $.ajax({ type: "GET",
            url: '/buildings/LEED:' + plaque.LEED + '/performance/?at=' + getAnalysisData.use_date[7] + '&within=1'}),
            $.ajax({ type: "GET",
            url: '/buildings/LEED:' + plaque.LEED + '/performance/?at=' + getAnalysisData.use_date[8] + '&within=1'}),
            $.ajax({ type: "GET",
            url: '/buildings/LEED:' + plaque.LEED + '/performance/?at=' + getAnalysisData.use_date[9] + '&within=1'}),
            $.ajax({ type: "GET",
            url: '/buildings/LEED:' + plaque.LEED + '/performance/?at=' + getAnalysisData.use_date[10] + '&within=1'}))
            .done(function(data_1, data_2, data_3, data_4, data_5, data_6, data_7, data_8, data_9, data_10, data_11) {

              getAnalysisData.last_12_month_score[1].energy = data_1[0].scores.energy;
              getAnalysisData.last_12_month_score[1].water = data_1[0].scores.water;
              getAnalysisData.last_12_month_score[1].waste = data_1[0].scores.waste;
              getAnalysisData.last_12_month_score[1].transport = data_1[0].scores.transport;
              getAnalysisData.last_12_month_score[1].human_experience = data_1[0].scores.human_experience;
              getAnalysisData.last_12_month_score[1].base = data_1[0].scores.base;

              getAnalysisData.last_12_month_score[2].energy = data_2[0].scores.energy;
              getAnalysisData.last_12_month_score[2].water = data_2[0].scores.water;
              getAnalysisData.last_12_month_score[2].waste = data_2[0].scores.waste;
              getAnalysisData.last_12_month_score[2].transport = data_2[0].scores.transport;
              getAnalysisData.last_12_month_score[2].human_experience = data_2[0].scores.human_experience;
              getAnalysisData.last_12_month_score[2].base = data_2[0].scores.base;

              getAnalysisData.last_12_month_score[3].energy = data_3[0].scores.energy;
              getAnalysisData.last_12_month_score[3].water = data_3[0].scores.water;
              getAnalysisData.last_12_month_score[3].waste = data_3[0].scores.waste;
              getAnalysisData.last_12_month_score[3].transport = data_3[0].scores.transport;
              getAnalysisData.last_12_month_score[3].human_experience = data_3[0].scores.human_experience;
              getAnalysisData.last_12_month_score[3].base = data_3[0].scores.base;

              getAnalysisData.last_12_month_score[4].energy = data_4[0].scores.energy;
              getAnalysisData.last_12_month_score[4].water = data_4[0].scores.water;
              getAnalysisData.last_12_month_score[4].waste = data_4[0].scores.waste;
              getAnalysisData.last_12_month_score[4].transport = data_4[0].scores.transport;
              getAnalysisData.last_12_month_score[4].human_experience = data_4[0].scores.human_experience;
              getAnalysisData.last_12_month_score[4].base = data_4[0].scores.base;

              getAnalysisData.last_12_month_score[5].energy = data_5[0].scores.energy;
              getAnalysisData.last_12_month_score[5].water = data_5[0].scores.water;
              getAnalysisData.last_12_month_score[5].waste = data_5[0].scores.waste;
              getAnalysisData.last_12_month_score[5].transport = data_5[0].scores.transport;
              getAnalysisData.last_12_month_score[5].human_experience = data_5[0].scores.human_experience;
              getAnalysisData.last_12_month_score[5].base = data_5[0].scores.base;

              getAnalysisData.last_12_month_score[6].energy = data_6[0].scores.energy;
              getAnalysisData.last_12_month_score[6].water = data_6[0].scores.water;
              getAnalysisData.last_12_month_score[6].waste = data_6[0].scores.waste;
              getAnalysisData.last_12_month_score[6].transport = data_6[0].scores.transport;
              getAnalysisData.last_12_month_score[6].human_experience = data_6[0].scores.human_experience;
              getAnalysisData.last_12_month_score[6].base = data_6[0].scores.base;

              getAnalysisData.last_12_month_score[7].energy = data_7[0].scores.energy;
              getAnalysisData.last_12_month_score[7].water = data_7[0].scores.water;
              getAnalysisData.last_12_month_score[7].waste = data_7[0].scores.waste;
              getAnalysisData.last_12_month_score[7].transport = data_7[0].scores.transport;
              getAnalysisData.last_12_month_score[7].human_experience = data_7[0].scores.human_experience;
              getAnalysisData.last_12_month_score[7].base = data_7[0].scores.base;

              getAnalysisData.last_12_month_score[8].energy = data_8[0].scores.energy;
              getAnalysisData.last_12_month_score[8].water = data_8[0].scores.water;
              getAnalysisData.last_12_month_score[8].waste = data_8[0].scores.waste;
              getAnalysisData.last_12_month_score[8].transport = data_8[0].scores.transport;
              getAnalysisData.last_12_month_score[8].human_experience = data_8[0].scores.human_experience;
              getAnalysisData.last_12_month_score[8].base = data_8[0].scores.base;

              getAnalysisData.last_12_month_score[9].energy = data_9[0].scores.energy;
              getAnalysisData.last_12_month_score[9].water = data_9[0].scores.water;
              getAnalysisData.last_12_month_score[9].waste = data_9[0].scores.waste;
              getAnalysisData.last_12_month_score[9].transport = data_9[0].scores.transport;
              getAnalysisData.last_12_month_score[9].human_experience = data_9[0].scores.human_experience;
              getAnalysisData.last_12_month_score[9].base = data_9[0].scores.base;

              getAnalysisData.last_12_month_score[10].energy = data_10[0].scores.energy;
              getAnalysisData.last_12_month_score[10].water = data_10[0].scores.water;
              getAnalysisData.last_12_month_score[10].waste = data_10[0].scores.waste;
              getAnalysisData.last_12_month_score[10].transport = data_10[0].scores.transport;
              getAnalysisData.last_12_month_score[10].human_experience = data_10[0].scores.human_experience;
              getAnalysisData.last_12_month_score[10].base = data_10[0].scores.base;

              getAnalysisData.last_12_month_score[11].energy = data_11[0].scores.energy;
              getAnalysisData.last_12_month_score[11].water = data_11[0].scores.water;
              getAnalysisData.last_12_month_score[11].waste = data_11[0].scores.waste;
              getAnalysisData.last_12_month_score[11].transport = data_11[0].scores.transport;
              getAnalysisData.last_12_month_score[11].human_experience = data_11[0].scores.human_experience;
              getAnalysisData.last_12_month_score[11].base = data_11[0].scores.base;

              // getAnalysisData.analysis_last12Month_graph();
              getAnalysisData.last_12_month_score_flag = true;
            });
        },
        analysis_last12Month_graph: function() {

            var section_color = ""
            var chartData     = [];
            var new_data      = [];

            for (var x in plaque.assosiatedCategories)
            {
                if(plaque.assosiatedCategories[x].category == plaqueNav.getParameterByName('section'))
                {
                    section_color = plaque.assosiatedCategories[x].color
                }           
            }  

            if (plaqueNav.getParameterByName('section') == 'energy'){
                    new_data.push(getAnalysisData.last_12_month_score[11].energy,
                                            getAnalysisData.last_12_month_score[10].energy,
                                            getAnalysisData.last_12_month_score[9].energy,
                                            getAnalysisData.last_12_month_score[8].energy,
                                            getAnalysisData.last_12_month_score[7].energy,
                                            getAnalysisData.last_12_month_score[6].energy,
                                            getAnalysisData.last_12_month_score[5].energy,
                                            getAnalysisData.last_12_month_score[4].energy,
                                            getAnalysisData.last_12_month_score[3].energy,
                                            getAnalysisData.last_12_month_score[2].energy,
                                            getAnalysisData.last_12_month_score[1].energy,
                                            getAnalysisData.last_12_month_score[0].energy
                                            );
            }
            else if(plaqueNav.getParameterByName('section') == 'water'){
                    new_data.push(getAnalysisData.last_12_month_score[11].water,
                                                                    getAnalysisData.last_12_month_score[10].water,
                                                                    getAnalysisData.last_12_month_score[9].water,
                                                                    getAnalysisData.last_12_month_score[8].water,
                                                                    getAnalysisData.last_12_month_score[7].water,
                                                                    getAnalysisData.last_12_month_score[6].water,
                                                                    getAnalysisData.last_12_month_score[5].water,
                                                                    getAnalysisData.last_12_month_score[4].water,
                                                                    getAnalysisData.last_12_month_score[3].water,
                                                                    getAnalysisData.last_12_month_score[2].water,
                                                                    getAnalysisData.last_12_month_score[1].water,
                                                                    getAnalysisData.last_12_month_score[0].water
                                                                    );
            }
            else if(plaqueNav.getParameterByName('section') == 'waste'){
                    new_data.push(getAnalysisData.last_12_month_score[11].waste,
                                                                    getAnalysisData.last_12_month_score[10].waste,
                                                                    getAnalysisData.last_12_month_score[9].waste,
                                                                    getAnalysisData.last_12_month_score[8].waste,
                                                                    getAnalysisData.last_12_month_score[7].waste,
                                                                    getAnalysisData.last_12_month_score[6].waste,
                                                                    getAnalysisData.last_12_month_score[5].waste,
                                                                    getAnalysisData.last_12_month_score[4].waste,
                                                                    getAnalysisData.last_12_month_score[3].waste,
                                                                    getAnalysisData.last_12_month_score[2].waste,
                                                                    getAnalysisData.last_12_month_score[1].waste,
                                                                    getAnalysisData.last_12_month_score[0].waste
                                                                    );
            }
            else if(plaqueNav.getParameterByName('section') == 'transportation'){
                    new_data.push(getAnalysisData.last_12_month_score[11].transport,
                                                                    getAnalysisData.last_12_month_score[10].transport,
                                                                    getAnalysisData.last_12_month_score[9].transport,
                                                                    getAnalysisData.last_12_month_score[8].transport,
                                                                    getAnalysisData.last_12_month_score[7].transport,
                                                                    getAnalysisData.last_12_month_score[6].transport,
                                                                    getAnalysisData.last_12_month_score[5].transport,
                                                                    getAnalysisData.last_12_month_score[4].transport,
                                                                    getAnalysisData.last_12_month_score[3].transport,
                                                                    getAnalysisData.last_12_month_score[2].transport,
                                                                    getAnalysisData.last_12_month_score[1].transport,
                                                                    getAnalysisData.last_12_month_score[0].transport
                                                                    );
            }
            else if(plaqueNav.getParameterByName('section') == 'human'){
                    new_data.push(getAnalysisData.last_12_month_score[11].human_experience,
                                                                    getAnalysisData.last_12_month_score[10].human_experience,
                                                                    getAnalysisData.last_12_month_score[9].human_experience,
                                                                    getAnalysisData.last_12_month_score[8].human_experience,
                                                                    getAnalysisData.last_12_month_score[7].human_experience,
                                                                    getAnalysisData.last_12_month_score[6].human_experience,
                                                                    getAnalysisData.last_12_month_score[5].human_experience,
                                                                    getAnalysisData.last_12_month_score[4].human_experience,
                                                                    getAnalysisData.last_12_month_score[3].human_experience,
                                                                    getAnalysisData.last_12_month_score[2].human_experience,
                                                                    getAnalysisData.last_12_month_score[1].human_experience,
                                                                    getAnalysisData.last_12_month_score[0].human_experience
                                                                    );
            }

            for (var i = 0; i <=11; i++) {
                chartData.push({
                    date: getAnalysisData.use_date_chart[11-i],
                    value: getAnalysisData.nullToZero(new_data[i])
                });
            }
            

            var chart = AmCharts.makeChart("last_12_month_data", {
                                        "type": "serial",
                                        "theme": "light",
                                        "marginRight": 40,
                                        "marginLeft": 40,
                                        "autoMarginOffset": 20,
                                        "dataDateFormat": "YYYY-MM-DD",
                                        "valueAxes": [{
                                            "id": "v1",
                                            "axisAlpha": 0,
                                            "position": "left",
                                            "ignoreAxisWidth":true
                                        }],
                                        "balloon": {
                                            "borderThickness": 1,
                                            "shadowAlpha": 0
                                        },
                                        "graphs": [{
                                            "id": "g1",
                                            "balloon":{
                                              "drop":true,
                                              "adjustBorderColor":false,
                                              "color":"#ffffff"
                                            },
                                            "bullet": "round",
                                            "bulletBorderAlpha": 1,
                                            "bulletColor": section_color,
                                            "bulletSize": 5,
                                            "lineColor": section_color,
                                            "hideBulletsCount": 50,
                                            "lineThickness": 2,
                                            "useLineColorForBulletBorder": true,
                                            "valueField": "value",
                                            "balloonText": "[[category]]<br>Score: <b>[[value]]</b>"
                                        }],
                                        "categoryField": "date",
                                        "categoryAxis": {
                                            "parseDates": true,
                                            "dashLength": 1,
                                            "minorGridEnabled": true,
                                            "dateFormats":[{period:'fff',format:'JJ:NN:SS'},
                                                          {period:'ss',format:'JJ:NN:SS'},
                                                          {period:'mm',format:'JJ:NN'},
                                                          {period:'hh',format:'JJ:NN'},
                                                          {period:'DD',format:'MMM'},
                                                          {period:'WW',format:'MMM'},
                                                          {period:'MM',format:'MMM'},
                                                          {period:'YYYY',format:'YYYY'}]
                                        },
                                        "dataProvider": chartData
                                    });
        },
        initialize_slider: function(section) {
              $( "#analysis_slider_red_emission" ).slider({
                min: 0,
                max: 4,
                value: 1,
                step: 1,
                slide: function( event, ui ) {

                  if(ui.value < 1 || ui.value > 3){
                    return false;
                  }

                  if(ui.value == 1){
                    if (section == "energy"){
                      $('#analysis_energy_score_dynamic').html(getAnalysisData.energyAnalysis_data['Energy Plaque Score with 10% Lower Emissions']);
                      var increased_by = parseInt(getAnalysisData.energyAnalysis_data['Energy Plaque Score with 10% Lower Emissions']) - parseInt(getAnalysisData.energyAnalysis_data['Energy Plaque Score']);
                    }
                    else if(section == "water") {
                      $('#analysis_energy_score_dynamic').html(getAnalysisData.waterAnalysis_data['Water Plaque Score with 10% Lower Emissions']);
                      var increased_by = parseInt(getAnalysisData.waterAnalysis_data['Water Plaque Score with 10% Lower Emissions']) - parseInt(getAnalysisData.waterAnalysis_data['Water Plaque Score']);
                    }
                    else if(section == "waste") {
                      $('#analysis_energy_score_dynamic').html(getAnalysisData.wasteAnalysis_data['Waste Plaque Score with 10% Lower Emissions']);
                      var increased_by = parseInt(getAnalysisData.wasteAnalysis_data['Waste Plaque Score with 10% Lower Emissions']) - parseInt(getAnalysisData.wasteAnalysis_data['Waste Plaque Score']);
                    }
                    else if(section == "transport") {
                      $('#analysis_energy_score_dynamic').html(getAnalysisData.transportAnalysis_data['Transportation Plaque Score with 10% Lower Emissions']);
                      var increased_by = parseInt(getAnalysisData.transportAnalysis_data['Transportation Plaque Score with 10% Lower Emissions']) - parseInt(getAnalysisData.transportAnalysis_data['Transportation Plaque Score']);
                    }
                    else if(section == "human") {
                      $('#analysis_energy_score_dynamic').html(getAnalysisData.humanAnalysis_data['Human Experience Plaque Score with 10% Lower Emissions']);
                      var increased_by = parseInt(getAnalysisData.humanAnalysis_data['Human Experience Plaque Score with 10% Lower Emissions']) - parseInt(getAnalysisData.humanAnalysis_data['Human Experience Plaque Score']);
                    }
                    var imageUrl = '/static/dashboard/img/icons/cloud-slider-white.png';
                    $('#analysis_slider_red_emission .ui-slider-handle').css('background', 'url(' + imageUrl + ') no-repeat');
                    $('#analysis_slider_red_emission .ui-slider-handle').css('opacity', '1');
                    $('#analysis_slider_red_emission .ui-slider-handle').html("10%");
                    $('#analysis_score_increased_by').html(increased_by);
                  }
                  else if (ui.value == 2){
                    if (section == "energy"){
                      $('#analysis_energy_score_dynamic').html(getAnalysisData.energyAnalysis_data['Energy Plaque Score with 20% Lower Emissions']);
                      var increased_by = parseInt(getAnalysisData.energyAnalysis_data['Energy Plaque Score with 20% Lower Emissions']) - parseInt(getAnalysisData.energyAnalysis_data['Energy Plaque Score']);
                    }
                    else if(section == "water") {
                      $('#analysis_energy_score_dynamic').html(getAnalysisData.waterAnalysis_data['Water Plaque Score with 20% Lower Emissions']);
                      var increased_by = parseInt(getAnalysisData.waterAnalysis_data['Water Plaque Score with 20% Lower Emissions']) - parseInt(getAnalysisData.waterAnalysis_data['Water Plaque Score']);
                    }
                    else if(section == "waste") {
                      $('#analysis_energy_score_dynamic').html(getAnalysisData.wasteAnalysis_data['Waste Plaque Score with 20% Lower Emissions']);
                      var increased_by = parseInt(getAnalysisData.wasteAnalysis_data['Waste Plaque Score with 20% Lower Emissions']) - parseInt(getAnalysisData.wasteAnalysis_data['Waste Plaque Score']);
                    }
                    else if(section == "transport") {
                      $('#analysis_energy_score_dynamic').html(getAnalysisData.transportAnalysis_data['Transportation Plaque Score with 20% Lower Emissions']);
                      var increased_by = parseInt(getAnalysisData.transportAnalysis_data['Transportation Plaque Score with 20% Lower Emissions']) - parseInt(getAnalysisData.transportAnalysis_data['Transportation Plaque Score']);
                    }
                    else if(section == "human") {
                      $('#analysis_energy_score_dynamic').html(getAnalysisData.humanAnalysis_data['Human Experience Plaque Score with 20% Lower Emissions']);
                      var increased_by = parseInt(getAnalysisData.humanAnalysis_data['Human Experience Plaque Score with 20% Lower Emissions']) - parseInt(getAnalysisData.humanAnalysis_data['Human Experience Plaque Score']);
                    }
                    var imageUrl = '/static/dashboard/img/icons/cloud-slider-white.png';
                    $('#analysis_slider_red_emission .ui-slider-handle').css('background', 'url(' + imageUrl + ') no-repeat');
                    $('#analysis_slider_red_emission .ui-slider-handle').css('opacity', '0.7');
                    $('#analysis_slider_red_emission .ui-slider-handle').html("20%");
                    $('#analysis_score_increased_by').html(increased_by);
                  }
                  else if (ui.value == 3){
                    if (section == "energy"){
                      $('#analysis_energy_score_dynamic').html(getAnalysisData.energyAnalysis_data['Energy Plaque Score with 50% Lower Emissions']);
                      var increased_by = parseInt(getAnalysisData.energyAnalysis_data['Energy Plaque Score with 50% Lower Emissions']) - parseInt(getAnalysisData.energyAnalysis_data['Energy Plaque Score']);
                    }
                    else if(section == "water") {
                      $('#analysis_energy_score_dynamic').html(getAnalysisData.waterAnalysis_data['Water Plaque Score with 50% Lower Emissions']);
                      var increased_by = parseInt(getAnalysisData.waterAnalysis_data['Water Plaque Score with 50% Lower Emissions']) - parseInt(getAnalysisData.waterAnalysis_data['Water Plaque Score']);
                    }
                    else if(section == "waste") {
                      $('#analysis_energy_score_dynamic').html(getAnalysisData.wasteAnalysis_data['Waste Plaque Score with 50% Lower Emissions']);
                      var increased_by = parseInt(getAnalysisData.wasteAnalysis_data['Waste Plaque Score with 50% Lower Emissions']) - parseInt(getAnalysisData.wasteAnalysis_data['Waste Plaque Score']);
                    }
                    else if(section == "transport") {
                      $('#analysis_energy_score_dynamic').html(getAnalysisData.transportAnalysis_data['Transportation Plaque Score with 50% Lower Emissions']);
                      var increased_by = parseInt(getAnalysisData.transportAnalysis_data['Transportation Plaque Score with 50% Lower Emissions']) - parseInt(getAnalysisData.transportAnalysis_data['Transportation Plaque Score']);
                    }
                    else if(section == "human") {
                      $('#analysis_energy_score_dynamic').html(getAnalysisData.humanAnalysis_data['Human Experience Plaque Score with 50% Lower Emissions']);
                      var increased_by = parseInt(getAnalysisData.humanAnalysis_data['Human Experience Plaque Score with 50% Lower Emissions']) - parseInt(getAnalysisData.humanAnalysis_data['Human Experience Plaque Score']);
                    }
                    var imageUrl = '/static/dashboard/img/icons/cloud-slider-transparent.png';
                    $('#analysis_slider_red_emission .ui-slider-handle').css('background', 'url(' + imageUrl + ') no-repeat');
                    $('#analysis_slider_red_emission .ui-slider-handle').css('opacity', '1');
                    $('#analysis_slider_red_emission .ui-slider-handle').html("50%");
                    $('#analysis_score_increased_by').html(increased_by);
                  }
                }});

              if (section == "energy" || section == "transport"){
                var numOfTrue = 0;

                if (section == "energy"){
                  for(var i=1;i<100;i++){
                    if(getAnalysisData.energyAnalysis_data['Percent emissions reduction for a plaque score of ' + String(parseInt(getAnalysisData.energyAnalysis_data['Energy Plaque Score'])+i)]) {
                      numOfTrue++;
                    }
                    else{
                      break;
                    }
                  }
                }
                else if(section == "transport"){
                  for(var i=1;i<100;i++){
                    if(getAnalysisData.transportAnalysis_data['Percent emissions reduction for a plaque score of ' + String(parseInt(getAnalysisData.transportAnalysis_data['Transportation Plaque Score'])+i)]) {
                      numOfTrue++;
                    }
                    else{
                      break;
                    }
                  }
                }

                $( "#analysis_slider_inc_score" ).slider({
                  min: 0,
                  max: numOfTrue+1,
                  value: 1,
                  step: 1,
                  slide: function( event, ui ) {
                    if(ui.value < 1 || ui.value > numOfTrue){
                      return false;
                    }

                    for (var i = 1; i <= numOfTrue; i++) {
                      if(ui.value == i){
                        $('#analysis_slider_inc_score .ui-slider-handle').html("+" + i);
                        if (section == "energy"){
                          var new_val = 'Percent emissions reduction for a plaque score of ' + String(parseInt(getAnalysisData.energyAnalysis_data['Energy Plaque Score'])+i);
                          $('#analysis_reduce_emission_by_value').html(getAnalysisData.energyAnalysis_data[new_val]);
                        }
                        else if(section == "transport"){
                          var new_val = 'Percent emissions reduction for a plaque score of ' + String(parseInt(getAnalysisData.transportAnalysis_data['Transportation Plaque Score'])+i);
                          $('#analysis_reduce_emission_by_value').html(getAnalysisData.transportAnalysis_data[new_val]);
                        }
                      }
                    };
                }});
              }
            },
            getResamplingUrl: function() {
              var check_date = Date.today().add(-360).days();
              var url = "/?resample=";
              var counter_resample = 0;
              while(check_date <= Date.today()){

                var current_mnth = String(parseInt(check_date.getMonth())+1);
                if (current_mnth.length == 1){
                  current_mnth = '0' + current_mnth;
                }
                if (counter_resample == 0){
                  url += check_date.getFullYear() + "-" + current_mnth + "-" + check_date.getDate() + "/P30D";
                }
                else{
                  url += "," + check_date.getFullYear() + "-" + current_mnth + "-" + check_date.getDate() + "/P30D"
                }
                counter_resample+=1;
                check_date = check_date.add(+30).days();
              }
              return url;
            },
            performancedata: function(){
                if (getAnalysisData.performance_data.scores == undefined){
                    $.ajax({
                        url: '/buildings/LEED:' + plaque.LEED + '/performance/',
                        type: "GET",
                        dataType: 'jsonp',
                        async: false,
                      }).done(function(data_0) {
                          getAnalysisData.last_12_month_score[0].energy = data_0.scores.energy;
                          getAnalysisData.last_12_month_score[0].water = data_0.scores.water;
                          getAnalysisData.last_12_month_score[0].waste = data_0.scores.waste;
                          getAnalysisData.last_12_month_score[0].transport = data_0.scores.transport;
                          getAnalysisData.last_12_month_score[0].human_experience = data_0.scores.human_experience;
                          getAnalysisData.last_12_month_score[0].base = data_0.scores.base;
                        getAnalysisData.performance_data = data_0
                        if (getAnalysisData.performance_data.maxima==undefined){
                            $.ajax({
                              type: "GET",
                              url: "/weights/",
                              async: false,
                              success: function (data_maxima) {
                                getAnalysisData.performance_data.maxima = data_maxima
                              }
                            });
                        }
                    });  
                } 
            },

            startLoader: function(){
//                NProgress.configure({ ease: 'ease', speed: 500,
//                                      showSpinner: false });
//                $.blockUI({ message: null, overlayCSS: { 
//                        backgroundColor: '#fff',
//                        opacity: 0.4
//                    } });
//                NProgress.start();
//                NProgress.set(0.4);
                plaqueNav.showStrategiesLoadingMessage('Analyzing your data...');
            },

            endLoader: function(){
//                NProgress.done();
//                $.unblockUI();
                plaqueNav.removeStrategiesLoadingMessage();
//				  $('.data_input_stratergy_nav').css('left', $('#data_analysis_content').offset().left);
//                  $('.header_analysis_input').css('left', $('#data_analysis_content').offset().left);
            },

            touchDevice: function() {
              if (Modernizr.touchEvents || Modernizr.touch){
                return true;
              }
              else{
                return false;
              }
            }
    };                        
}).call(this);