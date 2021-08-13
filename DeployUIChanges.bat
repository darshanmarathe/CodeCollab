cd client 
call npm run build 
cd ..
cd server
start npm run start
pause
cd ..
git add .
git commit -m %1 
git push