// Scaffolds out the component folders and returns the generated manifest
// used to populate the Drupal libraries file and copy over any
// Drupal templates.

const fs = require('fs');
// Experimental, could switch to normal FS I suppose.
const fsPromises = fs.promises;

module.exports = async function buildComponents({
  exampleComponents,
  app,
  pathBase = '_example_components'
}) {

  // Build an object that will be used to populate the *.libraries.yml file
  // with data for any selected example components.
  // eslint-disable-next-line max-len
  const libraries = await Promise.all(exampleComponents.map(async (component) => {
    // Copy the selected example component into the theme.
    // Exclude the templates folder, it needs to go in a different directory.
    app.fs.copy(
      [
        app.templatePath(`${pathBase}/${component}`),
        `!${app.templatePath(`${pathBase}/${component}`)}/templates`,
        `!${app.templatePath(`${pathBase}/${component}/${component}.twig`)}`
      ],
      app.destinationPath(`src/patterns/components/${component}`)
    );

    // Copy the twig template, passing in the themeMachineName
    // so it can be used as a twig namespace.
    app.fs.copyTpl(
      app.templatePath(`${pathBase}/${component}/${component}.twig`),
      // eslint-disable-next-line max-len
      app.destinationPath(`src/patterns/components/${component}/${component}.twig`),
      {
        themeNameMachine: app.themeNameMachine
      }
    );

    // Copy any Drupal templates into the templates directory.
    fs.readdir(
      app.templatePath(`${pathBase}/${component}/templates`),
      (err, files) => {
        if (!err) {
          // Make sure the file is a twig file.
          const twigFiles = files.filter(name => name.endsWith('.twig'));
          // Loop over all template files, pass through the theme machine name,
          // and copy them to the src/templates directory.
          twigFiles.forEach(file => {
            app.fs.copyTpl(
              app.templatePath(`${pathBase}/${component}/templates/${file}`),
              app.destinationPath(`src/templates/${file}`),
              {
                themeNameMachine: app.themeNameMachine
              }
            );
          });
        }
      }
    );

    // Check to see if the example component contains a JS file.
    const jsFile = app.templatePath(`${pathBase}/${component}/${component}.js`);
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
      };
    }
    // If there's no JS file, only add the css.
    catch (error) {
      return {
        [component]: {
          css: {
            component: {
              [`dist/css/${component}.css`]: {}
            }
          }
        }
      };
    }
  }));

  // Convert the array into a flat object needed for the libraries file.
  return libraries.reduce((accumulator, currentValue) => {
    return Object.assign(accumulator, currentValue);
  }, {});
};
