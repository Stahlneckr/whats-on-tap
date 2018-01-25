const logger = require("winston");

// = logger Setup =
// should make it easier to add more robust logging later
logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {
  level: "debug",
  colorize: true,
  prettyPrint: true,
});
logger.addColors({ info: "blue", error: "red" });

module.exports = logger;
