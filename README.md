# grunt-content [![NPM Version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][david-image]][david-url]

> Display informative and pretty content within a Grunt task.


## Getting Started
This plugin requires Grunt `>=0.4`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-content --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-content');
```


## The "content" task


### Overview
In your project's Gruntfile, add a section named `content` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  content: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
});
```


### Content Types

#### table
Type: `Array`,`Function`  
Default value: `null`  

Table content. An array or a function returning an array of [cli-table](https://github.com/LearnBoost/cli-table) data. Takes priority over `text`.

#### text
Type: `String`,`Function`  
Default value: `""`  

Text content. A string or a function returning a string.


### Options

#### options.clearBefore
Type: `Boolean`  
Default value: `false`  

Clear the console window of commands and any generated output before printing your content.

#### options.gruntLogHeader
Type: `Boolean`  
Default value: `false`  

Show the running task header or not.

#### options.newLineAfter
Type: `Boolean`  
Default value: `!options.gruntLogHeader`  

Add an extra line break after the content or not.

#### options.newLineBefore
Type: `Boolean`  
Default value: `!options.gruntLogHeader && !options.clearBefore`  

Add an extra line break before the content or not.

#### options.table
Type: `Object`  
Default value: `null`  

Options passed to [cli-table](https://github.com/LearnBoost/cli-table).


### Usage Examples

#### Simple Text
```js
grunt.initConfig({
  content: {
    text: "This is some simple content",
  },
});
```

#### Simple Table
```js
grunt.initConfig({
  content: {
    table: [
    	[ ["table cell"],["table cell"] ],
    	[ ["table cell"],["table cell"] ],
    ],
  },
});
```

#### Custom Options
```js
grunt.initConfig({
  content: {
    options: {
      clearBefore: true,
    },
    testing: {
      text: "This content appears on its own screen",
    }
    123: {
      options: {
        clearBefore: false,
        table: {
          colWidths: [72]
        },
      },
      table: [
        [ ["This content appears right below the previous"] ],
      ],
    },
  },
});
```

#### Dynamic Text
```js
grunt.initConfig({
  content: {
    text: function() {
      return "This content is dynamic:" + grunt.config("something");
    },
  },
});
```

#### Dynamic Table Rows
```js
grunt.initConfig({
  content: {
    table: [
      [ ["table cell"],["table cell"] ],
      function() {
        var newRows = [];
        for (var i=0; i<50; i++) {
          newRows.push([ ["table cell"],["table cell"] ]);
        }
        return newRows;
      },
    ],
  },
});
```


## Release History
* 1.0.1 supports grunt `1.x` and npm `3.x`
* 1.0.0 release
* 0.2.2 updated [cli-clear](https://github.com/stevenvachon/cli-clear)
* 0.2.1 fixed handling of dynamic data returning `undefined`
* 0.2.0 fixed dynamic tables, added tests
* 0.1.0 initial release


[npm-image]: https://img.shields.io/npm/v/grunt-content.svg
[npm-url]: https://npmjs.org/package/grunt-content
[travis-image]: https://img.shields.io/travis/stevenvachon/grunt-content.svg
[travis-url]: https://travis-ci.org/stevenvachon/grunt-content
[david-image]: https://img.shields.io/david/stevenvachon/grunt-content.svg
[david-url]: https://david-dm.org/stevenvachon/grunt-content
