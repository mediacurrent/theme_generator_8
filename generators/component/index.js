'use strict';
var yeoman = require('yeoman-generator');
var _      = require('lodash');
var chalk  = require('chalk');

module.exports = yeoman.Base.extend({
  constructor: function () {
    yeoman.Base.apply(this, arguments);

    // Get more info with `--help`.
    this.argument('name', {
      required: true,
      type: String,
      desc: 'The new component name'
    });
  },

  initializing: function () {
    // Create an object to contain all our name variations.
    this.componentName = {};

    // Preserve the raw layout name.
    this.componentName.raw = this.name;

    // Create a dashed version of the layout name.
    this.componentName.dashed = _.kebabCase(this.name);

    this.log('Creating a new theme component called ' + this.name + ' (' + this.componentName.dashed + ').');
  },
  // Write each file the component needs, adding the component
  // name where needed.
  writing: function () {
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
  },

  install: function () {
    this.log('=========================================');
    this.log('Created a new component named ' + chalk.red(this.name) + '.');
    this.log('-----------------------------------------');
  }
});
