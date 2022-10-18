const Evento = require ('./clienteCalendar')

const showHome=({req,res,islogged})=> {
    //res.render('home',{ req:req, islogged:islogged })
    let evento = new Evento(req.session.passport.user.accessToken);
    evento.all( (data)=>{
        res.send(data)
    })
}


module.exports = {
    show: showHome
}