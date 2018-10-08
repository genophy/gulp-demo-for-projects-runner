#!/bin/bash
#
#gnome-terminal --window -e "gulp dev:default"  --tab -e "gulp dev:watch"  --tab -e "gulp dev:serve" --window -e "gulp jsmock" ;
#
read -p "Enter Project Name to Start:" project
gulp_root_path=`pwd`
if [ $project ] ; then
	osascript -e "tell app \"terminal\"
		do script \"cd $gulp_root_path;gulp default_start --project=$project;exit\"
	end tell" -e "tell app \"terminal\"
		do script \"cd $gulp_root_path;gulp watch --project=$project\"
	end tell" -e "tell app \"terminal\"
		do script \"cd $gulp_root_path;gulp serve --project=$project\"
	end tell"  #gulp express --project=$project\"
else
    echo ""
fi
