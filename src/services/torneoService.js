const {AICS_FUTSAL_TOURNAMENTS, AICS_PLAYERS_RANKING_KEY_MAPPING, AICS_TEAMS_RANKING_KEY_MAPPING, AICS_LAST_RESULTS_KEY_MAPPING} = require("../constants");
const { scrapeTableFromAICSWebSite,scrapeHRefsFrommAICSWebSite } = require("../helpers/scraper");
const objectUtils = require("../helpers/object");

const baseUrl = "https://www.aicslucca.com";

//https://www.aicslucca.com/calendario.php?id_girone=513&n_giornata=7

const getTeamsRankingUrl = (id) => `${baseUrl}/homegirone.php?id=${id}`;
const getPlayersRankingUrl = (id) => `${baseUrl}/marcatori.php?id_girone=${id}`;
const getCalendarHomeUrl = (id) => `${baseUrl}/calendario.php?id_girone=${id}`;
const getCalendarPageUrl = (id, page) => `${baseUrl}/calendario.php?id_girone=${id}&n_giornata=${page + 1}`

const getTournaments = () => {
  return AICS_FUTSAL_TOURNAMENTS;
};

const getTournamentDetails = async (id) => {
  let tournamentDetails = {}
  const standings = await getStandings(id);
  const teams = standings.map(s => s.name);
  const tournamentEntry = AICS_FUTSAL_TOURNAMENTS.find(tournament => tournament.id === id)
  tournamentDetails = { teams,...tournamentEntry}
  return tournamentDetails
}

const getStandings = async (id) => {
  try {
    const url = getTeamsRankingUrl(id);
    const rawTable = await scrapeTableFromAICSWebSite(url);
    return decodeTable(rawTable, AICS_TEAMS_RANKING_KEY_MAPPING);
  } catch (error) {
    throw error;
  }
};

const getPlayers = async (id) => {
  try {
    const url = getPlayersRankingUrl(id);
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

const getResults = async (id, page = 0) => {
  try {
    const url = getCalendarHomeUrl(id);
    const links = await scrapeHRefsFrommAICSWebSite(url);
    const actualPage = (links.length -1) - page;
    const pageUrl = getCalendarPageUrl(id, actualPage)
    const rawTable = await scrapeTableFromAICSWebSite(pageUrl);
    return {
      values: rawTable,
      pages: links.length,
      page: page
    }
  } catch (error) {
    throw error;
  }
}

function decodeTable(rawTable, translation) {
  return rawTable
    .map((obj) => objectUtils.removeSpacesFromKeys(obj))
    .map((obj) => objectUtils.decodeKeys(translation, obj));
}

module.exports = {
  getTournaments,
  getTournamentDetails,
  getStandings,
  getLastResults,
  getPlayers,
  getResults
};
