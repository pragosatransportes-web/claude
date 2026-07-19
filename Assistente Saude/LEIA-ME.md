# Assistente de Saúde

Painel local que junta os dados do Garmin Connect ao teu check-in diário
subjetivo. Nada sai do teu computador.

## Arranque (uma vez)

1. **Credenciais** — copia `.env.exemplo` para `.env` e preenche com o teu
   email e password do Garmin Connect.
   O `.env` está no `.gitignore`: nunca vai para o repositório e o assistente
   não precisa de ver estes valores.

2. **Histórico inicial** — traz os últimos 12 meses de uma vez:
   ```
   sync.bat 365
   ```
   O primeiro login pode pedir código de verificação por email.

## Uso diário

| Quero | Faço |
|---|---|
| Atualizar dados | duplo-clique em `sync.bat` (traz os últimos 14 dias) |
| Abrir o painel | duplo-clique em `abrir.bat` |
| Registar o dia | separador **Check-in diário** — manhã e noite |

O `abrir.bat` arranca um servidor local na porta 8777 e abre o browser.
Fecha a janela preta quando acabares.

## O que está lá dentro

- **Check-in diário** — protocolo de auto-avaliação + semáforo (ver `PROTOCOLO.md`)
- **Painel** — sono, HRV, FC em repouso, e o cruzamento subjetivo × objetivo
- **Treinos** — sessões e carga semanal vindas do Garmin
- **Plano** — fase e semana atuais, semana-tipo, progressão (ver `PLANO.md`)

## Onde ficam os dados

| Ficheiro | O quê |
|---|---|
| `dados/garmin.json` | tudo o que veio do Garmin |
| `localStorage` do browser | os teus check-ins |

Os check-ins vivem no browser. **Exporta-os de vez em quando** (botão
*Exportar tudo*) — limpar os dados do browser apaga-os.

## Privacidade

Esta pasta está dentro do OneDrive **da empresa**. O `.gitignore` impede que
os dados de saúde e as credenciais entrem no repositório, mas o OneDrive
sincroniza-os na mesma para a conta de trabalho. Se preferires manter isto
fora da infraestrutura da empresa, move a pasta `Assistente Saude` para um
local pessoal — a app funciona igual em qualquer sítio.

## Limites

Isto é uma ferramenta de acompanhamento, não um instrumento clínico.
Nenhuma métrica aqui diagnostica seja o que for. Valores persistentemente
fora do teu normal — FC em repouso, HRV, SpO2 — são motivo para consulta
médica, não para autointerpretação.
