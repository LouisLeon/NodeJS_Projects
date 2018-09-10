/*  
    Uses express, dbcon for database connection, body parser to parse form data 
    handlebars for HTML templates  
*/

var express = require('express');
var mysql = require('./dbcon.js');
var bodyParser = require('body-parser');
var Handlebars     = require('handlebars');
var HandlebarsIntl = require('handlebars-intl');
HandlebarsIntl.registerWith(Handlebars);
var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});

//Handlebars.registerHelper('dateFormat', require('handlebars-dateformat'));

app.engine('handlebars', handlebars.engine);
app.use(bodyParser.urlencoded({extended:true}));
app.use('/static', express.static('public'));
app.set('view engine', 'handlebars');
app.set('port', process.argv[2]);
app.set('mysql', mysql);

app.use('/library', require('./library.js'));
app.use('/author', require('./author.js'));
app.use('/genre', require('./genre.js'));
app.use('/publisher', require('./publisher.js'));
app.use('/user', require('./user.js'));

app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});
