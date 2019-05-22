#!/bin/sh

set -e

docker build . -t docker.io/csantanapr/helloworld-go
docker push docker.io/csantanapr/helloworld-go