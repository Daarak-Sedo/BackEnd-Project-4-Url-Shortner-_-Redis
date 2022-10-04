//----------------------Imports------------------------//
const urlModel = require("../Models/UrlModel");
const shortId = require("shortid");
const validator = require("validator");
const redis = require("redis");
const { promisify } = require("util");

//-----------------Connect to redis --------------------------------

const redisClient = redis.createClient(
    13293,
    "redis-13293.c264.ap-south-1-1.ec2.cloud.redislabs.com",
    { no_ready_check: true }
);
redisClient.auth("N2VjRk2CoRiZhNOYJhNJsILUsl4vXsVi", function (err) {
    if (err) throw err;
});

redisClient.on("connect", async function () {
    console.log("Connected to Redis..");
});

//-------------Connection setup for redis -------------------------------

const SET_ASYNC = promisify(redisClient.SET).bind(redisClient);
const GET_ASYNC = promisify(redisClient.GET).bind(redisClient);

//----------------createURL----------------------------------------------

const urlShorten = async function (req, res) {
    try {
        let data = req.body;
        let { longUrl } = data;
        if (!Object.keys(data).length) return res.status(400).send({ status: false, message: "Please provide url to search" });

        //--------------------URL Validation--------------
        if (!validator.isURL(longUrl)) return res.status(400).send({ status: false, message: "Not Valid Url" });

        //----------------------DB Call-------------------------------
        let urlFind = await urlModel.findOne({ longUrl }.select({ urlCode: 1, longUrl: 1, shortUrl: 1, _id: 0 }));

        if (urlFind) return res.status(201).send({ status: true, data: urlFind });

        const baseUrl = `${req.protocol}://${req.headers.host}`;
        const urlCode = shortId.generate().toLowerCase();

        const shortUrl = baseUrl + "/" + urlCode;

        let url = { longUrl, shortUrl, urlCode };

        let result = await urlModel.create(url);

        return res.status(201).send({ status: true, data: url });
    } catch (err) {
        res.status(500).send({ status: false, error: err.message });
    }
};


//-------------------------getAPI----------------------------
const getUrl = async function (req, res) {
    try {
        let code = req.params.urlCode;

        //---------------urlcode validation---------------------
        if (!shortId.isValid(code)) return res.status(400).send({ status: false, message: "Invalid URLcode" });
        let validUrl = await urlModel.findOne({ urlCode: req.params.urlCode });
        if (!validUrl) return res.status(404).send({ status: false, message: "URL is not present in data base" });

        //------------------Caching apply------------------------
        let casheData = await GET_ASYNC(`${req.params.urlCode}`);

        if (casheData) return res.status(302).redirect(casheData);

        const findURL = await urlModel.findOne({ urlCode: req.params.urlCode });

        await SET_ASYNC(`${req.params.urlCode}`, findURL.longUrl);
        return res.status(302).redirect(findURL.longUrl);

    } catch (err) {
        return res.status(500).send({ status: false, error: err.message });
    }
};



module.exports = { urlShorten, getUrl };