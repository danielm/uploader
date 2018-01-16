## Project Status
Besides upside downs in the last couple years the project is very alive and issues are usually responded quickly.

## What's next
- Probably coming in next release / there is already code related to it:
- Set default settings globally: $.fn.dmUploader.defaults = { .... }
- Rework the Callback system:
  - Currently the callback system is mixed with settings/config, AND is kinda an 'old' way of doing it.
  - Move to: trigger() and triggerHandler() - (and similar, more JQuery-friendly)

## Contributing 
- Make sure the pull-requests are from the 'master' branch. AND make sure you have the latest version!
- Don't mix up things: One commit for each bug fix / feature you want to introduce.
- Keep it clean, example: Don't fix a typo but then change 10 more additional lines adding an 'space'.
- Follow the plugin code style (yes, again... I been working on several opensource projects and people keep ignoring)
- Run 'npm test' or 'grunt test' to check for syntax issues using JSHint
- Commits must NOT INCLUDE any minified version