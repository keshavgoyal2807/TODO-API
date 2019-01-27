var request = require('supertest');
var expect = require('expect');
var jwt = require('jsonwebtoken');
var server = require('./../server').app;
var Todo = require('./../models/todo').Todo;
var User = require('./../models/user').User;
var objectid = require('mongodb').ObjectID;

describe('check sever.js',() => {

    it('should check same data',(done) => {
        var text = "mocha test";
        request(server)
        .post('/todos')
        .send({
            text:text
        })
        .expect((res) =>{
            expect(res.body.text).toBe(text);
        })    
        .end(done);
    });


    it('should check wrong data',(done) => {
        request(server)
        .post('/todos')
        .send({})
        .expect(400)
        .end(done);
    });


});

describe('get/todos/:id', () => {
    var id = '5c29fc810a15384f845ff005';
    it('should pass if present',(done) => {
        request(server)
        .get(`/todos/${id}`)
        .expect(200)
        .expect((res) => {
            expect(res.body._id).toBe(id);
        })
        .end(done);
    });

    it('should pass if not present',(done) => {
        request(server)
        .get(`/todos/5c29fc810a15384f845ff006`)
        .expect(404)
        .end(done);
    });

    it('should pass if not valid',(done) => {
        request(server)
        .get(`/todos/5c29fc810a15384f845ff0`)
        .expect(404)
        .end(done);
    });
});


describe('update/todos/:id',() => {
    var id = '5c308101aa7dd30770324890';
    it('should update id',(done) => {
        request(server)
        .patch(`/todos/${id}`)
        .send({
            text:"update test",
            completed:true
        })
        .expect(200)
        .expect((res) => {
            // console.log(res.body);
                expect(res.body.text).toBe("update test");
                expect(res.body.completed).toBe(true);
            })
            .end(done);
        });
    });

var u1 = new objectid();
var u2 = new objectid();

var users = [
    {
        _id:u1,
        email:"kes@gmail.com",
        password:"keshav123",
        tokens:[
            {access:"auth",
            token:jwt.sign({id:u1,access:"auth"},'keshav').toString()}
        ]
    },
    {
        _id:u2,
        email:"kes123@gmail.com",
        password:"kes123hav",
    }
]

var user = new User(users[0]).save().then((done) => {done();}).catch((e) => {});
var user1 = new User(users[1]).save().then((done) => {done();}).catch((e) => {});

// Promise.all([user,user1]).then(() => {
//     console.log("123");
// }).catch((e) =>{
//     console.log(e);
// })

describe('check signup',() => {
    it('GET/users/me',(done) => {
        request(server)
        .get('/users/me')
        .set('x-auth',users[0].tokens[0].token)
        .expect(200)
        .expect((res) => {
            expect(res.body._id).toBe(users[0]._id.toString());
        })
        .end(done)
    })

    it('pass if unauthorized',(done) => {
        request(server)
        .get('/users/me')
        .expect(401)
        .end(done)
    })
})