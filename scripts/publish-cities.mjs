#!/usr/bin/env node
// Dry run by default. --publish uploads immutable artwork, then upserts rows.
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { createClient } from '@supabase/supabase-js';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = p => JSON.parse(fs.readFileSync(path.join(root, p), 'utf8'));
const catalog = read('docs/ciudades/catalogo-propuesto.json').cities;
const framing = read('constants/cityDioramaFraming.json');
const editorial = read('data/city-architecture.json');
const tags = new Map();
for (const group of editorial.groups) for (const id of group.ids) {
  if (!catalog.some(c => c.id === id)) throw new Error(`Unknown city in architecture group: ${id}`);
  tags.set(id, [...(tags.get(id) ?? []), group.tag]);
}
const rows = catalog.filter(c => tags.has(c.id)).map(c => {
  const profile = framing.images[c.id];
  const hasImage = !!(c.conceptImage && profile);
  if (hasImage && profile.file !== c.conceptImage) throw new Error(`Outdated framing for ${c.id}`);
  const override = editorial.overrides[c.id] ?? {};
  return { id: c.id, name: { ...c.name, ...override.name }, continent: c.continent, difficulty: override.difficulty ?? 2,
    architecture_tags: tags.get(c.id), similar_city_ids: override.similar ?? [],
    image_url: null, framing: hasImage ? { ...profile.normalized, background: framing.frame.background } : null,
    is_published: true, _file: hasImage ? path.join(root, 'docs/ciudades', profile.file) : null };
});
for (const row of rows) {
  if (!row.name.es?.trim() || !row.name.en?.trim()) throw new Error(`Missing ES/EN name: ${row.id}`);
  const compatible = rows.filter(c => c.id !== row.id && (row.similar_city_ids.includes(c.id) || c.similar_city_ids.includes(row.id) || c.architecture_tags.some(t => row.architecture_tags.includes(t))));
  if (row._file && compatible.length < 3) throw new Error(`Need three architectural distractors: ${row.id}`);
  if (row._file && !fs.existsSync(row._file)) throw new Error(`Missing artwork: ${row.id}`);
}
console.log(`${rows.filter(r => r._file).length} dioramas, ${rows.length} answer names, bilingual and framed.`);
const unclassified = catalog.filter(c => c.conceptImage && framing.images[c.id] && !tags.has(c.id));
if (unclassified.length) console.log(`Add architecture metadata before publishing: ${unclassified.map(c => c.id).join(', ')}`);
if (!process.argv.includes('--publish')) {
  console.log('Dry run complete. Add --publish to upload and publish the catalog.');
  process.exit(0);
}
let url = process.env.SUPABASE_URL ?? process.env.EXPO_PUBLIC_SUPABASE_URL;
let key = process.env.SUPABASE_SERVICE_ROLE_KEY;
// CLI authentication is an optional operator convenience. Never print keys.
if (!url || !key) {
  const ref = fs.readFileSync(path.join(root, 'supabase/.temp/project-ref'), 'utf8').trim();
  const keys = JSON.parse(execFileSync('supabase', ['projects', 'api-keys', '--project-ref', ref, '--output', 'json'], { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }));
  const linkedUrl = `https://${ref}.supabase.co`;
  if (url && new URL(url).origin !== linkedUrl) throw new Error('Supabase URL does not match the linked project. Provide its own service key.');
  url ??= linkedUrl;
  key ??= keys.find(k => k.name === 'service_role')?.api_key;
}
if (!url || !key) throw new Error('Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY, or authenticate the linked Supabase CLI.');
const client = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'cg-cities-'));
try {
  for (const row of rows) {
    if (!row._file) continue;
    const target = path.join(tmp, `${row.id}.webp`);
    // Same square canvas, no cropping or framing changes. ~100–250 KB per city.
    execFileSync(process.env.CITY_PYTHON ?? 'python3', ['-c',
      "from PIL import Image; import sys; im=Image.open(sys.argv[1]); im.thumbnail((1024,1024), Image.Resampling.LANCZOS); im.save(sys.argv[2], 'WEBP', quality=88, method=6)", row._file, target]);
    const bytes = fs.readFileSync(target);
    const hash = createHash('sha256').update(bytes).digest('hex').slice(0, 20);
    const object = `${row.id}/${hash}.webp`;
    const { data } = client.storage.from('city-dioramas').getPublicUrl(object);
    let check = await fetch(data.publicUrl, { method: 'HEAD' });
    if (!check.ok) {
      for (let attempt = 0; attempt < 4; attempt++) {
        const { error } = await client.storage.from('city-dioramas').upload(object, bytes, { contentType: 'image/webp', cacheControl: '31536000', upsert: false });
        check = await fetch(data.publicUrl, { method: 'HEAD' });
        if (check.ok) break;
        if (attempt === 3) throw new Error(`Upload failed for ${row.id}: ${error?.message ?? check.status}`);
        await new Promise(resolve => setTimeout(resolve, 500 * 2 ** attempt));
      }
    }
    row.image_url = data.publicUrl;
    console.log(`Artwork ready: ${row.id} (${Math.round(bytes.length / 1024)} KB)`);
  }
  const payload = rows.map(({ _file, ...row }) => ({ ...row, updated_at: new Date().toISOString() }));
  const { error } = await client.from('city_catalog').upsert(payload, { onConflict: 'id' });
  if (error) throw new Error(`Catalog publication failed: ${error.message}`);
  console.log(`Published ${payload.length} city rows. The app will refresh on the next visit to Cities.`);
} finally { fs.rmSync(tmp, { recursive: true, force: true }); }
