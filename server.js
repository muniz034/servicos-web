import { AlertaDengueAPI } from "./AlertaDengueAPI.js";
import { Parametros } from "./Parametros.js";
import morganChalk from "./morgan.js";
import client from "./database.js";
import express from "express";

const app = express();

app.use(morganChalk);

app.get("/se/:ano", async(req, res) => {
  const ano = req.params.ano;
  const se = await client.query("SELECT * FROM se WHERE ano = $1", [ano]);
  res.status(200).send(se.rows);
});

app.get("/municipios", async(req, res) => {
  const municipios = await client.query("SELECT * FROM cidades");
  res.status(200).send(municipios.rows);
});

app.get("/municipios/uf/:estadoId", async(req, res) => {
  const estadoId = req.params.estadoId;
  const municipios = await client.query("SELECT * FROM cidades WHERE estado_id = $1", [estadoId]);
  res.status(200).send(municipios.rows);
});

app.get("/municipios/:geocode", async(req, res) => {
  const { anoInicio, anoFim, semanaInicio, semanaFim, doenca } = req.query;
  const geocode = req.params.geocode;

  if(!anoInicio || !anoFim || !semanaInicio || !semanaFim || !doenca) return res.status(500).send("Falta query!");

  const municipio = await client.query("SELECT * FROM cidades WHERE geocode = $1", [geocode]);

  if(!municipio) return res.status(404).send("Não existe cidade com este geocode");

  const parametros = new Parametros(geocode, doenca, { anoInicio, anoFim, semanaInicio, semanaFim });

  const result = await AlertaDengueAPI.searchByMunicipio(parametros);

  res.status(200).send({...municipio.rows[0], resultados: result});
});

app.get("/estados", async(req, res) => {
  const estados = await client.query("SELECT * FROM estados");
  res.status(200).send(estados.rows);
});

app.get("/estados/:estadoId", async(req, res) => {
  const { anoInicio, anoFim, semanaInicio, semanaFim, doenca } = req.query;
  const estadoId = req.params.estadoId;

  if(!anoInicio || !anoFim || !semanaInicio || !semanaFim || !doenca) return res.status(500).send("Falta query!");

  const estado = await client.query("SELECT * FROM estados WHERE id = $1", [estadoId]);

  if(estado.rows === 0) return res.status(404).send("Não existe cidade com este id");

  const cidades = await client.query("SELECT * FROM cidades WHERE estado_id = $1", [estadoId]);

  const results = [];

  for(const cidade of cidades.rows) {
    let parametros = new Parametros(cidade.geocode, doenca, { anoInicio, anoFim, semanaInicio, semanaFim });
    const result = await AlertaDengueAPI.searchByMunicipio(parametros);
    results.push({...cidade, resultados: results });
  }

  res.status(200).send(results);
});

app.listen(8080, () => {
    console.log(`App listening on port 8080`);
});