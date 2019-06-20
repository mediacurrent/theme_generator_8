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
      desc: 'The component file name that the behavior should sit within.'
    });
  }

  initializing() {
    // Create an object to contain all our name variations.
    this.behaviorName = {};

    // Preserve the raw layout name.
    this.behaviorName.raw = this.options.name;

    // Make sure it's the dashed version fo the component name.
    this.behaviorName.dashed = _.kebabCase(this.options.name);

    // Create a dashed version of the layout name.
    this.behaviorName.camel = _.camelCase(this.options.name);

    this.log('Creating Drupal JavaScript behavior ' + this.behaviorName.dashed + '.es6.js');
  }

  writing() {
    this.fs.copyTpl(
      this.templatePath('_behavior.js'),
      this.destinationPath('src/patterns/01-components/' + this.behaviorName.dashed + '/' + this.behaviorName.dashed + '.js'),
      {
        camel: this.behaviorName.camel
      }
    );
  }

  install() {
    this.log('=========================================');
    this.log('Created a new JavaScript behavior named ' + chalk.red(this.options.name) + '.');
    this.log('-----------------------------------------');
  }

};
