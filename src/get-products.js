'use strict'

const crawler = require('./lib/crawler')
const _ = require('lodash');
const url = require('url');
const RSVP = require('rsvp');

let pageLink = process.argv[2] || process.exit(1)
let productType = process.argv[3]
let pageCount = process.argv[4]

let getProducts = (pageLink, productType, pageCount) => {
  let promises = [];
  _.range(1,pageCount).forEach((i) => {
    promises.push(crawler.getProducts(url.parse(`${pageLink}?p=${i}`)));
  });

  RSVP.all(promises).then((links) => {
    _.flattenDeep(links).map((link) => {
      console.log(`${link} ${productType}`);
    });
  });
}

getProducts(pageLink, productType, pageCount)
