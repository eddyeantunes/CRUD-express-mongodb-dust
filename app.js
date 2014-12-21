
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/users');
var http = require('http');
var path = require('path');
var cons = require('consolidate');
var mongoose = require('mongoose');

var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var app = express();

// assign the dust engine to .dust files
app.engine('dust', cons.dust);

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'dust');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// Database config
var db_url;
var localDb = "mongodb://localhost/storedata";
var liveDb = "mongodb://<dbuser>:<dbpassword>@ds029051.mongolab.com:29051/kesav";
db_url = (env === 'development') ? localDb : liveDb;
mongoose.connect(db_url);

// Routes
app.get('/', routes.index);

app.get('/users', user.allUsers);
app.get('/users/new', user.newUser);
app.post('/users', user.addUser);
app.param('name', user.findUser);
app.get('/users/:name', user.showUser);
app.get('/users/:name/edit', user.editUser);
app.put('/users/:name', user.updateUser);
app.delete('/users/:name', user.deleteUser);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
