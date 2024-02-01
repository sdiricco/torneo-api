const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = "mongodb+srv://sdiricco:4utF98DFcYuHMYP8@cluster0.7ooa4te.mongodb.net/?retryWrites=true&w=majority";

function create() {
  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });
  return client;
}

module.exports = {
    create,
}
