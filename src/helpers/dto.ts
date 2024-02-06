import { DateTime } from 'luxon'
import { splitScore } from './utils'

export function formatNextMatchesResults(decodedTable: any[] = []): any[] {
  return decodedTable.map((item) => {
    const dateString: string = `${item.date} ${item.time}`
    const date: DateTime = DateTime.fromFormat(dateString, 'dd/MM/yyyy HH:mm', {
      zone: 'Europe/Rome',
    })
    return {
      ...item,
      dateUtc: date.toUTC().toISO(),
    }
  })
}

export function formatMatchResults(decodedTable: any[] = []): any[] {
  return decodedTable.map((item) => {
    const dateString: string = `${item.date} ${item.time}`
    const date: DateTime = DateTime.fromFormat(dateString, 'dd/MM/yyyy HH:mm', {
      zone: 'Europe/Rome',
    })
    const result: number[] = splitScore(item.score)
    const scoreA: number = result[0]
    const scoreB: number = result[1]
    return {
      ...item,
      dateUtc: date.toUTC().toISO(),
      scoreA,
      scoreB,
    }
  })
}
