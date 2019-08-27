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

There are **two ways** to install and use the theme generator:

#### 1. Use [npx](https://www.npmjs.com/package/npx)

**This is the recommended way of running the theme generator.**

If you're using `npm@5.2.0` or newer you already have [npx](https://medium.com/@maybekatz/introducing-npx-an-npm-package-runner-55f7d4bd282b) available on the command line.

npx allows you to run one off commands using the latest version of a package without installing it globally.

```bash
npm create yo mc-d8-theme
```

Tools like this you only run once every so often. By the time you need to run it again it'll be so far out of date you'll have to update it.

#### 2. Install `yo` and `generator-mc-d8-theme` globally:

**This is NOT the recommended way of running the theme generator.**

If you're using an older version of npm or just want to install it globally:

```bash
npm install -g yo generator-mc-d8-theme
```

**Run `yo mc-d8-theme`:**

```
yo mc-d8-theme
```

To see which generators and subgenerators you have, run `yo --help`.

**Update the generator as needed.**

```
npm update -g generator-mc-d8-theme
```

## Generators

The `mc-d8-theme` generator makes use of several subgenerators. Each of these can be called individually.

Available generators:

* [mc-d8-theme](#markdown-header-app) (aka [mc-d8-theme:app](#markdown-header-app), the main app)
* [mc-d8-theme:component](#markdown-header-component)
* [mc-d8-theme:js-behavior](#markdown-header-js-behavior)
* [mc-d8-theme:kss-style-guide](#markdown-header-kss-style-guide)

### App

**Main generator**

Sets up a new theme, generating all the boilerplate you need to get started. The app generator also adds normalize and sample components.

Example:

```bash
npx -p yo -p generator-mc-d8-theme -c 'yo mc-d8-theme'
```

Or:

```bash
yo mc-d8-theme
```

### Component
Generates component boiler plate based on whatever name you pass it. Please delete whatever you don't need. If you haven't modified it, you don't need it.

Example:

```bash
npx -p yo -p generator-mc-d8-theme -c 'yo mc-d8-theme:component "Site Logo"'
```

Or:

```bash
yo mc-d8-theme:component 'Site Logo'
```

This would generate the following files:

- components/site-logo/site-logo.scss
- components/site-logo/site-logo.json
- components/site-logo/site-logo.twig

### JS Behavior
Generates a Drupal JS behavior based on whatever component file name you pass it.

Example:

```bash
npx -p yo -p generator-mc-d8-theme -c 'yo mc-d8-theme:js-behavior "site-logo"'
```

Or:

```bash
yo mc-d8-theme:js-behavior 'site-logo'
```

By default this will put the new behavior in the components directory. For example if
the component name you passed it was `site-logo`, it will generate a new behavior within:
`src/components/site-logo/site-logo.es6.js`.

The generated file is ES6 / ES2015 ready and can be compiled by the provided build tools.

### KSS Style Guide
Generates a KSS Node style guide. You must pass it a name and a machine name for the theme if run independently of the main app. If run by itself this subgenerator has no way to modify your existing `gulpfile.js` Instead it will provide code you can copy and paste into your `gulpfile.js` for it to work correctly.

Example:

```bash
npx -p yo -p generator-mc-d8-theme -c 'yo mc-d8-theme:kss-style-guide "Super Sweet Theme" "super_sweet_theme"'
```

Or:

```bash
yo mc-d8-theme:kss-style-guide 'Super Sweet Theme' 'super_sweet_theme'
```

Use `--help` to see all usage info.

Example:

```bash
npx -p yo -p generator-mc-d8-theme -c 'yo mc-d8-theme:kss-style-guide --help'
```

Or:

```bash
yo mc-d8-theme:kss-style-guide --help
```

## The New Theme

### Sass & Gulp
Currently your new theme uses [libSass](http://sass-lang.com/libsass) and [Gulp](http://gulpjs.com/). While you can add whichever Gulp plugins you'd like, by default only the basics are provided.

* Gulp Sass
* Gulp Autoprefixer
* Browser Sync
* Source Maps
* Gulp Sass lint
* Gulp Eslint
* Gulp Babel
* Gulp imagemin

If you're not using `npm@5.0.0` or later (which generates a lockfile `package-lock.json`) consider using [shrinkwrap](https://docs.npmjs.com/cli/shrinkwrap).

After you've got the Gulp file modified to your hearts content, [shrinkwrap](https://docs.npmjs.com/cli/shrinkwrap) the dependencies so everyone uses the _exact_ same node modules.

```bash
npm shrinkwrap --save-dev
```

Now running `npm install` will download the node modules specified in the npm-shrinkwrap.json file.

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

5. Build the KSS Style guide.
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

Break off a feature branch dive right in. After you've got something you'd like to add, push back to the repo and pull request against master.
