const logger = require("../logger");
const puppeteer = require("puppeteer");

const GristHouse = function GristHouseConstructor() {
  this.beerList = [];
};

GristHouse.prototype.getDraftList = function getDraftList() {
  return this.beerList;
};

GristHouse.prototype.pullDraftList = async function getDraftList() {
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
  await page.goto("http://gristhouse.com/tap-list/").catch((error) => logger.error(error));
  console.timeEnd("pagegoto");
  const onTap = await page
    .$$eval(".motopress-text-obj h1", (els) => {
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
  this.beerList = onTap;
  return onTap;
};

module.exports = new GristHouse();
