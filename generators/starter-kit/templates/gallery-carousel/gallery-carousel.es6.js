/**
 * @file
 * Behaviors for the Filter Accordion.
 */
/* eslint-disable max-len */

!((document, Drupal, $) => {
  'use strict';

  /**
   * Setup and attach the Carousel behaviors.
   *
   * @type {Drupal~behavior}
   */
  Drupal.behaviors.galleryCarousel = {
    attach: function() {
      $('.gallery-carousel').not('.slick-initialized').slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: true,
        fade: true,
        asNavFor: '.gallery-carousel__nav',
      });
      $('.gallery-carousel__nav').not('.slick-initialized').slick({
        slidesToShow: 5,
        slidesToScroll: 1,
        asNavFor: '.gallery-carousel',
        focusOnSelect: true,
        arrows: false,
        responsive: [
          {
            /* xsm breakpoint equivalent */
            breakpoint: 640,
            settings: {
              slidesToShow: 3,
              slidesToScroll: 3,
              infinite: true
            }
          }
        ]
      });
    },
  };
})(document, Drupal, jQuery);
