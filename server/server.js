var express = require('express');
var bodyparser = require('body-parser');
var objectid = require('mongodb').ObjectID;
var lodash = require('lodash');

var mongoose = require('./db/mongoose').mongoose;
var Todo = require('./models/todo').Todo;
var User = require('./models/user').User;
var port = process.env.PORT || 3000;

console.log(process.env.MONGODB_URI);
var app = express();

app.use(bodyparser.json());

app.post('/todos',(req,res) => {
    Todo.create({
        text:req.body.text
    },(err,res1) => {
        if(err)
        {
            res.status(400).send(err);
        }
        res.send(res1);
    });
});


app.get('/todos',(req,res) => {
    Todo.find().then((todos) => {
        res.send(todos);
    }).catch((e) => {
        res.status(400).send(e);
    })
});

app.get('/todos/:id',(req,res) => {
    var id = req.params.id;

    if(!objectid.isValid(id))
    {
        res.status(404).send('invalid id');
        return;
    }
    Todo.findById(id,(err,res1) => {
        if(err)
        {
            res.status(400).send(e);
            return;
        }
        if(!res1)
        {
            res.status(404).send('empty');
        }
        else{
            res.send(res1);
        }
    });

});

app.delete('/todos/:id',(req,res) => {
    var id = req.params.id;
    if(!objectid.isValid(id))
    {
        return res.status(404).send('invalid');
    }
    Todo.findByIdAndDelete(id,(err,res1) => {
        if(err)
        {
            return res.status(400).send('error');
        }
        if(!res1)
        {
            return res.status(404).send('empty');
        }
        return res.status(200).send(res1);
    });
});

app.patch('/todos/:id',(req,res) => {
    var id = req.params.id;
    var body = lodash.pick(req.body,['text','completed']);

    if(lodash.isBoolean(body.completed) && body.completed)
    {
        // console.log('lodash');
        body.completedAt = new Date().getTime();
    }
    else
    {
        body.completed=false;
        body.completedAt=null;
    }

    if(!objectid.isValid(id))
    {
        return res.status(404).send('invalid id');
    }

    Todo.findByIdAndUpdate(id,{$set : body},{new:true},(err,res1) => {
        if(err)
        {
            return res.status(400).send('error');
        }
        if(!res1)
        {
            return res.status(404).send('no id exist');
        }
        res.status(200).send(res1);
    });
});
app.listen(port,(err,res) => {
    if(err)
    {
        return console.log('Unable to connect');
    }
    console.log(`connected to port ${port}`);
});

module.exports = {
    app
}

