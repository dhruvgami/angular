var create = 0;
var xhr2;
$( document ).ready(function() {

	$.ajax({
		url: 'assets/json/functionalityflags.json',
		type: 'GET',
		contentType: 'application/json',
	}).done(function(data)
	{
		if (data.ACTIVATE_GBIG_SEARCH){
			$("#the-basics").show();
			$(".header-center").css('bottom', "40%");
		}
		else{
			$("#the-basics").hide();
			$(".header-center").css('bottom', "0px");
		}
	});


	$("#modal_trigger").leanModal({top : 200, overlay : 0.6, closeButton: ".modal_close" });
	$("#modal_trigger_trial").leanModal({top : 200, overlay : 0.6, closeButton: ".modal_close" });

	// $("#modal_trigger, #modal_trigger_trial").click(function(){
 //      $("#login_iFrame").attr('src','//plaque.dev.leedon.io/auth/login/');
 //      var login_iframe = $("#login_iFrame");
	// });
		
	$("#responsive-container").fitVids();

	if ( Modernizr.touch || (!Modernizr.video) ){
		$('video').remove();
		$('#plaque_img').css('display','block');
	}
	if (document.URL.indexOf("page=showLogin")!=-1){
		$('#modal_trigger').trigger('click');
	}

	$('#id_building').on('keyup', function(event)
	{
		if(event.keyCode == 13)
		{
			$("#building_search").click();
		}
		if (xhr2 != undefined)
			xhr2.abort();
		xhr2 = $.ajax({
			url: 'assets/json/search.json',
			type: 'GET',
			contentType: 'application/json',
		}).done(function(data)
		{
			if($('#id_building').val() == '')
				$('#searchRes').html("");	
			$('#searchRes').html("");
			data = data.results;
			
			for(i in data)
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

				address = data[i].data.address.split(',');
				leedon_activated = '';
				country = address[address.length - 1]; 
				trial_expire_date = '';
				name = data[i].data.names[0];
				street = address;
				
				
				$('#searchRes').append('<div class="srch" id='+id+' lid='+lid+' leedon_activated='+leedon_activated+' source_name='+source_name+'>'+name+'<\div>');
				if (i > 3)
					break;
			}
			$('#searchRes').append('<div id="createNew" >Create Project \''+ $('#id_building').val() +'\'</div>');	
			$('#searchRes').show();
			$('#createNew').on('click', function(e)
            {
                $("#login_iFrame").attr('src','//plaque.' + location.hostname+'/auth/login/?NAME='+ $('#id_building').val()); 
                var login_iframe = $("#login_iFrame");
                $('#lean_overlay').show();
                $('#lean_overlay').css('opacity', '0.6');
				$('#modal').show();
				$('#searchRes').hide();
				e.stopPropagation();
            });
			$('.srch').on('click', function(e)
            {
				source_id = $(this).attr('lid');
				if(($(this).attr('leedon_activated') == 'False' || $(this).attr('leedon_activated') == 'deactivated') && $(this).attr('source_name') != 'LEED')
				{
					window.location = '//plaque.' + location.hostname + '/dashboard/?page=overview&LEED=0&public='+$(this).attr('id');
				}
				else
				{
					window.location = '//plaque.' + location.hostname + '/dashboard/?page=overview&LEED='+source_id + '&public=' + $(this).attr('id');
				}
				$('#searchRes').hide();
				e.stopPropagation();	
            });
		});
	});
	
	$('#id_building').on('focus', function(event)
	{
		$('#searchRes').show();	
	});
	
    //Open Public dashboard
    $('#building_search').on('click', function()
    {
      
      if( $('#id_building').val() == '')
      {
          window.location = '//plaque.' + location.hostname + '/v2/dashboard/';
      }
      else
      {
          window.location = '//plaque.' + location.hostname + '/v2/dashboard/?q=' + $('#id_building').val();
      }
        
    });
    
    $('body').on('keyup', function(e)
    {
        if($('.tt-menu').css('display') != 'none')
        {
            $('#plaque_video').css('cssText', 'margin-top: 190px !important;');
            //$('#id_building').css('cssText', ' border-radius: 5px 0px 0px 0px !important;');
        }
        else
        {
            $('#plaque_video').css('cssText', 'margin-top: 0px !important;');
            //$('#id_building').css('cssText', ' border-radius: 5px 0px 0px 5px !important;');
        }
    });
    
    $('body').on('click', function(e)
    {
        if($('.tt-menu').css('display') != 'none')
        {
            $('#plaque_video').css('cssText', 'margin-top: 190px !important;');
            //$('#id_building').css('cssText', ' border-radius: 5px 0px 0px 0px !important;');
        }
        else
        {
            $('#plaque_video').css('cssText', 'margin-top: 0px !important;');
            //$('#id_building').css('cssText', ' border-radius: 5px 0px 0px 5px !important;');
        }
        container = $('#searchRes');
		container2 = $('.srch');
		container3 = $('#id_building');
        modal = $('#modal');
        if (!container.is(e.target) && !container2.is(e.target) && !container3.is(e.target))
        {
            $('#searchRes').hide();
        }
        if (!modal.is(e.target) && $(e.target).html() != 'SIGN IN' && $(e.target).html() != 'START TRIAL')
        {
            $('#lean_overlay').hide();
            $('#modal').hide();
        }
    });
    
});