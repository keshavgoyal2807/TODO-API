var mongoose = require('mongoose');
var validator = require('validator');
var jwt = require('jsonwebtoken');
var lodash = require('lodash');
var bcrypt = require('bcryptjs');

var UserSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        minlength:1,
        trim:true,
        unique:true,
        validate:{
            validator:validator.isEmail,
            message:'{VALUE} is not a proper email'
        }
    },
    password:{
        type:String,
        required:true,
        minlength:8
    },
    tokens:[{
        access:{
            type:String,
            required:true
        },
        token:{
            type:String,
            required:true
        }
    }]

});

UserSchema.methods.toJSON = function(){
    var user = this;
    var userObject = user.toObject();
    return lodash.pick(userObject,['email','_id']);
};

UserSchema.methods.generateAuthToken = function(){
    var user =this;
    var access = 'auth';
    var token = jwt.sign({id:user._id,access},'keshav').toString();
    user.tokens = user.tokens.concat([{access,token}]);
    return user.save().then(() => {
        return token;
    });
};

UserSchema.statics.findByToken = function(token){
    var User = this;
    var decoded;
    try{
        decoded = jwt.verify(token,'keshav');
    } catch(e){
        return Promise.reject();
    }

    return User.findOne({
        _id:decoded.id,
        'tokens.access':'auth',
        'tokens.token':token
    });
};

UserSchema.statics.findUser = function(email,password){
    var User =this;
    return User.findOne({email}).then((user) => {
        if(!user)
        {
            return Promise.reject();
        }
        return new Promise((resolve,reject) => {
            bcrypt.compare(password,user.password,(err,res) => {
                if(err)
                {
                    reject();
                }
                else if(res)
                {
                    resolve(user);
                }
                else{
                    reject();
                }
            });
        });

    }).catch((e) => {
        return Promise.reject();
    });
};

UserSchema.pre('save',function(next){
    var user = this;
    if(user.isModified('password'))
    {
    bcrypt.genSalt(10,(err,salt) => {
        bcrypt.hash(user.password,salt,(err,hash) => {
            user.password=hash;
            next();
        });
    });
    }   
    else
    {
        next();
    }
});

var User = mongoose.model('User',UserSchema);

// console.log(UserSchema.methods);

module.exports = {
    User
};