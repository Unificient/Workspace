const fs = require('fs');
function start() {
    var jsforce = require('jsforce');
    var conn = new jsforce.Connection({
      // you can change loginUrl to connect to sandbox or prerelease env.
      loginUrl : 'https://test.salesforce.com'
    });
    conn.login('admin@uf.team.sb', 'U001*F003@QjnydL9poaNpkgHdoOujyDyd0', function(err, userInfo) {
      if (err) { return console.error(err); }
      // Now you can get the access token and instance URL information.
      // Save them to establish connection next time.
      //console.log(conn.accessToken);
      //console.log(conn.instanceUrl);
      // logged in user property
      //console.log("User ID: " + userInfo.id);
      //console.log("Org ID: " + userInfo.organizationId);
      // ...
      stream(conn)
    });
    }
    function stream(conn){
        conn.streaming.topic("/event/scaleTestCreated__e").subscribe(function(message) {
            let json = JSON.stringify(message);
            fs.writeFile("scaletestevent.txt",json,function(err) {
                if (err) throw err;
                     console.log('updated scaletestevent.txt');
                });
          });
    }
start()