const https = require("https");
const parser = require("node-html-parser").parse;
const env = require('dotenv').config();

class dataFetcher {
	constructor() {
		this.options = {};
	}

	getUserAgents() {
		var ua = [
			"Opera/8.23 (X11; Linux x86_64; sl-SI) Presto/2.9.266 Version/11.00",
			"Mozilla/5.0 (X11; Linux x86_64; rv:5.0) Gecko/20100714 Firefox/37.0",
			"Opera/9.96 (Windows CE; en-US) Presto/2.11.329 Version/12.00",
			"Opera/9.42 (X11; Linux x86_64; en-US) Presto/2.8.210 Version/11.00",
			"Mozilla/5.0 (X11; Linux i686; rv:5.0) Gecko/20110222 Firefox/36.0",
			"Mozilla/5.0 (Windows NT 6.0) AppleWebKit/5352 (KHTML, like Gecko) Chrome/36.0.812.0 Mobile Safari/5352",
			"Mozilla/5.0 (Windows NT 6.0; en-US; rv:1.9.0.20) Gecko/20191212 Firefox/37.0",
			"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36"
		];
		// choose a random user-agent
		return ua[Math.floor(Math.random() * ua.length)];
	}

	addOption(key, value) {
		this.options[key] = value;
	}
	// setting options for "https" module
	buildRequest(host, port = 80, path, method = env.METHOD_GET, headers = {}) {
		headers["User-Agent"] = this.getUserAgents();
		console.log(this.getUserAgents());
		this.addOption("host", host);
		this.addOption("port", port);
		this.addOption("path", path);
		this.addOption("method", method);
		this.addOption("headers", headers)
		this.addOption("rejectUnauthorized", false);
	}
	// process returned data and convert it to object for later display
	getCases(raw) {
		var data = parser(raw);
		var casesArr = [];
		var cases = {
			VN: {},
			WORLD: {}
		};
		var keys = ["total", "treating", "cured", "death"];
		var casesElems = data.querySelectorAll(".font24");
		// get first 8 elements cuz the rest is duplicate
		for (let i = 0; i < 8; i++) {
			casesArr.push(casesElems[i].text);
		}
		// 2 for loop is used to add figures into the "cases" object
		for (let key of keys) {
			cases.VN[key] = casesArr[0];
			casesArr.shift();
		}
		for (let key of keys) {
			cases.WORLD[key] = casesArr[0];
			casesArr.shift();
		}
		return cases;
	}

	getVNCases(raw) {
		var data = parser(raw);
		var treatingCasesElems = data.querySelectorAll(".hidden-scrollbar .inner .text-danger");
		//under construction
	}

	getData(type = 1) {
		return new Promise((resolve) => {
			var resp;
			var request = https.request(this.options, (res) => {
				res.on("data", (chunk) => {
					// write all chunks to "resp" 
					resp += chunk.toString();
				});
				//when response finish, resolve the data
				res.on("end", () => {
					if (type === 1)
						resolve(this.getCases(resp));
					else 
						resolve(this.getVNCases(resp));
				})
			});
			request.end();			
			request.on("error", (err) => {
				console.log(err);
			});
		});
	}
}

module.exports.dataFetcher = dataFetcher;