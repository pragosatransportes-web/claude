---
tipo: operação
área: construções
---

# Construções Pragosa

## Visão Geral
Área de obras civis e empreitadas.

## Obras Ativas

```dataview
TABLE estado, responsável
FROM "04 Obras e Clientes"
WHERE tipo = "obra" AND estado = "ativa"
SORT file.name ASC
```

## Reuniões Recentes

```dataview
TABLE data, cliente
FROM "02 Reuniões"
WHERE contains(tags, "construções")
SORT data DESC
LIMIT 10
```

## Tarefas Pendentes

## KPIs
- Ver [[06 Operações/KPIs]]
