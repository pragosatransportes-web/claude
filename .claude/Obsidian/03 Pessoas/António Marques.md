---
tipo: pessoa
empresa: Construções Pragosa, S.A.
cargo: Administrativo Cisternas e Lançamento
email:
telefone:
reporta_a: "[[03 Pessoas/Rita Fialho]]"
tags:
  - pessoa
  - cisternas
  - administrativo
---

# António Marques

## Função e Responsabilidades
Administrativo de Cisternas e Lançamento. Apoio administrativo à operação das [[06 Operações/Cisternas|Cisternas]]. **Reporta hierarquicamente a [[03 Pessoas/Rita Fialho|Ana Rita]]** (Diretora de Logística).

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

**Módulo específico (Cisternas e Lançamento)**
- Propostas de fornecimento e notas de encomenda
- Guias de transporte e lançamento
- Faturação proforma · receção de materiais
- Ocorrências

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
