# Imagemin plugin for Webpack

[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

This is a simple plugin that uses [Imagemin](https://github.com/imagemin/imagemin) to compress all images in your project.

## Install

`npm install imagemin-webpack-plugin`

Requires node >=4.0.0

## Example Usage
```js
var ImageminPlugin = require('imagemin-webpack-plugin').default
// Or if using ES2015:
// import ImageminPlugin from 'imagemin-webpack-plugin'

module.exports = {
  plugins: [
    // Make sure that the plugin is after any plugins that add images
    new ImageminPlugin({
      disable: process.env.NODE_ENV !== 'production', // Disable during development
      pngquant: {
        quality: '95-100'
      }
    })
  ]
}

```

## API

### new ImageminPlugin(options)

#### options.disable

**type**: `Boolean`  
**default**: `false`

When set to `true` it will disable the plugin entirely. This is useful for disabling the plugin during development, and only enabling it during production

#### options.test

**type**: `RegExp` or `String` or `Array`  
**default**: `/.*/`

This plugin will only run on files that match this test. This is similar to the webpack loader `test` option (but is not using the same implementation, so there might be major differences!). This can either be a RegExp object, or a [minimatch glob](https://github.com/isaacs/minimatch) (or an array of either or both).

This can allow you to only run the plugin on specific files, or even include the plugin multiple times for different sets of images and apply different imagemin settings to each.

Example:

```js
import ImageminPlugin from 'imagemin-webpack-plugin'

module.exports = {
  plugins: [
    // Use the default settings for everything in /images/*
    new ImageminPlugin({ test: 'images/**' }),
    // bump up the optimization level for all the files in my `bigpngs` directory
    new ImageminPlugin({
      test: 'bigpngs/**',
      optipng: {
        optimizationLevel: 9
      }
    })
  ]
}

```

#### options.maxConcurrency

**type**: `Number`  
**default**: the number of logical CPUS on the system

Sets the maximum number of instances of Imagemin that can run at once. Set to `Infinity` to run a seperate process per image all at the same time.

#### options.optipng

**type**: `Object` or `null`  
**default**: `{ optimizationLevel: 3 }`

Passes the given object to [`imagemin-optipng`](https://github.com/imagemin/imagemin-optipng). Set to `null` to disable optipng.

#### options.gifsicle

**type**: `Object` or `null`  
**default**: `{ optimizationLevel: 1 }`

Passes the given object to [`imagemin-gifsicle`](https://github.com/imagemin/imagemin-gifsicle). Set to `null` to disable gifsicle.

#### options.jpegtran

**type**: `Object` or `null`  
**default**: `{ progressive: false }`

Passes the given object to [`imagemin-jpegtran`](https://github.com/imagemin/imagemin-jpegtran). Set to `null` to disable jpegtran.

#### options.svgo

**type**: `Object` or `null`  
**default**: `{}`

Passes the given object to [`imagemin-optipng`](https://github.com/imagemin/imagemin-svgo). Set to `null` to disable svgo.

#### options.pngquant

**type**: `Object` or `null`  
**default**: `null`

Passes the given object to [`imagemin-pngquant`](https://github.com/imagemin/imagemin-pngquant). Disabled by default.

#### options.plugins

**type**: `Array`
**default**: `[]`

Include any additional plugins that you want to work with imagemin here. By default the above are included, but if you want (or need to) you can disable them (by setting them to `null`) and include them yourself here.

A list of possible imagemin plugins can be found [here](https://www.npmjs.com/browse/keyword/imageminplugin).

Example:

```js
import ImageminPlugin from 'imagemin-webpack-plugin'
import imageminMozjpeg from 'imagemin-mozjpeg'

module.exports = {
  plugins: [
    new ImageminPlugin({
      plugins: [
        imageminMozjpeg({
          quality: 100,
          progressive: true
        })
      ]
    })
  ]
}

```

## FAQ

**Why?**  
I was suprised that there weren't any Imagemin plugins for webpack, so I made one!

**Why not use [`image-webpack-loader`](https://github.com/tcoopman/image-webpack-loader)?**  
Because I had other things like the [`favicons-webpack-plugin`](https://github.com/jantimon/favicons-webpack-plugin) and [`responsive-loader`](https://github.com/herrstucki/responsive-loader) that were generating images that I couldn't have `image-webpack-loader` optimize. This plugin will optimize ANY images regardless of how they were added to webpack. Plus `image-webpack-loader` is currently using an older version of imagemin.

**Can you add this new feature?**  
Maybe... I'm trying to keep this a small single-purpose plugin, but if you want a feature feel free to open an issue and I'll take a look.

## Inspiration

* Big thanks to [`image-webpack-loader`](https://github.com/tcoopman/image-webpack-loader) for the idea.
* Used [`compression-webpack-plugin`](https://github.com/webpack/compression-webpack-plugin) to learn how to write the plugin. It's source code is a better tutorial on how to write plugins than the webpack documentation is...

## Contributing

The code is written in ES6 using [Javascript Standard Style](https://github.com/feross/standard). Feel free to make PRs adding features you want, but please try to follow Standard. Also, codumentation/readme PRs are more then welcome!

## License

[MIT](LICENSE.md) Copyright (c) [Gregory Benner](https://github.com/Klathmon)
