const Brewery = require("./breweries");
const logger = require("./logger");

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
      response.speech =
        "<speak>Test case. Initiating ones and zeros. Beep boop. <break time='250ms' /> Bop. <break time='500ms' /> Boop beep.</speak>";
      response.displayText = "Test case. Initiating ones and zeros. Beep boop. Bop. Boop beep.";
      res.json(response);
      break;
    }
    case 'welcome':
    case "on_tap": {
      const { brewery } = req.body.result.parameters;
      logger.debug(`brewery: ${brewery}`);

      const builtResponse = await Brewery.buildOnTapResponse(brewery);
      response.speech = builtResponse.speech;
      response.displayText = builtResponse.display;

      res.json(response);
      break;
    }
    case "about_beer": {
      const { brewery, beer } = req.body.result.parameters;
      logger.debug(`brewery: ${brewery}, beer: ${beer}`);

      const builtResponse = await Brewery.buildAboutBeerResponse(brewery, beer);
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

exports.whatsOnTapWebhook = whatsOnTapWebhook;
