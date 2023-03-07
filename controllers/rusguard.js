const Request = require("tedious").Request
const request = require("request")

class RusGuard {
	constructor(db) {
		this.db = db
	}

	getData() {
		return new Promise(resolve => {
			let req = new Request(
				`SELECT
					DriverID as deviceId
					,EmployeeID as personId
					,Message as message
					,DateTime as timestamp 
				FROM dbo.Log 
				WHERE 
					DateTime > dateadd(ss,-5,getdate())
					AND (
						message = 'Вход' 
						OR message = 'Вход по лицу' 
						OR message = 'Выход' 
						OR message = 'Выход по лицу'
					)
				FOR JSON PATH`,
				err => {
					if (err) {
						console.log(err)
					}
				}
			)
			let string = ""

			req.on("row", columns => {
				columns.forEach((column, num) => {
					return (string += column.value)
				})
			})
			req.on("requestCompleted", async function (rowCount, more) {
				if (string) {
					this.result = JSON.parse(string)

					this.result.forEach(item => {
						item.type = "D"
						item.timestamp = item.timestamp.replace("T", " ")
					})

					let transformingObj = {}

					if (this.result.length <= 1) {
						transformingObj.event = this.result[0]
					} else {
						transformingObj.events = this.result
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
				}
				resolve(this.result)
			})

			this.db.execSql(req)
		})
	}
}

module.exports = {
	RusGuard,
}
