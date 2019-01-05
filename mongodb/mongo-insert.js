var mongo = require('mongodb').MongoClient;
mongo.connect('mongodb://localhost:27017/test',(err,client) =>{
    if(err)
    {
         return console.log("ERROR");
    }
    console.log('SUCCESS');
    var db = client.db('test');
    db.collection('todos').insertOne({
        user:"arpitha1"
    },(err,res) => {
        if(err)
        {
            return console.log('unable to add',err);
        }
        console.log(JSON.stringify(res.ops));
    });
    client.close();
});