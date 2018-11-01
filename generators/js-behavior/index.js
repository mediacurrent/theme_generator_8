'use strict';
var yeoman = require('yeoman-generator');
var _ = require('lodash');
var chalk = require('chalk');

module.exports = yeoman.Base.extend({
  constructor: function () {
    yeoman.Base.apply(this, arguments);

    // Get more info with `--help`.
    this.argument('name', {
      required: true,
      type: String,
      desc: 'The component file name that the behavior should sit within.'
    });
  },

  initializing: function () {
    // Create an object to contain all our name variations.
    this.behaviorName = {};

    // Preserve the raw layout name.
    this.behaviorName.raw = this.name;

    // Make sure it's the dashed version fo the component name.
    this.behaviorName.dashed = _.kebabCase(this.name);

    // Create a dashed version of the layout name.
    this.behaviorName.camel = _.camelCase(this.name);

    this.log('Creating Drupal JavaScript behavior ' + this.behaviorName.dashed + '.es6.js');
  },

  writing: function () {
    this.fs.copyTpl(
      this.templatePath('_behavior.es6.js'),
      this.destinationPath('src/components/' + this.behaviorName.dashed + '/' + this.behaviorName.dashed + '.es6.js'),
      {
        camel: this.behaviorName.camel
      }
    );
  },

  install: function () {
    this.log('=========================================');
    this.log('Created a new JavaScript behavior named ' + chalk.red(this.name) + '.');
    this.log('-----------------------------------------');
  }
});
