if ($('.isotope-animals').length > 0) {
    $(window).load(function () {
        // store filter for each group
        var filters = {};
        $('.isotope-animals').fadeIn();
        // init Isotope
        var $container_fitrows = $('.isotope-animals').isotope({
            itemSelector: '.isotope-item',
            layoutMode: 'fitRows',
            transitionDuration: '0.6s',
            filter: "*"
        });
        // filter items on button click
        $('.filters').on('click', 'ul.nav li a', function () {
            var filterValue = $(this).attr('data-filter');
            $(".filters").find("li.active").removeClass("active");
            $(this).parent().addClass("active");
            $container_fitrows.isotope({ filter: filterValue });
            return false;
        });

        var owl = $('.owl-carousel.dog-slider-autoplay');
        owl.owlCarousel({
            items: 1,
            loop: true,
            margin: 10,
            autoplay: true,
            autoplayTimeout: 5000,
            autoplayHoverPause: true
        });
    });
}
