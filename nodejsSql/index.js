var mysql = require('mysql');  
      
var TEST_DATABASE = 'data_1';  
var TEST_TABLE = 'sales02';  
  
//创建连接  
var client = mysql.createConnection({  
  user: 'root',  
  password: 'mysql',  
});  

client.connect();
client.query("use " + TEST_DATABASE);

client.query(  
  'SELECT * FROM '+TEST_TABLE,  
  function selectCb(err, results, fields) {  
    if (err) {  
      throw err;  
    }  
      
      if(results)
      {
          for(var i = 0; i < results.length; i++)
          {
              console.log("%s\t%s\t%s", results[i].Store, results[i].Date, results[i].Country);
          }
      }    
    client.end();  
  }  
); 