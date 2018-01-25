// Breweries
const DancingGnome = require("./dancing-gnome");

const buildOnTapResponse = async function buildOnTapResponse(brewery) {
  if (brewery !== "dancing-gnome") {
    return {
      speech:
        "<speak>Sorry, we only know about Dancing Gnome's taplist right now. Check back later for more breweries.</speak>",
      display: "Sorry, we only know about Dancing Gnome's taplist right now. Check back later for more breweries.",
    };
  }

  const beers = await DancingGnome.getDraftList();
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

const buildAboutBeerResponse = async function buildAboutBeerResponse(brewery, beer) {
  return {
    speech: `<speak>about_beer placeholder ${brewery}</speak>`,
    display: `about_beer placeholder ${beer}`,
  };
};

// Exports
exports.buildOnTapResponse = buildOnTapResponse;
exports.buildAboutBeerResponse = buildAboutBeerResponse;
