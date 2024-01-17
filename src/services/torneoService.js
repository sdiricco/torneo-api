const {AICS_BASE_URL, AICS_FUTSAL_TOURNAMENTS, AICS_PLAYERS_RANKING_KEY_MAPPING, AICS_TEAMS_RANKING_KEY_MAPPING, AICS_LAST_RESULTS_KEY_MAPPING, AICS_MATCH_RESULTS_KEY_MAPPING} = require("../constants");
const { scrapeTableFromAICSWebSite,scrapeHRefsFrommAICSWebSite } = require("../helpers/scraper");
const objectUtils = require("../helpers/object");
const moment = require('moment-timezone')

const baseUrl = AICS_BASE_URL;

const getTeamsRankingUrl = (id) => `${baseUrl}/homegirone.php?id=${id}`;
const getPlayersRankingRankingUrl = (id) => `${baseUrl}/marcatori.php?id_girone=${id}`;
const getCalendarHomeUrl = (id) => `${baseUrl}/calendario.php?id_girone=${id}`;
const getCalendarPageUrl = (id, page) => `${baseUrl}/calendario.php?id_girone=${id}&n_giornata=${page + 1}`

const getTournaments = () => {
  return AICS_FUTSAL_TOURNAMENTS;
};

const getTournamentDetails = async (id) => {
  let tournamentDetails = {}
  const standings = await getTeamsRanking(id);
  const teams = standings.map(s => s.name);
  const tournamentEntry = AICS_FUTSAL_TOURNAMENTS.find(tournament => tournament.id === id)
  tournamentDetails = { teams,...tournamentEntry}
  return tournamentDetails
}

const getTeamsRanking = async (id) => {
  try {
    const url = getTeamsRankingUrl(id);
    const rawTable = await scrapeTableFromAICSWebSite(url);
    return decodeTable(rawTable, AICS_TEAMS_RANKING_KEY_MAPPING);
  } catch (error) {
    throw error;
  }
};

const getPlayersRanking = async (id) => {
  try {
    const url = getPlayersRankingRankingUrl(id);
    const rawTable = await scrapeTableFromAICSWebSite(url);
    return decodeTable(rawTable, AICS_PLAYERS_RANKING_KEY_MAPPING);
  } catch (error) {
    throw error;
  }
};

const getLastResults = async (id) => {
  try {
    const url = getTeamsRankingUrl(id);
    const rawTable = await scrapeTableFromAICSWebSite(url, 1);
    return decodeTable(rawTable, AICS_LAST_RESULTS_KEY_MAPPING);
  } catch (error) {
    throw error;
  }
}

const getMatchResults = async (id, page = 0) => {
  try {
    const url = getCalendarHomeUrl(id);
    const links = await scrapeHRefsFrommAICSWebSite(url);
    const actualPage = (links.length -1) - page;
    const pageUrl = getCalendarPageUrl(id, actualPage)
    const rawTable = await scrapeTableFromAICSWebSite(pageUrl)
    const decodedTable = decodeTable(rawTable, AICS_MATCH_RESULTS_KEY_MAPPING); 
    const formattedTable = formatMatchResults(decodedTable)
    return {
      values: formattedTable,
      pages: links.length,
      page: page
    }
  } catch (error) {
    throw error;
  }
}

function formatMatchResults(decodedTable=[]){
  return decodedTable.map(item => {
    const dateString = `${item.date} ${item.time}`
    const date = moment(dateString, 'DD/MM/YYYY HH:mm')
    const [scoreA, scoreB] = item.score.split('-').map(Number);
    const matchCompleted = item.score != '-'
    return {
      ...item,
      dateUtc: date.toDate().toUTCString(),
      scoreA,
      scoreB,
      matchCompleted
    }
  })
}

function decodeTable(rawTable, translation) {
  return rawTable
    .map((obj) => objectUtils.removeSpacesFromKeys(obj))
    .map((obj) => objectUtils.decodeKeys(translation, obj));
}

module.exports = {
  getTournaments,
  getTournamentDetails,
  getTeamsRanking,
  getLastResults,
  getPlayersRanking,
  getMatchResults
};
