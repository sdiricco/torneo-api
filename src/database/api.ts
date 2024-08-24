import { create } from './mongo'
import { ITournament } from './interfaces'
import { MongoClient } from 'mongodb'

const getTournamentsCollection = (client: MongoClient) =>
  client.db('aics').collection<ITournament>('tournaments')

export async function updateTournamentsToDB(
  dataDecoded: any[] = [],
): Promise<any> {
  //create client and connect to DB
  const client = create()
  await client.connect()
  console.log('DB connected')

  //get tournaments collection
  const tournamentsCollection = getTournamentsCollection(client)

  //create new data
  const data: ITournament = {
    lastUpdate: new Date(),
    values: dataDecoded,
  }

  //update data to DB
  const result = await tournamentsCollection.updateOne({}, { $set: data })

  //close connection
  await client.close()
  console.log('Close DB connection')
  return result
}

export async function getTournamentsFromDB(): Promise<any> {
  //create client and connect to DB
  const client = create()
  await client.connect()
  console.log('DB connected')

  //get tournaments collection
  const tournamentsCollection = getTournamentsCollection(client)

  //get data from DB
  const result = (await tournamentsCollection.find().toArray())[0]

  //close connection
  await client.close()
  console.log('Close DB connection')
  return result
}
