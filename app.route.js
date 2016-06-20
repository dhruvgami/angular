var LEEDOnApp = angular.module('LEEDOnApp', ['ui.router']);

// configure our routes
LEEDOnApp.config(function($stateProvider, $urlRouterProvider) {
    
    $urlRouterProvider.otherwise("/home");
    $urlRouterProvider.when('/dashboard','/dashboard/score');

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
        url: "/dashboard",
        templateUrl: "apps/components/dashboard/dashboardView.html",
        controller : "dashboardController"
     })
    .state("dashboardState.scoreState", {
        url: "/score",
        templateUrl: "apps/components/dashboard/score/scoreView.html",
        controller : "scoreController"
    })
    .state("dashboardState.dataState", {
        url: "/data",
        templateUrl: "apps/components/dashboard/data/dataView.html",
        controller : "dataController"
    })
    .state("dashboardState.strategiesState", {
        url: "/strategies",
        templateUrl: "apps/components/dashboard/strategies/strategiesView.html",
        controller : "strategiesController"
    })
    .state("dashboardState.analysisState", {
        url: "/analysis",
        templateUrl: "apps/components/dashboard/analysis/analysisView.html",
        controller : "analysisController"
    })
    .state("dashboardState.manageState", {
        url: "/manage",
        templateUrl: "apps/components/dashboard/manage/manageView.html",
        controller : "manageController"
    });
});
