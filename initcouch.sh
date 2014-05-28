#!/bin/bash
HOST="http://127.0.0.1:5984"
curl -X PUT $HOST/config
curl -X PUT $HOST/main
curl -X PUT $HOST/_config/httpd/enable_cors -d '"true"'
curl -X PUT $HOST/_config/cors/origins -d '"*"'
curl -X PUT $HOST/_config/cors/credentials -d '"true"'
curl -X PUT $HOST/_config/cors/methods -d '"GET, PUT, POST, HEAD, DELETE"'
curl -X PUT $HOST/_config/admins/hradmin -d '"test"'

