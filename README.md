# Mediacurrent D8 Theme Generator

> [Yeoman generator](http://yeoman.io/) for Drupal Themes - lets you quickly set up a Drupal 8 theme with sensible defaults and best practices.

## What's New

**[Read the ⚡️ Changelog!](CHANGELOG.md)**

## Links
* [`.sass-lint.yml`](generators/app/templates/sass-lint.yml)
* [`.eslintrc.yml`](generators/app/templates/eslintrc.yml)

## Usage

While the mc-d8-theme generator can be run anywhere, it's happiest when it's run from an empty directory you'd like to become your theme.

I.E.
```
themes/custom/my_awesome_theme
```

### First a note about using Node.js via [NVM](https://github.com/creationix/nvm)

While not a requirement we like to use [NVM](https://github.com/creationix/nvm) to manage the version of Node per project. Here's a quick one liner that will install the latest stable version of Node using NVM and create a `.nvmrc` file.

```bash
nvm install node && node -v > .nvmrc
```

From now on, when working on this theme change into its directory and run `nvm use` and NVM will switch to the specified version for you.

### Getting Started

#### Use [npm create](https://www.npmjs.com/package/npx)

To run the theme generator type the command:
```
npm create yo mc-d8-theme
```

You should be taken through a series of questions that allow you to pick the best options for your theme.

**This is the recommended way of running the theme generator.**

`npm create` is an alias of `npm init` and uses [npx](https://medium.com/@maybekatz/introducing-npx-an-npm-package-runner-55f7d4bd282b) under the hood. Find out more about [npm init](https://docs.npmjs.com/cli/init.html)

## The New Theme

### Support

The following is supported by your new theme. Feel free to make any modifications to the build tools.

* ES6+
* Sass
* [Pattern Lab (Node)](https://github.com/pattern-lab/patternlab-node/)
* Source Maps
* Image Compression
* Live reloading
* Sass and JavaScript linting

### Patches

### A Word About Commiting ./dist Files

Don't do it if you don't have to.

### Stuff You Might Want To Change

#### Supported Browsers

Change what browsers your theme supports by updating *browserslist* within `package.json`. For options take a look at [browserslist](https://github.com/browserslist/browserslist);

This impacts browser prefixes and JavaScript compiled files.

#### Dummy Files

* Swap out `screenshot.png` with your own theme image.
* Remove or replace the font files in `./src/patterns/global/fonts/`.

### Go Team

Provided by default are seven npm scripts that point to Gulp tasks. We run gulp through npm scripts so the build tools can change without the user ever knowing.

1. Run the default build task (gulp in this instance) and everything in it.
  This is the equivalent to running `gulp` on the command line with Gulp installed globally.
  ```
  npm run build
  ```

2. Compile Sass and JS.
  ```
  npm run compile
  ```

3. Watch files and run tasks when they change.
  ```
  npm run watch
  ```

4. Compress png and svg assets.
  ```
  npm run compress
  ```

5. Build Pattern Lab.
  ```
  npm run styleguide
  ```

6. Lint Sass and JS files.
  ```
  npm run lint
  ```

7. Delete compiled Sass, JS and style guide files from the /dist directory.
  ```
  npm run clean
  ```

## Contributing
Would you like to contribute? Want to make a few changes or fix a bug? COME ON OVER!

Clone down this repo:
```
git clone git@github.com:mediacurrent/theme_generator_8.git
```

Remove `generator-mc-d8-theme` if you have previously installed it:

_Tip: use `npm ls -g -depth=0` to see what global node modules are installed._

```
npm uninstall generator-mc-d8-theme -g
```

From the generator root directory [link](https://docs.npmjs.com/cli/link) your local generator files to npm:

```
npm link
```

Now whenever you run `yo mc-d8-theme` it'll use your locally cloned mc-d8-theme generator. Any updates done to the generator can be tested in real time.

Break off a feature branch dive right in. After you've got something you'd like to add, push back to the repo and pull request against develop.
