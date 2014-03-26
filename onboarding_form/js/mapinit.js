$(function(){

    var map = new GMaps({
        el: '#map',
        zoom: 16,
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



    map.addControl({
        position: 'top_right',
        content: 'Geolocate',
        style: {
            margin: '5px',
            padding: '1px 6px',
            border: 'solid 1px rgba(0, 0, 0, 0.15)',
            background: '#fff',
            backgroundClip: 'padding-box',
            fontSize: '11px',
            boxShadow: '0 1px 4px -1px rgba(0, 0, 0, 0.3)',
            borderRadius: '2px'
        },
        events: {
            click: function(){
                GMaps.geolocate({
                    success: function(position){
                        map.setCenter(position.coords.latitude, position.coords.longitude);
                        map.addMarker({
                            lat: position.coords.latitude,
                            lng: position.coords.longitude,
                            title: 'You are here.',
                            infoWindow: {
                                content: '<p>You are here!</p>'
                            }
                        });
                    },
                    error: function(error){
                        alert('Geolocation failed: ' + error.message);
                    },
                    not_supported: function(){
                        alert("Your browser does not support geolocation");
                    }
                });
            },
            mouseover: function() {
                this.style.background = '#ebebeb'
            },
            mouseout: function() {
                this.style.background = '#ffffff'
            }
        }
    });

    $.each($('.b-main__sb'), function(index, item) {
        var that = $(this);
        var num = index + 1;
        var delay = 500*num;
        setTimeout(function(){
            var title = that.find(".b-main-block__title").text().trim().replace(/\s+/g,' ');
            var href = that.find(".b-mb-book_button a").attr("href");
            var address = that.find("address").text().trim().replace(/\s+/g,' ');
            console.log(num + " " + address);
            GMaps.geocode({
                address: address,
                callback: function(results, status) {
                    if (status == 'OK') {
                        console.log(num);
                        var latlng = results[0].geometry.location;
                        //map.setCenter(latlng.lat(), latlng.lng());
                        map.addMarker({
                            lat: latlng.lat(),
                            lng: latlng.lng(),
                            title: num.toString(),
                            infoWindow: {
                                content: '<p><span>' + num + '</span>' + '<a href="' + href + '">' + title + '</a></p>'
                            },
                            click: function() {
                                var markerBounds = new google.maps.LatLngBounds();
                                markerBounds.extend(latlng);
                                //map.fitBounds(markerBounds);
                            }
                        });
                        map.fitZoom();
                    } else {
                        console.log(num + " not " + status);
                    }
                }
            });
        }, delay);

    });


});