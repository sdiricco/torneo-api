const express = require("express");
const torneoController = require("../../controllers/torneoController");

const router = express.Router();

router.get("/teams", torneoController.getTeams)
router.get("/teams/:id", torneoController.getTeamDetails)
router.get("/tournaments", torneoController.getTournaments)
router.get("/tournaments/:id", torneoController.getTournamentDetails)
router.get("/tournaments/:id/teams-ranking", torneoController.getTeamsRanking);
router.get("/tournaments/:id/players-ranking", torneoController.getPlayersRanking);
router.get("/tournaments/:id/match-results", torneoController.getMatchResults);
router.get("/tournaments/:id/latest-match-results", torneoController.getLatestMatchResults)
router.get("/tournaments/:id/next-matches", torneoController.getNextMatches)
router.get("/tournaments/:id/disciplinary-measurements", torneoController.getDisciplinaryMeasurements)

module.exports = router;