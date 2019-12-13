/**
 * @file
 * Behaviors for the Carousel.
 */

!((Drupal, $) => {
  'use strict';

  /**
   * Setup and attach the Carousel behaviors.
   *
   * @type {Drupal~behavior}
   */
  Drupal.behaviors.carousel = {
    attach: function() {
      $('.carousel__slick').not('.slick-initialized').slick({
        dots: true,
      });
    },
  };
})(Drupal, jQuery);
