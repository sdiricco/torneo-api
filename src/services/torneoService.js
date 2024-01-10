const axios = require("axios");
const cheerio = require("cheerio");
const constants = require("../constants")


const CALCIO_A_5_CLASSIFICA_POGGIO_TETTO_GIRONE_D = 'http://www.aicslucca.com/homegirone.php?id=514'
const CALCIO_A_5_MARCATORI_POGGIO_TETTO_GIRONE_D = 'http://www.aicslucca.com/marcatori.php?id_girone=514'

const CALCIO_A_5_CLASSIFICA_POGGIO_TETTO_GIRONE_SERIE_B = 'https://www.aicslucca.com/homegirone.php?id=581'
const CALCIO_A_5_MARCATORI_POGGIO_TETTO_GIRONE_SERIE_B = 'https://www.aicslucca.com/marcatori.php?id_girone=581'

const getTournaments = () => {
  return [
    {
      name: 'Calcio a 5 - Poggio / Tetto - Girone D',
      url:{
        standing: CALCIO_A_5_CLASSIFICA_POGGIO_TETTO_GIRONE_D,
        playersScore: CALCIO_A_5_MARCATORI_POGGIO_TETTO_GIRONE_D
      }
    },
    {
      name: 'Calcio a 5 - Poggio / Tetto - Girone serie B',
      url:{
        standing: CALCIO_A_5_CLASSIFICA_POGGIO_TETTO_GIRONE_SERIE_B,
        playersScore: CALCIO_A_5_MARCATORI_POGGIO_TETTO_GIRONE_SERIE_B
      }
    },
  ]
}

const getStandings = async () => {
  try {
    const rawTable = await scrapeTableFromAICSWebSite(CALCIO_A_5_CLASSIFICA_POGGIO_TETTO_GIRONE_SERIE_B);
    return rawTableToConvertedTable(rawTable, constants.standingsTableTranslation);
  } catch (error) {
    throw error;
  }
};

const getPlayers = async () => {
  try {
    const rawTable =  await scrapeTableFromAICSWebSite(CALCIO_A_5_MARCATORI_POGGIO_TETTO_GIRONE_SERIE_B);
    const transformedData = rawTable.map(item => {
      const firstName = item.Nome.trim();
      const lastName = item.Cognome.trim();
      const team = item.Squadra.trim();
      const goal = item["Goal\n\t      Fatti"].replace(/\n|\t/g, "").trim();
    
      return {
        firstName,
        lastName,
        team,
        goal
      };
    });
    return transformedData;
  } catch (error) {
    throw error;
  }
};


async function scrapeTableFromAICSWebSite(url) {
  const response = await axios.get(url);
  const html = response.data;
  // Ora puoi utilizzare cheerio per estrarre la tabella
  const $ = cheerio.load(html);
  const divSezione = $(".sezione");
  const table = divSezione.find("table").first();
  // Array per memorizzare gli oggetti della tabella
  return htmlTableToJson($, table)
}


function rawTableToConvertedTable(rawTable, translation) {
  const result = [];

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
  return result;
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
  getTournaments,
  getStandings,
  getPlayers,
};
