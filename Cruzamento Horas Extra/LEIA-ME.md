# Cruzamento de Horas Extra — PHC × Excel manual

App local (offline) para cruzar as horas extra registadas no **PHC** com o **mapa Excel semanal** preenchido à mão, mês a mês (dia 21 → 20).

## Como usar
1. Abre o ficheiro **`index.html`** (duplo-clique — abre no browser). Não precisa de internet.
2. Arrasta (ou clica para escolher):
   - **Ficheiro PHC** — a exportação do PHC (uma folha, colunas *Dia21…Dia20*).
   - **Ficheiro Excel manual** — o mapa com uma folha por semana.
   > A app identifica sozinha qual é qual. Podes largar os dois de uma vez.
3. Confirma o **período** detetado (lido da coluna *Datad* do PHC).
4. Carrega em **Cruzar dados**.

## O que mostra
- **Totais** de horas extra de cada lado e a diferença.
- **Nº de dias divergentes** e funcionários que só existem num dos ficheiros.
- Tabela **por funcionário** (ordenável, com pesquisa e filtro "só divergências").
- Clica numa linha para ver o **detalhe dia-a-dia** (PHC / Manual), com cores:
  - 🟩 igual · 🟧 valores diferentes · 🟥 só num ficheiro
  - **FE** = Férias · **BM** = Baixa médica (marcadores, não contam como divergência).
- **Exportar divergências (CSV)** para abrir no Excel.

## Regras aplicadas
- Mês de vencimento de **dia 21 a 20** (dias 21–31 → mês inicial; 1–20 → mês seguinte).
- Cruzamento **por número de funcionário** (coluna B) — imune a diferenças de nome/acentos.
- Linhas do mesmo funcionário em vários centros de custo são **somadas**.
- **Sábados/domingos**: as horas em *H.TRAB.* contam como extra (para alinhar com o critério do PHC). Podes desligar no interruptor no topo.

## Todos os meses
A app é reutilizável: basta carregar os dois ficheiros do mês seguinte. Não é preciso mexer em nada.

## Ficheiros
- `index.html` — a aplicação.
- `xlsx.full.min.js` — biblioteca de leitura de Excel (tem de ficar na mesma pasta).
