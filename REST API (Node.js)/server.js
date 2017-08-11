var http    = require('http');
var router  = require('./router');

var port = 3000;

function myServer(myServerReq, myServerRes){
    
    router.route(myServerReq, myServerRes);
    myServerRes.end();
}

http.createServer(myServer).listen(port);
console.log('Server started on port ' + port);
