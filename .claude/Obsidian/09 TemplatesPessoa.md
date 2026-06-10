---
tipo: pessoa
empresa:
cargo:
email:
telefone:
---

# {{title}}

## Função

## Reuniões

```dataview
TABLE data
FROM "02 Reuniões"
WHERE contains(participantes, this.file.link)
SORT data DESC
```

## Projetos

## Notas