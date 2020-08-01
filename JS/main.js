var path = window.location.pathname;
var page = path.split("/").pop();

function enviarInformacion() {
    var count = localStorage.getItem("count")
    var arrDatos = []
    for (i = 0; i < count; i++) {
        var formCamion = document.getElementById("camion" + i).value
        var formCantidad = document.getElementById("cantidad" + i).value
        arrDatos[i] = formCamion + ";" + formCantidad
    }
    localStorage.setItem("formulario", JSON.stringify(arrDatos))
}

function mostrarContenido(contenido) {
    var elemento = document.getElementById('contenido-archivo');
    elemento.innerHTML = contenido;
}

function splitContenido(contenido) {
    arrContenido = contenido.split('\n')
    arrContenidoFix = []
    for (let i = 0; i < arrContenido.length; i++) {
        arrContenidoFix[i] = arrContenido[i].split(';')
    }
    console.log(arrContenidoFix)
    return arrContenidoFix
}

function countCD(contenido) {
    let count = 0
    for (let i = 0; i < contenido.length; i++)
        for (let j = 0; j < contenido.length; j++) {
            if (contenido[i][j] == 'c' || contenido[i][j] == 'C') {
                count++
            }
        }
    console.log('cantidad centros de distribucion:' + count)
    return count
}

function asginarCamiones(cantidad) {
    for (let i = 0; i != cantidad; i++) {
        var div = document.createElement('div')
        div.innerHTML = `<form><div class="form-row"><div class="col"><label>Centro distribuidor${i + 1}</label></div><div class="col"><input id="camion${i}" type="text" class="form-control" placeholder="Numero de camion"></div><div class="col"><input id="cantidad${i}" type="text" class="form-control" placeholder="Cantidad de productos"></div></div></form>`
        document.getElementById('asignarCamiones').appendChild(div)
    }
}

function limpiarAsignacion() {
    var elemento = document.getElementById('asignarCamiones')
    elemento.innerHTML = ''
}

function toIntCoords(contenido, arrCoordenadas) {
    for (let i = 0; i < contenido.length; i++) {
        contenido[i][2] = arrCoordenadas[i][0]
        contenido[i][3] = arrCoordenadas[i][1]
    }
}

function toInt(contenido, arrCoordenadas) {
    for (let i = 0; i < contenido.length; i++) {
        arrCoordenadas[i] = contenido[i][2].split(",")
    }
    for (let i = 0; i < arrCoordenadas.length; i++)
        for (let j = 0; j < arrCoordenadas[i].length; j++) {
            arrCoordenadas[i][j] = parseInt(arrCoordenadas[i][j])
        }
    return arrCoordenadas
}

function addProperties(contenido) {
    for (let i = 0; i < contenido.length; i++) {
        contenido[i].push(0)
    }
    return contenido
}

function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

function determinarDistancia(contenido, arrDistancias) {
    var x, y, x1, y1, arrDistanciasFix
    for (let i = 0; i < contenido.length; i++) {
        x = contenido[i][2]
        y = contenido[i][3]
        origen = contenido[i][0] + contenido[i][1]
        for (let j = 0; j < contenido.length; j++) {
            x1 = contenido[j][2]
            y1 = contenido[j][3]
            calc = Math.sqrt(Math.pow(x1 - x, 2) + Math.pow(y1 - y, 2))
            destino = contenido[j][0] + contenido[j][1]
            arrAux = [origen, destino, calc]
            if (contenido[i] != contenido[j] & contenido[i][0] != "C" & contenido[i][0] != "c") {
                arrDistancias.push(arrAux)
            }
        }
    }
    console.log(arrDistancias)
}

if (page == "index.html") {
    window.onload = function() {
        function leerArchivo(e) {
            var contenido
            var archivo = e.target.files[0];
            if (!archivo) {
                return;
            }
            try {
                if (archivo.type == 'text/plain') {
                    var lector = new FileReader()
                    lector.onload = function(e) {
                        limpiarAsignacion()
                        contenido = e.target.result
                        mostrarContenido(contenido)
                        contenido = splitContenido(contenido)
                        localStorage.setItem("contenido archivo", JSON.stringify(contenido))
                        let count = countCD(contenido)
                        asginarCamiones(count)
                        localStorage.setItem("count", count)
                    }
                }
                lector.readAsText(archivo);
            } catch (error) {
                limpiarAsignacion()
                console.log('¡El archivo seleccionado no tiene el formato correcto!')
                var elemento = document.getElementById('contenido-archivo')
                elemento.innerHTML = '¡El archivo seleccionado no es de texto plano, por favor, seleccione un archivo con el formato correcto!'
            }
        }
        document.getElementById('file-input')
            .addEventListener('change', leerArchivo, false);

        document.getElementById("submit-button")
            .addEventListener('click', enviarInformacion, false);

    };
}

if (page == "resultados.html") {
    window.onload = function() {
        contenido = JSON.parse(localStorage.getItem("contenido archivo"))
        forms = JSON.parse(localStorage.getItem("formulario"))
        arrCoordenadas = []
        arrDistancias = []
        toInt(contenido, arrCoordenadas)
        toIntCoords(contenido, arrCoordenadas)
        addProperties(contenido)
        determinarDistancia(contenido, arrDistancias)
        console.log(contenido)
    }
}