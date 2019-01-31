'use strict';
const service = require('./services/thinkmate')
const url = require('url')

let link = process.argv[2] || process.exit(1);

//service.getPageCount(url.parse(link)).then(count => console.log(count))

//service.getProductLinksOnPage(url.parse(link)).then(links => links.map((link) => console.log(link)))

// ssd keys i would like in a report -- price is always given
let ssdKeys = ["Product Type", "Storage Capacity", "Form Factor", "Interface", "Series", "Lifetime Endurance", "Life Expectancy", "Read IOPS", "Write IOPS", "Read Speed", "Write Speed", "NAND"]
service.getProductDetailsOnPage(url.parse(link), ssdKeys).then(d => console.log(d))
