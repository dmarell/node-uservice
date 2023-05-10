# Docker instructions

## Run with Docker

Start mongo:
```
$ (docker rm -f mongo || true) >& /dev/null
$ docker run --name mongo -d mongo
```

```
$ npm install
$ bash docker-build-and-run.sh
$ curl http://localhost:8081/api
```

## Run with docker-compose

```
$ docker-compose build
$ docker-compose up -d
Starting nodeuservice_mongo-data_1
Starting nodeuservice_mongo_1
Starting nodeuservice_server_1
```

Verify like above: `curl http://localhost:8081/api`

View logs:

```
$ docker-compose logs -f
[lots of output]
```

