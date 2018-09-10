module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getGenre(res, mysql, context, complete){
         mysql.pool.query("SELECT Genre.id, Genre.name from Genre", function(error, results, fields){
             if(error){
                 res.write(JSON.stringify(error));
                 res.end();
             }
             context.genre = results;
             complete();
         });
    }

    // /*Display all books. Requires web based javascript to delete users with AJAX*/

    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        var mysql = req.app.get('mysql');
            (res, mysql, context, complete);
        getGenre(res,mysql,context,complete); 
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('genre', context);
            }

        }
    });

    /* Adds a Book, redirects to the library page after adding */

    router.post('/', function(req, res){
        var mysql = req.app.get('mysql');
        var inserts = [req.body.genrename];
        var sql = "INSERT INTO Genre (name) VALUES (?)";
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/genre');
            }
        });
    });

    return router;
}();
