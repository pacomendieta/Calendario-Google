

const express= require('express');
const passport= require('passport')
const path= require('path')
const GoogleStrategy= require('passport-google-oauth20').Strategy


var app=express();

// Express-Session 
const session = require('express-session');
app.use(session( {
  secret:['fsdfsdfsdafdscc11rr', 'kpjffsffas'],
  saveUninitialized: false,
  resave: false
}))

// DATOS DE LA APP REGISTRADOS EN GOOGLE DEVELOPPER CONSOLE
const googleapi = require('./googleapikey') //clave de api y client id de Google
CLIENT_ID=googleapi.client_id
CLIENT_SECRET=googleapi.client_secret
CALLBACK_URL=googleapi.redirect_uris[0]



// configuring passport middleware
app.use(passport.initialize())
app.use(passport.session())

//passPORT llama a esta funcion tras login de usuario
passport.serializeUser( function(user,done) {
    // user = var user  definido en la funcion pasada a passport.use
    done(null,user);
}) 
//passport llama a esta funcion para localizar datos usuario almacenados en la sesion
passport.deserializeUser( function(user,done) {
    done(null,user); //accion final obligada. null=no hay error.
})

//console.log("GOOGLE API:", googleapi)

// IDENTIFICACION CON CUENTA DE GOOGLE CON PASSPORT  Configurar Estrategia de Autenticación => Autenticacion con clave Oauth en Google
passport.use ( new GoogleStrategy(
    {
        clientID: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        callbackURL: CALLBACK_URL 
    }, 
    
    async function (accessToken, refreshToken, profile, email,cb) {
        // Los datos que se meten en el objeto que se retorna (user)
        // son los que se cogen del perfil de Google y se 
        // almacenaran en request.session si login ok
        var user = {
            accessToken: accessToken,   //enviar en peticiones a Google
            refreshToken: refreshToken, //usar para refrescar accessToken expirado
            profile: profile,
            email: email
        };
        return cb(null, user);
    }
) );

// HOME PAGE
app.get("/", (req,res)=>{
   res.render("index");
   //res.sendFile(path.join(__dirname + '/public/index.html'))
})




// PAGINA SUCCESS - LOGIN OK
app.get('/success', (req, res)=>
{
    //res.send(req.session)
    //res.sendFile(path.join(__dirname + '/public/loginok.html'))
    //res.render('success',{req:req.passport.user.email.emails[0].value})
    res.render('success',{ req:req })
})

// PAGINA DE LOGIN - Proceso de Autenticacion
app.get('/google/auth',
  passport.authenticate('google', {
    scope: ['profile', 'email', 'https://www.googleapis.com/auth/calendar']})
)

//PAGINA DE CALLBACK
app.get('/auth/google/callback',
  passport.authenticate('google', {failureRedirect: '/'}),
  (req, res)=>
  {
    res.redirect('/success')
  }
)

// running server
app.listen(process.env.puerto, ()=>{
    console.log("Server is running on Port " + process.env.puerto)  
});
app.set('view engine', 'ejs');


//Pagina de error de autenticacion
//app.get("/auth/error", (request,response)=>{
//    response.send("ERROR EN LA AUTENTICACION !!")
//})