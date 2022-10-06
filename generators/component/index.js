var Generator = require('yeoman-generator');
var _ = require('lodash');
var chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const jsYaml = require('js-yaml');
const assert = require('assert');

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

    // Allow the user to opt in to a Markdown file.
    // --include-markdown
    this.option('include-markdown', {
      type: Boolean,
      desc: 'Include a Markdown file'
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

    // Check to see if we need to include a Markdown file.
    this.includeMarkdown = this.options.includeMarkdown || false;
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
    // If it doesn't, let the user know we can't continue. We need to run from
    // the theme root.
    catch (err) {
      assert.fail(
        `
🚨 ${chalk.red(this.destinationPath('package.json'))} ${chalk.red('is missing')}.
${chalk.blue('Make sure you\'re running this command from your theme root.')}`
      );
    }

    let prompts = [{
      name: 'themeNameMachine',
      message: 'What is your theme\'s machine name? EX: unicorn_theme',
      default: defaultThemeName
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
    },
    {
      name: 'includeMarkdown',
      type: 'confirm',
      message: 'Would you like to include a Markdown file?',
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
      // See if we need to include a Markdown file.
      this.includeMarkdown = props.includeMarkdown;

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
          },
          dependencies: [
            'core/drupal',
            'core/jquery'
          ]
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
          camel: _.camelCase(this.componentName.raw),
          dashed: this.componentName.dashed,
          themeNameMachine: this.themeNameMachine
        }
      );
    }
    if (this.includeMarkdown) {
      this.fs.copyTpl(
        this.templatePath('_component/_component.md'),
        // eslint-disable-next-line max-len
        this.destinationPath('src/patterns/components/' + this.componentName.dashed + '/' + this.componentName.dashed + '.md'),
        {
          name: this.componentName.raw,
          dashed: this.componentName.dashed
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
      // eslint-disable-next-line max-len
      this.log(chalk.blue(`npm run generate -- --name="${this.componentName.raw}" --theme-name="${this.themeNameMachine} --include-markdown"`));
      this.log('Or add a Drupal JavaScript behavior to that with:');
      // eslint-disable-next-line max-len
      this.log(chalk.blue(`npm run generate -- --name="${this.componentName.raw}" --theme-name="${this.themeNameMachine}" --include-js`));
    }
  }
};
