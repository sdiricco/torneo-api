const AICS_BASE_URL = process.env.AICS_BASE_URL

const AICS_FUTSAL_TOURNAMENTS = [
  {
    name: "Amatori/Dilettanti Girone A",
    circolo: "Amatori/Dilettanti C.T.L. ",
    location: "VERSILIA",
    id: '69',
  },
  {
    name: "Amatori/Dilettanti Girone B",
    circolo: "Amatori/Dilettanti C.T.L. ",
    location: "VERSILIA",
    id: '70',
  },
  {
    name: "Amatori/Dilettanti Girone C",
    circolo: "Amatori/Dilettanti C.T.L. ",
    location: "VERSILIA",
    id: '71',
  },
  {
    name: "GIRONE A - AMATORI/DILETTANTI CENTRO SPORTIVO CELETRA",
    circolo: "",
    location: "LUCCA -CAPANNORI - ALTOPASCIO- MEDIA VALLE DEL SERCHIO",
    id: '540',
  },
  {
    name: "GIRONE B - AMATORI/DILETTANTI PERINI",
    circolo: "",
    location: "LUCCA -CAPANNORI - ALTOPASCIO- MEDIA VALLE DEL SERCHIO",
    id: '513',
  },
  {
    name: "GIRONE C AMATORI/DILETTANTI EL NINO",
    circolo: "",
    location: "LUCCA -CAPANNORI - ALTOPASCIO- MEDIA VALLE DEL SERCHIO",
    id: '515',
  },
  {
    name: "GIRONE D AMATORI/DILETTANTI AL POGGIO/CALCETTO SUL TETTO",
    circolo: "",
    location: "LUCCA -CAPANNORI - ALTOPASCIO- MEDIA VALLE DEL SERCHIO",
    id: '514',
  },
  {
    name: "GIRONE E AMATORI/DILETTANTI AL POGGIO/CALCETTO SUL TETTO",
    circolo: "",
    location: "LUCCA -CAPANNORI - ALTOPASCIO- MEDIA VALLE DEL SERCHIO",
    id: '579',
  },
  {
    name: "GIRONE F - AMATORI/DILETTANTI BODY MIND SPORT ARENA",
    circolo: "",
    location: "LUCCA -CAPANNORI - ALTOPASCIO- MEDIA VALLE DEL SERCHIO",
    id: '542',
  },
  {
    name: "GIRONE SERIE A - AMATORI/DILETTANTI AL POGGIO/CALCETTO SUL TETTO",
    circolo: "",
    location: "LUCCA -CAPANNORI - ALTOPASCIO- MEDIA VALLE DEL SERCHIO",
    id: '580',
  },
  {
    name: "GIRONE SERIE B - AMATORI/DILETTANTI AL POGGIO/CALCETTO SUL TETTO",
    circolo: "",
    location: "LUCCA -CAPANNORI - ALTOPASCIO- MEDIA VALLE DEL SERCHIO",
    id: '581',
  },
];

const AICS_TEAMS_RANKING_KEY_MAPPING = {
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

const AICS_PLAYERS_RANKING_KEY_MAPPING = {
  Nome: "firstName",
  Cognome: "lastName",
  Squadra: "team",
  GoalFatti: "goal",
};

const AICS_LAST_RESULTS_KEY_MAPPING = {
  Giornata: "week",
  Squadre: "teamA",
  col3: "teamB",
  Risultato: "score",
  Data: "date",
  Ora: 'time',
  Luogo: 'location'
};

const AICS_NEXT_MATCHES_KEY_MAPPING = {
  Giornata: "week",
  Squadre: "teamA",
  col3: "teamB",
  Data: "date",
  Ora: 'time',
  Luogo: 'location'
};

const AICS_MATCH_RESULTS_KEY_MAPPING = {
  Squadre: "teamA",
  col2: "teamB",
  Risultato: "score",
  Data: "date",
  Ora: 'time',
  Luogo: 'location'
};

const AICS_SUSPANSIONS_KEY_MAPPING = {
  Nome: "firstName",
  Cognome: "lastName",
  Squadra: "team",
  DataInizio: "startDate",
  NumeroGiornate: "weeks"
};

const AICS_WARNINGS_KEY_MAPPING = {
  Nome: "firstName",
  Cognome: "lastName",
  Squadra: "team",
  Numero: "number"
}

const AICS_SPECIAL_MEASURES_KEY_MAPPING = {
  Nome: "firstName",
  Cognome: "lastName",
  Squadra: "team",
  Numero: "number",
  DataInizio: "startDate",
  DataFine: "endDate",
  Note: "notes"
}


module.exports = {
  AICS_BASE_URL,
  AICS_FUTSAL_TOURNAMENTS,
  AICS_TEAMS_RANKING_KEY_MAPPING,
  AICS_PLAYERS_RANKING_KEY_MAPPING,
  AICS_LAST_RESULTS_KEY_MAPPING,
  AICS_MATCH_RESULTS_KEY_MAPPING,
  AICS_NEXT_MATCHES_KEY_MAPPING,
  AICS_SUSPANSIONS_KEY_MAPPING,
  AICS_WARNINGS_KEY_MAPPING,
  AICS_SPECIAL_MEASURES_KEY_MAPPING
};
