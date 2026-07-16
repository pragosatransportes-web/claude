# Análise de Paragens · Traccar

Deteta e classifica automaticamente as paragens da frota a partir dos relatórios do
Traccar, dizendo **onde** parou, **quanto tempo** e **porquê**. Corre no browser,
sem instalação.

Os ficheiros são processados no seu computador e não são enviados para lado nenhum.
A **única** exceção é o botão *Obter moradas*, que envia as coordenadas dos locais
(não os ficheiros) para o OpenStreetMap — e pede confirmação antes de o fazer. Sem
carregar nesse botão, a aplicação funciona inteiramente offline.

**Abrir:** duplo clique em `index.html` → escolher os dois ficheiros de uma vez.

---

## Como obter os ficheiros no Traccar

Traccar → **Relatórios** → selecionar veículos e período → **Exportar** para Excel.
São precisos **dois relatórios, exportados para o mesmo período**:

| Relatório | Colunas | Para que serve |
|-----------|---------|----------------|
| **Viagens** | Hora de Início · Hora de Fim · Distância · Velocidade Média | Tempo de condução |
| **Paragens** | Hora de Início · Hora de Fim · Conta-Quilómetros · Morada | **Onde parou** (coordenadas) |

A aplicação reconhece cada ficheiro pelos cabeçalhos, não pelo nome — a ordem é
indiferente. Se os períodos não coincidirem, avisa antes de continuar: cruzar
relatórios de datas diferentes daria uma análise silenciosamente errada.

O relatório de **Viagens** é obrigatório. Sem o de **Paragens** a aplicação
funciona na mesma (deriva as paragens dos intervalos entre viagens, com 99% de
coincidência), mas fica sem localização — e sem localização não há classificação.

> A coluna «Morada» do relatório de Paragens **não traz moradas**: traz coordenadas
> (`39.61757°, -8.83744°`). A morada obtém-se por geocodificação — ver abaixo.

---

## O que a aplicação faz

| Passo | O que acontece |
|-------|----------------|
| 1. Leitura | Uma folha por veículo; aceita datas em texto (`01/07/2026, 05:01`) ou serial do Excel |
| 2. Consolidação | Separa deslocações reais de **manobras** (<0,5 km ou <3 km/h médios) |
| 3. Paragens | Do relatório de Paragens; sem ele, derivadas dos intervalos entre viagens |
| 4. Locais | Agrupa as paragens a menos de 150 m umas das outras no mesmo local |
| 5. Classificação | Motor de decisão por **tipo de local**, duração, hora do dia e condução acumulada |
| 6. KPIs e alertas | Por veículo e por dia, com verificações do Regulamento (CE) 561/2006 |

### Locais — o passo que faz a classificação funcionar

**86% das paragens acontecem em locais recorrentes** (429 de 497, em 13–16/07).
São 122 locais distintos, mas o topo da lista concentra quase todo o tempo — pelo
que **nomear ~15 locais cobre praticamente toda a operação**, uma vez só.

Atribuir o **tipo** ao local (pedreira, cliente, obra, oficina, posto, sede…) é o
que permite classificar: uma morada diz *onde* é, mas só saber que aquilo é uma
pedreira permite dizer que a paragem é carga e não desperdício. Nomes, tipos e
moradas ficam guardados neste computador (`localStorage`) e aplicam-se às
importações seguintes.

### Moradas (geocodificação)

O botão **Obter moradas** no separador *Locais* envia as coordenadas para o
**OpenStreetMap** (`nominatim.openstreetmap.org`) e devolve rua, município e
distrito. Pede confirmação antes de enviar seja o que for.

- Envia as coordenadas de cada **local**, não de cada paragem — ~120 pedidos em vez
  de milhares. É por isso que o agrupamento vem antes da geocodificação.
- 1 pedido por segundo (política do Nominatim) → ~2 min para 120 locais.
- Cada local só é pedido uma vez; o resultado fica em cache local.
- Devolve moradas genéricas: o local nº1 sai como *«EM 545, Porto de Mós, Leiria»*.
  Diz onde é — não diz que é o parque da Pragosa. Daí o campo **Nome**.

> Se o botão falhar ao abrir por duplo clique (`file://`), abra a app por
> `http://localhost:8778` — está em `.claude/launch.json` como `paragens-traccar`.

### Paragem mínima

O filtro **Paragem mínima** aceita `Todas · 5 · 10 · 15 · 30 · 45 min · 1 hora ·
1h30`. Não é só um filtro de visualização: o limiar entra no motor, pelo que
mudá-lo altera a consolidação, a classificação e os alertas.

| Limiar | Para quê |
|--------|----------|
| **Todas** | Ver a operação ao detalhe, incluindo paragens de segundos. Ruidoso — bom para investigar um veículo ou um dia. |
| **5–15 min** | Vista de trabalho. É onde aparecem as esperas de carga e descarga. |
| **30–45 min** | Focar no que tem peso no dia. 45 min é a pausa obrigatória do Art.7. |
| **1h–1h30** | Só o que é anómalo por si só. Bom para uma reunião de gestão. |

Em 13–16/07: 709 paragens no total, 497 acima de 5 min, 175 acima de 45 min,
79 acima de 1h30.

### Porque é que as manobras importam

O Traccar parte uma paragem em duas sempre que o veículo se mexe 200 m dentro do
estaleiro. Sem consolidação, uma espera de 13 minutos aparece como duas paragens
de 2 e 7 minutos — e as duas caem abaixo de qualquer limiar útil. **Nos dados de
julho, 20% dos registos (335 de 1637) são manobras e não deslocações.** Tratá-los
como viagens gerava 181 paragens falsas (+17%).

---

## Motor de decisão

A primeira regra que casa é a que ganha — da mais defensável para a mais
especulativa:

| Ordem | Regra | Classificação | Confiança |
|-------|-------|---------------|-----------|
| 1 | ≥ 45h | Descanso semanal normal (Art.8) | alta |
| 2 | ≥ 24h | Descanso semanal reduzido (Art.8) | alta |
| 3 | ≥ 11h | Descanso diário normal (Art.8) | alta |
| 4 | ≥ 9h | Descanso diário reduzido (Art.8) | alta |
| 5 | Local do tipo **oficina** | Veículo inativo — em oficina | alta |
| 6 | ≥ 45min **e** ≥ 4h30 de deslocação acumulada | Descanso obrigatório (Art.7) | média |
| 7 | Par 15min + 30min sem 4h30 pelo meio | Pausa fracionada (Art.7) | média |
| 8 | Local do tipo **pedreira / central de betão** | Espera operacional — carga | alta |
| 9 | Local do tipo **cliente / obra** | Espera operacional — descarga | alta |
| 10 | Local do tipo **posto** | Espera operacional — abastecimento | alta |
| 11 | Local do tipo **sede** | Inativo se ≥3h, senão espera operacional | alta |
| 12 | 30–120min na janela 11h30–14h30 | Pausa laboral | média/baixa |
| 13 | Local do tipo **área de serviço**, fora do almoço | **Paragem extra** | média |
| 14 | Local do tipo **outro (não operacional)** | **Paragem extra** | média |
| 15 | Tem manobras lá dentro | Espera operacional | baixa |
| 16 | ≥ 3h sem chegar a descanso diário | Veículo inativo | média |
| 17 | Resto | **Por classificar** | baixa |

### "Paragem Extra" só existe com o local tipificado

O prompt original previa uma categoria *Paragem Extra* para o que não fosse
justificado. **Sem saber onde a paragem foi, produzi-la seria imputar desperdício
sem prova**: uma espera de 25 minutos numa pedreira e uma paragem evitável de 25
minutos são, nos dados, exatamente a mesma coisa — um veículo parado 25 minutos.

Por isso a categoria só dispara quando o local está tipificado **e** o tipo não é
operacional (regras 13 e 14). Aí já há fundamento: sabe-se onde é e sabe-se que
não é obra, nem pedreira, nem posto.

Tudo o resto cai em **Por classificar** — a fila de investigação, não uma lista de
culpados. Cada local que tipifica esvazia-a um pouco.

---

## Limites — ler antes de usar os números

**1. Não há motorista.** Nenhum dos dois relatórios traz o motorista, pelo que os
KPIs por motorista e a comparação entre motoristas continuam fora de alcance. É
preciso atribuir motoristas aos veículos no Traccar, ou cruzar com a escala de
serviço interna.

**2. Deslocação ≠ condução do tacógrafo.** O GPS mede o veículo a mexer-se. O
tacógrafo mede o trabalho do motorista, incluindo «outros trabalhos» (carga,
descarga, espera) que aqui aparecem como veículo parado. Os dois números não
coincidem e não têm de coincidir.

> **Os alertas do 561/2006 são indicadores operacionais para investigar — nunca
> prova de infração nem base para ação disciplinar.** Para isso serve o ficheiro
> do tacógrafo, que é o único documento com valor legal.

**3. A análise é por veículo, não por motorista.** Se dois motoristas se revezam
no mesmo camião, a deslocação acumulada soma os dois e o alerta de 4h30 é falso.

**4. Registos sem tempo de condução apurável.** Aparecem «viagens» de 6–60h a
3–13 km/h médios. A essa média o veículo esteve quase todo o tempo parado, pelo
que a duração não é tempo de condução — é sempre excluída dos totais. Mas a
**causa pode ser uma de duas, e a diferença importa**:

| Duração | Interpretação | Alerta |
|---------|---------------|--------|
| < 12h | **Descanso com a viatura ligada e parada.** Prática normal — o motorista não desliga a ignição. Se o Traccar delimitar viagens por ignição, essa paragem não é registada em lado nenhum. **Não é irregularidade.** | Condução não apurável |
| ≥ 12h | Acima do descanso diário mais longo (11h), o motor ligado já não explica o registo. É **falha de equipamento** — reportar ao DTI. | Falha de equipamento |

Em 01–15/07: 5 falhas de equipamento (a pior 61h a 3,5 km/h) e 2 casos de
descanso com viatura ligada (9h44 e 8h33, ambos noturnos, no mesmo veículo).

A deteção usa a **combinação duração × velocidade**, porque a velocidade sozinha
não chega — 2h a 6 km/h é trabalho de estaleiro plausível, 9h a 5 km/h é o camião
parado a noite toda. Basta uma regra casar (`CFG.viagemSuspeita`):

| Duração | Velocidade média | Porquê |
|---------|------------------|--------|
| > 11h | qualquer | Não há condução plausível de 11h seguidas |
| > 6h | < 15 km/h | Veículo maioritariamente parado |
| > 2h | < 5 km/h | Quase sem se mexer |

**5. ⚠️ A configuração do Traccar condiciona tudo.** Existem viagens de 6–10h a
26 km/h médios — o veículo percorreu mesmo a distância, mas a essa média esteve
muito tempo parado *dentro* da viagem. Ou o Traccar não separou essas paragens, ou
o motorista andou mesmo 7h sem parar.

Duas definições do servidor decidem qual é o caso:

| Definição | Se estiver assim… | Consequência |
|-----------|-------------------|--------------|
| `report.trip.useIgnition` | **ligado** — viagens delimitadas pela ignição | A paragem de um veículo que **fica ligado não é registada em lado nenhum**: nem no relatório de Viagens, nem no de Paragens. Fica escondida dentro da «viagem». |
| `report.trip.minimalParkingDuration` | **alto** (omissão: 5 min) | Paragens reais abaixo do limiar nunca aparecem nos dados. |

> **Enquanto isto não estiver esclarecido com o DTI, os alertas de condução
> contínua acima de 4h30 podem ser artefacto de configuração em vez de achado.**
> É a verificação mais barata com maior impacto na fiabilidade de tudo o resto.

Se `useIgnition` estiver ligado, o relatório de **Eventos** resolve: os eventos
`Dispositivo Parado` / `Dispositivo em Movimento` são por **movimento** e são
independentes da ignição — apanham as paragens que os outros dois relatórios não
veem. Não está implementado (faltou um export com o mesmo período), mas é o
caminho.

---

## O passo que mais valor acrescenta

**Tipificar os locais no topo da lista.** É trabalho de uma sessão e resolve-se
para sempre: 15 locais cobrem quase toda a operação, e cada um que tipifica
converte dezenas de paragens de *Por classificar* em espera de carga, descarga ou
paragem extra — com fundamento.

Nada mais na aplicação tem esta relação esforço/retorno.

---

## Roadmap

| Fase | O que é | Estado |
|------|---------|--------|
| 1 | Motor de paragens sobre exportação manual de viagens | **feito** |
| 2 | Relatório de *Paragens* → coordenadas por paragem | **feito** |
| 3 | Agrupamento em locais + tipificação → classificação com fundamento | **feito** — falta tipificar |
| 3b | Geocodificação inversa → rua, município, distrito | **feito** (botão *Obter moradas*) |
| 4 | Motorista por veículo → KPIs por motorista e alertas 561 fiáveis | decisão de gestão |
| 5 | API REST do Traccar (`/api/reports/trips`, `/api/reports/stops`) → sem exportação manual | precisa de servidor e credenciais |
| 6 | Cruzamento com guias de transporte e encomendas → *porquê* e *quanto custou* | depende do ERP |

A fase 5 elimina o passo manual, mas **não acrescenta um único dado novo** — a API
devolve o mesmo que a exportação. Só vale a pena quando a análise já for rotina.

### Sobre as cercas geográficas

O relatório de *Eventos* do Traccar mostra que **já existem cercas geográficas
configuradas** (eventos `Entrou/Saiu da Cerca Geográfica`). O export não diz *qual*
cerca — a coluna «Dados» vem vazia — mas se essa informação for acessível, a
tipificação dos locais deixa de ser manual: as cercas já sabem o que é cada sítio.
Vale a pena perguntar ao DTI.

---

## Ficheiros

| Ficheiro | Papel |
|----------|-------|
| `index.html` | Interface, gráficos, geocodificação e exportação |
| `motor.js` | Leitura, consolidação, locais, classificação, KPIs e alertas — independente do interface |
| `xlsx.full.min.js` | Leitura/escrita de Excel (SheetJS), local |

Toda a parametrização está no objeto `CFG`, no topo de `motor.js`: limiares de
manobra, raio do local (150 m), janelas legais, limiar de inatividade e regras de
alerta.

A exportação para Excel dá seis folhas: *Paragens · Viagens · Condução por dia ·
KPIs por veículo · Locais · Alertas*.

---

## Cores

A paleta das categorias não foi escolhida a olho. As 5040 atribuições possíveis de
matiz às 8 categorias foram testadas com o validador de daltonismo, mantendo o
vermelho fixo em *Paragem extra*; ficou a que maximiza a separação entre
categorias vizinhas — **ΔE 47,2 em modo claro e 41,3 em escuro** (o alvo mínimo é
12). Segue o tema do sistema, claro ou escuro. Ao mexer nas cores, revalidar.
