sudo container stop veganfood_frontend
sudo container rm veganfood_frontend
sudo rm -rf ./html/frontend
sudo mkdir ./html/frontend
git clone -b develop https://github.com/ToniEsteso/Grupo2-Cliente.git ./html/frontend/
npm run build --prefix ./html/frontend/Grupo2-Cliente/
mv ./html/frontend/Grupo2-Cliente/dist ./html/frontend/
rm -rf ./html/frontend/Grupo2-Cliente
sudo docker container run -d --name veganfood_frontend -v ./html/frontend:/usr/local/apache2/htdocs --expose 80 -e VIRTUAL_HOST=www.veganfood.pve2.fpmislata.com -e LETSENCRYPT_HOST=www.veganfood.pve2.fpmislata.com --net “nginx-net” httpd:2.4.41