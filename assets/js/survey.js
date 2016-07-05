
(function() {
  plaque.survey = {
    error_text : "Please provide valid input inside '",
    error_fields : [],
    error_fields_name : [],
    initsurvey: function() {
      $( "#slider_jquery" ).slider({
        min: 0,
        max: 10,
        value: 5,
        step: 1,
        slide: function( event, ui ) {
          $('.smiley').css({
            'background-position': -(ui.value * 100) + 'px 0px'
          });
          plaque.survey.checkSlider(ui.value);
        }
      });

      $('.were_sorry .checkboxes input[type="checkbox"] + label span').on("click", function(){
          if ($(this).css('background-position') == '0% 0%'){
            $(this).css('background-position', '100% 0%');
          }
          else{
            $(this).css('background-position', '0% 0%');
          }
      });

      plaque.survey.instance = String(Math.random());

      return $('.survey_main').on('submit', 'form', function() {
          var $form, environment_json, transit_json, type;
          $('.submit_button button').css('background', 'linear-gradient(to bottom, #3bb34a 0%, #019146 100%)');
          if (plaqueNav.getParameterByName('language') == 'fr') {
            $('#survey_submit_txt').text('Soumission...');
          } else {
            $('#survey_submit_txt').text('Submitting...');
          }
          $('.survey_main #survey_submit').prop('disabled','true');

          $form = $(this);
          type = $form.data('type');
          if (type === 'survey') {
              if (plaqueNav.getParameterByName('language') == 'fr'){
                lan = "French";
              }
              else{
                lan = "English";
              }                  
            transit_json = {
              "instance": plaque.survey.instance,
              "response_method": "web",
              "routes": [],
              "tenant_name":$('#tenant_name').val(),
              "language": lan
            };
            $('.route-box').each(function() {
              var inputs_count, newObj;
              var unit = $(this).find('.dist_select').val();
              newObj = {};
              inputs_count = $(this).find('.distance input').length;
              return $(this).find('.distance input').each(function(i) {
                var mode, value;
                mode = $(this).attr('name');
                value = $(this).val();
                  
                  if(unit == "Kilometers")
                      value = value * 0.62;
                  
                mode = mode.replace(/-route.*$/, '');
                if (value !== '') {
                  newObj[mode] = value;
                }
                if (inputs_count === i + 1) {
                  return transit_json.routes.push(newObj);
                }
              });
            });
            $.ajax({
              url: '/buildings/LEED:' + plaque.LEED + '/survey/transit/?recompute_score=1',
              type: 'POST',
              contentType: 'application/json',
              data: JSON.stringify(transit_json)
            }).done(function(data_response) {
                
              $('#survey_modal_window').modal('show');
              $('.survey_main #survey_submit').prop('disabled','false');
              $('.survey_continue').removeClass('survey_faliure').addClass('survey_success');
              if (data_response.result === "CONFLICT_ENTRY") {
                if (plaqueNav.getParameterByName('language') == 'fr') {
                  $('.survey_continue').text("D'accord");
                  $('#survey_submit_txt').text('Soumettre');
                  return $('.confirmation').addClass('error').text('Désolé, vous avez déjà pris cette enquête.').show();
                }
                else{
                  $('.survey_continue').text("OK");
                  $('#survey_submit_txt').text('Submit');
                  return $('.confirmation').addClass('error').text('Sorry, You have already taken this survey.').show();
                }
              }
              else {
                if (plaqueNav.getParameterByName('language') == 'fr') {
                  $('.survey_continue').text("D'accord");
                  return $('.confirmation').removeClass('error').text("Merci d'avoir pris le temps de compléter ce sondage.").show();
                }
                else{
                  $('.survey_continue').text("OK");
                  return $('.confirmation').removeClass('error').text('Thank you for taking the time.').show();
                }
              }
            }).fail(function() {
              $('#survey_modal_window').modal('show');
              $('.survey_main #survey_submit').prop('disabled','');
              $('.survey_continue').removeClass('survey_success').addClass('survey_faliure');
              if (plaqueNav.getParameterByName('language') == 'fr') {
                $('.survey_continue').text("D'accord");
                $('#survey_submit_txt').text('Soumettre');
                return $('.confirmation').addClass('error').text("Désolé , votre réponse n'a pas présenté pour une raison quelconque . Veuillez réessayer.").show();
              }
              else{
                $('.survey_continue').text("OK");
                $('#survey_submit_txt').text('Submit');
                return $('.confirmation').addClass('error').text('Sorry, your response has failed to submit for some reason. Please try again.').show();
              }
            });
            environment_json = {
              "instance": plaque.survey.instance,
              "response_method": "web",
              "location": $('#location_field').val().trim(),
              "complaints": [],
              "tenant_name":$('#tenant_name').val(),
              "language": lan
            };
            environment_json.satisfaction = parseInt($('#slider_jquery').slider("option", "value"), 10);
            if (environment_json.satisfaction < 5) {
              environment_json.other_complaint = $("#other").val();
              $('.were_sorry input[type=checkbox]:checked').each(function(i) {
                return environment_json.complaints.push($(this).attr('id'));
              });
            }
            $.ajax({
              url: '/buildings/LEED:' + plaque.LEED + '/survey/environment/?recompute_score=1',
              type: 'POST',
              username: '',
              contentType: 'application/json',
              data: JSON.stringify(environment_json)
            }).done(function(data_response) {

              $('#survey_modal_window').modal('show');
              $('.survey_main #survey_submit').prop('disabled','false');
              $('.survey_continue').removeClass('survey_faliure').addClass('survey_success');

              $('body').on('click', '.survey_success', function() {
                if(lobby_survey_backend=="True" || dashboard_access == 'False')
                {
                  location.reload();
                }
                else
                {
                  window.location.href = '/v3/dashboard/?page=score&LEED='+plaque.LEED;
                }   
              });

              if (data_response.result === "CONFLICT_ENTRY") {
                if (plaqueNav.getParameterByName('language') == 'fr') {
                  $('.survey_continue').text("D'accord");
                  $('#survey_submit_txt').text('Soumettre');
                  return $('.confirmation').addClass('error').text('Désolé, vous avez déjà pris cette enquête.').show();
                }
                else{
                  $('.survey_continue').text("OK");
                  $('#survey_submit_txt').text('Submit');
                  return $('.confirmation').addClass('error').text('Sorry, You have already taken this survey.').show();
                }
              }
              else {
                if (plaqueNav.getParameterByName('language') == 'fr') {
                  $('.survey_continue').text("D'accord");
                  return $('.confirmation').removeClass('error').text("Merci d'avoir pris le temps de compléter ce sondage.").show();
                }
                else{
                  $('.survey_continue').text("OK");
                  return $('.confirmation').removeClass('error').text('Thank you for taking the time.').show();
                }
              }
            }).fail(function() {
              $('#survey_modal_window').modal('show');
              $('.survey_main #survey_submit').prop('disabled','');
              $('.survey_continue').removeClass('survey_success').addClass('survey_faliure');

              $('body').on('click', '.survey_continue.survey_faliure', function() {
                  $('#survey_modal_window').modal('hide');
              });

              if (plaqueNav.getParameterByName('language') == 'fr') {
                $('#survey_submit_txt').text('Soumettre');
                return $('.confirmation').addClass('error').text("Désolé , votre réponse n'a pas présenté pour une raison quelconque . Veuillez réessayer.").show();
              }
              else{
                $('#survey_submit_txt').text('Submit');
                return $('.confirmation').addClass('error').text('Sorry, your response has failed to submit for some reason. Please try again.').show();
              }

            });
          }
          return false;
      });

    },
    setup: function() {
      //Start changes for ldpf-159
      $('.main_container').on('blur','.route-box input' , function () {
        plaque.survey.checkTransportSurveyValue(this);
      });
      //End changes for ldpf-159
      $('.main_container').on('change', '.slider', function() {
        $('.smiley').css({
          'background-position': -(this.value * 100) + 'px 0px'
        });
        plaque.survey.checkSlider(this.value);
      });
      $('.main_container').on('input', '.slider', function() {
        $('.smiley').css({
          'background-position': -(this.value * 100) + 'px 0px'
        });
        plaque.survey.checkSlider(this.value);
      });
      $('.main_container').on('mouseup', '.slider', function() {
        return plaque.survey.checkSlider(this.value);
      });
      $('.main_container').on('touchend', '.slider', function() {
        return plaque.survey.checkSlider(this.value);
      });
      $('.main_container').off('click', '.add_route');
      return $('.main_container').on('click', '.add_route', function() {
        if (plaqueNav.getParameterByName('language') == "fr"){
          plaque.survey.alertTransportSurveyAddRoute("Si votre moyen de transport change d'un jour à l'autre, ajouter un autre trajet.");
        }
        else{
          plaque.survey.alertTransportSurveyAddRoute("If your commute differs from day to day, add an additional route.");
        }
      });
    },
    datePicker: function() {


      if (Modernizr.inputtypes.date || Modernizr.touchEvents || Modernizr.touch) {
        $('input[type=date]').fdatepicker();
        var isiPad = navigator.userAgent.match(/iPad/i) != null;
        if (isiPad) {
          $('input[type=date]').prop('readonly', true);
        }
        return $('input[type=date]').prop('type', 'text');
      }
      
       if(!Modernizr.inputtypes.date && !(Modernizr.touchEvents || Modernizr.touch)) {
          $('input[type=date]').fdatepicker();
        }          
      
    },
    checkSlider: function(v) {
      if (v < 5) {
        return $('.were_sorry').slideDown();
      } else {
        return $('.were_sorry').slideUp();
      }
    },
    checkValue: function(o) {
      var chk;

      chk = $(o).val() > 0;
      return $('input:checkbox#' + $(o).attr('name')).prop('checked', chk);
    },
    //Start changes for ldpf-159
    checkTransportSurveyValue: function(o) {
      var value = $(o).val();
      var index = $(o).index();
      var unit  = $(o).parent().parent().find('.dist_select').val();

      if (unit=="Miles"){
        if (index == 0){
          if (value > 3){
            if (plaqueNav.getParameterByName('language') == "fr"){
              plaque.survey.alertTransportSurveyValue("" + value + " miles semble supérieur à la moyenne pour un jour , d'une façon.<br/>S'il vous plaît vérifier si cela est correct.");
            }
            else{
              plaque.survey.alertTransportSurveyValue("" + value + " miles seems above average for one day, one way.<br/>Please check if this is correct.");
            }
          }
        }
        else if(index>0){
          if (value > 30){
            if (plaqueNav.getParameterByName('language') == "fr"){
              plaque.survey.alertTransportSurveyValue("" + value + " miles semble supérieur à la moyenne pour un jour , d'une façon.<br/>S'il vous plaît vérifier si cela est correct.");
            }
            else{
              plaque.survey.alertTransportSurveyValue("" + value + " miles seems above average for one day, one way.<br/>Please check if this is correct.");
            }
          }
        }
      }
      else if (unit=="Kilometers"){
        if (index == 0){
          if (value > 4.82){
            if (plaqueNav.getParameterByName('language') == "fr"){
              plaque.survey.alertTransportSurveyValue("" + value + " kilomètres semble supérieur à la moyenne pour un jour , d'une façon.<br/>S'il vous plaît vérifier si cela est correct.");
            }
            else{
              plaque.survey.alertTransportSurveyValue("" + value + " kilometers seems above average for one day, one way.<br/>Please check if this is correct.");
            }
          }
        }
        else if(index>0){
          if (value > 48.28){
            if (plaqueNav.getParameterByName('language') == "fr"){
              plaque.survey.alertTransportSurveyValue("" + value + " kilomètres semble supérieur à la moyenne pour un jour , d'une façon.<br/>S'il vous plaît vérifier si cela est correct.");
            }
            else{
              plaque.survey.alertTransportSurveyValue("" + value + " kilometers seems above average for one day, one way.<br/>Please check if this is correct.");
            }
          }
        }
      }
    },
    alertTransportSurveyValue: function(message) {
      var paragraph = document.getElementById("survey-text");
      paragraph.innerHTML = message;
      $('#survey_alerts').modal('show');
      if (plaqueNav.getParameterByName('language') == "fr"){
        $('#survey-button-ok').text("D'accord");
      }
      else{
        $('#survey-button-ok').text("OK");
      }
    },
    //End changes for ldpf-159
    alertTransportSurveyAddRoute: function(message) {
      var paragraph = document.getElementById("survey-text");
      paragraph.innerHTML = message;
      $('#survey_alerts').modal('show');
      if (plaqueNav.getParameterByName('language') == "fr"){
        $('#survey-button-ok').text("D'accord");
      }
      else{
        $('#survey-button-ok').text("OK");
      }

      $('#survey-button-ok').on("click", function(){
        plaque.survey.addAnotherRoute();
      });
    },
    addAnotherRoute: function() {
      var num, obj;
      num = $('.survey-box').data('number-of-routes') + 1;
      $('.survey-box').data('number-of-routes', num);
      obj = $('#route-original').clone();
      obj.attr('id', 'additional-route-' + num);
      if (plaqueNav.getParameterByName('language') == "fr"){
        obj.find('.route_label').text('Trajet ' + num);
      }
      else{
        obj.find('.route_label').text('Route ' + num); 
      }
      obj.find('input[type="text"]').each(function() {
        var newid;

        $(this).val('');
        newid = $(this).attr('name') + '-route-' + num;
        return $(this).attr('name', newid);
      });
      obj.find(':checkbox').each(function() {
        $(this).attr('checked', false);
        return $(this).attr('id', $(this).attr('id') + '-route-' + num);
      });
      obj.find('label').each(function() {
        return $(this).attr('for', $(this).attr('for') + '-route-' + num);
      });
      obj.hide();
      obj.appendTo('.survey-box');
      return obj.slideDown('fast');
    },
    pushUniqueElementInArray: function(array, element){
      if($.inArray(element, array)<0) {
          //add to array
          array.push(element);
      }
    },
    popElementInArray: function(array, element){
      var clear_array = true;
      $('.small_dist').each(function( index ) {
        if($(this).attr('name') != undefined && $(this).attr('name') == plaque.survey.error_fields_name[plaque.survey.error_fields.indexOf(element)]){
          if($(this).hasClass("red_border_color")) {
            clear_array = false;
          }
        }

       });

      if (clear_array){
        var i = array.indexOf(element);
        if(i != -1) {
          array.splice(i, 1);
          plaque.survey.error_fields.splice(i, 1);
        }
      }
    }
  };
    
  var count_dots;
  var check1,check2,check3,check4,check5;  
  check1=check2=check3=check4=check5=false;

  $(document).ready(function() {
    plaque.survey.setup();
    $('.main_container').off('change', '.small_dist');
    $('body').on('click', '.survey_setup', function(){
      page = plaqueNav.getParameterByName('page');
      LEED = plaqueNav.getParameterByName('LEED');
      if ($(this).val() == 'fr') {
        url = '/static/dashboard/survey_french.html';
        query_param = "?page=" + page + "&LEED=" + LEED + "&language=fr";
      } else {
        url = '/static/dashboard/survey.html';
        query_param = "?page=" + page + "&LEED=" + LEED + "&language=en";
      }
      $.ajax({
        url: url,
        success: function(response) {
          $('#non_racetrack_container').html('');
          $('#non_racetrack_container').html(response);
        },
      });
      return History.pushState({
        goto: page
      }, page.charAt(0).toUpperCase() + page.slice(1), query_param);
    });
    $('.main_container').on('blur', '.small_dist', function() 
    {
      $(this).val($(this).val().replace(/ /g,''));
      check1=check2=check3=check4=false;      
      count_dots=1;
        for(i=0;i<$(this).val().length;i++)
        {
            if (($(this).val()).trim() == '.'){
              $(this).addClass('red_border_color');
              $(this).removeClass('grey_border_color');
              plaque.survey.pushUniqueElementInArray(plaque.survey.error_fields_name, $(this).attr('name'));
              plaque.survey.pushUniqueElementInArray(plaque.survey.error_fields, $('label[for=' + $(this).attr('name') + ']').html());
              if (plaqueNav.getParameterByName('language') == "fr"){
                plaque.survey.alertTransportSurveyValue("S'il vous plaît entrer un numéro valide à l'intérieur <span><b>" + $('label[for=' + $(this).attr('name') + ']').html() + "</b></span>");
              }
              else{
                plaque.survey.alertTransportSurveyValue("Please enter a valid number inside <span><b>" + $('label[for=' + $(this).attr('name') + ']').html() + "</b></span>");
              }
              check3 = true;
              break;
            }
            else{
               if(String(parseInt($(this).val()[i])) == "NaN")
              {              
                if($(this).val()[i] == '.' && count_dots==1)
                {      
                  $(this).removeClass('red_border_color');
                  $(this).addClass('grey_border_color');
                  plaque.survey.popElementInArray(plaque.survey.error_fields, $('label[for=' + $(this).attr('name') + ']').html());
                  check3 = false;
                  count_dots++;  
                }
              
                else
                {
                  $(this).addClass('red_border_color');
                  $(this).removeClass('grey_border_color');
                  plaque.survey.pushUniqueElementInArray(plaque.survey.error_fields_name, $(this).attr('name'));
                  plaque.survey.pushUniqueElementInArray(plaque.survey.error_fields, $('label[for=' + $(this).attr('name') + ']').html());
                  if (plaqueNav.getParameterByName('language') == "fr"){
                    plaque.survey.alertTransportSurveyValue("S'il vous plaît entrer un numéro valide à l'intérieur <span><b>" + $('label[for=' + $(this).attr('name') + ']').html() + "</b></span>");
                  }
                  else{
                    plaque.survey.alertTransportSurveyValue("Please enter a valid number inside <span><b>" + $('label[for=' + $(this).attr('name') + ']').html() + "</b></span>");
                  }
                  check3 = true;
                  count_dots = 1;
                  break;
                }
               
              }
              else
              {
                  $(this).removeClass('red_border_color');
                  $(this).addClass('grey_border_color');
                  plaque.survey.popElementInArray(plaque.survey.error_fields, $('label[for=' + $(this).attr('name') + ']').html());
                  check3 = false;
              }
            }
           
        }

        if($(this).val() == '')
        {
            check3 = false;
            $(this).removeClass('red_border_color');
            $(this).addClass('grey_border_color');
            plaque.survey.popElementInArray(plaque.survey.error_fields, $('label[for=' + $(this).attr('name') + ']').html());
        }

       $(".small_dist").each(function( index ) {
              if($(this).hasClass("red_border_color"))
              {
                check4=true;
                return false;
              }

       });

        check();
    });
      
      
    $('.main_container').on('keydown', '#location_field', function()
    {
        if($('#location_field').val().length == 128)
        {
            $('#location_field').val($('#location_field').val().substr(0, $('#location_field').val().length - 1));
        }
    });
      
    $('.main_container').on('keydown', '#other', function()
    {
        if($('#other').val().length == 256)
        {
            $('#other').val($('#other').val().substr(0, $('#other').val().length - 1));
        }
    }); 

    $('.main_container').on('keydown', '#tenant_name', function()
    {
        if($('#tenant_name').val().length == 64)
        {
            $('#tenant_name').val($('#tenant_name').val().substr(0, $('#tenant_name').val().length - 1));
        }
    }); 
      
    $('.main_container').on('blur', '#location_field', function() 
    {
        if($(this).val().length > 128)
        {
            check1 = true;
            $(this).addClass('red_border_color');
            $(this).removeClass('grey_border_color');
        }
        else
        {
            check1 = false;
            $(this).removeClass('red_border_color');
            $(this).addClass('grey_border_color');
        }
        check();
    }); 
    $('.main_container').on('blur', '#other', function() 
    {
        if($(this).val().length > 256)
        {
            check2 = true;
            $(this).addClass('red_border_color');
            $(this).removeClass('grey_border_color');
        }
        else
        {
            check2 = false;
            $(this).removeClass('red_border_color');
            $(this).addClass('grey_border_color');
        }
        check();
    });

    $('.main_container').on('blur', '#tenant_name', function() 
    {
        if($(this).val().length > 64)
        {
            check5 = true;
            $(this).addClass('red_border_color');
            $(this).removeClass('grey_border_color');
        }
        else
        {
            check5 = false;
            $(this).removeClass('red_border_color');
            $(this).addClass('grey_border_color');
        }
        check();
    });

      
    function check()
    {
        if(check1 == true || check2 == true || check3 == true || check4 == true || check5 == true)
        {
            if (plaqueNav.getParameterByName('language') == "fr"){
              plaque.survey.error_text = "S'il vous plaît apporter une contribution valable à l'intérieur '"
            }
            else{
              plaque.survey.error_text = "Please provide valid input inside '";
            }
            $('#complete_error').html(plaque.survey.error_text + plaque.survey.error_fields.join("', '") + "'");
            $('#complete_error').show();
            $('#survey_submit').attr('disabled','disabled');
            $('#survey_submit').removeClass('mt40');  
        }
        else if(check1 == false && check2 == false && check3 == false && check4 == false && check5 == false)
        {
            $('#complete_error').hide();
            $('#survey_submit').removeAttr('disabled');   
            $('#survey_submit').addClass('mt40');     
        }      
    }
      
    $('.main_container').off('change', '.date');
    return $('.main_container').on('change', '.date', function() {
      if (this.value === $(this).attr('placeholder') || this.value === '') {
        return $(this).removeClass('edited');
      } else {
        return $(this).addClass('edited');
      }
    });
  });

}).call(this);

