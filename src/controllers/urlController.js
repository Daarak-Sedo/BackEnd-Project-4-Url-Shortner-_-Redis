const UrlModel = require("../models/urlModel")
const shortid = require('shortid')
let validUrl = require('valid-url');
const baseUrl = 'http://localhost:3000'

const creatUrl = async function (req, res) {
    try {
        let longUrl = req.body.url

        if (!validUrl.isUri(longUrl)) {
            return res.status(400).send({status:"false",message:"invalidUrl"})
        }

        const urlCode = shortid.generate()

        let url = await UrlModel.findOne({ longUrl }).select({_id:0,createdAt:0,updatedAt:0,__v:0})
        if (url) {
            return res.send({status:"true",data:url})
        }

        const shortUrl = baseUrl + '/' + urlCode

        url = new UrlModel({ longUrl, shortUrl, urlCode })
        await url.save()
        let obj = await UrlModel.findOne({ longUrl }).select({_id:0,createdAt:0,updatedAt:0,__v:0})
        res.send({data:obj})

    } catch (err) {
        res.status(500).send({status:"false",message:err})
    }
}

const getUrl = async function (req, res) {
    try {
        const url = await UrlModel.findOne({
            urlCode: req.params.urlCode
        })
        if (url) {
            return res.redirect(url.longUrl)
        }

        return res.status(404).send("No URL Found")
    }
    catch (err) {
        res.status(500).send({status:"false",message:err})
    }
}


module.exports = { creatUrl, getUrl }