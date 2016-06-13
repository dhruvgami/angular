 
 $(document).ready(function(){

  var status= '', filename= '', upload_id= '';
  var upload_arr = [];
  var upload_id_arr = [];
  var recursive_flag = false;

  $('body').on("click","#upload_data", function(){
    if(Modernizr.touch){
      $('#ipad_notification_modal').modal('show');
    }
    else{
      $('#upload_data_modal').modal('show');
    }
      $('#add_data_modal').modal('hide');
  });
  
  $('#browse_data_btn').on( "click", function(e){
      $('#template_data').trigger(e);
  });

  $('body').on("change","#template_data", function(){
      var filePath = $(this).val();
      filePath = filePath.replace("/\\/", "\\\\");
      var index = filePath.lastIndexOf("\\");
      filePath = filePath.substring(index+1, filePath.length);
      $('#template_path').val(filePath);
      $('#upload_data_btn').prop('disabled',false);
      $('#upload_data_btn').css('background','-webkit-linear-gradient(top, #3bb34a 0%, #019146 100%)');
      $('#upload_data_btn').css('color','white');
      $('.invalid_format').css('display', 'none');
  });

  $('.upload_modal_close').click(function(){
	    $('#template_path').val('');
	    $('#template_data').val('');
    	$('#upload_data_btn').prop('disabled',true);
    	$('#upload_data_btn').css('background','#ccc');
    	$('#upload_data_btn').css('color','#333333');
  		$('.invalid_format').css('display', 'none');
  });

  function getUrlParameter(sParam){
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++){
      var sParameterName = sURLVariables[i].split('=');
      if(sParameterName[0] == sParam){
        return sParameterName[1];
      }
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

$('#upload_data_btn').click(function(event){
  	event.preventDefault();
    var random_key = makeid();
    upload_arr.push(random_key.toString());

      $('.processing_icon').css('visibility','visible');
  		$('.loader_gif').css('opacity', 1);
  		$('.separator ').css('opacity',1);
      upload_functionality.checkStatusFlag = "true";
	    upload_functionality.current_upload_status = true;

  	$('<ul class="mb25 mt40">' +
	        '<div class="row ml0 upload_excel_status_row" id="' + random_key + '">' +
	          '<div class="display_inlineb nopadding file_name width70per">' + $('#template_path').val() + '</div>' +
            '<div class="display_inlineb float_right nopadding file_status_margin width30per">' +
              '<img height="20px" width="20px" src="/static/dashboard/img/pending.png" class="status_icon"/>' +
  	          '<div class="file_status"> Pending </div>' +
            '</div>' +
	        '</div>' +
	    '</ul>').appendTo('.file_info');

      var LeedId = getUrlParameter('LEED');
      document.Fileform.action ="/dashboard/uploadexceltempaltedata/?leed_id=" + LeedId + "&key_id=" + random_key;
      var data = new FormData();
      data.append('csrfmiddlewaretoken', document.Fileform[0].value);
      data.append('template_data', document.Fileform[1].files[0]);
      $('#template_path').val('');
      $('#template_data').val('');

    $.ajax({
      url: document.Fileform.action,
      type: 'POST',
      headers: { 'X-CSRFToken': getCookie('csrftoken') },
      data: data,
      contentType: false,
      cache: false,
      processData: false,
      success: function(result) {
       
        var response = JSON.parse(result); 
        var status =  response.status; 
        var upload_key = response.key;
        var filename =  response.file_name; 
         
        if( (response.status == "SUCCESS") || (response.status == "PENDING") ){
          var upload_id =  response.upload_id;
          upload_id = upload_id.toString();
          upload_id_arr.push({id : upload_id, key : upload_key, status: "deactivate"});
          if (!recursive_flag){
            recursive_flag = true;
            check_status();
          }
     	}
        else if( (response.status == "Invalid File Format") || (response.status == "No File updated") || (response.status == "FAILURE") || (response.status== "Error in uploading the file.Please Try Again") ) {
          upload_error(response.status, random_key);
        }
      },
      error: function(err){
          upload_error(err.status, (this.url.split('key_id=')[1]).substring(0,10));
      }
    });
});


function check_status(){
  if (recursive_flag) {
    for(j=0;j<upload_id_arr.length;j++){
      if( upload_id_arr[j].status == "deactivate") {
      	var urlParam = '/buildings/LEED:'+getUrlParameter('LEED')+'/upload/status/?id='+upload_id_arr[j].id + '&key_id='+upload_id_arr[j].key;
      	$.ajax({
          url: urlParam,
          type: 'GET',
          dataType: 'jsonp',
          success: function(result) {
            	var recheck_key = result.key;
    			  	var recheck_status = result.status;
  		        if(result.status == "SUCCESS"){

		            $('.upload_excel_status_row').each(function( index ) {
		                var hash_upload_id = recheck_key;
			                if ($(this).attr('id') == hash_upload_id){
		                    $(this).find('.file_status').html('Complete');
		                    $(this).find('img').attr('src','/static/dashboard/img/checkmark.png');
		                }
		              });
		            for(id_temp=0;id_temp<upload_id_arr.length;id_temp++){
		            	if (upload_id_arr[id_temp].key == recheck_key){
		            		upload_id_arr[id_temp].status = "activate";
		            	}
		            }
		            upload_arr.splice( $.inArray(recheck_key, upload_arr), 1 );
		            if (upload_arr.length==0){
		                $('.loader_gif').css('opacity', 0);
		                upload_functionality.current_upload_status = false;
		            }

                var deactivate_count = 0;
                for(k=0;k<upload_id_arr.length;k++){
                  if(upload_id_arr[k].status == "deactivate"){
                      deactivate_count = deactivate_count+1;
                  }
                }
                if(deactivate_count == 0){
                    recursive_flag = false;
                }

  		        }
  		        else if(result.status == "PENDING"){
  		            $('.upload_excel_status_row').each(function( index ) {
  		                var hash_upload_id = recheck_key;
  			              if ($(this).attr('id') == hash_upload_id){
  		                  $(this).find('.file_status').html('Processing');
  		                  $(this).find('img').attr('src','/static/dashboard/img/processing.gif');
  		                }
  	            });
              recursive_flag = true;
  	        }
          },
          error: function(err){
  	          upload_error(err.status, (this.url.split('key_id=')[1]).substring(0,10));
  	     }
      	});
      }
    }
    setTimeout(function(){ check_status(); }, 10000);
  }
}

function upload_error(curr_status, check_id) {
	
	    if(curr_status == "Invalid File Format"){
	    	$('.upload_excel_status_row').each(function( index ) {
                var hash_upload_id = check_id;
                if ($(this).attr('id') == hash_upload_id){
				    $('#upload_data_modal').modal('show');
				    $('.invalid_format').css('display', 'block');
				    $(this).find('img').attr('src','/static/dashboard/img/error.png');
				    $(this).find('.file_status').html('Invalid File');
				}
			});
			upload_arr.splice( $.inArray(check_id, upload_arr), 1 );
	    }
	    else if( (curr_status == "No File updated") || (curr_status == "FAILURE") ){
	    	$('.upload_excel_status_row').each(function( index ) {
                var hash_upload_id = check_id;
                if ($(this).attr('id') == hash_upload_id){
				    $(this).find('img').attr('src','/static/dashboard/img/error.png');
				    $(this).find('.file_status').html('Failed,Try Again');
				}
			});
			upload_arr.splice( $.inArray(check_id, upload_arr), 1 );
	    }
	    else if(curr_status== "Error in uploading the file.Please Try Again"){
	    	$('.upload_excel_status_row').each(function( index ) {
                var hash_upload_id = check_id;
                if ($(this).attr('id') == hash_upload_id){
				    $(this).find('img').attr('src','/static/dashboard/img/error.png');
				    $(this).find('.file_status').html('Upload Error,Try Again');
				}
			});
			upload_arr.splice( $.inArray(check_id, upload_arr), 1 );
	    }
	    else {
	    	$('.upload_excel_status_row').each(function( index ) {
                var hash_upload_id = check_id;
                if ($(this).attr('id') == hash_upload_id){
				    $(this).find('.file_status').html('Upload Error,Try Again');
				    $(this).find('img').attr('src','/static/dashboard/img/error.png');
				}
			});
			upload_arr.splice( $.inArray(check_id, upload_arr), 1 );
	    }

	    if (upload_arr.length==0){
	  	    $('.loader_gif').css('opacity', 0);
          upload_functionality.current_upload_status = false;
	    }
}

function makeid()
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for( var i=0; i < 10; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

  window.upload_functionality = {
    current_upload_status : false,
    checkStatusFlag : false
  }
});