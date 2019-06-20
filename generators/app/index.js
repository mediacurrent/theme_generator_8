'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const _ = require('lodash');
const fs = require('fs');
const mkdirp = require('mkdirp');
const path = require('path');

module.exports = class extends Generator {
  prompting() {
    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the cool ' + chalk.red('Mediacurrent D8 theme') + ' generator!'
    ));

    // Proved the user with prompts.
    var prompts = [
      {
        name: 'themeName',
        message: 'What is your theme\'s human readable name?',
        default: _.startCase(this.appname) // Default to current folder name
      },
      {
        name: 'themeNameMachine',
        message: 'What is your theme\'s machine name? EX: unicorn_theme',
        default: function (answers) {
          // Default to snake case theme name
          return _.snakeCase(answers.themeName);
        }
      },
      {
        name: 'themeDesc',
        message: 'What is your theme\'s description?',
        default: function (answers) {
          // Default to a helpful reminder to change the description later.
          return 'Update ' + answers.themeName + '.info.yml if you want to change the theme description later.';
        }
      },
      {
        type: 'list',
        name: 'whichBaseTheme',
        message: 'Which base theme would you like to use? If you don\'t want to use a base theme pick "stable" as that\'s what\'s used by Drupal if you don\'t specify a base.',
        choices: [
          {
            value: 'stable',
            name: 'Use Stable as a base theme'
          },
          {
            value: 'classy',
            name: 'Use Classy as a base theme'
          }
        ]
      },
      {
        type: 'checkbox',
        name: 'howMuchTheme',
        message: 'Would you like any starter components with your theme?',
        choices: [
          {
            value: 'button',
            name: 'Button'
          },
          {
            value: 'hero',
            name: 'Hero'
          }
        ]
      }
    ];

    return this.prompt(prompts).then(function (props) {
      // Check available options and store them in as easy to use variables.
      // Returns true or false depending on if the choice is selected.
      var hasOption = function (choices, opt) {
        return choices.indexOf(opt) !== -1;
      };

      // TODO: make this work. Could be an array maybe.
      this.components.button = hasOption(props.howMuchTheme, 'button');
      this.components.hero = hasOption(props.howMuchTheme, 'hero');

      // Add the base theme to the object.
      this.baseTheme = props.whichBaseTheme;

      // Create a underscored version of the theme name.
      this.cleanThemeName = _.snakeCase(props.themeName);

      // Use the user provided theme machine name.
      this.themeNameMachine = props.themeNameMachine;

      // Create a dashed version of the theme name.
      this.dashedThemeName = _.kebabCase(props.themeName);

      // Get pkg info so we can create a 'generated on' comment.
      this.pkg = JSON.parse(fs.readFileSync(path.resolve(path.join(__dirname, '../../package.json')), 'utf8'));

      // To access props later use this.props.someAnswer;
      this.props = props;
    }.bind(this));
  }

  writing() {
    // Create the project configuration.
    // This adds node modules and tools needed.
    this.fs.copyTpl(
      this.templatePath('_package.json'),
      this.destinationPath('package.json'),
      {
        themeName: this.themeNameMachine
      }
    );
    this.fs.copy(
      this.templatePath('gitignore'),
      this.destinationPath('.gitignore')
    );
    this.fs.copy(
      this.templatePath('editorconfig'),
      this.destinationPath('.editorconfig')
    );
    this.fs.copy(
      this.templatePath('prettierrc.json'),
      this.destinationPath('.prettierrc.json')
    );
    this.fs.copy(
      this.templatePath('_README.md'),
      this.destinationPath('README.md')
    );
    this.fs.copy(
      this.templatePath('eslintrc.yml'),
      this.destinationPath('.eslintrc.yml')
    );
    this.fs.copy(
      this.templatePath('sass-lint.yml'),
      this.destinationPath('.sass-lint.yml')
    );
    this.fs.copy(
      this.templatePath('_patternlab-config.json'),
      this.destinationPath('patternlab-config.json')
    );
    this.fs.copy(
      this.templatePath('_src'),
      this.destinationPath('src')
    );

    // Build out the compiled folders.
    mkdirp('dist');
    mkdirp('dist/css');
    mkdirp('dist/fonts');
    mkdirp('dist/images');
    mkdirp('dist/js');

    // Some folders remain empty so add in a gitkeep
    // so they're checked into git.
    this.fs.copy(
      this.templatePath('gitkeep'),
      this.destinationPath('dist/css/.gitkeep')
    );
    this.fs.copy(
      this.templatePath('gitkeep'),
      this.destinationPath('dist/fonts/.gitkeep')
    );
    this.fs.copy(
      this.templatePath('gitkeep'),
      this.destinationPath('dist/images/.gitkeep')
    );
    this.fs.copy(
      this.templatePath('gitkeep'),
      this.destinationPath('dist/js/.gitkeep')
    );

    // Add build tools.
    this.fs.copy(
      this.templatePath('_gulpfile.js'),
      this.destinationPath('gulpfile.js')
    );
    this.fs.copy(
      this.templatePath('_gulp-tasks'),
      this.destinationPath('gulp-tasks')
    );

    // Create the theme files.
    //
    // Create theme.info.yml with data provided.
    this.fs.copyTpl(
      this.templatePath('_theme_name.info.yml'),
      this.destinationPath(this.themeNameMachine + '.info.yml'),
      {
        themeName: this.props.themeName,
        themeDesc: this.props.themeDesc,
        themeNameMachine: this.themeNameMachine,
        baseTheme: this.baseTheme,
        pkg: this.pkg
      }
    );
    // Create theme.libraries.yml with data provided.
    this.fs.copyTpl(
      this.templatePath('_theme_name.libraries.yml'),
      this.destinationPath(this.themeNameMachine + '.libraries.yml'),
      {
        themeNameMachine: this.themeNameMachine
      }
    );
    // Create theme.breakpoints.yml with data provided.
    this.fs.copyTpl(
      this.templatePath('_theme_name.breakpoints.yml'),
      this.destinationPath(this.themeNameMachine + '.breakpoints.yml'),
      {
        themeName: this.props.themeName,
        themeNameMachine: this.themeNameMachine
      }
    );
    // Create theme.theme with data provided.
    this.fs.copyTpl(
      this.templatePath('_theme_name.theme'),
      this.destinationPath(this.themeNameMachine + '.theme'),
      {
        themeNameMachine: this.themeNameMachine
      }
    );
    // TODO: this needs to be updated for the new example components.
    // If we're including sample sections, add a sample list component.
    // Use the component and js-behavior subgenerators to build the component.
    // if (this.kssSections === true) {
    //   // Add the sample .scss, .json and .twig files.
    //   this.composeWith('mc-d8-theme:component', {
    //     arguments: ['Sample List']
    //   });
    //   // Add a sample JavaScript behavior.
    //   this.composeWith('mc-d8-theme:js-behavior', {
    //     arguments: ['sample-list']
    //   });
    // }

    this.fs.copy(
      this.templatePath('_screenshot.png'),
      this.destinationPath('screenshot.png')
    );
  }

  install() {
    // Install the following node modules dynamically each time.
    var npmArray = [
      '@pattern-lab/cli',
      '@pattern-lab/core',
      '@pattern-lab/engine-twig-php',
      '@pattern-lab/uikit-workshop',
      'concurrently'
    ];

    // This runs `npm install ... --save-dev` on the command line.
    this.npmInstall(npmArray, {
      saveDev: true
    });

    this.npmInstall();
  }

  end() {
    this.log(chalk.cyan.bgBlack.bold(
`☠️  NOTE: Your new generated theme contains a fair bit of boilerplate code.
This is by design. If you don't need it PLEASE delete it.
You can always rerun the generator some other time in a different directory
and copy over what you're missing.`));
    this.log(chalk.red('🚀'));
  }

};
