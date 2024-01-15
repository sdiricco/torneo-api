const express = require("express");
const torneoController = require("../../controllers/torneoController");

const router = express.Router();

router.get("/tournaments", torneoController.getTournaments)
router.get("/tournaments/:id", torneoController.getTournamentDetails)
router.get("/standings", torneoController.getStandings);
router.get("/last-results", torneoController.getLastResults);
router.get("/results/:id", torneoController.getResults);
router.get("/players", torneoController.getPlayers);

module.exports = router;