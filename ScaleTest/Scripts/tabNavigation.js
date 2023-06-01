const delay = require('./delay.js');

const getaurametricservice = require('./getaurametricservice.js');

const navigateToSalesForceTabs = async (page, browser) => {
  //async function navigateToSalesForceTabs(page,browser){
  let tabName = ['Accounts','Leads'];
  //['Accounts', 'Opportunities', 'Contacts', 'Leads','Products'];//['Opportunities','Accounts','Contacts','Leads'];

  for (let title of tabName) {
    let getaurametric_flag = true;
    await tabNavigation(title, page, browser, getaurametric_flag);
    await delay(8000);
    await navigateToDetails(title, page, browser);
    await delay(8000);

  }


}
async function tabNavigation(title, page, browser, getaurametric_flag) {

  const xpathDetail = '//a[@class = "slds-context-bar__label-action dndItem" and @title ="' + title + '" and @href]';
  const element = await page.$x(xpathDetail);

  await element[0].click();
  await delay(10000);
  if (getaurametric_flag) {
    getaurametricservice(page, title);//,testID);
  }

  //await delay(8000);

}

async function navigateToDetails(tabName, page, browser) {


  if (tabName === 'Leads' || tabName === 'Accounts' || tabName === "Products")
    var xpathRecordDetail = "//table[@class = 'slds-table forceRecordLayout slds-table--header-fixed slds-table--edit slds-table--bordered resizable-cols slds-table--resizable-cols uiVirtualDataTable']//a[@data-refid ='recordId']";

  else if (tabName === 'Opportunities' || tabName === 'Contacts')
    var xpathRecordDetail = "//table[@class = 'slds-table forceRecordLayout slds-table--header-fixed slds-table--edit slds-table--bordered resizable-cols slds-table--resizable-cols uiVirtualDataTable']//th//a[@data-refid='recordId']";

  const recordDetails = await page.$x(xpathRecordDetail);

  let count = 0;

  const recordIdList = await page.evaluate((...recordDetails) => {
    return recordDetails.map((e) => e.href);
  }, ...recordDetails);

  //  if (recordIdList.length > 0) { //what happen when zero record avaiable goto else and close (needed?)
  //for (let i = 0; i < 2; i++) {   // if only one record avaiable it will throw error
  for (let list of recordIdList) {

    const recordDetails = await page.$x(xpathRecordDetail);
    await page.goto(list);
    await delay(8000);
    getaurametricservice(page, tabName + 'Details');

    if (count == 0 && recordIdList.length > 1) {
      // let getaurametric_flag = false;
      // await tabNavigation(tabName, page, browser, getaurametric_flag);
      count += 1;
    }
    else
      break;


  }
   //}
  // else if
  // {
      //await browser.close();
  // }
  

}

module.exports = navigateToSalesForceTabs;