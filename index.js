#!/usr/bin/env node
const axios = require("axios");
const dayjs = require("dayjs"); // Muy útil para las fechas
const dotenv = require("dotenv");
const Table = require("cli-table3");

dotenv.config();

const { Command } = require("commander");

const program = new Command();

const getStartDate = (duration) => {
  const now = dayjs(); // La fecha de hoy

  switch (duration) {
    case "day":
      return now.subtract(1, "day").format("YYYY-MM-DD");
    case "week":
      return now.subtract(7, "day").format("YYYY-MM-DD");
    case "month":
      return now.subtract(1, "month").format("YYYY-MM-DD");
    case "year":
      return now.subtract(1, "year").format("YYYY-MM-DD");
    default:
      return now.subtract(1, "week").format("YYYY-MM-DD");
  }
};

program
  .name("trending-repos")
  .description("CLI para ver repositorios populares de GitHub")
  .version("1.0.0")
  .option(
    "-d, --duration <duration>",
    "Rango de tiempo: day, week, month, year",
    "week"
  )
  .option("-l, --limit <limit>", "Cantidad de repositorios a mostrar", "10")
  .action((options) => {
    fetchTrendingRepos(options.duration, options.limit);
  });

program.parse(process.argv);

async function fetchTrendingRepos(duration, limit) {
  const table = new Table({
    head: ["#", "Nombre", "Descripción", "Lenguaje", "Stars", "URL"],
    colWidths: [5, 20, 30, 10, 10, 80], // Ajusta los anchos según veas necesario
    wordWrap: true, // Esto ayuda a que el texto largo baje de línea automáticamente
    style: { head: ["cyan"], border: ["esmerald"] }, // Colores opcionales
  });

  console.log(`Buscando ${limit} repositorios de la última ${duration}...`);
  const startDate = getStartDate(duration);
  try {
    const response = await axios.get(
      `https://api.github.com/search/repositories?q=created:>=${startDate}&per_page=${limit}&sort=stars&order=desc`,
      {
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_ACCESS_TOKEN}`,
        },
      }
    );
    const items = response.data.items;

    let counter = 1;
    items.forEach((item) => {
      table.push([
        counter,
        item.name,
        item.description,
        item.language,
        item.stargazers_count,
        item.html_url,
      ]);
      counter++;
    });
    console.log(table.toString());
  } catch (error) {
    console.error("Error al buscar repositorios:", error);
  }
}
