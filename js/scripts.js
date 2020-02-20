var windowElement;

function loadScripts() {
    try {
        var timerId = setTimeout(function tick() {
            if (document.querySelectorAll('.loader').length < 1) {
                windowElement = jQuery(window);
                loadNavigationMenu();
                closeMainNavigationOnNavigate();
                loadHeaderVisuals();
                loadContactForm();
            }
            else {
                timerId = setTimeout(tick, 250);
            }
        }, 250);
    } catch (e) {
        console.error(e);
    }
}

// This will be triggered on the first load, when loading the index.html
// Navigation events will be handled in the MainLayout and re-trigger this function
loadScripts();

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