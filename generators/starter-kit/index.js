const Generator = require('yeoman-generator');
const _ = require('lodash');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const jsYaml = require('js-yaml');
const assert = require('assert');

// Helper to generate component libraries.
const buildComponents = require('./build-components');
// Helper to add in third party dependencies.
const addThirdParty = require('./add-third-party');

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
            value: 'accordion',
            name: 'Accordion'
          },
          {
            value: 'button',
            name: 'Button'
          },
          {
            value: 'card',
            name: 'Card (Depends on Eyebrow and Heading components.)'
          },
          {
            value: 'card-list',
            name: 'Card List (Depends on Card, Eyebrow and Heading components.)'
          },
          {
            value: 'carousel',
            name: 'Carousel (Depends on Heading, Media and Button components.)'
          },
          {
            value: 'eyebrow',
            name: 'Eyebrow'
          },
          {
            value: 'heading',
            name: 'Heading'
          },
          {
            value: 'hero',
            name: 'Hero (Depends on Heading, Media and Button components.)'
          },
          {
            value: 'media',
            name: 'Media'
          },
          {
            value: 'message',
            name: 'Drupal Messages'
          },
          {
            value: 'tabs',
            name: 'Drupal Tabs'
          }
        ]
      }
    ];

    // If there's no theme machine name provided, prompt the user for it.
    if (!this.themeNameMachine) {
      let defaultThemeName = '';

      try {
        // See if package.json exists.
        fs.accessSync(this.destinationPath('package.json'), fs.constants.R_OK);
        // If it does, read it and use the name as our default
        // theme machine name.
        const pkg = JSON.parse(
          fs.readFileSync(
            path.resolve(this.destinationPath('package.json')), 'utf8'
          )
        );
        defaultThemeName = pkg.name;
      }
      catch (err) {
        assert.fail(
          `
🚨 ${chalk.red(this.destinationPath('package.json'))} ${chalk.red('is missing')}.
${chalk.blue('Make sure you\'re running this command from your theme root.')}`
        );
      }

      prompts.push({
        name: 'themeNameMachine',
        message: 'What is your theme\'s machine name? EX: unicorn_theme',
        default: defaultThemeName
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
          // Add in any third party dependencies before we write
          // to the libraries.yml file.
          buildComponentsConfig = addThirdParty(buildComponentsConfig);

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

  install() {
    // If `carousel` is selected, attempt to install the slick
    // carousel dependency.
    if (this.exampleComponents.indexOf('carousel') !== -1) {
      // eslint-disable-next-line max-len
      // https://lightning.acquia.com/blog/round-your-front-end-javascript-libraries-composer
      this.log('------------------------------------------------------------');
      // eslint-disable-next-line max-len
      this.log('⏳ Attempting to install the slick-carousel dependency using composer.');
      this.log('This is needed by the carousel component.');
      // eslint-disable-next-line max-len
      this.log(`If this fails you'll have to manually add Slick to your project and update the carousel library in the ${this.themeNameMachine}.libraries.yml file.`);
      this.log('https://github.com/kenwheeler/slick/');
      this.log('------------------------------------------------------------');
      // When running composer install, assume that we'll be using the
      // composer.json file found at the root of the project. As long as
      // that file is above the docroot and the theme is in a
      // theme/custom directory, this should work.
      this.spawnCommand('composer', [
        'require',
        'npm-asset/slick-carousel',
        '--working-dir=../../../../'
      ]);
    }
  }
};
