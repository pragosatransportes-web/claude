---
tipo: dashboard
area: Logística
tags:
  - equipa
  - dashboard
  - ponto-situação
---

# Equipa Logística — Ponto de Situação Semanal

> Quadro consolidado dos reportes diretos · [[Dashboard]] · [[03 Pessoas/Rita Fialho|Ana Rita]]

---

## Reportes Diretos

```dataview
TABLE cargo AS "Função", area AS "Área", inicio_funcoes AS "Início"
FROM "03 Pessoas"
WHERE reporta_a = [[03 Pessoas/Rita Fialho]]
SORT cargo ASC
```

| Colaborador | Função | Cadência |
|---|---|---|
| [[03 Pessoas/Gabriela Soares]] | Gestora Frota — Cisternas | Semanal (30 min) |
| [[03 Pessoas/Bruna Cordeiro]] | Gestora Frota — Indústria | Semanal (30 min) |
| [[03 Pessoas/Frederico Catarino]] | Gestor Frota — CPSA | 2×/semana (onboarding) |
| [[03 Pessoas/João Campos]] | Adm. Combustíveis, Custos e Mobilizações | Semanal / quinzenal |
| [[03 Pessoas/António Marques]] | Adm. Cisternas e Lançamento | Semanal / quinzenal |
| *Vera Bairros* | *a definir* | *entra em Agosto* |

---

## Últimos Pontos de Situação

```dataview
TABLE colaborador AS "Colaborador", area AS "Área", estado AS "Estado"
FROM "02 Reuniões"
WHERE tipo = "ponto-situação"
SORT data DESC
LIMIT 15
```

---

## Pendentes da Equipa (por colaborador)

```tasks
not done
path includes 03 Pessoas
sort by path
group by heading
hide backlink
```

---

## Follow-ups Atrasados / Esta Semana

```tasks
not done
path includes 03 Pessoas
happens before next week
sort by due
```

---

## Sem Ponto de Situação Registado (2 semanas)

```dataview
LIST
FROM "03 Pessoas"
WHERE reporta_a = [[03 Pessoas/Rita Fialho]]
WHERE length(filter(file.inlinks, (l) => l.tipo = "ponto-situação")) = 0
```

---

## Notas
- KPIs detalhados e decisões ficam em cada nota de [ponto de situação](09 Templates/ponto de situação.md); este quadro agrega o estado global.
- Fechar o ciclo semanal: rever pendentes → validar decisões → atualizar tarefas com prazo.
