'use strict';
const service = require('./services/thinkmate')
const url = require('url')
const RSVP = require('rsvp')
const _ = require('lodash')
const format = require('util').format

// script takes 1 argument which is the hardware product url page
let link = process.argv[2] || process.exit(1);

// custom keys per product type
// currently only ssd is supported
let ssdKeys = ["Product Type", "Storage Capacity", "Form Factor", "Interface", "Series", "Lifetime Endurance", "Life Expectancy", "Read IOPS", "Write IOPS", "Read Speed", "Write Speed", "NAND"]


// the promise chain to generate the csv
service.getPageCount(url.parse(link)).then(count => {
	// i have the count of product pages
	let pageLinks = []
	for (let i = 1; i <= count; i++) {
		// generate all the product page urls
		pageLinks.push(format("%s?p=%s", link, i))
	}
	return pageLinks
}).then(pageLinks => {
	// generate a promise array and get all product deatils links on each products page
	let promises = []
	pageLinks.forEach(pageLink => {
		let p = service.getProductLinksOnPage(url.parse(pageLink))
		promises.push(p)
	})
	// once I have all the product links, flatten all the arrays into a single array
	// this is needed since each promise result will be stored in an array
	// thus the result will be an array of arrays
	return RSVP.all(promises).then(result => _.flatten(result))
}).then(productLinks => {
	let promises = []
	// given each product details url, inspect each details page and retrieve a deatils object
	productLinks.forEach(productLink => {
		// console.log(productLink)
		let p = service.getProductDetailsOnPage(url.parse(productLink), ssdKeys)
		promises.push(p)
	})
	// flatten isn't needed becuase the result will contain an array of { details } object.
	return RSVP.all(promises)
}).then(productDetails => {
	// here we generate the report, all fields will be enclosed by double quotes and separated by comma
	// first begin by creating the header
	let header = []
	for (let h of ssdKeys) {
		header.push(format("\"%s\"", h))
	}
	header.push(format("\"%s\"", "Current Price"))
	console.log(header.join(","))

	// generate a csv row for each details object
	productDetails.forEach(product => {
		let out = []
		for (let key of ssdKeys) {
			// make sure to remove any double quotes that is already in the value
			out.push(format("\"%s\"", _.replace(product[key],'"', '')))
		}
		// add the current price key since this does not exist in the keys array
		out.push(format("\"%s\"", _.replace(product["Current Price"],'"', '')))
		console.log(out.join(","))
	})
})
