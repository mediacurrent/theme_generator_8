/**
 * @file
 * Behaviors for the Filter Accordion.
 */

!((Drupal, $) => {
  'use strict';

  /**
   * Setup and attach the Filter Accordion behaviors.
   *
   * @type {Drupal~behavior}
   */
  Drupal.behaviors.accordion = {
    attach: function (context) {
      const self = this;
      const $accordions = $('.accordion', context);

      $accordions.each(function () {
        const $accordion = $(this);

        // Attach click handler for accordion.
        const $toggle = $accordion.find('.accordion__toggle');
        $toggle.on('click', function () {
          self.toggleClickEvent($accordion, $(this));
        });
      });
    },

    toggleClickEvent: function ($accordion, $toggle) {
      // Identify the matching element.
      const $content = $accordion.find('#' + $toggle.attr('aria-controls'));

      if (!$accordion.hasClass('open')) {
        // Accordion does not have `.open`, so we are opening the accordion.
        $accordion.addClass('open');
        // Toggle the `aria-expanded`.
        $toggle.attr('aria-expanded', 'true');
        // Toggle the `aria-hidden` attribute on the content.
        $content.attr('aria-hidden', 'false');
      }
      else {
        // Same as the if, but in reverse.
        $accordion.removeClass('open');
        $toggle.attr('aria-expanded', 'false');
        $content.attr('aria-hidden', 'true');
      }
    }
  };
})(Drupal, jQuery);
