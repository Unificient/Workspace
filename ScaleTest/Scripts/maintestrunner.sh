
## **** Main Script *****
##Script to execute the following steps in the eXpress testing process
#Python parsejson.py reads scaletestevent.txt to get the last streaming API event
##Read the ScaleTestId
##Nodejs script to download all the details of scaletest into a scaletextdetails.txt file using REST API
##--Downloads scripts.zip file and scaletestID and scaleprojectID
##nodejs script to enable a traceflag(debug log), passes in parameters such as userID, scaletestID, scaleprojectID etc
##--check if debug log is successful
##nodejs script to execute pupeteer script to run test
##--Check if eptjson is created
##nodejs script to download debug logs, clear traceflags
##Python script to parse debug logs into debuglog.json
##--Check if debuglog.json is created
##Nodejs script to post ept.json and debuglog.json to Platform cache.

##*** --This script: add names of the nodejs and python scripts into the platholders provided below -- ***###

#!/usr/bin/env bash
##PATH settings
#set FILENAME="07L07LDb00000Hz7VIMAZ.log" #Filename for debuglog parsing 
T=5 # Step Sleep seconds
T1=25 # Outer loop sleep
DEBUGVALUE="Enable" #Input to debug log
DEBUGDOWNLOAD="Download" #Input to download debug logs
REPORTDIRNAME="./reports"  #Input to put to delete the reports folder
DEBUGLOGDIRNAME="./debugLogDownload" #Input to delete the debug log folder
DATETIME=$(date "+%Y.%m.%d") #Date to append to the folder 
MAIN_DIR="/home/swapna/Development/LinuxData/Development/testrunner/" #File path
FILENAME="07LDb00000Hz7VIMAZ.log" #Input to parse the debuglog to json
PYTHON=`which python3`
if [ $? -eq 1 ]
    then
        echo "Python not found, exiting"
        exit
    fi
NODEJS=`which node`
if [ $? -eq 1 ]
    then
        echo "Node not found, exiting"
        exit
    fi
##PALCEHOLDERS###
##### Names of scripts with arguments -- these are the placeholders
SAPIJSON="parsejson.py" ##Returns ScaleTestID ST-00XX"
#SETUPDIRECTORY="createDirectory.sh" ##This will create the directory structor required for test
#="getScaleTestDetails.js"         ##input parameters - scaleTestID - ST-00XX. Output scaleTestJson.json
DOWNLOADST="./puppetscriptdownload.sh"   ## 
UNZIPDOWNLOADST="./unzippuppetscript.sh" ##input Parameters - scaleTestID - ST-00XX. Output scaletestdetails.txt
SCALETESTDETAILS="getScaleTestDetails.js"         ##input parameters - scaleTestID - ST-00XX. Output scaleTestJson.json
DEBUGLOGCREATE="debug.js"      ##Input userID from scaletestdetails.txt if it exists. Else EXIT
PUPPETEER="index.js"           ##Scriptname, number of iterations, ScaletestID, scaleprojectID(optional). Output ept.JSON
GETDEBUGLOG="debug.js"             ##Check if ept.JSON exists.
PARSEDEBUGLOG="debuglog_main.py"          ##ScaletestID, scaleprojectID(optional) to be written to debuglog.JSON
SENDTOCACHE="readJsonPutInCache.js"             ##use ScaletestID as key. Input debuglog.JSON, ept.json


while true; ##Continious loop waiting for new scaletests 
do 
    TESTID=`$NODEJS jsonparse.js`; 
    if [ $? -eq 1 ]
    then
        echo "Parsing Streaming API event failed"
        exit
    fi
    if [ ! -z $TESTID ] 
    then
            sleep $T;
            echo "ScaleTestID is" $TESTID
            echo "Starting REST API script to query and download";
            $DOWNLOADST $TESTID;
            if [ $? -eq 1 ]
            then
                echo "Downloading using REST API failed";
                exit
	    fi
	    sleep $T;
        ##CreateDir##
        echo "Check if folder name exsit";
        ##Name of the folder to be created##
        OUTPUT_DIR="$MAIN_DIR$DATETIME$TESTID";
        echo $OUTPUT_DIR;
        rm -vrf  $REPORTDIRNAME $DEBUGLOGDIRNAME;
        if [ -d "$OUTPUT_DIR" ]; then 
        echo "Directory exits, delete and create a new one";
        rm -vr  $OUTPUT_DIR;
        mkdir -p  $OUTPUT_DIR;
        else   
            echo "Create new directory"
            mkdir -p $OUTPUT_DIR	
        #exit
        fi	
        sleep $T;
	    echo "Starting unzipping of puppetscripts.zip";
	    unzip -j  puppetscripts.zip  -d $OUTPUT_DIR
        #$UNZIPDOWNLOADST $TESTID
	    if [$? -eq 1]
           then
                echo"Unzipping failed";
                exit	
	    fi

	    sleep $T;

	    echo "Starting node- to get scaletest details from a new  ST record";
        $NODEJS $OUTPUT_DIR/$SCALETESTDETAILS $TESTID $OUTPUT_DIR;
	    if [$? -eq 1]
	    then 
	        echo"JSON file create failed  with scaletest details";	    
	        exit

	    fi
	    
            sleep $T;
            echo "Starting REST API script create debug log";
	        echo "${DEBUGVALUE}";
            $NODEJS $OUTPUT_DIR/$DEBUGLOGCREATE "${DEBUGVALUE}";
            if [ $? -eq 1 ]
            then
                echo "Debug log create event failed";
                exit
            fi
            sleep $T;
            echo "Starting Puppeteer script execution";
           $NODEJS  $OUTPUT_DIR/$PUPPETEER $TESTID $OUTPUT_DIR;
            if [ $? -eq 1 ]
            then
                echo "Puppeteer script event failed"
                exit
            fi
            sleep $T;
	    echo "${DEBUGDOWNLOAD}";
            echo "Starting download debug logs";
            $NODEJS $OUTPUT_DIR/$GETDEBUGLOG "${DEBUGDOWNLOAD}" $OUTPUT_DIR ;
            if [ $? -eq 1 ]

                then
                echo "Download debug logs failed"
                #exit
            fi
            sleep $T;
            echo "Starting parse debug logs";
            $PYTHON $OUTPUT_DIR/$PARSEDEBUGLOG $TESTID $FILENAME 
            if [ $? -eq 1 ]
            then
                echo "Parsing of  debug logs failed"
                #exit
	    fi
            sleep $T;
            echo "Starting send JSON to cache";
            $NODEJS $OUTPUT_DIR/$SENDTOCACHE  $TESTID  $DIRNAME 
            if [ $? -eq 1 ]
            then
                echo "Sending to cache failed"
                #exit
            fi
            echo "Writing to log of tests completed"
            echo `date` $TESTID >> scaletestlog.log
            echo "Clearing event file"
            truncate -s 0 scaletestevent.txt 
    fi
    echo "Process completed"
    sleep $T1
    
done

