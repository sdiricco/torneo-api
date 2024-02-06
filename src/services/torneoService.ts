import {
  AICS_BASE_URL,
  AICS_PLAYERS_RANKING_KEY_MAPPING,
  AICS_TEAMS_RANKING_KEY_MAPPING,
  AICS_LAST_RESULTS_KEY_MAPPING,
  AICS_MATCH_RESULTS_KEY_MAPPING,
  AICS_NEXT_MATCHES_KEY_MAPPING,
  AICS_SUSPANSIONS_KEY_MAPPING,
  AICS_WARNINGS_KEY_MAPPING,
  AICS_SPECIAL_MEASURES_KEY_MAPPING,
} from '../constants'
import {
  scrapeTableFromAICSWebSite,
  scrapeHRefsFrommAICSWebSite,
  scrapeHRefsTeamsFrommAICSWebSite,
  scrapeHRefsTournaments,
} from '../helpers/scraper'
import { DateTime } from 'luxon'
import { decodeTable } from '../helpers/decoder'
import { formatNextMatchesResults, formatMatchResults } from '../helpers/dto'
import { getTournamentsFromDB, updateTournamentsToDB } from '../database/api'

const baseUrl: string | undefined = AICS_BASE_URL

const getTournamentsUrl = (): string => `${baseUrl}/campionati.php`
const getTeamsUrl = (): string => `${baseUrl}/vedisquadre.php`
const getTeamDetailsUrl = (id: string): string =>
  `${baseUrl}/vedisquadre.php?=${id}`
const getTournamentHomeUrl = (id: string): string =>
  `${baseUrl}/homegirone.php?id=${id}`
const getDisciplinaryMeasurementsUrl = (id: string): string =>
  `${baseUrl}/provv.php?id_girone=${id}`
const getPlayersRankingRankingUrl = (id: string): string =>
  `${baseUrl}/marcatori.php?id_girone=${id}`
const getCalendarHomeUrl = (id: string): string =>
  `${baseUrl}/calendario.php?id_girone=${id}`
const getCalendarPageUrl = (id: string, week: number | null): string =>
  `${baseUrl}/calendario.php?id_girone=${id}&n_giornata=${week || ''}`

/**
 * @title Get Tournaments
 * @description Get tournaments from DB if they can be considered updated or scrape tournaments from AICS webpage, save them to DB and return.
 * The condition that needs to be satisfied is: 'the tournaments from DB are older than one day from the request time (now)'
 */
const getTournaments = async (): Promise<any[]> => {
  let tournaments: any[] = []

  console.log('[Get tournaments from DB]')
  const t = await getTournamentsFromDB()

  const now = DateTime.now()
  const lastUpdateDate = DateTime.fromJSDate(t.lastUpdate)
  const days = now.diff(lastUpdateDate, 'days').days

  console.log(
    '[Field lastUpdate from <tournaments> collection]',
    lastUpdateDate,
  )
  console.log('[Now date]', now)

  console.log('[Check if tournaments are updated..]')

  if (days >= 1) {
    console.log('[The diff date (now - lastUpdate) >= 1 days]')
    console.log('[Scraping tournaments from AICS webpage]')
    tournaments = await scrapeTournaments()
    await updateTournamentsToDB(tournaments)
  } else {
    console.log('[The diff date (now - lastUpdate) < 1 days]')
    console.log('[Using tournaments from DB]')
    tournaments = t.values
  }
  return tournaments
}

/**
 * @title Get Tournament details
 * @todo Get ONLY tournament from DB and not all tournaments
 */
const getTournamentDetails = async (id: string): Promise<any> => {
  console.log('[Get tournaments from DB]')
  const t = await getTournamentsFromDB()
  const tournamentEntry = t.values.find((t: any) => t.id === id)
  const teamsRanking = await getTeamsRanking(id)
  const latestMatches = await getLatestMatchResults(id)
  const nextMatches = await getNextMatches(id)
  return { ...tournamentEntry, teamsRanking, latestMatches, nextMatches }
}

/**
 * @title Get Teams ranking
 */
const getTeamsRanking = async (id: string): Promise<any[]> => {
  try {
    const url: string = getTournamentHomeUrl(id)
    const rawTable: any[] = await scrapeTableFromAICSWebSite(url)
    const decodedTable: any[] = decodeTable(
      rawTable,
      AICS_TEAMS_RANKING_KEY_MAPPING,
    )
    const formattedTable: any[] = decodedTable
      //toglie gli oggetti che hanno tutti i valori pari a "" o null o undefined (toglie la riga dalla tabella)
      .filter((t) => {
        return Object.values(t).some((v) => v)
      })
      .map((t) => {
        return {
          ...t,
          points: t.points && Number(t.points),
          matches: t.matches && Number(t.matches),
          won_matches: t.won_matches && Number(t.won_matches),
          drawn_matches: t.drawn_matches && Number(t.drawn_matches),
          lost_matches: t.lost_matches && Number(t.lost_matches),
          goals_scored: t.goals_scored && Number(t.goals_scored),
          goals_conceded: t.goals_conceded && Number(t.goals_conceded),
        }
      })
    return formattedTable
  } catch (error) {
    throw error
  }
}

const getTeams = async (): Promise<any[]> => {
  try {
    const url: string = getTeamsUrl()
    const rawTable: any[] = await scrapeHRefsTeamsFrommAICSWebSite(url)
    return rawTable.map((item) => {
      const regex = /id=(\d+)/
      const match = item.href.match(regex)
      const id = match && Number(match[1])
      return {
        ...item,
        id,
      }
    })
  } catch (error) {
    throw error
  }
}

const getTeamDetails = async (id: string): Promise<string> => {
  try {
    const url: string = getTeamDetailsUrl(id)
    return url
  } catch (error) {
    throw error
  }
}

async function getLatestMatchResults(id: string): Promise<any[]> {
  try {
    const url: string = getTournamentHomeUrl(id)
    const rawTable: any[] = await scrapeTableFromAICSWebSite(url, 1)
    const decodedTable: any[] = decodeTable(
      rawTable,
      AICS_LAST_RESULTS_KEY_MAPPING,
    )
    const formattedTable: any[] = formatMatchResults(decodedTable)
    return formattedTable
  } catch (error) {
    throw error
  }
}

async function getNextMatches(id: string): Promise<any[]> {
  try {
    const url: string = getTournamentHomeUrl(id)
    const rawTable: any[] = await scrapeTableFromAICSWebSite(url, 2)
    const decodedTable: any[] = decodeTable(
      rawTable,
      AICS_NEXT_MATCHES_KEY_MAPPING,
    )
    const formattedTable: any[] = formatNextMatchesResults(decodedTable)
    return formattedTable
  } catch (error) {
    throw error
  }
}

const getPlayersStats = async (id: string): Promise<any[]> => {
  try {
    let url: string = getPlayersRankingRankingUrl(id)
    const rawPlayersRankingTable: any[] = await scrapeTableFromAICSWebSite(url)
    const decodedPlayersRankingTable: any[] = decodeTable(
      rawPlayersRankingTable,
      AICS_PLAYERS_RANKING_KEY_MAPPING,
    )

    url = getDisciplinaryMeasurementsUrl(id)
    const rawSuspansionsTable: any[] = await scrapeTableFromAICSWebSite(url, 0)
    const rawWarningsTable: any[] = await scrapeTableFromAICSWebSite(url, 1)
    const rawSpecialMeasuresTable: any[] = await scrapeTableFromAICSWebSite(
      url,
      2,
    )
    const decodedSuspansionsTable: any[] = decodeTable(
      rawSuspansionsTable,
      AICS_SUSPANSIONS_KEY_MAPPING,
    )
    const decodedWarningsTable: any[] = decodeTable(
      rawWarningsTable,
      AICS_WARNINGS_KEY_MAPPING,
    )
    const decodedSpecialMeasuresTable: any[] = decodeTable(
      rawSpecialMeasuresTable,
      AICS_SPECIAL_MEASURES_KEY_MAPPING,
    )

    const playersStats: any[] = decodedPlayersRankingTable.map((p) => {
      const warningsCount =
        decodedWarningsTable.find(
          (pw) => pw.firstName === p.firstName && pw.lastName === p.lastName,
        )?.number || 0
      const specialMeasureEntry = decodedSpecialMeasuresTable.find(
        (psm) => psm.firstName === p.firstName && psm.lastName === p.lastName,
      )
      const specialMeasure = specialMeasureEntry
        ? {
            startDate: specialMeasureEntry.startDate,
            endDate: specialMeasureEntry.endDate,
            notes: specialMeasureEntry.notes,
          }
        : undefined
      const suspansionEntry = decodedSuspansionsTable.find(
        (ps) => ps.firstName === p.firstName && ps.lastName === p.lastName,
      )
      const suspansion = suspansionEntry
        ? {
            startDate: suspansionEntry.startDate,
            weeks: suspansionEntry.weeks,
          }
        : undefined
      return {
        ...p,
        goal: p.goal && Number(p.goal),
        warningsCount,
        suspansion,
        specialMeasure,
      }
    })

    return playersStats
  } catch (error) {
    throw error
  }
}

//if week = null return latest week
const getTournamentCalendar = async (
  id: string,
  week: string | null = null,
): Promise<any> => {
  try {
    const url: string = getCalendarHomeUrl(id)
    const links: any[] = await scrapeHRefsFrommAICSWebSite(url)
    const actualWeek: number = (week && Number(week)) || links.length
    const pageUrl: string = getCalendarPageUrl(id, actualWeek)
    const rawTable: any[] = await scrapeTableFromAICSWebSite(pageUrl)
    const decodedTable: any[] = decodeTable(
      rawTable,
      AICS_MATCH_RESULTS_KEY_MAPPING,
    )
    const formattedTable: any[] = formatMatchResults(decodedTable)
    return {
      values: formattedTable,
      matchPerWeek: formattedTable.length,
      week: actualWeek,
      weekCount: links.length,
    }
  } catch (error) {
    throw error
  }
}

// UTILS

async function scrapeTournaments(): Promise<any[]> {
  const url: string = getTournamentsUrl()
  let result: any[] = await scrapeHRefsTournaments(url)
  const dataDecoded: any[] = result.map((item) => {
    // Estrai l'id dall'href
    const id: string = item.href.split('=')[1]

    // Estrai la category dal primo pezzo del path delimitato da '>'
    const pathList: string[] = item.path.split('>')
    pathList.splice(0, 1)

    const levelCount: number = pathList.length

    const category: string = pathList[0].trim()
    let name: string = pathList[pathList.length - 1].trim()

    let location: string = ''

    if (category === 'CALCIO A 5') {
      location = pathList[1]
      if (levelCount === 4) {
        name = `${pathList[2]} - ${pathList[3]}`
      }
    } else if (category === 'CALCIO A 11') {
      if (levelCount === 3) {
        name =
          pathList[1] !== pathList[2]
            ? `${pathList[1]} - ${pathList[2]}`
            : pathList[1]
      } else if (levelCount === 4) {
        name = `${pathList[1]} - ${pathList[2]} - ${pathList[3]}`
      }
    }

    return {
      ...item,
      id,
      levelCount,
      category,
      name,
      location,
    }
  })
  return dataDecoded
}

export {
  getTeams,
  getTeamDetails,
  getTournaments,
  getTournamentDetails,
  getTeamsRanking,
  getLatestMatchResults,
  getPlayersStats,
  getTournamentCalendar,
}
