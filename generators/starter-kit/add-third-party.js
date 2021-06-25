// For specific components we need to add additional dependencies.
module.exports = function addThirdParty(libraries) {

  // See if Slick is one of the libraries already.
  const containsSlick = libraries.find(lib => lib['slick-carousel']);
  // See if the libraries include the carousel library because
  // if so, we need to add the SlickJS dependency.
  const containsCarousel = libraries.find(lib => lib['carousel']);

  // If slick hasn't been added yet and it's needed, add it.
  if (!containsSlick && containsCarousel) {
    const slick = {
      ['slick']: {
        css: {
          theme: {
            ['/libraries/slick/slick.min.css']: {minified: true},
            ['/libraries/slick/accessible-slick-theme.min.css']: {minified: true}
          }
        },
        js: {
          ['/libraries/slick/slick.min.js']: { minified: true }
        },
        dependencies: [
          'core/jquery',
          'core/drupal',
          'core/drupalSettings',
          'core/jquery.once'
        ]
      }
    };
    // Add slick to the libraries object.
    libraries.push(slick);
  }

  return libraries;
};
