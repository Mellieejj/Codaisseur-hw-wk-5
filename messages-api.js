const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

let counting = 0;

const requestCounting = function(request, response, next) {
  if (counting >= 5) {
    return next(response.status(429).send("Too Many Requests"));
  } else {
    next();
  }
};

app.use(requestCounting);
app.use(bodyParser.json());

app.post("/messages", (request, response, next) => {
  // console.log(request.body);
  if (request.body.text) {
    counting++;
    response.json({ text: request.body.text });
  } else {
    response.status(400).send("Bad Request, try again");
  }
});

app.listen(port, () => {
  console.log(`app listen on ${port}`);
});
