// In src/index.ts
import * as dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import v1TorneoRouter from "./v1/routes/torneoRoutes";
import { swagger } from "./v1/swagger";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use("/api/v1/torneo", v1TorneoRouter);

app.listen(PORT, () => {
  console.log(`API is listening on port ${PORT}`);
  console.log(`base url:`, "/api/v1/torneo");
  swagger(app, PORT);
});
