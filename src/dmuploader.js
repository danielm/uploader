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
    url: document.URL,
    method: 'POST',
    extraData: {},
    headers: {},
    maxFileSize: null,
    maxFiles: null,
    allowedTypes: '*',
    extFilter: null,
    dataType: null,
    fileName: 'file',
    auto: true,
    skipChecks: false,
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
    onFilesMaxError: function(file){},
    onDragOver: function(){},
    onDragLeave: function(){},
    onDrop: function(){}
  };

  var DmUploader = function(element, options)
  {
    this.element = $(element);

    this.settings = $.extend({}, defaults, options);

    if(!this.settings.skipChecks && !this.checkBrowser()){
      return false;
    }

    this.init();

    return true;
  };
  
  var DmUploaderFile = function(file)
  {
    this.file = file;

    this.jqXHR = null;

    this.status = FileStatus.PENDING;

    this.id = -1;
  };

  DmUploaderFile.prototype.setId = function(id)
  {
    this.id = id;
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

  DmUploaderFile.prototype.upload = function(widget, single)
  {
    var file = this;

    // Cancelled by the user?
    if (!single && (file.status == FileStatus.CANCELLED)){
      widget.processQueue();

      return false;
    }

    // Uploading, or completed files...
    if (file.status == FileStatus.UPLOADING ||
        file.status == FileStatus.COMPLETED){
      if (!single){
        widget.processQueue();
      }

      return false;
    }

    // Form Data
    var fd = new FormData();
    fd.append(widget.settings.fileName, file.file);

    // Return from client function (default === undefined)
    var can_continue = widget.settings.onBeforeUpload.call(widget.element, file.id);

    // If the client function doesn't return FALSE then continue
    if( false === can_continue ) {
      return;
    }

    // Append extra Form Data
    var customData = widget.settings.extraData;
    if (typeof(widget.settings.extraData) === "function"){
      customData = widget.settings.extraData.call(widget.element, file.id);
    }
    $.each(customData, function(exKey, exVal){
      fd.append(exKey, exVal);
    });

    if (!single){
      widget.queueRunning = true;
    }

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
        if (widget.settings.auto){
          widget.processQueue();
        }
      }
    });

    return true;
  };

  // Public API methods
  DmUploader.prototype.methods = {
    cancel: function(id) {
      /* Stops(if uploading) and Remove the upload from Queue */
      if (id > (this.queue.length - 1)){
        return false;
      }

      return this.queue[id].cancel();
    },
    cancelAll: function() {
      /* Same as cancel, but for all pending uploads */
      var nCancels = 0;

      $.each(this.queue, function(id, file){
        if (file.cancel()){
          nCancels++;
        }
      });

      return nCancels;
    },
    start: function(id) {
      /* Start or re-try the upload */
      if (id > (this.queue.length - 1)){
        return false;
      }

      // If we are using a File queue only allow to start (or retry)
      // files that that were cancelled or failed (NOT files that are 'next' in
      // our queue.
      if (this.settings.auto && (id >= this.queuePos)){
        return false;
      }

      return this.queue[id].upload(this, true);
    },
    supportsProgress: function() {
      var xhrobj = $.ajaxSettings.xhr();
      
      return (xhrobj.upload !== undefined);
    },
    supportsDND: function() {
      return (this.checkEvent('drop', this.element) && !this.checkEvent('dragstart', this.element));
    },
    reset: function() {
      console.log('TODO: Reset plugin');

      return true;
    }
  };

  DmUploader.prototype.checkBrowser = function()
  {
    if(window.FormData === undefined){
      this.settings.onFallbackMode.call(this.element, 'Browser doesn\'t support Form API');

      return false;
    }

    if(this.element.find('input[type=file]').length > 0){
      return true;
    }

    if (!this.checkEvent('drop', this.element) || !this.checkEvent('dragstart', this.element)){
      this.settings.onFallbackMode.call(this.element, 'Browser doesn\'t support Ajax Drag and Drop');

      return false;
    }

    return true;
  };

  DmUploader.prototype.checkEvent = function(eventName, element)
  {
    element = element || document.createElement('div');
    eventName = 'on' + eventName;

    var isSupported = eventName in element;

    if(!isSupported){
      if(!element.setAttribute){
        element = document.createElement('div');
      }
      if(element.setAttribute && element.removeAttribute){
        element.setAttribute(eventName, '');
        isSupported = typeof element[eventName] == 'function';

        if(typeof element[eventName] != 'undefined'){
          element[eventName] = undefined;
        }
        element.removeAttribute(eventName);
      }
    }

    element = null;
    return isSupported;
  };

  DmUploader.prototype.init = function()
  {
    var widget = this;

    widget.queue = [];
    widget.queuePos = -1;
    widget.queueRunning = false;

    // -- Drag and drop events
    widget.element.on('drop', function (evt){
      evt.preventDefault();
      var files = evt.originalEvent.dataTransfer.files;

      widget.queueFiles(files);

      widget.settings.onDrop.call(this.element);
    });

    //-- Optional File input to make a clickable area
    widget.element.find('input[type=file]').on('change', function(evt){
      var files = evt.target.files;

      widget.queueFiles(files);

      $(this).val('');
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
  };

  DmUploader.prototype.queueFiles = function(files)
  {
    var j = this.queue.length;

    for (var i= 0; i < files.length; i++)
    {
      var file = files[i];

      // Check file size
      if((this.settings.maxFileSize !== null) &&
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

      // Check max files
      if(this.settings.maxFiles !== null) {
        if(this.queue.length >= this.settings.maxFiles) {
          this.settings.onFilesMaxError.call(this.element, file);

          continue;
        }
      }

      var fileObj = new DmUploaderFile(file);
      this.queue.push(fileObj);

      var index = this.queue.length - 1;
      fileObj.setId(index);

      this.settings.onNewFile.call(this.element, index, file);
    }

    // Only start Queue if we haven't!
    if(this.queueRunning){
      return false;
    }

    // and only if new Files were successfully added
    if(this.queue.length == j){
      return false;
    }

    if (this.settings.auto){
      this.processQueue();
    }

    return true;
  };

  DmUploader.prototype.processQueue = function()
  {
    this.queuePos++;

    if(this.queuePos >= this.queue.length){
      this.settings.onComplete.call(this.element);

      // Wait until new files are droped
      this.queuePos = (this.queue.length - 1);

      this.queueRunning = false;

      return;
    }

    this.queue[this.queuePos].upload(this, false);
  };

  $.fn.dmUploader = function(options){
    var args = arguments;

    if (typeof options === 'string'){
      this.each(function(){
        var plugin = $.data(this, pluginName);

        console.log(plugin.methods);

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