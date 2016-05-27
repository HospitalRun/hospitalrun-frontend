
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
sudo chown administrator:administrator -R ~/tmp

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

ember build --environment production --output-path prod

ln -s ../frontend/prod public
cd ../server
npm install

sudo npm install -g forever
sudo cp /var/app/server/utils/hospitalrun.conf /etc/init
sudo iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 80 -j REDIRECT --to-port 3000

sudo reboot


#npm install ember-cli-babel --save
#ember build --environment production --output-path prod

