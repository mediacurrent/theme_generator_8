// For specific components we need to add additional dependencies.
module.exports = function addDependency (component, themeNameMachine) {
  let libraries = {};

  // If this is the carousel component, it needs SlickJS added
  // as a dependency.
  if (component === 'carousel') {
    libraries = {
      [component]: {
        css: {
          component: {
            [`dist/css/${component}.css`]: {}
          }
        },
        js: {
          [`dist/js/${component}.js`]: {}
        },
        dependencies: [
          'core/drupal',
          'core/jquery',
          `${themeNameMachine}/slick-carousel`
        ]
      }
    };
  }

  return Object.keys(libraries).length && libraries;
};
