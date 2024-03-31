#!/bin/bash
rm -Rf dist/*
npm run build:prod
archPath=$(pwd)/dist.tar.gz
echo $archPath
tar -zcvf dist.tar.gz dist
scp $archPath electropunk@garden-8.ru:/home/electropunk/static/oko.garden-8.ru/
ssh electropunk@garden-8.ru 'cd /home/electropunk/static/oko.garden-8.ru && tar -xzvf dist.tar.gz'