LEEDOnApp.controller('accountController', function($rootScope, $scope, $http) {
	$rootScope.header = 'Account';
	$rootScope.main_appClass = '';
	$http.get('assets/json/building_1000000117_billing.json').success(function(data) {
		document.getElementById("first_name").value      = data.CC_first_name;
		document.getElementById("last_name").value       = data.CC_last_name;
		document.getElementById("card_no").value         = data.Cc_number;
		document.getElementById("address").value 		 = data.CC_address;
		document.getElementById("city").value            = data.CC_city;
		document.getElementById("display_country").value = data.country_full;
		document.getElementById("code").value            = data.CC_po_code;
		document.getElementById("display_state").value   = data.state_full;
		document.getElementById("email").value           = data.CC_email;
		document.getElementById("phone").value           = data.CC_phone;
	});
});