// Testing web automation using Puppeteer

// TODO add "clear cookies" keyboard shortcut

const puppeteer = require('puppeteer'); // Chromium web automation tool
const puppeteerHar = require('puppeteer-har'); // Downloads har files through Puppeteer
const XLSX = require('xlsx'); // Write to an excel spreadsheet
const Console = require('console'); // Outputting to console
const readline = require('readline'); // Reading keyboard inputs on console
const chalk = require('chalk'); // Command prompt styling and colors
const inquirer = require('inquirer'); // Command line interface that asks questions and parses input 
const brands = require('./qa_env_accounts.js'); // Usernames and passwords of each brand QA env

const devices = require('puppeteer/DeviceDescriptors');
const iPhone = devices['iPhone X'];

// EDIT CONFIGURATION HERE --------------
const browserWidth = 1100;
const browserHeight = 800;
const generatePrompt = true; // Set to false to turn off the starting prompt

// Data points are network requests or browser variables that you want to capture on each page/request
// If it's a network request, it's search parameters will be separated into columns
// If it's a browser variable object, it's properties will be separated into columns
const dataPoints = {
	"Adobe" : {
		"networkKey" : (url) => url.indexOf("b/ss/") > -1,
		"extraColumns" : function(req, row) {
			if( row["events"] ) {
				row["nonTimingEvents"] = row["events"].split("event231")[0];
			}
		},
		"showInConsole" : true,
		"recordInExcel" : true,
		"impVars" : [
			"pageName",
			"nonTimingEvents", 
			"purchaseID",
			"products",
			"v33",
			"v50",
			"v48",
			"v4",
			"g"
		]
	},
	"Pinterest" : {
		"networkKey" : (url) => url.indexOf("pinterest") > -1 && url.indexOf("event=") > -1,
		"extraColumns" : function(req, row) {
			//console.log(req.headers())
			if( row["ed"] ) {
				//console.log("collecting ed for Pinterest");
				var ed = JSON.parse(row["ed"]);
				for( var d in ed ) {
					row[d] = ed[d];
				}
			}
			var header = req.headers();
			row["ref.url"] = header && header.referer ? header.referer : "";
		},
		"showInConsole" : true,
		"recordInExcel" : true,
		"impVars" : [
			"ref.url",
			"event",
			"page_title"
		]
	}
	/*,
	"utag_data" : {
		"browserVariable" : "utag_data",
		"showInConsole" : false,
		"recordInExcel" : false,
		"impVars" : [
			"page_name",
			"page_type",
			"pmc_pageName",
			"previous_page_name"
		]
	},
	"digitalData" : {
		"browserVariable" : "digitalData",
		"showInConsole" : false,
		"recordInExcel" : false,
		"impVars" : [
			"page"
		]
	}*/
}
/*
const showUtag = false;  	// Set to false to suppress utag_data on console.
const showAdobe = true; 	// Set to false to suppress Adobe on console.
const showDigitalData = false; 	// Set to false to suppress digitalData on console.
const utagImpVars = [
	"page_name",
	"geo",
	"tealium_environment",
	"dom.url"
];
const adobeImpVars = [
	"pageName",
	"events", 
	"purchaseID",
	"products",
	"v50",
	"v4",
	"g"
];
const digitalDataImpVars = [
	"page"
]*/


const brand_env = Object.keys(brands);
const brandCode = "WS"; // default brand
var all_env = {
	"brand_env" : "williams-sonoma",
	"qa_env" : "www",
	"tealium_env" : "prod"
}
const qa_environments = {
	"www" : "www",
	"aktest-www" : "aktest",
	"www.uat3" : "uat3",
	"integration2" : "int2",
	"regression" : "reg"
};
const qa_env = Object.keys(qa_environments)

var tealium_env = ["prod", "qa", "dev"]; // "prod", "stage", or "dev"
var startPage = "https://www.williams-sonoma.com/";
var currentPage = "https://www.williams-sonoma.com/";

const envQuestions = [
	{
	    type: 'list',
	    name: 'brand_env',
	    message: "Which brand to simulate?",
	    choices: brand_env
	},
	{
	    type: 'list',
	    name: 'qa_env',
	    message: "Which QA environment to set in the subdomain?",
	    choices: qa_env
	}/*,
	{
	    type: 'list',
	    name: 'tealium_env',
	    message: "Which Tealium environment to use?",
	    choices: tealium_env
	}*/
];
var excel_filename = "roam"; // Excel filename format: "[excel_filename]_[env]_[timestamp].xlsx"
// END CONFIGURATION ------------------

let roam = async () => {
	// var utagResults = [];
	// var adobeResults = [];
	// var digitalDataResults = [];

	async function grabAnalyticsData() {
		// Listening to Adobe requests by setting RequestInterception to true
		await page.setRequestInterception(true);
		page.on('request', async req => {
		   	// Listen for any Adobe request containing "b/ss"
		   /*
		    if (req.url().indexOf("b/ss") > -1 ) {
		    	// Check if they have POST data
		    	var post = req.postData() || req.url();
		    	post = post.indexOf("?") > -1 ? post.split("?")[1] : post;
		    	var params = post.split("&");
		    	var param, impAValues = {}, row = {};

		        for( var i = 0; i < params.length; i++) {
		        	param = params[i].split("=");
		        	row[param[0]] = decodeURIComponent(param[1]);
		        	if( adobeImpVars.includes(param[0]) ) {
		        		impAValues[param[0]] = decodeURIComponent(param[1]);
		        	}
		        }
		        var reg = RegExp(/\/b\/ss\/([^\/]*)\//g);
		        row["Report Suite ID"] = reg.exec(req.url(), "$1")[1];
		        if( showAdobe ) {
			        Console.log(chalk.bgRed("Adobe"));
			        Console.log(impAValues);
			    }
		        //row["Full Request"] = req.url();
		        adobeResults.push(row);  

		        // Grab utag_data
		        if( showUtag || showDigitalData ) await grabUtagData();
		    } */

		    for(var d in dataPoints) {
		    	if( typeof dataPoints[d].networkKey != 'undefined' && dataPoints[d].networkKey(req.url()) ) {
		    		var post = req.postData() || req.url();
			    	post = post.indexOf("?") > -1 ? post.split("?")[1] : post;
			    	var params = post.split("&");
			    	var param, impAValues = {}, row = {};

			    	// Capture the request url without search parameters
			    	row["req.url"] = req.url().split("?")[0];

			        for( var i = 0; i < params.length; i++) {
			        	param = params[i].split("=");
			        	row[param[0]] = decodeURIComponent(param[1]);
			        	
			        }
			        if( dataPoints[d].extraColumns ) dataPoints[d].extraColumns(req, row);
			        
			        for( var j = 0; j < dataPoints[d].impVars.length; j++ ) {
			        	var a = dataPoints[d].impVars[j];
			        	if( typeof row[a] != 'undefined' ) {
			        		impAValues[a] = row[a];
			        	}
			        }
			        //var reg = RegExp(/\/b\/ss\/([^\/]*)\//g);
			        //row["Report Suite ID"] = reg.exec(req.url(), "$1")[1];
			        if( dataPoints[d].showInConsole ) {
				        Console.log(chalk.bgRed(d));
				        Console.log(impAValues);
				    }
			        //row["Full Request"] = req.url();
			        dataPoints[d].results = dataPoints[d].results || [];
			        dataPoints[d].results.push(row);

			        // If HAR downloading is on, download file then turn it off.
					if( har.on ) {
						await page.waitFor( 3000 );
						await har.stop();
						har.on = false;
						Console.log(chalk.yellow(">>> HAR file downloaded."));
					}
		    	}
		    }

		    req.continue();
		});
	}

	async function grabUtagData() {
		// Update startPage for error referencing
		currentPage = await page.evaluate( () => {
			return document.location.href
		}).catch((err) => {
			Console.error(err);
			return;
		});
		if( showUtag ) {


			await page.waitForFunction('typeof digitalData != "undefined"');
			await page.waitForFunction('typeof utag != "undefined"');
			// Grab utag_data from page
			await page.evaluate( () => {
				return utag_data;
			}).then((data) => {
				// Only print out the important utag_data variables
				var impVars = {};
				for(var d in data) {
					if(  utagImpVars.includes(d) ) {
						impVars[d] = data[d];
					}
					// If data's data is an object, stringify it to show on excel.
					if( typeof data[d] === 'object') data[d] = JSON.stringify(data[d]);
				}
				// Add on full 
				//row["Full utag_data"] = JSON.stringify(data);
				utagResults.push( data );
				if( showUtag ) {
					Console.log(chalk.bgCyan("utag_data"));
					Console.log(impVars);
				}
				//Console.log("Grabbed utag data" + ( typeof d["pagename"] != 'undefined' ? " at [" + d["page_name"] + "]" : ""));
			}).catch( err => {
	        	Console.log("Couldn't grab utag_data on " + currentPage);
	        	Console.error(err);	
	        });
		}

		if( showDigitalData ) {
	        // Grab digitalData from page
			await page.evaluate( () => {
				return digitalData;
			}).then((data) => {
				// Only print out the important utag_data variables
				var impVars = {};
				for(var d in data) {
					if(  digitalDataImpVars.includes(d) ) {
						impVars[d] = data[d];
					}
					// If data's data is an object, stringify it to show on excel.
					if( typeof data[d] === 'object') data[d] = JSON.stringify(data[d]);
				}
				// Add on full 
				//row["Full utag_data"] = JSON.stringify(data);
				digitalDataResults.push( data );
				if( showDigitalData ) {
					Console.log(chalk.bgCyan("digitalData"));
					Console.log(impVars);
				}
				
			}).catch( err => {
	        	Console.log("Couldn't grab digitalData on " + currentPage);
	        	Console.error(err);	
	        });
		}

	}

	// Setting up keyboard press bindings for console input
	/*
	readline.emitKeypressEvents(process.stdin);
	process.stdin.setRawMode(true);
	process.stdin.on('keypress', async (str, key) => {
	    // Press Ctrl+C to close Node process. Process does not close properly after closing the browser.
	    if (key && key.ctrl && key.name == 'q') {
	        if (browser.isConnected()) browser.disconnect();
	        process.exit(); // eslint-disable-line no-process-exit

        // Press Ctrl+F in the command prompt to run autofill.
	    // } else if (key && key.ctrl && key.name == 'f') {
	    //     await page.addScriptTag({ url: autofill }).then(() => {
	    //         Console.log(chalk.yellow(">>> Running autofill"));
	    //     }).catch(err => {
	    //         Console.error(err);
	    //     });
	    // Press Ctrl+S to save a screenshot
	    } else if (key && key.ctrl && key.name == 's') {
	    	var t = new Date().getTime();
	    	await page.screenshot({ path: 'screenshot_' + t + '.png'});
	    	Console.log(chalk.yellow(">>> Took a screenshot at \'screenshot_" + t + ".png\'.")) ;
	    }
	});
	*/

	function getTimestamp() {
		var date = new Date();
		return date.getTime();
		//return date.getFullYear() + (date.getMonth() + 1 < 10 ? "0" : "") + (date.getMonth() + 1) + (date.getDate() < 10 ? "0" : "") + date.getDate() + (date.getHours() < 10 ? "0" : "") + date.getHours() + (date.getMinutes() < 10 ? "0" : "") + date.getMinutes();// + (date.getSeconds() < 10 ? "0" : "") + date.getSeconds();
	}

	function writeToSpreadsheet() {
		
		//var data = []; // [[1,2,3],[true, false, null, "sheetjs"],["foo","bar",new Date("2014-02-19T14:30Z"), "0.3"], ["baz", null, "qux"]]
		const finalEnv = brands[all_env.brand_env].id + "_" + qa_environments[all_env.qa_env];// + "_" + all_env.tealium_env;
		const timestamp = getTimestamp();
		const filename = excel_filename + "_" + timestamp + "_" + finalEnv;
		var ws;

		const wb = XLSX.utils.book_new();

		/*
		ws1 = XLSX.utils.json_to_sheet(utagResults, {header: utagImpVars});
		ws2 = XLSX.utils.json_to_sheet(adobeResults, {header: adobeImpVars});
		ws3 = XLSX.utils.json_to_sheet(digitalDataResults, {header: digitalDataImpVars});
		*/ 

		/* add worksheet to workbook */
		for( d in dataPoints ) {
			//console.log( dataPoints[d].results);
			if( dataPoints[d].recordInExcel && typeof dataPoints[d].results != 'undefined' ) {
				ws = XLSX.utils.json_to_sheet(dataPoints[d].results, {header: dataPoints[d].impVars})
				XLSX.utils.book_append_sheet(wb, ws, d);
			}
		}

		// if( showUtag ) XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(utagResults, {header: utagImpVars}), "utag_data");
		// if( showDigitalData ) XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(digitalDataResults, {header: digitalDataImpVars}), "digitalData");
		// if( showAdobe ) XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(adobeResults, {header: adobeImpVars}), "Adobe");

		/* write workbook */
		XLSX.writeFile(wb, filename + ".xlsx");
		doneWriting = true;
		Console.log(chalk.yellow("Wrote data to " + filename + ".xlsx"));
	
	}

	async function promptShortcuts() {
		//Console.log(chalk.yellow("Press Ctrl+F in the command prompt to run autofill."));
		//Console.log(chalk.yellow("Press Ctrl+S button to save a screenshot."));
		//Console.log(chalk.yellow("Press Ctrl+Q button to close Node process. Process does not close properly after closing the browser."));
		await inquirer.prompt({
		    type: 'input',
		    name: "key",
		    message: "Type 'q' and press Enter to close Node process. Type 's' and press Enter to save a screenshot. Type 't' to open the Tealium Web Companion. Type 'h' to download the HAR file.\n"
	    }).then(async answer => {
	    	if( answer.key && answer.key.toLowerCase() == 's' ) {
	    		//var t = new Date().getTime();
		    	page.screenshot({ path: 'screenshot_' + getTimestamp() + '.png'});
		    	Console.log(chalk.yellow(">>> Took a screenshot at \'screenshot_" + t + ".png\'.")) ;
		    	promptShortcuts();
		    	return;

	    	} else if (answer.key && answer.key.toLowerCase() == 'h' ) {
	    		// write HAR file to file
	    		har.on = true;
				await har.start({ path: all_env.qa_env + "." + all_env.brand_env+ ".com." + getTimestamp() + ".har" });
				//await har.stop();
				Console.log(chalk.yellow(">>> HAR file will download the next page."));
				promptShortcuts();
				return;

	    	} else if (answer.key && answer.key.toLowerCase() == 't' ) {
	    		// Request the Tealium Web Companion plugin script.
	    		await page.addScriptTag({url:"https://tags.tiqcdn.com/utui/utui.tagcompanion.js?v=" + Math.random()});
				Console.log(chalk.yellow(">>> Requested Tealium Web Companion plugin."));
				promptShortcuts();
				return;

	    	} else if (answer.key && answer.key.toLowerCase() == 'q') {
	    		if (browser.isConnected()) {
	    			browser.disconnect();
	    		}
	        	process.exit();
	    	} else {
	    		return "Couldn't parse that.";
	    		await promptShortcuts();
	    	}
	    })
	}

	if(generatePrompt) {
		// Inquire for which brand and environment to use.
		await inquirer.prompt(envQuestions).then(answers => {
			all_env = answers;
		}).catch( error => {
			if(error.isTtyError) {
		      Console.log("Prompt couldn't be rendered in the current environment");
		    }
		});
	}

	// Generate starting page URL
	startPage = "https://" + all_env.qa_env + "." + all_env.brand_env+ ".com";//?tealium=" + all_env.tealium_env;
	//startPage = "https://www.google.com";



	///////////
	// START //
	///////////

	Console.log(chalk.yellow("Starting up QA Tool - roam.js"));
	
	promptShortcuts();

	const browser = await puppeteer.launch({headless: false});
	const page = await browser.newPage();
	var har = new puppeteerHar(page);
	har.on = false;
	

	// Authenticate if we're using a dev server
	if( all_env.qa_env != 'www' ) {
		const b = brands[all_env.brand_env];
		Console.log("Authenticating...");// + JSON.stringify(b));
		page.authenticate({
			username: b.account,
			password: b.pass
		})
	}

	// When you close the browser, data will be written to spreadsheet.
	await browser.on('disconnected', async target => {
		writeToSpreadsheet();
		console.log("Successfully scrapped data!");
	})

	// Start up the browser
	//await page.setViewport({width: browserWidth, height: browserHeight});
	await page.emulate(iPhone);

	// Turn on Adobe grabbing.
	await grabAnalyticsData();

	// Log each page URL navigated to.
	await page.on( 'domcontentloaded', () => {
		Console.log(chalk.yellow("Navigated to ", page.url()));
		
	})


	// Start on starting page
	await page.goto(startPage, {waitUntil: 'networkidle0', timeout: 0});

	// Click around wherever you want, and all analytics will be captured.
	
	

};

roam().catch((err) => {
    Console.error("On page " + currentPage);
    Console.error(err);
    process.exit(1);
 });


// Meeting notes
/*
	- Sync to Google Drive
	- Track other big tags like Facebook, Google
	- Automated alerts to Slack
	- Make it easy for other teams to run and use to QA their stuff before they send it to us.
	- Abstracting the DataLayer + Events a) value and b) priority
	- Talk to commerce or TAO about adding data-attributes to ease automation flow setup.
	- Fix offers array in utag, it's not getting captured, neet to iterate through object
	- Restructure Flow so that instead of listing out steps, it will take in the current page and decide what to click on next. Should set a start and end page. Should be able to determine where they are solely by URL.
*/ 