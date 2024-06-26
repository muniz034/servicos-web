import { AlertaDengueAPI } from "./AlertaDengueAPI.js";
import { Parametros } from "./Parametros.js";
import morganChalk from "./morgan.js";
import client from "./database.js";
import express from "express";
import cors from 'cors';
import { Resultado } from "./Resultado.js";


const app = express();

app.use(cors({
  origin: '*'
}));
app.use(morganChalk);

app.get("/se/:ano", async (req, res) => {
  const ano = req.params.ano;
  const se = await client.query("SELECT * FROM se WHERE ano = $1", [ano]);
  res.status(200).send(se.rows);
});

app.get("/municipios", async (req, res) => {
  const municipios = await client.query("SELECT * FROM cidades");
  res.status(200).send(municipios.rows);
});

app.get("/municipios/uf/:estadoId", async (req, res) => {
  const estadoId = req.params.estadoId;
  const municipios = await client.query("SELECT * FROM cidades WHERE estado_id = $1", [estadoId]);
  res.status(200).send(municipios.rows);
});

app.get("/municipios/:geocode", async (req, res) => {
  const { anoInicio, anoFim, semanaInicio, semanaFim, doenca } = req.query;
  const geocode = req.params.geocode;

  if (!anoInicio || !anoFim || !semanaInicio || !semanaFim || !doenca) return res.status(500).send("Falta query!");

  const municipio = await client.query("SELECT * FROM cidades WHERE geocode = $1", [geocode]);

  if (!municipio) return res.status(404).send("Não existe cidade com este geocode");

  const parametros = new Parametros(geocode, doenca, { anoInicio, anoFim, semanaInicio, semanaFim });

  const result = await AlertaDengueAPI.searchByMunicipio(parametros);

  res.status(200).send({ ...municipio.rows[0], resultados: result });
});

app.get("/estado/:estadoID", async (req, res) => {
  const { anoInicio, anoFim, semanaInicio, semanaFim, doenca } = req.query;
  const estadoID = req.params.estadoID;

  if (!anoInicio || !anoFim || !semanaInicio || !semanaFim || !doenca) return res.status(500).send("Falta query!");

  const valoresEstados = await client.query("SELECT geocode FROM public.cidades WHERE estado_id = $1", [estadoID]);
  const nomeEstado = await client.query("SELECT nome FROM public.estados WHERE id = $1", [estadoID]);


  const aggResult = {};
  for (let i = 0; i < valoresEstados.rows.length; i++) {
    const parametros = new Parametros(valoresEstados.rows[i]['geocode'], doenca, { anoInicio, anoFim, semanaInicio, semanaFim });
    const results = await AlertaDengueAPI.searchByUF(parametros);

    for(const result of results) {
      if(!aggResult[result.SE]){
        aggResult[result.SE] = {
          data_iniSE: result.data_iniSE,
          casos: 0,
          nivel: 0,
          receptivo: 0,
        }
      }

      aggResult[result.SE].casos += result.casos;
      aggResult[result.SE].nivel += result.nivel / valoresEstados.rows.length;
      aggResult[result.SE].receptivo += result.receptivo / valoresEstados.rows.length;
    }
  }

  const finalResult = [];

  for(const SE in aggResult) {
    finalResult.push({ SE, casos: aggResult[SE].casos, data_iniSE: aggResult[SE].data_iniSE, nivel: aggResult[SE].nivel, receptivo: aggResult[SE].receptivo });
  }

  res.status(200).send({nome : nomeEstado.rows[0].nome, resultados: finalResult});
});

app.get("/estados", async (req, res) => {
  const estados = await client.query("SELECT * FROM estados");
  res.status(200).send(estados.rows);
});

app.get("/estados/:estadoId", async (req, res) => {
  const { anoInicio, anoFim, semanaInicio, semanaFim, doenca } = req.query;
  const estadoId = req.params.estadoId;

  if (!anoInicio || !anoFim || !semanaInicio || !semanaFim || !doenca) return res.status(500).send("Falta query!");

  const estado = await client.query("SELECT * FROM estados WHERE id = $1", [estadoId]);

  if (estado.rows === 0) return res.status(404).send("Não existe estado com este id");

  const cidades = await client.query("SELECT * FROM cidades WHERE estado_id = $1", [estadoId]);

  const results = [];

  for (const cidade of cidades.rows) {
    let parametros = new Parametros(cidade.geocode, doenca, { anoInicio, anoFim, semanaInicio, semanaFim });
    const result = await AlertaDengueAPI.searchByMunicipio(parametros);
    results.push({ ...cidade, resultados: results });
  }

  res.status(200).send(results);
});

app.listen(8080, () => {
  console.log(`App listening on port 8080`);
});