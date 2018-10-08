#!/bin/bash
#
read -p "Enter Project Name to Start:" project
gulp_root_path=`pwd`
if [ $project ] ; then
	osascript -e "tell app \"terminal\"
		do script \"cd $gulp_root_path;gulp default_start:release --project=$project;exit\"
	end tell" -e "tell app \"terminal\"
		do script \"cd $gulp_root_path;gulp watch:release --project=$project\"
	end tell" -e "tell app \"terminal\"
		do script \"cd $gulp_root_path;gulp serve:release --project=$project\"
	end tell"
else
    echo ""
fi
