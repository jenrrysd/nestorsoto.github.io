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

        // Enviar al servidor
        fetch('/comments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nuevoComentario)
        })
        .then(response => {
            if (!response.ok) throw new Error('Error al guardar comentario');
            return response.json();
        })
        .then(saved => {
            // Agregar a la visualización
            agregarComentarioALista(saved);
            // Limpiar formulario después de enviar
            limpiarFormulario();
            // Mostrar mensaje de éxito
            alert('¡Comentario enviado con éxito! Gracias por compartir tu opinión.');
        })
        .catch(err => {
            console.error(err);
            alert('Error al enviar comentario. Intenta nuevamente.');
        });
    }
    
    // Cargar comentarios desde el servidor
    function cargarComentariosServidor() {
        fetch('/comments')
            .then(response => {
                if (!response.ok) throw new Error('No se pudieron cargar los comentarios');
                return response.json();
            })
            .then(data => {
                comentarios = data || [];
                comentarios.forEach(comentario => {
                    agregarComentarioALista(comentario);
                });
            })
            .catch(err => {
                console.error('Error al cargar comentarios:', err);
            });
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