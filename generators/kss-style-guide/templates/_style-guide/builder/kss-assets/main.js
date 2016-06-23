(function ($, Rainbow) {
    $(function () {

        var $window = $(window),
            $document = $(document),
            $content = $('.kss-content'),
            $sidebar = $('.kss-sidebar'),
            $sidebarInner = $('.kss-sidebar-inner'),
            $menu = $('.kss-menu'),
            $childMenu = $('.kss-menu-child'),
            $menuItem = $menu.find('.kss-menu-item'),
            $childMenuItem = $childMenu.find('.kss-menu-item'),
            ref = $menu.data('kss-ref'),
            prevScrollTop;

        // Fix sidebar position
        function fixSidebar() {
            if ($sidebarInner.outerHeight() < $content.outerHeight()) {
                $sidebar.addClass('kss-fixed');
                if ($sidebarInner.outerHeight() > $window.height()) {
                    $sidebar.height($window.height());
                }
                else {
                    $sidebar.height('auto');
                }
            }
            else {
                $sidebar.removeClass('kss-fixed');
                $sidebar.height('auto');
            }
        }

        // Activate current page item
        $menuItem.eq(ref).addClass('kss-active');

        // Append child menu.
        if ($childMenu.length) {
            $childMenu.show().appendTo($menuItem.eq(ref));
        }

        // Fixed sidebar
        if (!/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)) {
            $window.on('resize', fixSidebar).trigger('resize');
        }

        // Toggle menu JS used by the mobile menu component.
        // These JS classes must be added to both the menu
        // and menu button.
        var $menu = $('.js-menu-toggle');
        var $menuButton = $('.js-menu-toggle-button');

        // Handle menu button clicking
        // This needs jQuery update to run.
        $menuButton.on('click', function(event) {
          var $self = $(this);

          // Toggle classes on menu and menu button.
          $self.toggleClass('site-menu__button--active');

          $self
            .parent()
            .parent()
            .find('.js-menu-toggle')
            .toggleClass('site-menu--expanded');
        });

        // Show markup when the button is clicked.
        $('.js-show-markup').on('click', function() {
          var $self = $(this);

          // Grab the inner html of the next available template tag.
          var markup = $self.next('template').html();

          // Replace the button with the markup.
          $self.replaceWith(markup);

          // Syntax hightlignting with Rainbow.js
          Rainbow.color();
        });
    });
}(jQuery, Rainbow));
