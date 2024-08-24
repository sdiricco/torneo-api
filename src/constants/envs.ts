export function getAicsBaseUrl() {
  const AICS_BASE_URL = process.env.AICS_BASE_URL
  if (!AICS_BASE_URL) {
    throw 'AICS_BASE_URL is not defined in environment'
  }
  return AICS_BASE_URL
}

export function getMongoUri() {
  const MONGO_URI = process.env.MONGO_URI
  if (!MONGO_URI) {
    throw 'MONGO_URI is not defined in environment'
  }
  return MONGO_URI
}
