import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import path from "path";
import express from "express";

const swaggerPath = path.resolve(__dirname, "./swagger.yml");
const swaggerDocument = YAML.load(swaggerPath);

const swagger = (app: express.Application, port: number) => {
  app.use("/api/v1/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
};

export { swagger };
