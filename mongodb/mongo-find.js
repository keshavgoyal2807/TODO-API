var mongoclient = require('mongodb').MongoClient;
mongoclient.connect('mongodb://localhost:27017/test',(err,client) =>{
    var db =client.db('test');
    db.collection('todos').find().toArray().then((docs) => {
        console.log(docs);
    });
    client.close();
});