# Changelog

## 1.2.0 (2016-11-23)

🐊 If this release had a name it'd be "Danger Zone". We've greatly refactored the Gulp file, updated all node modules and done a _ton_ of other stuff. We've even added a new Drupal JS behavior generator. Read on for more deets.

### New Feature
* Updated ESLint config for 'use strict' and switch statements.
* **Added sample breakpoints.yml theme file.** Thanks Jason!
    * https://bitbucket.org/mediacurrent/mis_theme_generator_8/issues/2/add-example-themenamebreakpointsyml-file
* Updated node modules to latest versions.
* Added Babel config file. Also added a babel plugin that removes global strict mode from compiled js files.
* **Broke apart Gulp file to individual tasks.** Now Gulp tasks can be found in ... `./gulp-tasks`. They're standard NodeJS modules required into the main `gulpfile.js`. This was done because the gulpfile was getting looooooooong.
    * https://bitbucket.org/mediacurrent/mis_theme_generator_8/issues/4/refactor-gulp-file
* **Updated KSS builder (theme) to add in a way to disable the sidebar and remove container padding.** Now you can click a button and kill the sidebar and all padding. It also appends a key + value pair to the URL so you don't have to do it every time you refresh the page.
* Moved all base styles into one file `_base.scss`. Since the base styles weren't touched very much, we think moving them into one file helps with maintainability.
* **Added a new subgenerator that creates Drupal JS Behaviors.** We got tired of searching through old themes for the JS behavior boilerplate. **ES6 / ES2015 ready!**

### Bug Fix
* Fixed broken path to Singularity and Breakpoint node modules. Thanks Mario! No idea _how_ this worked originally.
    * https://bitbucket.org/mediacurrent/mis_theme_generator_8/issues/3/incorrect-path-to-singularitygs-and
* Removed theme name suggestion as it's a little out of date. Seems silly to have to write "theme" AGAIN within a preprocess function.
* Removed option to _not_ have a base theme as Drupal _will_ use one even if you don't specify it. Setting it to something keeps our theme from being broke in the future if Drupal ever changes which theme is the "used by default" one.
* Removed npm shrinkwrap post install command as it can move depenencies around the shrinkwrap file. This causes issues with continuous integration deployment.
* Updated gitignore to ignore all .map files. Previously it was only ignoring css files and js files could sneak by.

### Documentation
* Updated generator readme with details on how to use the new JS Behavior subgenerator.

## 1.1.0 (2016-07-26)

This update is mainly moving source files into a `src` directory. The main theme files that Drupal needs are left in the top level theme folder. If you try to move them, stuff breaks.

### New Feature
* Added editor config file. http://editorconfig.org/
* Moved source files into a new `/src` directory.

### Documentation
* Added a new CHANGELOG.md! YAY!
