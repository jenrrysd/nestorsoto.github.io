const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const COMMENTS_FILE = path.join(__dirname, 'comments.txt');

app.use(cors());
app.use(express.json());

// Servir archivos estáticos (tu sitio estático)
app.use(express.static(__dirname));

// Leer comentarios desde el archivo
function leerComentarios() {
  try {
    if (!fs.existsSync(COMMENTS_FILE)) {
      fs.writeFileSync(COMMENTS_FILE, '[]', 'utf8');
      return [];
    }
    const data = fs.readFileSync(COMMENTS_FILE, 'utf8').trim();
    if (!data) return [];
    return JSON.parse(data);
  } catch (err) {
    console.error('Error leyendo comentarios:', err);
    return [];
  }
}

// Guardar comentarios en el archivo (texto plano con JSON)
function guardarComentarios(comentarios) {
  try {
    fs.writeFileSync(COMMENTS_FILE, JSON.stringify(comentarios, null, 2), 'utf8');
  } catch (err) {
    console.error('Error guardando comentarios:', err);
  }
}

// Endpoint para obtener comentarios
app.get('/comments', (req, res) => {
  const comentarios = leerComentarios();
  res.json(comentarios);
});

// Endpoint para agregar un comentario
app.post('/comments', (req, res) => {
  const { nombre, correo, texto } = req.body;

  if (!nombre || !correo || !texto) {
    return res.status(400).json({ error: 'Faltan campos requeridos.' });
  }

  const nuevo = {
    nombre: String(nombre).trim(),
    correo: String(correo).trim(),
    texto: String(texto).trim(),
    fecha: new Date().toISOString()
  };

  const comentarios = leerComentarios();
  comentarios.unshift(nuevo);
  guardarComentarios(comentarios);

  res.status(201).json(nuevo);
});

app.listen(PORT, () => {
  console.log(`Servidor iniciado en http://localhost:${PORT}`);
});
