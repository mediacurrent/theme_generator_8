'use strict';
var Generator = require('yeoman-generator');
var _      = require('lodash');
var chalk  = require('chalk');
var fs     = require('fs');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);

    // Get more info with `--help`.
    this.argument('name', {
      required: false,
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
  // Write each file the component needs, adding the component
  // name where needed.
  writing() {
    var destPath = this.destinationPath();

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
        dashed: this.componentName.dashed,
        theme_name: destPath.split('/').slice(-1).pop()
      }
    );
// auto add this component to the libraries file in Drupal
    var libraryDefinition = `
${this.componentName.dashed}:
  css:
    component:
      dist/css/${this.componentName.dashed}.css: {}
  js:
    dist/js/${this.componentName.dashed}.js: {}

`;
    fs.readdir(
      destPath, function(err, list) {
        if (err) {
          console.log('There was an error adding this component to the libraries.yml file');
          throw err;
        }
        else {
          list.forEach(function(item) {
            if (item.indexOf('libraries.yml') !== -1) {
              fs.appendFile(`${destPath}/${item}`, libraryDefinition, function (err) {
                if (err) {
                  console.log('There was an error adding this component to the libraries.yml file');
                  throw err;
                }
              });
            }
          })
        }
      }
    )
  }

  install() {
    this.log('=========================================');
    this.log('Created a new component named ' + chalk.red(this.options.name) + '.');
    this.log('-----------------------------------------');
  }
};
