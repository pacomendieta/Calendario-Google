const ApiKey=''  //credenciales de acceso al api

let AWS = require("aws-sdk")  


// accessToken = obtenido en el login con Google
// calendarID  = ID del calendario en Google. El principal tiene id="primary"
class ClienteAWS {
    constructor( ) {
        /*
        AWS.config.getCredentials(function(err) { 
            if (err) console.log(err.stack);   // credentials not loaded 
            else { 
                console.log("Access key:", AWS.config.credentials.accessKeyId); 
                console.log("Secret key:", AWS.config.credentials.secretAccessKey);
            }
         }); */
         AWS.config.getCredentials(function(err) { 
            var credentials = new AWS.SharedIniFileCredentials({profile: 'default'}); 
            AWS.config.credentials = credentials;
            console.log("Access key:", AWS.config.credentials.accessKeyId)
         })
         this.key=AWS.config.credentials.accessKeyId;
         this.secret=AWS.config.credentials.secretAccessKey;
         //this.credentials=AWS::
    }

    
}
module.exports=ClienteAWS;