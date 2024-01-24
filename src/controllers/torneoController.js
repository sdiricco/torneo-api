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

const getTeams = async (req, res) => {
  try {
    const data = await torneoService.getTeams();
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

const getTeamDetails = async (req, res) => {
  try {
    const {id} = req.params
    const data = await torneoService.getTeamDetails(id);
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




const getPlayersStats = async (req, res) => {
  try {
    const {id} = req.params
    const data = await torneoService.getPlayersStats(id);
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
  getTeams,
  getTeamDetails,
  getTournaments,
  getTournamentDetails,
  getPlayersStats,
  getMatchResults,
};
