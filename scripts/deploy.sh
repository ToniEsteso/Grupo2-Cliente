#!/bin/bash
echo desplegando.....
rm -r C:/xampp/htdocs/Grupo2
mkdir C:/xampp/htdocs/Grupo2

shopt -s dotglob
cp -R ./dist/* C:/xampp/htdocs/Grupo2/
echo desplegado