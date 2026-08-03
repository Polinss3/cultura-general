#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
SRC_DIR="$ROOT_DIR/marketing/videos"
ADS_DIR="$ROOT_DIR/marketing/ads/meta_variants"
OUT_DIR="$SRC_DIR/promocionales/v2"
TMP_DIR="$(mktemp -d /tmp/cultura-promos-v2.XXXXXX)"

trap 'rm -rf "$TMP_DIR"' EXIT
mkdir -p "$OUT_DIR"

HOME_CLIP="$SRC_DIR/ScreenRecording_07-25-2026 14-20-10_1.mp4"
DAILY_CLIP="$SRC_DIR/ScreenRecording_07-25-2026 14-18-17_1.mp4"
LEARN_CLIP="$SRC_DIR/ScreenRecording_07-25-2026 14-18-49_1.mp4"
FRIENDS_CLIP="$SRC_DIR/ScreenRecording_07-25-2026 14-19-24_1.mp4"
LEAGUE_CLIP="$SRC_DIR/ScreenRecording_07-25-2026 14-19-51_1.mp4"

CARD_SMART="$ADS_DIR/mas_listo_de_lo_que_crees/mas_listo_de_lo_que_crees_meta_9x16.png"
CARD_MIND="$ADS_DIR/pon_a_prueba_tu_mente/pon_a_prueba_tu_mente_meta_9x16.png"
CARD_RECORD="$ADS_DIR/contrareloj_record_4/contrareloj_record_4_meta_9x16.png"
CARD_LEARN="$ADS_DIR/aprende_sin_darte_cuenta/aprende_sin_darte_cuenta_meta_9x16.png"
CARD_STREAK="$ADS_DIR/racha_12_dias/racha_12_dias_meta_9x16.png"
CARD_MISSIONS="$ADS_DIR/misiones_y_recompensas/misiones_y_recompensas_meta_9x16.png"
CARD_RANK="$ADS_DIR/sube_al_ranking/sube_al_ranking_meta_9x16.png"
CARD_FRIENDS="$ADS_DIR/reta_a_tus_amigos/reta_a_tus_amigos_meta_9x16.png"
CARD_LOCAL="$ADS_DIR/multijugador_local_descarga/multijugador_local_descarga_meta_9x16.png"
CARD_DOWNLOAD="$ADS_DIR/trivia_bilingue_descarga/trivia_bilingue_descarga_meta_9x16.png"

render_clip() {
  local input="$1"
  local start="$2"
  local duration="$3"
  local output="$4"

  ffmpeg -hide_banner -loglevel error -y \
    -ss "$start" -t "$duration" -i "$input" \
    -filter_complex \
      "[0:v]fps=30,split=2[bg0][fg0]; \
       [bg0]scale=1080:1920:force_original_aspect_ratio=increase:flags=lanczos,crop=1080:1920,gblur=sigma=36,eq=brightness=-0.23:saturation=1.22[bg]; \
       [fg0]scale=-2:1920:flags=lanczos,eq=contrast=1.04:saturation=1.08[fg]; \
       [bg][fg]overlay=(W-w)/2:0,format=yuv420p[v]" \
    -map "[v]" -an -r 30 -c:v libx264 -preset medium -crf 18 -movflags +faststart "$output"
}

render_card() {
  local input="$1"
  local duration="$2"
  local direction="$3"
  local output="$4"
  local frames
  local zoom
  frames="$(awk -v d="$duration" 'BEGIN { printf "%d", d * 30 }')"

  if [[ "$direction" == "out" ]]; then
    zoom="if(eq(on,1),1.055,max(1.0,zoom-0.0007))"
  else
    zoom="min(zoom+0.00065,1.055)"
  fi

  ffmpeg -hide_banner -loglevel error -y \
    -loop 1 -i "$input" \
    -vf "scale=1080:1920:flags=lanczos,zoompan=z='$zoom':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=$frames:s=1080x1920:fps=30,format=yuv420p" \
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

add_music() {
  local input="$1"
  local output="$2"
  local duration
  local fade_out
  duration="$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$input")"
  fade_out="$(awk -v d="$duration" 'BEGIN { printf "%.3f", d-0.45 }')"

  local music_expr
  music_expr="0.11*sin(2*PI*(110+27.5*lt(mod(t\\,8)\\,4))*t)*(0.55+0.45*sin(2*PI*4*t))+0.052*sin(2*PI*(440+110*lt(mod(t\\,4)\\,2))*t)+0.15*sin(2*PI*58*t)*exp(-15*mod(t\\,0.5))+0.022*(2*random(0)-1)*exp(-46*mod(t+0.25\\,0.5))"

  ffmpeg -hide_banner -loglevel error -y \
    -i "$input" \
    -f lavfi -i "aevalsrc=$music_expr:s=48000:d=$duration" \
    -filter_complex "[1:a]highpass=f=38,lowpass=f=11500,acompressor=threshold=-18dB:ratio=3:attack=8:release=100,volume=1.05,afade=t=in:st=0:d=0.16,afade=t=out:st=$fade_out:d=0.45,aformat=channel_layouts=stereo[a]" \
    -map 0:v:0 -map "[a]" -c:v copy -c:a aac -b:a 160k -shortest -movflags +faststart "$output"
}

build_general() {
  render_card "$CARD_SMART" 1.70 in "$TMP_DIR/general_1.mp4"
  render_clip "$LEARN_CLIP" 3.15 2.15 "$TMP_DIR/general_2.mp4"
  render_clip "$LEARN_CLIP" 5.30 2.05 "$TMP_DIR/general_3.mp4"
  render_card "$CARD_RECORD" 1.45 out "$TMP_DIR/general_4.mp4"
  render_clip "$DAILY_CLIP" 9.55 3.25 "$TMP_DIR/general_5.mp4"
  render_clip "$HOME_CLIP" 0.00 3.10 "$TMP_DIR/general_6.mp4"
  render_card "$CARD_MIND" 2.25 in "$TMP_DIR/general_7.mp4"
  concat_segments "$TMP_DIR/general_visual.mp4" \
    "$TMP_DIR/general_1.mp4" "$TMP_DIR/general_2.mp4" "$TMP_DIR/general_3.mp4" \
    "$TMP_DIR/general_4.mp4" "$TMP_DIR/general_5.mp4" "$TMP_DIR/general_6.mp4" \
    "$TMP_DIR/general_7.mp4"
  add_music "$TMP_DIR/general_visual.mp4" "$OUT_DIR/01_ponte_a_prueba_v2.mp4"
}

build_learning() {
  render_card "$CARD_LEARN" 1.70 in "$TMP_DIR/learning_1.mp4"
  render_clip "$LEARN_CLIP" 0.00 2.65 "$TMP_DIR/learning_2.mp4"
  render_clip "$LEARN_CLIP" 7.25 2.75 "$TMP_DIR/learning_3.mp4"
  render_clip "$LEARN_CLIP" 11.75 2.50 "$TMP_DIR/learning_4.mp4"
  render_card "$CARD_SMART" 1.40 out "$TMP_DIR/learning_5.mp4"
  render_clip "$LEARN_CLIP" 14.45 2.45 "$TMP_DIR/learning_6.mp4"
  render_clip "$LEARN_CLIP" 16.90 3.45 "$TMP_DIR/learning_7.mp4"
  render_card "$CARD_DOWNLOAD" 2.30 in "$TMP_DIR/learning_8.mp4"
  concat_segments "$TMP_DIR/learning_visual.mp4" \
    "$TMP_DIR/learning_1.mp4" "$TMP_DIR/learning_2.mp4" "$TMP_DIR/learning_3.mp4" \
    "$TMP_DIR/learning_4.mp4" "$TMP_DIR/learning_5.mp4" "$TMP_DIR/learning_6.mp4" \
    "$TMP_DIR/learning_7.mp4" "$TMP_DIR/learning_8.mp4"
  add_music "$TMP_DIR/learning_visual.mp4" "$OUT_DIR/02_aprende_algo_nuevo_v2.mp4"
}

build_daily() {
  render_card "$CARD_STREAK" 1.70 in "$TMP_DIR/daily_1.mp4"
  render_clip "$DAILY_CLIP" 6.00 2.25 "$TMP_DIR/daily_2.mp4"
  render_clip "$DAILY_CLIP" 10.65 2.20 "$TMP_DIR/daily_3.mp4"
  render_card "$CARD_MISSIONS" 1.45 out "$TMP_DIR/daily_4.mp4"
  render_clip "$HOME_CLIP" 0.00 3.10 "$TMP_DIR/daily_5.mp4"
  render_clip "$HOME_CLIP" 5.00 3.70 "$TMP_DIR/daily_6.mp4"
  render_card "$CARD_MIND" 2.25 in "$TMP_DIR/daily_7.mp4"
  concat_segments "$TMP_DIR/daily_visual.mp4" \
    "$TMP_DIR/daily_1.mp4" "$TMP_DIR/daily_2.mp4" "$TMP_DIR/daily_3.mp4" \
    "$TMP_DIR/daily_4.mp4" "$TMP_DIR/daily_5.mp4" "$TMP_DIR/daily_6.mp4" \
    "$TMP_DIR/daily_7.mp4"
  add_music "$TMP_DIR/daily_visual.mp4" "$OUT_DIR/03_reto_recompensa_racha_v2.mp4"
}

build_ranking() {
  render_card "$CARD_RANK" 1.70 in "$TMP_DIR/rank_1.mp4"
  render_clip "$LEAGUE_CLIP" 0.00 1.80 "$TMP_DIR/rank_2.mp4"
  render_clip "$LEAGUE_CLIP" 1.80 3.55 "$TMP_DIR/rank_3.mp4"
  render_card "$CARD_RECORD" 1.40 out "$TMP_DIR/rank_4.mp4"
  render_clip "$DAILY_CLIP" 9.55 3.25 "$TMP_DIR/rank_5.mp4"
  render_clip "$DAILY_CLIP" 12.80 2.05 "$TMP_DIR/rank_6.mp4"
  render_card "$CARD_RANK" 2.15 in "$TMP_DIR/rank_7.mp4"
  concat_segments "$TMP_DIR/rank_visual.mp4" \
    "$TMP_DIR/rank_1.mp4" "$TMP_DIR/rank_2.mp4" "$TMP_DIR/rank_3.mp4" \
    "$TMP_DIR/rank_4.mp4" "$TMP_DIR/rank_5.mp4" "$TMP_DIR/rank_6.mp4" \
    "$TMP_DIR/rank_7.mp4"
  add_music "$TMP_DIR/rank_visual.mp4" "$OUT_DIR/04_compite_y_sube_v2.mp4"
}

build_friends() {
  render_card "$CARD_FRIENDS" 1.70 in "$TMP_DIR/friends_1.mp4"
  render_clip "$FRIENDS_CLIP" 0.00 2.75 "$TMP_DIR/friends_2.mp4"
  render_clip "$FRIENDS_CLIP" 2.75 2.90 "$TMP_DIR/friends_3.mp4"
  render_card "$CARD_LOCAL" 1.45 out "$TMP_DIR/friends_4.mp4"
  render_clip "$DAILY_CLIP" 6.00 2.20 "$TMP_DIR/friends_5.mp4"
  render_clip "$DAILY_CLIP" 10.70 2.15 "$TMP_DIR/friends_6.mp4"
  render_card "$CARD_FRIENDS" 2.20 in "$TMP_DIR/friends_7.mp4"
  concat_segments "$TMP_DIR/friends_visual.mp4" \
    "$TMP_DIR/friends_1.mp4" "$TMP_DIR/friends_2.mp4" "$TMP_DIR/friends_3.mp4" \
    "$TMP_DIR/friends_4.mp4" "$TMP_DIR/friends_5.mp4" "$TMP_DIR/friends_6.mp4" \
    "$TMP_DIR/friends_7.mp4"
  add_music "$TMP_DIR/friends_visual.mp4" "$OUT_DIR/05_reta_a_tus_amigos_v2.mp4"
}

build_general
build_learning
build_daily
build_ranking
build_friends

printf 'Promos V2 exportadas en: %s\n' "$OUT_DIR"
