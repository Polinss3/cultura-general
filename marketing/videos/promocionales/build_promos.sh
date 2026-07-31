#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
SRC_DIR="$ROOT_DIR/marketing/videos"
ADS_DIR="$ROOT_DIR/marketing/ads/meta_variants"
OUT_DIR="$SRC_DIR/promocionales"
FONT_BOLD="/System/Library/Fonts/Supplemental/Arial Bold.ttf"
TMP_DIR="$(mktemp -d /tmp/cultura-promos.XXXXXX)"
TITLE_SOURCE="$OUT_DIR/make_title.swift"

trap 'rm -rf "$TMP_DIR"' EXIT
mkdir -p "$OUT_DIR"
swiftc "$TITLE_SOURCE" -o "$TMP_DIR/make_title"

HOME_CLIP="$SRC_DIR/ScreenRecording_07-25-2026 14-20-10_1.mp4"
DAILY_CLIP="$SRC_DIR/ScreenRecording_07-25-2026 14-18-17_1.mp4"
LEARN_CLIP="$SRC_DIR/ScreenRecording_07-25-2026 14-18-49_1.mp4"
FRIENDS_CLIP="$SRC_DIR/ScreenRecording_07-25-2026 14-19-24_1.mp4"
LEAGUE_CLIP="$SRC_DIR/ScreenRecording_07-25-2026 14-19-51_1.mp4"

RACHA_CARD="$ADS_DIR/racha_12_dias/racha_12_dias_meta_9x16.png"
LEARN_CARD="$ADS_DIR/aprende_sin_darte_cuenta/aprende_sin_darte_cuenta_meta_9x16.png"
RANK_CARD="$ADS_DIR/sube_al_ranking/sube_al_ranking_meta_9x16.png"
FRIENDS_CARD="$ADS_DIR/reta_a_tus_amigos/reta_a_tus_amigos_meta_9x16.png"
MISSIONS_CARD="$ADS_DIR/misiones_y_recompensas/misiones_y_recompensas_meta_9x16.png"
DOWNLOAD_CARD="$ADS_DIR/trivia_bilingue_descarga/trivia_bilingue_descarga_meta_9x16.png"

render_video_segment() {
  local input="$1"
  local start="$2"
  local duration="$3"
  local title="$4"
  local accent="$5"
  local output="$6"
  local title_png="${output%.mp4}_title.png"

  "$TMP_DIR/make_title" "$title" "$accent" "$title_png"

  ffmpeg -hide_banner -loglevel error -y \
    -ss "$start" -t "$duration" -i "$input" \
    -loop 1 -i "$title_png" \
    -filter_complex \
      "[0:v]fps=30,split=2[bg0][fg0]; \
       [bg0]scale=1080:1920:force_original_aspect_ratio=increase:flags=lanczos,crop=1080:1920,gblur=sigma=34,eq=brightness=-0.20:saturation=1.25[bg]; \
       [fg0]scale=-2:1920:flags=lanczos,eq=contrast=1.03:saturation=1.08[fg]; \
       [bg][fg]overlay=(W-w)/2:0[base]; \
       [base][1:v]overlay=0:0:shortest=1,format=yuv420p[v]" \
    -map "[v]" -an -r 30 -c:v libx264 -preset medium -crf 18 -movflags +faststart "$output"
}

render_still_segment() {
  local input="$1"
  local duration="$2"
  local output="$3"
  local frames
  frames="$(awk -v d="$duration" 'BEGIN { printf "%d", d * 30 }')"

  ffmpeg -hide_banner -loglevel error -y \
    -loop 1 -i "$input" \
    -vf "scale=1080:1920:flags=lanczos,zoompan=z='min(zoom+0.00035,1.035)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=$frames:s=1080x1920:fps=30,fade=t=in:st=0:d=0.20,format=yuv420p" \
    -frames:v "$frames" -an -r 30 -c:v libx264 -preset medium -crf 18 -movflags +faststart "$output"
}

concat_segments() {
  local output="$1"
  shift
  local inputs=()
  local labels=""
  local index=0

  for segment in "$@"; do
    inputs+=(-i "$segment")
    labels+="[$index:v]"
    index=$((index + 1))
  done

  ffmpeg -hide_banner -loglevel error -y \
    "${inputs[@]}" \
    -filter_complex "${labels}concat=n=$index:v=1:a=0,format=yuv420p[v]" \
    -map "[v]" -an -r 30 -c:v libx264 -preset medium -crf 18 -movflags +faststart "$output"
}

add_original_music() {
  local input="$1"
  local output="$2"
  local duration
  local fade_out
  duration="$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$input")"
  fade_out="$(awk -v d="$duration" 'BEGIN { v=d-0.55; if (v<0) v=0; printf "%.3f", v }')"

  # Banda electrónica generada de forma procedural: bajo pulsante, arpegio y percusión.
  local music_expr
  music_expr="0.10*sin(2*PI*(110+27.5*lt(mod(t\\,8)\\,4))*t)*(0.58+0.42*sin(2*PI*4*t))+0.045*sin(2*PI*(440+110*lt(mod(t\\,4)\\,2))*t)+0.13*sin(2*PI*58*t)*exp(-14*mod(t\\,0.5))+0.018*(2*random(0)-1)*exp(-42*mod(t+0.25\\,0.5))"

  ffmpeg -hide_banner -loglevel error -y \
    -i "$input" \
    -f lavfi -i "aevalsrc=$music_expr:s=48000:d=$duration" \
    -filter_complex "[1:a]highpass=f=38,lowpass=f=11500,acompressor=threshold=-18dB:ratio=3:attack=10:release=120,volume=0.72,afade=t=in:st=0:d=0.35,afade=t=out:st=$fade_out:d=0.55,aformat=channel_layouts=stereo[a]" \
    -map 0:v:0 -map "[a]" -c:v copy -c:a aac -b:a 160k -shortest -movflags +faststart "$output"
}

build_reto_diario() {
  render_video_segment "$HOME_CLIP" 0.00 3.10 "COMPLETA TU RETO DIARIO" "0xF59E0B" "$TMP_DIR/reto_1.mp4"
  render_video_segment "$DAILY_CLIP" 6.00 6.80 "UNA PREGUNTA. UN NUEVO RETO." "0x7C3AED" "$TMP_DIR/reto_2.mp4"
  render_still_segment "$RACHA_CARD" 3.20 "$TMP_DIR/reto_3.mp4"
  concat_segments "$TMP_DIR/reto_visual.mp4" "$TMP_DIR/reto_1.mp4" "$TMP_DIR/reto_2.mp4" "$TMP_DIR/reto_3.mp4"
  add_original_music "$TMP_DIR/reto_visual.mp4" "$OUT_DIR/01_reto_diario.mp4"
}

build_aprender() {
  render_video_segment "$LEARN_CLIP" 0.00 2.90 "ELIGE QUÉ QUIERES APRENDER" "0x2563EB" "$TMP_DIR/learn_1.mp4"
  render_video_segment "$LEARN_CLIP" 3.00 4.30 "RESPONDE Y GANA XP" "0x16A34A" "$TMP_DIR/learn_2.mp4"
  render_video_segment "$LEARN_CLIP" 14.40 5.80 "APRENDE EL PORQUÉ" "0xEA580C" "$TMP_DIR/learn_3.mp4"
  render_still_segment "$LEARN_CARD" 3.10 "$TMP_DIR/learn_4.mp4"
  concat_segments "$TMP_DIR/learn_visual.mp4" "$TMP_DIR/learn_1.mp4" "$TMP_DIR/learn_2.mp4" "$TMP_DIR/learn_3.mp4" "$TMP_DIR/learn_4.mp4"
  add_original_music "$TMP_DIR/learn_visual.mp4" "$OUT_DIR/02_modo_aprendizaje.mp4"
}

build_ligas() {
  render_video_segment "$LEAGUE_CLIP" 0.00 1.80 "COMPITE CADA SEMANA" "0xD97706" "$TMP_DIR/league_1.mp4"
  render_video_segment "$LEAGUE_CLIP" 1.80 3.55 "SUBE DE DIVISIÓN" "0xCA8A04" "$TMP_DIR/league_2.mp4"
  render_video_segment "$HOME_CLIP" 4.00 4.20 "GANA XP. ESCALA. REPITE." "0x7C3AED" "$TMP_DIR/league_3.mp4"
  render_still_segment "$RANK_CARD" 3.10 "$TMP_DIR/league_4.mp4"
  concat_segments "$TMP_DIR/league_visual.mp4" "$TMP_DIR/league_1.mp4" "$TMP_DIR/league_2.mp4" "$TMP_DIR/league_3.mp4" "$TMP_DIR/league_4.mp4"
  add_original_music "$TMP_DIR/league_visual.mp4" "$OUT_DIR/03_ligas_y_ranking.mp4"
}

build_amigos() {
  render_video_segment "$FRIENDS_CLIP" 0.00 2.75 "4 MODOS PARA JUGAR JUNTOS" "0x2563EB" "$TMP_DIR/friends_1.mp4"
  render_video_segment "$FRIENDS_CLIP" 2.75 2.90 "¿QUIÉN SABE MÁS?" "0xDB2777" "$TMP_DIR/friends_2.mp4"
  render_still_segment "$FRIENDS_CARD" 3.80 "$TMP_DIR/friends_3.mp4"
  concat_segments "$TMP_DIR/friends_visual.mp4" "$TMP_DIR/friends_1.mp4" "$TMP_DIR/friends_2.mp4" "$TMP_DIR/friends_3.mp4"
  add_original_music "$TMP_DIR/friends_visual.mp4" "$OUT_DIR/04_compite_con_amigos.mp4"
}

build_misiones() {
  render_video_segment "$HOME_CLIP" 0.00 3.15 "COMPLETA TU RUTA" "0xF59E0B" "$TMP_DIR/missions_1.mp4"
  render_video_segment "$HOME_CLIP" 5.00 5.60 "GANA MONEDAS CADA DÍA" "0x7C3AED" "$TMP_DIR/missions_2.mp4"
  render_video_segment "$HOME_CLIP" 11.00 7.80 "DESBLOQUEA RECOMPENSAS" "0x16A34A" "$TMP_DIR/missions_3.mp4"
  render_still_segment "$MISSIONS_CARD" 3.10 "$TMP_DIR/missions_4.mp4"
  concat_segments "$TMP_DIR/missions_visual.mp4" "$TMP_DIR/missions_1.mp4" "$TMP_DIR/missions_2.mp4" "$TMP_DIR/missions_3.mp4" "$TMP_DIR/missions_4.mp4"
  add_original_music "$TMP_DIR/missions_visual.mp4" "$OUT_DIR/05_misiones_y_recompensas.mp4"
}

build_descarga() {
  render_video_segment "$LEARN_CLIP" 0.00 2.20 "APRENDE" "0x2563EB" "$TMP_DIR/download_1.mp4"
  render_video_segment "$DAILY_CLIP" 9.40 3.45 "PONTE A PRUEBA" "0x7C3AED" "$TMP_DIR/download_2.mp4"
  render_video_segment "$LEAGUE_CLIP" 1.80 2.50 "COMPITE" "0xD97706" "$TMP_DIR/download_3.mp4"
  render_video_segment "$FRIENDS_CLIP" 0.00 3.30 "RETA A TUS AMIGOS" "0xDB2777" "$TMP_DIR/download_4.mp4"
  render_video_segment "$HOME_CLIP" 0.00 2.90 "VUELVE MÁS LISTO CADA DÍA" "0xEA580C" "$TMP_DIR/download_5.mp4"
  render_still_segment "$DOWNLOAD_CARD" 3.30 "$TMP_DIR/download_6.mp4"
  concat_segments "$TMP_DIR/download_visual.mp4" "$TMP_DIR/download_1.mp4" "$TMP_DIR/download_2.mp4" "$TMP_DIR/download_3.mp4" "$TMP_DIR/download_4.mp4" "$TMP_DIR/download_5.mp4" "$TMP_DIR/download_6.mp4"
  add_original_music "$TMP_DIR/download_visual.mp4" "$OUT_DIR/06_descarga_general.mp4"
}

build_reto_diario
build_aprender
build_ligas
build_amigos
build_misiones
build_descarga

printf 'Promos exportadas en: %s\n' "$OUT_DIR"
