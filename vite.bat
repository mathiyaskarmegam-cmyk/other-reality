@echo off
setlocal
set ELECTRON_RUN_AS_NODE=1
set "NODE_PATH=C:\career\Antigravity IDE\resources\app\node_modules"
"C:\career\Antigravity IDE\Antigravity IDE.exe" "C:\career\Antigravity IDE\resources\app\node_modules\vite\bin\vite.js" %*
endlocal
