var LEEDOnApp = angular.module('LEEDOnApp', ['ui.router']);

// configure our routes
LEEDOnApp.config(function($stateProvider, $urlRouterProvider) {
    
    $urlRouterProvider.otherwise("/home");
    $urlRouterProvider.when('/dashboard','/dashboard/score');
    $urlRouterProvider.when('/dashboard/manage','/dashboard/manage/projectplaque');

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
    })
    .state("dashboardState.manageState.projectplaqueState", {
        url: "/projectplaque",
        templateUrl: "apps/components/dashboard/manage/projectplaque/projectplaqueView.html",
        controller : "projectplaqueController"
    })
    .state("dashboardState.manageState.teamState", {
        url: "/team",
        templateUrl: "apps/components/dashboard/manage/team/teamView.html",
        controller : "teamController"
    })
    .state("dashboardState.manageState.accountState", {
        url: "/account",
        templateUrl: "apps/components/dashboard/manage/account/accountView.html",
        controller : "accountController"
    })
    .state("dashboardState.manageState.billingState", {
        url: "/billing",
        templateUrl: "apps/components/dashboard/manage/billing/billingView.html",
        controller : "billingController"
    })
    .state("dashboardState.manageState.setupState", {
        url: "/setup",
        templateUrl: "apps/components/dashboard/manage/setup/setupView.html",
        controller : "setupController"
    })
    .state("dashboardState.manageState.gresbState", {
        url: "/gresb",
        templateUrl: "apps/components/dashboard/manage/gresb/gresbView.html",
        controller : "gresbController"
    })
    .state("dashboardState.manageState.strategiesState", {
        url: "/strategies",
        templateUrl: "apps/components/dashboard/manage/strategies/strategiesView.html",
        controller : "strategiesController"
    })
    .state("dashboardState.manageState.connectedappsState", {
        url: "/connectedapps",
        templateUrl: "apps/components/dashboard/manage/connectedapps/connectedappsView.html",
        controller : "connectedappsController"
    });
});
