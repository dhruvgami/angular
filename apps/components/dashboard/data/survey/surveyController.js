LEEDOnApp.controller('surveyController', function($rootScope, $scope) {
	$rootScope.header = 'Survey';
	document.getElementById("manual_img").style.display = "none";
	setTimeout(function(){
		window.survey.initsurvey();
	}, 1000);
});