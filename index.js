#!/usr/bin/env node
const axios = require("axios");
const dayjs = require("dayjs");
const dotenv = require("dotenv");
const Table = require("cli-table3");
const chalk = require("chalk");

dotenv.config();

const { Command } = require("commander");

const program = new Command();

const getStartDate = (duration) => {
  const now = dayjs();

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
  .option("-t, --typeout <type_output>", "Tipo de salida: table, list", "table")
  .action((options) => {
    fetchTrendingRepos(options.duration, options.limit, options.typeout);
  });

program.parse(process.argv);

async function tableOutput(items) {
  const table = new Table({
    head: ["#", "Nombre", "Descripción", "Lenguaje", "Stars", "URL"],
    colWidths: [5, 20, 30, 10, 10, 80],
    wordWrap: true,
    style: { head: ["cyan"], border: ["cyan"] },
  });

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
}

async function listOutput(items) {
  let counter = 1;
  items.forEach((item) => {
    console.log(
      chalk.yellow(counter) +
        " " +
        chalk.bold.bgBlack(item.name) +
        " " +
        chalk.yellow("★ " + item.stargazers_count) +
        " " +
        chalk.cyan("■ " + item.language) +
        " " +
        chalk.white("| " + item.description) +
        "\n"
    );
    console.log(chalk.white(item.html_url));
    console.log("\n");
    counter++;
  });
}

async function fetchTrendingRepos(duration, limit, type_output) {
  const startDate = getStartDate(duration);
  console.log(
    chalk.bold.bgBlack(
      `\n GitHub Trending CLI | Top ${limit} · ${startDate} \n`
    )
  );
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

    switch (type_output) {
      case "table":
        tableOutput(items);
        break;
      case "list":
        listOutput(items);
        break;
      default:
        console.warn(
          chalk.yellow(
            `Tipo de salida desconocido: "${type_output}". Usando "table" por defecto.`
          )
        );
        tableOutput(items);
        break;
    }
  } catch (error) {
    console.error(chalk.red("Error al buscar repositorios:"), error.message);
  }
}
