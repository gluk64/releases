$(function(){

    //lazyload

    $("img.lazy").lazyload({
        threshold : 400,
        effect : "fadeIn"
    });

    //preload background image

    if ($(".bg").length) {
        var bg_image = $(".bg").css("background-image").slice(4,-1);
        while (bg_image.indexOf('"') != -1) {
            bg_image = bg_image.replace('"','');
        }
        preloadImage (bg_image, function() {$(".bg").addClass("show")}, function() {$(".bg").addClass("load")});
    }

    //nav dropdawn

    if($(".b-header-nav__category").length) {
        var list = $(".b-header-nav__category");
        var link = $(".b-header-nav__category > li > a");
        var dropdawn = $(".b-header-subnav__dropdawn");
        link.hover(function() {
            link.removeClass("active");
            dropdawn.removeClass("show");
            $(this).addClass("active");
            $(this).parent().find(dropdawn).addClass("show");
        });

        list.hover(function() {

        }, function() {
            link.removeClass("active");
            dropdawn.removeClass("show");
        });
    }

    //search suggest

    if ($("#header_search").length) {
        searchSuggest($("#header_search"));
    }

    if ($("#b-header-nav__search").length) {
        searchSuggest($("#b-header-nav__search"));
    }

    //scroll

    scrollTopPosition();

    $(window).scroll(function() {
        scrollTopPosition();
    });

    $(".a-scroll.bottom").on('click', function() {
        $('html, body').animate({scrollTop: $(".b-main").offset().top - 50}, 1000, 'easeInOutCubic');
    });

    $(".a-scroll.top").on('click', function() {
        $('html, body').animate({scrollTop: 0}, 1000, 'easeInOutCubic');
    });

    //contentsList

    if($(".b-main-contents__list").length) {
        contentsList ($("article h2"), $(".b-main-contents__list"));
    }

    //sticky

    addSticky($("#affix"));

});

function preloadImage(src, show, load) {
    var img = new Image ();
    img.src = src;
    console.log(img.src);
    if(img.complete){
        show();
    } else {
        $(img).load(load);
    }
}

function contentsList ($title_list, $contents_list) {
    $.each($title_list, function(index, item) {
        var text = $(item).html();
        if (text.indexOf("<") != -1) {
            text = text.slice(0,text.indexOf("<"));
        }
        text = text.trim();
        //var id = text.replace(/\s+/g,'_').toLowerCase();
        var id = generateUUID();
        $(item).attr("id", id);
        $contents_list.append("<li><a href=#" + id + ">" + text + "</a></li>");
    });
    $contents_list.find("a").on('click', function(e) {
        var href = $(this).attr('href');
        e.preventDefault();
        $('html, body').animate({scrollTop: $(href).offset().top}, 1000, 'easeInOutCubic');
    });
}

function utf8_decode (str) { return unescape(encodeURIComponent(str)); }
function utf8_encode (str) { return decodeURIComponent(escape(str)); }
function generateUUID() {
    var d = new Date().getTime();
    var uuid = 'xxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x7|0x8)).toString(16);
    });
    return uuid;
}

function searchSuggest(search) {

    var searchSource = [
        "Yoga",
        "Wellness",
        "Meditation",
        "Pilates",
        "Ayurveda",
        "Schamane",
        "Feldenkrais",
        "Gesangslehrer",
        "Kungfu",
        "Atmen"
    ];

    search.find("input[type='text']").autocomplete({
        source: searchSource,
        appendTo: search.find(".nav-search__suggest"),
        focus: function(e, ui) {e.preventDefault()},
        minLength: 0
    }).on('focus', function() {
        $(this).autocomplete("search");
    });
    search.on('submit', function() {
        var query = $(this).find("input[type='text']").val();
        window.location.href = '/alle-anbieter#/' + query + '/1';
    });
}

function scrollTopPosition() {
    var offset = $(".b-main").offset().top - 60;
    var bottom = $(".b-footer").offset().top - $(this).outerHeight();
    var scrollTop = $(this).scrollTop();
    var buttonTop = $('.a-scroll.top');
    if (scrollTop > offset) {
        if(scrollTop > bottom) {
            buttonTop.addClass("bottom");
        } else {
            buttonTop.removeClass("bottom");
        }
        buttonTop.addClass("show");
    } else {
        buttonTop.removeClass("show");
    }
}

function addSticky (element) {
    if(element.length) {
        var bottomSpacing = $('.b-footer').outerHeight();
        element.sticky({
            topSpacing: 0,
            bottomSpacing: bottomSpacing + 60
        });
        window.onload = function(){
            element.sticky('updateHeight');
        }
    }
}