import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();
const { Pool } = pkg;

let dbUrl = process.env.DATABASE_URL;

if (process.env.DOCKER_ENV === 'true') {
  dbUrl = dbUrl.replace('localhost', 'host.docker.internal');
}

const pool = new Pool({
  connectionString: dbUrl
});

pool.on('connect', (client) => {
  client.userLogin = 'anonymous';
});

export default pool;
