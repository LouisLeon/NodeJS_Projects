module.exports = function(){
    var express = require('express');
    var router = express.Router();


    /*Get all users*/

    function getUsers(res, mysql, context, complete){
         mysql.pool.query("SELECT id, name, dob FROM Users", function(error, results, fields){
             if(error){
                 res.write(JSON.stringify(error));
                 res.end();
             }
             context.user = results;
             complete();
         });
    }

    /*Get a specific user*/

    function getUser(res, mysql, context, id, complete){
	 var sql = "SELECT id, name, dob FROM Users WHERE id = ?";
         var inserts = [id];
	 mysql.pool.query(sql, inserts, function(error, results, fields){
             if(error){
                 res.write(JSON.stringify(error));
                 res.end();
             }
             context.singleuser = results[0];
             complete();
         });
    }
    
    /*Get a specific user's books*/

    function getLoans(res, mysql, context, id, complete){
	 var sql = "SELECT id, Books.title, loanedDate, dueDate FROM LoanedTo LEFT JOIN Books ON Books.id = LoanedTo.bid WHERE uid = ?";
         var inserts = [id];
	 mysql.pool.query(sql, inserts, function(error, results, fields){
             if(error){
                 res.write(JSON.stringify(error));
                 res.end();
             }
             context.loans = results;
             complete();
         });
    }
   
    function getBooks(res, mysql, context, complete){
         mysql.pool.query("SELECT Books.id, Books.title, Books.pubDate, Author.name FROM Books LEFT JOIN Author ON Author.id = Books.authorid", function(error, results, fields){
             if(error){
                 res.write(JSON.stringify(error));
                 res.end();
             }
             context.book = results;
             complete();
         });
    }
   
    /*Display all users. Requires web based javascript to delete users with AJAX*/

    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        //context.jsscripts = ["deletebook.js"];
        var mysql = req.app.get('mysql');
            (res, mysql, context, complete);
        getUsers(res,mysql,context,complete); 
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('user', context);
            }

        }
    });

    /* Display one user's data for the specific purpose of updating loaned books */
    
    router.get('/:id', function(req, res){
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["updateloans.js", "deleteloan.js"];
        var mysql = req.app.get('mysql');
        getUser(res, mysql, context, req.params.id, complete); 
        getLoans(res, mysql, context, req.params.id, complete); 
        getBooks(res, mysql, context, complete); 	
	function complete(){
            callbackCount++;
            if(callbackCount >= 3){
                res.render('update-loaned', context);
            }

        }
    });
    
    /* Adds a user, redirects to the users page after adding */
    
    router.post('/', function(req, res){
        var mysql = req.app.get('mysql');
        var inserts = [req.body.username, req.body.userdob];
        var sql = "INSERT INTO Users (name, dob) VALUES (?,?)";
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            } else {
		res.redirect('/user');
	    }
        });
    });

    /* The URI that update data is sent to in order to update a book */
    
    router.put('/:id', function(req, res){
        var currDate = new Date();
	var dueDate = new Date(+currDate + 12096e5);

	var mysql = req.app.get('mysql');
        var sql = "INSERT INTO LoanedTo (uid, bid, loanedDate, dueDate) VALUES (?, ?, ?, ?)";
        var inserts = [req.params.id, req.body.title, currDate.toISOString(), dueDate.toISOString()];
	sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
		console.log(error);
		res.write(JSON.stringify(error));
                res.end();
            }else{
                console.log("Hello");
		res.status(200);
		res.end();
            }
        });
    });
    
    router.delete('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM LoanedTo WHERE bid = ?";
        var inserts = [req.params.id];
        sql = mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.status(400);
                res.end();
            }else{
                res.status(202).end();
            }
        })
    })
    
    return router;
}();

