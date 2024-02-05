import { Request, Response } from "express";
import * as torneoService from "../services/torneoService";

const getTournaments = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = await torneoService.getTournaments();
    res.send({
      status: "OK",
      data,
    });
  } catch (error: any) {
    res.status(500).send({ status: "FAILED", data: { error: error?.message || error } });
  }
};

const getTeams = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = await torneoService.getTeams();
    res.send({
      status: "OK",
      data,
    });
  } catch (error: any) {
    res.status(500).send({ status: "FAILED", data: { error: error?.message || error } });
  }
};

const getTeamDetails = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const data = await torneoService.getTeamDetails(id);
    res.send({
      status: "OK",
      data,
    });
  } catch (error: any) {
    res.status(500).send({ status: "FAILED", data: { error: error?.message || error } });
  }
};

const getTournamentDetails = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const data = await torneoService.getTournamentDetails(id);
    res.send({
      status: "OK",
      data,
    });
  } catch (error: any) {
    res.status(500).send({ status: "FAILED", data: { error: error?.message || error } });
  }
};

const getTournamentCalendar = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id, week } = req.params;
    const data = await torneoService.getTournamentCalendar(id, week);
    res.send({
      status: "OK",
      data,
    });
  } catch (error: any) {
    res.status(500).send({ status: "FAILED", data: { error: error?.message || error } });
  }
};

const getPlayersStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const data = await torneoService.getPlayersStats(id);
    res.send({
      status: "OK",
      data,
    });
  } catch (error: any) {
    res.status(500).send({ status: "FAILED", data: { error: error?.message || error } });
  }
};

export { getTeams, getTeamDetails, getTournaments, getTournamentDetails, getPlayersStats, getTournamentCalendar };
