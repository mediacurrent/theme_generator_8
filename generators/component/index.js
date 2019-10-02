var Generator = require('yeoman-generator');
var _ = require('lodash');
var chalk = require('chalk');
const fs = require('fs');
const path = require('path');

module.exports = class extends Generator {
  constructor(args, options) {
    super(args, options);

    // Allow the theme generator main app to pass through the machine name.
    this.argument('theme_machine_name', {
      required: false,
      type: String,
      desc: 'The theme machine name'
    });
  }

  prompting() {
    let prompts = [];

    // If there's no theme machine name provided, prompt the user for it.
    if (!this.options.theme_machine_name) {
      // TODO: Test if this works in the following scenarios:
      // 1. There is a package.json
      // 2. There is no package.json
      // 3. This is called from the main generator app.
      this.pkg = JSON.parse(
        fs.readFileSync(
          path.resolve(path.join(__dirname, './package.json')), 'utf8'
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

    // Proved the user with prompts.
    // TODO: need to think more about this flow.
    // In theory we want users to use this to quickly scaffold a new component.
    // We ALSO want users to be able to add demo components.
    // These may actually do better to seperate them to two
    // different sub-generators.
    // 1. component
    // 2. starter
    prompts.push({
      type: 'checkbox',
      name: 'howMuchTheme',
      message: 'Would you like to add any starter components?',
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
    });

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

  initializing() {
    // Create an object to contain all our name variations.
    this.componentName = {};

    // Preserve the raw layout name.
    this.componentName.raw = this.options.name;

    // Create a dashed version of the layout name.
    this.componentName.dashed = _.kebabCase(this.options.name);

    this.log('Creating a new theme component called ' + this.options.name + ' (' + this.componentName.dashed + ').');
  }

  writing() {
    // Write each file the component needs, adding the component
    // name where needed.
    this.fs.copyTpl(
      this.templatePath('_component/_component.json'),
      this.destinationPath('src/components/' + this.componentName.dashed + '/' + this.componentName.dashed + '.json'),
      {
        name: this.componentName.raw
      }
    );
    this.fs.copyTpl(
      this.templatePath('_component/_component.scss'),
      this.destinationPath('src/components/' + this.componentName.dashed + '/' + this.componentName.dashed + '.scss'),
      {
        name: this.componentName.raw,
        dashed: this.componentName.dashed
      }
    );
    this.fs.copyTpl(
      this.templatePath('_component/_component.twig'),
      this.destinationPath('src/components/' + this.componentName.dashed + '/' + this.componentName.dashed + '.twig'),
      {
        dashed: this.componentName.dashed
      }
    );
  }

  install() {
    this.log('=========================================');
    this.log('Created a new component named ' + chalk.red(this.options.name) + '.');
    this.log('-----------------------------------------');
  }

};
