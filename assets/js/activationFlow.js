(function()
{

    window.activationFlow = {
        permissionRequest: function() {
            $("#permission_needed_request").add("#permission_needed_request2").on('click', function()
            {
                if(logIn == 'True')
                {
                    $("#preloader_permission_needed").show();
                    $("#status_permission_needed").show();
                    $.ajax({
                        url: '/buildings/LEED:' + plaqueNav.getParameterByName('LEED') + '/permission/request/',
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
                    $("#login_iFrame").attr('src',window.location.protocol + '//' + window.location.hostname+'/auth/login/?STAT=REQ_ACCESS&LEED='+ plaqueNav.getParameterByName('LEED'));
                    $('#login_modal').modal('toggle');  
                }
            });
            
        },
    };
    $( document ).ready(function() 
    {
        activationFlow.permissionRequest();
    });

}).call(this);