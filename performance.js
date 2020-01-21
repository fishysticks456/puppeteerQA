// Testing web automation using Puppeteer

// TODO add "clear cookies" keyboard shortcut

const puppeteer = require('puppeteer'); // Chromium web automation tool
const XLSX = require('xlsx'); // Write to an excel spreadsheet
const Console = require('console'); // Outputting to console
const readline = require('readline'); // Reading keyboard inputs on console
const chalk = require('chalk'); // Command prompt styling and colors

// EDIT CONFIGURATION HERE --------------
const delay = 1000; // How long to wait on each page after all requests have loaded.
const navTimeout = 10000; // How long to wait until we get frustrated with how long a page is loading and throw an error, in miliseconds.
const browserWidth = 900;
const browserHeight = 800;

const perfImpVars = [
	"navigationStart",
	"unloadEventStart",
	"unloadEventEnd",
	"redirectStart",
	"redirectEnd",
	"fetchStart",
	"domainLookupStart",
	"domainLookupEnd",
	"connectStart",
	"connectEnd",
	"secureConnectionStart",
	"requestStart",
	"responseStart",
	"responseEnd",
	"domLoading",
	"domInteractive",
	"domContentLoadedEventStart",
	"domContentLoadedEventEnd",
	"domComplete",
	"loadEventStart",
	"loadEventEnd"
]
var startPage = "https://www.ancestry.com";
var tealium_env = "stage"; // "prod", "stage", or "dev"
var excel_filename = "performance"; // Excel filename format: "[excel_filename]_[date]_[time]_[tealium_env].xlsx"
const autofill = "https://www.ancestrycdn.com/mars/landing/tao-playground/autofills/universal-autofill-1.2.7.js";
// END CONFIGURATION ------------------

let roam = async () => {
	const browser = await puppeteer.launch({headless: false});
	const page = await browser.newPage();
	var perfResults = [];

	/*async function grabAnalyticsData() {
		// Listening to Adobe requests by setting RequestInterception to true
		await page.setRequestInterception(true);
		page.on('request', async req => {
		   	// Listen for any Adobe request containing "b/ss"
		    if (req.url().indexOf("b/ss") > -1 ) {
		    	
		        // Grab utag.data
		        await getPerformanceTiming();
		    }
		    req.continue();
		});
	}*/

	async function getPerformanceTiming() {

		// Update startPage for error referencing
		currentPage = await page.evaluate( () => {
			return document.location.href
		}).catch((err) => {
			Console.error(err);
			return;
		});
		await page.waitForFunction('typeof window.performance.timing != "undefined" && window.performance.timing.loadEventEnd > 0');
		await page.waitForFunction('typeof sx != "undefined" && sx.event49');
		// Grab performance.timing from page
		await page.evaluate( () => {
			var data = window.performance.timing.toJSON() || {"nothing" : 0};
			data["adobe_load_event"] = sx ? sx.event49 : 0;
			return data;
		}).then((data) => {
			// Only print out the important performance.timing variables
			var times = {};
			var navigationStart = data.navigationStart;

			for(var d in data) {
				// We want this in seconds with 2 decimal spaces, so multiple by 1000 to get seconds, then divide by 100 to do this Math.rounding trick.
				times[d] = (d === "adobe_load_event" || data[d] === 0) ? data[d] : Math.round((data[d] - navigationStart) / 10) / 100; 
			}

			Console.log(chalk.bgCyan("performance.timing"));
			Console.log(times);
			

			times["url"] = currentPage;
			// Add on full 
			//row["Full performance.timing"] = JSON.stringify(data);
			perfResults.push( times );
			
			//Console.log("Grabbed performance.timing" + ( typeof d["pagename"] != 'undefined' ? " at [" + d["page_name"] + "]" : ""));
		}).catch( err => {
        	Console.log("Couldn't grab performance.timing on " + currentPage);
        	Console.error(err);	
        });;
	}

	// Setting up keyboard press bindings for console input
	readline.emitKeypressEvents(process.stdin);
	process.stdin.setRawMode(true);
	process.stdin.on('keypress', async (str, key) => {
	    // Press Ctrl+C to close Node process. Process does not close properly after closing the browser.
	    if (key.ctrl && key.name === 'c') {
	        if (browser.isConnected()) browser.disconnect();
	        process.exit(); // eslint-disable-line no-process-exit

        // Press Ctrl+F in the command prompt to run autofill.
	    } else if (key && key.ctrl && key.name == 'f') {
	        await page.addScriptTag({ url: autofill }).then(() => {
	            Console.log(chalk.yellow(">>> Running autofill"));
	        }).catch(err => {
	            Console.error(err);
	        });
	    // Press Ctrl+S to save a screenshot
	    } else if (key && key.ctrl && key.name == 's') {
	    	var t = new Date().getTime();
	    	await page.screenshot({ path: 'screenshot_' + t + '.png'});
	    	Console.log(chalk.yellow(">>> Took a screenshot at \'screenshot_" + t + ".png\'.")) ;
	    }
	});

	function writeToSpreadsheet() {
		if( !perfResults ) {
			Console.error(chalk.red("Missing performance timing data to write to spreadsheet"));
			return;
		} else {
			const date = new Date();
			//var data = []; // [[1,2,3],[true, false, null, "sheetjs"],["foo","bar",new Date("2014-02-19T14:30Z"), "0.3"], ["baz", null, "qux"]]
			var filename = excel_filename + "_" + date.getFullYear() + (date.getMonth() + 1 < 10 ? "0" : "") + (date.getMonth() + 1) + (date.getDate() < 10 ? "0" : "") + date.getDate() + "_" + (date.getHours() < 10 ? "0" : "") + date.getHours() + (date.getMinutes() < 10 ? "0" : "") + date.getMinutes() + (date.getSeconds() < 10 ? "0" : "") + date.getSeconds() + "_" + tealium_env;

			const wb = XLSX.utils.book_new(), 
			ws1 = XLSX.utils.json_to_sheet(perfResults, {header: perfImpVars});
			 
			/* add worksheet to workbook */
			XLSX.utils.book_append_sheet(wb, ws1, "performance.timing");

			/* write workbook */
			XLSX.writeFile(wb, filename + ".xlsx");
			doneWriting = true;
			Console.log(chalk.yellow("Wrote data to " + filename + ".xlsx"));
		}
	}

	Console.log(chalk.yellow("Starting up QA Tool - roam.js"));
	Console.log(chalk.yellow("Press Ctrl+F in the command prompt to run autofill."));
	Console.log(chalk.yellow("Press Ctrl+S to save a screenshot."));
	Console.log(chalk.yellow("Press Ctrl+C to close Node process. Process does not close properly after closing the browser."));

	// EDIT FLOW HERE
	// Start up the browser
	await page.setViewport({width: browserWidth, height: browserHeight});

	// Turn on performance logging.
	//await grabAnalyticsData();

	// Log each page URL navigated to.
	await page.on( 'domcontentloaded', () => {
		Console.log(chalk.yellow("Navigated to ", page.url()));
	})
	await page.on( 'load', getPerformanceTiming );

	// Start on landing page
	var landingPage = startPage + (tealium_env ? ((startPage.indexOf("?") > -1 ? "&" : "?" ) + "tealium=" + tealium_env) : "");
	await page.goto(landingPage, {waitUntil: 'networkidle0'});

	// When you close the browser, data will be written to spreadsheet.
	await browser.on('disconnected', async target => {
		writeToSpreadsheet();
		console.log("Successfully scrapped data!");
	})

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