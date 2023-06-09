// // In src/v1/swagger.js
// const swaggerJSDoc = require("swagger-jsdoc");
// const swaggerUi = require("swagger-ui-express");

// // Basic Meta Informations about our API
// const options = {
//   definition: {
//     openapi: "3.0.0",
//     info: { title: "Crossfit WOD API", version: "1.0.0" },
//   },
//   apis: ["./src/v1/routes/workoutRoutes.js", "./src/database/Workout.js"],
// };
const swaggerUi = require("swagger-ui-express");
const YAML = require('yamljs');
const path = require("path")

const swaggerPath = path.resolve(__dirname, './swagger.yml')
const swaggerDocument = YAML.load(swaggerPath)

const swagger = (app, port) => {
  app.use(
    '/api/v1/docs',
    swaggerUi.serve, 
    swaggerUi.setup(swaggerDocument)
  );
}



module.exports = { swagger };