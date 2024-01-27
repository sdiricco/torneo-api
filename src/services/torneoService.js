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
  scrapeHRefsTeamsFrommAICSWebSite
  
} = require("../helpers/scraper");
const objectUtils = require("../helpers/object");
const { DateTime } = require("luxon");

const baseUrl = AICS_BASE_URL;

const getTeamsUrl =  () =>`${baseUrl}/vedisquadre.php`
const getTeamDetailsUrl = (id) =>`${baseUrl}/vedisquadre.php?=${id}`
const getTournamentHomeUrl = (id) => `${baseUrl}/homegirone.php?id=${id}`;
const getDisciplinaryMeasurementsUrl = (id) => `${baseUrl}/provv.php?id_girone=${id}`
const getPlayersRankingRankingUrl = (id) =>
  `${baseUrl}/marcatori.php?id_girone=${id}`;
const getCalendarHomeUrl = (id) => `${baseUrl}/calendario.php?id_girone=${id}`;
const getCalendarPageUrl = (id, week) =>
  `${baseUrl}/calendario.php?id_girone=${id}&n_giornata=${week}`;

const getTournaments = () => {
  return AICS_FUTSAL_TOURNAMENTS;
};

const getTeams = async () => {
  try {
    const url = getTeamsUrl();
    const rawTable = await scrapeHRefsTeamsFrommAICSWebSite(url);
    return rawTable.map(item => {
      const regex = /id=(\d+)/;
      const match = item.href.match(regex);
      const id = match && Number(match[1])
      return {
        ...item,
        id
      }
    })
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
  const tournamentEntry = AICS_FUTSAL_TOURNAMENTS.find(t => t.id === id)
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

    const playersStats = decodedPlayersRankingTable.map(p => {
      const warningsCount = decodedWarningsTable.find(pw => pw.firstName === p.firstName && pw.lastName === p.lastName)?.number || 0
      const specialMeasureEntry = decodedSpecialMeasuresTable.find(psm => psm.firstName === p.firstName && psm.lastName === p.lastName)
      const specialMeasure = specialMeasureEntry ? {
        startDate: specialMeasureEntry.startDate,
        endDate: specialMeasureEntry.endDate,
        notes: specialMeasureEntry.notes
      } : undefined
      const suspansionEntry = decodedSuspansionsTable.find(ps => ps.firstName === p.firstName && ps.lastName === p.lastName)
      const suspansion = suspansionEntry ? {
        startDate: suspansionEntry.startDate,
        weeks: suspansionEntry.weeks,
      } : undefined
      return{
        ...p,
        warningsCount,
        suspansion,
        specialMeasure
      }
    })

    return playersStats
  } catch (error) {
    throw error;
  }
};

//if week = null return latest week
const getTournamentCalendar = async (id, week = null) => {
  try {
    const url = getCalendarHomeUrl(id);
    const links = await scrapeHRefsFrommAICSWebSite(url);
    const actualWeek = week && Number(week) || links.length
    const pageUrl = getCalendarPageUrl(id, actualWeek);
    const rawTable = await scrapeTableFromAICSWebSite(pageUrl);
    const decodedTable = decodeTable(rawTable, AICS_MATCH_RESULTS_KEY_MAPPING);
    const formattedTable = formatMatchResults(decodedTable);
    return {
      values: formattedTable,
      matchPerWeek: formattedTable.length,
      week: actualWeek,
      weekCount: links.length
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
  return rawTable
    .map((obj) => objectUtils.removeSpacesFromKeys(obj))
    .map((obj) => objectUtils.decodeKeys(translation, obj));
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
