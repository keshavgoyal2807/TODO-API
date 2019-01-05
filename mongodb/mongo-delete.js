var mongoclient = require('mongodb').MongoClient;

mongoclient.connect('mongodb://localhost:27017/test',(err,client) => {
    if(err)
    {
        return console.log("Unable to connect to server");
    }
    var db = client.db('test');
    db.collection('todos').findOneAndDelete({user:"arpitha1"});
    client.close();
});