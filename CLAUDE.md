# CLAUDE — Instruções Permanentes

## Idioma
Responder sempre em Português de Portugal.

## Contexto da Empresa
Ler sempre [[.claude/Obsidian/00 Sistema/CLAUDE.md]] antes de responder.

**Construções Pragosa, S.A.** — empresa de construção civil e obras públicas.
- Áreas: Construções · Indústria (pedreiras) · Cisternas · Combustíveis/Frota · Manutenções
- Utilizadora: Diretora de Logística — gestão operacional de frota, pedreiras, obras e projetos internos

## Vault Obsidian
Localização: `.claude/Obsidian/`

### Estrutura
```
00 Sistema/     → CLAUDE.md, Empresa, Processos, Áreas
01 Diário/      → notas diárias GTD (YYYY-MM-DD.md)
02 Reuniões/    → uma nota por reunião
03 Pessoas/     → uma nota por pessoa
04 Obras e Clientes/  → uma nota por obra/cliente
05 Projetos/    → projetos internos
06 Operações/   → áreas operacionais
07 Estratégia/  → OKRs, planeamento
08 Conhecimento/ → logística, frota, mercado
09 Templates/   → templates a usar
Dashboard.md    → home page
```

### Regras ao criar notas
- Usar sempre frontmatter YAML com `tipo`, `data`, `tags`
- Criar links internos `[[ ]]` para pessoas, obras, projetos e reuniões relacionados
- Tarefas em formato `- [ ] tarefa`
- Decisões com `> [!decision]`
- Seguir template da pasta `09 Templates/` correspondente

### Templates disponíveis
| Tipo | Ficheiro |
|------|---------|
| Reunião | `09 Templates/reunião.md` |
| Pessoa | `09 Templates/pessoa.md` |
| Obra / Cliente | `09 Templates/obra e cliente.md` |
| Projeto | `09 Templates/projeto.md` |

## Estilo de resposta
- Objetivo, direto, estruturado
- Tabelas quando útil
- Identificar riscos e priorizar ações
