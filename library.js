module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getBooks(res, mysql, context, complete){
         mysql.pool.query("SELECT Books.id, Books.title, Books.pubDate, Author.name, Publisher.name AS publishername, GenreNames.name AS genrename FROM Books LEFT JOIN Author ON Author.id = Books.authorid LEFT JOIN Publisher ON Publisher.id = Books.publisherid LEFT JOIN (SELECT bid,gid,name FROM BookGenre LEFT JOIN Genre ON Genre.id = BookGenre.gid) AS GenreNames ON GenreNames.bid = Books.id", function(error, results, fields){
             if(error){
                 res.write(JSON.stringify(error));
                 res.end();
             }
             context.book = results;
             complete();
         });
    }

    function searchBooks(res, mysql, context, search, complete){
         var sql = "SELECT Books.id, Books.title, Books.pubDate, Author.name FROM Books LEFT JOIN Author ON Author.id = Books.authorid WHERE Books.title LIKE ?";
	 var inserts = [search];
	 mysql.pool.query(sql, inserts, function(error, results, fields){
             if(error){
                 res.write(JSON.stringify(error));
                 res.end();
             }
             context.book = results;
             complete();
         });
    }
    
    function getBook(res, mysql, context, id, complete){
        var sql = "SELECT Books.id, Books.title, Books.pubDate, Books.authorid, Books.publisherid, GenreNames.gid FROM Books LEFT JOIN (SELECT gid,bid,name FROM BookGenre LEFT JOIN Genre ON Genre.id = BookGenre.gid) AS GenreNames on GenreNames.bid = Books.id WHERE Books.id = ?";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.singlebook = results[0];
            complete();
        });
    }

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
        context.jsscripts = ["deletebook.js"];
        var mysql = req.app.get('mysql');
            (res, mysql, context, complete);
        getBooks(res, mysql, context, complete);
        getPublisher(res, mysql, context, complete);
        getAuthor(res, mysql, context, complete);
        getGenre(res,mysql,context,complete); 
        function complete(){
            callbackCount++;
            if(callbackCount >= 4){
                res.render('library', context);
            }

        }
    });

    /* Display all books matching search criteria  */

    router.get('/search', function(req, res){
        callbackCount = 0;
        var context = {};
        var mysql = req.app.get('mysql');
        var search = req.query.search;
	searchBooks(res, mysql, context, search, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('library', context);
            }

        }
    });
   
    /* Display one book for the specific purpose of updating books */

    router.get('/:id', function(req, res){
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["selectedpublisher.js","selectedauthor.js","selectedgenre.js","selectedpubdate.js","updatebook.js"];
        var mysql = req.app.get('mysql');
        getBook(res, mysql, context, req.params.id, complete);
        getPublisher(res, mysql, context, complete);
        getAuthor(res, mysql, context, complete);
        getGenre(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 4){
                res.render('update-book', context);
            }

        }
    });
    
    /* Adds a Book, redirects to the library page after adding */

    router.post('/', function(req, res){
        var mysql = req.app.get('mysql');
        var inserts = [req.body.publishername, req.body.authorname, req.body.title, req.body.pubDate, req.body.genre];
        var sql = "INSERT INTO Books (publisherid,authorid,title,pubDate) VALUES (?,?,?,?)";
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
        });
        
	var inserts2 = [req.body.genre, req.body.title];
        var sql2 = "INSERT INTO BookGenre (gid,bid) VALUES (?,(SELECT id FROM Books WHERE title = ?))";
        sql2 = mysql.pool.query(sql2, inserts2, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/library');
            }
        });
    });

    /* The URI that update data is sent to in order to update a book */

    router.put('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "UPDATE Books SET publisherid=?, authorid=?, title=?, pubDate=? WHERE id=?";
        var inserts = [req.body.publishername, req.body.authorname, req.body.singlebooktitle, req.body.singlebookpubDate, req.params.id];
        console.log(inserts);
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.status(200);
                res.end();
            }
        });
    });

    router.delete('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM Books WHERE id = ?";
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
