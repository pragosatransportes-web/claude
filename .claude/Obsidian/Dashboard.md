---
cssclass: dashboard
---

# Dashboard — Construções Pragosa

> Centro de controlo operacional · [[00 Sistema/CLAUDE]]

---

## Hoje

### Diário
[[01 Diário/2026/2026-06-10]]

### Tarefas Urgentes
```tasks
not done
(priority is high) OR (due before tomorrow)
sort by due
limit 10
```

---

## Reuniões Recentes

```dataview
TABLE data, cliente, projeto
FROM "02 Reuniões"
SORT data DESC
LIMIT 8
```

---

## Obras e Clientes

```dataview
TABLE estado, responsável, data_fim_prevista
FROM "04 Obras e Clientes"
WHERE estado = "ativa"
SORT file.name ASC
```

---

## Projetos

```dataview
TABLE estado, prioridade, responsável
FROM "05 Projetos"
WHERE estado = "ativo"
SORT prioridade DESC
```

---

## Operações

| Área | Link |
|------|------|
| Construções | [[06 Operações/Construções Pragosa]] |
| Indústria / Pedreiras | [[06 Operações/Indústria]] |
| Cisternas | [[06 Operações/Cisternas]] |
| Combustíveis e Mobilizações | [[06 Operações/Combustíveis, Custos e Mobilizações]] |
| Manutenções | [[06 Operações/Manutenções]] |
| KPIs | [[06 Operações/KPIs]] |

---

## Tarefas Esta Semana

```tasks
not done
due before next week
sort by due
limit 15
```

---

## Estratégia

- [[07 Estratégia/OKRs]]
- [[07 Estratégia/Planeamento]]
