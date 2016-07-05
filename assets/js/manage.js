var selectedUser_status = [];
var selectedUser_email = [];
var selectedUser_first_name = [];
var selectedUser_last_name = [];

function alertOnExistProjectTeamMember(message)
{
    $.blockUI(
    {
        message: null,
        overlayCSS:
        {
            backgroundColor: '#000',
            opacity: .5,
            cursor: 'auto'
        }
    });
    alertify.alert(message);
    if (Modernizr.touchEvents || Modernizr.touch)
    {
        $('#alertify-ok').on("touchstart", function()
        {
            $.unblockUI();
        });
    }
    else
    {
        $('#alertify-ok').on("click", function()
        {
            $.unblockUI();
        });
    }
}

function touchDevice () {
  if (Modernizr.touchEvents || Modernizr.touch){
    return true;
  }
  else{
    return false;
  }
}

    function submit_edited_details(paymetricFlag , token) {
      
      $("#preloader").show();
      $("#status").show();

      var CC_type_obj = $('#DIeCommFrame').contents().find('.card_type_tbl img').filter(function() {
        return $(this).css('opacity') == '1';
      });
      var months = {January: '01', February: '02',    March: '03', April: '04', May: '05', June: '06',
                  July: '07', August: '08', September: '09',    October: '10',    November: '11',   December: '12'};
      
      var CC_type = "";
      if (CC_type_obj.attr('value') == "MASTERCARD"){
        CC_type = "MC";
      }
      else if(CC_type_obj.attr('value') == "AMERICAN EXPRESS"){
        CC_type = "AMEX";
      }
      else if(CC_type_obj.attr('value') == "DISCOVER"){
        CC_type = "DIS";
      }
      else if(CC_type_obj.attr('value') == "VISA"){
        CC_type = "VISA";
      }
      
      var CC_expiry_month    = months[$('#DIeCommFrame').contents().find('#month option:selected').text()];
      var CC_expiry_year     = $('#DIeCommFrame').contents().find('#year option:selected').text();

      if (!touchDevice()){
        NProgress.configure({ ease: 'ease', speed: 500,
                            showSpinner: false });
        $.blockUI({ message: null, overlayCSS: { 
                backgroundColor: '#fff',
                opacity: 0.4
            } });
        NProgress.start();
        NProgress.set(0.5);
      }

      if(paymetricFlag){
        // Paymetric code starts
        
        if (CC_type=="AMEX"){
          document.getElementById('DIeCommFrame').contentWindow.document.getElementById('Paymetric_CreditCardType').selectedIndex = 0;
        }
        else if(CC_type=="VISA"){
          document.getElementById('DIeCommFrame').contentWindow.document.getElementById('Paymetric_CreditCardType').selectedIndex = 1;
        }
        else if(CC_type=="MC"){
          document.getElementById('DIeCommFrame').contentWindow.document.getElementById('Paymetric_CreditCardType').selectedIndex = 2;
        }
        else if(CC_type=="DIS"){
          document.getElementById('DIeCommFrame').contentWindow.document.getElementById('Paymetric_CreditCardType').selectedIndex = 3;
        }

        document.getElementById('DIeCommFrame').contentWindow.document.getElementById('Paymetric_Exp_Month').value = CC_expiry_month;
        document.getElementById('DIeCommFrame').contentWindow.document.getElementById('Paymetric_Exp_Year').value = CC_expiry_year.slice(-2);
        document.getElementById('DIeCommFrame').contentWindow.document.getElementById('PayNowButton').click();

        // Paymetric code ends
      }
      else{
        var CC_first_name   = $('#first_name').val();
        var CC_last_name    = $('#last_name').val();
        var CC_address      = $('#address').val();
        var CC_city         = $('#city').val();
        var CC_po_code      = $('#code').val();
        var CC_country      = $('#country1 option:selected').val().trim();
        var CC_state        = $('#state1 option:selected').val().trim();
        var CC_email        = $('#email').val();
        var CC_phone        = $('#phone').val();

        if($('.pay_mode#check').attr("src")=="/static//payment_v3/images/radioFull.png"){
          CC_expiry_month = "";
          CC_expiry_year = "";
          CC_cvv = "";
          CC_number = "";
        }

        var card_info = {
                          'CC_first_name' : CC_first_name,
                          'CC_last_name' : CC_last_name,
                          'CC_address' : CC_address,
                          'CC_city' : CC_city,
                          'CC_po_code' : CC_po_code,
                          'CC_country' : CC_country,
                          'CC_state' : CC_state,
                          'CC_email' : CC_email,
                          'CC_phone' : CC_phone,
                          'paymetric_r' : token.split('&s=')[0],
                          'paymetric_s' : token.split('&s=')[1],
                          'payment_mode'  : payment_mode
                        }

        $.ajax({
            url:'/payment/updatecreditcard/LEED:' + plaqueNav.getParameterByName('LEED') + '/',
            type: "POST",
            data: JSON.stringify(card_info),
            contentType: 'application/json',
            success:function(response){
              if (response.message=="SUCCESS"){
                $("#preloader").hide();
                $("#status").hide();
                if (!touchDevice()){
                  NProgress.done();
                  $.unblockUI();
                }
                $('.confirmation_account').css('display', 'block');
                $('.confirmation_account').css('color', '#39B44A');
                $('.confirmation_account').html('Updated successfully.');
                //On success
                $('#account_exp_row').css('display','none');
                $('#account_cvv_row').css('display','none');
                $('#account_country_row').css('display','none');
                $('#display_country').val(($('#country1 option:selected').text()).trim());
                $('#display_state').val(($('#state1 option:selected').text()).trim());
                $('#account_display_country').css('display','block');
                $('.account_submit_button').css('display','none');
                $('.field_label_cards').css('display','none');
                $('#first_name').prop("disabled", true);
                $('#last_name').prop("disabled", true);
                $('#email').prop("disabled", true);
                if (response.credit_card_number == ""){
                  $('#cc_row').css('display','none');
                }
                else{
                  $('#cc_row').css('display', 'block');
                  $('#card_no').val(response.credit_card_number);
                  $('#card_no').prop("disabled", true);
                }
                $('#month').prop("disabled", true);
                $('#year').prop("disabled", true);
                $('#cvv').prop("disabled", true);
                $('#address').prop("disabled", true);
                $('#city').prop("disabled", true);
                $('#code').prop("disabled", true);
                $('#phone').prop("disabled", true);
                $('.show_on_edit').hide();
                $('#DIeCommFrame').css('display', 'none');
                $('#DIeCommFrame').attr( 'src', '/v3/payment/getpaymetricform/LEED:' + plaqueNav.getParameterByName('LEED') + '/page:' + plaqueNav.getParameterByName('page') + '/');
              }
              else if(response.message=="NOT_FOUND" || response.message=="BAD_REQUEST" || response.message=="ERROR"){
                $('#DIeCommFrame').attr( 'src', '/v3/payment/getpaymetricform/LEED:' + plaqueNav.getParameterByName('LEED') + '/page:' + plaqueNav.getParameterByName('page') + '/');
                $("#preloader").hide();
                $("#status").hide();
                if (!touchDevice()){
                  NProgress.done();
                  $.unblockUI();
                }
                $('.confirmation_account').css('display', 'block');
                $('.confirmation_account').css('color', 'red');
                $('.confirmation_account').html(response.err_message + '.');
                // display_error_only_text("There was an error occurred while fetching details.");
              }
            },
            error:function (xhr, textStatus, thrownError){
              $('#DIeCommFrame').attr( 'src', '/v3/payment/getpaymetricform/LEED:' + plaqueNav.getParameterByName('LEED') + '/page:' + plaqueNav.getParameterByName('page') + '/');
              $("#preloader").hide();
              $("#status").hide();
              if (!touchDevice()){
                NProgress.done();
                $.unblockUI();
              }
              // display_error_only_text("There was an error occurred while fetching details.");
            }
          });
      }
    }

(function() {
    window.manageNav = {

    func_flag_data_for_put : {},
		
		set_href_agreement_download: function(agreement_id)
		{
			var url = window.location.protocol + '//' + window.location.hostname + '/payment/getsigneddocumentinpdf/LEED:' + plaque.LEED + '/ID:' + agreement_id + '/';
			var link = document.createElement('a');
			link.href = url;
			document.body.appendChild(link);
			link.click();
		},
		
		numericToString: function(num)
		{
			var str = (num + '').replace(/(\d)(?=(\d{3})+$)/g, '$1,');
			if (str.indexOf('.') == -1)
				str = '$' + str + '.00';
			else
				str = '$' + str
			return str;
		},
		
		set_href_download: function(sap_order_id)
		{
			var link = window.location.protocol + '//' + window.location.hostname + '/payment/getreceiptinpdf/LEED:' + plaque.LEED + '/ID:' + sap_order_id + '/';
			$('#download_receipt a').attr('href', link)
		},
		
		generateReceipt: function(obj)
		{

			var need_plaque = obj.leed_plaque;
			var purchase_plaque = obj.purchase_plaque;
			var paid_full = obj.paid_full
			var receipt_date = obj.payment_date.trim().split('-');

			$('.building_address').html(obj.address);
			$('.receipt_sap_order_id').html(obj.sap_order_id);
			$('.receipt_payer_name ').html(obj.payer_name_only);
			$('.receipt_total_amount').html(manageNav.numericToString(parseFloat(obj.amount_paid)));
			$('.receipt_building_name').html(obj.building_name);
			$('.receipt_building_ID').html(parseInt(obj.leed_id));
			$('.receipt_date').html(receipt_date[1] + '/' + receipt_date[2] + '/' + receipt_date[0]);
			$('.receipt_payer').html(obj.payer_name);
			$('.credit_card_number').html(obj.credit_card_number);
			if (getMeterData.payment_mode == "check")
			{
				$('#ccrow_acc_sec').css('display', 'none');
			}
			if (obj.term_com == "1")
			{
				$('.receipt_term').html(obj.term_com + ' Year');
			}
			else
			{
				$('.receipt_term').html(obj.term_com + ' Years');
			}

			if (need_plaque)
			{
				$('.order_sum_plaqueonetime').show();
				if (purchase_plaque)
				{
					$('#receipt_bld_LDP_text').html("LEED Dynamic Plaque Hardware");
				}
				else
				{
					if (paid_full)
					{
						$('#receipt_bld_LDP_text').html("LEED Dynamic Plaque Hardware (" + obj.term_com + " Year)");
					}
					else
					{
						$('#receipt_bld_LDP_text').html("LEED Dynamic Plaque Hardware (1 Year)");
					}
				}
				$('.receipt_plaque_price').html(manageNav.numericToString(parseFloat(obj.plaque_cost)));
			}
			else
			{
				$('.order_sum_plaqueonetime').hide();
			}

			if (paid_full)
			{
				if (obj.term_com == "1")
				{
					$('#receipt_bld_sub_text').html("LEED Dynamic Plaque Subscription (" + obj.term_com + " Year)");
				}
				else
				{
					$('#receipt_bld_sub_text').html("LEED Dynamic Plaque Subscription (" + obj.term_com + " Years)");
				}
			}
			else
			{
				$('#receipt_bld_sub_text').html("LEED Dynamic Plaque Subscription (1 Year)");
			}

			$('.receipt_sub_price').html(manageNav.numericToString(parseFloat(obj.subscription_price)));
			$('.receipt_total_price').html(manageNav.numericToString(parseFloat(obj.amount_paid)));
		},
        
        linksSetup: function()
        {
            $('body').on('click', '#plaque_link', function(e)
            {
                window.open($('#plaque_link').val(), '_blank'); 
                e.stopPropagation();
                e.preventDefault();
                return false;
            });
            $('body').on('click', '#survey_link', function(e)
            {
                window.open('/static/LEED_Dynamic_Plaque_Manual.pdf');
                e.stopPropagation();
                e.preventDefault();
                return false;
            });
        },
		
		formattedDate: function(date)
		{
			date.setMonth(date.getMonth() + 1);
			day = String(date.getDate());
			if (day.length === 1)
			{
				day = '0' + day;
			}
			month = String(date.getMonth());
			if (month.length === 1)
			{
				month = '0' + month;
			}
			year = String(date.getFullYear());
			return year + '-' + month + '-' + day;
		},
		
		buildingInfo: function(options)
		{
      plaqueNav.showStrategiesLoadingMessage('Loading building data...');
      manageNav.building_info_visibility();
			return $.ajax(
			{
				type: "GET",
				dataType: 'jsonp',
				url: "/buildings/LEED:" + plaque.LEED + "/"
			}).done(function(data)
			{
				plaque.buildingData = data;
				var expiry_date_time = new Date(data.survey_expire_date);
				var display_date = manageNav.formattedDate(expiry_date_time);
				var display_hours = String(expiry_date_time.getHours());
				if (display_hours.length === 1)
				{
					display_hours = '0' + display_hours;
				}
				var display_minutes = String(expiry_date_time.getMinutes());
				if (display_minutes.length === 1)
				{
					display_minutes = '0' + display_minutes;
				}
				var display_time = display_hours + ":" + display_minutes;

				if (data.lobby_survey_status)
				{
					$('#toggleButton').html('Active');
					$('<div class="expiry_date"> Until ' + display_date + ' ' + display_time + '</div>').appendTo('#toggleButton');
					$('#toggleButton').val('active').change();
					$('#toggleButton').css('margin-left', '37px');
					$('#toggleButton').css('margin-right', '0px');
					$('#toggleButton').css('background', '-webkit-linear-gradient(top, #3bb34a 0%, #019146 100%)');
					$('#toggleButton').css('background', '-moz-linear-gradient(top, #3bb34a 0%, #019146 100%)');
					$('#toggleButton').css('background', '-ms-linear-gradient(top, #3bb34a 0%, #019146 100%)');
					$('#toggleButton').css('background', '-0-linear-gradient(top, #3bb34a 0%, #019146 100%)');
					$('#toggleButton').addClass('ie_green_gradient_leed');
				}
				else
				{
					$('#toggleButton').val('inactive').change();
					$('#toggleButton').html('Inactive');
					$('#toggleButton').css('margin-left', '0px');
					$('#toggleButton').css('margin-right', '62px');
					$('#toggleButton').css('background', 'gray');
					$('#toggleButton').removeClass('ie_green_gradient_leed');
				}

				//Start changes for ldpf-211
//				var scorepuck = document.getElementById('score-puck');
//				if (data.certification == "" || data.certification == "Denied" || data.certification == "None")
//				{
//					$('.nav .home').html("Score");
//					$('.nav .home').css("padding-top", "25px");
//					$('img.leed_logo_small').attr("src", '/static/dashboard/img/leed_logo_blank_small.png')
//						//$('score-puck').css("background", "url(../img/score-puck_nonleed.svg) no-repeat");
//						//var scorepuck = document.getElementById('score-puck');
//					scorepuck.style.backgroundImage = 'url(/static/dashboard/img/score-puck_nonleed.svg)';
//				}
//				else
//				{
//					$('.nav .home').html("LEED Score");
//					$('.nav .home').css("padding-top", "22px");
//					$('img.leed_logo_small').attr("src", '/static/dashboard/img/leed_logo_small.png');
//					scorepuck.style.backgroundImage = 'url(/static/dashboard/img/score-puck.svg)';
//				}
				//End changes for ldpf-211

				if (options && options.type === 'getAddress')
				{
					plaqueNav.total_occupants = data.occupancy;
					if ($('#selectBld').length > 0)
					{
						formatBName(data.name);
					}
					var isiPad = navigator.userAgent.match(/iPad|iPhone|iPod/i) != null;
					if (isiPad)
					{
						var src_plaque = "";
						if (plaque_public)
						{
							src_plaque = '/plaque/LEED:' + plaque.LEED
							$('#screensaver_iframe').attr('src', src_plaque)
						}
						else
						{
							src_plaque = '/plaque/LEED:' + plaque.LEED + '/?key=' + data.key;
							$('#screensaver_iframe').attr('src', src_plaque)
						}
					}

					if (typeof($('#selectBld').css('display')) == "undefined")
					{
						$('#navContainer').prepend('<nav class="nav customNav"><div class="nav_item" id="selectBld" data-page="selectBld" data-racetrack="false" style="padding-top: 14px;">' + data.name + '</div></nav>');
						$('.customNav').on('click', function()
						{
							window.location.href = '/dashboard/public';
						});
					}

					$.ajax(
					{
						type: "GET",
						dataType: 'jsonp',
						url: "/buildings/LEED:" + plaque.LEED + "/getencodedcountrystate/"
					}).done(function(decoded_data)
					{
						plaque.getMeterData.decoded_building_data = decoded_data;
						return $('#building_address').text(data.street + ' ' + data.city + ', ' + plaque.getMeterData.decoded_building_data.state + ' ' + data.zip_code);
					});

				}
				else
				{
					$('#buildingname').val(data.name);
					$('#yearbuilt').val(data.year_constructed);
					$('#streetaddress1').val(data.street);
					$('#city').val(data.city);
					$('#county').val(data.county);

					$.ajax(
					{
						type: "GET",
						dataType: 'json',
						url: "/buildings/LEED:" + plaque.LEED + "/getencodedcountrystate/"
					}).done(function(value)
					{
						if (value.state == '' && data.state == data.country)
						{
							$('#state').val('Not applicable');
						}
						else
						{
							$('#state').val(value.state);
						}
						$('#country').val(value.country);
					}).fail(function()
					{
						$('#state').val(data.state);
						$('#country').val(data.country);
					});

					$('#floorarea').val(data.gross_area);
					$('#totalHours').val(data.operating_hours);
					$('#occupancy').val(data.occupancy);
					$('#projectid').val(data.leed_id);
					$('#zipcode').val(data.zip_code);

//					plaque.buildingData.occupancy = data.occupancy;
					plaque.key = data.key;

					//======================== Changes for ldpf-73 ============================          
					$('#survey_link_email').val('/dashboard/?page=survey&LEED=' + data.leed_id + '&language=en' + '&key=' + data.key);
					$('#dboard_link').val('/dashboard/?page=home&LEED=' + data.leed_id + '&key=' + data.key);
                    plaqueNav.removeStrategiesLoadingMessage();
					return $('#plaque_link').val('/plaque/LEED:' + data.leed_id + '/?key=' + data.key);
				}
			}).fail(function()
			{
        plaqueNav.removeStrategiesLoadingMessage();
				ID = plaqueNav.getParameterByName('public');
				LEED = plaqueNav.getParameterByName('LEED')

				if (LEED != '0')
				{
					url = window.location.protocol + '//' + window.location.host + "/buildings/search_gbig/ID:" + ID + "/";
				}
				else
				{
					url = window.location.protocol + '//' + window.location.host + "/buildings/search_gbig/ID:" + ID + "/?LEED=False";
				}

				$.ajax(
				{
					url: url,
					type: 'GET',
					contentType: 'application/json'
				}).done(function(data)
				{
					plaque.buildingData = data;
					if (data.city == 'None')
						street = data[0].state;
					if (data.state == 'None')
						street = data[0].city;
					if (data.city == 'None' && data.state == 'None')
						street = '';
					else if (data.city != 'None' && data.state != 'None')
						street = data.city + ", " + data.state;
					$('#building_address').text(street + ', ' + data.state + ' ' + data.zip_code);
					$('#selectBld').remove();
					$('#navContainer').prepend('<nav class="nav customNav"><div class="nav_item" id="selectBld" data-page="selectBld" data-racetrack="false" style="padding-top: 14px;">' + data.name + '</div></nav>');
					$('.customNav').on('click', function()
					{
						window.location.href = '/dashboard/public';
					});
//					var scorepuck = document.getElementById('score-puck');
//					if (data.certification_name == "Silver" || data.certification_name == "Gold" || data.certification_name == "Platinum" || data.certification_name == "Bronze")
//					{
//						$('.nav .home').html("LEED Score");
//						$('.nav .home').css("padding-top", "22px");
//						$('img.leed_logo_small').attr("src", '/static/dashboard/img/leed_logo_small.png');
//						scorepuck.style.backgroundImage = 'url(/static/dashboard/img/score-puck.svg)';
//					}
//					else
//					{
//						$('.nav .home').html("Score");
//						$('.nav .home').css("padding-top", "25px");
//						$('img.leed_logo_small').attr("src", '/static/dashboard/img/leed_logo_blank_small.png')
//							//$('score-puck').css("background", "url(../img/score-puck_nonleed.svg) no-repeat");
//							//var scorepuck = document.getElementById('score-puck');
//						scorepuck.style.backgroundImage = 'url(/static/dashboard/img/score-puck_nonleed.svg)';
//					}



        });
			});
		},
		buildingSetupSubmit: function()
		{
			return $('#buildingSetup').on('blur', 'form.setup input', function()
			{
				var $self, field, json, newVal;


				newVal = $(this).val();
				field = $(this).attr('name');
				$self = $(this);

				if (newVal === '')
				{
					return $(this).css("border-color", "rgba(243,54,59,1)");
				}
				else
				{
					//Change for LDPF_119
					if (field != 'zip_code')
					{
						newVal = parseInt(newVal, 10);
					}
					if (($self.attr('id') === 'yearbuilt') && (newVal < 1000 || newVal > 9999))
						return $(this).css("border-color", "rgba(243,54,59,1)");
					if ($self.attr('id') === 'zipcode') //ldpf-122 zipcode validation changes start
					{
						if ($('#country').val() == 'US' || $('#country').val() == 'United States' || $('#country').val() == 'Canada')
						{
							var numberRegex = /(^\d{5}(-\d{4})?$)|(^[ABCEGHJKLMNPRSTVXY]{1}\d{1}[A-Z]{1} *\d{1}[A-Z]{1}\d{1}$)/;
							if (numberRegex.test(newVal) || newVal == "")
								$(this).css("border-color", "rgba(57,180,70,1)");
							else
								return $(this).css("border-color", "rgba(243,54,59,1)");
						}
						else
						{
							var numberRegex = /^[a-z|A-Z|0-9|-]*$/;
							if (numberRegex.test(newVal) || newVal == "")
								$(this).css("border-color", "rgba(57,180,70,1)");
							else
								return $(this).css("border-color", "rgba(243,54,59,1)");
						}
					} //ldpf-122 zipcode validation changes end

					if ((parseInt($('#totalHours').val()) > 168 || parseInt($('#totalHours').val()) < 0) && (field == "operating_hours"))
						return $(this).css("border-color", "rgba(243,54,59,1)");
					else
						$(this).css("border-color", "rgba(57,180,70,1)");

					if ((parseInt($('#floorarea').val()) <= 0) && (field == "gross_area"))
						return $(this).css("border-color", "rgba(243,54,59,1)");
					else
						$(this).css("border-color", "rgba(57,180,70,1)");

					if ((parseInt($('#occupancy').val()) < 0) && (field == "occupancy"))
						return $(this).css("border-color", "rgba(243,54,59,1)");
					else
						$(this).css("border-color", "rgba(57,180,70,1)");

					var p_year = new Date();
					var present_year = p_year.getFullYear();
					if (($self.attr('id') === 'yearbuilt') && (newVal > present_year))
						return $(this).css("border-color", "rgba(243,54,59,1)");
					else
					{
						$(this).parent().css('position', 'relative').prepend("<div class='ajax_loader'></div>");
						if ($self.attr('id') === 'yearbuilt' || $self.attr('id') === 'zipcode' || $self.attr('id') === 'floorarea' || $self.attr('id') === 'totalHours' || $self.attr('id') === 'occupancy')
							$self.css("border-color", "rgba(57,180,70,1)");
						json = {};
						json[field] = newVal;

						return $.ajax(
						{
							url: '/buildings/LEED:' + plaque.LEED + '/?recompute_score=1',
							type: 'PUT',
							contentType: 'application/json',
							data: JSON.stringify(json)
						}).done(function(data)
						{
							$.ajax(
							{
								url: '/buildings/LEED:' + plaque.LEED + '/checkrequiredfields/page:setup/',
								type: "GET",
								dataType: 'jsonp'
							}).done(function(required_data_response) {}).fail(function(required_data_response) {});
							return $('.ajax_loader').hide();
						}).fail(function(data)
						{

							return $('.ajax_loader').hide();
						});
					}
				}
			});
		},
    data_input_visibility: function(){
      if (plaqueNav.userBuilding_permission.permissions.data_input == "CRUD"){

      }
      else if(plaqueNav.userBuilding_permission.permissions.data_input == "R"){
        $('#manual_img').css("display", "none");
        $('.meterSetting').css("display", "none");
        $('#add_custom_strategy').css("display", "none");
        $('#strategy_content li.strategy-system *').unbind();
      }
      else if (plaqueNav.userBuilding_permission.permissions.data_input == ""){
        $('.nav .data_input_nav').css("display", "none");
      }
    },
    building_info_visibility: function(){
      if (plaqueNav.userBuilding_permission.permissions.bldg_info == "CRUD"){

      }
      else if(plaqueNav.userBuilding_permission.permissions.bldg_info == "R"){
        $('.show_calculator').css("display", "none");
        $('#floorarea').attr('disabled','disabled');
        $('#totalHours').attr('disabled','disabled');
        $('#occupancy').attr('disabled','disabled');
        $('#buildingname').attr('disabled','disabled');
        $('#projectid').attr('disabled','disabled');
        $('#yearbuilt').attr('disabled','disabled');
        $('#streetaddress1').attr('disabled','disabled');
        $('#city').attr('disabled','disabled');
        $('#county').attr('disabled','disabled');
        $('#zipcode').attr('disabled','disabled');
        $('#state').attr('disabled','disabled');
        $('#country').attr('disabled','disabled');
        $('#checkbox-lobbySurvey').prop('disabled', true);
        $("#checkbox-LDP-confidential").prop('disabled', true);
        $("#checkbox-LDP-showRacetrack").prop('disabled', true);
        $("#survey_link_email").prop('disabled', true);
      }
      else if (plaqueNav.userBuilding_permission.permissions.bldg_info == ""){
        $('.manage_category_nav').find("[category-type=setup]").css("display", "none");
      }
    },
    survey_visibility: function(){
      if (plaqueNav.userBuilding_permission.permissions.survey == "RU"){

      }
      else if(plaqueNav.userBuilding_permission.permissions.survey == "R"){
        $('.nav .survey_nav').css("display", "none");
      }
      else if (plaqueNav.userBuilding_permission.permissions.survey == ""){
        $('.nav .survey_nav').css("display", "none");
      }
    },
		account_visibility: function()
		{
			if (plaqueNav.userBuilding_permission.permissions.account == "RU")
			{

			}
			else if(plaqueNav.userBuilding_permission.permissions.account == "R")
			{
				$('#edit_bill_info').css("display", "none");
				$('.buttonContainer.planSelButton').css("display", "none");
				$('.add_teamManagement_input').css("display", "none");
				$('.edit_team_permission_TM').css("display", "none");
			}
			else if (plaqueNav.userBuilding_permission.permissions.account == "")
			{
				$('#edit_bill_info').css("display", "none");
				$('.buttonContainer.planSelButton').css("display", "none");
				$('.add_teamManagement_input').css("display", "none");
				$('.edit_team_permission_TM').css("display", "none");
			}
		},

		projectStrategies: function(){
    //  $('#expand_lobby').click();
			
      var buildingRatingSystemCount = "";
      var buildingRatingSystem = [];
      /*
      jQuery.ajax( {
          async:false, 
          url: "/elements/ratingsystems/LEED:"+ plaque.LEED,
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
            jQuery.ajax({
                 async:false, 
                 url: "/elements/ratingsystems",
                 type: "GET",
                 contentType: 'application/json',
                 success:function(response){
                  
                  var ratingsystems = response.ratingsystems;
                   
                  var ratingsystemListDiv = "";
                  $.each(ratingsystems, function(i, ratingSystem){ 
                    ratingsystemListDiv+= '<li data-ratingsystem-key="'+ratingSystem.key+'">'+ratingSystem.value+'</li>';
                  //  $('.select-system-dropdown ul.dropdown-menu').append('<li data-ratingsystem-key="'+ratingSystem.key+'">'+ratingSystem.value+'</li>');
                  });

                   console.log(buildingRatingSystem);
                   console.log(buildingRatingSystemCount);

                   var ratingSystemDiv = ""
                   for (var i = 0; i < buildingRatingSystemCount; i++) {
                        ratingSystemDiv+='<div class="select-system-dropdown-grp">';
                          ratingSystemDiv+='<div class="btn-group select-system-dropdown">';
                            ratingSystemDiv+='<button class="btn btn-default dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">';
                                    ratingSystemDiv+='<span class="selected-system-text">';                                     
                                        //key = buildingRatingSystem[i]+
                                        $.each(ratingsystems, function(j, ratingSystem){                                          
                                          if(ratingSystem.key == buildingRatingSystem[i]){
                                            ratingSystemDiv+=ratingSystem.value;
                                          }
                                        });
                                    ratingSystemDiv+='</span>';
                                    ratingSystemDiv+='<span class="fa fa-angle-down"></span>';
                            ratingSystemDiv+='</button>';
                            ratingSystemDiv+='<ul class="dropdown-menu" role="menu">';

                        //  ratingSystemDiv+= ratingsystemListDiv;

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

                            ratingSystemDiv+='<div class="delete-selected-system">';
                                ratingSystemDiv+='<img src="/static/dashboard/img/fa-times-thin.png">';
                                ratingSystemDiv+='<span>Delete</span>';
                            ratingSystemDiv+='</div>';
                        ratingSystemDiv+='</div>';
                   };

                   $(".manage_block #create-snapshot-body .pull-left .select-system-label").after(ratingSystemDiv);
                 }
             });
          }
       });*/       
			 /*
			 $("#ratingSystemList-dropdown .ratingsystemList").change(function() {
				  console.log($(this).val());
			 });*/

		},

		projectTeamInfo: function()
		{
            $('.add_teamManagement_input').hide();
            $('#save_team').on('click', function()
            {
                selectedUser_email = [];
                selectedUser_status = [];
                selectedUser_first_name = [];
                selectedUser_last_name = [];
                $('.team_member_input').each(function()
                {
                    selectedUser_email.push($(this).children('.input_team').find('#team_email').val());
                    selectedUser_status.push($(this).children('.input_team').find('#team_status').val());
                    selectedUser_first_name.push($(this).children('.input_team').find('#team_first_name').val());
                    selectedUser_last_name.push($(this).children('.input_team').find('#team_last_name').val());
                    $('#add_new_member_TM_member').click();
                });    
            });
            
            $('#add_new_team_list').on('click', function()
            {
                $('.team_member_input_wrapper').append('<div class="team_member_input" status="false"><div class="input_team"><div class="team_field_header">Email Address</div><input class="input_team_field" type="text" id="team_email" tabindex="1" placeholder="name@domain.com"></div><div class="input_team"><div class="team_field_header">First Name</div><input class="input_team_field" type="text" id="team_first_name" tabindex="2" placeholder="(Optional)"></div><div class="input_team"><div class="team_field_header">Last Name</div><input class="input_team_field" type="text" id="team_last_name" tabindex="3" placeholder="(Optional)"></div><div class="input_team  mt20"><div class="team_field_header">Status</div><select class="input_team_field" type="text" id="team_status" placeholder="Select"><option value="Project Admin">ADMIN</option><option value="Project Team Manager">MANAGER</option><option value="Project Team Member">MEMBER</option><option value="None">NONE</option></select></div></div>');    
            });
            
            $('#team_member_main_container').html('<div id="teamMemberRowsHeader"><span class="teamLabel">NAME</span><span class="teamLabel">EMAIL</span><span class="teamLabel">STATUS</span><span class="teamLabel">MODIFIED</span></div>');
            
            $('#add_team_members').on('click', function()
            {
                $('.team_member_input_wrapper').html('<div class="team_member_input" status="false"><div class="input_team"><div class="team_field_header">Email Address</div><input class="input_team_field" type="text" id="team_email" tabindex="1" placeholder="name@domain.com"></div><div class="input_team"><div class="team_field_header">First Name</div><input class="input_team_field" type="text" id="team_first_name" tabindex="2" placeholder="(Optional)"></div><div class="input_team"><div class="team_field_header">Last Name</div><input class="input_team_field" type="text" id="team_last_name" tabindex="3" placeholder="(Optional)"></div><div class="input_team  mt20"><div class="team_field_header">Status</div><select class="input_team_field" type="text" id="team_status" placeholder="Select"><option value="Project Admin">ADMIN</option><option value="Project Team Manager">MANAGER</option><option value="Project Team Member">MEMBER</option><option value="None">NONE</option></select></div></div>');  
                
                $('#add_team_members_modal').modal('toggle');    
            });
            
//			NProgress.configure(
//			{
//				ease: 'ease',
//				speed: 500,
//				showSpinner: false
//			});
//			$.blockUI(
//			{
//				message: null,
//				overlayCSS:
//				{
//					backgroundColor: '#fff',
//					opacity: 0.4
//				}
//			});
//			NProgress.start();
//			NProgress.set(0.5);
            
            plaqueNav.showStrategiesLoadingMessage('Loading team members...');

			//Flow for pendiing requests
			var pending_requests_all = {};
			var pending_requests_counter = 0;
			$.ajax(
			{
				url: '/buildings/LEED:' + plaque.LEED + '/permission/request/',
				async: true,
				success: function(response)
				{
					$.each(response, function(index, item)
					{

						var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
						username_only[pending_requests_counter] = ((item.Useralias).toLowerCase()).trim();
						date_modified_formated = item.DateModified.split(" ")[0].split("-");
						pending_requests_all[pending_requests_counter] = {
							"Useralias": ((item.Useralias).toLowerCase()).trim(),
							"DateModified": date_modified_formated[1] + '/' + date_modified_formated[2] + '/' + date_modified_formated[0]
						};
						pending_requests_counter += 1;
					});

					if (pending_requests_counter <= 0)
					{
						$('.no_pending_requests').show();
					}
					else
					{
						$('.no_pending_requests').hide();
					}

					$('.total_pending_requests').html(pending_requests_counter);

					$.each(pending_requests_all, function(index, item)
					{
						$('#pending_requests_container').append('<div class="permissions_row_container"><div class="request_name_perm inline_block"><span class="request_name" user_id =' + item.Useralias + ' data-title="User E-mail">' + item.Useralias + '</span><span class="request_member_perm" data-title="Select permission">' + '<input type="submit" class="accept_permission_request btn btnFixWidth mb10 btnGreen no_outline h40 fs14" value="ACCEPT"><input type="submit" class="reject_permission_request btn btnOutline no_outline h40 fs14" value="REJECT">' + '</span><div class="ajax_loader_dropdown_TM_member"></div></div><div class="request_edit inline_block "><span clas="light_color">Requested</span><span class="request_member_modified mr55" data-title="Date Modified">' + item.DateModified + '</span></div></div>');
					});

					$('#pending_requests_container').on('click', '.accept_permission_request, .reject_permission_request', function()
					{
						$(this).parent().parent().find('.ajax_loader_dropdown_TM_member').show();
						var permission_result = $(this).val();
						var user_perm = $(this).parent().parent().find('.request_name').html();

						$.ajax(
						{
							url: '/buildings/LEED:' + plaque.LEED + '/permission/addtoexception/',
							type: 'POST',
							data: JSON.stringify(
							{
								"permission_result": permission_result,
								"user_perm": user_perm
							}),
							contentType: 'application/json',
							success: function(response)
							{
								if (response == "SUCCESS")
								{
									$('.ajax_loader_dropdown_TM_member').hide();
									$('#pending_requests_container').find("[user_id='" + user_perm + "']").parent().find('.request_member_perm').html('<img class="mt10" src="/static/payment_v3/images/Checkmark.svg">');
								}
								else
								{
									$('.ajax_loader_dropdown_TM_member').hide();
								}
							},
							error: function(XMLHttpRequest, textStatus, errorThrown)
							{
								$('.ajax_loader_dropdown_TM_member').hide();
							}
						});
					});
				},
				error: function(xhr)
				{ // if error occured
					$('.no_pending_requests').show();
				}
			});

			//Flow for team management
			var projectTeamMember_all = {};
			var username_only = [];
			var projectTeam_counter = 0;
			$.ajax(
			{
				url: '/buildings/LEED:' + plaque.LEED + '/getteammemberinfofromexception/',
				success: function(response)
				{
					$.each(response, function(index, item)
					{

						var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
						username_only[projectTeam_counter] = ((item.Useralias).toLowerCase()).trim();
						date_modified_formated = item.DateModified.split(" ")[0].split("-");
                        
                        if (item.first_name == 'None')
                        {
                            item.first_name = ''    
                        }
                        if (item.last_name == 'None')
                        {
                            item.last_name = ''    
                        }
                        
						projectTeamMember_all[projectTeam_counter] = {
							"Useralias": ((item.Useralias).toLowerCase()).trim(),
							"Roledescription": item.Roledescription,
							"DateModified": date_modified_formated[1] + '/' + date_modified_formated[2] + '/' + date_modified_formated[0],
                            "first_name": item.first_name,
                            "last_name": item.last_name
						};
						projectTeam_counter += 1;
					});
					$.ajax(
					{
						url: '/buildings/LEED:' + plaque.LEED + '/getteammemberinfofromleedonline/',
						success: function(response)
						{
							$.each(response, function(index, item)
							{
								if (username_only.indexOf((item[0].toLowerCase()).trim()) < 0)
								{
									projectTeamMember_all[projectTeam_counter] = {
										"Useralias": (item[0].toLowerCase()).trim(),
										"Roledescription": item[1],
										"DateModified": "",
                                        "first_name": '',
                                        "last_name": ''
									};
									projectTeam_counter += 1;
								}
							});
							$.each(projectTeamMember_all, function(index, item)
							{
								var dropdown_value_TM = '';
								if (item.Roledescription == 'Project Team Member')
								{
									dropdown_value_TM = '<select disabled class="permission_dropdown_TM permission_dropdown_disabled_TM member_button"><option value="Project Admin">ADMIN</option><option value="Project Team Manager">MANAGER</option><option selected value="Project Team Member">MEMBER</option><option value="None">NONE</option></select>';
								}
								else if (item.Roledescription == 'Project Admin')
								{
									dropdown_value_TM = '<select disabled class="permission_dropdown_TM permission_dropdown_disabled_TM admin_button"><option selected value="Project Admin">ADMIN</option><option value="Project Team Manager">MANAGER</option><option value="Project Team Member">MEMBER</option><option value="None">NONE</option></select>';
								}
								else if (item.Roledescription == 'Project Team Manager')
								{
									dropdown_value_TM = '<select disabled class="permission_dropdown_TM permission_dropdown_disabled_TM manager_button"><option value="Project Admin">ADMIN</option><option selected value="Project Team Manager">MANAGER</option><option value="Project Team Member">MEMBER</option><option value="None">NONE</option></select>';
								}
								else if (item.Roledescription == 'None')
								{
									dropdown_value_TM = '<select disabled class="permission_dropdown_TM permission_dropdown_disabled_TM none_button"><option value="Project Admin">ADMIN</option><option value="Project Team Manager">MANAGER</option><option value="Project Team Member">MEMBER</option><option selected value="None">NONE</option></select>';
								}
								$('#team_member_main_container').append('<div class="team_member_row_container"><div class="team_name"><span>' + item.first_name + ' ' + item.last_name + '</span></div><div class="team_name_perm inline_block"><span class="team_member_name" data-title="User E-mail">' + item.Useralias + '</span><span class="team_member_perm" data-title="Permission Status">' + dropdown_value_TM + '</span><div class="ajax_loader_dropdown_TM_member"></div></div><div class="team_modified_edit inline_block"><span class="team_member_modified" data-title="Date Modified">' + item.DateModified + '</span><span class="edit_team_permission_TM relative"><paper-ripple fit></paper-ripple>Edit</span></div></div>');
							});

							if (projectTeam_counter <= 0)
							{
								$('.no_team_member').show();
							}
							else
							{
								$('.no_team_member').hide();
							}

							$('.total_teamMembers').html(projectTeam_counter);

//							NProgress.done();
//							$.unblockUI();
              plaqueNav.removeStrategiesLoadingMessage();

							$('.edit_team_permission_TM').hide();
							$('.add_teamManagement_header').hide();
//							$('.add_teamManagement_input').hide();
							$('.request_member_perm').hide();
							
							if (String(plaqueNav.userBuilding_permission.role) == 'Project Admin' || String(plaqueNav.userBuilding_permission.role) == 'Account Manager')
							{
								$('.edit_team_permission_TM').show();
								$('.add_teamManagement_header').show();
//								$('.add_teamManagement_input').show();
								$('.request_member_perm').show();
							}
							else
							{
								$('.edit_team_permission_TM').hide();
								$('.add_teamManagement_header').hide();
//								$('.add_teamManagement_input').hide();
								$('.request_member_perm').hide();
							}
								
							manageNav.account_visibility();

						},
						error: function(xhr)
						{ // if error occured
							$('.no_team_member').show();
							NProgress.done();
							$.unblockUI();
							manageNav.account_visibility();
						}
					});
				},
				error: function(xhr)
				{ // if error occured
					$('.no_team_member').show();
					NProgress.done();
					$.unblockUI();
          manageNav.account_visibility();
				}
			});

			// Check validation of email
			$('.main_container').on('blur', '#new_username_TM_member', function()
			{
				var regEx = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/igm;
				if (regEx.test($('#new_username_TM_member').val().trim()))
				{
					$('#new_username_TM_member').css('cssText', 'border-color: rgba(204,204,204,1) !important');
					$('#add_new_member_TM_member').removeAttr('disabled');
				}
				else if ($('#new_username_TM_member').val().trim() == "")
				{
					$('#new_username_TM_member').css('cssText', 'border-color: rgba(204,204,204,1) !important');
					$('#add_new_member_TM_member').removeAttr('disabled');
				}
				else
				{
					$('#new_username_TM_member').css('cssText', 'border-color: rgba(243,54,59,1) !important');
					$('#add_new_member_TM_member').attr('disabled', 'disabled');
				}
			});

			$('.main_container').on('keyup', '#new_username_TM_member', function(event)
			{
				if (event.keyCode == 13)
				{
					$("#add_new_member_TM_member").click();
				}
			});

			$('.main_container').on('click', '#add_new_member_TM_member', function()
			{
                var a = 0;
				for(a=0; a<selectedUser_email.length ;a++)
                {
                    $('#new_username_TM_member').val(selectedUser_email[a]);
                    var userName = selectedUser_email[a];
                    var userStatus = selectedUser_status[a];
                    var first_name = selectedUser_first_name[a];
                    var last_name = selectedUser_last_name[a];
                    var regEx = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/igm;
                    if (!regEx.test($('#new_username_TM_member').val().trim()))
                    {
                        $('#new_username_TM_member').css('cssText', 'border-color: rgba(243,54,59,1) !important');
                    }
                    else if ($('#new_username_TM_member').val().trim() == "")
                    {
                        $('#new_username_TM_member').css('cssText', 'border-color: rgba(243,54,59,1) !important');
                    }
                    else
                    {
                        $('#new_username_TM_member').css('cssText', 'border-color: rgba(204,204,204,1) !important');
                        var id_present = false;
                        $('.team_member_name').each(function(index)
                        {
                            if ($(this).text().trim() == $('#new_username_TM_member').val().trim())
                            {
                                id_present = true
                            }
                        });
                        if (id_present)
                        {
                            $('.ajax_loader_TM').hide();
                            $('.multiple_id_member').html("Username is already present in the system. Please check the usernames listed above.");
                            $('.multiple_id_member').show();
                        }
                        else
                        {
                            $('.multiple_id_member').hide();
                            var user_existence;
                            $('.ajax_loader_TM').show();
                            $.ajax(
                            {
                                url: '/buildings/checkleedonlineuserexistence' + '/email:' + $('#new_username_TM_member').val().trim() + '/',
                                success: function(response)
                                {
                                    if (response.message == "SUCCESS")
                                    {
                                        user_existence = "Exist";
                                    }
                                    else if (response.message == "NOT FOUND")
                                    {
                                        user_existence = "New";
                                    }

                                    var TM_data = {
                                        'user_name': userName,
                                        'user_type': user_existence,
                                        'permission_type': userStatus,
                                        'first_name': first_name,
                                        'last_name': last_name
                                    }
                                    $.ajax(
                                    {
                                        url: '/buildings/LEED:' + plaque.LEED + '/addmembertoexception/',
                                        type: 'POST',
                                        data: JSON.stringify(TM_data),
                                        contentType: 'application/json',
                                        success: function(response)
                                        {
                                            if (response.message == "SUCCESS")
                                            {
                                                var today = new Date();
                                                var dd = today.getDate();
                                                var mm = today.getMonth() + 1; //January is 0!
                                                var yyyy = today.getFullYear();

                                                if (dd < 10)
                                                {
                                                    dd = '0' + dd
                                                }

                                                if (mm < 10)
                                                {
                                                    mm = '0' + mm
                                                }

                                                today_date = mm + '/' + dd + '/' + yyyy;

                                                if (userStatus == 'Project Admin')
                                                {
                                                    dropdown_value_dir_TM = '<select disabled class="permission_dropdown_TM permission_dropdown_disabled_TM member_button"><option selected value="Project Admin">ADMIN</option><option value="Project Team Manager">MANAGER</option><option value="Project Team Member">MEMBER</option><option value="None">NONE</option></select>';
                                                }
                                                else if (userStatus == 'Project Team Manager')
                                                {
                                                    dropdown_value_dir_TM = '<select disabled class="permission_dropdown_TM permission_dropdown_disabled_TM member_button"><option value="Project Admin">ADMIN</option><option selected value="Project Team Manager">MANAGER</option><option value="Project Team Member">MEMBER</option><option value="None">NONE</option></select>';
                                                }
                                                else if (userStatus == 'Project Team Member')
                                                {
                                                    dropdown_value_dir_TM = '<select disabled class="permission_dropdown_TM permission_dropdown_disabled_TM member_button"><option value="Project Admin">ADMIN</option><option value="Project Team Manager">MANAGER</option><option selected value="Project Team Member">MEMBER</option><option value="None">NONE</option></select>';
                                                }
                                                else if (userStatus == 'None')
                                                {
                                                    dropdown_value_dir_TM = '<select disabled class="permission_dropdown_TM permission_dropdown_disabled_TM member_button"><option value="Project Admin">ADMIN</option><option value="Project Team Manager">MANAGER</option><option value="Project Team Member">MEMBER</option><option selected value="None">NONE</option></select>'; 
                                                } 

                                                $('#team_member_main_container').append('<div class="team_member_row_container"><div class="team_name"><span>' + first_name + ' ' + last_name + '</span></div><div class="team_name_perm inline_block"><span class="team_member_name" data-title="User E-mail">' + userName + '</span><span class="team_member_perm" data-title="Permission Status">' + dropdown_value_dir_TM + '</span><div class="ajax_loader_dropdown_TM_member"></div></div><div class="team_modified_edit inline_block "><span class="team_member_modified" data-title="Date Modified">' + today_date + '</span><span class="edit_team_permission_TM relative"><paper-ripple fit></paper-ripple>Edit</span></div></div>');
                                                $('.ajax_loader_TM').hide();
                                                $('#new_username_TM_member').val('');
                                                $('.total_teamMembers').html($('.team_member_row_container').length);
                                            }
                                        },
                                        error: function(xhr)
                                        { // if error occured
                                            $('#new_username_TM_member').val('');
                                            $('.ajax_loader_TM').hide();
                                        }
                                    });
                                },
                                error: function(xhr)
                                { // if error occured
                                    $('#new_username_TM_member').val('');
                                    $('.ajax_loader_TM').hide();
                                }
                            });
                        }
                    }    
                }
			});

			$('.main_container').on('click', '.edit_team_permission_TM', function()
			{
				$(this).parent().parent().find('.permission_dropdown_TM').prop("disabled", false);
				$(this).parent().parent().find('.permission_dropdown_TM').removeClass("permission_dropdown_disabled_TM");
			});


			$('.main_container').on('change', '.permission_dropdown_TM', function()
			{
				$(this).parent().parent().find('.ajax_loader_dropdown_TM_member').show();

				if ($(this).val().trim() == "Project Admin")
				{
					$(this).removeClass('manager_button').removeClass('member_button').removeClass('none_button').addClass('admin_button');
				}
				else if ($(this).val().trim() == "Project Team Member")
				{
					$(this).removeClass('manager_button').removeClass('admin_button').removeClass('none_button').addClass('member_button');
				}
				else if ($(this).val().trim() == "Project Team Manager")
				{
					$(this).removeClass('admin_button').removeClass('member_button').removeClass('none_button').addClass('manager_button');
				}
				else if ($(this).val().trim() == "None")
				{
					$(this).removeClass('manager_button').removeClass('member_button').removeClass('admin_button').addClass('none_button');
				}

				var admin_present = false;

				if (($(this).val()).trim() == "None" || ($(this).val()).trim() == "Project Team Member" || ($(this).val()).trim() == "Project Team Manager")
				{
					$(".permission_dropdown_TM").each(function(index)
					{
						if ($(this).val().trim() == "Project Admin")
						{
							admin_present = true;
						}
					});
				}
				else
				{
					admin_present = true;
				}

				if (!admin_present)
				{
					alertOnExistProjectTeamMember("Project should have at least one Project Admin.");
					$(this).val("Project Admin");
					$('.ajax_loader_dropdown_TM_member').hide();
					$(this).parent().find('.permission_dropdown_TM').prop("disabled", true);
					$(this).parent().find('.permission_dropdown_TM').addClass("permission_dropdown_disabled_TM");
				}
				else
				{
					var $dropdown_this = $(this).parent().find('.permission_dropdown_TM');
					var TM_data = {
						'user_name': ($(this).parent().parent().find(".team_member_name").html()).trim(),
						'permission_type': ($(this).val()).trim()
					}
					$.ajax(
					{
						url: '/buildings/LEED:' + plaque.LEED + '/addmembertoexception/',
						type: 'PUT',
						data: JSON.stringify(TM_data),
						contentType: 'application/json',
						success: function(response)
						{
							if (response.message == "SUCCESS")
							{
								$('.ajax_loader_dropdown_TM_member').hide();
								$dropdown_this.prop("disabled", true);
								$dropdown_this.addClass("permission_dropdown_disabled_TM");
							}
						},
						error: function(xhr)
						{ // if error occured
							$('.ajax_loader_dropdown_TM_member').hide();
							$(this).parent().find('.permission_dropdown_TM').prop("disabled", true);
							$(this).parent().find('.permission_dropdown_TM').addClass("permission_dropdown_disabled_TM");
						}
					});
				}
			});

		},
		accountDataInfo: function()
		{
            plaqueNav.showStrategiesLoadingMessage('Loading billing information...');
			//Paymetric changes starts
			var DIeCommFrame_url = '/v3/payment/getpaymetricform/LEED:' + plaque.LEED + '/page:' + plaqueNav.getParameterByName('page') + '/';
			$("#DIeCommFrame").attr('data-src', DIeCommFrame_url);
			var DIeCommFrame_iframe = $("#DIeCommFrame");
			DIeCommFrame_iframe.attr("src", DIeCommFrame_iframe.data("src"));
			//Paymetric changes ends

//			NProgress.configure(
//			{
//				ease: 'ease',
//				speed: 500,
//				showSpinner: false
//			});
//			$.blockUI(
//			{
//				message: null,
//				overlayCSS:
//				{
//					backgroundColor: '#fff',
//					opacity: 0.4
//				}
//			});
//			NProgress.start();
//			NProgress.set(0.5);

			$.ajax(
			{
				url: '/payment/getbillinginfo/LEED:' + plaque.LEED + '/',
				async: true,
				success: function(response)
				{
					$('#first_name').val(response.CC_first_name);
					$('#last_name').val(response.CC_last_name);
					$('#card_no').val(response.Cc_number);
					$('#address').val(response.CC_address);
					$('#city').val(response.CC_city);
					$('#code').val(response.CC_po_code);
					$('#display_country').val(response.country_full);
					if (response.CC_state == '' && response.CC_country != '')
					{
						$('#display_state').val('Not applicable');
					}
					else
					{
						$('#display_state').val(response.state_full);
					}
					$('#email').val(response.CC_email);
					$('#phone').val(response.CC_phone);
					getMeterData.payment_mode = response.payment_mode;
					// plaque.getMeterData.payment_mode = "check";

					// $(".pay_mode").prop( "disabled", true );
					// $(".pay_mode").addClass('disabled');
					if (getMeterData.payment_mode == "check")
					{
						$('#check').attr("src", "/static//payment_v3/images/radioFull.png");
						$('#card').attr("src", "/static//payment_v3/images/radioEmpty.png");
						$('#account_exp_row').css('display', 'none');
						$('#account_cvv_row').css('display', 'none');
						$('#cc_row').css('display', 'none');
					}
					else if (getMeterData.payment_mode == "credit")
					{
						$('#check').attr("src", "/static//payment_v3/images/radioEmpty.png");
						$('#card').attr("src", "/static//payment_v3/images/radioFull.png");
					}

//					NProgress.done();
//					$.unblockUI();
                    plaqueNav.removeStrategiesLoadingMessage();

					$.ajax(
					{
						type: "GET",
						url: "/getcountriesstates/"
					}).done(function(data_code)
					{
						countries_states = data_code

						print_country("country1");
						print_state('state1', $("#country1 option:selected").val());
						$("#country1 option").filter(function()
						{

							return $(this).val() == response.CC_country;
						}).attr('selected', true);
						print_state('state1', response.CC_country);
						$('#state1').val(response.CC_state);
					});
					manageNav.account_visibility();
				},
				error: function(xhr)
				{ // if error occured
					NProgress.done();
					$.unblockUI();
					manageNav.account_visibility();
				}
			});
            
      $('.main_container').on('click', '.pay_mode', function(){
            
            if($(this).attr("value")=="card")
            {
                
//              $("#DIeCommFrame").contents().find(".DataIntercept").css('background', 'white');
                
              $('#check').removeClass('pay_mode_selected');
              $('#card').addClass('pay_mode_selected');
              $('#check').attr("src", "/static//payment_v3/images/radioEmpty.png");
              $('#card').attr("src", "/static//payment_v3/images/radioFull.png");
              $(".instruction_section_acc").hide();
              $('#DIeCommFrame').css('display', 'block');
              $('#cc').css("font-weight","Bold");
              $('#chq').css("font-weight","normal");
              if ($('.account_submit_button').css('display') == 'block'){
                $('#account_exp_row').show();
                $('#account_cvv_row').show();
              }
//                        $("#DIeCommFrame").contents().find(".DataIntercept").css('margin-left', 71);
                
              var isiPad = navigator.userAgent.match(/iPad|iPhone|iPod/i) != null;
              if(!isiPad)
              {
                  $("#DIeCommFrame").contents().find("#DIContainer").css('background-color', 'white');
              
                  $("#DIeCommFrame").contents().find("#Paymetric_CreditCardNumber").css('width', '27%',  '!important');

                  $("#DIeCommFrame").contents().find(".expiry_date_pay .field_label").css('max-width', 'initial', '!important');
                  $("#DIeCommFrame").contents().find("#Paymetric_CVV").css('width', '11%', '!important');


                  $("#DIeCommFrame").contents().find('.DataInterceptCreditCardNumber .field_label').css('max-width', 'initial', '!important');
                  $("#DIeCommFrame").contents().find('.DataInterceptCVV .field_label').css('max-width', 'initial', '!important');    
              }
            }
            else if($(this).attr("value")=="check")
            {
              $('#card').removeClass('pay_mode_selected');
              $('#check').addClass('pay_mode_selected');
              $('#check').attr("src", "/static//payment_v3/images/radioFull.png");
              $('#card').attr("src", "/static//payment_v3/images/radioEmpty.png");
              $(".instruction_section_acc").show();
              $('#DIeCommFrame').css('display', 'none');
              $('#chq').css("font-weight","Bold");
              $('#cc').css("font-weight","normal");
              if ($('.account_submit_button').css('display') == 'block'){
                $('#account_exp_row').hide();
                $('#account_cvv_row').hide();
              }
            }
          });

          $('.main_container').on('click', '#edit_bill_info', function() {
          $('.confirmation_account').css('display', 'none');
          $('#cc_row').css('display', 'none');
          $('#DIeCommFrame').css('display', 'block');

          $("#DIeCommFrame").contents().find(".credit").each(function (){

            if($(this).attr('name') == "Paymetric_CreditCardNumber")
            {
              $(this).css("border-color", "rgba(204,204,204,1)");
              $(this).prop("disabled", false);
            }
            else if($(this).attr('name') == "Paymetric_CVV")
            {
              $(this).css("border-color", "rgba(204,204,204,1)");
              $(this).prop("disabled", false);
            }
            else if($(this).attr('name') == "month_paymetric")
            {
              $(this).css("border-color", "rgba(204,204,204,1)");
              $(this).prop("disabled", false);
            }
            else if($(this).attr('name') == "year_paymetric")
            {
              $(this).css("border-color", "rgba(204,204,204,1)");
              $(this).prop("disabled", false);
            }
          });


          // $(".pay_mode").prop( "disabled", false );
          // $(".pay_mode").removeClass('disabled');
          $('.show_on_edit').show();

          if ($('.account_submit_button').css('display') == 'none'){
            stored_CC_details = {
                                  "CC_email": $('#email').val(),
                                  "CC_phone": $('#phone').val(),
                                  "Cc_number": $('#card_no').val(),
                                  "CC_address": $('#address').val(),
                                  "CC_city": $('#city').val(),
                                  "CC_state": $('#display_state').val(),
                                  "CC_country": $('#display_country').val(),
                                  "CC_last_name": $('#last_name').val(),
                                  "CC_po_code": $('#code').val(),
                                  "CC_first_name": $('#first_name').val()
                              }
          }

          $("#billinginformation input").on('blur', function()
          {
              if($(this).attr('id') == "first_name" || $(this).attr('id') == "last_name" || $(this).attr('id') == "city")
              {
                  if(String(parseInt($(this).val())) == "NaN" && String($(this).val()).length >= 2)
                  {
                      $(this).css("border-color", "rgba(204,204,204,1)");  
                  }
                  else
                  {   
                      $(this).css("border-color", "rgba(243,54,59,1)");
                  }
              }
              else if ($(this).attr('id') == "code")
              {
                  for(i=0;i<$(this).val().length;i++)
                  {
                      if(String(parseInt($(this).val()[i])) == "NaN")
                      {
                          $(this).css("border-color", "rgba(243,54,59,1)");
                          break;
                      }
                      else
                      {
                          $(this).css("border-color", "rgba(204,204,204,1)");    
                      }
                  } 
              }
              else if ($(this).attr('id') == "email")
              {
                  var regEx = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/igm;
                  if(regEx.test($(this).val()))
                  {
                      $(this).css("border-color", "rgba(204,204,204,1)");     
                  }
                  else
                  {
                      $(this).css("border-color", "rgba(243,54,59,1)");
                  }
              }
              else if ($(this).attr('id') == "phone")
              {
                  var number = $(this).val();
                  if(number.match(/^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/) && ! (number.match(/0{5,}/)))
                  {
                     $(this).css("border-color", "rgba(204,204,204,1)");  
                  }
                  else
                  {
                      $(this).css("border-color", "rgba(243,54,59,1)");
                  }
              }
              else if($(this).attr('id') == "address")
              {
                  if(String($(this).val()).length > 0)
                  {
                      $(this).css("border-color", "rgba(204,204,204,1)");  
                  }
                  else
                  {
                      $(this).css("border-color", "rgba(243,54,59,1)");
                  }
              }
          });

          if ($('#country1').val() == "Select Country" || $('#country1').val() == "") {
            $('#country1').css({"border-color": "#F3363B", 
               "border-width":"1px", 
               "border-style":"solid"});
          }
          else {
            $('#country1').css({"border-color": "#e5e5e5", 
               "border-width":"1px", 
               "border-style":"solid"});
          }

          if ($('#state1').val() == "Select State" || ($('#state1').val() == "" && $('#state1').text() != "Not applicable")) {
            $('#state1').css({"border-color": "#F3363B", 
               "border-width":"1px", 
               "border-style":"solid"});
          }
          else {
            $('#state1').css({"border-color": "#e5e5e5", 
               "border-width":"1px", 
               "border-style":"solid"});
          }

          $("#billinginformation select").on('change', function()
          {
            if ($(this).attr('id') == "country1"){
              if ($(this).val() == "Select Country" || $(this).val() == "") {
                $(this).css({"border-color": "#F3363B", 
                   "border-width":"1px", 
                   "border-style":"solid"});
              }
              else {
                $(this).css({"border-color": "#e5e5e5", 
                   "border-width":"1px", 
                   "border-style":"solid"});
              }

              if ($('#state1').val() == '' && $('#state1').text() != 'Not applicable'){
                $('#state1').css({"border-color": "#F3363B", 
                   "border-width":"1px", 
                   "border-style":"solid"});
              }
              else if ($('#state1').val() == '' && $('#state1').text() == 'Not applicable'){
                $('#state1').css({"border-color": "#e5e5e5", 
                   "border-width":"1px", 
                   "border-style":"solid"});
              }
            }
            else if ($(this).attr('id') == "state1"){
              if ($(this).val() == "Select State" || $(this).val() == "") {
                $(this).css({"border-color": "#F3363B", 
                   "border-width":"1px", 
                   "border-style":"solid"});
              }
              else {
                $(this).css({"border-color": "#e5e5e5", 
                   "border-width":"1px", 
                   "border-style":"solid"});
              }
            }
          });

          if($('.pay_mode#card').attr("src")=="/static//payment_v3/images/radioFull.png"){
            $('#DIeCommFrame').css('display', 'block');
            $(".instruction_section_acc").hide();
          }
          else{
            $('#DIeCommFrame').css('display', 'none');
            $(".instruction_section_acc").show();
          }
          $('#account_country_row').css('display','block');
          $('#account_display_country').css('display','none');
          $('.account_submit_button').css('display','block');
          $('.field_label_cards').css('display','block');

          $('#card_no').val("");

          $('#first_name').prop("disabled", false); // Element(s) are now enabled.
          $('#last_name').prop("disabled", false); // Element(s) are now enabled.
          $('#email').prop("disabled", false); // Element(s) are now enabled.
          $('#card_no').prop("disabled", false); // Element(s) are now enabled.
          $('#month').prop("disabled", false); // Element(s) are now enabled.
          $('#year').prop("disabled", false); // Element(s) are now enabled.
          $('#cvv').prop("disabled", false); // Element(s) are now enabled.
          $('#address').prop("disabled", false); // Element(s) are now enabled.
          $('#city').prop("disabled", false); // Element(s) are now enabled.
          $('#code').prop("disabled", false); // Element(s) are now enabled.
          $('#phone').prop("disabled", false); // Element(s) are now enabled.

          $("#billinginformation input").blur();

          $("#DIeCommFrame").contents().find(".credit").each(function (){

            if($(this).attr('name') == "Paymetric_CreditCardNumber")
            {
              var val = String(parseInt($(this).val()));
              var regEx = /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/;
              if(regEx.test(val) && luhn_check_credit_card(val))
              {
                  $(this).css("border-color", "rgba(204,204,204,1)");   
              }
              else
              {
                  $(this).css("border-color", "rgba(243,54,59,1)");
              }
              val = "";
            }
            else if($(this).attr('name') == "Paymetric_CVV")
            {
              if((!(String(parseInt($(this).val())) == "NaN")) && ( $(this).val().length == 3 ||$(this).val().length == 4))
              {
                  $(this).css("border-color", "rgba(204,204,204,1)"); 
              }
              else
              {   
                  $(this).css("border-color", "rgba(243,54,59,1)");
              }
            }
            else if($(this).attr('name') == "month_paymetric" || $(this).attr('name') == "year_paymetric")
            {
              var months = {January: '01', February: '02',    March: '03', April: '04', May: '05', June: '06',
                        July: '07', August: '08', September: '09',    October: '10',    November: '11',   December: '12'};
              if (!isNaN(parseInt($('#DIeCommFrame').contents().find('#year option:selected').text()))) {
                if ( parseInt($('#DIeCommFrame').contents().find('#year option:selected').text()) > (new Date()).getFullYear() ) {
                  $('#DIeCommFrame').contents().find('#year').css("border-color", "rgba(204,204,204,1)");
                  $('#DIeCommFrame').contents().find('#month').css("border-color", "rgba(204,204,204,1)");
                }
                else if ( parseInt($('#DIeCommFrame').contents().find('#year option:selected').text()) < (new Date()).getFullYear() ){
                  $('#DIeCommFrame').contents().find('#year').css("border-color", "rgba(243,54,59,1)");
                  $('#DIeCommFrame').contents().find('#month').css("border-color", "rgba(243,54,59,1)");
                }
                else {
                  $('#DIeCommFrame').contents().find('#year').css("border-color", "rgba(204,204,204,1)");
                  if ( (parseInt(months[$('#DIeCommFrame').contents().find('#month').val()]) >= (new Date()).getMonth()+1) ) {
                    $('#DIeCommFrame').contents().find('#month').css("border-color", "rgba(204,204,204,1)");
                  }
                  else {
                    $('#DIeCommFrame').contents().find('#month').css("border-color", "rgba(243,54,59,1)");
                  }
                }
              }
            }
          });

        });


        $('.main_container').on('click', '.account_cancel_btn', function() 
        {
          $('.confirmation_account').css('display', 'none');
          $('#DIeCommFrame').css('display', 'none');
          if($('.pay_mode#card').attr("src")=="/static//payment_v3/images/radioFull.png"){
            $('#cc_row').css('display', 'block');
          }
          else{
            $('#cc_row').css('display', 'none');
          }

          // $(".pay_mode").prop( "disabled", true );
          // $(".pay_mode").addClass('disabled');

          $('.show_on_edit').hide();

            $("#billinginformation input").each(function(index)
            {
                  $(this).css("border-color", "rgba(204,204,204,1)");
            });

            $("#DIeCommFrame").contents().find(".credit").each(function (){

              if($(this).attr('name') == "Paymetric_CreditCardNumber")
              {
                $(this).css("border-color", "rgba(204,204,204,1)");
                $(this).prop("disabled", true);
              }
              else if($(this).attr('name') == "Paymetric_CVV")
              {
                $(this).css("border-color", "rgba(204,204,204,1)");
                $(this).prop("disabled", true);
              }
              else if($(this).attr('name') == "month_paymetric")
              {
                $(this).css("border-color", "rgba(204,204,204,1)");
                $(this).prop("disabled", true);
              }
              else if($(this).attr('name') == "year_paymetric")
              {
                $(this).css("border-color", "rgba(204,204,204,1)");
                $(this).prop("disabled", true);
              }
            });

            $('#first_name').val(stored_CC_details.CC_first_name);
            $('#last_name').val(stored_CC_details.CC_last_name);
            $('#card_no').val(stored_CC_details.Cc_number);
            $('#address').val(stored_CC_details.CC_address);
            $('#city').val(stored_CC_details.CC_city);
            $('#code').val(stored_CC_details.CC_po_code);
            $('#display_country').val(stored_CC_details.CC_country);
            $('#display_state').val(stored_CC_details.CC_state);
            $('#email').val(stored_CC_details.CC_email);
            $('#phone').val(stored_CC_details.CC_phone);

            //On cancel change the css
            $('#account_country_row').css('display','none');
            $('#account_display_country').css('display','block');
            $('.account_submit_button').css('display','none');
            $('.field_label_cards').css('display','none');
            $('#first_name').prop("disabled", true);
            $('#last_name').prop("disabled", true);
            $('#email').prop("disabled", true);
            $('#card_no').prop("disabled", true);
            $('#address').prop("disabled", true);
            $('#city').prop("disabled", true);
            $('#code').prop("disabled", true);
            $('#phone').prop("disabled", true);
        });

        $('.main_container').on('click', '.account_sub_btn', function() 
        {

            $('iframe#DIeCommFrame').load(function(){

              if((this.contentWindow.location.href).indexOf("paynow") > -1){
                paymetric_url = this.contentWindow.location.href.split("/?&r=")
                var paymetricFlag = false;
                submit_edited_details(paymetricFlag, paymetric_url[1]);
              }
            });

            $('.pay_mode').each(function(index){
              if ($(this).attr('src').indexOf('radioFull.png')>-1){
                payment_mode = $(this).attr('value');
                if (payment_mode == "card"){
                  payment_mode = "credit";
                }
              }
            });

            var check_input  = true;
            var check_select = true;

            if (payment_mode == ""){
              check_input  = false;
              check_select = false;
            }

            $("#billinginformation input").each(function(index)
            {
              if(payment_mode == "credit" && ($(this).attr('id') == "first_name" || $(this).attr('id') == "last_name" || $(this).attr('id') == "city" || $(this).attr('id') == "code" || $(this).attr('id') == "email" || $(this).attr('id') == "phone" || $(this).attr('id') == "address"))
              {
                if($(this).css('border-right-color') == "rgb(243, 54, 59)")
                {
                    check_input = false;
                }
              }
              else if (payment_mode == "check" && ($(this).attr('id') == "first_name" || $(this).attr('id') == "last_name" || $(this).attr('id') == "city" || $(this).attr('id') == "code" || $(this).attr('id') == "email" || $(this).attr('id') == "phone" || $(this).attr('id') == "address")) {
                if($(this).css('border-right-color') == "rgb(243, 54, 59)")
                {
                    check_input = false;
                }
              }

            });


        if (payment_mode == "credit"){
          $("#DIeCommFrame").contents().find(".credit").each(function (){

                if($(this).attr('name') == "Paymetric_CreditCardNumber")
                {
                  if($(this).css('border-right-color') == "rgb(243, 54, 59)")
                  {
                      check_input = false;
                  }
                }
                else if($(this).attr('name') == "Paymetric_CVV")
                {
                  if($(this).css('border-right-color') == "rgb(243, 54, 59)")
                  {
                      check_input = false;
                  }
                }
                else if($(this).attr('name') == "month_paymetric")
                {
                  if($(this).css('border-right-color') == "rgb(243, 54, 59)")
                  {
                      check_input = false;
                  }
                }
                else if($(this).attr('name') == "year_paymetric")
                {
                  if($(this).css('border-right-color') == "rgb(243, 54, 59)")
                  {
                      check_input = false;
                  }
                }
          });
        }


            $("#billinginformation select").each(function(index)
            {
              if($(this).attr('id') == "state1"|| $(this).attr('id') == "country1")
              {
                if($(this).css('border-right-color') == "rgb(243, 54, 59)")
                {
                    check_select = false;
                }
              }
            });    

            if(check_input==false || check_select==false)
            {
                //Do Nothing
            }
            else if(check_input && check_select)
            {
              var paymetricFlag = true;
              if (payment_mode == "credit"){
                submit_edited_details(paymetricFlag, "");
              }
              else if (payment_mode == "check"){
                paymetricFlag = false;
                submit_edited_details(paymetricFlag, "");
              }
              else{
                return;
              }
            }
        });
  
  $.ajax({ 
      url: '/payment/getbillinghistory/LEED:' + plaque.LEED + '/', 
      async: true, 
      success: function(response) {

        $.each( response ,function (index, item) {

          var months = ["January", "February", "March" , "April", "May", "June", "July", "August", "September", "October", "November", "December"];  

          var date = months[((item.column_data.payment_date).split(" ")[0]).split("-").reverse()[1] - 1] + ' ' + ((item.column_data.payment_date).split(" ")[0]).split("-").reverse()[0] + ',' + ((item.column_data.payment_date).split(" ")[0]).split("-").reverse()[2];

          $('#historyTableBody').append('<tr><td data-title="Date">' + date + '</td> <td data-title="ID">' + item.sap_order_id + '</td> <td data-title="Total">' + '$'+ (item.column_data.amount_paid + '').replace(/(\d)(?=(\d{3})+$)/g, '$1,') + '</td> <td  class="paymentStatus" data-popover="true" data-html=true data-toggle="popover" data-placement="right" data-content="Payment under processing..." >' + item.column_data.payment_status + '</td><td data-title="Details" class="billing_history_details"><i class="fa fa-search details_account_section"></i></span>View</td></tr>');

          if(item.column_data.payment_status == "Pending")
          {
            $("#historyTableBody").find(".paymentStatus").css("color" , "red");

            var $help_text = $('.paymentStatus');
            $help_text.data('state', 'hover');

            var enterShow = function () {
              if ($help_text.data('state') === 'hover') {
                $help_text.popover('show');
              }
            };
            var exitHide = function () {
              if ($help_text.data('state') === 'hover') {
                $help_text.popover('hide');
              }
            };

            $help_text.popover({trigger: 'manual'})
              .on('mouseenter', enterShow)
              .on('mouseleave', exitHide);

          }
        });

				$('.main_container').on('click', '.billing_history_details', function()
				{
					if (!touchDevice())
					{
						NProgress.configure(
						{
							ease: 'ease',
							speed: 500,
							showSpinner: false
						});
						$.blockUI(
						{
							message: null,
							overlayCSS:
							{
								backgroundColor: '#fff',
								opacity: 0.4
							}
						});
						NProgress.start();
						NProgress.set(0.5);
					}
					sap_order_id = $(this).parent().find("[data-title='ID']").html();

					$.ajax(
					{
						url: '/payment/getpaymentdetailusingsap/LEED:' + plaque.LEED + '/ID:' + sap_order_id + '/',
						type: 'GET',
						success: function(response)
						{
							if (response.message == "SUCCESS")
							{
								manageNav.generateReceipt(response);
								if (!touchDevice())
								{
									NProgress.done();
									$.unblockUI();
								}
								$('#view_bill_modal').modal('toggle');
								manageNav.set_href_download(sap_order_id);
							}
							else if (response.message == "NOT_FOUND" || response.message == "BAD_REQUEST")
							{
								if (!touchDevice())
								{
									NProgress.done();
									$.unblockUI();
								}
								// display_error_only_text("There was an error occurred while fetching details.");
							}
						},
						error: function(xhr, textStatus, thrownError)
						{
							if (!touchDevice())
							{
								NProgress.done();
								$.unblockUI();
							}
							// display_error_only_text("There was an error occurred while fetching details.");
						}
					});
				});



                }
              });
            
		},
        userAgreement: function()
        {
            plaqueNav.showStrategiesLoadingMessage('Loading account data...');
            $('body').on('click', '#plan_or_team', function() {
                
                if($(this).html().substr(0,3) == 'ADD')
                {
                    $('.manage_category[category-type=team]').click();        
                }
                else
                {
                    $('#select_plan_from_notification').click();    
                }
                
              });

//              $('body').on('click', '#plan_selection', function() 
//              {
//                  window.location.href ="/dashboard/?page=account&section=planSelection&LEED=" + plaque.LEED;
//              });

//              $('body').on('click', '#building_setup', function() 
//              {
//                  window.location.href ="/dashboard/?page=data_input&LEED=" + plaque.LEED;
//              });
            
            $.ajax(
            {
                url: '/payment/getagreementinfo/LEED:' + plaque.LEED + '/',
                async: true,
                success: function(response)
                {
                    $.each(response, function(index, item)
                    {
                        if (item.column_data.status == 'Voided')
                        {
                            $('#agreementTableBody').append('<tr><td data-title="Owner Name" value=' + item.agreement_id + '>' + (item.column_data.owner_name) + '</td> <td data-title="Owner E-mail">' + item.column_data.owner_email + '</td> <td data-title="Date Signed">' + ((item.column_data.date_signed).split(" ")[0]).split("-").reverse().join("-") + '</td><td class="agreementStatus_frontend" data-title="Status">' + item.column_data.status + '</td><td data-title="Details" class=""></td></tr>');
                        }
                        else if (item.column_data.status == 'Completed')
                        {
                            $('#agreementTableBody').append('<tr><td data-title="Owner Name" value=' + item.agreement_id + '>' + (item.column_data.owner_name) + '</td> <td data-title="Owner E-mail">' + item.column_data.owner_email + '</td> <td data-title="Date Signed">' + ((item.column_data.date_signed).split(" ")[0]).split("-").reverse().join("-") + '</td><td data-title="Status">' + item.column_data.status + '</td><td data-title="Details" class="user_agreement_details"><i class="fa fa-download details_account_section"></i></span> Download</td></tr>');
                        }
                    });
                    $("#agreementTableBody").find(".agreementStatus_frontend").css("color", "red");

				$('.main_container').on('click', '.user_agreement_details', function()
				{
					agreement_id = $(this).parent().find("[data-title='Owner Name']").attr("value");
					manageNav.set_href_agreement_download(agreement_id);
				});

                }
            }); 
            
            $.ajax(
            {
                url: '/payment/getpaymentdetail/LEED:' + plaque.LEED + '/',
                type: 'GET',
                success: function(response)
                {
                    if (response.message == "NOT_FOUND")
                    {
                        $.ajax(
                        {
                            url: '/buildings/LEED:' + plaque.LEED + '/',
                            type: 'GET',
                            contentType: 'application/json',
                            success: function(response)
                            {
                                var one_day = 1000 * 60 * 60 * 24;
                                var today_date_time = new Date();
                                var expiry_date_time = new Date(response.trial_expire_date);
                                var trial_time_left = expiry_date_time - today_date_time;
                                var trial_time_days = Math.round(trial_time_left / one_day);
                                var trial_time_days_string = "";
                                if (trial_time_days <= 1)
                                {
                                    trial_time_days_string = String(trial_time_days) + " day";
                                }
                                else
                                {
                                    trial_time_days_string = String(trial_time_days) + " days";
                                }
                                
                                if(trial_time_days <= 0)
                                {
                                    trial_text = "Your trial has expired. Looks like you haven't selected a plan yet. Ready to get started?";    
                                }
                                else
                                {
                                    trial_text = "Your trial expires in <span id='trialDays'></span>. Looks like you haven't selected a plan yet.<br> Ready to get started?";   
                                }
                                
                                $('#trialDays').html(trial_time_days_string);
                                manageNav.account_visibility();
                                
                                $('#planSummary').show();
                                $('#planSummary').html(trial_text);
                                plaqueNav.removeStrategiesLoadingMessage();
                            }
                        });
//                        $('#planSummary').addClass('centered');
                        $('#plan_or_team').html('SELECT A PLAN >');
                        $('#plan_or_team').addClass('btnBlue');
                        $('#plan_or_team').removeClass('btnGreen');
                    }
                    else if (response.message == 'SUCCESS')
                    {
						            plaqueNav.removeStrategiesLoadingMessage();
                        $('#planSummary').removeClass('centered');
                        $('#plan_or_team').html('ADD YOUR TEAM >');
                        $('#plan_or_team').removeClass('btnBlue');
                        $('#plan_or_team').addClass('btnGreen');

                        $('#planSummary').show();
                        $('#swYear').html(response.term_com);
                        if (response.paid_full == true)
                            $('.swPay').html('Full');
                        else
                            $('.swPay').html('Installments');

                        if (response.purchase_plaque == true)
                            $('.hwPay').html('Full');
                        else
                            $('.hwPay').html('Installments');

                        if (response.leed_plaque == false)
                        {
                            $('.hwSubs').hide();
                            $('.planSelButton').css('margin-top', '0%');
                        }
                    }
                }
            });
            
        },
        connectedApps: function(){
            
          $('.app_card.installed .app_button').mouseenter(function()
          {
            $(this).html('Remove');      
          });
          
          $('.app_card.installed .app_button').mouseleave(function()
          {
            $(this).html('Installed');        
          });

          $.ajax(
          {
            url: "/functionalityflags/",
            type: 'GET',
            contentType: 'application/json'
          }).done(function(settings_data)
          {
            if (settings_data.ACTIVATE_SCORECARD){
              $('#manage_expand_scorecard').parent().parent().parent().parent().show();
            }
            else{
              $('#manage_expand_scorecard').parent().parent().parent().parent().remove();
            }

            if (settings_data.ACTIVATE_ELEMENTS_IN_NEW_UI){
              $('#manage_expand_elements').parent().parent().parent().parent().show();
            }
            else{
              $('#manage_expand_elements').parent().parent().parent().parent().remove();
            }

            if (settings_data.ACTIVATE_BASIC_ANALYSIS){
              $('#manage_expand_analysis').parent().parent().parent().parent().show();
            }
            else{
              $('#manage_expand_analysis').parent().parent().parent().parent().remove();
            }

            if (settings_data.ACTIVATE_ACP_ANALYSIS){
              $('#member_expand_ACP').parent().parent().parent().parent().show();
            }
            else{
              $('#member_expand_ACP').parent().parent().parent().parent().remove();
            }

            if (settings_data.ACTIVATE_EXPLORE_IN_NEW_UI){
              $('#manage_expand_explore').parent().parent().parent().parent().show();
            }
            else{
              $('#manage_expand_explore').parent().parent().parent().parent().remove();
            }

          });

          if (ACTIVATE_SCORECARD == "True"){
//            $('#checkbox-scorecard').prop('checked', true);
              $('.app_card[app=ACTIVATE_SCORECARD]').addClass('installed');
              $('.app_card[app=ACTIVATE_SCORECARD]').attr("status", ACTIVATE_SCORECARD);
              $('.app_card[app=ACTIVATE_SCORECARD] .app_button').html("Installed");
          }
          else{
//            $('#checkbox-scorecard').prop('checked', false);
              $('.app_card[app=ACTIVATE_SCORECARD]').removeClass('installed');
              $('.app_card[app=ACTIVATE_SCORECARD]').attr("status", ACTIVATE_SCORECARD);
              $('.app_card[app=ACTIVATE_SCORECARD] .app_button').html("Install");
          }

          if (ACTIVATE_ELEMENTS_IN_NEW_UI == "True"){
            $('#checkbox-elements').prop('checked', true);
              $('.app_card[app=ACTIVATE_ELEMENTS_IN_NEW_UI]').addClass('installed');
              $('.app_card[app=ACTIVATE_ELEMENTS_IN_NEW_UI]').attr("status", ACTIVATE_ELEMENTS_IN_NEW_UI);
              $('.app_card[app=ACTIVATE_ELEMENTS_IN_NEW_UI] .app_button').html("Installed");
          }
          else{
            $('#checkbox-elements').prop('checked', false);
              $('.app_card[app=ACTIVATE_ELEMENTS_IN_NEW_UI]').removeClass('installed');
              $('.app_card[app=ACTIVATE_ELEMENTS_IN_NEW_UI]').attr("status", ACTIVATE_ELEMENTS_IN_NEW_UI);
              $('.app_card[app=ACTIVATE_ELEMENTS_IN_NEW_UI] .app_button').html("Install");
          }

          if (ACTIVATE_BASIC_ANALYSIS == "True"){
            $('#checkbox-analysis').prop('checked', true);
              $('.app_card[app=ACTIVATE_BASIC_ANALYSIS]').addClass('installed');
              $('.app_card[app=ACTIVATE_BASIC_ANALYSIS]').attr("status", ACTIVATE_BASIC_ANALYSIS);
              $('.app_card[app=ACTIVATE_BASIC_ANALYSIS] .app_button').html("Installed");
          }
          else{
            $('#checkbox-analysis').prop('checked', false);
              $('.app_card[app=ACTIVATE_BASIC_ANALYSIS]').removeClass('installed');
              $('.app_card[app=ACTIVATE_BASIC_ANALYSIS]').attr("status", ACTIVATE_BASIC_ANALYSIS);
              $('.app_card[app=ACTIVATE_BASIC_ANALYSIS] .app_button').html("Install");
          }

          if (ACTIVATE_ACP_ANALYSIS == "True"){
            $('#checkbox-ACP').prop('checked', true);
              $('.app_card[app=ACTIVATE_ACP_ANALYSIS]').addClass('installed');
              $('.app_card[app=ACTIVATE_ACP_ANALYSIS]').attr("status", ACTIVATE_ACP_ANALYSIS);
              $('.app_card[app=ACTIVATE_ACP_ANALYSIS] .app_button').html("Installed");
          }
          else{
            $('#checkbox-ACP').prop('checked', false);
              $('.app_card[app=ACTIVATE_ACP_ANALYSIS]').removeClass('installed');
              $('.app_card[app=ACTIVATE_ACP_ANALYSIS]').attr("status", ACTIVATE_ACP_ANALYSIS);
              $('.app_card[app=ACTIVATE_ACP_ANALYSIS] .app_button').html("Install");
          }

          if (ACTIVATE_EXPLORE_IN_NEW_UI == "True"){
            $('#checkbox-explore').prop('checked', true);
              $('.app_card[app=ACTIVATE_EXPLORE_IN_NEW_UI]').addClass('installed');
              $('.app_card[app=ACTIVATE_EXPLORE_IN_NEW_UI]').attr("status", ACTIVATE_EXPLORE_IN_NEW_UI);
              $('.app_card[app=ACTIVATE_EXPLORE_IN_NEW_UI] .app_button').html("Installed");
          }
          else{
            $('#checkbox-explore').prop('checked', false);
              $('.app_card[app=ACTIVATE_EXPLORE_IN_NEW_UI]').removeClass('installed');
              $('.app_card[app=ACTIVATE_EXPLORE_IN_NEW_UI]').attr("status", ACTIVATE_EXPLORE_IN_NEW_UI);
              $('.app_card[app=ACTIVATE_EXPLORE_IN_NEW_UI] .app_button').html("Install");
          }
            
            $('.app_card.installed .app_button').on('hover', function()
            {
                $(this).html("Remove");        
            });
            
            $('.app_button').on('click', function()
            {
                app = $(this).parent().attr('app');
                app_status = $(this).parent().attr('status');
                if(app == "ACTIVATE_SCORECARD")
                {
                    if (app_status != "True")
                    {
                        manageNav.func_flag_data_for_put = {"ACTIVATE_SCORECARD": true};
                        ACTIVATE_SCORECARD = "True"; 
                        $(this).parent().attr('status', "True");
                        $(this).parent().addClass('installed');
                        $(this).html("Installed");
                    }
                    else
                    {
                        manageNav.func_flag_data_for_put = {"ACTIVATE_SCORECARD": false};
                        ACTIVATE_SCORECARD = "False";  
                        $(this).parent().attr('status', "False");
                        $(this).parent().removeClass('installed');
                        $(this).html("Install");
                    }    
                }
                
                if(app == "ACTIVATE_ELEMENTS_IN_NEW_UI")
                {
                    if (app_status != "True")
                    {
                        manageNav.func_flag_data_for_put = {"ACTIVATE_ELEMENTS_IN_NEW_UI": true};
                        ACTIVATE_ELEMENTS_IN_NEW_UI = "True"; 
                        $(this).parent().attr('status', "True");
                        $(this).parent().addClass('installed');
                        $(this).html("Installed");
                    }
                    else
                    {
                        manageNav.func_flag_data_for_put = {"ACTIVATE_ELEMENTS_IN_NEW_UI": false};
                        ACTIVATE_ELEMENTS_IN_NEW_UI = "False";  
                        $(this).parent().attr('status', "False");
                        $(this).parent().removeClass('installed');
                        $(this).html("Install");
                    }    
                }
                
                if(app == "ACTIVATE_BASIC_ANALYSIS")
                {
                    if (app_status != "True")
                    {
                        manageNav.func_flag_data_for_put = {"ACTIVATE_BASIC_ANALYSIS": true};
                        ACTIVATE_BASIC_ANALYSIS = "True"; 
                        $(this).parent().attr('status', "True");
                        $(this).parent().addClass('installed');
                        $(this).html("Installed");
                    }
                    else
                    {
                        manageNav.func_flag_data_for_put = {"ACTIVATE_BASIC_ANALYSIS": false};
                        ACTIVATE_BASIC_ANALYSIS = "False";  
                        $(this).parent().attr('status', "False");
                        $(this).parent().removeClass('installed');
                        $(this).html("Install");
                    }    
                }
                
                if(app == "ACTIVATE_ACP_ANALYSIS")
                {
                    if (app_status != "True")
                    {
                        manageNav.func_flag_data_for_put = {"ACTIVATE_ACP_ANALYSIS": true};
                        ACTIVATE_ACP_ANALYSIS = "True"; 
                        $(this).parent().attr('status', "True");
                        $(this).parent().addClass('installed');
                        $(this).html("Installed");
                    }
                    else
                    {
                        manageNav.func_flag_data_for_put = {"ACTIVATE_ACP_ANALYSIS": false};
                        ACTIVATE_ACP_ANALYSIS = "False";  
                        $(this).parent().attr('status', "False");
                        $(this).parent().removeClass('installed');
                        $(this).html("Install");
                    }    
                }
                
                if(app == "ACTIVATE_EXPLORE_IN_NEW_UI")
                {
                    if (app_status != "True")
                    {
                        manageNav.func_flag_data_for_put = {"ACTIVATE_EXPLORE_IN_NEW_UI": true};
                        ACTIVATE_EXPLORE_IN_NEW_UI = "True"; 
                        $(this).parent().attr('status', "True");
                        $(this).parent().addClass('installed');
                        $(this).html("Installed");
                    }
                    else
                    {
                        manageNav.func_flag_data_for_put = {"ACTIVATE_EXPLORE_IN_NEW_UI": false};
                        ACTIVATE_EXPLORE_IN_NEW_UI = "False";  
                        $(this).parent().attr('status', "False");
                        $(this).parent().removeClass('installed');
                        $(this).html("Install");
                    }    
                }
                $.ajax({
                  type: "PUT",
                  contentType: 'application/json',
                  data: JSON.stringify(manageNav.func_flag_data_for_put),
                  url: "/buildings/LEED:" + plaque.LEED + "/functionalityflags/"
                }).done(function(result_data) 
                {
                  
                });
            });

          $(".manage-connected-app-button").change(function() {

                if ( $(this).attr('id') == "checkbox-scorecard"){
                  if(this.checked) {
                    manageNav.func_flag_data_for_put = {"ACTIVATE_SCORECARD": true};
                    ACTIVATE_SCORECARD = "True";
                  }
                  else{
                      manageNav.func_flag_data_for_put = {"ACTIVATE_SCORECARD": false};
                      ACTIVATE_SCORECARD = "False";
                  }
                }
                else if( $(this).attr('id') == "checkbox-elements"){
                  if(this.checked) {
                    manageNav.func_flag_data_for_put = {"ACTIVATE_ELEMENTS_IN_NEW_UI": true, "ACTIVATE_ELEMENTS_IN_OLD_UI": true};
                    ACTIVATE_ELEMENTS_IN_NEW_UI = "True";
                    ACTIVATE_ELEMENTS_IN_OLD_UI = "True";
                  }
                  else{
                    manageNav.func_flag_data_for_put = {"ACTIVATE_ELEMENTS_IN_NEW_UI": false, "ACTIVATE_ELEMENTS_IN_OLD_UI": false};
                    ACTIVATE_ELEMENTS_IN_NEW_UI = "False";
                    ACTIVATE_ELEMENTS_IN_OLD_UI = "False";
                  }
                }
                else if( $(this).attr('id') == "checkbox-analysis"){
                  if(this.checked) {
                    manageNav.func_flag_data_for_put = {"ACTIVATE_BASIC_ANALYSIS": true};
                    ACTIVATE_BASIC_ANALYSIS = "True";
                  }
                  else{
                    manageNav.func_flag_data_for_put = {"ACTIVATE_BASIC_ANALYSIS": false};
                    ACTIVATE_BASIC_ANALYSIS = "False";
                  }
                }
                else if( $(this).attr('id') == "checkbox-ACP"){
                  if(this.checked) {
                    manageNav.func_flag_data_for_put = {"ACTIVATE_ACP_ANALYSIS": true};
                    ACTIVATE_ACP_ANALYSIS = "True";
                  }
                  else{
                    manageNav.func_flag_data_for_put = {"ACTIVATE_ACP_ANALYSIS": false};
                    ACTIVATE_ACP_ANALYSIS = "False";
                  }
                }
                else if( $(this).attr('id') == "checkbox-explore"){
                  if(this.checked) {
                    manageNav.func_flag_data_for_put = {"ACTIVATE_EXPLORE_IN_NEW_UI": true};
                    ACTIVATE_EXPLORE_IN_NEW_UI = "True";
                  }
                  else{
                    manageNav.func_flag_data_for_put = {"ACTIVATE_EXPLORE_IN_NEW_UI": false};
                    ACTIVATE_EXPLORE_IN_NEW_UI = "False";
                  }
                }
              
//              if(ACTIVATE_EXPLORE_IN_NEW_UI == "True" && ACTIVATE_SCORECARD == "False")
//              {
//                $('.navigation-tab[data-page=strategy_input]').show();  
//                $('.navigation-tab[data-page=data_scorecard]').hide(); 
//              }
//              else if(ACTIVATE_SCORECARD == "True" && ACTIVATE_EXPLORE_IN_NEW_UI == "False")
//              {
//                $('.navigation-tab[data-page=data_scorecard]').show(); 
//                $('.navigation-tab[data-page=strategy_input]').hide();    
//              }

                $.ajax({
                  type: "PUT",
                  contentType: 'application/json',
                  data: JSON.stringify(manageNav.func_flag_data_for_put),
                  url: "/buildings/LEED:" + plaque.LEED + "/functionalityflags/"
                }).done(function(result_data) {
                  if (Object.keys(manageNav.func_flag_data_for_put)[0] == "ACTIVATE_EXPLORE_IN_NEW_UI") {
                    if (manageNav.func_flag_data_for_put[Object.keys(manageNav.func_flag_data_for_put)[0]]){
                      $('.nav_item.explore_nav').show();
                    }
                    else{
                      $('.nav_item.explore_nav').hide();
                    }
                  }
                  else if (Object.keys(manageNav.func_flag_data_for_put)[0] == "ACTIVATE_ACP_ANALYSIS") {
                    if (manageNav.func_flag_data_for_put[Object.keys(manageNav.func_flag_data_for_put)[0]]){
                      $('#building_per_data_link').show();
                    }
                    else{
                      $('#building_per_data_link').hide();
                    }
                  }
      
                });
            });

        }
    };
    $( document ).ready(function() 
    {
        
    });
}).call(this);
