const Generator = require('yeoman-generator');
const _ = require('lodash');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const jsYaml = require('js-yaml');

// Helper to generate component libraries.
const buildComponents = require('./build-components');

module.exports = class extends Generator {
  constructor(args, options) {
    super(args, options);

    // Allow the theme generator main app to pass through the machine name.
    // --theme-name=hey_yall
    this.option('theme-name', {
      type: String,
      desc: 'The theme machine name'
    });
  }

  initializing() {
    // Grab the theme machine name if it's passed in.
    const themeName = this.options.themeName || '';
    this.themeNameMachine = _.snakeCase(themeName);
  }

  prompting() {
    const prompts = [
      {
        type: 'checkbox',
        name: 'howMuchTheme',
        message: 'Which starter components do you want to add to your theme?',
        // Be nice for these to be populated from an external repo
        // and use a package.json to build this list.
        // Or just do it based on folder name. /shrug
        choices: [
          {
            value: 'button',
            name: 'Button'
          },
          {
            value: 'tabs',
            name: 'Drupal Tabs'
          },
          {
            value: 'message',
            name: 'Drupal Messages'
          }
        ]
      }
    ];

    // If there's no theme machine name provided, prompt the user for it.
    if (!this.themeNameMachine) {
      // TODO: Test if this works in the following scenarios:
      // 1. There is a package.json
      // 2. There is no package.json
      this.pkg = JSON.parse(
        fs.readFileSync(
          path.resolve(this.destinationPath('package.json')), 'utf8'
        )
      );

      prompts.push({
        name: 'themeNameMachine',
        message: 'What is your theme\'s machine name? EX: unicorn_theme',
        default: () => {
          // Try to guess what it is based on the package.json name.
          // If we can't figure it out default to the directory name.
          return this.pkg ? this.pkg.name : _.snakeCase(this.appname);
        }
      });
    }

    return this.prompt(prompts).then(function (props) {
      // props.howMuchTheme is an array of all selected options.
      // i.e. [ 'hero', 'tabs', 'messages' ]
      this.exampleComponents = props.howMuchTheme;

      // Try to use the name passed in via option else use
      // the user provided theme machine name.
      this.themeNameMachine = this.themeNameMachine || props.themeNameMachine;

      // To access props later use this.props.someAnswer;
      this.props = props;
    }.bind(this));
  }

  writing() {
    // If any example components were selected...
    if (this.exampleComponents.length > 0) {
      // ...copy over the example components.
      buildComponents({
        exampleComponents: this.exampleComponents,
        app: this
      })
        .then(buildComponentsConfig => {
          // And add the needed lines to the Drupal library file.

          // Loop through the different components and append them to the
          // libraries.yml file.
          buildComponentsConfig.forEach((component) => {
            // This is a little weird:
            // 1. If this is being run from the parent generator we need to use
            // this.fs.append() since we're copying the original libraries.yml
            // template. If we just use fs.appendFileSync() there
            // will be a conflict.
            // 2. However if this is being run as a standalone sub generator
            // this has to use this.appendFileSync() because otherwise it tries
            // to overwrite the existing libraries file.

            // Find out if this was called via the parent generator:
            if (this.options.themeName) {
              this.fs.append(
                this.destinationPath(this.themeNameMachine + '.libraries.yml'),
                jsYaml.safeDump(component),
                {
                  trimEnd: false,
                  separator: '\r\n'
                }
              );
            }
            else {
              // Add a blank line so the file is nicely formatted and the
              // appended data doesn't run into the current data within
              // the file.
              fs.appendFileSync(
                this.destinationPath(this.themeNameMachine + '.libraries.yml'),
                '\r\n'
              );

              // Update the libraries.yml file with the new component library.
              fs.appendFileSync(
                this.destinationPath(this.themeNameMachine + '.libraries.yml'),
                jsYaml.safeDump(component),
                (err) => {
                  if (err) {
                    this.log(
                      chalk.red(
                        // eslint-disable-next-line max-len
                        `Failed to update ${this.themeNameMachine}.libraries.yml`
                      )
                    );
                  }
                }
              );
            }
          });
        })
        .catch(error => {
          // eslint-disable-next-line no-console
          console.error(error);
        });
    }
  }
};
