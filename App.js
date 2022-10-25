

const express= require('express');
const passport= require('passport')
const path= require('path')
const GoogleStrategy= require('passport-google-oauth20').Strategy
const bodyParser = require("body-parser")
const moment = require("moment")   // convertidor de fechas
let AWS = require("aws-sdk")  

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

// INDEX PAGE  
app.get("/", (req,res)=>{
    res.render('pag-index', {req,res,islogged:isUserLogged(req,res)})
    //paginaHome.show({req,res,islogged:isUserLogged(req,res)})
   //res.sendFile(path.join(__dirname + '/public/index.html'))
})


const paginaHome = require('./controllers/home');
const Evento = require('./controllers/clienteCalendar');
const ClienteAWS = require('./controllers/clienteAWS');
const { EC2 } = require('aws-sdk');

// PAGINA HOME  / LOGGED USER 
app.get('/home', (req, res)=>
{
    if (! isUserLogged(req,res)) res.redirect('/')
    else 
    paginaHome.show( {req,res,islogged:true} )
    
})

// PAGINA DE LOGIN - Proceso de Autenticacion
app.get('/google/auth',
  passport.authenticate('google', {
    scope: ['profile', 'email', 'https://www.googleapis.com/auth/calendar']})
)



//body parser para recibir campos de formularios html en el req.body
app.use (bodyParser.urlencoded( {extended:true}));
app.use (bodyParser.json());  // no hace falta si no se usa formato json



// PAGINA DE LOGOUT
app.post('/logout', (req,res)=>{
    if ( isUserLogged(req,res) ) req.session.passport.user= null;
    res.redirect('/')
})


//PAGINA DE CALLBACK de la Autenticacion en Google
app.get('/auth/google/callback',
  passport.authenticate('google', {failureRedirect: '/'}),
  (req, res)=>
  {
    res.redirect('/home')
  }
)

app.get('/addevent', (req, res)=>
{
    if ( !isUserLogged(req,res)) res.redirect('/')
    else 
    res.render('addEvento', { calendario:req.session.passport.user.email.emails[0].value })
    
})
app.post('/addevent', (req,res)=>{
    let datosevento = {
        "summary": req.body.summary,
        "description": req.body.description,
        "start": {
            "dateTime": moment(req.body.start).toISOString()
        },
        "end": {
            "dateTime":moment(req.body.end).toISOString()
        }   
    }
    console.log("Evento se va a añadir en Google: ", datosevento)
    let newevento = new Evento(req.session.passport.user.accessToken);
    newevento.create( datosevento, (evento)=>{
        res.send(evento)
    })
})

//funcion isUserLogged()
const isUserLogged=(req,res)=>{
    return typeof req.session.passport !== "undefined" && req.session.passport.user
}

//Pagina Clienteapi ---------------------------------------------------------------
app.get('/clienteapi', (req, res)=>
{
    let datos={};
    //let amazon= new ClienteAWS();
    //let credenciales = new AWS.Credentials( amazon.key, amazon.secret);
    let credenciales = new AWS.SharedIniFileCredentials({profile: 'default'}); 
    console.log("Credenciales:", credenciales);
    AWS.config.update(
    { 
        credentials: credenciales, 
        region: 'eu-west-3',
        //endpoint:'ec2.eu-west-3.amazonaws.com'
    }
    )


    //let cliente = new AWS.EC2.Client( {})
    //console.log("new AWS.EC2............................................")
    var ec2 = new AWS.EC2()
    //console.log(".....................................................OK")
  

    var params = {
        InstanceIds: [
           "i-0bad0c4320fc03d6a"
        ]
        
       };
    ec2.describeInstances({}, function(err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else { datos=JSON.stringify(data); console.log(datos);} // successful response
    });


    res.render('clienteAWS', { datos })
})
//----------------------------------------------------------------------------
app.post('/clienteapi/send', (req,res)=>{
    let datosevento = {
        "summary": req.body.summary,
    }
    console.log("Enviando: ", datosevento)
    res.redirect('/clienteapi')
})


//Servidor ficheros estaticos
app.use('/html',express.static('public'));
app.use('/js',express.static('public'));
app.use('/css',express.static('src/css'));


// running server
app.listen(process.env.puerto, ()=>{
    console.log("Server is running on Port " + process.env.puerto)  
});
app.set('view engine', 'ejs');


//Pagina de error de autenticacion
//app.get("/auth/error", (request,response)=>{
//    response.send("ERROR EN LA AUTENTICACION !!")
//})