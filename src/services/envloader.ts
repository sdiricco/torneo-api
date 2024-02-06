import { cleanEnv, str, num } from 'envalid'

const env = cleanEnv(process.env, {
  AICS_BASE_URL: str(),
  MONGO_URI: str(),
  PORT: num(),
})

export default env
