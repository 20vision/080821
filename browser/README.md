Release new version: 

Delete package-lock.json && node_modules && run npm install
Change "HTTP_SERVER_URL": "https://api.20.vision"
Change Backend password for mysql server

docker build -t gcr.io/vision-346519/frontend:v5 .
(If showing error, fix them and try again)
docker push gcr.io/vision-346519/frontend:v5

-||- gcr.io/vision-346519/http_server:v5