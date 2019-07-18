// Testing web automation using Puppeteer

const puppeteer = require('puppeteer');
const XLSX = require('xlsx');
const Console = require('console');

// EDIT CONFIGURATION HERE
const delay = 1000; // How long to wait on each page after all requests have loaded.
const navTimeout = 10000; // How long to wait until we get frustrated with how long a page is loading and throw an error, in miliseconds.
const utagImpVars = [
	"page_name",
	"customer_segment",
	"geo",
	"stack",
	"sc_event",
	"flow_type",
	"offer_name",
	"order_currency",
	"order_id",
	"order_total",
	"tealium_environment",
	"dom.url",
	"Full Utag.Data"
];
const adobeImpVars = [
	"g", // Full page URL
	"pageName", 
	"ch", // channel
	"server", 
	"events", 
	"products", 
	"mid", "c11", 
	"v12",
	"v65", "c35", 
	"v35", "v54", 
	"v60", 
	"v85", 
	"Full Request"
];
const autofill = "https://www.ancestrycdn.com/mars/landing/tao-playground/autofills/universal-autofill-1.2.7.js";
var utagResults = [];
var adobeResults = [];
var currentPage = "https://www.ancestry.com/cs/ancestry-family?stay&tealium=stage"; // Always updates to the current page, for error logs.


/*async function getPic() {
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();
  await page.goto('https://www.ancestry.com');
  await page.setViewport({width: 1000, height: 5000});
  await page.screenshot({path: 'ancestry.png'});

  await browser.close();
}*/

//getPic();

// Use this later to set geolocation to Australia, Canada, UK, etc.
// await page.setGeolocation({latitude: 59.95, longitude: 30.31667});

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

// Write utagResults and adobeResults data to spreadsheet
function writeToSpreadsheet() {
	if( !utagResults || !adobeResults ) {
		console.error("Missing utag or adobe data to write to spreadsheet");
		return;
	} else {
		const date = new Date();
		//var data = []; // [[1,2,3],[true, false, null, "sheetjs"],["foo","bar",new Date("2014-02-19T14:30Z"), "0.3"], ["baz", null, "qux"]]
		var filename = "goldie_" + date.getFullYear() + (date.getMonth() + 1 < 10 ? "0" : "") + (date.getMonth() + 1) + (date.getDate() < 10 ? "0" : "") + date.getDate() + "_" + (date.getHours() < 10 ? "0" : "") + date.getHours() + (date.getMinutes() < 10 ? "0" : "") + date.getMinutes() + (date.getSeconds() < 10 ? "0" : "") + date.getSeconds();

		const wb = XLSX.utils.book_new(), 
		ws1 = XLSX.utils.json_to_sheet(utagResults, {header: utagImpVars});
		ws2 = XLSX.utils.json_to_sheet(adobeResults, {header: adobeImpVars});
		 
		/* add worksheet to workbook */
		XLSX.utils.book_append_sheet(wb, ws1, "utag.data");
		XLSX.utils.book_append_sheet(wb, ws2, "adobe");

		/* write workbook */
		XLSX.writeFile(wb, filename + ".xlsx");
		console.log("Wrote data to " + filename + ".xlsx");
	}
}

let scrape = async () => {
	const browser = await puppeteer.launch({headless: false});
	const page = await browser.newPage();

	async function grabAdobeData() {
		// Listening to Adobe requests by setting RequestInterception to true
		await page.setRequestInterception(true);
		page.on('request', req => {
		   	// Listen for any Adobe request containing "b/ss"
		    if (req.url().indexOf("b/ss") > -1 ) {
		    	// Check if they have POST data
		    	var post = req.postData();
		    	var params = decodeURIComponent( (post ? post : req.url()) ).split("&")
		    	//Console.log( params );
		    	var param, row = {}; //Array(adobeImpVars.length + 1)
		        
		        for( var i = 0; i < params.length; i++) {
		        	param = params[i].split("=");
		        	if( adobeImpVars.includes(param[0]) ) {
		        		row[param[0]] = param[1];
		        	}
		        }
		        Console.log(row);
		        row["Full Request"] = req.url();
		        adobeResults.push(row);  
		    }


		    req.continue();
		});
	}

	async function grabUtagData(retries) {
		// Update currentPage for error referencing
		currentPage = await page.evaluate( () => {
			return document.location.href
		});
		await page.waitForFunction('typeof utag != "undefined"');
		// Grab utag.data from page
		await page.evaluate( () => {
			return utag.data;
			/*return [(typeof utag === 'undefined' ? "utag is not defined" : 
					(typeof utag.data === 'undefined' ? "utag.data is not defined" : 
					(typeof utag.data.page_name === 'undefined' ? "utag.data.page_name is not defined" : utag.data.page_name))), 
				document.location.href];*/
		}).then((data) => {
			// Only crape the important utag.data variables
			var d = {};
			for(var val of utagImpVars) {
				if( typeof data[val] != 'undefined') {
					d[val] = data[val]
				}
			}
			// Add on full 
			d["Full Utag.Data"] = JSON.stringify(data);
			Console.log("Grabbed utag data" + ( typeof d["pagename"] != 'undefined' ? " at [" + d["page_name"] + "]" : ""));
			utagResults.push( d );
		});
		// .catch((err) => {
		// 	if (retries != 0 ) {
		// 		Console.log("Waiting for utag to populate...");
		// 		await page.waitFor(delay);
		// 		await grabUtagData(retries - 1);
		// 	} else throw err;
		// })
	}

	// clickForm( config )
	// Use autofill, then click the form's submit button
	// If the page hasn't moved to the next page or next checkout step, repeat.
	// config = {
	// 		selector: The form's submit button
	// 		timeout: how long to wait after clicking form and moving to next page before retrying, in miliseconds
	// 		callAutofill: true or false, true calls autofill script
	// 		retrys: how many times to retry submitting form if it timesout
	// }
	async function clickForm(config) {
		Console.log("clicking Form");
		if( config.retrys != 0) {
			if( config.callAutofill ) {
				Console.log("Calling autofill");
				await page.addScriptTag({ url: autofill	});
				await page.waitFor(delay);
			}
			return Promise.all([
			  page.waitForNavigation({timeout: config.timeout}),
			  page.click(config.selector),
			]).catch( err => {
				Console.log("Navigation took too long lol.");
				return clickForm({
						selector: config.selector, 
						timeout: config.timeout, 
						callAutofill: config.callAutofill,
						retrys: config.retrys - 1
					});
			}).then( () => {
				Console.log("Works! Clicked form.");
			});
		} else {
			throw new Error("Clicking form did not work at all.");
		}
	}

	// EDIT FLOW HERE
	// Start up the browser
	await page.setViewport({width: 900, height: 800});

	// Turn on Adobe grabbing.
	await grabAdobeData();

	// Start on landing page
	await page.goto(currentPage, {waitUntil: 'networkidle0'});
	await grabUtagData();

	// Click on "Start my free trial" button;
	await Promise.all([
		  page.click('a[href*="/secure/login"]'),
		  page.waitForNavigation({timeout: navTimeout})
		]);
	await grabUtagData();

	// Autofill the Create Account page.
	await page.addScriptTag({ url: autofill	});
	await page.waitFor(delay);

	// Click Submit button twice on Create Account page
	await page.click("form#indexForm button[type='submit']") 
	await page.waitFor(delay);
	await clickForm({ 
		selector: "form#indexForm button[type='submit']", 
		timeout: navTimeout, 
		autofill: true,
		retrys: 3
	});
	
	// Click "Start Free Trial" in /cs/offers/freetrial
	await grabUtagData();
	await clickForm({ 
		selector: "#offerGrid .ctaBox input", 
		timeout: navTimeout, 
		autofill: false,
		retrys: 3
	});

	// Autofill MLI Checkout page
	await grabUtagData();
	await page.addScriptTag({ url: autofill });
	await page.click(".paymentContainer button[type='submit']");

	// Wait for Order now button to appear
	await page.waitForFunction( () => {
		return jQuery('.page[data-test=\'order-wrapper\'] button[type=\'submit\']').length > 0;
	});

	// Click Order now button, then wait for next page
	// Sometimes an alert blocks the navigation. This happens randomly.
	await Promise.all([
		  page.click("button[type='submit']"),
		  page.waitForNavigation({timeout: navTimeout})
		]).catch( async (err) => {
			var alert = await page.evaluate(() => {
				return jQuery(".alert").text();
			});
			Console.error(alert);
			throw(err);
		});
	await grabUtagData();
	await page.waitForFunction('sx.events.indexOf("purchase") > -1');
	await browser.close();
  	return;
};

scrape().then(() => {
    console.log("Successfully scrapped data!");
    writeToSpreadsheet();

}).catch((err) => {
    Console.error("On page " + currentPage);
    Console.error(err);
    process.exit(1);
 });