# Mediacurrent Theme Generator

> [Yeoman generator](http://yeoman.io/) for Drupal Themes - lets you quickly set up a Drupal 8 theme with sensible defaults and best practices.

- [What's New](#whats-new)
- [Using the Theme Generator](#using-the-theme-generator)
  - [Node Version Manager](#first-a-note-about-using-nodejs-via-nvm)
  - [Creating a new Theme](#creating-a-new-theme)
- [The New Theme](#the-new-theme)
  - [Drupal Module Dependencies](#drupal-module-dependencies)
  - [Support](#support)
  - [Starter Kit](#starter-kit)
  - [Component Generator](#component-generator)
  - [A Word About Commiting ./dist Files](#a-word-about-commiting-dist-files)
  - [Stuff You Might Want To Change](#stuff-you-might-want-to-change)
  - [Go Team](#go-team)
- [Links](#links)
- [Contributing](#contributing)

## What's New

**[Read the ⚡️ Changelog!](CHANGELOG.md)**

## Using the Theme Generator

While the theme generator can be run anywhere, it's happiest when it's run from an empty directory you'd like to become your theme.

* Create a new directory.  Example:
```
themes/custom/my_awesome_theme
```

### First a note about using Node.js via NVM

While not a requirement we like to use [NVM](https://github.com/creationix/nvm) to manage the version of Node per project. Here's a quick one liner that will install the latest stable version of Node using NVM and create a `.nvmrc` file.

* Move into the new directory you created above, then run the following command:

```bash
nvm install node && node -v > .nvmrc
```

From now on, when working on this theme change into its directory and run `nvm use` and NVM will switch to the specified version for you.

### Creating a new Theme

To run the theme generator type the command:
```
npm create yo mc-d8-theme
```

You should be taken through a series of questions that allow you to pick the best options for your theme.

**More info if you're interested in how this stuff works:**

`npm create` is an alias of `npm init` and uses [npx](https://medium.com/@maybekatz/introducing-npx-an-npm-package-runner-55f7d4bd282b) under the hood. Find out more about [npm init](https://docs.npmjs.com/cli/init.html).

## The New Theme

### Drupal Module Dependencies

This theme uses [Twig namespaces](https://symfony.com/doc/current/templates.html#templates-namespaces). In order for these to work in Drupal you must install the [components module](https://www.drupal.org/project/components).

### Support

The following is supported by your new theme.

* [Pattern Lab (Node)](https://github.com/pattern-lab/patternlab-node/)
* Component-Based Workflow
* ES6+ (With Source Maps)
* Sass
* Image Compression
* Live reloading
* Sass and JavaScript linting

### Starter Kit

The theme generator allows you to (optionally) add example components.

* Accordion
* Button
* Card 🌧
* Card List 🌧
* Carousel
* Eyebrow
* Heading
* Hero
* Media
* Drupal Messages (Based off of the Classy base theme) 🌧
* Drupal Tabs 🌧

🌧 = Preconfigured for the [Rain Install Profile](https://www.drupal.org/project/rain/).

These can include both component and Drupal templates that are added to the appropriate place during theme generation. Your theme.libraries.yml is also updated to include the relevant libraries.

This can also be run within a pre-existing theme using:
```
npx yo mc-d8-theme:starter-kit
```

### Component Generator

You can also generate a empty component with the right files in place using:

```
npm run generate
```

This is helpful if you are building out a new theme and would like to quickly create lots of new components with the libraries already wired up.

### A Word About Commiting ./dist Files

**TLDR:** Don't do it if you can avoid it.

Every time Pattern Lab is rebuilt the cache busting strings will change on CSS and JS files. `dependencyGraph.json` will also be updated every single time which makes reviewing pull requests rather difficult.

Optimally we want to gitignore all `/.dist` files and run `npm run build` as part of a continuous integration process.

### Stuff You Might Want To Change

#### Supported Browsers

Change what browsers your theme supports by updating *browserslist* within `package.json`. For options take a look at [browserslist](https://github.com/browserslist/browserslist).

This impacts CSS browser prefixes and JavaScript compiled files.

#### Dummy Files

* Swap out `screenshot.png` with your own theme image.
* Remove or replace the font files in `./src/patterns/global/fonts/`.
* Change the colors in `./src/patterns/global/colors/`.

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

## Links
* [`.stylelintrc.yml`](generators/app/templates/stylelintrc.yml)
* [`.eslintrc.json`](generators/app/templates/eslintrc.json)

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
