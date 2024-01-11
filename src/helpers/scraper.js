const axios = require("axios");
const cheerio = require("cheerio");

async function scrapeTableFromAICSWebSite(url) {
  const response = await axios.get(url);
  const html = response.data;
  // Ora puoi utilizzare cheerio per estrarre la tabella
  const $ = cheerio.load(html);
  const divSezione = $(".sezione");
  const table = divSezione.find("table").first();
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
  scrapeTableFromAICSWebSite,
};
