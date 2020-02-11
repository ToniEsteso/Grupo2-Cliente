#!usr/env/bin bash
echo $1
sh desplegarServidor.sh
echo "<---------------Desplegado backend--------------->"
sh desplegarMysql.sh
echo "<---------------Desplegada BD--------------->"
sh desplegarCliente.sh
echo "<---------------Desplegado frontend--------------->"