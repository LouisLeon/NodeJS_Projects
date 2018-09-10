module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getPublisher(res, mysql, context, complete){
         mysql.pool.query("SELECT Publisher.id, Publisher.name from Publisher", function(error, results, fields){
             if(error){
                 res.write(JSON.stringify(error));
                 res.end();
             }
             context.publisher = results;
             complete();
         });
    }

    // /*Display all publishers*/

    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        var mysql = req.app.get('mysql');
            (res, mysql, context, complete);
        getPublisher(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('publisher', context);
            }

        }
    });

    /* Adds a publisher, redirects to the publishers page after adding */

    router.post('/', function(req, res){
        var mysql = req.app.get('mysql');
        var inserts = [req.body.publishername];
        var sql = "INSERT INTO Publisher (name) VALUES (?)";
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/publisher');
            }
        });
    });


    return router;
}();
