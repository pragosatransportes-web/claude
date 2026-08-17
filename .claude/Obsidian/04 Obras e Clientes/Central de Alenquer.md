---
tipo: cliente
estado: ativo
cliente: Construções Pragosa, S.A. (interno)
responsável: "[[03 Pessoas/Ruben Sousa]]"
segmento: Indústria
tags:
  - cliente
  - interno
  - central-betão
  - indústria
---

# Central de Alenquer — Construções Pragosa, S.A.

## Resumo
Central de betão da **Construções Pragosa, S.A.** em **Alenquer** (CPSA-Alenquer), cliente **interno** do segmento [[06 Operações/Indústria|Indústria]]. Consome agregados/britas produzidos nas pedreiras do grupo, com abastecimento a partir de **[[03 Pessoas/Ricardo Santos|Santa Eulália]]** (Granito).

## Cliente / Dono de Obra
- **Construções Pragosa, S.A.** — cliente interno (consumo próprio de agregados)
- Segmento fornecedor: [[06 Operações/Indústria|Indústria]] — Pedreiras

## Responsável Interno
- **Fornecimentos de Agregados/Britas Granito:** [[03 Pessoas/Ruben Sousa|Ruben Sousa]]
- Produção Indústria: [[03 Pessoas/Ricardo Santos|Ricardo Santos]]
- Logística: [[03 Pessoas/Rita Fialho|Ana Rita]]

## Materiais Fornecidos
| Material | Origem | Notas |
|----------|--------|-------|
| Brita 1,5 Granito | Pedreira de Santa Eulália | Substituiu a **Brita 1** a partir de 08/2026 *(CE Indústria 03/08)* |

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
| | | | | |

## Tarefas
- [ ] Confirmar as **cadências de Brita 1,5 Granito** a fornecer a partir de Santa Eulália.

## Riscos
- ⚠️ Alteração de fornecimento (**Brita 1 → Brita 1,5 Granito**) — validar compatibilidade com as necessidades da central.

## Decisões
> [!decision]
> - **Fornecimento:** mudança de **Brita 1** para **Brita 1,5 Granito** a partir de **Santa Eulália**. *(CE Indústria 03/08)*

## Documentos / Ficheiros

## Notas
- Cliente interno — os fluxos são **consumo próprio** do grupo, mas geram **faturação/NC interna** e exigem controlo de qualidade e cadência como um cliente externo.

## Ligações
- [[06 Operações/Indústria]]
- [[03 Pessoas/Ricardo Santos]]
- [[03 Pessoas/Rita Fialho]]
- [[02 Reuniões/2026/2026-08-03 - CE Indústria]]
