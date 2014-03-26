'use strict';

angular.module('smmApp').factory('api', function api($routeParams, $http, $q, config, $cacheFactory) {

    return {
        model: [],
        loading: true,
        query: "",
        radius: "",
        zip: "",
        disciplines: {},
        fetch: function (query, zip, radius, hasCache, lat, lng) {
            var deferred = $q.defer();
            var self = this;
            self.loading = true;
            console.log("model: " + self.query + " / " + self.zip + " / " + self.radius);
            console.log("get: " + query + " / " + zip + " / " + radius);
            zip ? zip = "&zip=" + zip : zip = "";
            query && query !== "all" ? query = "q=" + query : query = "";
            radius ? radius = "&radius=" + radius : radius = "";
            lat ? lat = "&lat=" + lat : lat = "";
            lng ? lng = "&lon=" + lng : lng = "";
            //if ( query != self.query ) {
                $http.get(config.api_url_collection + "?" + query + zip + radius + lat + lng, {cache: !!hasCache}).success(function (response) {
                    angular.forEach(response, function(value, key){
                        value.index = key+1;
                        self.getDisciplines().then(function() {
                            var supDisciplines = [];
                            _.each(value.disciplines, function(i) {
                                supDisciplines.push(_.findWhere(self.disciplines.all, {id: i}));
                            });
                            return value.disciplinesName = _.pluck(supDisciplines, 'translatedName');
                        });
                    });
                    //if (_.isEmpty(self.model)) {
                    self.model = response;
                    self.query = query.replace("q=","");
                    self.zip = zip.replace("&zip=","");
                    self.radius = radius.replace("&radius=","");
                    self.loading = false;
                    deferred.resolve();
                    //}

                });
            //}
            return deferred.promise;
        },
        get: function (id) {
            var deferred = $q.defer();
            var self = this;
            self.loading = true;
            id ? id = "?id=" + id : id = "";
            $http.get(config.api_url_item + id, {cache: true}).success(function (response) {

                console.log(response);
                self.getDisciplines().then(function() {
                    var supDisciplines = [];
                    _.each(response.disciplines, function(i) {
                        supDisciplines.push(_.findWhere(self.disciplines.all, {id: i}));
                    });
                    return response.disciplinesName = _.pluck(supDisciplines, 'translatedName');
                });
                self.model = response;
                self.id = id.replace("?id=","");
                self.loading = false;
                console.log(self);
                deferred.resolve();

            });
            return deferred.promise;
        },
        getDisciplines: function () {
            var deferred = $q.defer();
            var self = this;
            $http.get(config.api_url_disciplines, {cache: true}).success(function (response) {

                var sortedDisciplines = _.sortBy(response, 'id');
                var indexDisciplines = _.indexBy(response, 'id');
                var popularDisciplines = _.where(sortedDisciplines, {mostPopular: true});
                self.disciplines = {
                    all: sortedDisciplines,
                    index: indexDisciplines,
                    popular: popularDisciplines
                };
                //console.log(self);
                deferred.resolve();

            });
            return deferred.promise;
        },
        update: function (id, data) {
            var deferred = $q.defer();
            var self = this;
            id ? id = "?id=" + id : id = "";
            console.log(data);
            $http.post(config.api_url_item + id, data).success(function (response) {

                console.log(response);
                /*angular.forEach(self.model, function(value, key){
                    self.id = id.replace("?id=","");
                    if(value.orderId == self.id) {
                        console.warn(value);
                        value = response;
                        console.info(value);
                    }
                });*/
                deferred.resolve();

            });
            return deferred.promise;
        }
    }

});