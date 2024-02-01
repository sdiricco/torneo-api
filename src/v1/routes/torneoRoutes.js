const express = require("express");
const torneoController = require("../../controllers/torneoController");

const router = express.Router();

router.get("/teams", torneoController.getTeams)
router.get("/teams/:id", torneoController.getTeamDetails)
router.get("/tournaments", torneoController.getTournaments)
router.get("/tournaments/v2", torneoController.getTournamentsV2)
router.get("/tournaments/:id", torneoController.getTournamentDetails)
router.get("/tournaments/:id/players", torneoController.getPlayersStats);
router.get("/tournaments/:id/calendar/:week", torneoController.getTournamentCalendar);



module.exports = router;