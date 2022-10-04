const express = require("express")
const router = express.Router();
const urlController = require("../controllers/urlController")


router.post("/url/shorten",urlController.creatUrl)
router.get("/:urlCode",urlController.getUrl)


router.all("/*", function (req, res) {
    res.status(404).send({status: false,message: "Path Not Found"})
})

module.exports=router