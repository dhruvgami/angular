(function() 
{
    window.performancePeriod = 
    {
        refreshRows: function()
        {
            $.ajax(
            {
                url: "/performancePeriod/LEED:" + plaque.LEED + '/',
                type: 'GET',
                contentType: 'application/json',
            }).done(function(data)
            {
                html = '';
                submitHtml = '';
                $('.performanceRows.dataRow').remove();
                for(row in data)
                {
                    id = data[row].id;
                    start_date = data[row].start_date;
                    end_date = data[row].end_date;
                    today = new Date();
                    
//                    score = plaqueNav.plaqueScore.scores.energy + plaqueNav.plaqueScore.scores.base + plaqueNav.plaqueScore.scores.human_experience + plaqueNav.plaqueScore.scores.transport + plaqueNav.plaqueScore.scores.waste + plaqueNav.plaqueScore.scores.water;
                    
                    if(new Date(start_date )<= today && new Date(end_date)>= today)
                    {
                        submitHtml = '<div class="performanceLabel submitReview">Submit</div>';    
                    }
                    else
                    {
                        submitHtml = '';   
                    }
                    
                    html += '<div class="performanceRows dataRow" row_id='+ id +'><div class="performanceLabel periodLabel">'+moment(start_date, editMeterData.dateFormatBackEnd).format(editMeterData.dateFormatFrontEnd) + ' - ' + moment(end_date, editMeterData.dateFormatBackEnd).format(editMeterData.dateFormatFrontEnd) +'</div><div class="performanceLabel statusLabel"></div><div class="performanceLabel levelLabel"><div class="periodScore"><div class="blackPlaqueLabel"></div><div class="plaqueLabel">Plaque</div></div></div>'+ submitHtml +'</div>'
                }
                $('.performanceRows').after(html);
            });
        },
        
        setup: function() 
        {
            performancePeriod.refreshRows();      
        }
    };
    
//    $( document ).ready(function() 
//    {
//        performancePeriod.setup();
//    });
    
}).call(this);