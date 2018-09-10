module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getAuthor(res, mysql, context, complete){
         mysql.pool.query("SELECT Author.id, Author.name, Author.dob from Author", function(error, results, fields){
             if(error){
                 res.write(JSON.stringify(error));
                 res.end();
             }
             context.author = results;
             complete();
         });
    }

    // /*Display all authors. Requires web based javascript to delete users with AJAX*/

    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        var mysql = req.app.get('mysql');
            (res, mysql, context, complete);
        getAuthor(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('author', context);
            }

        }
    });

    /* Adds an author, redirects to the authors page after adding */

    router.post('/', function(req, res){
        var mysql = req.app.get('mysql');
        var inserts = [req.body.authorname, req.body.authordob];
        var sql = "INSERT INTO Author (name, dob) VALUES (?, ?)";
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/author');
            }
        });
    });

    return router;
}();
