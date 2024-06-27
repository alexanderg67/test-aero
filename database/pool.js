const mysql = require('mysql2');
const   dbconfig={
  connectionLimit : 10,
  host     : 'localhost',
  user     : process.env.MYSQL_LOGIN , 
  password : process.env.MYSQL_PASSWORD  , 
  database : 'dbaero'  
}
 
module.exports=mysql.createPool(dbconfig).promise()