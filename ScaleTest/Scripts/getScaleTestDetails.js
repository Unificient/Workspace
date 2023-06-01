 function loginSF() {
    //TODO:  later use the env to get the username and password
      var readConfig = require("./config.json");
      var username = readConfig.username;
      var password = readConfig.password;
      const args = process.argv;
      console.log(args);
      const sTName = args[2];
      const jsonFilePath = args[3]+"/scaleTestDetailsJson.json";
      var fs = require('fs');
      var sf = require("node-salesforce");
      var conn = new sf.Connection({ loginUrl: readConfig.url });
  
    conn.login(username, password, (err, userInfo) => {
      if (err) {
        return console.error(err);
      }
     
      queryScaleTestObject(conn,sTName);  
    }
    )
  function queryScaleTestObject(conn,sTName)
  {

      let records = [];
      
      conn.query("SELECT ID,Name, testdatetime__c,testduration__c,userload__c, scaleproject__c,CreatedById,scaleproject__r.Name,scaleproject__r.scriptname__c,scaleproject__r.Account__c from scaletest__c where Name ='"+sTName+"'", function(err, result) {
      if (err) { return console.error(err); }
      //console.log('ScaleName:'+result.records[0].scaleproject__r.Name);
      for(var i=0; i<result.records.length; i++)
      {
        var record = result.records[i];
        var timeStamp = new Date(new Date().toUTCString());
        var scaleTestDetails = {
             scaleTestName : record.Name,
             userID : record.CreatedById,
             testDateTime :record.testdatetime__c,
             noOfUsers: record.userload__c,
             projectName :record.scaleproject__r.Name,
             scriptID :record.scaleproject__c,
             scriptName :record.scaleproject__r.scriptname__c,
             accoundId :record.scaleproject__r.Account__c,
             debugLogStartTime : timeStamp
 
        };
 
        console.log(scaleTestDetails);
        var scaleTestJsonEelement =   JSON.stringify(scaleTestDetails);
        fs.writeFileSync(jsonFilePath,scaleTestJsonEelement);
        console.log("Scale test details written to file scaleTestDetailsJson");
           //console.log("scaleTestID " +record.Name,record.Id,record.CreatedById,record.testdatetime__c,record.scaleproject__c);
       }
    });
    jsonFilePath
      for(var i=0; i<results.length; i++)
     {
       var record = records[i];
       console.log("ScaleTest" +records[i]);
       console.log(scaleTestDetails);
      
      }
      const recordLength  = records.length;

      return recordLength;
  
    }
    
}
    loginSF();
 