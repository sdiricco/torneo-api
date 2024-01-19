const torneoService = require("../services/torneoService");

const getTournaments = (req, res) => {
  try {
    const data = torneoService.getTournaments();
    res.send({
      status: "OK",
      data
    });
  } catch (error) {
    res
      .status(error?.status || 500)
      .send({ status: "FAILED", data: { error: error?.message || error } });
  }
}

const getTournamentDetails = async (req, res) => {
  try {
    const {id} = req.params
    const data = await torneoService.getTournamentDetails(id);
    res.send({
      status: "OK",
      data
    });
  } catch (error) {
    res
      .status(error?.status || 500)
      .send({ status: "FAILED", data: { error: error?.message || error } });
  }
}

const getTeamsRanking = async (req, res) => {
  try {
    const {id} = req.params
    const data = await torneoService.getTeamsRanking(id);
    res.send({
      status: "OK",
      data
    });
  } catch (error) {
    res
      .status(error?.status || 500)
      .send({ status: "FAILED", data: { error: error?.message || error } });
  }
};

const getMatchResults = async (req, res) => {
  try {
    const {id} = req.params
    const data = await torneoService.getMatchResults(id);
    res.send({
      status: "OK",
      data
    });
  } catch (error) {
    res
      .status(error?.status || 500)
      .send({ status: "FAILED", data: { error: error?.message || error } });
  }
};


const getLatestMatchResults = async (req, res) => {
  try {
    const {id} = req.params
    const data = await torneoService.getLatestMatchResults(id);
    res.send({
      status: "OK",
      data
    });
  } catch (error) {
    res
      .status(error?.status || 500)
      .send({ status: "FAILED", data: { error: error?.message || error } });
  }
};

const getNextMatches = async (req, res) => {
  try {
    const {id} = req.params
    const data = await torneoService.getNextMatches(id);
    res.send({
      status: "OK",
      data
    });
  } catch (error) {
    res
      .status(error?.status || 500)
      .send({ status: "FAILED", data: { error: error?.message || error } });
  }
};

const getDisciplinaryMeasurements = async (req, res) => {
  try {
    const {id} = req.params
    const data = await torneoService.getDisciplinaryMeasurements(id);
    res.send({
      status: "OK",
      data
    });
  } catch (error) {
    res
      .status(error?.status || 500)
      .send({ status: "FAILED", data: { error: error?.message || error } });
  }
};

const getPlayersRanking = async (req, res) => {
  try {
    const {id} = req.params
    const data = await torneoService.getPlayersRanking(id);
    res.send({
      status: "OK",
      data
    });
  } catch (error) {
    res
      .status(error?.status || 500)
      .send({ status: "FAILED", data: { error: error?.message || error } });
  }
};

module.exports = {
  getTournaments,
  getTournamentDetails,
  getTeamsRanking,
  getPlayersRanking,
  getLatestMatchResults,
  getNextMatches,
  getMatchResults,
  getDisciplinaryMeasurements
};
