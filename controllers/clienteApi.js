const ApiKey=''  //credenciales de acceso al api

let restler = require("restler")  // libreria node utilidades cliente REST ??


// accessToken = obtenido en el login con Google
// calendarID  = ID del calendario en Google. El principal tiene id="primary"
class ClienteAPI {
    constructor( accessToken, calendarID="primary") {
        this.calendarURL = 'https://www.googleapis.com/calendar/v3/calendars/' + calendarID
        this.eventsURL   = this.calendarURL + '/events/'
        this.accessToken=accessToken;
        this.calendarID=calendarID

    }

    // all(): lee los eventos del calendario y al terminar llama a callback() 
    all (callback) {
        restler.get( this.eventsURL, this.defaultInfo() ) 
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

    create( eventData, callback ) {
        let eventDataString = JSON.stringify(eventData) // restler necesita json en string
        let data = { "data": eventDataString}
        // options que se manda a Google debe incluir los enventData y las headers en el mismo objeto. Así que se combinan los dos objetos de datos y cabeceras:
        var options = Object.assign( {}, this.defaultInfo(), data )
        restler.post( this.eventsURL, options, this.defaultInfo() ) 
        .on ("complete", callback)
    }
}
module.exports=ClienteAPI;