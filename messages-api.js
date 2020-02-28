const express = require("express");

const app = express();
const port = 3000;

app.get("/messages", (request, response, next) => {
  response.send("Hello");
});
app.listen(port, () => {
  console.log(`app listen on ${port}`);
});
