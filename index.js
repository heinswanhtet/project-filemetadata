var express = require("express")
var cors = require("cors")
require("dotenv").config()

var app = express()
const { mkdirSync, existsSync } = require("fs")
const multer = require("multer")
const path = require("path")

app.use(cors())
app.use("/public", express.static(process.cwd() + "/public"))

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html")
})

const fileUpload = multer({
  storage: multer.diskStorage({
    destination: function (_req, _file, cb) {
      const resourcesFolder = path.join(__dirname, "resources")
      if (!existsSync(resourcesFolder)) {
        mkdirSync(resourcesFolder, { recursive: true })
      }
      cb(null, resourcesFolder)
    },
    filename: (_, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
      cb(null, uniqueSuffix + "-" + file.originalname)
    },
  }),
})

app.post("/api/fileanalyse", fileUpload.single("upfile"), function (req, res) {
  const file = req.file
  const name = file.originalname
  const type = file.mimetype
  const size = file.size

  res.json({ name, type, size })
})

const port = process.env.PORT || 3000
app.listen(port, function () {
  console.log("Your app is listening on port " + port)
})
