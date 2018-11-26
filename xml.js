'use strict'

const parseString = require('xml2js').parseString
const request = require('request')
const fs = require('fs')
const XmlStream = require('xml-stream')
const dateTime = require('date-time')

request('https://goldfarbproperties.com/feeds/streeteasy.xml', function (err, res, body) {
	// console.log('error:', err)
	// console.log('statusCode:', res && res.statusCode)
	// console.log('body', body)

	let xml = body
	parseString(xml, function (err, result) {
    	// console.dir(result);

    	let dataJSON = JSON.stringify(result)
    	// console.log(result.streeteasy)
    	// console.log(result.streeteasy.properties)
    	// console.log(result.streeteasy.properties[0])


    	result.streeteasy.properties[0].property.forEach(item => {
    		// console.log(`++++++++++++ ${JSON.stringify(item)} ++++++++++++`)

    		let photoArray = item.media[0].photo
			// console.log(JSON.stringify(photoArray))

			let parsedMedia = []

			photoArray.forEach(photo => {
				let tempObj = {}
				tempObj["type"] = "photo"
				// console.log(tempObj)
				tempObj["url"] = photo.$.url
				tempObj["description"] = photo.$.description
				tempObj["position"] = photo.$.position
				parsedMedia.push(tempObj)
				// console.log(parsedPhotos)
				return parsedMedia
			})

			let floorplanArray = item.media[0].floorplan || null

			// console.log(JSON.stringify(floorplanArray))

			// let parsedFloorplans = []

			if (floorplanArray != null) {
				floorplanArray.forEach(floorplan => {
					let tempObj = {}
					tempObj["type"] = "floorplan"
					// console.log(tempObj)
					tempObj["url"] = floorplan.$.url
					tempObj["description"] = floorplan.$.description
					tempObj["position"] = null
					parsedMedia.push(tempObj)
					// console.log(parsedFloorplans)
					return parsedMedia
				})
			}

			// let mediaArray = []

			// mediaArray.push(photoArray)
			// mediaArray.push(floorplanArray)
			console.log(JSON.stringify(parsedMedia))

    		let template = {
			  "xml_id":"defined in xml feed as id",
			  "yardi_code":"not defined in xml but a field on a lot of their tables - could be useful might be the db name for id",
			  "landlord":{
			    "name":"Michael Angelo",
			    "company":"MOOKIE.INC"
			  },
			  "location":{
			    "address":"315 West 57th Street",
			    "apartment":"09B",
			    "city":"New York",
			    "state":"NY",
			    "zipcode":"11109",
			    "neighborhood":"Columbus Circle"
			  },
			  "contact":{
			    "contact_email":"mookie@gmail.com",
			    "apply_url":"mookie@gmail.com",
			    "phone_number":"212.262.1675"
			  },
			  "agents":[
			    {
			      "name":"Goldfarb Properties",
			      "company":"Goldfarb Properties",
			      "email":"manhattan@goldprop.com",
			      "phone_number":"212.262.1675"
			    }
			  ],
			  "details":{
			    "amenities":{
			      "highlights":"doorman",
			      "unit":"garage, elevator, gym, dishwasher",
			      "building":null,
			      "other":"Central Air Conditioning, Laundry, Pets Not Permitted, Smoke Free Building, Yoga Classes , In-Home Package Delivery , Garden Courtyard , Breakfast Bar, Central AC, Custom Kitchen Cabinetry, Eat In Kitchen, Newly Renovated Kitchen"
			    },
			    "bathrooms":1,
			    "bedrooms":1,
			    "building":{
			      "description":"1 month(s) free on a 12 month lease rent is $3,150 net effective rent is $2,888.&nbsp;(promotions apply to new residents and immediate move in only) <br><br><br> Building Description: <br> Park Towers South upper west side apartments illustrate beautifully-modern details with quality service, located perfectly in the center of the city. Our buildings exhibit a well-maintained interior with welcoming doormen who remain onsite 24 hours a day. Enjoy gorgeous apartments supplied with top appliances and modern designer finishes. Select apartments include spacious wraparound terraces with views of the city and immense sunlight. Park Towers South provides convenience to all parts of the city and is the perfect place to call your new home."
			    },
			    "half_baths":0,
			    "neighborhood":{
			      "parks":"CSV",
			      "restaurants_bars":"CSV",
			      "pharmacys":"CSV",
			      "care_centers":"CSV"
			    },
			    "no_fee":true,
			    "price":2888,
			    "property_type":"rental or purchase",
			    "special_offers":"1 Year Free Gym, First Month Free",
			    "total_rooms":3.0,
			    "transportation":{
			      "trains":"CSV",
			      "buses":"CSV"
			    }
			  },
			  "open_houses":[
			    {
			      "starts_at":"2018-11-25 9:00am",
			      "ends_at":"2018-11-25 6:00pm"
			    }
			  ],
			  "media":[
			    {
			      "type":"photo",
			      "url":"https://goldfarbproperties.com/uploads/_styles/carousel-slide/building/315-10g-kitchen.JPG",
			      "description":"315-10G Kitchen",
			      "position":"0"
			    },
			    {
			      "type":"floorplan",
			      "url":"https://goldfarbproperties.com/uploads/_styles/carousel-slide/building/315-10g-kitchen.JPG",
			      "description":"315-10G Kitchen",
			      "position":null
			    }
			  ]
			}


			template.xml_id = item.$.id
			template.location = {
				"address": `${item.location[0].address[0]}`,
				"apartment": `${item.location[0].apartment[0]}`,
				"city": `${item.location[0].city[0]}`,
				"state": `${item.location[0].state[0]}`,
				"zipcode": `${item.location[0].zipcode[0]}`,
				"neighborhood": `${item.location[0].neighborhood[0]}`
			}
			template.agents = [ 
				{
					"name": `${item.agents[0].agent[0].name[0]}`,
					"company": `${item.agents[0].agent[0].company[0]}`,
					"email": `${item.agents[0].agent[0].email[0]}`,
					"phone_number": `${item.agents[0].agent[0].phone_numbers[0].main[0]}`
				}
			]
			console.log(item)
			template.details = {
				"amenities": {
					"highlights": "test",
					"unit": "test",
					"building": "null",
					"other": `${item.details[0].amenities[0].other[0]}`
				},
				"bathrooms": `${item.details[0].bathrooms[0]}`,
				"bedrooms": `${item.details[0].bedrooms[0]}`,
				"building": {
					"description": `${item.details[0].description[0]}`
				},
				"half_baths": `${item.details[0].half_baths[0]}`,
				"no_fee": `${item.details[0].noFee[0]}`,
				"price": `${item.details[0].price[0]}`,
				"property_type": `${item.details[0].propertyType[0]}`,
				"total_rooms": `${item.details[0].totalrooms[0]}`
			}
			template.open_houses = item.openHouses
			template.media = parsedMedia
			template.updated_at = dateTime()

			// console.log(JSON.stringify(item.media[0].photo))

			// let photoArray = item.media[0].photo
			// console.log(JSON.stringify(photoArray))

			// let parsedPhotos = []

			// photoArray.forEach(photo => {
			// 	parsedPhotos.push(photo.$)
			// 	console.log(parsedPhotos)
			// 	return parsedPhotos
			// })


    		let options = {
	    		url: 'https://walkin-staging.herokuapp.com/api/Properties',
	    		method: 'POST',
	    		headers: {
	    			'Accept': 'application/JSON'
	    		},
	    		json: true,
	    		body: template
    		}

    		request(options, function(err, res, body) {
    			// console.log(JSON.stringify(item.details))
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

