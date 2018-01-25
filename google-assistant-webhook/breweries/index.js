// Breweries
const DancingGnome = require("./dancing-gnome");
const logger = require("../logger");

const buildOnTapResponse = async function buildOnTapResponse(brewery) {
  if (brewery !== "dancing-gnome") {
    return {
      speech: "<speak>Sorry, we only know about Dancing Gnome's taplist right now. Check back later for more breweries.</speak>",
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

buildAboutBeerResponse = async function buildAboutBeerResponse(brewery, beer) {
  return {
    speech: `<speak>FUUUUUUUUCKKKKKK ${brewery}</speak>`,
    display: `YOOOOOOUUUUUUUUUU ${beer}`,
  }
}

// Exports
exports.buildOnTapResponse = buildOnTapResponse;
exports.buildAboutBeerResponse = buildAboutBeerResponse;
