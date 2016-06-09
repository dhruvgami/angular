$( document ).ready(function() {

	if (LEED_Online_status == "User DoesNotExist"){
		$('.checkbox').hide();
		$('#submit_btn').remove();
		$('.create_account_button').append('<input class="btn btn_red" id="click_sign_up" type="submit" value="CREATE ACCOUNT" />');
		$('#error_msz').show();
		$('#error_msz').removeClass('mtm25');
		$('.new_user').removeClass('mt28');
		$('#error_msz').removeClass('green-color').addClass('red-color');
		$('#error_msz').html("Looks like we didn't have an account associated with the e-mail address. Please create an account.");
		$('#login_user').before('<input id="login_user_name" placeholder="First Name" type="text" autocorrect="off" autocapitalize="off" name="name" value="" onfocus="this.placeholder = """ onblur="this.placeholder = "Name"" style="width: 37% !important;" /><input id="login_user_name_last" placeholder="Last Name" type="text" autocorrect="off" autocapitalize="off" name="name" value="" onfocus="this.placeholder = " ""="" onblur="this.placeholder = " name""="" class="grey-border" style="width: 37% !important;">');
		$('.header_title').html('SIGN UP');
		$('#login_user_name').show();
        $('#login_user_name_last').show();
		// $('#modal').addClass('h420');
		// $('#submit_btn').val('CREATE ACCOUNT');
		$('#login_signup').html('Log In');
		$('#create_account').html('Already have an account?');
		$('.new_user').addClass('align-center');
		$('#login_signup').addClass('float-none');
		$('#login_signup').removeClass('float-right');
		$('#create_account').addClass('not-active');
        $('#login_user').val(name_send);
	}
	else if (LEED_Online_status == "User Exist"){
		$('.checkbox').show();
		$('#click_sign_up').remove();
		$('.login_user_button').append('<input class="btn btn_red" id="submit_btn" type="submit" value="LOG IN" />');
		$('#error_msz').addClass('mtm25');
		$('#error_msz').show();
		$('.new_user').removeClass('mt28');
		$('#error_msz').removeClass('green-color').addClass('red-color');
		$('#error_msz').html("Please enter a correct username and password.");
		$('#login_user_name').remove();
        $('#login_user_name_last').remove();
		$('.header_title').html('SIGN IN');
		// $('#modal').removeClass('h420');
		// $('#submit_btn').val('LOG IN');
		$('#login_signup').html('Sign Up');
		$('#create_account').html('Forgot your password?');
		$('.new_user').removeClass('align-center');
		$('#login_signup').addClass('float-right');
		$('#login_signup').removeClass('float-none');
		$('#create_account').removeClass('not-active');
	}
	else{
		$('.checkbox').show();
		$('#click_sign_up').remove();
		$('.login_user_button').append('<input class="btn btn_red" id="submit_btn" type="submit" value="LOG IN" />');
		$('#error_msz').hide();
		$('.new_user').addClass('mt28');
		$('#error_msz').html("");
		$('#login_user_name').remove();
        $('#login_user_name_last').remove();
		$('.header_title').html('SIGN IN');
		// $('#modal').removeClass('h420');
		// $('#submit_btn').val('LOG IN');
		$('#login_signup').html('Sign Up');
		$('#create_account').html('Forgot your password?');
		$('.new_user').removeClass('align-center');
		$('#login_signup').addClass('float-right');
		$('#login_signup').removeClass('float-none');
		$('#create_account').removeClass('not-active');
	}

	$('.user_login').on('click', '#click_sign_up', function() {

		$('#error_msz').hide();
		$('.new_user').addClass('mt28');

		var name_field  = true;
		var email_field = true;
		var pass_field  = true;
        var name_field_last  = true;

		if (!validateEmail(($('#login_user').val()).trim())){
			email_field = false;
	        $('#login_user').removeClass('grey-border').addClass('red-border');
		}
		else{
			$('#login_user').removeClass('red-border').addClass('grey-border');
		}

		if (($('#login_user_name').val()).trim() == ""){
			name_field  = false;
			$('#login_user_name').removeClass('grey-border').addClass('red-border');
		}
		else{
			$('#login_user_name').removeClass('red-border').addClass('grey-border');
		}
        
        if (($('#login_user_name_last').val()).trim() == ""){
			name_field_last  = false;
			$('#login_user_name_last').removeClass('grey-border').addClass('red-border');
		}
		else{
			$('#login_user_name_last').removeClass('red-border').addClass('grey-border');
		}

		if (($('#login_pass').val()).trim() == ""){
			pass_field  = false;
			$('#login_pass').removeClass('grey-border').addClass('red-border');
		}
		else{
			$('#login_pass').removeClass('red-border').addClass('grey-border');
		}

		if(name_field == false || name_field_last == false)
		{
			$('#error_msz').html("Invalid Name");
		}
		if(email_field == false)
		{
			$('#error_msz').html("Invalid E-Mail");
		}
		if(pass_field == false)
		{
			$('#error_msz').html("Invalid Password");
		}
		if((name_field == false || name_field_last == false) && email_field == false)
		{
			$('#error_msz').html("Invalid Name and E-Mail");
		}
		if(pass_field == false && email_field == false)
		{
			$('#error_msz').html("Invalid E-Mail and Password");
		}
		if(pass_field == false && (name_field == false || name_field_last == false))
		{
			$('#error_msz').html("Invalid Name and Password");
		}
		if((name_field == false || name_field_last == false) && email_field == false && pass_field == false)
		{
			$('#error_msz').html("Invalid Name, E-Mail and Password");
		}
		
		if (name_field && email_field && pass_field && name_field_last){
			$(".loader").show();
	        $(".loader_bg").show();
	        $('#error_msz').hide();
	        $('.new_user').addClass('mt28');
			$('#error_msz').html("");
	        var encoded_payload = 'user_name=' + encodeURIComponent(($('#login_user_name').val()).trim() + ' ' + ($('#login_user_name_last').val()).trim()) + '&user_email=' + encodeURIComponent(($('#login_user').val()).trim()) + '&user_pass=' + encodeURIComponent(($('#login_pass').val()).trim());
	        $.ajax({
	        url: '/auth/createuser/',
	        type: 'POST',
	        contentType: 'application/x-www-form-urlencoded',
	        data: encoded_payload
	      }).done(function(data) {
	      	$(".loader").hide();
	        $(".loader_bg").hide();
	        if (data.message == "User created"){
	        	$('.checkbox').show();
	        	$('#click_sign_up').remove();
				$('.login_user_button').append('<input class="btn btn_red" id="submit_btn" type="submit" value="LOG IN" />');
	        	$('#error_msz').show();
	        	$('#error_msz').addClass('mtm25');
	        	$('.new_user').removeClass('mt28');
	        	$('#error_msz').removeClass('red-color').addClass('green-color');
				$('#error_msz').html("Your account is created. Please login to continue.");
	        	$('#login_user_name').val('');
                $('#login_user_name_last').val('');
	        	$('#login_pass').val('');
	        	$('#login_user_name').removeClass('red-border').addClass('grey-border');
                $('#login_user_name_last').removeClass('red-border').addClass('grey-border');
		        $('#login_user').removeClass('red-border').addClass('grey-border');
				$('#login_pass').removeClass('red-border').addClass('grey-border');

				$('#login_user_name').remove();
                $('#login_user_name_last').remove();
				$('.header_title').html('SIGN IN');
				// $('#modal').removeClass('h420');
				// $('#submit_btn').val('LOG IN');
				$('#login_signup').html('Sign Up');
				$('#create_account').html('Forgot your password?');
				$('.new_user').removeClass('align-center');
				$('#login_signup').addClass('float-right');
				$('#login_signup').removeClass('float-none');
				$('#create_account').removeClass('not-active');
	        }
	        else if (data.message == "User already exists"){
	        	$('.checkbox').hide();
	        	$('#login_pass').val('');
	        	$('#error_msz').show();
	        	$('#error_msz').removeClass('mtm25');
	        	$('.new_user').removeClass('mt28');
	        	$('#error_msz').removeClass('green-color').addClass('red-color');
				$('#error_msz').html("Looks like we have an account associated with the e-mail address.");
	        	$('#login_user_name').removeClass('red-border').addClass('grey-border');
                $('#login_user_name_last').removeClass('red-border').addClass('grey-border');
		        $('#login_user').removeClass('grey-border').addClass('red-border');
				$('#login_pass').removeClass('red-border').addClass('grey-border');
	        } 
	        else{
	        	$('.checkbox').hide();
	        	$('#login_pass').val('');
	        	$('#error_msz').show();
	        	$('#error_msz').removeClass('mtm25');
	        	$('.new_user').removeClass('mt28');
	        	$('#error_msz').removeClass('green-color').addClass('red-color');
				$('#error_msz').html("Please try again.");
	        	$('#login_user_name').removeClass('red-border').addClass('grey-border');
                $('#login_user_name_last').removeClass('red-border').addClass('grey-border');
		        $('#login_user').removeClass('grey-border').addClass('red-border');
				$('#login_pass').removeClass('red-border').addClass('grey-border');
	        }
	      }).fail(function(data) {
	      	$('.checkbox').hide();
	      	$(".loader").hide();
	        $(".loader_bg").hide();
	        $('#login_pass').val('');
	        $('#error_msz').show();
	        $('#error_msz').removeClass('mtm25');
	        $('.new_user').removeClass('mt28');
        	$('#error_msz').removeClass('green-color').addClass('red-color');
			$('#error_msz').html("Please try again.");
	        $('#login_user_name').removeClass('red-border').addClass('grey-border');
            $('#login_user_name_last').removeClass('red-border').addClass('grey-border');
	        $('#login_user').removeClass('grey-border').addClass('red-border');
			$('#login_pass').removeClass('grey-border').addClass('red-border');
	      });
		}
		else{
			$('#login_pass').val('');
			$('#error_msz').show();
			$('#error_msz').removeClass('mtm25');
			$('.new_user').removeClass('mt28');
			$('#error_msz').removeClass('green-color').addClass('red-color');
		}
	});

	//On click enter
	$("#login_user_name, #login_user, #login_pass, #login_user_name_last").keyup(function(event){
      if(event.keyCode == 13 && $('#login_user_name').length){
          $("#click_sign_up").click();
      }
    });

	$('#login_signup').click(function(){
		$('#error_msz').hide();
		$('.new_user').addClass('mt28');
		if ($(this).html() == 'Sign Up'){
			$('.checkbox').hide();
			$('#submit_btn').remove();
			$('.create_account_button').append('<input class="btn btn_red" id="click_sign_up" type="submit" value="CREATE ACCOUNT" />');
			$('#login_user').before('<input id="login_user_name" placeholder="First Name" type="text" autocorrect="off" autocapitalize="off" name="name" value="" onfocus="this.placeholder = """ onblur="this.placeholder = "Name"" style="width: 37% !important;" /><input id="login_user_name_last" placeholder="Last Name" type="text" autocorrect="off" autocapitalize="off" name="name" value="" onfocus="this.placeholder = " ""="" onblur="this.placeholder = " name""="" class="grey-border" style="width: 37% !important;">');
			$('.header_title').html('SIGN UP');
			$('#login_user_name').show();
            $('#login_user_name_last').show();
			// $('#modal').addClass('h420');
			// $('#submit_btn').val('CREATE ACCOUNT');
			$('#login_signup').html('Log In');
			$('#create_account').html('Already have an account?');
			$('.new_user').addClass('align-center');
			$('#login_signup').addClass('float-none');
			$('#login_signup').removeClass('float-right');
			$('#create_account').addClass('not-active');
			$('#login_user_name').removeClass('red-border').addClass('grey-border');
            $('#login_user_name_last').removeClass('red-border').addClass('grey-border');
	        $('#login_user').removeClass('red-border').addClass('grey-border');
			$('#login_pass').removeClass('red-border').addClass('grey-border');
		}
		else{
			$('.checkbox').show();
			$('#click_sign_up').remove();
			$('.login_user_button').append('<input class="btn btn_red" id="submit_btn" type="submit" value="LOG IN" />');
			$('#login_user_name').remove();
            $('#login_user_name_last').remove();
			$('.header_title').html('SIGN IN');
			$('#modal').removeClass('h420');
			// $('#submit_btn').val('LOG IN');
			$('#login_signup').html('Sign Up');
			$('#create_account').html('Forgot your password?');
			$('.new_user').removeClass('align-center');
			$('#login_signup').addClass('float-right');
			$('#login_signup').removeClass('float-none');
			$('#create_account').removeClass('not-active');
			$('#login_user_name').removeClass('red-border').addClass('grey-border');
            $('#login_user_name_last').removeClass('red-border').addClass('grey-border');
	        $('#login_user').removeClass('red-border').addClass('grey-border');
			$('#login_pass').removeClass('red-border').addClass('grey-border');
		}
	});
	
	if(intimate_downtime && !inIframe()){
	    $( document ).ready(function() {

	      if (sessionStorage.intimate_downtime){
	        if (sessionStorage.intimate_downtime == "activate"){
	          //do nothing
	        }
	        else{
	          return;
	        }
	      }
	      sessionStorage.setItem("intimate_downtime", "activate");
	      $('.jquery-header-bar').css('font-family', '"Montserrat", Helvetica, sans-serif');
	      $('.notification p').first().html("<span style='font-size: 16px;'><b>LEEDON.IO SCHEDULED MAINTENANCE MAY 13</b></span><br><span style='font-size: 13px;'>LEEDON.IO will be offline from 9.30 pm EST on May 13, 2016 until 12 am on May, 14, 2016 for maintenance. During this time, you will not be able to log into the system, while we perform routine maintenance and implement system updates.<br><a href='mailto:contact@leedon.io'>Contact us for more information.</a>");
        $('.jquery-header-bar').hide().delay(3000).slideDown(400);
	      $('.jquery-arrow').click(function(){
	          sessionStorage.intimate_downtime = "deactivate"
	          $('.jquery-header-bar').slideToggle();
	      });
	    });
	  }

	if (!(Modernizr.touchEvents || Modernizr.touch) && !inIframe()) {
		$('.user_login').on('click', '#submit_btn', function() {

			$('#error_msz').hide();
			$('.new_user').addClass('mt28');

			var email_field = true;
			var pass_field  = true;

			if (($('#login_user').val()).trim() == ""){
				email_field = false;
		        $('#login_user').removeClass('grey-border').addClass('red-border');
			}
			else{
				$('#login_user').removeClass('red-border').addClass('grey-border');
			}

			if (($('#login_pass').val()).trim() == ""){
				pass_field  = false;
				$('#login_pass').removeClass('grey-border').addClass('red-border');
			}
			else{
				$('#login_pass').removeClass('red-border').addClass('grey-border');
			}

			if (email_field && pass_field){
				$(".loader").show();
	            $(".loader_bg").show();
			}
			else{
				return false;
			}
            
		  });
	}
	if (inIframe()){
		// $('.popupHeader').css('padding-top', '20px');
		$('body').css('background', 'none');
        $('.user_login').on('click', '#submit_btn', function() {

        	$('#error_msz').hide();
        	$('.new_user').addClass('mt28');

			var email_field = true;
			var pass_field  = true;

			if (($('#login_user').val()).trim() == ""){
				email_field = false;
		        $('#login_user').removeClass('grey-border').addClass('red-border');
			}
			else{
				$('#login_user').removeClass('red-border').addClass('grey-border');
			}

			if (($('#login_pass').val()).trim() == ""){
				pass_field  = false;
				$('#login_pass').removeClass('grey-border').addClass('red-border');
			}
			else{
				$('#login_pass').removeClass('red-border').addClass('grey-border');
			}

			if (email_field && pass_field){
				$(".loader").show();
	            $(".loader_bg").show();
			}
			else{
				return false;
			}
        });
	}
	else{
		var login_width = '400px';
		var margin_left = '-170px';
		var login_top	= '150px';
		if((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i))) {
			login_top	= '80px';
		}
		if ($(window).width() <= 420){
			login_width = '320px';
			margin_left = '-150px';
		}
		$('#modal').css({position: 'absolute', left: '47%','margin-left': margin_left,'top': login_top, 'margin-bottom': '150px', 'border': '1px solid #D1D1D1', 'width':login_width, '-webkit-box-shadow': '0px 0px 5px 0px rgba(180,180,180,0.75)', '-moz-box-shadow': '0px 0px 5px 0px rgba(180,180,180,0.75)', 'box-shadow': '0px 0px 5px 0px rgba(180, 180, 180, 0.75)' });
		$('body').css('background-color', '#eeeeee')
		$("#modal_close").css('display','none');
	}

	function inIframe () {
	    try {
	        return window.self !== window.top;
	    } catch (e) {
	        return true;
	    }
	}

	function validateEmail(email) {
	    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
	    return re.test(email);
	}
	
});

$(window).resize(function(){
	var login_width = '400px';
	var margin_left = '-170px';
	var login_top	= '150px';
	if((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i))) {
		login_top	= '80px';
	}
	if ($(window).width() <= 420){
		login_width = '320px';
		margin_left = '-150px';
	}
	$('#modal').css({position: 'absolute', left: '47%','margin-left': margin_left,'top': login_top, 'margin-bottom': '150px', 'border': '1px solid #D1D1D1', 'width':login_width, '-webkit-box-shadow': '0px 0px 5px 0px rgba(180,180,180,0.75)', '-moz-box-shadow': '0px 0px 5px 0px rgba(180,180,180,0.75)', 'box-shadow': '0px 0px 5px 0px rgba(180, 180, 180, 0.75)' });
	$('body').css('background-color', '#eeeeee')
	$("#modal_close").css('display','none');
});
