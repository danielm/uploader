/*
 * dmuploader.js - Jquery File Uploader - 0.1
 * http://www.daniel.com.uy/projects/jquery-file-uploader/
 * 
 * Copyright (c) 2013 Daniel Morales
 * Dual licensed under the MIT and GPL licenses.
 * http://www.daniel.com.uy/doc/license/
 */

(function($) {
  var pluginName = 'dmUploader';

  // These are the plugin defaults values
  var defaults = {
    url: document.URL,
    method: 'POST',
    extraData: {},
    maxFileSize: 0,
    allowedTypes: '*',
    extFilter: null,
    dataType: null,
    fileName: 'file',
    onInit: function(){},
    onFallbackMode: function() {message},
    onNewFile: function(id, file){},
    onBeforeUpload: function(id){},
    onComplete: function(){},
    onUploadProgress: function(id, percent){},
    onUploadSuccess: function(id, data){},
    onUploadError: function(id, message){},
    onFileTypeError: function(file){},
    onFileSizeError: function(file){},
    onFileExtError: function(file){}
  };

  var DmUploader = function(element, options)
  {
    this.element = $(element);

    this.settings = $.extend({}, defaults, options);

    if(!this.checkBrowser()){
      return false;
    }

    this.init();

    return true;
  };
  
  var DmUploaderFile = function(file)
  {
    this.file = file;

    this.jqXHR = null;

    // Status can be:
    // - 0: pending
    // - 1: uploading
    // - 2: completed
    // - 3: failed
    // - 4: cancelled (by the user)
    this.status = 0;
  }

  DmUploaderFile.prototype.setXhr = function(jqXHR)
  {
    this.jqXHR = jqXHR;
  }

  DmUploaderFile.prototype.getFile = function()
  {
    return this.file;
  }

  DmUploaderFile.prototype.getStatus = function()
  {
    return this.status;
  }

  DmUploaderFile.prototype.setStatus = function(status)
  {
    this.status = status;
  }

  DmUploaderFile.prototype.cancel = function()
  {
    switch (this.status){
      case 0:
        // Pending status...
        this.status = 4;
        break;
      case 1:
        // Uploading status...
        this.status = 4;
        this.jqXHR.abort();
        break;
      default:
        return false;
    }

    return true;
  }

  DmUploader.prototype.methods = {
    cancel: function(id) {
      /* Stops(if uploading) and Remove the upload from Queue */
      if (id > (this.queue.length - 1))
        return false;

      return this.queue[this.queuePos].cancel();
    },
    cancelAll: function() {
      /* Same as cancel, but for all pending uploads */
      $.each(this.queue, function(id, file){
        file.cancel();
      });
    },
    start: function(id) {
      /* ToDo: Start or re-try the upload */
    },
    reset: function() {
      /* ToDo: Reset plugin resources */
    }
  };

  DmUploader.prototype.checkBrowser = function()
  {
    if(window.FormData === undefined){
      this.settings.onFallbackMode.call(this.element, 'Browser doesn\'t support From API');

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
    var element = element || document.createElement('div');
    var eventName = 'on' + eventName;

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

    widget.queue = new Array();
    widget.queuePos = -1;
    widget.queueRunning = false;

    // -- Drag and drop event
    widget.element.on('drop', function (evt){
      evt.preventDefault();
      var files = evt.originalEvent.dataTransfer.files;

      widget.queueFiles(files);
    });

    //-- Optional File input to make a clickable area
    widget.element.find('input[type=file]').on('change', function(evt){
      var files = evt.target.files;

      widget.queueFiles(files);

      $(this).val('');
    });
        
    this.settings.onInit.call(this.element);
  };

  DmUploader.prototype.queueFiles = function(files)
  {
    var j = this.queue.length;

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
      if(this.settings.extFilter != null){
        var extList = this.settings.extFilter.toLowerCase().split(';');

        var ext = file.name.toLowerCase().split('.').pop();

        if($.inArray(ext, extList) < 0){
          this.settings.onFileExtError.call(this.element, file);

          continue;
        }
      }

      var fileObj = new DmUploaderFile(file);
      this.queue.push(fileObj);

      var index = this.queue.length - 1;

      this.settings.onNewFile.call(this.element, index, file);
    }

    // Only start Queue if we haven't!
    if(this.queueRunning){
      return false;
    }

    // and only if new Failes were succefully added
    if(this.queue.length == j){
      return false;
    }

    this.processQueue();

    return true;
  };

  DmUploader.prototype.processQueue = function()
  {
    var widget = this;

    widget.queuePos++;

    if(widget.queuePos >= widget.queue.length){
      // Cleanup

      widget.settings.onComplete.call(widget.element);

      // Wait until new files are droped
      widget.queuePos = (widget.queue.length - 1);

      widget.queueRunning = false;

      return;
    }

    var file = widget.queue[widget.queuePos];

    // Cancelled by the user?
    if (file.getStatus() == 4){
      widget.processQueue();

      return;
    }

    // Form Data
    var fd = new FormData();
    fd.append(widget.settings.fileName, file.getFile());

    // Append extra Form Data
    $.each(widget.settings.extraData, function(exKey, exVal){
      fd.append(exKey, exVal);
    });

    widget.settings.onBeforeUpload.call(widget.element, widget.queuePos);

    widget.queueRunning = true;
    file.setStatus(1);

    // Ajax Submit
    var jqXHR = $.ajax({
      url: widget.settings.url,
      type: widget.settings.method,
      dataType: widget.settings.dataType,
      data: fd,
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

            widget.settings.onUploadProgress.call(widget.element, widget.queuePos, percent);
          }, false);
        }

        return xhrobj;
      },
      success: function (data, message, xhr){
        file.setStatus(2);
        widget.settings.onUploadSuccess.call(widget.element, widget.queuePos, data);
      },
      error: function (xhr, status, errMsg){
        // If the status is: cancelled (by the user) don't invoke the error callback
        if (file.getStatus() != 4){
          file.setStatus(3);
          widget.settings.onUploadError.call(widget.element, widget.queuePos, errMsg);
        }
      },
      complete: function(xhr, textStatus){
        widget.processQueue();
      }
    });

    file.setXhr(jqXHR);
  }

  $.fn.dmUploader = function(args){
    var argsc = arguments;

    return this.each(function(){
      var plugin = $.data(this, pluginName);
      if(!plugin){
        $.data(this, pluginName, new DmUploader(this, args));
      } else if (plugin.methods[args]){
        plugin.methods[args].apply(plugin, Array.prototype.slice.call(argsc, 1));
      } else {
        $.error('Method ' +  args + ' does not exist on jQuery.dmUploader');
      } 
    });
  };

  // -- Disable Document D&D events to prevent opening the file on browser when we drop them
  $(document).on('dragenter', function (e) { e.stopPropagation(); e.preventDefault(); });
  $(document).on('dragover', function (e) { e.stopPropagation(); e.preventDefault(); });
  $(document).on('drop', function (e) { e.stopPropagation(); e.preventDefault(); });
})(jQuery);
