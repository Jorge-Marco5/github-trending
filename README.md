# GitHub Trending

CLI para ver repositorios populares de GitHub

## Clonación

```bash
git clone <url del repositorio>
```

## Instalación

```bash
npm install
```

## Uso

```bash
trending-repos [opciones]
```

### Opciones

- `-d, --duration <duration>`: Rango de tiempo (day, week, month, year). Por defecto: week
- `-l, --limit <limit>`: Cantidad de repositorios a mostrar. Por defecto: 30

## Ejemplo

```bash
trending-repos --duration month --limit 20
```

## Licencia

[MIT](LICENSE)
