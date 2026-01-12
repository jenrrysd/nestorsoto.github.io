// Apps Script - CÓDIGO CON JSONP
const SPREADSHEET_ID = '1JBrtwQapyMBV0sB_SltjyV8JZeFdFoDFUTl5ZegLHws';
const SHEET_NAME = 'Comentarios';

function doGet(e) {
  const callback = e.parameter.callback;
  const action = e.parameter.action;
  let result;
  
  if (action === 'list') {
    result = listarComentarios();
  } else if (action === 'add') {
    const comentario = {
      nombre: e.parameter.nombre || 'Anónimo',
      correo: e.parameter.correo || '',
      texto: e.parameter.texto || ''
    };
    
    if (!comentario.texto) {
      result = { error: 'Comentario vacío' };
    } else {
      result = guardarComentario(comentario);
    }
  } else {
    result = { status: 'ok', message: 'API funcionando' };
  }
  
  // SI hay callback, devolver JSONP
  if (callback) {
    const jsonpResponse = callback + '(' + JSON.stringify(result) + ')';
    return ContentService
      .createTextOutput(jsonpResponse)
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  
  // SI NO hay callback, devolver JSON normal
  return ContentService
    .createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  const callback = e.parameter && e.parameter.callback;
  const comentario = {
    nombre: e.parameter.nombre || 'Anónimo',
    correo: e.parameter.correo || '',
    texto: e.parameter.texto || ''
  };

  let result;
  if (!comentario.texto) {
    result = { error: 'Comentario vacío' };
  } else {
    result = guardarComentario(comentario);
  }

  if (callback) {
    const jsonpResponse = callback + '(' + JSON.stringify(result) + ')';
    return ContentService
      .createTextOutput(jsonpResponse)
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }

  return ContentService
    .createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

function guardarComentario(comentario) {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = ss.getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      sheet.getRange(1,1,1,4).setValues([['Fecha','Nombre','Correo','Comentario']]);
    }
    
    const fecha = new Date();
    sheet.appendRow([fecha, comentario.nombre, comentario.correo, comentario.texto]);
    
    return {
      success: true,
      id: fecha.getTime(),
      fecha: fecha.toISOString(),
      nombre: comentario.nombre,
      correo: comentario.correo,
      texto: comentario.texto
    };
  } catch(e) {
    return { error: e.toString() };
  }
}

function listarComentarios() {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(SHEET_NAME);
    
    if (!sheet || sheet.getLastRow() <= 1) return [];
    
    const datos = sheet.getDataRange().getValues();
    const comentarios = [];
    
    for (let i = 1; i < datos.length; i++) {
      comentarios.push({
        fecha: datos[i][0],
        nombre: datos[i][1],
        correo: datos[i][2],
        texto: datos[i][3]
      });
    }
    
    return comentarios.sort((a,b) => new Date(b.fecha) - new Date(a.fecha));
  } catch(e) {
    return { error: e.toString() };
  }
}