import { Link } from "react-router-dom";
import '../css/Cabecera.css';
import '../css/Switch.css';
import './darkmode.js?j=1';

//Comp Header = Cabecera de la aplicacion
export const Cabecera=()=>{
    return(
        <header>
            <h1>Aplicacion de Productos</h1>
            <div className="menuPrincipal">
                <Link to = '/producto/list'>Productos</Link>
                <Link to = '/producto/search'>Busqueda Productos</Link>
                <Link to = '/redux'>Pagina Redux</Link>
                <Link to = '/hooks'>Pagina Hooks</Link>
                <Link to = '/context'>Pagina Context</Link> 
                <div className="switch">
                    <span className="sol">&#x2600;</span>
                    <input type='checkbox' className='botontoggle' id='botontoggle'/>
                    <label htmlFor='botontoggle'></label>
                    <span className="luna">&#x263d;</span>
                </div>
            </div>
        </header>
    )
}
