$(function(){
  //-- Some functions to work with our UI
  function add_log(message, color)
  {
    var d = new Date();

    color = (typeof color === 'undefined' ? 'default' : color);

    var template = '<li class="'+ color + '">[' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds() + '] ' + message + '</li>';
    
    $('#debug').find('ul').prepend(template);
  }
  
  function add_file(id, file)
  {
    var template = '' +
      '<div class="file" id="uploaderFile' + id + '" data-file-id="'+id+'">' +
        '<div class="info">' +
          '<span class="filename" title="Size: ' + file.size + 'bytes - Mimetype: ' + file.type + '">' + file.name + '</span><br /><small>Status: <span class="status">Waiting</span></small>' +
        '</div>' +
        '<div class="bar">' +
          '<div class="progress" style="width:0%"></div>' +
        '</div>' +
        '<div><a href="#" class="start">Start</a> | <a href="#" class="cancel">Cancel</a></div>' +
      '</div>';
      
      $('#fileList').prepend(template);
  }
  
  function update_file_status(id, status, message)
  {
    $('#uploaderFile' + id).find('span.status').html(message).prop('class', 'status ' + status);
  }
  
  function update_file_progress(id, percent)
  {
    $('#uploaderFile' + id).find('div.progress').width(percent);
  }

  // Action events
  $('#fileList').on('click', 'a.start', function(evt){
    evt.preventDefault();

    var id = $(this).closest('div.file').data('file-id');
    $('#drag-and-drop-zone').dmUploader('start', id);
  });

  $('#fileList').on('click', 'a.cancel', function(evt){
    evt.preventDefault();

    var id = $(this).closest('div.file').data('file-id');
    $('#drag-and-drop-zone').dmUploader('cancel', id);
  });

  //
  $('#globalStart').on('click', function(evt){
    evt.preventDefault();

    $('#drag-and-drop-zone').dmUploader('start');
  });

  $('#globalCancel').on('click', function(evt){
    evt.preventDefault();

    $('#drag-and-drop-zone').dmUploader('cancel');
  });

  $('#globalReset').on('click', function(evt){
    evt.preventDefault();

    $('#drag-and-drop-zone').dmUploader('reset');
  });

  // Upload Plugin itself
  $('#drag-and-drop-zone').dmUploader({ //
    url: 'backend/upload.php',
    dataType: 'json',
    dnd: true,
    auto:true,
    queue:true,
    onDragEnter: function(){
      $('#drag-and-drop-zone').addClass('uploader-active');
    },
    onDragLeave: function(){
      $('#drag-and-drop-zone').removeClass('uploader-active');
    },
    onInit: function(){
      add_log('Penguin initialized :)', 'info');
    },
    onBeforeUpload: function(id, file){
      add_log('Starting the upload of #' + id);
      
      update_file_status(id, 'uploading', 'Uploading...');
    },
    onNewFile: function(id, file){
      add_log('New file added to queue #' + id);
      
      add_file(id, file);
    },
    onComplete: function(){
      add_log('All pending tranfers finished');
    },
    onUploadProgress: function(id, file, percent){
      var percentStr = percent + '%';

      update_file_progress(id, percentStr);
    },
    onUploadSuccess: function(id, file, data){
      add_log('Server Response for file #' + id + ': ' + JSON.stringify(data));
      
      add_log('Upload of file #' + id + ' COMPLETED', 'success');

      update_file_status(id, 'success', 'Upload Complete');
      
      update_file_progress(id, '100%');
    },
    onUploadCanceled: function(id, file){
      add_log('Upload of file #' + id + ' CANCELED', 'info');

      update_file_status(id, 'error', 'Canceled by User');

    },
    onUploadError: function(id, file, message){
      add_log('Failed to Upload file #' + id + ': ' + message, 'error');
      
      update_file_status(id, 'error', message);
    },
    onFileTypeError: function(file){

      add_log('File \'' + file.name + '\' cannot be added: must be an image', 'error');
      
    },
    onFileSizeError: function(file){

      add_log('File \'' + file.name + '\' cannot be added: size excess limit', 'error');
    },
    onFileExtError: function(file){

      $.danidemo.addLog('#demo-debug', 'error', 'File \'' + file.name + '\' has a Not Allowed Extension');
    },
    onFallbackMode: function(){
      add_log('Plugin cant be used here, running Fallback callback', 'error');
    }
  });
});