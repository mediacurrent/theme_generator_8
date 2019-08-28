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
    // Exclude the templates folder as that needs to go in a different directory.
    app.fs.copy(
      [
        app.templatePath(`_example_components/${component}`),
        `!${app.templatePath(`_example_components/${component}`)}/templates`,
        `!${app.templatePath(`_example_components/${component}/${component}.twig`)}`
      ],
      app.destinationPath(`src/patterns/components/${component}`)
    );

    // Copy the twig template, passing in the themeMachineName
    // so it can be used as a twig namespace.
    app.fs.copyTpl(
      app.templatePath(`_example_components/${component}/${component}.twig`),
      app.destinationPath(`src/patterns/components/${component}/${component}.twig`),
      {
        themeNameMachine: app.themeNameMachine
      }
    );

    // Copy any Drupal templates into the templates directory.
    app.fs.copy(
      app.templatePath(`_example_components/${component}/templates/*`),
      app.destinationPath(`src/templates`),
      { ignoreNoMatch: true }
    );

    // Check to see if the example component contains a JS file.
    const jsFile = app.templatePath(`_example_components/${component}/${component}.js`);
    try {
      await fsPromises.access(jsFile, fs.constants.F_OK);

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
  // Convert the array into a flat object needed for the libraries file.
  return { ...libraries.reduce((accumulator, currentValue) => {
    return {
      ...currentValue,
      ...accumulator,
    }
  }, {}) };
};
