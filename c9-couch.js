var http = require('http');
function onRequest(req,res) {
    var postData = '';
    req.addListener("data", function(postDataChunk) {
        postData += postDataChunk;
    });
    req.addListener("end", function() {
        makeCouchRequest(req.url, req.method, postData, function(cdata, ct) {
            res.writeHead(200, {
                'Content-Type': ct
            });
            res.end(cdata);
        });
    });        
};
function makeCouchRequest(url,method,data, cb){
    var req = http.request({
        host: process.env.COUCHIP || "127.0.0.1",
        port: process.env.COUCHPORT || 5984,
        path: url,
        method: method
    },function(response){
        var str='';
        response.on('data', function(chunk){
            str += chunk;
        });
        response.on('end', function(){
            cb(str,response.headers['content-type']);
        });

    });
    req.write(data);
    req.end();
};
var server = http.createServer(onRequest); console.log('c9couch server created'); server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("c9couch server listening at", addr.address + ":" + addr.port);
});