var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs340_leonl',
  password        : '0802',
  database        : 'cs340_leonl'
});

module.exports.pool = pool;
