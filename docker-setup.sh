docker build -t testapp .
docker container run --name overlord -p 3000:3000 -v=$(pwd)/src:/app testapp