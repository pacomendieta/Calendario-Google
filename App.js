const express = require( 'express' );
var app=express();
const  passport = require("passport");

const GoogleStrategy = require( "passport-google-oauth20" ).Strategy;
const googleapi = require ("./googleapikey.js"); //clave de api y client id de Google

// Express-Session 
const session = require('express-session');
app.use(session( {
  secret:['fsdfsdfsdafdscc11rr', 'kpjffsffas'],
  saveUninitialized: false,
  resave: false
}))

// configuring passport middleware
app.use(passport.initialize())
app.use(passport.session())

app.get("/", (request,response)=>{
    response.render("index");
})

app.listen(process.env.puerto);
app.set('view engine', 'ejs');
//console.log("Escuchando en puerto: ", process.env);

console.log("GOOGLE API:", googleapi)

// IDENTIFICACION CON CUENTA DE GOOGLE CON PASSPORT
// Configurar Estrategia de Autenticación => Autenticacion con clave Oauth en Google
passport.use ( new GoogleStrategy(
    {
        clientID:googleapi.client_id ,
        clientSecret: googleapi.client_secret,
        callbackURL: googleapi.redirect_uris[0] ,

    }, async function (accessToken, refreshToken, profile, email,cb) {
        // Guardar datos de usuario recibidos en Sesion, BD, etc...
        //var user = {
        //    accessToken: accessToken,
        //    refreshToken: refreshToken,
        //    profile: profile
        //};
        return cb(null, email.id);
    }
) );
//password llama a esta funcion cuando se completa un login de usuario
// se almacena el usuario en sesion
passport.serializeUser( function(user,done) {
    // user = var user  definido en la funcion pasada a passport.use
    done(null,user);
})
//password llama a esta funcion para localizar datos usuario almacenados 
// en la sesion
passport.deserializeUser( function(user,done) {
    done(null,user); //accion final obligada. null=no hay error.
})
// PAGINA DE LOGIN - Proceso de Autenticacion
app.get('/google/auth',
  passport.authenticate('google', {scope: ['profile', 'email']})
)


//PAGINA DE CALLBACK
app.get('/auth/google/callback',
  passport.authenticate('google', {failureRedirect: '/'}),
  (req, res)=>
  {
    res.redirect('/success')
  }
)

// PAGINA SUCCESS - LOGIN OK
app.get('/success', (req, res)=>
{
  res.send("LOGIN OK. PAGINA SUCCESS")
})

//Pagina de error de autenticacion
app.get("/auth/error", (request,response)=>{
    response.send("ERROR EN LA AUTENTICACION !!")
})