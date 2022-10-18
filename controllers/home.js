const Evento = require ('./clienteCalendar')

const showHome=({req,res,islogged})=> {
    let evento = new Evento(req.session.passport.user.accessToken);
    evento.all( (data)=>{
         let formatdata=JSON.stringify(data,null,' ')
         res.render('home',{ req:req, islogged:islogged, data:formatdata })
    })
}


module.exports = {
    show: showHome
}