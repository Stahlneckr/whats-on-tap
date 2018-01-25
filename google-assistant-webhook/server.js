const bodyParser = require("body-parser");
const express = require("express");
const http = require("http");
const morgan = require("morgan");
const path = require("path");
const logger = require("./logger");

const webhook = require("./webhook");

// = App Errors =
process.on("uncaughtException", (err) => {
  logger.error("Uncaught Error:", err);
  process.exit();
});

// = Express =
const app = express();
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(morgan("dev"));

const server = http.createServer(app).listen(8000, () => {
  logger.info("Web | Ready | Port:", server.address().port);
});

app.post("/whats-on-tap-webhook", webhook.whatsOnTapWebhook);
