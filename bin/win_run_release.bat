::Prompt for input
ECHO OFF
SET /P project=Enter Project Name to Start[app]:
IF "%project%" == "" (
	SET project="app"
)
start cmd /k gulp build:release --project=%project%
start cmd /k gulp watch:release --project=%project%
start cmd /k gulp serve:release --project=%project%
