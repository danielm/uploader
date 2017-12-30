/*
 * dmuploader.js - Jquery File Uploader - 0.1
 * https://github.com/danielm/uploader
 * 
 * Copyright (c) 2013-2017 Daniel Morales
 * Dual licensed under the MIT and GPL licenses.
 */

(function($) {
  var pluginName = 'dmUploader';

  var FileStatus = {
    PENDING: 0,
    UPLOADING: 1,
    COMPLETED: 2,
    FAILED: 3,
    CANCELLED: 4 //(by the user)
  };

  // These are the plugin defaults values
  var defaults = {
    auto: true,
    queue: true,
    url: document.URL,
    method: 'POST',
    extraData: {},
    headers: {},
    dataType: null,
    fieldName: 'file',
    maxFileSize: null,
    allowedTypes: '*',
    extFilter: null,
    onInit: function(){},
    onFallbackMode: function(message) {},
    onNewFile: function(id, file){},
    onBeforeUpload: function(id){},
    onComplete: function(){},
    onUploadProgress: function(id, percent){},
    onUploadSuccess: function(id, data){},
    onUploadError: function(id, message){},
    onFileTypeError: function(file){},
    onFileSizeError: function(file){},
    onFileExtError: function(file){},
    onDragOver: function(){},
    onDragLeave: function(){},
    onDrop: function(){}
  };
  
  var DmUploaderFile = function(file)
  {
    this.file = file;

    this.jqXHR = null;

    this.status = FileStatus.PENDING;

    // The file id doesnt have to bo that special.... or not?
    this.id = Date.now().toString(36).substr(0, 8);
  };

  DmUploaderFile.prototype.upload = function(widget)
  {
    var file = this;

    if (!file.canUpload()){

      if (widget.queueRunning) {
        widget.processQueue();
      }

      return false;
    }

    // Form Data
    var fd = new FormData();
    fd.append(widget.settings.fieldName, file.file);

    // If the callback returns false file will not be processed. This may allow some customization
    var can_continue = widget.settings.onBeforeUpload.call(widget.element, file.id);
    if (can_continue ===  false) {
      return false;
    }

    // Append extra Form Data
    var customData = widget.settings.extraData;
    if (typeof(widget.settings.extraData) === "function"){
      customData = widget.settings.extraData.call(widget.element, file.id);
    }

    $.each(customData, function(exKey, exVal){
      fd.append(exKey, exVal);
    });

    file.status = FileStatus.UPLOADING;

    // Ajax Submit
    file.jqXHR = $.ajax({
      url: widget.settings.url,
      type: widget.settings.method,
      dataType: widget.settings.dataType,
      data: fd,
      headers: widget.settings.headers,
      cache: false,
      contentType: false,
      processData: false,
      forceSync: false,
      xhr: function(){
        var xhrobj = $.ajaxSettings.xhr();
        if(xhrobj.upload){
          xhrobj.upload.addEventListener('progress', function(event) {
            var percent = 0;
            var position = event.loaded || event.position;
            var total = event.total || event.totalSize;
            if(event.lengthComputable){
              percent = Math.ceil(position / total * 100);
            }

            widget.settings.onUploadProgress.call(widget.element, file.id, percent);
          }, false);
        }

        return xhrobj;
      },
      success: function (data){
        file.status = FileStatus.COMPLETED;
        widget.settings.onUploadSuccess.call(widget.element, file.id, data);
      },
      error: function (xhr, status, errMsg){
        // If the status is: cancelled (by the user) don't invoke the error callback
        if (file.status != FileStatus.CANCELLED){
          file.status = FileStatus.FAILED;
          widget.settings.onUploadError.call(widget.element, file.id, errMsg);
        }
      },
      complete: function(){
        if (widget.queueRunning){
          widget.processQueue();
        }
      }
    });

    return true;
  };

  DmUploaderFile.prototype.cancel = function()
  {
    switch (this.status){
      case FileStatus.PENDING:
        this.status = FileStatus.CANCELLED;
        break;
      case FileStatus.UPLOADING:
        this.status = FileStatus.CANCELLED;
        this.jqXHR.abort();
        break;
      default:
        return false;
    }

    return true;
  };

  DmUploaderFile.prototype.canUpload = function()
  {
    return (this.status == FileStatus.PENDING ||
      this.status == FileStatus.CANCELLED ||
      this.status == FileStatus.FAILED);
  }

  var DmUploader = function(element, options)
  {
    this.element = $(element);
    this.settings = $.extend({}, defaults, options);

    this.queue = [];
    this.queuePos = -1;
    this.queueRunning = false;

    this.init();

    return this;
  };

  DmUploader.prototype.init = function()
  {
    var widget = this;

    //-- Optional File input to make a clickable area
    widget.element.find('input[type=file]').on('change', function(evt){
      var files = evt.target.files;

      widget.addFiles(files);

      $(this).val('');
    });

    // -- Drag and drop events
    widget.element.on('drop', function (evt){
      evt.stopPropagation();
      evt.preventDefault();

      var files = evt.originalEvent.dataTransfer.files;

      widget.addFiles(files);

      widget.settings.onDrop.call(this.element);
    });

    //-- These two events/callbacks are onlt to maybe do some fancy visual stuff
    widget.element.on('dragover', function(evt){
      widget.settings.onDragOver.call(this.element);
    });

    widget.element.on('dragleave', function(evt){
      widget.settings.onDragLeave.call(this.element);
    });

    // We good to go, tell them!
    this.settings.onInit.call(this.element);

    return this;
  };

  DmUploader.prototype.addFiles = function(files)
  {
    var nFiles = 0;

    for (var i= 0; i < files.length; i++)
    {
      var file = files[i];

      // Check file size
      if((this.settings.maxFileSize > 0) &&
          (file.size > this.settings.maxFileSize)){

        this.settings.onFileSizeError.call(this.element, file);

        continue;
      }

      // Check file type
      if((this.settings.allowedTypes != '*') &&
          !file.type.match(this.settings.allowedTypes)){

        this.settings.onFileTypeError.call(this.element, file);

        continue;
      }

      // Check file extension
      if(this.settings.extFilter !== null){
        var extList = this.settings.extFilter.toLowerCase().split(';');

        var ext = file.name.toLowerCase().split('.').pop();

        if($.inArray(ext, extList) < 0){
          this.settings.onFileExtError.call(this.element, file);

          continue;
        }
      }

      var fileObj = new DmUploaderFile(file);
      var can_continue = this.settings.onNewFile.call(this.element, fileObj.id, file);

      // If the callback returns false file will not be processed. This may allow some customization
      if (can_continue === false) {
        return;
      }

      // If we are using automatic uploading, and not a file queue: go for the upload
      if(this.settings.auto && !this.settings.queue){
        fileObj.upload(this);
      }

      this.queue.push(fileObj);
      
      nFiles++;
    }

    // No files were added
    if (nFiles == 0){
      return this;
    }

    // Are we auto-uploading files?
    if (this.settings.auto && this.settings.queue && !this.queueRunning) {
      this.processQueue();
    }

    return this;
  };

  DmUploader.prototype.processQueue = function()
  {
    this.queuePos++;

    if (this.queuePos >= this.queue.length){
      this.settings.onComplete.call(this.element);

      // Wait until new files are droped
      this.queuePos = (this.queue.length - 1);

      this.queueRunning = false;

      return false;
    }

    this.queueRunning = true;

    // Start next file
    return this.queue[this.queuePos].upload(this);
  };

  DmUploader.prototype.restartQueue = function()
  {
    this.queuePos = -1;
    this.queueRunning = false;

    this.processQueue();
  };

  DmUploader.prototype.findById = function(id)
  {
    var r = false;

    for (var i = 0; i < this.queue.length; i++){
      if (this.queue[i].id === id){
        r = this.queue[i];
        break;
      }
    }

    return r;
  };

  // Public API methods
  DmUploader.prototype.methods = {
    start: function(id) {
      if (this.queueRunning){
        // Do not allow to manually upload Files when a queue is running
        return false;
      }

      var file = false;

      if (typeof id !== 'undefined') {
        file = this.findById(id);

        if (!file){
          // File not found in stack
          return false;
        }
      }
      
      // Trying to Start an upload by ID
      if (file) {
        return file.upload(this);
      }

      // No id provided...
      if (this.settings.queue) {
        // Resume queue
        this.restartQueue();
      } else {
        // or upload them all
        for (var i = 0; i < this.queue.length; i++){
          this.queue[i].upload(this);
        }
      }

      return true;
    },
    cancel: function(id) {
      // todo: check auto/queue options

      // todo: check id is present

      return true;
    },
    reset: function() {
      return true;
    }
  };

  $.fn.dmUploader = function(options){
    var args = arguments;

    if (typeof options === 'string'){
      this.each(function(){
        var plugin = $.data(this, pluginName);

        if (plugin instanceof DmUploader){
          if (options === 'destroy'){
            if(plugin.methods.reset()){
              $.removeData(this, pluginName, null);
            }
          } else if (typeof plugin.methods[options] === 'function'){
            plugin.methods[options].apply(plugin, Array.prototype.slice.call(args, 1));
          } else {
            $.error('Method ' +  options + ' does not exist on jQuery.dmUploader');
          }
        } else {
          $.error('Unknown plugin data found by jQuery.dmUploader');
        }
      });
    } else {
      return this.each(function (){
        if(!$.data(this, pluginName)){
          $.data(this, pluginName, new DmUploader(this, options));
        }
      });
    }
  };

  // -- Disable Document D&D events to prevent opening the file on browser when we drop them
  $(document).on('dragenter', function (e) {
    e.stopPropagation();
    e.preventDefault();
  });
  $(document).on('dragover', function (e) {
    e.stopPropagation();
    e.preventDefault();
  });
  $(document).on('drop', function (e) {
    e.stopPropagation();
    e.preventDefault();
  });
})(jQuery);