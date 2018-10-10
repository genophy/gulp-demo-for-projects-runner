#!/usr/bin/env bash
clear
echo -e "\033[37;42;1m----------------------------------------\033[0m"
echo -e "\033[37;42;1m-----------Generate tool----------------\033[0m"
echo -e "\033[37;42;1m----------------------------------------\033[0m"
echo ""
echo -e "\033[32mgenerate keys:\033[0m"
echo -e "\033[32m- (p)\tproject\033[0m"
echo -e "\033[32m- (*)\tview\033[0m"
echo ""
read -p "Enter generate key(*):" genType
commandStr="gulp generate:"

if [ -z $genType ] ; then
	genType="v"
fi

if [ $genType = "p" ] ; then
	echo -e "\033[32mU choose the [project], will generate it...\033[0m"
	commandStr+="project"
else
	echo -e "\033[32mU choose the [view] , will generate it...\033[0m"
	commandStr+="view"
fi

read -p "Enter projectName [app]:" genProject
if [ -z $genProject ] ; then
	genProject="app"
fi

commandStr+=" --project=$genProject"
echo -e "\033[32mproject name is: $genProject\033[0m"
echo ""
if  [ $genType = "p" ] ; then
	echo -e "\033[33m$commandStr\033[0m"
	eval $commandStr
else
	read -p "Enter viewName:" genView

	if [ -n $genView ] ; then
		commandStr+=" --view=$genView"
		echo -e "\033[32mview name is: $genView\033[0m"
		echo -e "\033[33m$commandStr\033[0m"
		eval $commandStr
	fi
fi
