#!/bin/bash
#
read -p "Enter Project Name to Start[app]:" project
if [ -z $project ] ; then
	project="app"
fi
konsole --separate -e gulp build:release --project=$project
konsole --separate -e gulp watch:release --project=$project
konsole --separate -e gulp serve:release --project=$project
