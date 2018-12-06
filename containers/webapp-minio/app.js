const express = require("express");
const app = express();
const cors = require("cors");

const assetsRoute = require("./routes/assets");

app.use(require("body-parser").json());
app.use(cors());

app.use(express.static(__dirname + "/public"));

app.use("/buckets", assetsRoute);

let port = process.env.PORT || 8080;
app.listen(port, function() {
  console.log("To view your app, open this link in your browser: http://localhost:" + port);
});

module.exports = app;
