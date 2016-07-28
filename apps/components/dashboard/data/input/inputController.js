LEEDOnApp.controller('inputController', function($rootScope, $scope) {
	$rootScope.header = 'Data Input';
	document.getElementById("manual_img").style.display = "block";
	$scope.selectedTab = 'energy';
	window.section = $scope.selectedTab;
	$('body').on('click', '.meterName',function(){
		$('#add_data_button').show();
		$('.normal_meter').hide();
		$('.waste_meter').show();
		$('.meterList').hide();	
		$('.editMeter').show();
		$('.data_input_tool_bar').html('<i class="fa fa-arrow-left mr10" aria-hidden="true"></i>All Meters');
		$('.containerDiv').removeClass("greyBorder");
		$('.data_input_tool_bar').addClass('back_to_all_img');
		$('.data_input_tool_bar').removeClass('input_nav_active');
		$('.data_input_tool_bar').removeClass('active');
		$('.survey_tool_bar').hide();
		$('.data_input_category_nav').hide();
		$('.desktop_version').show();
		$('.touch_version').hide();
	});
	$('body').on('click', '.back_to_all_img',function(){
		$('#add_data_button').hide();
		$('.normal_meter').show();
		$('.waste_meter').hide();
		$('.meterList').show();	
		$('.editMeter').hide();
		$('.data_input_tool_bar').html('Inputs');
		$('.containerDiv').addClass("greyBorder");
		$('.data_input_tool_bar').removeClass('back_to_all_img');
		$('.data_input_tool_bar').addClass('input_nav_active');
		$('.data_input_tool_bar').addClass('active');
		$('.survey_tool_bar').show();
		$('.data_input_category_nav').show();
		$('.desktop_version').hide();
		$('.touch_version').show();
	});
	$('body').on("click","#upload_data", function(){
		$('#upload_data_modal').modal('show');
		$('#add_data_modal').modal('hide');
	});
	$('#browse_data_btn').on("click", function(e) {
	    $('#template_data').trigger(e);
	});

	$('body').on("change", "#template_data", function() {
		var filePath = $(this).val();
		filePath = filePath.replace("/\\/", "\\\\");
		var index = filePath.lastIndexOf("\\");
		filePath = filePath.substring(index + 1, filePath.length);
		$('#template_path').val(filePath);
		$('#upload_data_btn').prop('disabled', false);
		$('#upload_data_btn').css('background', '-webkit-linear-gradient(top, #3bb34a 0%, #019146 100%)');
		$('#upload_data_btn').css('color', 'white');
		$('.invalid_format').css('display', 'none');
	});
});