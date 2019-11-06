var Generator = require('yeoman-generator');
var _ = require('lodash');
const fs = require('fs');
const path = require('path');
const jsYaml = require('js-yaml');

// Helper to generate component libraries.
const buildComponents = require('../app/build-components');

module.exports = class extends Generator {
  constructor(args, options) {
    super(args, options);

    // TODO: rewrite this with options.
    this.argument('theme_machine_name', {
      required: false,
      type: String,
      desc: 'The theme machine name'
    });
  }

  prompting() {
    const prompts = [
      {
        type: 'checkbox',
        name: 'howMuchTheme',
        message: 'Would you like any starter components with your theme?',
        // Be nice for these to be populated from an external repo
        // and use a package.json to build this list.
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
    if (!this.options.theme_machine_name) {
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
        default: function () {
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

      // Use the user provided theme machine name.
      this.themeNameMachine = props.themeNameMachine;

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
        app: this,
        pathBase: 'templates'
      })
        .then(buildComponentsConfig => {
          // And add the needed lines to the Drupal library file.

          // Loop through the different components and append them to the
          // libraries.yml file.
          buildComponentsConfig.forEach((component) => {
            // Make sure there's a blank line added between libraries.
            this.fs.append(
              this.destinationPath(this.themeNameMachine + '.libraries.yml'),
              jsYaml.safeDump(component),
              {
                trimEnd: false,
                separator: '\r\n'
              }
            );
          });
        })
        .catch(error => {
          // eslint-disable-next-line no-console
          console.error(error);
        });
    }
    else {
      // No example componets were selected, go ahead and copy over the default
      // Drupal libraries file without any additional libraries.
      this.fs.copyTpl(
        this.templatePath('_theme_name.libraries.yml'),
        this.destinationPath(this.themeNameMachine + '.libraries.yml'),
        {
          themeNameMachine: this.themeNameMachine
        }
      );
    }
  }
};
