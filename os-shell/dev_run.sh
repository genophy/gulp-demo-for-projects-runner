#!/bin/bash
#
#gnome-terminal --window -e "gulp dev:default"  --tab -e "gulp dev:watch"  --tab -e "gulp dev:serve" --window -e "gulp jsmock" ;

#!/bin/bash
#
read -p "Enter Project Name to Start:" project
if [ $project ] ; then
    konsole --separate -e gulp default_start --project=$project
    konsole --separate -e gulp watch --project=$project
    konsole --separate -e gulp serve --project=$project
else
    echo ""
fi