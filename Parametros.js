export class Parametros {
    constructor(
        geocode,
        intervalo
    ) {
        this.geocode = geocode;
        this.intervalo = intervalo;
    }

    toSearchParams() {
        return new URLSearchParams({
            geocode: this.geocode,
            disease: "dengue",
            format: "json",
            ew_start: this.intervalo.semanaInicio,
            ew_end: this.intervalo.semanaFim,
            ey_start: this.intervalo.anoInicio,
            ey_end: this.intervalo.anoFim
        });
    }
}