var express = require('express');
var bodyparser = require('body-parser');
var objectid = require('mongodb').ObjectID;

var mongoose = require('./db/mongoose').mongoose;
var Todo = require('./models/todo').Todo;
var User = require('./models/user').User;

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
    })
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
    })

});
app.listen(3000,(err,res) => {
    if(err)
    {
        return console.log('Unable to connect');
    }
    console.log('connected to port 3000');
});

module.exports = {
    app
}
