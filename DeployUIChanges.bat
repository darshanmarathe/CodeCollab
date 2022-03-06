cd client 
call npx browserslist@latest --update-db
call npm run build 
cd ..
cd server
start npm run start
pause
cd ..
git add .
git commit -m %1
git push