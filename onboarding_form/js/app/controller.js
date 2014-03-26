
'use strict';

angular.module('smmApp').controller('SuppliersListCtrl',['$scope', '$location', '$anchorScroll', 'api', 'geolocate', 'config', '$window', '$q', '$routeParams', '$filter', '$log', 'map', '$cookies', '$cacheFactory', '$http', function($scope, $location, $anchorScroll, api, geolocate, config, $window, $q, $routeParams, $filter, $log, map, $cookies, $cacheFactory, $http) {

    $scope.log = $log;
    $scope.api = api;
    $scope.routeParams = $routeParams;
    $scope.geolocate = geolocate;
    $scope.cookies = $cookies;
    $scope.radius = 10;

    $routeParams.query = $window.location.hash.split('/')[1];

    api.getDisciplines().then(function() {
        console.log(api.disciplines.all);
    });

    if (geolocate.lat && geolocate.lng) {
        api.fetch($routeParams.query, $cookies.zip, $scope.radius, 1, geolocate.lat, geolocate.lng);
    } else {
        api.fetch($routeParams.query, $cookies.zip, $scope.radius, 1);
    }

    $scope.checkzip = function() {
        console.info(this.cookies.zip);
        console.warn(geolocate.zip);
        if (this.cookies.zip !== geolocate.zip) {
            geolocate.lat = "";
            geolocate.lng = "";
            angular.element(".gmap-geolocate_button").removeClass("active");
            console.info(geolocate);
        } else {
            console.warn(geolocate);
        }

    };

    $scope.submit = function() {
        $scope.checkzip();
        $window.location.hash = "/" + this.api.query + "/1";
        if (geolocate.lat && geolocate.lng) {
            api.fetch(this.api.query, this.cookies.zip, this.radius, 1, geolocate.lat, geolocate.lng);
        } else {
            api.fetch(this.api.query, this.cookies.zip, this.radius, 1);
        }
        $scope.radius = this.radius;
    };

    $scope.updateValue = function (id, target, val) {
        var obj = {};
        obj[target] = val;
        api.update(id, obj).then(function () {
            //if (geolocate.lat && geolocate.lng) {
            //    console.log("fetch after update");
            //    api.fetch($routeParams.query, $cookies.zip, $scope.radius, 0, geolocate.lat, geolocate.lng).then(function () {
            //        $scope.modelFilter = $filter('filter')($scope.api.model, $scope.filterStatus)
            //    })
            //} else {
            //    console.log("fetch after update");
            //    api.fetch($routeParams.query, $cookies.zip, $scope.radius, 0).then(function () {
            //        $scope.modelFilter = $filter('filter')($scope.api.model, $scope.filterStatus)
            //    })
            //}
            //$window.location.hash = "/" + $routeParams.query + "/" + $routeParams.page;
            //console.log($scope.api.model);
            //$cacheFactory.removeAll();
            //console.log($cacheFactory($http).info());
            //$cacheFactory($http).removeAll();
            if (target == "status") {
                $scope.modelFilter = $filter('filter')($scope.api.model, $scope.filterStatus);
            }
        });
    };

    $scope.loadTag = function () {
        return api.getDisciplines().then(function() {
            return _.pluck(api.disciplines.all, 'translatedName');
        });
    };

    $scope.updateValueTag = function (tags) {
        console.log(tags);
    };

    $scope.radiusFormat = function(value) { return value.toString() + " km" };

    $scope.goto = function (el){

        $location.hash(el);

        $anchorScroll();

    };

    //paginate

    $scope.maxSize = 5;
    $scope.pageSize = 5;
    //$scope.currentPage = $routeParams.page;

    $scope.pageChanged = function(page) {
        $routeParams.page = page;
        console.log($routeParams.query + " queryqweqwe");
        //$scope.currentPage = $routeParams.page;

        //if (geolocate.lat && geolocate.lng) {
        //    console.log("fetch after update");
        //    api.fetch($routeParams.query, $cookies.zip, $scope.radius, 0, geolocate.lat, geolocate.lng);
        //} else {
        //    console.log("fetch after update");
        //    api.fetch($routeParams.query, $cookies.zip, $scope.radius, 0);
        //}
        $window.location.hash = "/" + $routeParams.query + "/" + $routeParams.page;
        console.log($window.location.href);
        //console.log($scope.currentPage + " page");
        console.log($scope.routeParams.page + " page");
        $scope.goto('top');
    };

    //console.log($scope.currentPage + " ctr");
    console.log($scope.routeParams.page + " ctr");

    //markers

    $scope.$watch('api.model', function () {
        console.log('1 api.model');
        $scope.startItems = $filter('startFrom')($scope.api.model, $scope.pageSize*($scope.routeParams.page-1));
    });

    $scope.$watch('routeParams.page', function(){
        console.log('1 currentPage');
        $scope.startItems = $filter('startFrom')($scope.api.model, $scope.pageSize*($scope.routeParams.page-1));
    });

    $scope.$watch('startItems', function(){
        console.log('1 startItems');
        $scope.filteredItems = $filter('limitTo')($scope.startItems, $scope.pageSize);
    });

    $scope.$watch('filteredItems', function(data){
        console.log('1 filteredItems');
        $scope.addMarkers(data);
    });

    ////////////////

//    $scope.$watch('api.model', function () {
//        $scope.modelFilter = $filter('filter')($scope.api.model, $scope.filterStatus);
//    });

    $scope.$watch('filterStatus', function(){
        console.log('2 filterStatus');
        $scope.modelFilter = $filter('filter')($scope.api.model, $scope.filterStatus);
    });

    $scope.$watch('modelFilter', function () {
        console.log('2 modelFilter');
        $scope.startItems = $filter('startFrom')($scope.modelFilter, $scope.pageSize*($scope.routeParams.page-1));
    });

    $scope.$watch('routeParams.page', function(){
        console.log('2 currentPage');
        $scope.startItems = $filter('startFrom')($scope.modelFilter, $scope.pageSize*($scope.routeParams.page-1));
    });

//    $scope.$watch('startItems', function(){
//        console.log('2 startItems');
//        $scope.filteredItemsStatus = $filter('limitTo')($scope.startItems, $scope.pageSize);
//    });

//    $scope.$watch('filterStatus', function(){
//        $scope.filteredItemsStatus = $filter('filter')($scope.filteredItems, $scope.filterStatus);;
//    });

//    $scope.$watch('filteredItemsStatus', function(data){
//        console.log('2 filteredItemsStatus');
//        $scope.addMarkers(data);
//        angular.forEach(data, function(value, key){
//            var lat = value.latitude;
//            var lng = value.longitude;
//            if ( data.length != 1 ) {
//                map.fitZoom();
//            } else {
//                map.setCenter(lat,lng);
//            }
//        });
//    });

    $scope.addMarkers = function (data) {
        map.removeMarkers();
        angular.forEach(data, function(value, key){
            var num = value.index;
            var lat = value.latitude;
            var lng = value.longitude;
            var href = value.profileUrl;
            var title = value.companyName;
            var imgNum = num;

            /*
             var marker = new RichMarker({
             position: new google.maps.LatLng(lat, lng),
             map: $scope.map.map,
             content: '<b class="marker">' + imgNum + '</b>',
             infoWindow: {
             content: '<p>asd</p>'
             }
             });*/

            map.addMarker({
                lat: lat,
                lng: lng,
                title: num.toString(),
                icon: '/assets/img/markers/' + imgNum + '.png',
                infoWindow: {
                    content: '<p><a href="' + href + '">' + title + '</a></p>',
                    maxWidth: 200
                },
                click: function() {

                }
            });
            //map.setCenter(lat,lng);
            if ( map.markers.length != 1 ) {
                map.fitZoom();
            }

        });
        if (geolocate.lat && geolocate.lng) {
            console.log(geolocate);
            map.setCenter(geolocate.lat, geolocate.lng);
            map.addMarker({
                lat: geolocate.lat,
                lng: geolocate.lng,
                title: 'You are here',
                infoWindow: {
                    content: '<p>You are here</p>',
                    maxWidth: 200
                }
            });
            //map.fitZoom();
        }
    }

}]);

angular.module('smmApp').controller('mapGeolocateCtrl', ['$scope', 'map', 'geolocate', 'api', '$cookies', function($scope, map, geolocate, api, $cookies) {

    map.addControl({
        position: 'top_right',
        content: '',
        style: {
            boxShadow: '0 1px 4px -1px rgba(0, 0, 0, 0.3)'
        },
        classes: 'gmap-geolocate_button',
        events: {
            click: function(e) {
                geolocate.fetch().then(function () {
                    //$scope.zip = geolocate.zip;
                    //$cookies.zip = geolocate.zip;
                    angular.element(e).addClass('active');
                    console.log($cookies);
                    api.fetch(api.query, $cookies.zip, $scope.radius, 1, geolocate.lat, geolocate.lng);
                })
            }
        }
    });

}]);

angular.module('smmApp').controller('popularSearchCtrl', ['$scope', '$http', 'api', '$routeParams', function($scope, $http, api, $routeParams) {
    $http.get('/assets/js/app/json/queryList.json').success(function(data) {
        $scope.queryList = data;
    });
}]);

angular.module('smmApp').controller('ScrollCtrl', ['$scope', '$location', '$anchorScroll', '$routeParams', function($scope, $location, $anchorScroll) {

}]);

angular.module('smmAppSup').controller('SupplierCtrl', ['$scope', '$location', '$anchorScroll', 'api', 'config', '$window', '$q', '$routeParams', '$filter', '$log', '$cookies', '$cacheFactory', '$http', function($scope, $location, $anchorScroll, api, config, $window, $q, $routeParams, $filter, $log, $cookies, $cacheFactory, $http) {

    $scope.log = $log;
    $scope.api = api;
    $scope.id = angular.element("#sid").val();

    api.get($scope.id);
    $scope.toggle = function() {
        if ($scope.toggleClass === 'active') {
            $scope.toggleClass=''
        } else {
            $scope.toggleClass='active'
        }
    }

}]);

angular.module('smmApp').filter('startFrom', function () {
    return function (input, start) {
        if (angular.isArray(input)) {
            var start = parseInt(start, 10);
            if (isNaN(start)) start = 0;
            return input.slice(start);
        }
        return input;
    };
});

angular.module('smmApp').filter('cutString', function () {
    return function (value, max, wordwise, end) {
        if (!value) return '';

        end ? end : end = '...';

        max = parseInt(max, 10);
        if (!max) return value;
        if (value.length <= max) return value;

        value = value.slice(0, max - end.length);
        if (wordwise) {
            var lastspace = value.lastIndexOf(' ');
            if (lastspace != -1) {
                value = value.slice(0, lastspace);
                end = ' ...';
            }
        }

        return value + end;

    };
});
