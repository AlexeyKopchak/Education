var url     = require('url');
var fs      = require('fs');

var data_arr = [];
var json_arr;
var userData;

var unique_data;
var user_founded;


function route (routeReq, routeRes){
    console.log('Something happens');

    
    try{
        routePath('/user', routeReq, routeRes);
        routePath('/id', routeReq, routeRes);  
    }
    catch(err)
    {
        if (err) throw err;
    }
};

function parseQuery (query_url_part){
    if (query_url_part != null){
        var query_arr = query_url_part.split('&');
        var query_arr_len = query_arr.length;

        var my_db = {};
        var queries, temp, i, l;

        queries = query_url_part.split("&");

        for ( i = 0, l = queries.length; i < l; i++ ){
            temp = queries[i].split('=');
            my_db[temp[0]] = temp[1];
        };
        return my_db;
    }     
}

function routePath (user_path, pathReq, pathRes){

    if (url.parse(pathReq.url, true).pathname == user_path){                //Check - if path is valid

        userData = parseQuery(url.parse(pathReq.url).query);                //Get quary params from our URL
        pathRes.write('YAY! We are on ' + user_path + '\n');
        switch (pathReq.method){                                            //Get our method of path
            case 'GET':
               pathRes.write('We are on '+ pathReq.method + ' method' + '\n');
               dataGET(user_path, pathReq, pathRes);
            break;

            case 'POST':
                pathRes.write('We are on '+ pathReq.method + ' method'+ '\n');
                //POST can work only with /user path + only with non-empty quary part
                if ((userData != undefined) && (user_path == '/user')){
                    dataPOST(pathReq, pathRes);
                } 
                else {pathRes.write('Quary part is empty');}
            break;

            case 'PUT':
                pathRes.write('We are on '+ pathReq.method + ' method')
                //PUT work only on /id path + only with non-empty quary part
                if ((userData != undefined) && (user_path == '/id')){
                    dataPUT(pathReq, pathRes);
                }
                else {pathRes.write('Quary part is empty');}
                
            break;

            case 'DELETE':
                pathRes.write('We are on '+ pathReq.method + ' method')
                dataDEL(pathReq, pathRes);
            break;

            default:
                pathRes.write('This method is not supported :(')
            break;
        }
    }
};

function dataPOST(POST_Req, POST_Res){

    //read data from .json file
    json_arr = fs.readFileSync('./data.json', 'utf8');
    //if .json empty - skip parsing
    if (json_arr.length != 0){
        data_arr = JSON.parse(json_arr); 
    };

    //if our data is 1th elem of arr - add it anyway
    if (data_arr.length == 0){data_arr.push(userData);}
    //else - parse id's
    else {
        for (var i = 0; i < data_arr.length; i++){ 
            //check id for non uniqueness 
            if (data_arr[i].id == userData.id){
                //message it, if user id isn't uniqueness                                     
                console.log('This id allready in base');
                //change flag  
                unique_data = false;
                break;        
            }
        }
        //if id is unique - add item
        if (unique_data) {data_arr.push(userData);};
        //'clear' our flag
        unique_data = true;                        
        //converte and write to json
        json_arr = JSON.stringify(data_arr);
        fs.writeFile('data.json', json_arr, (write_err, write_ok)=> {
            if (write_err) throw write_err;
        })
    };   
};

function dataGET(GET_path, GET_Req, GET_Res){
    json_arr = fs.readFileSync('./data.json', 'utf8');
    //if .json empty - skip parsing
    if (json_arr.length != 0){
        data_arr = JSON.parse(json_arr); 
    };

    //its for /user path
    if (GET_path == '/user'){   
        for(var i = 0; i < data_arr.length; i++){
            GET_Res.write('User ID: ' + data_arr[i].id + '\n');
            GET_Res.write('User name: ' + data_arr[i].name + '\n');
            GET_Res.write('User age: ' + data_arr[i].age + '\n\n');
        };
    }
    //its for /id path
    else if (GET_path == '/id'){
        for(var i = 0; i < data_arr.length; i++){
            //try to find user with our id
            if (data_arr[i].id == userData.id){
                //if we find our id - put message
                GET_Res.write('User ID: ' + data_arr[i].id + '\n');
                GET_Res.write('User name: ' + data_arr[i].name + '\n');
                GET_Res.write('User age: ' + data_arr[i].age + '\n\n');
                //'clear' our flag
                user_founded = true;
            }
        };
        //put message if user with some id not found
        if (!user_founded) {GET_Res.write('User with ID: '+ userData.id + ' is missing');}
        user_founded = false;
    };
};

function dataPUT(PUT_Res, PUT_Req){
    json_arr = fs.readFileSync('./data.json', 'utf8');
    //if .json empty - skip parsing
    if (json_arr.length != 0){
        data_arr = JSON.parse(json_arr); 
    };

    for(var i = 0; i < data_arr.length; i++){
        //try to find user with our id
        if (data_arr[i].id == userData.id){
            //if we find our id - update data
            if (userData.name != undefined){
                 data_arr[i].name = userData.name;
            }
            if (userData.age != undefined){
                 data_arr[i].age = userData.age;
            }
        }
    };
    //'clear' our flag
    user_founded = true;

     //put message if user with some id not found
    if (!user_founded) {PUT_Res.write('User with ID: '+ userData.id + ' not found for update');}
    user_founded = false; 

    json_arr = JSON.stringify(data_arr);
    fs.writeFile('data.json', json_arr, (write_err, write_ok)=> {
        if (write_err) throw write_err;
    }); 
}

function dataDEL(DEL_Res, DEL_Req){
    json_arr = fs.readFileSync('./data.json', 'utf8');
    //if .json empty - skip parsing
    if (json_arr.length != 0){
        data_arr = JSON.parse(json_arr); 
    };

    for(var i = 0; i < data_arr.length; i++){
        //try to find user with our id
        if (data_arr[i].id == userData.id){
            //data_arr.splise(data_arr.indexOf(i), 1);
            delete data_arr[i].name;
            delete data_arr[i].age;
            delete data_arr[i].id;
        }
    };


    json_arr = JSON.stringify(data_arr);
    fs.writeFile('data.json', json_arr, (write_err, write_ok)=> {
        if (write_err) throw write_err;
    });

}



exports.route = route;
exports.parseQuery = parseQuery;