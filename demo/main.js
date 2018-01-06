$(function(){

  // Upload Plugin itself
  $('#drag-and-drop-zone').dmUploader({ //
    url: 'backend/upload.php',
    onDragEnter: function(){
      this.addClass('active');
    },
    onDragLeave: function(){
      this.removeClass('active');
    },
    onInit: function(){
      add_log('Penguin initialized :)', 'info');
    },
    onComplete: function(){
      add_log('All pending tranfers finished');
    },
    onNewFile: function(id, file){
      add_log('New file added to queue #' + id);
      add_file(id, file);
    },
    onBeforeUpload: function(id, file){
      add_log('Starting the upload of #' + id);
      update_file_status(id, 'uploading', 'Uploading...');
    },
    onUploadProgress: function(id, file, percent){
      update_file_progress(id, percent);
    },
    onUploadSuccess: function(id, file, data){
      add_log('Server Response for file #' + id + ': ' + JSON.stringify(data));
      add_log('Upload of file #' + id + ' COMPLETED', 'success');

      update_file_status(id, 'success', 'Upload Complete');
      update_file_progress(id, false, 'success');
    },
    onUploadError: function(id, file, xhr, status, message){

      var response = (typeof xhr.responseJSON === 'undefined' ? false : xhr.responseJSON);
      if (response && response.hasOwnProperty('message')){
        message = response.message;
      }

      add_log('Failed to Upload file #' + id + ': ' + message, 'danger');

      update_file_status(id, 'danger', message);
      update_file_progress(id, false, 'danger');
    },
    onFallbackMode: function(){
      add_log('Plugin cant be used here, running Fallback callback', 'danger');
    }
  });

  //-- Some functions to work with our UI
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
    
    $('#debug').find('li.empty').remove();
    $('#debug').prepend(template);
  }
  
  function add_file(id, file)
  {
    var template = $('#files-template').text();
    template = template.replace('%%filename%%', file.name);

    template = $(template);
    template.prop('id', 'uploaderFile' + id);
    template.data('file-id', id);

    $('#files').find('p.empty').remove();
    $('#files').prepend(template);
  }
  
  function update_file_status(id, status, message)
  {
    $('#uploaderFile' + id).find('span').html(message).prop('class', 'status text-' + status);
  }
  
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