sudo service hospitalrun stop
cd /var/app/fronted
git pull
ember build --environment production --output-path prod

cd /var/app/server
git pull

sudo service hospitalrun start
