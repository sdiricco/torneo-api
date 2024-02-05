import express from "express";
import * as torneoController from "../../controllers/torneoController";

const router = express.Router();

router.get("/teams", torneoController.getTeams);
router.get("/teams/:id", torneoController.getTeamDetails);
router.get("/tournaments", torneoController.getTournaments);
router.get("/tournaments/:id", torneoController.getTournamentDetails);
router.get("/tournaments/:id/players", torneoController.getPlayersStats);
router.get("/tournaments/:id/calendar/:week", torneoController.getTournamentCalendar);

export default router;
