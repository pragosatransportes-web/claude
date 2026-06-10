# Dashboard Executivo

> Centro de controlo da empresa

---

# Hoje

## Diário de hoje
[[<% tp.date.now("YYYY-MM-DD") %>]]

## Reuniões Recentes

```dataview
TABLE data, cliente, projeto
FROM "02 Reuniões"
SORT data DESC
LIMIT 10
```

## Próximas Prioridades

```tasks
not done
sort by priority
limit 15
```

---

# Clientes

## Clientes ativos

```dataview
TABLE estado, responsável
FROM "04 Clientes"
SORT file.name ASC
```

## Últimas reuniões com clientes

```dataview
TABLE data, cliente
FROM "02 Reuniões"
WHERE contains(tags, "cliente")
SORT data DESC
LIMIT 10
```

---

# Projetos

## Projetos ativos

```dataview
TABLE estado, prioridade, responsável
FROM "05 Projetos"
WHERE estado = "ativo"
SORT prioridade DESC
```

## Projetos sem atualização recente

```dataview
TABLE file.mtime as "Última Atualização"
FROM "05 Projetos"
SORT file.mtime ASC
LIMIT 10
```

---

# Operações

## Produção

[[06 Operações/Produção]]

## Mercado

[[06 Operações/Mercado]]

## KPIs

[[06 Operações/KPIs]]

---

# Decisões Estratégicas

## Últimas decisões

```dataview
TABLE data, impacto
FROM "90 Decisões"
SORT data DESC
LIMIT 15
```

---

# Pessoas

## Pessoas mais envolvidas

```dataview
TABLE cargo, empresa
FROM "03 Pessoas"
SORT file.name ASC
```

---

# Tarefas

## Urgentes

```tasks
not done
(priority is high) OR (due before tomorrow)
sort by due
```

## Esta semana

```tasks
not done
due before next week
sort by due
```

---

# Reuniões

## Esta semana

```dataview
TABLE cliente, projeto
FROM "02 Reuniões"
WHERE data >= date(today) - dur(7 days)
SORT data DESC
```

---

# Estratégia

[[07 Estratégia/Objetivos]]

[[07 Estratégia/OKRs]]

[[07 Estratégia/Planeamento Anual]]

---

# Inbox

```dataview
LIST
FROM "99 Inbox"
SORT file.ctime DESC
LIMIT 20
```