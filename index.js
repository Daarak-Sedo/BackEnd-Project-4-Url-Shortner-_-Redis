const express = require("express");
const bodyParser = require("body-Parser");
const mongoose = require("mongoose");
const route = require("./src/routes/route");
const app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
mongoose.connect(
        "mongodb+srv://divyanshu-patle:wXkZqu5fTwA9QFwj@cluster0.zrvtnuy.mongodb.net/?retryWrites=true&w=majority",
        { useNewUrlParser: true }
    )
    .then(() => console.log("mongodb connected"))
    .catch((error) => console.log(error.message));

app.use("/", route);

app.listen(3000, () => {
    console.log("express app is connected at port:" + 3000);
});
