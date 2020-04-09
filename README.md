# puppeteerQA
Using Puppeteer to QA Tealium data layer variables and Adobe calls

## REQUIREMENTS
1. Install Node JS on your computer
2. Clone / download this repository to a folder in your computer
3. > npm install

## TO RUN A SESSION
4. Adjust config settings at the top of roam.js
5. > node roam.js 
6. A menu will show a selection of urls and testing environments to start in.

This should open a new browser window that automatically captures the data layer variable utag_data and Adobe network calls containing "b/ss/". Then when the session is over, it will write these variables into an excel file named "roam_{{timestamp}}_{{env}}.xlsx".


This tool helps the QA process by removing the need to copy-past Adobe network calls 20 times per session, and organizes them into their own columns in the excel file.

You can also save a HAR file by entering "h" in the keyboard, and then clicking into the next page.

Also, you can save a screenshot of the browser window by entering "s" in the keyboard.

## TO DO
1. Set up a Rules class to assert what should and should not be.
2. Research into saving console error messages
3. Research into setting up an Adobe Data Dictionary, to name these eVars and props and events