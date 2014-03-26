'use strict';

angular.module('smmApp').factory('map', function map() {

    var map = new GMaps({
        el: '#map',
        zoom: 12,
        lat: 52.5372435,
        lng: 13.3983551,
        autofit: true,
        zoomControl : true,
        zoomControlOpt: {
            style : 'SMALL',
            position: 'TOP_LEFT'
        },
        panControl : false,
        streetViewControl : false,
        mapTypeControl: false,
        overviewMapControl: false
    });

    return map;

});