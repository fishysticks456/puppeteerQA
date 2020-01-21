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
const showUtag = true;  	// Set to false to suppress utag.data on console.
const showAdobe = true; 	// Set to false to suppress Adobe on console.
const showMixpanel = true;  // Set to false to suppress Mixpanel on console.
const utagImpVars = [
	"page_name",
	"customer_segment",
	"geo",
	"tealium_environment",
	"dom.url",
	"ut.version",
	"offers",
	"flow_type"
];
const adobeImpVars = [
	"pageName",
	"server",
	"ch",
	"events", 
	"purchaseID",
	"v8",			// purchase ID
	"products", 
	"v9",			// payment method
	"v22",			// search_category
	"v48",			// registration type
	"v54",			// offer ID
	"v60",			// flow type
	"v65",			// UCDMID
	"v85"			// action
];
const mixpanelImpVars = [
	"event", 
	"alias",
	"distinct_id",
	"$user_id",
	"stack", 
	"environment",
	"page_name_fullpath",
	"offer_page",
	"link_value",
	"banner_id"
];
var startPage = "https://www.ancestry.com";
var tealium_env = ""; // "prod", "stage", or "dev"
var excel_filename = "roam"; // Excel filename format: "[excel_filename]_[date]_[time]_[tealium_env].xlsx"
const autofill = "https://www.ancestrycdn.com/mars/landing/tao-playground/autofills/universal-autofill-1.2.7.js";
// END CONFIGURATION ------------------

let roam = async () => {
	const browser = await puppeteer.launch({headless: false});
	const page = await browser.newPage();
	var utagResults = [];
	var adobeResults = [];
	var mixpanelResults = [];

	function atob (str) {
		return Buffer.from(str, 'base64').toString();
	}

	async function grabAnalyticsData() {
		// Listening to Adobe requests by setting RequestInterception to true
		await page.setRequestInterception(true);
		page.on('request', async req => {
		   	// Listen for any Adobe request containing "b/ss"
		    if (req.url().indexOf("b/ss") > -1 ) {
		    	// Check if they have POST data
		    	var post = req.postData() || req.url();
		    	var post = decodeURIComponent(post.indexOf("?") > -1 ? post.split("?")[1] : post);
		    	var params = post.split("&");
		    	var param, impAValues = {}, row = {};

		        for( var i = 0; i < params.length; i++) {
		        	param = params[i].split("=");
		        	row[param[0]] = param[1];
		        	if( adobeImpVars.includes(param[0]) ) {
		        		impAValues[param[0]] = param[1];
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

		        // Grab utag.data
		        await grabUtagData();

		    // Listen for Mixpanel requests containing "?data"
		    } else if (req.url().indexOf("https://api-js.mixpanel.com/track/?ip=") > -1 ) {
		    	//Console.log(req);
		    	var data = req.url().indexOf("data=") > -1 ? req.url().split("data=")[1].split("&")[0] : req.postData().split("data=")[1];
		    	var mixevent = JSON.parse( atob( decodeURIComponent(data) ) );
		    	var row = {
		    		"event" : mixevent.event
		    	};
		    	var impMValues = {
		    		"event" : mixevent.event
		    	};
		    	for( p in mixevent.properties ) {
		    		row[p] = mixevent.properties[p];
		    		if( mixpanelImpVars.includes( p )) {
		    			impMValues[p] = mixevent.properties[p];
		    		}
		    		// If data's data is an object, stringify it to show on excel.
					if( typeof mixevent.properties[p] === 'object') row[p] = JSON.stringify(mixevent.properties[p]);
		    	}
		    	row.FullRequest = data;
		    	if( showMixpanel ) {
			    	Console.log(chalk.bgGreen("Mixpanel"));
			    	Console.log(impMValues);
			    }
		    	mixpanelResults.push(row);
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
		await page.waitForFunction('typeof utag != "undefined"');
		// Grab utag.data from page
		await page.evaluate( () => {
			return utag.data;
		}).then((data) => {
			// Only print out the important utag.data variables
			var impVars = {};
			for(var d in data) {
				if(  utagImpVars.includes(d) ) {
					impVars[d] = data[d];
				}
				// If data's data is an object, stringify it to show on excel.
				if( typeof data[d] === 'object') data[d] = JSON.stringify(data[d]);
			}
			// Add on full 
			//row["Full Utag.Data"] = JSON.stringify(data);
			utagResults.push( data );
			if( showUtag ) {
				Console.log(chalk.bgCyan("utag.data"));
				Console.log(impVars);
			}
			//Console.log("Grabbed utag data" + ( typeof d["pagename"] != 'undefined' ? " at [" + d["page_name"] + "]" : ""));
		}).catch( err => {
        	Console.log("Couldn't grab utag.data on " + currentPage);
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
		if( !utagResults || !adobeResults || !mixpanelResults ) {
			Console.error(chalk.red("Missing utag or adobe data to write to spreadsheet"));
			return;
		} else {
			const date = new Date();
			//var data = []; // [[1,2,3],[true, false, null, "sheetjs"],["foo","bar",new Date("2014-02-19T14:30Z"), "0.3"], ["baz", null, "qux"]]
			var filename = excel_filename + "_" + date.getFullYear() + (date.getMonth() + 1 < 10 ? "0" : "") + (date.getMonth() + 1) + (date.getDate() < 10 ? "0" : "") + date.getDate() + "_" + (date.getHours() < 10 ? "0" : "") + date.getHours() + (date.getMinutes() < 10 ? "0" : "") + date.getMinutes() + (date.getSeconds() < 10 ? "0" : "") + date.getSeconds() + "_" + tealium_env;

			const wb = XLSX.utils.book_new(), 
			ws1 = XLSX.utils.json_to_sheet(utagResults, {header: utagImpVars});
			ws2 = XLSX.utils.json_to_sheet(adobeResults, {header: adobeImpVars});
			ws3 = XLSX.utils.json_to_sheet(mixpanelResults, {header: mixpanelImpVars});
			 
			/* add worksheet to workbook */
			XLSX.utils.book_append_sheet(wb, ws1, "utag.data");
			XLSX.utils.book_append_sheet(wb, ws2, "Adobe");
			XLSX.utils.book_append_sheet(wb, ws3, "Mixpanel");

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

	// Turn on Adobe and Mixpanel grabbing.
	await grabAnalyticsData();

	// Log each page URL navigated to.
	await page.on( 'domcontentloaded', () => {
		Console.log(chalk.yellow("Navigated to ", page.url()));
	})

	// Start on landing page
	var landingPage = startPage + (tealium_env ? ((startPage.indexOf("?") > -1 ? "&" : "?" ) + "tealium=" + tealium_env) : "");
	await page.goto(landingPage, {waitUntil: 'networkidle0'});

	// Click around wherever you want, and all analytics will be captured.

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