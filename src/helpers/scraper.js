const axios = require("axios");
const cheerio = require("cheerio");
const {AICS_BASE_URL} = require("../constants/index")


async function scrapeWebSite(url) {
  const response = await axios.get(url);
  const html = response.data;
  // Ora puoi utilizzare cheerio per estrarre la tabella
  return cheerio.load(html);
}

async function scrapeHRefsTournaments(url, currentPath = '') {
  console.log("url", url);
  console.log("currentPath", currentPath);
  const $ = await scrapeWebSite(url);
  const data = [];

  const elements = $(".sezione ul li a");
  for (let i = 0; i < elements.length; i++) {
    const element = elements[i];
    const text = $(element).text().trim();
    const href = $(element).attr("href");
    const newPath = `${currentPath}>${text}`;
  
    // Se l'href soddisfa la condizione di stop, aggiungi solo l'ultimo livello
    if (href.includes("homegirone")) {
      data.push({ text, href, path: newPath });
    } else {
      // Altrimenti, effettua la ricorsione con il nuovo URL e il percorso aggiornato
      const elems = await scrapeHRefsTournaments(`${AICS_BASE_URL}/${href}`, newPath);
      data.push(...elems);
    }
  }

  return data;
}

async function scrapeHRefsFrommAICSWebSite(url) {
  const $ = await scrapeWebSite(url);
  const container = $(".sezione");
  // Seleziona il primo elemento h2 all'interno della sezione
  const firstH2 = container.find("h2").first();
  // Trova tutti i link all'interno del primo h2
  const links = firstH2.find("a");
  const linkData = links
    .map((index, element) => {
      const href = $(element).attr("href");
      const text = $(element).text();
      return { href, text };
    })
    .get();
  return linkData;
}

async function scrapeHRefsTeamsFrommAICSWebSite(url) {
  const $ = await scrapeWebSite(url);
  const container = $(".sezione");
  // Trova tutti i link all'interno del primo h2
  const links = container.find("p");
  const linkData = links
    .map((index, element) => {
      const hrefElem = $(element).find("a");
      const href = $(hrefElem).attr("href");
      const text = $(hrefElem).text().trim();
      return { href, text };
    })
    .get();
  return linkData;
}

async function scrapeTableFromAICSWebSite(url, idx = 0) {
  const $ = await scrapeWebSite(url);
  const container = $(".sezione");
  const table = container.find("table").eq(idx);
  // Array per memorizzare gli oggetti della tabella
  return htmlTableToJson($, table);
}

function htmlTableToJson($, table) {
  const tableData = [];

  // Ottieni le righe della tabella
  const rows = table.find("tr");

  // Ottieni i valori della prima riga come chiavi
  const keys = [];
  rows
    .first()
    .find("td")
    .each((index, element) => {
      keys.push($(element).text().trim());
    });

  // Crea gli oggetti corrispondenti
  rows.slice(1).each((rowIndex, rowElement) => {
    const rowData = {};
    const columns = $(rowElement).find("td");

    columns.each((colIndex, colElement) => {
      const columnName = keys[colIndex] || `col${colIndex + 1}`;
      const columnData = $(colElement).text().trim();
      rowData[columnName] = columnData;
    });

    tableData.push(rowData);
  });

  return tableData;
}

module.exports = {
  scrapeHRefsTeamsFrommAICSWebSite,
  scrapeHRefsFrommAICSWebSite,
  scrapeTableFromAICSWebSite,
  scrapeHRefsTournaments
};
