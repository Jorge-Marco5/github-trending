# GitHub Trending

CLI para ver repositorios populares de GitHub

## Requisitos

- Node.js (>= 16.0.0)
- npm (>= 7.0.0)
- pnpm (>= 7.0.0)

## Tecnologías

- Node.js
- npm
- pnpm
- axios
- dayjs
- dotenv
- cli-table3
- chalk

## Clonación

```bash
git clone <url del repositorio>
```

## Instalación

```bash
pnpm install
```

## Para instalar globalmente:

```bash
pnpm link --global
```

## Uso

```bash
trending-repos [opciones]
```

### Opciones

- `-d, --duration <duration>`: Rango de tiempo (day, week, month, year). Por defecto: week
- `-l, --limit <limit>`: Cantidad de repositorios a mostrar. Por defecto: 30
- `-t, --to <typeout>`: Tipo de salida (table, list). Por defecto: table

## Ejemplo

```bash
trending-repos --duration month --limit 20 --to list
```

## Licencia

[MIT](LICENSE)
