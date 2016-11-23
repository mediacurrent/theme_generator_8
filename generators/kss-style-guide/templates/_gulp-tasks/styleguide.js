/*eslint strict: ["error", "global"]*/
'use strict';

//=======================================================
// Include kss
//=======================================================
var kss = require('kss');

//=======================================================
// Include Our Plugins
//=======================================================
var path = require('path');

// Export our tasks.
module.exports = {

  // Generate the style guide using the top level
  // directory name passed in as a parameter.
  generate: function(dirname) {

    return kss({
      source: [
        dirname + '/src/global',
        dirname + '/src/components',
        dirname + '/src/layout'
      ],
      destination: dirname + '/dist/style-guide',
      builder: dirname + '/src/style-guide/builder',
      namespace: '<%= themeName %>:' + dirname + '/src/components/',
      'extend-drupal8': true,
      // The css and js paths are URLs, like '/misc/jquery.js'.
      // The following paths are relative to the generated style guide.
      css: [
        path.relative(
          dirname + '/style-guide/',
          dirname + '/css/global.css'
        )
      ],
      js: [
      ],
      homepage: 'style-guide.md',
      title: 'Style Guide'
    });
  }
};
