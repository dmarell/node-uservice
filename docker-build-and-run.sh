# Use this script in order to start as separate docker containers.
# This file is unused if using docker-compose

# Build docker image
docker build -t node-uservice .

# Stop and remove any previous container
docker rm -f node-uservice && true >& /dev/null

# Create and run the new container
docker run -d -e NODE_ENV='production' --link mongo -p 8081:8080 --name node-uservice node-uservice
