'use strict';

const fetch = require('node-fetch')
const cheerio = require('cheerio')

// Given a url to a sub category page, find the number of product pages
let getPageCount = (url) => {
	return fetch(url.href).then(res => res.text()).then(body => {
		let $ = cheerio.load(body)
		// the last anchor tag contains the the 'last' url link
		let out = $('.product-pagination a').last().attr('href')
		// the captured out will be a url that can be split on ?p= and grab the second item in the array
		let count = out.split('?p=')[1]
		return count
	})
}

// Given a numbered page url retrieve all the product links on page
let getProductLinksOnPage = (url) => {
	return fetch(url.href).then(res => res.text()).then(body => {
		let $ = cheerio.load(body)
		let links = []
		// easy to grab each link in this list view ui
		$('.table_list .product h2 a').each((i, el) => {
			links.push($(el).attr('href'))
		})
		return links
	})
}

// Given an item page return a details object that has keys defined by an array that contains the key string to find.
let getProductDetailsOnPage = (url, keys) => {
	return fetch(url.href).then(res => res.text()).then(body => {
		let $ = cheerio.load(body)
		let details = {}	
		// given the keys array, create a details object that is populated with those keys

		// the kvPairs contains the details table
		// the array needed to be named because the .each function by cheerio doesn't allow you to reference the array that i'm traversing inside of the each function.
		let kvPairs = $('.table_compare .details td')
		kvPairs.each((i, el) =>  {
			// the keys have the class name 'label'
			if ($(el).hasClass('label')) {
				let key = $(el).text()
				// values appear to always be index of label + 1
				// check for array index out of bounds
				// i reference the original array inside of a function that's traversing over it
				let validate = kvPairs[i+1]
				if (validate) {
					// label class really has a value next +1 door, now get text
					let val = $(validate).text()
					if (keys.some(k => k == key)) {
						details = Object.assign(details, { [key] : val })
					}
				}
			}
		})
		// found price to have uniq class name, dont really need cents
		// if it is undefined, set it to 0
		let price = $('.price-nice-dollars').text() || 0
		details = Object.assign(details, { "Current Price" : price })
		return details
	})
}

module.exports = { getPageCount, getProductLinksOnPage, getProductDetailsOnPage}
