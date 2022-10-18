const ApiKey='AIzaSyBO1OEmGU3YmhX22cTlxuF7drUQei-OcQM'  //google api key para Calendar

let restler = require("restler")  // libreria node utilidades cliente REST ??

// Evento de Google Calendar
// accessToken = obtenido en el login con Google
// calendarID  = ID del calendario en Google. El principal tiene id="primary"
class Evento {
    constructor( accessToken, calendarID="primary") {
        this.destinationURL = 'https://www.googleapis.com/calendar/v3/calendars/' + calendarID
        this.accessToken=accessToken;
        this.calendarID=calendarID

    }

    // all(): lee los eventos del calendario y al terminar llama a callback() 
    all (callback) {
        restler.get( this.destinationURL, this.defaultInfo() ) 
        .on ("complete", callback)
    }

    //defaultinfo: retorna objeto opciones para la peticion de calendario
    defaultInfo() {
        return {
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer "+ this.accessToken
            }
        }
    }
}
module.exports=Evento;