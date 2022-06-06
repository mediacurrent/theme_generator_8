!((document, Drupal, $) => {
  'use strict';
  Drupal.behaviors.mainMenu = {
    attach: function (context) {
      const $navicon = $('.main-menu__navicon', context);
      const $menuItemToggle = $('.menu-item-toggle', context);

      $(document).keyup(function(e) {
        // `27` is the code for the escape key.
        if (e.which === 27) {
          if ($navicon.hasClass('active')) {
            $navicon.trigger('click');
          }

          $menuItemToggle.each(function() {
            const $this = $(this);
            if ($this.parent().hasClass('js-open')) {
              $this.trigger('click');
            }
          });
        }
      });

      $navicon.click(function () {
        $(this).toggleClass('active');
        $('.main-menu').toggleClass('active');
      });

      $('li.menu-item--has-submenu', context).hover(
        function () {
          // Mouse enter.
          if ($('.main-menu__navicon', context).is(':hidden')) {
            $(this)
              .addClass('js-open')
              .children('a')
              .attr('aria-expanded', 'true');
          }
        },
        function () {
          if ($('.main-menu__navicon', context).is(':hidden')) {
            // Mouse leave.
            $(this)
              .removeClass('js-open')
              .children('a')
              .attr('aria-expanded', 'false');
          }
        }
      );

      $menuItemToggle.click(function () {
        const $this = $(this);
        if ($this.parent().hasClass('js-open')) {
          $this.parent().removeClass('js-open');
          $this.siblings('a').attr('aria-expanded', 'false');
        }
        else {
          $this.parent().addClass('js-open');
          $this.siblings('a').attr('aria-expanded', 'true');
        }
      });

      $(window).resize(function () {
        $('li.menu-item--has-submenu').removeClass('js-open');
      });
    }
  };
})(document, Drupal, jQuery);
