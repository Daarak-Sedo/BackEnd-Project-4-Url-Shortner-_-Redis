const url = require("../models/urlModel")
const shortUrl = require('shortid')
let validUrl = require('valid-url');

const creatUrl = async function(req,res){
    let data = req.body.url
  
    if (validUrl.isUri(data)){
        console.log('Looks like an URI');
    } else {
        console.log('Not a URI');
    }
    // sorturl = await url.create(data)
    res.status(200).send("ok")
}

module.exports={creatUrl}