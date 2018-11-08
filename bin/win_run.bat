::Prompt for input
ECHO OFF
SET /P project=Enter Project Name to Start[app]:
IF "%project%" == "" (
	SET project="app"
)
start cmd /k gulp build --project=%project%
start cmd /k gulp watch --project=%project%
start cmd /k gulp serve --project=%project%
