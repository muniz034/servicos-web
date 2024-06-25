function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

async function getEstados() {
    const res = await fetch("http://localhost:8080/estados");
    return await res.json();
}

async function getMunicipios(estadoId) {
    const res = await fetch(`http://localhost:8080/municipios/uf/${estadoId}`);
    return await res.json();
}

async function getSE(ano) {
    const res = await fetch(`http://localhost:8080/se/${ano}`);
    return await res.json();
}

async function searchByMunicipio({geocode, anoInicio, anoFim, semanaInicio, semanaFim, doenca}) {
    const res = await fetch(`http://localhost:8080/municipios/${geocode}?anoInicio=${anoInicio}&anoFim=${anoFim}&semanaInicio=${semanaInicio}&semanaFim=${semanaFim}&doenca=${doenca}`);
    return await res.json();
}

function translateNivel(val) {
    switch(val) {
        case 1:
            return '<span class="badge bg-success">Verde</span>';
        case 2:
            return '<span class="badge bg-warning">Amarelo</span>';
        case 3:
            return '<span class="badge" style="background-color: #db430b">Laranja</span>';
        case 4:
            return '<span class="badge bg-danger">Vermelho</span>';
        default:
            return val;
    }
}

function translateReceptivo(val) {
    switch(val) {
        case 0:
            return "Desfavorável";
        case 1:
            return "Favorável";
        case 2:
            return "Favorável por pelo menos 1 semana";
        case 3:
            return "Favorável por pelo menos 3 semanas";
        default:
            return val;
    }
}

let actualChart = null;

const municipiosSelect = document.getElementById('select-municipios');
const estadosSelect = document.getElementById('select-estados');

const seAnoInicioSelect = document.getElementById('select-anoInicio');
const seAnoFimSelect = document.getElementById('select-anoFim');

const seInicioSelect = document.getElementById('select-seInicio');
const seFimSelect = document.getElementById('select-seFim');

const pesquisarButton = document.getElementById('button-pesquisar');

const grafico = document.getElementById('linePlot').getContext("2d");

window.onload = async() => {
    const estados = await getEstados();
    for(const estado of estados) estadosSelect.appendChild(new Option(estado.nome, estado.id, false, false));
}

pesquisarButton.addEventListener('click', async function (e) {
    const geocode = municipiosSelect.value;
    const anoInicio = seAnoInicioSelect.value;
    const anoFim = seAnoFimSelect.value;
    const semanaInicio = seInicioSelect.value;
    const semanaFim = seFimSelect.value;
    const doenca = document.querySelector(".form-check-input:checked").value;

    const municipio = await searchByMunicipio({ geocode, anoInicio, anoFim, semanaInicio, semanaFim, doenca });

    const resultadoTBody = document.getElementById('tbody-resultado');
    const sumario = document.getElementById('sumario-pesquisa');
    const sumarioGrafico = document.getElementById('sumario-grafico');

    let resultHTML = "";

    for(const resultado of municipio.resultados) {
        resultHTML += "<tr>";
        resultHTML += `<th scope="row">${new Date(resultado.data_iniSE).toLocaleDateString("pt-BR")}</th>`;
        resultHTML += `<td>${resultado.casos}</td>`;
        resultHTML += `<td>${translateNivel(resultado.nivel)}</td>`;
        resultHTML += `<td>${translateReceptivo(resultado.receptivo)}</td>`;
        resultHTML += "</tr>";
    }

    const inicio = new Date(municipio.resultados[0].data_iniSE).toLocaleDateString("pt-BR");
    const fim = new Date(municipio.resultados[municipio.resultados.length - 1].data_iniSE).toLocaleDateString("pt-BR");

    resultadoTBody.innerHTML = resultHTML;
    sumario.innerText = `Casos de ${capitalizeFirstLetter(doenca)} em ${municipio.nome} de ${fim} à ${inicio}`;
    sumarioGrafico.innerText = `Casos de ${capitalizeFirstLetter(doenca)} em ${municipio.nome} de ${fim} à ${inicio}`;

    const data = municipio.resultados
        .sort((a, b) => {
            return new Date(a.data_iniSE) - new Date(b.data_iniSE);
        })
        .map(resultado => {
            return { x: new Date(resultado.data_iniSE).toLocaleDateString("pt-BR"), y: resultado.casos };
        });

    if(actualChart){
        actualChart.clear();
        actualChart.destroy();
    }
    
    actualChart = new Chart(grafico, {
        type: 'line',
        data: {
            datasets: [{
                label: 'Casos',
                data: data,
                borderWidth: 1
            }]
        }
    });

    document.getElementById("div-tabela").style.removeProperty("display");
});

estadosSelect.addEventListener('change', async function (e) {
    const estadoSelecionado = e.target.value;

    if(estadoSelecionado == -1) return municipiosSelect.disabled = true;

    const municipios = await getMunicipios(estadoSelecionado);

    municipiosSelect.innerHTML = "<option selected>Selecione...</option>";

    for(const municipio of municipios) municipiosSelect.appendChild(new Option(municipio.nome, municipio.geocode, false, false));
    
    municipiosSelect.disabled = false;
});

seAnoInicioSelect.addEventListener('change', async function (e) {
    const anoSelecionado = e.target.value;

    if(anoSelecionado == -1) return seInicioSelect.disabled = true;

    const se = await getSE(anoSelecionado);

    seInicioSelect.innerHTML = "<option selected>Selecione...</option>";

    for(const semana of se) seInicioSelect.appendChild(new Option(`${semana.semana} - ${new Date(semana.inicio).toLocaleDateString("pt-BR")} à ${new Date(semana.fim).toLocaleDateString("pt-BR")}`, semana.semana, false, false));
    
    seInicioSelect.disabled = false;
});

seAnoFimSelect.addEventListener('change', async function (e) {
    const anoSelecionado = e.target.value;

    if(anoSelecionado == -1) return seFimSelect.disabled = true;

    const se = await getSE(anoSelecionado);

    seFimSelect.innerHTML = "<option selected>Selecione...</option>";

    for(const semana of se) seFimSelect.appendChild(new Option(`${semana.semana} - ${new Date(semana.inicio).toLocaleDateString("pt-BR")} à ${new Date(semana.fim).toLocaleDateString("pt-BR")}`, semana.semana, false, false));
    
    seFimSelect.disabled = false;
});