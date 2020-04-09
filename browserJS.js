module.exports = {
    execute: [
        function() {
            //Original Guidance
            utag.view({
                pmc_pageName: "landing",
                pmc_prop1: "landing",
                pmc_prop2: "landing",
                pmc_prop3: "landing",
                pmc_prop4: "landing",
                pmc_prop5: "landing",
                pmc_prop8: "potterybarnkids",
                pmc_eVar10: "D=pageName",
                pmc_eVar18: "Registry App",
                pmc_prop18: "Registry App",
                pmc_prop36: "Registry App: Native", // UPDATE
                pmc_prop19: "<previous page name>",
                pmc_prop30: "<previous page type>",
                pmc_eVar44: "Repeat",
                pmc_eVar48: "anonymous", // NEW. If not logged in, else "authenticated".
                pmc_eVar50: "99999999999999999999999999999999999999" // real visitor id
            });
        },
        function() {
            // NEW PAGE
            utag.view({
                pmc_pageName: "home page",
                pmc_prop1: "home page",
                pmc_prop2: "home page",
                pmc_prop3: "home page",
                pmc_prop4: "home page",
                pmc_prop5: "home page",
                pmc_prop8: "potterybarnkids",
                pmc_eVar10: "D=pageName",
                pmc_eVar18: "Registry App",
                pmc_prop18: "Registry App",
                pmc_prop36: "Registry App: Native", // UPDATE
                pmc_prop19: "<previous page name>",
                pmc_prop30: "<previous page type>",
                pmc_eVar44: "Repeat",
                pmc_eVar48: "anonymous", // NEW. If not logged in, else "authenticated".
                pmc_eVar50: "99999999999999999999999999999999999999" // real visitor id
            });
        },
        function() {
            // NEW PAGE
            utag.view({
                pmc_pageName: "scan",
                pmc_prop1: "scan",
                pmc_prop2: "scan",
                pmc_prop3: "scan",
                pmc_prop4: "scan",
                pmc_prop5: "scan",
                pmc_prop8: "potterybarnkids",
                pmc_eVar10: "D=pageName",
                pmc_eVar18: "Registry App",
                pmc_prop18: "Registry App",
                pmc_prop36: "Registry App: Native", // UPDATE
                pmc_prop19: "<previous page name>",
                pmc_prop30: "<previous page type>",
                pmc_eVar44: "Repeat",
                pmc_eVar48: "anonymous", // NEW. If not logged in, else "authenticated".
                pmc_eVar50: "99999999999999999999999999999999999999" // real visitor id
            });
        },
        function() {
            // NEW QUESTION - is there a specific page for this? If not, we will need todifferentiate the different locations
            // Login page (not to be confused with the Registry Create flow login page)
            // https://www.potterybarnkids.com/m/account/login.html"
            utag.view({
                pmc_pageName: "account:login",
                pmc_prop1: "account",
                pmc_prop2: "account",
                pmc_prop3: "account:login",
                pmc_prop4: "account:login",
                pmc_prop5: "account:login",
                pmc_prop8: "potterybarnkids",
                pmc_eVar10: "D=pageName",
                pmc_eVar18: "Registry App",
                pmc_prop18: "Registry App",
                pmc_prop36: "Registry App: Native", // UPDATE
                pmc_prop19: "<previous page name>",
                pmc_prop30: "<previous page type>",
                pmc_eVar44: "Repeat",
                pmc_eVar48: "anonymous", // NEW. If not logged in, else "authenticated".
                pmc_eVar50: "99999999999999999999999999999999999999" // real visitor id
            });
        },
        function() {
            // NEW PAGE
            // Registry Create flow Login page (not to be confused with the standard login page)
            utag.view({
                pmc_pageName: "registry:create:login",
                pmc_prop1: "registry",
                pmc_prop2: "registry",
                pmc_prop3: "registry:create",
                pmc_prop4: "registry:create:login",
                pmc_prop5: "registry:create:login",
                pmc_prop8: "potterybarnkids",
                pmc_eVar10: "D=pageName",
                pmc_eVar18: "Registry App",
                pmc_prop18: "Registry App",
                pmc_prop36: "Registry App: Native",
                pmc_prop19: "<previous page name>",
                pmc_prop30: "<previous page type>",
                pmc_eVar44: "Repeat",
                pmc_eVar48: "anonymous",
                pmc_eVar50: "99999999999999999999999999999999999999" // real visitor id
            });
        },
        function() {
            // NEW PAGE
            // Registry Create flow Account Create page (not to be confused with the standard
            //account create page)
            utag.view({
                pmc_pageName: "registry:create:account create",
                pmc_prop1: "registry",
                pmc_prop2: "registry",
                pmc_prop3: "registry:create",
                pmc_prop4: "registry:create:account create",
                pmc_prop5: "registry:create:account create",
                pmc_prop8: "potterybarnkids",
                pmc_eVar10: "D=pageName",
                pmc_eVar18: "Registry App",
                pmc_prop18: "Registry App",
                pmc_prop36: "Registry App: Native",
                pmc_prop19: "<previous page name>",
                pmc_prop30: "<previous page type>",
                pmc_eVar44: "Repeat",
                pmc_eVar48: "anonymous",
                pmc_eVar50: "99999999999999999999999999999999999999" // real visitor id
            });
        },
        function() {
            // Account Page (after login. Not to be confused by Registry Create Login success)
            // https://www.potterybarnkids.com/m/account/
            utag.view({
                pmc_event51: "event51",
                pmc_pageName: "account",
                pmc_prop1: "account",
                pmc_prop2: "account",
                pmc_prop3: "account",
                pmc_prop4: "account",
                pmc_prop5: "account",
                pmc_prop8: "potterybarnkids",
                pmc_eVar10: "D=pageName",
                pmc_eVar18: "Registry App",
                pmc_prop18: "Registry App",
                pmc_prop36: "Registry App: Native", // UPDATE
                pmc_prop19: "<previous page name>",
                pmc_prop30: "<previous page type>",
                pmc_eVar44: "Repeat",
                pmc_eVar48: "authenticated", // NEW. If logged in, else "anonymous"
                pmc_eVar50: "99999999999999999999999999999999999999" // real visitor id
            });
        },
        function() {
            // NEW PAGE
            // Account Page (Registry Create Login success. Not to be confused with after standard
            //login)
            utag.view({
                pmc_event51: "event51", // set on any page immediately after a successful login
                pmc_pageName: "registry:create:login success",
                pmc_prop1: "registry",
                pmc_prop2: "registry",
                pmc_prop3: "registry:create",
                pmc_prop4: "registry:create:login success",
                pmc_prop5: "registry:create:login success",
                pmc_prop8: "potterybarnkids",
                pmc_eVar10: "D=pageName",
                pmc_eVar18: "Registry App",
                pmc_prop18: "Registry App",
                pmc_prop36: "Registry App: Native",
                pmc_prop19: "<previous page name>",
                pmc_prop30: "<previous page type>",
                pmc_eVar44: "Repeat",
                pmc_eVar48: "authenticated",
                pmc_eVar50: "99999999999999999999999999999999999999" // real visitor id
            });
        },
        function() {
            // NEW PAGE
            // Account Page (Registry Create Login success. Not to be confused with after standard
            //login)
            utag.view({
                pmc_event51: "event51", // set on any page immediately after a successful login
                pmc_event52: "event52", // set on any page immediately after a successful account creation
                pmc_pageName: "registry:create:account create success",
                pmc_prop1: "registry",
                pmc_prop2: "registry",
                pmc_prop3: "registry:create",
                pmc_prop4: "registry:create:account create success",
                pmc_prop5: "registry:create:account create success",
                pmc_prop8: "potterybarnkids",
                pmc_eVar10: "D=pageName",
                pmc_eVar18: "Registry App",
                pmc_prop18: "Registry App",
                pmc_prop36: "Registry App: Native",
                pmc_prop19: "<previous page name>",
                pmc_prop30: "<previous page type>",
                pmc_eVar44: "Repeat",
                pmc_eVar48: "authenticated",
                pmc_eVar50: "99999999999999999999999999999999999999" // real visitor id
            });
        },
        function() {
            // Manage Registry Page
            // https://www.potterybarnkids.com/m/registry/manage-registry.html
            utag.view({
                pmc_pageName: "registry:manage-registry",
                pmc_prop1: "registry",
                pmc_prop2: "registry",
                pmc_prop3: "registry:manage-registry",
                pmc_prop4: "registry:manage-registry",
                pmc_prop5: "registry:manage-registry",
                pmc_prop8: "potterybarnkids",
                pmc_eVar10: "D=pageName",
                pmc_eVar18: "Registry App",
                pmc_prop18: "Registry App",
                pmc_prop36: "Registry App: Native", // UPDATE
                pmc_prop19: "<previous page name>",
                pmc_prop30: "<previous page type>",
                pmc_eVar44: "Repeat",
                pmc_eVar48: "authenticated", // NEW. If logged in, else "anonymous"
                pmc_eVar50: "99999999999999999999999999999999999999" // real visitor id
            });
        },
        function() {
            // Find a Registry
            // https://www.potterybarnkids.com/m/registry/find-registry.html
            utag.view({
                pmc_pageName: "registry:find-registry",
                pmc_prop1: "registry",
                pmc_prop2: "registry",
                pmc_prop3: "registry:find-registry",
                pmc_prop4: "registry:find-registry",
                pmc_prop5: "registry:find-registry",
                pmc_prop8: "potterybarnkids",
                pmc_eVar10: "D=pageName",
                pmc_eVar18: "Registry App",
                pmc_prop18: "Registry App",
                pmc_prop36: "Registry App: Native", // UPDATE
                pmc_prop19: "<previous page name>",
                pmc_prop30: "<previous page type>",
                pmc_eVar44: "Repeat",
                pmc_eVar48: "authenticated", // NEW. If logged in, else "anonymous"
                pmc_eVar50: "99999999999999999999999999999999999999" // real visitor id
            });
        },
        function() {
            // Find a Registry - search results
            //
            //https://www.potterybarnkids.com/m/registry/find.html?firstName=Wes&lastName=Contreras
            utag.view({
                pmc_pageName: "registry:find",
                pmc_prop1: "registry",
                pmc_prop2: "registry",
                pmc_prop3: "registry:find",
                pmc_prop4: "registry:find",
                pmc_prop5: "registry:find",
                pmc_prop8: "potterybarnkids",
                pmc_eVar10: "D=pageName",
                pmc_eVar18: "Registry App",
                pmc_prop18: "Registry App",
                pmc_prop36: "Registry App: Native", // UPDATE
                pmc_prop19: "<previous page name>",
                pmc_prop30: "<previous page type>",
                pmc_eVar44: "Repeat",
                pmc_eVar48: "authenticated", // NEW. If logged in, else "anonymous"
                pmc_eVar50: "99999999999999999999999999999999999999" // real visitor id
            });
        },
        function() {
            // Registry List as Guest
            // https://www.potterybarnkids.com/m/registry/mt6gbjc9t8/registry-list.html
            utag.view({
                pmc_pageName: "registry:registry-list",
                pmc_event45: "event45",
                pmc_event60: "event60",
                pmc_event56: "event56",
                pmc_event74: "event74",
                pmc_event151: "event151", // REMOVE. Also remove below in Products string.
                pmc_event152: "event152", // REMOVE. Also remove below in Products string.
                pmc_event148: "event148",
                pmc_event155: "event155",
                pmc_event201: "event201", // MISSED THIS. REMOVE.
                pmc_products: ";<groupID>;;;event151=1|event148=1|event56=1|event74=20;eVar45=1|eVar46=20|eVar33=<SKU>,;<groupID>;;;event151=2|event148=2|event155=1;eVar33=<SKU>", // NEW variables eVar45 (backorder) and eVar46 (backorder number of days)
                pmc_prop1: "registry list",
                pmc_prop2: "registry",
                pmc_prop3: "registry:registry-list",
                pmc_prop4: "registry:registry-list",
                pmc_prop5: "registry:registry-list",
                pmc_eVar1: "non-shop",
                pmc_eVar2: "D=v1",
                pmc_eVar3: "D=v1",
                pmc_prop8: "potterybarnkids",
                pmc_eVar10: "D=pageName",
                pmc_eVar18: "Registry App",
                pmc_prop18: "Registry App",
                pmc_prop36: "Registry App: Native", // UPDATE
                pmc_prop19: "<previous page name>",
                pmc_prop30: "<previous page type>",
                pmc_eVar34: "<registryID>",
                pmc_eVar9: "registry:registry list gift giver",
                pmc_eVar15: "non-internal ad",
                pmc_eVar25: "non-homepage link",
                pmc_eVar27: "non-search",
                pmc_eVar28: "non-spell-corrected search",
                pmc_eVar29: "non-search",
                pmc_eVar39: "no refinement",
                pmc_eVar40: "no refinement",
                pmc_eVar44: "Repeat",
                pmc_eVar48: "authenticated", // NEW. If logged in, else "anonymous"
                pmc_eVar50: "99999999999999999999999999999999999999", // real visitor id
                pmc_eVar51: "non-search"
            });
        },
        function() {
            // Registry List as registrant
            // https://www.potterybarnkids.com/m/registry/XXX/registry-list.html
            utag.view({
                pmc_pageName: "registry:registry-list",
                pmc_event45: "event45",
                pmc_event60: "event60",
                pmc_event56: "event56",
                pmc_event74: "event74",
                pmc_event151: "event151", // REMOVE. Also remove below in Products string.
                pmc_event152: "event152", // REMOVE. Also remove below in Products string.
                pmc_event144: "event144", // REMOVE.
                pmc_event148: "event148",
                pmc_event149: "event149", // REMOVE.
                pmc_event155: "event155",
                pmc_event201: "event201", // REMOVE.
                pmc_products: ";<groupID>;;;event151=1|event148=1|event56=1|event74=20;eVar33=<SKU>,;<groupID>;;;event151=2|event148=2|event155=1;eVar33=<SKU>", // NEW variables eVar45 (backorder) and eVar46 (backorder number of days)
                pmc_prop1: "registry list",
                pmc_prop2: "registry",
                pmc_prop3: "registry:registry-list",
                pmc_prop4: "registry:registry-list",
                pmc_prop5: "registry:registry-list",
                pmc_eVar1: "non-shop",
                pmc_eVar2: "D=v1",
                pmc_eVar3: "D=v1",
                pmc_prop8: "potterybarnkids",
                pmc_eVar10: "D=pageName",
                pmc_eVar18: "Registry App",
                pmc_prop18: "Registry App",
                pmc_prop36: "Registry App: Native", // UPDATE
                pmc_prop19: "<previous page name>",
                pmc_prop30: "<previous page type>",
                pmc_eVar34: "<registryID>",
                pmc_eVar9: "registry:registry list registrant",
                pmc_eVar15: "non-internal ad",
                pmc_eVar25: "non-homepage link",
                pmc_eVar27: "non-search",
                pmc_eVar28: "non-spell-corrected search",
                pmc_eVar29: "non-search",
                pmc_eVar39: "no refinement",
                pmc_eVar40: "no refinement",
                pmc_eVar49: "TheKnot", // REMOVE.
                pmc_eVar44: "Repeat",
                pmc_eVar48: "authenticated", // NEW. If logged in, else "anonymous"
                pmc_eVar50: "99999999999999999999999999999999999999", // real visitor id
                pmc_eVar51: "non-search"
            });
        },
        function() {
            // Create Registry Page (is this a page?)
            // https://www.potterybarnkids.com/m/registry/create.html
            utag.view({
                pmc_pageName: "registry:create",
                pmc_prop1: "registry",
                pmc_prop2: "registry",
                pmc_prop3: "registry:create",
                pmc_prop4: "registry:create",
                pmc_prop5: "registry:create",
                pmc_prop8: "potterybarnkids",
                pmc_eVar10: "D=pageName",
                pmc_eVar18: "Registry App",
                pmc_prop18: "Registry App",
                pmc_prop36: "Registry App: Native", // UPDATE
                pmc_prop19: "<previous page name>",
                pmc_prop30: "<previous page type>",
                pmc_eVar44: "Repeat",
                pmc_eVar48: "authenticated", // NEW. If logged in, else "anonymous"
                pmc_eVar50: "99999999999999999999999999999999999999" // real visitor id
            });
        },
        function() {
            // NEW PAGE
            // REGISTRY-LIST IS NEVER THE LANDING PAGE IN THE APP.
            // registry creation success page
            // https://www.potterybarnkids.com/registry/XXX/create-registry-confirmation.html
            utag.view({
                pmc_pageName: "registry:create-registry-confirmation",
                pmc_event45: "event44",
                pmc_event149: "event149", // Registry Partner Opt-in
                pmc_event150: "event150", // Registry Partner Opt-out
                pmc_event201: "event201", // for public registries. event202 for private, event203 for protected
                pmc_prop1: "registry",
                pmc_prop2: "registry",
                pmc_prop3: "registry:create-registry-confirmation",
                pmc_prop4: "registry:create-registry-confirmation",
                pmc_prop5: "registry:create-registry-confirmation",
                pmc_prop8: "potterybarnkids",
                pmc_eVar10: "D=pageName",
                pmc_eVar18: "Registry App",
                pmc_prop18: "Registry App",
                pmc_prop36: "Registry App: Native", // UPDATE
                pmc_prop19: "<previous page name>",
                pmc_prop30: "<previous page type>",
                pmc_eVar34: "<registryID>",
                pmc_eVar30: "registry",
                pmc_eVar49: "TheKnot", // Partner opted in. See event149.
                pmc_eVar44: "Repeat",
                pmc_eVar48: "authenticated", // NEW. If logged in, else "anonymous"
                pmc_eVar50: "99999999999999999999999999999999999999" // real visitor id
            });
        },
        function() {
            // Update Quantity will be a click event on the registry-list page. Nice To Have.
            utag.link({
                pmc_event217: "event217",
                pmc_products: ";<groupID>;;;event217=<quantity>;eVar33=<sku>",
                pmc_prop8: "potterybarnkids",
                pmc_eVar10: "registry:registry-list",
                pmc_eVar18: "Registry App",
                pmc_prop18: "Registry App",
                pmc_prop36: "Registry App"
            });
        },
        function() {
            // Delete product will be a click event on the registry-list page. Nice To Have.
            utag.link({
                pmc_event218: "event218",
                pmc_products: ";<groupID>;;;event218=1;eVar33=<sku>",
                pmc_prop8: "potterybarnkids",
                pmc_eVar10: "registry:registry-list",
                pmc_eVar18: "Registry App",
                pmc_prop18: "Registry App",
                pmc_prop36: "Registry App"
            });
        },
        function() {
            // Cart Add in same brand will be a click event on registry-list page. Required. If there are errors associated with the products, do NOT fire this.It is considered a success event.
            utag.link({
                pmc_scAdd: "scAdd",
                pmc_event11: "event11",
                pmc_event12: "event12",
                pmc_event69: "event69",
                pmc_event70: "event70",
                pmc_event173: "event173",
                pmc_scOpen: "scOpen",
                pmc_event99: "event99",
                pmc_products: ";<groupID>;;;event11=<quantity>|event69=<quantity>|event99=1|event12=<unit price>|event70=<unit price>;eVar58=primary|eVar33=<sku>",
                pmc_prop8: "potterybarnkids",
                pmc_eVar10: "add item:add to cart",
                pmc_eVar18: "Registry App",
                pmc_prop18: "Registry App",
                pmc_prop36: "Registry App: Native", // UPDATE
                pmc_eVar44: "Repeat",
                pmc_eVar48: "authenticated", // NEW. If logged in, else "Anonymous"
                pmc_eVar50: "99999999999999999999999999999999999999" // real visitor id
            });
        },
        function() {
            // NEW PAGE
            // Super Category Page (example - "furniture" should be replaced by any supercat value.)
            utag.view({
                pmc_event60: "event60",
                pmc_pageName: "shop:furniture",
                pmc_products: ";productmerchXX", // where XX is a number that increases by one every time it is shown.
                pmc_eVar1: "furniture",
                pmc_eVar2: "furniture",
                pmc_eVar3: "furniture",
                pmc_prop1: "supercategory",
                pmc_prop2: "shop",
                pmc_prop3: "shop:furniture",
                pmc_prop4: "shop:furniture",
                pmc_prop5: "shop:furniture",
                pmc_prop8: "potterybarnkids",
                pmc_eVar9: "shop",
                pmc_eVar15: "non-internal ad",
                pmc_eVar25: "non-homepage link",
                pmc_eVar27: "non-search",
                pmc_eVar28: "non-spell-corrected search",
                pmc_eVar29: "non-search",
                pmc_eVar39: "no refinement",
                pmc_eVar40: "no refinement",
                pmc_eVar10: "D=pageName",
                pmc_eVar18: "Registry App",
                pmc_prop18: "Registry App",
                pmc_prop36: "Registry App: Native",
                pmc_prop19: "<previous page name>",
                pmc_prop30: "<previous page type>",
                pmc_eVar44: "Repeat",
                pmc_eVar48: "authenticated",
                pmc_eVar50: "99999999999999999999999999999999999999" // real visitor id
            });
        },
        function() {
            // NEW PAGE
            // Category Page (example - "kids-mattresses" should be replaced by any category value.)
            utag.view({
                pmc_event60: "event60",
                pmc_pageName: "shop:furniture:kids-mattresses",
                pmc_products: ";productmerchXX", // where XX is a number that increases by one every time it is shown.
                pmc_eVar1: "furniture",
                pmc_eVar2: "furniture:kids-mattresses",
                pmc_eVar3: "furniture:kids-mattresses",
                pmc_prop1: "category",
                pmc_prop2: "shop",
                pmc_prop3: "shop:furniture",
                pmc_prop4: "shop:furniture:kids-mattresses",
                pmc_prop5: "shop:furniture:kids-mattresses",
                pmc_prop8: "potterybarnkids",
                pmc_eVar9: "shop",
                pmc_eVar15: "non-internal ad",
                pmc_eVar25: "non-homepage link",
                pmc_eVar27: "non-search",
                pmc_eVar28: "non-spell-corrected search",
                pmc_eVar29: "non-search",
                pmc_eVar39: "no refinement",
                pmc_eVar40: "no refinement",
                pmc_eVar10: "D=pageName",
                pmc_eVar18: "Registry App",
                pmc_prop18: "Registry App",
                pmc_prop36: "Registry App: Native",
                pmc_prop19: "<previous page name>",
                pmc_prop30: "<previous page type>",
                pmc_eVar44: "Repeat",
                pmc_eVar48: "authenticated",
                pmc_eVar50: "99999999999999999999999999999999999999" // real visitor id
            });
        },
        function() {
            // NEW PAGE
            // Search Results
            utag.view({
                pmc_event60: "event60",
                pmc_event33: "event33", // on every search result
                pmc_event34: "event34", // only if there are zero search results
                pmc_pageName: "search:results",
                pmc_products: ";productmerchXX", // where XX is a number that increases by one every time it is shown.
                pmc_eVar1: "non-shop",
                pmc_eVar2: "D=v1",
                pmc_eVar3: "D=v1",
                pmc_prop1: "search",
                pmc_prop2: "search",
                pmc_prop3: "search",
                pmc_prop4: "search",
                pmc_prop5: "search",
                pmc_prop8: "potterybarnkids",
                pmc_eVar9: "search:search results",
                pmc_prop9: "D=v27",
                pmc_prop10: "XXXX", // number of search results
                pmc_prop22: "D=v51",
                pmc_eVar51: "regular", // or "cqs" for a product redirect, "redirect" or other types of redirects. Both of those values will not display on a search results page.
                pmc_prop11: "D=v29",
                pmc_prop12: "D=v28",
                pmc_prop47: "D=v39",
                pmc_prop17: "D=v40",
                pmc_eVar27: "<search term>", // this is the term after spell correction or selected search suggestion. "non-search" is default.
                pmc_eVar28: "<search term before spell correction>", // for example, if "star war" is entered and corrected to "star wars", then eVar28 will be "star war" while eVar27 will be "star wars". Default is "non-spell-corrected search".
                pmc_eVar29: "<search result type>", // probably "product" but can also be "video". Default is "non-search".
                pmc_eVar39: "no refinement",
                pmc_eVar40: "no refinement",
                pmc_eVar15: "non-internal ad",
                pmc_eVar25: "non-homepage link",
                pmc_eVar10: "D=pageName",
                pmc_eVar18: "Registry App",
                pmc_prop18: "Registry App",
                pmc_prop36: "Registry App: Native",
                pmc_prop19: "<previous page name>",
                pmc_prop30: "<previous page type>",
                pmc_eVar44: "Repeat",
                pmc_eVar48: "authenticated",
                pmc_eVar50: "99999999999999999999999999999999999999" // real visitor id
            });
        },
        function() {
            // NEW PAGE
            // Product View
            // backorder information is optional. event56, event74, eVar45, eVar46
            // No Longer Available (NLA) is optional. event155
            utag.view({
                pmc_prodView: "prodView",
                pmc_event18: "event18",
                pmc_event22: "event22",
                pmc_event56: "event56",
                pmc_event74: "event74",
                pmc_event155: "event155",
                pmc_products: "products=;<groupID>;;;event18=1|event56=1|event74=20|event155=1;eVar45=1|eVar46=20|eVar33=<SKU>",
                pmc_pageName: "product detail:<groupID>",
                pmc_prop1: "product detail:registry app",
                pmc_prop2: "product detail",
                pmc_prop3: "product detail",
                pmc_prop4: "product detail",
                pmc_prop5: "product detail",
                pmc_prop8: "potterybarnkids",
                pmc_eVar10: "D=pageName",
                pmc_eVar18: "Registry App",
                pmc_prop18: "Registry App",
                pmc_prop36: "Registry App: Native", // UPDATE
                pmc_prop19: "<previous page name>",
                pmc_prop30: "<previous page type>",
                pmc_eVar44: "Repeat",
                pmc_eVar48: "authenticated", // NEW. If logged in, else "anonymous"
                pmc_eVar50: "99999999999999999999999999999999999999" // real visitor id
            });
        }
    ]
}
