window.Csv = (() => {
  function parse(text) {
    const rows = [];
    let row = [];
    let value = '';
    let quoted = false;
    for (let i = 0; i < text.length; i += 1) {
      const c = text[i];
      const n = text[i + 1];
      if (c === '"' && quoted && n === '"') { value += '"'; i += 1; }
      else if (c === '"') { quoted = !quoted; }
      else if (c === ',' && !quoted) { row.push(value); value = ''; }
      else if ((c === '\n' || c === '\r') && !quoted) {
        if (c === '\r' && n === '\n') i += 1;
        row.push(value);
        if (row.some(cell => cell.trim() !== '')) rows.push(row);
        row = []; value = '';
      } else value += c;
    }
    if (value || row.length) { row.push(value); if (row.some(cell => cell.trim() !== '')) rows.push(row); }
    if (!rows.length) return [];
    const headers = rows[0].map(h => h.trim());
    return rows.slice(1).map(r => Object.fromEntries(headers.map((h, i) => [h, normalize(r[i] ?? '')])));
  }
  function normalize(v) {
    const s = String(v).trim();
    if (s === 'true') return true;
    if (s === 'false') return false;
    if (s !== '' && !Number.isNaN(Number(s))) return Number(s);
    return s;
  }
  return { parse };
})();
