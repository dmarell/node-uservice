# Kubernetes instructions

# Setup in Kubernetes cluster

- Create certificate secrets "tls" in all namespaces (optional)

- Create jenkins job "node-uservice":
    - type: Multibranch Pipeline
    - git repository: https://github.com/dmarell/node-uservice, specify credentials if repo is public
    - Build triggers, Build periodically, Schedule: “* * * * *”

- Reserve IP addresses:
```
$ kubectl get --namespace=node-uservice-stage ingress
NAME              HOSTS     ADDRESS         PORTS     AGE
service-ingress   *         x.x.x.x   80, 443   5d

$ gcloud compute addresses create node-uservice-stage --global --addresses x.x.x.x

$ kubectl get --namespace=node-uservice-prod ingress
NAME              HOSTS     ADDRESS          PORTS     AGE
service-ingress   *         x.x.x.x   80, 443   5d

$ gcloud compute addresses create node-uservice-prod --global --addresses x.x.x.x
```

## Run with integration test environment

First setup port forward from node-uservice-it in Kubernetes to localhost.
```
$ bash port-forward.sh node-uservice-it
Running command kubectl --namespace=node-uservice-it port-forward mongodb-2829542385-9s3kj 27017:27017
Forwarding from 127.0.0.1:27017 -> 27017
Forwarding from [::1]:27017 -> 27017
```

Mongodb is now reachable on localhost:27017

Start the server:
```
$ npm start
...
Server is up on port 8080
```

Run integration tests:

```
$ npm run test:it
```
