---
tipo: pessoa
empresa: Construções Pragosa, S.A.
cargo: Administrativo Combustíveis, Custos e Mobilizações
email:
telefone:
reporta_a: "[[03 Pessoas/Rita Fialho]]"
tags:
  - pessoa
  - combustiveis
  - custos
  - mobilizacoes
---

# João Campos

## Função e Responsabilidades
Administrativo de Combustíveis, Custos e Mobilizações (função transversal ao departamento). **Reporta hierarquicamente a [[03 Pessoas/Rita Fialho|Ana Rita]]** (Diretora de Logística).

## Contacto
- Email:
- Telefone:
- Empresa: Construções Pragosa, S.A.

## Ponto de Situação — Agenda Fixa
Cadência: **semanal ou quinzenal (20-30 min)**.

**Espinha comum**
1. KPIs da semana
2. Operação corrente
3. Bloqueios e riscos
4. Pessoas / equipa
5. Decisões que precisam de mim
6. Tarefas e follow-up

**Módulo específico (Combustíveis, Custos e Mobilizações)**
- Controlo de consumos e cartões de combustível
- Mobilizações de máquinas / grandes equipamentos
- Imputação de custos a obras
- Tacógrafos: descargas e conformidade (ligação ao projeto Tacógrafos / DL 84/2026)
- Licenças, sinistros, seguros

## Pendentes / Follow-up
- [ ] 

## Pontos de Situação

```dataview
TABLE data, area
FROM "02 Reuniões"
WHERE tipo = "ponto-situação" AND contains(colaborador, this.file.link)
SORT data DESC
```

## Reuniões

```dataview
TABLE data, projeto
FROM "02 Reuniões"
WHERE contains(participantes, this.file.link)
SORT data DESC
```

## Projetos Envolvidos

## Obras / Clientes Associados

## Notas
- Reporta a [[03 Pessoas/Rita Fialho|Ana Rita]].
