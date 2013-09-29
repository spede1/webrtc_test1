var fs = require('fs');        
var http = require('http');

var filepath = __dirname + '/strm.txt';
fs.open(filepath, 'r', function(err, fd) {
  fs.createWriteStream(null, {fd: fd, encoding: 'utf8'});
//  fs.createReadStream(null, {fd: fd, encoding: 'utf8'});
  fs.on('data', console.log);
});

var writeStream = fs.createReadStream(__dirname + '/strm.txt');

http.createServer(function(req, res) {
  req.on('data', function(data) {
    writeStream.write(data);
  });
  
  res.writeHead(200, {
    'Content-type': 'text/plain',
    'Cache-control': 'max-age=3600'
  });
  
  res.end(req.url);
}).listen(4000);
