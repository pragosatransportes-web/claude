---
tipo: dashboard
area: Frota
projeto: Tacógrafos
cssclass: dashboard
data_dl84: 2026-07-12
tags:
  - dashboard
  - frota
  - tacógrafos
---

# 🚛 Dashboard — Tacógrafos

> Centro de controlo do [[05 Projetos/Projeto Tacógrafos]] · base: [[08 Conhecimento/Frota/Formação Tacógrafos - 2026-06-20|Formação 2026-06-20]] (SD Formação — Marco Neves)

> [!share] 📤 Partilhar este dashboard
> - 📎 No vault (Obsidian): [[Dashboard Tacografos.pdf|Abrir Dashboard Tacógrafos (PDF)]]
> - 🔗 Cópia para partilha externa: [Abrir no Nextcloud](file:///C:/Users/ana.fialho/Nextcloud2/001.%20AF%20D%20Dep.%20Log%C3%ADstica/Dashboard%20Tacografos.pdf)
>
> Para enviar a terceiros: anexa o PDF por email/Teams ou gera um link de partilha a partir do Nextcloud/OneDrive.

---

## ⏳ Contagem Decrescente — Novo Regime DL 84/2026

```dataviewjs
const alvo = dv.date("2026-07-12");
const hoje = dv.date(dv.luxon.DateTime.now().toISODate());
const dias = Math.ceil(alvo.diff(hoje, "days").days);
if (dias > 0) {
  dv.paragraph(`> [!important] Faltam **${dias} dias** para a entrada em vigor do **DL 84/2026** (12/07/2026)\n> Revoga a Lei 27/2010 + DL 169/2009 · agrava coimas · condução sem cartão passa a ser do **motorista**.`);
} else if (dias === 0) {
  dv.paragraph(`> [!important] **HOJE entra em vigor o DL 84/2026** (12/07/2026).`);
} else {
  dv.paragraph(`> [!success] **DL 84/2026 em vigor** desde 12/07/2026 (há ${Math.abs(dias)} dias).`);
}
```

> [!info]- Datas-chave (fallback se Dataview JS estiver desligado)
> Regime antigo cessa **11/07/2026** → DL 84/2026 entra em vigor **12/07/2026**.

---

## ⚖️ Enquadramento Legal

| Diploma | Âmbito |
|---|---|
| **Reg. (CE) 561/2006** | Tempos de condução, pausas e repouso |
| **Reg. (UE) 165/2014** | Construção, instalação, uso e controlo dos tacógrafos |
| **Reg. (UE) 1054/2020** | Pacote Mobilidade — altera 561/2006 e 165/2014 (posicionamento) |
| **Diretiva 2002/15/CE** | Organização do tempo de trabalho dos trabalhadores móveis |
| **Lei 27/2010 + DL 169/2009** | Regime sancionatório **antigo** (cessa 11/07/2026) |
| **DL 84/2026, de 13/04** | **Novo** regime (vigor **12/07/2026**) — 66 artigos |

---

## ✅ Tarefas em Aberto (dinâmico)

```tasks
not done
path includes 08 Conhecimento/Frota
sort by priority
```

---

## ⏱️ Tempos de Condução, Pausas e Repouso (561/2006)

| Tipo | Limite |
|---|---|
| 🚛 Condução contínua | **4h30** → pausa **45 min** (ou 15+30) |
| 📅 Condução diária | **9h** (10h, 2×/semana) |
| 📆 Condução semanal / 2 semanas | **56h** / **90h** |
| 👷 Trabalho consecutivo (motorista) | **máx. 6h** *(DL 84/2026, Art.º 23.º)* — fixo: 5h |
| ⏸️ Pausa por trabalho | 6–9h → **≥30 min** (30+15) · >9h → **≥45 min** |
| 🛏️ Repouso diário | **11h** (reduz a 9h, 3×) · fracion. 3h+9h |
| 🛌 Repouso semanal | **45h** / **24h** reduzido (compensar em 3 semanas) |

- **Semana:** 00h–24h, 2ª feira → domingo · **6 períodos de 24h** (2ª 8h → domingo 8h).
- **Pictogramas:** 🚛 condução (auto) · 🔨 outro trabalho · ▢ disponibilidade · 🛏️ repouso. Marcar manualmente tudo o que não seja condução.

> [!example]+ Art.º 12.º — Esticar o horário para chegar à base/casa (repouso semanal)
> Em **circunstâncias excecionais**, sem comprometer a segurança: **+1h** de condução para chegar ao centro operacional/residência (repouso semanal); ou **+2h** se fez **pausa de 30 min imediatamente antes** (repouso semanal regular).
> Obrigatório: ✍️ **anotar o motivo** (talão/folha) à chegada · 🔄 **compensar** o excesso em bloco com outro repouso **até ao fim da 3ª semana** seguinte.
> *(Vertente original: afastar-se dos Art.6–9 em imprevisto para chegar a ponto de paragem seguro — não vale para razões conhecidas antes da viagem.)*

---

## 📊 Coimas — DL 84/2026 (Art.º 16.º)

> [!danger]+ Imputáveis ao CONDUTOR (motorista)
> | Escalão | Coima | Exemplo-chave |
> |---|---|---|
> | 🔴 Máxima | **750 €–2 250 €** | Falta de cartão / cartão caducado |
> | 🟠 Muito grave | **600 €–1 800 €** | Conduzir sem cartão; não apresentar; não anotar ID em avaria |
> | 🟡 Grave | **200 €–600 €** | Não indicar país de início/fim |
> | 🟢 Leve | **100 €–300 €** | Não comunicar perda/furto do cartão |

> [!warning]+ Imputáveis à EMPRESA
> | Escalão | Coima (singular / coletiva) | Exemplo-chave |
> |---|---|---|
> | 🔴 Máxima | **1 500 €–4 500 € / 1 500 €–7 500 €** | Falta/manipulação do tacógrafo; destruição de dados |
> | 🟠 Muito grave | **1 200 €–3 600 € / 1 200 €–6 000 €** | Tacógrafo avariado; falta de inspeção |
> | 🟡 Grave | **400 €–1 200 € / 400 €–2 000 €** | Folha de registo não homologada |
> | 🟢 Leve | **100 €–300 €** | Falta de papel de impressão |

*Tentativa/negligência → coimas reduzidas a metade (n.º 9). Produto: 20% IMT · 20% fiscalizador · 60% Estado.*

---

## 🪪 Cartão de Condutor & Documentos

> [!tip]+ Estrutura do nº (16 dígitos)
> 14 primeiros → titular · 15º → cartões de substituição · 16º → renovações (a cada 5 anos). Renovação até **2 meses** antes; antigo nunca é desativado → IMT pede devolução.

> [!check] Documentos obrigatórios do motorista
> ✅ **Cartão de condutor** válido · ✅ **CAM** válido · ✅ **Carta de condução**
> *(Passar a [[03 Pessoas/Bruna Cordeiro|Bruna Cordeiro]] e [[03 Pessoas/Gabriela Soares|Gabriela Soares]].)*

---

## 🚨 Procedimentos Críticos

> [!example]- Sem cartão (esqueceu / extravio / furto / danificado) — pode seguir o dia
> 1) País de início · 2) Talão de início (24h, 00:00 UTC = -1h PT) · 3) Verso: **Nome · Nº cartão (5b)/carta · Assinatura** · 4) Trabalhar normal · 5) Talão de fim de dia + 3 dados.
> Circula até **15 dias** (Reg.165 Art.29). Extravio/furto → GNR/PSP + IMT; danificado → OVM (55 €, garantia 2 anos). Entregar talões à empresa.

> [!example]- Tacógrafo avariado (Reg.165 Art.37)
> Na base + avariado → só direto para OVM · Avaria no dia e chega à base → não volta a sair · Avaria deslocado → até 1 semana.

> [!example]- Circulação dentro da base (gasóleo / oficina)
> Sempre com cartão (amarelo empresa / branco motorista). Períodos curtos sem cartão = contraordenação. Oficina emite declaração De–A; PRAGOSA Manutenção por defeito.

> [!example]- Início/fim de dia & Entradas Adicionais (EA)
> **Início e fim sempre em Martelos** 🔨, nunca em Cama. Blocos de 24h; cuidado com cartão em cama/início em repouso/cartão esquecido.
> **EA** (sem cartão, sem disco) → parcelas: 10–13h 🔨 · 13–14h 🛏️ · 14–18h 🔨.

---

## 📦 Cargas e Descargas

- **Inserção manual:** Carga ⬆️ (baixo→cima) · Descarga ⬇️ (cima→baixo).
- **Localização automática** (Reg. 1054/2020 → art.º 8.º n.º 1 do 165/2014): o veículo regista a localização em cada carga/descarga. Ainda **não obrigatório ao condutor**, mas provável.
- 🔨 martelos = **atividade** · 📍 carga/descarga = **localização**. Coordenadas = entrada da propriedade → **1 só registo** (ex.: Alcatrão, mesmo 3h).

---

## 🛠️ Modelos & Tecnologia

| Tema | Nota |
|---|---|
| **Stoneridge** | Contagem **decrescente** (4h30 e pausas para baixo) |
| **VDO** | Contagem **crescente** |
| **Talões GEN 1 / GEN 2** | GEN 2 = **com coordenadas** (descarga localização 3/3h); GEN 1 = sem |
| **G2V1 vs G2V2** | G2V2 regista **fronteiras automaticamente**; internacional só com G2V2; matrículas **pós-ago/2023** já têm |

> [!warning] Sistema DSRC — fiscalização remota
> Extrai dados **em segundos, sem parar a viatura**. Leitor em viatura de fiscalização, pórtico/raile ou radar — basta aproximar-se. Deteção remota de irregularidades.

---

## 🏎️ Excesso de Velocidade & Regra do Minuto

- **+1 min a 90 km/h** → registado no tacógrafo **56 dias**; **+60 seg** → **`>>`** nos registos.
- **Regra do minuto:** a atividade **maioritária** ganha o minuto inteiro (🔨 anda · 🛏️ parado). Ex.: 20s🛏️+30s🔨 = 50s 🔨; 31s🛏️+29s🔨 = 58s 🛏️.

---

## 📜 Art.º 34.º Reg. 165/2014 — Uso de Cartões/Folhas

| Nº | Síntese |
|---|---|
| 1 | Usa cartão/folha sempre que conduz; não retira antes do fim do dia |
| 2 | Proteger material — nada sujo/danificado |
| 3 | Afastado do veículo → registo/introdução manual; sem formulários |
| 4 | Tripulação múltipla → cada cartão na ranhura certa |
| 5 | Comutadores: condução / outro trabalho / disponibilidade / pausa |
| 6 | Símbolo do país de início e de fim |
| 7 | G2V2 regista fronteiras automaticamente |

**Símbolos:** **!** evento · **X** falha · **!X** combinado. Memória: 5 registos viatura + 5 motorista.

---

## 📝 Declaração de Atividade (Nota de Orientação nº 5)

- **Obrigatória? NÃO** — desnecessária para o que o tacógrafo regista; só justifica **ausência de registos** por razões objetivas; **nunca exigível** em repouso normal. Cobre data corrente + 28 dias.
- "Outros trabalhos" → **Martelos** 🔨 (com descansos). Paragens de vários dias → facilitado pela declaração.
- ✅ **Ana Rita pede ao Jurídico** documento que acompanhe a Nota nº5 para distribuir aos motoristas.

---

## 💾 Descargas, Retenção & Venda

| Item | Prazo |
|---|---|
| Descarga tacógrafo viatura / cartão empresa | **3 meses** / **28 dias** |
| Guarda de dados (tacógrafo / ACT) | **1 ano** / **5 anos** |

> [!warning] Venda de viatura
> Tem de ir com o tacógrafo **desbloqueado**; se vendida desbloqueada, os dados da Pragosa ficam protegidos e a nova empresa não os acede.

---

## 🛡️ Regime Sancionatório & Defesa da Empresa

- Motorista não paga diretamente; **Auto de Notícia** → ACT + IMT → empresa. A ACT tende a ficar do lado do motorista.

> [!success] 3 pilares de defesa
> 1. Formação · 2. Análise do trabalho + chamada de atenção · 3. Organização correta (escala de serviço).

> [!warning] 👤 Pontos de atenção & Conclusões
> - Os **motoristas, na generalidade, não fazem boa utilização do tacógrafo**.
> - **[[03 Pessoas/Rita Fialho|Ana Rita]]** deve partilhar com **[[03 Pessoas/Gabriela Soares|Gabriela Soares]]** e **[[03 Pessoas/Bruna Cordeiro|Bruna Cordeiro]]** a **legislação, obrigatoriedade e regras do motorista**, incl. **manual de motorista (a rever)**.
> - **Uniformizar os tacógrafos** entre viaturas para minimizar erros.
> - Acompanhamento individual a **[[03 Pessoas/Carlos Carvalho|Carlos Carvalho]]**.
> - ✅ Formação **bastante interativa**, elevado envolvimento; útil **envolver chefias com motoristas** (perspetiva do motorista). **Duração: 8h.**

---

## 🧭 Decisões da Formação

> [!decision]
> - Circulação sem cartão até **15 dias**, com talões entregues à empresa.
> - **3 pilares de defesa** mantidos.
> - Circulação na base/oficina **só com cartão**; Manutenção PRAGOSA emite declaração por defeito; **[[03 Pessoas/Rita Fialho|Rita Fialho]]** faz a ponte com a Oficina.
> - **Início e fim de dia sempre em Martelos.**
> - **Uniformizar os tacógrafos** entre viaturas para reduzir erros.

---

## 📚 Notas Relacionadas

```dataview
LIST
FROM "08 Conhecimento/Frota" OR "05 Projetos"
WHERE contains(string(tags), "tacógrafos") AND file.name != this.file.name
SORT file.name ASC
```

### Ligações diretas
- [[08 Conhecimento/Frota/Formação Tacógrafos - 2026-06-20|📄 Formação completa (2026-06-20)]]
- [[05 Projetos/Projeto Tacógrafos|🗂️ Projeto Tacógrafos]]
- [[06 Operações/Combustíveis, Custos e Mobilizações]] · [[06 Operações/Manutenções]]
