'use strict';
var Generator = require('yeoman-generator');
var _ = require('lodash');
var chalk = require('chalk');

module.exports = class extends Generator {
  constructor(args, options) {
    super(args, options);

    this.argument('name', {
      required: true,
      type: String,
      desc: 'The new component name'
    });
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
