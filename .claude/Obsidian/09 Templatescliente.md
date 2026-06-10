---
tipo: cliente
estado: ativo
setor:
responsável:
---

# {{title}}

## Resumo

## Contactos

## Pessoas relacionadas

## Projetos

## Reuniões

```dataview
TABLE data, projeto
FROM "02 Reuniões"
WHERE cliente = this.file.link
SORT data DESC
```

## Decisões

```dataview
LIST
FROM "90 Decisões"
WHERE contains(clientes, this.file.link)
```