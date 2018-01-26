const logger = require("../logger");
const puppeteer = require("puppeteer");

const Hitchhiker = function HitchhikerConstructor() {
  this.beerList = {
    time: null,
    onTap: [],
  };
};

Hitchhiker.prototype.getDraftList = async function getDraftList() {
  if (this.beerList.time && new Date() - this.beerList.time < 21600000) {
    // every 6 hours
    return this.beerList.onTap;
  }

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

  // browser.close();

  logger.debug(onTap);
  this.beerList.time = new Date();
  this.beerList.onTap = onTap;
  return onTap;
};

module.exports = new Hitchhiker();