import cidades from "../municipios.json" with { type: "json" };
import malha from "../geojs-100-mun.json" with { type: "json" };
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


for(const cidade of cidades) {
    const geojson = malha.features.find(feature => feature.properties.id === `${cidade.id}`);

    const uf = cidade["regiao-imediata"]["regiao-intermediaria"].UF.sigla;
    const geocode = cidade.id;
    const nome = cidade.nome;

    const estados = await client.query("SELECT * FROM estado WHERE uf = $1", [cidade["regiao-imediata"]["regiao-intermediaria"].UF.sigla]);
    const estado = estados.rows[0];
    const result = await client.query("INSERT INTO cidades(nome, geocode, estado_id, malha) VALUES ($1, $2, $3, $4)", [nome, geocode, estado.id, geojson]);
    console.log(result);
}