import Anuncio from "./Anuncio.js";
import Anuncio_Auto from "./Anuncio_Auto.js";
import crearTabla from "./gestionTablas.js";

let listaEntidades = [];
let nextId;
let divTabla = fnGet("divTabla");
let botonAlta = fnGet("btnAlta");
let botonListar = fnGet("btnListar");
let botonLimpiarCampos = fnGet("btnLimpiarCampos");
let botonBaja = fnGet("btnBaja");
let botonModificar = fnGet("btnModificar");
let botonEnviar = fnGet("btnEnviar");
let accion;

window.addEventListener('load', inicializarManejadores);

function inicializarManejadores() {

    listaEntidades = obtenerEntidades();
    nextId = obtenerId();
    
    habilitarForm(true);

    if (botonAlta) {
        botonAlta.addEventListener('click', (e) => {

            accion = "alta";
            habilitarForm(false);
            habilitarBotones(true);
            habilitarEnvio(false);
        });
    }

    if (botonListar) {
        botonListar.addEventListener('click', (e) => {

            habilitarForm(false);
            actualizarLista();
            botonAlta.disabled = true;
            habilitarEnvio(true);
            habilitarForm(true);
        });
    }

    if (botonLimpiarCampos) {
        botonLimpiarCampos.addEventListener('click', (e) => {

            limpiarCampos();
        });
    }

    if (botonEnviar) {
        botonEnviar.addEventListener('click', (e) => {

            var txtTitulo = fnGet('txtTitulo').value;
            var txtDescripcion = fnGet('txtDescripcion').value;
            var txtPrecio = fnGet('txtPrecio').value;
           

          
                
                if (accion === "alta") {

                    AltaEntidad(listaEntidades);
                    alert("Alta realizada con éxito.")
                    habilitarForm(true);

                } else
                    if (accion === "baja" && alertAccion('baja')) {

                        bajaEntidad(listaEntidades);

                    } else
                        if (accion === "modificar") {

                            modificarEntidad(listaEntidades);
                        }
            
        });
    }

    if (botonBaja) {
        botonBaja.addEventListener('click', (e) => {
            
            accion = "baja";
            habilitarForm(true);
            habilitarEnvio(false);
            actualizarLista();
            fnGet("btnAlta").disabled = true;
            fnGet("btnModificar").disabled = true;
        });
    }

    if (botonModificar) {
        botonModificar.addEventListener('click', (e) => {
            accion = "modificar";
            habilitarForm(false);
            habilitarEnvio(false);
            actualizarLista();
            fnGet("btnAlta").disabled = true;
            fnGet("btnBaja").disabled = true;
        });
    }
}

function modificarEntidad(listaEntidades) {

    let idAnuncio = parseInt(fnGet("txtId").value);

    for (let i = 0; i < listaEntidades.length; i++) {

        if (listaEntidades[i].id === idAnuncio) {

            listaEntidades[i].titulo = fnGet('txtTitulo').value;
            listaEntidades[i].descripcion = fnGet('txtDescripcion').value;
            listaEntidades[i].precio= fnGet('txtPrecio').value;
            if (fnGet('txtTranVenta').checked) {
                listaEntidades[i].transaccion = "venta";
            } else {
                listaEntidades[i].transaccion = "alquiler";
            }
            listaEntidades[i].puertas = fnGet('txtPuertas').value;
            listaEntidades[i].KMS = fnGet('txtKMS').value;
            listaEntidades[i].potencia= fnGet('txtPotencia').value;
            break;

        }
    }

    guardarDatos();
    actualizarLista();
    limpiarCampos();
    fnGet("btnEnviar").disabled = true;
}

function bajaEntidad(listaEntidades) {

    let idAnuncio = parseInt(fnGet("txtId").value);
   

    for (let i = 0; i < listaEntidades.length; i++) {

        if (listaEntidades[i].id === idAnuncio) {

            listaEntidades.splice(i, 1);
            guardarDatos();
            actualizarLista();
            limpiarCampos();
            fnGet("btnEnviar").disabled = true;
            break;
        }
    }
}


function AltaEntidad(listaEntidades) {

    var id= nextId;
    console.log(nextId);
    var txtTitulo = fnGet('txtTitulo').value;
    console.log("llego");

    var txtTranVenta = fnGet('txtTranVenta').checked;
    var transaccion = "venta";
    if (txtTranVenta === false) {
        transaccion = "alquiler";
    }

    var txtDescripcion = fnGet('txtDescripcion').value;
    var txtPrecio = fnGet('txtPrecio').value;
    var txtPuertas = fnGet('txtPuertas').value;
    var txtKMS = fnGet('txtKMS').value;
    var txtPotencia = fnGet('txtPotencia').value;

    let nuevaEntidad = new Anuncio_Auto(id, txtTitulo, transaccion, txtDescripcion, txtPrecio, txtPuertas, txtKMS, txtPotencia);
    console.log(nuevaEntidad);
    if (nuevaEntidad) {
        listaEntidades.push(nuevaEntidad);
        nextId++;
        alert(nextId);
        guardarDatos();
        actualizarLista();
        habilitarBotones(false);
    }

}

function fnGet(id) {
    return document.getElementById(id);
}

function obtenerEntidades() {
    return JSON.parse(localStorage.getItem('ENTIDAD')) || [];
}

function obtenerId() {
    return JSON.parse(localStorage.getItem('nextId')) || 1;
}

function guardarDatos() {
    localStorage.setItem('ENTIDAD', JSON.stringify(listaEntidades));
    localStorage.setItem('nextId', nextId);
}

function actualizarLista() {
    if (divTabla) {
        if (localStorage.length !== 0) {
            divTabla.textContent = "";
        }

        divTabla.innerHTML = "";

        let table = crearTabla(listaEntidades);
       

        divTabla.appendChild(Spinner());

        setTimeout(() => {
            divTabla.innerHTML = "";
           divTabla.appendChild(table);
            
        }, 3000);
        
    }
}

function limpiarCampos() {
   
    fnGet('txtTitulo').value = '';
    fnGet('txtDescripcion').value = '';
    fnGet('txtPrecio').value = '';
    fnGet('txtTranVenta').checked = true;
    fnGet('txtPuertas').value = '';
    fnGet('txtKMS').value = '';
    fnGet('txtPotencia').value = '';
    habilitarBotones(false);
}

function habilitarBotones(habilita) {

    fnGet("btnAlta").disabled = habilita;
    fnGet("btnListar").disabled = habilita;
    fnGet("btnModificar").disabled = habilita;
    fnGet("btnBaja").disabled = habilita;
}

function habilitarForm(habilita) {
     
    fnGet("txtTitulo").disabled = habilita;
    fnGet("txtDescripcion").disabled = habilita;
    fnGet("txtPrecio").disabled = habilita;
    fnGet("txtPuertas").disabled = habilita;
    fnGet("txtKMS").disabled = habilita;
    fnGet("txtPotencia").disabled = habilita;
    fnGet("txtTranVenta").disabled = habilita;
    fnGet("txtTranAlquiler").disabled = habilita;
}

function habilitarEnvio(habilita) {
    fnGet("btnEnviar").disabled = habilita;
}

function alertAccion(accion) {
    switch (accion) {
        case 'baja':
            return (confirm("Se dará de baja el anuncio, ¿Desea continuar?"));
            accion = '';
            break;

        default:
            return false;
            break;
    }
}

function Spinner() {
    var spinner = document.createElement('img');
    //PROBAR SPINNER DE BAUS GIRANDO SIN DESPERDICIO <3
    // E L   B A U S N E R
    //spinner.setAttribute('src', './images/baus-girando.gif');
    spinner.setAttribute('src', './images/AUTO.gif');
    spinner.setAttribute('alt', 'spinner');
    spinner.width = 200;
    return spinner;
}