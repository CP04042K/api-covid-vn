const utils = require("./utils");
const env = require('dotenv').config();
const http = require("http");

const dataFetcher = new utils.dataFetcher();

http.createServer((req, res) => {
	//build request each time refresh to pick a new user-agent
	dataFetcher.buildRequest("ncov.moh.gov.vn", 443, "/", env.METHOD_GET);
	dataFetcher.getData(1).then((data) => {
		console.log("Data fetched");
		// when data is fetched and processed, display it to the client
		res.writeHead(200, {"Content-Type": "application/json"});
		res.write(JSON.stringify(data, null, 3));
		res.end();
	});
}).listen(8080);

// to run the code, use the command "npm install" in the same directory as the source code