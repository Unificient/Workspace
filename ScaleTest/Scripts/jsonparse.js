var fs = require('fs')
fs.readFile("scaletestevent.txt",'utf8',function(error,data) {
    if (error) { 
        console.log('error reading scaletestevent.txt');
        return;
    } 
    if (data) {
        var j = JSON.parse(data)
        console.log(j['payload']['testID__c'])
        }
    })
