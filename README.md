# jQuery Ajax File Uploader Widget
A jQuery plugin for file uploading using ajax(a sync); includes support for queues, progress tracking and drag and drop.

Very ***configurable*** and easy to adapt to any ***Frontend*** design, and very easy to work along side any backend logic.

The focus will be ***modern browsers***, but also providing a method to know when the plugin is not supported. The idea is to keep it simple and ***lightweight***.

Basic Javascript knowledge is necessary to setup this plugin: how to set settings, callback events, etc.

- Lightweight: ~8.00 KB 
- Dependencies: just jQuery!
- License: Released under the [MIT license](LICENSE.txt)

[![Build Status](https://travis-ci.org/danielm/uploader.png)](https://travis-ci.org/danielm/uploader) 
[![npm version](https://badge.fury.io/js/dm-uploader.svg)](http://badge.fury.io/js/dm-uploader)
[![Bower version](https://badge.fury.io/bo/dm-uploader.svg)](http://badge.fury.io/bo/dm-uploader)

## Live DEMOS
Check the live Demos here: https://danielmg.org/demo/java-script/uploader

## Table of contents

  * [Installation](#installation)
  * [Migration from v0.x.x](#migration-from-v0xx)
  * [Usage](#usage)
    * [Markup](#example-markup)
    * [Initialization](#initialization)
  * [Options](#options)
  * [Callbacks](#callbacks)
  * [Methods](#methods)

## Installation

### NPM
```bash
npm install dm-file-uploader --save
```

### Bower
```bash
bower install dm-file-uploader --save
```

### Download tarball
You can download the latest release tarball directly from [releases](https://github.com/danielm/uploader/releases)

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

### Example Markup
This is the simple html markup. The file input is optional but it provides an alternative way to select files for the user(check the online demo to se how to hide/style it)
```html
<div id="drop-area">
  <h3>Drag and Drop Files Here<h3/>
  <input type="file" title="Click to add Files">
</div>
```

### Initialization
```html
   <script src="/path/to/jquery.dm-uploader.min.js"></script>
```

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

## Options
 * **queue**: (boolean) ``Default true`` Files will upload one by one.
 
 * **auto**: (boolean) ``Default true`` Files will start uploading right after they are added.
   If using the ``queue`` system this option means the ``queue`` will start automatically after the first file is added.

   Setting this to `false` will require you to manually start the uploads using the API [Methods](#methods).

 * **dnd**: (boolean) ``Default true`` Enables Drag and Drop.

 * **hookDocument**: (boolean) ``Default true`` Disables dropping files on $(document).

   **This is necessary** to prevent the Browser from redirecting when dropping files.

   The only reason why you may want to disable it is when using multiple instances of the plugin. If that's the case you only need to use it **once**.

 * **multiple**: (boolean) ``Default true`` Allows the user to select or drop multiple files at the same time.

 * **url**: (string) ``Default document.URL`` Server URL to handle file uploads (backend logic).

 * **method**: (string) ``Default POST`` HTTP method used by the upload request.

 * **extraData**: (object/function) Collection of parameters to add in the upload request.

   ```javascript
   // Example
   extraData: {
      "galleryid": 666
   }
   ```

   If you need a dynamic value this can be set as a `function`. Also, if this function returns `false` nothing will be added.

   ```javascript
   // Example
   extraData: function() {
      return {
        "galleryid": $('#gallery').val()
      };
   }
   ```

 * **headers**: (object) Collection of headers to send in the upload request.

   ```javascript
   // Example
   headers: {
      'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
   }
   ```

 * **dataType**: (string) ``Default null`` Response type of the upload request.

   Default is `null` which means jQuery will try to 'guess' depending of what the server returns.

   Other values can be: `xml`, `json`, `script`, `html` or `text`

   Reference: http://api.jquery.com/jquery.ajax/

 * **fieldName**: (string) ``Default 'file'`` Field name in the upload request where we 'attach' the file.

   ```php
   // For example in PHP if using the default value you can access the file by using:
   var_dump($_FILES['file']);
   // 'file' correspond to the value of this option.
   ```

 * **maxFileSize**: (integer) ``Default 0`` File validation: Max file size in bytes. Zero means no limit.

   ```javascript
   maxFileSize: 3000000 // 3 Megs
   ```

 * **allowedTypes**: (string) ``Default "*"`` File validation: Regular expression to match file mime-type.

   ```javascript
   allowedTypes: "image/*"
   ```

 * **extFilter**: (array) ``Default null`` File validation: Array of allowed extensions.

   ```javascript
   extFilter: ["jpg", "jpeg", "png", "gif"]
   ```

## Callbacks

### General purpose

 * **onInit**: () Widget it's ready to use.

 * **onFallbackMode**: () Triggers only when the browser is not supported by the plugin.

 * **onDragEnter**: () User is dragging files over the drop Area.

 * **onDragLeave**: () User left the drop Area.

   This also triggers when the files are dropped.

 * **onDocumentDragEnter**: () User is dragging files anywhere over the $(document)

 * **onDocumentDragLeave**: () User left the $(document) area.

   This also triggers when the files are dropped.

 * **onComplete**: () All pending files are completed. 

   Only applies when using `queue: true`. See [options](#options).

   Triggers when the queue reaches the end (even if some files were cancelled or gave any error).

### File callbacks
 All these include `id`

 `id` (string): Unique ID. Useful to identify the same file in subsequent callbacks.

 * **onNewFile**: (id, file) A new file was selected or dropped by the user.

   - `file` (object): File object, use it to access file details such as name, size, etc.

     For [reference click here](https://developer.mozilla.org/en-US/docs/Web/API/File).

   - If multiple are added, this gets called multiple times.

   - File validations were already executed.

   - If a return value is provided and is `=== false` the file will be ignored by the widget.

   - Use this return value to implement your own validators.

 * **onBeforeUpload**: (id) Upload request is about to be executed.

 * **onUploadProgress**: (id, percent) Got a new upload percentage for the file

   `percent` (integer) : 0-100

 * **onUploadSuccess**: (id, data) File was successfully uploaded and got a response form the server

   `data` (object) : Upload request response. The object type of this parameter depends of: `dataType` 

   See more in [options](#options).

 * **onUploadError**: (id, xhr, status, errorThrown) An error happened during the upload request.

   `xhr` (object) : XMLHttpRequest

   `status` (integer) : Error type, example: "timeout", "error", "abort", and "parsererror"

   `errorThrown` (string) : Only when an HTTP error occurs: `Not Found`, `Bad Request`, etc.

   Reference: http://api.jquery.com/jquery.ajax/

 * **onUploadComplete**: (id) The upload of the file was complete.

   This triggers right after `onUploadSuccess` or `onUploadError`. In **both** cases.

 * **onUploadCanceled**: (id) Upload was cancelled by the user.

   This one triggers when cancelling an upload using one of the API methods.

   See more in [methods](#methods).

### Validation callbacks

 * **onFileTypeError**: (file) File type validation failed.

   Triggers when using the setting: `allowedTypes`.

   See more in [options](#options).

 * **onFileSizeError**: (file) File size validation failed.

   Triggers when using the setting: `maxFileSize`.

   See more in [options](#options).

 * **onFileExtError**: (file) File extension validation failed.

   Triggers when using the setting: `extFilter`.

   See more in [options](#options).

## Methods
 There are a few methods you can use to interact with the widget, some of their behavior may depend on settings.

 * **start**: (id) Start the upload. (id is optional)

   Depending on the situation this method may do:
     - Start the upload of an individual file if an `id` was provided and there isn't a `queue` running.
     - Retry a failed or a previously cancelled file.
     - Start the queue if `auto` is set to `false` and no `id` is provided
     - Start ALL the pending files if `queue` is set to false `false`

    Example:

   ```javascript
   $("#drop-area").dmUploader("start", id);
   ```

 * **cancel**: (id) Cancel the upload. (id is optional)

   Depending on the situation this method may do:
     - Cancel a file that is currently uploading if an `id` is provided.
     - Cancel all currently uploading files if an `id` is NOT provided.
     - Cancel a pending file, and it it will be skipped by the `queue` if using that option
     - Stop the current `queue` if using that option, and all current uploads.

   Example:

   ```javascript
   $("#drop-area").dmUploader("cancel", id);
   ```

 * **reset**: () Resets the plugin
   
   - Stops all uploads
   - Removes all files
   - Resets queue

   Example:

   ```javascript
   $("#drop-area").dmUploader("reset");
   ```

 * **destroy**: () Destroys all plugin data
   
   - Stops all uploads
   - Removes all files
   - Releases all the events, including the ones used by `hookDocument` if using that option

   Example:

   ```javascript
   // Example
   $("#drop-area").dmUploader("destroy");
   ```

