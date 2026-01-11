Google Apps Script + Google Sheets — WebApp para comentarios

Resumen

Este archivo contiene el código y los pasos para crear un WebApp de Google Apps Script que guarda comentarios en una Google Sheet y expone endpoints GET/POST para leer y escribir comentarios desde tu web (sin necesidad de un servidor propio).

Características
- Permite comentarios anónimos si despliegas como "Anyone, even anonymous".
- También puedes desplegar requiriendo inicio de sesión Google si lo prefieres.

Pasos rápidos

1) Crear la Google Sheet
- Crea una nueva Google Sheet en tu cuenta Google.
- Dale un nombre, por ejemplo: `Comentarios Sitio`.
- Crea una hoja llamada `comments` y en la fila 1 pon cabeceras: `fecha`, `nombre`, `correo`, `texto`.
- Copia el ID de la hoja (parte de la URL entre `/d/` y `/edit`).

2) Crear el Apps Script
- En la hoja, ve a `Extensiones` → `Apps Script`.
- Reemplaza el contenido del editor por este código (sustituye `SHEET_ID` por el ID copiado):

```javascript
const SHEET_ID = 'REPLACE_WITH_YOUR_SHEET_ID';

function setup() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  let sheet = ss.getSheetByName('comments');
  if (!sheet) sheet = ss.insertSheet('comments');
  sheet.getRange(1,1,1,4).setValues([['fecha','nombre','correo','texto']]);
}

function doGet(e) {
  // GET: devuelve la lista de comentarios en JSON
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sheet = ss.getSheetByName('comments');
    const rows = sheet.getDataRange().getValues();
    const data = [];
    for (let i = 1; i < rows.length; i++) {
      const r = rows[i];
      data.push({ fecha: r[0], nombre: r[1], correo: r[2], texto: r[3] });
    }
    return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ error: String(err) })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  // POST: espera JSON con { nombre, correo, texto }
  try {
    const payload = e.postData && e.postData.contents ? JSON.parse(e.postData.contents) : e.parameter;
    const nombre = payload.nombre || 'Anónimo';
    const correo = payload.correo || '';
    const texto = payload.texto || '';
    const fecha = new Date().toISOString();

    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sheet = ss.getSheetByName('comments');
    sheet.insertRowBefore(2);
    sheet.getRange(2,1,1,4).setValues([[fecha, nombre, correo, texto]]);

    return ContentService.createTextOutput(JSON.stringify({ success: true, nombre, correo, texto, fecha })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ error: String(err) })).setMimeType(ContentService.MimeType.JSON);
  }
}
```

3) Guardar y desplegar
- Guarda el script (`Ctrl+S`).
- En el editor de Apps Script: `Deploy` → `New deployment` → `Web app`.
- En "Select type" escoge "Web app".
- Pon una descripción, p.ej. "Comentarios WebApp".
- En "Execute as" elige "Me" (ejecuta con tu cuenta).
- En "Who has access" selecciona:
  - Para permitir comentarios sin login: `Anyone` o `Anyone, even anonymous` (opción depende de tu cuenta).
  - Para requerir cuenta Google: elige `Only myself` o `Anyone` (según necesidad).
- Haz `Deploy` y copia la URL del Web App.

4) Actualizar `script.js`
- Abre `script.js` en tu repo y reemplaza la constante `WEBAPP_URL` por la URL copiada.
- Si desplegaste como anónimo, los visitantes podrán enviar comentarios sin iniciar sesión.
- Si desplegaste requiriendo login, los usuarios deberán iniciar sesión con Google.

5) Probar
- Abre tu sitio en GitHub Pages y envía un comentario desde el formulario.
- Comprueba que aparece en la Google Sheet y en la web (si `script.js` está configurado para leer).

Notas y seguridad
- Si permites "Anyone, even anonymous", cualquiera podrá enviar contenido. Para moderar, revisa la hoja y elimina o edita entradas. También puedes añadir un campo `estado` y filtros.
- Para mejorar, puedes exponer solo lectura pública y que las publicaciones creen una entrada en modo borrador que administres antes de mostrar.

¿Quieres que genere los cambios exactos en `script.js` para leer y escribir usando tu WebApp URL (yo ya añadí el placeholder), o prefieres que te guíe paso a paso mientras lo despliegas en tu cuenta Google? 
