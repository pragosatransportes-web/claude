"""
Sync Garmin Connect -> dados/garmin.json

As credenciais sao lidas do ficheiro .env (que nunca e commitado nem partilhado).
O primeiro login guarda tokens em .garth/ para nao repetir autenticacao.

Uso:
    python sync_garmin.py            # ultimos 14 dias
    python sync_garmin.py 90         # ultimos 90 dias
    python sync_garmin.py 2025-01-01 # desde essa data
"""

import json
import sys
from datetime import date, datetime, timedelta
from pathlib import Path

from dotenv import load_dotenv
import os

BASE = Path(__file__).parent
DADOS = BASE / "dados"
FICHEIRO = DADOS / "garmin.json"
TOKENS = BASE / ".garth"


def liga():
    load_dotenv(BASE / ".env")
    email = os.getenv("GARMIN_EMAIL")
    password = os.getenv("GARMIN_PASSWORD")

    if not email or not password:
        sys.exit(
            "ERRO: falta GARMIN_EMAIL / GARMIN_PASSWORD no ficheiro .env\n"
            "Copia .env.exemplo para .env e preenche."
        )

    from garminconnect import Garmin

    api = Garmin(email, password)
    try:
        api.login(str(TOKENS))
    except Exception:
        # tokens invalidos ou inexistentes -> login completo
        api = Garmin(email, password)
        api.login()
        try:
            api.garth.dump(str(TOKENS))
        except Exception:
            pass
    return api


def seguro(fn, *args, **kwargs):
    """Nem todos os relogios expoem todas as metricas. Falha silenciosa por metrica."""
    try:
        return fn(*args, **kwargs)
    except Exception:
        return None


def extrai_dia(api, dia: str) -> dict:
    d = {"data": dia}

    stats = seguro(api.get_stats, dia) or {}
    d["passos"] = stats.get("totalSteps")
    d["calorias"] = stats.get("totalKilocalories")
    d["fc_repouso"] = stats.get("restingHeartRate")
    d["stress_medio"] = stats.get("averageStressLevel")
    d["bb_max"] = stats.get("bodyBatteryHighestValue")
    d["bb_min"] = stats.get("bodyBatteryLowestValue")
    d["minutos_intensos"] = stats.get("vigorousIntensityMinutes")
    d["minutos_moderados"] = stats.get("moderateIntensityMinutes")

    sono = seguro(api.get_sleep_data, dia) or {}
    dto = sono.get("dailySleepDTO") or {}
    if dto.get("sleepTimeSeconds"):
        d["sono_h"] = round(dto["sleepTimeSeconds"] / 3600, 2)
        d["sono_profundo_h"] = round((dto.get("deepSleepSeconds") or 0) / 3600, 2)
        d["sono_rem_h"] = round((dto.get("remSleepSeconds") or 0) / 3600, 2)
        d["sono_leve_h"] = round((dto.get("lightSleepSeconds") or 0) / 3600, 2)
        d["sono_acordado_h"] = round((dto.get("awakeSleepSeconds") or 0) / 3600, 2)
    pontuacao = (dto.get("sleepScores") or {}).get("overall") or {}
    d["sono_score"] = pontuacao.get("value")

    hrv = seguro(api.get_hrv_data, dia) or {}
    resumo = (hrv or {}).get("hrvSummary") or {}
    d["hrv_noturno"] = resumo.get("lastNightAvg")
    d["hrv_estado"] = resumo.get("status")
    d["hrv_baseline_baixo"] = (resumo.get("baseline") or {}).get("lowUpper")
    d["hrv_baseline_alto"] = (resumo.get("baseline") or {}).get("balancedUpper")

    prontidao = seguro(api.get_training_readiness, dia)
    if isinstance(prontidao, list) and prontidao:
        d["prontidao"] = prontidao[0].get("score")
        d["prontidao_nivel"] = prontidao[0].get("level")

    return {k: v for k, v in d.items() if v is not None}


def extrai_treinos(api, inicio: str, fim: str) -> list:
    brutos = seguro(api.get_activities_by_date, inicio, fim) or []
    saida = []
    for a in brutos:
        saida.append(
            {
                "id": a.get("activityId"),
                "data": (a.get("startTimeLocal") or "")[:10],
                "hora": (a.get("startTimeLocal") or "")[11:16],
                "tipo": (a.get("activityType") or {}).get("typeKey"),
                "nome": a.get("activityName"),
                "duracao_min": round((a.get("duration") or 0) / 60, 1),
                "distancia_km": round((a.get("distance") or 0) / 1000, 2),
                "fc_media": a.get("averageHR"),
                "fc_max": a.get("maxHR"),
                "calorias": a.get("calories"),
                "carga": a.get("activityTrainingLoad"),
                "efeito_aerobico": a.get("aerobicTrainingEffect"),
                "efeito_anaerobico": a.get("anaerobicTrainingEffect"),
                "ritmo_medio_min_km": (
                    round(1000 / a["averageSpeed"] / 60, 2)
                    if a.get("averageSpeed")
                    else None
                ),
            }
        )
    return saida


def main():
    arg = sys.argv[1] if len(sys.argv) > 1 else "14"
    if "-" in arg:
        inicio = datetime.strptime(arg, "%Y-%m-%d").date()
    else:
        inicio = date.today() - timedelta(days=int(arg))
    fim = date.today()

    print(f"A ligar ao Garmin Connect...")
    api = liga()
    print(f"Ligado. A recolher {inicio} -> {fim}")

    DADOS.mkdir(exist_ok=True)
    existente = {"dias": {}, "treinos": {}}
    if FICHEIRO.exists():
        existente = json.loads(FICHEIRO.read_text(encoding="utf-8"))
        existente.setdefault("dias", {})
        existente.setdefault("treinos", {})

    d = inicio
    while d <= fim:
        chave = d.isoformat()
        print(f"  {chave}", end="\r")
        existente["dias"][chave] = extrai_dia(api, chave)
        d += timedelta(days=1)

    for t in extrai_treinos(api, inicio.isoformat(), fim.isoformat()):
        if t.get("id"):
            existente["treinos"][str(t["id"])] = t

    existente["atualizado"] = datetime.now().isoformat(timespec="seconds")
    FICHEIRO.write_text(
        json.dumps(existente, ensure_ascii=False, indent=1), encoding="utf-8"
    )

    print(
        f"\nOK -> {FICHEIRO.name}: "
        f"{len(existente['dias'])} dias, {len(existente['treinos'])} treinos"
    )


if __name__ == "__main__":
    main()
