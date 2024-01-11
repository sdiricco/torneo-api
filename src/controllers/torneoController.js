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

const getStandings = async (req, res) => {
  try {
    const {id} = req.query
    const data = await torneoService.getStandings(id);
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

const getPlayers = async (req, res) => {
  try {
    const {id} = req.query
    const data = await torneoService.getPlayers(id);
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
  getStandings,
  getPlayers
};
