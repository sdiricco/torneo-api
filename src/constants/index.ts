const AICS_BASE_URL: string | undefined = process.env.AICS_BASE_URL;

const AICS_FUTSAL_TOURNAMENTS: {
  name: string;
  circolo: string;
  location: string;
  id: string;
}[] = [
  {
    name: "Amatori/Dilettanti Girone A",
    circolo: "Amatori/Dilettanti C.T.L. ",
    location: "VERSILIA",
    id: "69",
  },
  // ... altri elementi
];

const AICS_TEAMS_RANKING_KEY_MAPPING: Record<string, string> = {
  Nome: "name",
  Punti: "points",
  Giocate: "matches",
  Vinte: "won_matches",
  Pareggiate: "drawn_matches",
  Perse: "lost_matches",
  GoalFatti: "goals_scored",
  GoalSubiti: "goals_conceded",
  CoppaDisciplina: "fair_play",
};

const AICS_PLAYERS_RANKING_KEY_MAPPING: Record<string, string> = {
  Nome: "firstName",
  Cognome: "lastName",
  Squadra: "team",
  GoalFatti: "goal",
};

const AICS_LAST_RESULTS_KEY_MAPPING: Record<string, string> = {
  Giornata: "week",
  Squadre: "teamA",
  col3: "teamB",
  Risultato: "score",
  Data: "date",
  Ora: "time",
  Luogo: "location",
};

const AICS_NEXT_MATCHES_KEY_MAPPING: Record<string, string> = {
  Giornata: "week",
  Squadre: "teamA",
  col3: "teamB",
  Data: "date",
  Ora: "time",
  Luogo: "location",
};

const AICS_MATCH_RESULTS_KEY_MAPPING: Record<string, string> = {
  Squadre: "teamA",
  col2: "teamB",
  Risultato: "score",
  Data: "date",
  Ora: "time",
  Luogo: "location",
};

const AICS_SUSPANSIONS_KEY_MAPPING: Record<string, string> = {
  Nome: "firstName",
  Cognome: "lastName",
  Squadra: "team",
  DataInizio: "startDate",
  NumeroGiornate: "weeks",
};

const AICS_WARNINGS_KEY_MAPPING: Record<string, string> = {
  Nome: "firstName",
  Cognome: "lastName",
  Squadra: "team",
  Numero: "number",
};

const AICS_SPECIAL_MEASURES_KEY_MAPPING: Record<string, string> = {
  Nome: "firstName",
  Cognome: "lastName",
  Squadra: "team",
  Numero: "number",
  DataInizio: "startDate",
  DataFine: "endDate",
  Note: "notes",
};

export {
  AICS_BASE_URL,
  AICS_FUTSAL_TOURNAMENTS,
  AICS_TEAMS_RANKING_KEY_MAPPING,
  AICS_PLAYERS_RANKING_KEY_MAPPING,
  AICS_LAST_RESULTS_KEY_MAPPING,
  AICS_MATCH_RESULTS_KEY_MAPPING,
  AICS_NEXT_MATCHES_KEY_MAPPING,
  AICS_SUSPANSIONS_KEY_MAPPING,
  AICS_WARNINGS_KEY_MAPPING,
  AICS_SPECIAL_MEASURES_KEY_MAPPING,
};