// TODO: Need JS Doc.
// Scaffolds out the component folders and returns the generated manifest
// used to populate the Drupal libraries file.

const fs = require('fs');
const fsPromises = fs.promises;

// Could still possibly be an async await function
module.exports = async function buildComponents(exampleComponents, app) {
  // Build an object that will be used to populate the *.libraries.yml file
  // with data for any selected example components.
  const libraries = await Promise.all(exampleComponents.map(async (component) => {
    // Copy the selected example component into the theme.
    app.fs.copy(
      app.templatePath(`_example_components/${component}`),
      app.destinationPath(`src/patterns/01-components/${component}`)
    );

    // Check to see if the example component contains a JS file.
    const jsFile = app.templatePath(`_example_components/${component}/${component}.js`);
    try {
      const file = await fsPromises.access(jsFile, fs.constants.F_OK);
      console.log(file);
      // If there's a JS file in the example component, add it to the
      // library.
      return {
        [component]: {
          css: {
            component: {
              [`dist/css/${component}.css`]: {}
            }
          },
          js: {
            [`dist/js/${component}.js`]: {}
          }
        }
      }
    // If there's no JS file, only add the css.
    } catch (error) {
      return {
        [component]: {
          css: {
            component: {
              [`dist/css/${component}.css`]: {}
            }
          }
        }
      }
    }
  }));
  // Convert the array into a flat object.
  return { ...libraries.reduce((accumulator, currentValue) => {
    return {
      ...currentValue,
      ...accumulator
    }
  }, {}) };
};
