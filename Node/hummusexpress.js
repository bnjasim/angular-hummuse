var express = require('express');
var swig = require('swig');
var favicon = require('serve-favicon');

var path = require('path');
var fs = require('fs');
//var bodyParser = require('body-parser')
var app = express();

//var static_dir = path.join(__dirname, 'static');
//app.use(bodyParser.urlencoded({extended: false}))
//app.use('/favicon.ico', express.static('/favicon.ico'));
app.use(favicon(path.join(__dirname, '/../favicon.ico')));
app.use('/static', express.static('static'));

// Template engine
app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', 'templates');
// disable cache in development. Later enable it!
app.set('view cache', false);
swig.setDefaults({ cache: false });



app.get('/', function(req, res) {
  res.render('home', {user_name:'binu', logout_url:'http://localhost:1370/welcome.html'});
})


app.listen(1370);
console.log('Server started at port 1370');
