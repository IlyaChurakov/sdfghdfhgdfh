const request = require("request")

class FindFace {
	async getEvents(req, res) {
		let event = {
			type: "C",
			deviceId: req.body[0].camera ? req.body[0].camera : null,
			personId: req.body[0].matched_object ? req.body[0].matched_object : null,
			timestamp: req.body[0].created_date
				? req.body[0].created_date.replace("T", " ").split("+")[0]
				: null,
		}
		let transformingObj = {
			event: event,
		}
		await request(
			{
				url: "http://localhost:5001/watchman/api/events",
				method: "POST",
				json: true,
				body: transformingObj,
			},
			(err, response, body) => {
				try {
					let parseData = JSON.parse(response.request.body)

					console.log(`Код запроса: ${response.statusCode}`)

					if (!err && response.statusCode == 200) {
						console.log(parseData)
					} else if (err) {
						console.log(err)
					}
				} catch (err) {
					console.log(err)
				}
			}
		)

		res.send(transformingObj)
	}
}

module.exports = new FindFace()
