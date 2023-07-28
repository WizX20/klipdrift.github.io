var windowElement;

function loadScripts(elm, callback) {
    try {
        var timerId = setTimeout(function tick() {
            if (document.querySelectorAll(elm).length < 1) {
                callback();
            }
            else {
                timerId = setTimeout(tick, 250);
            }
        }, 250);
    } catch (e) {
        console.error(e);
    }
}

function initialScripts() {
    windowElement = jQuery(window);
    loadNavigationMenu();
    closeMainNavigationOnNavigate();
    loadHeaderVisuals();
    loadSlider();
    loadContactForm();
}

// This will be triggered on the first load, when loading the index.html
// Navigation events will be handled in the MainLayout and re-trigger this function
loadScripts('.loader', initialScripts);


function loadNavigationMenu() {
    $('.menu_icon').on('click', function () {
        $(this).toggleClass('active');
        $('#header .nav-menu').toggleClass('active');
    });
}

function closeMainNavigationOnNavigate() {
    $('.nav-menu a, .mobile-logo a').on('click', function () {
        //$('#navigation').collapse('hide');
        $('.menu_icon').toggleClass('active');
        $('#header .nav-menu').toggleClass('active');
    });
}

function loadHeaderVisuals() {
    // Header background
    if (windowElement.scrollTop() > 20) {
        $('.header-container').addClass('active');
    } else {
        $('.header-container').removeClass('active');
    }

    // Header background: Page scroll
    windowElement.on('scroll', function () {
        if ($(this).scrollTop() > 20) {
            $('.header-container').addClass('active');
        } else {
            $('.header-container').removeClass('active');
        }
    });

    // Set header to full height
    $.fn.fullHeight = function () {
        var self = this;
        var windowHeight = window.innerHeight;
        var fullHeightFunction = function () {
            return self.css({
                'height': windowHeight
            });
        };
        windowElement.on('resize', function () {
            windowHeight = window.innerHeight;
            fullHeightFunction();
        });
        fullHeightFunction();
        return self;
    };
    $('.home #header').fullHeight();
}

function scrollToElementId(elementId) {
    var element = document.getElementById(elementId);
    if (!element) {
        console.warn('element was not found', elementId);
        return false;
    }

    element.scrollIntoView({ behavior: 'smooth', block: 'start' });

    setTimeout(function () {
        window.scrollBy(0, -30);
    }, 500);

    return true;
}

function loadContactForm() {
    var form = document.getElementById("contact-form");
    //var button = document.getElementById("contact-form-action");
    var status = document.getElementById("contact-form-status");

    // Success and Error functions for after the form is submitted
    function success() {
        form.reset();
        form.style = "display: none ";
        status.innerHTML = '<p>&nbsp;</p><h4 class="text-success">' +
            '<i class="fa fa-check" ></i> Thank you for your message!</h4>';
    }

    function error() {
        status.innerHTML = '<p>&nbsp;</p><h4 class="text-danger">' +
            '<i class="fa fa-exclamation-triangle"></i> Something went wrong, your message has not been sent!</h4>' +
            '<br /><p class="text-danger">Please contact us via <a href="//www.facebook.com/KlipDriftBand/" target="_blank" rel="noopener noreferrer">facebook</a> if this issue persists.' +
            '</p>';
    }

    // handle the form submission event
    form.addEventListener("submit", function (ev) {
        ev.preventDefault();
        var data = new FormData(form);
        ajaxform(form.method, form.action, data, success, error);
    });
}

// helper function for sending an AJAX request
function ajaxform(method, url, data, success, error) {
    var xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.setRequestHeader("Accept", "application/json");
    xhr.onreadystatechange = function () {
        if (xhr.readyState !== XMLHttpRequest.DONE) return;
        if (xhr.status === 200) {
            success(xhr.response, xhr.responseType);
        } else {
            error(xhr.status, xhr.response, xhr.responseType);
        }
    };
    xhr.send(data);
}

function loadSlider() {
    var current_slide = 0;
    var slides_length = 0;
    var prev_slide = 0;
    var appendBody;
    var popup_images_arr = [];

    function changeSlide() {
        if (current_slide == prev_slide) {
            return false;
        }

        for (let i = 0; i < slides_length; i++) {
            if (i === prev_slide) {
                $("a.popup-image").eq(i).css({ "z-index": "1" }).stop().animate({
                    opacity: 0
                }, 500, function () {
                    $(this).css("visibility", "hidden");
                })
            }
            if (i === current_slide) {
                $("a.popup-image").eq(i).css({ "visibility": "visible", "z-index": "2" }).stop().animate({
                    opacity: 1
                }, 500)
            }
        }

        $("#popup-container li").filter(function (index) {
            return index != current_slide
        }).removeClass("active");

        $("#popup-container li").filter(function (index) {
            return index == current_slide
        }).addClass("active");
    }

    function loadAnimBorder() {
        $("#gallery .anim_border").on("click", function (event) {
            popup_images_arr = [];
            slides_length = $(".img_link").length;

            $("#slides-container").html("");
            $("#popup-container ul").html("");

            $.each($(".img_link"), function (index, value) {
                popup_images_arr.push($(".img_link img")[index].src);
            });

            appendBody = '';

            for (var i = 0; i < popup_images_arr.length; i++) {
                if (event.currentTarget == $(".anim_border")[i]) {
                    current_slide = i;
                    appendBody += '<a href="javascript:void(0)" class="popup-image" style="position: absolute; opacity: 1; visibility: visible"><img src=' + popup_images_arr[i] + '></a>';
                } else {
                    appendBody += '<a href="javascript:void(0)" class="popup-image" style="position: absolute;  opacity: 0; visibility: hidden"><img src=' + popup_images_arr[i] + '></a>';
                }
            }

            $("#slides-container").append(appendBody);

            // Slider Width in Window Resize time
            windowElement.resize(function () {
                slideWidth = $("#popup-container").width() * 0.8;
                if (windowElement.width() <= 767) {
                    slideWidth = $("#popup-container").width() * 0.9;
                }
            });

            // Slider Width during <=767
            if (windowElement.width() <= 767) {
                slideWidth = $("#popup-container").width() * 0.9;
            }

            for (var i = 0; i < popup_images_arr.length; i++) {
                if (event.currentTarget != $(".anim_border")[i]) {
                    $("#popup-container ul").append("<li></li>");
                } else {
                    $("#popup-container ul").append("<li class='active'></li>");
                }
            }

            $("#popup-container").css("display", "block").animate({
                opacity: 1
            }, 300);
        });
    }

    loadScripts(".anim_border", loadAnimBorder);

    $(".popup_left").on("click", function () {
        prev_slide = current_slide;
        if (current_slide) {
            current_slide--;
        } else {
            current_slide = slides_length - 1;
        }
        changeSlide();
    });

    $(".popup_right").on("click", function () {
        prev_slide = current_slide;
        if (current_slide < slides_length - 1) {
            current_slide++;
        } else {
            current_slide = 0;
        }
        changeSlide();
    });

    $("#popup-container li").on("click", function () {
        prev_slide = current_slide;
        current_slide = $("#popup-container li").index($(this));
        changeSlide();
    });

    $("#popup-container").on("click", function (e) {
        if (!$(e.target).is($("#slides-container a img")) && !$(e.target).is($("#popup-container ul li")) && !$(e.target).is($("#popup_block .popup_arrow")) && !$(e.target).is($("#popup_block .popup_arrow i")))
            $("#popup-container").animate({
                opacity: 0
            }, 300, function () {
                $(this).css("display", "none");
            })
    });

    if ($('.nav li.active').length == 0) {
        $('.nav li:first-child').addClass('active');
    }

    $('.centered-bottom').attr('style', 'background-position: center bottom !important;');
    $('.carousel-inner .carousel-item:first-child').addClass('active');

    for (i = 0; i < $('#carouselExampleIndicators .carousel-inner .carousel-item').length; i++) {
        let carousel_active = 'active';
        if (i != 0) {
            carousel_active = ''
        }
        $('#carouselExampleIndicators .carousel-indicators').append('<li data-target="#carouselExampleIndicators" data-slide-to="' + i + '" class="' + carousel_active + '"></li>')
    }
}