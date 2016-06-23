'use strict';
var yeoman = require('yeoman-generator');
var chalk  = require('chalk');

module.exports = yeoman.Base.extend({
  constructor: function () {
    yeoman.Base.apply(this, arguments);

    // Get more info with `--help`.
    this.argument('name', {
      required: true,
      type: String,
      desc: 'The theme name'
    });
    this.option('gulpExample', {
      type: Boolean,
      desc: 'Provide an example of a KSS Node gulp task.',
      defaults: true
    });
  },

  initializing: function () {
    this.log('Creating KSS Node directory structure.');
  },

  writing: function () {
    this.fs.copy(
      this.templatePath('_style-guide'),
      this.destinationPath('style-guide')
    );
    this.fs.copyTpl(
      this.templatePath('_style-guide.md'),
      this.destinationPath('components/style-guide.md'),
      {
        themeName: this.name
      }
    );
  },

  install: function () {
    // Install our NodeJS Modules
    // This runs `npm install kss-node ... --save-dev` on the command line.
    this.npmInstall([
      'kss'
    ], {
      saveDev: true
    });

    if (this.options.gulpExample === true) {
      // Define a gulp task to show the user.
      this.log('=========================================');
      this.log(chalk.red('Run the following command to install kss-node.'));
      this.log('-----------------------------------------');
      this.log('npm install kss --save-dev');
      this.log('=========================================');
      this.log('\n');
      this.log('=========================================');
      this.log(chalk.red('Add the following to the top of your gulpfile.js.'));
      this.log('-----------------------------------------');
      this.log('var kss        = require(\'kss\');');
      this.log('=========================================');
      this.log('\n');
      this.log('=========================================');
      this.log(chalk.red('Add the following task to your gulpfile.js.'));
      this.log('-----------------------------------------');

      var gulpTask = `
        gulp.task('styleguide', function() {
          return kss({
            source: [
              'global',
              'components'
            ],
            destination: './dist/style-guide',
            builder: 'style-guide/builder',
            namespace: 'themeMachineName:' + __dirname + '/components/',
            'extend-drupal8': true,
            // The css and js paths are URLs, like '/misc/jquery.js'.
            // The following paths are relative to the generated style guide.
            css: [
              path.relative(
                __dirname + '/style-guide/',
                __dirname + '/css/global.css'
              )
            ],
            js: [
            ],
            homepage: 'style-guide.md',
            title: 'Style Guide'
          });
        });
      `;

      this.log(gulpTask);
      this.log('=========================================');
      this.log('\n');
    }
  }
});
