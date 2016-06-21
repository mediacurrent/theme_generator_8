'use strict';
var yeoman = require('yeoman-generator');
var chalk  = require('chalk');
var yosay  = require('yosay');
var _      = require('lodash');

module.exports = yeoman.Base.extend({
  prompting: function () {
    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the cool ' + chalk.red('Mediacurrent D8 theme') + ' generator!'
    ));

    var prompts = [
      {
        name: 'themeName',
        message: 'What is your theme\'s human readable name? \n It\'s recommended to add a "theme" to the name so it doesn\'t conflict with modules. EX: Unicorn Theme',
        default: _.startCase(this.appname) // Default to current folder name
      },
      {
        name: 'themeNameMachine',
        message: 'What is your theme\'s machine name? EX: unicorn_theme',
        default: this.appname // Default to current folder name
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
            value: 'normalize',
            name: 'Normalize.css broken up into base partials'
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
            value: 'utilities',
            name: 'Helpful mixins, utilities, components and example layout partials'
          }
        ]
      }
    ];

    return this.prompt(prompts).then(function (props) {
      // To access props later use this.props.someAnswer;
      this.props = props;
    }.bind(this));
  },

  writing: function () {
    this.fs.copy(
      this.templatePath('dummyfile.txt'),
      this.destinationPath('dummyfile.txt')
    );
  },

  install: function () {
    this.installDependencies();
  }
});
