export class Resultado {
    constructor(data_iniSE, SE, casos_est, casos_est_min, casos_est_max, casos, p_rt1, p_inc100k, Localidade_id, nivel, id, versao_modelo, tweet, Rt, pop, tempmin, umidmax, receptivo, transmissao, nivel_inc, umidmed, umidmin, tempmed, tempmax, casprov, casprov_est, casprov_est_min, casprov_est_max, casconf, notif_accum_year) {
        this.data_iniSE = data_iniSE;
        this.SE = SE;
        this.casos_est = casos_est;
        this.casos_est_min = casos_est_min;
        this.casos_est_max = casos_est_max;
        this.casos = casos;
        this.p_rt1 = p_rt1;
        this.p_inc100k = p_inc100k;
        this.Localidade_id = Localidade_id;
        this.nivel = nivel;
        this.id = id;
        this.versao_modelo = versao_modelo;
        this.tweet = tweet;
        this.Rt = Rt;
        this.pop = pop;
        this.tempmin = tempmin;
        this.umidmax = umidmax;
        this.receptivo = receptivo;
        this.transmissao = transmissao;
        this.nivel_inc = nivel_inc;
        this.umidmed = umidmed;
        this.umidmin = umidmin;
        this.tempmed = tempmed;
        this.tempmax = tempmax;
        this.casprov = casprov;
        this.casprov_est = casprov_est;
        this.casprov_est_min = casprov_est_min;
        this.casprov_est_max = casprov_est_max;
        this.casconf = casconf;
        this.notif_accum_year = notif_accum_year;
    }
    
    static parse(data){
        let resultado = new Resultado();

        for(let entry of Object.keys(data)) resultado[entry] = data[entry];

        return resultado;
    }
}