import env from '../services/envloader'
export const AICS_BASE_URL = env.AICS_BASE_URL
export const MONGO_URI = env.MONGO_URI
export const PORT = env.PORT

export const AICS_TEAMS_RANKING_KEY_MAPPING: Record<string, string> = {
  Nome: 'name',
  Punti: 'points',
  Giocate: 'matches',
  Vinte: 'won_matches',
  Pareggiate: 'drawn_matches',
  Perse: 'lost_matches',
  GoalFatti: 'goals_scored',
  GoalSubiti: 'goals_conceded',
  CoppaDisciplina: 'fair_play',
}

export const AICS_PLAYERS_RANKING_KEY_MAPPING: Record<string, string> = {
  Nome: 'firstName',
  Cognome: 'lastName',
  Squadra: 'team',
  GoalFatti: 'goal',
}

export const AICS_LAST_RESULTS_KEY_MAPPING: Record<string, string> = {
  Giornata: 'week',
  Squadre: 'teamA',
  col3: 'teamB',
  Risultato: 'score',
  Data: 'date',
  Ora: 'time',
  Luogo: 'location',
}
export const AICS_NEXT_MATCHES_KEY_MAPPING: Record<string, string> = {
  Giornata: 'week',
  Squadre: 'teamA',
  col3: 'teamB',
  Data: 'date',
  Ora: 'time',
  Luogo: 'location',
}

export const AICS_MATCH_RESULTS_KEY_MAPPING: Record<string, string> = {
  Squadre: 'teamA',
  col2: 'teamB',
  Risultato: 'score',
  Data: 'date',
  Ora: 'time',
  Luogo: 'location',
}

export const AICS_SUSPANSIONS_KEY_MAPPING: Record<string, string> = {
  Nome: 'firstName',
  Cognome: 'lastName',
  Squadra: 'team',
  DataInizio: 'startDate',
  NumeroGiornate: 'weeks',
}

export const AICS_WARNINGS_KEY_MAPPING: Record<string, string> = {
  Nome: 'firstName',
  Cognome: 'lastName',
  Squadra: 'team',
  Numero: 'number',
}

export const AICS_SPECIAL_MEASURES_KEY_MAPPING: Record<string, string> = {
  Nome: 'firstName',
  Cognome: 'lastName',
  Squadra: 'team',
  Numero: 'number',
  DataInizio: 'startDate',
  DataFine: 'endDate',
  Note: 'notes',
}
