const logger = require("../logger");
const puppeteer = require("puppeteer");

const DancingGnome = function DancingGnomeConstructor() {};

// DancingGnome.prototype.getBrowser = async function getBrowser() {
//   this.browser = await puppeteer.launch().catch((error) => logger.error(error));
//   this.page = await this.browser.newPage().catch((error) => logger.error(error));
//   await this.page.setRequestInterception(true);
// };

DancingGnome.prototype.getDraftList = async function getDraftList() {
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
  await page.goto("http://www.dancinggnomebeer.com/the-beer/").catch((error) => logger.error(error));
  console.timeEnd("pagegoto");

  const onTap = await page
    .$$eval(".index-section-wrapper .sqs-block-content h2", (els) => {
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
  return onTap;
};

module.exports = new DancingGnome();
