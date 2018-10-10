::Prompt for input
ECHO OFF
SET /P project=Enter Project Name to Start[app]:
IF "%project%" EQ "" (
	project="app"
)
start cmd /k gulp default_start:release --project=%project%
start cmd /k gulp watch:release --project=%project%
start cmd /k gulp serve:release --project=%project%
