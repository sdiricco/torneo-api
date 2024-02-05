import { MongoClient, ServerApiVersion } from 'mongodb'
import { MONGO_URI } from '../constants/index'

function create(): MongoClient {
  const client = new MongoClient(MONGO_URI, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  })
  return client
}

export { create }
