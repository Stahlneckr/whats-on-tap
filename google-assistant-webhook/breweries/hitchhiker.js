const logger = require("../logger");
const puppeteer = require("puppeteer");

const Hitchhiker = function HitchhikerConstructor() {
  this.beerList = [];
};

Hitchhiker.prototype.getDraftList = function getDraftList() {
  return this.beerList;
};

Hitchhiker.prototype.pullDraftList = async function getDraftList() {
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
  await page.goto("http://hitchhiker.beer/#main").catch((error) => logger.error(error));
  console.timeEnd("pagegoto");
  const onTap = await page
    .$$eval(".tab-pane:last-child .blog-shortcode-post-title.entry-title", (els) => {
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

module.exports = new Hitchhiker();
