#!usr/env/bin bash
docker container stop veganfood_backend
docker container rm veganfood_backend
rm -rf ./html/backend/
mkdir -p ./html/frontend/Grupo2-Servidor
git clone -b develop https://github.com/ToniEsteso/Grupo2-Servidor.git ./html/frontend/Grupo2-Servidor
chmod -R 777 ./html/backend/
sudo docker container run -d --name veganfood_backend -v /opt/veganfood/html/backend:/var/www/html --expose 80 -e VIRTUAL_HOST=www.api.veganfood.pve2.fpmislata.com -e LETSENCRYPT_HOST=www.api.veganfood.pve2.fpmislata.com --net "nginx-net" httpd:2.4.41
~ php:7.3-apache
docker exec -it veganfood_backend a2enmod rewrite
docker exec -it veganfood_backend docker-php-ext-install pdo pdo_mysql
docker restart veganfood_backend
