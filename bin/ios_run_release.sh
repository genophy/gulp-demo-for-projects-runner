#!/bin/bash
#
read -p "Enter Project Name to Start[app]:" project
gulp_root_path=`pwd`
if [ -z $project ] ; then
	project="app"
fi

osascript -e "tell app \"terminal\"
	do script \"cd $gulp_root_path;gulp build:release --project=$project;exit\"
end tell" -e "tell app \"terminal\"
	do script \"cd $gulp_root_path;gulp watch:release --project=$project\"
end tell" -e "tell app \"terminal\"
	do script \"cd $gulp_root_path;gulp serve:release --project=$project\"
end tell"
