const schedule = require("node-schedule");

// Breweries
const DancingGnome = require("./dancing-gnome");
const Hitchhiker = require("./hitchhiker");
const EastEnd = require("./east-end");
const GristHouse = require("./grist-house");
const Roundabout = require("./roundabout");

// consts
const breweryList = ["dancing-gnome", "hitchhiker", "east-end", "grist-house", "roundabout"];
const breweryListDisplay = ["Dancing Gnome", "Hitchhiker", "East End", "Grist House", "Roundabout"];

const buildWhatBreweriesResponse = function buildWhatBreweriesResponse() {
  let breweryString = "";
  breweryListDisplay.forEach((brewery, i) => {
    if (i === breweryListDisplay.length - 1) {
      breweryString = `${breweryString}and ${brewery}`;
    } else {
      breweryString = `${breweryString}${brewery}, `;
    }
  });

  return {
    speech: `<speak>Right now we know about ${breweryString} breweries</speak>`,
    display: `Right now we know about ${breweryString} breweries`,
  };
};

const buildOnTapResponse = async function buildOnTapResponse(brewery) {
  if (breweryList.indexOf(brewery) === -1) {
    return buildWhatBreweriesResponse();
  }

  let beers = [];
  let breweryDisplayName = "";
  let beersSpeechStr = "";
  let beersDisplayStr = "";

  if (brewery === "dancing-gnome") {
    breweryDisplayName = "Dancing Gnome";
    beers = await DancingGnome.getDraftList();
  } else if (brewery === "hitchhiker") {
    breweryDisplayName = "Hitchhiker";
    beers = await Hitchhiker.getDraftList();
  } else if (brewery === "east-end") {
    breweryDisplayName = "East End";
    beers = await EastEnd.getDraftList();
  } else if (brewery === "grist-house") {
    breweryDisplayName = "Grist House";
    beers = await GristHouse.getDraftList();
  } else if (brewery === "roundabout") {
    breweryDisplayName = "Roundabout";
    beers = await Roundabout.getDraftList();
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

const pullAllDraftLists = async function pullAllDraftLists() {
  await DancingGnome.pullDraftList();
  await Hitchhiker.pullDraftList();
  await EastEnd.pullDraftList();
  await GristHouse.pullDraftList();
  await Roundabout.pullDraftList();

  // run this on a schedule after startup - every 6 hours
  schedule.scheduleJob("5 */6 * * *", () => {
    pullAllDraftLists();
  });
};
pullAllDraftLists();

// Exports
exports.buildWhatBreweriesResponse = buildWhatBreweriesResponse;
exports.buildOnTapResponse = buildOnTapResponse;
exports.buildAboutBeerResponse = buildAboutBeerResponse;
