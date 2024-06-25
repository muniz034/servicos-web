export class Parametros {
    constructor(geocode, doenca, intervalo) {
        this.geocode = geocode;
        this.intervalo = intervalo;
        this.doenca = doenca;
    }

    toSearchParams() {
        return new URLSearchParams({
            geocode: this.geocode,
            disease: this.doenca,
            format: "json",
            ew_start: this.intervalo.semanaInicio,
            ew_end: this.intervalo.semanaFim,
            ey_start: this.intervalo.anoInicio,
            ey_end: this.intervalo.anoFim
        });
    }
}