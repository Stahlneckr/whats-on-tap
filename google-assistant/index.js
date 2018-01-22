const logger = require("winston");
const puppeteer = require("puppeteer");

// = Winston Setup =
logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, { level: "debug", colorize: true, prettyPrint: true });
logger.addColors({ info: "blue", error: "red" });

const getDancingGnomeDraftList = async function getDancingGnomeDraftList() {
  const browser = await puppeteer.launch().catch((error) => logger.error(error));
  const page = await browser.newPage().catch((error) => logger.error(error));

  await page.goto("http://www.dancinggnomebeer.com/the-beer/").catch((error) => logger.error(error));

  const onTap = await page
    .$$eval(".index-section-wrapper .sqs-block-content h2", (els) => {
      const beers = [];
      els.forEach((el) => {
        if (el.innerText !== "") {
          beers.push(el.innerText);
        }
      });
      return beers;
    })
    .catch((error) => logger.error(error));

  browser.close();

  logger.debug(onTap);
  return onTap;
};

const buildOnTapResponse = async function buildOnTapResponse(brewery) {
  if (brewery !== "dancing gnome") {
    return {
      speech: "<speak>Sorry, we only know about Dancing Gnome's taplist right now. Check back later for more breweries.</speak>",
      display: "Sorry, we only know about Dancing Gnome's taplist right now. Check back later for more breweries.",
    };
  }

  const beers = await getDancingGnomeDraftList();
  let beersSpeechStr = "";
  let beersDisplayStr = "";
  beers.forEach((beer, i) => {
    if (i === beers.length - 1) {
      beersSpeechStr = `${beersSpeechStr} and ${beer} <break time='250ms' />`;
      beersDisplayStr = `${beersDisplayStr}and ${beer}.`;
    } else {
      beersSpeechStr = `${beersSpeechStr} ${beer}<break time='250ms' />`;
      beersDisplayStr = `${beersDisplayStr}${beer}, `;
    }
  });

  return {
    speech: `<speak>on tap at Dancing Gnome today we have ${beersSpeechStr} </speak>`,
    display: `On tap at Dancing Gnome today we have: ${beersDisplayStr}`,
  };
};

const whatsOnTapWebhook = async function whatsOnTapWebhook(req, res) {
  const intent = req.body.result.metadata.intentName;
  logger.debug(`intent = ${intent}`);

  const response = {
    speech: "",
    displayText: "",
    data: {
      google: {
        expect_user_response: true,
        is_ssml: true,
      },
    },
    contextOut: [],
  };

  switch (intent) {
    case "test": {
      response.speech = "<speak>Test case. Initiating ones and zeros. Beep boop. <break time='250ms' /> Bop. <break time='500ms' /> Boop beep.</speak>";
      response.displayText = "Test case. Initiating ones and zeros. Beep boop. Bop. Boop beep.";
      res.json(response);
      break;
    }
    case "on_tap": {
      const { brewery } = req.body.result.parameters;
      logger.debug(`brewery: ${brewery}`);

      const builtResponse = await buildOnTapResponse(brewery);
      response.speech = builtResponse.speech;
      response.displayText = builtResponse.display;

      res.json(response);
      break;
    }
    default: {
      logger.debug("switch-case in default");
      res.json(response);
      break;
    }
  }
};

buildOnTapResponse("dancing gnome")
  .then((response) => {
    logger.debug(response);
  })
  .catch((error) => logger.error(error));

exports.whatsOnTapWebhook = whatsOnTapWebhook;
