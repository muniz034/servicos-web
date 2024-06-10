// Pedro: http://expressjs.com/en/guide/routing.html
import express from "express";
import morgan from "morgan";

const app = express();

app.use(morgan(":method :url :status (:response-time ms)"));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(8080, () => {
    console.log(`Example app listening on port 8080`);
});

// Pedro: 
// Possibilidade de criar um mini banco (sqlite) com tabela municipio (id, estado, geocode) p/ poder buscar por estado tbm
// Utilizar como referencia: https://restfulapi.net/resource-naming/ (Aderência da Solução aos princípios REST)

// Pedro:
// Algumas ideias
// /cidade/{nomeDaCidade} => Busca os dados da cidade no ano atual (semanas 1 a 53)
// /cidade/{nomeDaCidade}?inicio=0000&fim=0000 => Busca os dados da cidade entre o ano inicio (semana 1) e o ano fim (semana 53)
// /estado/{siglaDoEstado} => Busca os dados do estado (busca todas cidades no estado e faz as requisicões)
// /estado/{siglaDoEstado}?inicio=0000%fim=0000 => Busca os dados do  estado entre o ano inicio (semana 1) e o ano fim (semana 53)