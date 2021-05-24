# Mediacurrent Theme Generator

The Theme Generator is a scafolding tool built by your friends at [Mediacurrent](https://mediacurrent.com/), which lets you quickly set up a Drupal 8 or 9 theme with sensible defaults and best practices.

- [What's New - Read the Changelog](CHANGELOG.md)
- [Using the Theme Generator](#using-the-theme-generator)
- [Creating a new Drupal Theme](#creating-a-new-drupal-theme)
  - [Setup NodeJS & NPM](#setup-nodejs-and-npm)
  - [Create the theme](#create-the-theme)
- [Note about Drupal 8](#note-about-drupal-8)
- [About the New Theme](#the-new-theme)
  - [Drupal Module Dependencies](#drupal-module-dependencies)
  - [Support](#support)
  - [Starter Kit](#starter-kit)
  - [Component Generator](#component-generator)
  - [A Word About Commiting ./dist Files](#a-word-about-commiting-dist-files)
  - [Stuff You Might Want To Change](#stuff-you-might-want-to-change)
  - [Go Team](#go-team)
- [Links](#links)
- [Contributing](#contributing)

## Using the Theme Generator

While the theme generator can be run anywhere, it's happiest when it's run from an empty directory you'd like to become your theme.

While not a requirement we like to use [NVM](https://github.com/creationix/nvm) to manage the version of Node per project.

## Creating a new Drupal theme

1. Create a new directory.  Example:

    ```bash
    themes/custom/my_awesome_theme
    ```

### Setup NodeJS & NPM

1. Move into the new directory and install Node:

    ```bash
    cd my_awesome_theme
    ```

    ```bash
    nvm install 14.16.1 && node -v > .nvmrc
    ```

    - This will install version NodeJS `v14.16.1`.

    - It will create `.nvmrc` in the root of your project.

1. Theme Generator is compatible with npm v6.

    ```bash
    npm install -g npm@6.14.12
    ```

    From now on, when working on this theme change into its directory and run `nvm use` and NVM will switch to the specified version for you.

### Create the theme

1. Run the generator (**Do not change this command**):

    ```bash
    npm create yo mc-d8-theme
    ```

    - You should be taken through a series of questions that allow you to pick the best options for your theme.

**IMPORTANT**: Your theme's machine name should always match the directory name you created above.

More info if you're interested in how this stuff works:

`npm create` is an alias of `npm init` and uses [npx](https://medium.com/@maybekatz/introducing-npx-an-npm-package-runner-55f7d4bd282b) under the hood. Find out more about [npm init](https://docs.npmjs.com/cli/init.html).

## Note about Drupal 8

If you are building a Drupal 8 theme, make the following updates after your theme has been created:

- Update Pattern Lab to v5.14.0 by updating `package.json` as follows:

    ```json
    "@pattern-lab/core": "5.14.0",
    "@pattern-lab/engine-twig-php": "5.14.0",
    "@pattern-lab/uikit-workshop": "5.14.0",
    ```

- Remove `node_modules`

` Run `npm install`

## About the New Theme

### Drupal Module Dependencies

This theme uses [Twig namespaces](https://symfony.com/doc/current/templates.html#templates-namespaces). In order for these to work in Drupal you must install the [Components Library](https://www.drupal.org/project/components) module.

### Support

The following is supported by your new theme.

- [Pattern Lab (Node)](https://github.com/pattern-lab/patternlab-node/)
- Component-Based Workflow
- ES6+ (With Source Maps)
- Sass
- Image Compression
- Live reloading
- Sass and JavaScript linting

### Starter Kit

The theme generator allows you to (optionally) add example components.

- Accordion
- Button
- Card 🌧
- Card List 🌧
- Carousel
- Eyebrow
- Heading
- Hero
- Media
- Drupal Messages (Based off of the Classy base theme) 🌧
- Drupal Tabs 🌧

🌧 = Preconfigured for the [Rain Install Profile](https://www.drupal.org/project/rain/).

These can include both component and Drupal templates that are added to the appropriate place during theme generation. Your theme.libraries.yml is also updated to include the relevant libraries.

This can also be run within a pre-existing theme using:

```bash
npx yo mc-d8-theme:starter-kit
```

## Crate new Components

You can also generate base components with the right files in place using:

```bash
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

#### Demo Files

- Swap out `screenshot.png` with your own theme image.
- Remove or replace the font files in `./src/patterns/global/fonts/`.
- Change the colors in `./src/patterns/global/colors/`.

### Go Team

Provided by default are seven npm scripts that point to Gulp tasks. We run gulp through npm scripts.

1. Run the default build task (gulp in this instance) and everything in it.
  This is the equivalent to running `gulp` on the command line with Gulp installed globally.

    ```bash
    npm run build
    ```

1. Compile Sass and JS.

    ```bash
    npm run compile
    ```

1. Watch files and run tasks when they change.

    ```bash
    npm run watch
    ```

1. Compress png and svg assets.

    ```bash
    npm run compress
    ```

1. Build Pattern Lab.

    ```bash
    npm run styleguide
    ```

1. Lint Sass and JS files.

    ```bash
    npm run lint
    ```

1. Delete compiled Sass, JS and style guide files from the /dist directory.

    ```bash
    npm run clean
    ```

## Links

- [`.stylelintrc.yml`](generators/app/templates/stylelintrc.yml)
- [`.eslintrc.json`](generators/app/templates/eslintrc.json)

## Contributing

Would you like to contribute? Want to make a few changes or fix a bug? COME ON OVER!

### Clone down this repo

```bash
git clone git@github.com:mediacurrent/theme_generator_8.git
```

```bash
cd theme_generator_8
```

Remove `generator-mc-d8-theme` if you have previously installed it:

_Tip: use `npm ls -g -depth=0` to see what global node modules are installed._

```bash
npm uninstall generator-mc-d8-theme -g
```

Use the node version of the generator

```bash
nvm install

nvm use
```

Install the generator's dependencies

```bash
npm install
```

[Link](https://docs.npmjs.com/cli/link) your local generator files to npm:

```bash
npm link
```

Now whenever you run `yo mc-d8-theme` it'll use your locally cloned mc-d8-theme generator. Any updates done to the generator can be tested in real time.

Break off a feature branch dive right in. After you've got something you'd like to add, push back to the repo and pull request against develop.

### IMPORTANT

To test the changes you've made locally, ensure your new theme uses the same version of node as the generator.
