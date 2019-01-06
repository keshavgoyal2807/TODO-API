var request = require('supertest');
var expect = require('expect');

var server = require('./../server').app;
var Todo = require('./../models/todo').Todo;

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