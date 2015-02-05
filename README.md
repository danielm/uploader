#JQuery File Uploader
JQuery plugin to drag and drop files, including ajax upload and progress bar. The idea for this plugin is to keep it very simple; other options/plugins i found mess up a lot with the markup and provide some really 'hacky' ways to make it available for prehistoric browsers.

The focus will be for **modern browsers**, but also providing a method to know when is the plugin is not supported; with an easy interface to use on **any design** you come up.

Basic Javascript/Jquery knowledge is necesary to use this plugin: how to set parameters, callbacks, etc.

As for new features im open to suggestions, but please before doing so read the TODO file to know what i've in mind :)

Dual licensed under the MIT and GPL licenses.
Created by Daniel Morales. [Contact Me](mailto:daniminas@gmail.com) for more info or anything you want :)

[View Changelog](#changelog)

##Demo
Using Bootstrap: http://danielm.herokuapp.com/demos/dnd/

Plain HTML: http://danielm.herokuapp.com/demos/dnd/simple.php

Image Upload w/Preview: http://danielm.herokuapp.com/demos/dnd/image-preview.php

##API
````javascript
$("#drop-area-div").dmUploader(options);
````
This way you can initialize the plugin. As parameter you can set all variables you want and the same goes for callbacks;
down bellow you can see a list of what [options](#options) and [callbacks](#callbacks) are availabe.

##Markup
This is the simple html markup. The file input is optional but it provides an alternative way to select files for the user(check the online demo to se how to hide/style it)
````html
<div id="drop-area-div" style="width:400px;height:300px;">
  Drag and Drop Files Here<br />
  or click to add files using the input<br />
  <input type="file" name="files[]" multiple="multiple" title="Click to add Files">
</div>
````
Even if you test all this in different browsers I recommend to add some kind of link to a basic uploader, this is still a new feature on several platforms.

##Options

###url
Server URL to handle file uploads.

###method
Form method used by the upload request. Default is <code>POST</code>

###extraData
Extra parameters to submit with each file. (Imagine these as 'hidden' inputs)
````javascript
extraData: {
  varName:1,
  varName:'string'
}
````

###maxFileSize
Max size of each individual file for pre-submit validation. Default is <code>0</code> (no limit)

###allowedTypes
Regular expression to match file types for pre-submit validation. Default is <code>'\*'</code>. Ej: <code>image/*</code>

###extFilter
Extension(s) comma separted for pre-submit validation. Default is <code>NULL</code>. Ej: <code>jpg;png;gif</code>

###maxFiles
Sets how many files can be uploaded by the user. Default is <code>0</code> (no limit)

###dataType
Data type corresponds to what the server is going to return after a successful upload.

Default is <code>null</code> which means Jquery will try to 'guess' depending of what the server returns.

Other values can be: <code>xml</code>, <code>json</code>, <code>script</code>, or <code>html</code>

Ref: http://api.jquery.com/jquery.ajax/

###fileName
Field name used to submit the files on each request. Default is <code>file</code>
````php
/* As example if you set this to 'file', on the server side code you will
be able to access to the file doing something like this(if you use PHP): */
$_FILES[fileName];
````

##Callbacks

###onInit
Called once plugin is loaded, browser checks passed and it's ready to use.
````javascript
onInit: function(){
  console.log('Plugin successfully initialized');
}
````

###onFallbackMode
This is called when the Ajax/File or Drag and Drop API isn't supported by the browser. It's
up to you to notify the user, change something on the UI, etc..
````javascript
onFallbackMode: function(message){
  console.log('Upload plugin can't be initialized: ' + message);
}
````
**Note**: Even when D&D isn't supported by the browser user may be able to upload via the
file input (*if you included that on the HTML markup*).

###onNewFile
Called every time a file is added to the upload queue. <code>id</code> is a number to identify
the upload.

**From now on other callbacks referring to this upload will use the same <code>id</code>**.
````javascript
onNewFile: function(id, file){
  /* Fields availabe are:
     - file.name
     - file.type
     - file.size (in bytes)
  */
}
````
**Note**: As example; if a user selects/drag two files this function will be called twice.

###onBeforeUpload
Called right before a upload request is sent.
````javascript
onBeforeUpload: function(id){
  console.log('Starting to upload #' + id);
}
````

###onComplete
Called after all pending upload been processed (this include error **and** successful uploads)
````javascript
onComplete: function(){
  console.log('We reach the end of the upload Queue!');
}
````

###onUploadProgress
If the browser supports upload progress this will be called when we have an update.
````javascript
onUploadProgress: function(id, percent){
  console.log('Upload of #' + id ' is at %' + percent);
  // do something cool here!
}
````

###onUploadSuccess
Called after a file upload was completed without errors. <code>data</code> contains
the server response (See [settings](#datatype)) for more
````javascript
onUploadSuccess: function(id, data){
  console.log('Succefully upload #' + id);
  console.log('Server response was:');
  console.log(data);
}
````

###onUploadError
Triggers when some kind of connection problem happened(timeout, etc..)
````javascript
onUploadError: function(id, message){
  console.log('Error trying to upload #' + id + ': ' + message);
}
````

###onFileTypeError
Called when the mimetype pre-submit validation fails.
See (See [settings](#allowedtypes) for more.)
````javascript
onFileTypeError: function(file){
  console.log('File type of ' + file.name + ' is not allowed: ' + file.type);
}
````

###onFileSizeError
Called when the file size pre-submit validation fails.
See (See [settings](#maxfilesize) for more.)
````javascript
onFileSizeError: function(file){
  console.log('File size of ' + file.name + ' exceeds the limit');
}
````

###onFileExtError
Called when the file extension pre-submit validation fails.
See (See [settings](#extfilter) for more.)
````javascript
onFileExtError: function(file){
  console.log('File extension of ' + file.name + ' is not allowed');
}
````

###onFilesMaxError
Called when the user reaches the upload limit (number of files).
See (See [settings](#maxfiles) for more.)
````javascript
onFilesMaxError: function(file){
  console.log(file.name + ' cannot be added to queue due to upload limits.');
}
````

##Changelog
- [Nov 01 2013] Initial relase.
- [Feb 08 2014] Project moved to Github.
- [Feb 15 2014] Added option for pre-submit file extension validation. View: [extFilter](#extfilter)/[onFileExtError](#onfileexterror)
