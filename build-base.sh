#!/usr/bin/env bash

docker build -t="bowlingx/java-base" docker/base/.

docker build -t="bowlingx/play-webpack-example-nginx" docker/nginx/.
