var LEEDOnApp = angular.module('LEEDOnApp', ['ngRoute', 'routeStyles', 'oc.lazyLoad']);

// configure our routes
LEEDOnApp.config(function($routeProvider) {
    $routeProvider
    .when('/', {
        templateUrl : 'apps/components/home/homeView.html?v=2.7',
        controller  : 'homeController',
        css         : ['assets/libs/css/fonts.css', 'assets/libs/css/bootstrap.min.css?v=1', 'assets/libs/css/font-awesome.css?v=1', 'assets/libs/css/zocial.css?v=1', 'assets/libs/css/venobox.css?v=1', 'assets/libs/css/og-component.css?v=1', 'assets/libs/css/animate.css?v=1', 'assets/css/home-style.css?v=1', 'assets/libs/css/scheme/light-green.css?v=1', 'assets/css/home-leedon.css?v=1', 'assets/css/home-popup_style.css?v=1']
    })
    .when('/login', {
        templateUrl : 'apps/components/login/loginView.html',
        controller  : 'loginController',
        css         : ['assets/css/leedstrap.css?v=1', 'assets/css/login-style.css?v=1', 'assets/libs/css/font-awesome.min_new.css?v=1']
    })
    .when('/dashboard', {
        templateUrl : 'apps/components/dashboard/dashboardView.html',
        controller  : 'dashboardController',
        css         : ['assets/libs/css/bootstrap.min.css?v=1', 'assets/libs/css/font-awesome.css?v=1', 'assets/libs/css/jquery.timepicker.css?v=1', 'assets/css/dashboard-main.css?v=1', 'assets/libs/css/simplePagination.css?v=1', 'assets/libs/css/jquery-ui.css?v=1', 'assets/libs/css/dj.selectable.css?v=1', 'assets/libs/css/nprogress.css?v=1', 'assets/libs/css/foundation-datepicker.css?v=1', 'assets/libs/css/alertify.core.css?v=1', 'assets/libs/css/alertify.bootstrap.css?v=1', 'assets/libs/css/jquery.fullPage.css?v=1', 'assets/libs/css/multiple-select.css?v=1', 'assets/css/dashboard-elements.css?v=1', 'assets/libs/css/jquery.qtip.min.css?v=1']
    })
    .when('/score', {
        templateUrl : 'apps/components/score/scoreView.html',
        controller  : 'scoreController',
        css         : ['assets/libs/css/bootstrap.min.css?v=1', 'assets/libs/css/font-awesome.css?v=1', 'assets/libs/css/jquery.timepicker.css?v=1', 'assets/css/dashboard-main.css?v=1', 'assets/libs/css/simplePagination.css?v=1', 'assets/libs/css/jquery-ui.css?v=1', 'assets/libs/css/dj.selectable.css?v=1', 'assets/libs/css/nprogress.css?v=1', 'assets/libs/css/foundation-datepicker.css?v=1', 'assets/libs/css/alertify.core.css?v=1', 'assets/libs/css/alertify.bootstrap.css?v=1', 'assets/libs/css/jquery.fullPage.css?v=1', 'assets/libs/css/multiple-select.css?v=1', 'assets/css/dashboard-elements.css?v=1', 'assets/libs/css/jquery.qtip.min.css?v=1']
    }).otherwise({
        // default page
        redirectTo: '/'
    });
});
