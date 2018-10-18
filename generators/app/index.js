'use strict';
/* eslint no-multi-spaces: "off" */
var Generator = require('yeoman-generator');
var chalk  = require('chalk');
var yosay  = require('yosay');
var mkdirp = require('mkdirp');
var _      = require('lodash');
var path   = require('path');
/* eslint no-multi-spaces: "on" */


module.exports = class extends Generator {
  async prompting() {
    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the cool ' + chalk.red('Koality Drupal theme') + ' generator!'
    ));

    this.answers = await this.prompt([
      {
        type: 'input',
        name: 'themeName',
        message: `What is your theme's human readable name?`,
        default: this.appname,
        store: true
      },
      {
        type: 'input',
        name: 'themeNameMachine',
        message: `What is your theme's machine name? EX: unicorn_theme`,
        default: (answers) => {
          return _.snakeCase(answers.themeName)
        },
        store: true
      },
      {
        type: 'input',
        name: 'themeDesc',
        message: `What is your theme's description`,
        default: (answers) => {
          return `Update ${answers.themeName}.info.yml if you want to change the theme description later.`
        }
      },
      {
        type: 'list',
        name: 'whichBaseTheme',
        message: `Which base theme you you like to use? If you don't want to use a base theme ping "stable" as that's what's used by Drupal if you don't specify a base.`,
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
          },
          {
            value: 'koalityGrid',
            name: 'Koality Flexbox Grid'
          }
        ]
      },
      {
        type: 'confirm',
        name: 'kssSections',
        message: `Since you're using KSS, would you like some sample Style Guide sections?`,
        when: (answers) => {
          return (answers.howMuchTheme.includes('kssNode'));
        }
      }
    ]);

    // Check available options and store them in as easy to use variables.
    // Returns true or false depending on if the choice is selected.
    const hasOption = (choices, opt) => {
      return choices.indexOf(opt) !== -1;
    };

    this.kssNode = hasOption(this.answers.howMuchTheme, 'kssNode');
    this.breakpoint = hasOption(this.answers.howMuchTheme, 'breakpoint');
    this.singularity = hasOption(this.answers.howMuchTheme, 'singularity');
    this.koalityGrid = hasOption(this.answers.howMuchTheme, 'koalityGrid');

    // Add the base theme to the object.
    this.baseTheme = this.answers.whichBaseTheme;

    // Set kssSections if it's needed.
    if (this.kssNode === true) {
      this.kssSections = this.answers.kssSections;
    }
    else {
      this.kssSections = false;
    }

    // If BOTH Singularity and Breakpoint options are checked,
    // set breakpoint to false as Singularity includes breakpoint
    // same with koalityGrid
    // as a dependency.
    if (this.singularity === true && this.breakpoint === true) {
      this.breakpoint = false;
    }

    // Create a underscored version of the theme name.
    this.cleanThemeName = _.snakeCase(this.answers.themeName);

    // Use the user provided theme machine name.
    this.themeNameMachine = this.answers.themeNameMachine;

    // Create a dashed version of the theme name.
    this.dashedThemeName = _.kebabCase(this.answers.themeName);

    // Get pkg info so we can create a 'generated on' comment.
  }

  writing() {
    this.log(this.templatePath('_package.json'));
    this.log(this.destinationPath);
    // Create the project configuration.
    // This adds node modules and tools needed.
    const projectConfig = () => {
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
    };
    projectConfig();

    // Build out the theme folders.
    const scaffoldFolders = () => {
      mkdirp('src');
      mkdirp('src/components');
      mkdirp('src/layout');
      mkdirp('dist');
      mkdirp('src/global');
      mkdirp('src/global/base');
      mkdirp('src/global/utils');
      mkdirp('src/templates');
      mkdirp('src/layout');
      // Some folders remain empty so add in a gitkeep
      // so they're checked into git.
      this.fs.copy(
        this.templatePath('gitkeep'),
        this.destinationPath('src/layout/.gitkeep')
      );
    };
    scaffoldFolders();

    // Add build tools.
    const buildTools = () => {
      this.fs.copyTpl(
        this.templatePath('_gulpfile.js'),
        this.destinationPath('gulpfile.js'),
        {
          kssNode: this.kssNode,
          themeNameMachine: this.themeNameMachine
        }
      );
      this.fs.copy(
        this.templatePath('_gulp-tasks'),
        this.destinationPath('gulp-tasks')
      );
    };
    buildTools();

    // Create the theme files.
    const projectFiles = () => {
      // Create theme.info.yml with data provided.
      this.fs.copyTpl(
        this.templatePath('_theme_name.info.yml'),
        this.destinationPath(this.themeNameMachine + '.info.yml'),
        {
          themeName: this.answers.themeName,
          themeDesc: this.answers.themeDesc,
          themeNameMachine: this.themeNameMachine,
          baseTheme: this.baseTheme,
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
          themeName: this.answers.themeName,
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
      this.fs.copyTpl(
        this.templatePath('_src/_global/_global.scss'),
        this.destinationPath('src/global/global.scss'),
        {
          koalitygrid: this.koalityGrid
        }
      );
      this.fs.copy(
        this.templatePath('_src/_global/_base'),
        this.destinationPath('src/global/base')
      );
      this.fs.copy(
        this.templatePath('_src/_global/_utils'),
        this.destinationPath('src/global/utils')
      );
      // The following need variables passed in so they can
      // conditionally buid the files.
      this.fs.copyTpl(
        this.templatePath('_src/_global/_init.scss'),
        this.destinationPath('src/global/utils/_init.scss'),
        {
          breakpoint: this.breakpoint,
          singularity: this.singularity,
          koalitygrid: this.koalityGrid
        }
      );
      this.fs.copyTpl(
        this.templatePath('_src/_global/_colors.scss'),
        this.destinationPath('src/global/utils/_colors.scss'),
        {
          kssSections: this.kssSections
        }
      );
      this.fs.copyTpl(
        this.templatePath('_src/_global/_typography.scss'),
        this.destinationPath('src/global/utils/_typography.scss'),
        {
          kssSections: this.kssSections
        }
      );
      this.fs.copyTpl(
        this.templatePath('_src/_global/_variables.scss'),
        this.destinationPath('src/global/utils/_variables.scss'),
        {
          koalitygrid: this.koalityGrid
        }
      );

      // If we're including sample sections, add the icons section,
      // which is a component.
      if (this.kssSections === true) {
        this.fs.copy(
          this.templatePath('_src/_sample-components/_icons'),
          this.destinationPath('src/components/icons')
        );
        this.fs.copyTpl(
          this.templatePath('_src/_sample-components/_icons.scss'),
          this.destinationPath('src/components/icons/icons.scss'),
          {
            themeNameMachine: this.themeNameMachine
          }
        );
        this.fs.copyTpl(
          this.templatePath('_src/_sample-components/_icons/icons.twig'),
          this.destinationPath('src/components/icons/icons.twig'),
          {
            themeNameMachine: this.themeNameMachine
          }
        );
      };

      // If we're including sample sections, add a sample list component.
      // Use the component and js-behavior subgenerators to build the component.
      if (this.kssSections === true) {
        // Add the sample .scss, .json and .twig files.
        this.composeWith(require.resolve('../component'),
          {
            name: 'Sample List'
          }
        );
        // Add a sample JavaScript behavior.
        this.composeWith(require.resolve('../js-behavior'),
          {
            name: 'sample-list'
          }
        );
      }

      this.fs.copy(
        this.templatePath('_screenshot.png'),
        this.destinationPath('screenshot.png')
      );

      // If the KSS Node option is selected, use the subgenerator 'kss-style-guide'.
      /*if (this.kssNode === true) {
        this.composeWith('koality-theme:kss-style-guide', {
          args: [this.this.answers.themeName, this.this.answers.themeNameMachine],
          options: {
            gulpExample: false
          }
        });
      }*/
    };
    projectFiles();
  }

  install() {
    // Create an empty array for our NodeJS Modules
    var npmArray = [];

    // Conditionally install breakpoint or singularity using npm.
    if (this.breakpoint === true || this.singularity === true) {
      npmArray.push('breakpoint-sass');
    }

    // Conditionally install Koality Grid using npm.
    if (this.koalityGrid === true) {
      npmArray.push('koality-flexbox-grid');
    }

    if (this.singularity === true) {
      npmArray.push('singularitygs');
    }

    // This runs `npm install gulp ... --save-dev` on the command line.
    this.npmInstall(npmArray, { 'saveDev': true });

    this.npmInstall();
  }

  end() {
    this.log(chalk.cyan.bgBlack.bold(
      `☠️  NOTE: Your new generated theme contains a fair bit of boilerplate code.
   This is by design. If you don't need it PLEASE delete it.
   You can always rerun the generator some other time in a different directory
   and copy over what you're missing.`));
  }
};
