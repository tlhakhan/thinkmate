'use strict'

const cheerio = require('cheerio')
const fetch = require('node-fetch');

let getProducts = (url) => {
  return fetch(url.href).then((response) => {
    return response.text();
  }).then((body) => {
    let $ = cheerio.load(body);
    let anchors = Array.prototype.map.call($('tr.product td h2 a'), (anchor) => {
      return $(anchor).attr('href');
    });
    return anchors;

  }).catch((err) => {
    console.log(err);
  })
}

let getProduct = (url) => {
  return fetch(url.href).then((response) => {
    return response.text()
  }).then((body) => {
    let $ = cheerio.load(body);

    let product = {
      title: '',
      partNumber: '',
      price: '0',
      specs: {}
    }
    product.title = $('#page-container h1.auto_h1').text().replace(/\"/g,'in');
    product.partNumber = $('#page-container h2.margin_10_0').text().split(':').reverse()[0].trim();
    product.price = $('#page-container div.pricebox h3').text().replace(/Price: \$/g,'');

    let specs = Array.prototype.map.call($('#page-container table.table_5_10.table_compare tr.details'), (tr) => {
      //kvPair[0]
      let key = $(tr).children().first().text().replace(/(\s+|\(|\)|\/|-)/g,'');
      let value = $(tr).children().last().text().replace(/\"/g,'in');
      // clean key
      key = key.substring(0, 1).toLowerCase() + key.substring(1);

      if (key === "readBandwidth") key = "readSpeed";
      if (key === "writeBandwidth") key = "writeSpeed";
      product.specs = Object.assign(product.specs, {
        [key] : value
      });
    });
      return product;
  }).catch((err)=> {
    console.log(err);
  });
}


module.exports = {
  getProduct,
  getProducts
}
