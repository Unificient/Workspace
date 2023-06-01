const process = require('process');
var path = require('path');
const createDir = require('./fileSetupProcess.js');
const dirName = 'debugLogDownload';

at = null
inst = null
const createTraceFlagOrDownloadLogs = process.argv[2];
var startTime = new Date(new Date().toUTCString());
{ if (!createTraceFlagOrDownloadLogs) throw "Please provide a parameter "; }

function login() {
  var readConfig = require("./config.json");
  var user = readConfig.username;
  var passd = readConfig.password;
    var sf = require('node-salesforce');
    var conn = new sf.Connection({ loginUrl: readConfig.url })
    conn.login(user,passd,function(){ 
         
        enableTraceFlagAndDowloadLogs(conn,createDir,dirName)
     
    })

}
// Calculate start and end timestamp to enable and download debug logs 

function addMinutesToTimeStamp(minutes) {
      const readscaleTestJson = require("./scaleTestDetailsJson.json")
      var startTime = readscaleTestJson.debugLogStartTime;
      var experiationTime = new Date(new Date().toUTCString());
      experiationTime.setMinutes(experiationTime.getMinutes() + minutes);
      return { startTime, experiationTime };
}
// Enable debug log in an Org

function createDebug(t,i) {
        var getStartEndTime = addMinutesToTimeStamp(15);
        console.log(getStartEndTime.startTime,getStartEndTime.experiationTime);
        inst = i.split('://')[1]
        console.log(i.split('://')[1], t);
        console.log(inst)
        const http = require('https');
        const body = {"ApexCode":"WARN",
        "ApexProfiling":"NONE",
        "LogType":"USER_DEBUG",
        "TracedEntityId":"0056g000002xSPGAA2",
        "StartDate" : getStartEndTime.startTime,
        "Validation":"NONE",
        "DATABASE":"WARN",
        "CALLOUT":"WARN",
        "ExpirationDate" :getStartEndTime.experiationTime,
        "DebugLevelId":"7dl6g000000Ll8eAAC"
        }
    const options = {
        hostname: inst,
        path:'/services/data/v56.0/tooling/sobjects/TraceFlag/',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + t
        }
      };
      var req = http.request(options, function(res) {
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            console.log('Response from createDebug: ' + chunk);
        });
      });
      req.write(JSON.stringify(body))
      req.end()
      //httpReq(httpin,options,options.method,body)
    }
    function httpReq(httpin,options) {
        var fulldata = []
        const req = httpin.request(options, (res) => {
          res.setEncoding('utf8');
          res.on('data', (chunk) => {
            //console.log(`BODY: ${chunk}`);
            if (res.statusCode==200) {
             
                fulldata.push(chunk)
              
            }
          });
          res.on('end', () => {
            console.log('No more data in response.',res.statusCode);
           
              processResponse(fulldata)
            
             
          });
        });
        req.on('error', (e) => {
          console.error(`problem with request: ${e.message}`);
        });
        // If Method is POST, Write data to request body
        if (options.method == 'POST') {
            req.write(JSON.stringify(body));
        }
        req.end();
    }
    function processResponse(body) {
      const logs = JSON.parse(body.join(''))
      logslist = logs['records'] 
      downloadLogs(logslist)
    }
    function getLogList(t,i){
       var getStartEndTime = addMinutesToTimeStamp(10);
       
        at = t
        inst = i.split('://')[1]
        const httpin = require('https');
        //const qryStr = '/tooling/query/?q=Select+Id,+LastModifiedDate+From+TraceFlag+Where+DebugLevel.developerName=' + '\'' + Constants.DEVELOPER_NAME + '\''
        //const loglist = '/tooling/query/?q=Select+Id,+Operation,+StartTime+From+ApexLog+where+ StartTime+>=+' + startTime + '+AND+StartTime+<=+' + endTime + '+AND+' + 'LogUser.Id=\'' 
        //+ Constants.USER_ID + '\'+LIMIT+' + Integer.valueOf(Constants.LOG_QUERY_LIMIT);
        var startTime =    getStartEndTime.startTime	
        var endTime =      getStartEndTime.experiationTime; //'2023-03-09T00:08:00.000z'    
        var loglist = '/services/data/v56.0/tooling/query/?q=Select+Id,Operation,StartTime+From+ApexLog+where+StartTime>='+ startTime +'+AND+StartTime+<=+' + endTime.toISOString()
        console.log(loglist);
        const options = {
          hostname: inst,
          path:loglist,
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + at
          }
        }
        httpReq(httpin,options)
        /*var fulldata = []
        var req = http.request(options, function(res) {
          res.setEncoding('utf8');
          res.on('data', function (chunk) {
              console.log('Response: ' + chunk);
              fulldata.push(chunk)
              })
          
          res.on('end', () => {
            console.log('No more data in response.',res.statusCode);
            
              processResponse(fulldata)
          })
          });*/
      }
      function downloadLogs(loglist) {
        if (loglist.length > 0) {
          loglist.forEach(function(name) {
            var filepath = name['attributes']['url']
            //filepath = "/services/data/v56.0/tooling/sobjects/ApexLog/7tfDb0000040sP0IAI"
            var dest = filepath.split('ApexLog/')[1] + '.log'
            //console.log('Dest',dirName);
            var url = 'https://'+inst + filepath + '/Body'
            download(url,path.join(dirName, dest));
      
          })
        }
      }
      var download = function(url, dest){
          //console.log('getting', url)
          var http = require('https');
          var fs = require('fs')
          const options = {
            //hostname: inst,
            //path:loglist,
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + at
            }
          }
          var file = fs.createWriteStream(dest);
          http.get(url, options, function(response) {
            response.pipe(file);
            file.on('finish', function() {
              file.close();
            });
        });
      };


/**
 * Main Function that triggers 
 */
function enableTraceFlagAndDowloadLogs(conn,createDir,dirName) {
  //check for the command line parameter 
  //var conn = login();
  console.log("DirName:", dirName);
  if(createTraceFlagOrDownloadLogs === 'Enable')
  {
   createDebug(conn.accessToken, conn.instanceUrl);
  }
  else if (createTraceFlagOrDownloadLogs === 'Download')
  {
    console.log("My dirpath: ",dirName);
    createDir.intialSetupProcess(dirName);
    getLogList(conn.accessToken, conn.instanceUrl);
    downloadLogs(loglist);

  }
  
}
login();

/*/services/data/v56.0/tooling/sobjects/TraceFlag/
{"ApexCode":"WARN",
"ApexProfiling":"NONE",
"LogType":"USER_DEBUG",
"TracedEntityId":"005j0000000cmBTAAY",
"Validation":"NONE",
"DATABASE":"WARN",
"CALLOUT":"WARN",
"DebugLevelId":"7dl7y0000000PsrAAE"
}*/