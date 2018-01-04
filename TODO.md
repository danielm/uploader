- Testing!!!!!!!!

Major changes before 0.2.0
- Review start(), cancel() and 'auto' option
  - Don't make the ID mandatory
    - start(): Without the ID parameter it will check if there is
      no queue running => start it!
    - cancel(): Without the ID parameter will stop que queue (if running),
      and call cancel() for any uploading files
    
  - Remove cancellAll()
    - It will work the same as cancel() with no arguments
    
  - Review the 'auto' option, and how the queue is processed with the
    new start() and cancell() from previous points
  - Also, before start the upload of a file coming from queue check
    that is  not uploading already.
  - Review new features added from pull requests and how can be integrated
    to the new version.

  - Check if some each() are necesary during creation!

---

Main changes
 - validators now are  !== null
 - extraData accepts now accepts a callback
 - dragenter ondragleave ondrop
 - fllback no mseesage
 - new dnd option

X cfunction initDnD: function is()
X checquear si el tag es un input file, sino es un div etc
X agregar file blob data a los callbacks de archivos
X fix callbacks dragenter and dragleave
X agregar varios checkeso cuando: 
  X evt.originalEvent.dataTransfer.files
  X evt.target.files
X Draggingover document, callbacks?
X methods.cancel
X methods.reset
X Problema:
  X se agregar 3 files
  X se cancela global
  X se agrega otro mas
    X el posQueue es donde se 'quedo' el queue cuando se cancelo
    X deberia ser donde se agrega el/los nuevos archivos si no hay un queueRunning
X Problema:
  X Agrego archivos al queue
  X Cancelo uno o varios o muchos
  X presiono start (global) -> se inician los cancelados: NO Deberia en aquellos cancelados by user
  X solo los failed y los pending
X al cancelar global:
  X si hay una queue runing deberia llamar la function oncomplete todos los pending
  X lo mismo con reset
X Evaular si se puede mergear cancel() y reset()
  X al menos parte del codigo duplicado que tienen
X Testing todos los modos
X Ser consistente con como se llaman los callbacks, sobretodo con los dragleave onnew file y smilares
X Code style
  X lint
  X minify
  - OPCION multiple!
  - carpeta demos
  - banner
  - test otros browsers / mobile
  - demos danielmg.org
  - plugins.jquery.com / dmuploader.jquery.json
  - scripts de package.json para publish an npm publish, y push tags a github
  - npm.com ?
  - bower.io ?

X test manual queue
  X add files
  X play uno en el medio, que sucede cuando termine?

------------------------------------------------------------------------

Documentation:
  - Add to Readme.md:
      - New methods:
         * cancel
         * start
         * reset

------------------------------------------------------------------------

- Test 'devel' features: manual upload & 'auto' option.

- add 'reset' API method to reset IDs, free resources, etc. (cleanup)

- We could use onUploadProgress to also report 'time left' of the upload

- Add maxSimulaneusRequests
- Add maxFilesPerRequest

- Allow the option to do something like Facebook when draggin-in content:
   ... show/hide (we are goin to just use moar callbacks)
