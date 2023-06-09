
const axios = require("axios");
const cheerio = require("cheerio");

const getStandings = async () => {
  try {
    const rawTable = await scrapeStandingsTableFromAICSWebSite();
    return rawTableToConvertedTable(rawTable);
  } catch (error) {
    throw error;
  }
};


async function scrapeStandingsTableFromAICSWebSite(){
  const response = await axios.get("http://www.aicslucca.com/homegirone.php?id=514")
  const html = response.data;
  // Ora puoi utilizzare cheerio per estrarre la tabella
  const $ = cheerio.load(html);
  const divSezione = $(".sezione");
  const table = divSezione.find("table").first();
  // Array per memorizzare gli oggetti della tabella
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

  return tableData
}

function rawTableToConvertedTable(rawTable){
  const result = [];

  const translation = {
    "Nome": "name",
    "Punti": "points",
    "Giocate": "matches",
    "Vinte": "won_matches",
    "Pareggiate": "drawn_matches",
    "Perse": "lost_matches",
    "Goal Fatti": "goals_scored",
    "Goal Subiti": "goals_conceded",
    "Coppa Disciplina": "fair_play"
  };
  
  for (const item of rawTable) {
    const translatedItem = {};
    for (const key in item) {
      if (translation.hasOwnProperty(key)) {
        const translatedKey = translation[key];
        translatedItem[translatedKey] = String(item[key]);
      }
    }
    result.push(translatedItem);
  }
  return result
}

module.exports = {
  getStandings,
};


