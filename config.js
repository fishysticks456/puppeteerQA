module.exports = {
	"browserWidth" : 1100,
	"browserHeight" : 800,
	"tealiumLoginUrl" : "https://my.tealiumiq.com/",
	"tealiumDashboard" : "https://my.tealiumiq.com/tms?",
	"tealiumFolder" : "tealiumData",

	// List of Tealium profiles you want to skip.
	"tealiumBlackList" : ["ios-registry-app", "main", "markandgraham", "pbteen", "potterybarn", "potterybarnkids", "trade-and-contract", "westelm", "williamssonoma"],

	// The Tealium login credentials
	// Can also be set as command line arguments
	// ex: node index.js --user=gyoung2@wsgc.com --pass=passwordtest@123 --mfa=111111
	// OR: node index.js --tealiumUser=gyoung2@wsgc.com --tealiumPass=pass@123 --tealiumMFA=111111
	"tealiumUser" : "",
	"tealiumPass" : "",
	"tealiumMFA" : 111111

};

// tagapi.getSortTags()
// tagapi.getObjectByTag and tagapi.getContainerByTag return the same thing
// Make sure to add on what extensions are scoped to each tag.
// Make sure to get list of load rules per profile