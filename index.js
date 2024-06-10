import cidades from "./geocode.json" with { type: "json" };

import { Parametros } from "./Parametros.js";
import { Resultado } from "./Resultado.js";

// Onde <PARAMETROS_DA_CONSULTA> deve conter os parâmetros:
//     geocode: código IBGE da cidade
//     disease: tipo de doença a ser consultado (str:dengue|chikungunya|zika)
//     format: formato de saída dos dados (str:json|csv)
//     ew_start: semana epidemiológica de início da consulta (int:1-53)
//     ew_end: semana epidemiológica de término da consulta (int:1-53)
//     ey_start: ano de início da consulta (int:0-9999)
//     ey_end: ano de término da consulta (int:0-9999)

// 3304557 - Rio de Janeiro
// 3303302 - Niterói
// 3304607 - Santa Maria Madalena
// 3534401 - Osasco
// 3303906 - Petrópolis

// Todos os parâmetros acima mencionados são obrigatórios para a consulta.

const parametros = new Parametros(3304557, { anoInicio: 2020, anoFim: 2020, semanaInicio: 1, semanaFim: 40 });

const url = "https://info.dengue.mat.br/api/alertcity?" + parametros.toSearchParams();

console.log(`Making a call to ${url}`);

const data = await fetch(url);
const result = await data.json();
const resultados = [];

console.log(`Total results: ${result.length}`);

for(const i in result){
    resultados.push(Resultado.parse(result[i]));
}

console.log(resultados);
