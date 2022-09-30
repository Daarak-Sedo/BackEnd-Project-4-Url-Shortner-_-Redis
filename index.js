const express = require("express");
const bodyParser = require("body-Parser");
const mongoose = require("mongoose");
const route = require("./src/routes/route");
const app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
mongoose.connect("mongodb+srv://divyanshu-patle:wXkZqu5fTwA9QFwj@cluster0.zrvtnuy.mongodb.net/divyanshu?retryWrites=true&w=majority",
        { useNewUrlParser: true }
    )
    .then(() => console.log("mongodb connected"))
    .catch((error) => console.log(error.message));

app.use("/", route);

app.listen(process.env.PORT || 3000, function () {
    console.log('Express app running on port ' + (process.env.PORT || 3000))
});
