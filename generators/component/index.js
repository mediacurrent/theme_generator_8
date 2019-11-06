var Generator = require('yeoman-generator');
var _ = require('lodash');
var chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const jsYaml = require('js-yaml');

module.exports = class extends Generator {
  constructor(args, options) {
    super(args, options);

    // Allow the theme generator main app to pass through the machine name.
    // --theme-name=hey_yall
    this.option('theme-name', {
      type: String,
      desc: 'The theme machine name'
    });

    // Allow the user to pass in a component name.
    // --name=HeyYall
    this.option('name', {
      type: String,
      desc: 'The component name'
    });

    // Allow the user to opt in to a JS behavior file.
    // --include-js
    this.option('include-js', {
      type: Boolean,
      desc: 'Include a JS file'
    });
  }

  initializing() {
    // Create an object to contain all our name variations.
    this.componentName = {};

    const rawName = this.options.name || '';
    // Preserve the raw layout name.
    this.componentName.raw = rawName;
    // Create a dashed version of the layout name.
    this.componentName.dashed = _.kebabCase(rawName);

    // Grab the theme machine name if it's passed in.
    const themeName = this.options.themeName || '';
    this.themeNameMachine = _.snakeCase(themeName);

    // Check to see if we need to include a JS file.
    this.includeJS = this.options.includeJs || false;
  }

  // Prompts need at least two arguments passed in to work:
  // theme name and Component name. Without those we can't create
  // a basic component.
  prompting() {
    // If we DO have both the theme name _and_ component name passed
    // as arguments we can skip all the prompts.
    if (this.options.themeName && this.options.name) {
      return;
    }

    // TODO: Test if this works in the following scenarios:
    // 1. There is a package.json
    // 2. There is no package.json
    this.pkg = JSON.parse(
      fs.readFileSync(
        path.resolve(this.destinationPath('package.json')), 'utf8'
      )
    );

    let prompts = [{
      name: 'themeNameMachine',
      message: 'What is your theme\'s machine name? EX: unicorn_theme',
      default: () => {
        // Try to guess what it is based on the package.json name.
        // If we can't figure it out default to the directory name.
        return this.pkg ? this.pkg.name : _.snakeCase(this.appname);
      }
    },
    {
      name: 'name',
      message: 'What should we name your component? EX: Hero',
      default: 'Hero'
    },
    {
      name: 'includeJSBehavior',
      type: 'confirm',
      message: 'Would you like to include a JavaScript Behavior file?',
      default: false
    }];

    return this.prompt(prompts).then(function (props) {

      // Use the user provided theme machine name.
      this.themeNameMachine = _.snakeCase(props.themeNameMachine);

      // Use the component name provided.
      this.componentName.raw = props.name;
      // Create a dashed version of the layout name.
      this.componentName.dashed = _.kebabCase(props.name);

      // See if we need to include a JS behavior file.
      this.includeJS = props.includeJSBehavior;

      // To access props later use this.props.someAnswer;
      this.props = props;
    }.bind(this));
  }

  writing() {
    // Build out the library structure so we can append it to the
    // libraries.yml file.
    let componentLibrary = {};
    const component = this.componentName.dashed;

    // Could prob break this out to it's own thing eventually.
    if (this.includeJS) {
      componentLibrary = {
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
    else {
      componentLibrary = {
        [component]: {
          css: {
            component: {
              [`dist/css/${component}.css`]: {}
            }
          }
        }
      };
    }

    // Add a blank line so the file is nicely formatted and the
    // appended data doesn't run into the current data within the file.
    fs.appendFileSync(
      this.destinationPath(this.themeNameMachine + '.libraries.yml'),
      '\r\n'
    );

    // Update the libraries.yml file with the new component library.
    fs.appendFile(
      this.destinationPath(this.themeNameMachine + '.libraries.yml'),
      jsYaml.safeDump(componentLibrary),
      (err) => {
        if (err) {
          this.log(
            chalk.red(`Failed to update ${this.themeNameMachine}.libraries.yml`)
          );
        }
      }
    );

    // Write each file the component needs, adding the component
    // name where needed.
    this.fs.copyTpl(
      this.templatePath('_component/_component.json'),
      // eslint-disable-next-line max-len
      this.destinationPath('src/patterns/components/' + this.componentName.dashed + '/' + this.componentName.dashed + '.json'),
      {
        name: this.componentName.raw,
        dashed: this.componentName.dashed
      }
    );
    this.fs.copyTpl(
      this.templatePath('_component/_component.scss'),
      // eslint-disable-next-line max-len
      this.destinationPath('src/patterns/components/' + this.componentName.dashed + '/' + this.componentName.dashed + '.scss'),
      {
        name: this.componentName.raw,
        dashed: this.componentName.dashed
      }
    );
    this.fs.copyTpl(
      this.templatePath('_component/_component.twig'),
      // eslint-disable-next-line max-len
      this.destinationPath('src/patterns/components/' + this.componentName.dashed + '/' + this.componentName.dashed + '.twig'),
      {
        dashed: this.componentName.dashed,
        themeNameMachine: this.themeNameMachine
      }
    );
    if (this.includeJS) {
      this.fs.copyTpl(
        this.templatePath('_component/_component.ejs'),
        // eslint-disable-next-line max-len
        this.destinationPath('src/patterns/components/' + this.componentName.dashed + '/' + this.componentName.dashed + '.js'),
        {
          camel: _.camelCase(this.componentName.raw)
        }
      );
    }
  }

  end() {
    this.log('------------------------------------------------------------');
    // eslint-disable-next-line max-len
    this.log(`🎉 Created a new component named: "${chalk.red(this.componentName.raw)}"!`);
    this.log('------------------------------------------------------------');

    // If the user followed the prompt workflow, make sure they know they
    // can run all this on the command line without the prompts.
    if (!this.options.name) {
      // eslint-disable-next-line max-len
      this.log('To generate components faster you can pass in arguments to the subgenerator!');
      this.log('For example: 👇');
      // TODO: test to make sure spaces are ok with this format.
      // eslint-disable-next-line max-len
      this.log(chalk.blue(`npm run generate -- --name="${this.componentName.raw}" --theme-name="${this.themeNameMachine}"`));
      this.log('Or add a Drupal JavaScript behavior to that with:');
      // eslint-disable-next-line max-len
      this.log(chalk.blue(`npm run generate -- --name="${this.componentName.raw}" --theme-name="${this.themeNameMachine}" --include-js`));
    }
  }
};
