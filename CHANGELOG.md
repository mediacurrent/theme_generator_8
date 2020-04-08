# Changelog

## 😷 2.3.0 (2020-04-08)

### Bug Fix
* Bumps project dependencies.
* Fixes PHP Codesniffer violations for PHP files used by Pattern Lab Node.

### New Feature
* Now watch command triggers on changes to SVGs. Thanks Tim for the [issue](https://github.com/mediacurrent/theme_generator_8/issues/53).
* Backed out the automated composer install for SlickJS if someone selected the carousel as a starter component. This caused more problems than it was worth. We now tell folks how to install it vs trying to do it for them.
* Updated ESlint config so max-len doesn't flag urls, strings, regex and template literals. Woooooo.
* Added additional flexibility to the start kit "heading" component so it can accept any element not just headings. Sometimes you don't need a `<h2>` and you really need a `<p>`.
* Added Drupal templates and integration for the Card and Card-List components.

### Documentation
* Updated the `README.md` to note which Starter Kit components are preconfigured to work with the Drupal [Rain Install Profile](https://www.drupal.org/project/rain/).

## ☕️ 2.2.1 (2020-03-03)

### Bug Fix
* Fixed StyleLint errors. Thanks Tim!
* Fixed an issue where a starter kit component was misnamed.
* Starter Kit components fail more gracefully for projects that don't use composer.

## ☕️ 2.2.0 (2020-01-22)

### Bug Fix
* Fixed a bug with ESlint not being able to tell the difference between node (gulp) and Drupal JS files. This would throw the wrong 'use strict' error.

### New Feature
* Moved from Sass Lint to StyleLint. **Thanks for all your hard work on this Tim!**
* Added a new component subgenerator that can be run as a normal build script `npm run generate`.
* Added more start-kit components and modified them so they can be easily added to an existing Drupal theme. **Thanks for your help with this too Tim!**
* Added a default `field.html.twig` template that's got less markup in it so that we start new themes in a cleaner state.
* Added Prettier support for theme JS files.

### Documentation
* Updated the `README.md` with examples of how to use the new component generator and starter-kit.

## ⚔️ 2.1.0 (2019-11-04)

### Bug Fix
* Removed patches used by Pattern Lab since the latest release merges in those fixes.
* Updated readme ESlintrc file link to point to new `.json` file.
* Updated theme build tool dependencies.

### New Feature
* Added in support for using the `|clean_id` filter in Pattern Lab the same way you can in Drupal Twig.
* Migrated eslintrc file from yaml to json.

## 🏍 2.0.1 (2019-09-27)

### Bug Fix
* Repatched @pattern-lab+engine-twig-php so includes work correctly.

## 🏍 2.0.0 (2019-09-13)

### New Feature
* Switched from KSS to Pattern Lab.
* Added optional example components (Drupal Tabs, Drupal Messages and buttons).
* Added optional `.gitignore` for compiled files.
* Added concat task for JS files so you don't have to manually add them to the style guide.
* Upgraded Gulp to v4.
* Added an easier way to display color swatches.
* Updated base / Global CSS.
* Removed breakpoint / singularity options.
* Added example breakpoint mixin that provides similar functionality.
* Added an example of how to use `@font-face` and locally hosted fonts.
* Added prettier config.
* Likely more stuff I forgot about.

### Documentation
* Updated `README.md` with information about Pattern Lab and advice on starting a new project using the generator.

## 🕷 1.4.0 (2017-09-01)

### Bug Fix
* Back in **1.3.3** I fixed the layout folder but didn't quite get it in the right spot. This is now fixed.

### New Feature
* Updated Babel to use [env](https://github.com/babel/babel-preset-env) instead of a preset. This means you can simplify browser support a bit by adding browsers needed to the project's `package.json`.
* Moved Autoprefixer config to the `package.json` file similar to Babel env. This sets us up for when both Babel env and Autoprefixer use the same config.
* Added in error handling for JS and SCSS compiling. Now the watch task won't fail completely but will show you the error and keep watching files. This is a feature right?

### Documentation
* Add best practice about using the generator via [npx](https://www.npmjs.com/package/npx).
* Added theme documentation that points out Autoprefixer and Babel project config.

## 👾 1.3.4 (2017-07-12)

### Bug Fix
* Added a default description that's basically a reminder to update the theme description later. Thanks to Kevin for finding that Drupal chokes if there's no description provided.

  **Thanks Kevin** for the [issue](https://github.com/mediacurrent/theme_generator_8/issues/11)!
* Updated eslint to the new format. (Added a `.yml` extension.) Also fixed an issue where eslint will check the parent directories looking for a config file. This meant it could find other eslint config files and try to use those too.

  [issue](https://github.com/mediacurrent/theme_generator_8/issues/9)
* Fixed macro namespace for icon macro. This made it p much broken out of the box.

  **Thanks Tim and Eric** for the [issue](https://github.com/mediacurrent/theme_generator_8/issues/7)!
* Fixed issue with npm shrinkwrapping before all dev dependencies are installed.
* Added `drupal.init.js` to KSS builder template.

  **Thanks Eric** for the [issue](https://github.com/mediacurrent/theme_generator_8/issues/10)!
* Updated all build tool dev dependencies to the latest version.

## 🎈1.3.3 (2017-04-07)

### Bug Fix
* Added a `.gitkeep` to the layout folder. If the theme was created and checked into the repo _without_ anything being added to the layout dir... errors my friend. Errors.

  **Thanks Tim** for the [issue](https://github.com/mediacurrent/theme_generator_8/issues/4)!
* Added in default breakpoints in `*.breakpoints.yml`. Having this file contain only comments was bugging out some environments.

  **Thanks Carie** for the [issue](https://github.com/mediacurrent/theme_generator_8/issues/2)!

## 1.3.2 (2017-03-15)

### New Feature
* Updated version of Node / npm used with project. The old version was keeping the readme from showing up on [https://www.npmjs.com/package/generator-mc-d8-theme](npm).

## ✈️ 1.3.1 (2017-02-14)

### New Feature
* Moved the project from Bitbucket to Github and NPM.

### Documentation
* Updated README to reflect new install instructions.

## 🔧 1.3.0 (2016-12-28)

### New Feature
* Added a warning at the end of the theme generation to remind you to delete any unused code. If you don't need it, delete it! ☠️
* Added a concat task if KSS node is used. **Thanks Tobias and Mario!** This should allow you to not worry about adding a new CSS file for every new component within the style guide. Everything should work by default. Note that the generated `all.css` file may need some modification if CSS files are being concatenated in the wrong order. I've provided an example of how to do that within the concat.js gulp task. Also, **Don't** use the `all.css` file for production **only the style guide.** Leverage [Drupal's Libraries](https://www.drupal.org/docs/8/theming-drupal-8/adding-stylesheets-css-and-javascript-js-to-a-drupal-8-theme) to add CSS / JS files as needed.
    * https://bitbucket.org/mediacurrent/mis_theme_generator_8/issues/7/add-the-ability-to-concat-css-for-the
    * https://bitbucket.org/mediacurrent/mis_theme_generator_8/issues/8/dynamically-add-reference-to-allcss-to

### Bug Fix
* Removed duplicate style guide task include within the gulp file. This caused breakage if you didn't select the KSS option.

### Documentation
* Added link to CHANGELOG.md from the main README.

## 1.2.1 (2016-11-27)

### Bug Fix
* Fixed broken path / twig name space for the components module. Thanks Mario!
    * https://bitbucket.org/mediacurrent/mis_theme_generator_8/issues/6/path-to-components-is-incorrect-in-theme

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
