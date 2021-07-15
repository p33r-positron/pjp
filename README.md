# pjp
PJP: Javascript Pre-processor | Module to make things easier for PHP developpers

###Basic Setup
```javascript
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const expressFileUpload = require("express-fileupload");
const expressSession = require("express-session");
const path = require("path");
const PEP = require("../PEP");
const app = express();

PEP(global);

app.use(bodyParser.urlencoded({
        "extended": true
}));
app.use(cookieParser());
app.use(expressFileUpload({
        "uriDecodeFileNames": true,
        "safeFileNames": true,
        "preserveExtension": 12,
        "useTempFiles": true,
        "tempFileDir": path.join(__dirname, "temp"),
        "parseNested": true,
        "uploadTimeout": 0
}));
app.use(expressSession({
        "secret": String(Math.floor(Math.random() * 100000000000)).concat(String(Date().now)), //You can replace it by your own secret, ex: "MyS3cR37"
        "cookie": {},
        "name": "PEPSID"
}));
app.use(PEP.router(global, "127.0.0.1", "localhost"));

//Actual code

app.listen((!process.env.PORT ? 8080 : process.env.PORT), function(err){
  if(err)
    throw err;
  console.log("Everything seems to work, welcomne to PJP !");
});
```

###More set-up

\* -> Mandatory

```javascript
PEP(globalElement, bodyParserVerificationSkip, cookieParserVerificationSkip, expressFileUploadVerificationSkip, expressSessionVerificationSkip);K
```
\*globalElement -> global
(moduleName)VerificationSkip -> Default to false, if set to true it will skip verifying if module exists (Only skip if you named the middleware another way)

```javascript
app.use(PEP.router(globalElement, ip, domainName));
```

\*globalElement -> global
\*ip -> Your IP Address (127.0.0.1 or local or public, depends what are you doing)
domainName -> Your domain name if you have one, else don't put anything or put "localhost"

###Example

```javascript
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const expressFileUpload = require("express-fileupload");
const expressSession = require("express-session");
const path = require("path");
const PEP = require("../PEP");
const app = express();

PEP(global);

app.use(bodyParser.urlencoded({
	"extended": true
}));
app.use(cookieParser());
app.use(expressFileUpload({
	"uriDecodeFileNames": true,
	"safeFileNames": true,
	"preserveExtension": 12,
	"useTempFiles": true,
	"tempFileDir": path.join(__dirname, "temp"),
	"parseNested": true,
	"uploadTimeout": 0
}));
app.use(expressSession({
	"secret": String(Math.floor(Math.random() * 100000000000)).concat(String(Date().now)), //You can replace it by your own secret, ex: "MyS3cR37"
	"cookie": {},
	"name": "PEPSID"
}));
app.use(PEP.router(global, "127.0.0.1"));

app.get("/getMySourceCode", function(req, res){
	if(!isset($._SERVER["PHP_AUTH_USER"]) || !isset($._SERVER["PHP_AUTH_PW"]))
	{
		header("WWW-Authenticate: Basic realm=\"PJP Example Realm\"", res);
		return res.status(401).send("You canceled authentication, no source code for you ! >:(").end();
		//Using return end the callback, so use it instead of exit;
	}
	else
	{
		if($._SERVER["PHP_AUTH_USER"] === "admin" && $._SERVER["PHP_AUTH_PW"] === "12345")
		{
			fs.readFile(__filename, "utf-8", function(err, data){
				if(err)
					console.log(err);
				//Verifying if there is an error reading the file
				res.send(data);
			});
			//Replace __filename by "index.html" (for example) to read a file
			return;
		}
		else
		{
			return res.send("<div align=\"center\"><h1 style=\"font-size:72px;\"><font color=\"red\">FORBIDDEN !</font></h1></div>");
		}
	}
});

app.get("/*", function(req, res){ // app.get("/*") means http://website/everything (except /getMySourceCode) with HTTP GET
	let $ = req.serverFunctions;
	if(isset($._GET["name"]))
	{
		res.echo("Your name is "+htmlspecialchars($._GET["name"]).concat(" !"));
		//To concat use plus or .concat instead of Perl's dot.
	}
	else
	{
		res.echo(`
<form action="${req.path}">
	<input type="text" name="name"/>
	<button type="submit">Display my name !</button>
</form>
		`);
	//When you use `these strings` you can `put ${variables} and ${things() - 43}`
	}
});

app.listen((typeof process.env.PORT === "undefined" ? 8080 : process.env.PORT), function(err){
	if(err)
	{
		throw err;
	}
	else
	{
		console.log("Everything seems to work, welcome to PEP !");
    //I'm bad at writing documentations.
	}
});
```

###Features and things to know
At the beginning of a request's callback, put `let $ = req.serverFunctions;`.
PHP -> PJP
$\_SERVER -> $.\_SERVER
$\_GET -> $.\_GET
$\_POST -> $.\_POST //Need body-parser
$\_FILES -> $.\_FILES //Need express-fileupload
$\_COOKIE -> $.\_COOKIE //To see cookies //Need cookie-parser
$\_COOKIE -> applyCookies(req, res) or res.cookie(name, value) //To write cookies //Need cookie-parser
$\_REQUEST -> $.\_REQUEST
$\_SESSION -> $.\_SESSION //Need express-session
$\_ENV -> $.\_ENV
$\_COOKIE -> $.\_COOKIE //To see cookies //Need cookie-parser
$\_COOKIE -> applyCookies(req, res) or res.cookie(name, value) //To write cookies //Need cookie-parser
$http_response_header -> $.http_response_header
$argc -> $.argc
$argv -> $.argv
$php_errormsg -> $.php_errormsg

isset(value) -> isset(value)
htmlspecialchars(unsafeString) -> htmlspecialchars(unsafeString)
explode(separator, originalString, limit) -> explode(separator, originalString, limit)
header("HTTPHeader: Value") -> header("HTTPHeader: Value", res)
header("HTTP/X.X CODE MEANING") -> res.status(CODE)
urldecode(urlencoded) -> urldecode(urlencoded) or decodeURI(urlencoded)
move_uploaded_file(from, to) -> move_uploaded_file(file, newPath, callback)
Ex:
```javascript
move_uploaded_file($\_FILE["image"], "./gallery/".concat($\_FILE["image"].name), function(err){
  if(err)
    throw err;
  res.status(200).end();
  return;
});```
include(script) -> include(script) //NOT IMPLEMENTED, WIP
echo text -> res.echo(text) or res.send(text)

Good luck ?
