# Comentarios persistentes (servidor local)

Este proyecto añade un servidor Node.js mínimo para almacenar comentarios en `comments.txt` y servir tu sitio estático.

Instrucciones:

1. Instala dependencias:

```bash
npm install
```

2. Inicia el servidor:

```bash
npm start
```

3. Abre en tu navegador:

http://localhost:3000

Notas:
- GitHub Pages y otros hosts estáticos no ejecutan Node.js; necesitas un host que permita backend (Heroku, Render, Vercel serverless, o un VPS). Si quieres mantener el sitio en Pages, considera usar un servicio externo para almacenar comentarios (Google Sheets, Firestore, etc.).

El servidor guarda los comentarios en `comments.txt` (formato JSON). Asegúrate de que el usuario que ejecuta el servidor tenga permisos de escritura en el directorio del proyecto.
