import { useState, useMemo } from "react";

const bg="#0b0e14",sf="#13181f",s2="#1a2230",bd="#1e2d3d";
const ac="#e8a020",bl="#3b82f6",rd="#ef4444",gn="#22c55e",pu="#a78bfa",or="#fb923c";
const tx="#e2e8f0",mu="#64748b";

const euro=v=>"€ "+Number(v||0).toLocaleString("pt-PT",{minimumFractionDigits:2,maximumFractionDigits:2});
const pct=v=>(Number(v||0)*100).toFixed(1)+"%";
const nv=v=>parseFloat(String(v||"0").replace(",","."))||0;
const drC=d=>d?nv(d.salario)+nv(d.subRef)+nv(d.subTranp)+nv(d.seguro):0;

const V0=[
  {id:1,matricula:"AA-01-BB",tipo:"trator", marca:"Volvo",   modelo:"FH16",  ano:2021},
  {id:2,matricula:"CC-02-DD",tipo:"reboque",marca:"Schmitz", modelo:"S.KO",  ano:2020},
  {id:3,matricula:"EE-03-FF",tipo:"camiao", marca:"Mercedes",modelo:"Actros",ano:2022},
];
const D0=[
  {id:1,nome:"João Silva",  salario:1800,subRef:220,subTranp:100,seguro:80,veiculoId:1},
  {id:2,nome:"Maria Santos",salario:1750,subRef:220,subTranp:100,seguro:80,veiculoId:3},
];
const M0=[
  {id:1,veiculoId:1,data:"2025-03-10",tipo:"Revisão Geral",desc:"Óleo + filtros",   custo:420, estado:"ok"},
  {id:2,veiculoId:3,data:"2025-04-22",tipo:"Pneus",        desc:"4 pneus dianteiros",custo:1200,estado:"ok"},
];
const T0=[
  {id:1,veiculoId:1,mes:"2025-05",valor:380,via:"A1/A2"},
  {id:2,veiculoId:3,mes:"2025-05",valor:210,via:"A1/A6"},
];
const G0=[
  {id:1,veiculoId:1,data:"2025-05-03",local:"Galp A1",litros:450,preco:1.589,custo:715.05,km:245800},
  {id:2,veiculoId:3,data:"2025-05-05",local:"BP Lisboa",litros:320,preco:1.562,custo:499.84,km:182300},
];
const S0=[{id:1,tratorId:1,reboqueId:2,nome:"Conjunto Norte"}];

const C={background:sf,border:`1px solid ${bd}`,borderRadius:10,padding:18,marginBottom:16};
const IN={background:bg,border:`1px solid ${bd}`,color:tx,borderRadius:7,padding:"8px 10px",fontSize:13,fontFamily:"inherit",outline:"none",width:"100%",boxSizing:"border-box"};
const SE={background:bg,border:`1px solid ${bd}`,color:tx,borderRadius:7,padding:"8px 10px",fontSize:13,fontFamily:"inherit",outline:"none",width:"100%",boxSizing:"border-box"};
const BA={padding:"9px 20px",borderRadius:7,fontSize:13,fontWeight:700,cursor:"pointer",border:"none",background:ac,color:"#000"};
const BB={padding:"9px 16px",borderRadius:7,fontSize:13,fontWeight:700,cursor:"pointer",border:`1px solid ${bd}`,background:s2,color:tx};
const LB={display:"block",fontSize:10,color:mu,textTransform:"uppercase",letterSpacing:"0.08em",fontWeight:700,marginBottom:5};
const TD={padding:"9px 10px",borderBottom:"1px solid #151c26",verticalAlign:"middle"};
const TH={textAlign:"left",padding:"8px 10px",color:mu,fontSize:10,textTransform:"uppercase",borderBottom:`1px solid ${bd}`,fontWeight:700};
const G2={display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12};
const G3={display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:12};
const G4={display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:12,marginBottom:12};

function Lbl({t}) {
  return <div style={{background:sf,border:`1px solid ${bd}`,borderRadius:10,padding:"14px 16px",marginBottom:0}}>
    <div style={{fontSize:10,color:mu,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:6}}>{t[0]}</div>
    <div style={{fontSize:24,fontWeight:800,color:t[2]}}>{t[1]}</div>
    {t[3] && <div style={{fontSize:11,color:mu,marginTop:3}}>{t[3]}</div>}
  </div>;
}

function Badge({e}) {
  const map={ok:["rgba(34,197,94,.15)",gn,"OK"],warn:["rgba(232,160,32,.15)",ac,"Pendente"],danger:["rgba(239,68,68,.15)",rd,"Urgente"]};
  const[bg2,c,t]=map[e]||map.ok;
  return <span style={{display:"inline-block",padding:"2px 9px",borderRadius:99,fontSize:10,fontWeight:700,background:bg2,color:c}}>{t}</span>;
}

function Tipo({t}) {
  const map={trator:["rgba(59,130,246,.15)",bl,"Trator"],reboque:["rgba(232,160,32,.15)",ac,"Reboque"],camiao:["rgba(34,197,94,.12)",gn,"Camião"]};
  const[bg2,c,lb]=map[t]||["#333","#aaa",t];
  return <span style={{display:"inline-block",padding:"2px 8px",borderRadius:4,fontSize:10,fontWeight:700,background:bg2,color:c}}>{lb}</span>;
}

function Th({cols}) {
  return <thead><tr>{cols.map(h=><th key={h} style={TH}>{h}</th>)}</tr></thead>;
}

export default function App() {
  const[pg,setPg]=useState("dash");
  const[veic,setVeic]=useState(V0);
  const[mots,setMots]=useState(D0);
  const[man,setMan]=useState(M0);
  const[port,setPort]=useState(T0);
  const[gas,setGas]=useState(G0);
  const[conj,setConj]=useState(S0);
  const[fret,setFret]=useState([]);

  const tM=useMemo(()=>man.reduce((s,m)=>s+nv(m.custo),0),[man]);
  const tP=useMemo(()=>port.reduce((s,p)=>s+nv(p.valor),0),[port]);
  const tG=useMemo(()=>gas.reduce((s,g)=>s+nv(g.custo),0),[gas]);
  const tD=useMemo(()=>mots.reduce((s,d)=>s+drC(d),0),[mots]);

  const pages=[
    ["dash","📊","Dashboard"],["imp","📥","Importar"],
    ["veic","🚛","Viaturas"],["conj","🔗","Conjuntos"],["mot","👤","Motoristas"],
    ["man","🔧","Manutenção"],["port","🛣️","Portagens"],["gas","⛽","Gasóleo"],
    ["cust","📐","Custos Base"],["fret","📦","Frete"],
  ];

  return (
    <div style={{display:"flex",minHeight:"100vh",background:bg,color:tx,fontFamily:"system-ui,sans-serif"}}>
      <nav style={{width:188,minHeight:"100vh",background:sf,borderRight:`1px solid ${bd}`,display:"flex",flexDirection:"column",position:"fixed",top:0,left:0}}>
        <div style={{padding:"18px 14px 12px",borderBottom:`1px solid ${bd}`}}>
          <div style={{fontSize:22,fontWeight:900,color:ac}}>FROTA</div>
          <div style={{fontSize:10,color:mu,textTransform:"uppercase",letterSpacing:"0.1em"}}>Fleet Manager</div>
        </div>
        <div style={{flex:1,overflowY:"auto",padding:"4px 0"}}>
          {pages.map(([id,ic,lb])=>(
            <button key={id} onClick={()=>setPg(id)} style={{display:"flex",alignItems:"center",gap:8,padding:"9px 14px",width:"100%",border:"none",cursor:"pointer",fontSize:13,fontWeight:500,textAlign:"left",background:pg===id?"rgba(232,160,32,0.13)":"transparent",color:pg===id?ac:mu}}>
              <span style={{fontSize:14}}>{ic}</span>{lb}
            </button>
          ))}
        </div>
        <div style={{padding:"12px 14px",borderTop:`1px solid ${bd}`}}>
          <div style={{fontSize:9,color:mu,textTransform:"uppercase",marginBottom:3}}>Total Geral</div>
          <div style={{fontSize:19,fontWeight:900,color:ac}}>{euro(tM+tP+tG+tD)}</div>
        </div>
      </nav>
      <main style={{marginLeft:188,flex:1,padding:28}}>
        {pg==="dash" && <PgDash veic={veic} man={man} port={port} gas={gas} mots={mots} fret={fret} tM={tM} tP={tP} tG={tG}/>}
        {pg==="imp"  && <PgImp  veic={veic} setMan={setMan} setPort={setPort} setGas={setGas}/>}
        {pg==="veic" && <PgVeic veic={veic} setVeic={setVeic}/>}
        {pg==="conj" && <PgConj veic={veic} mots={mots} man={man} port={port} gas={gas} conj={conj} setConj={setConj}/>}
        {pg==="mot"  && <PgMot  mots={mots} setMots={setMots} veic={veic} tD={tD}/>}
        {pg==="man"  && <PgMan  man={man} setMan={setMan} veic={veic} tM={tM}/>}
        {pg==="port" && <PgPort port={port} setPort={setPort} veic={veic} tP={tP}/>}
        {pg==="gas"  && <PgGas  gas={gas} setGas={setGas} veic={veic} tG={tG}/>}
        {pg==="cust" && <PgCust veic={veic} mots={mots} man={man} port={port} conj={conj}/>}
        {pg==="fret" && <PgFret fret={fret} setFret={setFret}/>}
      </main>
    </div>
  );
}

function PgDash({veic,man,port,gas,mots,fret,tM,tP,tG}) {
  const tFR=fret.reduce((s,f)=>s+nv(f.preco),0);
  const tFC=fret.reduce((s,f)=>s+nv(f.total),0);
  return (
    <div>
      <h2 style={{fontSize:28,fontWeight:900,margin:"0 0 4px"}}>Dashboard</h2>
      <p style={{fontSize:13,color:mu,marginBottom:20}}>Visão consolidada da frota</p>
      <div style={G4}>
        <Lbl t={["Viaturas",veic.length,bl,veic.filter(v=>v.tipo==="trator").length+" trat · "+veic.filter(v=>v.tipo==="reboque").length+" reb"]}/>
        <Lbl t={["Manutenção",euro(tM),ac,man.length+" registos"]}/>
        <Lbl t={["Portagens",euro(tP),pu,port.length+" lançamentos"]}/>
        <Lbl t={["Gasóleo",euro(tG),or,gas.reduce((s,g)=>s+nv(g.litros),0).toFixed(0)+" L"]}/>
      </div>
      {fret.length>0 && (
        <div style={G3}>
          <Lbl t={["Receita Fretes",euro(tFR),gn]}/>
          <Lbl t={["Custo Fretes",euro(tFC),rd]}/>
          <Lbl t={["Margem Fretes",euro(tFR-tFC),tFR-tFC>=0?gn:rd]}/>
        </div>
      )}
      <div style={C}>
        <div style={{fontWeight:800,fontSize:15,marginBottom:12}}>Custo por Viatura</div>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
            <Th cols={["Matrícula","Tipo","Manutenção","Portagens","Gasóleo","Motorista","Total"]}/>
            <tbody>
              {veic.map(v=>{
                const mC=man.filter(m=>m.veiculoId===v.id).reduce((s,m)=>s+nv(m.custo),0);
                const pC=port.filter(p=>p.veiculoId===v.id).reduce((s,p)=>s+nv(p.valor),0);
                const gC=gas.filter(g=>g.veiculoId===v.id).reduce((s,g)=>s+nv(g.custo),0);
                const dC=drC(mots.find(d=>d.veiculoId===v.id));
                return (
                  <tr key={v.id}>
                    <td style={TD}><strong>{v.matricula}</strong></td>
                    <td style={TD}><Tipo t={v.tipo}/></td>
                    <td style={TD}>{euro(mC)}</td>
                    <td style={TD}>{euro(pC)}</td>
                    <td style={TD}>{euro(gC)}</td>
                    <td style={TD}>{euro(dC)}</td>
                    <td style={TD}><strong style={{color:ac}}>{euro(mC+pC+gC+dC)}</strong></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function PgImp({veic,setMan,setPort,setGas}) {
  const[prev,setPrev]=useState(null);
  const[done,setDone]=useState(null);
  const[tab,setTab]=useState("m");
  const[drag,setDrag]=useState(false);

  function parse(file) {
    if(!window.XLSX){alert("Biblioteca XLSX não disponível.");return;}
    const r=new FileReader();
    r.onload=e=>{
      try {
        const wb=window.XLSX.read(e.target.result,{type:"array"});
        const kn=new Set(veic.map(v=>v.matricula.trim().toUpperCase()));
        function rows(sh,cols) {
          const ws=wb.Sheets[sh];
          if(!ws) return [];
          return window.XLSX.utils.sheet_to_json(ws,{header:1,defval:""}).slice(4)
            .filter(r=>r.some(c=>c!==""))
            .map(r=>{const o={};cols.forEach((c,i)=>o[c]=r[i]);return o;});
        }
        function toDate(v) {
          if(!v) return "";
          if(typeof v==="number"){const d=new Date(Math.round((v-25569)*86400000));return d.toISOString().slice(0,10);}
          return String(v).slice(0,10);
        }
        function tn(v){return parseFloat(String(v||"0").replace(",","."))||0;}
        const md=rows("Manutenção",["mat","data","tipo","desc","custo","forn","estado"]).map((r,i)=>{
          const mat=String(r.mat||"").trim().toUpperCase();
          const vv=veic.find(x=>x.matricula.toUpperCase()===mat);
          const er=[];
          if(!mat) er.push("Matrícula em falta");
          else if(!kn.has(mat)) er.push("Desconhecida: "+mat);
          if(!r.tipo) er.push("Tipo em falta");
          return{i:i+5,mat,data:toDate(r.data),tipo:r.tipo||"",desc:r.desc||"",custo:tn(r.custo),estado:r.estado||"ok",vid:vv?vv.id:null,ok:er.length===0,er};
        });
        const pd=rows("Via Verde",["mat","mes","via","valor"]).map((r,i)=>{
          const mat=String(r.mat||"").trim().toUpperCase();
          const vv=veic.find(x=>x.matricula.toUpperCase()===mat);
          const er=[];
          if(!mat) er.push("Matrícula em falta");
          else if(!kn.has(mat)) er.push("Desconhecida: "+mat);
          return{i:i+5,mat,mes:String(r.mes||"").slice(0,7),via:r.via||"",valor:tn(r.valor),vid:vv?vv.id:null,ok:er.length===0,er};
        });
        const gd=rows("Gasóleo",["mat","data","local","litros","preco","custoT","km"]).map((r,i)=>{
          const mat=String(r.mat||"").trim().toUpperCase();
          const vv=veic.find(x=>x.matricula.toUpperCase()===mat);
          const lt=tn(r.litros),pr=tn(r.preco),ct=tn(r.custoT);
          const er=[];
          if(!mat) er.push("Matrícula em falta");
          else if(!kn.has(mat)) er.push("Desconhecida: "+mat);
          if(lt<=0) er.push("Litros inválidos");
          return{i:i+5,mat,data:toDate(r.data),local:r.local||"",litros:lt,preco:pr,custo:ct||lt*pr,km:r.km||"",vid:vv?vv.id:null,ok:er.length===0,er};
        });
        setPrev({m:md,p:pd,g:gd});
      } catch(err) {alert("Erro: "+err.message);}
    };
    r.readAsArrayBuffer(file);
  }

  function confirm() {
    if(!prev) return;
    setMan(x=>[...x,...prev.m.filter(r=>r.ok).map(r=>({id:Date.now()+Math.random(),veiculoId:r.vid,data:r.data,tipo:r.tipo,desc:r.desc,custo:r.custo,estado:r.estado}))]);
    setPort(x=>[...x,...prev.p.filter(r=>r.ok).map(r=>({id:Date.now()+Math.random(),veiculoId:r.vid,mes:r.mes,valor:r.valor,via:r.via}))]);
    setGas(x=>[...x,...prev.g.filter(r=>r.ok).map(r=>({id:Date.now()+Math.random(),veiculoId:r.vid,data:r.data,local:r.local,litros:r.litros,preco:r.preco,custo:r.custo,km:r.km}))]);
    setDone({m:prev.m.filter(r=>r.ok).length,p:prev.p.filter(r=>r.ok).length,g:prev.g.filter(r=>r.ok).length});
    setPrev(null);
  }

  return (
    <div>
      <h2 style={{fontSize:28,fontWeight:900,margin:"0 0 4px"}}>Importar Excel</h2>
      <p style={{fontSize:13,color:mu,marginBottom:20}}>Manutenção · Via Verde · Gasóleo</p>
      {!prev && !done && (
        <div
          onDragOver={e=>{e.preventDefault();setDrag(true)}}
          onDragLeave={()=>setDrag(false)}
          onDrop={e=>{e.preventDefault();setDrag(false);parse(e.dataTransfer.files[0]);}}
          onClick={()=>document.getElementById("xlinp").click()}
          style={{border:`2px dashed ${drag?bl:bd}`,borderRadius:10,padding:"48px 24px",textAlign:"center",cursor:"pointer",background:drag?"rgba(59,130,246,0.04)":sf}}>
          <div style={{fontSize:44,marginBottom:10}}>📂</div>
          <div style={{fontWeight:700,fontSize:16}}>Arraste o ficheiro Excel aqui</div>
          <div style={{fontSize:12,color:mu,marginTop:6}}>ou clique para selecionar · .xlsx</div>
          <input id="xlinp" type="file" accept=".xlsx,.xls" style={{display:"none"}} onChange={e=>parse(e.target.files[0])}/>
        </div>
      )}
      {done && (
        <div style={{background:"rgba(34,197,94,.07)",border:"1px solid rgba(34,197,94,.3)",borderRadius:10,padding:18}}>
          <div style={{fontWeight:700,fontSize:16,color:gn,marginBottom:8}}>✅ Importação concluída!</div>
          <div style={{fontSize:13}}>🔧 {done.m} manutenções · 🛣️ {done.p} portagens · ⛽ {done.g} abastecimentos</div>
          <button style={{...BB,marginTop:12,fontSize:12}} onClick={()=>{setDone(null);setPrev(null);}}>+ Nova Importação</button>
        </div>
      )}
      {prev && (
        <div style={C}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
            <strong style={{fontSize:15}}>Pré-visualização</strong>
            <button style={{...BB,fontSize:12}} onClick={()=>setPrev(null)}>✕ Cancelar</button>
          </div>
          <div style={G3}>
            {[["🔧 Manutenção",prev.m,ac],["🛣️ Via Verde",prev.p,pu],["⛽ Gasóleo",prev.g,or]].map(([lb,d,c])=>(
              <div key={lb} style={{background:s2,border:`1px solid ${bd}`,borderRadius:8,padding:"12px 14px"}}>
                <div style={{fontSize:10,color:mu,textTransform:"uppercase",marginBottom:5}}>{lb}</div>
                <div style={{fontSize:20,fontWeight:800,color:c}}>{d.filter(r=>r.ok).length} <span style={{fontSize:13,color:mu}}>/ {d.length}</span></div>
                <div style={{fontSize:10,color:mu}}>{d.filter(r=>!r.ok).length} erros</div>
              </div>
            ))}
          </div>
          <div style={{display:"flex",gap:6,marginBottom:14}}>
            {[["m","Manutenção"],["p","Via Verde"],["g","Gasóleo"]].map(([id,lb])=>(
              <button key={id} onClick={()=>setTab(id)} style={{padding:"5px 14px",borderRadius:7,fontSize:11,fontWeight:700,cursor:"pointer",border:`1px solid ${bd}`,background:tab===id?bl:s2,color:tab===id?"#fff":mu}}>{lb}</button>
            ))}
          </div>
          {tab==="m" && (
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
              <Th cols={["#","Matrícula","Data","Tipo","Custo","Estado","OK"]}/>
              <tbody>
                {prev.m.map(r=>(
                  <tr key={r.i} style={{background:r.ok?"":"rgba(239,68,68,.04)"}}>
                    <td style={TD}>{r.i}</td><td style={TD}><strong>{r.mat}</strong></td>
                    <td style={TD}>{r.data}</td><td style={TD}>{r.tipo}</td>
                    <td style={TD}>{euro(r.custo)}</td><td style={TD}><Badge e={r.estado}/></td>
                    <td style={TD}>{r.ok?<span style={{color:gn,fontWeight:700}}>✓</span>:<span style={{color:rd,fontSize:11}}>{r.er[0]}</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {tab==="p" && (
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
              <Th cols={["#","Matrícula","Mês","Via","Valor","OK"]}/>
              <tbody>
                {prev.p.map(r=>(
                  <tr key={r.i}>
                    <td style={TD}>{r.i}</td><td style={TD}><strong>{r.mat}</strong></td>
                    <td style={TD}>{r.mes}</td><td style={TD}>{r.via}</td>
                    <td style={{...TD,color:pu}}>{euro(r.valor)}</td>
                    <td style={TD}>{r.ok?<span style={{color:gn,fontWeight:700}}>✓</span>:<span style={{color:rd,fontSize:11}}>{r.er[0]}</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {tab==="g" && (
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
              <Th cols={["#","Matrícula","Data","Local","Litros","€/L","Custo","OK"]}/>
              <tbody>
                {prev.g.map(r=>(
                  <tr key={r.i}>
                    <td style={TD}>{r.i}</td><td style={TD}><strong>{r.mat}</strong></td>
                    <td style={TD}>{r.data}</td><td style={TD}>{r.local}</td>
                    <td style={TD}>{r.litros.toFixed(0)} L</td><td style={TD}>€ {r.preco.toFixed(3)}</td>
                    <td style={{...TD,color:or}}>{euro(r.custo)}</td>
                    <td style={TD}>{r.ok?<span style={{color:gn,fontWeight:700}}>✓</span>:<span style={{color:rd,fontSize:11}}>{r.er[0]}</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <div style={{display:"flex",gap:10,marginTop:14,alignItems:"center"}}>
            <button style={BA} onClick={confirm}>✓ Confirmar Importação</button>
            <button style={{...BB,fontSize:12}} onClick={()=>setPrev(null)}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
}

function PgVeic({veic,setVeic}) {
  const[f,setF]=useState({matricula:"",tipo:"camiao",marca:"",modelo:"",ano:String(new Date().getFullYear())});

  function add() {
    if(!f.matricula.trim()||!f.marca.trim()) return;
    setVeic(v=>[...v,{id:Date.now(),matricula:f.matricula,tipo:f.tipo,marca:f.marca,modelo:f.modelo,ano:Number(f.ano)}]);
    setF({matricula:"",tipo:"camiao",marca:"",modelo:"",ano:String(new Date().getFullYear())});
  }

  return (
    <div>
      <h2 style={{fontSize:28,fontWeight:900,margin:"0 0 4px"}}>Viaturas</h2>
      <p style={{fontSize:13,color:mu,marginBottom:20}}>Parque automóvel</p>
      <div style={C}>
        <div style={{fontWeight:700,fontSize:14,marginBottom:12}}>Registar Viatura</div>
        <div style={G3}>
          <div><label style={LB}>Matrícula</label><input style={IN} value={f.matricula} onChange={e=>setF({...f,matricula:e.target.value})} placeholder="AA-00-BB"/></div>
          <div><label style={LB}>Tipo</label><select style={SE} value={f.tipo} onChange={e=>setF({...f,tipo:e.target.value})}><option value="camiao">Camião</option><option value="trator">Trator</option><option value="reboque">Reboque</option></select></div>
          <div><label style={LB}>Marca</label><input style={IN} value={f.marca} onChange={e=>setF({...f,marca:e.target.value})} placeholder="Volvo"/></div>
        </div>
        <div style={G3}>
          <div><label style={LB}>Modelo</label><input style={IN} value={f.modelo} onChange={e=>setF({...f,modelo:e.target.value})} placeholder="FH16"/></div>
          <div><label style={LB}>Ano</label><input style={IN} type="number" value={f.ano} onChange={e=>setF({...f,ano:e.target.value})}/></div>
          <div style={{display:"flex",alignItems:"flex-end"}}><button style={BA} onClick={add}>+ Adicionar</button></div>
        </div>
      </div>
      <div style={C}>
        <div style={{fontWeight:800,fontSize:14,marginBottom:12}}>{veic.length} Viaturas</div>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
          <Th cols={["Matrícula","Tipo","Marca","Modelo","Ano"]}/>
          <tbody>
            {veic.map(v=>(
              <tr key={v.id}>
                <td style={TD}><strong>{v.matricula}</strong></td>
                <td style={TD}><Tipo t={v.tipo}/></td>
                <td style={TD}>{v.marca}</td>
                <td style={TD}>{v.modelo}</td>
                <td style={TD}>{v.ano}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PgConj({veic,mots,man,port,gas,conj,setConj}) {
  const[f,setF]=useState({nome:"",tratorId:"",reboqueId:""});

  function add() {
    if(!f.tratorId||!f.reboqueId) return;
    setConj(s=>[...s,{id:Date.now(),nome:f.nome,tratorId:Number(f.tratorId),reboqueId:Number(f.reboqueId)}]);
    setF({nome:"",tratorId:"",reboqueId:""});
  }

  function cost(s) {
    const tr=veic.find(v=>v.id===s.tratorId);
    const rb=veic.find(v=>v.id===s.reboqueId);
    const dr=tr?mots.find(d=>d.veiculoId===tr.id):null;
    const sm=(a,fn)=>a.reduce((acc,x)=>acc+fn(x),0);
    const mT=sm(man.filter(m=>m.veiculoId===s.tratorId), m=>nv(m.custo));
    const mR=sm(man.filter(m=>m.veiculoId===s.reboqueId),m=>nv(m.custo));
    const pT=sm(port.filter(p=>p.veiculoId===s.tratorId), p=>nv(p.valor));
    const pR=sm(port.filter(p=>p.veiculoId===s.reboqueId),p=>nv(p.valor));
    const gT=sm(gas.filter(g=>g.veiculoId===s.tratorId),  g=>nv(g.custo));
    const dC=drC(dr);
    return {tr,rb,dr,mT,mR,pT,pR,gT,dC,tot:mT+mR+pT+pR+gT+dC};
  }

  return (
    <div>
      <h2 style={{fontSize:28,fontWeight:900,margin:"0 0 4px"}}>Conjuntos</h2>
      <p style={{fontSize:13,color:mu,marginBottom:20}}>Trator + Reboque — custos agregados</p>
      <div style={C}>
        <div style={G3}>
          <div><label style={LB}>Nome</label><input style={IN} value={f.nome} onChange={e=>setF({...f,nome:e.target.value})} placeholder="Conjunto Norte"/></div>
          <div><label style={LB}>Trator</label><select style={SE} value={f.tratorId} onChange={e=>setF({...f,tratorId:e.target.value})}><option value="">-- selecionar --</option>{veic.filter(v=>v.tipo==="trator").map(v=><option key={v.id} value={v.id}>{v.matricula}</option>)}</select></div>
          <div><label style={LB}>Reboque</label><select style={SE} value={f.reboqueId} onChange={e=>setF({...f,reboqueId:e.target.value})}><option value="">-- selecionar --</option>{veic.filter(v=>v.tipo==="reboque").map(v=><option key={v.id} value={v.id}>{v.matricula}</option>)}</select></div>
        </div>
        <button style={BA} onClick={add}>+ Criar Conjunto</button>
      </div>
      {conj.map(s=>{
        const cv=cost(s);
        return (
          <div key={s.id} style={{background:"linear-gradient(135deg,rgba(232,160,32,.07),rgba(59,130,246,.07))",border:"1px solid rgba(232,160,32,.25)",borderRadius:10,padding:18,marginBottom:14}}>
            <div style={{fontWeight:800,color:ac,fontSize:15,marginBottom:8}}>🔗 {s.nome||"Conjunto #"+s.id}</div>
            <div style={{fontSize:12,color:mu,marginBottom:10}}>
              <span style={{color:bl}}>Trator:</span> {cv.tr?cv.tr.matricula:"—"} &nbsp;|&nbsp;
              <span style={{color:ac}}>Reboque:</span> {cv.rb?cv.rb.matricula:"—"}
              {cv.dr && <span> &nbsp;|&nbsp; <span style={{color:gn}}>Motorista:</span> {cv.dr.nome}</span>}
            </div>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              {[["Mant. Trator",cv.mT,bl],["Mant. Reboque",cv.mR,ac],["Portagens T",cv.pT,pu],["Portagens R",cv.pR,pu],["Gasóleo",cv.gT,or]].map(([lb,vl,co])=>(
                <div key={lb} style={{background:sf,border:`1px solid ${bd}`,borderRadius:7,padding:"7px 12px",minWidth:115}}>
                  <div style={{fontSize:9,color:mu,textTransform:"uppercase"}}>{lb}</div>
                  <div style={{fontSize:15,fontWeight:800,color:co}}>{euro(vl)}</div>
                </div>
              ))}
              {cv.dr && (
                <div style={{background:sf,border:`1px solid ${bd}`,borderRadius:7,padding:"7px 12px",minWidth:115}}>
                  <div style={{fontSize:9,color:mu,textTransform:"uppercase"}}>Motorista</div>
                  <div style={{fontSize:15,fontWeight:800,color:gn}}>{euro(cv.dC)}</div>
                </div>
              )}
            </div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",background:"rgba(232,160,32,.09)",border:"1px solid rgba(232,160,32,.2)",borderRadius:8,padding:"10px 14px",marginTop:12}}>
              <span style={{fontSize:11,fontWeight:700,color:mu,textTransform:"uppercase"}}>Total Conjunto</span>
              <span style={{fontSize:26,fontWeight:900,color:ac}}>{euro(cv.tot)}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function PgMot({mots,setMots,veic,tD}) {
  const[f,setF]=useState({nome:"",salario:"",subRef:"",subTranp:"",seguro:"",veiculoId:""});

  function add() {
    if(!f.nome.trim()||!f.salario) return;
    setMots(d=>[...d,{id:Date.now(),nome:f.nome,salario:nv(f.salario),subRef:nv(f.subRef),subTranp:nv(f.subTranp),seguro:nv(f.seguro),veiculoId:Number(f.veiculoId)||null}]);
    setF({nome:"",salario:"",subRef:"",subTranp:"",seguro:"",veiculoId:""});
  }

  return (
    <div>
      <h2 style={{fontSize:28,fontWeight:900,margin:"0 0 4px"}}>Motoristas</h2>
      <p style={{fontSize:13,color:mu,marginBottom:20}}>Salários e encargos mensais</p>
      <div style={C}>
        <div style={{fontWeight:700,fontSize:14,marginBottom:12}}>Adicionar Motorista</div>
        <div style={G3}>
          <div><label style={LB}>Nome</label><input style={IN} value={f.nome} onChange={e=>setF({...f,nome:e.target.value})}/></div>
          <div><label style={LB}>Salário Base (€)</label><input style={IN} type="number" value={f.salario} onChange={e=>setF({...f,salario:e.target.value})}/></div>
          <div><label style={LB}>Sub. Refeição (€)</label><input style={IN} type="number" value={f.subRef} onChange={e=>setF({...f,subRef:e.target.value})}/></div>
        </div>
        <div style={G4}>
          <div><label style={LB}>Sub. Transporte (€)</label><input style={IN} type="number" value={f.subTranp} onChange={e=>setF({...f,subTranp:e.target.value})}/></div>
          <div><label style={LB}>Seguro Acid. (€)</label><input style={IN} type="number" value={f.seguro} onChange={e=>setF({...f,seguro:e.target.value})}/></div>
          <div><label style={LB}>Viatura</label><select style={SE} value={f.veiculoId} onChange={e=>setF({...f,veiculoId:e.target.value})}><option value="">-- nenhuma --</option>{veic.map(v=><option key={v.id} value={v.id}>{v.matricula}</option>)}</select></div>
          <div style={{display:"flex",alignItems:"flex-end"}}><button style={BA} onClick={add}>+ Adicionar</button></div>
        </div>
      </div>
      <div style={C}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <strong style={{fontSize:14}}>{mots.length} Motoristas</strong>
          <strong style={{color:gn}}>Total/mês: {euro(tD)}</strong>
        </div>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
          <Th cols={["Nome","Viatura","Salário","Sub. Ref.","Sub. Transp.","Seguro","Total/mês"]}/>
          <tbody>
            {mots.map(d=>{
              const v=veic.find(x=>x.id===d.veiculoId);
              const t=drC(d);
              return (
                <tr key={d.id}>
                  <td style={TD}><strong>{d.nome}</strong></td>
                  <td style={TD}>{v?<span>{v.matricula} <Tipo t={v.tipo}/></span>:"—"}</td>
                  <td style={TD}>{euro(d.salario)}</td>
                  <td style={TD}>{euro(d.subRef)}</td>
                  <td style={TD}>{euro(d.subTranp)}</td>
                  <td style={TD}>{euro(d.seguro)}</td>
                  <td style={TD}><strong style={{color:gn}}>{euro(t)}</strong></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PgMan({man,setMan,veic,tM}) {
  const[f,setF]=useState({veiculoId:"",data:"",tipo:"",desc:"",custo:"",estado:"ok"});

  function add() {
    if(!f.veiculoId||!f.tipo.trim()||!f.data) return;
    setMan(m=>[...m,{id:Date.now(),veiculoId:Number(f.veiculoId),data:f.data,tipo:f.tipo,desc:f.desc,custo:nv(f.custo),estado:f.estado}]);
    setF({veiculoId:"",data:"",tipo:"",desc:"",custo:"",estado:"ok"});
  }

  return (
    <div>
      <h2 style={{fontSize:28,fontWeight:900,margin:"0 0 4px"}}>Manutenção</h2>
      <p style={{fontSize:13,color:mu,marginBottom:20}}>Registo de custos de equipamento</p>
      <div style={C}>
        <div style={{fontWeight:700,fontSize:14,marginBottom:12}}>Novo Registo</div>
        <div style={G3}>
          <div><label style={LB}>Viatura</label><select style={SE} value={f.veiculoId} onChange={e=>setF({...f,veiculoId:e.target.value})}><option value="">-- selecionar --</option>{veic.map(v=><option key={v.id} value={v.id}>{v.matricula} ({v.tipo})</option>)}</select></div>
          <div><label style={LB}>Data</label><input style={IN} type="date" value={f.data} onChange={e=>setF({...f,data:e.target.value})}/></div>
          <div><label style={LB}>Tipo de Intervenção</label><input style={IN} value={f.tipo} onChange={e=>setF({...f,tipo:e.target.value})} placeholder="Revisão, Pneus, IPO..."/></div>
        </div>
        <div style={G3}>
          <div><label style={LB}>Descrição</label><input style={IN} value={f.desc} onChange={e=>setF({...f,desc:e.target.value})} placeholder="Detalhe..."/></div>
          <div><label style={LB}>Custo (€)</label><input style={IN} type="number" value={f.custo} onChange={e=>setF({...f,custo:e.target.value})} placeholder="0.00"/></div>
          <div><label style={LB}>Estado</label><select style={SE} value={f.estado} onChange={e=>setF({...f,estado:e.target.value})}><option value="ok">Concluído</option><option value="warn">Pendente</option><option value="danger">Urgente</option></select></div>
        </div>
        <button style={BA} onClick={add}>+ Adicionar Registo</button>
      </div>
      <div style={C}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <strong style={{fontSize:14}}>{man.length} Registos</strong>
          <strong style={{color:ac}}>{euro(tM)}</strong>
        </div>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
            <Th cols={["Matrícula","Data","Tipo","Descrição","Custo","Estado"]}/>
            <tbody>
              {man.map(m=>{
                const v=veic.find(x=>x.id===m.veiculoId);
                return (
                  <tr key={m.id}>
                    <td style={TD}><strong>{v?v.matricula:"—"}</strong></td>
                    <td style={TD}>{m.data}</td>
                    <td style={TD}>{m.tipo}</td>
                    <td style={TD}>{m.desc||m.descricao||""}</td>
                    <td style={TD}>{euro(m.custo)}</td>
                    <td style={TD}><Badge e={m.estado}/></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function PgPort({port,setPort,veic,tP}) {
  const[f,setF]=useState({veiculoId:"",mes:"",via:"",valor:""});

  function add() {
    if(!f.veiculoId||!f.mes||!f.valor) return;
    setPort(p=>[...p,{id:Date.now(),veiculoId:Number(f.veiculoId),mes:f.mes,via:f.via,valor:nv(f.valor)}]);
    setF({veiculoId:"",mes:"",via:"",valor:""});
  }

  return (
    <div>
      <h2 style={{fontSize:28,fontWeight:900,margin:"0 0 4px"}}>Portagens</h2>
      <p style={{fontSize:13,color:mu,marginBottom:20}}>Via Verde — lançamento mensal</p>
      <div style={C}>
        <div style={{fontWeight:700,fontSize:14,marginBottom:12}}>Lançar Portagem</div>
        <div style={G4}>
          <div><label style={LB}>Viatura</label><select style={SE} value={f.veiculoId} onChange={e=>setF({...f,veiculoId:e.target.value})}><option value="">-- selecionar --</option>{veic.map(v=><option key={v.id} value={v.id}>{v.matricula}</option>)}</select></div>
          <div><label style={LB}>Mês</label><input style={IN} type="month" value={f.mes} onChange={e=>setF({...f,mes:e.target.value})}/></div>
          <div><label style={LB}>Via / Troço</label><input style={IN} value={f.via} onChange={e=>setF({...f,via:e.target.value})} placeholder="A1/A2"/></div>
          <div><label style={LB}>Valor Total (€)</label><input style={IN} type="number" value={f.valor} onChange={e=>setF({...f,valor:e.target.value})} placeholder="0.00"/></div>
        </div>
        <button style={BA} onClick={add}>+ Lançar</button>
      </div>
      <div style={C}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <strong style={{fontSize:14}}>{port.length} Registos</strong>
          <strong style={{color:pu}}>{euro(tP)}</strong>
        </div>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
          <Th cols={["Matrícula","Mês","Via","Valor"]}/>
          <tbody>
            {port.map(p=>{
              const v=veic.find(x=>x.id===p.veiculoId);
              return (
                <tr key={p.id}>
                  <td style={TD}><strong>{v?v.matricula:"—"}</strong></td>
                  <td style={TD}>{p.mes}</td>
                  <td style={TD}>{p.via}</td>
                  <td style={{...TD,color:pu,fontWeight:600}}>{euro(p.valor)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PgGas({gas,setGas,veic,tG}) {
  const[f,setF]=useState({veiculoId:"",data:"",local:"",litros:"",preco:"",km:""});
  const tL=gas.reduce((s,g)=>s+nv(g.litros),0);

  function add() {
    if(!f.veiculoId||!f.litros) return;
    const lt=nv(f.litros), pr=nv(f.preco);
    setGas(g=>[...g,{id:Date.now(),veiculoId:Number(f.veiculoId),data:f.data,local:f.local,litros:lt,preco:pr,custo:lt*pr,km:nv(f.km)||""}]);
    setF({veiculoId:"",data:"",local:"",litros:"",preco:"",km:""});
  }

  return (
    <div>
      <h2 style={{fontSize:28,fontWeight:900,margin:"0 0 4px"}}>Gasóleo</h2>
      <p style={{fontSize:13,color:mu,marginBottom:20}}>Abastecimentos</p>
      <div style={G3}>
        <Lbl t={["Custo Total",euro(tG),or]}/>
        <Lbl t={["Litros Total",tL.toFixed(0)+" L",bl]}/>
        <Lbl t={["Preço Médio/L","€ "+(tL>0?tG/tL:0).toFixed(3),gn]}/>
      </div>
      <div style={C}>
        <div style={{fontWeight:700,fontSize:14,marginBottom:12}}>Registar Abastecimento</div>
        <div style={G3}>
          <div><label style={LB}>Viatura</label><select style={SE} value={f.veiculoId} onChange={e=>setF({...f,veiculoId:e.target.value})}><option value="">-- selecionar --</option>{veic.map(v=><option key={v.id} value={v.id}>{v.matricula}</option>)}</select></div>
          <div><label style={LB}>Data</label><input style={IN} type="date" value={f.data} onChange={e=>setF({...f,data:e.target.value})}/></div>
          <div><label style={LB}>Local / Posto</label><input style={IN} value={f.local} onChange={e=>setF({...f,local:e.target.value})} placeholder="Galp A1..."/></div>
        </div>
        <div style={G4}>
          <div><label style={LB}>Litros</label><input style={IN} type="number" value={f.litros} onChange={e=>setF({...f,litros:e.target.value})} placeholder="0"/></div>
          <div><label style={LB}>€ / Litro</label><input style={IN} type="number" step="0.001" value={f.preco} onChange={e=>setF({...f,preco:e.target.value})} placeholder="1.580"/></div>
          <div><label style={LB}>KM Marcador</label><input style={IN} type="number" value={f.km} onChange={e=>setF({...f,km:e.target.value})} placeholder="0"/></div>
          <div style={{display:"flex",alignItems:"flex-end"}}><button style={BA} onClick={add}>+ Adicionar</button></div>
        </div>
      </div>
      <div style={C}>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
            <Th cols={["Matrícula","Data","Local","Litros","€/L","Custo","KM"]}/>
            <tbody>
              {gas.map(g=>{
                const v=veic.find(x=>x.id===g.veiculoId);
                return (
                  <tr key={g.id}>
                    <td style={TD}><strong>{v?v.matricula:"—"}</strong></td>
                    <td style={TD}>{g.data}</td>
                    <td style={TD}>{g.local}</td>
                    <td style={TD}>{nv(g.litros).toFixed(0)} L</td>
                    <td style={TD}>€ {nv(g.preco).toFixed(3)}</td>
                    <td style={{...TD,color:or,fontWeight:600}}>{euro(g.custo)}</td>
                    <td style={TD}>{g.km?Number(g.km).toLocaleString("pt-PT")+" km":""}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function PgCust({veic,mots,man,port,conj}) {
  const[sel,setSel]=useState("");
  const[modo,setModo]=useState("conjunto");
  const[p,setP]=useState({du:"22",hd:"10",km:"8000",oc:"65",at:"1200",ar:"400",st:"350",sr:"120",li:"80",cl:"0.32",pc:"1.58",mv:"0.04",pn:"0.018",ab:"0.008"});

  function up(v) { setP(x=>({...x,...v})); }

  const c=useMemo(()=>{
    const du=nv(p.du), hd=nv(p.hd), km=nv(p.km)||1, oc=nv(p.oc);
    let ids=[], motora=null;
    if(modo==="conjunto"&&sel) {
      const s=conj.find(s=>s.id===Number(sel));
      if(s) {
        ids=[s.tratorId,s.reboqueId].filter(Boolean);
        const tr=veic.find(v=>v.id===s.tratorId);
        motora=tr?mots.find(d=>d.veiculoId===tr.id):null;
      }
    } else if(modo==="viatura"&&sel) {
      const v=veic.find(x=>x.id===Number(sel));
      if(v) { ids=[v.id]; motora=mots.find(d=>d.veiculoId===v.id); }
    }
    const mF=man.filter(m=>ids.includes(m.veiculoId)).reduce((s,m)=>s+nv(m.custo),0)/12;
    const portM=port.filter(p=>ids.includes(p.veiculoId)).reduce((s,p2)=>s+nv(p2.valor),0);
    const dC=drC(motora);
    const fix={amort:nv(p.at)+nv(p.ar),seg:nv(p.st)+nv(p.sr),lic:nv(p.li),mot:dC,mf:mF};
    const tFix=Object.values(fix).reduce((a,b)=>a+b,0);
    const vk={co:nv(p.cl)*nv(p.pc),po:portM>0?portM/km:0.04,mv:nv(p.mv),pn:nv(p.pn),ab:nv(p.ab)};
    const tVar=Object.values(vk).reduce((a,b)=>a+b,0);
    const hm=du*hd, kc=km*(oc/100), tm=tFix+tVar*km;
    const bars=[
      ["Amortização",fix.amort,"#60a5fa"],["Seguros",fix.seg,"#818cf8"],
      ["Motorista",fix.mot,gn],["Licenças",fix.lic,"#94a3b8"],["Manut. fixa",fix.mf,ac],
      ["Combustível",vk.co*km,or],["Portagens",vk.po*km,pu],
      ["Manut. var.",vk.mv*km,ac],["Pneus",vk.pn*km,"#94a3b8"],["AdBlue",vk.ab*km,"#6ee7b7"],
    ];
    return {tFix,tm,hm,kc,km,oc,cH:hm>0?tm/hm:0,cKV:km>0?tm/km:0,cKC:kc>0?tm/kc:0,bars};
  },[sel,modo,p,veic,mots,man,port,conj]);

  return (
    <div>
      <h2 style={{fontSize:28,fontWeight:900,margin:"0 0 4px"}}>Custos Base</h2>
      <p style={{fontSize:13,color:mu,marginBottom:20}}>Custo/hora vazio · Custo/km vazio · Custo/km carregado</p>
      <div style={{display:"flex",gap:12,marginBottom:16,flexWrap:"wrap"}}>
        <div>
          <label style={LB}>Calcular para</label>
          <select style={{...SE,width:"160px"}} value={modo} onChange={e=>{setModo(e.target.value);setSel("");}}>
            <option value="conjunto">Conjunto</option>
            <option value="viatura">Viatura</option>
          </select>
        </div>
        <div>
          <label style={LB}>{modo==="conjunto"?"Conjunto":"Viatura"}</label>
          <select style={{...SE,width:"220px"}} value={sel} onChange={e=>setSel(e.target.value)}>
            <option value="">-- selecionar --</option>
            {modo==="conjunto"
              ? conj.map(s=><option key={s.id} value={s.id}>{s.nome}</option>)
              : veic.filter(v=>v.tipo!=="reboque").map(v=><option key={v.id} value={v.id}>{v.matricula}</option>)
            }
          </select>
        </div>
      </div>
      <div style={G3}>
        <Lbl t={["Custo/hora vazio",euro(c.cH),"#ef4444","cada hora trabalhada"]}/>
        <Lbl t={["Custo/km vazio",euro(c.cKV),ac,"todos os km do ciclo"]}/>
        <Lbl t={["Custo/km carregado",euro(c.cKC),gn,"só km produtivos"]}/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
        <div style={C}>
          <div style={{fontWeight:800,fontSize:14,marginBottom:12}}>⚙️ Parâmetros</div>
          <div style={{fontSize:10,color:ac,textTransform:"uppercase",fontWeight:700,marginBottom:6}}>Operação Mensal</div>
          <div style={G2}>
            <div><label style={LB}>Dias úteis/mês</label><input style={IN} type="number" value={p.du} onChange={e=>up({du:e.target.value})}/></div>
            <div><label style={LB}>Horas/dia</label><input style={IN} type="number" value={p.hd} onChange={e=>up({hd:e.target.value})}/></div>
            <div><label style={LB}>KM/mês</label><input style={IN} type="number" value={p.km} onChange={e=>up({km:e.target.value})}/></div>
            <div><label style={LB}>Taxa Ocupação %</label><input style={IN} type="number" value={p.oc} onChange={e=>up({oc:e.target.value})}/></div>
          </div>
          <div style={{fontSize:10,color:ac,textTransform:"uppercase",fontWeight:700,margin:"10px 0 6px"}}>Custos Fixos (€/mês)</div>
          <div style={G2}>
            <div><label style={LB}>Amort. Trator</label><input style={IN} type="number" value={p.at} onChange={e=>up({at:e.target.value})}/></div>
            <div><label style={LB}>Amort. Reboque</label><input style={IN} type="number" value={p.ar} onChange={e=>up({ar:e.target.value})}/></div>
            <div><label style={LB}>Seguro Trator</label><input style={IN} type="number" value={p.st} onChange={e=>up({st:e.target.value})}/></div>
            <div><label style={LB}>Seguro Reboque</label><input style={IN} type="number" value={p.sr} onChange={e=>up({sr:e.target.value})}/></div>
            <div><label style={LB}>Licenças/Taxas</label><input style={IN} type="number" value={p.li} onChange={e=>up({li:e.target.value})}/></div>
          </div>
          <div style={{fontSize:10,color:ac,textTransform:"uppercase",fontWeight:700,margin:"10px 0 6px"}}>Variáveis (€/km)</div>
          <div style={G2}>
            <div><label style={LB}>Consumo (L/km)</label><input style={IN} type="number" step="0.01" value={p.cl} onChange={e=>up({cl:e.target.value})}/></div>
            <div><label style={LB}>Preço Comb. €/L</label><input style={IN} type="number" step="0.001" value={p.pc} onChange={e=>up({pc:e.target.value})}/></div>
            <div><label style={LB}>Manutenção var.</label><input style={IN} type="number" step="0.001" value={p.mv} onChange={e=>up({mv:e.target.value})}/></div>
            <div><label style={LB}>Pneus</label><input style={IN} type="number" step="0.001" value={p.pn} onChange={e=>up({pn:e.target.value})}/></div>
            <div><label style={LB}>AdBlue</label><input style={IN} type="number" step="0.001" value={p.ab} onChange={e=>up({ab:e.target.value})}/></div>
          </div>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <div style={C}>
            <div style={{fontWeight:800,fontSize:14,marginBottom:12}}>Estrutura Mensal — {euro(c.tm)}</div>
            {c.bars.map(([lb,vl,co])=>{
              const pp=c.tm>0?vl/c.tm:0;
              return (
                <div key={lb} style={{marginBottom:8}}>
                  <div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:2}}>
                    <span style={{color:mu}}>{lb}</span>
                    <span style={{fontWeight:600}}>{euro(vl)} <span style={{color:mu,fontWeight:400}}>({pct(pp)})</span></span>
                  </div>
                  <div style={{height:3,background:bd,borderRadius:99}}>
                    <div style={{height:3,width:`${pp*100}%`,background:co,borderRadius:99}}/>
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{background:"rgba(59,130,246,.05)",border:"1px solid rgba(59,130,246,.18)",borderRadius:10,padding:"14px 16px"}}>
            <div style={{fontSize:11,fontWeight:800,color:bl,textTransform:"uppercase",marginBottom:8}}>💡 Insights</div>
            <div style={{fontSize:12,color:mu,lineHeight:1.8}}>
              <div>📍 Preço mínimo/km: <strong style={{color:tx}}>{euro(c.cKC)}</strong></div>
              <div>⏱ Custo de paragem: <strong style={{color:tx}}>{euro(c.cH)}/h</strong></div>
              <div>📊 KM produtivos/mês: <strong style={{color:tx}}>{c.kc.toFixed(0)} km ({c.oc}%)</strong></div>
              <div>🔺 Custos fixos: <strong style={{color:tx}}>{pct(c.tm>0?c.tFix/c.tm:0)} do total</strong></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PgFret({fret,setFret}) {
  const e0={nome:"",cli:"",orig:"",dest:"",ki:"0",kv:"0",ti:"0",tv:"0",tc:"0",td2:"0",te:"0",cons:"0.32",pc:"1.58",pi:"0",pv:"0",outros:[],od:"",ov:"",preco:"0",ch:"0"};
  const[f,setF]=useState(e0);
  const[show,setShow]=useState(false);

  function up(v) { setF(x=>({...x,...v})); }

  const c=useMemo(()=>{
    const ki=nv(f.ki), kv=nv(f.kv), kmC=ki+kv;
    const hC=nv(f.ti)+nv(f.tv)+nv(f.tc)+nv(f.td2)+nv(f.te);
    const lt=kmC*nv(f.cons), cCo=lt*nv(f.pc);
    const cPo=nv(f.pi)+nv(f.pv);
    const cOu=(f.outros||[]).reduce((s,o)=>s+nv(o.v),0);
    const cFi=hC*nv(f.ch);
    const tot=cFi+cCo+cPo+cOu;
    const pr=nv(f.preco), mg=pr-tot, mgP=pr>0?mg/pr:0;
    return {kmC,ki,kv,hC,lt,cCo,cPo,cOu,cFi,tot,pr,mg,mgP,kP:ki>0?tot/ki:0,rH:hC>0?mg/hC:0,tImp:nv(f.tc)+nv(f.td2)+nv(f.te),pVaz:kmC>0?(kv/kmC)*100:0};
  },[f]);

  function save() {
    if(!f.nome.trim()||!nv(f.ki)) return;
    setFret(x=>[...x,{...f,...c,id:Date.now(),dt:new Date().toISOString().slice(0,10)}]);
    setF(e0);
    setShow(false);
  }

  function addO() {
    if(!f.od.trim()||!f.ov) return;
    up({outros:[...(f.outros||[]),{d:f.od,v:nv(f.ov)}],od:"",ov:""});
  }

  const ac2=c.mgP<0?rd:c.mgP<0.1?ac:gn;
  const tR=fret.reduce((s,fr)=>s+nv(fr.preco),0);
  const tC2=fret.reduce((s,fr)=>s+nv(fr.tot),0);
  const tM=fret.reduce((s,fr)=>s+nv(fr.mg),0);
  const roSt={background:s2,border:`1px solid ${bd}`,color:mu,borderRadius:7,padding:"8px 10px",fontSize:13,fontFamily:"inherit",outline:"none",width:"100%",boxSizing:"border-box"};

  return (
    <div>
      <h2 style={{fontSize:28,fontWeight:900,margin:"0 0 4px"}}>Custo de Frete</h2>
      <p style={{fontSize:13,color:mu,marginBottom:20}}>Calculadora de rentabilidade por viagem</p>
      {fret.length>0 && (
        <div style={G4}>
          <Lbl t={["Fretes",fret.length,bl]}/>
          <Lbl t={["Receita",euro(tR),gn]}/>
          <Lbl t={["Custo",euro(tC2),rd]}/>
          <Lbl t={["Margem",euro(tM),tM>=0?gn:rd]}/>
        </div>
      )}
      <button style={{...BA,marginBottom:18}} onClick={()=>setShow(x=>!x)}>
        {show?"✕ Fechar":"+ Novo Frete"}
      </button>
      {show && (
        <div style={C}>
          <div style={{fontWeight:900,fontSize:20,color:ac,marginBottom:14}}>CALCULADORA DE FRETE</div>
          <div style={{fontSize:11,color:bl,textTransform:"uppercase",fontWeight:800,marginBottom:8,paddingBottom:4,borderBottom:`1px solid ${s2}`}}>🏷️ Identificação</div>
          <div style={G3}>
            <div><label style={LB}>Nome do Frete</label><input style={IN} value={f.nome} onChange={e=>up({nome:e.target.value})} placeholder="Lisboa → Porto #1"/></div>
            <div><label style={LB}>Cliente</label><input style={IN} value={f.cli} onChange={e=>up({cli:e.target.value})} placeholder="Empresa XYZ"/></div>
          </div>
          <div style={G2}>
            <div><label style={LB}>Origem</label><input style={IN} value={f.orig} onChange={e=>up({orig:e.target.value})} placeholder="Lisboa"/></div>
            <div><label style={LB}>Destino</label><input style={IN} value={f.dest} onChange={e=>up({dest:e.target.value})} placeholder="Porto"/></div>
          </div>
          <div style={{fontSize:11,color:bl,textTransform:"uppercase",fontWeight:800,margin:"14px 0 8px",paddingBottom:4,borderBottom:`1px solid ${s2}`}}>📍 Distâncias (km)</div>
          <div style={G3}>
            <div><label style={LB}>KM Ida (carregado)</label><input style={IN} type="number" value={f.ki} onChange={e=>up({ki:e.target.value})}/></div>
            <div><label style={LB}>KM Volta (vazio)</label><input style={IN} type="number" value={f.kv} onChange={e=>up({kv:e.target.value})}/></div>
            <div><label style={LB}>Total Ciclo</label><input style={roSt} value={c.kmC+" km"} readOnly/></div>
          </div>
          <div style={{fontSize:11,color:bl,textTransform:"uppercase",fontWeight:800,margin:"14px 0 8px",paddingBottom:4,borderBottom:`1px solid ${s2}`}}>⏱ Tempos (horas — 1h30 = 1.5)</div>
          <div style={G3}>
            <div><label style={LB}>Viagem Ida</label><input style={IN} type="number" step="0.25" value={f.ti} onChange={e=>up({ti:e.target.value})}/></div>
            <div><label style={LB}>Viagem Volta</label><input style={IN} type="number" step="0.25" value={f.tv} onChange={e=>up({tv:e.target.value})}/></div>
            <div><label style={LB}>Tempo Carga</label><input style={IN} type="number" step="0.25" value={f.tc} onChange={e=>up({tc:e.target.value})}/></div>
          </div>
          <div style={G3}>
            <div><label style={LB}>Tempo Descarga</label><input style={IN} type="number" step="0.25" value={f.td2} onChange={e=>up({td2:e.target.value})}/></div>
            <div><label style={LB}>Esperas</label><input style={IN} type="number" step="0.25" value={f.te} onChange={e=>up({te:e.target.value})}/></div>
            <div><label style={LB}>Total Horas</label><input style={roSt} value={c.hC.toFixed(2)+" h"} readOnly/></div>
          </div>
          <div style={{fontSize:11,color:bl,textTransform:"uppercase",fontWeight:800,margin:"14px 0 8px",paddingBottom:4,borderBottom:`1px solid ${s2}`}}>⛽ Combustível</div>
          <div style={G3}>
            <div><label style={LB}>Consumo (L/km)</label><input style={IN} type="number" step="0.01" value={f.cons} onChange={e=>up({cons:e.target.value})}/></div>
            <div><label style={LB}>Preço/Litro (€)</label><input style={IN} type="number" step="0.001" value={f.pc} onChange={e=>up({pc:e.target.value})}/></div>
            <div><label style={LB}>Custo Combustível</label><input style={{...roSt,color:or}} value={euro(c.cCo)+"  ("+c.lt.toFixed(0)+" L)"} readOnly/></div>
          </div>
          <div style={{fontSize:11,color:bl,textTransform:"uppercase",fontWeight:800,margin:"14px 0 8px",paddingBottom:4,borderBottom:`1px solid ${s2}`}}>🛣️ Portagens</div>
          <div style={G3}>
            <div><label style={LB}>Portagens Ida (€)</label><input style={IN} type="number" step="0.01" value={f.pi} onChange={e=>up({pi:e.target.value})}/></div>
            <div><label style={LB}>Portagens Volta (€)</label><input style={IN} type="number" step="0.01" value={f.pv} onChange={e=>up({pv:e.target.value})}/></div>
            <div><label style={LB}>Total Portagens</label><input style={{...roSt,color:pu}} value={euro(c.cPo)} readOnly/></div>
          </div>
          <div style={{fontSize:11,color:bl,textTransform:"uppercase",fontWeight:800,margin:"14px 0 8px",paddingBottom:4,borderBottom:`1px solid ${s2}`}}>🏗️ Custos Fixos Imputados</div>
          <p style={{fontSize:11,color:mu,marginBottom:10}}>Use o "Custo/hora vazio" da página Custos Base.</p>
          <div style={G3}>
            <div><label style={LB}>Custo/Hora Vazio (€/h)</label><input style={IN} type="number" step="0.01" value={f.ch} onChange={e=>up({ch:e.target.value})} placeholder="0.00"/></div>
            <div><label style={LB}>Horas Ciclo</label><input style={roSt} value={c.hC.toFixed(2)+" h"} readOnly/></div>
            <div><label style={LB}>Fixo Imputado</label><input style={{...roSt,color:ac}} value={euro(c.cFi)} readOnly/></div>
          </div>
          <div style={{fontSize:11,color:bl,textTransform:"uppercase",fontWeight:800,margin:"14px 0 8px",paddingBottom:4,borderBottom:`1px solid ${s2}`}}>➕ Outros Custos</div>
          <div style={G3}>
            <div><label style={LB}>Descrição</label><input style={IN} value={f.od} onChange={e=>up({od:e.target.value})} placeholder="Diária motorista, ferry..."/></div>
            <div><label style={LB}>Valor (€)</label><input style={IN} type="number" step="0.01" value={f.ov} onChange={e=>up({ov:e.target.value})}/></div>
            <div style={{display:"flex",alignItems:"flex-end"}}><button style={{...BB,fontSize:12}} onClick={addO}>+ Add</button></div>
          </div>
          {(f.outros||[]).length>0 && (
            <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:12}}>
              {f.outros.map((o,i)=>(
                <div key={i} style={{background:s2,border:`1px solid ${bd}`,borderRadius:6,padding:"4px 10px",fontSize:12,display:"flex",gap:8,alignItems:"center"}}>
                  {o.d}: <strong>{euro(o.v)}</strong>
                  <span style={{cursor:"pointer",color:rd}} onClick={()=>up({outros:f.outros.filter((_,j)=>j!==i)})}>×</span>
                </div>
              ))}
            </div>
          )}
          <div style={{fontSize:11,color:bl,textTransform:"uppercase",fontWeight:800,margin:"14px 0 8px",paddingBottom:4,borderBottom:`1px solid ${s2}`}}>💶 Preço ao Cliente</div>
          <div style={G3}>
            <div><label style={LB}>Preço Cobrado (€)</label><input style={{...IN,color:gn,fontWeight:700,fontSize:16}} type="number" step="0.01" value={f.preco} onChange={e=>up({preco:e.target.value})}/></div>
            <div><label style={LB}>Custo Total</label><input style={{...roSt,color:rd,fontWeight:700}} value={euro(c.tot)} readOnly/></div>
            <div><label style={LB}>Margem</label><input style={{...roSt,color:ac2,fontWeight:700}} value={euro(c.mg)+"  ("+pct(c.mgP)+")"} readOnly/></div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,padding:14,background:bg,borderRadius:10,border:`1px solid ${bd}`,margin:"14px 0"}}>
            {[["Custo/km carregado",euro(c.kP),ac],["Rentabilidade/hora",euro(c.rH),c.rH>=0?gn:rd],["KM Ciclo",c.kmC+" km",bl],["Litros consumidos",c.lt.toFixed(0)+" L",or],["Total portagens",euro(c.cPo),pu],["Margem %",pct(c.mgP),ac2]].map(([lb,vl,co])=>(
              <div key={lb} style={{textAlign:"center"}}>
                <div style={{fontSize:9,color:mu,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:3}}>{lb}</div>
                <div style={{fontSize:20,fontWeight:900,color:co}}>{vl}</div>
              </div>
            ))}
          </div>
          <div style={{background:"rgba(59,130,246,.05)",border:"1px solid rgba(59,130,246,.18)",borderRadius:10,padding:"12px 14px",marginBottom:14}}>
            <div style={{fontSize:11,fontWeight:800,color:bl,textTransform:"uppercase",marginBottom:8}}>🔍 Análise</div>
            {c.mgP<0 && <div style={{fontSize:12,color:rd,marginBottom:4}}>⚠️ Frete a prejuízo! Preço mínimo: {euro(c.tot)}</div>}
            {c.mgP>=0 && c.mgP<0.1 && <div style={{fontSize:12,color:ac,marginBottom:4}}>⚠️ Margem baixa ({pct(c.mgP)}). Considere renegociar.</div>}
            {c.mgP>=0.1 && <div style={{fontSize:12,color:gn,marginBottom:4}}>✅ Margem saudável: {pct(c.mgP)}</div>}
            {c.kmC>0 && <div style={{fontSize:12,color:mu,marginBottom:4}}>🔄 Retorno vazio: <strong style={{color:tx}}>{c.pVaz.toFixed(1)}%</strong> dos km sem carga</div>}
            {c.hC>0 && <div style={{fontSize:12,color:mu}}>⏱ Tempo improdutivo: <strong style={{color:tx}}>{c.tImp.toFixed(1)}h</strong></div>}
          </div>
          <div style={{display:"flex",gap:10}}>
            <button style={BA} onClick={save}>💾 Guardar Frete</button>
            <button style={{...BB,fontSize:12}} onClick={()=>{setF(e0);setShow(false);}}>Cancelar</button>
          </div>
        </div>
      )}
      {fret.length>0 && (
        <div style={C}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
            <strong style={{fontSize:14}}>Histórico de Fretes</strong>
            <span style={{fontSize:12,color:mu}}>Margem média: <strong style={{color:tM>=0?gn:rd}}>{pct(tR>0?tM/tR:0)}</strong></span>
          </div>
          <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
              <Th cols={["Frete","Rota","km","h","Comb.","Port.","Custo","Preço","Margem","€/km"]}/>
              <tbody>
                {fret.map(fr=>(
                  <tr key={fr.id}>
                    <td style={TD}><strong>{fr.nome}</strong><br/><span style={{fontSize:10,color:mu}}>{fr.cli}</span></td>
                    <td style={TD}>{fr.orig} → {fr.dest}</td>
                    <td style={TD}>{nv(fr.kmC).toFixed(0)}</td>
                    <td style={TD}>{nv(fr.hC).toFixed(1)}</td>
                    <td style={{...TD,color:or}}>{euro(fr.cCo)}</td>
                    <td style={{...TD,color:pu}}>{euro(fr.cPo)}</td>
                    <td style={{...TD,color:rd,fontWeight:600}}>{euro(fr.tot)}</td>
                    <td style={{...TD,color:gn,fontWeight:600}}>{euro(fr.preco)}</td>
                    <td style={TD}><strong style={{color:nv(fr.mgP)<0?rd:nv(fr.mgP)<0.1?ac:gn}}>{euro(fr.mg)} ({pct(fr.mgP)})</strong></td>
                    <td style={TD}>{euro(fr.kP)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
