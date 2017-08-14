var express     = require('express');
var app         = express();
var mongoose    = require('mongoose');

 var mongo_url   = "mongodb://localhost:27017/data";
mongoose.connect(mongo_url);
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(){
    console.log("Connected to DB");
    //do operations which involve interacting with DB.
});

//Create a schema for Book
var car_control_Scheme = mongoose.Schema({
    name:   String,
    value:  Number
});
var Car = mongoose.model('Car', car_control_Scheme);

var car1 = Car({
    name: 'BMW',
    value: 34
}); 


app.get('/', function(req, res){
    res.writeHead(200, {'Content-Type': 'text/plain' });

    Car.find({name: 'BMW'}, (err, doc)=>{
        if (doc.name != "BMW"){
            car1.save(function (err) {
                if (err) throw new Error(err);
                res.write('Car added - ' + car1)
                console.log('Car added - ' + car1);
            });
        }
        else if (doc.name == "BMW") {
            res.write('Car allreary on the data base!')
            console.log('Car allreary on the data base!');
        };
    });
});


app.listen(3000, () => {
    console.log('Example app listening on port 3000!');
});
