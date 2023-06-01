function loginSF() {
  //console.log("In cache node js");
  var readConfig = require("./config.json");
  var username = readConfig.username;
  var password = readConfig.password;
  const sTName = process.argv[2];
  const directoryName = process.argv[3];
  var fileName = readConfig.file_name_EPT;
  console.log(sTName, directoryName,fileName);
  // const data = rDir.readFilesFromDirectory();

  var fs = require("fs");
  var sf = require("node-salesforce");
  var conn = new sf.Connection({ loginUrl: readConfig.url });

  conn.login(username, password, (err, userInfo) => {
    if (err) {
      return console.error(err);
    }
   
    const accessToken = conn.accessToken;
    const instanceUrl = conn.instanceUrl;
    

    try {

      readFileList(directoryName);
     // console.log('DirName:',directoryName);
        
      } 
    
    catch (err) {
      console.error(err);
    }
   
   } );

   function readFileList(dirName)
{     
      fs.readdir(dirName, function(err, Files){

         if(err)
         {
            console.log('Error:',err);
         }
         else
         {
            Files.forEach(function(file){
            
               console.log('fileName:', dirName+'/'+file);
               const fileName =  dirName+'/'+file;
            fs.readFile(fileName, function(err,data)
            {
               if(err)
               {
                  console.log('FileError:', err)
               }
               else{

                  const jsondata = JSON.parse(data);
                  conn.apex.post(
                      "/services/apexrest/UXMetrics/",jsondata, function(err, res)
                      {
                        if(err)
                        {
                          console.log(err);
                        }
                        console.log("response: ", JSON.stringify(res));
                      })
               }
            }
            )   
           

         });

         }
      }
      
      );
}

}

loginSF();
