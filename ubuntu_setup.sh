
#wget https://github.com/OasisHospital/frontend/raw/master/ubuntu_setup.sh | bash


#sudo apt-get install couchdb -y

#node cleanup
#cd ~
#sudo rm -rf ~/.nvm
#sudo rm -rf ~/.npm
#exit

sudo apt-get remove nodejs -y
sudo ls /etc/apt/sources.list.d
sudo rm -i /etc/apt/sources.list.d/nodesource.list
sudo ls /etc/apt/sources.list.d

sudo apt-get update -y

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

cp server/config-example.js server/config.js  

sed -i 's/COUCH ADMIN USER GOES HERE/hradmin/g' server/config.js
sed -i 's/COUCH ADMIN PASSWORD GOES HERE/test/g' server/config.js

cp server/config.js frontend/server/config.js

cd frontend/

sudo npm install -g ember-cli@0.1.4
sudo npm install -g bower


npm install
bower install
sh initcouch.sh

#ember serve
#ember serve --environment=production

#ember build --environment production --output-path prod

#npm install ember-cli-babel --save
#ember build --environment production --output-path prod

