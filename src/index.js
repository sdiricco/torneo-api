// In src/index.js
const express = require("express");
const bodyParser = require("body-parser");
const cors = require('cors');
const v1TorneoRouter = require("./v1/routes/torneoRoutes");

const { swagger } = require("./v1/swagger");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use("/api/v1/torneo", v1TorneoRouter);

app.listen(PORT, () => {
  console.log(`API is listening on port ${PORT}`);
  console.log(`base url:`, "/api/v1/torneo");
  swagger(app, PORT);
});