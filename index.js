const puppeteer = require('puppeteer'); // Chromium web automation tool
const config = require('./config.js'); // Configuration settings you can edit
const chalk = require('chalk'); // Command prompt styling and colors
const argv = require('yargs').argv; // Grabbing command-line arguments
const fs = require('fs'); // File system
const Entities = require('html-entities').XmlEntities; // For decoding HTML entities like &quot; and &amp;
const entities = new Entities();

let scrapeTealium = async () => {

	var isManualInputNecessary = false;
	var isDashboardLoaded = false;
	var tagData = [];
	var currentProfile;
	var visitedProfiles = [];
	var profilesList;
	var templateData = {};
	var templateCount = 0;
	var extensionsData = {};
	var stopwatchLap;
	var cleanTitle;
	var fileName;
	var tagsWrittenCount = 0;
	var extWrittenCount = 0;
	var extJSFilesWrittenCount = 0;
	var profileFolder;
	var leftovers;
	var isBlockedByUIDialog;
	var timeItTook;
	var finalReport = {};
	
	// Basic stopwatch to measure how fast this thing runs.
	var stopwatch = {
		startTime : 0,
		start : function() {
			this.startTime = new Date().getTime();
		},
		getTime : function() {
			var now = new Date().getTime();
			return (now - this.startTime)/1000.0;
		}
	}

	// Basic setTimeout in Promise form.
	const timeoutPromise = timeout => new Promise((resolve) => setTimeout(resolve, timeout));
	
	// Rough equivalent to page.evaluate() but in Node context.
	const waitForCondition = options => new Promise( async resolve => {
		var timeout = options && options.timeout ? options.timeout / 100 : 300;
		// conditions is required
		if( !options.condition ) resolve(false);
		for( var i = 0; i < timeout; i++) {
			await timeoutPromise(100);
			if( options.condition() ) {
				i == timeout;
				resolve(true);
			}
		}
		resolve(false);
	})

	const cleanFilename = title => title.trim().replace(/[^\d\w\s-._]*/g,"").replace(/\s/g,"_");

	////////////////
	// PRE-CHECKS //
	////////////////

	// Command line arguments have priority over the config file.
	if( argv ) {
		config.tealiumUser = argv.user || argv.tealiumUser || config.tealiumUser || false;
		config.tealiumPass = argv.pass || argv.tealiumPass || config.tealiumPass || false;
		config.tealiumMFA = argv.mfa || argv.tealiumMFA || config.tealiumMFA || false;
	}

	// Check config settings for missing values
	if( !config.tealiumUser || !config.tealiumPass ) {
		console.log(chalk.yellow("Missing Tealium login credentials in config.js settings, will require manual input."));
		isManualInputNecessary = true;
	}
	if( !config.tealiumLoginUrl ) {
		console.log(chalk.yellow("Missing tealiumLoginUrl in config.js settings."));
		process.exit(1);
	}

	config.tealiumFolder = config.tealiumFolder || "tealiumData";


	/////////////////
	// START LOGIN //
	/////////////////

	console.log("Logging into Tealium using credentials in " + chalk.yellow("config.js"));

	const browser = await puppeteer.launch({headless: false});
	const page = await browser.newPage();

	await page.setDefaultTimeout(0); // Don't throw an error if a page doesn't load within 30 seconds.
	await page.setViewport({width: config.browserWidth, height: config.browserHeight});

	// Start timer for performace measuring.
	stopwatch.start();

	await page.goto(config.tealiumLoginUrl, {waitUntil: 'networkidle0', timeout: 0});
	if( !isManualInputNecessary ) {
		await page.type("input#email", config.tealiumUser);
		await page.type("input#password", config.tealiumPass);
		await page.click("#loginBtn");
		await page.waitFor(1000);
		
		if( config.tealiumMFA ) {
			console.log("Using mfa token " + chalk.yellow(config.tealiumMFA));
			await page.type("input#mfa_token", config.tealiumMFA + "");
			await page.click("#mfaLoginBtn");
		} else {
			console.log("Please input MFA token.");
		}
	} else {
		console.log("Please log in to Tealium to begin the Tealium scraping process.");
	}
	
	// Wait until navigated to Tealium dashboard
	await page.waitForNavigation();
	console.log("Logged into Tealium in " + chalk.yellow(stopwatch.getTime() + "s"));
	

	// Wait for dashboard to load.
	await page.waitForSelector("#app-loader");
	console.log("Waiting for dashboard to load.....");
	await page.waitForFunction('!document.querySelector("#app-loader div")');
	console.log("Reached Tealium dashboard for in " + chalk.yellow( stopwatch.getTime().toFixed(2) + "s"));


	//////////////////////
	// OK, NOW WE'RE IN //
	//////////////////////

	const getAllProfileData = async function () {

		stopwatchLap  = stopwatch.getTime();
		// Scrape all the extension data
		await page.evaluate('typeof utui.data != \'undefined\' && typeof utui.data.customizations != \'undefined\'');
		extensionsData = await page.evaluate('utui.data.customizations')

		// Scrape all the tag settings
		await page.evaluate('typeof tagapi != \'undefined\'');
		tagData = await page.evaluate('tagapi.getSortedTags()');

		console.log("Sending GET requests for " + chalk.yellow(tagData.length) + " templates...")

		// Templates are gathered by making GET requests within the browser context.
		// We need to set GET requests per tag, then listen for their response.
		const getTemplateData = function(tagsIDList) {
			if( utui.data && utui.data.settings && utui.service && utui.service.restapis) {
				// Make GET requests for each tag's template within browser context 
				// (this is not happening inside the Node process)
				for ( var t = 0; t < tagsIDList.length; t++ ) {
					utui.service.get(utui.service.restapis.GET_TEMPLATE, {
				        account: utui.data.settings.account,
				        profile: utui.data.settings.profileid,
				        revision: utui.data.settings.revision,
				        template: "profile." + tagsIDList[t],
				        cb: Math.random()
				    }, null, () => {}); //cbLoader(t))
				}
				// Judging from Tealium naming the API URL as "legacy/getTemplate", this may be a weakpoint in the future if Tealium decides to deprecate this method.
			}
		}

		// The browser wil make GET requests for each tag's template code after getTemplateData() fires.
		await page.evaluate( getTemplateData, tagData.map(function(n,i) {return n.id}) );
		
		// We must wait until we get all the tag's templates before writing to file.
		await waitForCondition({condition : () => templateCount === tagData.length, timeout : 500 * tagData.length});
		//console.log("templateCount = " + templateCount);

		////////////////////
		// WRITE TO FILES //
		////////////////////

		// Create profile folder and its subfolders.
		tagsWrittenCount = 0;
		extWrittenCount = 0;
		extJSFilesWrittenCount = 0;
		profileFolder = "./" + config.tealiumFolder + "/" + currentProfile;
		//console.log("Creating profileFolder " + chalk.yellow(profileFolder));
	    fs.mkdirSync(profileFolder + "/tags", {recursive : true} );
	    fs.mkdirSync(profileFolder + "/templates", {recursive : true} );
	    fs.mkdirSync(profileFolder + "/extensions", {recursive : true} );
	    fs.mkdirSync(profileFolder + "/extensionsJS", {recursive : true} );

		// Write tags and templates to separate files.
		for( var t = 0; t < tagData.length; t++) {

		    cleanTitle = cleanFilename( tagData[t].title );
			fileName = profileFolder + "/tags/" + tagData[t].sort + ".UID-" + tagData[t].id + "." + (tagData[t].status == "active" ? "ON" : "OFF") + "." + cleanTitle + ".json";
			fs.writeFile( fileName, JSON.stringify(tagData[t]), e => { tagsWrittenCount++; if(e) console.error("Could not write tag to JSON file: " + e)});
			
			fileName = profileFolder + "/templates/" + tagData[t].sort + ".UID-" + tagData[t].id + "." + (tagData[t].status == "active" ? "ON" : "OFF") + "." + cleanTitle + ".js";
			fs.writeFile( fileName, templateData[ tagData[t].id ] , e => { if(e) console.error("Could not write template to JS file: " + e)});
			//console.log("Wrote tag and template files for id " + tagData[t].id);
		}
		// Write extensions data to separate files
		// Also write extensions code that are custom Javascript code to separate JS files.
		for( var ext in extensionsData ) {
			cleanTitle = cleanFilename( extensionsData[ext].title );
			fileName = profileFolder + "/extensions/" + extensionsData[ext].sort + ".UID-" + ext + "." + (extensionsData[ext].status == "active" ? "ON" : "OFF") + "." + cleanTitle + ".json";
			fs.writeFile( fileName, JSON.stringify(extensionsData[ext]) , e => { extWrittenCount++; if(e) console.error("Could not write extension to JSON file: " + e)});

			if( extensionsData[ext].extType === "Javascript Code") {
				var code;
				if( !!extensionsData[ext].code ) {
					code = entities.decode( extensionsData[ext].code );
					fileName = profileFolder + "/extensionsJS/" + extensionsData[ext].sort + ".UID-" + ext + "." + (extensionsData[ext].status == "active" ? "ON" : "OFF") + "." + cleanTitle + ".js";
					fs.writeFile( fileName, code , e => { if(e) console.error("Could not write extension to JS file: " + e)});
				} else if ( !!extensionsData[ext].codeDevData ) {
					var drafts = extensionsData[ext].codeDevData.draftSnippets
					for ( var d in drafts ) {
						code = entities.decode( drafts[d].code );
						fileName = profileFolder + "/extensionsJS/" + extensionsData[ext].sort + ".UID-" + ext + "." + (extensionsData[ext].status == "active" ? "ON" : "OFF") + "." + cleanTitle + "." + cleanFilename( drafts[d].name ) + "." + drafts[d].updateDate + ".js";
						fs.writeFile( fileName, code , e => { extJSFilesWrittenCount++; if(e) console.error("Could not write extension to JS file: " + e)});
					}
				}
			}
		}

		await Promise.all([
			waitForCondition({ condition : () => tagsWrittenCount === tagData.length, timeout : 500 * tagData.length}),
			waitForCondition({ condition : () => extWrittenCount === Object.keys(extensionsData).length, timeout : 500 * Object.keys(extensionsData).length})
		]);

		timeItTook = stopwatch.getTime() - stopwatchLap;
		timeItTook = timeItTook.toFixed(2) + "s";
		console.log("Grabbed " + chalk.yellow(tagData.length) + " tags and " + chalk.yellow(Object.keys(extensionsData).length) + " extensions! Took " + chalk.yellow(timeItTook));

		// Reset variables for next round and write up final report.
		finalReport[currentProfile] = {
			"tags" : tagData.length,
			"extensions" : extWrittenCount,
			"extensionsJS" : extJSFilesWrittenCount,
			"timeItTook" : timeItTook
		}
		templateData = {};
		templateCount = 0;

		// Keep track of which profiles were scrapped.
		visitedProfiles.push(currentProfile);

	} // END getAllProfileData()

	const getNextProfile = async function() {

		// If we still have profiles to do, move to next profile
		leftovers = profilesList.filter(function(n,i) { return visitedProfiles.indexOf(n) == -1 });
		if( leftovers.length > 0 ) {
			console.log("Trying to select profile " + chalk.red(leftovers[0]), ",", leftovers.length - 1, "profile(s) left");
			stopwatchLap = stopwatch.getTime();
			await page.click("#profile_menu_button");
			await page.waitFor(1000);
			await page.evaluate( val => {document.querySelector("#profile_profileid").value = val;} ,leftovers[0]);
			await page.click('#loadversion_button button');
			//console.log("Switching to profile " + leftovers[0]);
			await page.waitFor(1000);

			isBlockedByUIDialog = await page.evaluate('(document.querySelector(".ui-dialog") && document.querySelector(".ui-dialog").style.display == "block") || document.querySelector(".ui-widget-overlay")');
			if( isBlockedByUIDialog ) {
				var hasYesBtn = await page.evaluate('!!document.querySelector("#getRevisionConfirm_dialog_yesBtn")');
				if( hasYesBtn) await page.click("#getRevisionConfirm_dialog_yesBtn");
				else {
					console.log(chalk.yellow("Dialog popped up! Please resolve the issue to continue."));
					await page.waitForRequest(res => res.url().indexOf("/getProfile") > -1 );
				}
			}

			console.log("Waiting for dashboard to load.....");
			await page.waitForFunction('!document.querySelector("#app-loader div")');
			currentProfile = await page.evaluate('utui.profile.lastProfile'); //'document.querySelector("#profile_legend_profile").innerText');
			console.log("Reached Tealium dashboard for profile " + chalk.red(currentProfile) + " in " + chalk.yellow( (stopwatch.getTime() - stopwatchLap).toFixed(2) + "s"));	
		}
	} // END getNextProfile()

	///////////////////////
	// PREPARE THE CYCLE //
	///////////////////////

	// Get list of profiles to cycle through
	await page.evaluate('typeof utui.profile != \'undefined\'');
	profilesList = await page.evaluate('utui.profile.profiles.wsi');
	// Skip over all valid profiles listed in config.js's blacklist.
	if (config.tealiumBlackList && config.tealiumBlackList.length > 0) {
		visitedProfiles = config.tealiumBlackList.filter(function(n,i) {return profilesList.indexOf(n) > -1});
		console.log("Blacklisted profiles from " + chalk.yellow("config.js") + ":");
		console.log(chalk.red(visitedProfiles));
	}
	currentProfile = await page.evaluate('utui.profile.lastProfile'); //'document.querySelector("#profile_legend_profile").innerText');
	console.log("Starting on profile " + chalk.red(currentProfile));

	if( visitedProfiles.indexOf(currentProfile) > -1) {
		console.log("Skipping this profile since it's blacklisted");
		await getNextProfile();
	}

	// All template code must be requested through network GET requests.
	// We need to turn on this listener at the start.
	page.on('response', async res => {
		// Listen for any response where URL contains "getTemplate"
	    if (res.url().indexOf("getTemplate") > -1 && res.url().indexOf("profile.") > -1) {
	    	var id = new URL(res.url()).searchParams.get('template').split("profile.")[1];
	    	//console.log("GOT TEMPLATE : " + id);
	    	var text = await res.text();
	    	//console.log(id + " : " + text);
	    	templateData[id] = entities.decode( JSON.parse(text).content );
	    	templateCount++;

	    }
	});

	while (visitedProfiles.length < profilesList.length) {// && visitedProfiles.length < 2) {

		await getAllProfileData();
		await getNextProfile();
		
	} // END looping through profilesList

	stopwatchLap = stopwatch.getTime();
	console.log("Completed project in " + chalk.yellow(Math.round(stopwatchLap/60) + "min " + (stopwatchLap%60).toFixed(2) + "s"), " or " + chalk.yellow( stopwatch.getTime().toFixed(2) + "s"));
	console.log(chalk.green("FINAL REPORT"));
	console.log(finalReport)
	await browser.close();

	console.log(chalk.yellow("Closed browser."));
	return;
}
scrapeTealium().catch(error => {
	console.error("Not sure what went wrong. Investigate!");
	console.error(error);
	process.exit(1);
});
