// Breweries
const DancingGnome = require("./dancing-gnome");
const Hitchhiker = require("./hitchhiker");

const breweryList = ["dancing-gnome", "hitchhiker"];

const buildOnTapResponse = async function buildOnTapResponse(brewery) {
  if (breweryList.indexOf(brewery) === -1) {
    return {
      speech:
        "<speak>Sorry, we only know about Dancing Gnome and Hitchhiker's taplist right now. Check back later for more breweries.</speak>",
      display:
        "Sorry, we only know about Dancing Gnome and Hitchhiker's taplist right now. Check back later for more breweries.",
    };
  }

  let beers = [];
  let breweryDisplayName = "";
  let beersSpeechStr = "";
  let beersDisplayStr = "";

  if (brewery === "dancing-gnome") {
    breweryDisplayName = "Dancing Gnome";
    beers = await DancingGnome.getDraftList();
  } else {
    breweryDisplayName = "Hitchhiker";
    beers = await Hitchhiker.getDraftList();
  }

  beers.forEach((beer, i) => {
    if (i === beers.length - 1) {
      beersSpeechStr = `${beersSpeechStr} and ${beer} <break time='500ms' />`;
      beersDisplayStr = `${beersDisplayStr}and ${beer}.`;
    } else {
      beersSpeechStr = `${beersSpeechStr} ${beer}<break time='500ms' />`;
      beersDisplayStr = `${beersDisplayStr}${beer}, `;
    }
  });

  return {
    speech: `<speak>on tap at ${breweryDisplayName} today we have ${beersSpeechStr} </speak>`,
    display: `On tap at ${breweryDisplayName} today we have: ${beersDisplayStr}`,
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
