#!/bin/bash
git fetch
git merge origin/master
docker-compose \
    --file docker-compose-prd.yml\
    --project-name TARO\
    build
docker-compose \
    --file docker-compose-prd.yml\
    --project-name TARO\
    kill
docker-compose \
    --file docker-compose-prd.yml\
    --project-name TARO\
    up -d
