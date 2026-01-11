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
    
    // Comentarios de ejemplo (normalmente vendrían de un servidor)
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
            texto: comentarioInput.value.trim(),
            fecha: new Date().toISOString()
        };
        
        // Agregar a la lista de comentarios
        comentarios.unshift(nuevoComentario);
        
        // Agregar a la visualización
        agregarComentarioALista(nuevoComentario);
        
        // Limpiar formulario después de enviar
        limpiarFormulario();
        
        // Mostrar mensaje de éxito
        alert('¡Comentario enviado con éxito! Gracias por compartir tu opinión.');
    }
    
    // Agregar algunos comentarios de ejemplo
    function agregarComentariosEjemplo() {
        const comentariosEjemplo = [
            {
                nombre: "Ana García",
                correo: "ana@ejemplo.com",
                texto: "Excelente reflexión sobre la importancia de conservar nuestro planeta. Me ha hecho pensar en cómo puedo contribuir más activamente.",
                fecha: "2023-10-15T09:30:00"
            },
            {
                nombre: "Carlos López",
                correo: "carlos@ejemplo.com",
                texto: "La conexión entre bienestar mental y naturaleza es algo que he experimentado personalmente. Salir a caminar al aire libre siempre mejora mi estado de ánimo.",
                fecha: "2023-10-14T16:45:00"
            }
        ];
        
        comentarios = comentariosEjemplo;
        
        // Agregar cada comentario a la lista
        comentarios.forEach(comentario => {
            agregarComentarioALista(comentario);
        });
    }
    
    // Inicializar la página
    function inicializar() {
        // Agregar comentarios de ejemplo
        agregarComentariosEjemplo();
        
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
        creditoNombre.textContent = "Tu Nombre Aquí";
        creditoEmail.textContent = "tuemail@ejemplo.com";
    }
    
    // Ejecutar inicialización cuando el DOM esté listo
    inicializar();
});