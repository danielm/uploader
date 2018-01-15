# jQuery Ajax File Uploader Widget
A jQuery plugin for file uploading using ajax(a sync); includes support for queues, progress tracking and drag and drop.

Very ***configurable*** and easy to adapt to any ***Frontend*** design, and very easy to work along side any backend logic.

The focus will be ***modern browsers***, but also providing a method to know when the plugin is not supported. The idea is to keep it simple and ***lightweight***, no need to add hacky code to add unnecessary features for the web we have nowadays.

Basic Javascript knowledge is necesary to setup this plugin: how to set parameters, callbacks, etc.

- Lightweight: ~8.00 KB 
- Dependencies: just jQuery!
- License: Released under the [MIT license](LICENSE.txt)

[![Build Status](https://travis-ci.org/danielm/uploader.png)](https://travis-ci.org/danielm/uploader) 

## Live DEMOS
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

### Download tarball
You can download the latest release tarball directly from(https://github.com/danielm/uploader/releases) 

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
 * **queue**: (boolean) ``Default true`` Files will upload one by one.
 
 * **auto**: (boolean) ``Default true`` Files will start uploading right after they are added.
   If using the ``queue`` system this option means the -queue- will start automatically after the first file is added.

 * **dnd**: (boolean) ``Default true`` Enables Drag and Drop.

 * **hookDocument**: (boolean) ``Default true`` Disables dropping files on $(document).

   **This is necesary** to prevent the Browser from redirecting when dropping files.

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

   This can also be a `function` if you need a dynamic value. If this function returns `false` nothing will be added.

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
   extraData: {
      'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
   }
   ```

 * **dataType**: (string) ``Default null`` Response type of the upload request.

   Default is `null` which means jQuery will try to 'guess' depending of what the server returns.

   Other values can be: `xml`, `json`, `script`, or `html`

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

 * **allowedTypes**: (string) ``Default "*"`` File validation: Regular expression to match file types.

   ```javascript
   allowedTypes: "image/*"
   ```

 * **extFilter**: (array) ``Default null`` File validation: Array of allowed extensions.

   ```javascript
   extFilter: ["jpg", "jpeg", "png", "gif"]
   ```

## Callbacks

### General propouse

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
 All these include `id` and `file`

 `id` (string): Unique ID. Usefull to identify the same file in subsequent callbacks.

 `file` (object): File object, use it to access file details such as name, size, etc. For [reference click here](https://developer.mozilla.org/en-US/docs/Web/API/File).

 * **onNewFile**: (id, file) A new file was selected or dropped by the user.

   If multiple are added, this gets called multiple times.

   File validations were already executed and passed.

   If a return value is provided and is `=== false` the file will be ignored by the widget.

 * **onBeforeUpload**: (id, file) Upload request is about to be sent.

   If a return value is provided and is `=== false` the upload will be cancelled.

 * **onUploadProgress**: (id, file, percent) Got a new upload percentage for the file

   `percent` (integer) : 0-100

 * **onUploadSuccess**: (id, file, data) File was succefully uploaded and got a response form the server

   `data` (object) : Upload request response. The object type of this parameter depends of: `dataType` 

   See more in [options](#options).

 * **onUploadError**: (id, file, message) A connection error happened during the upload request.

   `message` (string) : Simple message describing the HTTP error, such as `Not Found`.

 * **onUploadComplete**: (id, file) The upload of the file was complete.

   This triggers right after `onUploadSuccess` `onUploadError`. In **both** cases.

 * **onUploadCanceled**: (id, file) Upload was cancelled by the user.

   This one triggers when cancelling an upload using one of the methods.

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

    Example:

   ```javascript
   $("#drop-area").dmUploader("start", id);
   ```

 * **cancel**: (id) Cancel the upload. (id is optional)

   Depending on the situation this method may do:
     - Cancel a file that is currently uploading if an `id` is provided.
     - Cancel all currently files if not `id` is provided.
     - Cancel a pending file, and it it will be skipped by the `queue` if using that option
     - Stop the current `queue` if using that option.

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
   - Releases all the events, including the ones used by `hookDocument` fi using that option

   Example:

   ```javascript
   // Example
   $("#drop-area").dmUploader("destroy");
   ```

