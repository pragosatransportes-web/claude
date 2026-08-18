---
tipo: operação
área: manutenção
data: 2026-08-18
tags:
  - manutenção
  - frota
  - roadmap
  - implementação
  - organização
---

# Roadmap — Implementação da Gestão de Manutenções e Frota

> Plano de arranque da função proposta em [[06 Operações/Função — Gestão de Manutenções e Frota]] · [[06 Operações/Equipa Logística]] · [[03 Pessoas/Rita Fialho|Ana Rita]]

---

## Resumo Executivo

Plano faseado para pôr a função a funcionar **sem tentar fazer tudo ao mesmo tempo**. A lógica: primeiro **decidir e delimitar** (Fase 0), depois **construir a fundação de informação** (Fase 1), pôr a **preventiva a rolar** (Fase 2), instalar a **gestão por dados** (Fase 3) e só então avançar para a **preditiva** (Fase 4).

> [!info] Marcos relativos, não datas fixas
> O roadmap usa **M0, M1, M2…** (meses a partir do arranque). O M0 só começa depois da decisão da Direção e da contratação/afetação da pessoa. Datas fixas devem ser preenchidas quando o arranque for aprovado.

**Princípio orientador:** cada fase entrega algo **utilizável** no fim. Nada de "grande sistema" que só dá valor ao fim de um ano.

---

## Fase 0 — Decisão e Enquadramento *(antes do M0 · ~2–4 semanas)*

Resolver o que **bloqueia** o arranque. Nada disto depende de já haver pessoa contratada.

| # | Entregável | Responsável | Estado |
|---|---|---|---|
| 0.1 | Decidir a relação da função com os Gestores de Frota por área (coordena vs. absorve) | Direção + [[03 Pessoas/Rita Fialho]] | ⬜ |
| 0.2 | Delimitar o perímetro da frota abrangida | [[03 Pessoas/Rita Fialho]] | ⬜ |
| 0.3 | Definir a ferramenta de suporte (ver Fase 1) | Rita + IT | ⬜ |
| 0.4 | Fixar o limite de valor de aprovação autónoma (€) | Direção | ⬜ |
| 0.5 | Aprovar a criação da função e a via de recrutamento (interno/externo) | Direção | ⬜ |

> [!decision] Decisão estruturante — relação com os gestores de área
> Já existem [[03 Pessoas/Gabriela Soares]] (Cisternas), [[03 Pessoas/Bruna Cordeiro]] (Indústria) e [[03 Pessoas/Frederico Cristiano]] (CPSA). Recomendação: a função nasce **transversal e de coordenação** — define o método, os KPIs e a base técnica, e os gestores de área alimentam-na com o dia-a-dia. Evita esvaziar funções existentes e reduz resistência à mudança.

**Marco M0:** função aprovada, perímetro fechado, ferramenta escolhida, pessoa afeta.

---

## Fase 1 — Fundação de Informação *(M0 → M3)*

Objetivo: **saber o que temos e em que estado está.** Sem isto, todo o resto é adivinhação.

### Entregáveis
- [ ] **Inventário técnico** dos equipamentos do perímetro — partir do catálogo de ~242 máquinas da [[05 Projetos/App CPSA Smart Logistics|Smart Logistics]] e completar com marca, modelo, VIN, motor, ano, km/horas.
- [ ] **Ficha técnica por equipamento** com referências OEM/alternativas, consumíveis, pneus, filtros, óleos e componentes críticos (começar pelos equipamentos críticos, não por todos).
- [ ] **Estado atual da frota** — quadro vivo: operacional / em oficina / imobilizado / a aguardar peça.
- [ ] **Ligação de dados** — definir a fonte de km/horas (telemetria [[05 Projetos/App Análise de Paragens (Traccar)|Traccar]]) e o registo de avarias ([[App Gestão de Avarias]]).
- [ ] **Canal único com o Tráfego** — estabelecer a rotina de comunicação bidirecional (ponto diário de estado).

### Baseline (medir agora, para haver com que comparar)
- [ ] % de frota disponível hoje;
- [ ] Nº médio de equipamentos imobilizados;
- [ ] Dias médios de imobilização;
- [ ] Lista das oficinas usadas e histórico recente (o que houver).

**Marco M3:** existe uma **fonte única de verdade** sobre a frota — inventário + estado + baseline.

> [!warning] Risco da Fase 1
> A tentação de "documentar tudo" trava o arranque. **Regra:** equipamentos críticos primeiro; o resto entra à medida que passa por oficina.

---

## Fase 2 — Preventiva a Rolar *(M3 → M6)*

Objetivo: passar do **reativo** para o **planeado** na parte que dá mais retorno — a preventiva.

### Entregáveis
- [ ] **Plano de manutenção preventiva** por km / horas / tempo, por equipamento.
- [ ] **Alertas de antecipação** — revisões e inspeções a vencer nos próximos 30/60 dias.
- [ ] **Histórico por oficina** — tempos de imobilização e cumprimento de prazos por oficina.
- [ ] **Processo de corretiva formalizado** — da comunicação da avaria ao encerramento, com os níveis P1–P4 em uso.
- [ ] **Previsões realistas ao Tráfego** — data prevista com dependência explícita (ex.: peça X), não a data "prometida".

**Marco M6:** o plano preventivo está a correr e as corretivas seguem um processo único com prioridades.

---

## Fase 3 — Gestão por Dados *(M6 → M12)*

Objetivo: instalar a **componente de gestão** — decidir com números.

### Entregáveis
- [ ] **Relatório mensal** (disponibilidade · manutenção · custos · oficinas · análise).
- [ ] **KPIs com metas** — definidas contra a baseline da Fase 1. Ver [[06 Operações/KPIs]].
- [ ] **Custo de manutenção/km e por equipamento** a ser acompanhado.
- [ ] **Avaliação de oficinas** — prazos, MTTR, reparações repetidas.
- [ ] **Revisão semanal estruturada** consolidada como rotina.

### KPIs — foco do Ano 1
| KPI | Meta (definir vs. baseline) |
|---|---|
| ⭐ Disponibilidade da frota (%) | ↑ |
| Dias de imobilização | ↓ |
| MTTR | ↓ |
| % preventiva no prazo | ↑ |
| Tempo médio à espera de peças | ↓ |

**Marco M12:** a Direção recebe um relatório mensal fiável e a função é avaliada por KPIs.

---

## Fase 4 — Preditiva *(M12+)*

Objetivo: antecipar falhas **antes** de acontecerem — só depois de haver histórico e telemetria consolidados.

### Entregáveis
- [ ] Indicadores preditivos por telemetria (km, horas, consumos, desgaste).
- [ ] Identificação de padrões de falha recorrentes → intervenção antes do limite de utilização.
- [ ] Regras de substituição preventiva de componentes críticos.

> A preditiva é **Fase 2 da maturidade**, não do arranque. Depende de a Fase 1 e 3 estarem sólidas.

---

## Linha do tempo (resumo)

| Fase | Janela | Entrega central | Marco |
|---|---|---|---|
| **0 · Decisão** | Pré-M0 | Função aprovada e delimitada | M0 |
| **1 · Fundação** | M0–M3 | Inventário + estado + baseline | M3 |
| **2 · Preventiva** | M3–M6 | Plano preventivo a rolar | M6 |
| **3 · Gestão** | M6–M12 | Relatório mensal + KPIs | M12 |
| **4 · Preditiva** | M12+ | Antecipação de falhas | — |

---

## Riscos e mitigação

| Risco | Impacto | Mitigação |
|---|---|---|
| Sobreposição com gestores de frota por área | Conflito, dupla gestão | Decisão 0.1 clara e comunicada |
| Informação em Excel disperso | Função não escala, depende da pessoa | Ferramenta definida na Fase 0/1 |
| "Documentar tudo" antes de dar valor | Arranque trava | Críticos primeiro; resto incremental |
| Autoridade sem respaldo da Direção | Função impossível | Autoridade e limites por escrito (Fase 0) |
| Ponto único de falha (1 pessoa) | Paragem em ausências | Backup e informação centralizada desde o início |
| Metas de KPI sem baseline | Não avaliável | Medir baseline na Fase 1 |

---

## Tarefas
- [ ] Fechar as 5 decisões da Fase 0 com a Direção 📌
- [ ] Preparar o arranque do inventário técnico a partir da Smart Logistics
- [ ] Definir a fonte oficial de km/horas (Traccar) e o registo de avarias
- [ ] Agendar a medição de baseline (disponibilidade + imobilização)
- [ ] Rever este roadmap com datas fixas assim que o M0 for aprovado

## Ligações
- [[06 Operações/Função — Gestão de Manutenções e Frota]]
- [[06 Operações/Perfil de Recrutamento — Gestor de Manutenção e Frota]]
- [[06 Operações/Manutenções]]
- [[06 Operações/KPIs]]
- [[05 Projetos/App CPSA Smart Logistics]]
- [[05 Projetos/App Análise de Paragens (Traccar)]]
