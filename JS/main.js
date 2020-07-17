window.onload = function() {
    console.log('main.js')

    function leerArchivo(e) {
        var archivo = e.target.files[0];
        if (!archivo) {
            return;
        }
        var lector = new FileReader();
        lector.onload = function(e) {
            var contenido = e.target.result;
            mostrarContenido(contenido);
            splitContent(contenido)
        };
        lector.readAsText(archivo);
    }

    function mostrarContenido(contenido) {
        var elemento = document.getElementById('contenido-archivo');
        elemento.innerHTML = contenido;
    }

    function splitContent(contenido) {
        arrContenido = contenido.split('\n')
        arrContenidoFix = []
        for (let i = 0; i < arrContenido.length; i++) {
            arrContenidoFix[i] = arrContenido[i].split(';')
        }
        console.log(arrContenidoFix)
    }

    document.getElementById('file-input')
        .addEventListener('change', leerArchivo, false);
};