# Protocolo de auto-avaliação diária — v1 (proposta)

## Porquê

O Garmin mede o que o corpo faz. Não mede o que **tu** sentes. As duas coisas
divergem com frequência, e é precisamente na divergência que está a informação
útil:

| Situação | Leitura |
|---|---|
| HRV bom + sentes-te esgotada | a fadiga é mental/emocional, não fisiológica — treinar pode até ajudar |
| HRV mau + sentes-te bem | risco de te enterrares num treino duro sem dares por isso |
| Ambos maus | descanso, sem discussão |
| Ambos bons | luz verde para carga |

Um assistente que só olhe para o relógio erra nos dois primeiros casos, que
são os mais interessantes.

## Desenho

Baseado em dois instrumentos com validação em ciência do desporto:

- **Índice de Hooper** — questionário de bem-estar (sono, fadiga, dores,
  stress). Sensível a sobrecarga antes de ela aparecer na performance.
- **sRPE (Foster)** — carga interna = esforço percebido × duração. Capta o
  custo real da sessão, que a FC sozinha não capta (trabalho de força,
  calor, fadiga acumulada).

### Regras de desenho

1. **Menos de 60 segundos por dia, dividido em dois momentos.** Um protocolo
   que demora demasiado é abandonado à terceira semana. Adesão vale mais que
   granularidade.
2. **Todas as escalas no mesmo sentido: 5 = melhor estado.** Evita erros de
   preenchimento em piloto automático.
3. **Âncoras verbais em cada ponto**, não só números — "3" não quer dizer nada;
   "Razoável" quer.
4. **Registar antes de ver os dados do Garmin.** Se vires primeiro que o HRV
   está mau, contaminas a tua perceção. O check-in da manhã vem primeiro.

## Itens

### Manhã — ao acordar

| Item | Porquê está cá |
|---|---|
| Qualidade do sono | a perceção diverge do score do relógio com frequência; é o desvio que interessa |
| Energia ao acordar | melhor preditor isolado de prontidão |
| Dores musculares | recuperação do treino anterior |
| Vontade de treinar | quebra na motivação é sinal precoce de sobrecarga |

### Noite — ao deitar

| Item | Porquê está cá |
|---|---|
| Carga mental do trabalho | é a tua variável dominante — obra, frota, reuniões |
| Stress percebido | complementa o stress medido pelo relógio |
| Alimentação | fator de confusão mais comum em desvios de HRV |
| Treino: duração + RPE | carga interna real da sessão |
| Fatores do dia | álcool, cafeína, viagem, ciclo menstrual — explicam desvios |
| Nota livre | tudo o que os números não captam |

### Sintomas — o travão (v1.1, acrescentado a 2026-07-19)

Estes dois itens **não entram** no cálculo da prontidão. São uma barreira
independente, e foi de propósito.

| Item | Porquê está cá |
|---|---|
| Ciático / posterior de coxa e glúteo | a lesão em recuperação — formigueiro, ardor, "linha" a descer a perna |
| Tendões | ponto fraco histórico; a rigidez matinal é o sinal precoce |

**Porque não entram na prontidão:** se entrassem, uma média de 7 itens bons
diluiria um sintoma grave e devolveria um número tranquilizador. O caso
perigoso é exatamente esse — sentires-te óptima com o nervo a dar sinal, que é
a condição em que uma lesão de nervo se agrava. Por isso os sintomas
**vetam** a prontidão em vez de a compor.

**Prontidão subjetiva** = média dos 7 itens de bem-estar (sintomas excluídos),
convertida para 0–100.

## O que fazer com isto

Ao fim de **3 semanas** há dados suficientes para:

- estabelecer a tua linha de base (não normas de população — a tua)
- calcular a correlação entre prontidão subjetiva e HRV
- identificar quais fatores mais te afetam o sono e a recuperação
- ajustar o plano de treino a padrões reais em vez de suposições

Antes das 3 semanas, qualquer conclusão é ruído.

## Aberto a decisão

Itens que ficaram **de fora** da v1 e podem entrar se fizerem sentido:

- **Hidratação** — importante, mas difícil de estimar com honestidade
- **Peso** — só se houver objetivo de composição corporal
- **Dor específica** (joelho, lombar) — a acrescentar se houver histórico
- **Humor / disposição** — sobrepõe-se ao stress; junto os dois?

O protocolo é para ser revisto ao fim de um mês de uso real.
