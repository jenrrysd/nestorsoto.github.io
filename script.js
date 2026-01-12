// script.js
document.addEventListener('DOMContentLoaded', function() {
    // Elementos del formulario
    const formulario = document.getElementById('formulario-comentario');
    const nombreInput = document.getElementById('nombre');
    const correoInput = document.getElementById('correo');
    const comentarioInput = document.getElementById('comentario');
    const enviarBtn = document.getElementById('enviar-comentario');
    const limpiarBtn = document.getElementById('limpiar-formulario');
    const listaComentarios = document.getElementById('lista-comentarios');
    
    // Elementos de error
    const errorNombre = document.getElementById('error-nombre');
    const errorCorreo = document.getElementById('error-correo');
    const errorComentario = document.getElementById('error-comentario');
    
    // Comentarios (se cargarán desde el servidor)
    let comentarios = [];

    // URL del WebApp de Google Apps Script (despliega el Apps Script y pega aquí la URL)
    // Ejemplo: https://script.google.com/macros/s/AKfycb.../exec
    const WEBAPP_URL = 'https://script.google.com/macros/s/AKfycbw5HpLqLmH_Lh-szV-a2bYjG8b3Xc2epePSliSg3y_AEnPrRhRAKrcuGRp9L5kNt7_G-g/exec';
    
    // Función para validar el correo electrónico
    function validarCorreo(correo) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(correo);
    }
    
    // Función para validar el formulario
    function validarFormulario() {
        let valido = true;
        
        // Validar nombre
        if (nombreInput.value.trim() === '') {
            errorNombre.textContent = 'Por favor, ingresa tu nombre.';
            nombreInput.style.borderColor = '#e74c3c';
            valido = false;
        } else if (nombreInput.value.trim().length < 2) {
            errorNombre.textContent = 'El nombre debe tener al menos 2 caracteres.';
            nombreInput.style.borderColor = '#e74c3c';
            valido = false;
        } else {
            errorNombre.textContent = '';
            nombreInput.style.borderColor = '#ddd';
        }
        
        // Validar correo
        if (correoInput.value.trim() === '') {
            errorCorreo.textContent = 'Por favor, ingresa tu correo electrónico.';
            correoInput.style.borderColor = '#e74c3c';
            valido = false;
        } else if (!validarCorreo(correoInput.value.trim())) {
            errorCorreo.textContent = 'Por favor, ingresa un correo electrónico válido.';
            correoInput.style.borderColor = '#e74c3c';
            valido = false;
        } else {
            errorCorreo.textContent = '';
            correoInput.style.borderColor = '#ddd';
        }
        
        // Validar comentario
        if (comentarioInput.value.trim() === '') {
            errorComentario.textContent = 'Por favor, escribe un comentario.';
            comentarioInput.style.borderColor = '#e74c3c';
            valido = false;
        } else if (comentarioInput.value.trim().length < 10) {
            errorComentario.textContent = 'El comentario debe tener al menos 10 caracteres.';
            comentarioInput.style.borderColor = '#e74c3c';
            valido = false;
        } else {
            errorComentario.textContent = '';
            comentarioInput.style.borderColor = '#ddd';
        }
        
        return valido;
    }
    
    // Función para limpiar el formulario
    function limpiarFormulario() {
        formulario.reset();
        errorNombre.textContent = '';
        errorCorreo.textContent = '';
        errorComentario.textContent = '';
        
        // Restaurar bordes
        nombreInput.style.borderColor = '#ddd';
        correoInput.style.borderColor = '#ddd';
        comentarioInput.style.borderColor = '#ddd';
    }
    
    // Función para formatear la fecha
    function formatearFecha(fecha) {
        const opciones = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return new Date(fecha).toLocaleDateString('es-ES', opciones);
    }
    
    // Función para agregar un comentario a la lista
    function agregarComentarioALista(comentario) {
        // Eliminar el mensaje de "sin comentarios" si existe
        const sinComentarios = document.querySelector('.sin-comentarios');
        if (sinComentarios) {
            sinComentarios.remove();
        }
        
        // Crear elemento para el comentario
        const comentarioDiv = document.createElement('div');
        comentarioDiv.className = 'comentario-item';
        
        comentarioDiv.innerHTML = `
            <div class="comentario-autor">${comentario.nombre}</div>
            <div class="comentario-fecha">${formatearFecha(comentario.fecha)}</div>
            <div class="comentario-texto">${comentario.texto}</div>
        `;
        
        // Agregar al principio de la lista
        listaComentarios.prepend(comentarioDiv);
    }
    
    // Función para manejar el envío del formulario
    function manejarEnvioFormulario(event) {
        event.preventDefault();

        if (!validarFormulario()) {
            return;
        }

        // Crear objeto comentario
        const nuevoComentario = {
            nombre: nombreInput.value.trim(),
            correo: correoInput.value.trim(),
            texto: comentarioInput.value.trim()
        };

        // Enviar al WebApp de Google (o avisar si no está configurado)
        if (WEBAPP_URL.indexOf('REPLACE_WITH') !== -1) {
            alert('Aún no se ha configurado la URL del WebApp de Google. Sigue las instrucciones en README para desplegarlo y actualizar `script.js`.');
            return;
        }

        // Enviar usando GET a doGet?action=add (Apps Script soporta `action=add`)
        const params = new URLSearchParams({
            action: 'add',
            nombre: nuevoComentario.nombre,
            correo: nuevoComentario.correo,
            texto: nuevoComentario.texto
        });

        // Enviar usando JSONP para evitar bloqueos CORS en algunos despliegues
        const addCallback = 'handleAddJSONP_' + Date.now();
        window[addCallback] = function(result) {
            try {
                // Refrescar la lista de comentarios y limpiar el formulario
                cargarComentariosServidor();
                limpiarFormulario();
                alert('¡Comentario enviado con éxito! Gracias por compartir tu opinión.');
            } catch (e) {
                console.error('Error en callback JSONP add:', e);
            } finally {
                // limpiar
                delete window[addCallback];
                const sc = document.getElementById(addCallback + '-script');
                if (sc && sc.parentNode) sc.parentNode.removeChild(sc);
            }
        };

        const scriptAdd = document.createElement('script');
        scriptAdd.id = addCallback + '-script';
        scriptAdd.src = WEBAPP_URL + '?' + params.toString() + '&callback=' + addCallback;
        scriptAdd.onerror = function(e) {
            console.error('Error al enviar comentario (JSONP):', e);
            delete window[addCallback];
            if (scriptAdd.parentNode) scriptAdd.parentNode.removeChild(scriptAdd);
            // Intentar recargar la lista de todas formas
            cargarComentariosServidor();
            alert('Error al enviar comentario. Intenta nuevamente.');
        };
        document.head.appendChild(scriptAdd);
    }
    
    // Cargar comentarios desde el servidor
    function cargarComentariosServidor() {
        if (WEBAPP_URL.indexOf('REPLACE_WITH') !== -1) {
            console.warn('WEBAPP_URL no está configurada. Los comentarios remotos no se cargarán.');
            return;
        }

        // Usar JSONP para evitar bloqueos CORS en `action=list`.
        const callbackName = 'handleComentariosJSONP';

        // Definir handler global temporal
        window[callbackName] = function(data) {
            try {
                comentarios = data || [];
                // Limpiar lista antes de renderizar
                listaComentarios.innerHTML = '';
                comentarios.forEach(function(comentario) {
                    agregarComentarioALista(comentario);
                });
            } catch (e) {
                console.error('Error procesando comentarios JSONP:', e);
            } finally {
                // limpiar handler y script
                delete window[callbackName];
                const s = document.getElementById(callbackName + '-script');
                if (s && s.parentNode) s.parentNode.removeChild(s);
            }
        };

        const script = document.createElement('script');
        script.id = callbackName + '-script';
        script.src = WEBAPP_URL + '?action=list&callback=' + callbackName;
        script.onerror = function(e) {
            console.error('Error al cargar comentarios (JSONP):', e);
            // cleanup
            delete window[callbackName];
            if (script.parentNode) script.parentNode.removeChild(script);
        };
        document.head.appendChild(script);
    }
    
    // Inicializar la página
    function inicializar() {
        // Cargar comentarios desde el servidor
        cargarComentariosServidor();
        
        // Asignar eventos
        formulario.addEventListener('submit', manejarEnvioFormulario);
        limpiarBtn.addEventListener('click', limpiarFormulario);
        
        // Validación en tiempo real
        nombreInput.addEventListener('input', function() {
            if (nombreInput.value.trim() !== '' && nombreInput.value.trim().length >= 2) {
                errorNombre.textContent = '';
                nombreInput.style.borderColor = '#ddd';
            }
        });
        
        correoInput.addEventListener('input', function() {
            if (correoInput.value.trim() !== '' && validarCorreo(correoInput.value.trim())) {
                errorCorreo.textContent = '';
                correoInput.style.borderColor = '#ddd';
            }
        });
        
        comentarioInput.addEventListener('input', function() {

            if (comentarioInput.value.trim() !== '' && comentarioInput.value.trim().length >= 10) {
                errorComentario.textContent = '';
                comentarioInput.style.borderColor = '#ddd';
            }
        });
        
        // Personalizar los créditos en el footer
        const creditoNombre = document.getElementById('credito-nombre');
        const creditoEmail = document.getElementById('credito-email');
        
        // Puedes cambiar estos valores por los tuyos
        creditoNombre.textContent = "Jenrry Soto Dextre";
        creditoEmail.textContent = "dextre1481@gmail.com";

        // Doble click para ampliar la imagen principal
        const imagenPrincipal = document.getElementById('imagen-principal');
        const contenedorImagen = document.querySelector('.imagen-contenedor');

        function quitarAmpliacion() {
            if (contenedorImagen) contenedorImagen.classList.remove('ampliada');
            if (imagenPrincipal) imagenPrincipal.classList.remove('ampliada-img');
        }

        function toggleAmpliacion(e) {
            if (!imagenPrincipal || !contenedorImagen) return;
            contenedorImagen.classList.toggle('ampliada');
            imagenPrincipal.classList.toggle('ampliada-img');
        }

        if (imagenPrincipal && contenedorImagen) {
            imagenPrincipal.style.cursor = 'zoom-in';
            imagenPrincipal.addEventListener('dblclick', toggleAmpliacion);
            // permitir también cerrar al hacer doble click fuera de la imagen (en el contenedor)
            contenedorImagen.addEventListener('dblclick', function(e) {
                if (e.target === contenedorImagen) quitarAmpliacion();
            });
            // cerrar con Escape
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape') quitarAmpliacion();
            });
        }
    }
    
    // Ejecutar inicialización cuando el DOM esté listo
    inicializar();
});