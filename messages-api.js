const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.post("/", (request, response, next) => {
  console.log(request.body.message);
  const responseText =
    request.body.message || response.status(400).json("Bad Request");
  response.json({
    text: responseText
  });
});

// app.get("/messages", (request, response, next) => {
//   response.send("Hello");
// });

app.listen(port, () => {
  console.log(`app listen on ${port}`);
});
