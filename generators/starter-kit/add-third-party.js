// For specific components we need to add additional dependencies.
module.exports = function addThirdParty(libraries) {

  // See if Slick is one of the libraries already.
  const containsSlick = libraries.find(lib => lib['slick-carousel']);
  // See if the libraries include the carousel library because
  // if so, we need to add the SlickJS dependency.
  const containsCarousel = libraries.find(lib => lib['carousel']);

  // If slick hasn't been added yet and it's needed, add it.
  if (!containsSlick && containsCarousel) {
    // const slick = {
    //   ['slick-carousel']: {
    //     css: {
    //       component: {
    //         ['/libraries/slick-carousel/slick/slick.css']: {}
    //       }
    //     },
    //     js: {
    //       ['/libraries/slick-carousel/slick/slick.min.js']: { minified: true }
    //     },
    //     dependencies: [
    //       'core/jquery'
    //     ]
    //   }
    // };
    // // Add slick to the libraries object.
    // libraries.push(slick);
  }

  return libraries;
};
