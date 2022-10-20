
import {includeHTML} from './cargadorhtml.js'; //cargador html cabecera
import {botonDarkMode} from './darkmode.js'; //switch modo dark / light

cargarCabecera();

function cargarCabecera() {
    includeHTML( botonDarkMode  )
}

