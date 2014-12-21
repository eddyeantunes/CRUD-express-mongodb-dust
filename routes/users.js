var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: Number
});
var Users = mongoose.model('Users', UserSchema);


exports.allUsers = function(req, res){
    Users.find({}, function(err, docs) {
        res.render('users', {users: docs});
    });
};

exports.newUser = function(req, res){
    res.render('users/new');
};

exports.addUser = function(req, res){
    var b = req.body;
    new Users({
        name: b.name,
        email: b.email,
        phone: b.phone
    }).save(function(err, user) {
            if(err) res.json(err);
            res.redirect('/users/' + user.name);
        });
};

exports.findUser = function(req, res, next, name){
    Users.find({name:name}, function(err, docs) {
        req.user = docs[0];
        next();
    });
};

exports.showUser = function(req, res){
    res.render('users/show', {user:req.user});
};

exports.editUser = function(req, res){
    res.render('users/edit', { user:req.user});
};

exports.updateUser = function(req, res){
    var b = req.body;
    Users.update(
        { name: req.params.name },
        {name: b.name, email: b.email, phone: b.phone},
            function(err) {
                res.redirect('/users/' + b.name);
            }
    );
};

exports.deleteUser = function(req, res){
    Users.remove({name:req.params.name}, function(err) {
        res.redirect('/users');
    });
};