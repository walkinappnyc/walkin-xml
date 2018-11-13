'use strict'

const parseString = require('xml2js').parseString
const request = require('request')
const fs = require('fs')
const XmlStream = require('xml-stream')

request('https://goldfarbproperties.com/feeds/streeteasy.xml', function (err, res, body) {
	console.log('error:', err)
	console.log('statusCode:', res && res.statusCode)
	console.log('body', body)

	let xml = body
	parseString(xml, function (err, result) {
    	console.dir(result);
    	console.log(JSON.stringify(result))
    	let dataJSON = JSON.stringify(result)
    	console.log(result.streeteasy)
    	console.log(result.streeteasy.properties)
    	console.log(result.streeteasy.properties[0])
    	result.streeteasy.properties[0].property.forEach(item => {
    		console.log(`++++++++++++ ${JSON.stringify(item)} ++++++++++++`)
    	})
	})
})

// let stream = fs.createReadStream('xmldata.xml')
// let xml = new XmlStream(stream)
// xml.preserve('properties', true)
// xml.collect('property')
// xml.on('endElement: property', function(property) {
// 	console.log(property)
// })

// request('https://goldfarbproperties.com/feeds/streeteasy.xml').pipe(fs.createWriteStream('xmldata.xml'))


// function sayHello() {
//   console.log('Hello World XML');
// }
// sayHello()