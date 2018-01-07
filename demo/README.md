# DEMO

This page demostrates the most basic setup/config.

## Backend

By default this example uploads files using: <code>demo/backend/upload.php</code>. This piece of PHP logic is provided to upload the files to the <code>backend/files/</code> folder (make sure it has writing permissions).

This is only an example using PHP, of course you can use it with any other type of backend. 

And It's just to demonstrate the flow; the script returns a very basic JSON response  structure (again, this is for this example, you can implement this in any way you want):

### Success response:
```json
{
	"status": "ok",
	"path": "files/5a515f174dea7_Hot_Gril.jpg"
}
```

### Error response:
```json
{
	"status": "error",
	"message": "Exceeded filesize limit"
}
```

# Warning

This is a ***DEMO*** , the backend / PHP provided is very basic. You can use it as a starting point maybe, but ***do not use this on production***. It doesn't preform any server-side validation, checks, authentication, etc.


