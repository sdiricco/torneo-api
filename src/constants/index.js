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

module.exports = {
  AICS_FUTSAL_TOURNAMENTS,
  AICS_TEAMS_RANKING_KEY_MAPPING,
  AICS_PLAYERS_RANKING_KEY_MAPPING,
};
