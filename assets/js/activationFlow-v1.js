$( document ).ready(function() {
    
  //Global variables starts
  var plaque;
  var sub;
  var want_plaque_global     = true;
  var purchase_plaque_global = false;
  var pay_full_global        = true;
  var term_of_com_global     = 3; 
  var paymode_flag           = false;
  var flag_ship              = 1;
  var ctr_ship               = 1;
  var global_version         = 'full';
  var only_agreement         = false;
  var only_payment_pages     = false;
  var only_teamMember        = false;
  var only_meterSetup        = false;
  var mode_check             = false;
  var progress_bar_details = {
    "buildingInfo": {
      "data-div" : "buildingInfo",
      "title"    : "Review Project Info"
    },
    "softwareSubscription": {
      "data-div" : "softwareSubscription",
      "title"    : "Order Selection"
    },
    "payment": {
      "data-div" : "payment",
      "title"    : "Payment"
    },
    "receipt": {
      "data-div" : "receipt",
      "title"    : "Receipt"
    },
    "buildingConfirmation": {
      "data-div" : "buildingConfirmation",
      "title"    : "Confirm Building Owner"
    },
    "teamManagement": {
      "data-div" : "teamManagement",
      "title"    : "Team Management"
    },
    "meterSetup": {
      "data-div" : "meterSetup",
      "title"    : "Meter Setup"
    }
  };
  // Global variables ends


  notificationModule();
  checkProgressBarOnClick();
  projectActive();
  permissionRequest();
  
  $('.content').on('click', '.add_new_meter', function() {
    meter_modal_clicked_from = "addNewMeter";
    $('#project_is_active').modal('hide');
    $('#activation_modal').modal('show');
    ajax_call('meterSetup');
  });

  if (window.history && window.history.pushState) {
    $(window).on('popstate', function() {
      if (document.URL.indexOf("&modal=") > -1){
        if (getUrlParameter('modal').trim() == ""){
        }
        else if (getUrlParameter('modal').trim() == "projectActive"){
          $('#activation_modal').modal('hide');
          $('#skipped_modal').modal('hide');
          $('#project_is_active').modal('show');
        }
        else if (getUrlParameter('modal').trim() == "skippedModal"){
          $('#activation_modal').modal('hide');
          $('#project_is_active').modal('hide');
          $('#skipped_modal').modal('show');
          skippedModal();
        }
        else{
          $('#project_is_active').modal('hide');
          $('#skipped_modal').modal('hide');
          $('#activation_modal').modal('show');
          var updated_full_version_arr = window.full_version_arr.slice();
          updated_full_version_arr = removeArr(updated_full_version_arr, 'orderSelection');
          updated_full_version_arr = removeArr(updated_full_version_arr, 'hardwareSubscription');
          $( ".progress_bar" ).each(function( index ) {
            $(this).attr('data-div', progress_bar_details[updated_full_version_arr[index]]['data-div']);
            $(this).attr('title', progress_bar_details[updated_full_version_arr[index]]['title']);
          });
          ajax_call(getUrlParameter('modal').trim());
        }
      }
    });
  }

  refreshStatus();

  if (document.URL.indexOf("&modal=") > -1){
    if (getUrlParameter('modal').trim() == ""){
    }
    else if (getUrlParameter('modal').trim() == "projectActive"){
      $('#activation_modal').modal('hide');
      $('#skipped_modal').modal('hide');
      $('#project_is_active').modal('show');
    }
    else if (getUrlParameter('modal').trim() == "skippedModal"){
      $('#activation_modal').modal('hide');
      $('#project_is_active').modal('hide');
      $('#skipped_modal').modal('show');
      skippedModal();
    }
    else{
      $('#project_is_active').modal('hide');
      $('#skipped_modal').modal('hide');
      $('#activation_modal').modal('show');
      var updated_full_version_arr = window.full_version_arr.slice();
      updated_full_version_arr = removeArr(updated_full_version_arr, 'orderSelection');
      updated_full_version_arr = removeArr(updated_full_version_arr, 'hardwareSubscription');
      $( ".progress_bar" ).each(function( index ) {
        $(this).attr('data-div', progress_bar_details[updated_full_version_arr[index]]['data-div']);
        $(this).attr('title', progress_bar_details[updated_full_version_arr[index]]['title']);
      });
      ajax_call(getUrlParameter('modal').trim());
    }
  }

  //Trial version starts
  $('body').on('click', '#plan_or_team', function() {
    only_payment_pages = true;
    if (trial_version_backend == "False" && is_agreement_required == 'True'){
      $('#teamManage').trigger('click');
    }
    else{
      $('#project_is_active').modal('hide');
      $('#skipped_modal').modal('hide');
      $('#activation_modal').modal('show');

      $('.progress_imgs').html('<div class="progress_success_img_left progress_bar" data-div="softwareSubscription" title="Order Selection"></div><div class="progress_success_img_center progress_bar" data-div="payment" title="Payment"></div><div class="progress_success_img_right progress_bar" data-div="receipt" title="Receipt"></div>');
      ajax_call('buildingInfo');
    }
  });

  $('body').on('click', '#plan_selection', function() 
  {
      window.location.href ="/dashboard/?page=account&section=planSelection&LEED=" + getUrlParameter('LEED');
  });

  $('body').on('click', '#building_setup', function() 
  {
      window.location.href ="/dashboard/?page=data_input&LEED=" + getUrlParameter('LEED');
  });

  //Trial version ends

  function checkShortcut(pageName)
  {
      var rt_value = true;
      if( pageName=='payment' || pageName=='softwareSubscription' || pageName=='hardwareSubscription' || pageName=='orderSelection' )
      {
          if( $('.notification_module').find('#select_plan_from_notification').length == 0 )
          {
              rt_value = false;
          }
      }
      else if( pageName=='buildingConfirmation' )
      {
          if( $('.notification_module').find('#sign_agreement_from_notification').length == 0 )
          {
              rt_value = false;
          }
      }
      return rt_value;
  }
    

  function ajax_call(pageName) {

    refreshStatus();
    
    $('#preloader_activationFlow').show();
    $('#status_activationFlow').show();

    if ($(window).width() <= 600){
      $('.back_btn_access').remove();
      $('.forward_btn_access').remove();
    }
    else{
      $('.back_btn').remove();
      $('.forward_btn').remove();
    }

    if (pageName == "meterSetup"){
      if (meter_modal_clicked_from != "addNewMeter"){
        if (msieversion() == 9){
          window.location.href = window.location.href.split(window.location.protocol + '//' + window.location.hostname)[1].split('&trigger=')[0].split('&modal=')[0] + '&modal=' + pageName;
          return false;
        }
        else{
          window.history.pushState({}, getUrlParameter('page'), window.location.href.split(window.location.protocol + '//' + window.location.hostname)[1].split('&trigger=')[0].split('&modal=')[0] + '&modal=' + pageName); 
        }
      }
    }
    else{
        if (msieversion() == 9){
          window.location.href = window.location.href.split(window.location.protocol + '//' + window.location.hostname)[1].split('&trigger=')[0].split('&modal=')[0] + '&modal=' + pageName;
          return false;
        }
        else{
          window.history.pushState({}, getUrlParameter('page'), window.location.href.split(window.location.protocol + '//' + window.location.hostname)[1].split('&trigger=')[0].split('&modal=')[0] + '&modal=' + pageName);
        }
    }

    if (pageName=='payment' || pageName=='softwareSubscription' || pageName=='hardwareSubscription' || pageName=='orderSelection' || pageName=='buildingConfirmation'){
      if (!checkShortcut(pageName)){
        window.location.href = window.location.href.substring(0, window.location.href.indexOf('&modal'));
      }
    }

    $.ajax({
      url: 'assets/templates/'+pageName+'.html',
      cache: true
    }).done(function(data) {

      $('#preloader_activationFlow').hide();
      $('#status_activationFlow').hide();

      page_content = data;

      $( ".activationFlow_parent_container" ).html('');
      $( ".activationFlow_parent_container" ).append(page_content);
      
      if(pageName == 'buildingInfo'){
        
        buildingSetup();

      }
      else if(pageName == 'softwareSubscription') {
        check_progressBar(pageName);

        softwareSubscription();

      }
      else if(pageName == 'hardwareSubscription') {
        hardwareSubscription();

      }
      else if(pageName == 'orderSelection') {
        orderSelection();

      }
      else if(pageName == 'payment') {
        check_progressBar(pageName);
        payment();

      }
      else if(pageName == 'receipt') {
        
        check_progressBar(pageName);
        receipt();

      }
      else if(pageName == 'buildingConfirmation'){

        $('body').css('overflow', 'visible');
        check_progressBar(pageName);
        agreement();

      }
      else if(pageName == 'teamManagement'){

        check_progressBar(pageName);
        teamManagement();

      }
      else if(pageName == 'meterSetup'){

        check_progressBar(pageName);
        meterSetup();

      }
    });
  }

  function check_BackAndNextPage(pageName, direction, version){
    var next_arr_page = "";
    var arr = [];

    if (version == "full"){
      arr = window.full_version_arr;
    }
    else{
      arr = window.full_version_arr;
    }

    if (direction=="next") {
      if (arr[arr.indexOf(pageName)+1] == undefined){
        next_arr_page = undefined;
      }
      else{
        next_arr_page = arr[arr.indexOf(pageName)+1];
      }
    }
    else{
      if (arr[arr.indexOf(pageName)-1] == undefined){
        next_arr_page = undefined;
      }
      else{
        next_arr_page = arr[arr.indexOf(pageName)-1];
      }
    }
    return next_arr_page;
  }

  function check_progressBar(pageName){
   $('.progress_bar').each(function(index, value) {
    if ( $(this).attr('data-div') == pageName){
      return false;
    }
    $(this).addClass('bg-green-progress');
    if (pageName == 'receipt' || pageName=='buildingConfirmation' || pageName=='teamManagement'){
      $(this).addClass('not-active');
    }
    else{
      $(this).addClass('cursor_pointer');
    }
   });
  }

  function getUrlParameter(sParam){
    var sPageURL = window.location.hash.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++){
      var sParameterName = sURLVariables[i].split('=');
      if(sParameterName[0] == sParam){
        return sParameterName[1];
      }
    }
  }

  //Your project is active functionality starts

  function projectActive(){

    var updated_full_version_arr = window.full_version_arr.slice();
    updated_full_version_arr = removeArr(updated_full_version_arr, 'orderSelection');
    updated_full_version_arr = removeArr(updated_full_version_arr, 'hardwareSubscription');
    $( ".progress_bar" ).each(function( index ) {
      $(this).attr('data-div', progress_bar_details[updated_full_version_arr[index]]['data-div']);
      $(this).attr('title', progress_bar_details[updated_full_version_arr[index]]['title']);
    });

    $(".skip_for_now, #project_is_active_close").on('click', function()
    {
      if (msieversion() == 9){
        window.location.href = window.location.href.split(window.location.protocol + '//' + window.location.hostname)[1].split('&trigger=')[0].split('&modal=')[0] + '&modal=skippedModal';
        return false;
      }
      else{
        window.history.pushState({}, getUrlParameter('page'), window.location.href.split(window.location.protocol + '//' + window.location.hostname)[1].split('&trigger=')[0].split('&modal=')[0] + '&modal=skippedModal');
      }
      $('#activation_modal').modal('hide');
      $('#project_is_active').modal('hide');
      $('#skipped_modal').modal('show');
      skippedModal();
    });

    meter_modal_clicked_from = "modal";

    $('#add_team_span_md').on('click', function(){
      $.ajax({
        url: '/buildings/LEED:' + getUrlParameter('LEED') + '/notification/activity:skipped_teamManagement/',
        type: 'DELETE',
        contentType: 'application/json'
      }).done(function(data) {
      }).fail(function(data) {
      });
      $('#project_is_active').modal('hide');
      $('#skipped_modal').modal('hide');
      $('#activation_modal').modal('show');
      only_teamMember = true;
      ajax_call('teamManagement');
    });

    $('#add_meter_span_md').on('click', function(){
      $('#project_is_active').modal('hide');
      $('#skipped_modal').modal('hide');
      $('#activation_modal').modal('show');
      only_meterSetup = true;
      ajax_call('meterSetup');
    });

    $('#select_plan_span_md').on('click', function(){
      $('#project_is_active').modal('hide');
      $('#skipped_modal').modal('hide');
      $('#activation_modal').modal('show');
      ajax_call('buildingInfo');
    });

    $('#sign_agreement_span_md').on('click', function(){
      $('#project_is_active').modal('hide');
      $('#skipped_modal').modal('hide');
      $('#activation_modal').modal('show');
      ajax_call('buildingConfirmation');
    });
  }

//Your project is active functionality ends


//Skip functionality starts

  function skippedModal(){

    $('#back_skipped').on('click', function(){
      window.history.back();
    });

    $('#continue_skipped').on('click', function(){
      $.ajax({
        url:'/buildings/LEED:' + getUrlParameter('LEED') + '/',
        contentType: 'application/json'
        }).done(function(data) 
        {
          
        if (data.trial_version_status || data.building_status == 'activated') {
          var switch_url = '/dashboard/?page=data_input&section=setup&LEED=' + getUrlParameter('LEED');
          if (localStorage.getItem('UI_Version') == 'v3'){
            switch_url = window.location.protocol + '//' + window.location.host + '/v3/dashboard/?page=manage&section=project_plaque&LEED=' + getUrlParameter('LEED');
          }
          window.location.href = switch_url;
        }
        else{
          var switch_url = '/dashboard/?page=overview&LEED=' + getUrlParameter('LEED');
          if (localStorage.getItem('UI_Version') == 'v3'){
            switch_url = window.location.protocol + '//' + window.location.host + '/v3/dashboard/?page=score&LEED=' + getUrlParameter('LEED');
          }
          window.location.href = switch_url;
        } 
      });
    });
  }

//Skip functionality ends

  //Check for touch device
  function touchDevice () {
    if (Modernizr.touchEvents || Modernizr.touch){
      return true;
    }
    else{
      return false;
    }
  }

  //Refresh trial and building status from backend
  function refreshStatus(){
    if (document.URL.indexOf('LEED') > -1){
      $.ajax({
      url:'/buildings/LEED:' + getUrlParameter('LEED') + '/',
      contentType: 'application/json'
      }).done(function(data) 
      {
        if (data.trial_version_status){
          trial_version_backend = 'True';
        }
        else{
          trial_version_backend = 'False';
        }

        building_status_backend = data.building_status;

        
    });
  }
}

  function getCookie(name) {
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
  }

  function inIframe () 
  {
    try 
    {
      return window.self !== window.top;
    } catch (e) 
    {
      return true;
    }
  }

  //Converts string value $600.00 to numeric value 600
  function stringToNumeric (str) {
      var num = parseInt(str.replace( /[^\d.]/g, '' ));
              return num;
  }

  //Converts numeric value 600 to string value $600.00
  function numericToString (num) 
  {
      var str = (num + '').replace(/(\d)(?=(\d{3})+$)/g, '$1,');
      if(str.indexOf('.') == -1)
        str = '$'+ str +'.00';
      else
        str = '$'+ str
      return str;
  }

  //Luhn check for validating credit card number
  function luhn_check_credit_card(value) {
    // accept only digits, dashes or spaces
    if (/[^0-9-\s]+/.test(value)) return false;

    // The Luhn Algorithm. It's so pretty.
    var nCheck = 0, nDigit = 0, bEven = false;
    value = value.replace(/\D/g, "");

    for (var n = value.length - 1; n >= 0; n--) {
      var cDigit = value.charAt(n),
          nDigit = parseInt(cDigit, 10);

      if (bEven) {
        if ((nDigit *= 2) > 9) nDigit -= 9;
      }

      nCheck += nDigit;
      bEven = !bEven;
    }

    return (nCheck % 10) == 0;
  }

  function successSubmitValues() {
    $('.paynow_f_name').css('border','1px solid rgba(57,180,70,1)');
    $('.paynow_l_name').css('border','1px solid rgba(57,180,70,1)');
    $('.paynow_add').css('border','1px solid rgba(57,180,70,1)');
    $('#paynow_city').css('border','1px solid rgba(57,180,70,1)');
    $('#paynow_po_code').css("border-color", "rgba(57,180,70,1)");
    $('.country').css('border','1px solid rgba(57,180,70,1)');
    $('.state').css('border','1px solid rgba(57,180,70,1)');
    $('.paynow_phone').css('border','1px solid rgba(57,180,70,1)');
    $('.card_number').css('border','1px solid rgba(57,180,70,1)');
    $('.paynow_ship_f_name').css('border','1px solid rgba(57,180,70,1)');
    $('.paynow_ship_add').css('border','1px solid rgba(57,180,70,1)');
    $('.paynow_ship_city').css('border','1px solid rgba(57,180,70,1)');
    $('#paynow_ship_po_code').css("border-color", "rgba(57,180,70,1)");
    $('.ship_country').css('border','1px solid rgba(57,180,70,1)');
    $('.ship_state').css('border','1px solid rgba(57,180,70,1)');
    $('.paynow_ship_phone').css('border','1px solid rgba(57,180,70,1)');
    $('.paynow_cvv').css('border','1px solid rgba(57,180,70,1)');
    $('#month').css('border','1px solid rgba(57,180,70,1)');
    $('#year').css('border','1px solid rgba(57,180,70,1)');
    //$('.paynow_validation_msg').hide();
  }

  function init_NProgress () {
    NProgress.configure({ ease: 'ease', speed: 500,
                    showSpinner: false });
  }

  function init_blockUI () {
    $.blockUI({ message: null, overlayCSS: { 
        backgroundColor: '#fff',
        opacity: 0.4
    } });
  }

  function agreement_sent () {
    // $.unblockUI();
    // $('#continue_building_owner').prop("value", "SENT");
    $('body').on('click', '#agreement_thankyou_close', function() {
      window.location = document.URL.split("&modal=")[0] + '&modal=skippedModal';
    });
  }

  function start_redirect (viewUrl) {
    if (!touchDevice()){
      NProgress.done();
    }
    // $.unblockUI();
    // $('#continue_building_owner').prop("value", "SENT");
    window.location = viewUrl;
  }

  function display_error (message) {
    var regEx = /(\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*)/;
    $("#notification_header_val").html(message);
    $("#notification_header_val").html($("#notification_header_val").html().replace(regEx, "<a class=\"mailto\" href=\"mailto:$1?Subject=Error%20report\">$1</a>"));
    if (!touchDevice()){
      NProgress.done();
    }
    $('.jquery-header-bar').hide().delay(1000).slideDown(400);
  }

  function display_error_only_text (message) {
    $("#notification_header_val").html(message);
    if (!touchDevice()){
      NProgress.done();
    }
    $('.jquery-header-bar').hide().delay(1000).slideDown(400);
  }

  function getEmail () {
    var new_mail = ($("#new_owner_id").val()).trim();
    if (new_mail=="" && $("#saved_email").html()!="") {
        new_mail = $("#saved_email").html();
    }
    new_mail = new_mail.trim();
    return new_mail;
  }

  function getName () {
    var new_name = ($("#new_owner_name").val()).trim();
    if (new_name=="" && $("#saved_name").html()!="") {
        new_name = $("#saved_name").html();
    }
    new_name = new_name.trim();
    return new_name;
  }

  function create_send_URL () {
    var url = "/payment/sendagreement/" + "LEED:" + getUrlParameter('LEED').trim() + '/';
    return url;
  }

  function create_send_URL_embedded () {
    url = "/payment/signembeddedagreement/" + "LEED:" + getUrlParameter('LEED').trim() + "/";
    return url;
  }

  function validateEmail(email) { 
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  } 

  //Check for touch device
  function touchDevice () {
    if (Modernizr.touchEvents || Modernizr.touch){
      return true;
    }
    else{
      return false;
    }
  }

  //remove element from array
  function removeArr(arr) {
      var what, a = arguments, L = a.length, ax;
      while (L > 1 && arr.length) {
          what = a[--L];
          while ((ax= arr.indexOf(what)) !== -1) {
              arr.splice(ax, 1);
          }
      }
      return arr;
  }



  //paynow order data starts
  function paynowSelectedData() {

    if (pay_full_global){
      $('#auto_renewal_com_box').css('display', 'none');
      $('#auto_renewal').attr('data-chk', 'unchecked');
    }
    else{
      $('#auto_renewal_com_box').css('display', 'block');
    }

    if (want_plaque_global){
      $('.needplaque_tbl').show();
    }
    else{
      $('.needplaque_tbl').hide();
    }

    if (want_plaque_global){
      if (purchase_plaque_global){
        $('.needplaque_tbl').show();
        $('.rowHide').show();
        if (pay_full_global){
          $('.pay_full_span').hide();
        }
        else{
          $('.pay_full_span').show();
        }
      }
      else{
        $('.plaque_one_time_price').text(plaque);
        $('.subs_price').text(sub); 
          
        if (pay_full_global){
          $('.pay_full_span').hide();
        }
        else{
          $('.pay_full_span').show();
        }
      }
    }
    else{
      if (pay_full_global){
        $('.pay_full_span').hide();
      }
      else{
        $('.pay_full_span').show();
      }
    }   
  }
  //paynow order data ends

  //Selected order data starts
  function selectedOrderData(pageName) 
  {
    $.ajax({
      url:'assets/json/selectedorderdata.json',
      contentType: 'application/json'
      }).done(function(data) 
      {
          want_plaque_global = data.leed_plaque;
      purchase_plaque_global = data.purchase_plaque;
          pay_full_global = data.paid_full;
          term_of_com_global = data.term_com;
      if(pageName == 'hardwareSubscription')
      {
      want_plaque_global = true;
      purchase_plaque_global = false;
      }
          if(typeof term_of_com_global === 'undefined')
          {
              term_of_com_global = 3;
          }
      }).always(function() {
        sendValuesTotal(pageName);
      });
    }
  //Selected order data ends

  //Calculation starts
  function sendValuesTotal(pageName) 
  {
      if(window.PAYMENT_VERSION == 'V2' && want_plaque_global == true)
      {
        $('.payment_option_2').hide();    
    $('#value_3').css('top','149px');
      }
      else
      {
        $('.payment_option_2').show();     
      }
      var csrftoken = getCookie('csrftoken');
      $.ajax({
         type:"GET",
         url:"/payment/calculatetotal/LEED:" + getUrlParameter('LEED') + "/",
         data: {
                    'want_plaque': want_plaque_global,
                    'purchase_plaque': purchase_plaque_global,
                    'pay_full': pay_full_global,
                    'term_slider': term_of_com_global,
                    'page': pageName
               },
         success: function(data)
         {
            if (term_of_com_global == 1){
              $('.if_one_year').hide();
            }
            else{
             $('.if_one_year').show(); 
            }

            if(pageName == 'softwareSubscription')
            {
              $('select>option:eq('+ (data.term_of_com_global - 1) +')').attr('selected', true);
              if(window.PAYMENT_VERSION == 'V2')
              {
                $('.amount_in_full').hide()
                $('.amount_yearly').html(numericToString(data.subs_price));   
              }
              else
              {
                $('.amount_in_full').html(numericToString(data.subs_price));
                $('.amount_yearly').html(numericToString(data.subs_price_per_year));    
              }
            }
            else if(pageName == 'hardwareSubscription')
            {
              
                if(window.PAYMENT_VERSION == 'V2')
                  {
                    $('.amount_in_full').hide()
                    $('.amount_yearly').html(numericToString(data.subs_price));   
                    $('.plaque_one_type_price_hrd').html(numericToString(data.plaque_cost));
                    $('.plaque_anual_price_hrd').html(numericToString(data.plaque_one_time_price));
                  }
                  else
                  {
                    $('.amount_in_full').html(numericToString(data.subs_price));
                    $('.amount_yearly').html(numericToString(data.subs_price_per_year));    
                    $('.plaque_one_type_price_hrd').html(numericToString(data.plaque_one_time_price));
                    $('.plaque_anual_price_hrd').html(numericToString(data.plaque_price_only));
                  }
              var tem_selected_with_year = "";
              if (term_of_com_global > 1){
                tem_selected_with_year = term_of_com_global + ' years';
              }
              else{
                tem_selected_with_year = term_of_com_global + ' year';
              }
              $('.tem_selected_with_year').html(tem_selected_with_year);
            }
            else if(pageName == 'orderSelection')
            { 
                if(window.PAYMENT_VERSION == 'V2')
                {
                    $('#orderselection_discount').show();

                    if(purchase_plaque_global == true)
                    {
                        $('#payment_plan_select').val('2');
                    }
                    else
                    {
                        $('#payment_plan_select').val('1');
                    }

                    $('.pay_full_span').text('('+term_of_com_global + ' Years)');
                    if($('#payment_plan_select').val() == '1')
                    {
                        $('#payment_plan_select').html($('.payment_option_1').html());
                        $('.subs_price').html(numericToString(data.subs_price)); 
                        $('.plaque_one_time_price').html(numericToString(data.plaque_one_time_price)); 
                    }
                    else if ($('#payment_plan_select').val() == '2')
                    {
                        $('#payment_plan_select').html($('.payment_option_2').html());
                        $('.subs_price').html(numericToString(data.subs_price)); 
                        $('.plaque_one_time_price').html(numericToString(data.plaque_cost)); 
                    }
                }
                else
                {
                    $('#orderselection_discount').hide();

                    if(pay_full_global == true)
                    { 
                        $('.pay_full_span').text('('+term_of_com_global + ' Years)');

                        $('#payment_plan_select').val("2");
                        $('#payment_plan_select').html($('.payment_option_2').html());

                        if(purchase_plaque_global == true)
                            $('.purchase_plaque_span').text(''); 
                        else
                            $('.purchase_plaque_span').text('('+term_of_com_global + ' Years)');
                    }
                    else
                    {
                        if (purchase_plaque_global == true)
                        {
                            $('#payment_plan_select').val("3");
                            $('#payment_plan_select').html($('.payment_option_3').html());
                        }
                        else
                        {
                            $('#payment_plan_select').val("1");
                            $('#payment_plan_select').html($('.payment_option_1').html());
                        }
                        $('.pay_full_span').text('(1 Year)');
                        $('.pay_full_span').text('(1 Year)');  
                        if(purchase_plaque_global == true)
                            $('.purchase_plaque_span').text(''); 
                        else
                            $('.purchase_plaque_span').text('(1 Year)');
                    }

                    if(purchase_plaque_global == true)
                    {
                        $('.plaque_one_time_price').text(numericToString(data.plaque_one_time_price));
                    }
                    else if(purchase_plaque_global == false)
                    {
                        $('.plaque_one_time_price').text(numericToString(data.plaque_price_only));  
                    }
                    $('.subs_price').html(numericToString(data.subs_price_only));

                }
                $('.total_plaque_price').html(numericToString(data.tot_cost));  
                paynowSelectedData();
            }
            else if(pageName == 'payment')
            {
              if(window.PAYMENT_VERSION == 'V2')
              {
                  $('.pay_full_span').text('('+term_of_com_global + ' Years)');
                  if(purchase_plaque_global == false)
                  {
                       $('.subs_price').html(numericToString(data.subs_price)); 
                       $('.plaque_one_time_price').html(numericToString(data.plaque_one_time_price)); 
                  }
                  else if (purchase_plaque_global == true)
                  {
                       $('.subs_price').html(numericToString(data.subs_price)); 
                       $('.plaque_one_time_price').html(numericToString(data.plaque_cost)); 
                  }
              }
              else
              {
                  if(pay_full_global == true)
                  {
                    $('#auto_renewal_com_box').hide();
                    $('#auto_renewal').attr('data-chk', 'unchecked');
                  }
                  else
                  {
                    $('#auto_renewal_com_box').show();
                    if(pay_full_global == false && (want_plaque_global == true && purchase_plaque_global == false))
                    {
                        $('#auto_renewal_check').html(numericToString(parseInt(data.plaque_price_only) + parseInt(data.subs_price)));
                    }
                    else if(pay_full_global == false && (want_plaque_global == true && purchase_plaque_global == true))
                    {
                        $('#auto_renewal_check').html(numericToString(parseInt(data.subs_price)));
                    }
                    else if(pay_full_global == true && (want_plaque_global == true && purchase_plaque_global == false))
                    {
                        $('#auto_renewal_check').html(numericToString(parseInt(data.plaque_price_only)));
                    }
                    else if(pay_full_global == false && want_plaque_global == false)
                    {
                        $('#auto_renewal_check').html(numericToString(parseInt(data.subs_price_only)));
                    }
                  }

                  if(pay_full_global == true)
                  { 
                    $('.pay_full_span').text('('+term_of_com_global + ' Years)');
                    $('#payment_plan_select').val("2");
                    if(purchase_plaque_global == true)
                        $('.purchase_plaque_span').text(''); 
                    else
                        $('.purchase_plaque_span').text('('+term_of_com_global + ' Years)');
                  }
                  else
                  {
                    $('.pay_full_span').text('(1 Year)');
                    $('#payment_plan_select').val("1");
                    $('.pay_full_span').text('(1 Year)');  
                    if(purchase_plaque_global == true)
                        $('.purchase_plaque_span').text(''); 
                    else
                        $('.purchase_plaque_span').text('(1 Year)');
                  }

                  if(purchase_plaque_global == true)
                  {
                      $('.plaque_one_time_price').text(numericToString(data.plaque_one_time_price));
                  }
                  else if(purchase_plaque_global == false)
                  {
                      $('.plaque_one_time_price').text(numericToString(data.plaque_price_only));  
                  }
                  $('.subs_price').html(numericToString(data.subs_price_only));    
              }
              $('.total_plaque_price').html(numericToString(data.tot_cost));

              paynowSelectedData();
            }
         }
      });
  }
  //Calculation ends

  // Make paymetric form responsive
  function makePaymetricFormResponsive() {
    if($( '.container_shadow').width() <= 709) {
      $('#DIeCommFrame_payment').contents().find('.paynow_month').css('width', '35%');
      $('#DIeCommFrame_payment').contents().find('.paynow_month').css('margin-top', '16px');
      $('#DIeCommFrame_payment').contents().find('.paymetric_year').css('width', '30%');
      $('#DIeCommFrame_payment').contents().find('.paymetric_year').css('margin-left', '5%');
      $('#DIeCommFrame_payment').contents().find('.paymetric_year').css('margin-top', '16px');
      $('#DIeCommFrame_payment').contents().find('.DataInterceptCVV ').css('margin-top', '17px');
      $('#DIeCommFrame_payment').contents().find('.paymetric_cvv').css('margin-top', '-57px');
      $('#DIeCommFrame_payment').contents().find('.paymetric_cvv').css('margin-right', '10%');
      $('#DIeCommFrame_payment').contents().find('.paymetric_cvv').css('width', '15%');
      $('#DIeCommFrame_payment').contents().find('.DataInterceptCVV').css('position', 'initial');
    }
    else{
      $('#DIeCommFrame_payment').contents().find('.paynow_month').css('width', '150px');
      $('#DIeCommFrame_payment').contents().find('.paynow_month').css('margin-top', '0px');
      $('#DIeCommFrame_payment').contents().find('.paymetric_year').css('width', '140px');
      $('#DIeCommFrame_payment').contents().find('.paymetric_year').css('margin-left', '19px');
      $('#DIeCommFrame_payment').contents().find('.paymetric_year').css('margin-top', '8px');
      $('#DIeCommFrame_payment').contents().find('.DataInterceptCVV ').css('margin-top', '-52px');
      $('#DIeCommFrame_payment').contents().find('.paymetric_cvv').css('margin-top', '0px');
      $('#DIeCommFrame_payment').contents().find('.paymetric_cvv').css('margin-left', '4%');
      $('#DIeCommFrame_payment').contents().find('.paymetric_cvv').css('width', '59%');
      $('#DIeCommFrame_payment').contents().find('.DataInterceptCVV').css('position', 'absolute');
    }
    $( window ).resize(function() {
        if($( '.container_shadow').width() <= 709) {
        $('#DIeCommFrame_payment').contents().find('.paynow_month').css('width', '35%');
        $('#DIeCommFrame_payment').contents().find('.paynow_month').css('margin-top', '16px');
        $('#DIeCommFrame_payment').contents().find('.paymetric_year').css('width', '30%');
        $('#DIeCommFrame_payment').contents().find('.paymetric_year').css('margin-left', '5%');
        $('#DIeCommFrame_payment').contents().find('.paymetric_year').css('margin-top', '16px');
        $('#DIeCommFrame_payment').contents().find('.DataInterceptCVV ').css('margin-top', '17px');
        $('#DIeCommFrame_payment').contents().find('.paymetric_cvv').css('margin-top', '-57px');
        $('#DIeCommFrame_payment').contents().find('.paymetric_cvv').css('margin-right', '10%');
        $('#DIeCommFrame_payment').contents().find('.paymetric_cvv').css('width', '15%');
        $('#DIeCommFrame_payment').contents().find('.DataInterceptCVV').css('position', 'initial');
      }
      else{
        $('#DIeCommFrame_payment').contents().find('.paynow_month').css('width', '150px');
        $('#DIeCommFrame_payment').contents().find('.paynow_month').css('margin-top', '0px');
        $('#DIeCommFrame_payment').contents().find('.paymetric_year').css('width', '140px');
        $('#DIeCommFrame_payment').contents().find('.paymetric_year').css('margin-left', '19px');
        $('#DIeCommFrame_payment').contents().find('.paymetric_year').css('margin-top', '8px');
        $('#DIeCommFrame_payment').contents().find('.DataInterceptCVV ').css('margin-top', '-52px');
        $('#DIeCommFrame_payment').contents().find('.paymetric_cvv').css('margin-top', '0px');
        $('#DIeCommFrame_payment').contents().find('.paymetric_cvv').css('margin-left', '4%');
        $('#DIeCommFrame_payment').contents().find('.paymetric_cvv').css('width', '59%');
        $('#DIeCommFrame_payment').contents().find('.DataInterceptCVV').css('position', 'absolute');
      }
    });
  }

  //Confirm and pay
  function submit_CC_values (paymetricFlag , token) {
    var payment_mode = "";
    $("#preloader_activationFlow").show();
    $("#status_activationFlow").show();
    var csrftoken          = getCookie('csrftoken');
    //Credit card details
    var CC_type_obj = $('#DIeCommFrame_payment').contents().find('.card_type_tbl img').filter(function() {
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
    
    var CC_expiry_month    = months[$('#DIeCommFrame_payment').contents().find('#month option:selected').text()];
    var CC_expiry_year     = $('#DIeCommFrame_payment').contents().find('#year option:selected').text();

    if(CC_expiry_year == "Year"){
      CC_expiry_year = "";
    }
    
    if(paymetricFlag){
    // Paymetric code starts
    
    if (CC_type=="AMEX"){
      document.getElementById('DIeCommFrame_payment').contentWindow.document.getElementById('Paymetric_CreditCardType').selectedIndex = 0;
    }
    else if(CC_type=="VISA"){
      document.getElementById('DIeCommFrame_payment').contentWindow.document.getElementById('Paymetric_CreditCardType').selectedIndex = 1;
    }
    else if(CC_type=="MC"){
      document.getElementById('DIeCommFrame_payment').contentWindow.document.getElementById('Paymetric_CreditCardType').selectedIndex = 2;
    }
    else if(CC_type=="DIS"){
      document.getElementById('DIeCommFrame_payment').contentWindow.document.getElementById('Paymetric_CreditCardType').selectedIndex = 3;
    }

    document.getElementById('DIeCommFrame_payment').contentWindow.document.getElementById('Paymetric_Exp_Month').value = CC_expiry_month;
    document.getElementById('DIeCommFrame_payment').contentWindow.document.getElementById('Paymetric_Exp_Year').value = CC_expiry_year.slice(-2);
    document.getElementById('DIeCommFrame_payment').contentWindow.document.getElementById('PayNowButton').click();

    // Paymetric code ends
    }
    else{

      var auto_renewal = true;
      if (($('#auto_renewal_com_box').css('display') == "block") && $('#auto_renewal').attr('data-chk')=="checked"){
        auto_renewal = true;
      }
      else{
        auto_renewal = false;
      }

      //Billing details
      var CC_first_name      = $('#paynow_f_name').val();
      var CC_last_name       = $('#paynow_l_name').val();
      var CC_address         = $('#paynow_add').val();
      var CC_city            = $('#paynow_city').val();
      var CC_po_code         = $('#paynow_po_code').val();
      var CC_country         = $('#country1 option:selected').val().trim();
      var CC_state           = $('#state1 option:selected').val().trim();
      var CC_email           = $('#paynow_email').val();
      var CC_phone           = $('#paynow_phone').val();

      //Shipping details
      if ($('.address_same').is(':visible')){
        var CC_ship_first_name = CC_first_name;
        var CC_ship_last_name  = CC_last_name;
        var CC_ship_address    = CC_address;
        var CC_ship_city       = CC_city;
        var CC_ship_po_code    = CC_po_code;
        var CC_ship_country    = CC_country;
        var CC_ship_state      = CC_state;
        var CC_ship_email      = CC_email;
        var CC_ship_phone      = CC_phone;
      }
      else{
        var CC_ship_first_name = $('.paynow_ship_f_name').val();
        var CC_ship_last_name  = $('.paynow_ship_l_name').val();
        var CC_ship_address    = $('.paynow_ship_add').val();
        var CC_ship_city       = $('.paynow_ship_city').val();
        var CC_ship_po_code    = $('#paynow_ship_po_code').val();
        var CC_ship_country    = $('#country2 option:selected').val().trim();
        var CC_ship_state      = $('#state2 option:selected').val().trim();
        var CC_ship_email      = $('.paynow_ship_email').val();
        var CC_ship_phone      = $('.paynow_ship_phone').val();
      }

      if (paymode_flag){
        payment_mode = "check";
        var creditCard_details = {
                                
                                'CC_first_name' : CC_first_name,
                                'CC_last_name' : CC_last_name,
                                'CC_address' : CC_address,
                                'CC_city' : CC_city,
                                'CC_po_code' : CC_po_code,
                                'CC_country' : CC_country,
                                'CC_state' : CC_state,
                                'CC_email' : CC_email,
                                'CC_phone' : CC_phone,
                                'CC_ship_first_name' : CC_ship_first_name,
                                'CC_ship_last_name' : CC_ship_last_name,
                                'CC_ship_address' : CC_ship_address,
                                'CC_ship_city' : CC_ship_city,
                                'CC_ship_po_code' : CC_ship_po_code,
                                'CC_ship_country' : CC_ship_country,
                                'CC_ship_state' : CC_ship_state,
                                'CC_ship_email' : CC_ship_email,
                                'CC_ship_phone' : CC_ship_phone,
                                'paymetric_r' : "",
                                'paymetric_s' : "",
                                'auto_renewal'  : auto_renewal,
                                'payment_mode'  : payment_mode
                              }

      }
      else{
      payment_mode = "credit";

      var creditCard_details = {
                                
                                'CC_first_name' : CC_first_name,
                                'CC_last_name' : CC_last_name,
                                'CC_address' : CC_address,
                                'CC_city' : CC_city,
                                'CC_po_code' : CC_po_code,
                                'CC_country' : CC_country,
                                'CC_state' : CC_state,
                                'CC_email' : CC_email,
                                'CC_phone' : CC_phone,
                                'CC_ship_first_name' : CC_ship_first_name,
                                'CC_ship_last_name' : CC_ship_last_name,
                                'CC_ship_address' : CC_ship_address,
                                'CC_ship_city' : CC_ship_city,
                                'CC_ship_po_code' : CC_ship_po_code,
                                'CC_ship_country' : CC_ship_country,
                                'CC_ship_state' : CC_ship_state,
                                'CC_ship_email' : CC_ship_email,
                                'CC_ship_phone' : CC_ship_phone,
                                'paymetric_r' : token.split('&s=')[0],
                                'paymetric_s' : token.split('&s=')[1],
                                'auto_renewal'  : auto_renewal,
                                'payment_mode'  : payment_mode
                              }
      }
     
    $.ajax({
        url:'/payment/paynow/LEED:' + getUrlParameter('LEED') + '/',
        type: "POST",
        data: JSON.stringify(creditCard_details),
        contentType: 'application/json',
        success:function(response){
          //Send receipt to user
          if (response.message=="SUCCESS"){
            refreshStatus();
            $.ajax({
              url: '/buildings/LEED:' + getUrlParameter('LEED') + '/notification/activity:skipped_payment/',
              type: 'DELETE',
              contentType: 'application/json'
            }).done(function(data) {
              ajax_call('receipt');
            }).fail(function(data) {
            });

            $('#confirm_payment').prop('disabled',false);
            $('#confirm_payment').removeClass('disable');

          }
          else if(response.message=="ERROR" || response.message=="NOT_FOUND"){
            $('#DIeCommFrame_payment').attr( 'src', '/payment/getpaymetricform/LEED:' + getUrlParameter('LEED') + '/page:payment' + '/');
            $("#preloader_activationFlow").hide();
            $("#status_activationFlow").hide();

            $('#confirm_payment').prop('disabled',false);
            $('#confirm_payment').removeClass('disable');
            
            display_error_only_text(response.err_message + ".");
          }
        },
        error:function (xhr, textStatus, thrownError){
          $('#DIeCommFrame_payment').attr( 'src', '/payment/getpaymetricform/LEED:' + getUrlParameter('LEED') + '/page:payment' + '/');
          $("#preloader_activationFlow").hide();
          $("#status_activationFlow").hide();

          $('#confirm_payment').prop('disabled',false);
          $('#confirm_payment').removeClass('disable');
          
          if (payment_mode == "credit"){
            display_error_only_text("An error occurred while submitting your details. Please confirm the information before trying again.");
          }
          else{
            display_error_only_text("An error occurred while submitting your details. Please confirm the information before trying again.");
          }

        }
      });
    }
  }

  function submitDetails() 
  {
    var paymetricFlag = true;
    if (paymode_flag == false){
      submit_CC_values(paymetricFlag, "");
    }
    else{
      paymetricFlag = false;
      submit_CC_values(paymetricFlag, "");
    }
    // $('#preloder').show();

    successSubmitValues();
    $('#confirm_payment').prop('disabled','true');
    $('#confirm_payment').addClass('disable');
  }

  function correctColor()
  {
    if(String($('#month :selected').text()) == "Month")
    {
        $('#month').css("border-color", "rgba(243,54,59,1)");   
    }
    else
    {
        $('#month').css("border-color", "rgba(204,204,204,1)");  
    }
    if(String($('#year :selected').text()) == "Year")
    {
        $('#year').css("border-color", "rgba(243,54,59,1)");   
    }
    else
    {
        $('#year').css("border-color", "rgba(204,204,204,1)");  
    }
    if(String($('#country1 :selected').text()) == "Select Country")
    {
        $('#country1').css("border-color", "rgba(243,54,59,1)");   
    }
    else
    {
        $('#country1').css("border-color", "rgba(204,204,204,1)");  
    }
    if(String($('#state1 :selected').text()) == "Select State")
    {
        $('#state1').css("border-color", "rgba(243,54,59,1)");   
    }
    else
    {
        $('#state1').css("border-color", "rgba(204,204,204,1)");  
    }      
  }







  //building info and building setup starts
  function buildingSetup () {

      $('#activation_modal_container').removeClass('activation_modal_w450').addClass('activation_modal_w875');

      $('.back_btn_access').html('< CHECKLIST');
      $('.back_btn_access, .back_btn').attr('onclick','').unbind('click');
      $('.back_btn_access, .back_btn').on('click', function(){
        $('#activation_modal').modal('hide');
        $('#skipped_modal').modal('hide');
        $('#project_is_active').modal('show');
      });

      $('.time_calc').on('hidden.bs.modal', function () {
        $('#activation_modal').modal('toggle');
      });

      $('.hours_input_2').on('click', function(){
        $('#activation_modal').modal('toggle');
        $('.time_calc').modal('toggle');
      });

      $('#close_buildingInfo_modal').on('click', function(){
        window.location.href = main_dashboard_url;
      });

      $('#correct_btn').on('click', function(){
        if (check_BackAndNextPage('buildingInfo', 'next', global_version) == undefined){
           window.location.href=main_dashboard_url;
        }
        else{
          ajax_call(check_BackAndNextPage('buildingInfo', 'next', global_version));
        }
      });

      /////////// building info and building setup data code starts /////////////////////////
      var lid = getUrlParameter('LEED');
      getBuildingInfo(lid);

      $('body').on('change', '.enable_edit', function() {
        editBuildingInfo(lid, $(this));
      });

      $('.time.from').timepicker({scrollDefault:'7:00', timeFormat:'H:i', 'noneOption':[{'label':"Closed",'className': 'shibby','value': "Closed"}]});
      $('.time.to').timepicker({scrollDefault:'18:00', timeFormat:'H:i', 'noneOption':[{'label':"Closed",'className': 'shibby','value': "Closed"}]});

      //Changes from timecalculator.js
      
      $('.hours_input_2').on('click', function () {
        if(!$('#building_setup_modal').hasClass('in')) {
          mondayHours = 11;
          tuesdayHours = 11;
          wednesdayHours = 11;
          thursdayHours = 11;
          fridayHours = 11;
          saturdayHours = 0;
          sundayHours = 0;
          totalHours = 0;
      function calcDifference(toValue,fromValue)
      {
       if(fromValue != "Closed" && toValue != "Closed")
          {
            fromHoursMinutes = fromValue.split(/[.:]/);
            fromHours = parseInt(fromHoursMinutes[0], 10);
            fromMinutes = parseInt(fromHoursMinutes[1], 10);
            toHoursMinutes = toValue.split(/[.:]/);
            toHours = parseInt(toHoursMinutes[0], 10);
            toMinutes = parseInt(toHoursMinutes[1], 10);
            difference = (toHours - fromHours) + ((toMinutes - fromMinutes) / 60);
            return difference;
         }
         else
         {
          return 0;
         }
      }
      totalHours = totalHours + calcDifference(document.getElementById('monday_to_btn').value,document.getElementById('monday_from_btn').value);
      totalHours = totalHours + calcDifference(document.getElementById('tuesday_to_btn').value,document.getElementById('tuesday_from_btn').value);
      totalHours = totalHours + calcDifference(document.getElementById('wednesday_to_btn').value,document.getElementById('wednesday_from_btn').value);
      totalHours = totalHours + calcDifference(document.getElementById('thursday_to_btn').value,document.getElementById('thursday_from_btn').value);
      totalHours = totalHours + calcDifference(document.getElementById('friday_to_btn').value,document.getElementById('friday_from_btn').value);
      totalHours = totalHours + calcDifference(document.getElementById('saturday_to_btn').value,document.getElementById('saturday_from_btn').value);
      totalHours = totalHours + calcDifference(document.getElementById('sunday_to_btn').value,document.getElementById('sunday_from_btn').value);
      $('#totalHours').val(totalHours);
      }
      else{
          // $('#totalHours_bldSetup').val("");
      }
      });

    $('.start-time,.end-time').on('change',function(){
          var day, fromHours, fromHoursMinutes, fromMinutes, fromValue, name, toHours, toHoursMinutes, toMinutes, toValue;
          fromValue = $(this).closest('.timepicker_drp_div').parent().find('.start-time').val();
          toValue = $(this).closest('.timepicker_drp_div').parent().find('.end-time').val();

          if ($(this).attr("class").indexOf('start-time') > -1){
            if (fromValue == "Closed"){
              $(this).closest('.timepicker_drp_div').parent().find('.end-time').val("Closed");
            }
          }
          else if ($(this).attr("class").indexOf('end-time') > -1){
            if (toValue == "Closed"){
              $(this).closest('.timepicker_drp_div').parent().find('.start-time').val("Closed");
            }
          }



      if(!fromValue && !toValue && fromValue != "Closed" && toValue != "Closed")
      {
        name = $(this).attr('id').split('_');
              day = name[0];
        switch(day) {
          case "sunday":
            document.getElementById('sunday_to_btn').style.borderColor = "#e5e5e5";
            document.getElementById('sunday_from_btn').style.borderColor = "#e5e5e5";
            sundayHours = 0;
            break;
          case "monday":
            document.getElementById('monday_to_btn').style.borderColor = "#e5e5e5";
            document.getElementById('monday_from_btn').style.borderColor = "#e5e5e5";
            mondayHours = 0;
            break;
          case "tuesday":
            document.getElementById('tuesday_to_btn').style.borderColor = "#e5e5e5";
            document.getElementById('tuesday_from_btn').style.borderColor = "#e5e5e5";
            tuesdayHours = 0;
            break;
          case "wednesday":
            document.getElementById('wednesday_to_btn').style.borderColor = "#e5e5e5";
            document.getElementById('wednesday_from_btn').style.borderColor = "#e5e5e5";
            wednesdayHours = 0;
            break;
          case "thursday":
            document.getElementById('thursday_to_btn').style.borderColor = "#e5e5e5";
            document.getElementById('thursday_from_btn').style.borderColor = "#e5e5e5";
            thursdayHours = 0;
            break;
          case "friday":
            document.getElementById('friday_to_btn').style.borderColor = "#e5e5e5";
            document.getElementById('friday_from_btn').style.borderColor = "#e5e5e5";
            fridayHours = 0;
            break;
          case "saturday":
            document.getElementById('saturday_to_btn').style.borderColor = "#e5e5e5";
            document.getElementById('saturday_from_btn').style.borderColor = "#e5e5e5";
            saturdayHours = 0;
            break;
        }
      }
      if((fromValue && !toValue  && fromValue != "Closed" && toValue != "Closed") || (!fromValue && toValue  && fromValue != "Closed" && toValue != "Closed"))
      {
        name = $(this).attr('id').split('_');
              day = name[0];
        switch(day) {
          case "sunday":
            document.getElementById('sunday_to_btn').style.borderColor = "rgb(243,54,59)";
            document.getElementById('sunday_from_btn').style.borderColor = "rgb(243,54,59)";
            sundayHours = 0;
            break;
          case "monday":
            document.getElementById('monday_to_btn').style.borderColor = "rgb(243,54,59)";
            document.getElementById('monday_from_btn').style.borderColor = "rgb(243,54,59)";
            mondayHours = 0;
            break;
          case "tuesday":
            document.getElementById('tuesday_to_btn').style.borderColor = "rgb(243,54,59)";
            document.getElementById('tuesday_from_btn').style.borderColor = "rgb(243,54,59)";
            tuesdayHours = 0;
            break;
          case "wednesday":
            document.getElementById('wednesday_to_btn').style.borderColor = "rgb(243,54,59)";
            document.getElementById('wednesday_from_btn').style.borderColor = "rgb(243,54,59)";
            wednesdayHours = 0;
            break;
          case "thursday":
            document.getElementById('thursday_to_btn').style.borderColor = "rgb(243,54,59)";
            document.getElementById('thursday_from_btn').style.borderColor = "rgb(243,54,59)";
            thursdayHours = 0;
            break;
          case "friday":
            document.getElementById('friday_to_btn').style.borderColor = "rgb(243,54,59)";
            document.getElementById('friday_from_btn').style.borderColor = "rgb(243,54,59)";
            fridayHours = 0;
            break;
          case "saturday":
            document.getElementById('saturday_to_btn').style.borderColor = "rgb(243,54,59)";
            document.getElementById('saturday_from_btn').style.borderColor = "rgb(243,54,59)";
            saturdayHours = 0;
            break;
        }
      }
      if (fromValue && toValue) {
        fromHoursMinutes = fromValue.split(/[.:]/);
        fromHours = parseInt(fromHoursMinutes[0], 10);
        fromMinutes = parseInt(fromHoursMinutes[1], 10);
        toHoursMinutes = toValue.split(/[.:]/);
        toHours = parseInt(toHoursMinutes[0], 10);
        toMinutes = parseInt(toHoursMinutes[1], 10);
        difference = (toHours - fromHours) + ((toMinutes - fromMinutes) / 60);
        name = $(this).attr('id').split('_');
        day = name[0];

        if (fromValue == "Closed" || toValue == "Closed"){
          difference = 0;
        }

        switch (day) {
          case "sunday":
            sundayHours = difference;
            if(sundayHours<0)
            {
              document.getElementById('sunday_to_btn').style.borderColor = "rgb(243,54,59)";
              document.getElementById('sunday_from_btn').style.borderColor = "rgb(243,54,59)";
            }
            else
            {
              document.getElementById('sunday_to_btn').style.borderColor = "rgb(57,180,70)";
              document.getElementById('sunday_from_btn').style.borderColor = "rgb(57,180,70)";
            }
            break;
          case "monday":
            mondayHours = difference;
            if(mondayHours<0)
            {
              document.getElementById('monday_to_btn').style.borderColor = "rgb(243,54,59)";
              document.getElementById('monday_from_btn').style.borderColor = "rgb(243,54,59)";
            }
            else
            {
              document.getElementById('monday_to_btn').style.borderColor = "rgb(57,180,70)";
              document.getElementById('monday_from_btn').style.borderColor = "rgb(57,180,70)";
            }
            break;
          case "tuesday":
            tuesdayHours = difference;
            if(tuesdayHours<0)
            {
              document.getElementById('tuesday_to_btn').style.borderColor = "rgb(243,54,59)";
              document.getElementById('tuesday_from_btn').style.borderColor = "rgb(243,54,59)";
            }
            else
            {
              document.getElementById('tuesday_to_btn').style.borderColor = "rgb(57,180,70)";
              document.getElementById('tuesday_from_btn').style.borderColor = "rgb(57,180,70)";
            }
            break;
          case "wednesday":
            wednesdayHours = difference;
            if(wednesdayHours<0)
            {
              document.getElementById('wednesday_to_btn').style.borderColor = "rgb(243,54,59)";
              document.getElementById('wednesday_from_btn').style.borderColor = "rgb(243,54,59)";
            }
            else
            {
              document.getElementById('wednesday_to_btn').style.borderColor = "rgb(57,180,70)";
              document.getElementById('wednesday_from_btn').style.borderColor = "rgb(57,180,70)";
            } 
            break;
          case "thursday":
            thursdayHours = difference;
            if(thursdayHours<0)
            {
              document.getElementById('thursday_to_btn').style.borderColor = "rgb(243,54,59)";
              document.getElementById('thursday_from_btn').style.borderColor = "rgb(243,54,59)";
            }
            else
            {
              document.getElementById('thursday_to_btn').style.borderColor = "rgb(57,180,70)";
              document.getElementById('thursday_from_btn').style.borderColor = "rgb(57,180,70)";
            }
          break;
          case "friday":
            fridayHours = difference;
            if(fridayHours<0)
            {
              document.getElementById('friday_to_btn').style.borderColor = "rgb(243,54,59)";
              document.getElementById('friday_from_btn').style.borderColor = "rgb(243,54,59)";
            }
            else
            {
              document.getElementById('friday_to_btn').style.borderColor = "rgb(57,180,70)";
              document.getElementById('friday_from_btn').style.borderColor = "rgb(57,180,70)";
            }
            break;
          case "saturday":
            saturdayHours = difference;
            if(saturdayHours<0)
            {
              document.getElementById('saturday_to_btn').style.borderColor = "rgb(243,54,59)";
              document.getElementById('saturday_from_btn').style.borderColor = "rgb(243,54,59)";
            }
            else
            {
              document.getElementById('saturday_to_btn').style.borderColor = "rgb(57,180,70)";
              document.getElementById('saturday_from_btn').style.borderColor = "rgb(57,180,70)";
            }
            break;
        }
        }
          totalHours_bldSetup = sundayHours + mondayHours + tuesdayHours + wednesdayHours + thursdayHours + fridayHours + saturdayHours;
          $('#totalHours').val(totalHours_bldSetup);
          
        if(document.getElementById('sunday_to_btn').style.borderColor == "rgb(243, 54, 59)" || document.getElementById('monday_to_btn').style.borderColor == "rgb(243, 54, 59)" ||
          document.getElementById('tuesday_to_btn').style.borderColor == "rgb(243, 54, 59)" || document.getElementById('wednesday_to_btn').style.borderColor == "rgb(243, 54, 59)" ||
          document.getElementById('thursday_to_btn').style.borderColor == "rgb(243, 54, 59)" || document.getElementById('friday_to_btn').style.borderColor == "rgb(243, 54, 59)" ||
          document.getElementById('saturday_to_btn').style.borderColor == "rgb(243, 54, 59)" || document.getElementById('sunday_from_btn').style.borderColor == "rgb(243, 54, 59)" || document.getElementById('monday_from_btn').style.borderColor == "rgb(243, 54, 59)" ||
          document.getElementById('tuesday_from_btn').style.borderColor == "rgb(243, 54, 59)" || document.getElementById('wednesday_from_btn').style.borderColor == "rgb(243, 54, 59)" ||
          document.getElementById('thursday_from_btn').style.borderColor == "rgb(243, 54, 59)" || document.getElementById('friday_from_btn').style.borderColor == "rgb(243, 54, 59)" ||
          document.getElementById('saturday_from_btn').style.borderColor == "rgb(243, 54, 59)")
        {
          document.getElementById('totalHours').style.borderColor = "rgb(243, 54, 59)";
          document.getElementById('alert_onDiff_opr').style.display = "block";
        }
        else
        {
          document.getElementById('totalHours').style.borderColor = "rgb(57, 180, 70)";
          document.getElementById('alert_onDiff_opr').style.display = "none";
        }
        //}
          return $('#totalHours').trigger('change');
        });

        $('body').on('click', '#week_total_btn', function() {
          var total_hours_calculated = $('#totalHours').val();
          $('#hours_input').val(total_hours_calculated);
          editBuildingInfo(lid, $('#hours_input'));
        });
      // Changes end

      function getBuildingInfo(lid) {

        var final_state;

        $.ajax({
          type: "GET",
          url: "assets/json/building_" + window.leed_id + ".json"
        }).done(function(data) {

          if ((data.state).length > 2){
             final_state = (data.state).substring(2, (data.state).length);
          }

          print_country("building_country");
          print_state('building_state', $("#building_country option:selected").val());
          $("#building_country option").filter(function() {

            return $(this).val() == data.country;
          }).attr('selected', true);
          print_state('building_state', data.country);
          $('#building_state').val(final_state);

          $('#building_country').prop('disabled',true);
          $('#building_state').prop('disabled',true);
          $('#building_name_flow').val(data.name);
          $('#building_id').val(data.leed_id);
          $('#building_year').val(data.year_constructed);
          $('#building_street').val(data.street);
          $('#building_city').val(data.city);
          //$('#building_address').val(data.street + ', ' + data.city + ', ' + data.state + ', ' + data.country);
          $('#gfa_input').val(data.gross_area);
          $('#occ_input').val(data.occupancy);
          $('#hours_input').val(data.operating_hours);
          $('#building_zipcode').val(data.zip_code);

          if(data.gross_area == 0)
          {
            $('#edit_btn').click();
//            $('body').on('change', '.enable_edit', function() {
//              editBuildingInfo(lid, $(this));
//            }); 
            $('#gfa_input').css("border-color", "rgba(243,54,59,1)");
            $('#edit_btn').attr('disabled',true);
          }

        });
      }

      function editBuildingInfo(lid, $self) {
        //$('.enable_edit').on('change', function() {
          var $self, field, json, newVal;
          var err_flag = false;

          newVal = $self.val().trim();
          field = $self.attr('name');
          
          if($self.attr('id') == 'gfa_input')
          {
              chkNo = 0;
              for(i=0;i<$self.val().length;i++)
              {
                  if($self.val()[i] != ',')
                  {
                    if(String(parseInt($self.val()[i])) == "NaN" && $self.val()[i] != ".")
                      {
                          $self.css("border-color", "rgba(243,54,59,1)");
                          $('#edit_btn').attr('disabled',true);
                          chkNo = 0;
                          return false;
                      }
                      else
                      {
                          chkNo = 1;
                          $self.css("border-color", "rgba(204,204,204,1)");
                          $('#edit_btn').attr('disabled',false);    
                      }    
                  }
              }
              if(chkNo == 1 && parseInt($self.val()) == 0)
              {
                  $self.css("border-color", "rgba(243,54,59,1)");
                  $('#edit_btn').attr('disabled',true);
                  return false;
              }
              newVal = $('#gfa_input').val().replace(/,/g, ''); 
          }
          else if($self.attr('id') == 'occ_input')
          {
              for(i=0;i<$self.val().length;i++)
              {
                  if(String(parseInt($self.val()[i])) == "NaN")
                  {
                      $self.css("border-color", "rgba(243,54,59,1)");
                      $('#edit_btn').attr('disabled',true);
                      return false;
                  }
                  else
                  {
                      $self.css("border-color", "rgba(204,204,204,1)");  
                      $('#edit_btn').attr('disabled',false);  
                  }
              }
          }
          else if ($self.attr('id') === 'hours_input')
          {
              if ($self.val() == ""){
                $self.css("border-color", "rgba(204,204,204,1)"); 
                $('#edit_btn').attr('disabled',false);
              }
              else{
                if(parseInt($self.val()) <= 168)
                {
                    $('#edit_btn').attr('disabled',false);

                    for(i=0;i<$self.val().length;i++)
                    {
                        if(String(parseInt($self.val()[i])) == "NaN" && $self.val()[i] != ".")
                        {
                            $self.css("border-color", "rgba(243,54,59,1)");
                            $('#edit_btn').attr('disabled',true);
                            return false;
                        }
                        else
                        {
                            $self.css("border-color", "rgba(204,204,204,1)"); 
                            $('#edit_btn').attr('disabled',false);   
                        }
                    }    
                }
                else
                {
                    $self.css("border-color", "rgba(243,54,59,1)");
                    $('#edit_btn').attr('disabled',true);  
                    return false; 
                }
              }
          }
          else if($self.attr('id') === 'building_city')
          {
              if(!(String(parseInt($self.val())) == "NaN") || ($self.val()).toString().length > 64){
                  $self.css("border-color", "rgba(243,54,59,1)");
                  $('#edit_btn').attr('disabled',true);
                  return false;
              }
              else{
                $self.css("border-color", "rgba(204,204,204,1)");
                $('#edit_btn').attr('disabled',false);
              }
          }
          else if($self.attr('id') === 'building_year')
          {
            if (newVal == ""){
              $self.css("border-color", "rgba(204,204,204,1)");
              $('#edit_btn').attr('disabled',false);
            }
            else{
              if (newVal < 1000 || newVal > 9999 || isNaN(newVal) || newVal > (new Date()).getFullYear()) {
                $('#edit_btn').attr('disabled',true);
                return $('#building_year').css("border-color", "rgba(243,54,59,1)");
              }
              else{
                $self.css("border-color", "rgba(204,204,204,1)");
                $('#edit_btn').attr('disabled',false);
              }
            }
          }
          else if($self.attr('id') === 'building_zipcode')
          {
            if (newVal == ""){
              $self.css("border-color", "rgba(243,54,59,1)");
              $('#edit_btn').attr('disabled',true);  
              return false;
            }
            else{
              if(($self.val()).toString().length <= 10)
                {
                  $('#edit_btn').attr('disabled',false);
                  $self.css("border-color", "rgba(204,204,204,1)");   
              }
              else
              {
                  $self.css("border-color", "rgba(243,54,59,1)");
                  $('#edit_btn').attr('disabled',true);  
                  return false; 
              }
            }
          }
          else if($self.attr('id') === 'building_name')
          {
              if(($self.val()).toString().length > 64) {
                  $self.css("border-color", "rgba(243,54,59,1)");
                  $('#edit_btn').attr('disabled',true);
                  return false;
              }
              else{
                $self.css("border-color", "rgba(204,204,204,1)");
                $('#edit_btn').attr('disabled',false);
              }
          }
          else if($self.attr('id') === 'building_street')
          {
              if(($self.val()).toString().length > 128) {
                  $self.css("border-color", "rgba(243,54,59,1)");
                  $('#edit_btn').attr('disabled',true);
                  return false;
              }
              else{
                $self.css("border-color", "rgba(204,204,204,1)");
                $('#edit_btn').attr('disabled',false);
              }
          }

          $self.addClass('ajax_loader_dash');
          if($self.attr('id') === 'building_year' || $self.attr('id') === 'building_name' || $self.attr('id') === 'zipcode'  ||  $self.attr('id') === 'building_street' || $self.attr('id') === 'building_state' || $self.attr('id') === 'building_country')
          {
           $self.css("border-color", "rgba(204,204,204,1)");
          }
          json = {};
          if (newVal == ""){
            newVal = null;
          }
          json[field] = newVal;
          // return $.ajax({
          //   url: '/buildings/LEED:' + lid + '/',
          //   type: 'PUT',
          //   contentType: 'application/json',
          //   data: JSON.stringify(json)
          // }).done(function(data) {
            $('#edit_btn').removeClass('disabled');
            return $self.removeClass('ajax_loader_dash');
          // }).fail(function(data) {
          //   $('.form-control[name='+field+']').css('border-color', 'red');
          //   $('#edit_btn').addClass('disabled');
          //   return $self.removeClass('ajax_loader_dash');
          // });
      }

      $('#edit_btn').on('click', function() {
        if($('#edit_btn').val()== 'EDIT') {
          $('#building_id').attr('disabled', 'true');
          $('.enable_edit').attr('readonly', false);  
          $('.enable_edit').removeClass('disable_edit');
          $('.enable_edit').removeClass('not-active');
          $('.enable_edit').addClass('form-control');
          $('.enable_edit').addClass('height_35');
          $('#hours_input').addClass('hours_input_calc');
          $('.hours_input_2').show();
          $('#edit_btn').val('DONE');
          $('#correct_btn').attr('disabled',true);
          $('#building_country').prop('disabled',false);
          $('#building_state').prop('disabled',false);
        }
        else if($('#edit_btn').val()== 'DONE') {
          $('#building_id').removeAttr('disabled');
          $('.enable_edit').attr('readonly', true);
          if($('.enable_edit').hasClass('editable'))
          $('.editable').attr('readonly', false);
          $('#edit_btn').val('EDIT');
          $('.enable_edit').addClass('disable_edit');
          $('.enable_edit').addClass('not-active');
          $('.enable_edit').removeClass('form-control');
          $('.enable_edit').removeClass('height_35');
          $('#hours_input').removeClass('hours_input_calc');
          $('.hours_input_2').hide();
          $('#correct_btn').attr('disabled',false);
          $('#building_country').prop('disabled',true);
          $('#building_state').prop('disabled',true);
        }
      });
  }
  //building info and building setup ends

  //Software subscription starts
  function softwareSubscription()
  {

      $('#activation_modal_container').removeClass('activation_modal_w450').addClass('activation_modal_w875');
      if (!only_payment_pages){
        $('.back_btn_access').show();
        $('.back_btn').show();
      }
      else{
        $('.back_btn_access').hide();
        $('.back_btn').hide();
      }

      $('.back_btn_access').html('< REVIEW INFO');
      $('.back_btn_access, .back_btn').attr('onclick','').unbind('click');
      $('.back_btn_access, .back_btn').on('click', function(){
        if (check_BackAndNextPage('softwareSubscription', 'back', 'full') == undefined){
           window.location.href=main_dashboard_url;
        }
        else{
          ajax_call(check_BackAndNextPage('softwareSubscription', 'back', 'full'));
        }
      });

      $('.forward_btn_access').html('DISPLAY >');
      $('.forward_btn_access, .forward_btn').attr('onclick','').unbind('click');
      $('.forward_btn_access, .forward_btn').on('click', function(){
        ajax_call('hardwareSubscription');
      });

      for(var i=1; i<101; i++)
      {
          if(i == 1)
              $("#year").html($("#year").html() + '<option value="'+i+'">'+i+' Year</option>');  
          else if(i == term_of_com_global)
              $("#year").html($("#year").html() + '<option value="'+i+'" selected>'+i+' Years</option>'); 
          else
              $("#year").html($("#year").html() + '<option value="'+i+'">'+i+' Years</option>');       
      }
      
      $('.sw_term_select_year').on('change', function ()
      {
          if($('.sw_term_select_year :selected').text() == '100 Years')
            term_of_com_global = 100;
          else
            term_of_com_global = parseInt($('.sw_term_select_year :selected').text().substring(0,2).trim());
          
          sendValuesTotal('softwareSubscription');
      });
      
      $("#continue2").on('click', function()
      {
        ajax_call('hardwareSubscription');
      });
      
      $(".skip_for_now, #close_softwareSubscription_modal").on('click', function()
      { 
        if (only_payment_pages){
          if (UI_Version == 'v2'){
            var switch_url = window.location.protocol + '//' + window.location.host + '/v2' + window.location.pathname + window.location.hash;
            window.location = plaqueNav.switchUIException(plaqueNav.getParameterByName('page'), plaqueNav.getParameterByName('section'), switch_url);
          }
          else{
            if (msieversion() == 9){
              window.location.href = window.location.href.split(window.location.protocol + '//' + window.location.hostname)[1].split('&trigger=')[0].split('&modal=')[0];
              return false;
            }
            else{
              window.history.pushState({}, 'account', window.location.href.split(window.location.protocol + '//' + window.location.hostname)[1].split('&trigger=')[0].split('&modal=')[0]); 
            }
            $('#activation_modal').modal('hide');
          }
        }
        else if (window.plaque.getMeterData.unique_notification_arr.indexOf("skipped_buildingConfirmation") > -1){
          ajax_call('buildingConfirmation');
        }
        else{
          $('#activation_modal').modal('hide');
          $('#skipped_modal').modal('hide');
          $('#project_is_active').modal('show');
        }
      });

      if(window.PAYMENT_VERSION == 'V2')
        {
            $('.summaryCost').html('Your subscription can be paid in <b>annual increments of <span class="amount_yearly"></span></b></span>.');    
        }
      
      selectedOrderData('softwareSubscription');
      
  }
  //Software subscription ends

  //Hardware Subscription starts
  function hardwareSubscription()
  {    

    $('#activation_modal_container').removeClass('activation_modal_w450').addClass('activation_modal_w875');
    
    $('.back_btn_access').show();
    $('.back_btn').show();

    $('.back_btn_access').html('< SUBSCRIBE');
    $('.back_btn_access, .back_btn').attr('onclick','').unbind('click');
    $('.back_btn_access, .back_btn').on('click', function(){
      ajax_call('softwareSubscription');
    });

    $('.forward_btn_access').html('PAYMENT PLAN >');
    $('.forward_btn_access, .forward_btn').attr('onclick','').unbind('click');
    $('.forward_btn_access, .forward_btn').on('click', function(){
      ajax_call('orderSelection');
    });

    $("#continue3, #previous3").on('click', function()
    {
      if ($(this).attr('id') == "previous3"){
        want_plaque_global = false;
      }
      else{
        want_plaque_global = true;
      }
      $('#preloader_activationFlow').show();
      $('#status_activationFlow').show();
      
      var csrftoken = getCookie('csrftoken');
      $.ajax({
         type:"GET",
         url:"/payment/calculatetotal/LEED:" + getUrlParameter('LEED') + "/",
         data: {
                'want_plaque': want_plaque_global,
                'purchase_plaque': purchase_plaque_global,
                'pay_full': pay_full_global,
                'term_slider': term_of_com_global,
                'page': 'hardwareSubscription'
           }
          }).done(function(data){
            ajax_call('orderSelection');
          }).error(function() {
            $('#preloader_activationFlow').hide();
            $('#status_activationFlow').hide();
          });
    });

    $(".skip_for_now, #close_hardwareSubscription_modal").on('click', function()
    {
      if (only_payment_pages){
        if (UI_Version == 'v2'){
          var switch_url = window.location.protocol + '//' + window.location.host + '/v2' + window.location.pathname + window.location.hash;
          window.location = plaqueNav.switchUIException(plaqueNav.getParameterByName('page'), plaqueNav.getParameterByName('section'), switch_url);
        }
        else{
          if (msieversion() == 9){
            window.location.href = window.location.href.split(window.location.protocol + '//' + window.location.hostname)[1].split('&trigger=')[0].split('&modal=')[0];
            return false;
          }
          else{
            window.history.pushState({}, 'account', window.location.href.split(window.location.protocol + '//' + window.location.hostname)[1].split('&trigger=')[0].split('&modal=')[0]);
          }
          $('#activation_modal').modal('hide');
        }
        
      }
      else if (window.plaque.getMeterData.unique_notification_arr.indexOf("skipped_buildingConfirmation") > -1){
        ajax_call('buildingConfirmation');
      }
      else{
        $('#activation_modal').modal('hide');
        $('#skipped_modal').modal('hide');
        $('#project_is_active').modal('show');
      }
    });
      
      
      if(window.PAYMENT_VERSION == 'V2')
        {
            $('.summaryCost').html('Your subscription can be paid in <b>annual increments of <span class="amount_yearly"></span></b></span>.');    
        }

    selectedOrderData('hardwareSubscription');

  }
  //Hardware Subscription ends

  //OrderSelection starts
  function orderSelection(){
      
      if(window.PAYMENT_VERSION == 'V2')
      {
        purchase_plaque_global = true;    
      }

    $('#activation_modal_container').removeClass('activation_modal_w450').addClass('activation_modal_w875');

    $('.back_btn_access').html('< DISPLAY');
    $('.back_btn_access, .back_btn').attr('onclick','').unbind('click');
    $('.back_btn_access, .back_btn').on('click', function(){
      ajax_call('hardwareSubscription');
    });

    $('.forward_btn_access').html('PAYMENT INFO >');
    $('.forward_btn_access, .forward_btn').attr('onclick','').unbind('click');
    $('.forward_btn_access, .forward_btn').on('click', function(){
      ajax_call('payment');
    });

    if (want_plaque_global == true){
      $('.payment_option_1').html('Pay annually for both display and subscription');
      $('.payment_option_2').html('Pay up front for both display and subscription');
      $('.payment_option_3').show();
    }
    else{
      $('.payment_option_1').html('Pay annually for subscription');
      $('.payment_option_2').html('Pay up front for subscription');
      $('.payment_option_3').hide();
    }

    /*$('#payment_plan_select').on('change', function ()
    {
      if ($('#payment_plan_select').val() == '1')
      {
        purchase_plaque_global = false;
        pay_full_global        = false;
      }
      else if ($('#payment_plan_select').val() == '2'){
        purchase_plaque_global = true;
        pay_full_global        = true;
      }
      else if ($('#payment_plan_select').val() == '3'){
        purchase_plaque_global = true;
        pay_full_global        = false;
      }
      sendValuesTotal('orderSelection');
    });*/
    
  $(document).on('click', function(e)
  {
      var container = $("#payment_plan_select");

      if (!container.is(e.target) // if the target of the click isn't the container...
          && container.has(e.target).length === 0) // ... nor a descendant of the container
      {
          if($('.optionsCont').css('display') != 'none')
          {
            $('.optionsCont').hide(); 
          }
      }
  });

  $('#payment_plan_select').on('click', function()
  {
    
    // $(document).mouseup(function(e)
    // {
    //     var container = $(".meterInfo");

    //     if (!container.is(e.target) // if the target of the click isn't the container...
    //         && container.has(e.target).length === 0) // ... nor a descendant of the container
    //     {
    //         if ($(".notification_module").css("display") == "block")
    //         {
    //             $(".notification_module").toggle(300);
    //         }
    //     }
    // });

    if($('.optionsCont').css('display') == 'none')
    {
      $('.optionsCont').show(); 
    }
    else
    {
      $('.optionsCont').hide();
    }
    
        var csrftoken = getCookie('csrftoken');
        wantP = want_plaque_global;
        $.ajax(
    {
      type:"GET",
      url:"/payment/calculatetotal/LEED:" + getUrlParameter('LEED') + "/",
      data: 
      {
        'want_plaque': wantP,
        'purchase_plaque': false,
        'pay_full': false,
        'term_slider': term_of_com_global
      },
      success: function(data)
      {
        $('#value_1').html(numericToString(data.tot_cost) + ' /year');
      }
    });
    if(window.PAYMENT_VERSION == 'V1')
    {
      $.ajax(
      {
        type:"GET",
        url:"/payment/calculatetotal/LEED:" + getUrlParameter('LEED') + "/",
        data: 
        {
          'want_plaque': wantP,
          'purchase_plaque': true,
          'pay_full': true,
          'term_slider': term_of_com_global
        },
        success: function(data)
        {
          $('#value_2').html(numericToString(data.tot_cost) + ' now');
        }
      }); 
    }
    $.ajax(
    {
      type:"GET",
      url:"/payment/calculatetotal/LEED:" + getUrlParameter('LEED') + "/",
      data: 
      {
        'want_plaque': wantP,
        'purchase_plaque': true,
        'pay_full': false,
        'term_slider': term_of_com_global
      },
      success: function(data)
      {
                if(window.PAYMENT_VERSION == 'V1')
                {
                    $('#value_3').html(numericToString(data.plaque_cost) + ' now + ' + numericToString(data.subs_price) + ' /year');   
                }
                else
                {
                    $('#value_2').html(numericToString(data.tot_cost) + ' now ');    
                }
      }
    });
  });
    
  $('.options').on('click', function()
  {
    if($(this).attr('value') == '1')
    {
      $('#payment_plan_select').val('1');
      purchase_plaque_global = false;
          pay_full_global        = false;
    }
    else if($(this).attr('value') == '2')
    {
      $('#payment_plan_select').val('2');
      purchase_plaque_global = true;
          pay_full_global        = true;
    }
    else if($(this).attr('value') == '3')
    {
      $('#payment_plan_select').val('3');
      purchase_plaque_global = true;
          pay_full_global        = false;
    }
    sendValuesTotal('orderSelection');
  });

    $("#continue4").on('click', function()
    {
      ajax_call('payment');
    });

    $(".skip_for_now, #close_orderSelection_modal").on('click', function()
    {
      if (only_payment_pages){
        if (UI_Version == 'v2'){
          var switch_url = window.location.protocol + '//' + window.location.host + '/v2' + window.location.pathname + window.location.hash;
          window.location = plaqueNav.switchUIException(plaqueNav.getParameterByName('page'), plaqueNav.getParameterByName('section'), switch_url);
        }
        else{
          if (msieversion() == 9){
            window.location.href = window.location.href.split(window.location.protocol + '//' + window.location.hostname)[1].split('&trigger=')[0].split('&modal=')[0];
            return false;
          }
          else{
            window.history.pushState({}, 'account', window.location.href.split(window.location.protocol + '//' + window.location.hostname)[1].split('&trigger=')[0].split('&modal=')[0]);          
          }
          $('#activation_modal').modal('hide');
        }
      }
      else if (window.plaque.getMeterData.unique_notification_arr.indexOf("skipped_buildingConfirmation") > -1){
        ajax_call('buildingConfirmation');
      }
      else{
        $('#activation_modal').modal('hide');
        $('#skipped_modal').modal('hide');
        $('#project_is_active').modal('show');
      }
    });

    selectedOrderData('orderSelection');

  }
  //OrderSelection ends

  //payment starts
  function payment(){

      print_country("country1");
      print_state("state1", "");
      print_country("country2");
      print_state("state2", "");

    $('#activation_modal_container').removeClass('activation_modal_w450').addClass('activation_modal_w875');

    $('.back_btn_access').html('< PAYMENT PLAN');
    $('.back_btn_access, .back_btn').attr('onclick','').unbind('click');
    $('.back_btn_access, .back_btn').on('click', function(){
      paymentFieldAlert('orderSelection');
    });

    $('.forward_btn_access').html('');
    $('.forward_btn_access, .forward_btn').attr('onclick','').unbind('click');
    $('.forward_btn_access, .forward_btn').on('click', function(){
      ajax_call('receipt');
    });

    var DIeCommFrame_url = '/payment/getpaymetricform/LEED:' + getUrlParameter('LEED') + '/page:payment' + '/';
    $("#DIeCommFrame_payment").attr('data-src',DIeCommFrame_url);
    var DIeCommFrame_iframe = $("#DIeCommFrame_payment");
    DIeCommFrame_iframe.attr("src", DIeCommFrame_iframe.data("src"));
    $('iframe#DIeCommFrame_payment').load(function(){

      makePaymetricFormResponsive();

      if((this.contentWindow.location.href).indexOf("paynow") > -1){
        paymetric_url = this.contentWindow.location.href.split("/?&r=")
        var paymetricFlag = false;
        submit_CC_values(paymetricFlag, paymetric_url[1]);
      }
    });

    $('.pay_mode').click(function()
  {   
      if($(this).attr("value")=="card")
      {   
		mode_check = false;
        paymode_flag = false;
        $('#check').attr("src", "assets/images/radioEmpty.png");
        $('#card').attr("src", "assets/images/radioFull.png");
        $("#DIeCommFrame_payment").show();
        if (pay_full_global == false) {
          $('#auto_renewal_com_box').show();
        }
        $(".instruction_section").hide();
        $('#cc').css("font-weight","Bold");
        $('#chq').css("font-weight","normal");
		  
		if(flag_ship == 0)
		{
			$('.plan_summary_container_payment').css('top', '1125px');
		}
		else
		{
			$('.plan_summary_container_payment').css('top', '815px');
		}
		  
      }
      else if($(this).attr("value")=="check")
      {
        paymode_flag =true;
		mode_check = true;

        $('.card_number').css('cssText', 'border-color: rgba(204,204,204,1)');
        $('.paynow_cvv').css('cssText', 'border-color: rgba(204,204,204,1)');
        
        if(paymode_flag == false)
        {
            if(flag_ship == 1)
            {
                var proceed = 1; 
                $('.billing').each(function ()
                {
                    if(String($(this).css('border-color')) == "rgb(243, 54, 59)") 
                        proceed = 0;
                }); 
                
                if(proceed == 0)
                    $('.paynow_validation_msg').show();
                else 
                    $('.paynow_validation_msg').hide();
            }
            else if (flag_ship == 0)
            {
                var proceed_2 = 1;
                $('.form-control_payment').each(function ()
                {
                    if(String($(this).css('border-top-color')) == "rgb(243, 54, 59)") 
                        proceed_2 = 0;
                });  
                
                if(proceed_2 == 0)
                    $('.paynow_validation_msg').show();
                else 
                    $('.paynow_validation_msg').hide();  
            }
        }
        else if (paymode_flag == true)
        {
            if(flag_ship == 1)
            {
                var proceed = 1; 
                $('.check').each(function ()
                {
                    if(String($(this).css('border-top-color')) == "rgb(243, 54, 59)") 
                        proceed = 0;
                }); 
                
                if(proceed == 0)
                    $('.paynow_validation_msg').show();
                else 
                    $('.paynow_validation_msg').hide();   
            }
            else if (flag_ship == 0)
            {
                var proceed = 1; 
                $('.checkS').each(function ()
                {
                    if(String($(this).css('border-top-color')) == "rgb(243, 54, 59)") 
                        proceed = 0;
                }); 
                
                if(proceed == 0)
                    $('.paynow_validation_msg').show();
                else 
                    $('.paynow_validation_msg').hide();
            }
        }

        $('#check').attr("src", "assets/images/radioFull.png");
        $('#card').attr("src", "assets/images/radioEmpty.png");
        $("#DIeCommFrame_payment").hide();
        $('#auto_renewal_com_box').hide();
        $(".instruction_section").show();
        $('#chq').css("font-weight","Bold");
        $('#cc').css("font-weight","normal");
		  
		if(flag_ship == 0)
		{
			$('.plan_summary_container_payment').css('top', '1365px');
		}
		else
		{
			$('.plan_summary_container_payment').css('top', '1065px');
		}
		  
      }
  });
      
     // Store the session values at backend
    $.ajax({
      url: '/payment/selecteddata/LEED:' + getUrlParameter('LEED') + '/',
      type: 'POST',
      data: JSON.stringify({}),
      contentType: 'application/json',
      success: function(response) {
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) { 
      }
    });
    /////////////////////////////////////////

      $('.form-control_payment').on('focus', function()
      {
          //if(!($(this).css("border-top-color") == "rgb(243, 54, 59)"))
            $(this).css("box-shadow", "0 0 1px 1px rgba(204,204,204,1)");
      });
      $('.form-control_payment').on('blur', function()
      {
          $(this).css("box-shadow", "none"); 
      });
      
      $('.pt0 input').on('blur', function()
      {
        if($(this).attr('name') == "bill_to_party_firstname" || $(this).attr('name') == "bill_to_party_lastname" || $(this).attr('name') == "city")
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
        else if ($(this).attr('name') == "postal_code")
        {
            if($(this).val() == '')
            {
                $(this).css("border-color", "rgba(243,54,59,1)");
            }
            else
            {
                $(this).css("border-color", "rgba(204,204,204,1)");
            }
        }
        else if ($(this).attr('name') == "bill_to_party_email")
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
        else if ($(this).attr('name') == "bill_to_party_phone")
        {
            var number = $(this).val();
            if(number.match(/^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/))
            {
               $(this).css("border-color", "rgba(204,204,204,1)");  
            }
            else
            {
                $(this).css("border-color", "rgba(243,54,59,1)");
            }
        }
        else if($(this).attr('name') == "address")
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

       
        if(paymode_flag == false)
        {
            if(flag_ship == 1)
            {
                var proceed = 1; 
                $('.billing').each(function ()
                {
                    if(String($(this).css('border-top-color')) == "rgb(243, 54, 59)") 
                        proceed = 0;
                }); 
                
                if(proceed == 0)
                    $('.paynow_validation_msg').show();
                else 
                    $('.paynow_validation_msg').hide();
            }
            else if (flag_ship == 0)
            {
                var proceed_2 = 1;
                $('.form-control_payment').each(function ()
                {
                    if(String($(this).css('border-top-color')) == "rgb(243, 54, 59)") 
                        proceed_2 = 0;
                });  
                
                if(proceed_2 == 0)
                    $('.paynow_validation_msg').show();
                else 
                    $('.paynow_validation_msg').hide();  
            }
        }
        else if (paymode_flag == true)
        {
            if(flag_ship == 1)
            {
                var proceed = 1; 
                $('.check').each(function ()
                {
                    if(String($(this).css('border-top-color')) == "rgb(243, 54, 59)") 
                        proceed = 0;
                }); 
                
                if(proceed == 0)
                    $('.paynow_validation_msg').show();
                else 
                    $('.paynow_validation_msg').hide();   
            }
            else if (flag_ship == 0)
            {
                var proceed = 1; 
                $('.checkS').each(function ()
                {
                    if(String($(this).css('border-top-color')) == "rgb(243, 54, 59)") 
                        proceed = 0;
                }); 
                
                if(proceed == 0)
                    $('.paynow_validation_msg').show();
                else 
                    $('.paynow_validation_msg').hide();
            }
        }

      });
      
    $("body").css("overflow","visible");
    $(".pressEnter").keyup(function(event){
      if(event.keyCode == 13){
          $("#confirm_payment").click();
      }
    });
    
    $('#confirm_payment').click(function() {
      $('.progress_receipt').prevAll().addClass('cursor_notallowed');
      if ( $('.jquery-header-bar').css('display') == 'block'){
        $('.jquery-header-bar').hide();
      }
     
      // shipping address validation
      if(!$('.address_same').is(':visible')) {
        flag_ship=0;
          var numberRegex = /^.*$/;;
          if(numberRegex.test($('#paynow_ship_po_code').val()) && $('#paynow_ship_po_code').val()!='') {
            $('#paynow_ship_po_code').css("border-color", "rgba(57,180,70,1)");
            //flag_ship=1;
          }
          else {
            //flag_ship=0;
            $('#paynow_ship_po_code').css("border-color", "red");
          }
        // }
        var email_regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        var email = $('.paynow_ship_email').val();
        ctr_ship=0;
        if(!email_regex.test(email)) {
          $('.paynow_ship_email').css('border','1px solid red');
          ctr_ship=0;
        }
        else {
          $('.paynow_ship_email').css('border','1px solid rgba(57,180,70,1)');
          ctr_ship=1;
        }
        var phone_regex = /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/;
        var ship_phone = $('.paynow_ship_phone').val();
        var flag_ship_phone = 0;
        if(!phone_regex.test(ship_phone)) {
          $('#paynow_phone').css('border','1px solid red');
          flag_ship_phone = 0;
        }
        else {
          $('#paynow_phone').css('border','1px solid rgba(57,180,70,1)');
          flag_ship_phone = 1;
        }
        if($('.paynow_ship_f_name').val()=='' || $('.paynow_ship_l_name').val()=='' || $('.paynow_ship_add').val()=='' || $('.paynow_ship_city').val()=='' || flag==0 || $('.ship_country').val()=='' || $('.ship_state').val()=='' || $('.paynowship_email').val()=='' || ctr==0 || $('.paynow_ship_phone').val()=='' || flag_ship_phone==0) {
          //$('.paynow_validation_msg').show();
          if($('.paynow_ship_f_name').val()=='')
            $('.paynow_ship_f_name').css('border','1px solid red');
          else
            $('.paynow_ship_f_name').css('border','1px solid rgba(57,180,70,1)');
          if($('.paynow_ship_l_name').val()=='')
            $('.paynow_ship_l_name').css('border','1px solid red');
          else
            $('.paynow_ship_l_name').css('border','1px solid rgba(57,180,70,1)');
          if($('.paynow_ship_add').val()=='')
            $('.paynow_ship_add').css('border','1px solid red');
          else
            $('.paynow_ship_add').css('border','1px solid rgba(57,180,70,1)');
          if($('.paynow_ship_city').val()=='')
            $('.paynow_ship_city').css('border','1px solid red');
          else
            $('.paynow_ship_city').css('border','1px solid rgba(57,180,70,1)');
            var numberRegex = /^.*$/;;
            if(numberRegex.test($('#paynow_ship_po_code').val()) && $('#paynow_ship_po_code').val()!='') {
              $('#paynow_ship_po_code').css("border-color", "rgba(57,180,70,1)");
            }
            else {
              $('#paynow_ship_po_code').css("border-color", "red");
            }
          // }
          if($('.ship_country').val()=='')
            $('.ship_country').css('border','1px solid red');
          else
            $('.ship_country').css('border','1px solid rgba(57,180,70,1)');
          if($('.ship_state').val()=='')
            $('.ship_state').css('border','1px solid red');
          else
            $('.ship_state').css('border','1px solid rgba(57,180,70,1)');
          if($('.paynow_ship_email').val()=='')
            $('.paynow_ship_email').css('border','1px solid red');
          /*else
            $('#paynow_email').css('border','1px solid #d6d6d6');*/
          if(flag_ship_phone==0)
            $('.paynow_ship_phone').css('border','1px solid red');
          else
            $('.paynow_ship_phone').css('border','1px solid rgba(57,180,70,1)');
        }
      }
      // shipping address validation ends
      var flag=0;
        var numberRegex = /^.*$/;;
        if(numberRegex.test($('#paynow_po_code').val()) && $('#paynow_po_code').val()!='') {
          $('#paynow_po_code').css("border-color", "rgba(57,180,70,1)");
          flag=1;
        }
        else {
          flag=0;
          $('#paynow_po_code').css("border-color", "red");
        }
      // }
      var email_regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
      var email = $('.paynow_email').val();
      var ctr=0;
      if(!email_regex.test(email)) {
        $('.paynow_email').css('border','1px solid red');
        ctr=0
      }
      else {
        $('.paynow_email').css('border','1px solid rgba(57,180,70,1)');
        ctr=1;
      }
      var phone_regex = /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/;
      var phone = $('#paynow_phone').val();
      var flag_phone = 0;
      if(!phone_regex.test(phone)) {
        $('#paynow_phone').css('border','1px solid red');
        flag_phone = 0;
      }
      else {
        $('#paynow_phone').css('border','1px solid rgba(57,180,70,1)');
        flag_phone = 1;
      }
        
      if(paymode_flag == false)
      {

            $("#DIeCommFrame_payment").contents().find(".credit").each(function (){
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

                if (!isNaN(parseInt($('#DIeCommFrame_payment').contents().find('#year option:selected').text()))) {
                  if ( parseInt($('#DIeCommFrame_payment').contents().find('#year option:selected').text()) > (new Date()).getFullYear() ) {
                    $('#DIeCommFrame_payment').contents().find('#year').css("border-color", "rgba(204,204,204,1)");
                    $('#DIeCommFrame_payment').contents().find('#month').css("border-color", "rgba(204,204,204,1)");
                  }
                  else if ( parseInt($('#DIeCommFrame_payment').contents().find('#year option:selected').text()) < (new Date()).getFullYear() ){
                    $('#DIeCommFrame_payment').contents().find('#year').css("border-color", "rgba(243,54,59,1)");
                    $('#DIeCommFrame_payment').contents().find('#month').css("border-color", "rgba(243,54,59,1)");
                  }
                  else {
                    $('#DIeCommFrame_payment').contents().find('#year').css("border-color", "rgba(204,204,204,1)");
                    if ( (parseInt(months[$('#DIeCommFrame_payment').contents().find('#month').val()]) >= (new Date()).getMonth()+1) ) {
                      $('#DIeCommFrame_payment').contents().find('#month').css("border-color", "rgba(204,204,204,1)");
                    }
                    else {
                      $('#DIeCommFrame_payment').contents().find('#month').css("border-color", "rgba(243,54,59,1)");
                    }
                  }
                }
                else{
                  $(this).css("border-color", "rgba(243,54,59,1)");
                }
              }
            });


            if(flag_ship == 1)
            {
                $('.billing').blur();
                                
                correctColor();
                
                var proceed = 1; 
                $('.billing').each(function ()
                {
                    if(String($(this).css('border-top-color')) == "rgb(243, 54, 59)") 
                        proceed = 0;
                });

                $("#DIeCommFrame_payment").contents().find(".credit").each(function (){
                  if(String($(this).css('border-top-color')) == "rgb(243, 54, 59)") 
                        proceed = 0;
                });
                
                if(proceed == 1)
                {
                    submitDetails();
                    $('.paynow_validation_msg').hide();
                }
                else 
                {
                    $('.paynow_validation_msg').show();
                }
            }
            else if(flag_ship == 0)
            {
                $('.form-control_payment').blur();  
                
                correctColor();
                
                var proceed_2 = 1;
                $('.form-control_payment').each(function ()
                {
                    if(String($(this).css('border-top-color')) == "rgb(243, 54, 59)") 
                        proceed_2 = 0;
                });

                $("#DIeCommFrame_payment").contents().find(".credit").each(function (){
                  if(String($(this).css('border-top-color')) == "rgb(243, 54, 59)") 
                        proceed_2 = 0;
                });
                
                if(proceed_2 == 1)
                {
                    submitDetails();
                    $('.paynow_validation_msg').hide();
                }
                else 
                {
                    $('.paynow_validation_msg').show();
                }
            }
      }
      else if (paymode_flag == true)
      {
            if(flag_ship == 1)
            {
                $('.check').blur();
                
                correctColor();
                
                var proceed = 1; 
                $('.check').each(function ()
                {
                    if(String($(this).css('border-top-color')) == "rgb(243, 54, 59)") 
                        proceed = 0;
                }); 
                
                if(proceed == 1)
                {
                    submitDetails();
                    $('.paynow_validation_msg').hide();
                }
                else 
                {
                    $('.paynow_validation_msg').show();
                }
            }
            else if(flag_ship == 0)
            {
                $('.checkS').blur();
                
                correctColor();
                
                var proceed = 1; 
                $('.checkS').each(function ()
                {
                    if(String($(this).css('border-top-color')) == "rgb(243, 54, 59)") 
                        proceed = 0;
                }); 
                
                if(proceed == 1)
                {
                    submitDetails();
                    $('.paynow_validation_msg').hide();
                }
                else 
                {
                    $('.paynow_validation_msg').show();
                }
            }
      }
        
    });
    
    $('.shipping_details_card').hide();
    $('.activationFlow_parent_container').on('click', '.checkbox_img', function () {
    var proceed = 1;
      if($('.checkbox_img').hasClass('address_same')) {
        $(this).removeClass('address_same').addClass('address_notsame');
        flag_ship = 0;
        $('#checkbox_card').attr('checked', false);
        $('.checkbox_img').attr('src', 'assets/images//checkboxEmpty.png');
        $('.shipping_details_card').show();
		  
		if(mode_check == false)
		{
			$('.plan_summary_container_payment').css('top', '1125px');		
		}
		else
		{
			$('.plan_summary_container_payment').css('top', '1365px');
		}
		  
      $('.checkS').each(function ()
      {
        if(String($(this).css('border-top-color')) == "rgb(243, 54, 59)") 
          proceed = 0;
      }); 
      if(proceed == 1)
      {
        $('.paynow_validation_msg').hide();
      }
      else 
      {
        $('.paynow_validation_msg').show();
      }
      }
      else {
        $('.checkbox_img').removeClass('address_notsame').addClass('address_same');
        $('#checkbox_card').attr('checked', true);
        $('.checkbox_img').attr('src','assets/images//checkboxFull.png');
        flag_ship = 1;
    
		if(mode_check == false)
		{
			$('.plan_summary_container_payment').css('top', '815px');		
		}
		else
		{
			$('.plan_summary_container_payment').css('top', '1065px');
		}
		  
		  
        $('.shipping_details_card').hide();
      $('.check').each(function ()
      {
        if(String($(this).css('border-top-color')) == "rgb(243, 54, 59)") 
          proceed = 0;
      }); 
      if(proceed == 1)
      {
        $('.paynow_validation_msg').hide();
      }
      else 
      {
        $('.paynow_validation_msg').show();
      }
    
      }
    });
    $('.activationFlow_parent_container').on('click', '.auto_renewal_chk', function () {
      if($('#auto_renewal').attr('data-chk') == 'checked') {
        $('#auto_renewal').attr('data-chk','unchecked');
        $('#auto_renewal').attr('src', 'assets/images//checkboxEmpty.png');
      }
      else {
        $('#auto_renewal').attr('data-chk','checked');
        $('#auto_renewal').attr('src','assets/images//checkboxFull.png');
      }
      
    });
    $('#checkbox_card').change(function () {
        if (!this.checked) {
          $('.shipping_details_card').show();
          $('.float_bottom').addClass('float_bottom_open');
          $('.float_bottom').removeClass('float_bottom_close');
        }
        else {
          $('.shipping_details_card').hide();
          $('.float_bottom').addClass('float_bottom_close');
          $('.float_bottom').removeClass('float_bottom_open');
        }
    });
    $('.shipping_details_check').hide();
    $('#checkbox_check').change(function () {
        if (!this.checked) {
          $('.shipping_details_check').show();
        }
        else {
          $('.shipping_details_check').hide();
        }
    });

    //Pop up image on CVV help
    var body_width  = $('body').width();
    
    if (body_width<=640) {
      $('a#hidden_cvv_help').popover({
        html: true,
        trigger: 'hover',
        placement: 'left',
        content: function(){return '<img style="vertical-align: middle;" src="'+$(this).data('img') + '" />';}
      }); 
    }
    else{
      $('a#hidden_cvv_help').popover({
        html: true,
        trigger: 'hover',
        placement: 'right',
        content: function(){return '<img style="vertical-align: middle;" src="'+$(this).data('img') + '" />';}
      }); 
    }
    //

    //Change color on country and state select
    $( "#country, #country1, #country2, #country3, #month, #year" ).change(function(){
      $(this).parent().find('#state').css("color", "#999");
      $(this).parent().find('#state1').css("color", "#999");
      $(this).parent().find('#state2').css("color", "#999");
      if ($(this).val()=="") {
        $(this).css("color", "#999");
        $(this).css("border-color", "red");
      }
      else {
        $(this).css("color", "#4a4a4a");
        $(this).css("border-color", "rgba(57,180,70,1)");
      }
    });

    $( "#state, #state1, #state2" ).change(function(){
      if ($(this).val()=="") {
        $(this).css("color", "#999");
      }
      else {
        $(this).css("color", "#4a4a4a");
        $(this).css("border-color", "rgba(57,180,70,1)");
      }
    });

    $(".skip_for_now, #close_payment_modal").on('click', function()
    {
      if (only_payment_pages){
        if (UI_Version == 'v2'){
          var switch_url = window.location.protocol + '//' + window.location.host + '/v2' + window.location.pathname + window.location.hash;
          window.location = plaqueNav.switchUIException(plaqueNav.getParameterByName('page'), plaqueNav.getParameterByName('section'), switch_url);
        }
        else{
          if (msieversion() == 9){
            window.location.href = window.location.href.split(window.location.protocol + '//' + window.location.hostname)[1].split('&trigger=')[0].split('&modal=')[0];
            return false;
          }
          else{
            window.history.pushState({}, 'account', window.location.href.split(window.location.protocol + '//' + window.location.hostname)[1].split('&trigger=')[0].split('&modal=')[0]);
          }
          $('#activation_modal').modal('hide');
        }
      }
      else if (window.plaque.getMeterData.unique_notification_arr.indexOf("skipped_buildingConfirmation") > -1){
        ajax_call('buildingConfirmation');
      }
      else{
        $('#activation_modal').modal('hide');
        $('#skipped_modal').modal('hide');
        $('#project_is_active').modal('show');
      }
    });

    selectedOrderData ('payment');

    if (user_group_backend == 'Staff'){
      $('#confirm_payment').addClass('not-active');
    }
  }
  //payment ends

  //Receipt starts
  function receipt(){

    $('#activation_modal_container').removeClass('activation_modal_w875').addClass('activation_modal_w450');

    $('.back_btn_access').hide();
    $('.forward_btn_access').hide();
    $('.back_btn').hide();
    $('.forward_btn').hide();

    $("#comp_btn").on('click', function()
    {
      ajax_call('buildingConfirmation');
    });

    $('#preloader_activationFlow').show();
    $('#status_activationFlow').show();
    $.ajax({
      url:'/payment/getpaymentdetail/LEED:' + getUrlParameter('LEED') + '/',
      contentType: 'application/json'
    }).done(function(response) {

      $('#preloader_activationFlow').hide();
      $('#status_activationFlow').hide();

      var need_plaque     = response.leed_plaque;
      var purchase_plaque = response.purchase_plaque;
      var paid_full       = response.paid_full;
      var receipt_date = response.payment_date.trim().split('-');
      
      if (response.payment_mode == 'check'){
        $('.build_head').html("INVOICE");
      }

      $('.receipt_sap_order_id').html(response.sap_order_id);  
      $('.building_address').html(response.address);
      $('.receipt_payer_name').html(response.payer_name_only);
      $('.receipt_total_amount').html(numericToString(parseInt(response.amount_paid)));
      $('.receipt_building_name').html(response.building_name);
      $('.receipt_building_ID').html(parseInt(response.leed_id));
      $('.receipt_date').html(receipt_date[1] + '/' + receipt_date[2] + '/' + receipt_date[0]);
      $('.receipt_payer').html(response.payer_name);
      $('.credit_card_number').html(response.credit_card_number);

      var payment_mode = response.payment_mode;
      if(payment_mode == "check"){
        $('#ccrow_payment').css('display','none');
      }
        
      if (response.term_com == "1"){
        $('.receipt_term').html(response.term_com + ' Year');
      }
      else{
        $('.receipt_term').html(response.term_com + ' Years');
      }

      if (need_plaque){
        $('.needpl_tbl').show();
        if (purchase_plaque){
        }
        else{
          if(paid_full){
            if (response.term_com == "1"){
              $('.pay_full_span_hardware').html("(" + response.term_com + " Year)");
            }
            else{
              $('.pay_full_span_hardware').html("(" + response.term_com + " Years)");
            }
          }
          else{
            $('.pay_full_span_hardware').html("(1 Year)");
          }
        }
        $('.plaque_one_time_price').html(numericToString(parseInt(response.plaque_cost)));
      }
      else{
        $('.needpl_tbl').hide();
      }

      if (paid_full){
        if (response.term_com == "1"){
          $('.pay_full_span_subs').html("(" + response.term_com + " Year)");
        }
        else{
          $('.pay_full_span_subs').html("(" + response.term_com + " Years)");
        }
      }
      else{
        $('.pay_full_span_subs').html("(1 Year)");
      }

      $('.subs_price').html(numericToString((response.subs_price)));
      $('.order_sum_input').html(numericToString((response.amount_paid)));

      var link = '/payment/getreceiptinpdf/LEED:' + getUrlParameter('LEED') + '/ID:' + response.sap_order_id + '/';
      $('.cancel_continue_buttons .btnBlue').attr('href', link);
      var href = $('.cancel_continue_buttons .btnBlue').attr('href');
      $('.cancel_continue_buttons .btnBlue').attr('onclick', "window.location='" + href + "'").removeAttr('href');
    });
  }
  //Receipt ends

  //Agreement starts
  function agreement() {

    $('#preloader_activationFlow').show();
    $('#status_activationFlow').show();

    $('#activation_modal_container').removeClass('activation_modal_w450').addClass('activation_modal_w875');

    $(".pressEnter").keyup(function(event){
      if(event.keyCode == 13){
        $("#sendAgreement_buildConf").click();
      }
    });

    $( "#agreement_other" ).click(function() {
      $('input.continue_building_owner_sign.btnGreen').css('background','#CCCCCC');
      $('input.continue_building_owner_sign.btnGreen').css('border','solid 1px #CCCCCC');
      $('input#sendAgreement_buildConf').css('background','#3E93A9');
      $('input#sendAgreement_buildConf').css('border','solid 1px #3E93A9');
      $('#agreement_other').removeClass('agreement_disable').addClass('agreement_active');
      $('#agreement_self').removeClass('agreement_active').addClass('agreement_disable');
    });
    $( "#agreement_self" ).click(function() {
      $('input.continue_building_owner_sign.btnGreen').css('background','#95BF58');
      $('input.continue_building_owner_sign.btnGreen').css('border','solid 1px #95BF58');
      $('input#sendAgreement_buildConf').css('background','#CCCCCC');
      $('input#sendAgreement_buildConf').css('border','solid 1px #CCCCCC');
      $('#agreement_self').removeClass('agreement_disable').addClass('agreement_active');
      $('#agreement_other').removeClass('agreement_active').addClass('agreement_disable');
    });

    $( "#agreement_other" ).hover(function() {
      $('input.continue_building_owner_sign.btnGreen').css('background','#CCCCCC');
      $('input.continue_building_owner_sign.btnGreen').css('border','solid 1px #CCCCCC');
      $('input#sendAgreement_buildConf').css('background','#3E93A9');
      $('input#sendAgreement_buildConf').css('border','solid 1px #3E93A9');
      $('#agreement_other').removeClass('agreement_disable').addClass('agreement_active');
      $('#agreement_self').removeClass('agreement_active').addClass('agreement_disable');
    });
    $( "#agreement_self" ).hover(function() {
      $('input.continue_building_owner_sign.btnGreen').css('background','#95BF58');
      $('input.continue_building_owner_sign.btnGreen').css('border','solid 1px #95BF58');
      $('input#sendAgreement_buildConf').css('background','#CCCCCC');
      $('input#sendAgreement_buildConf').css('border','solid 1px #CCCCCC');
      $('#agreement_self').removeClass('agreement_disable').addClass('agreement_active');
      $('#agreement_other').removeClass('agreement_active').addClass('agreement_disable');
    });

    $.ajax({
      url: '/buildings/LEED:' + getUrlParameter('LEED') + '/ownerdetails/',
      type: 'GET',
    }).done(function(owner_data) {
      $('#saved_name').html(owner_data.owner_name);
      $('#saved_email').html(owner_data.owner_email);
      //Placeholder for owner nanme and owner email
      $('#new_owner_id').val($('#saved_email').text());
      $('#new_owner_name').val($('#saved_name').text());
      $('#preloader_activationFlow').hide();
      $('#status_activationFlow').hide();
    }).fail(function(data) {
      $('#preloader_activationFlow').hide();
      $('#status_activationFlow').hide();
    });

    $('.continue_building_owner').click(function(){
        $('.continue_building_owner').prop('disabled','true');
        $('.continue_building_owner').addClass('disable');
      if ( $('.jquery-header-bar').css('display') == 'block'){
        $('.jquery-header-bar').hide();
      }

      $('#preloader_activationFlow').show();
      $('#status_activationFlow').show();

      var owner_name = getName();
      var owner_email = getEmail();
      var main_url;
      var buildingAgreementStatus = "";
      var button_name = $(this).val();

      //Get the agreement status
      $.ajax({
        type: "GET",
        url: "/payment/getbuildingagreementstatus/LEED:" + getUrlParameter('LEED') + "/"
        }).done(function(data) {
          if (data.result == "BAD_REQUEST" || data.result == "NOT_FOUND"){
            $('.continue_building_owner').prop('disabled',false);
            $('.continue_building_owner').removeClass('disable');
            $('#preloader_activationFlow').hide();
            $('#status_activationFlow').hide();
            return;
          }
          else{
            buildingAgreementStatus = data.result;
          }

          if (button_name == 'SIGN'){
            var csrftoken  = getCookie('csrftoken');
            main_url  = create_send_URL_embedded();
            var data_info = {};
            if (buildingAgreementStatus == "NOT_SENT") {
              data_info = {'mode': 'SIGN'};
            }
            else {
              data_info = {'mode': 'RESIGN'};
            }
            $.ajax({
              url: main_url,
              type: 'POST',
              data: JSON.stringify(data_info),
              contentType: 'application/json',
              success: function(response) {

                  $('#preloader_activationFlow').show();
                  $('#status_activationFlow').show();

                  $('.continue_building_owner').prop('disabled',false);
                  $('.continue_building_owner').removeClass('disable');
                  if (response.status == "SUCCESS") {

                    $('.jquery-header-bar').hide();
                    if (Modernizr.touchEvents || Modernizr.touch){
                      start_redirect(response.viewUrl);
                    }
                    else{
                      $('#activation_modal').modal("toggle");
                      $("body").css("overflow", "hidden");
                      $("#agreement_embedded_iFrame").attr('data-src',response.viewUrl);
                      var login_iframe = $("#agreement_embedded_iFrame");
                      login_iframe.attr("src", login_iframe.data("src")); 
                      $('#agreement_embedded_modal').modal({"backdrop" : "static"})
                    }
                  }
                  else if (response.MESSAGE=="AGREEMENT_FREEZE_TIME"){
                    $('.continue_building_owner').prop('disabled',false);
                    $('.continue_building_owner').removeClass('disable');
                    $('#preloader_activationFlow').hide();
                    $('#status_activationFlow').hide();
                    var min_string = " minutes.";
                    if (response.TIME_LEFT == 1){
                      min_string = " minute.";
                    }
                    display_error("You have already sent the agreement for this building. You will be able to sign it again in " + response.TIME_LEFT + min_string);
                  }
                  else {
                    $('#preloader_activationFlow').hide();
                    $('#status_activationFlow').hide();
                    $('.continue_building_owner').prop('disabled',false);
                    $('.continue_building_owner').removeClass('disable');
                    display_error("An error occurred while signing the agreement. Please contact us via e-mail at contact@leedon.io.");
                  }
              },
              error: function(XMLHttpRequest, textStatus, errorThrown) {

                  $('#preloader_activationFlow').hide();
                  $('#status_activationFlow').hide();

                  $('.continue_building_owner').prop('disabled',false);
                  $('.continue_building_owner').removeClass('disable'); 
                  display_error("An error occurred while signing the agreement. Please contact us via e-mail at contact@leedon.io."); 
                //$('#agreement_embedded_modal').modal({"backdrop" : "static"})
              }
            })
          }
          else if (button_name == 'SEND' || button_name == 'RESEND'){

            if (!validateEmail(($("#new_owner_id").val()).trim())) {
              $('.continue_building_owner').prop('disabled',false);
              $('.continue_building_owner').removeClass('disable'); 
              display_error_only_text("Please enter the correct email address.");
            }
            else {
              main_url = create_send_URL();
              var data_info = {};
              if (buildingAgreementStatus == "NOT_SENT") {
                data_info = {'recipient_name' : owner_name, 'recipient_email': owner_email, 'mode': 'SEND'};
              }
              else {
                data_info = {'recipient_name' : owner_name, 'recipient_email': owner_email, 'mode': 'RESEND'};
              }

              $.ajax({
                url: main_url,
                type: 'POST',
                data: JSON.stringify(data_info),
                contentType: 'application/json',
                success: function(response) {

                    $('#preloader_activationFlow').show();
                    $('#status_activationFlow').show();

                    $('.continue_building_owner').prop('disabled',false);
                    $('.continue_building_owner').removeClass('disable');
                    if (response == "SUCCESS")
                    {
                      $('#activation_modal').modal("toggle");
                      $('#emailSent_Trial_activated').modal('toggle');
                      $("#emailSent_Trial_activated").modal({"backdrop": "static"});
                      agreement_sent();
                    }
                    else if (response.MESSAGE=="AGREEMENT_FREEZE_TIME"){
                      $('.continue_building_owner').prop('disabled',false);
                      $('.continue_building_owner').removeClass('disable');
                      $('#preloader_activationFlow').hide();
                      $('#status_activationFlow').hide();
                      var min_string = " minutes.";
                      if (response.TIME_LEFT == 1){
                        min_string = " minute.";
                      }
                      display_error("You have already sent the agreement for this building. You will be able to send it again in " + response.TIME_LEFT + min_string);
                    }
                    else{
                      $('.continue_building_owner').prop('disabled',false);
                      $('.continue_building_owner').removeClass('disable');
                      $('#preloader_activationFlow').hide();
                      $('#status_activationFlow').hide();
                      if(response=="BAD_REQUEST" || response=="NOT_FOUND"){
                          display_error("The requested building was not found.");
                      }
                      else if(response=="ALREADY_SENT"){
                          display_error("An agreement has already been sent to building owner's email address.");
                      }
                      else if(response=="NOT_PENDING"){
                          display_error("Agreement is not pending for this building.");
                      }
                      else {
                          display_error("An error occurred while sending the agreement to building owner's email address. Please contact us via e-mail at contact@leedon.io.");
                      }
                    }
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) { 

                    $('#preloader_activationFlow').hide();
                    $('#status_activationFlow').hide();

                    $('.continue_building_owner').prop('disabled',false);
                    $('.continue_building_owner').removeClass('disable');
                    display_error("An error occurred while sending the agreement to building owner's email address. Please contact us via e-mail at contact@leedon.io."); 
                }
              })

            }
          } 
          // event.preventDefault();
      }).fail(function(data) {

          $('#preloader_activationFlow').hide();
          $('#status_activationFlow').hide();

          $('.continue_building_owner').prop('disabled',false);
          $('.continue_building_owner').removeClass('disable');
        });
    });

    $(".skip_for_now, #close_buildingConfirmation_modal").on('click', function()
    {
      if (only_agreement){
        if (UI_Version == 'v2'){
          var switch_url = window.location.protocol + '//' + window.location.host + '/v2' + window.location.pathname + window.location.hash;
          window.location = plaqueNav.switchUIException(plaqueNav.getParameterByName('page'), plaqueNav.getParameterByName('section'), switch_url);
        }
        else{
          if (msieversion() == 9){
            window.location.href = window.location.href.split(window.location.protocol + '//' + window.location.hostname)[1].split('&trigger=')[0].split('&modal=')[0];
            return false;
          }
          else{
            window.history.pushState({}, getUrlParameter('page'), window.location.href.split(window.location.protocol + '//' + window.location.hostname)[1].split('&trigger=')[0].split('&modal=')[0]);
          }
          $('#activation_modal').modal('hide');
        }
      }
      else{
        if (msieversion() == 9){
          window.location.href = window.location.href.split(window.location.protocol + '//' + window.location.hostname)[1].split('&trigger=')[0].split('&modal=')[0] + '&modal=skippedModal';
          return false;
        }
        else{
          window.history.pushState({}, getUrlParameter('page'), window.location.href.split(window.location.protocol + '//' + window.location.hostname)[1].split('&trigger=')[0].split('&modal=')[0] + '&modal=skippedModal');
        }
        $('#activation_modal').modal('hide');
        $('#project_is_active').modal('hide');
        $('#skipped_modal').modal('show');
        skippedModal();
      }
    });

    if (user_group_backend == 'Staff'){
      $('.continue_building_owner_sign').addClass('not-active');
      $('#sendAgreement_buildConf').addClass('not-active');
    }
  }
  //Agreement ends

  //Team management starts
  function teamManagement(){

    if (ACTIVATE_GBIG_SEARCH == "True"){
      $('#display_pending_request').show();
    }

    $('#preloader_activationFlow').show();
    $('#status_activationFlow').show();

    $('#activation_modal_container').removeClass('activation_modal_w450').addClass('activation_modal_w875');

    $('.forward_btn_access').html('ADD METERS >');
    $('.forward_btn_access, .forward_btn').attr('onclick','').unbind('click');
    $('.forward_btn_access, .forward_btn').on('click', function(){
      if (check_BackAndNextPage('teamManagement', 'next', global_version) == undefined){
         window.location.href=main_dashboard_url;
      }
      else{
        ajax_call(check_BackAndNextPage('teamManagement', 'next', global_version));
      }
    });

    // Check validation of email
    $('#new_username_TM_member').on('blur', function()
      {
        var regEx = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/igm;
        if(regEx.test($('#new_username_TM_member').val().trim()))
        {
            $('#new_username_TM_member').css('cssText', 'border-color: rgba(204,204,204,1) !important');
            $('#add_new_member_TM_member').removeAttr('disabled');
        }
        else if ($('#new_username_TM_member').val().trim() == ""){
          $('#new_username_TM_member').css('cssText', 'border-color: rgba(204,204,204,1) !important');
          $('#add_new_member_TM_member').removeAttr('disabled');
        }
        else
        {
          $('#new_username_TM_member').css('cssText', 'border-color: rgba(243,54,59,1) !important');
          $('#add_new_member_TM_member').attr('disabled','disabled');
        }   
    });

    $("#continue5").on('click', function()
    {
      if (check_BackAndNextPage('teamManagement', 'next', global_version) == undefined){
         window.location.href=main_dashboard_url;
      }
      else{
        ajax_call(check_BackAndNextPage('teamManagement', 'next', global_version));
      }
    });

    $('.card').on('keyup', '#new_username_TM_member', function(event) {
      if(event.keyCode == 13){
        $("#add_new_member_TM_member").click();
      }
    });

    //Flow for pendiing requests
    var pending_requests_all = {};
    var pending_requests_counter   = 0;
    $.ajax({ 
      url: '/buildings/LEED:' + getUrlParameter('LEED') + '/permission/request/', 
      async: true, 
      success: function(response) {
        $.each( response ,function (index, item) {
            
          var months = ["January", "February", "March" , "April", "May", "June", "July", "August", "September", "October", "November", "December"];    
          username_only[pending_requests_counter] = ((item.Useralias).toLowerCase()).trim();
          date_modified_formated_modal = item.DateModified.split(" ")[0].split("-");
          pending_requests_all[pending_requests_counter] = {"Useralias": ((item.Useralias).toLowerCase()).trim(), "DateModified": date_modified_formated_modal[1] + '/' + date_modified_formated_modal[2] + '/' + date_modified_formated_modal[0] };
          pending_requests_counter += 1;
        });

        if (pending_requests_counter <= 0 && ACTIVATE_GBIG_SEARCH == "True"){
          $('.no_pending_requests').show();
        }
        else{
          $('.no_pending_requests').hide();
        }

        $('.total_pending_requests').html(pending_requests_counter);

        $.each( pending_requests_all ,function (index, item) {
          $('#pending_requests_container_modal').append('<div class="permissions_row_container"><div class="request_name_perm inline_block"><span class="request_name" user_id =' + item.Useralias + ' data-title="User E-mail">' + item.Useralias + '</span><span class="request_member_perm" data-title="Select permission">' + '<input type="submit" class="accept_permission_request btn btnFixWidth mb10 btnGreen no_outline h40 fs14" value="ACCEPT"><input type="submit" class="reject_permission_request btn btnOutline no_outline h40 fs14" value="REJECT">' + '</span><div class="ajax_loader_dropdown_TM_member"></div></div><div class="request_edit inline_block light_color"><span clas="light_color">Requested</span><span class="request_member_modified mr55" data-title="Date Modified">' + item.DateModified + '</span></div></div>');
        });

        $('#pending_requests_container_modal').on('click', '.accept_permission_request, .reject_permission_request', function() {
          $(this).parent().parent().find('.ajax_loader_dropdown_TM_member').show();
          var permission_result = $(this).val();
          var user_perm = $(this).parent().parent().find('.request_name').html();
          
          $.ajax({
            url: '/buildings/LEED:' + getUrlParameter('LEED') + '/permission/addtoexception/',
            type: 'POST',
            data: JSON.stringify({"permission_result":permission_result, "user_perm": user_perm}),
            contentType: 'application/json',
            success: function(response) {
              if (response=="SUCCESS"){
                $('.ajax_loader_dropdown_TM_member').hide();
                $('#pending_requests_container_modal').find("[user_id='" + user_perm + "']").parent().find('.request_member_perm').html('<img class="mt10" src="../assets/images/Checkmark.svg">');
              }
              else{
                $('.ajax_loader_dropdown_TM_member').hide();
              }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) { 
             $('.ajax_loader_dropdown_TM_member').hide();
            }
          });
        });
      },
      error: function(xhr) { // if error occured
        if (ACTIVATE_GBIG_SEARCH == "True"){
          $('.no_pending_requests').show();
        }
        else{
          $('.no_pending_requests').show();
        }
      }
    });

    //Flow for team management
    var projectTeamMember_all = {};
    var username_only = [];
    var projectTeam_counter   = 0;
    $.ajax({ 
      url: '/buildings/LEED:' + getUrlParameter('LEED') + '/getteammemberinfofromexception/', 
      async: true, 
      success: function(response) {
        $.each( response ,function (index, item) {
            
          var months = ["January", "February", "March" , "April", "May", "June", "July", "August", "September", "October", "November", "December"];    
          username_only[projectTeam_counter] = ((item.Useralias).toLowerCase()).trim();
          date_modified_formated_modal = item.DateModified.split(" ")[0].split("-");
          projectTeamMember_all[projectTeam_counter] = {"Useralias": ((item.Useralias).toLowerCase()).trim(), "Roledescription": item.Roledescription, "DateModified": date_modified_formated_modal[1] + '/' + date_modified_formated_modal[2] + '/' + date_modified_formated_modal[0] };
          projectTeam_counter += 1;
        });
        $.ajax({ 
          url: '/buildings/LEED:' + getUrlParameter('LEED') + '/getteammemberinfofromleedonline/', 
          async: true, 
          success: function(response) {
            $.each( response ,function (index, item) {
              if (username_only.indexOf((item[0].toLowerCase()).trim()) < 0){
                projectTeamMember_all[projectTeam_counter] = {"Useralias": (item[0].toLowerCase()).trim(), "Roledescription": item[1], "DateModified": ""};
                projectTeam_counter += 1;
              }
            });
            $.each( projectTeamMember_all ,function (index, item) {
              var dropdown_value_TM = '';
              if (item.Roledescription == 'Project Team Member'){
                dropdown_value_TM = '<select disabled class="permission_dropdown_TM permission_dropdown_disabled_TM member_button"><option value="Project Admin">ADMIN</option><option value="Project Team Manager">MANAGER</option><option selected value="Project Team Member">MEMBER</option><option value="None">NONE</option></select>';
              }
              else if (item.Roledescription == 'Project Admin'){
                dropdown_value_TM = '<select disabled class="permission_dropdown_TM permission_dropdown_disabled_TM admin_button"><option selected value="Project Admin">ADMIN</option><option value="Project Team Manager">MANAGER</option><option value="Project Team Member">MEMBER</option><option value="None">NONE</option></select>';
              }
              else if (item.Roledescription == 'Project Team Manager'){
                dropdown_value_TM = '<select disabled class="permission_dropdown_TM permission_dropdown_disabled_TM manager_button"><option value="Project Admin">ADMIN</option><option selected value="Project Team Manager">MANAGER</option><option value="Project Team Member">MEMBER</option><option value="None">NONE</option></select>';
              }
              else if (item.Roledescription == 'None'){
                dropdown_value_TM = '<select disabled class="permission_dropdown_TM permission_dropdown_disabled_TM none_button"><option value="Project Admin">ADMIN</option><option value="Project Team Manager">MANAGER</option><option value="Project Team Member">MEMBER</option><option selected value="None">NONE</option></select>';
              }
              $('#team_member_main_container_modal').append('<div class="team_member_row_container"><div class="team_name_perm inline_block"><span class="team_member_name" data-title="User E-mail">' + item.Useralias + '</span><span class="team_member_perm" data-title="Permission Status">' + dropdown_value_TM + '</span><div class="ajax_loader_dropdown_TM_member"></div></div><div class="team_modified_edit inline_block light_color"><span clas="light_color">Modified</span><span class="team_member_modified" data-title="Date Modified">' + item.DateModified + '</span><span class="edit_team_permission_TM"></span></div></div>');
            });

            if (projectTeam_counter <= 0){
              $('.no_team_member').show();
            }
            else{
              $('.no_team_member').hide();
            }

            $('.total_teamMembers').html(projectTeam_counter);

            $('#preloader_activationFlow').hide();
            $('#status_activationFlow').hide();

            $('.edit_team_permission_TM').hide();
            $('.add_teamManagement_header').hide();
            $('.add_teamManagement_input').hide();
            $('.request_member_perm').hide();
            $.ajax({ 
              url: '/buildings/LEED:' + getUrlParameter('LEED') + '/permission/',
              type: 'GET',
              contentType: 'application/json',
              success: function(response) 
              {
                if(String(response.role) == 'Project Admin' || String(response.role) == 'Account Manager')
                {
                  $('.edit_team_permission_TM').show();
                  $('.add_teamManagement_header').show();
                  $('.add_teamManagement_input').show();
                  $('.request_member_perm').show();
                }
                else
                {
                  $('.edit_team_permission_TM').hide();
                  $('.add_teamManagement_header').hide();
                  $('.add_teamManagement_input').hide();
                  $('.request_member_perm').hide();
                }
              }
            }); 
          },
          error: function(xhr) { // if error occured
            $('.no_team_member').show();
            $('#preloader_activationFlow').hide();
            $('#status_activationFlow').hide();
          }
        });
      },
      error: function(xhr) { // if error occured
        $('.no_team_member').show();
        $('#preloader_activationFlow').hide();
        $('#status_activationFlow').hide();
      }
    });

    $('.card').on('click', '#add_new_member_TM_member', function() {
      $('.ajax_loader_TM_member').show();
      var regEx = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/igm;
      if(! regEx.test($('#new_username_TM_member').val().trim()))
      {
        $('#new_username_TM_member').css('cssText', 'border-color: rgba(243,54,59,1) !important');  
      }
      else if($('#new_username_TM_member').val().trim() == ""){
        $('#new_username_TM_member').css('cssText', 'border-color: rgba(243,54,59,1) !important');
      }
      else
      {
        $('#new_username_TM_member').css('cssText', 'border-color: rgba(204,204,204,1) !important');
        var id_present = false;
        $('.team_member_name').each(function( index ) {
          if ($( this ).text().trim() == $('#new_username_TM_member').val().trim()) {
            id_present = true
          }
        });
        if (id_present) {
          $('.ajax_loader_TM_member').hide();
          $('.multiple_id_member').html("Username is already present in the system. Please check the usernames listed above.");
          $('.multiple_id_member').show();
        }
        else{
          $('.multiple_id_member').hide();
          var user_existence; 
          $.ajax({ 
            url: '/buildings/checkleedonlineuserexistence' + '/email:' + $('#new_username_TM_member').val().trim() + '/',
            success: function(response) {
              if (response.message == "SUCCESS"){
                user_existence = "Exist";
              }
              else if (response.message == "NOT FOUND"){
                user_existence = "New";
              }

              var TM_data = { 'user_name' : $('#new_username_TM_member').val().trim(),
                          'user_type' : user_existence
                        }
              $.ajax({ 
                url: '/buildings/LEED:' + getUrlParameter('LEED') + '/addmembertoexception/',
                type: 'POST',
                data: JSON.stringify(TM_data),
                contentType: 'application/json',
                success: function(response) {
                  if (response.message == "SUCCESS"){
                    var today = new Date();
                    var dd = today.getDate();
                    var mm = today.getMonth()+1; //January is 0!
                    var yyyy = today.getFullYear();

                    if(dd<10) {
                        dd='0'+dd
                    } 

                    if(mm<10) {
                        mm='0'+mm
                    } 

                    today_date = mm + '/' + dd + '/' + yyyy;

                    var dropdown_value_dir_TM = '<select disabled class="permission_dropdown_TM permission_dropdown_disabled_TM member_button"><option value="Project Admin">ADMIN</option><option value="Project Team Manager">MANAGER</option><option selected value="Project Team Member">MEMBER</option><option value="None">NONE</option></select>';
                    $('#team_member_main_container_modal').append('<div class="team_member_row_container"><div class="team_name_perm inline_block"><span class="team_member_name" data-title="User E-mail">' + $('#new_username_TM_member').val().trim() + '</span><span class="team_member_perm" data-title="Permission Status">' + dropdown_value_dir_TM + '</span><div class="ajax_loader_dropdown_TM_member"></div></div><div class="team_modified_edit inline_block light_color"><span clas="light_color">Modified</span><span class="team_member_modified" data-title="Date Modified">' + today_date + '</span><span class="edit_team_permission_TM"></span></div></div>');
                    $('.ajax_loader_TM_member').hide();
                    $('#new_username_TM_member').val('');
                      $('.total_teamMembers').html(parseInt($('.total_teamMembers').html()) + 1)
                  }
                },
                error: function(xhr) { // if error occured
                  $('#new_username_TM_member').val('');
                  $('.ajax_loader_TM_member').hide();
                }
              }); 
            },
            error: function(xhr) { // if error occured
              $('#new_username_TM_member').val('');
              $('.ajax_loader_TM_member').hide();
            }
          });
        }
      }
    });

    $('.card').on('click', '.edit_team_permission_TM', function() {
      $(this).parent().parent().find('.permission_dropdown_TM').prop("disabled", false);
      $(this).parent().parent().find('.permission_dropdown_TM').removeClass("permission_dropdown_disabled_TM");
    });


    $('.card').on('change', '.permission_dropdown_TM', function() {
      $(this).parent().parent().find('.ajax_loader_dropdown_TM_member').show();
      
      if ( $(this).val().trim() == "Project Admin" ) {
        $(this).removeClass('manager_button').removeClass('member_button').removeClass('none_button').addClass('admin_button');
      }
      else if($(this).val().trim() == "Project Team Member") {
        $(this).removeClass('manager_button').removeClass('admin_button').removeClass('none_button').addClass('member_button');
      }
      else if($(this).val().trim() == "Project Team Manager") {
        $(this).removeClass('admin_button').removeClass('member_button').removeClass('none_button').addClass('manager_button');
      }
      else if($(this).val().trim() == "None") {
        $(this).removeClass('manager_button').removeClass('member_button').removeClass('admin_button').addClass('none_button');
      }

      var admin_present = false;

      if (($(this).val()).trim() == "None" || ($(this).val()).trim() == "Project Team Member" || ($(this).val()).trim() == "Project Team Manager") {
        $(".permission_dropdown_TM").each(function( index ) {
          if ($(this).val().trim() == "Project Admin"){
            admin_present = true;
          }
        });
      }
      else {
        admin_present = true;
      }

      if (!admin_present){
        $('.multiple_id_member').html("Project should have at least one Project Admin.");
        $('.multiple_id_member').show();
        $(this).val("Project Admin");
        $('.ajax_loader_dropdown_TM_member').hide();
        $(this).parent().find('.permission_dropdown_TM').prop("disabled", true);
        $(this).parent().find('.permission_dropdown_TM').addClass("permission_dropdown_disabled_TM");
      }
      else{
        $('.multiple_id_member').hide();
        var $dropdown_this = $(this).parent().find('.permission_dropdown_TM');
        var TM_data = { 'user_name' : ($(this).parent().parent().find(".team_member_name").html()).trim(),
                        'permission_type' : ($(this).val()).trim()
                      }
        $.ajax({ 
          url: '/buildings/LEED:' + getUrlParameter('LEED') + '/addmembertoexception/',
          type: 'PUT',
          data: JSON.stringify(TM_data),
          contentType: 'application/json',
          success: function(response) {
            if (response.message == "SUCCESS"){
              $('.ajax_loader_dropdown_TM_member').hide();
              $dropdown_this.prop("disabled", true);
              $dropdown_this.addClass("permission_dropdown_disabled_TM");
            }
          },
          error: function(xhr) { // if error occured
            $('.ajax_loader_dropdown_TM_member').hide();
            $(this).parent().find('.permission_dropdown_TM').prop("disabled", true);
            $(this).parent().find('.permission_dropdown_TM').addClass("permission_dropdown_disabled_TM");
          }
        });
      }
    });

    $(".skip_for_now, #close_teamManagement_modal").on('click', function()
    {
      if (msieversion() == 9){
        window.location.href = window.location.href.split(window.location.protocol + '//' + window.location.hostname)[1].split('&trigger=')[0].split('&modal=')[0] + '&modal=skippedModal';
        return false;
      }
      else{
        window.history.pushState({}, getUrlParameter('page'), window.location.href.split(window.location.protocol + '//' + window.location.hostname)[1].split('&trigger=')[0].split('&modal=')[0] + '&modal=skippedModal');
      }
      $('#activation_modal').modal('hide');
      $('#project_is_active').modal('hide');
      $('#skipped_modal').modal('show');
      skippedModal();
    });

    if (only_teamMember){
      $('.flow_footer').hide();
    }

  }
  //Team management ends

  //Meter setup starts
  function meterSetup(){

    $('#activation_modal_container').removeClass('activation_modal_w875').addClass('activation_modal_w450');

    $('.back_btn_access').html('< ADD MEMBERS');
    $('.back_btn_access, .back_btn').attr('onclick','').unbind('click');
    $('.back_btn_access, .back_btn').on('click', function(){
      if (check_BackAndNextPage('meterSetup', 'back', 'full') == undefined){
         window.location.href=main_dashboard_url;
      }
      else{
        ajax_call(check_BackAndNextPage('meterSetup', 'back', 'full'));
      }
    });

    $(".skip_for_now").on('click', function()
    {
      if (msieversion() == 9){
        window.location.href = window.location.href.split(window.location.protocol + '//' + window.location.hostname)[1].split('&trigger=')[0].split('&modal=')[0] + '&modal=skippedModal';
        return false;
      }
      else{
        window.history.pushState({}, getUrlParameter('page'), window.location.href.split(window.location.protocol + '//' + window.location.hostname)[1].split('&trigger=')[0].split('&modal=')[0] + '&modal=skippedModal');
      }
      $('#activation_modal').modal('hide');
      $('#project_is_active').modal('hide');
      $('#skipped_modal').modal('show');
      skippedModal();
    });

    $('#add_new_meter_save').css("cssText", "background-color: #95BF58 !important;");
    $('#add_new_meter_save').css("cssText", "border-color: #95BF58 !important;");
    $('#add_new_meter_save').prop('disabled', true);

    if (meter_modal_clicked_from == 'addNewMeter' || only_meterSetup) {
      $('body').on('click', '#close_meterSetup_modal', function()
      {
        $('#activation_modal').modal('hide');
        $("#add_new_meter_save").click();  
      });

      $('.flow_footer').hide();
      $('.skip_for_now').hide();
    }
    else {
      $('body').on('click', '#close_meterSetup_modal', function()
      {
        $('#activation_modal').modal('hide');
        $("#add_new_meter_save").click();  
      });
      $('.flow_footer').show();
      $('.skip_for_now').show();
    }
  }
  //Meter setup ends

  // Notification Module starts
  function notificationModule(){

    $('.jquery-arrow').click(function(){
      $('.jquery-header-bar').slideUp();
    });

    $('body').on('click', '#sign_agreement_popup_close', function()
    {
      $('#activation_modal').modal('hide');
      $('#skipped_modal').modal('hide');
      $('#project_is_active').modal('show');
    });

    $('body').on('click', '#sign_agreement_from_notification', function()
    {
      only_agreement = true;
      $('.flow_footer').hide();
      $('#project_is_active').modal('hide');
      $('#skipped_modal').modal('hide');
      $('#activation_modal').modal('show');
      ajax_call('buildingConfirmation');
      
    });

    $('body').on('click', '#new_user_manual_from_notification', function()
    {
      window.open('/static/LEED_Dynamic_Plaque_Manual.pdf');
      $.ajax({
        url: '/buildings/LEED:' + getUrlParameter('LEED') + '/notification/activity:new_user_manual/',
        type: 'DELETE',
        contentType: 'application/json'
      }).done(function(data) {
      }).fail(function(data) {
      });
    });

    $('body').on('click', '#select_plan_from_notification', function()
    {
      only_payment_pages = true;
      $('#project_is_active').modal('hide');
      $('#skipped_modal').modal('hide');
      $('#activation_modal').modal('show');
      $('.progress_imgs').html('<div class="progress_success_img_left progress_bar" data-div="softwareSubscription" title="Order Selection"></div><div class="progress_success_img_center progress_bar" data-div="payment" title="Payment"></div><div class="progress_success_img_right progress_bar" data-div="receipt" title="Receipt"></div>');
      ajax_call('buildingInfo');
    });

    $('body').on('click', '#add_team_from_notification', function()
    {
      if (building_status_backend != 'activated' && trial_version_backend != 'True'){

        var trial_text_for_modal = "It seems like your trial has expired";
        if (trial_expire_backend == "None"){
          $('.mandatory_step_header').html("ACTIVATE YOUR PROJECT");
          trial_text_for_modal = "It seems like your project is deactivated";
        }
        else{
          $('.mandatory_step_header').html("TRIAL EXPIRED");
          trial_text_for_modal = "It seems like your trial has expired";
        }

        if (is_agreement_required == 'True'){
          $('#mandatory_step_text').html(trial_text_for_modal + '. Please sign agreement and pay for your project to access the dashboard.');
          $('#sign_agreement_popup').modal('toggle');
        }
        else{
          $('#mandatory_step_text').html(trial_text_for_modal + '. Please pay for your project to access the dashboard.');
          $('#sign_agreement_popup').modal('toggle');
        }
      }
      else{
        $.ajax({
          url: '/buildings/LEED:' + getUrlParameter('LEED') + '/notification/activity:skipped_teamManagement/',
          type: 'DELETE',
          contentType: 'application/json'
        }).done(function(data) {
        }).fail(function(data) {
        });
        $('#project_is_active').modal('hide');
        $('#skipped_modal').modal('hide');
        $('#activation_modal').modal('show');
        only_teamMember = true;
        ajax_call('teamManagement');
      }
    });

    $('body').on('click', '#add_meter_from_notification', function()
    {
      if (building_status_backend != 'activated' && trial_version_backend != 'True'){

        var trial_text_for_modal = "It seems like your trial has expired";
        if (trial_expire_backend == "None"){
          $('.mandatory_step_header').html("ACTIVATE YOUR PROJECT");
          trial_text_for_modal = "It seems like your project is deactivated";
        }
        else{
          $('.mandatory_step_header').html("TRIAL EXPIRED");
          trial_text_for_modal = "It seems like your trial has expired";
        }

        if (is_agreement_required == 'True'){
          $('#mandatory_step_text').html(trial_text_for_modal + '. Please sign agreement and pay for your project to access the dashboard.');
          $('#sign_agreement_popup').modal('toggle');
        }
        else{
          $('#mandatory_step_text').html(trial_text_for_modal + '. Please pay for your project to access the dashboard.');
          $('#sign_agreement_popup').modal('toggle');
        }
      }
      else{
        $('#project_is_active').modal('hide');
        $('#skipped_modal').modal('hide');
        $('#activation_modal').modal('show');
        only_meterSetup = true;
        ajax_call('meterSetup');
      }
    });

    $('body').on('click', '#request_access_from_notification', function()
    {
      if (building_status_backend != 'activated' && trial_version_backend != 'True'){

        var trial_text_for_modal = "It seems like your trial has expired";
        if (trial_expire_backend == "None"){
          $('.mandatory_step_header').html("ACTIVATE YOUR PROJECT");
          trial_text_for_modal = "It seems like your project is deactivated";
        }
        else{
          $('.mandatory_step_header').html("TRIAL EXPIRED");
          trial_text_for_modal = "It seems like your trial has expired";
        }

        if (is_agreement_required == 'True'){
          $('#mandatory_step_text').html(trial_text_for_modal + '. Please sign agreement and pay for your project to access the dashboard.');
          $('#sign_agreement_popup').modal('toggle');
        }
        else{
          $('#mandatory_step_text').html(trial_text_for_modal + '. Please pay for your project to access the dashboard.');
          $('#sign_agreement_popup').modal('toggle');
        }
      }
      else{
        window.location.href ="/dashboard/?page=account&section=teamManagement&LEED=" + getUrlParameter('LEED');
      }
    });

    $('body').on('click', '#score_computation_from_notification', function()
    {
      if (building_status_backend != 'activated' && trial_version_backend != 'True'){

        var trial_text_for_modal = "It seems like your trial has expired";
        if (trial_expire_backend == "None"){
          $('.mandatory_step_header').html("ACTIVATE YOUR PROJECT");
          trial_text_for_modal = "It seems like your project is deactivated";
        }
        else{
          $('.mandatory_step_header').html("TRIAL EXPIRED");
          trial_text_for_modal = "It seems like your trial has expired";
        }

        if (is_agreement_required == 'True'){
          $('#mandatory_step_text').html(trial_text_for_modal + '. Please sign agreement and pay for your project to access the dashboard.');
          $('#sign_agreement_popup').modal('toggle');
        }
        else{
          $('#mandatory_step_text').html(trial_text_for_modal + '. Please pay for your project to access the dashboard.');
          $('#sign_agreement_popup').modal('toggle');
        }
      }
      else{
        window.plaque.survey.alertTransportSurveyValue("Score computation is in progress. We will update the racetracks soon.");
      }
    });

    $('body').on('click', '#data_input_setup_from_notification', function()
    {
      if (building_status_backend != 'activated' && trial_version_backend != 'True'){

        var trial_text_for_modal = "It seems like your trial has expired";
        if (trial_expire_backend == "None"){
          $('.mandatory_step_header').html("ACTIVATE YOUR PROJECT");
          trial_text_for_modal = "It seems like your project is deactivated";
        }
        else{
          $('.mandatory_step_header').html("TRIAL EXPIRED");
          trial_text_for_modal = "It seems like your trial has expired";
        }

        if (is_agreement_required == 'True'){
          $('#mandatory_step_text').html(trial_text_for_modal + '. Please sign agreement and pay for your project to access the dashboard.');
          $('#sign_agreement_popup').modal('toggle');
        }
        else{
          $('#mandatory_step_text').html(trial_text_for_modal + '. Please pay for your project to access the dashboard.');
          $('#sign_agreement_popup').modal('toggle');
        }
      }
      else{
        window.location.href ="/dashboard/?page=data_input&section=setup&LEED=" + getUrlParameter('LEED');
      }
    });

    $('body').on('click', '#data_input_energy_from_notification', function()
    {
      if (building_status_backend != 'activated' && trial_version_backend != 'True'){

        var trial_text_for_modal = "It seems like your trial has expired";
        if (trial_expire_backend == "None"){
          $('.mandatory_step_header').html("ACTIVATE YOUR PROJECT");
          trial_text_for_modal = "It seems like your project is deactivated";
        }
        else{
          $('.mandatory_step_header').html("TRIAL EXPIRED");
          trial_text_for_modal = "It seems like your trial has expired";
        }

        if (is_agreement_required == 'True'){
          $('#mandatory_step_text').html(trial_text_for_modal + '. Please sign agreement and pay for your project to access the dashboard.');
          $('#sign_agreement_popup').modal('toggle');
        }
        else{
          $('#mandatory_step_text').html(trial_text_for_modal + '. Please pay for your project to access the dashboard.');
          $('#sign_agreement_popup').modal('toggle');
        }
      }
      else{
        window.location.href ="/dashboard/?page=data_input&section=energy&LEED=" + getUrlParameter('LEED');
      }
    });

    $('body').on('click', '#data_input_water_from_notification', function()
    {
      if (building_status_backend != 'activated' && trial_version_backend != 'True'){

        var trial_text_for_modal = "It seems like your trial has expired";
        if (trial_expire_backend == "None"){
          $('.mandatory_step_header').html("ACTIVATE YOUR PROJECT");
          trial_text_for_modal = "It seems like your project is deactivated";
        }
        else{
          $('.mandatory_step_header').html("TRIAL EXPIRED");
          trial_text_for_modal = "It seems like your trial has expired";
        }

        if (is_agreement_required == 'True'){
          $('#mandatory_step_text').html(trial_text_for_modal + '. Please sign agreement and pay for your project to access the dashboard.');
          $('#sign_agreement_popup').modal('toggle');
        }
        else{
          $('#mandatory_step_text').html(trial_text_for_modal + '. Please pay for your project to access the dashboard.');
          $('#sign_agreement_popup').modal('toggle');
        }
      }
      else{
        window.location.href ="/dashboard/?page=data_input&section=water&LEED=" + getUrlParameter('LEED');
      }
    });

    $('body').on('click', '#data_input_waste_from_notification', function()
    {
      if (building_status_backend != 'activated' && trial_version_backend != 'True'){

        var trial_text_for_modal = "It seems like your trial has expired";
        if (trial_expire_backend == "None"){
          $('.mandatory_step_header').html("ACTIVATE YOUR PROJECT");
          trial_text_for_modal = "It seems like your project is deactivated";
        }
        else{
          $('.mandatory_step_header').html("TRIAL EXPIRED");
          trial_text_for_modal = "It seems like your trial has expired";
        }

        if (is_agreement_required == 'True'){
          $('#mandatory_step_text').html(trial_text_for_modal + '. Please sign agreement and pay for your project to access the dashboard.');
          $('#sign_agreement_popup').modal('toggle');
        }
        else{
          $('#mandatory_step_text').html(trial_text_for_modal + '. Please pay for your project to access the dashboard.');
          $('#sign_agreement_popup').modal('toggle');
        }
      }
      else{
        window.location.href ="/dashboard/?page=data_input&section=waste&LEED=" + getUrlParameter('LEED');
      }
    });
      
    $('body').on('click', '#updated_userManual_notification', function()
    {
      if (building_status_backend != 'activated' && trial_version_backend != 'True'){

        var trial_text_for_modal = "It seems like your trial has expired";
        if (trial_expire_backend == "None"){
          $('.mandatory_step_header').html("ACTIVATE YOUR PROJECT");
          trial_text_for_modal = "It seems like your project is deactivated";
        }
        else{
          $('.mandatory_step_header').html("TRIAL EXPIRED");
          trial_text_for_modal = "It seems like your trial has expired";
        }

        if (is_agreement_required == 'True'){
          $('#mandatory_step_text').html(trial_text_for_modal + '. Please sign agreement and pay for your project to access the dashboard.');
          $('#sign_agreement_popup').modal('toggle');
        }
        else{
          $('#mandatory_step_text').html(trial_text_for_modal + '. Please pay for your project to access the dashboard.');
          $('#sign_agreement_popup').modal('toggle');
        }
      }
      else{
          
        $.ajax({
            url: '/buildings/LEED:' + getUrlParameter('LEED') + '/notification/activity:updated_userManual/',
            type: 'DELETE',
            contentType: 'application/json'
          }).done(function(data) {
            window.open('/static/LEED_Dynamic_Plaque_Manual.pdf');
          }).fail(function(data) {
            window.open('/static/LEED_Dynamic_Plaque_Manual.pdf');
          });
      }
    });
      
    $('body').on('click', '#score_changed_notification', function()
    {
      if (building_status_backend != 'activated' && trial_version_backend != 'True'){

        var trial_text_for_modal = "It seems like your trial has expired";
        if (trial_expire_backend == "None"){
          $('.mandatory_step_header').html("ACTIVATE YOUR PROJECT");
          trial_text_for_modal = "It seems like your project is deactivated";
        }
        else{
          $('.mandatory_step_header').html("TRIAL EXPIRED");
          trial_text_for_modal = "It seems like your trial has expired";
        }

        if (is_agreement_required == 'True'){
          $('#mandatory_step_text').html(trial_text_for_modal + '. Please sign agreement and pay for your project to access the dashboard.');
          $('#sign_agreement_popup').modal('toggle');
        }
        else{
          $('#mandatory_step_text').html(trial_text_for_modal + '. Please pay for your project to access the dashboard.');
          $('#sign_agreement_popup').modal('toggle');
        }
      }
      else{
          
        $.ajax({
            url: '/buildings/LEED:' + getUrlParameter('LEED') + '/notification/activity:score_changed/',
            type: 'DELETE',
            contentType: 'application/json'
          }).done(function(data) {
            window.location.href ="/dashboard/?page=overview&LEED=" + getUrlParameter('LEED');
          }).fail(function(data) {
            window.location.href ="/dashboard/?page=overview&LEED=" + getUrlParameter('LEED');
          });
      }
    });
      
    $('body').on('click', '#paymentDue_notification', function()
    {
      if (building_status_backend != 'activated' && trial_version_backend != 'True'){

        var trial_text_for_modal = "It seems like your trial has expired";
        if (trial_expire_backend == "None"){
          $('.mandatory_step_header').html("ACTIVATE YOUR PROJECT");
          trial_text_for_modal = "It seems like your project is deactivated";
        }
        else{
          $('.mandatory_step_header').html("TRIAL EXPIRED");
          trial_text_for_modal = "It seems like your trial has expired";
        }

        if (is_agreement_required == 'True'){
          $('#mandatory_step_text').html(trial_text_for_modal + '. Please sign agreement and pay for your project to access the dashboard.');
          $('#sign_agreement_popup').modal('toggle');
        }
        else{
          $('#mandatory_step_text').html(trial_text_for_modal + '. Please pay for your project to access the dashboard.');
          $('#sign_agreement_popup').modal('toggle');
        }
      }
      else{
          
        window.location.href ="/dashboard/?page=account&section=billinginformation&LEED=" + getUrlParameter('LEED');
      }
    });
      
    $('body').on('click', '#scoreReview_notification', function()
    {
      if (building_status_backend != 'activated' && trial_version_backend != 'True'){

        var trial_text_for_modal = "It seems like your trial has expired";
        if (trial_expire_backend == "None"){
          $('.mandatory_step_header').html("ACTIVATE YOUR PROJECT");
          trial_text_for_modal = "It seems like your project is deactivated";
        }
        else{
          $('.mandatory_step_header').html("TRIAL EXPIRED");
          trial_text_for_modal = "It seems like your trial has expired";
        }

        if (is_agreement_required == 'True'){
          $('#mandatory_step_text').html(trial_text_for_modal + '. Please sign agreement and pay for your project to access the dashboard.');
          $('#sign_agreement_popup').modal('toggle');
        }
        else{
          $('#mandatory_step_text').html(trial_text_for_modal + '. Please pay for your project to access the dashboard.');
          $('#sign_agreement_popup').modal('toggle');
        }
      }
      else{
          
        window.location.href ="/dashboard/?page=data_input&section=setup&LEED=" + getUrlParameter('LEED');
      }
    });

  $('body').on('click', '#data_input_transportation_from_notification', function()
  {

    $.ajax({
      url: '/buildings/LEED:' + getUrlParameter('LEED'),
      type: 'GET',
      contentType: 'application/json'
    }).done(function(data)
    {
      
      if (building_status_backend != 'activated' && trial_version_backend != 'True')
      {

        var trial_text_for_modal = "It seems like your trial has expired";
        if (trial_expire_backend == "None"){
          $('.mandatory_step_header').html("ACTIVATE YOUR PROJECT");
          trial_text_for_modal = "It seems like your project is deactivated";
        }
        else{
          $('.mandatory_step_header').html("TRIAL EXPIRED");
          trial_text_for_modal = "It seems like your trial has expired";
        }

        if (is_agreement_required == 'True')
        {
          $('#mandatory_step_text').html(trial_text_for_modal + '. Please sign agreement and pay for your project to access the dashboard.');
          $('#sign_agreement_popup').modal('toggle');
        }
        else
        {
          $('#mandatory_step_text').html(trial_text_for_modal + '. Please pay for your project to access the dashboard.');
          $('#sign_agreement_popup').modal('toggle');
        }
      }
      else
      {
        var val = encodeURI(window.location.protocol + '//' + window.location.hostname + '/dashboard/?page=survey&LEED=' + window.plaque.LEED + '&key=' + data.key);
        var url = val.replace(/&/g, "%26");
        var message = 'Hi there,%0A%0APlease fill out this quick survey to help us better understand our building performance and to make you as comfortable as possible. Click below to begin.%0A%0A'+url+' %0A%0AThank you for your important contributions to our LEED Dynamic Plaque data!%0A%0AWant to learn more about how we use the LEED Dynamic Plaque to track building performance? Visit leedon.io.';
        window.open('mailto:?subject=LEED Dynamic Plaque - Survey Link&body='+message, '_self');
      }
    });
    
  });

    $('body').on('click', '#data_input_human_from_notification', function()
    {
      if (building_status_backend != 'activated' && trial_version_backend != 'True'){

        var trial_text_for_modal = "It seems like your trial has expired";
        if (trial_expire_backend == "None"){
          $('.mandatory_step_header').html("ACTIVATE YOUR PROJECT");
          trial_text_for_modal = "It seems like your project is deactivated";
        }
        else{
          $('.mandatory_step_header').html("TRIAL EXPIRED");
          trial_text_for_modal = "It seems like your trial has expired";
        }
        
        if (is_agreement_required == 'True'){
          $('#mandatory_step_text').html(trial_text_for_modal + '. Please sign agreement and pay for your project to access the dashboard.');
          $('#sign_agreement_popup').modal('toggle');
        }
        else{
          $('#mandatory_step_text').html(trial_text_for_modal + '. Please pay for your project to access the dashboard.');
          $('#sign_agreement_popup').modal('toggle');
        }
      }
      else{
        window.location.href ="/dashboard/?page=data_input&section=human&LEED=" + getUrlParameter('LEED');
      }
    });




    // $(document).mouseup(function (e)
    // {
    //     var container = $(".meterInfo");

    //     if (!container.is(e.target) // if the target of the click isn't the container...
    //         && container.has(e.target).length === 0) // ... nor a descendant of the container
    //     {
    //         if ($(".notification_module").css("display")=="block"){
    //           $(".notification_module").toggle(300);
    //         }
    //     }
    // });

    // $(".meterInfo").on('click', function()
    // {
    //   $(".notification_module").toggle(300);
    // });

    var data_input_required = 0;
    var trial_required      = 0;

    var total_notification = data_input_required + trial_required;

    if (total_notification.length){
      $('.meterInfo').show();
      $('.meterInfoNumber').html(String(total_notification));
    }
    else{
      $('.meterInfo').hide();
    }

  }
  // Notification Module ends

  //Progress bar flow on click starts
  function checkProgressBarOnClick(){
    $('.progress_bar').on('click', function(){
      var from_page = getUrlParameter('modal').trim();
      var to_page   = $(this).attr('data-div');

      if ($(this).hasClass('bg-green-progress')){

        if (from_page == "receipt"){
          if (directionOnClick(from_page, to_page) == "Forward"){
            ajax_call(to_page);
          }
          else{
            alertify.alert('You have already made payment for your project.');
          }
        }
        else if(from_page == 'payment'){
          if (directionOnClick(from_page, to_page) == "Backward"){
            paymentFieldAlert(to_page);
          }
        }
        else if(from_page == 'buildingConfirmation'){
          if (directionOnClick(from_page, to_page) == "Backward"){
            alertify.alert('This option is not clickable.');
          }
        }
        else if (from_page == 'teamManagement' || from_page == 'meterSetup'){
          if (directionOnClick(from_page, to_page) == "Backward" || directionOnClick(from_page, to_page) == "Forward"){
            if (to_page == 'teamManagement' || to_page == 'meterSetup'){
              ajax_call(to_page);
            }
            else{
              alertify.alert('This option is not clickable.');
            }
          }
        }
        else{
          ajax_call(to_page);
        }

      }
    });
  }
  //Progress bar flow on click ends

  //Direction on clicking progress bar starts
  function directionOnClick(from, to){
    var from_page_index = window.full_version_arr.indexOf(from);
    var to_page_index   = window.full_version_arr.indexOf(to);
    if (from_page_index > to_page_index) {
      return "Backward";
    }
    else if(from_page_index > to_page_index){
      return "Forward";
    }
    else{
      return "Same";
    }
  }
  //Direction on clicking progress bar ends

  //Show alert while going back from payment page starts
  function paymentFieldAlert(to_page){
    var showModal = false;
    $('.checkS').each(function()
    {
      try
      {
        if(parseInt($(this).val().length) > 0)
        {
           showModal = true;
        }    
      }
      catch (err)
      {
        if($(this).val() != null)
        {
           showModal = true;
        }  
      }
    });

    $("#DIeCommFrame").contents().find(".credit").each(function (){
      if($(this).attr('name') == "Paymetric_CreditCardNumber")
      {
        try
        {
          if(parseInt($(this).val().length) > 0)
          {
             showModal = true;
          }    
        }
        catch (err)
        {
          if($(this).val() != null)
          {
             showModal = true;
          }  
        }
      }
      else if($(this).attr('name') == "Paymetric_CVV")
      {
        try
        {
          if(parseInt($(this).val().length) > 0)
          {
             showModal = true;
          }    
        }
        catch (err)
        {
          if($(this).val() != null)
          {
             showModal = true;
          }  
        }
      }
    });

    if (showModal){
      alertify.alert('Are you sure you want to go back? You will loose all your entered info.');
      $('.alertify-inner').prepend('<button class="close meter_select_close manual_meter_close" id="close_alertify_modal" type="button">×</button>');
      if (Modernizr.touchEvents || Modernizr.touch){
        $('#alertify-ok').on("touchstart", function(){
          ajax_call(to_page);
        });
        $('#close_alertify_modal').on("touchstart", function(){
          $('#alertify-ok').attr('touchstart','').unbind('touchstart');
          $('#alertify-ok').trigger('touchstart');
        });
      }
      else{
        $('#alertify-ok').on("click", function(){
          ajax_call(to_page);
        });

        $('#close_alertify_modal').on("click", function(){
          $('#alertify-ok').attr('click','').unbind('click');
          $('#alertify-ok').trigger('click');
        });
      }
    }
    else{
      ajax_call(to_page);
    }
  }
  //Show alert while going back from payment page ends

  //Store permission request to database starts
  function permissionRequest(){
    $("#permission_needed_request").add("#permission_needed_request2").on('click', function()
    {
        if(logIn == 'True')
        {
            $("#preloader_permission_needed").show();
            $("#status_permission_needed").show();
            $.ajax({
                url: '/buildings/LEED:' + getUrlParameter('LEED') + '/permission/request/',
                type: 'POST',
                data: JSON.stringify({}),
                contentType: 'application/json',
                success: function(response) {
                    if (response == "SUCCESS"){
                        $("#preloader_permission_needed").hide();
                        $("#status_permission_needed").hide();
                        $('#permission_needed').modal('hide');
                        $('#permission_needed_sent').modal('toggle');
                    }
          if (response == "DENIED"){
                        $("#preloader_permission_needed").hide();
                        $("#status_permission_needed").hide();
                        $('#permission_needed').modal('hide');
                        $('#permission_denied').modal('toggle');
                    }
                    else if(response == "ALREADY EXIST")
                    {
                        $("#preloader_permission_needed").hide();
                        $("#status_permission_needed").hide();
                        $('.publicLEED').modal('hide');
                        $('#permission_needed_sent').modal('toggle');
                    }
                    else{
                        $("#preloader_permission_needed").hide();
                        $("#status_permission_needed").hide();
                    }
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) { 
                    $("#preloader_permission_needed").hide();
                    $("#status_permission_needed").hide();
                }
            });    
        }
        else if(logIn == 'False')
        {
            $('.publicLEED').modal('toggle');
            $("#login_iFrame").attr('src',window.location.protocol + '//' + window.location.hostname+'/auth/login/?STAT=REQ_ACCESS&LEED='+ getUrlParameter('LEED'));
            $('#login_modal').modal('toggle');  
        }
    });
    }
  //Store permission request to database ends

  //Check Internet explorer version
  function msieversion(){
    var ua = window.navigator.userAgent;
    var msie = ua.indexOf("MSIE ");
    return parseInt(ua.substring(msie + 5, ua.indexOf(".", msie)));
  }

});
