const mysql = require('mysql2');
const client = require("../caching/caching.js")

require('dotenv').config();

 

  
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
  });
 
 connection.connect((err)=>{
       if(err){
         console.log(err.message)
  }else{
       console.log("succesfully done")
      }
  });


  function select(id,response){
   var id  = parseInt(id)
  const sql = mysql.format("select  *  from  student  where  ? ",[{id}] )
  connection.query(sql, async function(err, results) {
        if(err){
         console.log(err)
       return  response.writeHead(400, { 'Content-Type': 'text/plain' })
          
        }else {
            response.writeHead(200, { 'Content-Type': 'text/plain' })
            response.write(JSON.stringify(results))
            await client.set(id+"", JSON.stringify(results));
            response.end()
 
        }
     })  ;
    }


module.exports=select






