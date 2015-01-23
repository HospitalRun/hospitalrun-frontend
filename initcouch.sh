#!/bin/bash
HOST="http://127.0.0.1:5984"
curl -X PUT $HOST/_users/_security -d '{ "admins": { "names": [], "roles": ["admin"]}, "members": { "names": [], "roles": []}}'
curl -X PUT $HOST/config
curl -X PUT $HOST/config/_security -d '{ "admins": { "names": [], "roles": ["admin"]}, "members": { "names": [], "roles": []}}'
curl -X PUT $HOST/main
curl -X PUT $HOST/main/_security -d '{ "admins": { "names": [], "roles": ["admin"]}, "members": { "names": [], "roles": ["user"]}}'
curl -X PUT $HOST/_config/http/authentication_handlers -d '"{couch_httpd_oauth, oauth_authentication_handler}, {couch_httpd_auth, proxy_authentification_handler}, {couch_httpd_auth, cookie_authentication_handler}, {couch_httpd_auth, default_authentication_handler}"'
curl -X PUT $HOST/_config/couch_httpd_oauth/use_users_db -d '"true"'
curl -X PUT $HOST/_config/admins/couchadmin -d '"test"'
SECUREHOST="http://couchadmin:test@127.0.0.1:5984"
curl -X PUT $SECUREHOST/_users/org.couchdb.user:hradmin -d '{"name": "hradmin", "password": "test", "roles": ["System Administrator","admin","user"], "type": "user", "userPrefix": "p1"}'

