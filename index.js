const functions = {
	"isset": function(value){
		return (typeof value !== "undefined" && value !== '');
	},
	"htmlspecialchars": function(unsafeString){
		if(typeof unsafeString !== "string")
			throw new Error("TypeError: htmlspecialchars expected a String as argument, argument type is ".concat(typeof unsafeString));
		return unsafeString.replace(/\&/g, "&amp;").replace(/\</g, "&lt;").replace(/\>/g, "&gt;").replace(/\"/g, "&quot;").replace(/\'/g, "&apos;");
	},
	"explode": function(separator, originalString, limit){
		if(typeof separator !== "string")
			throw new Error("TypeError: explode expected a String as separator, separator type is ".concat(typeof separator));
		if(typeof originalString !== "string")
			throw new Error("TypeError: explode expected a String as originalString, originalString type is ".concat(typeof originalString));
		if(typeof limit === "undefined")
			return originalString.split(separator);
		else
		{
			if(typeof limit !== "number")
				throw new Error("TypeError: explode expected a Number as limit, limit type is ".concat(typeof limit));
			else
			{
				if(limit === 1 || limit === 0)
					return [originalString];
				if(limit > 0)
				{
					let splitted = originalString.split(separator);
					let joining = new Array();
					if(limit >= splitted.length)
						return splitted;
					while(splitted.length !== limit-1)
						joining.push(splitted.pop());
					splitted.push(joining.join(separator));
					return splitted;
				}
				if(limit < 0){
					let splitted = originalString.split(separator);
					if(0 - limit > splitted.length)
						return new Array();
					for(let i = 0;i > limit;i--)
						splitted.pop();
					return splitted;
				}
			}
		}
	},
	"header": function(HTTPHeader, res){
		if(typeof HTTPHeader !== "string")
			throw new Error("TypeError: header expected a String as HTTPHeader, HTTPHeader type is ".concat(typeof HTTPHeader));
		if(typeof res !== "object")
			throw new Error("TypeError: header expected an Object as request, request type is".concat(typeof request));
		let splitted = HTTPHeader.split(":");
		let headerName = splitted[0];
		splitted.shift();
		let headerValue = splitted.join(":");
		res.set(headerName, headerValue);
		return undefined;
	},
	"urldecode": decodeURI,
	"move_uploaded_file": function(file, newPath, callback){
		if(typeof file !== "object")
			throw new Error("TypeError: header expected an Object as file, request type is".concat(typeof file));
		if(typeof newPath !== "string")
			throw new Error("TypeError: header expected a String as newPath, newPath type is ".concat(typeof newPath));
		file.mv(newPath, callback);
	},
	"include": function(file, res){
		throw new Error("PJP Error: include function is not implemented for now !");
	},
	"applyCookies": function(req, res){
		Object.keys(req.serverFunctions._COOKIE).forEach(function(cookieName){
			if(typeof req.serverFunctions._COOKIE[cookieName] === "undefined")
				delete req.serverFunctions._COOKIE[cookieName];
			if(req.serverFunctions._COOKIE[cookieName] !== req.cookies[cookieName])
				res.cookie(cookieName, req.serverFunctions._COOKIE[cookieName]);
		});
	}
};

const main = function(globalElement, bodyParserVerificationSkip, cookieParserVerificationSkip, expressFileUploadVerificationSkip, expressSessionVerificationSkip){
	//Verifying...
	if(typeof globalElement.app === "undefined")
		throw new Error("Error: app is undefined, please set the value of app to express().");
	if(typeof globalElement.express === "undefined")
		throw new Error("Error: express is undefined, please set the value of express to require(\"express\").");
	if(typeof globalElement.bodyParser === "undefined" && !bodyParserVerificationSkip)
		throw new Error("Error: bodyParser is undefined, please set the value of bodyParser to require(\"body-parser\"), or use the function paramater to skip this verification if you named it differently.");
	if(typeof globalElement.cookieParser === "undefined" && !cookieParserVerificationSkip)
		throw new Error("Error: cookieParser is undefined, please set the value of cookieParser to require(\"cookie-parser\"), or use the function paramater to skip this verification if you named it differently.");
	if(typeof globalElement.expressFileUpload === "undefined" && typeof globalElement.fileUpload === "undefined" && !expressFileUploadVerificationSkip)
		throw new Error("Error: expressFileUpload is undefined, please set the value of expressFileUpload or fileUpload to require(\"express-fileupload\"), or use the function paramater to skip this verification if you named it differently.");
	if(typeof globalElement.session === "undefined" && typeof globalElement.expressSession === "undefined" && !expressSessionVerificationSkip)
		throw new Error("Error: expressSession is undefined, please set the value of expressSession or session to require(\"express-session\"), or use the function paramater to skip this verification if you named it differently.");
	Object.keys(functions).forEach(function(functionName){
		globalElement[functionName] = functions[functionName];
	});
};

main.router = function(globalElement, ip, domainName){
	return function(req, res, next){
		let argv = globalElement["process"]["argv"];
		argv.shift();
		if(req.files)
			Object.keys(req.files).forEach(function(file){
				file["mimetype"] = file["type"];
				file["tmp_name"] = globalElement["process"]["platform"].indexOf("win") !== -1 ? file["tempFilePath"].split("\\")[file["tempFilePath"].split("\\").length-1] : file["tempFilePath"].split("\/")[file["tempFilePath"].split("\/").length-1];
			});
		let _REQUEST = req.cookies;
		Object.keys(req.query).forEach(function(param){
			_REQUEST[param] = req.query[param];
		});
		Object.keys(req.body).forEach(function(entry){
			_REQUEST[entry] = req.body[entry];
		});
		req.serverFunctions = {
			"GLOBALS": globalElement,
			"_SERVER": {
				"NODEJS_SELF": globalElement["__filename"],
				"PHP_SELF": req.path,
				"argv": argv,
				"argc": argv.length,
				"GATEWAY_INTERFACE": "NodeJS/".concat(globalElement["process"]["version"]["replace"]("v", "")),
				"SERVER_ADDR": ip,
				"SERVER_NAME": typeof domainName === "undefined" ? ip : domainName,
				"SERVER_SOFTWARE": "ExpressJS/".concat(globalElement["process"]["versions"]["express"]).concat("-PJP/".concat(require("./package.json")["version"])),
				"SERVER_PROTOCOL": req.httpVersion,
				"REQUEST_METHOD": req.method,
				"REQUEST_TIME": Math.floor(new Date().now / 1000),
				"REQUEST_TIME_FLOAT": new Date().now / 1000,
				"REQUEST_TIME_MILLI": new Date().now,
				"QUERY_STRING": require("url").parse(req.originalUrl).query,
				"DOCUMENT_ROOT": globalElement["__dirname"],
				"HTTP_ACCEPT": req.get("Accept"),
				"HTTP_ACCEPT_CHARSET": req.get("Accept-Charset"),
				"HTTP_ACCEPT_ENCODING": req.get("Accept-Encoding"),
				"HTTP_ACCEPT_LANGUAGE": req.get("Accept-Language"),
				"HTTP_CONNECTION": req.get("Connection"),
				"HTTP_HOST": req.get("Host"),
				"HTTP_REFERER": req.get("Referer"),
				"HTTP_USER_AGENT": req.get("User-Agent"),
				"HTTPS": req.protocol === "https",
				"HTTP": req.protocol === "http",
				"REMOTE_ADDR": req.ip || req.connection.remoteAddress,
				"XFF_REMOTE_ADDR": req.get("X-Forwarded-For"),
				"XFF_REMOTE_ADDR_SAFE": req.get("X-Forwarded-For") ? globalElement["htmlspecialchars"](req.get("X-Forwarded-For")) : null,
				"HTTP_XFF": req.get("X-Forwarded-For"),
				"HTTP_X_FORWRDED_FOR": req.get("X-Forwarded-For"),
				"HTTP_FORWARDED": req.get("Forwarded"),
				"HTTPS_XFP": req.get("X-Forwarded-Proto") === "https",
				"HTTP_XFP": req.get("X-Forwarded-Proto"),
				"HTTP_XFP_SAFE": req.get("X-Forwarded-Proto") === "https" ? "https" : "http",
				"HTTP_X_FORWARDED_PROTO": req.get("X-Forwarded-Proto"),
				"HTTP_X_FORWARDED_PROTO_SAFE": req.get("X-Forwarded-Proto") === "https" ? "https" : "http",
				"REMOTE_HOST": typeof domainName === "undefined" ? ip : domainName,
				"REMOTE_PORT": req.connection.remotePort,
				"REMOTE_USER": ((function(){try{return Buffer.from(req.get("Authorization").split(" ")[1], 'base64').toString().split(":")[0]}catch{return "";};})()),
				//"REDIRECT_REMOTE_USER": not-implemented,
				"SCRIPT_FILENAME": argv[0],
				"SERVER_ADMIN": "me", //Hey, we're not using Apache2 !
				"SERVER_PORT": typeof process.env.PORT === "undefined" ? 80 : process.env.PORT, //It's 80 and not 443, because if you are a PHP developper, your server never gonna be secure
				"SERVER_SIGNATURE": "X. Press",
				"PATH_TRANSLATED": __dirname,
				"SCRIPT_NAME": __filename,
				"REQUEST_URI": req.originalUrl,
				"PHP_AUTH_USER": ((function(){try{return Buffer.from(req.get("Authorization").split(" ")[1], 'base64').toString().split(":")[0]}catch{return "";};})()),
				"PHP_AUTH_PW": ((function(){try{return Buffer.from(req.get("Authorization").split(" ")[1], 'base64').toString().split(":")[1]}catch{return "";};})()),
				"AUTH_TYPE": "bad", //Not secure !
				"PATH_INFO": req.path,
				"ORIG_PATH_INFO": req.path,
				"WHAT_ARE_YOU": "DOING_HERE_?" //Reply !
			},
			"_GET": req.query,
			"_POST": req.body,
			"_FILES": req.files,
			"_REQUEST": _REQUEST,
			"_SESSION": req.session,
			"_ENV": globalElement["process"]["env"],
			"_COOKIE": req.cookies,
			"http_request_header": req.headers,
			"http_response_header": "Never gonna just turn around, and deserve you !",
			"argc": argv.length,
			"argv": argv,
			"nodejs_errormsg": "Error: NodeJS Error because of Error's Error.",
			"php_errormsg": "Hey ! That's deprecated !"
		};
		res["echo"] = res["send"];
		res.set("server", req.serverFunctions._SERVER["SERVER_SOFTWARE"]);
		next();
	};
};

module.exports = main;
