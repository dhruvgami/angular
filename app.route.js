var LEEDOnApp = angular.module('LEEDOnApp', ['ngRoute', 'routeStyles']);

// configure our routes
LEEDOnApp.config(function($routeProvider) {
    $routeProvider
    .when('/', {
        templateUrl : 'apps/components/home/homeView.html',
        controller  : 'homeController',
        css         : ['assets/libs/css/bootstrap.min.css', 'assets/libs/css/font-awesome.css', 'assets/libs/css/zocial.css', 'assets/libs/css/venobox.css', 'assets/libs/css/og-component.css', 'assets/libs/css/animate.css', 'assets/css/home-style.css', 'assets/libs/css/scheme/light-green.css', 'assets/css/home-leedon.css', 'assets/css/home-popup_style.css']
    })
    .when('/login', {
        templateUrl : 'apps/components/login/loginView.html',
        controller  : 'loginController',
        css         : ['assets/css/leedstrap.css', 'assets/css/login-style.css', 'assets/libs/css/font-awesome.min_new.css']
    })
    .when('/dashboard', {
        templateUrl : 'apps/components/dashboard/dashboardView.html',
        controller  : 'dashboardController',
        css         : ['assets/libs/css/bootstrap.min.css', 'assets/libs/css/font-awesome.css', 'assets/libs/css/jquery.timepicker.css', 'assets/css/dashboard-main.css', 'assets/libs/css/simplePagination.css', 'assets/libs/css/jquery-ui.css', 'assets/libs/css/dj.selectable.css', 'assets/libs/css/nprogressfoundation-datepicker.css', 'assets/libs/css/jquery.fullPage.css', 'assets/libs/css/multiple-select.css', 'assets/css/dashboard-elements.css', 'assets/libs/css/jquery.fullPage.css', 'assets/libs/css/jquery.qtip.min.css']
    }).otherwise({
        // default page
        redirectTo: '/'
    });
});
