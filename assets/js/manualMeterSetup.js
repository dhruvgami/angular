var category = "";
var new_meter_title = "";
var new_meter_id = "";
var new_meter_type = "";
var getMeterData;
$( document ).ready(function() {
    
$('.other_fuel_drp_energy_grp').show();

  $(".pressEnter").keyup(function(event){
    if(event.keyCode == 13){
        $("#data_input_energystar_search").click();
    }
  });

  $("#meter_name_manually").keyup(function(event){
    if(event.keyCode == 13){
        if(checkMeterName())
            $("#add_meter_manually").click();
    }
  });
    
function checkMeterName()
{
      if($("#meter_name_manually").val().length > 64)
      {
        $("#meter_name_manually").css('cssText', 'border: 1px solid red !important;');
        $('#continue_manual_meter').prop('disabled', true);  
        $('#add_meter_manually').prop('disabled', true); 
        return false;
      }
      else if($("#meter_name_manually").val().length < 65)
      {
        $("#meter_name_manually").css('cssText', 'border: 1px solid #E2DFDF !important;');
        $('#continue_manual_meter').prop('disabled', false);
        $('#add_meter_manually').prop('disabled', false);
        return true;
      }
}

  $("#meter_name_manually").on('blur',function()
  {
      checkMeterName();
  });
    
/*$('body').on('keydown', '#meter_name_manually', function()
{
    if($('#meter_name_manually').val().length == 64)
    {
        $('#meter_name_manually').val($('#meter_name_manually').val().substr(0, $('#meter_name_manually').val().length - 1));
    }
});*/
    
  var lid = getUrlParameter('LEED');
    

  $('#manual_meter_setup').on('hide.bs.modal', function () {
    $('#activation_modal').modal('toggle');
  });

  
  $('#meter_setup_close_button').on('click', function () {
    if ($('#manual_meter_num').text()!=='' || $('#energystar_meter_num').text()!==''){
      location.reload(); 
    }
  });

  $('#honeywell_img').on('click', function() {
    $('#activation_modal').modal('toggle');
    $('#honeywell_modal_window').modal('toggle');
  });

  $('#honeywell_modal_window').on('hide.bs.modal', function () {
    $('#activation_modal').modal('toggle');
  });

  //Default values of dropdown
  typeId = $('.other_fuel_manual_meter_drp').attr('data-id');
  $('.left_actionbtn_cust').addClass('energy_manual_meter');
  $('.left_actionbtn_cust').removeClass('water_manual_meter waste_manual_meter human_manual_meter otherfuels_manual_meter');
  $('.dropdown_txt').text('Electricity');
  $('.unit_btn').addClass('energy_bg').removeClass('water_bg').removeClass('other_bg');
  $('.right_actionbtn_cust .caret').addClass('colorenergy').removeClass('colorwater').removeClass('colorother');
  $('.meter_unit').text('kWh');
  $('.other_fuel_manual_meter_drp_grp').hide();
  $('.other_fuel_drp_grp').hide();
  var newOptions = getNewOptions('ELECTRICITY',typeId);
  $('.meter_units').html('')   // clear the existing options
  $.each(newOptions,function(i,o){
      $('<li class="energy_manual_meter_unit"><a>' + o + '</a></li>').appendTo('.meter_units');
  });
  ///////////

  $('.energy_drpbtn').on('click', function() {
  typeId = $('.other_fuel_manual_meter_drp').attr('data-id');
    $('.left_actionbtn_cust').addClass('energy_manual_meter');
    $('.left_actionbtn_cust').removeClass('co2_manual_meter water_manual_meter waste_manual_meter human_manual_meter otherfuels_manual_meter');
    $('.dropdown_txt').text('Electricity');
    $('.unit_btn').addClass('energy_bg').removeClass('water_bg').removeClass('other_bg').removeClass('co2_bg');
    $('.right_actionbtn_cust .caret').addClass('colorenergy').removeClass('colorwater').removeClass('colorother');
    $('.meter_unit').text('kWh');
    $('.other_fuel_manual_meter_drp_grp').hide();
    $('.other_fuel_drp_grp').hide();
    var newOptions = getNewOptions('ELECTRICITY',typeId);
    $('.meter_units').html('')   // clear the existing options
    $.each(newOptions,function(i,o){
        $('<li class="energy_manual_meter_unit"><a>' + o + '</a></li>').appendTo('.meter_units');
    }); 
  });
  $('.co2_drpbtn').on('click', function() {
  typeId = $('.other_fuel_manual_meter_drp').attr('data-id');
    $('.left_actionbtn_cust').addClass('co2_manual_meter');
    $('.left_actionbtn_cust').removeClass('energy_manual_meter water_manual_meter waste_manual_meter human_manual_meter vocs_manual_meter otherfuels_manual_meter');
    $('.dropdown_txt').text('CO2');
    $('.unit_btn').addClass('co2_bg').removeClass('water_bg').removeClass('other_bg').removeClass('energy_bg');
    $('.right_actionbtn_cust .caret').addClass('colorco2').removeClass('colorwater').removeClass('colorother').removeClass('colorenergy');
    $('.meter_unit').text('ppm');
    $('.other_fuel_manual_meter_drp_grp').hide();
    $('.other_fuel_drp_grp').hide();
    var newOptions = getNewOptions('CO2',typeId);
    $('.meter_units').html('')   // clear the existing options
    $.each(newOptions,function(i,o){
        $('<li class="co2_manual_meter_unit"><a>' + o + '</a></li>').appendTo('.meter_units');
    }); 
  });
  $('.vocs_drpbtn').on('click', function() {
  typeId = $('.other_fuel_manual_meter_drp').attr('data-id');
    $('.left_actionbtn_cust').addClass('vocs_manual_meter');
    $('.left_actionbtn_cust').removeClass('energy_manual_meter water_manual_meter waste_manual_meter human_manual_meter co2_manual_meter otherfuels_manual_meter');
    $('.dropdown_txt').text('VOCs');
    $('.unit_btn').addClass('co2_bg').removeClass('water_bg').removeClass('other_bg').removeClass('energy_bg');
    $('.right_actionbtn_cust .caret').addClass('colorco2').removeClass('colorwater').removeClass('colorother').removeClass('colorenergy');
    $('.meter_unit').text('ug/m3');
    $('.other_fuel_manual_meter_drp_grp').hide();
    $('.other_fuel_drp_grp').hide();
    var newOptions = getNewOptions('VOCs',typeId);
    $('.meter_units').html('')   // clear the existing options
    $.each(newOptions,function(i,o){
        $('<li class="co2_manual_meter_unit"><a>' + o + '</a></li>').appendTo('.meter_units');
    }); 
  });    
  $('.water_drpbtn').on('click', function() {
  typeId = $('.other_fuel_manual_meter_drp').attr('data-id');

    $('.left_actionbtn_cust').addClass('water_manual_meter');
    $('.left_actionbtn_cust').removeClass('energy_manual_meter waste_manual_meter human_manual_meter otherfuels_manual_meter');
    $('.dropdown_txt').text('Water');
    $('.unit_btn').addClass('water_bg').removeClass('energy_bg').removeClass('other_bg').removeClass('co2_bg');
    $('.right_actionbtn_cust .caret').addClass('colorwater').removeClass('colorenergy').removeClass('colorother');
    $('.meter_unit').text('gal');
    $('.other_fuel_manual_meter_drp_grp').hide();
    $('.other_fuel_drp_grp').hide();
    var newOptions = getNewOptions('WATER',typeId);
    $('.meter_units').html('')   // clear the existing options
    $.each(newOptions,function(i,o){
        $('<li class="water_manual_meter_unit"><a>' + o + '</a></li>').appendTo('.meter_units');
    }); 
  });
    
  $('#energy_type_list').on('click', function() {
      $('.dropdown_txt').text('ELECTRICITY');
      $('.unit_btn').addClass('other_bg').removeClass('water_bg').removeClass('other_bg').removeClass('co2_bg');
      $('.right_actionbtn_cust .caret').addClass('colorenergy').removeClass('colorwater').removeClass('colorother');
      $('.other_fuel_drp_grp').hide();
      $('.other_fuel_drp_water_grp').hide();
      $('.other_fuel_drp_energy_grp').show();
  });

 $('#water_type_list').on('click', function() {
      $('.dropdown_txt').text('WATER');
      $('.unit_btn').addClass('other_bg').removeClass('other_bg').removeClass('energy_bg').removeClass('co2_bg');
      $('.right_actionbtn_cust .caret').addClass('colorwater').removeClass('colorother').removeClass('colorenergy');     
      $('.other_fuel_drp_grp').hide();
      $('.other_fuel_drp_energy_grp').hide();
      $('.other_fuel_drp_water_grp').show();
  });
  
  $('.otherfuels_drpbtn').on('click', function() {
      typeId = $('.other_fuel_manual_meter_drp').attr('data-id');
      $('.left_actionbtn_cust').addClass('otherfuels_manual_meter');
      $('.left_actionbtn_cust').removeClass('energy_manual_meter water_manual_meter waste_manual_meter human_manual_meter');
      $('.dropdown_txt').text('Other fuels');
      $('.unit_btn').addClass('other_bg').removeClass('water_bg').removeClass('energy_bg').removeClass('co2_bg');
      $('.right_actionbtn_cust .caret').addClass('colorother').removeClass('colorwater').removeClass('colorenergy');
      $('.meter_unit').text('kWh');
            $('.other_fuel_drp_water_grp').hide();
      $('.other_fuel_drp_energy_grp').hide();

      $('.other_fuel_drp_grp').show();
      var newOptions = getNewOptions('OTHER FUELS');
      $('.meter_units').html('');   // clear the existing options
      $.each(newOptions,function(i,o){
          $('<li class="other_fuel_unit"><a>' + o + '</a></li>').appendTo('.meter_units');
      }); 
  });
  $(".other_fuel_drp_ul").on('click', 'li a', function(){
          var typeId = $(this).attr('value');
          $(".other_fuel_drp:first-child").find('.other_fuel_txt').text($(this).text());
          $(".other_fuel_drp:first-child").find('.other_fuel_txt').attr('data-id', typeId);
          $(".other_fuel_drp:first-child").val($(this).text());
          $('.other_fuel_drp:first-child').attr('data-id',$(this).attr('value'));
          var newOptions = getNewOptions('OTHER FUELS');
          $('.meter_units').html('');
          $.each(newOptions,function(i,o){
            $('<li class="energy_unit"><a>' + o + '</a></li>').appendTo('.meter_units');
          });
    });
    
      $(".energy_manual_ul").on('click', 'li a', function(){
          var typeId = $(this).attr('value');
          $(".energy_manual_drp:first-child").find('.energy_manual_txt').text($(this).text());
          $(".energy_manual_drp:first-child").find('.energy_manual_txt').attr('data-id', typeId);
          $(".energy_manual_drp:first-child").find('.energy_manual_txt').attr('value', typeId);
          $(".energy_manual_drp:first-child").val($(this).text());
          $('.energy_manual_drp:first-child').attr('data-id',$(this).attr('value'));
    });
      $("#area_type li a").on('click', function(){
          var typeId = $(this).attr('value');
          $("#area_type_energy_text:first-child").find('.area_type_txt').text($(this).text());
          $("#area_type_energy_text:first-child").find('.area_type_txt').attr('value', typeId);
    });
      $("#responsibility li a").on('click', function(){
          var typeId = $(this).attr('value');
          $("#responsibility_text:first-child").find('.responsibility_txt').text($(this).text());
          $("#responsibility_text:first-child").find('.responsibility_txt').attr('value', typeId);
    });
  $(".water_manual_drp_ul").on('click', 'li a', function(){
          var typeId = $(this).attr('value');
          $(".water_manual_drp:first-child").find('.water_manual_txt').text($(this).text());
          $(".water_manual_drp:first-child").find('.water_manual_txt').attr('data-id', typeId);
          $(".water_manual_drp:first-child").find('.water_manual_txt').attr('value', typeId);
          $(".water_manual_drp:first-child").val($(this).text());
          $('.water_manual_drp:first-child').attr('data-id',$(this).attr('value'));
    });

    
    $(".other_fuel_drplist").on('click', 'li a', function(){
        $(".other_fuel_unit_btn:first-child").text($(this).text());
        $(".other_fuel_unit_btn:first-child").val($(this).text());

  });
  $(".meter_units").on('click', 'li a', function(){
      $(".unit_btn:first-child").find('.meter_unit').text($(this).text());
      //$(".unit_btn:first-child").val($(this).text());

   });
    
    // $('body').on('click', '.add_meter_close', function()
    // {
    //     $("#add_new_meter_save").click();  
    // });
    
    $('body').on('click', '#add_new_meter_save', function()
    {
        if ($('#manual_meter_num').text()!=='' || $('#energystar_meter_num').text()!==''){
          if (meter_modal_clicked_from == 'addNewMeter'){
            window.location.href='/dashboard/?page=data_input&section=' + getUrlParameter('section') + '&LEED=' + getUrlParameter('LEED');
          }
          else{
             window.location.href='/dashboard/?page=data_input&section=setup&LEED=' + getUrlParameter('LEED');
          }
        }
        else{
          $('#activation_modal').modal('hide');
        }
    });

  function getNewOptions(val,typeId){
      if (val == 'ELECTRICITY')
          return ['kWh','MWh','MBtu','kBtu','GJ'];
      else if (val == 'WATER')
         return ['gal', 'kGal', 'MGal', 'cf', 'ccf', 'kcf', 'mcf', 'l', 'cu m', 'gal(UK)', 'kGal(UK)', 'MGal(UK)'];
      else if (val == 'CO2')
          return ['ppm'];
      else if (val == 'VOCs')
          return ['ug/m3'];
      else if(val == 'OTHER FUELS')
      {
        var typeId = $('.other_fuel_txt').attr('data-id');
    if(typeId == 1)
    {
        return ["kBtu", "MBtu", "cf", "ccf", "kcf", "mcf", "therms", "cu m", "GJ", "kWh", "MWh"];
    }
    if(typeId == 3)
    {
              return ["kBtu", "MBtu", "tons", "Tonnes (metric)", "GJ", "kWh", "MWh"];
    }
    if(typeId == 4)
    {
              return ["kBtu", "MBtu", "cf", "kcf", "gal", "gal(UK)", "l", "GJ", "kWh", "MWh"];
    }
    if(typeId == 5)
    {
              return ["kBtu", "MBtu", "cf", "kcf", "gal", "gal(UK)", "l", "GJ", "kWh", "MWh"];
    }
    if(typeId == 6)
    {
              return ["kBtu", "MBtu", "gal", "gal(UK)", "l", "GJ", "kWh", "MWh"];
    }
    if(typeId == 7)
    {
              return ["kBtu", "MBtu", "gal", "gal(UK)", "l", "GJ", "kWh", "MWh"];
    }
    if(typeId == 2)
    {
              return ["kBtu", "MBtu", "gal", "gal(UK)", "l", "GJ", "kWh", "MWh"];
    }
    if(typeId == 12)
    {
              return ["kBtu", "MBtu", "gal", "gal(UK)", "l", "GJ", "kWh", "MWh"];
    }
    if(typeId == 8)
    {
              return ["kBtu", "MBtu", "gal", "gal(UK)", "l", "GJ", "kWh", "MWh"];
    }
    if(typeId == 9)
    {
              return ["kBtu", "MBtu", "tons", "Lbs", "kLbs", "MLbs", "Tonnes (metric)", "GJ", "kWh", "MWh"];
    }
    if(typeId == 10)
    {
              return ["kBtu", "MBtu", "tons", "Lbs", "kLbs", "MLbs", "Tonnes (metric)", "GJ", "kWh", "MWh"];
    }
    if(typeId == 11)
    {
              return ["kBtu", "MBtu", "tons", "Lbs", "kLbs", "MLbs", "Tonnes (metric)", "GJ", "kWh", "MWh"];
    }
    if(typeId == 13)
    {
              return ["kBtu", "MBtu", "gal", "gal(UK)", "l", "GJ", "kWh", "MWh"];
    }
    if(typeId == 40)
    {
              return ["kBtu", "MBtu", "Lbs", "kLbs", "MLbs", "therms", "GJ", "kg", "kWh", "MWh"];
    }
    if(typeId == 41)
    {
              return ["kBtu", "MBtu", "therms", "GJ", "kWh", "MWh"];
    }
    if(typeId == 42 || typeId == 43 || typeId == 44)
    {
              return ["kBtu", "MBtu", "ton hours", "GJ", "kWh", "MWh"]; 
    }
    return ["kBtu", "MBtu", "cf", "ccf", "kcf", "mcf", "therms", "cu m", "GJ", "kWh", "MWh"];
      }
      else
      {
    return ["kBtu", "MBtu", "cf", "ccf", "kcf", "mcf", "therms", "cu m", "GJ", "kWh", "MWh"];
      }
      
    }
    

  $('#add_meter_manually').on('click', function() {
    createNewMeter();
    // $('#meter_name_manually').val('');
    // $('#meter_name_manually').css('border', '1px solid #ccc');
    // $('.energy_manual_meter_drpbtn').trigger('click');
  });

    
  function createNewMeter() {
    $('#meter_name_manually').css("cssText", "background: url('../assets/images/ajax_loader.gif') no-repeat right !important");
      
      if($('#meter_name_manually').val() == '')
          $('#meter_name_manually').css("cssText", "background: none !important");
    var $container, meterType, newMeterJson, typeId, units, lbl_on_off, lbl_class, leed_met_cat, toggle_type;
    meterType = $('.left_actionbtn_cust').text();
    var otherMeterType = $('.other_fuel_txt').text();
    var typeId = $('.other_fuel_txt').attr('data-id');
    var meterName = $('#meter_name_manually').val();
    var data_coverage_area = $('#id_data_coverage_area').val();
    var max_coverage_area = $('#id_max_coverage_area').val();
    var area_choice = $('.area_type_txt').attr('value');
    var responsibility = $('.responsibility_txt').attr('value');
    var meter_kind = "";
    var fuel_type = "";
    if(meterType=='Electricity' || meterType == 'ELECTRICITY') {
      typeId = $('#get_energy_type').attr('data-id');
      lbl_on_off = 'pts_energy_lbl';
      lbl_class = 'energy_lbl';
      leed_met_cat = $("#get_energy_type").text();
      toggle_type = 'cmn-toggle-round-flat4';
      meter_kind = "electricity";
      category = "energy";
    }
    else if(meterType=='Water' || meterType == 'WATER') {
      typeId = $('#get_water_type').attr('data-id');
      lbl_on_off = 'pts_water_lbl';
      lbl_class = 'water_lbl';
      leed_met_cat = $("#get_water_type").text();
      toggle_type = 'cmn-toggle-round-flat7';
      meter_kind = "water";
      category = "water";
    }
    else if(meterType=='CO2') {
      typeId = 206;
      lbl_on_off = 'pts_co2_lbl';
      lbl_class = 'co2_lbl';
      leed_met_cat = 'Co2';
      toggle_type = 'cmn-toggle-round-flat8';
      meter_kind = "co2";
      category = "humanexperience";
    }
    else if(meterType=='VOCs') {
      typeId = 205;
      lbl_on_off = 'pts_vocs_lbl';
      lbl_class = 'co2_lbl';
      leed_met_cat = 'Vocs';
      toggle_type = 'cmn-toggle-round-flat8';
      meter_kind = "voc";
      category = "humanexperience";
    }
    else {
      leed_met_cat = $('.other_fuel_txt').text();
      toggle_type = 'cmn-toggle-round-flat4';
      lbl_on_off = 'pts_energy_lbl';
      lbl_class = 'energy_lbl';
      meter_kind = "fuel";
      fuel_type = otherMeterType;
      category = "energy";
       typeId = $('.other_fuel_txt').attr('data-id')
    }
    if(meterName == '')
      $("#meter_name_manually").css('cssText', 'border: 1px solid red !important;');
    else {
      $('#meter_name_manually').css('border', '1px solid green');
      $('.meter_manual_ajax').show();
      $('#meter_name_manually').addClass('meter_manual_ajax');

    var native_unit = $('.unit_btn').text();
    
    newMeterJson = {
      "name": meterName,
      "native_unit": native_unit,
      "included": true,
      "meter_kind": meter_kind,
      "fuel_type" : fuel_type,
      "area_choice": area_choice,
      "responsibility": responsibility,
      "data_coverage_area": data_coverage_area,
      "max_coverage_area": max_coverage_area,
      "type": {
        "id": typeId
      }
    };
    // return $.ajax({
    //   url: '/buildings/LEED:' + getUrlParameter('LEED') + '/meters/',
    //   type: 'POST',
    //   dataType: 'jsonp',
    //   contentType: 'application/json',
    //   data: JSON.stringify(newMeterJson)
    // }).done(function(data) {
      $('#meter_name_manually').css("cssText", "background: none !important");
      var manual_meter_id = Math.random();
      $('#meter_name_manually').css('border', '1px solid #ccc');
      $('#meter_name_manually').removeClass('meter_manual_ajax');
      if($('#manual_meter_num').text()=='')
      {
        $('#manual_meter_num').text('+1');
        $('#add_new_meter_save').prop('disabled', false); 
      }
      else {
        var meter_num = $('#manual_meter_num').text();
        meter_num = meter_num.substr(1);
        var new_meter_num = parseInt(meter_num) + 1;
        $('#manual_meter_num').text('+'+new_meter_num);
      }
      $('.manually_added_meters_wrap').removeClass('display_none');
    
    if(newMeterJson.meter_kind != 'water')
      kind = 'energy';
    else
      kind = 'water'

      $('<ul class="payment_ul mb25">' +
        '<div class="row ml0 mr5">' +
          '<div class="col-lg-5 col-md-5 col-sm-5 col-xs-12 nopadding manual_meter_name">' + meterName + '</div>' +
          '<div class="manual_meter_name ml25 ' + lbl_on_off + ' nopadding col-lg-5 ' + lbl_class + '"><span class="leed_met_cat">' + leed_met_cat + '</span></div>' +
          '<div meter_kind="'+kind+'" class="need_plaque nopadding col-lg-1 pull-right amm_tick"' + ' meter-id="' + manual_meter_id + '"native-unit="' + native_unit + '"meter-name="' + meterName + '"type-ID="' + typeId + '">' +
            '<input id="' + manual_meter_id + '" class="cmn-toggle cmn-toggle-chk cmn-toggle-energy ' + toggle_type + '" checked="" type="checkbox">' +
            '<label for="' + manual_meter_id + '" class="field-tip"><span class="tip-content">Add or Remove meters</span></label>' +
          '</div>' +
        '</div>' +
      '</ul>').appendTo('#manual_meters_list');
      
      new_meter_id = manual_meter_id;
      new_meter_title = meterName;
      new_meter_type = native_unit;
      // getMeterData.meterData.push({
      //       'id': new_meter_id,
      //       'included': true,
      //       'name': new_meter_title,
      //       'native_unit': native_unit,
      //       'type': {
      //           'kind': meter_kind    
      //       }
      // });
        
      if(meter_kind != 'water')
      {
        getMeterData['energy'].push({});    
      }
      else
      {
        getMeterData['water'].push({});    
      }
        
      // getMeterData.meterAdded = true;
      // getMeterData.meterListAdded.push({
      //     'category': category,
      //     'new_meter_id': new_meter_id,
      //     'new_meter_title': new_meter_title,
      //     'new_meter_type': new_meter_type
      // });
       
    // }).fail(function(data) {
    //   $('#meter_name_manually').css("cssText", "background: none !important");
    //   $('#meter_name_manually').removeClass('meter_manual_ajax');
    // });
  }
  }

  $('#continue_manual_meter').on('click', function() {
      
      for(a in getMeterData.meterListAdded)
      {
          getMeterData.showNewMeter(getMeterData.meterListAdded[a].category, getMeterData.meterListAdded[a].new_meter_id, getMeterData.meterListAdded[a].new_meter_title, getMeterData.meterListAdded[a].new_meter_type);      
      }
      // $('#manual_meters_list').find('input:unchecked').each(function(i, obj) {
          
      //     var meterId = $(this).parent().attr('meter-id');

      //     $.ajax({
      //       url: '/buildings/LEED:' + lid + '/meters/ID:' + meterId + '/?recompute_score=1',
      //       type: 'DELETE',
      //       contentType: 'application/json'
      //     }).done(function(data) {
      //       //return $container.fadeOut();
      //     }).fail(function(data) {
      //       //return $container.fadeOut();
      //     });
      // });
    });

  $('.manually_added_meters_wrap').on('change', '.cmn-toggle' ,function () {
    if (!$(this).is(":checked")){
      var meterId = $(this).parent().attr('meter-id');
      // $.ajax({
      //       url: '/buildings/LEED:' + lid + '/meters/ID:' + meterId + '/?recompute_score=1',
      //       type: 'DELETE',
      //       contentType: 'application/json'
      //     }).done(function(data) {
            var meter_num = $('#manual_meter_num').text();
            meter_num = meter_num.substr(1);
            var new_meter_num = parseInt(meter_num) - 1;
            $('#manual_meter_num').text('+'+new_meter_num);
      
        for(a in getMeterData.meterListAdded)
        {
          if(getMeterData.meterListAdded[a].new_meter_id == meterId)
          {   
            getMeterData.meterListAdded.splice(a,1)
          }
        }
      $('.meterChart[meter_id='+meterId+']').remove();
      
      //     }).fail(function(data) {
      //       //return $container.fadeOut();
      // });
    }
    else{
      var newMeterJson = {
      "name": $(this).parent().attr('meter-name'),
      "native_unit": $(this).parent().attr('native-unit'),
      "included": true,
      "type": {
        "id": $(this).parent().attr('type-ID')
        }
      };
    
    getMeterData.meterListAdded.push({
          'category': $(this).parent().attr('meter_kind'),
          'new_meter_id': $(this).parent().attr('meter-id'),
          'new_meter_title': $(this).parent().attr('meter-name'),
          'new_meter_type': $(this).parent().attr('native-unit')
      });

    // $.ajax({
    //   url: '/buildings/LEED:' + lid + '/meters/',
    //   type: 'POST',
    //   dataType: 'jsonp',
    //   contentType: 'application/json',
    //   data: JSON.stringify(newMeterJson)
    // }).done(function(data) {
        var meter_num = $('#manual_meter_num').text();
        meter_num = meter_num.substr(1);
        var new_meter_num = parseInt(meter_num) + 1;
        $('#manual_meter_num').text('+'+new_meter_num);
    
    
      // });
    }
  });

  function getUrlParameter(sParam){
   return window.location.href.split("/dashboard/")[1].split("/")[0];
  }
});