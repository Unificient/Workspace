//main script to run
const loginPage = require('./loginPage.js');

const fileSetup = require('./fileSetupProcess.js');


function generatePerformanceMetricsForSalesForce() {
  //Initialize Folder and File Setup
  fileSetup.intialSetupProcess("./reports"); // This called to create the folder structure to put the  eptmetrics json ----//
  fileSetup.intializeInputJsonFileIfItDoesnotExist(fileSetup.getMetricsOutputJsonFileName());
  //Call the Login Process
  loginPage();
}

generatePerformanceMetricsForSalesForce();