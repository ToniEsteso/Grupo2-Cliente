#!usr/env/bin bash
docker container stop veganfood_frontend
docker container rm veganfood_frontend
rm -rf ./html/frontend/
mkdir -p ./html/frontend/Grupo2-Cliente
git clone -b develop https://github.com/ToniEsteso/Grupo2-Cliente.git ./html/frontend/Grupo2-Cliente
chmod -R 777 ./html/frontend/
rm -rf ./html/frontend/Grupo2-Cliente/node_modules
npm install --prefix ./html/frontend/Grupo2-Cliente/
npm run build --prefix ./html/frontend/Grupo2-Cliente/
mv ./html/frontend/Grupo2-Cliente/dist/* ./html/frontend/
mv ./html/frontend/Grupo2-Cliente/dist/*.* ./html/frontend/
rm -rf ./html/frontend/Grupo2-Cliente
docker container run -d --name veganfood_frontend -v /opt/veganfood/html/frontend:/usr/local/apache2/htdocs --expose 80 -e VIRTUAL_HOST=www.veganfood.pve2.fpmislata.com -e LETSENCRYPT_HOST=www.veganfood.pve2.fpmislata.com --net "nginx-net" httpd:2.4.41
~
