cd server 
cd public 
cd static 
cd css 
del *.*
cd ..
cd js 
cd *.*
call up 4
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