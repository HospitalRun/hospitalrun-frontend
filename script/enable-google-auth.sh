#!/bin/bash

URL="localhost"
PORT="5984"

if [ -z "${1}" ] || [ -z "${2}" ]; then
    SECUREHOST="http://couchadmin:test@$URL:$PORT"
else
    SECUREHOST="http://$1:$2@$URL:$PORT"
fi
curl -X PUT $SECUREHOST/config/config_use_google_auth -d '{"value": true}'
