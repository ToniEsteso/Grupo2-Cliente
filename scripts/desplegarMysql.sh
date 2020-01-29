#!usr/env/bin bash
docker container stop veganfood_mysql
docker container rm veganfood_mysql
rm -rf ./mysql
mkdir -p ./mysql
docker container run -d -v /opt/veganfood/mysql:/var/lib/mysql -e MYSQL_ROOT_PASSWORD=root -e MYSQL_DATABASE=veganfood -e MYSQL_USER=veganfood -e MYSQL_PASSWORD=veganfood -p 10300:3306 --name veganfood_mysql mariadb:10.1
echo "<---------------Contenedor creado--------------->"
while ! nc -z 192.168.59.104 10300; do
        sleep 0.1
done
docker exec -i veganfood_mysql sh -c 'exec mysql -uroot -p"root"' < ./html/backend/Grupo2-Servidor/sql/veganfood.sql
echo "<---------------Datos insertados--------------->"