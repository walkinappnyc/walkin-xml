'use strict'

const parseString = require('xml2js').parseString
const request = require('request')
const fs = require('fs')
const dateTime = require('date-time')


const XMLUrl = `http://localhost:3002/api/Landlords`


function getXMLFeeds() {
	let options = {
		url: `${XMLUrl}`,
		method: 'GET',
		headers: {
			'Accept': 'application/JSON'
		},
		json: true
	}

	const data = request(options, function(err, res, body) {
		console.log(JSON.stringify(body))
		createProperties(body)
	})
}

getXMLFeeds()

function createProperties(xml_feeds) {
	console.log(`array: ${JSON.stringify(xml_feeds)}`)
	xml_feeds.forEach(feed => {
		console.log(`feed: ${feed}`)
		let item = feed.xml_feed_url
		console.log(feed.id)
		console.log(feed.company)
		request(`${item}`, function (err, res, body) {
			// console.log('error:', err)
			// console.log('statusCode:', res && res.statusCode)
			// console.log('body', body)

		let xml = body
		parseString(xml, function (err, result) {
	    	console.dir(result)

	    	let dataJSON = JSON.stringify(result)
	    	// console.log(result.streeteasy)
	    	// console.log(result.streeteasy.properties)
	    	// console.log(result.streeteasy.properties[0])


	    	result.streeteasy.properties[0].property.forEach(item => {
	    		// console.log(`++++++++++++ ${JSON.stringify(item)} ++++++++++++`)

	    		let {
	    			$,
	    			location,
	    			details,
	    			openHouses,
	    			agents,
	    			media
	    		} = item

	    		let data = {
	    			$,
	    			location,
	    			details,
	    			openHouses,
	    			agents,
	    			media
	    		}

	    		console.log(`**** ${JSON.stringify($)} ***`)
	    		console.log(`**** ${JSON.stringify(location)} ***`)
	    		console.log(`**** ${JSON.stringify(details)} ***`)
	    		console.log(`**** ${JSON.stringify(openHouses)} ***`)
	    		console.log(`**** ${JSON.stringify(agents)} ***`)
	    		console.log(`**** ${JSON.stringify(media)} ***`)

	    		let photoArray = media[0].photo || null
				// console.log(JSON.stringify(photoArray))

				let parsedMedia = []

				if (photoArray != null) {
					photoArray.forEach(photo => {
						let tempObj = {}
						tempObj["type"] = "photo"

						tempObj["url"] = photo.$.url
						tempObj["description"] = photo.$.description
						tempObj["position"] = photo.$.position
						parsedMedia.push(tempObj)

						return parsedMedia
					})
				}


				let floorplanArray = media[0].floorplan || null

				// console.log(JSON.stringify(floorplanArray))

				if (floorplanArray != null) {
					floorplanArray.forEach(floorplan => {
						let tempObj = {}
						tempObj["type"] = "floorplan"
						tempObj["url"] = floorplan.$.url
						tempObj["description"] = floorplan.$.description
						tempObj["position"] = null
						parsedMedia.push(tempObj)

						return parsedMedia
					})
				}

	    		let template = {
				  "xml_id":"",
				  "landlord":{
				    "name":"Michael Angelo",
				    "company":"MOOKIE.INC"
				  },
				  "location":{},
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
				  "open_houses":[],
				  "media":[]
				}


				template.xml_id = $.id
				template.location = {
					"address": `${location[0].address[0]}`,
					"apartment": `${location[0].apartment[0]}`,
					"city": `${location[0].city[0]}`,
					"state": `${location[0].state[0]}`,
					"zipcode": `${location[0].zipcode[0]}`,
					"neighborhood": `${location[0].neighborhood[0]}`
				}
				template.agents = [ 
					{
						"name": `${agents[0].agent[0].name[0]}`,
						"company": `${agents[0].agent[0].company[0]}`,
						"email": `${agents[0].agent[0].email[0]}`,
						"phone_number": `${agents[0].agent[0].phone_numbers[0].main[0]}`
					}
				]
				template.contact = {
					"contact_email": `${agents[0].agent[0].email[0]}`,
					"apply_url": `${$.url}`,
					"phone_number": `${agents[0].agent[0].phone_numbers[0].main[0]}`
				}
				template.landlord = {
					"name": `${feed.company}`,
					"company": `${feed.company}`
				}
					
					// console.log(`${details[0].description[0].unit} ***`)
					// console.log(`${details[0].description[0].building}`)

				template.details = {
					"amenities": {
						"highlights": `${JSON.stringify(details[0].amenities[0])}`,
						"other": `${details[0].amenities[0].other[0]}`
					},
					"bathrooms": `${details[0].bathrooms[0]}`,
					"bedrooms": `${details[0].bedrooms[0]}`,
					"building": {
						"description": {
							"unit": `${details[0].description[0].unit}`,
							"building": `${details[0].description[0].building}`
						}
					},
					"half_baths": `${details[0].half_baths[0]}`,
					"no_fee": `${details[0].noFee[0]}`,
					"price": `${details[0].price[0]}`,
					"property_type": `${details[0].propertyType[0]}`,
					"total_rooms": `${details[0].totalrooms[0]}`
					// "special_offers": `{${details[0].incentives[0]}}`,
					// "transportation": `{${details[0].transportation[0]}}`
				}
				template.open_houses = openHouses
				template.media = parsedMedia
				template.landlordId = feed.id
				template.isActive = feed.isActive
				template.updated_at = dateTime()


	    		let options = {
						url: 'http://localhost:3002/api/Properties',
		    		method: 'POST',
		    		headers: {
		    			'Accept': 'application/JSON'
		    		},
		    		json: true,
		    		body: template
	    		}

	    		request(options, function(err, res, body) {
	    			// console.log(JSON.stringify(item.details))
	    			// console.log(body)
	    		})
	    	})
		})
		})
	})
}


// let stream = fs.createReadStream('xmldata.xml')
// let xml = new XmlStream(stream)
// xml.preserve('properties', true)
// xml.collect('property')
// xml.on('endElement: property', function(property) {
// 	console.log(property)
// })

// request('https://goldfarbproperties.com/feeds/streeteasy.xml').pipe(fs.createWriteStream('xmldata.xml'))

