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
    queue: true,
    auto: true,
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
    return true;
  };

  DmUploaderFile.prototype.cancel = function()
  {
    return true;
  };

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
    if (this.settings.auto && this.settings.queue) {
      this.processQueue();
    }

    return this;
  };

  DmUploader.prototype.processQueue = function()
  {
    if (this.queueRunning) {
      return;
    }

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

  // Public API methods
  DmUploader.prototype.methods = {
    start: function(id) {
      // todo: check auto/queue options

      // todo: check id is present

      return true;
    },
    cancel: function(id) {
      // todo: check auto/queue options

      // todo: check id is present

      return true;
    },
    retry: function(id) {
      // todo: check auto/queue options

      // todo: check id is present

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