import { useState, useMemo, useEffect } from "react";
import { db } from "./firebase";
import { ref, get, set } from "firebase/database";

const bg="#0b0e14",sf="#13181f",s2="#1a2230",bd="#1e2d3d";
const ac="#e8a020",bl="#3b82f6",rd="#ef4444",gn="#22c55e",pu="#a78bfa",or="#fb923c";
const tx="#e2e8f0",mu="#64748b";

const euro=v=>"€ "+Number(v||0).toLocaleString("pt-PT",{minimumFractionDigits:2,maximumFractionDigits:2});
const pct=v=>(Number(v||0)*100).toFixed(1)+"%";
const nv=v=>parseFloat(String(v||"0").replace(",","."))||0;
const drC=d=>d?nv(d.salario)+nv(d.subRef)+nv(d.subTranp)+nv(d.seguro):0;

const V0=[
  {id:1,numEquip:"70030",matricula:"BG52ZE",tipo:"Trator",marca:"Volvo",modelo:"T FH750",ano:2024,tara:10247,pbTotal:44000,categoria:"T. Especial"},
  {id:2,numEquip:"5270",matricula:"AV-55672",tipo:"Porta-Máquinas",marca:"Invepe",modelo:"RPM 133",ano:2017,tara:12500,pbTotal:77200,categoria:"T. Especial"},
  {id:3,numEquip:"5269",matricula:"94-TA-46",tipo:"Trator",marca:"Volvo",modelo:"T FH 540",ano:2017,tara:10437,pbTotal:40000,categoria:"T. Especial"},
  {id:4,numEquip:"5204",matricula:"SE-1082",tipo:"Porta-Máquinas",marca:"A.R.B.",modelo:"SPM 3D/8,95",ano:2008,tara:8140,pbTotal:33500,categoria:"T. Especial"},
  {id:5,numEquip:"5380",matricula:"BE10MB",tipo:"Trator",marca:"Volvo",modelo:"FH 500",ano:2023,tara:7866,pbTotal:44000,categoria:"T. Especial"},
  {id:6,numEquip:"5115",matricula:"L-154494",tipo:"Porta-Máquinas",marca:"Kaiser",modelo:"S530 3F",ano:2000,tara:10600,pbTotal:33500,categoria:"T. Especial"},
  {id:7,numEquip:"70035",matricula:"92-81-PA",tipo:"Rígido Água",marca:"Volvo",modelo:"FM 7",ano:2000,tara:11700,pbTotal:26000,categoria:"T. Especial"},
  {id:8,numEquip:"5323",matricula:"29-15-ZF",tipo:"Rígido Cola",marca:"Volvo",modelo:"FM9",ano:2004,tara:10920,pbTotal:19000,categoria:"T. Especial"},
  {id:9,numEquip:"5245",matricula:"19-FT-63",tipo:"Rígido Cola",marca:"Iveco",modelo:"Eurocarga 220",ano:2008,tara:7060,pbTotal:12000,categoria:"T. Especial"},
  {id:10,numEquip:"5297",matricula:"25-ZO-44",tipo:"Carro Grua",marca:"Volvo",modelo:"FMX 500",ano:2019,tara:18484,pbTotal:32000,categoria:"T. Especial"},
  {id:11,numEquip:"5276",matricula:"L-190357",tipo:"Reboque-Estrado",marca:"Joluso",modelo:"RR-2D-6.5",ano:2009,tara:3290,pbTotal:18000,categoria:"T. Especial"},
  {id:12,numEquip:"5316",matricula:"AD27MD",tipo:"Carro Grua",marca:"Volvo",modelo:"FM 4 420",ano:2020,tara:17220,pbTotal:26000,categoria:"T. Especial"},
  {id:13,numEquip:"70028",matricula:"BH50VS",tipo:"Carro Grua",marca:"Volvo",modelo:"FMX 500",ano:2024,tara:23380,pbTotal:32000,categoria:"T. Especial"},
  {id:14,numEquip:"5122",matricula:"13-96-QP",tipo:"Rígido Cola",marca:"Volvo",modelo:"FL 10",ano:2000,tara:10300,pbTotal:19000,categoria:"T. Especial"},
  {id:15,numEquip:"5173",matricula:"77-56-AB",tipo:"Rígido Água",marca:"Mercedes",modelo:"26,29 K/38",ano:1992,tara:12680,pbTotal:26000,categoria:"T. Especial"},
  {id:16,numEquip:"5109",matricula:"12-92-OR",tipo:"Rígido Água",marca:"Mercedes",modelo:"Ategos 26,28 B",ano:1999,tara:11500,pbTotal:26000,categoria:"T. Especial"},
  {id:17,numEquip:"5368",matricula:"57-74-PF",tipo:"Rígido Água",marca:"Volvo",modelo:"FM 7",ano:2000,tara:12640,pbTotal:26000,categoria:"T. Especial"},
  {id:18,numEquip:"5211",matricula:"15-95-PE",tipo:"Rígido Cola",marca:"Volvo",modelo:"FM 7",ano:2000,tara:13520,pbTotal:26000,categoria:"T. Especial"},
  {id:19,numEquip:"5104",matricula:"39-70-OE",tipo:"Rígido Cola",marca:"Mercedes",modelo:"Ategos 26.28 B",ano:1999,tara:11600,pbTotal:26000,categoria:"T. Especial"},
  {id:20,numEquip:"5254",matricula:"L-130016",tipo:"Reboque-Estrado",marca:"Fruehauf",modelo:"EBP",ano:1996,tara:5200,pbTotal:33500,categoria:"T. Especial"},
  {id:21,numEquip:"844",matricula:"P-81998",tipo:"Porta-Sílos",marca:"Lecinena",modelo:"2E-RD",ano:2001,tara:4650,pbTotal:29000,categoria:"T. Especial"},
  {id:22,numEquip:"875",matricula:"L-37858",tipo:"Estrado",marca:"Metalofabril",modelo:"SR2",ano:1976,tara:5380,pbTotal:30550,categoria:"T. Especial"},
  {id:23,numEquip:"876",matricula:"L-155299",tipo:"Estrado",marca:"Montenegro",modelo:"SPL 3S 13.62",ano:2001,tara:7000,pbTotal:34000,categoria:"T. Especial"},
  {id:24,numEquip:"877",matricula:"L-137878",tipo:"Porta-Máquinas",marca:"Carsul",modelo:"12,0-PM-BED",ano:1998,tara:8930,pbTotal:34420,categoria:"T. Especial"},
  {id:25,numEquip:"40142",matricula:"L-219995",tipo:"Semi-Reboque",marca:"Galucho",modelo:"SBG3",ano:2025,tara:7300,pbTotal:38000,categoria:"T. Basculantes"},
  {id:26,numEquip:"5381",matricula:"BE11MB",tipo:"Trator",marca:"Volvo",modelo:"FH 500",ano:2023,tara:7866,pbTotal:44000,categoria:"T. Basculantes"},
  {id:27,numEquip:"5330",matricula:"L-209506",tipo:"Semi-Reboque",marca:"Galucho",modelo:"SGB3",ano:2021,tara:14000,pbTotal:41000,categoria:"T. Basculantes"},
  {id:28,numEquip:"5379",matricula:"BE09MB",tipo:"Trator",marca:"Volvo",modelo:"FH 500",ano:2023,tara:7866,pbTotal:44000,categoria:"T. Basculantes"},
  {id:29,numEquip:"40143",matricula:"L-219996",tipo:"Semi-Reboque",marca:"Galucho",modelo:"SGB3",ano:2025,tara:7100,pbTotal:41000,categoria:"T. Basculantes"},
  {id:30,numEquip:"5378",matricula:"BE08MB",tipo:"Trator",marca:"Volvo",modelo:"FH 500",ano:2023,tara:7866,pbTotal:44000,categoria:"T. Basculantes"},
  {id:31,numEquip:"40144",matricula:"L-219997",tipo:"Semi-Reboque",marca:"Galucho",modelo:"SGB3",ano:2025,tara:7100,pbTotal:41000,categoria:"T. Basculantes"},
  {id:32,numEquip:"5258",matricula:"44-QI-50",tipo:"Trator",marca:"Volvo",modelo:"T FH-38",ano:2015,tara:8230,pbTotal:40000,categoria:"T. Basculantes"},
  {id:33,numEquip:"5303",matricula:"L-207078",tipo:"Semi-Reboque",marca:"Galucho",modelo:"SGB3",ano:2020,tara:7020,pbTotal:41000,categoria:"T. Basculantes"},
  {id:34,numEquip:"5295",matricula:"25-ZO-41",tipo:"Trator",marca:"Volvo",modelo:"FH D13K",ano:2019,tara:8358,pbTotal:44000,categoria:"T. Basculantes"},
  {id:35,numEquip:"70029",matricula:"L-215831",tipo:"Semi-Reboque",marca:"Galucho",modelo:"SGB3",ano:2024,tara:7100,pbTotal:41000,categoria:"T. Basculantes"},
  {id:36,numEquip:"5259",matricula:"44-QI-51",tipo:"Trator",marca:"Volvo",modelo:"T FH-38",ano:2015,tara:8230,pbTotal:40000,categoria:"T. Basculantes"},
  {id:37,numEquip:"5269",matricula:"25-ZO-49",tipo:"Trator",marca:"Volvo",modelo:"FH D13K",ano:2019,tara:8358,pbTotal:44000,categoria:"T. Basculantes"},
  {id:38,numEquip:"5337",matricula:"L-210305",tipo:"Semi-Reboque",marca:"Galucho",modelo:"SGB3",ano:2021,tara:14000,pbTotal:38000,categoria:"T. Basculantes"},
  {id:39,numEquip:"70259",matricula:"74-TC-56",tipo:"Trator",marca:"Volvo",modelo:"T FH",ano:2017,tara:8103,pbTotal:40000,categoria:"T. Basculantes"},
  {id:40,numEquip:"5302",matricula:"L-207077",tipo:"Semi-Reboque",marca:"Galucho",modelo:"SGB3",ano:2020,tara:7020,pbTotal:34000,categoria:"T. Basculantes"},
  {id:41,numEquip:"5348",matricula:"AN90AV",tipo:"Basculante Rígido",marca:"Volvo",modelo:"FMX 460",ano:2021,tara:15040,pbTotal:32000,categoria:"T. Basculantes"},
  {id:42,numEquip:"70024",matricula:"BG56ZE",tipo:"Basculante Rígido",marca:"Volvo",modelo:"FMX 460",ano:2024,tara:10660,pbTotal:32000,categoria:"T. Basculantes"},
  {id:43,numEquip:"5298",matricula:"25-ZO-42",tipo:"Basculante Rígido",marca:"Volvo",modelo:"FMX 460",ano:2019,tara:10642,pbTotal:32000,categoria:"T. Basculantes"},
  {id:44,numEquip:"70027",matricula:"BG53ZE",tipo:"Basculante Rígido",marca:"Volvo",modelo:"FMX 460",ano:2024,tara:10660,pbTotal:32000,categoria:"T. Basculantes"},
  {id:45,numEquip:"70025",matricula:"BG55ZE",tipo:"Basculante Rígido",marca:"Volvo",modelo:"FMX 460",ano:2024,tara:10660,pbTotal:32000,categoria:"T. Basculantes"},
  {id:46,numEquip:"70023",matricula:"BG51ZE",tipo:"Basculante Rígido",marca:"Volvo",modelo:"FMX 460",ano:2024,tara:15020,pbTotal:32000,categoria:"T. Basculantes"},
  {id:47,numEquip:"70026",matricula:"BG54ZE",tipo:"Basculante Rígido",marca:"Volvo",modelo:"FMX 460",ano:2024,tara:10660,pbTotal:32000,categoria:"T. Basculantes"},
  {id:48,numEquip:"5347",matricula:"AN87AV",tipo:"Basculante Rígido",marca:"Volvo",modelo:"FMX 460",ano:2021,tara:15040,pbTotal:32000,categoria:"T. Basculantes"},
  {id:49,numEquip:"5206",matricula:"42-FF-75",tipo:"Basculante Rígido",marca:"Volvo",modelo:"FM 13",ano:2008,tara:14520,pbTotal:32000,categoria:"T. Basculantes"},
  {id:50,numEquip:"5299",matricula:"25-ZO-51",tipo:"Basculante Rígido",marca:"Volvo",modelo:"FMX 460",ano:2019,tara:15020,pbTotal:32000,categoria:"T. Basculantes"},
  {id:51,numEquip:"5205",matricula:"42-FF-74",tipo:"Basculante Rígido",marca:"Volvo",modelo:"FM 13",ano:2008,tara:14520,pbTotal:32000,categoria:"T. Basculantes"},
  {id:52,numEquip:"70022",matricula:"BG50ZE",tipo:"Basculante Rígido",marca:"Volvo",modelo:"FMX 380",ano:2024,tara:13120,pbTotal:26000,categoria:"T. Basculantes"},
  {id:53,numEquip:"70021",matricula:"BG57ZE",tipo:"Basculante Rígido",marca:"Volvo",modelo:"FMX 380",ano:2024,tara:13120,pbTotal:26000,categoria:"T. Basculantes"},
  {id:54,numEquip:"5194",matricula:"24-FA-85",tipo:"Basculante Rígido",marca:"Volvo",modelo:"FM 9",ano:2007,tara:12700,pbTotal:26000,categoria:"T. Basculantes"},
  {id:55,numEquip:"5195",matricula:"24-FA-86",tipo:"Basculante Rígido",marca:"Volvo",modelo:"FM 9",ano:2007,tara:12850,pbTotal:26000,categoria:"T. Basculantes"},
  {id:56,numEquip:"5196",matricula:"24-FA-87",tipo:"Basculante Rígido",marca:"Volvo",modelo:"FM 9",ano:2007,tara:12700,pbTotal:26000,categoria:"T. Basculantes"},
  {id:57,numEquip:"5197",matricula:"24-FA-88",tipo:"Basculante Rígido",marca:"Volvo",modelo:"FM 9",ano:2007,tara:12850,pbTotal:26000,categoria:"T. Basculantes"},
  {id:58,numEquip:"5106",matricula:"28-58-OJ",tipo:"Basculante Rígido",marca:"Volvo",modelo:"FL 10",ano:1999,tara:12480,pbTotal:31500,categoria:"T. Basculantes"},
  {id:59,numEquip:"867",matricula:"AJ50GD",tipo:"Trator",marca:"MAN",modelo:"TGS 18.430",ano:2021,tara:7705,pbTotal:44000,categoria:"T. Basculantes"},
  {id:60,numEquip:"862",matricula:"L-209374",tipo:"Semi-Reboque",marca:"Galucho",modelo:"SGB3",ano:2021,tara:7100,pbTotal:41000,categoria:"T. Basculantes"},
  {id:61,numEquip:"864",matricula:"AJ-48-BP",tipo:"Trator",marca:"Volvo",modelo:"TGS 18,430",ano:2021,tara:7705,pbTotal:44000,categoria:"T. Basculantes"},
  {id:62,numEquip:"848",matricula:"L-188051",tipo:"Semi-Reboque",marca:"INVEPE",modelo:"BAS 8 AL",ano:2008,tara:5360,pbTotal:33500,categoria:"T. Basculantes"},
  {id:63,numEquip:"866",matricula:"AJ-50-BP",tipo:"Trator",marca:"MAN",modelo:"TGS 18.430",ano:2021,tara:7706,pbTotal:44000,categoria:"T. Basculantes"},
  {id:64,numEquip:"40145",matricula:"L-219998",tipo:"Semi-Reboque",marca:"MAN",modelo:"SGB3",ano:2025,tara:7100,pbTotal:38000,categoria:"T. Basculantes"},
  {id:65,numEquip:"891",matricula:"BA-61-UH",tipo:"Trator",marca:"MAN",modelo:"TGS 18.470",ano:2023,tara:7611,pbTotal:44000,categoria:"T. Basculantes"},
  {id:66,numEquip:"873",matricula:"L-159175",tipo:"Semi-Reboque",marca:"Basben",modelo:"SB20SM",ano:2001,tara:4700,pbTotal:31500,categoria:"T. Basculantes"},
  {id:67,numEquip:"896",matricula:"L-198571",tipo:"Semi-Reboque",marca:"Invepe",modelo:"SR3",ano:2015,tara:0,pbTotal:0,categoria:"T. Basculantes"},
  {id:68,numEquip:"892",matricula:"BB-06-OD",tipo:"Trator",marca:"MAN",modelo:"TGS 18.430",ano:2023,tara:7611,pbTotal:44000,categoria:"T. Basculantes"},
  {id:69,numEquip:"40146",matricula:"L-219999",tipo:"Semi-Reboque",marca:"Galucho",modelo:"SGB 3",ano:2025,tara:7100,pbTotal:41000,categoria:"T. Basculantes"},
  {id:70,numEquip:"893",matricula:"BD-87-AZ",tipo:"Trator",marca:"MAN",modelo:"TGS 18.430",ano:2023,tara:7616,pbTotal:44000,categoria:"T. Basculantes"},
  {id:71,numEquip:"861",matricula:"L-209373",tipo:"Semi-Reboque",marca:"Galucho",modelo:"SGB 3",ano:2021,tara:14000,pbTotal:41000,categoria:"T. Basculantes"},
  {id:72,numEquip:"865",matricula:"AJ-49-BP",tipo:"Trator",marca:"MAN",modelo:"TFS 18.430",ano:2021,tara:7706,pbTotal:44000,categoria:"T. Basculantes"},
  {id:73,numEquip:"863",matricula:"L-209375",tipo:"Semi-Reboque",marca:"Galucho",modelo:"SGB 3",ano:2021,tara:14000,pbTotal:41000,categoria:"T. Basculantes"},
  {id:74,numEquip:"868",matricula:"AJ-15-MG",tipo:"Trator",marca:"MAN",modelo:"TGS 18.430",ano:2021,tara:7706,pbTotal:44000,categoria:"T. Basculantes"},
  {id:75,numEquip:"860",matricula:"L-198570",tipo:"Semi-Reboque",marca:"INVEPE",modelo:"SR3",ano:2015,tara:6000,pbTotal:36000,categoria:"T. Basculantes"},
  {id:76,numEquip:"849",matricula:"L-188158",tipo:"Semi-Reboque",marca:"Invepe",modelo:"BAS 8 AL",ano:2008,tara:5360,pbTotal:33500,categoria:"T. Basculantes"},
  {id:77,numEquip:"870",matricula:"L-183985",tipo:"Semi-Reboque",marca:"MONTENEGRO",modelo:"SVF-2G-18AE",ano:2007,tara:5650,pbTotal:31000,categoria:"T. Basculantes"},
  {id:78,numEquip:"70109",matricula:"L-215832",tipo:"Semi-Reboque",marca:"Galucho",modelo:"SGB3",ano:2024,tara:7300,pbTotal:38000,categoria:"T. Basculantes"},
  {id:79,numEquip:"5331",matricula:"L-209507",tipo:"Semi-Reboque",marca:"Galucho",modelo:"SGB3",ano:2021,tara:14000,pbTotal:38000,categoria:"T. Basculantes"},
  {id:80,numEquip:"894",matricula:"L-183989",tipo:"Semi-Reboque",marca:"MONTENEGRO",modelo:"SVF-2G-18AE",ano:2007,tara:5650,pbTotal:31000,categoria:"T. Basculantes"},
  {id:81,numEquip:"856",matricula:"25-ZO-43",tipo:"Trator",marca:"VOLVO",modelo:"T FH",ano:2019,tara:8055,pbTotal:44000,categoria:"T. Cisternas"},
  {id:82,numEquip:"815",matricula:"L-170277",tipo:"Cisterna",marca:"Hermans",modelo:"S AL 2C 31 T",ano:2004,tara:4970,pbTotal:34000,categoria:"T. Cisternas"},
  {id:83,numEquip:"858",matricula:"75-ZS-76",tipo:"Trator",marca:"MAN",modelo:"TGX 18.510",ano:2020,tara:8406,pbTotal:44000,categoria:"T. Cisternas"},
  {id:84,numEquip:"818",matricula:"L-174917",tipo:"Cisterna",marca:"HERMANNS",modelo:"Chosal S AL 2C",ano:2005,tara:4970,pbTotal:34000,categoria:"T. Cisternas"},
  {id:85,numEquip:"859",matricula:"75-ZS-77",tipo:"Trator",marca:"MAN",modelo:"TGX 18.510",ano:2020,tara:8406,pbTotal:44000,categoria:"T. Cisternas"},
  {id:86,numEquip:"836",matricula:"SE-1144",tipo:"Cisterna",marca:"Omeps",modelo:"S 122",ano:2008,tara:3350,pbTotal:30000,categoria:"T. Cisternas"},
  {id:87,numEquip:"881",matricula:"AT-05-RJ",tipo:"Trator",marca:"MAN",modelo:"TGX 18.510",ano:2022,tara:8098,pbTotal:44000,categoria:"T. Cisternas"},
  {id:88,numEquip:"841",matricula:"SE-1349",tipo:"Cisterna",marca:"Hermanns",modelo:"Chosal S-AL-2C",ano:2008,tara:5640,pbTotal:34000,categoria:"T. Cisternas"},
  {id:89,numEquip:"857",matricula:"25-ZO-46",tipo:"Trator",marca:"Volvo",modelo:"T FH",ano:2019,tara:8055,pbTotal:44000,categoria:"T. Cisternas"},
  {id:90,numEquip:"845",matricula:"SE-2067",tipo:"Cisterna",marca:"Hermans",modelo:"SALB 42",ano:2010,tara:6550,pbTotal:34000,categoria:"T. Cisternas"},
  {id:91,numEquip:"883",matricula:"AT-07-RJ",tipo:"Trator",marca:"MAN",modelo:"TGX 18.510",ano:2022,tara:8098,pbTotal:44000,categoria:"T. Cisternas"},
  {id:92,numEquip:"854",matricula:"LE - 2306",tipo:"Cisterna",marca:"Kassbohrer",modelo:"K.SSK40",ano:2017,tara:5800,pbTotal:36000,categoria:"T. Cisternas"},
  {id:93,numEquip:"884",matricula:"AT-08-RJ",tipo:"Trator",marca:"MAN",modelo:"TGX 18.510",ano:2022,tara:8098,pbTotal:44000,categoria:"T. Cisternas"},
  {id:94,numEquip:"834",matricula:"SE-992",tipo:"Cisterna",marca:"HERMANNS",modelo:"S-AL-2C-31-T",ano:2008,tara:5640,pbTotal:34000,categoria:"T. Cisternas"},
  {id:95,numEquip:"885",matricula:"AT-54-JF",tipo:"Trator",marca:"MAN",modelo:"TGX 18.510",ano:2022,tara:8093,pbTotal:44000,categoria:"T. Cisternas"},
  {id:96,numEquip:"832",matricula:"SE-916",tipo:"Cisterna",marca:"Hermans",modelo:"S-AL-2C-33-T",ano:2008,tara:5810,pbTotal:34000,categoria:"T. Cisternas"},
  {id:97,numEquip:"886",matricula:"AT-55-JF",tipo:"Trator",marca:"MAN",modelo:"TGX 18.510",ano:2022,tara:8093,pbTotal:44000,categoria:"T. Cisternas"},
  {id:98,numEquip:"839",matricula:"SE-1347",tipo:"Cisterna",marca:"HERMANNS",modelo:"S-AL-2C-31-T",ano:2008,tara:5640,pbTotal:34000,categoria:"T. Cisternas"},
  {id:99,numEquip:"887",matricula:"AT-57-JF",tipo:"Trator",marca:"MAN",modelo:"TGX 18.510",ano:2022,tara:8093,pbTotal:44000,categoria:"T. Cisternas"},
  {id:100,numEquip:"855",matricula:"LE - 3158",tipo:"Cisterna",marca:"Kassbohrer",modelo:"K.SSK40",ano:2019,tara:5590,pbTotal:36000,categoria:"T. Cisternas"},
  {id:101,numEquip:"888",matricula:"AT-59-JF",tipo:"Trator",marca:"MAN",modelo:"TGX 18.510",ano:2022,tara:8098,pbTotal:44000,categoria:"T. Cisternas"},
  {id:102,numEquip:"829",matricula:"SE-886",tipo:"Cisterna",marca:"Hermans",modelo:"S-AL-2C-31-T",ano:2008,tara:4970,pbTotal:34000,categoria:"T. Cisternas"},
  {id:103,numEquip:"889",matricula:"AT-60-JF",tipo:"Trator",marca:"MAN",modelo:"TGX 18.510",ano:2022,tara:8093,pbTotal:44000,categoria:"T. Cisternas"},
  {id:104,numEquip:"825",matricula:"L-183518",tipo:"Cisterna",marca:"Hermans",modelo:"S-AL-2C-33-T",ano:2007,tara:5640,pbTotal:34000,categoria:"T. Cisternas"},
  {id:105,numEquip:"890",matricula:"AU-01-EM",tipo:"Trator",marca:"MAN",modelo:"TGX 18.510",ano:2022,tara:8098,pbTotal:44000,categoria:"T. Cisternas"},
  {id:106,numEquip:"830",matricula:"SE-906",tipo:"Cisterna",marca:"Hermans",modelo:"S-AL-2C-33-T",ano:2008,tara:5810,pbTotal:34000,categoria:"T. Cisternas"},
  {id:107,numEquip:"852",matricula:"74TC55",tipo:"Trator",marca:"MAN",modelo:"F TH",ano:2017,tara:8103,pbTotal:40000,categoria:"T. Cisternas"},
  {id:108,numEquip:"882",matricula:"AT06RJ",tipo:"Trator",marca:"MAN",modelo:"TGX 18.510",ano:2022,tara:8098,pbTotal:0,categoria:"T. Cisternas"},
];
const D0=[
  {id:1, nome:"Vitor Januário",      salario:0,subRef:0,subTranp:0,seguro:0,veiculoId:1,  ativo:true},
  {id:2, nome:"Amilcar Carreira",    salario:0,subRef:0,subTranp:0,seguro:0,veiculoId:3,  ativo:true},
  {id:3, nome:"David Nunes",         salario:0,subRef:0,subTranp:0,seguro:0,veiculoId:5,  ativo:true},
  {id:4, nome:"Agostinho Louro",     salario:0,subRef:0,subTranp:0,seguro:0,veiculoId:26, ativo:true},
  {id:5, nome:"Nuno Amaro",          salario:0,subRef:0,subTranp:0,seguro:0,veiculoId:28, ativo:true},
  {id:6, nome:"Carmino Calixto",     salario:0,subRef:0,subTranp:0,seguro:0,veiculoId:30, ativo:true},
  {id:7, nome:"Bernardo Fale",       salario:0,subRef:0,subTranp:0,seguro:0,veiculoId:36, ativo:true},
  {id:8, nome:"Celso Cristo",        salario:0,subRef:0,subTranp:0,seguro:0,veiculoId:34, ativo:true},
  {id:9, nome:"João Maximiano",      salario:0,subRef:0,subTranp:0,seguro:0,veiculoId:37, ativo:true},
  {id:10,nome:"Francisco Leitão",    salario:0,subRef:0,subTranp:0,seguro:0,veiculoId:39, ativo:true},
  {id:11,nome:"João Almeida",        salario:0,subRef:0,subTranp:0,seguro:0,veiculoId:41, ativo:true},
  {id:12,nome:"José Miguel Ferreira",salario:0,subRef:0,subTranp:0,seguro:0,veiculoId:43, ativo:true},
  {id:13,nome:"Andressa Oliveira",   salario:0,subRef:0,subTranp:0,seguro:0,veiculoId:45, ativo:true},
  {id:14,nome:"Pedro Henriques",     salario:0,subRef:0,subTranp:0,seguro:0,veiculoId:46, ativo:true},
  {id:15,nome:"Tó Luis",             salario:0,subRef:0,subTranp:0,seguro:0,veiculoId:48, ativo:true},
  {id:16,nome:"Luis Bernardo",       salario:0,subRef:0,subTranp:0,seguro:0,veiculoId:53, ativo:true},
  {id:17,nome:"Adriano Machado",     salario:0,subRef:0,subTranp:0,seguro:0,veiculoId:50, ativo:true},
  {id:18,nome:"Carlos Cerejo",       salario:0,subRef:0,subTranp:0,seguro:0,veiculoId:42, ativo:true},
  {id:19,nome:"Mário Gomes",         salario:0,subRef:0,subTranp:0,seguro:0,veiculoId:44, ativo:true},
  {id:20,nome:"Cátia Romão",         salario:0,subRef:0,subTranp:0,seguro:0,veiculoId:52, ativo:true},
  {id:21,nome:"Rúben Ferreira",      salario:0,subRef:0,subTranp:0,seguro:0,veiculoId:51, ativo:true},
  {id:22,nome:"Alex",                salario:0,subRef:0,subTranp:0,seguro:0,veiculoId:55, ativo:true},
  {id:23,nome:"José Pascoal",        salario:0,subRef:0,subTranp:0,seguro:0,veiculoId:19, ativo:true},
  {id:24,nome:"Paulo Fritz",         salario:0,subRef:0,subTranp:0,seguro:0,veiculoId:8,  ativo:true},
  {id:25,nome:"Tiago Faria",         salario:0,subRef:0,subTranp:0,seguro:0,veiculoId:9,  ativo:true},
  {id:26,nome:"Adriano Sousa",       salario:0,subRef:0,subTranp:0,seguro:0,veiculoId:10, ativo:true},
  {id:27,nome:"José Pereira",        salario:0,subRef:0,subTranp:0,seguro:0,veiculoId:12, ativo:true},
  {id:28,nome:"Ricardo Machado",     salario:0,subRef:0,subTranp:0,seguro:0,veiculoId:13, ativo:true},
];
const M0=[];
const T0=[];
const G0=[];
const S0=[];

const CUSTOS2026=[
  {ne:"5173",mat:"77-56-AB",port:37.23,seg:163.88,fin:0,amort:0,rep:717.07,out:576.23,gas:238.14,tot:1732.55,mes:433.14,h:2.1876},
  {ne:"5106",mat:"28-58-OJ",port:11.78,seg:193.55,fin:0,amort:266.67,rep:3466.71,out:53.23,gas:594.22,tot:4586.16,mes:1146.54,h:5.7906},
  {ne:"5109",mat:"12-92-OR",port:144.91,seg:163.88,fin:0,amort:0,rep:1232.6,out:0,gas:105.27,tot:1646.66,mes:411.67,h:2.0791},
  {ne:"5122",mat:"13-96-QP",port:151.6,seg:163.88,fin:0,amort:0,rep:318.5,out:0,gas:1765.43,tot:2399.41,mes:599.85,h:3.0296},
  {ne:"5128",mat:"13-97-SX",port:9.44,seg:163.88,fin:0,amort:0,rep:92.36,out:213.0,gas:115.28,tot:593.96,mes:148.49,h:0.7499},
  {ne:"5258",mat:"44-QI-50",port:393.92,seg:328.34,fin:0,amort:0,rep:3474.86,out:0,gas:9147.67,tot:13344.79,mes:3336.2,h:16.8495},
  {ne:"5259",mat:"44-QI-51",port:368.21,seg:328.34,fin:0,amort:0,rep:2694.9,out:0,gas:5034.97,tot:8426.42,mes:2106.61,h:10.6394},
  {ne:"5269",mat:"94-TA-46",port:1674.64,seg:355.36,fin:0,amort:345.21,rep:1278.54,out:75.0,gas:13587.24,tot:17315.99,mes:4329.0,h:21.8636},
  {ne:"5295",mat:"25-ZO-41",port:167.69,seg:388.53,fin:0,amort:0,rep:2184.61,out:0,gas:10944.11,tot:13684.94,mes:3421.24,h:17.279},
  {ne:"5296",mat:"25-ZO-49",port:308.65,seg:388.53,fin:0,amort:0,rep:1853.56,out:0,gas:11195.95,tot:13746.69,mes:3436.67,h:17.3569},
  {ne:"5297",mat:"25-ZO-44",port:591.43,seg:1302.86,fin:0,amort:0,rep:349.78,out:0,gas:2760.93,tot:5005.0,mes:1251.25,h:6.3194},
  {ne:"5298",mat:"25-ZO-42",port:633.85,seg:1090.07,fin:0,amort:0,rep:4601.13,out:0,gas:9544.29,tot:15869.34,mes:3967.34,h:20.037},
  {ne:"5299",mat:"25-ZO-51",port:335.36,seg:1090.07,fin:0,amort:0,rep:563.97,out:0,gas:12711.78,tot:14701.18,mes:3675.3,h:18.5621},
  {ne:"5194",mat:"24-FA-85",port:290.98,seg:238.68,fin:0,amort:0,rep:3219.65,out:0,gas:8327.27,tot:12076.58,mes:3019.14,h:15.2482},
  {ne:"5195",mat:"24-FA-86",port:330.15,seg:238.68,fin:0,amort:0,rep:16468.07,out:0,gas:3510.86,tot:20547.76,mes:5136.94,h:25.9441},
  {ne:"5196",mat:"24-FA-87",port:102.76,seg:238.68,fin:0,amort:0,rep:3560.47,out:0,gas:2860.26,tot:6762.17,mes:1690.54,h:8.5381},
  {ne:"5197",mat:"24-FA-88",port:896.05,seg:814.21,fin:220.31,amort:2433.33,rep:6790.35,out:7.64,gas:8467.84,tot:19629.73,mes:4907.43,h:24.785},
  {ne:"5205",mat:"42-FF-74",port:102.64,seg:235.19,fin:0,amort:0,rep:5548.8,out:367.23,gas:4633.76,tot:10887.62,mes:2721.91,h:13.747},
  {ne:"5206",mat:"42-FF-75",port:146.86,seg:235.19,fin:0,amort:0,rep:2938.86,out:314.0,gas:7402.34,tot:11037.25,mes:2759.31,h:13.9359},
  {ne:"5211",mat:"15-95-PE",port:444.98,seg:163.88,fin:0,amort:0,rep:2388.02,out:207.59,gas:3493.47,tot:6697.94,mes:1674.48,h:8.457},
  {ne:"5245",mat:"19-FT-63",port:37.19,seg:163.88,fin:0,amort:0,rep:7732.41,out:0,gas:367.31,tot:8300.79,mes:2075.2,h:10.4808},
  {ne:"5323",mat:"29-15-ZF",port:48.56,seg:942.05,fin:0,amort:1706.35,rep:2712.07,out:0,gas:938.23,tot:6347.26,mes:1586.82,h:8.0142},
  {ne:"70026",mat:"BG54ZE",port:130.21,seg:1283.98,fin:834.16,amort:10553.51,rep:782.8,out:314.0,gas:1536.72,tot:15435.38,mes:3858.84,h:19.4891},
  {ne:"70027",mat:"BG53ZE",port:250.1,seg:1283.98,fin:1541.74,amort:10553.51,rep:782.43,out:314.0,gas:11925.72,tot:26651.48,mes:6662.87,h:33.6509},
  {ne:"70028",mat:"BH50VS",port:1046.75,seg:1824.29,fin:1385.63,amort:10071.01,rep:364.8,out:434.59,gas:10439.85,tot:25566.92,mes:6391.73,h:32.2815},
  {ne:"70030",mat:"BG52ZE",port:2074.18,seg:939.52,fin:933.81,amort:10455.91,rep:3548.7,out:220.0,gas:30154.31,tot:48326.43,mes:12081.61,h:61.0182},
  {ne:"70035",mat:"92-81-PA",port:0,seg:731.43,fin:198.48,amort:2766.67,rep:2367.4,out:177.28,gas:3659.54,tot:9900.8,mes:2475.2,h:12.501},
  {ne:"70021",mat:"BG57ZE",port:106.26,seg:1185.26,fin:126.57,amort:9581.5,rep:2965.0,out:324.0,gas:3246.95,tot:17535.54,mes:4383.89,h:22.1408},
  {ne:"70022",mat:"BG50ZE",port:311.67,seg:1185.26,fin:1402.57,amort:9581.5,rep:62.89,out:0,gas:8895.84,tot:21439.73,mes:5359.93,h:27.0704},
  {ne:"70023",mat:"BG51ZE",port:201.35,seg:1283.98,fin:126.56,amort:10553.51,rep:7384.0,out:314.0,gas:10809.12,tot:30672.52,mes:7668.13,h:38.7279},
  {ne:"70024",mat:"BG56ZE",port:220.55,seg:1099.26,fin:126.55,amort:10553.51,rep:1935.31,out:314.0,gas:9832.81,tot:24081.99,mes:6020.5,h:30.4066},
  {ne:"70025",mat:"BG55ZE",port:226.94,seg:1283.98,fin:1541.74,amort:10553.51,rep:0,out:314.0,gas:10538.9,tot:24459.07,mes:6114.77,h:30.8827},
  {ne:"5378",mat:"BE08MB",port:368.05,seg:762.3,fin:635.18,amort:8020.8,rep:273.76,out:0,gas:11077.6,tot:21137.69,mes:5284.42,h:26.689},
  {ne:"5379",mat:"BE09MB",port:444.34,seg:762.3,fin:644.33,amort:8020.8,rep:2502.98,out:0,gas:11368.31,tot:23743.06,mes:5935.77,h:29.9786},
  {ne:"5380",mat:"BE10MB",port:1194.8,seg:762.3,fin:635.18,amort:0,rep:0,out:0,gas:10612.22,tot:13204.5,mes:3301.12,h:16.6723},
  {ne:"5381",mat:"BE11MB",port:508.41,seg:658.23,fin:616.6,amort:8020.8,rep:1404.5,out:0,gas:11661.0,tot:22869.54,mes:5717.39,h:28.8757},
  {ne:"5347",mat:"AN87AV",port:370.18,seg:753.01,fin:0,amort:7276.74,rep:3489.94,out:0,gas:11823.67,tot:23713.54,mes:5928.39,h:29.9413},
  {ne:"5348",mat:"AN90AV",port:304.43,seg:753.01,fin:0,amort:7276.74,rep:1285.65,out:0,gas:8862.25,tot:18482.08,mes:4620.52,h:23.336},
  {ne:"5316",mat:"AD27MD",port:196.25,seg:845.33,fin:0,amort:0,rep:3978.01,out:0,gas:3881.08,tot:8900.67,mes:2225.17,h:11.2382},
  {ne:"70259",mat:"74-TC-56",port:717.74,seg:416.43,fin:0,amort:2333.33,rep:1275.4,out:0,gas:12813.33,tot:17556.23,mes:4389.06,h:22.167},
  {ne:"5368",mat:"57-74-PF",port:23.93,seg:193.55,fin:0,amort:2333.33,rep:0,out:215.23,gas:602.5,tot:3368.54,mes:842.13,h:4.2532},
  {ne:"6103",mat:"P-67684",port:0,seg:12.36,fin:0,amort:0,rep:20.0,out:0,gas:0,tot:32.36,mes:8.09,h:0.0409},
  {ne:"6216",mat:"C-64835",port:0,seg:12.74,fin:0,amort:0,rep:61.36,out:0,gas:0,tot:74.1,mes:18.52,h:0.0936},
  {ne:"6120",mat:"AV-22744",port:0,seg:12.36,fin:0,amort:0,rep:0,out:0,gas:0,tot:12.36,mes:3.09,h:0.0156},
  {ne:"5103",mat:"L-146101",port:0,seg:12.36,fin:0,amort:0,rep:0,out:0,gas:0,tot:12.36,mes:3.09,h:0.0156},
  {ne:"5115",mat:"L-154494",port:0,seg:12.36,fin:0,amort:0,rep:877.98,out:0,gas:0,tot:890.34,mes:222.59,h:1.1242},
  {ne:"5254",mat:"L-130016",port:0,seg:12.36,fin:0,amort:0,rep:0,out:0,gas:0,tot:12.36,mes:3.09,h:0.0156},
  {ne:"5276",mat:"L-190357",port:0,seg:4.23,fin:0,amort:0,rep:0,out:0,gas:0,tot:4.23,mes:1.06,h:0.0053},
  {ne:"5302",mat:"L-207077",port:0,seg:66.43,fin:0,amort:0,rep:342.4,out:0,gas:0,tot:408.83,mes:102.21,h:0.5162},
  {ne:"5303",mat:"L-207078",port:0,seg:66.43,fin:0,amort:0,rep:0,out:0,gas:0,tot:66.43,mes:16.61,h:0.0839},
  {ne:"5270",mat:"AV-55672",port:0,seg:58.94,fin:0,amort:0,rep:3517.59,out:30.46,gas:0,tot:3606.99,mes:901.75,h:4.5543},
  {ne:"6367",mat:"C-68429",port:0,seg:12.74,fin:0,amort:0,rep:0,out:0,gas:0,tot:12.74,mes:3.19,h:0.0161},
  {ne:"5204",mat:"SE-1082",port:0,seg:12.36,fin:0,amort:0,rep:233.92,out:0,gas:0,tot:246.28,mes:61.57,h:0.311},
  {ne:"70029",mat:"L-215831",port:0,seg:157.62,fin:169.2,amort:0,rep:614.21,out:30.46,gas:0,tot:971.49,mes:242.87,h:1.2266},
  {ne:"5330",mat:"L-209506",port:0,seg:80.59,fin:0,amort:0,rep:1583.65,out:30.46,gas:0,tot:1694.7,mes:423.68,h:2.1398},
  {ne:"5331",mat:"L-209507",port:0,seg:80.59,fin:0,amort:0,rep:30.46,out:30.46,gas:0,tot:141.51,mes:35.38,h:0.1787},
  {ne:"5337",mat:"L-210305",port:0,seg:89.45,fin:0,amort:0,rep:263.59,out:0,gas:0,tot:353.04,mes:88.26,h:0.4458},
  {ne:"70109",mat:"L-215832",port:0,seg:152.9,fin:186.99,amort:0,rep:30.46,out:30.46,gas:0,tot:400.81,mes:100.2,h:0.5061},
  {ne:"5354",mat:"C-47963",port:0,seg:12.36,fin:0,amort:0,rep:0,out:0,gas:0,tot:12.36,mes:3.09,h:0.0156},
  {ne:"5340",mat:"L-118336",port:0,seg:12.36,fin:0,amort:0,rep:0,out:0,gas:0,tot:12.36,mes:3.09,h:0.0156},
  {ne:"40142",mat:"L-219995",port:0,seg:227.71,fin:0,amort:0,rep:0,out:0,gas:0,tot:227.71,mes:56.93,h:0.2875},
  {ne:"40143",mat:"L-219996",port:0,seg:202.28,fin:0,amort:0,rep:0,out:0,gas:0,tot:202.28,mes:50.57,h:0.2554},
  {ne:"40144",mat:"L-219997",port:0,seg:202.28,fin:0,amort:0,rep:0,out:0,gas:0,tot:202.28,mes:50.57,h:0.2554},
];

const CUSTOS_PTSA=[
  {ne:"807",folha:"REBOQUES",gas:0.0,rep:0.0,port:0.0,pess:0.0,amort:0.0,out:2.98,tot:2.98,nM:1,med:2.98,mt:{"jan":2.98}},
  {ne:"815",folha:"REBOQUES",gas:0.0,rep:847.61,port:0.0,pess:0.0,amort:0.0,out:12.37,tot:859.98,nM:3,med:286.66,mt:{"jan":123.84,"fev":729.88,"abr":6.26}},
  {ne:"818",folha:"REBOQUES",gas:0.0,rep:4122.46,port:0.0,pess:0.0,amort:0.0,out:12.37,tot:4134.83,nM:4,med:1033.71,mt:{"jan":2.98,"fev":3.13,"mar":2584.06,"abr":1544.66}},
  {ne:"825",folha:"REBOQUES",gas:0.0,rep:126.81,port:0.0,pess:0.0,amort:0.0,out:12.37,tot:139.18,nM:3,med:46.39,mt:{"jan":83.66,"fev":3.13,"abr":52.39}},
  {ne:"829",folha:"REBOQUES",gas:0.0,rep:1352.86,port:0.0,pess:0.0,amort:0.0,out:12.37,tot:1365.23,nM:3,med:455.08,mt:{"jan":687.88,"fev":137.63,"abr":539.72}},
  {ne:"830",folha:"REBOQUES",gas:0.0,rep:106.8,port:0.0,pess:0.0,amort:0.0,out:42.83,tot:149.63,nM:4,med:37.41,mt:{"jan":33.44,"fev":3.13,"mar":74.3,"abr":38.76}},
  {ne:"832",folha:"REBOQUES",gas:0.0,rep:2889.58,port:0.0,pess:0.0,amort:0.0,out:42.83,tot:2932.41,nM:3,med:977.47,mt:{"jan":2226.68,"fev":699.47,"abr":6.26}},
  {ne:"834",folha:"REBOQUES",gas:0.0,rep:484.25,port:0.0,pess:0.0,amort:0.0,out:42.83,tot:527.08,nM:4,med:131.77,mt:{"jan":55.48,"fev":3.13,"mar":30.46,"abr":438.01}},
  {ne:"836",folha:"REBOQUES",gas:0.0,rep:247.75,port:0.0,pess:0.0,amort:198.08,out:42.83,tot:488.66,nM:4,med:122.17,mt:{"jan":54.15,"fev":124.15,"mar":51.17,"abr":259.19}},
  {ne:"839",folha:"REBOQUES",gas:0.0,rep:166.7,port:0.0,pess:0.0,amort:0.0,out:12.37,tot:179.07,nM:4,med:44.77,mt:{"jan":75.42,"fev":3.13,"mar":27.63,"abr":72.89}},
  {ne:"841",folha:"REBOQUES",gas:0.0,rep:1122.26,port:0.0,pess:0.0,amort:0.0,out:12.37,tot:1134.63,nM:4,med:283.66,mt:{"jan":2.98,"fev":3.13,"mar":588.8,"abr":539.72}},
  {ne:"844",folha:"REBOQUES",gas:0.0,rep:0.0,port:0.0,pess:0.0,amort:0.0,out:42.83,tot:42.83,nM:3,med:14.28,mt:{"jan":2.98,"fev":33.59,"abr":6.26}},
  {ne:"845",folha:"REBOQUES",gas:0.0,rep:359.13,port:0.0,pess:0.0,amort:0.0,out:12.37,tot:371.5,nM:3,med:123.83,mt:{"jan":2.98,"fev":3.13,"abr":365.39}},
  {ne:"849",folha:"REBOQUES",gas:0.0,rep:745.7,port:5.37,pess:0.0,amort:0.0,out:12.37,tot:763.44,nM:3,med:254.48,mt:{"jan":8.35,"fev":748.83,"abr":6.26}},
  {ne:"854",folha:"REBOQUES",gas:0.0,rep:465.08,port:0.0,pess:0.0,amort:2110.68,out:12.37,tot:2588.13,nM:4,med:647.03,mt:{"jan":548.24,"fev":576.33,"mar":589.18,"abr":874.38}},
  {ne:"855",folha:"REBOQUES",gas:0.0,rep:275.59,port:0.0,pess:0.0,amort:2421.71,out:12.37,tot:2709.67,nM:4,med:677.42,mt:{"jan":709.3,"fev":763.08,"mar":625.61,"abr":611.68}},
  {ne:"860",folha:"REBOQUES",gas:0.0,rep:564.18,port:0.0,pess:0.0,amort:328.76,out:12.37,tot:905.31,nM:4,med:226.33,mt:{"jan":294.62,"fev":391.18,"mar":84.93,"abr":134.58}},
  {ne:"861",folha:"REBOQUES",gas:0.0,rep:242.1,port:0.0,pess:0.0,amort:1042.42,out:146.02,tot:1430.54,nM:4,med:357.63,mt:{"jan":298.06,"fev":272.16,"mar":269.29,"abr":591.03}},
  {ne:"862",folha:"REBOQUES",gas:0.0,rep:1431.84,port:0.0,pess:0.0,amort:1042.42,out:146.02,tot:2620.28,nM:4,med:655.07,mt:{"jan":298.06,"fev":1253.53,"mar":750.22,"abr":318.47}},
  {ne:"863",folha:"REBOQUES",gas:0.0,rep:533.0,port:0.0,pess:0.0,amort:1042.42,out:146.02,tot:1721.44,nM:4,med:430.36,mt:{"jan":831.06,"fev":272.16,"mar":269.29,"abr":348.93}},
  {ne:"870",folha:"REBOQUES",gas:0.0,rep:0.0,port:0.0,pess:0.0,amort:143.02,out:73.29,tot:216.31,nM:4,med:54.08,mt:{"jan":39.93,"fev":36.5,"mar":97.87,"abr":42.01}},
  {ne:"871",folha:"REBOQUES",gas:0.0,rep:0.0,port:0.0,pess:0.0,amort:75.6,out:50.47,tot:126.07,nM:4,med:31.52,mt:{"jan":22.51,"fev":20.77,"mar":57.63,"abr":25.16}},
  {ne:"872",folha:"REBOQUES",gas:0.0,rep:0.0,port:0.0,pess:0.0,amort:32.87,out:0.0,tot:32.87,nM:4,med:8.22,mt:{"jan":8.49,"fev":7.67,"mar":8.49,"abr":8.22}},
  {ne:"873",folha:"REBOQUES",gas:0.0,rep:0.0,port:0.0,pess:0.0,amort:88.76,out:12.37,tot:101.13,nM:4,med:25.28,mt:{"jan":25.91,"fev":23.84,"mar":22.93,"abr":28.45}},
  {ne:"874",folha:"REBOQUES",gas:0.0,rep:0.0,port:0.0,pess:0.0,amort:32.87,out:0.0,tot:32.87,nM:4,med:8.22,mt:{"jan":8.49,"fev":7.67,"mar":8.49,"abr":8.22}},
  {ne:"875",folha:"REBOQUES",gas:0.0,rep:0.0,port:0.0,pess:0.0,amort:49.32,out:12.37,tot:61.69,nM:4,med:15.42,mt:{"jan":15.72,"fev":14.64,"mar":12.74,"abr":18.59}},
  {ne:"876",folha:"REBOQUES",gas:0.0,rep:239.18,port:0.0,pess:0.0,amort:147.95,out:51.22,tot:438.35,nM:4,med:109.59,mt:{"jan":41.2,"fev":96.88,"mar":38.22,"abr":262.05}},
  {ne:"877",folha:"REBOQUES",gas:0.0,rep:4222.12,port:0.0,pess:0.0,amort:410.95,out:58.8,tot:4691.87,nM:4,med:1172.97,mt:{"jan":109.14,"fev":693.35,"mar":1406.04,"abr":2483.34}},
  {ne:"880",folha:"REBOQUES",gas:0.0,rep:1774.4,port:0.0,pess:0.0,amort:1067.08,out:189.54,tot:3031.02,nM:4,med:757.75,mt:{"jan":311.86,"fev":2056.07,"mar":275.66,"abr":387.43}},
  {ne:"894",folha:"REBOQUES",gas:0.0,rep:0.0,port:0.0,pess:0.0,amort:32.87,out:42.83,tot:75.7,nM:4,med:18.92,mt:{"jan":11.47,"fev":41.26,"mar":8.49,"abr":14.48}},
  {ne:"896",folha:"REBOQUES",gas:0.0,rep:3773.46,port:0.0,pess:0.0,amort:164.4,out:12.37,tot:3950.23,nM:4,med:987.56,mt:{"jan":45.45,"fev":3665.31,"mar":61.09,"abr":178.38}},
  {ne:"897",folha:"REBOQUES",gas:0.0,rep:403.76,port:0.0,pess:0.0,amort:1256.28,out:732.35,tot:2392.39,nM:4,med:598.1,mt:{"jan":536.67,"fev":861.79,"mar":416.03,"abr":577.9}},
  {ne:"898",folha:"REBOQUES",gas:0.0,rep:192.65,port:0.0,pess:0.0,amort:1256.28,out:732.38,tot:2181.31,nM:4,med:545.33,mt:{"jan":631.03,"fev":458.04,"mar":416.04,"abr":676.2}},
  {ne:"852",folha:"CARROS",gas:11899.55,rep:1815.11,port:1248.59,pess:8361.8,amort:3240.4,out:434.97,tot:27000.42,nM:4,med:6750.1,mt:{"jan":4351.42,"fev":6927.51,"mar":6841.08,"abr":8880.41}},
  {ne:"856",folha:"CARROS",gas:12931.32,rep:964.64,port:1341.89,pess:10046.11,amort:3076.02,out:784.82,tot:29144.8,nM:4,med:7286.2,mt:{"jan":7868.39,"fev":7290.41,"mar":3696.64,"abr":10289.36}},
  {ne:"857",folha:"CARROS",gas:21371.28,rep:901.26,port:3230.8,pess:12023.27,amort:3076.02,out:1404.45,tot:42007.08,nM:4,med:10501.77,mt:{"jan":10395.46,"fev":8222.55,"mar":11525.08,"abr":11863.99}},
  {ne:"858",folha:"CARROS",gas:11027.7,rep:0.0,port:1773.08,pess:10547.7,amort:3024.65,out:774.11,tot:27147.24,nM:4,med:6786.81,mt:{"jan":6027.38,"fev":8999.1,"mar":6391.54,"abr":5729.22}},
  {ne:"859",folha:"CARROS",gas:15881.9,rep:2321.05,port:2764.92,pess:11732.69,amort:3024.65,out:873.33,tot:36598.54,nM:4,med:9149.64,mt:{"jan":9760.43,"fev":7917.1,"mar":9751.21,"abr":9169.8}},
  {ne:"864",folha:"CARROS",gas:12997.44,rep:4642.96,port:1584.92,pess:8615.98,amort:2791.31,out:546.74,tot:31179.35,nM:4,med:7794.84,mt:{"jan":7803.35,"fev":8969.1,"mar":8440.86,"abr":5966.04}},
  {ne:"865",folha:"CARROS",gas:7106.98,rep:5225.11,port:731.8,pess:7253.41,amort:2791.31,out:576.62,tot:23685.23,nM:4,med:5921.31,mt:{"jan":4993.88,"fev":6827.81,"mar":5432.77,"abr":6430.77}},
  {ne:"866",folha:"CARROS",gas:14615.91,rep:20.86,port:1403.42,pess:9863.85,amort:2791.31,out:3774.43,tot:32469.78,nM:4,med:8117.44,mt:{"jan":6218.1,"fev":7432.43,"mar":11301.81,"abr":7517.44}},
  {ne:"867",folha:"CARROS",gas:6908.19,rep:7200.02,port:838.49,pess:5480.33,amort:2791.31,out:541.31,tot:23759.65,nM:4,med:5939.91,mt:{"jan":12215.41,"fev":6075.41,"mar":4422.56,"abr":1046.27}},
  {ne:"868",folha:"CARROS",gas:15052.67,rep:6834.91,port:1455.9,pess:9896.29,amort:2791.31,out:563.99,tot:36595.07,nM:4,med:9148.77,mt:{"jan":9390.65,"fev":7369.83,"mar":8201.98,"abr":11632.61}},
  {ne:"881",folha:"CARROS",gas:14132.72,rep:557.94,port:60.25,pess:13510.81,amort:3803.99,out:1472.55,tot:33538.26,nM:4,med:8384.57,mt:{"jan":6697.29,"fev":7645.1,"mar":9428.05,"abr":9767.82}},
  {ne:"882",folha:"CARROS",gas:12533.93,rep:2333.4,port:1259.47,pess:8937.36,amort:3803.99,out:1445.74,tot:30313.89,nM:4,med:7578.47,mt:{"jan":3140.63,"fev":5762.54,"mar":12280.81,"abr":9129.91}},
  {ne:"883",folha:"CARROS",gas:18079.1,rep:1261.96,port:2260.74,pess:12904.25,amort:3803.99,out:1506.66,tot:39816.7,nM:4,med:9954.17,mt:{"jan":9205.8,"fev":9129.68,"mar":10264.68,"abr":11216.54}},
  {ne:"884",folha:"CARROS",gas:14051.66,rep:1426.07,port:1382.03,pess:12715.22,amort:3803.99,out:1618.15,tot:34997.12,nM:4,med:8749.28,mt:{"jan":9470.28,"fev":9009.82,"mar":9977.48,"abr":6539.54}},
  {ne:"885",folha:"CARROS",gas:14582.59,rep:0.0,port:1494.91,pess:12306.87,amort:3272.7,out:1222.99,tot:32880.06,nM:4,med:8220.01,mt:{"jan":7083.11,"fev":8097.05,"mar":7038.67,"abr":10661.23}},
  {ne:"886",folha:"CARROS",gas:15537.18,rep:247.55,port:1298.06,pess:13172.86,amort:3803.99,out:1280.34,tot:35339.98,nM:4,med:8835.0,mt:{"jan":7886.89,"fev":8053.62,"mar":8680.74,"abr":10718.73}},
  {ne:"887",folha:"CARROS",gas:12502.22,rep:6228.43,port:1963.75,pess:8848.78,amort:3803.99,out:1599.18,tot:34946.35,nM:4,med:8736.59,mt:{"jan":9788.69,"fev":2263.85,"mar":11030.38,"abr":11863.43}},
  {ne:"888",folha:"CARROS",gas:11262.4,rep:220.74,port:1195.07,pess:10136.0,amort:3803.99,out:1291.21,tot:27909.41,nM:4,med:6977.35,mt:{"jan":6069.97,"fev":7604.55,"mar":9256.14,"abr":4978.75}},
  {ne:"889",folha:"CARROS",gas:17992.3,rep:4337.72,port:2581.45,pess:13871.47,amort:3803.99,out:1879.63,tot:44466.56,nM:4,med:11116.64,mt:{"jan":7642.07,"fev":11771.04,"mar":11675.1,"abr":13378.35}},
  {ne:"890",folha:"CARROS",gas:15663.64,rep:832.92,port:1628.91,pess:13102.34,amort:3803.99,out:1448.36,tot:36480.16,nM:4,med:9120.04,mt:{"jan":7264.03,"fev":7892.44,"mar":10931.83,"abr":10391.86}},
  {ne:"891",folha:"CARROS",gas:13122.37,rep:2299.32,port:59.31,pess:9790.65,amort:2843.92,out:1336.83,tot:29452.4,nM:4,med:7363.1,mt:{"jan":4712.38,"fev":5462.83,"mar":10101.79,"abr":9175.4}},
  {ne:"892",folha:"CARROS",gas:15683.65,rep:1890.85,port:1813.09,pess:10841.67,amort:2843.92,out:1159.38,tot:34232.56,nM:4,med:8558.14,mt:{"jan":7045.11,"fev":9251.21,"mar":8827.05,"abr":9109.19}},
  {ne:"893",folha:"CARROS",gas:7382.71,rep:2686.15,port:760.39,pess:3924.67,amort:2843.92,out:1199.02,tot:18796.86,nM:4,med:4699.22,mt:{"jan":4830.44,"fev":6499.72,"mar":2664.76,"abr":4801.94}},
];

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
  const map={
    "Trator":["rgba(59,130,246,.15)",bl],
    "Semi-Reboque":["rgba(232,160,32,.15)",ac],
    "Cisterna":["rgba(167,139,250,.15)",pu],
    "Basculante Rígido":["rgba(34,197,94,.12)",gn],
    "Porta-Máquinas":["rgba(251,146,60,.15)",or],
    "Rígido Grua":["rgba(239,68,68,.15)",rd],
    "Rígido Cola":["rgba(100,116,139,.15)","#94a3b8"],
    "Rígido Água":["rgba(59,130,246,.1)",bl],
    "Reboque-Estrado":["rgba(232,160,32,.1)",ac],
    "Porta-Sílos":["rgba(167,139,250,.1)",pu],
    "Estrado":["rgba(100,116,139,.1)","#94a3b8"],
  };
  const[bg2,c]=map[t]||["rgba(100,116,139,.1)","#94a3b8"];
  return <span style={{display:"inline-block",padding:"2px 8px",borderRadius:4,fontSize:10,fontWeight:700,background:bg2,color:c}}>{t||"—"}</span>;
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
  const[saving,setSaving]=useState(false);
  const[loaded,setLoaded]=useState(false);
  const[toast,setToast]=useState(null);

  function showToast(msg,ok=true){
    setToast({msg,ok});
    setTimeout(()=>setToast(null),3000);
  }

  useEffect(()=>{
    get(ref(db,"frota/dados")).then(snap=>{
      if(snap.exists()){
        const x=snap.val();
        if(x.veic?.length >= V0.length) setVeic(x.veic);
        if(x.mots?.length >= D0.length) setMots(x.mots);
        if(x.man?.length)  setMan(x.man);
        if(x.port?.length) setPort(x.port);
        if(x.gas?.length)  setGas(x.gas);
        if(x.conj?.length) setConj(x.conj);
        if(x.fret?.length) setFret(x.fret);
      }
      setLoaded(true);
    });
  },[]);

  async function guardar(){
    setSaving(true);
    try {
      await set(ref(db,"frota/dados"),{veic,mots,man,port,gas,conj,fret});
      setSaving(false);
      showToast("✅ Dados guardados com sucesso!");
    } catch(e) {
      setSaving(false);
      showToast("❌ Erro: "+e.message, false);
    }
  }

  const tM=useMemo(()=>man.reduce((s,m)=>s+nv(m.custo),0),[man]);
  const tP=useMemo(()=>port.reduce((s,p)=>s+nv(p.valor),0),[port]);
  const tG=useMemo(()=>gas.reduce((s,g)=>s+nv(g.custo),0),[gas]);
  const tD=useMemo(()=>mots.reduce((s,d)=>s+drC(d),0),[mots]);

  const pages=[
    ["dash","📊","Dashboard"],["imp","📥","Importar"],
    ["veic","🚛","Equipamentos"],["conj","🔗","Conjuntos"],["mot","👤","Motoristas"],
    ["man","🔧","Manutenção"],["port","🛣️","Portagens"],["gas","⛽","Gasóleo"],
    ["fret","📦","Frete"],["anl","💰","Custos 2026"],
  ];

  return (
    <div style={{display:"flex",minHeight:"100vh",background:bg,color:tx,fontFamily:"system-ui,sans-serif"}}>
      {toast && (
        <div style={{position:"fixed",top:20,right:20,zIndex:9999,background:toast.ok?"rgba(34,197,94,.95)":"rgba(239,68,68,.95)",color:"#fff",padding:"14px 20px",borderRadius:10,fontWeight:700,fontSize:14,boxShadow:"0 4px 20px rgba(0,0,0,.4)"}}>
          {toast.msg}
        </div>
      )}
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
          <div style={{fontSize:19,fontWeight:900,color:ac,marginBottom:10}}>{euro(tM+tP+tG+tD)}</div>
          <button onClick={guardar} style={{...BA,width:"100%",opacity:saving?0.6:1}} disabled={saving}>
            {saving?"A guardar...":"💾 Guardar"}
          </button>
        </div>
      </nav>
      <main style={{marginLeft:188,flex:1,padding:28}}>
        {pg==="dash" && <PgDash veic={veic} man={man} port={port} gas={gas} mots={mots} fret={fret} tM={tM} tP={tP} tG={tG}/>}
        {pg==="imp"  && <PgImp  veic={veic} setMan={setMan} setPort={setPort} setGas={setGas}/>}
        {pg==="veic" && <PgVeic veic={veic} setVeic={setVeic}/>}
        {pg==="conj" && <PgConj veic={veic} mots={mots} man={man} port={port} gas={gas} conj={conj} setConj={setConj}/>}
        {pg==="mot"  && <PgMot  mots={mots} setMots={setMots} veic={veic} setVeic={setVeic} tD={tD}/>}
        {pg==="man"  && <PgMan  man={man} setMan={setMan} veic={veic} tM={tM}/>}
        {pg==="port" && <PgPort port={port} setPort={setPort} veic={veic} tP={tP}/>}
        {pg==="gas"  && <PgGas  gas={gas} setGas={setGas} veic={veic} tG={tG}/>}
        {pg==="fret" && <PgFret fret={fret} setFret={setFret}/>}
        {pg==="anl"  && <PgAnl  veic={veic}/>}
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
        <Lbl t={["Viaturas",veic.length,bl,veic.filter(v=>v.categoria==="T. Especial").length+" Esp · "+veic.filter(v=>v.categoria==="T. Basculantes").length+" Basc · "+veic.filter(v=>v.categoria==="T. Cisternas").length+" Cist"]}/>
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

const TIPOS=["Trator","Semi-Reboque","Cisterna","Basculante Rígido","Carro Grua","Porta-Máquinas","Rígido Grua","Rígido Cola","Rígido Água","Reboque-Estrado","Porta-Sílos","Estrado","Outro"];
const CATS=["T. Especial","T. Basculantes","T. Cisternas"];

function PgVeic({veic,setVeic}) {
  const f0={numEquip:"",matricula:"",tipo:"Trator",marca:"",modelo:"",ano:String(new Date().getFullYear()),tara:"",pbTotal:"",categoria:"T. Especial"};
  const[f,setF]=useState(f0);
  const[search,setSearch]=useState("");
  const[editId,setEditId]=useState(null);
  const[editF,setEditF]=useState(null);

  function add() {
    if(!f.matricula.trim()||!f.marca.trim()) return;
    setVeic(v=>[...v,{id:Date.now(),numEquip:f.numEquip,matricula:f.matricula,tipo:f.tipo,marca:f.marca,modelo:f.modelo,ano:Number(f.ano),tara:nv(f.tara),pbTotal:nv(f.pbTotal),categoria:f.categoria}]);
    setF(f0);
  }

  function startEdit(v) {
    setEditId(v.id);
    setEditF({...v,tara:String(v.tara||""),pbTotal:String(v.pbTotal||""),ano:String(v.ano||"")});
  }

  function saveEdit() {
    setVeic(vs=>vs.map(v=>v.id===editId?{...v,...editF,ano:Number(editF.ano),tara:nv(editF.tara),pbTotal:nv(editF.pbTotal)}:v));
    setEditId(null);setEditF(null);
  }

  const filtered=veic.filter(v=>
    !search || v.matricula.toLowerCase().includes(search.toLowerCase()) ||
    v.marca.toLowerCase().includes(search.toLowerCase()) ||
    v.numEquip?.toLowerCase().includes(search.toLowerCase()) ||
    v.tipo?.toLowerCase().includes(search.toLowerCase())
  );

  const inSE={...IN,padding:"4px 6px",fontSize:11};

  return (
    <div>
      <h2 style={{fontSize:28,fontWeight:900,margin:"0 0 4px"}}>Equipamentos</h2>
      <p style={{fontSize:13,color:mu,marginBottom:20}}>Parque automóvel — {veic.length} equipamentos</p>
      <div style={C}>
        <div style={{fontWeight:700,fontSize:14,marginBottom:12}}>Registar Equipamento</div>
        <div style={G4}>
          <div><label style={LB}>Nº Equip</label><input style={IN} value={f.numEquip} onChange={e=>setF({...f,numEquip:e.target.value})} placeholder="70030"/></div>
          <div><label style={LB}>Matrícula</label><input style={IN} value={f.matricula} onChange={e=>setF({...f,matricula:e.target.value})} placeholder="AA-00-BB"/></div>
          <div><label style={LB}>Categoria</label><select style={SE} value={f.categoria} onChange={e=>setF({...f,categoria:e.target.value})}>{CATS.map(c=><option key={c} value={c}>{c}</option>)}</select></div>
          <div><label style={LB}>Tipo</label><select style={SE} value={f.tipo} onChange={e=>setF({...f,tipo:e.target.value})}>{TIPOS.map(t=><option key={t} value={t}>{t}</option>)}</select></div>
        </div>
        <div style={G4}>
          <div><label style={LB}>Marca</label><input style={IN} value={f.marca} onChange={e=>setF({...f,marca:e.target.value})} placeholder="Volvo"/></div>
          <div><label style={LB}>Modelo</label><input style={IN} value={f.modelo} onChange={e=>setF({...f,modelo:e.target.value})} placeholder="FH 500"/></div>
          <div><label style={LB}>Ano</label><input style={IN} type="number" value={f.ano} onChange={e=>setF({...f,ano:e.target.value})}/></div>
          <div><label style={LB}>Tara (kg)</label><input style={IN} type="number" value={f.tara} onChange={e=>setF({...f,tara:e.target.value})}/></div>
        </div>
        <div style={G3}>
          <div><label style={LB}>PB Total (kg)</label><input style={IN} type="number" value={f.pbTotal} onChange={e=>setF({...f,pbTotal:e.target.value})}/></div>
          <div style={{display:"flex",alignItems:"flex-end"}}><button style={BA} onClick={add}>+ Adicionar</button></div>
        </div>
      </div>

      {editId && editF && (
        <div style={{background:"rgba(232,160,32,.07)",border:"1px solid rgba(232,160,32,.3)",borderRadius:10,padding:18,marginBottom:16}}>
          <div style={{fontWeight:800,fontSize:14,color:ac,marginBottom:12}}>✏️ Editar Equipamento</div>
          <div style={G4}>
            <div><label style={LB}>Nº Equip</label><input style={IN} value={editF.numEquip||""} onChange={e=>setEditF({...editF,numEquip:e.target.value})}/></div>
            <div><label style={LB}>Matrícula</label><input style={IN} value={editF.matricula||""} onChange={e=>setEditF({...editF,matricula:e.target.value})}/></div>
            <div><label style={LB}>Categoria</label><select style={SE} value={editF.categoria||""} onChange={e=>setEditF({...editF,categoria:e.target.value})}>{CATS.map(c=><option key={c} value={c}>{c}</option>)}</select></div>
            <div><label style={LB}>Tipo</label><select style={SE} value={editF.tipo||""} onChange={e=>setEditF({...editF,tipo:e.target.value})}>{TIPOS.map(t=><option key={t} value={t}>{t}</option>)}</select></div>
          </div>
          <div style={G4}>
            <div><label style={LB}>Marca</label><input style={IN} value={editF.marca||""} onChange={e=>setEditF({...editF,marca:e.target.value})}/></div>
            <div><label style={LB}>Modelo</label><input style={IN} value={editF.modelo||""} onChange={e=>setEditF({...editF,modelo:e.target.value})}/></div>
            <div><label style={LB}>Ano</label><input style={IN} type="number" value={editF.ano||""} onChange={e=>setEditF({...editF,ano:e.target.value})}/></div>
            <div><label style={LB}>Tara (kg)</label><input style={IN} type="number" value={editF.tara||""} onChange={e=>setEditF({...editF,tara:e.target.value})}/></div>
          </div>
          <div style={G3}>
            <div><label style={LB}>PB Total (kg)</label><input style={IN} type="number" value={editF.pbTotal||""} onChange={e=>setEditF({...editF,pbTotal:e.target.value})}/></div>
          </div>
          <div style={{display:"flex",gap:10,marginTop:8}}>
            <button style={BA} onClick={saveEdit}>✓ Guardar Alterações</button>
            <button style={{...BB,fontSize:12}} onClick={()=>{setEditId(null);setEditF(null);}}>Cancelar</button>
          </div>
        </div>
      )}

      <div style={C}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12,gap:12}}>
          <strong style={{fontSize:14}}>{filtered.length} / {veic.length} equipamentos</strong>
          <input style={{...IN,width:240}} placeholder="Pesquisar matrícula, marca, tipo..." value={search} onChange={e=>setSearch(e.target.value)}/>
        </div>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
            <Th cols={["Nº Equip","Matrícula","Categoria","Tipo","Marca","Modelo","Ano","Tara kg","PB Total kg",""]}/>
            <tbody>
              {filtered.map(v=>(
                <tr key={v.id} style={{background:editId===v.id?"rgba(232,160,32,.05)":""}}>
                  <td style={TD}><strong>{v.numEquip}</strong></td>
                  <td style={TD}><strong>{v.matricula}</strong></td>
                  <td style={TD}><span style={{fontSize:10,color:mu}}>{v.categoria}</span></td>
                  <td style={TD}><Tipo t={v.tipo}/></td>
                  <td style={TD}>{v.marca}</td>
                  <td style={TD}>{v.modelo}</td>
                  <td style={TD}>{v.ano}</td>
                  <td style={TD}>{v.tara?Number(v.tara).toLocaleString("pt-PT"):""}</td>
                  <td style={TD}>{v.pbTotal?Number(v.pbTotal).toLocaleString("pt-PT"):""}</td>
                  <td style={TD}>
                    <button onClick={()=>editId===v.id?setEditId(null):startEdit(v)} style={{padding:"3px 10px",borderRadius:5,fontSize:10,fontWeight:700,cursor:"pointer",border:`1px solid ${bd}`,background:editId===v.id?ac:s2,color:editId===v.id?"#000":mu}}>
                      {editId===v.id?"✕":"✏️"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function PgConj({veic,mots,man,port,gas,conj,setConj}) {
  const[f,setF]=useState({motoristaId:"",reboqueId:""});

  function selMot(motId) {
    const mot=mots.find(m=>m.id===Number(motId));
    setF(x=>({...x,motoristaId:motId,tratorId:mot?.veiculoId||""}));
  }

  function add() {
    const mot=mots.find(m=>m.id===Number(f.motoristaId));
    if(!mot||!f.reboqueId) return;
    setConj(s=>[...s,{id:Date.now(),nome:mot.nome,tratorId:mot.veiculoId||null,reboqueId:Number(f.reboqueId),motoristaId:mot.id}]);
    setF({motoristaId:"",reboqueId:""});
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
      <p style={{fontSize:13,color:mu,marginBottom:20}}>Trator + Equipamento rebocado — conjugação manual</p>
      <div style={C}>
        <div style={G3}>
          <div>
            <label style={LB}>Motorista</label>
            <select style={SE} value={f.motoristaId} onChange={e=>selMot(e.target.value)}>
              <option value="">-- selecionar motorista --</option>
              {mots.filter(m=>m.ativo!==false).map(m=>{
                const v=veic.find(x=>x.id===m.veiculoId);
                return <option key={m.id} value={m.id}>{m.nome}{v?" · "+v.matricula:""}</option>;
              })}
            </select>
          </div>
          <div>
            <label style={LB}>Equipamento Rebocado</label>
            <select style={SE} value={f.reboqueId} onChange={e=>setF(x=>({...x,reboqueId:e.target.value}))}>
              <option value="">-- selecionar --</option>
              {["Porta-Máquinas","Porta-Sílos","Estrado","Cisterna","Reboque-Estrado","Semi-Reboque"].map(cat=>{
                const items=veic.filter(v=>v.tipo===cat);
                return items.length>0 ? <optgroup key={cat} label={cat}>{items.map(v=><option key={v.id} value={v.id}>{v.matricula} · {v.marca} {v.modelo} ({v.numEquip})</option>)}</optgroup> : null;
              })}
            </select>
          </div>
          <div style={{display:"flex",alignItems:"flex-end"}}><button style={BA} onClick={add}>+ Criar Conjunto</button></div>
        </div>
      </div>
      {conj.map(s=>{
        const cv=cost(s);
        return (
          <div key={s.id} style={{background:"linear-gradient(135deg,rgba(232,160,32,.07),rgba(59,130,246,.07))",border:"1px solid rgba(232,160,32,.25)",borderRadius:10,padding:18,marginBottom:14}}>
            <div style={{fontWeight:800,color:ac,fontSize:15,marginBottom:8}}>🔗 {s.nome||"Conjunto #"+s.id}</div>
            <div style={{fontSize:12,color:mu,marginBottom:10}}>
              <span style={{color:bl}}>Trator:</span> {cv.tr?cv.tr.matricula:"—"} &nbsp;|&nbsp;
              <span style={{color:ac}}>Rebocado:</span> {cv.rb?cv.rb.matricula+" ("+cv.rb.tipo+")":"—"}
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

function PgMot({mots,setMots,veic,setVeic,tD}) {
  const[f,setF]=useState({nome:"",salario:"",subRef:"",subTranp:"",seguro:"",veiculoId:""});
  const[tab,setTab]=useState("ativo");
  const[editId,setEditId]=useState(null);
  const[editF,setEditF]=useState(null);

  function add() {
    if(!f.nome.trim()) return;
    setMots(d=>[...d,{id:Date.now(),nome:f.nome,salario:nv(f.salario),subRef:nv(f.subRef),subTranp:nv(f.subTranp),seguro:nv(f.seguro),veiculoId:Number(f.veiculoId)||null,ativo:true}]);
    setF({nome:"",salario:"",subRef:"",subTranp:"",seguro:"",veiculoId:""});
  }

  function startEdit(d) {
    const v=veic.find(x=>x.id===d.veiculoId);
    setEditId(d.id);
    setEditF({veiculoId:String(d.veiculoId||""),tipoVeic:v?.tipo||""});
  }

  function saveEdit() {
    const vid=Number(editF.veiculoId)||null;
    setMots(ds=>ds.map(d=>d.id===editId?{...d,veiculoId:vid}:d));
    if(vid && editF.tipoVeic) {
      setVeic(vs=>vs.map(v=>v.id===vid?{...v,tipo:editF.tipoVeic}:v));
    }
    setEditId(null);
  }

  function toggleAtivo(id) {
    setMots(d=>d.map(m=>m.id===id?{...m,ativo:!m.ativo}:m));
  }

  const lista=mots.filter(m=>tab==="ativo"?m.ativo!==false:m.ativo===false);
  const ativos=mots.filter(m=>m.ativo!==false);
  const inativos=mots.filter(m=>m.ativo===false);

  return (
    <div>
      <h2 style={{fontSize:28,fontWeight:900,margin:"0 0 4px"}}>Motoristas</h2>
      <p style={{fontSize:13,color:mu,marginBottom:20}}>Gestão de motoristas e encargos mensais</p>
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
          <div><label style={LB}>Viatura</label><select style={SE} value={f.veiculoId} onChange={e=>setF({...f,veiculoId:e.target.value})}><option value="">-- nenhuma --</option>{veic.filter(v=>v.tipo==="Trator").map(v=><option key={v.id} value={v.id}>{v.matricula} ({v.numEquip})</option>)}</select></div>
          <div style={{display:"flex",alignItems:"flex-end"}}><button style={BA} onClick={add}>+ Adicionar</button></div>
        </div>
      </div>
      <div style={C}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <div style={{display:"flex",gap:6}}>
            <button onClick={()=>setTab("ativo")} style={{padding:"5px 14px",borderRadius:7,fontSize:11,fontWeight:700,cursor:"pointer",border:`1px solid ${bd}`,background:tab==="ativo"?gn:s2,color:tab==="ativo"?"#000":mu}}>Ativos ({ativos.length})</button>
            <button onClick={()=>setTab("inativo")} style={{padding:"5px 14px",borderRadius:7,fontSize:11,fontWeight:700,cursor:"pointer",border:`1px solid ${bd}`,background:tab==="inativo"?rd:s2,color:tab==="inativo"?"#fff":mu}}>Inativos ({inativos.length})</button>
          </div>
          {tab==="ativo" && <strong style={{color:gn}}>Total/mês: {euro(tD)}</strong>}
        </div>
        {editId && editF && (
          <div style={{background:"rgba(59,130,246,.07)",border:"1px solid rgba(59,130,246,.3)",borderRadius:10,padding:16,marginBottom:12}}>
            <div style={{fontWeight:800,fontSize:13,color:bl,marginBottom:10}}>✏️ Editar correspondência</div>
            <div style={G3}>
              <div>
                <label style={LB}>Viatura Atribuída</label>
                <select style={SE} value={editF.veiculoId} onChange={e=>{
                  const v=veic.find(x=>x.id===Number(e.target.value));
                  setEditF({...editF,veiculoId:e.target.value,tipoVeic:v?.tipo||""});
                }}>
                  <option value="">-- nenhuma --</option>
                  {veic.filter(v=>v.tipo==="Trator"||v.tipo==="Carro Grua").map(v=><option key={v.id} value={v.id}>{v.matricula} · {v.tipo} ({v.numEquip})</option>)}
                </select>
              </div>
              <div>
                <label style={LB}>Tipo do Veículo</label>
                <select style={SE} value={editF.tipoVeic} onChange={e=>setEditF({...editF,tipoVeic:e.target.value})}>
                  {TIPOS.map(t=><option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div style={{display:"flex",alignItems:"flex-end",gap:8}}>
                <button style={BA} onClick={saveEdit}>✓ Guardar</button>
                <button style={{...BB,fontSize:12}} onClick={()=>setEditId(null)}>Cancelar</button>
              </div>
            </div>
          </div>
        )}
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
          <Th cols={["Nome","Viatura","Salário","Sub. Ref.","Sub. Transp.","Seguro","Total/mês","Estado",""]}/>
          <tbody>
            {lista.map(d=>{
              const v=veic.find(x=>x.id===d.veiculoId);
              const t=drC(d);
              return (
                <tr key={d.id} style={{opacity:d.ativo===false?0.5:1,background:editId===d.id?"rgba(59,130,246,.05)":""}}>
                  <td style={TD}><strong>{d.nome}</strong></td>
                  <td style={TD}>{v?<span style={{fontSize:12}}>{v.matricula} <Tipo t={v.tipo}/></span>:"—"}</td>
                  <td style={TD}>{euro(d.salario)}</td>
                  <td style={TD}>{euro(d.subRef)}</td>
                  <td style={TD}>{euro(d.subTranp)}</td>
                  <td style={TD}>{euro(d.seguro)}</td>
                  <td style={TD}><strong style={{color:gn}}>{euro(t)}</strong></td>
                  <td style={TD}>
                    <button onClick={()=>toggleAtivo(d.id)} style={{padding:"3px 10px",borderRadius:5,fontSize:10,fontWeight:700,cursor:"pointer",border:"none",background:d.ativo===false?"rgba(34,197,94,.15)":"rgba(239,68,68,.15)",color:d.ativo===false?gn:rd}}>
                      {d.ativo===false?"Reativar":"Inativar"}
                    </button>
                  </td>
                  <td style={TD}>
                    <button onClick={()=>editId===d.id?setEditId(null):startEdit(d)} style={{padding:"3px 8px",borderRadius:5,fontSize:10,fontWeight:700,cursor:"pointer",border:`1px solid ${bd}`,background:editId===d.id?bl:s2,color:editId===d.id?"#fff":mu}}>✏️</button>
                  </td>
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
  const f0={veiculoId:"",data:"",tipo:"",desc:"",custo:"",estado:"ok"};
  const[f,setF]=useState(f0);
  const[editId,setEditId]=useState(null);
  const[editF,setEditF]=useState(null);

  function add() {
    if(!f.veiculoId||!f.tipo.trim()||!f.data) return;
    setMan(m=>[...m,{id:Date.now(),veiculoId:Number(f.veiculoId),data:f.data,tipo:f.tipo,desc:f.desc,custo:nv(f.custo),estado:f.estado}]);
    setF(f0);
  }
  function startEdit(m){setEditId(m.id);setEditF({...m,veiculoId:String(m.veiculoId),custo:String(m.custo||"")});}
  function saveEdit(){setMan(ms=>ms.map(m=>m.id===editId?{...m,...editF,veiculoId:Number(editF.veiculoId),custo:nv(editF.custo)}:m));setEditId(null);}
  function del(id){setMan(ms=>ms.filter(m=>m.id!==id));}

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
      {editId && editF && (
        <div style={{background:"rgba(232,160,32,.07)",border:"1px solid rgba(232,160,32,.3)",borderRadius:10,padding:18,marginBottom:16}}>
          <div style={{fontWeight:800,fontSize:14,color:ac,marginBottom:12}}>✏️ Editar Registo</div>
          <div style={G3}>
            <div><label style={LB}>Viatura</label><select style={SE} value={editF.veiculoId} onChange={e=>setEditF({...editF,veiculoId:e.target.value})}><option value="">--</option>{veic.map(v=><option key={v.id} value={v.id}>{v.matricula}</option>)}</select></div>
            <div><label style={LB}>Data</label><input style={IN} type="date" value={editF.data||""} onChange={e=>setEditF({...editF,data:e.target.value})}/></div>
            <div><label style={LB}>Tipo</label><input style={IN} value={editF.tipo||""} onChange={e=>setEditF({...editF,tipo:e.target.value})}/></div>
          </div>
          <div style={G3}>
            <div><label style={LB}>Descrição</label><input style={IN} value={editF.desc||""} onChange={e=>setEditF({...editF,desc:e.target.value})}/></div>
            <div><label style={LB}>Custo (€)</label><input style={IN} type="number" value={editF.custo||""} onChange={e=>setEditF({...editF,custo:e.target.value})}/></div>
            <div><label style={LB}>Estado</label><select style={SE} value={editF.estado||"ok"} onChange={e=>setEditF({...editF,estado:e.target.value})}><option value="ok">Concluído</option><option value="warn">Pendente</option><option value="danger">Urgente</option></select></div>
          </div>
          <div style={{display:"flex",gap:10,marginTop:8}}>
            <button style={BA} onClick={saveEdit}>✓ Guardar</button>
            <button style={{...BB,fontSize:12}} onClick={()=>setEditId(null)}>Cancelar</button>
          </div>
        </div>
      )}
      <div style={C}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <strong style={{fontSize:14}}>{man.length} Registos</strong>
          <strong style={{color:ac}}>{euro(tM)}</strong>
        </div>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
            <Th cols={["Matrícula","Data","Tipo","Descrição","Custo","Estado",""]}/>
            <tbody>
              {man.map(m=>{
                const v=veic.find(x=>x.id===m.veiculoId);
                return (
                  <tr key={m.id} style={{background:editId===m.id?"rgba(232,160,32,.05)":""}}>
                    <td style={TD}><strong>{v?v.matricula:"—"}</strong></td>
                    <td style={TD}>{m.data}</td>
                    <td style={TD}>{m.tipo}</td>
                    <td style={TD}>{m.desc||m.descricao||""}</td>
                    <td style={TD}>{euro(m.custo)}</td>
                    <td style={TD}><Badge e={m.estado}/></td>
                    <td style={TD}>
                      <div style={{display:"flex",gap:4}}>
                        <button onClick={()=>editId===m.id?setEditId(null):startEdit(m)} style={{padding:"3px 8px",borderRadius:5,fontSize:10,fontWeight:700,cursor:"pointer",border:`1px solid ${bd}`,background:editId===m.id?ac:s2,color:editId===m.id?"#000":mu}}>✏️</button>
                        <button onClick={()=>del(m.id)} style={{padding:"3px 8px",borderRadius:5,fontSize:10,fontWeight:700,cursor:"pointer",border:"none",background:"rgba(239,68,68,.15)",color:rd}}>🗑</button>
                      </div>
                    </td>
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
  const f0={veiculoId:"",mes:"",via:"",valor:""};
  const[f,setF]=useState(f0);
  const[editId,setEditId]=useState(null);
  const[editF,setEditF]=useState(null);

  function add() {
    if(!f.veiculoId||!f.mes||!f.valor) return;
    setPort(p=>[...p,{id:Date.now(),veiculoId:Number(f.veiculoId),mes:f.mes,via:f.via,valor:nv(f.valor)}]);
    setF(f0);
  }
  function startEdit(p){setEditId(p.id);setEditF({...p,veiculoId:String(p.veiculoId),valor:String(p.valor||"")});}
  function saveEdit(){setPort(ps=>ps.map(p=>p.id===editId?{...p,...editF,veiculoId:Number(editF.veiculoId),valor:nv(editF.valor)}:p));setEditId(null);}
  function del(id){setPort(ps=>ps.filter(p=>p.id!==id));}

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
      {editId && editF && (
        <div style={{background:"rgba(167,139,250,.07)",border:"1px solid rgba(167,139,250,.3)",borderRadius:10,padding:18,marginBottom:16}}>
          <div style={{fontWeight:800,fontSize:14,color:pu,marginBottom:12}}>✏️ Editar Portagem</div>
          <div style={G4}>
            <div><label style={LB}>Viatura</label><select style={SE} value={editF.veiculoId} onChange={e=>setEditF({...editF,veiculoId:e.target.value})}><option value="">--</option>{veic.map(v=><option key={v.id} value={v.id}>{v.matricula}</option>)}</select></div>
            <div><label style={LB}>Mês</label><input style={IN} type="month" value={editF.mes||""} onChange={e=>setEditF({...editF,mes:e.target.value})}/></div>
            <div><label style={LB}>Via</label><input style={IN} value={editF.via||""} onChange={e=>setEditF({...editF,via:e.target.value})}/></div>
            <div><label style={LB}>Valor (€)</label><input style={IN} type="number" value={editF.valor||""} onChange={e=>setEditF({...editF,valor:e.target.value})}/></div>
          </div>
          <div style={{display:"flex",gap:10,marginTop:8}}>
            <button style={BA} onClick={saveEdit}>✓ Guardar</button>
            <button style={{...BB,fontSize:12}} onClick={()=>setEditId(null)}>Cancelar</button>
          </div>
        </div>
      )}
      <div style={C}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <strong style={{fontSize:14}}>{port.length} Registos</strong>
          <strong style={{color:pu}}>{euro(tP)}</strong>
        </div>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
          <Th cols={["Matrícula","Mês","Via","Valor",""]}/>
          <tbody>
            {port.map(p=>{
              const v=veic.find(x=>x.id===p.veiculoId);
              return (
                <tr key={p.id} style={{background:editId===p.id?"rgba(167,139,250,.05)":""}}>
                  <td style={TD}><strong>{v?v.matricula:"—"}</strong></td>
                  <td style={TD}>{p.mes}</td>
                  <td style={TD}>{p.via}</td>
                  <td style={{...TD,color:pu,fontWeight:600}}>{euro(p.valor)}</td>
                  <td style={TD}>
                    <div style={{display:"flex",gap:4}}>
                      <button onClick={()=>editId===p.id?setEditId(null):startEdit(p)} style={{padding:"3px 8px",borderRadius:5,fontSize:10,fontWeight:700,cursor:"pointer",border:`1px solid ${bd}`,background:editId===p.id?pu:s2,color:editId===p.id?"#fff":mu}}>✏️</button>
                      <button onClick={()=>del(p.id)} style={{padding:"3px 8px",borderRadius:5,fontSize:10,fontWeight:700,cursor:"pointer",border:"none",background:"rgba(239,68,68,.15)",color:rd}}>🗑</button>
                    </div>
                  </td>
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
  const f0={veiculoId:"",data:"",local:"",litros:"",preco:"",km:""};
  const[f,setF]=useState(f0);
  const[editId,setEditId]=useState(null);
  const[editF,setEditF]=useState(null);
  const tL=gas.reduce((s,g)=>s+nv(g.litros),0);

  function add() {
    if(!f.veiculoId||!f.litros) return;
    const lt=nv(f.litros), pr=nv(f.preco);
    setGas(g=>[...g,{id:Date.now(),veiculoId:Number(f.veiculoId),data:f.data,local:f.local,litros:lt,preco:pr,custo:lt*pr,km:nv(f.km)||""}]);
    setF(f0);
  }
  function startEdit(g){setEditId(g.id);setEditF({...g,veiculoId:String(g.veiculoId),litros:String(g.litros||""),preco:String(g.preco||""),km:String(g.km||"")});}
  function saveEdit(){
    const lt=nv(editF.litros),pr=nv(editF.preco);
    setGas(gs=>gs.map(g=>g.id===editId?{...g,...editF,veiculoId:Number(editF.veiculoId),litros:lt,preco:pr,custo:lt*pr,km:nv(editF.km)||""}:g));
    setEditId(null);
  }
  function del(id){setGas(gs=>gs.filter(g=>g.id!==id));}

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
      {editId && editF && (
        <div style={{background:"rgba(251,146,60,.07)",border:"1px solid rgba(251,146,60,.3)",borderRadius:10,padding:18,marginBottom:16}}>
          <div style={{fontWeight:800,fontSize:14,color:or,marginBottom:12}}>✏️ Editar Abastecimento</div>
          <div style={G3}>
            <div><label style={LB}>Viatura</label><select style={SE} value={editF.veiculoId} onChange={e=>setEditF({...editF,veiculoId:e.target.value})}><option value="">--</option>{veic.map(v=><option key={v.id} value={v.id}>{v.matricula}</option>)}</select></div>
            <div><label style={LB}>Data</label><input style={IN} type="date" value={editF.data||""} onChange={e=>setEditF({...editF,data:e.target.value})}/></div>
            <div><label style={LB}>Local</label><input style={IN} value={editF.local||""} onChange={e=>setEditF({...editF,local:e.target.value})}/></div>
          </div>
          <div style={G4}>
            <div><label style={LB}>Litros</label><input style={IN} type="number" value={editF.litros||""} onChange={e=>setEditF({...editF,litros:e.target.value})}/></div>
            <div><label style={LB}>€/Litro</label><input style={IN} type="number" step="0.001" value={editF.preco||""} onChange={e=>setEditF({...editF,preco:e.target.value})}/></div>
            <div><label style={LB}>KM</label><input style={IN} type="number" value={editF.km||""} onChange={e=>setEditF({...editF,km:e.target.value})}/></div>
          </div>
          <div style={{display:"flex",gap:10,marginTop:8}}>
            <button style={BA} onClick={saveEdit}>✓ Guardar</button>
            <button style={{...BB,fontSize:12}} onClick={()=>setEditId(null)}>Cancelar</button>
          </div>
        </div>
      )}
      <div style={C}>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
            <Th cols={["Matrícula","Data","Local","Litros","€/L","Custo","KM",""]}/>
            <tbody>
              {gas.map(g=>{
                const v=veic.find(x=>x.id===g.veiculoId);
                return (
                  <tr key={g.id} style={{background:editId===g.id?"rgba(251,146,60,.05)":""}}>
                    <td style={TD}><strong>{v?v.matricula:"—"}</strong></td>
                    <td style={TD}>{g.data}</td>
                    <td style={TD}>{g.local}</td>
                    <td style={TD}>{nv(g.litros).toFixed(0)} L</td>
                    <td style={TD}>€ {nv(g.preco).toFixed(3)}</td>
                    <td style={{...TD,color:or,fontWeight:600}}>{euro(g.custo)}</td>
                    <td style={TD}>{g.km?Number(g.km).toLocaleString("pt-PT")+" km":""}</td>
                    <td style={TD}>
                      <div style={{display:"flex",gap:4}}>
                        <button onClick={()=>editId===g.id?setEditId(null):startEdit(g)} style={{padding:"3px 8px",borderRadius:5,fontSize:10,fontWeight:700,cursor:"pointer",border:`1px solid ${bd}`,background:editId===g.id?or:s2,color:editId===g.id?"#000":mu}}>✏️</button>
                        <button onClick={()=>del(g.id)} style={{padding:"3px 8px",borderRadius:5,fontSize:10,fontWeight:700,cursor:"pointer",border:"none",background:"rgba(239,68,68,.15)",color:rd}}>🗑</button>
                      </div>
                    </td>
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

async function parseMapsUrl(url) {
  try {
    // Extract coordinates from data parameter: !1d{lon}!2d{lat}
    const coordMatches=[...url.matchAll(/!1d(-?\d+\.\d+)!2d(-?\d+\.\d+)/g)];
    if(coordMatches.length>=2) {
      return {
        origCoord:{lon:parseFloat(coordMatches[0][1]),lat:parseFloat(coordMatches[0][2])},
        destCoord:{lon:parseFloat(coordMatches[1][1]),lat:parseFloat(coordMatches[1][2])},
      };
    }
    // Try @lat,lon in URL
    const centerM=url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    // Format: /maps/dir/Origin/Destination/
    const m1=url.match(/maps\/dir\/([^\/\?@]+)\/([^\/\?@]+)/);
    if(m1) return {orig:decodeURIComponent(m1[1].replace(/\+/g,' ')),dest:decodeURIComponent(m1[2].replace(/\+/g,' '))};
    // Format: ?origin=...&destination=...
    const u=new URL(url.startsWith('http')?url:'https://x.com/?'+url);
    const o=u.searchParams.get('origin')||u.searchParams.get('saddr');
    const d=u.searchParams.get('destination')||u.searchParams.get('daddr');
    if(o&&d) return {orig:decodeURIComponent(o),dest:decodeURIComponent(d)};
  } catch(e){}
  return null;
}

async function geocodePlace(place) {
  const coordM=place.match(/^(-?\d+\.?\d*)[,\s]+(-?\d+\.?\d*)$/);
  if(coordM) return {lat:parseFloat(coordM[1]),lon:parseFloat(coordM[2])};
  const r=await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(place)}&format=json&limit=1&countrycodes=pt`);
  const d=await r.json();
  if(d.length) return {lat:parseFloat(d[0].lat),lon:parseFloat(d[0].lon),name:d[0].display_name.split(',')[0]};
  const r2=await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(place)}&format=json&limit=1`);
  const d2=await r2.json();
  if(d2.length) return {lat:parseFloat(d2[0].lat),lon:parseFloat(d2[0].lon),name:d2[0].display_name.split(',')[0]};
  throw new Error(`Local não encontrado: ${place}`);
}

async function osrmRoute(o,d) {
  const url=`https://router.project-osrm.org/route/v1/driving/${o.lon},${o.lat};${d.lon},${d.lat}?alternatives=true&overview=false&steps=false`;
  const r=await fetch(url);
  const data=await r.json();
  if(data.code!=='Ok') throw new Error('Erro no cálculo de rota OSRM');
  return data.routes.map((rt,i)=>({
    index:i,
    km:Math.round(rt.distance/1000),
    minutos:Math.round(rt.duration/60),
    horas:Math.round((rt.duration*1.2)/3600*4)/4, // +20% arredondado a 0.25h
    portEstimada:Math.round(rt.distance/1000*0.09*100)/100,
  }));
}

function PgFret({fret,setFret}) {
  const e0={nome:"",cli:"",orig:"",dest:"",mapsUrl:"",ki:"0",kv:"0",ti:"0",tv:"0",tc:"0",td2:"0",te:"0",cons:"0.32",pc:"1.58",pi:"0",pv:"0",outros:[],od:"",ov:"",preco:"0",ch:"0",tons:"0",priceMode:"frete",priceInput:"0"};
  const[f,setF]=useState(e0);
  const[show,setShow]=useState(false);
  const[loadingRoute,setLoadingRoute]=useState(false);
  const[routeModal,setRouteModal]=useState(null);
  const[routeError,setRouteError]=useState("");
  const[tonsModal,setTonsModal]=useState(false);
  const[tonsInput,setTonsInput]=useState("");

  function up(v) { setF(x=>({...x,...v})); }

  async function calcRoute() {
    if(!f.mapsUrl.trim()&&!f.orig.trim()&&!f.dest.trim()){setRouteError("Cola um link Google Maps ou preenche Origem e Destino.");return;}
    setLoadingRoute(true);setRouteError("");
    try {
      let oCoord=null, dCoord=null, origName=f.orig, destName=f.dest;
      if(f.mapsUrl.trim()){
        const parsed=await parseMapsUrl(f.mapsUrl.trim());
        if(!parsed){setRouteError("Não foi possível extrair dados do link. Usa um link completo google.com/maps/dir/...");setLoadingRoute(false);return;}
        if(parsed.origCoord&&parsed.destCoord){
          // Direct coordinates from URL — no geocoding needed
          oCoord=parsed.origCoord;
          dCoord=parsed.destCoord;
        } else {
          origName=parsed.orig;
          destName=parsed.dest;
        }
      }
      if(!oCoord||!dCoord){
        if(!origName||!destName){setRouteError("Preenche Origem e Destino.");setLoadingRoute(false);return;}
        const [oc,dc]=await Promise.all([geocodePlace(origName),geocodePlace(destName)]);
        oCoord=oc; dCoord=dc;
        origName=oc.name||origName; destName=dc.name||destName;
      }
      const routes=await osrmRoute(oCoord,dCoord);
      if(origName) up({orig:origName});
      if(destName) up({dest:destName});
      if(routes.length===1){applyRoute(routes[0]);}
      else{setRouteModal(routes);}
    } catch(e){setRouteError("Erro: "+e.message);}
    setLoadingRoute(false);
  }

  function applyRoute(rt) {
    up({
      ki:String(rt.km),kv:String(rt.km),
      ti:String(rt.horas),tv:String(rt.horas),
      pi:String(rt.portEstimada),pv:String(rt.portEstimada),
    });
    setRouteModal(null);
  }

  const c=useMemo(()=>{
    const ki=nv(f.ki), kv=nv(f.kv), kmC=ki+kv;
    const hC=nv(f.ti)+nv(f.tv)+nv(f.tc)+nv(f.td2)+nv(f.te);
    const lt=kmC*nv(f.cons), cCo=lt*nv(f.pc);
    const cPo=nv(f.pi)+nv(f.pv);
    const cOu=(f.outros||[]).reduce((s,o)=>s+nv(o.v),0);
    const cFi=hC*nv(f.ch);
    const tot=cFi+cCo+cPo+cOu;
    const tons=nv(f.tons);
    const pi=nv(f.priceInput);
    // Calculate preco based on mode
    let pr=0;
    if(f.priceMode==="frete") pr=pi;
    else if(f.priceMode==="hora") pr=pi*hC;
    else if(f.priceMode==="tonelada") pr=pi*tons;
    const mg=pr-tot, mgP=pr>0?mg/pr:0;
    const precoHora=hC>0?pr/hC:0;
    const precoTon=tons>0?pr/tons:0;
    return {kmC,ki,kv,hC,lt,cCo,cPo,cOu,cFi,tot,pr,mg,mgP,tons,
      precoHora,precoTon,precoFrete:pr,
      kP:ki>0?tot/ki:0,rH:hC>0?mg/hC:0,
      tImp:nv(f.tc)+nv(f.td2)+nv(f.te),pVaz:kmC>0?(kv/kmC)*100:0};
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
      {routeModal && (
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.7)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center"}}>
          <div style={{background:sf,border:`1px solid ${bd}`,borderRadius:12,padding:24,minWidth:400,maxWidth:500}}>
            <div style={{fontWeight:900,fontSize:16,color:ac,marginBottom:4}}>🗺️ Múltiplas Rotas Disponíveis</div>
            <p style={{fontSize:12,color:mu,marginBottom:16}}>Selecciona a rota a utilizar:</p>
            {routeModal.map((rt,i)=>(
              <div key={i} onClick={()=>applyRoute(rt)} style={{background:s2,border:`1px solid ${bd}`,borderRadius:8,padding:"12px 16px",marginBottom:8,cursor:"pointer",transition:"border-color .2s"}}
                onMouseOver={e=>e.currentTarget.style.borderColor=ac} onMouseOut={e=>e.currentTarget.style.borderColor=bd}>
                <div style={{fontWeight:700,color:tx,marginBottom:4}}>Rota {i+1}</div>
                <div style={{display:"flex",gap:20,fontSize:12}}>
                  <span>📏 <strong style={{color:bl}}>{rt.km} km</strong></span>
                  <span>⏱ <strong style={{color:ac}}>{rt.horas.toFixed(2)} h</strong> <span style={{color:mu}}>(+20%)</span></span>
                  <span>🛣️ Portagens est. <strong style={{color:pu}}>€ {rt.portEstimada.toFixed(2)}</strong></span>
                </div>
              </div>
            ))}
            <button style={{...BB,marginTop:8,fontSize:12,width:"100%"}} onClick={()=>setRouteModal(null)}>Cancelar</button>
          </div>
        </div>
      )}
      {show && (
        <div style={C}>
          <div style={{fontWeight:900,fontSize:20,color:ac,marginBottom:14}}>CALCULADORA DE FRETE</div>
          <div style={{fontSize:11,color:bl,textTransform:"uppercase",fontWeight:800,marginBottom:8,paddingBottom:4,borderBottom:`1px solid ${s2}`}}>🏷️ Identificação</div>
          <div style={G3}>
            <div><label style={LB}>Nome do Frete</label><input style={IN} value={f.nome} onChange={e=>up({nome:e.target.value})} placeholder="Lisboa → Porto #1"/></div>
            <div><label style={LB}>Cliente</label><input style={IN} value={f.cli} onChange={e=>up({cli:e.target.value})} placeholder="Empresa XYZ"/></div>
          </div>

          <div style={{background:"rgba(59,130,246,.06)",border:"1px solid rgba(59,130,246,.2)",borderRadius:8,padding:"12px 14px",marginBottom:12}}>
            <div style={{fontSize:11,color:bl,fontWeight:800,textTransform:"uppercase",marginBottom:8}}>🗺️ Calcular Rota Automaticamente</div>
            <div style={{display:"flex",gap:8,alignItems:"flex-end"}}>
              <div style={{flex:1}}>
                <label style={LB}>Link Google Maps (google.com/maps/dir/...)</label>
                <input style={IN} value={f.mapsUrl} onChange={e=>up({mapsUrl:e.target.value})} placeholder="https://www.google.com/maps/dir/Lisboa/Porto"/>
              </div>
              <button style={{...BA,whiteSpace:"nowrap",opacity:loadingRoute?.6:1}} disabled={loadingRoute} onClick={calcRoute}>
                {loadingRoute?"⏳ A calcular...":"🗺️ Calcular"}
              </button>
            </div>
            {routeError && <div style={{fontSize:11,color:rd,marginTop:6}}>⚠️ {routeError}</div>}
            <div style={{fontSize:10,color:mu,marginTop:6}}>
              Preenche Origem e Destino abaixo, ou cola um link completo do Google Maps. Portagens estimadas a €0.09/km (editável).
            </div>
          </div>

          <div style={G2}>
            <div><label style={LB}>Origem</label><input style={IN} value={f.orig} onChange={e=>up({orig:e.target.value})} placeholder="Lisboa"/></div>
            <div><label style={LB}>Destino</label><input style={IN} value={f.dest} onChange={e=>up({dest:e.target.value})} placeholder="Porto"/></div>
          </div>
          <div style={{fontSize:11,color:bl,textTransform:"uppercase",fontWeight:800,margin:"14px 0 8px",paddingBottom:4,borderBottom:`1px solid ${s2}`}}>📍 Distâncias (km)</div>
          <div style={G3}>
            <div><label style={LB}>KM Ida (carregado)</label><input style={IN} type="number" value={f.ki} onChange={e=>up({ki:e.target.value})}/></div>
            <div><label style={LB}>KM Volta (vazio) <span style={{color:mu,textTransform:"none",fontSize:9}}>= ida por defeito</span></label><input style={IN} type="number" value={f.kv} onChange={e=>up({kv:e.target.value})}/></div>
            <div><label style={LB}>Total Ciclo</label><input style={roSt} value={c.kmC+" km"} readOnly/></div>
          </div>
          <div style={{fontSize:11,color:bl,textTransform:"uppercase",fontWeight:800,margin:"14px 0 8px",paddingBottom:4,borderBottom:`1px solid ${s2}`}}>⏱ Tempos (horas — 1h30 = 1.5) · +20% já incluído na ida</div>
          <div style={G3}>
            <div><label style={LB}>Viagem Ida</label><input style={IN} type="number" step="0.25" value={f.ti} onChange={e=>up({ti:e.target.value})}/></div>
            <div><label style={LB}>Viagem Volta <span style={{color:mu,textTransform:"none",fontSize:9}}>= ida por defeito</span></label><input style={IN} type="number" step="0.25" value={f.tv} onChange={e=>up({tv:e.target.value})}/></div>
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
          <div style={{fontSize:10,color:mu,marginBottom:8}}>
            Valores estimados a €0.09/km (pesado classe 4). Editáveis.
            <a href="https://portagens.infraestruturasdeportugal.pt" target="_blank" rel="noreferrer" style={{color:bl,marginLeft:6}}>Calcular exacto →</a>
          </div>
          <div style={G3}>
            <div><label style={LB}>Portagens Ida (€)</label><input style={IN} type="number" step="0.01" value={f.pi} onChange={e=>up({pi:e.target.value})}/></div>
            <div><label style={LB}>Portagens Volta (€) <span style={{color:mu,textTransform:"none",fontSize:9}}>= ida por defeito</span></label><input style={IN} type="number" step="0.01" value={f.pv} onChange={e=>up({pv:e.target.value})}/></div>
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
          <div style={{fontSize:11,color:bl,textTransform:"uppercase",fontWeight:800,margin:"14px 0 8px",paddingBottom:4,borderBottom:`1px solid ${s2}`}}>⚖️ Carga</div>
          <div style={G3}>
            <div><label style={LB}>Toneladas</label><input style={IN} type="number" step="0.1" value={f.tons} onChange={e=>up({tons:e.target.value})} placeholder="0.0"/></div>
          </div>

          <div style={{fontSize:11,color:bl,textTransform:"uppercase",fontWeight:800,margin:"14px 0 8px",paddingBottom:4,borderBottom:`1px solid ${s2}`}}>💶 Preço ao Cliente</div>

          {tonsModal && (
            <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.7)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center"}}>
              <div style={{background:sf,border:`1px solid ${bd}`,borderRadius:12,padding:24,minWidth:320}}>
                <div style={{fontWeight:900,fontSize:15,color:ac,marginBottom:12}}>⚖️ Qual o peso da carga?</div>
                <label style={LB}>Toneladas</label>
                <input style={{...IN,fontSize:18,fontWeight:700}} type="number" step="0.1" value={tonsInput} onChange={e=>setTonsInput(e.target.value)} autoFocus/>
                <div style={{display:"flex",gap:8,marginTop:14}}>
                  <button style={BA} onClick={()=>{up({tons:tonsInput});setTonsModal(false);}}>✓ Confirmar</button>
                  <button style={{...BB,fontSize:12}} onClick={()=>setTonsModal(false)}>Sem peso</button>
                </div>
              </div>
            </div>
          )}

          <div style={{display:"flex",gap:8,marginBottom:12}}>
            {[["frete","€/Frete"],["hora","€/Hora"],["tonelada","€/Tonelada"]].map(([m,lb])=>(
              <button key={m} onClick={()=>up({priceMode:m,priceInput:"0"})} style={{padding:"7px 16px",borderRadius:7,fontSize:12,fontWeight:700,cursor:"pointer",border:`1px solid ${bd}`,background:f.priceMode===m?gn:s2,color:f.priceMode===m?"#000":mu}}>
                {lb}
              </button>
            ))}
          </div>

          <div style={G3}>
            <div>
              <label style={LB}>
                {f.priceMode==="frete"?"Preço Total (€)":f.priceMode==="hora"?"Preço por Hora (€/h)":"Preço por Tonelada (€/ton)"}
              </label>
              <input style={{...IN,color:gn,fontWeight:700,fontSize:16}} type="number" step="0.01" value={f.priceInput}
                onChange={e=>{
                  up({priceInput:e.target.value});
                  if(f.priceMode==="frete"&&nv(e.target.value)>0){
                    setTonsInput(f.tons||"");
                    if(!nv(f.tons)) setTonsModal(true);
                  }
                }}/>
            </div>
            <div><label style={LB}>Custo Total</label><input style={{...roSt,color:rd,fontWeight:700}} value={euro(c.tot)} readOnly/></div>
            <div><label style={LB}>Margem</label><input style={{...roSt,color:ac2,fontWeight:700}} value={euro(c.mg)+"  ("+pct(c.mgP)+")"} readOnly/></div>
          </div>

          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,padding:14,background:bg,borderRadius:10,border:`1px solid ${bd}`,margin:"14px 0"}}>
            {[
              ["€ / Frete",euro(c.precoFrete),gn],
              ["€ / Hora",c.hC>0?euro(c.precoHora):"—",bl],
              ["€ / Tonelada",c.tons>0?euro(c.precoTon):"—",ac],
              ["Custo/km carregado",euro(c.kP),or],
              ["KM Ciclo",c.kmC+" km",bl],
              ["Margem %",pct(c.mgP),ac2],
            ].map(([lb,vl,co])=>(
              <div key={lb} style={{textAlign:"center"}}>
                <div style={{fontSize:9,color:mu,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:3}}>{lb}</div>
                <div style={{fontSize:20,fontWeight:900,color:co}}>{vl}</div>
              </div>
            ))}
          </div>

          <div style={{background:"rgba(59,130,246,.05)",border:"1px solid rgba(59,130,246,.18)",borderRadius:10,padding:"12px 14px",marginBottom:14}}>
            <div style={{fontSize:11,fontWeight:800,color:bl,textTransform:"uppercase",marginBottom:8}}>🔍 Análise</div>
            {c.mgP<0 && <div style={{fontSize:12,color:rd,marginBottom:4}}>⚠️ Frete a prejuízo! Preço mínimo: {euro(c.tot)}</div>}
            {c.mgP>=0 && c.mgP<0.1 && <div style={{fontSize:12,color:ac,marginBottom:4}}>⚠️ Margem baixa ({pct(c.mgP)}). Considera renegociar.</div>}
            {c.mgP>=0.1 && <div style={{fontSize:12,color:gn,marginBottom:4}}>✅ Margem saudável: {pct(c.mgP)}</div>}
            {c.tons>0 && <div style={{fontSize:12,color:mu,marginBottom:4}}>⚖️ {c.tons} ton · <strong style={{color:tx}}>{euro(c.precoTon)}/ton</strong></div>}
            {c.hC>0 && <div style={{fontSize:12,color:mu,marginBottom:4}}>⏱ {c.hC.toFixed(2)}h · <strong style={{color:tx}}>{euro(c.precoHora)}/h</strong></div>}
            {c.kmC>0 && <div style={{fontSize:12,color:mu}}>🔄 Retorno vazio: <strong style={{color:tx}}>{c.pVaz.toFixed(1)}%</strong> dos km sem carga</div>}
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

function PgAnl({veic}) {
  const[tab,setTab]=useState("ptsa");
  const[search,setSearch]=useState("");
  const[sort,setSort]=useState("tot");
  const[order,setOrder]=useState("desc");

  const rows=useMemo(()=>{
    return CUSTOS2026.map(c=>{
      const v=veic.find(x=>x.numEquip===c.ne);
      return {...c,veiculo:v||null};
    }).filter(c=>
      !search ||
      c.ne.includes(search) ||
      c.mat.toLowerCase().includes(search.toLowerCase()) ||
      (c.veiculo?.tipo||"").toLowerCase().includes(search.toLowerCase())
    ).sort((a,b)=>order==="desc"?b[sort]-a[sort]:a[sort]-b[sort]);
  },[search,sort,order,veic]);

  const totGeral=rows.reduce((s,c)=>s+c.tot,0);
  const totMes=rows.reduce((s,c)=>s+c.mes,0);
  const totGas=rows.reduce((s,c)=>s+c.gas,0);
  const totRep=rows.reduce((s,c)=>s+c.rep,0);

  function Th2({col,label}){
    const active=sort===col;
    return <th onClick={()=>{if(active)setOrder(o=>o==="desc"?"asc":"desc");else{setSort(col);setOrder("desc");}}}
      style={{...TH,cursor:"pointer",color:active?ac:mu,userSelect:"none"}}>
      {label}{active?(order==="desc"?" ▼":" ▲"):""}
    </th>;
  }

  // PTSA rows
  const ptsaRows=useMemo(()=>CUSTOS_PTSA.map(c=>({...c,veiculo:veic.find(x=>x.numEquip===c.ne)||null}))
    .filter(c=>!search||c.ne.includes(search)||(c.veiculo?.matricula||"").toLowerCase().includes(search.toLowerCase()))
    .sort((a,b)=>order==="desc"?b[sort]-a[sort]:a[sort]-b[sort]),[search,sort,order,veic]);

  return (
    <div>
      <h2 style={{fontSize:28,fontWeight:900,margin:"0 0 4px"}}>Custos 2026</h2>
      <p style={{fontSize:13,color:mu,marginBottom:16}}>Período: 01/01/2026 — 30/04/2026</p>
      <div style={{display:"flex",gap:6,marginBottom:20}}>
        {[["dash","📊 Dashboard"],["ptsa","🚛 Pragosa Transportes"],["pesados","🏗️ Construções Pragosa"]].map(([id,lb])=>(
          <button key={id} onClick={()=>{setTab(id);setSearch("");setSort(id==="ptsa"?"med":"tot");}} style={{padding:"8px 18px",borderRadius:8,fontSize:13,fontWeight:700,cursor:"pointer",border:`1px solid ${bd}`,background:tab===id?bl:s2,color:tab===id?"#fff":mu}}>{lb}</button>
        ))}
      </div>

      {tab==="dash" && (() => {
        const TIPOS_DASH=["Trator","Semi-Reboque","Cisterna","Basculante Rígido","Carro Grua","Porta-Máquinas","Rígido Grua","Rígido Cola","Rígido Água","Reboque-Estrado","Porta-Sílos","Estrado"];

        // Pragosa Transportes (PTSA) — by tipo from V0
        const ptByTipo={};
        CUSTOS_PTSA.forEach(c=>{
          const v=veic.find(x=>x.numEquip===c.ne);
          if(!v) return;
          const t=v.tipo||"Outro";
          if(!ptByTipo[t]) ptByTipo[t]={count:0,totMes:0,totGas:0,totRep:0,totPess:0,totAmort:0};
          ptByTipo[t].count++;
          ptByTipo[t].totMes+=c.med;
          ptByTipo[t].totGas+=c.gas/4;
          ptByTipo[t].totRep+=c.rep/4;
          ptByTipo[t].totPess+=c.pess/4;
          ptByTipo[t].totAmort+=c.amort/4;
        });

        // Construções Pragosa (CUSTOS2026) — by tipo from V0
        const cpByTipo={};
        CUSTOS2026.forEach(c=>{
          const v=veic.find(x=>x.numEquip===c.ne);
          if(!v) return;
          const t=v.tipo||"Outro";
          if(!cpByTipo[t]) cpByTipo[t]={count:0,totMes:0,totGas:0,totRep:0,totPort:0};
          cpByTipo[t].count++;
          cpByTipo[t].totMes+=c.mes;
          cpByTipo[t].totGas+=c.gas/4;
          cpByTipo[t].totRep+=c.rep/4;
          cpByTipo[t].totPort+=c.port/4;
        });

        const allTipos=[...new Set([...Object.keys(ptByTipo),...Object.keys(cpByTipo)])].sort();

        return (
          <div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
              {/* Pragosa Transportes */}
              <div style={C}>
                <div style={{fontWeight:800,fontSize:15,color:bl,marginBottom:14}}>🚛 Pragosa Transportes — Custo Médio Mensal por Tipo</div>
                <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
                  <Th cols={["Tipo","Equip.","Média/mês","Gasóleo/m","Reparações/m","Pessoal/m","Amortiz./m"]}/>
                  <tbody>
                    {allTipos.filter(t=>ptByTipo[t]).map(t=>{
                      const d=ptByTipo[t];
                      const medEq=d.count>0?d.totMes/d.count:0;
                      return <tr key={t}>
                        <td style={TD}><Tipo t={t}/></td>
                        <td style={TD}>{d.count}</td>
                        <td style={{...TD,color:ac,fontWeight:700}}>{euro(medEq)}</td>
                        <td style={{...TD,color:or}}>{euro(d.totGas/d.count)}</td>
                        <td style={{...TD,color:rd}}>{euro(d.totRep/d.count)}</td>
                        <td style={TD}>{euro(d.totPess/d.count)}</td>
                        <td style={TD}>{euro(d.totAmort/d.count)}</td>
                      </tr>;
                    })}
                  </tbody>
                  <tfoot><tr style={{background:s2}}>
                    <td style={{...TD,fontWeight:700}} colSpan={2}>TOTAL</td>
                    <td style={{...TD,color:ac,fontWeight:800}}>{euro(Object.values(ptByTipo).reduce((s,d)=>s+d.totMes,0)/Math.max(Object.values(ptByTipo).reduce((s,d)=>s+d.count,0),1))}</td>
                    <td colSpan={4} style={TD}></td>
                  </tr></tfoot>
                </table>
              </div>

              {/* Construções Pragosa */}
              <div style={C}>
                <div style={{fontWeight:800,fontSize:15,color:ac,marginBottom:14}}>🏗️ Construções Pragosa — Custo Médio Mensal por Tipo</div>
                <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
                  <Th cols={["Tipo","Equip.","Média/mês","Gasóleo/m","Reparações/m","Portagens/m"]}/>
                  <tbody>
                    {allTipos.filter(t=>cpByTipo[t]).map(t=>{
                      const d=cpByTipo[t];
                      const medEq=d.count>0?d.totMes/d.count:0;
                      return <tr key={t}>
                        <td style={TD}><Tipo t={t}/></td>
                        <td style={TD}>{d.count}</td>
                        <td style={{...TD,color:ac,fontWeight:700}}>{euro(medEq)}</td>
                        <td style={{...TD,color:or}}>{euro(d.totGas/d.count)}</td>
                        <td style={{...TD,color:rd}}>{euro(d.totRep/d.count)}</td>
                        <td style={{...TD,color:pu}}>{euro(d.totPort/d.count)}</td>
                      </tr>;
                    })}
                  </tbody>
                  <tfoot><tr style={{background:s2}}>
                    <td style={{...TD,fontWeight:700}} colSpan={2}>TOTAL</td>
                    <td style={{...TD,color:ac,fontWeight:800}}>{euro(Object.values(cpByTipo).reduce((s,d)=>s+d.totMes,0)/Math.max(Object.values(cpByTipo).reduce((s,d)=>s+d.count,0),1))}</td>
                    <td colSpan={3} style={TD}></td>
                  </tr></tfoot>
                </table>
              </div>
            </div>
          </div>
        );
      })()}

      {tab==="ptsa" && (
        <>
          <div style={G4}>
            <Lbl t={["Equipamentos PTSA",ptsaRows.length,bl,CUSTOS_PTSA.filter(c=>c.folha==="CARROS").length+" carros · "+CUSTOS_PTSA.filter(c=>c.folha==="REBOQUES").length+" reboques"]}/>
            <Lbl t={["Total 4 meses",euro(ptsaRows.reduce((s,c)=>s+c.tot,0)),rd]}/>
            <Lbl t={["Média Mensal Total",euro(ptsaRows.reduce((s,c)=>s+c.med,0)),ac]}/>
            <Lbl t={["Gasóleo + Pessoal",euro(ptsaRows.reduce((s,c)=>s+c.gas+c.pess,0)),or]}/>
          </div>
          <div style={C}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12,gap:12}}>
              <strong style={{fontSize:13}}>{ptsaRows.length} equipamentos</strong>
              <input style={{...IN,width:260}} placeholder="Pesquisar nº equip, matrícula..." value={search} onChange={e=>setSearch(e.target.value)}/>
            </div>
            <div style={{overflowX:"auto"}}>
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
                <thead><tr>
                  <th style={TH}>Nº Equip</th><th style={TH}>Matrícula</th><th style={TH}>Tipo</th><th style={TH}>Folha</th>
                  <th style={{...TH,color:bl}}>JAN</th><th style={{...TH,color:bl}}>FEV</th><th style={{...TH,color:bl}}>MAR</th><th style={{...TH,color:bl}}>ABR</th>
                  <Th2 col="tot" label="Total 4M"/><Th2 col="med" label="Média/mês"/>
                  <Th2 col="gas" label="Gasóleo"/><Th2 col="rep" label="Reparações"/>
                  <Th2 col="pess" label="Pessoal"/><Th2 col="amort" label="Amortiz."/>
                </tr></thead>
                <tbody>
                  {ptsaRows.map(c=>{
                    const matched=!!c.veiculo;
                    return <tr key={c.ne} style={{background:matched?"":"rgba(239,68,68,.04)"}}>
                      <td style={TD}><strong style={{color:matched?ac:mu}}>{c.ne}</strong></td>
                      <td style={TD}><strong>{c.veiculo?.matricula||"—"}</strong></td>
                      <td style={TD}>{c.veiculo?<Tipo t={c.veiculo.tipo}/>:<span style={{fontSize:9,color:mu}}>não mapeado</span>}</td>
                      <td style={TD}><span style={{fontSize:9,color:mu}}>{c.folha}</span></td>
                      <td style={{...TD,color:bl}}>{c.mt.jan?euro(c.mt.jan):"—"}</td>
                      <td style={{...TD,color:bl}}>{c.mt.fev?euro(c.mt.fev):"—"}</td>
                      <td style={{...TD,color:bl}}>{c.mt.mar?euro(c.mt.mar):"—"}</td>
                      <td style={{...TD,color:bl}}>{c.mt.abr?euro(c.mt.abr):"—"}</td>
                      <td style={{...TD,color:rd,fontWeight:700}}>{euro(c.tot)}</td>
                      <td style={{...TD,color:ac,fontWeight:700}}>{euro(c.med)}</td>
                      <td style={{...TD,color:or}}>{c.gas>0?euro(c.gas):"—"}</td>
                      <td style={{...TD,color:rd}}>{c.rep>0?euro(c.rep):"—"}</td>
                      <td style={TD}>{c.pess>0?euro(c.pess):"—"}</td>
                      <td style={TD}>{c.amort>0?euro(c.amort):"—"}</td>
                    </tr>;
                  })}
                </tbody>
                <tfoot><tr style={{background:s2}}>
                  <td style={{...TD,fontWeight:700}} colSpan={4}>TOTAL</td>
                  <td style={{...TD,color:bl,fontWeight:700}}>{euro(ptsaRows.reduce((s,c)=>s+(c.mt.jan||0),0))}</td>
                  <td style={{...TD,color:bl,fontWeight:700}}>{euro(ptsaRows.reduce((s,c)=>s+(c.mt.fev||0),0))}</td>
                  <td style={{...TD,color:bl,fontWeight:700}}>{euro(ptsaRows.reduce((s,c)=>s+(c.mt.mar||0),0))}</td>
                  <td style={{...TD,color:bl,fontWeight:700}}>{euro(ptsaRows.reduce((s,c)=>s+(c.mt.abr||0),0))}</td>
                  <td style={{...TD,color:rd,fontWeight:800}}>{euro(ptsaRows.reduce((s,c)=>s+c.tot,0))}</td>
                  <td style={{...TD,color:ac,fontWeight:800}}>{euro(ptsaRows.reduce((s,c)=>s+c.med,0))}</td>
                  <td style={{...TD,color:or,fontWeight:700}}>{euro(ptsaRows.reduce((s,c)=>s+c.gas,0))}</td>
                  <td style={{...TD,color:rd,fontWeight:700}}>{euro(ptsaRows.reduce((s,c)=>s+c.rep,0))}</td>
                  <td style={{...TD,fontWeight:700}}>{euro(ptsaRows.reduce((s,c)=>s+c.pess,0))}</td>
                  <td style={{...TD,fontWeight:700}}>{euro(ptsaRows.reduce((s,c)=>s+c.amort,0))}</td>
                </tr></tfoot>
              </table>
            </div>
            <div style={{fontSize:10,color:mu,marginTop:8}}>▼ clica nos cabeçalhos para ordenar · <span style={{color:rd}}>rosa</span> = não mapeado na app</div>
          </div>
        </>
      )}

      {tab==="pesados" && (<>
      <div style={G4}>
        <Lbl t={["Custo Total 4 meses",euro(totGeral),rd]}/>
        <Lbl t={["Custo Médio/mês",euro(totMes),ac,"por equipamento: "+euro(totMes/Math.max(rows.length,1))]}/>
        <Lbl t={["Gasóleo Total",euro(totGas),or,pct(totGeral>0?totGas/totGeral:0)+" do total"]}/>
        <Lbl t={["Reparações Total",euro(totRep),"#ef4444",pct(totGeral>0?totRep/totGeral:0)+" do total"]}/>
      </div>

      <div style={C}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12,gap:12}}>
          <strong style={{fontSize:13}}>{rows.length} registos</strong>
          <input style={{...IN,width:260}} placeholder="Pesquisar nº equip, matrícula, tipo..." value={search} onChange={e=>setSearch(e.target.value)}/>
        </div>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
            <thead>
              <tr>
                <th style={TH}>Nº Equip</th>
                <th style={TH}>Matrícula</th>
                <th style={TH}>Tipo</th>
                <Th2 col="port" label="Portagens"/>
                <Th2 col="seg" label="Seguros"/>
                <Th2 col="fin" label="Financ."/>
                <Th2 col="amort" label="Amortiz."/>
                <Th2 col="rep" label="Reparações"/>
                <Th2 col="out" label="Outros"/>
                <Th2 col="gas" label="Gasóleo"/>
                <Th2 col="tot" label="Total 4M"/>
                <Th2 col="mes" label="€/mês"/>
                <Th2 col="h" label="€/hora"/>
              </tr>
            </thead>
            <tbody>
              {rows.map(c=>{
                const matched=!!c.veiculo;
                return (
                  <tr key={c.ne} style={{background:matched?"":"rgba(239,68,68,.04)"}}>
                    <td style={TD}><strong style={{color:matched?ac:mu}}>{c.ne}</strong></td>
                    <td style={TD}><strong>{c.mat}</strong></td>
                    <td style={TD}>{c.veiculo?<Tipo t={c.veiculo.tipo}/>:<span style={{fontSize:9,color:mu}}>não mapeado</span>}</td>
                    <td style={{...TD,color:pu}}>{c.port>0?euro(c.port):"—"}</td>
                    <td style={TD}>{c.seg>0?euro(c.seg):"—"}</td>
                    <td style={TD}>{c.fin>0?euro(c.fin):"—"}</td>
                    <td style={TD}>{c.amort>0?euro(c.amort):"—"}</td>
                    <td style={{...TD,color:rd}}>{c.rep>0?euro(c.rep):"—"}</td>
                    <td style={TD}>{c.out>0?euro(c.out):"—"}</td>
                    <td style={{...TD,color:or}}>{c.gas>0?euro(c.gas):"—"}</td>
                    <td style={{...TD,fontWeight:700,color:ac}}>{euro(c.tot)}</td>
                    <td style={{...TD,color:gn,fontWeight:600}}>{euro(c.mes)}</td>
                    <td style={{...TD,color:bl,fontWeight:600}}>€ {c.h.toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr style={{background:s2}}>
                <td style={{...TD,fontWeight:700,color:tx}} colSpan={3}>TOTAL</td>
                <td style={{...TD,color:pu,fontWeight:700}}>{euro(rows.reduce((s,c)=>s+c.port,0))}</td>
                <td style={{...TD,fontWeight:700}}>{euro(rows.reduce((s,c)=>s+c.seg,0))}</td>
                <td style={{...TD,fontWeight:700}}>{euro(rows.reduce((s,c)=>s+c.fin,0))}</td>
                <td style={{...TD,fontWeight:700}}>{euro(rows.reduce((s,c)=>s+c.amort,0))}</td>
                <td style={{...TD,color:rd,fontWeight:700}}>{euro(rows.reduce((s,c)=>s+c.rep,0))}</td>
                <td style={{...TD,fontWeight:700}}>{euro(rows.reduce((s,c)=>s+c.out,0))}</td>
                <td style={{...TD,color:or,fontWeight:700}}>{euro(rows.reduce((s,c)=>s+c.gas,0))}</td>
                <td style={{...TD,color:ac,fontWeight:800}}>{euro(totGeral)}</td>
                <td style={{...TD,color:gn,fontWeight:700}}>{euro(totMes)}</td>
                <td style={{...TD,color:bl,fontWeight:700}}>€ {(totGeral/(4*198)).toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
        <div style={{fontSize:10,color:mu,marginTop:8}}>
          ▼ clica nos cabeçalhos para ordenar · equipamentos a rosa não estão mapeados na app
        </div>
      </div>
      </>)}
    </div>
  );
}
