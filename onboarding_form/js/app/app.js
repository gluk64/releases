'use strict';

angular.module('smmApp', ['ngRoute', 'ngCookies', 'ui.bootstrap', 'ngAnimate', 'angularSpinner', 'ngTagsInput', 'uiSlider'])
    .config(['$routeProvider', function($routeProvider) {
        var tpl;
        if (angular.element('.admin').length) {
            tpl = '/assets/js/app/views/supplier-list-admin.html'
        } else {
            tpl = '/assets/js/app/views/supplier-list.html'
        }
        $routeProvider
            .when('/:query/:page', {
                templateUrl: tpl,
                controller : 'SuppliersListCtrl'
            })
            .otherwise({
                redirectTo: '/all/1'
            });
    }]);

angular.module('smmAppSup', ['smmApp'])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: '/assets/js/app/views/supplier.html',
                controller : 'SupplierCtrl'
            })
            .when('/about', {
                templateUrl: '/assets/js/app/views/supplier-about.html',
                controller : 'SupplierCtrl'
            })
            .when('/gallery', {
                templateUrl: '/assets/js/app/views/supplier-gallery.html',
                controller : 'SupplierCtrl'
            })
            .otherwise({
                redirectTo: '/'
            });
    }]);
    //.run(['$rootScope','$location', '$anchorScroll', '$routeParams', function($rootScope, $location, $anchorScroll, $routeParams) {
    //    //when the route is changed scroll to the proper element.
    //    $rootScope.$on('$routeChangeSuccess', function(newRoute, oldRoute) {
    //        $location.hash($routeParams.scrollTo);
    //        $anchorScroll();
    //    });
    //}]);
