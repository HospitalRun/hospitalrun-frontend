sudo apt-get install couchdb -y

#node cleanup
cd ~
sudo rm -rf ~/.nvm
sudo rm -rf ~/.npm
exit

sudo apt-get remove nodejs
sudo ls /etc/apt/sources.list.d
sudo rm -i /etc/apt/sources.list.d/nodesource.list
sudo ls /etc/apt/sources.list.d

sudo apt-get update

sudo apt-get install nodejs
sudo apt-get install npm
sudo ln -s /usr/bin/nodejs /usr/bin/node


# OasisHospital Inident Managemnt
cd /var
sudo mkdir app
sudo chown administrator:administrator app
cd app/
sudo apt-get install git
git clone https://github.com/OasisHospital/frontend.git
git clone https://github.com/OasisHospital/server.git

cp server/config-example.js frontend/server/config.js

cd frontend/

sudo npm install -g ember-cli@0.1.4
sudo npm install -g bower




#161  ember serve --environment=production
  

npm install
bower install
sh initcouch.sh

ember serve

 

ember serve
ember build --environment production --output-path prod

#npm install ember-cli-babel --save
#ember build --environment production --output-path prod

