import morgan from "morgan";
import chalk from "chalk";

const  morganChalk = morgan((tokens, req, res) => {
	return parseArray({
		statusCode: "/" + tokens.status(req, res) + "/",
		route: tokens.url(req, res),
		url: tokens.url(req, res),
		method: tokens.method(req, res),
		time: tokens["response-time"](req, res) + " ms"
	});
});

function parseArray(values){
	let {
		statusCode,
		route,
		url,
		method,
		time
	} = values;

	route = parseRoute(route);
	method = parseMethod(method);
	time = parseTime(time);

	let array = [
		chalk.yellow.bold(statusCode),
		route,
		chalk.white(url),
		method,
		time
	].join(" ");

	return array;
}

function parseRoute(uri){
	let routes = {
		municipios: "MUNICIPIOS",
		estados: "ESTADOS"
	};

	let match = uri.match(/^[/]$|[^/]+(?:(?!\/)*)/);

	if(match) uri = match[0];

	if(!routes[uri] || routes[uri] === undefined) return chalk.magenta.bold("NO HANDLER");

	return chalk.magenta.bold(routes[uri]);
}

function parseMethod(method){
	let methods = {
		GET: (method) => chalk.green.bold(method),
		POST: (method) => chalk.yellow.bold(method),
		PATCH: (method) => chalk.grey.bold(method),
		DELETE: (method) => chalk.red.bold(method),
		OPTIONS: (method) => chalk.magenta.bold(method),
	};

	method = methods[method](method);

	return method;
}

function parseTime(time){
	let timeValue = parseFloat(time);

	if(timeValue <= 500){
		return chalk.green(time);
	}else if(timeValue > 500 && timeValue <= 1000){
		return chalk.yellow(time);
	}else if(timeValue > 1000){
		return chalk.red(time);
	}else{
		return chalk.red("ERROR");
	}
}

export default morganChalk;