(document => {
  'use strict';
  // Idea taken from http://codepen.io/BeyondHyper/pen/xZXXzj

  // Find all tab instances.
  const tabWidget = Array.prototype.slice.call(
    document.querySelectorAll('.js-tabs')
  );

  // Make sure the selector returns something before continuing.
  if (tabWidget.length) {

    // Function to be passed to the click event.
    const tabClickEvent = (tabLink, tabLinks, tabPanels, linkIndex) => {

      // Reset all the tablinks.
      tabLinks.forEach(link => {
        link.setAttribute('tabindex', '-1');
        link.setAttribute('aria-selected', 'false');
        link.parentNode.removeAttribute('data-tab-active');
        link.removeAttribute('data-tab-active');
      });

      // Set the active link attributes.
      tabLink.setAttribute('tabindex', '0');
      tabLink.setAttribute('aria-selected', 'true');
      tabLink.parentNode.setAttribute('data-tab-active', '');
      tabLink.setAttribute('data-tab-active', '');

      // Change tab panel visibility
      tabPanels.forEach((panel, index) => {
        if (index !== linkIndex) {
          panel.setAttribute('aria-hidden', 'true');
          panel.removeAttribute('data-tab-active');
        }
        else {
          panel.setAttribute('aria-hidden', 'false');
          panel.setAttribute('data-tab-active', '');
        }
      });
    };

    // Function to be passed to the keyboard event.
    const keyboardEvent =
      (tabLink, tabLinks, tabPanels, tabItems, index, e) => {

        // Which property is deprecated, e.key is not fully supported
        let keyCode = e.key || e.which;
        let previousTab = tabLinks[index - 1];
        let nextTab = tabLinks[index + 1];
        let firstTab = tabLinks[0];
        let lastTab = tabLinks[tabLinks.length - 1];

        // ArrowRight and ArrowLeft are the values when event.key is supported.
        // Eslint has a bug with switch spacing.
        //
        switch (keyCode) {
          case 'ArrowLeft':
          case 37:
            e.preventDefault();

            if (!previousTab) {
              lastTab.focus();
            }
            else {
              previousTab.focus();
            }
            break;

          case 'ArrowRight':
          case 39:
            e.preventDefault();

            if (!nextTab) {
              firstTab.focus();
            }
            else {
              nextTab.focus();
            }
            break;
        }
      };

    // For each tab instance do the following.
    tabWidget.map((item) => {
      // Create a placeholder array for tab links.
      let tabLinks = [];

      // Find all tab panels.
      const tabPanels = Array.prototype.slice.call(
        item.querySelectorAll('.tabs__panel')
      );

      // Add accessibility roles and labels
      const tabList = item.querySelector('.tabs__list');

      // Add role to tab list.
      tabList.setAttribute('role','tablist');

      // Find all tab items.
      const tabItems = Array.prototype.slice.call(
        tabList.querySelectorAll('.tabs__item')
      );

      // For each tab item run the following function.
      tabItems.forEach((tabItem, index) => {

        // Find each link within each tab item and add them to an array.
        const link = tabItem.querySelector('.tabs__link');
        tabLinks.push(link);

        // Set each tab item role to presentation.
        tabItem.setAttribute('role', 'presentation');

        // Set the first item to active.
        if (index === 0) {
          tabItem.setAttribute('data-tab-active', '');
        }
      });

      // For each tab link run the following function.
      tabLinks.forEach((link, i) => {

        // Pull the anchor off of the link.
        const anchor = link.getAttribute('href').split('#')[1];

        // Build an object for all the link attributes.
        let attributes = {
          'id': 'tab-link-' + i,
          'role': 'tab',
          'tabIndex': '-1',
          'aria-selected': 'false',
          'aria-controls': anchor
        };

        // i=Ff it's the first element update the attributes.
        if (i === 0) {
          attributes['aria-selected'] = 'true';
          attributes.tabIndex = '0';
          link.setAttribute('data-tab-active', '');
        }

        // Add the various accessibility roles and labels to the links.
        for (let key in attributes) {
          link.setAttribute(key, attributes[key]);
        }

        // Prevent the default click event on links.
        link.addEventListener('click', function(e) {
          e.preventDefault();
        }, false);

        // Click Event Listener for on focus events.
        link.addEventListener('focus', function() {
          tabClickEvent(this, tabLinks, tabPanels, i);
        }, false);

        // Keyboard event listener for keydown events.
        link.addEventListener('keydown', function(e) {
          keyboardEvent(link, tabLinks, tabPanels, tabItems, i, e);
        }, false);
      });

      // For each tab panel, run the following function.
      tabPanels.forEach((panel, i) => {

        // Create an <a> for keyboard controls.
        let nextTabLink = document.createElement('a');

        // Create the next tab link index.
        // If the current counter is less than however many tab panels
        // there are, increment the nextTabLinkIndex, else set it to zero.
        let nextTabLinkIndex = (i < tabPanels.length - 1) ? i + 1 : 0;

        // Add href to the link.
        nextTabLink.setAttribute('href', '#tab-link-' + nextTabLinkIndex);

        // Add text to the link.
        nextTabLink.textContent = 'Next Tab';

        // Add a class to the next link.
        nextTabLink.classList.add(
          'visually-hidden',
          'focusable',
          'btn',
          'btn--secondary'
        );

        // Append the link to the panel.
        panel.appendChild(nextTabLink);

        // Pull together all attributes we need for the tab panel.
        let attributes = {
          'role': 'tabpanel',
          'aria-hidden': 'true',
          'aria-labelledby': 'tab-link-' + i
        };

        // If it's the first item, set it to active.
        if (i === 0) {
          attributes['aria-hidden'] = 'false';
          panel.setAttribute('data-tab-active', '');
        }

        // Update the panel with
        for (let key in attributes) {
          panel.setAttribute(key, attributes[key]);
        }
      });
    });
  }
})(document);
