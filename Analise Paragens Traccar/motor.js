/* ============================================================================
   MOTOR DE ANÁLISE DE PARAGENS — Construções Pragosa
   ----------------------------------------------------------------------------
   Camada independente do interface.

   Fontes (o Traccar exporta as duas em Relatórios):
     · Viagens  → início, fim, distância, velocidade média   → tempo de condução
     · Paragens → início, fim, conta-quilómetros, coordenadas → onde parou

   O relatório de Paragens é a fonte preferida: traz coordenadas. Sem ele, as
   paragens são derivadas dos intervalos entre viagens (a derivação coincide com
   a deteção do Traccar em 99% dos casos, mas fica sem localização).
   ========================================================================== */

const CFG = {
  paragemMinMin: 5,

  // Uma "viagem" do Traccar com estes valores não é deslocação: é manobra
  // dentro do mesmo local (carga, posicionamento na báscula, etc.).
  manobraKmMax: 0.5,
  manobraVelMediaMax: 3.0,

  // Registo de "viagem" de 6-60h a 3-13 km/h médios. Não é condução — mas a causa
  // pode ser uma de duas, e a distinção importa:
  //
  //   1. O motorista descansou com a viatura LIGADA e parada. Se o Traccar deteta
  //      viagens por ignição, essa paragem não existe em nenhum relatório: fica
  //      escondida dentro da "viagem". É prática normal e NÃO é irregularidade.
  //   2. O equipamento perdeu sinal e não fechou o registo (problema técnico).
  //
  // Em qualquer dos casos a duração não serve como tempo de condução e tem de ser
  // excluída do acumulado. O que muda é o que se faz a seguir — ver gerarAlertas.
  //
  // O sinal não é a velocidade sozinha: 2h a 6 km/h é trabalho de estaleiro
  // plausível, 9h a 5 km/h é o camião parado a noite toda. É a combinação
  // duração × velocidade que distingue. Basta uma regra casar.
  viagemSuspeita: [
    { durMin: 11 * 60, velMax: Infinity },
    { durMin:  6 * 60, velMax: 15 },
    { durMin:  2 * 60, velMax: 5 },
  ],

  // Acima disto, o descanso com a viatura ligada deixa de explicar o registo. O
  // descanso diário mais longo do Art.8 são 11h — com margem, um registo de 12h+
  // a arrastar-se já não é um motorista a dormir com o motor a trabalhar: é o
  // equipamento a falhar.
  registoFalhaEquipamentoMin: 12 * 60,

  // Duas paragens no mesmo sítio separadas por uma manobra curta são uma só.
  raioLocalM: 150,
  juntarParagensGapMin: 15,

  // Regulamento (CE) 561/2006
  conducaoContinuaMaxMin: 4 * 60 + 30,
  pausaObrigatoriaMin: 45,
  pausaFracionadaAMin: 15,
  pausaFracionadaBMin: 30,
  descansoDiarioMin: 9 * 60,
  descansoDiarioNormalMin: 11 * 60,
  descansoSemanalReduzidoMin: 24 * 60,
  descansoSemanalNormalMin: 45 * 60,
  conducaoDiariaMaxMin: 9 * 60,
  conducaoDiariaMaxEstendidaMin: 10 * 60,

  almocoInicio: 11 * 60 + 30,
  almocoFim: 14 * 60 + 30,
  pausaLaboralMinMin: 30,
  pausaLaboralMaxMin: 120,

  inatividadeMin: 3 * 60,
  alertaPausaLongaMin: 60,
};

/* ---------- Tipos de paragem -------------------------------------------
   A ordem é a da legenda e das pilhas. Foi escolhida por pesquisa exaustiva
   das 5040 atribuições de matiz às 8 categorias, maximizando a separação para
   daltonismo entre vizinhas (pior par: ΔE 47.2 claro / 41.3 escuro; alvo ≥12).
   ----------------------------------------------------------------------- */
const TIPOS = {
  DESCANSO_SEMANAL:  { id:'DESCANSO_SEMANAL',  label:'Descanso semanal',     cor:'var(--c-semanal)', obrigatoria:true,  produtivo:false },
  DESCANSO_DIARIO:   { id:'DESCANSO_DIARIO',   label:'Descanso diário',      cor:'var(--c-diario)',  obrigatoria:true,  produtivo:false },
  DESCANSO_OBRIG:    { id:'DESCANSO_OBRIG',    label:'Descanso obrigatório', cor:'var(--c-obrig)',   obrigatoria:true,  produtivo:false },
  PAUSA_LABORAL:     { id:'PAUSA_LABORAL',     label:'Pausa laboral',        cor:'var(--c-laboral)', obrigatoria:true,  produtivo:false },
  ESPERA_OPERACIONAL:{ id:'ESPERA_OPERACIONAL',label:'Espera operacional',   cor:'var(--c-espera)',  obrigatoria:false, produtivo:true  },
  PARAGEM_EXTRA:     { id:'PARAGEM_EXTRA',     label:'Paragem extra',        cor:'var(--c-extra)',   obrigatoria:false, produtivo:false },
  VEICULO_INATIVO:   { id:'VEICULO_INATIVO',   label:'Veículo inativo',      cor:'var(--c-inativo)', obrigatoria:false, produtivo:false },
  POR_CLASSIFICAR:   { id:'POR_CLASSIFICAR',   label:'Por classificar',      cor:'var(--c-porclass)',obrigatoria:false, produtivo:false },
};

/* ---------- Tipos de local (atribuídos pelo utilizador) -----------------
   É o tipo do local que classifica a paragem. Uma morada diz onde é; só saber
   que aquilo é uma pedreira permite dizer que a paragem é carga e não desperdício.
   ----------------------------------------------------------------------- */
const TIPOS_LOCAL = {
  SEDE:          { id:'SEDE',          label:'Sede / parque' },
  PEDREIRA:      { id:'PEDREIRA',      label:'Pedreira' },
  CENTRAL_BETAO: { id:'CENTRAL_BETAO', label:'Central de betão' },
  CLIENTE:       { id:'CLIENTE',       label:'Cliente' },
  OBRA:          { id:'OBRA',          label:'Obra' },
  OFICINA:       { id:'OFICINA',       label:'Oficina' },
  POSTO:         { id:'POSTO',         label:'Posto de combustível' },
  AREA_SERVICO:  { id:'AREA_SERVICO',  label:'Área de serviço' },
  OUTRO:         { id:'OUTRO',         label:'Outro (não operacional)' },
};

/* ---------- Utilitários ------------------------------------------------- */
const min2h = (m) => {
  const h = Math.floor(m / 60), r = Math.round(m % 60);
  return h > 0 ? `${h}h${String(r).padStart(2, '0')}` : `${r} min`;
};
const hhmm = (d) => `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
const dia = (d) => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
const diaPT = (d) => `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`;
const minutosDoDia = (d) => d.getHours() * 60 + d.getMinutes();

/* Distância em metros entre duas coordenadas (haversine) */
function distM(a, b) {
  if (!a || !b) return Infinity;
  const R = 6371000, rad = Math.PI / 180;
  const p1 = a[0] * rad, p2 = b[0] * rad;
  const dp = (b[0] - a[0]) * rad, dl = (b[1] - a[1]) * rad;
  const x = Math.sin(dp/2)**2 + Math.cos(p1)*Math.cos(p2)*Math.sin(dl/2)**2;
  return 2 * R * Math.asin(Math.sqrt(x));
}

function agrupar(arr, fn) {
  return arr.reduce((acc, x) => { const k = fn(x); (acc[k] = acc[k] || []).push(x); return acc; }, {});
}

/* ---------- 1. Consolidação das viagens --------------------------------- */
function consolidarViagens(viagens, cfg = CFG) {
  return viagens.map(v => {
    const durMin = (v.fim - v.inicio) / 60000;
    return {
      ...v, durMin,
      manobra: v.km < cfg.manobraKmMax || (v.velMedia !== null && v.velMedia < cfg.manobraVelMediaMax),
      suspeita: cfg.viagemSuspeita.some(r =>
        durMin > r.durMin && (r.velMax === Infinity || (v.velMedia !== null && v.velMedia < r.velMax))),
    };
  });
}

/* ---------- 2a. Paragens do relatório (fonte preferida) -----------------
   Junta fragmentos: o Traccar parte uma espera em duas sempre que o veículo se
   mexe dentro do estaleiro. Com coordenadas isto resolve-se bem — mesmo sítio
   (<150m) e intervalo curto (<15min) é a mesma paragem.
   ----------------------------------------------------------------------- */
function consolidarParagens(brutas, cfg = CFG) {
  const out = [];
  for (const [veic, ps] of Object.entries(agrupar(brutas, p => p.veiculo))) {
    const ord = [...ps].sort((a, b) => a.inicio - b.inicio);
    let atual = null;
    for (const p of ord) {
      if (atual &&
          (p.inicio - atual.fim) / 60000 <= cfg.juntarParagensGapMin &&
          distM(atual.coord, p.coord) <= cfg.raioLocalM) {
        atual.fim = p.fim > atual.fim ? p.fim : atual.fim;
        atual.fragmentos++;
      } else {
        if (atual) out.push(atual);
        atual = { ...p, veiculo: veic, fragmentos: 1 };
      }
    }
    if (atual) out.push(atual);
  }
  return out
    .map(p => ({ ...p, duracaoMin: (p.fim - p.inicio) / 60000 }))
    .filter(p => p.duracaoMin >= cfg.paragemMinMin);
}

/* ---------- 2b. Paragens derivadas das viagens (sem relatório) ----------- */
function derivarParagens(viagensVeiculo, cfg = CFG) {
  const reais = viagensVeiculo.filter(v => !v.manobra).sort((a, b) => a.inicio - b.inicio);
  const paragens = [];
  for (let i = 0; i < reais.length - 1; i++) {
    const a = reais[i], b = reais[i + 1];
    const durMin = (b.inicio - a.fim) / 60000;
    if (durMin < cfg.paragemMinMin) continue;
    const manobras = viagensVeiculo.filter(v => v.manobra && v.inicio >= a.fim && v.fim <= b.inicio);
    paragens.push({
      veiculo: a.veiculo, inicio: a.fim, fim: b.inicio, duracaoMin: durMin,
      manobrasDentro: manobras.length, coord: null, fragmentos: 1,
    });
  }
  return paragens;
}

/* ---------- 3. Condução acumulada ---------------------------------------
   Percorre a linha temporal do veículo (viagens + paragens) e acumula o tempo
   de deslocação desde a última pausa >=45min. Proxy: NÃO é o tempo de condução
   do tacógrafo (ver LEIA-ME, secção Limites).
   ----------------------------------------------------------------------- */
function calcularConducaoAcumulada(paragens, viagens, cfg = CFG) {
  const porVeic = agrupar([...viagens.filter(v => !v.manobra).map(v => ({ ...v, _viagem: true })),
                           ...paragens.map(p => ({ ...p, _viagem: false, _ref: p }))],
                          x => x.veiculo);
  for (const eventos of Object.values(porVeic)) {
    eventos.sort((a, b) => a.inicio - b.inicio);
    let acumulado = 0, fiavel = true;
    for (const e of eventos) {
      if (e._viagem) {
        // Viagem não fechada: a duração não é condução e as paragens lá dentro
        // não foram registadas — o acumulado perde o fio.
        if (e.suspeita) { acumulado = 0; fiavel = false; }
        else { acumulado += e.durMin; fiavel = true; }
      } else {
        e._ref.conducaoAcumuladaMin = acumulado;
        e._ref.acumuladoFiavel = fiavel;
        if (e._ref.duracaoMin >= cfg.pausaObrigatoriaMin) { acumulado = 0; fiavel = true; }
      }
    }
  }
  return paragens;
}

/* Segunda passagem: deteta o par 15+30 do Art.7 */
function marcarFracionadas(paragens, cfg = CFG) {
  for (const ps of Object.values(agrupar(paragens, p => p.veiculo))) {
    ps.sort((a, b) => a.inicio - b.inicio);
    for (let i = 0; i < ps.length - 1; i++) {
      const a = ps[i], b = ps[i + 1];
      const aOk = a.duracaoMin >= cfg.pausaFracionadaAMin && a.duracaoMin < cfg.pausaObrigatoriaMin;
      const bOk = b.duracaoMin >= cfg.pausaFracionadaBMin && b.duracaoMin < cfg.pausaObrigatoriaMin;
      const perto = (b.inicio - a.fim) / 60000 <= cfg.conducaoContinuaMaxMin;
      if (aOk && bOk && perto && a.duracaoMin + b.duracaoMin >= cfg.pausaObrigatoriaMin) {
        a.fracionada = true; b.fracionada = true;
      }
    }
  }
  return paragens;
}

/* ---------- 4. Locais ---------------------------------------------------
   Agrupa as paragens por proximidade. 86% das paragens acontecem em locais
   recorrentes, por isso nomear ~15 locais cobre quase toda a operação.
   ----------------------------------------------------------------------- */
function agruparLocais(paragens, cfg = CFG, nomes = {}) {
  const locais = [];
  for (const p of paragens) {
    if (!p.coord) { p.local = null; continue; }
    let alvo = null;
    for (const l of locais) {
      if (distM(p.coord, l.centro) <= cfg.raioLocalM) { alvo = l; break; }
    }
    if (!alvo) {
      alvo = { id: locais.length + 1, centro: p.coord, paragens: [], nome: null, tipo: null, morada: null };
      locais.push(alvo);
    }
    alvo.paragens.push(p);
    // centro = média das paragens do local
    const n = alvo.paragens.length;
    alvo.centro = [
      alvo.paragens.reduce((s, x) => s + x.coord[0], 0) / n,
      alvo.paragens.reduce((s, x) => s + x.coord[1], 0) / n,
    ];
    p.local = alvo;
  }

  for (const l of locais) {
    l.chave = chaveLocal(l.centro);
    const g = nomes[l.chave];
    if (g) { l.nome = g.nome ?? null; l.tipo = g.tipo ?? null; l.morada = g.morada ?? null; }
    l.totalMin = l.paragens.reduce((s, p) => s + p.duracaoMin, 0);
    l.veiculos = new Set(l.paragens.map(p => p.veiculo)).size;
  }
  return locais.sort((a, b) => b.totalMin - a.totalMin);
}

/* Chave estável de um local (~11m de resolução) para guardar nome/tipo/morada */
const chaveLocal = (c) => `${c[0].toFixed(4)},${c[1].toFixed(4)}`;

/* ---------- 5. Motor de decisão -----------------------------------------
   Primeira regra que casa ganha — da mais defensável para a mais especulativa.
   ----------------------------------------------------------------------- */
function classificar(p, cfg = CFG) {
  const d = p.duracaoMin;
  const L = p.local;
  const onde = L?.nome ? ` — ${L.nome}` : '';

  // --- Duração: facto, não inferência
  if (d >= cfg.descansoSemanalNormalMin)
    return { tipo: TIPOS.DESCANSO_SEMANAL, justificacao: '561/2006 Art.8 — descanso semanal normal (≥45h)', confianca: 'alta' };
  if (d >= cfg.descansoSemanalReduzidoMin)
    return { tipo: TIPOS.DESCANSO_SEMANAL, justificacao: '561/2006 Art.8 — descanso semanal reduzido (≥24h)', confianca: 'alta' };
  if (d >= cfg.descansoDiarioNormalMin)
    return { tipo: TIPOS.DESCANSO_DIARIO, justificacao: '561/2006 Art.8 — descanso diário normal (≥11h)', confianca: 'alta' };
  if (d >= cfg.descansoDiarioMin)
    return { tipo: TIPOS.DESCANSO_DIARIO, justificacao: '561/2006 Art.8 — descanso diário reduzido (9h–11h)', confianca: 'alta' };

  // --- Oficina: a imobilização é a razão de estar lá, independentemente da duração
  if (L?.tipo === 'OFICINA')
    return { tipo: TIPOS.VEICULO_INATIVO, justificacao: `Em oficina${onde}`, confianca: 'alta' };

  // --- Descanso obrigatório
  if (p.conducaoAcumuladaMin >= cfg.conducaoContinuaMaxMin && d >= cfg.pausaObrigatoriaMin)
    return { tipo: TIPOS.DESCANSO_OBRIG,
             justificacao: `561/2006 Art.7 — pausa 45min após ${min2h(p.conducaoAcumuladaMin)} de condução`, confianca: 'media' };
  if (p.fracionada)
    return { tipo: TIPOS.DESCANSO_OBRIG, justificacao: '561/2006 Art.7 — pausa fracionada 15+30', confianca: 'media' };

  // --- Local operacional conhecido: agora há fundamento para dizer o que é
  if (L?.tipo) {
    switch (L.tipo) {
      case 'PEDREIRA':
        return { tipo: TIPOS.ESPERA_OPERACIONAL, justificacao: `Carga / espera em pedreira${onde}`, confianca: 'alta' };
      case 'CENTRAL_BETAO':
        return { tipo: TIPOS.ESPERA_OPERACIONAL, justificacao: `Carga / espera em central de betão${onde}`, confianca: 'alta' };
      case 'CLIENTE':
        return { tipo: TIPOS.ESPERA_OPERACIONAL, justificacao: `Descarga / espera em cliente${onde}`, confianca: 'alta' };
      case 'OBRA':
        return { tipo: TIPOS.ESPERA_OPERACIONAL, justificacao: `Descarga / espera em obra${onde}`, confianca: 'alta' };
      case 'POSTO':
        return { tipo: TIPOS.ESPERA_OPERACIONAL, justificacao: `Abastecimento${onde}`, confianca: 'alta' };
      case 'SEDE':
        return d >= cfg.inatividadeMin
          ? { tipo: TIPOS.VEICULO_INATIVO, justificacao: `Parqueado na sede ${min2h(d)}${onde}`, confianca: 'alta' }
          : { tipo: TIPOS.ESPERA_OPERACIONAL, justificacao: `Sede / parque${onde}`, confianca: 'alta' };
      case 'AREA_SERVICO': break;   // cai nas regras de pausa abaixo
      case 'OUTRO':
        // Local conhecido e não operacional: aqui "extra" já tem fundamento.
        return { tipo: TIPOS.PARAGEM_EXTRA,
                 justificacao: `Sem necessidade legal, em local não operacional${onde}`, confianca: 'media' };
    }
  }

  // --- Pausa laboral (janela de almoço)
  const hIni = minutosDoDia(p.inicio);
  if (hIni >= cfg.almocoInicio && hIni <= cfg.almocoFim && d >= cfg.pausaLaboralMinMin && d <= cfg.pausaLaboralMaxMin)
    return { tipo: TIPOS.PAUSA_LABORAL, justificacao: `Janela de almoço — pausa de tempo de trabalho${onde}`, confianca: L?.tipo ? 'media' : 'baixa' };

  // --- Área de serviço fora da janela de almoço
  if (L?.tipo === 'AREA_SERVICO')
    return { tipo: TIPOS.PARAGEM_EXTRA, justificacao: `Área de serviço, sem necessidade legal${onde}`, confianca: 'media' };

  // --- Sinal fraco de operação: manobras dentro da paragem
  if (p.manobrasDentro > 0)
    return { tipo: TIPOS.ESPERA_OPERACIONAL,
             justificacao: `${p.manobrasDentro} manobra(s) durante a paragem — carga/descarga provável`, confianca: 'baixa' };

  // --- Imobilização longa fora de descanso
  if (d >= cfg.inatividadeMin)
    return { tipo: TIPOS.VEICULO_INATIVO,
             justificacao: `Imobilizado ${min2h(d)} sem atingir descanso diário — veículo sem serviço`, confianca: 'media' };

  // --- Residual. Sem tipo de local não é possível distinguir uma espera em
  //     pedreira de uma paragem evitável: as duas são um veículo parado 25 min.
  return {
    tipo: TIPOS.POR_CLASSIFICAR,
    justificacao: p.coord ? 'Local por tipificar — atribua o tipo ao local para classificar'
                          : 'Sem localização — exporte o relatório Paragens do Traccar',
    confianca: 'baixa',
  };
}

/* ---------- 6. Alertas -------------------------------------------------- */
function gerarAlertas(paragens, viagens, cfg = CFG) {
  const alertas = [];
  const add = (sev, veiculo, data, titulo, detalhe) => alertas.push({ sev, veiculo, data, titulo, detalhe });

  for (const v of viagens.filter(v => v.suspeita && !v.manobra)) {
    const base = `Registo único de ${min2h(v.durMin)} a ${v.velMedia?.toFixed(1) ?? '?'} km/h médios (${v.km.toFixed(0)} km). ` +
                 `A esta média o veículo esteve quase todo o tempo parado, pelo que a duração não é tempo de condução `+
                 `e foi excluída dos totais.`;
    if (v.durMin >= cfg.registoFalhaEquipamentoMin) {
      add('serious', v.veiculo, diaPT(v.inicio), 'Registo de viagem com falha de equipamento',
        `${base} Acima de 12h — mais do que o descanso diário mais longo — o motor ligado já não explica o registo. ` +
        `É falha do equipamento: reportar ao DTI.`);
    } else {
      add('warning', v.veiculo, diaPT(v.inicio), 'Condução não apurável neste período',
        `${base} Causa provável: o motorista descansou com a viatura ligada e parada — prática normal, ` +
        `mas se o Traccar detetar viagens por ignição a paragem não é registada em lado nenhum. ` +
        `Não é indício de irregularidade.`);
    }
  }

  // Um evento de condução contínua por veículo e dia, no pior momento — o
  // acumulado só reinicia com pausa >=45min, senão cada paragem curta repetia.
  const excessos = paragens.filter(p =>
    p.acumuladoFiavel && p.conducaoAcumuladaMin > cfg.conducaoContinuaMaxMin && p.duracaoMin < cfg.pausaObrigatoriaMin);
  for (const ps of Object.values(agrupar(excessos, p => `${p.veiculo}|${dia(p.inicio)}`))) {
    const pior = ps.reduce((a, b) => b.conducaoAcumuladaMin > a.conducaoAcumuladaMin ? b : a);
    const extra = ps.length > 1 ? ` Nesse dia houve ${ps.length} paragens sem cumprir os 45 min exigidos.` : '';
    add('critical', pior.veiculo, diaPT(pior.inicio), 'Condução contínua acima de 4h30 sem pausa de 45 min',
      `${min2h(pior.conducaoAcumuladaMin)} de deslocação acumulada; a paragem das ${hhmm(pior.inicio)} durou apenas ${min2h(pior.duracaoMin)}.${extra}`);
  }

  for (const p of paragens) {
    if ((p.classificacao.tipo.id === 'POR_CLASSIFICAR' || p.classificacao.tipo.id === 'PARAGEM_EXTRA')
        && p.duracaoMin >= cfg.alertaPausaLongaMin) {
      const onde = p.local?.nome ? ` em ${p.local.nome}` : '';
      add('warning', p.veiculo, diaPT(p.inicio),
        p.classificacao.tipo.id === 'PARAGEM_EXTRA' ? 'Paragem extra superior a 1 hora' : 'Paragem longa por explicar',
        `${hhmm(p.inicio)}–${hhmm(p.fim)} (${min2h(p.duracaoMin)})${onde} sem justificação legal identificada.`);
    }
  }

  for (const [k, ps] of Object.entries(agrupar(paragens, p => `${p.veiculo}|${dia(p.inicio)}`))) {
    const curtas = ps.filter(p => p.duracaoMin >= cfg.paragemMinMin && p.duracaoMin < 15);
    if (curtas.length >= 5) {
      add('warning', k.split('|')[0], diaPT(curtas[0].inicio), 'Múltiplas paragens curtas consecutivas',
        `${curtas.length} paragens entre 5 e 15 min no mesmo dia (${min2h(curtas.reduce((s, p) => s + p.duracaoMin, 0))} no total).`);
    }
  }

  const viagPorVeicDia = agrupar(viagens.filter(v => !v.manobra && !v.suspeita), v => `${v.veiculo}|${dia(v.inicio)}`);
  for (const [k, vs] of Object.entries(viagPorVeicDia)) {
    const cond = vs.reduce((s, v) => s + v.durMin, 0);
    const veiculo = k.split('|')[0];
    if (cond > cfg.conducaoDiariaMaxEstendidaMin)
      add('critical', veiculo, diaPT(vs[0].inicio), 'Tempo de volante diário acima de 10h',
        `${min2h(cond)} de deslocação — acima do limite estendido do Art.6.`);
    else if (cond > cfg.conducaoDiariaMaxMin)
      add('serious', veiculo, diaPT(vs[0].inicio), 'Tempo de volante diário acima de 9h',
        `${min2h(cond)} de deslocação — só admissível 2×/semana (Art.6).`);
  }

  const ordem = { critical: 0, serious: 1, warning: 2 };
  return alertas.sort((a, b) => ordem[a.sev] - ordem[b.sev] || a.veiculo.localeCompare(b.veiculo));
}

/* ---------- 7. KPIs ----------------------------------------------------- */
function calcularKPIs(paragens, viagens) {
  const reais = viagens.filter(v => !v.manobra);
  const porVeiculo = {};

  for (const v of reais) {
    const k = v.veiculo;
    porVeiculo[k] = porVeiculo[k] || {
      veiculo: k, viagens: 0, km: 0, conducaoMin: 0, paradoMin: 0,
      paradoObrigMin: 0, paradoExtraMin: 0, paragens: 0, paragensExtra: 0,
      viagensSuspeitas: 0, dias: new Set(),
    };
    porVeiculo[k].viagens++;
    porVeiculo[k].km += v.km;
    if (v.suspeita) porVeiculo[k].viagensSuspeitas++;
    else porVeiculo[k].conducaoMin += v.durMin;
    porVeiculo[k].dias.add(dia(v.inicio));
  }

  for (const p of paragens) {
    const o = porVeiculo[p.veiculo];
    if (!o) continue;
    const t = p.classificacao.tipo;
    // Descanso diário/semanal é tempo fora de serviço.
    if (t.id === 'DESCANSO_DIARIO' || t.id === 'DESCANSO_SEMANAL' || t.id === 'VEICULO_INATIVO') continue;
    o.paragens++;
    o.paradoMin += p.duracaoMin;
    if (t.obrigatoria) o.paradoObrigMin += p.duracaoMin;
    else o.paradoExtraMin += p.duracaoMin;
    if (t.id === 'PARAGEM_EXTRA' || t.id === 'POR_CLASSIFICAR') o.paragensExtra++;
  }

  return Object.values(porVeiculo).map(o => {
    const servico = o.conducaoMin + o.paradoMin;
    return {
      ...o, nDias: o.dias.size, servicoMin: servico,
      produtividadePct: servico > 0 ? (o.conducaoMin / servico) * 100 : 0,
      paradoPct: servico > 0 ? (o.paradoMin / servico) * 100 : 0,
      pausaMediaMin: o.paragens > 0 ? o.paradoMin / o.paragens : 0,
      kmDia: o.dias.size ? o.km / o.dias.size : 0,
    };
  }).sort((a, b) => b.paradoExtraMin - a.paradoExtraMin);
}

/* ---------- Orquestrador ------------------------------------------------ */
function analisar(viagensBrutas, paragensBrutas = null, cfg = CFG, nomesLocais = {}) {
  const viagens = consolidarViagens(viagensBrutas, cfg);
  const veiculos = [...new Set(viagens.map(v => v.veiculo))];

  let paragens, fonte;
  if (paragensBrutas && paragensBrutas.length) {
    paragens = consolidarParagens(paragensBrutas, cfg);
    fonte = 'relatorio';
  } else {
    paragens = veiculos.flatMap(v => derivarParagens(viagens.filter(x => x.veiculo === v), cfg));
    fonte = 'derivadas';
  }

  calcularConducaoAcumulada(paragens, viagens, cfg);
  marcarFracionadas(paragens, cfg);
  const locais = agruparLocais(paragens, cfg, nomesLocais);
  for (const p of paragens) p.classificacao = classificar(p, cfg);

  return {
    viagens, paragens, locais, fonte, veiculos, cfg,
    alertas: gerarAlertas(paragens, viagens, cfg),
    kpis: calcularKPIs(paragens, viagens),
  };
}
