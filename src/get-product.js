'use strict'

const crawler = require('./lib/crawler')
const url = require('url')

let productLink = process.argv[2].split(' ')[0].trim() || process.exit(1)
let productType = process.argv[2].split(' ')[1]

crawler.getProduct(url.parse(productLink)).then((product) => {
  console.log(productType);
  if(productType === 'SSD' || productType === 'PCIe-SSD') {
    console.log(`"${product.title}", "${product.partNumber}", "${product.price}", "${product.specs.storageCapacity}", "${product.specs.formFactor}", "${product.specs.interface}", "${product.specs.lifetimeEndurance}", "${product.specs.lifeExpectancy}", "${product.specs.readIOPS}", "${product.specs.writeIOPS}", "${product.specs.readSpeed}", "${product.specs.writeSpeed}", "${product.specs.nAND}"`);
  }

  if(productType === 'HDD') {
    console.log(`"${product.title}", "${product.partNumber}", "${product.price}", "${product.specs.storageCapacity}", "${product.specs.formFactor}", "${product.specs.interface}", "${product.specs.rotationalSpeed}", "${product.specs.cache}", "${product.specs.readIOPS}", "${product.specs.writeIOPS}", "${product.specs.readSpeed}", "${product.specs.writeSpeed}"`);
  }

  if (productType === 'CPU') {
      console.log(`"${product.title}", "${product.partNumber}", "${product.price}", "${product.specs.productLine}", "${product.specs.socket}", "${product.specs.clockSpeed}", "${product.specs.codeName}", "${product.specs.smartCache}", "${product.specs.coresThreads}", "${product.specs.maxMemorySize}", "${product.specs.memoryChannels}", "${product.specs.maxMemoryBandwidth}", "${product.specs.maxTurboBoostFrequency}", "${product.specs.wattage}"`);
  }

});
