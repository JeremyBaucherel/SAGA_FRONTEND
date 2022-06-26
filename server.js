"use strict";

var http = require('http');
var fs = require('fs');


var CONFIG = JSON.parse(fs.readFileSync("package.json"));
console.log("CONFIG", CONFIG);
var VERSION = CONFIG['version'];

var STATIC_FILES = {};
var STATIC_PREFIX = '/static/' + VERSION + '/';
var STATIC_FILES_DIRPATH = './dist/';

console.log('SAGA-UI v' + VERSION);
console.log('- Static files served from:', STATIC_FILES_DIRPATH);

fs.readdir(STATIC_FILES_DIRPATH, function (err, files) {
  let numFiles = 0;
  if (files) {
    files.forEach(file => {
      fs.readFile(STATIC_FILES_DIRPATH + '/' + file, function (err, contents) {
        //STATIC_FILES[file] = contents;
      });
      numFiles += 1;
    });
  }
  console.log('- Static files served from memory:', numFiles);
});


function routeHome (req, res) {
  res.write(`<!DOCTYPE html>
      <html>
          <head>
              <meta http-equiv="Content-Type" content="text/html;charset=utf-8">  
              <meta http-equiv="X-UA-Compatible" content="IE=Edge" />
              <link rel=\"stylesheet\" href=\"/static/VAR_VERSION/app.css\" />        
          </head>
          <body>
              <div id="modal-root"></div>
              <div id="notifications"></div>
              <div id="body"></div>
              <script type=\"text/javascript\">
              window.app_title = 'SAGA';
              </script>
              <script src=\"/static/VAR_VERSION/app.js\"></script>
          </body>
      </html>`.replace(/VAR_VERSION/g, VERSION));
}

function routeStatic (req, res) {
  let fileName = req.url.substring(STATIC_PREFIX.length);
  let staticFilePath = STATIC_FILES_DIRPATH + '/' + fileName;
  
  if (fileName in STATIC_FILES) {  
    res.write(STATIC_FILES[fileName]);
  } else {
    if (fs.existsSync(staticFilePath) && fs.statSync(staticFilePath).isFile()) {
      if (staticFilePath.endsWith('.css')) {
        res.writeHead(200, {"Content-Type": "text/css"});
      }
      res.write(fs.readFileSync(staticFilePath));
    } else {
      res.writeHead(404);
    }
  }
}

let HTTP_PORT = process.env.OPENSHIFT_NODEJS_PORT || 80;
http.createServer(function (req, res) {
    console.log(req.method, req.url)
    if (req.url.startsWith(STATIC_PREFIX)) {
      routeStatic(req, res);
    } else {
      routeHome(req, res);    
    }
    res.end();
  }).listen(HTTP_PORT);


console.log('Listening on port ' + HTTP_PORT);