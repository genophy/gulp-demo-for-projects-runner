#!/bin/bash
#
read -p "Enter Project Name to Start:" project
if [ $project ] ; then
    konsole --separate -e gulp default_start:release --project=$project
    konsole --separate -e gulp watch:release --project=$project
    konsole --separate -e gulp serve:release --project=$project
else
    echo ""
fi