var LEEDOnApp = angular.module('LEEDOnApp', ['ui.router']);

// configure our routes
LEEDOnApp.config(function($stateProvider, $urlRouterProvider) {
    
    $urlRouterProvider.otherwise("/home");

    $stateProvider
    .state("homeState", {
        url: "/home",
        templateUrl: "apps/components/home/homeView.html",
        controller : "homeController"
    })
    .state("loginState", {
        url: "/login",
        templateUrl: "apps/components/login/loginView.html",
        controller : "loginController"
    })
    .state("projectState", {
        url: "/project",
        templateUrl: "apps/components/project/projectView.html",
        controller : "projectController"
     })
    .state("dashboardState", {
        url: "/dashboard/score",
        templateUrl: "apps/components/dashboard/dashboardView.html",
        controller : "dashboardController"
     });
    // .state("dashboardState.scoreState", {
    //     url: "/score",
    //     templateUrl: "apps/components/score/scoreView.html",
    //     controller : "scoreController"
    // });
});
