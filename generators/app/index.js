'use strict';
/* eslint no-multi-spaces: "off" */
var yeoman = require('yeoman-generator');
var chalk  = require('chalk');
var yosay  = require('yosay');
var mkdirp = require('mkdirp');
var _      = require('lodash');
var path   = require('path');
var wiring = require('html-wiring');
/* eslint no-multi-spaces: "on" */

module.exports = yeoman.Base.extend({
  prompting: function () {
    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the cool ' + chalk.red('Mediacurrent D8 theme') + ' generator!'
    ));

    // Proved the user with prompts.
    var prompts = [
      {
        name: 'themeName',
        message: 'What is your theme\'s human readable name? \n It\'s recommended to add a "theme" to the name so it doesn\'t conflict with modules. EX: Unicorn Theme',
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
        message: 'What is your theme\'s description?'
      },
      {
        type: 'confirm',
        name: 'baseTheme',
        message: 'Would you like to use a base theme?'
      },
      {
        type: 'list',
        name: 'whichBaseTheme',
        message: 'Which base theme would you like to use?',
        choices: [
          {
            value: 'stable',
            name: 'Use Stable as a base theme'
          },
          {
            value: 'classy',
            name: 'Use Classy as a base theme'
          }
        ],
        when: function (answers) {
          // If baseTheme is true, ask this question.
          // If it's false skip this question.
          return (answers.baseTheme);
        }
      },
      {
        type: 'checkbox',
        name: 'howMuchTheme',
        message: 'What would you like included in this build?',
        choices: [
          {
            value: 'kssNode',
            name: 'KSS Node style guide'
          },
          {
            value: 'breakpoint',
            name: 'Breakpoint plugin'
          },
          {
            value: 'singularity',
            name: 'Singularity Grid System and Breakpoint'
          }
        ]
      },
      {
        type: 'confirm',
        name: 'kssSections',
        message: 'Since you\'re using KSS, would you like some sample Style Guide sections?',
        when: function (answers) {
          // If baseTheme is true, ask this question.
          // If it's false skip this question.
          return (answers.howMuchTheme.includes('kssNode'));
        }
      }
    ];

    return this.prompt(prompts).then(function (props) {
      // Check available options and store them in as easy to use variables.
      // Returns true or false depending on if the choice is selected.
      var hasOption = function (choices, opt) {
        return choices.indexOf(opt) !== -1;
      };

      this.kssNode = hasOption(props.howMuchTheme, 'kssNode');
      this.breakpoint = hasOption(props.howMuchTheme, 'breakpoint');
      this.singularity = hasOption(props.howMuchTheme, 'singularity');

      // If the user has selected a base theme, add it to the object.
      // If they haven't set it to false.
      if (props.baseTheme === true) {
        this.baseTheme = props.whichBaseTheme;
      }
      else {
        this.baseTheme = false;
      }

      // Set kssSections if it's needed.
      if (this.kssNode === true) {
        this.kssSections = props.kssSections;
      }
      else {
        this.kssSections = false;
      }

      // If BOTH Singularity and Breakpoint options are checked,
      // set breakpoint to false as Singularity includes breakpoint
      // as a dependency.
      if (this.singularity === true && this.breakpoint === true) {
        this.breakpoint = false;
      }

      // Create a underscored version of the theme name.
      this.cleanThemeName = _.snakeCase(props.themeName);

      // Use the user provided theme machine name.
      this.themeNameMachine = props.themeNameMachine;

      // Create a dashed version of the theme name.
      this.dashedThemeName = _.kebabCase(props.themeName);

      // Get pkg info so we can create a 'generated on' comment.
      this.pkg = JSON.parse(wiring.readFileAsString(path.join(__dirname, '../../package.json')));

      // To access props later use this.props.someAnswer;
      this.props = props;
    }.bind(this));
  },

  writing: {
    // Create the project configuration.
    // This adds node modules and tools needed.
    projectConfig: function () {
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
        this.templatePath('_README.md'),
        this.destinationPath('README.md')
      );
      this.fs.copy(
        this.templatePath('eslintrc'),
        this.destinationPath('.eslintrc')
      );
      this.fs.copy(
        this.templatePath('sass-lint.yml'),
        this.destinationPath('.sass-lint.yml')
      );
    },

    // Build out the theme folders.
    scaffoldFolders: function() {
      mkdirp('components');
      mkdirp('layout');
      mkdirp('dist');
      mkdirp('global');
      mkdirp('global/base');
      mkdirp('global/utils');
      mkdirp('templates');
    },

    // Add build tools.
    buildTools: function() {
      this.fs.copyTpl(
        this.templatePath('_gulpfile.js'),
        this.destinationPath('gulpfile.js'),
        {
          kssNode: this.kssNode,
          themeNameMachine: this.themeNameMachine
        }
      );
    },

    // Create the theme files.
    projectFiles: function () {
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
      // Create theme.theme with data provided.
      this.fs.copyTpl(
        this.templatePath('_theme_name.theme'),
        this.destinationPath(this.themeNameMachine + '.theme'),
        {
          themeNameMachine: this.themeNameMachine
        }
      );
      // Create main global Sass file and partials.
      this.fs.copy(
        this.templatePath('_global/_global.scss'),
        this.destinationPath('global/global.scss')
      );
      this.fs.copy(
        this.templatePath('_global/_base'),
        this.destinationPath('global/base')
      );
      this.fs.copy(
        this.templatePath('_global/_utils'),
        this.destinationPath('global/utils')
      );
      // The following need variables passed in so they can
      // conditionally buid the files.
      this.fs.copyTpl(
        this.templatePath('_global/_init.scss'),
        this.destinationPath('global/utils/_init.scss'),
        {
          breakpoint: this.breakpoint,
          singularity: this.singularity
        }
      );
      this.fs.copyTpl(
        this.templatePath('_global/_colors.scss'),
        this.destinationPath('global/utils/_colors.scss'),
        {
          kssSections: this.kssSections
        }
      );
      this.fs.copyTpl(
        this.templatePath('_global/_typography.scss'),
        this.destinationPath('global/utils/_typography.scss'),
        {
          kssSections: this.kssSections
        }
      );

      // If we're including sample sections, add the icons section,
      // which is a component.
      if (this.kssSections === true) {
        this.fs.copy(
          this.templatePath('_sample-components/_icons'),
          this.destinationPath('components/icons')
        );
        this.fs.copyTpl(
          this.templatePath('_sample-components/_icons.scss'),
          this.destinationPath('components/icons/icons.scss'),
          {
            themeNameMachine: this.themeNameMachine
          }
        );
      }

      // If we're including sample sections, add a sample list component.
      // Use the component subgenerator to build the component.
      if (this.kssSections === true) {
        this.composeWith('mc-d8-theme:component', {
          args: ['Sample List']
        });
      }

      this.fs.copy(
        this.templatePath('_screenshot.png'),
        this.destinationPath('screenshot.png')
      );

      // If the KSS Node option is selected, use the subgenerator 'kss-style-guide'.
      if (this.kssNode === true) {
        this.composeWith('mc-d8-theme:kss-style-guide', {
          args: [this.props.themeName],
          options: {
            gulpExample: false
          }
        });
      }
    }
  },

  install: function () {
    // Create an empty array for our NodeJS Modules
    var npmArray = [];

    // Conditionally install breakpoint or singularity using npm.
    if (this.breakpoint === true || this.singularity === true) {
      npmArray.push('breakpoint-sass');
    }

    if (this.singularity === true) {
      npmArray.push('singularitygs');
    }

    // This runs `npm install gulp ... --save-dev` on the command line.
    this.npmInstall(npmArray, { 'saveDev': true });

    this.npmInstall();
  },

  end: function() {
    // Shrinkwrap npm dependencies.
    // This is the same as npm shrinkwrap --dev.
    this.spawnCommand('npm', ['shrinkwrap', '--dev']);

    this.log(chalk.red('#YOLO'));
  }
});
