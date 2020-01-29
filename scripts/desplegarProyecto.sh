#!usr/env/bin bash
sh desplegarServidor.sh
echo "<---------------Desplegado backend--------------->"
sh desplegarMysql.sh
echo "<---------------Desplegada BD--------------->"
sh desplegarCliente.sh
echo "<---------------Desplegado frontend--------------->"