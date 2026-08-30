import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import test from "node:test";

const root = new URL("../dist/", import.meta.url);

async function text(path) {
  return readFile(new URL(path, root), "utf8");
}

test("build includes all Spanish and English legal routes", async () => {
  for (const locale of ["", "en/"]) {
    for (const route of ["privacy", "terms", "support", "privacy-choices", "data-deletion", "legal-notice", "cookies", "accessibility"]) {
      const html = await text(`${locale}${route}/index.html`);
      assert.match(html, /CG Trivia/);
      assert.match(html, /<link rel="canonical"/);
    }
  }
});

test("legacy privacy URLs remain available", async () => {
  assert.match(await text("privacy.html"), /Política de privacidad/);
  assert.match(await text("privacy-en.html"), /Privacy policy/);
});

test("root technical files point at the production domain", async () => {
  assert.match(await text("robots.txt"), /cg-trivia\.pablobrasero\.com\/sitemap\.xml/);
  assert.match(await text("sitemap.xml"), /<urlset/);
});

test("app-ads.txt is served and only ever lists authorized entries", async () => {
  const published = await text("app-ads.txt");

  // Cada línea que no sea comentario ni esté vacía tiene que ser una entrada
  // real de app-ads.txt: dominio, seller ID y DIRECT/RESELLER. Así el build no
  // puede publicar por error un texto suelto donde los verificadores esperan
  // vendedores autorizados.
  const entries = published
    .split("\n")
    .map((l) => l.split("#")[0].trim()) // el formato admite comentarios al final de línea
    .filter((l) => l !== "");
  for (const entry of entries) {
    assert.match(entry, /^[^\s,]+\.[^\s,]+,\s*[^,]+,\s*(DIRECT|RESELLER)(,\s*[0-9a-f]+)?\s*$/i, `entrada inválida: ${entry}`);
  }

  // Sin el bloque validado por Appodeal todavía no hay entradas, y el fichero debe
  // seguir existiendo apuntando a dónde se pegan.
  if (entries.length === 0) assert.match(published, /website\/src\/app-ads\.txt/);
});

test("modes and categories on the landing match what the app ships", async () => {
  for (const [page, modes, topics] of [
    ["index.html", ["Pregunta del día", "Contrarreloj", "Modo Ascenso", "Mundo", "Aprender", "Con amigos"], "13 categorías"],
    ["en/index.html", ["Daily question", "Time Attack", "Climb Mode", "World", "Learn", "With friends"], "13 categories"],
  ]) {
    const html = await text(page);
    for (const mode of modes) assert.ok(html.includes(`<h3>${mode}</h3>`), `falta el modo ${mode} en ${page}`);
    assert.ok(html.includes(topics), `${page} no anuncia ${topics}`);
  }
});

test("the published privacy policy matches the one shipped inside the app", async () => {
  // La app renderiza sus propias secciones desde locales/*.json, así que son dos
  // textos distintos que describen el mismo tratamiento de datos. Si se
  // desincronizan, el revisor de la tienda lee una cosa y el usuario otra. Aquí
  // se comparan los encabezados de ambas: mismo número, mismo orden, mismo título.
  for (const [locale, page] of [["es", "privacy/index.html"], ["en", "en/privacy/index.html"]]) {
    const strings = JSON.parse(await readFile(new URL(`../../locales/${locale}.json`, import.meta.url), "utf8"));
    const inApp = Object.values(strings.privacy.sections).map((s) => s.title);
    const body = /<div class="legal-copy">(.*?)<\/div><\/div><\/article>/s.exec(await text(page));
    assert.ok(body, `no encuentro el cuerpo legal en ${page}`);
    const published = [...body[1].matchAll(/<h2>([^<]+)<\/h2>/g)].map((m) => m[1]);

    assert.deepEqual(
      published,
      inApp,
      `las secciones de ${locale} no coinciden entre la web y la app`,
    );
  }
});

test("every page includes the accessible three-way appearance selector", async () => {
  const html = await text("index.html");
  assert.match(html, /data-theme-value="system"/);
  assert.match(html, /data-theme-value="light"/);
  assert.match(html, /data-theme-value="dark"/);
  assert.match(html, /\/assets\/theme\.js/);
  assert.match(await text("assets/theme.js"), /cg_theme_preference_v1/);
});
