::Prompt for input
ECHO OFF
SET /P project=Enter Project Name to Start:
IF "%project%" NEQ "" (
    start cmd /k gulp default_start:release --project=%project%
    start cmd /k gulp watch:release --project=%project%
    start cmd /k gulp serve:release --project=%project%
) ELSE (
    ECHO "NO Project Name"
)