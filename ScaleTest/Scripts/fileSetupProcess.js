const userDetails = require('./config.json');  //added test_id in config.json and added directly
const readScaleTestJson = require('./scaleTestDetailsJson.json');

// Report is foloder where the json file is saved to after every run//
const intialSetupProcess = function (reportsFolderPath) {
    //Create initial directory for reports
    createDirectoryIfDoesNotExist(reportsFolderPath);
    //
}

/**
 * Create Directory
 * @param {*} dirName
 */
function createDirectoryIfDoesNotExist(dirName) {
    const fs = require("fs");
    if (!fs.existsSync(dirName)) {
        fs.mkdirSync(dirName, { recursive: true });
        console.log("Folder " + dirName + " created.");
    }
}
function intializeInputJsonFileIfItDoesnotExist(jsonFileName) {
    var fs = require("fs");
    //console.log(jsonFileName)
    //data.Metrics.push(metricsdata);
    //https://linuxhint.com/use-array-json-objects-javascript/
    //https://stackoverflow.com/questions/36856232/write-add-data-in-json-file-using-node-js

    //Check if file exists and initialize

    fs.stat(jsonFileName, function (err, stat) {
        if (err == null) {
            console.log("File exists so will append");
        } else if (err.code === "ENOENT") {
            // file does not exist write the default data
            var performanceRunObject = {
                eptmetrics: [],
                startTime: "",
                endTime: "",
                username: "",
                testId: readScaleTestJson.scaleTestName,
                //testId: "",
                filename: userDetails.file_name,
            };
            var jsonInitialData = JSON.stringify(performanceRunObject);
            //Write the default json skeleton to file if the file does not exist
            fs.writeFile(jsonFileName, jsonInitialData, "utf8", function (err) {
                if (err) {
                    console.log(
                        "An error occured while writing JSON Object to File." + err
                    );

                }
                console.log("JSON file has been saved.");
            });
        } else {
            console.log("Some other error: ", err.code);
        }
    });


}

const getMetricsOutputJsonFileName = function () {
    //console.log(test_id)
   // const test_id = userDetails.test_id;

    //return ("./reports/"+test_id+"ept.json");
    return ("./reports/ept.json");

}

module.exports = { intialSetupProcess, intializeInputJsonFileIfItDoesnotExist, getMetricsOutputJsonFileName }  