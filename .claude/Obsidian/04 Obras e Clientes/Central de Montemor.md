---
tipo: cliente
estado: ativo
cliente: Construções Pragosa, S.A. (interno)
responsável:
segmento: Indústria
tags:
  - cliente
  - interno
  - central-betão
  - indústria
---

# Central de Montemor — Construções Pragosa, S.A.

## Resumo
Central de betão da **Construções Pragosa, S.A.** em **Montemor**, cliente **interno** do segmento [[06 Operações/Indústria|Indústria]]. Consome agregados/britas produzidos nas pedreiras do grupo (nomeadamente **Brita 1 do Cano**).

## Cliente / Dono de Obra
- **Construções Pragosa, S.A.** — cliente interno (consumo próprio de agregados)
- Segmento fornecedor: [[06 Operações/Indústria|Indústria]] — Pedreiras

## Responsável Interno
- Produção Indústria: [[03 Pessoas/Ricardo Santos|Ricardo Santos]]
- Logística: [[03 Pessoas/Rita Fialho|Ana Rita]]

## Materiais Fornecidos
| Material | Origem | Notas |
|----------|--------|-------|
| Brita 1 | Pedreira do Cano | Cadências a avaliar com a Logística |

## Reuniões

```dataview
TABLE data, participantes
FROM "02 Reuniões"
WHERE cliente = this.file.link OR contains(file.outlinks, this.file.link)
SORT data DESC
```

## Reclamações
| Data | Material | Motivo | Estado | Ação |
|------|----------|--------|--------|------|
| 2026-07-06 | Brita 1 (Cano) | **Excesso de finos** — carregamento de material da **base do stock** (mais fino) com **stock baixo** | Em tratamento | **NC** + **relatório de ocorrência assinado pelo encarregado**; explicar custos — **transporte + produto** |

## Tarefas
- [ ] **[[03 Pessoas/Rita Fialho|Ana Rita]]** — avaliar com a Central as **cadências de britas** a fornecer neste momento.
- [ ] Emitir a **NC da fatura** da Brita 1 do Cano (carregamento incorreto) e explicar custos ao encarregado responsável.

## Riscos
- ⚠️ Erros de **carregamento** na expedição podem gerar reclamações e NCs internas — reforçar controlo no carregamento.

## Decisões
> [!decision]
> - **Brita 1 (Cano):** carregamento da base do stock (finos) com stock baixo → emitir **NC + relatório de ocorrência** com o **encarregado a assinar como responsável**, incluindo **custo de transporte + custo de produto**. *(CE Indústria 06/07)*

## Documentos / Ficheiros

## Notas
- Cliente interno — os fluxos são **consumo próprio** do grupo, mas geram **faturação/NC interna** e exigem controlo de qualidade e cadência como um cliente externo.

## Ligações
- [[06 Operações/Indústria]]
- [[03 Pessoas/Ricardo Santos]]
- [[03 Pessoas/Rita Fialho]]
- [[02 Reuniões/2026/2026-07-06 - CE Indústria]]
