const logger = require("../logger");
const puppeteer = require("puppeteer");

const Roundabout = function RoundaboutConstructor() {
  this.beerList = [];
};

Roundabout.prototype.getDraftList = function getDraftList() {
  return this.beerList;
};

Roundabout.prototype.pullDraftList = async function getDraftList() {
  console.time("pupstartup");
  const browser = await puppeteer.launch().catch((error) => logger.error(error));
  const page = await browser.newPage().catch((error) => logger.error(error));
  console.timeEnd("pupstartup");

  console.time("pagegoto");
  await page.setRequestInterception(true);
  page.on("request", (request) => {
    if (
      request.resourceType() === "image" ||
      request.resourceType() === "stylesheet" ||
      request.resourceType() === "media" ||
      request.resourceType() === "font"
    )
      request.abort();
    else request.continue();
  });
  await page.goto("http://roundaboutbeer.com/on-tap/").catch((error) => logger.error(error));
  console.timeEnd("pagegoto");
  const onTap = await page
    .$$eval(".entry-content p span,u", (els) => {
      const beers = [];
      // eslint-disable-next-line
      els.some((el) => {
        let text = el.innerText.trim();
        text = text.replace(":", "");
        if (text.toLowerCase().indexOf("bottle") !== -1) {
          return true;
        }
        if (text !== "" && beers.indexOf(text) === -1) {
          beers.push(text);
        }
      });
      beers.shift();
      return beers;
    })
    .catch((error) => logger.error(error));

  browser.close();

  logger.debug(onTap);
  this.beerList = onTap;
  return onTap;
};

module.exports = new Roundabout();
