var url  = require('url');

function route (req, res){
    var my_url = url.parse(req.url).pathname;

    res.write('Hello, im router' + '\n');
    res.write('My path = '+ url.parse(req.url, true).path + '\n');
    res.write('My pathname = '+ url.parse(req.url).pathname + '\n');
    res.write('My query = '+ url.parse(req.url).query + '\n');
    res.write('My method is ' + req.method + '\n');

    parseQuery(url.parse(req.url).query);
};

function parseQuery (query_url_part){
    var query_arr = query_url_part.split('&');
    var query_arr_len = query_arr.length;

    var my_db = {};
    var queries, temp, i, l;

    queries = query_url_part.split("&");
    for ( i = 0, l = queries.length; i < l; i++ ) {
        temp = queries[i].split('=');
        my_db[temp[0]] = temp[1];
    }

    var my_big_db = [];
    my_big_db.users[0] = my_db.user;

    var json_arr = JSON.stringify(my_db);

    console.log(query_arr);
    console.log(query_arr_len);
    console.log(my_db);

    console.log(my_big_db.users[0]);


};
exports.route = route;