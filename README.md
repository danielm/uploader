# jQuery Ajax File Uploader Widget
A jQuery plugin for file uploading using ajax(a sync); includes support for queues, progress tracking and drag and drop.

Very ***configurable*** and easy to adapt to any ***Frontend*** design, and very easy to work along side any backend logic.

The focus will be ***modern browsers***, but also providing a method to know when the plugin is not supported. The idea is to keep it simple and ***lightweight***, no need to add hacky code to add unnecessary features for the web we have nowadays.

Basic Javascript knowledge is necesary to setup this plugin: how to set parameters, callbacks, etc.

- Lightweight: ~8.00 KB 
- Dependencies: just jQuery!
- License: Released under the [MIT license](LICENSE.txt)

[![Build Status](https://travis-ci.org/danielm/uploader.png)](https://travis-ci.org/danielm/uploader) 

## Live DEMO
Check a live Demo here: https://danielmg.org/demo/java-script/uploader

## Table of contents

  * [Installation](#installation)
  * [Migration from v0.x.x](#migration-from-v0xx)
  * [Usage](#usage)
    * [Markup](#example-markup)
    * [Initialization](#initialization)
    * [Work flow (using the callbacks)](#work-flow-using-the-callbacks)
  * [Options](#options)
  * [Callacks](#callbacks)

## Installation

### NPM
```bash
npm install dm-uploader --save
```

### Bower
```bash
bower install dm-uploader --save
```

### Zip package
Zipped stable release can be downloaded from [Github Release Page](https://github.com/danielm/uploader/releases)

### Git
```bash
git clone https://github.com/danielm/uploader.git
```

## Migration from v0.x.x
1.x.x got a lot of changes and new features, if you are a previous version user read [CHANGELOG.md](CHANGELOG.md), there you can find the specific details of what was changed or removed.

## Usage
As shown in the demos there are many ways to use the plugin, but the basic concepts are:
- Initialize the plugin on any HTML element such as: <code>`<div />`</code> to provide a Drag and drop area.
- All <code>`<input type="file"/>`</code> inside the main area element will be bound too.
- Optionally you can bind it directly to the <code>`<input />`</code>
- Drag and drop is optional, you could build a widget to customize the regular file-upload element (check demos for this)

### Example Markup
This is the simple html markup. The file input is optional but it provides an alternative way to select files for the user(check the online demo to se how to hide/style it)
```html
<div id="drop-area">
  <h3>Drag and Drop Files Here<h3/>
  <input type="file" title="Click to add Files">
</div>
```

### Initialization
```javascript
$("#drop-area").dmUploader({
  url: '/path/to/backend/upload.asp',
  //... More settings here...
  
  onInit: function(){
    console.log('Callback: Plugin initialized');
  }
  
  // ... More callbacks
});
```
Down below there is a detailed list of all available [Options](#options) and [Callbacks](#callbacks).

Additionally, after initialization you can use any of the available [Methods](#methods) to interact with the plugin.

### Work Flow (using the callbacks)
...

## Options
..

## Callbacks
..

## Methods
..
