# Mediacurrent D8 Theme Generator

> [Yeoman generator](http://yeoman.io/) for Drupal Themes - lets you quickly set up a Drupal 8 theme with sensible defaults and best practices.

**Looking for the [Drupal 7 version of this generator](https://bitbucket.org/mediacurrent/mis_theme_generator)?**

## What's New

**[Read the ⚡️ Changelog!](CHANGELOG.md)**

## Usage

While the mc-d8-theme generator can be run anywhere, it's happiest when it's run from an empty directory you'd like to become your theme.

I.E.
```
themes/custom/my_awesome_theme
```

### 1. Use [NVM](https://github.com/creationix/nvm) to install the latest stable version of NodeJS and create an `.nvmrc` file.

```bash
nvm install stable | grep -ohe 'v[0-9]*\.[0-9]*\.[0-9]*' | head -1 > .nvmrc && nvm use
```

### 2. Install `yo` and `generator-mc-d8-theme` globally:

(Because the `generator-mc-d8-theme` generator doesn't exist on NPM we install it from this repo.)

```bash
npm install -g yo git+ssh://git@bitbucket.org:mediacurrent/mis_theme_generator_8.git
```

### 3. Run `yo mc-d8-theme`:

```
yo mc-d8-theme
```

To see which generators and subgenerators you have, run `yo --help`.

### Update the generator as needed.

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
yo mc-d8-theme
```

### Component
Generates component boiler plate based on whatever name you pass it. Please delete whatever you don't need. If you haven't modified it, you don't need it.

Example:
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
yo mc-d8-theme:kss-style-guide 'Super Sweet Theme' 'super_sweet_theme'
```

Use `--help` to see all usage info.

Example:
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

After you've got the Gulp file modified to your hearts content, [shrinkwrap](https://docs.npmjs.com/cli/shrinkwrap) the dependencies so everyone uses the _exact_ same node modules.

```bash
npm shrinkwrap --save-dev
```

There's a post install script that runs `npm shrinkwrap --save-dev` so hopefully if someone adds a module and forgets to shrinkwrap it, it'll be added automatically.

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
git clone git@bitbucket.org:mediacurrent/mis_theme_generator_8.git
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