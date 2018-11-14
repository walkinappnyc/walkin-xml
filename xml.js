'use strict'

const parseString = require('xml2js').parseString
const request = require('request')
const fs = require('fs')
const XmlStream = require('xml-stream')
const dateTime = require('date-time')

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
    		let template = {
				  "yardi_code": "string",
				  "type": "residential_rentals",
				  "number": "string",
				  "feed_number_override": "string",
				  "show_number": false,
				  "slug": "string",
				  "floor": "string",
				  "square_footage": 0,
				  "rooms": 0,
				  "bedrooms": 0,
				  "bathrooms": 0,
				  "price": 0,
				  "lease_term": 12,
				  "concession_months": 0,
				  "concession_language": "string",
				  "concession_expiration": "string",
				  "disable_openhouse": "no",
				  "active_streeteasy": "no",
				  "body": "string",
				  "status": "available",
				  "featured": true,
				  "version": 0,
				  "apply_link": "string",
				  "virtual_tour_id": "string",
				  "created_at": "2018-11-13T23:44:28.556Z",
				  "updated_at": "2018-11-13T23:44:28.556Z",
				  "buildingId": 0,
				  "floorplanId": 0
			}

			template.updated_at = dateTime()
			template.body = item.details[0].description[0]
			template.price = item.details[0].price[0]
			template.bedrooms = item.details[0].bedrooms[0]

    		let options = {
	    		url: 'https://walkin-staging.herokuapp.com/api/Units',
	    		method: 'POST',
	    		headers: {
	    			'Accept': 'application/JSON'
	    		},
	    		json: true,
	    		body: template
    		}
    		console.log(item)
    		console.log(item.details)

    		request(options, function(err, res, body) {
    			// console.log(JSON.stringify(item.details))
    			console.log('working');
    			console.log(body)
    		})
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

