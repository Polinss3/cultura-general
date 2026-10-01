"""Panel de Cultura General en Supabase. Solo hace solicitudes HTTP GET.

Uso: ./scripts/metricas-supabase [--days 10]

Necesita una sesión activa en Supabase CLI con acceso al proyecto. La clave se
obtiene en memoria, no se guarda ni se imprime. Se recuperan únicamente las
columnas necesarias; ningún dato personal se muestra en la salida.
"""

from __future__ import annotations

import argparse
from collections import Counter, defaultdict
from datetime import date, datetime, time, timedelta, timezone
import json
import shutil
import subprocess
import sys
from urllib.error import HTTPError, URLError
from urllib.parse import urlencode
from urllib.request import Request, urlopen
from zoneinfo import ZoneInfo


PROJECT_REF = "xjzsrbcmldbgwwabnmug"  # Cultura General
BASE_URL = f"https://{PROJECT_REF}.supabase.co/rest/v1"
MADRID = ZoneInfo("Europe/Madrid")
PAGE_SIZE = 1000


def service_key() -> str:
    cli = shutil.which("supabase") or "/opt/homebrew/bin/supabase"
    try:
        result = subprocess.run(
            [cli, "projects", "api-keys", "--project-ref", PROJECT_REF, "--output", "json"],
            capture_output=True,
            text=True,
            check=True,
            timeout=30,
        )
        keys = json.loads(result.stdout)
    except (OSError, subprocess.CalledProcessError, subprocess.TimeoutExpired, ValueError):
        raise RuntimeError(
            "No se pudo leer la clave con Supabase CLI. Comprueba `supabase login` "
            "y tu acceso al proyecto Cultura General."
        ) from None
    for item in keys:
        if item.get("id") == "service_role" and item.get("api_key"):
            return item["api_key"]
    raise RuntimeError("La cuenta de Supabase CLI no tiene acceso a la clave de lectura del panel.")


def get_rows(key: str, table: str, columns: str, **filters: str) -> list[dict]:
    """Lee páginas de PostgREST. Nunca usa POST, PATCH, DELETE ni RPC."""
    rows: list[dict] = []
    offset = 0
    query = urlencode({"select": columns, **filters})
    url = f"{BASE_URL}/{table}?{query}"
    while True:
        request = Request(
            url,
            headers={
                "apikey": key,
                "Authorization": f"Bearer {key}",
                "Range-Unit": "items",
                "Range": f"{offset}-{offset + PAGE_SIZE - 1}",
                "Accept": "application/json",
            },
            method="GET",
        )
        try:
            with urlopen(request, timeout=30) as response:
                page = json.load(response)
        except (HTTPError, URLError, TimeoutError, ValueError):
            raise RuntimeError(f"No se pudo leer la tabla `{table}` de Supabase.") from None
        if not isinstance(page, list):
            raise RuntimeError(f"Respuesta inesperada al leer `{table}`.")
        rows.extend(page)
        if len(page) < PAGE_SIZE:
            return rows
        offset += PAGE_SIZE


def count_rows(key: str, table: str, **filters: str) -> int:
    query = urlencode({"select": "id", "limit": "1", **filters})
    request = Request(
        f"{BASE_URL}/{table}?{query}",
        headers={
            "apikey": key,
            "Authorization": f"Bearer {key}",
            "Prefer": "count=exact",
            "Range-Unit": "items",
            "Range": "0-0",
        },
        method="GET",
    )
    try:
        with urlopen(request, timeout=30) as response:
            return int(response.headers["Content-Range"].split("/")[-1])
    except (HTTPError, URLError, TimeoutError, ValueError, TypeError, AttributeError):
        raise RuntimeError(f"No se pudo contar la tabla `{table}` de Supabase.") from None


def utc_day(timestamp: str | None) -> date | None:
    if not timestamp:
        return None
    return datetime.fromisoformat(timestamp.replace("Z", "+00:00")).astimezone(timezone.utc).date()


def number(value: int | float) -> str:
    return f"{value:,}".replace(",", ".")


def percent(part: int, whole: int) -> str:
    return f"{100 * part / whole:.1f}%" if whole else "—"


def table(headers: list[str], rows: list[list[object]]) -> None:
    data = [[str(value) for value in row] for row in rows]
    widths = [max(len(headers[i]), *(len(row[i]) for row in data)) for i in range(len(headers))]
    line = "+-" + "-+-".join("-" * width for width in widths) + "-+"
    print(line)
    print("| " + " | ".join(headers[i].ljust(widths[i]) for i in range(len(headers))) + " |")
    print(line)
    for row in data:
        print("| " + " | ".join(row[i].ljust(widths[i]) for i in range(len(headers))) + " |")
    print(line)


def section(title: str) -> None:
    print(f"\n{title}\n" + "=" * len(title))


def completed_levels(progress: object) -> set[int]:
    if not isinstance(progress, dict):
        return set()
    levels = progress.get("completedLevels", [])
    if not isinstance(levels, list):
        return set()
    return {level for level in levels if type(level) is int and 1 <= level <= 400}


def show_dashboard(days: int) -> None:
    now = datetime.now(MADRID)
    # La app construye todayStr() con toISOString(): el día del Diario es UTC.
    today = datetime.now(timezone.utc).date()
    start = today - timedelta(days=days - 1)
    start_utc = datetime.combine(start, time.min, timezone.utc)
    key = service_key()

    rankings = get_rows(key, "daily_rankings", "user_id,date,is_correct,score", date=f"gte.{start}")
    profiles = get_rows(
        key, "profiles",
        "id,created_at,total_answered,total_correct,premium_tier,premium_until,adventure_legacy,speed_record,ladder_best",
    )
    adventure = get_rows(key, "user_adventure_progress", "user_id,progress,updated_at")
    coin_events = get_rows(
        key, "coin_ledger", "user_id,reason,created_at",
        created_at=f"gte.{start_utc.isoformat()}",
    )
    daily_history = get_rows(key, "daily_rankings", "user_id,date")
    base_questions = count_rows(key, "questions", active="eq.true")
    pro_questions = count_rows(key, "pro_questions", active="eq.true")

    dates = [today - timedelta(days=i) for i in range(days)]
    participants: dict[date, set[str]] = defaultdict(set)
    correct: Counter[date] = Counter()
    for row in rankings:
        day = date.fromisoformat(row["date"])
        if start <= day <= today:
            participants[day].add(row["user_id"])
            correct[day] += bool(row["is_correct"] if row["is_correct"] is not None else (row["score"] or 0) > 0)
    unique_daily = set().union(*participants.values()) if participants else set()
    returners = Counter(uid for group in participants.values() for uid in group)

    print(f"CULTURA GENERAL · SUPABASE · {now:%d/%m/%Y %H:%M} (Madrid)")
    print(f"Días de la app (UTC): {start:%d/%m/%Y}–{today:%d/%m/%Y}, ambos incluidos · SOLO LECTURA")
    section("PREGUNTA DIARIA")
    daily_rows = [
        ["Hoy" if day == today else "Ayer" if day == today - timedelta(days=1) else "",
         day.strftime("%d/%m/%Y"), number(len(participants[day])),
         number(len(participants[day])), number(correct[day]), percent(correct[day], len(participants[day]))]
        for day in dates
    ]
    table(["", "Fecha", "Usuarios", "Respuestas", "Aciertos", "% acierto"], daily_rows)
    total_participations = sum(map(len, participants.values()))
    table(["Resumen de la ventana", "Valor"], [
        ["Participaciones (usuario/día)", number(total_participations)],
        ["Usuarios distintos", number(len(unique_daily))],
        ["Respuestas confirmadas", number(total_participations)],
        ["Media de usuarios por día", f"{total_participations / days:.1f}"],
        ["Media de días cerrados", f"{(total_participations - len(participants[today])) / (days - 1):.1f}" if days > 1 else "—"],
        ["Usuarios en 2+ días", number(sum(count >= 2 for count in returners.values()))],
        ["Porcentaje de aciertos", percent(sum(correct.values()), total_participations)],
    ])

    history_users = {row["user_id"] for row in daily_history}
    all_daily_answers = get_rows(key, "user_answers", "user_id,is_correct", mode="eq.daily")
    section("USUARIOS Y RESPUESTAS · HISTÓRICO")
    total_answered = sum(row.get("total_answered") or 0 for row in profiles)
    total_correct = sum(row.get("total_correct") or 0 for row in profiles)
    table(["Métrica", "Valor"], [
        ["Perfiles registrados", number(len(profiles))],
        [f"Nuevos perfiles en {days} {'día' if days == 1 else 'días'}", number(sum(start <= utc_day(p.get("created_at")) <= today for p in profiles if p.get("created_at")))],
        ["Perfiles con respuestas", number(sum((p.get("total_answered") or 0) > 0 for p in profiles))],
        ["Respuestas de todos los modos*", number(total_answered)],
        ["Aciertos de todos los modos*", f"{number(total_correct)} ({percent(total_correct, total_answered)})"],
        ["Usuarios históricos en Diario", number(len(history_users))],
        ["Días respondidos en Diario", number(len(daily_history))],
        ["Filas de historial de respuestas", number(len(all_daily_answers))],
        ["Perfiles con récord Contrarreloj", number(sum((p.get("speed_record") or 0) > 0 for p in profiles))],
        ["Perfiles con avance Ascenso", number(sum((p.get("ladder_best") or 0) > 0 for p in profiles))],
    ])

    section("AVENTURA · PROGRESO GUARDADO")
    completed = [completed_levels(row.get("progress")) for row in adventure]
    highest = [max(levels, default=0) for levels in completed]
    players = sum(bool(levels) for levels in completed)
    table(["Métrica", "Valor"], [
        ["Perfiles con registro de progreso", number(len(adventure))],
        ["Jugadores con 1+ nivel terminado", number(players)],
        ["Niveles terminados (suma)", number(sum(map(len, completed)))],
        ["Nivel más alto terminado", number(max(highest, default=0))],
        ["Registros sin nivel terminado", number(len(adventure) - players)],
    ])
    table(["Nivel terminado", "Usuarios"], [
        [str(level), number(sum(level in levels for levels in completed))]
        for level in (1, 2, 3, 5, 10, 20, 40, 100, 200, 400)
    ])
    table(["Nivel máximo por jugador", "Usuarios"], [
        ["Ninguno", number(sum(level == 0 for level in highest))],
        ["1–10", number(sum(1 <= level <= 10 for level in highest))],
        ["11–40", number(sum(11 <= level <= 40 for level in highest))],
        ["41–200", number(sum(41 <= level <= 200 for level in highest))],
        ["201–400", number(sum(201 <= level <= 400 for level in highest))],
    ])

    section("CONTENIDO Y CG PRO")
    tier_counts = Counter(row.get("premium_tier") or "none" for row in profiles)
    profile_by_id = {row["id"]: row for row in profiles}
    free_beyond_40 = sum(
        max(levels, default=0) > 40
        and profile_by_id.get(row["user_id"], {}).get("premium_tier") == "none"
        and not profile_by_id.get(row["user_id"], {}).get("adventure_legacy")
        for row, levels in zip(adventure, completed)
    )
    table(["Métrica", "Valor"], [
        ["Preguntas gratuitas activas", number(base_questions)],
        ["Preguntas PRO activas", number(pro_questions)],
        ["PRO mensual (perfil)", number(tier_counts["monthly"])],
        ["PRO anual (perfil)", number(tier_counts["annual"])],
        ["PRO vitalicio (perfil)", number(tier_counts["lifetime"])],
        ["Acceso anterior a Aventura", number(sum(bool(p.get("adventure_legacy")) for p in profiles))],
        ["Gratis >40 sin marca anterior", number(free_beyond_40)],
    ])

    recent_coins = [row for row in coin_events if row.get("created_at") and start <= utc_day(row["created_at"]) <= today]
    coin_users = {row["user_id"] for row in recent_coins}
    reasons = Counter(row.get("reason") or "sin motivo" for row in recent_coins)
    section(f"ACTIVIDAD DE MONEDAS · ÚLTIMOS {days} DÍAS")
    table(["Métrica", "Valor"], [
        ["Eventos registrados", number(len(recent_coins))],
        ["Usuarios distintos", number(len(coin_users))],
    ])
    table(["Motivo", "Eventos"], [[reason, number(count)] for reason, count in reasons.most_common(8)])

    print("\n* Sumas de contadores de perfil; no equivalen a eventos individuales de Aventura.")
    print("  Los niveles terminados no indican cuántas respuestas o intentos hubo en Aventura.")
    print("  Datos de usuarios registrados y sincronizados; partidas locales de invitados pueden faltar.")
    print("  Los estados PRO son accesos del perfil, no ventas confirmadas.")
    print("  'Gratis >40 sin marca anterior' puede regularizarse cuando la app sincronice.")
    print("  Eventos de monedas no equivalen a respuestas ni a usuarios activos totales.")
    print("  'Hoy' sigue la fecha UTC de la app; en Madrid puede cambiar a las 01:00 o 02:00.")


def main() -> int:
    parser = argparse.ArgumentParser(description="Métricas de Cultura General en Supabase (solo lectura)")
    parser.add_argument("--days", type=int, default=10, help="Días de calendario, incluido hoy (1–90; por defecto 10)")
    args = parser.parse_args()
    if not 1 <= args.days <= 90:
        parser.error("--days debe estar entre 1 y 90")
    try:
        show_dashboard(args.days)
    except RuntimeError as error:
        print(f"Error: {error}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
