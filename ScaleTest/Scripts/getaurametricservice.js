const jsonFile = require('./fileSetupProcess.js');
const readScaleTestJson = require('./scaleTestDetailsJson.json');

const getaurametricservice = async  (page, tabName) => {
  const ept = await page.evaluate(
    "aura.metricsService.getCurrentPageTransaction().config.context.ept"
  );
  const prevoiusPage = await page.evaluate(
    "aura.metricsService.getCurrentPageTransaction().config.context.previousPage"
  );
  const network = await page.evaluate(
    "aura.metricsService.getCurrentPageTransaction().config.context.attributes.network"
  );
  const defaultCmp = await page.evaluate(
    "aura.metricsService.getCurrentPageTransaction().config.context.attributes.defaultCmp"
  );
  //console.log('mts in Detail Page:',tabName,ept,network,prevoiusPage,defaultCmp);

  // const output = await page.evaluate(
  //  "aura.metricsService.getCurrentPageTransaction().config"
  //);
  //console.log(output);
  //helperJson(tabName, ept, network, prevoiusPage, defaultCmp);
  var metricsOutputFileName = jsonFile.getMetricsOutputJsonFileName();
  writeEptMetricsToJsonFile(metricsOutputFileName,tabName, ept, network, prevoiusPage, defaultCmp);  
  //return(tabName,ept,network,prevoiusPage,defaultCmp);
}


function writeEptMetricsToJsonFile(jsonFileName,tabName, ept, network, prevoiusPage, defaultCmp,testID) {
  
  var PageTitle = tabName;
  var EPT = ept;
  var metricsdata = {
    name: PageTitle,
    TestId: readScaleTestJson.scaleTestName,
    rt: EPT,
    network: network,
    prevoiusPage: prevoiusPage,
    DefaultComponent: defaultCmp,
  };
  
  appendToJsonFileAsElement(metricsdata, jsonFileName);

}

/**
 *
 * @param {*} jsonElementData This is used for
 * @param {*} jsonFileName JSON File Name
 */
function appendToJsonFileAsElement(jsonElementData, jsonFileName) {
  var fs = require("fs");
  //data.Metrics.push(metricsdata);
  //https://linuxhint.com/use-array-json-objects-javascript/
  //https://stackoverflow.com/questions/36856232/write-add-data-in-json-file-using-node-js

  
  //Read the json File and append to json object
  fs.readFile(jsonFileName, "utf8", function readFileCallback(err, data) {
    if (err) {
      console.log(err);
    } else {
      var objReadFromFile = JSON.parse(data); //now it an object
      objReadFromFile.eptmetrics.push(jsonElementData); //add some data
      var appendedJsonMetricsData = JSON.stringify(objReadFromFile, null, 2); //convert it back to json
      fs.writeFile(
        jsonFileName,
        appendedJsonMetricsData,
        "utf8",
        function (err) {
          if (err) return console.log(err);
          console.log(
            "File Appended with jsonElementData:\n" +
              JSON.stringify(jsonElementData)
          );
        }
      ); // write it back
    }
  });
}

module.exports = getaurametricservice;