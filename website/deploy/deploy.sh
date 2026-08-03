#!/usr/bin/env bash
# Despliegue de la web oficial de CG Trivia.
#
# Publica `website/dist` en el servidor como una release nueva con marca de
# tiempo y mueve el symlink `current` de forma atómica, así que el sitio nunca
# se queda a medias: o sirve la versión anterior o la nueva, jamás una mezcla.
#
#   ./website/deploy/deploy.sh [host]
#
# El host por defecto es `bellum` (alias de ~/.ssh/config). Requiere sudo sin
# contraseña en el servidor, que es como está configurado el usuario de deploy.

set -euo pipefail

HOST="${1:-bellum}"
ROOT="/var/www/cg-trivia"
KEEP=5

here="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
dist="$here/dist"

[ -f "$dist/index.html" ] || { echo "No hay build en $dist. Ejecuta 'npm run build' primero." >&2; exit 1; }

release="$(date -u +%Y%m%dT%H%M%SZ)"
echo "→ Release $release en $HOST"

# Se sube a un directorio temporal del usuario (sin sudo) y desde allí se mueve
# a /var/www, que pertenece a root. Va por tar sobre ssh en vez de rsync porque
# el servidor no tiene rsync instalado.
tmp="/tmp/cg-trivia-$release"
# Sin --no-xattrs el tar de macOS empaqueta atributos extendidos propios que el
# tar de GNU del servidor no entiende, y avisa por cada fichero afectado.
COPYFILE_DISABLE=1 tar --no-xattrs --no-mac-metadata -cf - -C "$dist" . |
  ssh "$HOST" "set -eu; rm -rf '$tmp'; mkdir -p '$tmp'; tar -xf - -C '$tmp'"

ssh "$HOST" "set -euo pipefail
  sudo mkdir -p '$ROOT/releases'
  sudo rm -rf '$ROOT/releases/$release'
  sudo mv '$tmp' '$ROOT/releases/$release'
  sudo chown -R root:root '$ROOT/releases/$release'
  sudo find '$ROOT/releases/$release' -type d -exec chmod 755 {} +
  sudo find '$ROOT/releases/$release' -type f -exec chmod 644 {} +

  # Swap atómico: se crea el symlink al lado y se renombra encima del actual.
  sudo ln -sfn '$ROOT/releases/$release' '$ROOT/current.new'
  sudo mv -Tf '$ROOT/current.new' '$ROOT/current'

  sudo nginx -t
  sudo systemctl reload nginx

  # Se conservan las últimas \$KEEP releases por si hay que volver atrás.
  cd '$ROOT/releases'
  ls -1dt */ | tail -n +$((KEEP + 1)) | xargs -r sudo rm -rf
  echo '   current ->' \$(readlink '$ROOT/current')
"

echo "→ Comprobando el sitio publicado"
for path in / /privacy/ /en/privacy/ /terms/ /support/ /app-ads.txt; do
  code="$(curl -sS -o /dev/null -w '%{http_code}' --max-time 15 "https://cg-trivia.pablobrasero.com$path")"
  printf '   %-16s %s\n' "$path" "$code"
  [ "$code" = "200" ] || { echo "Respuesta inesperada en $path" >&2; exit 1; }
done

echo "✓ Desplegado"
