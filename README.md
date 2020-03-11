# puppeteerQA
Using Puppeteer to QA Tealium and Adobe calls

REQUIREMENTS
1. Install Node JS on your computer

THEN
1. Clone / download this repository to your computer
2. > npm update ? I think?
3. Adjust config settings at top of freetrial.js
3. > node freetrial.js

This should run a open a new browser window that automatically walks through the checkout process - up to the point where an alert appears, as it did when I last ran it 6/30/2019 7pm.

It will grab the most important data in utag.data and Adobe hit requests, then save them to an excel file called "name_date_time.xlsx".

"delay" and "navTimeout" are arbitrary numbers, used to help humans watch the browser so it isn't a blur. Generally try to keep "navTimeout" above 3000 miliseconds, it takes a while for forms to submit.
