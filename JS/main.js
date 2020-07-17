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
                    limpiarAsignacion()
                    var contenido = e.target.result
                    mostrarContenido(contenido)
                    contenido = splitContenido(contenido)
                    let count = countCD(contenido)
                    asginarCamiones(count)
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
        var btn = document.createElement('btn')
        btn.innerHTML = '<button type="submit" class="btn btn-light">Aceptar</button>'
        document.getElementById('asignarCamiones').appendChild(btn)
    }

    function limpiarAsignacion() {
        var elemento = document.getElementById('asignarCamiones')
        elemento.innerHTML = ''
    }

    document.getElementById('file-input')
        .addEventListener('change', leerArchivo, false);
};