const Router = require("express")
const FindFace = require("../controllers/findface")
const { dbMS } = require("../connections/mssql")
const { RusGuard } = require("../controllers/rusguard")

const router = new Router()

setInterval(async () => {
	let data = await new RusGuard(dbMS).getData()
	if (data) {
		console.log("The database request was successful")
	} else {
		console.log("No events in 5 seconds")
	}
}, 5000)

router.post("/hook", FindFace.getEvents)

module.exports = router
