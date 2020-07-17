// var express = require("express");
// var app = express();
const fetch = require("node-fetch");

// app.post("/", function (req, res) {
// fetch("http://127.0.0.1:5000/?file=pdf-to-lint-example.pdf")
//   .then((r) => r.json())
//   .then((r) => {
//     res.json(r);
//   });
// });

// app.listen(5001, function () {
//   console.log("Example app listening on port 5001!");
// });

const express = require("express");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const _ = require("lodash");

const app = express();

// enable files upload
app.use(
  fileUpload({
    createParentPath: true,
  })
);

//add other middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));

//start app
const port = process.env.PORT || 5001;

app.post("/", async (req, res) => {
  try {
    if (!req.files) {
      res.send({
        status: false,
        message: "No file uploaded",
      });
    } else {
      //Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
      let avatar = req.files.file;

      //Use the mv() method to place the file in upload directory (i.e. "uploads")
      avatar.mv("./uploads/" + avatar.name);

      const filepath = `./uploads/${avatar.name}`;
      fetch(`http://127.0.0.1:5000/?file=${filepath}`)
        .then((r) => r.json())
        .then((r) => {
          res.json(r);
        });
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

app.listen(port, () => console.log(`App is listening on port ${port}.`));