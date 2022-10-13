const express = require( 'express' );
var app=express();
const  passport = require("passport");

const GoogleStrategy = require( "passport-google-oauth20" );
const googleapi = require ("./googleapikey.js"); //clave de api y client id de Google

app.get("/", (request,response)=>{
    response.render("index");
})

app.listen(process.env.puerto);
app.set('view engine', 'ejs');
//console.log("Escuchando en puerto: ", process.env);

app.post("/login", (request,response)=>{
    response.send("Pagina de Login");
})

// IDENTIFICACION CON CUENTA DE GOOGLE CON PASSPORT

passport.use ( new GoogleStrategy(
    {
        clientID:googleapi.client_id ,
        clientSecret: googleapi.client_secret,
        callbackURL: googleapi.redirect_uris ,

    }, function (accessToken, refreshToken, profile, cb) {
        var user = {
            accessToken: accessToken,
            refreshToken: refreshToken,
            profile: profile
        };
        return cb(null, user);
    }
) );
//password llama a esta funcion cuando se completa un login de usuario
// se almacena el usuario en sesion
passport.serializeUser( function(user,done) {
    done
})
//password llama a esta funcion para localizar datos usuario almacenados 
// en la sesion
passport.deserializeUser( function(user,done) {
    done
})
