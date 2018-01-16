## 1.0.1
- The big change on this version is that now we have different modes.
  - Depending on the new options: ``auto`` and ``queue`` is how the plugin handles the uploads.
  - Uploads may or may not start automatically depending on those settings.
  - The plugin behaves the same way (as in previous versions) if using the default settings
  - Check the online demos to see the different modes: https://danielmg.org/demo/java-script/uploader

- Plugin API

  After initialization now we have a few public Methods to interact with the plugin.

  - ``start``
  - ``cancel``
  - ``reset``
  - ``destroy``

See [methods section](README.md#methods) for details on each.

- New options
  - ``auto``, ``queue``, ``dnd``, ``hookDocument``, ``multiple``, ``headers``

- Options changed
  - ``fieldName`` Renamed. Previously known as ``fileName`` (was removed)
  - ``extFilter`` Now is an Array: Example  ``['png','jpg','gif','jpeg']``
  - ``extraData`` Now it can ALSO be a function, useful for example you need dynamic values.

- Options removed
  - ``fileName`` renamed to ``fileName``
  - ``maxFiles`` Functionality removed.

    Users expected diferent things from it (completed uploads, or files added, or some more dynamic stuff)

    Good news is that NOW you can implement your own validation checks now on the ``onNewFile`` callback.

See [options section](README.md#options) for details

- Callbacks changed
  - ``onNewFile`` If a return value is provided and is `=== false` the file will be ignored by the widget.

    Use this to implement your own validators.

  - ``onBeforeUpload`` The return value is now ignored. Use ``onNewFile`` instead.
  - ``onUploadError``  New paramters xhr and status: ``(id, xhr, status, message)``
  - ``onFallbackMode`` - Parameter ``message`` was removed

- New callbacks
  - ``onUploadComplete`` This triggers right after `onUploadSuccess` or `onUploadError`. In **both** cases.
  - ``onUploadCanceled`` Triggers after a pending or uploading file is canceled (by using one of the API (README.md#methods))
  - ``onDragEnter``
  - ``onDragLeave``
  - ``onDocumentDragEnter``
  - ``onDocumentDragLeave``

- Callbacks removed
  - ``onFilesMaxError`` Functionality removed. Check the options cheanges for the reasons behind this change.

See [callbacks section](README.md#callbacks) for details

## 0.1.2
- Added option for pre-submit file extension validation. View doc: extFilter/onFileExtError
- Added option for pre-submit maxFiles validation. View doc: maxFiles/onFilesMaxError
- Fixed several typos / code example errors.

## 0.1.1
- Project moved to Github.

## 0.1.0
- Initial release.
