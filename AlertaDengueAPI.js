import { Resultado } from "./Resultado.js";

export class AlertaDengueAPI {
    static url = "https://info.dengue.mat.br/api/alertcity?";

    constructor() {}

    static async searchByMunicipio(parametros) {
        const data = await fetch(AlertaDengueAPI.url + parametros.toSearchParams());
        const result = await data.json();
        const resultados = [];

        for(const i in result) resultados.push(Resultado.parse(result[i]));

        return resultados;
    }

    static async searchByUF(parametros) {
        return AlertaDengueAPI.searchByMunicipio(parametros);
    }
}