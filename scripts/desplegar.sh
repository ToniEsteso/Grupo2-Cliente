sudo container stop veganfood_frontend
sudo container rm veganfood_frontend
sudo rm -rf /opt/veganfood/html/frontend
sudo mkdir /opt/veganfood/html/frontend
git clone https://github.com/ToniEsteso/Grupo2-Cliente.git
sudo docker container run -d --name veganfood_frontend -v /opt/veganfood/html/frontend:/usr/local/apache2/htdocs --expose 80 -e VIRTUAL_HOST=www.veganfood.pve2.fpmislata.com -e LETSENCRYPT_HOST=www.veganfood.pve2.fpmislata.com --net “nginx-net” httpd:2.4.41