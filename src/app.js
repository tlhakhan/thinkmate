'use strict';
const service = require('./services/thinkmate')
const url = require('url')
const RSVP = require('rsvp')
const _ = require('lodash')
const format = require('util').format

let link = process.argv[2] || process.exit(1);

// custom keys per product type
let ssdKeys = ["Product Type", "Storage Capacity", "Form Factor", "Interface", "Series", "Lifetime Endurance", "Life Expectancy", "Read IOPS", "Write IOPS", "Read Speed", "Write Speed", "NAND"]

service.getPageCount(url.parse(link)).then(count => {
	let pageLinks = []
	for (let i = 1; i <= count; i++) {
		pageLinks.push(format("%s?p=%s", link, i))
	}
	return pageLinks
}).then(pageLinks => {
	let promises = []
	pageLinks.forEach(pageLink => {
		let p = service.getProductLinksOnPage(url.parse(pageLink))
		promises.push(p)
	})
	return RSVP.all(promises).then(result => _.flatten(result))
}).then(productLinks => {
	let promises = []
	productLinks.forEach(productLink => {
		// console.log(productLink)
		let p = service.getProductDetailsOnPage(url.parse(productLink), ssdKeys)
		promises.push(p)
	})
	return RSVP.all(promises)
}).then(productDetails => {
	let header = []
	for (let h of ssdKeys) {
		header.push(format("\"%s\"", h))
	}
	console.log(header.join(","))
	productDetails.forEach(product => {
		let out = []
		for (let key of ssdKeys) {
			out.push(format("\"%s\"", _.replace(product[key],'"', '')))
		}
		console.log(out.join(","))
	})
})
