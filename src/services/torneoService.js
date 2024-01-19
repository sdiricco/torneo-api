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
  AICS_SPECIAL_MEASURES_KEY_MAPPING
} = require("../constants");
const {
  scrapeTableFromAICSWebSite,
  scrapeHRefsFrommAICSWebSite,
} = require("../helpers/scraper");
const objectUtils = require("../helpers/object");
const { DateTime } = require("luxon");

const baseUrl = AICS_BASE_URL;

const getTournamentHomeUrl = (id) => `${baseUrl}/homegirone.php?id=${id}`;
const getDisciplinaryMeasurementsUrl = (id) => `${baseUrl}/provv.php?id_girone=${id}`
const getPlayersRankingRankingUrl = (id) =>
  `${baseUrl}/marcatori.php?id_girone=${id}`;
const getCalendarHomeUrl = (id) => `${baseUrl}/calendario.php?id_girone=${id}`;
const getCalendarPageUrl = (id, page) =>
  `${baseUrl}/calendario.php?id_girone=${id}&n_giornata=${page + 1}`;

const getTournaments = () => {
  return AICS_FUTSAL_TOURNAMENTS;
};

const getTournamentDetails = async (id) => {
  let tournamentDetails = {};
  const standings = await getTeamsRanking(id);
  const teams = standings.map((s) => s.name);
  const tournamentEntry = AICS_FUTSAL_TOURNAMENTS.find(
    (tournament) => tournament.id === id
  );
  tournamentDetails = { teams, ...tournamentEntry };
  return tournamentDetails;
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
    const formattedTable = formatMatchResults(decodedTable);
    return formattedTable;
  } catch (error) {
    throw error;
  }
}

async function getDisciplinaryMeasurements(id) {
  try {
    const url = getDisciplinaryMeasurementsUrl(id);
    const rawSuspansionsTable = await scrapeTableFromAICSWebSite(url, 0);
    const rawWarningsTable = await scrapeTableFromAICSWebSite(url, 1);
    const rawSpecialMeasuresTable = await scrapeTableFromAICSWebSite(url, 2);
    const decodedSuspansionsTable = decodeTable(rawSuspansionsTable, AICS_SUSPANSIONS_KEY_MAPPING);
    const decodedWarningsTable = decodeTable(rawWarningsTable, AICS_WARNINGS_KEY_MAPPING);
    const decodedSpecialMeasuresTable = decodeTable(rawSpecialMeasuresTable, AICS_SPECIAL_MEASURES_KEY_MAPPING);
    return {
      suspensions: decodedSuspansionsTable,
      warnings: decodedWarningsTable,
      specialMeasures: decodedSpecialMeasuresTable
    };
  } catch (error) {
    throw error;
  }
}

const getPlayersRanking = async (id) => {
  try {
    const url = getPlayersRankingRankingUrl(id);
    const rawTable = await scrapeTableFromAICSWebSite(url);
    return decodeTable(rawTable, AICS_PLAYERS_RANKING_KEY_MAPPING);
  } catch (error) {
    throw error;
  }
};

const getMatchResults = async (id, page = 0) => {
  try {
    const url = getCalendarHomeUrl(id);
    const links = await scrapeHRefsFrommAICSWebSite(url);
    const actualPage = links.length - 1 - page;
    const pageUrl = getCalendarPageUrl(id, actualPage);
    const rawTable = await scrapeTableFromAICSWebSite(pageUrl);
    const decodedTable = decodeTable(rawTable, AICS_MATCH_RESULTS_KEY_MAPPING);
    const formattedTable = formatMatchResults(decodedTable);
    return {
      values: formattedTable,
      pages: links.length,
      page: page,
    };
  } catch (error) {
    throw error;
  }
};

//UTILS

function formatMatchResults(decodedTable = []) {
  return decodedTable.map((item) => {
    const dateString = `${item.date} ${item.time}`;
    const date = DateTime.fromFormat(dateString, "dd/MM/yyyy HH:mm", {
      zone: "Europe/Rome",
    });
    let scoreA = undefined;
    let scoreB = undefined;
    let matchCompleted = undefined;
    if (item.score) {
      const result = splitScore(item.score);
      scoreA = result[0];
      scoreB = result[1];
      matchCompleted = item.score != "-";
    }
    return {
      ...item,
      dateUtc: date.toUTC().toISO(),
      scoreA,
      scoreB,
      matchCompleted,
    };
  });
}

function decodeTable(rawTable, translation) {
  return rawTable
    .map((obj) => objectUtils.removeSpacesFromKeys(obj))
    .map((obj) => objectUtils.decodeKeys(translation, obj));
}

function splitScore(score = "") {
  return score.split("-").map(Number);
}

module.exports = {
  getTournaments,
  getTournamentDetails,
  getTeamsRanking,
  getLatestMatchResults,
  getPlayersRanking,
  getMatchResults,
  getNextMatches,
  getDisciplinaryMeasurements
};
