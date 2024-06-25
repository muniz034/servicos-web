export class Resultado {
    constructor(data_iniSE, SE, casos_est, casos_est_min, casos_est_max, casos, p_inc100k, nivel, pop, receptivo, umidmed, tempmed, notif_accum_year) {
        this.data_iniSE = data_iniSE; // Fica
        this.SE = SE; // Fica
        this.casos_est = casos_est; // Fica
        this.casos_est_min = casos_est_min; // Fica
        this.casos_est_max = casos_est_max; // Fica
        this.casos = casos; // Fica
        this.p_inc100k = p_inc100k; // Fica
        this.nivel = nivel; // Fica
        this.pop = pop; // Fica
        this.receptivo = receptivo; // Fica
        this.umidmed = umidmed; // Fica
        this.tempmed = tempmed; // Fica
        this.notif_accum_year = notif_accum_year; // Fica
    }
    
    static parse(data){
        let resultado = new Resultado();

        for(let entry of Object.keys(resultado)){
            if(entry === "data_iniSE"){
                resultado[entry] = new Date(data[entry]);
            } else {
                resultado[entry] = data[entry];
            }
        }

        return resultado;
    }
}