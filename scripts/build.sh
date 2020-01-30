#!/bin/bash
echo building.....
rm -rf ./dist
mkdir ./dist

cp -R ./src/* ./dist/
cp -R ./src/.* ./dist/

node-sass ./dist/assets/scss/main.scss > ./dist/assets/css/main.css

rm -rf dist/assets/scss
rm -rf dist/assets/ts

echo built