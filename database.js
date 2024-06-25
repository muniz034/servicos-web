import pkg from 'pg';

const { Client } = pkg;

const client = new Client({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'admin',
  database: 'postgres'
});

client.connect()
  .then(() => console.log('Connected to the database'))
  .catch(err => console.error('Connection error', err.stack));


export default client;