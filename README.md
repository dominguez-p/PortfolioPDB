# AIxBanker Control Tower

Proyecto HTML/CSS/JS estático para una torre de control de programas Retail Client Solutions.

## Ejecutar localmente

Abre `index.html` directamente o usa VS Code Live Server.

## Conectar Google Spreadsheet

1. Crea una Google Sheet con estas pestañas exactas:
   - `programs`
   - `portfolio_kpis`
   - `modules`
   - `roles`
   - `priorities`
   - `functional_map`
   - `systems_inventory`
2. En Google Sheets: Archivo > Compartir > Publicar en la web.
3. Copia el ID de la spreadsheet.
4. Edita `js/config.js`:

```js
window.APP_CONFIG = {
  googleSheetCsvBaseUrl: 'https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/gviz/tq?tqx=out:csv&sheet=',
  useGoogleSheets: true,
  sheets: { ... }
};
```

## Estructura esperada de pestañas

### programs
`id,name,description,status,functional,systems,architecture,enabled,icon`

### portfolio_kpis
`label,value,subtitle,icon`

### modules
`id,title,description,route,status`

### roles
`code,name`

### priorities
`priority`

### functional_map
`domain,capability,features`

Usa `|` para separar features.

### systems_inventory
`layer,component,description,status,country`
