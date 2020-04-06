@echo off
:: node -v> nul
:: IF %ERRORLEVEL% NEQ 0 {
::   echo Error: Please install Node.js to use this server.
::   echo To do this download and execute installer from https://nodejs.org/
::   goto pause
:: }
IF EXIST node_modules goto start
call npm i
:start
call npm run-script start
:pause
pause
