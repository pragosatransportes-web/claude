---
tipo: projeto
estado: ativo
cliente:
responsável: "[[03 Pessoas/Rita Fialho]]"
prioridade: média
data_início: 2026-07-16
data_fim_prevista:
tags:
  - projeto
  - logística
  - frota
  - traccar
  - tacógrafos
---

# App Análise de Paragens (Traccar)

## Objetivo
Ler os relatórios do Traccar e identificar automaticamente todas as paragens da frota
acima de 5 minutos, classificando cada uma como descanso obrigatório, pausa laboral,
espera operacional ou paragem por explicar — para perceber onde se perde tempo produtivo
e onde há risco de incumprimento do Regulamento (CE) 561/2006.

## Enquadramento no projeto de telemática
Em [[02 Reuniões/2026/2026-07-06 - CE Logística]] o projeto de telemática/IA foi estruturado
em três fases sequenciais: **I** integração de API (Wialon **ou** Traccar) · **II** rotas
origem→destino · **III** alertas de desvios e **paragens +5 min**. Ficou por decidir a fonte.

Esta aplicação é a **prova de conceito da Fase III construída antes da Fase I**, sobre uma
exportação manual em Excel. A inversão é deliberada e de-risca o projeto:

> [!decision] Provar a análise antes de comprar a integração
> A Fase I é a mais cara e a que exige decidir Wialon vs Traccar. Se a lógica de
> classificação de paragens não se aguentar, integrar a API só automatiza um relatório que
> ninguém usa. Fazendo a Fase III primeiro sobre exportação manual, sabe-se **o que a
> integração tem de trazer** antes de a contratar — e já se sabe que o relatório de
> _Viagens_ (o mais óbvio) **não chega**: falta-lhe a localização.

Contributo direto para a decisão pendente: qualquer que seja a plataforma escolhida, tem de
fornecer **coordenadas por paragem** e **motorista por veículo**. É esse o critério de
seleção que este protótipo revelou — não a API em si.

## Estado Atual
🟢 **Fases 1, 2 e 3 concluídas** — a app já diz *onde* parou. Falta tipificar os locais.

Aplicação em `Analise Paragens Traccar/` (abrir `index.html`, sem instalação, corre local).
Importa os dois relatórios do Traccar (**Viagens** + **Paragens**) e reconhece-os pelos
cabeçalhos. Validada com 01–15/07 (1637 viagens) e 13–16/07 (722 viagens + 713 paragens).

### O desbloqueio: o relatório de Paragens
O relatório **Paragens** do Traccar traz coordenadas por paragem. Com ele:
- **497 paragens, 100% com coordenadas** (13–16/07)
- **86% acontecem em locais recorrentes** → 122 locais distintos, mas o topo concentra
  quase todo o tempo. **Nomear ~15 locais cobre praticamente toda a operação.**
- Local nº1: **403h, 30 paragens, 14 veículos** → geocodificado como *Porto de Mós, Leiria*.
  Quase de certeza a sede/parque — **a confirmar**.

> [!info] A minha derivação estava certa
> Antes de existir o relatório de Paragens, a app derivava as paragens dos intervalos
> entre viagens. Cruzando as duas fontes: **99% das paragens derivadas batem certo** com
> as que o Traccar reporta, 83% com menos de 2 min de diferença. A derivação continua
> como alternativa quando só há o relatório de Viagens — mas fica sem localização.

> [!warning] Os alertas do 561/2006 são indicadores para investigar — **não são prova de
> infração nem base para ação disciplinar**. O GPS mede o veículo a mexer-se; o tacógrafo
> mede o trabalho do motorista, incluindo carga e descarga. Só o ficheiro do tacógrafo tem
> valor legal. Ver [[05 Projetos/Projeto Tacógrafos]].

> [!info] Viatura ligada o dia todo não é irregularidade
> O motorista faz o descanso com a viatura ligada e parada. Se o Traccar delimitar as
> viagens pela **ignição**, essa paragem não aparece em nenhum relatório — fica escondida
> dentro de uma «viagem» de 8–10h a 5 km/h. A app deteta esses registos e exclui-os do
> tempo de condução, mas **não os trata como problema**: acima de 12h chama-lhe falha de
> equipamento, abaixo chama-lhe condução não apurável. É por isso que identificamos
> **viagens e paragens por movimento**, não por ignição.

## Limites conhecidos
- **Nenhum relatório traz o motorista.** Os KPIs por motorista continuam fora de alcance —
  é preciso atribuir motoristas aos veículos no Traccar ou cruzar com a escala de serviço.
- Análise **por veículo, não por motorista** — se dois motoristas se revezam no mesmo
  camião, a deslocação acumulada soma os dois e o alerta de 4h30 é falso.
- A coluna «Morada» do relatório de Paragens **traz coordenadas, não moradas**. A morada
  obtém-se por geocodificação inversa (OpenStreetMap), a pedido e com confirmação.
- A geocodificação devolve moradas genéricas (*«EM 545, Porto de Mós, Leiria»*): diz onde
  é, não diz que é o parque da Pragosa. **É o tipo de local, atribuído à mão, que classifica.**
- **7 registos sem tempo de condução apurável** em julho. São excluídos dos totais, mas a
  causa é uma de duas: **≥12h** (5 casos, pior 61h a 3,5 km/h) → falha de equipamento;
  **<12h** (2 casos, 9h44 e 8h33, ambos noturnos) → **descanso com a viatura ligada e
  parada, que é prática normal e não é irregularidade**.
- ⚠️ **A configuração do servidor Traccar condiciona tudo.** Há viagens de 6–10h a 26 km/h
  médios: ou o motorista andou 7h sem parar, ou o Traccar não separou as paragens.
  Confirmar com o DTI: `useIgnition` (se as viagens forem delimitadas pela ignição, a
  paragem de um veículo que fica ligado **não é registada em lado nenhum**) e
  `minimalParkingDuration`. Até lá, os alertas de condução contínua podem ser artefacto de
  configuração, não achado.
- 20% dos registos do Traccar são manobras, não deslocações — a app consolida-as, sem isso
  havia +17% de paragens falsas.

## Pessoas Envolvidas
- [[03 Pessoas/Rita Fialho]] — dona do projeto
- [[03 Pessoas/João Machado Pragosa]] — aprovação da fase de telemática
- [[03 Pessoas/Gil Santos]] — DTI, sistemas de localização Traccar/GPS
- [[03 Pessoas/Alexandre Marques]]

## Reuniões

```dataview
TABLE data, participantes
FROM "02 Reuniões"
WHERE projeto = this.file.link
SORT data DESC
```

## Tarefas
- [ ] Levar o protótipo à CE como prova de conceito da Fase III → informar a decisão **Wialon vs Traccar** com um critério concreto: a fonte tem de dar coordenadas por paragem e motorista por veículo
- [x] ~~Exportar do Traccar o relatório **Paragens**~~ — feito 16/07, desbloqueou as coordenadas
- [ ] **Tipificar os ~15 locais do topo da lista** (pedreira, cliente, obra, oficina, posto, sede) — é o passo com maior relação esforço/retorno: cada local tipificado converte dezenas de paragens de *Por classificar* em classificação com fundamento
- [ ] Confirmar se o local nº1 (403h, 14 veículos, *Porto de Mós*) é mesmo a sede/parque
- [ ] **[[03 Pessoas/Gil Santos]]: as cercas geográficas já existem no Traccar** (eventos `Entrou/Saiu da Cerca Geográfica`) mas o export não diz *qual*. Se essa informação for acessível, a tipificação dos locais deixa de ser manual
- [ ] Decidir como atribuir motorista ao veículo — no Traccar ou por cruzamento com a escala de serviço
- [ ] Investigar os 3 veículos no topo do ranking "por classificar"
- [ ] Perceber os casos de veículo inativo ≥3h — falta de serviço, avaria ou parqueamento?
- [ ] **[[03 Pessoas/Gil Santos]]: confirmar `useIgnition` e `minimalParkingDuration` do servidor Traccar** — é a verificação mais barata com maior impacto na fiabilidade de todos os alertas de condução contínua. Se `useIgnition` estiver ligado, as paragens com viatura ligada não existem nos relatórios de Viagens nem de Paragens
- [ ] Se `useIgnition` estiver ligado: exportar o relatório **Eventos** para o mesmo período — os eventos `Dispositivo Parado`/`Dispositivo em Movimento` são por movimento e apanham as paragens que os outros relatórios não veem
- [ ] Reportar as 7 viagens não fechadas a quem gere o Traccar (problema de equipamento, não de análise) — o 25ZO46 tem 3 casos, verificar o rastreador
- [ ] Validar no terreno uma amostra de paragens "por classificar" para calibrar as regras

## Riscos
- **Usar os alertas 561/2006 como prova** → sem valor legal e injusto para os motoristas; só o tacógrafo serve. Risco reputacional e laboral se for mal comunicado.
- **Conclusões por veículo lidas como conclusões por motorista** → atribuir a uma pessoa o que é do camião.
- **Investir na API antes do geofencing** → a API não traz um único dado novo face à exportação manual; o que muda a qualidade das respostas é o local, não a automação.
- **Viagens não fechadas** → se o problema de equipamento persistir, há dias que nunca serão analisáveis.

## Decisões
> [!decision] Validar a lógica sobre exportação manual antes de construir a API
> A API do Traccar devolve o mesmo que a exportação em Excel. Faz-se primeiro o motor de
> classificação e o geofencing; a automação vem depois, quando houver o que automatizar.

> [!decision] "Paragem Extra" só com o local tipificado
> Sem saber onde a paragem foi, uma espera em pedreira e uma paragem evitável são o mesmo
> facto: um veículo parado. A categoria só dispara quando o local está tipificado **e** o
> tipo não é operacional — aí já há fundamento. Tudo o resto fica em **Por classificar**:
> fila de investigação, não lista de culpados.

> [!decision] Geocodificar os locais, não as paragens
> Agrupar primeiro (150 m) e só depois geocodificar reduz de milhares de pedidos para ~120,
> e o resultado fica em cache. As coordenadas dos locais são enviadas para o OpenStreetMap
> a pedido, com confirmação; o resto da app funciona offline.

## Próximos Passos
1. **Tipificar os ~15 locais do topo** — uma sessão de trabalho, resolve-se para sempre.
2. Confirmar o `minimalParkingDuration` com o DTI (afeta a fiabilidade dos alertas 561).
3. Ver se as cercas geográficas existentes podem substituir a tipificação manual.
4. Decidir a atribuição de motorista ao veículo (fase 4).
5. Só depois avaliar a API REST (fase 5) — não traz dados novos, só tira o passo manual.

## Notas
- Documentação técnica completa e roadmap: `Analise Paragens Traccar/LEIA-ME.md`
- Motor de classificação isolado do interface em `motor.js` — parametrização toda no objeto `CFG` (limiares de manobra, janelas legais, limiar de inatividade).
- Prompt original que deu origem ao projeto: `Criação de Aplicação Tacógrafo.pdf` (Desktop).

### Ligações
- Projetos: [[05 Projetos/Projeto Tacógrafos]]
- Reuniões: [[02 Reuniões/2026/2026-07-06 - CE Logística]] · [[02 Reuniões/2026/2026-06-30 - CE- Logística]]
- Operações: [[06 Operações/Equipa Logística]] · [[06 Operações/KPIs]]
- Conhecimento: [[08 Conhecimento/Frota/Dashboard Tacógrafos]]
