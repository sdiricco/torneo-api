import { MongoClient, ServerApiVersion } from "mongodb";

const uri = "mongodb+srv://sdiricco:4utF98DFcYuHMYP8@cluster0.7ooa4te.mongodb.net/?retryWrites=true&w=majority";

function create(): MongoClient {
  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });
  return client;
}

export { create };
