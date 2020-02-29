const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

let counting = 0;

const requestCounting = function(request, response, next) {
  if (counting >= 5) {
    return response.status(429).next();
  } else {
    next();
  }
};

app.use(requestCounting);
app.use(bodyParser.json());

app.post("/", (request, response, next) => {
  console.log(request.body);
  counting++;
  const responseText =
    request.body.text || response.status(400).json("Bad Request");
  response.json({
    text: responseText
  });
});

app.listen(port, () => {
  console.log(`app listen on ${port}`);
});
