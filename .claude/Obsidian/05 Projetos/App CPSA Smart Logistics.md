---
tipo: projeto
estado: ativo
cliente:
responsável: "[[03 Pessoas/Rita Fialho]]"
prioridade: alta
data_início: 2026-07-30
data_fim_prevista:
tags:
  - projeto
  - frota
  - transportes-especiais
  - logística
---

# App CPSA Smart Logistics

> ⚙️ App HTML local single-file: `CPSA_Smart_Logistics.html` (junto ao `dashboard-master.html`). Dados em `localStorage` (`cpsa_smartlog_v1`).

## Objetivo
Motor de decisão para **Transportes Especiais**: sugerir automaticamente o melhor conjunto **Trator + Porta-Máquinas (PM01 / PM02 / PM03)** para transportar máquinas, com:
- avaliação legal (normal / especial / excecional) e necessidade de **carro-piloto**;
- **conjugação de pedidos por rota** (empilha máquinas pequenas na mesma viagem quando cabem);
- otimização por **proximidade** para evitar voltas vazias.

## Estado Atual
- **Iniciada 2026-07-30.** App funcional com dados reais carregados.
- **Catálogo:** 242 máquinas transportáveis (extraídas de `TIPOS DE EQUIPAMENTOS CPSA.xlsx`).
- **Histórico:** 400 fretes de 2026 já injetados (auto-carregados na 1ª abertura).
- **3 porta-máquinas confirmados:** BG-52-ZE (Vitor Januário) = PM01 · 94-TA-96 (Amilcar Carreira) = PM02 · BE-10-MB (Davide Nunes) = PM03.
- **Simulador com 2 vistas:** *Consulta rápida* (localização de equipamentos + combinação otimizada) e *Planeamento de rotas* (insere todos os pedidos → conjugações por rota, afetação aos 3 conjuntos por prazo, encadeamentos).
- Importação de pedidos por Excel padronizado (`DP_MBQ_Transportes.xlsx`) e por CSV.

## Pessoas Envolvidas
- [[03 Pessoas/Rita Fialho]] *(responsável — Logística)*
- [[03 Pessoas/Frederico Cristiano]] *(Gestor de Frota — potencial utilizador para consulta da aptidão dos equipamentos)*

## Reuniões

```dataview
TABLE data, participantes
FROM "02 Reuniões"
WHERE projeto = this.file.link
SORT data DESC
```

## Tarefas
- [ ] **Refinar pesos/dimensões** do catálogo — atualmente estimados por classe/modelo (marcados "est."), editáveis no Catálogo. 🔴
- [ ] **Preencher coordenadas** das bases/pedreiras CPSA em Parâmetros → Locais (Tojal, Santa Eulália, Vale Rodrigues, Carbomin, Sobrissul) — deixadas sem coords, **não inventar**. 🔴
- [ ] **Validar parâmetros legais** com Código da Estrada / Regulamento de Transporte Especial (IMT) — atualmente indicativos. 🟡
- [ ] **Avaliar como fonte de localização** dos equipamentos o [[05 Projetos/App Análise de Paragens (Traccar)|Traccar]] (o Excel não tem localização física). 🟡
- [ ] **Explorar uso no onboarding do [[03 Pessoas/Frederico Cristiano]]** — o catálogo (tipo × capacidade × composição) responde diretamente à dificuldade dele sobre a aptidão dos equipamentos. 🟡

## Riscos
- 🟡 **Pesos/dimensões estimados** → afetação pode estar imprecisa até refinar com valores reais.
- 🟡 **Parâmetros legais indicativos** → risco de classificação legal incorreta antes de validação IMT.
- 🟡 **Locais sem coordenadas** → otimização por proximidade incompleta enquanto bases/pedreiras não tiverem lat/lon.

## Decisões
> [!decision]
> - **Sobre-atribuição permitida com aviso** (não bloqueio): mover viagem para conjunto incompatível mostra confirmação e marca a vermelho "acima do limite".
> - **Guardar no histórico à mão** (1 clique), escolhido em vez de auto-guardar.
> - **Coordenadas de bases/pedreiras** e **pesos/dimensões reais** a preencher pela utilizadora — a app não inventa valores.

## Próximos Passos
1. Refinar catálogo (pesos/dimensões) e completar Locais com coordenadas.
2. Validar parâmetros legais com IMT.
3. Ligar localização de equipamentos ao Traccar.

## Ligações
- [[08 Conhecimento/Gestão de Frotas]]
- [[05 Projetos/App Análise de Paragens (Traccar)]]
- [[03 Pessoas/Frederico Cristiano]]

## Notas
- Catálogo e histórico reconstruíveis por `catalog_build.py` → `parse_hist.py` → `build_app.py`.
- SharePoint (Gestão de Viaturas) inacessível por login — exportar para CSV se necessário.
</content>
