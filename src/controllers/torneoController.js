// In src/controllers/workoutController.js
const torneoService = require("../services/torneoService");

const getStandings = async (req, res) => {
  try {
    const data = await torneoService.getStandings();
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
  getStandings,
};
