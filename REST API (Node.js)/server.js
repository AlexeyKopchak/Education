var http    = require('http');
var router  = require('./router');

var port = 3000;

function myServer(req, res){
    
    router.route(req, res);
    res.end();
}

http.createServer(myServer).listen(port);
console.log('Server started on port ' + port);
