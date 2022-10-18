const Evento = require ('./clienteCalendar')

const showHome=({req,res,islogged})=> {
    let evento = new Evento(req.session.passport.user.accessToken);
    evento.all( (data)=>{
         res.render('home',{ req:req, islogged:islogged, data:data })
    })
}


module.exports = {
    show: showHome
}