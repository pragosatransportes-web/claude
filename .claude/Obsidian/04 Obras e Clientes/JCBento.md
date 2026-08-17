---
tipo: cliente
estado: ativo
cliente: JCBento
responsável: "[[03 Pessoas/Joana Pragosa]]"
segmento: Transportes a terceiros
data_início: 2026-07-27
tags:
  - cliente
  - externo
  - transportes
  - jcbento
  - faturação
---

# JCBento — Registo de Transportes

## Resumo
Registo dos **transportes prestados à JCBento** (serviço a terceiros), pedido na reunião de **[[02 Reuniões/2026/2026-07-27 - Controlo de Obras|Controlo de Obras de 27/07]]**. Objetivo: dar **rasto a cada transporte** entre **Tojal ↔ JCBento** para permitir **faturação/imputação** correta e evitar serviços prestados sem controlo. Responsável: [[03 Pessoas/Joana Pragosa|Joana Pragosa]] (Administração), com apoio da Logística [[03 Pessoas/Rita Fialho|Ana Rita]].

## Cliente
- **JCBento** — cliente externo (transportes prestados pela CPSA)
- Fluxos: **Tojal → JCBento** e **JCBento → Tojal**

## Responsável Interno
- Identificação/registo de transportes: [[03 Pessoas/Joana Pragosa|Joana Pragosa]] — Administração
- Logística: [[03 Pessoas/Rita Fialho|Ana Rita]]

## Registo de Transportes
> Lançar **uma linha por transporte**. Sentido: `Tojal → JCBento` ou `JCBento → Tojal`.

| Data | Sentido | Viatura / Matrícula | Motorista | Material / Carga | Quantidade | Guia / Nº | Faturado? | Observações |
| ---- | ------- | ------------------- | --------- | ---------------- | ---------: | --------- | --------- | ----------- |
|      |         |                     |           |                  |            |           |           |             |

## Resumo Mensal
| Mês     | Nº transportes | Tojal → JCBento | JCBento → Tojal | Faturados | Por faturar |
| ------- | -------------: | --------------: | --------------: | --------: | ----------: |
| 2026-07 |                |                 |                 |           |             |
| 2026-08 |                |                 |                 |           |             |

## Reuniões

```dataview
TABLE data, participantes
FROM "02 Reuniões"
WHERE cliente = this.file.link OR contains(file.outlinks, this.file.link)
SORT data DESC
```

## Tarefas
- [ ] Definir **quem regista** cada transporte no momento em que acontece (motorista/tráfego → registo). *(Resp.: [[03 Pessoas/Joana Pragosa]])* 📅 2026-08-07
- [ ] Confirmar se os transportes à JCBento estão a ser **faturados** e a que **tarifa/condição**. *(Resp.: [[03 Pessoas/Joana Pragosa]])* 📅 2026-08-07
- [ ] Recuperar os transportes já efetuados (histórico) e lançar no registo.

## Riscos
- ⚠️ **Transportes não identificados** → serviços prestados a terceiros sem rasto para faturação/imputação (risco de perda de receita).
- ⚠️ Registo dependente de preenchimento manual — definir rotina para garantir que **nenhum transporte fica por lançar**.

## Decisões
> [!decision]
> - Passar a **identificar e registar todos os transportes prestados à JCBento** (Tojal ↔ JCBento). *(Controlo de Obras 27/07)* — Resp.: [[03 Pessoas/Joana Pragosa]].

## Documentos / Ficheiros

## Notas
- Origem do pedido: [[02 Reuniões/2026/2026-07-27 - Controlo de Obras]] — ponto **5. Transportes para a JCBento**.

## Ligações
- [[02 Reuniões/2026/2026-07-27 - Controlo de Obras]]
- [[03 Pessoas/Joana Pragosa]]
- [[03 Pessoas/Rita Fialho]]
- [[06 Operações/Combustíveis, Custos e Mobilizações]]
