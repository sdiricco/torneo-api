const express = require("express");
const torneoController = require("../../controllers/torneoController");

const router = express.Router();

router.get("/standings", torneoController.getStandings);
router.get("/players", torneoController.getPlayers);

module.exports = router;