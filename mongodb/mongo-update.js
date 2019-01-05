var mongoclient = require('mongodb').MongoClient;

var url  = 'mongodb://localhost:27017/test';

mongoclient.connect(url,(err,client) => {
    if(err)
    {
        return console.log("Unable to connect to server");
    }
    var db = client.db('test');
    db.collection('todos').findOneAndUpdate({user:"arp"},{$inc: {age :1}},{returnOriginal:false});
    client.close();
});