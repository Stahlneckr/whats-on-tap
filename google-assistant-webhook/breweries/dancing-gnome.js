const puppeteer = require("puppeteer");
const logger = require("../logger");

const DancingGnome = function DancingGnomeConstructor() { };

DancingGnome.prototype.getDraftList = async function getDraftList() {
  const browser = await puppeteer.launch().catch((error) => logger.error(error));
  const page = await browser.newPage().catch((error) => logger.error(error));

  await page.goto("http://www.dancinggnomebeer.com/the-beer/").catch((error) => logger.error(error));

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

  browser.close();

  logger.debug(onTap);
  return onTap;
};

module.exports = new DancingGnome();
