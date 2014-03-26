'use strict';

angular.module('smmApp').factory('geolocate',['config', '$q', '$log', '$cookies', function geolocate(config, $q, $log, $cookies) {

    var getGeolocate = function(callback) {
        GMaps.geolocate({
            success: function(position){
                //console.log(position);
                callback(position);
            },
            error: function(error){
                $log.error('Geolocation failed: ' + error.message);
            },
            not_supported: function(){
                $log.error("Your browser does not support geolocation");
            }
        });

    };

    var getGeocode = function(lat, lng, callback) {
        GMaps.geocode({
            lat: lat,
            lng: lng,
            callback: function(results, status) {
                if (status == 'OK') {
                    var noZipMsg = "cant find zip code for your geolocation"
                    angular.forEach(results, function(result){
                        if(result.types == "postal_code") {
                            angular.forEach(result.address_components, function(result){
                                if(result.types == "postal_code") {
                                    noZipMsg = "";
                                    config.zip_code = result.long_name;
                                    callback(result.long_name);
                                }
                            });
                        }
                    });
                    if (noZipMsg) {
                        $log.error(noZipMsg);
                    }
                } else {
                    $log.error(results + " not " + status);
                }
            }
        });
    }

    //return getGeolocate;

    return {
        zip: "",
        lat: "",
        lng: "",
        fetch: function () {
            var deferred = $q.defer();
            var self = this;
            console.log("model zip: " + self.zip);
            console.log("model lat: " + self.lat);
            console.log("model lng: " + self.lng);
            if (!self.lat && !self.lng) {
                getGeolocate(function(position) {
                    if (config.dummy) {
                        self.lat = 52.5372435;
                        self.lng = 13.3983551;
                    } else {
                        self.lat = position.coords.latitude;
                        self.lng = position.coords.longitude;
                    }
                    getGeocode(self.lat, self.lng, function(results){
                        if (self.zip !== results || self.zip !== $cookies.zip || !self.zip) {
                            self.zip = results;
                            $cookies.zip = results;
                            console.log("get geo zip: " + results);
                        }
                        deferred.resolve();
                    });
                });
            } else {
                getGeocode(self.lat, self.lng, function(results) {
                    if (self.zip !== results || self.zip !== $cookies.zip || !self.zip) {
                        self.zip = results;
                        $cookies.zip = results;
                        console.log("get model zip: " + results);

                    }
                    deferred.resolve();

                });
            }

            return deferred.promise;
        }
    }


}]);