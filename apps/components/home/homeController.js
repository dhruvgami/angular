LEEDOnApp.controller('homeController', function($rootScope, $scope, $ocLazyLoad) {
    $rootScope.header = 'LEED Dynamic Plaque';
    var el = angular.element(document.querySelector('#main_app'));
    el.attr('data-spy', 'scroll');
    el.attr('data-target', '.navbar-collapse');
    $ocLazyLoad.load(['assets/libs/js/grid.js', 'assets/libs/js/bootstrap.min.js', 'assets/libs/js/jquery.superslides.min.js', 'assets/libs/js/jquery.backtotop.js', 'assets/libs/js/jquery.parallax.js', 'assets/libs/js/jquery.backgroundvideo.js', 'assets/libs/js/venobox.min.js', 'assets/libs/js/waypoints.js', 'assets/libs/js/jquery.countTo.js', 'assets/libs/js/jquery.smooth-scroll.min.js', 'assets/libs/js/jquery.fitvid.js', 'assets/libs/js/jquery.sudoslider.min.js', 'assets/js/home-main.js?v=1.2', 'assets/libs/js/jquery.leanModal.min.js', 'assets/js/home-login_iFrame.js?v=1.2', 'assets/libs/js/skrollr.min.js', 'assets/libs/js/jquery-ui.js?v=1', 'assets/libs/js/jquery.dj.selectable.js', 'assets/js/home-skrollrInit.js?v=1']);
});
