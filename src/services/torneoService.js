const {
  AICS_BASE_URL,
  AICS_FUTSAL_TOURNAMENTS,
  AICS_PLAYERS_RANKING_KEY_MAPPING,
  AICS_TEAMS_RANKING_KEY_MAPPING,
  AICS_LAST_RESULTS_KEY_MAPPING,
  AICS_MATCH_RESULTS_KEY_MAPPING,
  AICS_NEXT_MATCHES_KEY_MAPPING,
  AICS_SUSPANSIONS_KEY_MAPPING,
  AICS_WARNINGS_KEY_MAPPING,
  AICS_SPECIAL_MEASURES_KEY_MAPPING,
} = require("../constants");
const { scrapeTableFromAICSWebSite, scrapeHRefsFrommAICSWebSite, scrapeHRefsTeamsFrommAICSWebSite, scrapeHRefsTournaments } = require("../helpers/scraper");
const objectUtils = require("../helpers/object");
const { DateTime } = require("luxon");
const db = require("../database/mongo");

const baseUrl = AICS_BASE_URL;

const getTournamentsUrl = () => `${baseUrl}/campionati.php`;
const getTeamsUrl = () => `${baseUrl}/vedisquadre.php`;
const getTeamDetailsUrl = (id) => `${baseUrl}/vedisquadre.php?=${id}`;
const getTournamentHomeUrl = (id) => `${baseUrl}/homegirone.php?id=${id}`;
const getDisciplinaryMeasurementsUrl = (id) => `${baseUrl}/provv.php?id_girone=${id}`;
const getPlayersRankingRankingUrl = (id) => `${baseUrl}/marcatori.php?id_girone=${id}`;
const getCalendarHomeUrl = (id) => `${baseUrl}/calendario.php?id_girone=${id}`;
const getCalendarPageUrl = (id, week) => `${baseUrl}/calendario.php?id_girone=${id}&n_giornata=${week}`;

const getTournaments = async () => {
  let tournaments = [];

  console.log("[Get tournaments from DB]");
  const t = await getTournamentsFromDB();

  const now = DateTime.now();
  const lastUpdateDate = DateTime.fromJSDate(t.lastUpdate);
  const days = now.diff(lastUpdateDate, "days").days;

  console.log("[Field lastUpdate from <tournaments> collection]", lastUpdateDate);
  console.log("[Now date]", now);

  console.log("[Check if tournaments are updated]");

  if (days >= 1) {
    console.log("[The diff date (now - lastUpdate) >= 1 days]");
    console.log("[Scraping tournaments from AICS webpage]");
    tournaments = await scrapeTournaments();
    await updateTournamentsToDB(tournaments);
  } else {
    console.log("[The diff date (now - lastUpdate) <= 1 days]");
    console.log("[Using tournaments from DB]");
    tournaments = t.values;
  }
  return tournaments;
};

const getTeams = async () => {
  try {
    const url = getTeamsUrl();
    const rawTable = await scrapeHRefsTeamsFrommAICSWebSite(url);
    return rawTable.map((item) => {
      const regex = /id=(\d+)/;
      const match = item.href.match(regex);
      const id = match && Number(match[1]);
      return {
        ...item,
        id,
      };
    });
  } catch (error) {
    throw error;
  }
};

const getTeamDetails = async (id) => {
  try {
    const url = getTeamDetailsUrl(id);
    return url;
  } catch (error) {
    throw error;
  }
};

const getTournamentDetails = async (id) => {
  console.log("[Get tournaments from DB]");
  const t = await getTournamentsFromDB();
  const tournamentEntry = t.values.find((t) => t.id === id);
  const teamsRanking = await getTeamsRanking(id);
  const latestMatches = await getLatestMatchResults(id);
  const nextMatches = await getNextMatches(id);
  return { ...tournamentEntry, teamsRanking, latestMatches, nextMatches };
};

const getTeamsRanking = async (id) => {
  try {
    const url = getTournamentHomeUrl(id);
    const rawTable = await scrapeTableFromAICSWebSite(url);
    return decodeTable(rawTable, AICS_TEAMS_RANKING_KEY_MAPPING);
  } catch (error) {
    throw error;
  }
};

async function getLatestMatchResults(id) {
  try {
    const url = getTournamentHomeUrl(id);
    const rawTable = await scrapeTableFromAICSWebSite(url, 1);
    const decodedTable = decodeTable(rawTable, AICS_LAST_RESULTS_KEY_MAPPING);
    const formattedTable = formatMatchResults(decodedTable);
    return formattedTable;
  } catch (error) {
    throw error;
  }
}

async function getNextMatches(id) {
  try {
    const url = getTournamentHomeUrl(id);
    const rawTable = await scrapeTableFromAICSWebSite(url, 2);
    const decodedTable = decodeTable(rawTable, AICS_NEXT_MATCHES_KEY_MAPPING);
    const formattedTable = formatNextMatchesResults(decodedTable);
    return formattedTable;
  } catch (error) {
    throw error;
  }
}

const getPlayersStats = async (id) => {
  try {
    let url = getPlayersRankingRankingUrl(id);
    const rawPlayersRankingTable = await scrapeTableFromAICSWebSite(url);
    const decodedPlayersRankingTable = decodeTable(rawPlayersRankingTable, AICS_PLAYERS_RANKING_KEY_MAPPING);

    url = getDisciplinaryMeasurementsUrl(id);
    const rawSuspansionsTable = await scrapeTableFromAICSWebSite(url, 0);
    const rawWarningsTable = await scrapeTableFromAICSWebSite(url, 1);
    const rawSpecialMeasuresTable = await scrapeTableFromAICSWebSite(url, 2);
    const decodedSuspansionsTable = decodeTable(rawSuspansionsTable, AICS_SUSPANSIONS_KEY_MAPPING);
    const decodedWarningsTable = decodeTable(rawWarningsTable, AICS_WARNINGS_KEY_MAPPING);
    const decodedSpecialMeasuresTable = decodeTable(rawSpecialMeasuresTable, AICS_SPECIAL_MEASURES_KEY_MAPPING);

    const playersStats = decodedPlayersRankingTable.map((p) => {
      const warningsCount = decodedWarningsTable.find((pw) => pw.firstName === p.firstName && pw.lastName === p.lastName)?.number || 0;
      const specialMeasureEntry = decodedSpecialMeasuresTable.find((psm) => psm.firstName === p.firstName && psm.lastName === p.lastName);
      const specialMeasure = specialMeasureEntry
        ? {
            startDate: specialMeasureEntry.startDate,
            endDate: specialMeasureEntry.endDate,
            notes: specialMeasureEntry.notes,
          }
        : undefined;
      const suspansionEntry = decodedSuspansionsTable.find((ps) => ps.firstName === p.firstName && ps.lastName === p.lastName);
      const suspansion = suspansionEntry
        ? {
            startDate: suspansionEntry.startDate,
            weeks: suspansionEntry.weeks,
          }
        : undefined;
      return {
        ...p,
        warningsCount,
        suspansion,
        specialMeasure,
      };
    });

    return playersStats;
  } catch (error) {
    throw error;
  }
};

//if week = null return latest week
const getTournamentCalendar = async (id, week = null) => {
  try {
    const url = getCalendarHomeUrl(id);
    const links = await scrapeHRefsFrommAICSWebSite(url);
    const actualWeek = (week && Number(week)) || links.length;
    const pageUrl = getCalendarPageUrl(id, actualWeek);
    const rawTable = await scrapeTableFromAICSWebSite(pageUrl);
    const decodedTable = decodeTable(rawTable, AICS_MATCH_RESULTS_KEY_MAPPING);
    const formattedTable = formatMatchResults(decodedTable);
    return {
      values: formattedTable,
      matchPerWeek: formattedTable.length,
      week: actualWeek,
      weekCount: links.length,
    };
  } catch (error) {
    throw error;
  }
};

//UTILS

async function scrapeTournaments() {
  const url = getTournamentsUrl();
  let result = await scrapeHRefsTournaments(url);
  const dataDecoded = result.map((item) => {
    // Estrai l'id dall'href
    const id = item.href.split("=")[1];

    // Estrai la category dal primo pezzo del path delimitato da '>'
    const pathList = item.path.split(">");
    pathList.splice(0, 1);

    const levelCount = pathList.length;

    const category = pathList[0].trim();
    let name = pathList[pathList.length - 1].trim();

    let location = "";

    if (category === "CALCIO A 5") {
      location = pathList[1];
      if (levelCount === 4) {
        name = `${pathList[2]} - ${pathList[3]}`;
      }
    } else if (category === "CALCIO A 11") {
      if (levelCount === 3) {
        name = pathList[1] !== pathList[2] ? `${pathList[1]} - ${pathList[2]}` : pathList[1];
      } else if (levelCount === 4) {
        name = `${pathList[1]} - ${pathList[2]} - ${pathList[3]}`;
      }
    }

    return {
      ...item,
      id,
      levelCount,
      category,
      name,
      location,
    };
  });
  return dataDecoded;
}

async function updateTournamentsToDB(dataDecoded = []) {
  const client = db.create();
  await client.connect();
  const databaseName = client.db("aics");
  const tournamentsCollection = databaseName.collection("tournaments");
  const data = {
    lastUpdate: new Date(),
    values: dataDecoded,
  };
  const result = await tournamentsCollection.updateOne({}, { $set: data });
  await client.close();
  return result;
}

async function getTournamentsFromDB() {
  const client = db.create();
  await client.connect();
  const databaseName = client.db("aics");
  const tournamentsCollection = databaseName.collection("tournaments");
  const result = await tournamentsCollection.find().toArray();
  await client.close();
  return result[0];
}

function formatMatchResults(decodedTable = []) {
  return decodedTable.map((item) => {
    const dateString = `${item.date} ${item.time}`;
    const date = DateTime.fromFormat(dateString, "dd/MM/yyyy HH:mm", {
      zone: "Europe/Rome",
    });
    const result = splitScore(item.score);
    const scoreA = result[0];
    const scoreB = result[1];
    return {
      ...item,
      dateUtc: date.toUTC().toISO(),
      scoreA,
      scoreB,
    };
  });
}

function formatNextMatchesResults(decodedTable = []) {
  return decodedTable.map((item) => {
    const dateString = `${item.date} ${item.time}`;
    const date = DateTime.fromFormat(dateString, "dd/MM/yyyy HH:mm", {
      zone: "Europe/Rome",
    });
    return {
      ...item,
      dateUtc: date.toUTC().toISO(),
    };
  });
}

function decodeTable(rawTable, translation) {
  return rawTable.map((obj) => objectUtils.removeSpacesFromKeys(obj)).map((obj) => objectUtils.decodeKeys(translation, obj));
}

function splitScore(score = "") {
  return score.split("-").map(Number);
}

module.exports = {
  getTeams,
  getTeamDetails,
  getTournaments,
  getTournamentDetails,
  getTeamsRanking,
  getLatestMatchResults,
  getPlayersStats,
  getTournamentCalendar,
  getNextMatches,
};
