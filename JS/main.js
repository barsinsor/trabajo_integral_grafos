var path = window.location.pathname;
var page = path.split("/").pop();

function enviarInformacion() {
    var count1 = localStorage.getItem("count1")
    var count = localStorage.getItem("count")
    var arrDatos = []
    var arrDatosPV = []
    for (i = 0; i < count; i++) {
        var formCamion = document.getElementById("camion" + i).value
        arrDatos[i] = formCamion
    }
    for (i = 0; i < count1; i++)
        for (j = 0; j < count; j++) {
            var formPV = document.getElementById("asignarCD" + i + "PV" + j).value
            arrDatosPV.push(formPV)
        }
    localStorage.setItem("formularioCamion", JSON.stringify(arrDatos))
    localStorage.setItem("formularioCantidad", JSON.stringify(arrDatosPV))
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
    // console.log(arrContenidoFix)
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
        // console.log('cantidad centros de distribucion:' + count)
    return count
}

function countPuntoVenta(contenido) {
    let countPV = 0
    for (let i = 0; i < contenido.length; i++)
        for (let j = 0; j < contenido.length; j++) {
            if (contenido[i][j] == 'p' || contenido[i][j] == 'P') {
                countPV++
            }
        }
        // console.log('cantidad puntos de venta:' + countPV)
    return countPV
}

function asginarCamiones(cantidadCD, cantidadPV) {
    for (let i = 0; i != cantidadCD; i++) {
        var div = document.createElement('div')
        div.innerHTML = `<form><div class="form-row"><div class="col"><label>Centro distribuidor${i + 1}</label></div><div class="col"><input id="camion${i}" type="text" class="form-control" placeholder="Numero de camion"></div></div></form>`
        document.getElementById('asignarCamiones').appendChild(div)
        for (let j = 0; j != cantidadPV; j++) {
            var divPV = document.createElement('div')
            divPV.innerHTML = `<div class="form-group"><input  id="asignarCD${i}PV${j}" class="form-control" type="text" placeholder="Cantidad a repartir a punto de venta ${j + 1}"></div>`
            document.getElementById('asignarCamiones').appendChild(divPV)
        }
    }
}

function cantidades(cantidad) {
    for (let i = 0; i != cantidad; i++) {
        var div = document.createElement('div')
        div.innerHTML = 'h'
        document.getElementById('asignarPV').appendChild(div)
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

function determinarDistancia(contenido, arrDistancias) {
    var x, y, x1, y1
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
    return arrDistancias
}

function determinarDistanciaP(contenido, arrDistanciasP) {
    var x, y, x1, y1
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
            if (contenido[i] != contenido[j] & contenido[i][0] != "C" & contenido[i][0] != "c" & contenido[j][0] != "C" & contenido[j][0] != "c") {
                arrDistanciasP.push(arrAux)
            }
        }
    }
    return arrDistanciasP
}


function matricez(contenido, arrDistancias, arrDistanciasP) {
    var contadorM, contadorC, contadorP
    var matrizdetransicion = [],
        extension = [],
        copiaArreglo = [],
        copiaMatriz = [],
        respuesta = []
    contadorC = countCD(contenido)
    contadorP = countPuntoVenta(contenido) + 1
    count = 0
    while (count < contadorC) {
        for (let i = 0; i < arrDistancias.length; i++) {
            if (arrDistancias[i][1] == "C" + contenido[count][1]) {
                extension.push(arrDistancias[i][2])
                copiaArreglo.push(arrDistancias[i][2])
            }
        }
        count++
    }
    for (let i = 0; i < contadorP; i++) {
        auxmatriz = []
        auxmatriz2 = []
        for (let j = 0; j < contadorP; j++) {
            auxmatriz.push(0)
            auxmatriz2.push(0)
        }
        matrizdetransicion.push(auxmatriz)
        copiaMatriz.push(auxmatriz2)
    }

    while (contadorC != 0) {
        contadorM = 0
        for (let i = 0; i < contadorP; i++) {
            for (let j = 0; j < contadorP; j++) {
                if (i != j & (i == 0 || j == 0)) {
                    if (j - 1 < 0) {
                        matrizdetransicion[i][j] = extension[j]

                    } else {
                        matrizdetransicion[i][j] = extension[j - 1]
                    }
                }
                if (i != j & j == 0) {
                    matrizdetransicion[i][j] = extension[i - 1]
                }
                if (i != j & i != 0 & j != 0) {
                    matrizdetransicion[i][j] = arrDistanciasP[contadorM][2]
                    contadorM++
                }
            }

        }
        for (let i = 0; i < contadorC; i++) {
            copiaArreglo.shift()
        }
        contadorC--
    }
    respuesta = caminoMasCorto(matrizdetransicion, copiaMatriz)
    var suma = 0
    for (let i = 1; i < respuesta.length - 1; i++) {
        suma = suma + respuesta[i]
    }
    var final = 0
    for (let i = 0; i < respuesta.length; i++) {
        final = respuesta[i]
    }
    var div = document.getElementById("respuesta")
    div.innerHTML = "<p>La ruta optima para el camion del CD 1 es de:</p><p>-ida:  " + suma + "</p><p>-vuelta:  " + final + "</p><p>-total:  " + (suma + final) + "</p>"
    console.log(respuesta)
    extension = copiaArreglo
}

function caminoMasCorto(matrizdetransicion, copiaMatriz) {
    var comparador = 0,
        x, y
    var listaComparador = [],
        listaX = [],
        listaY = []
    for (let i = 0; i < matrizdetransicion.length; i++) {
        for (let j = 0; j < matrizdetransicion.length; j++) {
            if (comparador == 0 & matrizdetransicion[i][j] == 0) {
                comparador = matrizdetransicion[i][j + 1]
                x = i
                y = j + 1
            } else if (comparador == 0 & matrizdetransicion[i][j] != 0 & copiaMatriz[i][j] == 0) {
                comparador = matrizdetransicion[i][j]
                x = i
                y = j
            } else if (matrizdetransicion[i][j] != 0 & comparador > matrizdetransicion[i][j] & copiaMatriz[i][j] == 0) {
                comparador = matrizdetransicion[i][j]
                x = i
                y = j
            }
        }
        listaComparador.push(comparador)
        listaX.push(x)
        listaY.push(y)
        comparador = 0
        for (let k = 0; k < matrizdetransicion.length; k++) {
            for (let l = 0; l < matrizdetransicion.length; l++) {
                if (k == x || l == y) {
                    copiaMatriz[k][l] = 1
                }
            }
        }
    }
    // console.log(listaX)
    // console.log(listaY)
    listaComparador.push(matrizdetransicion[0][y]) //se lee desde el indice 1
    return listaComparador
}

if (page == "index.html") {
    window.onload = function() {
        function leerArchivo(e) {
            var archivo = e.target.files[0];
            if (!archivo) {
                return;
            }
            try {
                if (archivo.type == 'text/plain') {
                    var lector = new FileReader()
                    lector.onload = function(e) {
                        var contenido
                        limpiarAsignacion()
                        contenido = e.target.result
                        mostrarContenido(contenido)
                        contenido = splitContenido(contenido)
                        localStorage.setItem("contenido archivo", JSON.stringify(contenido))
                        let countPV = countPuntoVenta(contenido)
                        let count = countCD(contenido)
                        asginarCamiones(count, countPV)
                        localStorage.setItem("countCD", count)
                        localStorage.setItem("countPV", countPV)
                    }
                }
                lector.readAsText(archivo);
            } catch (error) {
                limpiarAsignacion()
                    // console.log('¡El archivo seleccionado no tiene el formato correcto!')
                var elemento = document.getElementById('contenido-archivo')
                elemento.innerHTML = '¡El archivo seleccionado no es de texto plano, por favor, seleccione un archivo con el formato correcto!'
            }
        }

        document.getElementById("submit-button")
            .addEventListener('click', enviarInformacion, false);

        document.getElementById('file-input')
            .addEventListener('change', leerArchivo, false);
    };
}

if (page == "resultados.html") {
    window.onload = function() {
        contenido = JSON.parse(localStorage.getItem("contenido archivo"))
        forms = JSON.parse(localStorage.getItem("formulario"))
        arrCoordenadas = []
        arrDistancias = []
        arrDistanciasP = []
        toInt(contenido, arrCoordenadas)
        toIntCoords(contenido, arrCoordenadas)
        addProperties(contenido)
        arrDistancias = determinarDistancia(contenido, arrDistancias)
        arrDistanciasP = determinarDistanciaP(contenido, arrDistanciasP)
        matricez(contenido, arrDistancias, arrDistanciasP)
            // console.log(arrDistancias)
    }
}