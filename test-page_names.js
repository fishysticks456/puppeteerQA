// Testing web automation using Puppeteer

const puppeteer = require('puppeteer');
const XLSX = require('xlsx');

async function getPic() {
  const browser = await puppeteer.launch({headless: true});
  const page = await browser.newPage();
  await page.goto('https://www.ancestry.com');
  await page.setViewport({width: 1000, height: 5000});
  await page.screenshot({path: 'ancestry.png'});

  await browser.close();
}

//getPic();

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

// Write data to spreadsheet
function writeToSpreadsheet(data) {
	if( !data ) {
		console.error("No data to write to spreadsheet");
		return;
	} else {
		const date = new Date();
		//var data = []; // [[1,2,3],[true, false, null, "sheetjs"],["foo","bar",new Date("2014-02-19T14:30Z"), "0.3"], ["baz", null, "qux"]]
		var filename = "goldie_" + date.getFullYear() + (date.getMonth() + 1 < 10 ? "0" : "") + (date.getMonth() + 1) + (date.getDate() < 10 ? "0" : "") + date.getDate() + "_" + (date.getHours() < 10 ? "0" : "") + date.getHours() + (date.getMinutes() < 10 ? "0" : "") + date.getMinutes() + (date.getSeconds() < 10 ? "0" : "") + date.getSeconds();

		var wb = XLSX.utils.book_new(), ws = XLSX.utils.aoa_to_sheet(data);
		 
		/* add worksheet to workbook */
		XLSX.utils.book_append_sheet(wb, ws, filename);

		/* write workbook */
		XLSX.writeFile(wb, filename + ".xlsx");
		console.log("Wrote data to " + filename + ".xlsx");
	}
}

let scrape = async () => {
	const browser = await puppeteer.launch({headless: false});
	const page = await browser.newPage();
	var result = [["utag.data.page_name", "URL"]];
	var row = [];
	await page.goto('https://www.ancestry.com');
	await page.setViewport({width: 1000, height: 5000});
	await page.waitFor(1000);

	const links = await page.evaluate(() => {
		// Grab all the links on the homepage
		var as = document.getElementsByTagName("a")
		var links = [];
		for (var i = 0; i < as.length; i++) {
			if( links.indexOf(as[i].href) === -1 ) links.push(as[i].href);
		}
		return links;
	});

	// Cycle through all the links on the homepage and grab their page name (utag.data.page_name)
	for( var j = 0; j < links.length && j < 3; j++ ) {
		await page.goto( links[j] );
		const page_name = await page.evaluate( () => {
			return (typeof utag === 'undefined' ? "utag is not defined" : 
				(typeof utag.data === 'undefined' ? "utag.data is not defined" : 
				(typeof utag.data.page_name === 'undefined' ? "utag.data.page_name is not defined" : utag.data.page_name)));
		});
		row.push(page_name);
		row.push(links[j]);
		result.push(row);
		row = [];
	}

	await browser.close();
  	return result;	
};

scrape().then((value) => {
    //console.log(value); // Success!
    console.log("Successfully scrapped data!");
    console.log(value);
    writeToSpreadsheet(value);

});