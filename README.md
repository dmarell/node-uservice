# Node micro service template

Using Express 4.0 Router to build an API

Inspired from a [tutorial](http://scotch.io/tutorials/javascript/build-a-restful-api-using-node-and-express-4)

## Requirements

- Node and npm
- Docker and docker-compose

## Install and run locally without Docker

- Clone the repo: `git clone https://github.com/dmarell/node-microservice.git`
- Build: `npm install`
- Start mongo in a separate terminal window: `mongod`
- Start the server: `npm start`

## Test the API

Add a bear:
```
$ curl --data 'name=Bamse' http://localhost:8080/api/bears
{"message":"Bear created! name: Bamse"}
```

Read bears:
```
$ curl http://192.168.99.100:8081/api/bears
[{"_id":"57ce7f864551911e00000001","name":"Bamse","__v":0}]
```

## Run with Docker

Start mongo:
```
$ docker rm -f mongo && true >& /dev/null
$ docker run --name mongo -d mongo
```

```
$ npm install
$ bash docker-build-and-run.sh
$ docker-machine ip default
192.168.99.100
$ curl http://192.168.99.100:8081/api
```

## Run with docker-compose

```
$ docker-compose build
$ docker-compose up -d
Starting nodeapi_mongo-data_1
Starting nodeapi_mongo_1
Starting nodeapi_server_1
```

Verify like above: `curl http://192.168.99.100:8081/api`

View logs:

```
$ docker-compose logs -f
[lots of output]
```
