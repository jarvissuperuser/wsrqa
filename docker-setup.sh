docker build -t testapp .
docker rm testsetup
docker container run --name testsetup -p 3000:3000 -v=$(pwd)/src:/app testapp npm "install"
docker rm overlord
docker container run --name overlord -p 3000:3000 -v=$(pwd)/src:/app testapp npm "start"
