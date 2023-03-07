const express = require("express")
const bodyParser = require("body-parser")
const router = require("./routes/routes")

const PORT = process.env.PORT || 8080
const app = express()

app.use(bodyParser.json())
app.use(router)

app.listen(PORT, () => {
	console.log(`Server has been started on PORT ${PORT}`)
})
