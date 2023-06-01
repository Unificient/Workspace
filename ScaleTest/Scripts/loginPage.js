const puppeteer = require('puppeteer');

const delay = require('./delay.js');
const navigateToSalesForceTabs = require('./tabNavigation.js');
const getaurametricservice = require('./getaurametricservice.js');
const userDetails = require('./config.json');

const loginPage = async () => {

    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: false,
    });
    const page = await browser.newPage();

    await page.goto(userDetails.url);

    await page.type("#username", userDetails.username);
    await page.type("#password", userDetails.password);

    await page.click('input[id= "Login"]');

    await delay(20000);
    getaurametricservice(page, 'HomePage');

    navigateToSalesForceTabs(page, browser);

    //await browser.close();

}

module.exports = loginPage;