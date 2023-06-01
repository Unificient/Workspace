#!/usr/bin/env bash
## to run ./unzippuppetscriptdownload.sh 
#SCALETEST=$1
#echo $SCALETEST
#DATETIME=$(date "+%Y.%m.%d")
#MAIN_DIR="/home/swapna/Development/LinuxData/Development/testrunner/"
#OUTPUT_DIR="$MAIN_DIR$DATETIME$SCALETEST"
#echo $OUTPUT_DIR
#if [ -d "$OUTPUT_DIR" ]; then 
#	echo "DIR exits";
#	rm -vr  $OUTPUT_DIR;
#        #mkdir -p  $OUTPUT_DIR;
#else   
#       	echo "Making new directory"
#        mkdir -p $OUTPUT_DIR	
	#exit
#fi	

unzip -j -d  $OUTPUT_DIR/ puppeteerAndNodeScripts.zip  -x "node_modules"
#echo 'Unzipping Done'
#echo $SCRIPTID

