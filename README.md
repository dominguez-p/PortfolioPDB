# AIxBanker Control Tower

Proyecto HTML/CSS/JS estatico para una torre de control de programas Retail Client Solutions.

## Ejecutar localmente

Abre `index.html` directamente o usa VS Code Live Server.

## Conectar Google Spreadsheet

1. Crea una Google Sheet con estas pestanas exactas:
   - `programs`
   - `portfolio_kpis`
   - `modules`
   - `roles`
   - `priorities`
   - `functional_map`
   - `systems_inventory`
2. En Google Sheets, ve a `Archivo > Compartir > Publicar en la web`.
   Compartir la hoja con usuarios concretos no es suficiente para esta app estatica: el CSV debe responder sin iniciar sesion.
3. Copia el ID de la spreadsheet. Es la parte central de la URL:

```text
https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/edit
```

4. Edita `js/config.js`:

```js
window.APP_CONFIG = {
  useGoogleSheets: true,
  googleSpreadsheetId: "1VMEU6hUGWLlBtCzniE74pPp7fhuzaCdgYoDQsR7msrA",
  googleSheetCsvBaseUrl: "",
  sheets: {
    programs: "programs",
    portfolioKpis: "portfolio_kpis",
    modules: "modules",
    roles: "roles",
    priorities: "priorities",
    functional: "functional_map",
    systems: "systems_inventory",
  },
};
```

La app genera automaticamente las URLs CSV publicas para cada pestana. Si prefieres usar otra URL base, puedes ponerla en `googleSheetCsvBaseUrl` y dejar `googleSpreadsheetId` vacio:

```js
googleSheetCsvBaseUrl: 'https://docs.google.com/spreadsheets/d/1VMEU6hUGWLlBtCzniE74pPp7fhuzaCdgYoDQsR7msrA/gviz/tq?tqx=out:csv&sheet=',
```

Para comprobar el acceso publico, abre esta URL en una ventana de incognito. Debe descargar o mostrar CSV, no pedir login:

```text
https://docs.google.com/spreadsheets/d/1VMEU6hUGWLlBtCzniE74pPp7fhuzaCdgYoDQsR7msrA/gviz/tq?tqx=out:csv&sheet=programs
```

https://script.google.com/macros/s/AKfycbzhGc2q4qVT_zMPWb9eIrOe5uCUAwiyZJW5kY7bU46yMDGOMi4xIG0OP83ezcvSYQPN/exec

## Apps Script privado con JSONP

Apps Script no envia cabeceras CORS en `ContentService`, asi que `fetch()` desde `localhost` puede quedar bloqueado. Para una app estatica usa JSONP.

En `js/config.js`:

```js
appsScriptUrl: "https://script.google.com/macros/s/AKfycbzhGc2q4qVT_zMPWb9eIrOe5uCUAwiyZJW5kY7bU46yMDGOMi4xIG0OP83ezcvSYQPN/exec",
appsScriptTransport: "jsonp",
```

En Apps Script, el `doGet` debe devolver callback si llega el parametro `callback`:

```js
function doGet(e) {
  const data = loadData();
  const json = JSON.stringify(data);
  const callback = e.parameter.callback;

  if (callback) {
    return ContentService
      .createTextOutput(`${callback}(${json});`)
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }

  return ContentService
    .createTextOutput(json)
    .setMimeType(ContentService.MimeType.JSON);
}
```

Despues de cambiar Apps Script, despliega una version nueva en `Deploy > Manage deployments > Edit > New version > Deploy`.

## Estructura esperada de pestanas

### programs

`id,name,description,status,functional,systems,architecture,enabled,icon`

`enabled` acepta `true`, `yes`, `si`, `sí`, `1` o `x`.

### portfolio_kpis

`label,value,subtitle,icon`

### modules

`id,title,description,route,status`

Deja `route` vacio para modulos no navegables.

### roles

`code,name`

### priorities

`priority`

### functional_map

`domain,capability,features`

Usa `|` para separar features.

### systems_inventory

`layer,component,description,status,country`
# AIxBanker
