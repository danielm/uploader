$(function(){

  /*
    This is the plugin init.

    Added a couple helper fuctions just to keep the code cleaner and avoid code duplicaton:

    - add_log()
    - add_file()
    - update_file_status()
    - update_file_progress()
  */
  $('#drag-and-drop-zone').dmUploader({ //
    url: 'backend/upload.php',
    onDragEnter: function(){
      // Happens when dragging something over the DnD area
      this.addClass('active');
    },
    onDragLeave: function(){
      // Happens when dragging something OUT of the DnD area
      this.removeClass('active');
    },
    onInit: function(){
      // Plugin is ready to use
      add_log('Penguin initialized :)', 'info');
    },
    onComplete: function(){
      // All files in the queue are processed (success or error)
      add_log('All pending tranfers finished');
    },
    onNewFile: function(id, file){
      // When a new file is added using the file selector or the DnD area
      add_log('New file added to queue #' + id);
      add_file(id, file);
    },
    onBeforeUpload: function(id, file){
      // about tho start uploading a file
      add_log('Starting the upload of #' + id);
      update_file_status(id, 'uploading', 'Uploading...');
    },
    onUploadProgress: function(id, file, percent){
      // Updating file progress
      update_file_progress(id, percent);
    },
    onUploadSuccess: function(id, file, data){
      // A file was successfully uploaded
      add_log('Server Response for file #' + id + ': ' + JSON.stringify(data));
      add_log('Upload of file #' + id + ' COMPLETED', 'success');

      update_file_status(id, 'success', 'Upload Complete');
      update_file_progress(id, false, 'success');
    },
    onUploadError: function(id, file, xhr, status, message){
      // When something bad happens
      var response = (typeof xhr.responseJSON === 'undefined' ? false : xhr.responseJSON);
      if (response && response.hasOwnProperty('message')){
        message = response.message;
      }

      add_log('Failed to Upload file #' + id + ': ' + message, 'danger');

      update_file_status(id, 'danger', message);
      update_file_progress(id, false, 'danger');
    },
    onFallbackMode: function(){
      // When the browser doesn't support this plugin :(
      add_log('Plugin cant be used here, running Fallback callback', 'danger');
    }
  });

  /*
   * Some helper functions to work with our UI and keep our code cleaner
   */

  // Adds an entry to our debug area
  function add_log(message, color)
  {
    var d = new Date();

    var dateString = (('0' + d.getHours())).slice(-2) + ':' +
      (('0' + d.getMinutes())).slice(-2) + ':' +
      (('0' + d.getSeconds())).slice(-2);

    color = (typeof color === 'undefined' ? 'muted' : color);

    var template = $('#debug-template').text();
    template = template.replace('%%date%%', dateString);
    template = template.replace('%%message%%', message);
    template = template.replace('%%color%%', color);
    
    $('#debug').find('li.empty').remove(); // remove the 'no messages yet'
    $('#debug').prepend(template);
  }
  
  // Creates a new file and add it to our list
  function add_file(id, file)
  {
    var template = $('#files-template').text();
    template = template.replace('%%filename%%', file.name);

    template = $(template);
    template.prop('id', 'uploaderFile' + id);
    template.data('file-id', id);

    $('#files').find('p.empty').remove(); // remove the 'no files yet'
    $('#files').prepend(template);
  }
  
  // Changes the status messages on our list
  function update_file_status(id, status, message)
  {
    $('#uploaderFile' + id).find('span').html(message).prop('class', 'status text-' + status);
  }
  
  // Updates a file progress, depending on the parameters it may animate it or change the color.
  function update_file_progress(id, percent, color)
  {
    var bar = $('#uploaderFile' + id).find('div.progress-bar');

    if (percent === false){
      percent = 100;

      bar.removeClass('progress-bar-striped progress-bar-animated').html('');
    } else {
      // caption
      bar.html(percent + '%');
    }

    bar.width(percent + '%').attr('aria-valuenow', percent);

    if (typeof color !== 'undefined') {
      bar.addClass('bg-' + color);
    }
  }
});