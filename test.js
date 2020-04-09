const puppeteer = require('puppeteer'); // Chromium web automation tool
const config = require('./config.js'); // Configuration settings you can edit
const chalk = require('chalk'); // Command prompt styling and colors
const argv = require('yargs').argv; // Grabbing command-line arguments
const fs = require('fs'); // File system

// Testing out passing a Promise in evaluate()

let test = async () => {
	
	var data = "";
	var tagsFired = 0;
	

	const getData = function() {
		var h;
		const url='https://dog.ceo/api/breeds/image/random';
		for( var i = 0; i < 3; i++) {
			h = new XMLHttpRequest();
		//return new Promise( (resolve) => {
			h.open("GET", url + "?count=" + i);
			h.send();
		}
		//})
	}

	const browser = await puppeteer.launch({headless: false});
	const page = await browser.newPage();

	await page.setDefaultTimeout(0); // Don't throw an error if a page doesn't load within 30 seconds.
	await page.setViewport({width: config.browserWidth, height: config.browserHeight});
	await page.goto("https://www.google.com", {waitUntil: 'networkidle0', timeout: 0});

	page.on('response', async res => {
	   	// Listen for any Adobe request containing "b/ss"
	    if (res.url().indexOf("breeds") > -1 ) {
	    	
	    	var count = new URL(res.url()).searchParams.get('count');
	    	var text = await res.text();

	    	// Check if they have POST data
	    	//var post = req.response() || req.url();
	    	console.log(count + " : " + text);
	    	tagsFired++;

	    }
	});

	await page.evaluate(getData);


	const timeoutPromise = timeout => new Promise((resolve) => setTimeout(resolve, timeout));
	const waitForAllTemplates = options => new Promise( async resolve => {
		var timeout = options && options.timeout ? options.timeout / 100 : 300;
		for( var i = 0; i < timeout; i++) {
			await timeoutPromise(100);
			if( tagsFired == 3) resolve(true);
		}
		resolve(false);
	})
	console.log("end----------");
	await waitForAllTemplates({timeout : 30000})
	console.log("endCount = " + tagsFired);
	//await page.waitForResponse('https://dog.ceo/api/breeds/image/random');
	await browser.close();
}

test().catch(error => {
	console.error("Not sure what went wrong. Investigate!");
	console.error(error);
	process.exit(1);
});