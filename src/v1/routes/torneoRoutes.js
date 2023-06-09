const express = require("express");
const torneoController = require("../../controllers/torneoController");

const router = express.Router();

router.get("/standings", torneoController.getStandings);

module.exports = router;