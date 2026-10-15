import { writeFileSync } from 'node:fs';

const regions = { europa: 'Europa', america: 'América', asia: 'Asia', africa: 'África', oceania: 'Oceanía' };
const escape = (value) => String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
const state = (city) => city.conceptImage ? 'Con imagen · por revisar' : city.landmarks.length ? 'Pendiente de imagen' : 'Por definir hitos';

export function buildCityCatalog({ catalog, framing, root }) {
  const cities = [...catalog.cities].sort((a, b) => a.productionOrder - b.productionOrder);
  if (new Set(cities.map((city) => city.id)).size !== cities.length) throw new Error('Hay destinos duplicados.');
  for (const city of cities) {
    if (city.conceptImage && framing.images[city.id]?.file !== city.conceptImage) {
      throw new Error(`La imagen de ${city.id} no está incluida en el visor.`);
    }
  }
  const illustrated = cities.filter((city) => city.conceptImage).length;
  const special = cities.filter((city) => city.kind === 'historic-site').length;
  const pending = cities.filter((city) => !city.conceptImage);
  const summary = `${cities.length} destinos: ${cities.length - special} ciudades y ${special} lugar histórico. ${illustrated} dioramas con imagen y ${pending.length} pendientes.`;
  const next = pending.slice(0, 12);
  let markdown = `# Catálogo y cola de Ciudades\n\n${summary}\n\nColección abierta: este listado inicial no fija un máximo. Una entrada es una candidata editorial, no una imagen terminada ni una pregunta integrada en la app. Se avanza en tandas de cuatro, revisando hitos, legibilidad y base común antes de continuar.\n\n[Ver dioramas](encuadre.html) · [Abrir listado con filtros](catalogo.html)\n\n`;
  markdown += `## Próximas tandas\n\n| Tanda | Destinos pendientes |\n| --- | --- |\n`;
  for (const batch of [...new Set(next.map((city) => city.batch))]) {
    markdown += `| ${batch} | ${next.filter((city) => city.batch === batch).map((city) => city.name.es).join(', ')} |\n`;
  }
  markdown += '\nMachu Picchu se incluye como lugar histórico por petición del usuario y tendrá ese nombre como respuesta. Los nuevos candidatos sin hitos requieren investigación antes de generar. Las traducciones de las nuevas entradas se completarán antes de integrarlas en el juego.\n';
  for (const [id, label] of Object.entries(regions)) {
    const group = cities.filter((city) => city.continent === id);
    markdown += `\n## ${label} · ${group.length}\n\n| Destino | Estado | Tanda | Hitos propuestos |\n| --- | --- | --- | --- |\n`;
    for (const city of group) {
      markdown += `| ${city.name.es} | ${state(city)} | ${city.batch} | ${city.landmarks.join('; ') || 'Pendientes de investigar'} |\n`;
    }
  }
  markdown += '\n## Referencias editoriales registradas\n\n';
  for (const city of cities.filter((city) => city.sources?.length)) {
    markdown += `- ${city.name.es}: ${city.sources.map((url, i) => `[Referencia ${i + 1}](${url})`).join(', ')}.\n`;
  }
  markdown += '\nGenerado desde `catalogo-propuesto.json` al ejecutar `node scripts/build-city-framing-preview.mjs`. Las imágenes mantienen su estado de revisión editorial; el modo jugable todavía está pendiente de integración.\n';
  writeFileSync(new URL('docs/ciudades/listado-ciudades.md', root), markdown);

  const rows = cities.map((city) => `<tr data-region="${escape(city.continent)}" data-state="${city.conceptImage ? 'image' : 'pending'}"><td>${city.conceptImage ? `<a href="encuadre.html?ciudad=${encodeURIComponent(city.id)}">${escape(city.name.es)}</a>` : escape(city.name.es)}${city.kind === 'historic-site' ? '<small>Lugar histórico</small>' : ''}</td><td>${escape(regions[city.continent])}</td><td>${state(city)}</td><td>${city.batch}</td><td>${escape(city.landmarks.join(' · ') || 'Hitos por investigar')}</td></tr>`).join('\n');
  const html = `<!doctype html>
<html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Ciudades · Catálogo y producción</title>
<style>*{box-sizing:border-box}body{margin:0;background:#f8f5ef;color:#292c39;font:16px/1.5 system-ui,sans-serif}main{max-width:1200px;margin:auto;padding:28px 20px}h1{font-size:clamp(26px,5vw,38px);line-height:1.2}a{color:#303f78}p{max-width:950px}.summary,.queue{padding:18px;background:white;border:1px solid #e6ded1;border-radius:14px;margin:18px 0}.controls{display:flex;flex-wrap:wrap;gap:10px;margin:20px 0}input,select{max-width:100%;font:inherit;padding:10px;border:1px solid #b9b2a9;border-radius:8px;background:white;color:inherit}input{flex:1;min-width:190px}.table{overflow:auto;border:1px solid #e6ded1;border-radius:12px;background:white}table{border-collapse:collapse;width:100%;min-width:760px}th,td{text-align:left;padding:12px;border-bottom:1px solid #eee7df;vertical-align:top}th{background:#ede8df}td:first-child{font-weight:650;min-width:170px}td:last-child{font-size:14px;max-width:410px}small{display:block;font-weight:400;color:#666}tr[hidden]{display:none}#count{font-size:14px;color:#65646b}label{display:flex;gap:6px;align-items:center}footer{margin:24px 0;color:#65646b;font-size:14px}</style></head>
<body><main><p><a href="encuadre.html">← Volver al encuadre común</a></p><h1>Catálogo y cola de Ciudades</h1>
<div class="summary"><strong>${summary}</strong><p>Una colección abierta, sin máximo fijado. Las imágenes se producen en tandas de cuatro sobre la misma base. Tener una imagen no implica estar aprobado ni integrado en el juego.</p></div>
<div class="queue"><strong>Próximas tandas</strong><p>${next.map((city) => `${escape(city.name.es)} <small style="display:inline">(tanda ${city.batch})</small>`).join(' · ')}</p></div>
<p>Machu Picchu está incluido como lugar histórico, con su propio nombre como respuesta. Los destinos sin hitos definidos se investigarán antes de generarlos.</p>
<div class="controls"><input id="search" type="search" aria-label="Buscar destino" placeholder="Buscar ciudad o monumento"><label>Región <select id="region"><option value="">Todas</option>${Object.entries(regions).map(([id, label]) => `<option value="${id}">${label}</option>`).join('')}</select></label><label>Estado <select id="state"><option value="">Todos</option><option value="image">Con imagen</option><option value="pending">Pendientes</option></select></label></div>
<p id="count" aria-live="polite"></p><div class="table"><table><thead><tr><th>Destino</th><th>Región</th><th>Estado</th><th>Tanda</th><th>Hitos propuestos</th></tr></thead><tbody>${rows}</tbody></table></div>
<footer>Listado generado desde el catálogo editorial. <a href="listado-ciudades.md">Versión Markdown</a>. Los dioramas ya disponibles se consultan en el encuadre común.</footer></main>
<script>
const search=document.getElementById('search'),region=document.getElementById('region'),state=document.getElementById('state');
const rows=Array.from(document.querySelectorAll('tbody tr'));
const normalize=value=>value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
function filter(){const query=normalize(search.value);let visible=0;for(const row of rows){const match=(!query||normalize(row.textContent).includes(query))&&(!region.value||row.dataset.region===region.value)&&(!state.value||row.dataset.state===state.value);row.hidden=!match;if(match)visible++;}document.getElementById('count').textContent=visible+' de '+rows.length+' destinos';}
for(const control of [search,region,state])control.addEventListener('input',filter);filter();
</script></body></html>`;
  writeFileSync(new URL('docs/ciudades/catalogo.html', root), html);
}
