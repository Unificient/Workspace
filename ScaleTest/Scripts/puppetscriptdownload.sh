#!/usr/bin/env bash
## to run ./puppetscriptdownload.sh SCRIPTID
## INPUT: Script ID on the commandline. Script ID is in Salesforce files.
##Output: puppetscripts.zip in current folder
##ToDO: Use variables for userID, secrets and passwords. Store them elsewhere.


SCRIPTID=$1
ScriptName=`cat ./scaleTestDetailsJson.json | jq -r '.scriptName'`
#$ cat scaleTestDetailsJson.json
#$ grep '.scriptName' scaleTestDetailsJson.json | sed -r 's/^[^:]*:(.*)$/\1/'
echo $ScriptName

token=`curl https://test.salesforce.com/services/oauth2/token -d "grant_type=password" -d "client_id=3MVG9dCCPs.KiE4Qix33G4Q6jruXvPcotT.ZnmvT26nEUap.sk5.4q9U2tiWs4Aqbn8vYovzVqSs8Pnto4RkT" -d "client_secret=CFBB7DDF2177999D3731709736D445290D50828607C16D01DE2513F9C243E6DA" -d "username=admin@uf.team.sb" -d "password=U001*F003@QjnydL9poaNpkgHdoOujyDyd0"`
sessionID=`echo $token | awk -F":" '{ print $2 }' | awk -F"," '{print $1}' | sed -e 's/^"//' -e 's/"$//'`
echo $sessionID
echo $SCRIPTID
#echo $scriptName
curl 'https://unificient--sgdev.sandbox.my.salesforce.com/services/data/v57.0/connect/files/069Db0000027sxfIAA/content' -H "Authorization: Bearer $sessionID" -H "Content-Type: application/tar+gzip" -o puppetscripts.zip
