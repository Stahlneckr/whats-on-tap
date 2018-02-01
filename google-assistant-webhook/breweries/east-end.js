const logger = require("../logger");
const puppeteer = require("puppeteer");

const EastEnd = function EastEndConstructor() {
  this.beerList = [];
};

EastEnd.prototype.getDraftList = function getDraftList() {
  return this.beerList;
};

EastEnd.prototype.pullDraftList = async function getDraftList() {
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
  await page.goto("http://m.eastendbrewing.com/#/locations/1").catch((error) => logger.error(error));
  console.timeEnd("pagegoto");
  const onTap = await page
    .$$eval("ul.ui-listview:last-child li.ui-btn .ui-btn-inner.ui-li .ui-btn-text a h3.ui-li-heading", (els) => {
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

module.exports = new EastEnd();
