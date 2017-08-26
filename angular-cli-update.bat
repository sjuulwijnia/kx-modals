call npm uninstall -g @angular/cli
call npm cache clean
call npm install -g @angular/cli@latest

call rmdir /S/Q node_modules dist
call npm install --save-dev @angular/cli@latest
call npm install
