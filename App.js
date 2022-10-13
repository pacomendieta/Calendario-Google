import express from 'express';
var app=express();


app.get("/", (request,response)=>{
    response.render("index");
})

app.listen(process.env.puerto);
app.set('view engine', 'ejs');
//console.log("Escuchando en puerto: ", process.env);