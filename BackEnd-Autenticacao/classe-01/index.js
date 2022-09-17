 const  express = require('express')
 const rotas = require('./rotas');

 const app = express ();


 app.use(express.json());
 app.use(rotas);

 app.get ('/',(req,res)=>{
    res.json('tudo certo')
 });
 
 app.listen(3000)