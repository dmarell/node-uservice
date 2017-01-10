# Node.js Micro Service Template with Docker and MongoDB

Using Express 4.0 Router to build an API

Inspired from a [tutorial](http://scotch.io/tutorials/javascript/build-a-restful-api-using-node-and-express-4)

This app demonstrates various features related to continuous delivery

- Environment specific configuration
- Connection to mongodb with mongoose
- Unit and integration tests
- Runtime /version endpoint
- Docker and docker-compose examples
- Jenkins pipeline example deploying to Kubernetes cluster

## Install and run locally

- Make sure you have node, npm and mongodb installed
- Clone the repo: `git clone https://github.com/dmarell/node-uservice.git`
- Build: `npm install`
- Start mongo in a separate terminal window: `mongod`
- Start the server: `npm start`

## Run integration tests

Start Mongo

Start the server:
```
$ npm start
...
Server is up on port 9090
```

Run integration tests:

```
$ npm run test:it
```

## Test the API

Check signs of life:
```
$ curl localhost:9090
{"message":"Welcome to node-uservice API"}
```

```
$ curl localhost:9090/health
{"ok":true}
```

Add a bear:
```
$ curl --data 'name=Bamse' localhost:9090/bears
{"message":"Bear created! name: Bamse"}
```

Read bears:
```
$ curl localhost:9090/bears
[{"_id":"57ce7f864551911e00000001","name":"Bamse","__v":0}]
```
