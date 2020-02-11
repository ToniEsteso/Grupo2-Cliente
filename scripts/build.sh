#!/usr/bin/env bash
echo building.....
rm -rf ./dist
mkdir ./dist

shopt -s dotglob
cp -R ./src/* ./dist/
rsync -a ./src/* ./dist

node-sass ./dist/assets/scss/main.scss > ./dist/assets/css/main.css

rm -rf dist/assets/scss
rm -rf dist/assets/ts

echo built
